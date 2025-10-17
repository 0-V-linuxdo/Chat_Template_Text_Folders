/* -------------------------------------------------------------------------- *
 * Module 06 · Domain-specific style configuration & runtime helpers
 * -------------------------------------------------------------------------- */

    // Domain style helpers shared across modules --------------------------------

    const clampBarSpacingValue = (value, fallback = 0) => {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return Math.max(-200, Math.min(200, parsed));
        }
        const fallbackParsed = Number(fallback);
        if (Number.isFinite(fallbackParsed)) {
            return Math.max(-200, Math.min(200, fallbackParsed));
        }
        return 0;
    };

    const applyBarBottomSpacing = (container, spacing, fallbackSpacing = 0) => {
        if (!container) return 0;
        const desiredSpacing = clampBarSpacingValue(spacing, fallbackSpacing);
        const paddingY = Number(container.dataset.barPaddingY) || 0;
        const adjustedBottom = desiredSpacing - paddingY;
        container.style.transform = 'translateY(0)';
        container.style.bottom = `${adjustedBottom}px`;
        container.dataset.barBottomSpacing = String(desiredSpacing);
        return desiredSpacing;
    };

    // 根据目标高度调整底部按钮栏的布局和内部按钮尺寸
    updateButtonBarLayout = (container, targetHeight) => {
        if (!container) return;
        const numericHeight = Number(targetHeight);
        if (!Number.isFinite(numericHeight) || numericHeight <= 0) return;

        const barHeight = Math.max(32, Math.round(numericHeight));
        const scale = Math.max(0.6, Math.min(2.5, barHeight / 40));

        const paddingYBase = Math.round(6 * scale);
        const paddingYMax = Math.max(4, Math.floor((barHeight - 24) / 2));
        const paddingY = Math.min(Math.max(4, Math.min(20, paddingYBase)), paddingYMax);
        const paddingX = Math.max(12, Math.min(48, Math.round(15 * scale)));
        const gapSize = Math.max(6, Math.min(28, Math.round(10 * scale)));

        container.style.padding = `${paddingY}px ${paddingX}px`;
        container.style.gap = `${gapSize}px`;

        const innerHeight = Math.max(20, barHeight - paddingY * 2);
        const fontSize = Math.max(12, Math.min(22, Math.round(14 * scale)));
        let verticalPadding = Math.max(4, Math.min(18, Math.round(6 * scale)));
        const maxVerticalPadding = Math.max(4, Math.floor((innerHeight - fontSize) / 2));
        if (verticalPadding > maxVerticalPadding) {
            verticalPadding = Math.max(4, maxVerticalPadding);
        }
        const horizontalPadding = Math.max(12, Math.min(56, Math.round(12 * scale)));
        const borderRadius = Math.max(4, Math.min(20, Math.round(4 * scale)));
        const lineHeight = Math.max(fontSize + 2, innerHeight - verticalPadding * 2);

        const buttons = Array.from(container.children).filter(node => node.tagName === 'BUTTON');
        buttons.forEach(btn => {
            btn.style.minHeight = `${innerHeight}px`;
            btn.style.height = `${innerHeight}px`;
            btn.style.padding = `${verticalPadding}px ${horizontalPadding}px`;
            btn.style.fontSize = `${fontSize}px`;
            btn.style.borderRadius = `${borderRadius}px`;
            btn.style.lineHeight = `${lineHeight}px`;
            if (!btn.style.display) btn.style.display = 'inline-flex';
            if (!btn.style.alignItems) btn.style.alignItems = 'center';
        });

        container.dataset.barHeight = String(barHeight);
        container.dataset.barPaddingY = String(verticalPadding);
    };

    // 应用当前域名样式（高度 + 自定义 CSS），可在多处复用
    applyDomainStyles = () => {
        try {
            const container = queryUI('.folder-buttons-container');
            const currentHost = window.location.hostname || '';
            if (!container) return;

            const fallbackSpacing = clampBarSpacingValue(
                typeof buttonConfig.buttonBarBottomSpacing === 'number'
                    ? buttonConfig.buttonBarBottomSpacing
                    : (defaultConfig && typeof defaultConfig.buttonBarBottomSpacing === 'number'
                        ? defaultConfig.buttonBarBottomSpacing
                        : 0)
            );

            // 清理当前域名下已注入的旧样式，避免重复叠加
            try {
                document.querySelectorAll('style[data-domain-style]').forEach(el => {
                    const d = el.getAttribute('data-domain-style') || '';
                    if (d && currentHost.includes(d)) {
                        el.remove();
                    }
                });
            } catch (e) {
                console.warn('清理旧样式失败:', e);
            }

            const matchedStyle = (buttonConfig.domainStyleSettings || []).find(s => s && currentHost.includes(s.domain));
            if (matchedStyle) {
                const clamped = Math.min(200, Math.max(20, matchedStyle.height || buttonConfig.buttonBarHeight || (defaultConfig && defaultConfig.buttonBarHeight) || 40));
                container.style.height = clamped + 'px';
                updateButtonBarLayout(container, clamped);
                console.log(t('✅ 已根据 {{name}} 设置按钮栏高度：{{height}}px', {
                    name: matchedStyle.name,
                    height: clamped
                }));
                applyBarBottomSpacing(container, matchedStyle.bottomSpacing, fallbackSpacing);

                if (matchedStyle.cssCode) {
                    const styleEl = document.createElement('style');
                    styleEl.setAttribute('data-domain-style', matchedStyle.domain);
                    styleEl.textContent = matchedStyle.cssCode;
                    document.head.appendChild(styleEl);
                    console.log(t('✅ 已注入自定义CSS至 <head> 来自：{{name}}', { name: matchedStyle.name }));
                }
            } else {
                const fallback = (buttonConfig && typeof buttonConfig.buttonBarHeight === 'number')
                    ? buttonConfig.buttonBarHeight
                    : (defaultConfig && defaultConfig.buttonBarHeight) || 40;
                const clampedDefault = Math.min(200, Math.max(20, fallback));
                container.style.height = clampedDefault + 'px';
                updateButtonBarLayout(container, clampedDefault);
                console.log(t('ℹ️ 未匹配到样式规则，使用默认按钮栏高度：{{height}}px', {
                    height: clampedDefault
                }));
                applyBarBottomSpacing(container, fallbackSpacing, fallbackSpacing);
            }
        } catch (err) {
            console.warn(t('应用域名样式时出现问题:'), err);
        }
    };

    /**
     * 新建/编辑域名样式对话框
     * @param {number} index - 可选，若存在则为编辑，否则新建
     */
