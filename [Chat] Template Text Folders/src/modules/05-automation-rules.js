/* -------------------------------------------------------------------------- *
 * Module 05 · Automation rules dialogs and submission helpers
 * -------------------------------------------------------------------------- */

let currentAutomationOverlay = null;
/**
 *
 * 弹窗：自动化设置，显示所有 domainAutoSubmitSettings，并可删除、点击添加
 */
function showAutomationSettingsDialog() {
    // 若已存在则先关闭
    if (currentAutomationOverlay) {
        closeExistingOverlay(currentAutomationOverlay);
    }

    // 使用 createUnifiedDialog 统一创建 overlay + dialog
    const { overlay, dialog } = createUnifiedDialog({
        title: t('⚡ 自动化设置'),
        width: '750px',  // 保留你想要的宽度
        onClose: () => {
            currentAutomationOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentAutomationOverlay = overlay;

    // 这里是新写法：在 dialog 里 appendChild 内部内容
    // 注意，createUnifiedDialog 已经注入了 overlay 与动画

    // 1) 构建内容区, 并插入到 dialog
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'right';
    infoDiv.style.marginBottom = '10px';

    // 原先的 "关闭并保存" 按钮
    const closeAutomationBtn = document.createElement('button');
    closeAutomationBtn.id = 'closeAutomationBtn';
    closeAutomationBtn.textContent = t('💾 关闭并保存');
    closeAutomationBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute; /* 若想固定在右上角，可再自行定位 */
        top: 20px;
        right: 20px;
    `;
    closeAutomationBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        closeExistingOverlay(overlay);
        currentAutomationOverlay = null;
    });
    infoDiv.appendChild(closeAutomationBtn);
    dialog.appendChild(infoDiv);

    // 2) 列表容器 + 渲染 domainAutoSubmitSettings
    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
    `;

    const listHeader = document.createElement('div');
    listHeader.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    const headerColumns = [
        { label: '图标', flex: '0 0 32px', justify: 'center' },
        { label: '网站｜网址', flex: '1 1 0%', justify: 'flex-start', paddingLeft: '8px' },
        { label: '提交方式', flex: '0 0 120px', justify: 'center' },
        { label: '修改', flex: '0 0 40px', justify: 'center' },
        { label: '删除', flex: '0 0 40px', justify: 'center' }
    ];

    headerColumns.forEach(({ label, flex, justify, paddingLeft }) => {
        const column = document.createElement('div');
        column.textContent = label;
        column.style.display = 'flex';
        column.style.alignItems = 'center';
        column.style.justifyContent = justify;
        column.style.flex = flex;
        column.style.fontSize = '12px';
        column.style.fontWeight = '600';
        if (paddingLeft) {
            column.style.paddingLeft = paddingLeft;
        }
        listHeader.appendChild(column);
    });

    const listBody = document.createElement('div');
    listBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    listBody.classList.add('hide-scrollbar');

    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);

    const keyboardMethodPattern = /(enter|shift|caps|ctrl|control|cmd|meta|option|alt|space|tab|esc|escape|delete|backspace|home|end|page ?up|page ?down|arrow|up|down|left|right)/i;

    const createKeyCapElement = (label) => {
        const keyEl = document.createElement('span');
        keyEl.textContent = label;
        keyEl.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(180deg, rgba(17,17,17,0.95), rgba(45,45,45,0.95));
            box-shadow: inset 0 -1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.45);
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            line-height: 1.2;
            white-space: nowrap;
        `;
        return keyEl;
    };

    const createMethodDisplay = (rawMethod) => {
        const methodValue = (rawMethod || '').trim();
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.gap = '6px';
        container.style.flexWrap = 'wrap';
        container.style.maxWidth = '100%';
        container.style.fontSize = '12px';
        container.style.fontWeight = '600';

        if (!methodValue) {
            const placeholder = document.createElement('span');
            placeholder.textContent = '-';
            placeholder.style.color = 'var(--muted-text-color, #6b7280)';
            placeholder.style.fontWeight = '500';
            container.appendChild(placeholder);
            return container;
        }

        if (methodValue === '模拟点击提交按钮') {
            const clickBadge = document.createElement('span');
            clickBadge.textContent = t('模拟点击');
            clickBadge.style.cssText = `
                padding: 4px 12px;
                border-radius: 20px;
                background: linear-gradient(180deg, rgba(253,224,71,0.85), rgba(251,191,36,0.9));
                border: 1px solid rgba(217,119,6,0.4);
                box-shadow: inset 0 -1px 0 rgba(217,119,6,0.35), 0 1px 2px rgba(217,119,6,0.25);
                color: rgba(120,53,15,0.95);
                font-weight: 700;
                font-size: 12px;
                letter-spacing: 0.02em;
                white-space: nowrap;
            `;
            container.appendChild(clickBadge);
            return container;
        }

        const shouldUseKeyStyle = keyboardMethodPattern.test(methodValue) || methodValue.includes('+') || methodValue.includes('/');

        if (!shouldUseKeyStyle) {
            const pill = document.createElement('span');
            pill.textContent = methodValue;
            pill.style.cssText = `
                padding: 4px 10px;
                background-color: rgba(59,130,246,0.12);
                color: var(--primary-color, #3B82F6);
                border-radius: 999px;
                white-space: nowrap;
            `;
            container.appendChild(pill);
            return container;
        }

        const combos = methodValue.split('/').map(segment => segment.trim()).filter(Boolean);
        combos.forEach((combo, comboIdx) => {
            if (comboIdx > 0) {
                const divider = document.createElement('span');
                divider.textContent = '/';
                divider.style.color = 'var(--muted-text-color, #6b7280)';
                divider.style.fontSize = '11px';
                divider.style.fontWeight = '600';
                container.appendChild(divider);
            }

            const comboWrapper = document.createElement('div');
            comboWrapper.style.display = 'flex';
            comboWrapper.style.alignItems = 'center';
            comboWrapper.style.justifyContent = 'center';
            comboWrapper.style.gap = '4px';

            const keys = combo.split('+').map(part => part.trim()).filter(Boolean);
            if (!keys.length) {
                keys.push(combo);
            }

            keys.forEach((keyLabel, keyIdx) => {
                if (keyIdx > 0) {
                    const plusSign = document.createElement('span');
                    plusSign.textContent = '+';
                    plusSign.style.color = 'var(--muted-text-color, #6b7280)';
                    plusSign.style.fontSize = '11px';
                    plusSign.style.fontWeight = '600';
                    comboWrapper.appendChild(plusSign);
                }
                comboWrapper.appendChild(createKeyCapElement(keyLabel));
            });

            container.appendChild(comboWrapper);
        });

        return container;
    };

    const showAutomationRuleDeleteConfirmDialog = (rule, onConfirm) => {
        if (!rule) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            return;
        }
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 420px;
            max-width: 90vw;
        `;

        const ruleName = rule.name || rule.domain || t('未命名规则');
        const ruleDomain = rule.domain || t('（未指定网址）');
        const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
        const deleteAutomationTitle = t('🗑️ 确认删除自动化规则 "{{ruleName}}"？', { ruleName });
        const irreversibleNoticeAutomation = t('❗️ 注意：此操作无法撤销！');

        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteAutomationTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNoticeAutomation}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 12px; border-radius:6px; background-color: var(--button-bg, #f3f4f6);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${ruleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${ruleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280);">${ruleDomain}</span>
                    </div>
                </div>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('自动提交方式：')}<span class="cttf-automation-method-container"></span>
                </p>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('删除')}</button>
            </div>
        `);

        const methodPlaceholder = dialog.querySelector('.cttf-automation-method-container');
        if (methodPlaceholder) {
            const methodDisplay = createMethodDisplay(rule.method);
            methodDisplay.style.justifyContent = 'flex-start';
            methodPlaceholder.replaceWith(methodDisplay);
        }

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        const cancelBtn = dialog.querySelector('#cancelAutomationRuleDelete');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                closeExistingOverlay(overlay);
                currentConfirmOverlay = null;
            });
        }

        const confirmBtn = dialog.querySelector('#confirmAutomationRuleDelete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
                closeExistingOverlay(overlay);
                currentConfirmOverlay = null;
            });
        }
    };

    function renderDomainRules() {
        setTrustedHTML(listBody, '');
        const rules = buttonConfig.domainAutoSubmitSettings;
        let metadataPatched = false;

        if (!rules.length) {
            const emptyState = document.createElement('div');
            emptyState.textContent = t('暂无自动化规则，点击下方“+ 新建”开始配置。');
            emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
            listBody.appendChild(emptyState);
            return;
        }

        rules.forEach((rule, idx) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = 'var(--primary-color, #3B82F6)';
                item.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'var(--border-color, #e5e7eb)';
                item.style.boxShadow = 'none';
            });

            const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
            if (!rule.favicon && rule.domain) {
                rule.favicon = faviconUrl;
                metadataPatched = true;
            }
            const faviconBadge = createFaviconElement(faviconUrl, rule.name || rule.domain, '🌐', { withBackground: false, size: 26 });
            faviconBadge.title = rule.domain || '';

            const iconColumn = document.createElement('div');
            iconColumn.style.display = 'flex';
            iconColumn.style.alignItems = 'center';
            iconColumn.style.justifyContent = 'center';
            iconColumn.style.flex = '0 0 30px';
            iconColumn.appendChild(faviconBadge);

            const infoColumn = document.createElement('div');
            infoColumn.style.display = 'flex';
            infoColumn.style.flexDirection = 'column';
            infoColumn.style.gap = '4px';
            infoColumn.style.minWidth = '0';
            infoColumn.style.flex = '1 1 0%';

            const nameEl = document.createElement('span');
            nameEl.textContent = rule.name || rule.domain || t('未命名规则');
            nameEl.style.fontWeight = '600';
            nameEl.style.fontSize = '14px';
            nameEl.style.color = 'var(--text-color, #1f2937)';

            const domainEl = document.createElement('span');
            domainEl.textContent = rule.domain || '';
            domainEl.style.fontSize = '12px';
            domainEl.style.color = 'var(--muted-text-color, #6b7280)';
            domainEl.style.whiteSpace = 'nowrap';
            domainEl.style.overflow = 'hidden';
            domainEl.style.textOverflow = 'ellipsis';
            domainEl.style.maxWidth = '260px';
            domainEl.title = rule.domain || '';

            infoColumn.appendChild(nameEl);
            infoColumn.appendChild(domainEl);

            const methodDisplay = createMethodDisplay(rule.method || '-');

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #3B82F6);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.backgroundColor = 'rgba(59,130,246,0.12)';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.backgroundColor = 'transparent';
            });
            editBtn.addEventListener('click', () => {
                const ruleToEdit = buttonConfig.domainAutoSubmitSettings[idx];
                showDomainRuleEditorDialog(ruleToEdit, (newData) => {
                    buttonConfig.domainAutoSubmitSettings[idx] = newData;
                    renderDomainRules();
                });
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--danger-color, #ef4444);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'transparent';
            });
            deleteBtn.addEventListener('click', () => {
                const ruleToDelete = buttonConfig.domainAutoSubmitSettings[idx];
                showAutomationRuleDeleteConfirmDialog(ruleToDelete, () => {
                    buttonConfig.domainAutoSubmitSettings.splice(idx, 1);
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderDomainRules();
                });
            });

            const methodColumn = document.createElement('div');
            methodColumn.style.display = 'flex';
            methodColumn.style.alignItems = 'center';
            methodColumn.style.justifyContent = 'center';
            methodColumn.style.flex = '0 0 120px';
            methodColumn.appendChild(methodDisplay);

            const editColumn = document.createElement('div');
            editColumn.style.display = 'flex';
            editColumn.style.alignItems = 'center';
            editColumn.style.justifyContent = 'center';
            editColumn.style.flex = '0 0 40px';
            editColumn.appendChild(editBtn);

            const deleteColumn = document.createElement('div');
            deleteColumn.style.display = 'flex';
            deleteColumn.style.alignItems = 'center';
            deleteColumn.style.justifyContent = 'center';
            deleteColumn.style.flex = '0 0 40px';
            deleteColumn.appendChild(deleteBtn);

            item.appendChild(iconColumn);
            item.appendChild(infoColumn);
            item.appendChild(methodColumn);
            item.appendChild(editColumn);
            item.appendChild(deleteColumn);
            listBody.appendChild(item);
        });
        if (metadataPatched) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        }
    }
    renderDomainRules();

    // 3) 新建按钮
    const addDiv = document.createElement('div');
    addDiv.style.marginTop = '12px';
    addDiv.style.textAlign = 'left';

    const addBtn = document.createElement('button');
    addBtn.textContent = t('+ 新建');
    addBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    addBtn.addEventListener('click', () => {
        showDomainRuleEditorDialog({}, (newData) => {
            buttonConfig.domainAutoSubmitSettings.push(newData);
            renderDomainRules();
        });
    });
    addDiv.appendChild(addBtn);
    dialog.appendChild(addDiv);

}


function showStyleSettingsDialog() {
    // 若已存在则关闭
    if (currentStyleOverlay) {
        closeExistingOverlay(currentStyleOverlay);
    }

    // 使用统一弹窗
    const { overlay, dialog } = createUnifiedDialog({
        title: '🎨 网站样式',
        width: '750px',
        onClose: () => {
            currentStyleOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentStyleOverlay = overlay;

    // 说明文字
    const desc = document.createElement('p');
    desc.textContent = t('您可根据不同网址，自定义按钮栏高度和注入CSS样式。');
    dialog.appendChild(desc);

    // 列表容器
    const styleListContainer = document.createElement('div');
    styleListContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
        margin-bottom: 12px;
    `;

    const styleHeader = document.createElement('div');
    styleHeader.style.cssText = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    const headerColumns = [
        { label: '图标', flex: '0 0 32px', textAlign: 'center' },
        { label: '网站｜网址', flex: '0.7 1 0%', textAlign: 'left', paddingLeft: '4px' },
        { label: '自定义css', flex: '3 1 0%', textAlign: 'center' },
        { label: '高度｜底部', flex: '0 0 110px', textAlign: 'center' },
        { label: '修改', flex: '0 0 40px', textAlign: 'center' },
        { label: '删除', flex: '0 0 40px', textAlign: 'center' }
    ];
    headerColumns.forEach((col) => {
        const column = document.createElement('div');
        column.textContent = col.label;
        column.style.display = 'flex';
        column.style.alignItems = 'center';
        column.style.justifyContent = col.textAlign === 'right' ? 'flex-end'
            : col.textAlign === 'center' ? 'center'
                : 'flex-start';
        column.style.textAlign = col.textAlign;
        column.style.flex = col.flex;
        column.style.fontSize = '12px';
        column.style.fontWeight = '600';
        if (col.paddingLeft) {
            column.style.paddingLeft = col.paddingLeft;
        }
        styleHeader.appendChild(column);
    });

    const styleListBody = document.createElement('div');
    styleListBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    styleListBody.classList.add('hide-scrollbar');

    styleListContainer.appendChild(styleHeader);
    styleListContainer.appendChild(styleListBody);
    dialog.appendChild(styleListContainer);

    const showStyleRuleDeleteConfirmDialog = (styleItem, onConfirm) => {
        if (!styleItem) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            return;
        }

        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 420px;
            max-width: 90vw;
        `;

        const resolvedStyleName = styleItem.name || styleItem.domain || t('未命名样式');
        const resolvedStyleDomain = styleItem.domain || t('（未指定网址）');
        const styleHeight = styleItem.height ? `${styleItem.height}px` : t('默认高度');
        const rawStyleBottomSpacing = (typeof styleItem.bottomSpacing === 'number') ? styleItem.bottomSpacing : buttonConfig.buttonBarBottomSpacing;
        const clampedStyleBottomSpacing = Math.max(-200, Math.min(200, Number(rawStyleBottomSpacing) || 0));
        const styleBottomSpacing = `${clampedStyleBottomSpacing}px`;
        const faviconUrl = styleItem.favicon || generateDomainFavicon(styleItem.domain);
        const cssRaw = (styleItem.cssCode || '').trim();
        const cssContent = cssRaw || t('（未配置自定义 CSS）');
        const cssLineCount = cssContent.split('\n').length;
        const cssTextareaHeight = Math.min(Math.max(cssLineCount, 6), 24) * 18;
        const escapeHtml = (str = '') => String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        const safeStyleName = escapeHtml(resolvedStyleName);
        const safeStyleDomain = escapeHtml(resolvedStyleDomain);
        const styleDeleteTitle = escapeHtml(t('确认删除样式 "{{styleName}}"？', { styleName: resolvedStyleName }));
        const irreversibleNoticeStyle = t('❗️ 注意：此操作无法撤销！');
        const spacingTitle = escapeHtml(t('按钮栏距页面底部的间距'));

        setTrustedHTML(dialog, `
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:4px;">
                <h3 style="margin:0; font-size:18px; font-weight:700; color: var(--danger-color, #ef4444); display:flex; align-items:center; gap:8px;">
                    <span aria-hidden="true">🗑️</span>
                    <span>${styleDeleteTitle}</span>
                </h3>
                <p style="margin:0; color: var(--text-color, #333333); font-size:13px;">${irreversibleNoticeStyle}</p>
            </div>
            <div style="margin: 0 0 22px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 18px; border-radius:8px; background-color: var(--button-bg, #f3f4f6); display:flex; flex-direction:column; gap:16px;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${safeStyleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${safeStyleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;" title="${safeStyleDomain}">${safeStyleDomain}</span>
                    </div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:600; color: var(--muted-text-color, #6b7280); white-space:nowrap;">${t('按钮栏高度')}</span>
                        <span style="
                            padding:6px 12px;
                            background-color: rgba(16,185,129,0.16);
                            color: var(--success-color, #22c55e);
                            border-radius:999px;
                            font-size:12px;
                            font-weight:600;
                            white-space:nowrap;
                        ">${escapeHtml(styleHeight)}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:600; color: var(--muted-text-color, #6b7280); white-space:nowrap;">${t('距页面底部')}</span>
                        <span style="
                            padding:6px 12px;
                            background-color: rgba(59,130,246,0.16);
                            color: var(--primary-color, #3B82F6);
                            border-radius:999px;
                            font-size:12px;
                            font-weight:600;
                            white-space:nowrap;
                        " title="${spacingTitle}">${escapeHtml(styleBottomSpacing)}</span>
                    </div>
                </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <label style="font-size:13px; font-weight:600; color: var(--text-color, #333333); display:flex; align-items:center; gap:6px;">
                            <span aria-hidden="true">🧶</span>
                        <span>${t('自定义 CSS')}</span>
                        </label>
                    <textarea readonly style="
                        width:100%;
                        min-height:${cssTextareaHeight}px;
                        max-height:360px;
                        background-color: var(--input-bg, var(--dialog-bg, #ffffff));
                        color: var(--input-text-color, var(--text-color, #333333));
                        border:1px solid var(--input-border-color, var(--border-color, #d1d5db));
                        border-radius:6px;
                        padding:12px;
                        font-size:13px;
                        line-height:1.6;
                        resize:vertical;
                        font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                        box-shadow: inset 0 1px 2px rgba(15,23,42,0.08);
                        white-space:pre-wrap;
                        word-break:break-word;
                        overflow-wrap:break-word;
                    ">${escapeHtml(cssContent)}</textarea>
                </div>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
                margin-top:4px;
            ">
                <button id="cancelStyleRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmStyleRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('删除')}</button>
            </div>
        `);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelStyleRuleDelete')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmStyleRuleDelete')?.addEventListener('click', () => {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });
    };

    function renderDomainStyles() {
        setTrustedHTML(styleListBody, '');
        const styles = buttonConfig.domainStyleSettings;
        let metadataPatched = false;

        if (!styles.length) {
            const emptyState = document.createElement('div');
            emptyState.textContent = t('尚未配置任何样式，点击下方“+ 新建”添加。');
            emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
            styleListBody.appendChild(emptyState);
            return;
        }

        styles.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
            row.addEventListener('mouseenter', () => {
                row.style.borderColor = 'var(--info-color, #6366F1)';
                row.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.borderColor = 'var(--border-color, #e5e7eb)';
                row.style.boxShadow = 'none';
            });

            const faviconUrl = item.favicon || generateDomainFavicon(item.domain);
            if (!item.favicon && item.domain) {
                item.favicon = faviconUrl;
                metadataPatched = true;
            }
            const faviconBadge = createFaviconElement(faviconUrl, item.name || item.domain, '🎨', { withBackground: false, size: 26 });
            faviconBadge.title = item.domain || t('自定义样式');

            const iconColumn = document.createElement('div');
            iconColumn.style.display = 'flex';
            iconColumn.style.alignItems = 'center';
            iconColumn.style.justifyContent = 'center';
            iconColumn.style.flex = '0 0 30px';
            iconColumn.appendChild(faviconBadge);

            const siteColumn = document.createElement('div');
            siteColumn.style.display = 'flex';
            siteColumn.style.flexDirection = 'column';
            siteColumn.style.gap = '4px';
            siteColumn.style.minWidth = '100px';
            siteColumn.style.flex = '0.7 1 0%';

            const nameEl = document.createElement('span');
            nameEl.textContent = item.name || t('未命名样式');
            nameEl.style.fontWeight = '600';
            nameEl.style.fontSize = '14px';
            nameEl.style.color = 'var(--text-color, #1f2937)';

            const domainEl = document.createElement('span');
            domainEl.textContent = item.domain || t('未设置域名');
            domainEl.style.fontSize = '12px';
            domainEl.style.color = 'var(--muted-text-color, #6b7280)';
            domainEl.style.whiteSpace = 'nowrap';
            domainEl.style.overflow = 'hidden';
            domainEl.style.textOverflow = 'ellipsis';
            domainEl.style.maxWidth = '100%';

            const cssSnippet = (item.cssCode || '').replace(/\s+/g, ' ').trim();
            const snippetText = cssSnippet
                ? (cssSnippet.length > 80 ? `${cssSnippet.slice(0, 80)}…` : cssSnippet)
                : t('无自定义CSS');

            const cssPreview = document.createElement('code');
            cssPreview.textContent = snippetText;
            cssPreview.style.cssText = `
                display: block;
                width: 100%;
                font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 12px;
                color: var(--muted-text-color, #6b7280);
                background-color: rgba(17,24,39,0.04);
                border-radius: 4px;
                padding: 4px 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            `;
            cssPreview.title = item.cssCode || '无自定义CSS';

            siteColumn.appendChild(nameEl);
            siteColumn.appendChild(domainEl);

            const cssColumn = document.createElement('div');
            cssColumn.style.cssText = `
                flex: 3 1 0%;
                min-width: 0;
                max-width: 100%;
                display: flex;
                align-items: center;
                padding-right: 12px;
            `;
            cssColumn.appendChild(cssPreview);

        const heightColumn = document.createElement('div');
        heightColumn.style.display = 'flex';
        heightColumn.style.alignItems = 'center';
        heightColumn.style.justifyContent = 'center';
        heightColumn.style.flex = '0 0 110px';
        heightColumn.style.gap = '6px';
        heightColumn.style.flexWrap = 'wrap';

        const heightBadge = document.createElement('span');
        heightBadge.textContent = item.height ? `${item.height}px` : t('默认高度');
        heightBadge.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(16,185,129,0.12);
            color: var(--success-color, #22c55e);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        `;

        const bottomSpacingValue = (typeof item.bottomSpacing === 'number') ? item.bottomSpacing : buttonConfig.buttonBarBottomSpacing;
        const clampedBottomSpacingValue = Math.max(-200, Math.min(200, Number(bottomSpacingValue) || 0));
        const bottomBadge = document.createElement('span');
        bottomBadge.textContent = `${clampedBottomSpacingValue}px`;
        bottomBadge.title = t('按钮栏距页面底部间距');
        bottomBadge.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(59,130,246,0.12);
            color: var(--primary-color, #3B82F6);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        `;

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #3B82F6);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.backgroundColor = 'rgba(59,130,246,0.12)';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.backgroundColor = 'transparent';
            });
            editBtn.addEventListener('click', () => {
                showEditDomainStyleDialog(idx);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--danger-color, #ef4444);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'transparent';
            });
            deleteBtn.addEventListener('click', () => {
                const styleToDelete = buttonConfig.domainStyleSettings[idx];
                showStyleRuleDeleteConfirmDialog(styleToDelete, () => {
                    buttonConfig.domainStyleSettings.splice(idx, 1);
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderDomainStyles();
                    // 删除后应用默认/其他匹配样式
                    try { applyDomainStyles(); } catch (_) {}
                });
            });

        heightColumn.appendChild(heightBadge);
        heightColumn.appendChild(bottomBadge);

            const editColumn = document.createElement('div');
            editColumn.style.display = 'flex';
            editColumn.style.alignItems = 'center';
            editColumn.style.justifyContent = 'center';
            editColumn.style.flex = '0 0 40px';
            editColumn.appendChild(editBtn);

            const deleteColumn = document.createElement('div');
            deleteColumn.style.display = 'flex';
            deleteColumn.style.alignItems = 'center';
            deleteColumn.style.justifyContent = 'center';
            deleteColumn.style.flex = '0 0 40px';
            deleteColumn.appendChild(deleteBtn);

            row.appendChild(iconColumn);
            row.appendChild(siteColumn);
            row.appendChild(cssColumn);
            row.appendChild(heightColumn);
            row.appendChild(editColumn);
            row.appendChild(deleteColumn);
            styleListBody.appendChild(row);
        });
        if (metadataPatched) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        }
    }
    renderDomainStyles();

    // 新建
    const addStyleBtn = document.createElement('button');
    addStyleBtn.textContent = t('+ 新建');
    addStyleBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        margin-bottom: 12px;
    `;
    addStyleBtn.addEventListener('click', () => {
        showEditDomainStyleDialog(); // 新建
    });
    dialog.appendChild(addStyleBtn);

    // 右上角关闭并保存
    const closeSaveBtn = document.createElement('button');
    closeSaveBtn.textContent = t('💾 关闭并保存');
    closeSaveBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute;
        top: 20px;
        right: 20px;
    `;
    closeSaveBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        // 关闭前应用一次，确保当前页面即时生效
        try { applyDomainStyles(); } catch (_) {}
        closeExistingOverlay(overlay);
        currentStyleOverlay = null;
    });
    dialog.style.position = 'relative';
    dialog.appendChild(closeSaveBtn);

}