let currentAddDomainOverlay = null; // 保持原有声明
function showEditDomainStyleDialog(index) {
    if (currentAddDomainOverlay) {
        closeExistingOverlay(currentAddDomainOverlay);
    }
    const isEdit = typeof index === 'number';
    const styleItem = isEdit
        ? { ...buttonConfig.domainStyleSettings[index] }
        : {
            domain: window.location.hostname,
            name: document.title || t('新样式'),
            height: 40,
            bottomSpacing: buttonConfig.buttonBarBottomSpacing,
            cssCode: '',
            favicon: generateDomainFavicon(window.location.hostname)
        };
    const presetStyleDomain = styleItem.domain || '';
    if (!styleItem.favicon) {
        styleItem.favicon = generateDomainFavicon(presetStyleDomain);
    }
    if (typeof styleItem.bottomSpacing !== 'number') {
        styleItem.bottomSpacing = buttonConfig.buttonBarBottomSpacing;
    }

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? t('✏️ 编辑自定义样式') : t('🆕 新建自定义样式'),
        width: '480px',
        onClose: () => {
            currentAddDomainOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentAddDomainOverlay = overlay;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '16px';
    container.style.marginBottom = '16px';
    container.style.padding = '16px';
    container.style.borderRadius = '6px';
    container.style.border = '1px solid var(--border-color, #e5e7eb)';
    container.style.backgroundColor = 'var(--button-bg, #f3f4f6)';

    const tabsHeader = document.createElement('div');
    tabsHeader.style.display = 'flex';
    tabsHeader.style.gap = '8px';
    tabsHeader.style.flexWrap = 'wrap';

    const tabConfig = [
        { id: 'basic', label: '基础信息' },
        { id: 'layout', label: '布局设置' },
        { id: 'css', label: '自定义 CSS' }
    ];

    const tabButtons = [];
    const tabPanels = new Map();

    const tabsBody = document.createElement('div');
    tabsBody.style.position = 'relative';

    tabConfig.forEach(({ id, label }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.tabId = id;
        button.textContent = label;
        button.style.padding = '8px 14px';
        button.style.borderRadius = '20px';
        button.style.border = '1px solid var(--border-color, #d1d5db)';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'var(--muted-text-color, #6b7280)';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px';
        button.style.fontWeight = '500';
        button.addEventListener('click', () => setActiveTab(id));
        tabButtons.push(button);
        tabsHeader.appendChild(button);

        const panel = document.createElement('div');
        panel.dataset.tabId = id;
        panel.style.display = 'none';
        panel.style.flexDirection = 'column';
        panel.style.gap = '12px';
        tabPanels.set(id, panel);
        tabsBody.appendChild(panel);
    });

    container.appendChild(tabsHeader);
    container.appendChild(tabsBody);

    function setActiveTab(targetId) {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tabId === targetId;
            button.style.backgroundColor = isActive ? 'var(--dialog-bg, #ffffff)' : 'transparent';
            button.style.color = isActive ? 'var(--text-color, #1f2937)' : 'var(--muted-text-color, #6b7280)';
            button.style.fontWeight = isActive ? '600' : '500';
            button.style.boxShadow = isActive ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none';
        });
        tabPanels.forEach((panel, panelId) => {
            panel.style.display = panelId === targetId ? 'flex' : 'none';
        });
    }

    setActiveTab('basic');

    const nameLabel = document.createElement('label');
    nameLabel.textContent = t('备注名称：');
    nameLabel.style.display = 'flex';
    nameLabel.style.flexDirection = 'column';
    nameLabel.style.gap = '6px';
    nameLabel.style.fontSize = '13px';
    nameLabel.style.fontWeight = '600';
    nameLabel.style.color = 'var(--text-color, #1f2937)';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = styleItem.name || '';
    nameInput.style.width = '100%';
    nameInput.style.height = '40px';
    nameInput.style.padding = '0 12px';
    nameInput.style.border = '1px solid var(--border-color, #d1d5db)';
    nameInput.style.borderRadius = '6px';
    nameInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    nameInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    nameInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    nameInput.style.outline = 'none';
    nameInput.style.fontSize = '14px';
    nameLabel.appendChild(nameInput);
    tabPanels.get('basic').appendChild(nameLabel);

    const domainLabel = document.createElement('label');
    domainLabel.textContent = t('网址：');
    domainLabel.style.display = 'flex';
    domainLabel.style.flexDirection = 'column';
    domainLabel.style.gap = '6px';
    domainLabel.style.fontSize = '13px';
    domainLabel.style.fontWeight = '600';
    domainLabel.style.color = 'var(--text-color, #1f2937)';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.value = styleItem.domain || '';
    domainInput.style.width = '100%';
    domainInput.style.height = '40px';
    domainInput.style.padding = '0 12px';
    domainInput.style.border = '1px solid var(--border-color, #d1d5db)';
    domainInput.style.borderRadius = '6px';
    domainInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    domainInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    domainInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    domainInput.style.outline = 'none';
    domainInput.style.fontSize = '14px';
    domainLabel.appendChild(domainInput);
    tabPanels.get('basic').appendChild(domainLabel);

    const faviconLabel2 = document.createElement('label');
    faviconLabel2.textContent = t('站点图标：');
    faviconLabel2.style.display = 'flex';
    faviconLabel2.style.flexDirection = 'column';
    faviconLabel2.style.gap = '6px';
    faviconLabel2.style.fontSize = '13px';
    faviconLabel2.style.fontWeight = '600';
    faviconLabel2.style.color = 'var(--text-color, #1f2937)';

    const faviconFieldWrapper2 = document.createElement('div');
    faviconFieldWrapper2.style.display = 'flex';
    faviconFieldWrapper2.style.alignItems = 'flex-start';
    faviconFieldWrapper2.style.gap = '12px';

    const faviconPreviewHolder2 = document.createElement('div');
    faviconPreviewHolder2.style.width = '40px';
    faviconPreviewHolder2.style.height = '40px';
    faviconPreviewHolder2.style.borderRadius = '10px';
    faviconPreviewHolder2.style.display = 'flex';
    faviconPreviewHolder2.style.alignItems = 'center';
    faviconPreviewHolder2.style.justifyContent = 'center';
    faviconPreviewHolder2.style.backgroundColor = 'transparent';
    faviconPreviewHolder2.style.flexShrink = '0';

    const faviconControls2 = document.createElement('div');
    faviconControls2.style.display = 'flex';
    faviconControls2.style.flexDirection = 'column';
    faviconControls2.style.gap = '8px';
    faviconControls2.style.flex = '1';

    const faviconInput2 = document.createElement('textarea');
    faviconInput2.rows = 1;
    faviconInput2.style.flex = '1 1 auto';
    faviconInput2.style.padding = '10px 12px';
    faviconInput2.style.border = '1px solid var(--border-color, #d1d5db)';
    faviconInput2.style.borderRadius = '6px';
    faviconInput2.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    faviconInput2.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    faviconInput2.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    faviconInput2.style.outline = 'none';
    faviconInput2.style.fontSize = '14px';
    faviconInput2.style.lineHeight = '1.5';
    faviconInput2.style.resize = 'vertical';
    faviconInput2.style.overflowY = 'hidden';
    faviconInput2.placeholder = t('可填写自定义图标地址');
    faviconInput2.value = styleItem.favicon || '';
    const resizeFaviconTextarea2 = () => autoResizeTextarea(faviconInput2, { minRows: 1, maxRows: 4 });

    const faviconActionsRow2 = document.createElement('div');
    faviconActionsRow2.style.display = 'flex';
    faviconActionsRow2.style.alignItems = 'center';
    faviconActionsRow2.style.gap = '8px';
    faviconActionsRow2.style.flexWrap = 'nowrap';
    faviconActionsRow2.style.fontSize = '12px';
    faviconActionsRow2.style.color = 'var(--muted-text-color, #6b7280)';
    faviconActionsRow2.style.justifyContent = 'flex-start';

    const faviconHelp2 = document.createElement('span');
    faviconHelp2.textContent = t('留空时系统将使用该网址的默认 Favicon。');
    faviconHelp2.style.flex = '1';
    faviconHelp2.style.minWidth = '0';
    faviconHelp2.style.marginRight = '12px';

    const autoFaviconBtn2 = document.createElement('button');
    autoFaviconBtn2.type = 'button';
    autoFaviconBtn2.setAttribute('aria-label', t('自动获取站点图标'));
    autoFaviconBtn2.title = t('自动获取站点图标');
    autoFaviconBtn2.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    autoFaviconBtn2.style.color = '#fff';
    autoFaviconBtn2.style.border = '1px solid var(--border-color, #d1d5db)';
    autoFaviconBtn2.style.borderRadius = '50%';
    autoFaviconBtn2.style.width = '32px';
    autoFaviconBtn2.style.height = '32px';
    autoFaviconBtn2.style.display = 'flex';
    autoFaviconBtn2.style.alignItems = 'center';
    autoFaviconBtn2.style.justifyContent = 'center';
    autoFaviconBtn2.style.cursor = 'pointer';
    autoFaviconBtn2.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.16)';
    autoFaviconBtn2.style.flexShrink = '0';
    autoFaviconBtn2.style.padding = '0';

    const autoFaviconIcon2 = createAutoFaviconIcon();
    autoFaviconBtn2.appendChild(autoFaviconIcon2);

    faviconActionsRow2.appendChild(faviconHelp2);
    faviconActionsRow2.appendChild(autoFaviconBtn2);

    faviconControls2.appendChild(faviconInput2);
    faviconControls2.appendChild(faviconActionsRow2);

    faviconFieldWrapper2.appendChild(faviconPreviewHolder2);
    faviconFieldWrapper2.appendChild(faviconControls2);

    faviconLabel2.appendChild(faviconFieldWrapper2);
    tabPanels.get('basic').appendChild(faviconLabel2);

    let faviconManuallyEdited2 = false;
    const updateStyleFaviconPreview = () => {
        const imgUrl = faviconInput2.value.trim() || generateDomainFavicon(domainInput.value.trim());
        setTrustedHTML(faviconPreviewHolder2, '');
        faviconPreviewHolder2.appendChild(
            createFaviconElement(
                imgUrl,
                nameInput.value.trim() || domainInput.value.trim() || '样式',
                '🎨',
                { withBackground: false }
            )
        );
    };
    updateStyleFaviconPreview();
    resizeFaviconTextarea2();
    requestAnimationFrame(resizeFaviconTextarea2);

    const getStyleFallbackFavicon = () => generateDomainFavicon(domainInput.value.trim());

    autoFaviconBtn2.addEventListener('click', () => {
        const autoUrl = getStyleFallbackFavicon();
        faviconInput2.value = autoUrl;
        faviconManuallyEdited2 = false;
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });

    domainInput.addEventListener('input', () => {
        if (!faviconManuallyEdited2) {
            faviconInput2.value = getStyleFallbackFavicon();
        }
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });

    faviconInput2.addEventListener('input', () => {
        faviconManuallyEdited2 = true;
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });
    nameInput.addEventListener('input', updateStyleFaviconPreview);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = t('按钮栏高度 (px)：');
    heightLabel.style.display = 'flex';
    heightLabel.style.flexDirection = 'column';
    heightLabel.style.gap = '6px';
    heightLabel.style.fontSize = '13px';
    heightLabel.style.fontWeight = '600';
    heightLabel.style.color = 'var(--text-color, #1f2937)';
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.min = '20';
    heightInput.max = '200';
    heightInput.step = '1';
    heightInput.value = styleItem.height;
    heightInput.style.width = '100%';
    heightInput.style.height = '40px';
    heightInput.style.padding = '0 12px';
    heightInput.style.border = '1px solid var(--border-color, #d1d5db)';
    heightInput.style.borderRadius = '6px';
    heightInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    heightInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    heightInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    heightInput.style.outline = 'none';
    heightInput.style.fontSize = '14px';
    heightLabel.appendChild(heightInput);
    tabPanels.get('layout').appendChild(heightLabel);

    const bottomSpacingLabel = document.createElement('label');
    bottomSpacingLabel.textContent = t('按钮距页面底部间距 (px)：');
    bottomSpacingLabel.style.display = 'flex';
    bottomSpacingLabel.style.flexDirection = 'column';
    bottomSpacingLabel.style.gap = '6px';
    bottomSpacingLabel.style.fontSize = '13px';
    bottomSpacingLabel.style.fontWeight = '600';
    bottomSpacingLabel.style.color = 'var(--text-color, #1f2937)';
    const bottomSpacingInput = document.createElement('input');
    bottomSpacingInput.type = 'number';
    bottomSpacingInput.min = '-200';
    bottomSpacingInput.max = '200';
    bottomSpacingInput.step = '1';
    bottomSpacingInput.value = styleItem.bottomSpacing ?? buttonConfig.buttonBarBottomSpacing ?? 0;
    bottomSpacingInput.style.width = '100%';
    bottomSpacingInput.style.height = '40px';
    bottomSpacingInput.style.padding = '0 12px';
    bottomSpacingInput.style.border = '1px solid var(--border-color, #d1d5db)';
    bottomSpacingInput.style.borderRadius = '6px';
    bottomSpacingInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    bottomSpacingInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    bottomSpacingInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    bottomSpacingInput.style.outline = 'none';
    bottomSpacingInput.style.fontSize = '14px';
    bottomSpacingLabel.appendChild(bottomSpacingInput);
    tabPanels.get('layout').appendChild(bottomSpacingLabel);

    const cssLabel = document.createElement('label');
    cssLabel.textContent = t('自定义 CSS：');
    cssLabel.style.display = 'flex';
    cssLabel.style.flexDirection = 'column';
    cssLabel.style.gap = '6px';
    cssLabel.style.fontSize = '13px';
    cssLabel.style.fontWeight = '600';
    cssLabel.style.color = 'var(--text-color, #1f2937)';
    const cssTextarea = document.createElement('textarea');
    cssTextarea.value = styleItem.cssCode || '';
    cssTextarea.style.width = '100%';
    cssTextarea.style.minHeight = '120px';
    cssTextarea.style.padding = '12px';
    cssTextarea.style.border = '1px solid var(--border-color, #d1d5db)';
    cssTextarea.style.borderRadius = '6px';
    cssTextarea.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    cssTextarea.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    cssTextarea.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    cssTextarea.style.outline = 'none';
    cssTextarea.style.resize = 'vertical';
    cssTextarea.style.fontSize = '13px';
    cssTextarea.style.lineHeight = '1.5';
    cssLabel.appendChild(cssTextarea);
    tabPanels.get('css').appendChild(cssLabel);

    dialog.appendChild(container);

    const footer2 = document.createElement('div');
    footer2.style.display = 'flex';
    footer2.style.justifyContent = 'space-between';
    footer2.style.alignItems = 'center';
    footer2.style.gap = '12px';
    footer2.style.marginTop = '20px';
    footer2.style.paddingTop = '20px';
    footer2.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn2 = document.createElement('button');
    cancelBtn2.textContent = t('取消');
    cancelBtn2.style.backgroundColor = 'var(--cancel-color, #6B7280)';
    cancelBtn2.style.color = '#fff';
    cancelBtn2.style.border = 'none';
    cancelBtn2.style.borderRadius = '4px';
    cancelBtn2.style.padding = '8px 16px';
    cancelBtn2.style.fontSize = '14px';
    cancelBtn2.style.cursor = 'pointer';
    cancelBtn2.addEventListener('click', () => {
        closeExistingOverlay(overlay);
        currentAddDomainOverlay = null;
    });
    footer2.appendChild(cancelBtn2);

    const saveBtn2 = document.createElement('button');
    saveBtn2.textContent = isEdit ? t('保存') : t('创建');
    saveBtn2.style.backgroundColor = 'var(--success-color,#22c55e)';
    saveBtn2.style.color = '#fff';
    saveBtn2.style.border = 'none';
    saveBtn2.style.borderRadius = '4px';
    saveBtn2.style.padding = '8px 16px';
    saveBtn2.style.fontSize = '14px';
    saveBtn2.style.cursor = 'pointer';
    saveBtn2.addEventListener('click', () => {
        const sanitizedDomain = domainInput.value.trim();
        const updatedItem = {
            domain: sanitizedDomain,
            name: nameInput.value.trim() || '未命名样式',
            height: parseInt(heightInput.value, 10) || 40,
            bottomSpacing: (() => {
                const parsed = Number(bottomSpacingInput.value);
                if (Number.isFinite(parsed)) {
                    return Math.max(-200, Math.min(200, parsed));
                }
                return buttonConfig.buttonBarBottomSpacing;
            })(),
            cssCode: cssTextarea.value,
            favicon: faviconInput2.value.trim() || generateDomainFavicon(sanitizedDomain)
        };
        if (isEdit) {
            buttonConfig.domainStyleSettings[index] = updatedItem;
        } else {
            buttonConfig.domainStyleSettings.push(updatedItem);
        }
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        // 保存后立即生效
        try { applyDomainStyles(); } catch (_) {}
        closeExistingOverlay(overlay);
        currentAddDomainOverlay = null;
        showStyleSettingsDialog(); // 刷新列表
    });
    footer2.appendChild(saveBtn2);

    dialog.appendChild(footer2);
}


// =============== [新增] showDomainRuleEditorDialog 统一新建/编辑弹窗 ===============
function showDomainRuleEditorDialog(ruleData, onSave) {
    // ruleData 若为空对象，则视为新建，否则编辑
    // 统一使用 createUnifiedDialog
    const isEdit = !!ruleData && ruleData.domain;
    const presetDomain = isEdit ? (ruleData.domain || '') : (window.location.hostname || '');
    const presetFavicon = (isEdit && ruleData.favicon) ? ruleData.favicon : generateDomainFavicon(presetDomain);

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? t('✏️ 编辑自动化规则') : t('🆕 新建新网址规则'),
        width: '480px',
        onClose: () => {
            // 关闭时的回调可写在此
        },
        closeOnOverlayClick: false
    });

    function createAutoSubmitMethodConfigUI(initialMethod = 'Enter', initialAdvanced = null) {
        const methodSection = document.createElement('div');
        methodSection.style.display = 'flex';
        methodSection.style.flexDirection = 'column';
        methodSection.style.gap = '8px';

        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.alignItems = 'center';
        titleRow.style.justifyContent = 'space-between';

        const methodTitle = document.createElement('div');
        methodTitle.textContent = t('自动提交方式:');
        methodTitle.style.fontSize = '13px';
        methodTitle.style.fontWeight = '600';
        methodTitle.style.color = 'var(--text-color, #1f2937)';
        titleRow.appendChild(methodTitle);

        const expandButton = document.createElement('button');
        expandButton.type = 'button';
        expandButton.title = t('展开/折叠高级选项');
        expandButton.textContent = '▼';
        expandButton.style.width = '28px';
        expandButton.style.height = '28px';
        expandButton.style.padding = '0';
        expandButton.style.display = 'flex';
        expandButton.style.alignItems = 'center';
        expandButton.style.justifyContent = 'center';
        expandButton.style.border = '1px solid transparent';
        expandButton.style.borderRadius = '4px';
        expandButton.style.background = 'transparent';
        expandButton.style.cursor = 'pointer';
        expandButton.style.transition = 'background-color 0.2s ease, border-color 0.2s ease';
        expandButton.addEventListener('mouseenter', () => {
            expandButton.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
            expandButton.style.borderColor = 'var(--border-color, #d1d5db)';
        });
        expandButton.addEventListener('mouseleave', () => {
            expandButton.style.backgroundColor = 'transparent';
            expandButton.style.borderColor = 'transparent';
        });
        titleRow.appendChild(expandButton);
        methodSection.appendChild(titleRow);

        const methodOptionsWrapper = document.createElement('div');
        methodOptionsWrapper.style.display = 'flex';
        methodOptionsWrapper.style.flexWrap = 'wrap';
        methodOptionsWrapper.style.gap = '15px';
        methodSection.appendChild(methodOptionsWrapper);

        const advancedContainer = document.createElement('div');
        advancedContainer.style.display = 'none';
        advancedContainer.style.flexDirection = 'column';
        advancedContainer.style.gap = '10px';
        advancedContainer.style.marginTop = '8px';
        advancedContainer.style.padding = '12px';
        advancedContainer.style.borderRadius = '6px';
        advancedContainer.style.border = '1px solid var(--border-color, #d1d5db)';
        advancedContainer.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        advancedContainer.style.boxShadow = 'inset 0 1px 2px rgba(15, 23, 42, 0.04)';
        advancedContainer.style.transition = 'opacity 0.2s ease';
        advancedContainer.style.opacity = '0';
        methodSection.appendChild(advancedContainer);

        const methodOptions = [
            { value: 'Enter', text: 'Enter' },
            { value: 'Cmd+Enter', text: 'Cmd+Enter' },
            { value: '模拟点击提交按钮', text: '模拟点击提交按钮' }
        ];

        const methodRadioName = `autoSubmitMethod_${Math.random().toString(36).slice(2, 8)}`;
        const uniqueSuffix = Math.random().toString(36).slice(2, 8);

        const getDefaultAdvancedForMethod = (method) => {
            if (method === 'Cmd+Enter') {
                return { variant: 'cmd' };
            }
            if (method === '模拟点击提交按钮') {
                return { variant: 'default', selector: '' };
            }
            return null;
        };

        const normalizeAdvancedForMethod = (method, advanced) => {
            const defaults = getDefaultAdvancedForMethod(method);
            if (!defaults) return null;
            const normalized = { ...defaults };
            if (advanced && typeof advanced === 'object') {
                if (method === 'Cmd+Enter') {
                    if (advanced.variant && ['cmd', 'ctrl'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                } else if (method === '模拟点击提交按钮') {
                    if (advanced.variant && ['default', 'selector'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                    if (advanced.selector && typeof advanced.selector === 'string') {
                        normalized.selector = advanced.selector;
                    }
                }
            }
            if (method === '模拟点击提交按钮' && normalized.variant !== 'selector') {
                normalized.selector = '';
            }
            return normalized;
        };

        let selectedMethod = initialMethod || methodOptions[0].value;
        if (!methodOptions.some(option => option.value === selectedMethod)) {
            methodOptions.push({ value: selectedMethod, text: selectedMethod });
        }

        let advancedState = normalizeAdvancedForMethod(selectedMethod, initialAdvanced);

        const shouldExpandInitially = () => {
            if (!advancedState) return false;
            if (selectedMethod === 'Cmd+Enter') {
                return advancedState.variant === 'ctrl';
            }
            if (selectedMethod === '模拟点击提交按钮') {
                return advancedState.variant === 'selector' && advancedState.selector;
            }
            return false;
        };

        let isExpanded = shouldExpandInitially();

        const renderAdvancedContent = () => {
            setTrustedHTML(advancedContainer, '');
            if (!isExpanded) {
                advancedContainer.style.display = 'none';
                advancedContainer.style.opacity = '0';
                return;
            }

            advancedContainer.style.display = 'flex';
            advancedContainer.style.opacity = '1';

            const advancedTitle = document.createElement('div');
            advancedTitle.textContent = t('高级选项:');
            advancedTitle.style.fontSize = '12px';
            advancedTitle.style.fontWeight = '600';
            advancedTitle.style.opacity = '0.75';
            advancedContainer.appendChild(advancedTitle);

            if (selectedMethod === 'Enter') {
                const tip = document.createElement('div');
                tip.textContent = t('Enter 提交方式没有额外配置。');
                tip.style.fontSize = '12px';
                tip.style.color = 'var(--muted-text-color, #6b7280)';
                advancedContainer.appendChild(tip);
                return;
            }

            if (selectedMethod === 'Cmd+Enter') {
                const variants = [
                    { value: 'cmd', label: 'Cmd + Enter', desc: '使用 macOS / Meta 键组合模拟提交' },
                    { value: 'ctrl', label: 'Ctrl + Enter', desc: '使用 Windows / Linux 控制键组合模拟提交' }
                ];
                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitCmdVariant_${uniqueSuffix}`;
                variants.forEach(variant => {
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'flex-start';
                    label.style.gap = '8px';
                    label.style.cursor = 'pointer';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = variantRadioName;
                    radio.value = variant.value;
                    radio.checked = advancedState?.variant === variant.value;
                    radio.style.marginTop = '2px';
                    radio.style.cursor = 'pointer';
                    radio.addEventListener('change', () => {
                        if (radio.checked) {
                            advancedState = { variant: variant.value };
                        }
                    });

                    const textContainer = document.createElement('div');
                    textContainer.style.display = 'flex';
                    textContainer.style.flexDirection = 'column';
                    textContainer.style.gap = '2px';

                    const labelText = document.createElement('span');
                    labelText.textContent = variant.label;
                    labelText.style.fontSize = '13px';
                    labelText.style.fontWeight = '600';

                    const descText = document.createElement('span');
                    descText.textContent = variant.desc;
                    descText.style.fontSize = '12px';
                    descText.style.opacity = '0.75';

                    textContainer.appendChild(labelText);
                    textContainer.appendChild(descText);
                    label.appendChild(radio);
                    label.appendChild(textContainer);
                    variantGroup.appendChild(label);
                });

                advancedContainer.appendChild(variantGroup);
                return;
            }

            if (selectedMethod === '模拟点击提交按钮') {
                const variants = [
                    { value: 'default', label: '默认方法', desc: '自动匹配常见的提交按钮进行点击。' },
                    { value: 'selector', label: '自定义 CSS 选择器', desc: '使用自定义选择器定位需要点击的提交按钮。' }
                ];

                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitClickVariant_${uniqueSuffix}`;
                variants.forEach(variant => {
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'flex-start';
                    label.style.gap = '8px';
                    label.style.cursor = 'pointer';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = variantRadioName;
                    radio.value = variant.value;
                    radio.checked = advancedState?.variant === variant.value;
                    radio.style.marginTop = '2px';
                    radio.style.cursor = 'pointer';
                    radio.addEventListener('change', () => {
                        if (radio.checked) {
                            advancedState = normalizeAdvancedForMethod(selectedMethod, { variant: variant.value, selector: advancedState?.selector || '' });
                            renderAdvancedContent();
                        }
                    });

                    const textContainer = document.createElement('div');
                    textContainer.style.display = 'flex';
                    textContainer.style.flexDirection = 'column';
                    textContainer.style.gap = '2px';

                    const labelText = document.createElement('span');
                    labelText.textContent = variant.label;
                    labelText.style.fontSize = '13px';
                    labelText.style.fontWeight = '600';

                    const descText = document.createElement('span');
                    descText.textContent = variant.desc;
                    descText.style.fontSize = '12px';
                    descText.style.opacity = '0.75';

                    textContainer.appendChild(labelText);
                    textContainer.appendChild(descText);
                    label.appendChild(radio);
                    label.appendChild(textContainer);
                    variantGroup.appendChild(label);
                });

                advancedContainer.appendChild(variantGroup);

                if (advancedState?.variant === 'selector') {
                    const selectorInput = document.createElement('input');
                    selectorInput.type = 'text';
                    selectorInput.placeholder = t('如：button.send-btn 或 form button[type="submit"]');
                    selectorInput.value = advancedState.selector || '';
                    selectorInput.style.width = '100%';
                    selectorInput.style.height = '40px';
                    selectorInput.style.padding = '0 12px';
                    selectorInput.style.border = '1px solid var(--border-color, #d1d5db)';
                    selectorInput.style.borderRadius = '6px';
                    selectorInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
                    selectorInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
                    selectorInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
                    selectorInput.style.outline = 'none';
                    selectorInput.style.fontSize = '14px';
                    selectorInput.addEventListener('input', () => {
                        advancedState = normalizeAdvancedForMethod(selectedMethod, {
                            variant: 'selector',
                            selector: selectorInput.value
                        });
                    });
                    advancedContainer.appendChild(selectorInput);

                    const hint = document.createElement('div');
                    hint.textContent = t('请输入能唯一定位提交按钮的 CSS 选择器。');
                    hint.style.fontSize = '12px';
                    hint.style.color = 'var(--muted-text-color, #6b7280)';
                    advancedContainer.appendChild(hint);
                }
                return;
            }

            const tip = document.createElement('div');
            tip.textContent = t('当前提交方式没有可配置的高级选项。');
            tip.style.fontSize = '12px';
            tip.style.color = 'var(--muted-text-color, #6b7280)';
            advancedContainer.appendChild(tip);
        };

        methodOptions.forEach(option => {
            const radioLabel = document.createElement('label');
            radioLabel.style.display = 'inline-flex';
            radioLabel.style.alignItems = 'center';
            radioLabel.style.cursor = 'pointer';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = methodRadioName;
            radio.value = option.value;
            radio.checked = selectedMethod === option.value;
            radio.style.marginRight = '6px';
            radio.style.cursor = 'pointer';
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    selectedMethod = option.value;
                    advancedState = normalizeAdvancedForMethod(selectedMethod, null);
                    renderAdvancedContent();
                }
            });

            radioLabel.appendChild(radio);
            radioLabel.appendChild(document.createTextNode(option.text));
            methodOptionsWrapper.appendChild(radioLabel);
        });

        expandButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            expandButton.textContent = isExpanded ? '▲' : '▼';
            expandButton.setAttribute('aria-expanded', String(isExpanded));
            renderAdvancedContent();
        });

        expandButton.setAttribute('aria-expanded', String(isExpanded));
        expandButton.textContent = isExpanded ? '▲' : '▼';
        renderAdvancedContent();

        return {
            container: methodSection,
            getConfig: () => {
                const normalized = normalizeAdvancedForMethod(selectedMethod, advancedState);
                let advancedForSave = null;
                if (selectedMethod === 'Cmd+Enter' && normalized && normalized.variant && normalized.variant !== 'cmd') {
                    advancedForSave = { variant: normalized.variant };
                } else if (selectedMethod === '模拟点击提交按钮' && normalized) {
                    if (normalized.variant === 'selector') {
                        advancedForSave = {
                            variant: 'selector',
                            selector: typeof normalized.selector === 'string' ? normalized.selector : ''
                        };
                    } else if (normalized.variant !== 'default') {
                        advancedForSave = { variant: normalized.variant };
                    }
                }
                return {
                    method: selectedMethod,
                    advanced: advancedForSave
                };
            }
        };
    }

    // 创建表单容器
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.marginBottom = '16px';
    container.style.padding = '16px';
    container.style.borderRadius = '6px';
    container.style.border = '1px solid var(--border-color, #e5e7eb)';
    container.style.backgroundColor = 'var(--button-bg, #f3f4f6)';

    // 网址
    const domainLabel = document.createElement('label');
    domainLabel.textContent = t('网址：');
    domainLabel.style.display = 'flex';
    domainLabel.style.flexDirection = 'column';
    domainLabel.style.gap = '6px';
    domainLabel.style.fontSize = '13px';
    domainLabel.style.fontWeight = '600';
    domainLabel.style.color = 'var(--text-color, #1f2937)';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.style.width = '100%';
    domainInput.style.height = '40px';
    domainInput.style.padding = '0 12px';
    domainInput.style.border = '1px solid var(--border-color, #d1d5db)';
    domainInput.style.borderRadius = '6px';
   domainInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    domainInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    domainInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    domainInput.style.outline = 'none';
    domainInput.style.fontSize = '14px';
    domainInput.value = presetDomain;
    domainLabel.appendChild(domainInput);
    container.appendChild(domainLabel);

    let nameInputRef = null;

    // 备注名称
    const nameLabel = document.createElement('label');
    nameLabel.textContent = t('备注名称：');
    nameLabel.style.display = 'flex';
    nameLabel.style.flexDirection = 'column';
    nameLabel.style.gap = '6px';
    nameLabel.style.fontSize = '13px';
    nameLabel.style.fontWeight = '600';
    nameLabel.style.color = 'var(--text-color, #1f2937)';
    nameInputRef = document.createElement('input');
    nameInputRef.type = 'text';
    nameInputRef.style.width = '100%';
    nameInputRef.style.height = '40px';
    nameInputRef.style.padding = '0 12px';
    nameInputRef.style.border = '1px solid var(--border-color, #d1d5db)';
    nameInputRef.style.borderRadius = '6px';
    nameInputRef.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    nameInputRef.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    nameInputRef.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    nameInputRef.style.outline = 'none';
    nameInputRef.style.fontSize = '14px';
    nameInputRef.value = isEdit ? (ruleData.name || '') : (document.title || t('新网址规则'));
    nameLabel.appendChild(nameInputRef);
    container.appendChild(nameLabel);

    // favicon
    const faviconLabel = document.createElement('label');
    faviconLabel.textContent = t('站点图标：');
    faviconLabel.style.display = 'flex';
    faviconLabel.style.flexDirection = 'column';
    faviconLabel.style.gap = '6px';
    faviconLabel.style.fontSize = '13px';
    faviconLabel.style.fontWeight = '600';
    faviconLabel.style.color = 'var(--text-color, #1f2937)';

    const faviconFieldWrapper = document.createElement('div');
    faviconFieldWrapper.style.display = 'flex';
    faviconFieldWrapper.style.alignItems = 'flex-start';
    faviconFieldWrapper.style.gap = '12px';

    const faviconPreviewHolder = document.createElement('div');
    faviconPreviewHolder.style.width = '40px';
    faviconPreviewHolder.style.height = '40px';
    faviconPreviewHolder.style.borderRadius = '10px';
    faviconPreviewHolder.style.display = 'flex';
    faviconPreviewHolder.style.alignItems = 'center';
    faviconPreviewHolder.style.justifyContent = 'center';
    faviconPreviewHolder.style.backgroundColor = 'transparent';
    faviconPreviewHolder.style.flexShrink = '0';

    const faviconControls = document.createElement('div');
    faviconControls.style.display = 'flex';
    faviconControls.style.flexDirection = 'column';
    faviconControls.style.gap = '8px';
    faviconControls.style.flex = '1';

    const faviconInput = document.createElement('textarea');
    faviconInput.rows = 1;
    faviconInput.style.flex = '1 1 auto';
    faviconInput.style.padding = '10px 12px';
    faviconInput.style.border = '1px solid var(--border-color, #d1d5db)';
    faviconInput.style.borderRadius = '6px';
    faviconInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    faviconInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    faviconInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    faviconInput.style.outline = 'none';
    faviconInput.style.fontSize = '14px';
    faviconInput.style.lineHeight = '1.5';
    faviconInput.style.resize = 'vertical';
    faviconInput.style.overflowY = 'hidden';
    faviconInput.placeholder = t('支持 https:// 链接或 data: URL');
    faviconInput.value = presetFavicon || '';
    const resizeFaviconTextarea = () => autoResizeTextarea(faviconInput, { minRows: 1, maxRows: 4 });

    const faviconActionsRow = document.createElement('div');
    faviconActionsRow.style.display = 'flex';
    faviconActionsRow.style.alignItems = 'center';
    faviconActionsRow.style.gap = '8px';
    faviconActionsRow.style.flexWrap = 'nowrap';
    faviconActionsRow.style.fontSize = '12px';
    faviconActionsRow.style.color = 'var(--muted-text-color, #6b7280)';
    faviconActionsRow.style.justifyContent = 'flex-start';

    const faviconHelp = document.createElement('span');
    faviconHelp.textContent = t('留空时将自动根据网址生成 Google Favicon。');
    faviconHelp.style.flex = '1';
    faviconHelp.style.minWidth = '0';
    faviconHelp.style.marginRight = '12px';

    const autoFaviconBtn = document.createElement('button');
    autoFaviconBtn.type = 'button';
    autoFaviconBtn.setAttribute('aria-label', t('自动获取站点图标'));
    autoFaviconBtn.title = t('自动获取站点图标');
    autoFaviconBtn.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    autoFaviconBtn.style.border = '1px solid var(--border-color, #d1d5db)';
    autoFaviconBtn.style.borderRadius = '50%';
    autoFaviconBtn.style.width = '32px';
    autoFaviconBtn.style.height = '32px';
    autoFaviconBtn.style.display = 'flex';
    autoFaviconBtn.style.alignItems = 'center';
    autoFaviconBtn.style.justifyContent = 'center';
    autoFaviconBtn.style.cursor = 'pointer';
    autoFaviconBtn.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.16)';
    autoFaviconBtn.style.flexShrink = '0';
    autoFaviconBtn.style.padding = '0';

    const autoFaviconIcon = createAutoFaviconIcon();
    autoFaviconBtn.appendChild(autoFaviconIcon);

    faviconActionsRow.appendChild(faviconHelp);
    faviconActionsRow.appendChild(autoFaviconBtn);

    faviconControls.appendChild(faviconInput);
    faviconControls.appendChild(faviconActionsRow);

    faviconFieldWrapper.appendChild(faviconPreviewHolder);
    faviconFieldWrapper.appendChild(faviconControls);

    faviconLabel.appendChild(faviconFieldWrapper);
    container.appendChild(faviconLabel);

    let faviconManuallyEdited = false;
    const updateFaviconPreview = () => {
        const currentFavicon = faviconInput.value.trim();
        setTrustedHTML(faviconPreviewHolder, '');
        faviconPreviewHolder.appendChild(
            createFaviconElement(
                currentFavicon || generateDomainFavicon(domainInput.value.trim()),
                (nameInputRef ? nameInputRef.value.trim() : '') || domainInput.value.trim() || t('自动化'),
                '⚡',
                { withBackground: false }
            )
        );
    };

    const getFallbackFavicon = () => generateDomainFavicon(domainInput.value.trim());

    autoFaviconBtn.addEventListener('click', () => {
        const autoUrl = getFallbackFavicon();
        faviconInput.value = autoUrl;
        faviconManuallyEdited = false;
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    domainInput.addEventListener('input', () => {
        if (!faviconManuallyEdited) {
            faviconInput.value = getFallbackFavicon();
        }
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    faviconInput.addEventListener('input', () => {
        faviconManuallyEdited = true;
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    nameInputRef.addEventListener('input', updateFaviconPreview);

    updateFaviconPreview();
    resizeFaviconTextarea();
    requestAnimationFrame(resizeFaviconTextarea);

    const methodConfigUI = createAutoSubmitMethodConfigUI(
        (isEdit && ruleData.method) ? ruleData.method : 'Enter',
        isEdit ? ruleData.methodAdvanced : null
    );
    container.appendChild(methodConfigUI.container);

    // 确认 & 取消 按钮
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'space-between';
    btnRow.style.alignItems = 'center';
    btnRow.style.gap = '12px';
    btnRow.style.marginTop = '20px';
    btnRow.style.paddingTop = '20px';
    btnRow.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = t('取消');
    cancelBtn.style.backgroundColor = 'var(--cancel-color,#6B7280)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', () => {
        overlay.remove();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = t('确认');
    confirmBtn.style.backgroundColor = 'var(--success-color,#22c55e)';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.padding = '8px 16px';
    confirmBtn.style.fontSize = '14px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.addEventListener('click', () => {
        const sanitizedDomain = domainInput.value.trim();
        const sanitizedName = nameInputRef.value.trim();
        const methodConfig = methodConfigUI.getConfig();
        const methodAdvanced = methodConfig.advanced;
        const newData = {
            domain: sanitizedDomain,
            name: sanitizedName,
            method: methodConfig.method,
            favicon: faviconInput.value.trim() || generateDomainFavicon(sanitizedDomain)
        };

        if(!newData.domain || !newData.name) {
            alert(t('请输入网址和备注名称！'));
            return;
        }

        if (methodConfig.method === '模拟点击提交按钮' && methodAdvanced && methodAdvanced.variant === 'selector') {
            const trimmedSelector = methodAdvanced.selector ? methodAdvanced.selector.trim() : '';
            if (!trimmedSelector) {
                alert(t('请输入有效的 CSS 选择器！'));
                return;
            }
            try {
                document.querySelector(trimmedSelector);
            } catch (err) {
                alert(t('CSS 选择器语法错误，请检查后再试！'));
                return;
            }
            methodAdvanced.selector = trimmedSelector;
        }

        if (methodAdvanced) {
            newData.methodAdvanced = methodAdvanced;
        }

        // 回调保存
        if(onSave) onSave(newData);
        // 关闭
        overlay.remove();
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    // 组装
    dialog.appendChild(container);
    dialog.appendChild(btnRow);

}

function isValidDomainInput(str) {
    // 简易：包含'.' 不含空格 即视为有效
    if (str.includes(' ')) return false;
    if (!str.includes('.')) return false;
    return true;
}
