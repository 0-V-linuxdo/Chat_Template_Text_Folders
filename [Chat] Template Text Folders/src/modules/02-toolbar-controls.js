/* -------------------------------------------------------------------------- *
 * Module 02 · Toolbar UI (folder buttons, popovers, quick input tools)
 * -------------------------------------------------------------------------- */

    const formatButtonDisplayLabel = (label) => {
        if (typeof label !== 'string') {
            return '';
        }
        const firstSpaceIndex = label.indexOf(' ');
        if (firstSpaceIndex > 0 && firstSpaceIndex < label.length - 1) {
            const leadingSegment = label.slice(0, firstSpaceIndex);
            const remainingText = label.slice(firstSpaceIndex + 1);

            // 如果前缀没有字母或数字（通常是emoji/符号），且长度不超过4，则将首个空格替换为不换行空格
            const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
            if (!hasAlphaNumeric && leadingSegment.length <= 4 && remainingText.trim().length > 0) {
                return `${leadingSegment}\u00A0${remainingText}`;
            }
        }
        return label;
    };

    const extractButtonIconParts = (label) => {
        if (typeof label !== 'string') {
            return { iconSymbol: '', textLabel: '' };
        }

        const trimmedStart = label.trimStart();
        if (!trimmedStart) {
            return { iconSymbol: '', textLabel: '' };
        }

        const firstSpaceIndex = trimmedStart.indexOf(' ');
        if (firstSpaceIndex > 0) {
            const leadingSegment = trimmedStart.slice(0, firstSpaceIndex);
            const remaining = trimmedStart.slice(firstSpaceIndex + 1).trimStart();
            const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
            if (!hasAlphaNumeric) {
                return {
                    iconSymbol: leadingSegment,
                    textLabel: remaining || trimmedStart
                };
            }
        }

        const charUnits = Array.from(trimmedStart);
        const firstChar = charUnits[0] || '';
        if (firstChar && !/[0-9A-Za-z\u4E00-\u9FFF]/.test(firstChar)) {
            const remaining = trimmedStart.slice(firstChar.length).trimStart();
            return {
                iconSymbol: firstChar,
                textLabel: remaining || trimmedStart
            };
        }

        return {
            iconSymbol: '',
            textLabel: trimmedStart
        };
    };

    const createCustomButtonElement = (name, config) => {
        const button = document.createElement('button');
        const { iconSymbol, textLabel } = extractButtonIconParts(name);
        const labelForDisplay = textLabel || name || '';
        const displayLabel = formatButtonDisplayLabel(labelForDisplay);
        let fallbackSymbolSource = iconSymbol || (Array.from(labelForDisplay.trim())[0] || '🔖');
        if (config.type === 'tool' && TOOL_DEFAULT_ICONS[config.action]) {
            fallbackSymbolSource = TOOL_DEFAULT_ICONS[config.action];
        }
        button.textContent = '';
        button.setAttribute('data-original-label', name);
        button.type = 'button';
        button.style.backgroundColor = config.color;
        button.style.color = config.textColor || '#333333';
        button.style.border = '1px solid rgba(0,0,0,0.1)';
        button.style.borderRadius = '4px';
        button.style.padding = '6px 12px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.transition = 'all 0.2s ease';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        button.style.marginBottom = '6px';
        button.style.width = 'fit-content';
        button.style.textAlign = 'left';
        button.style.display = 'block';

        const contentWrapper = document.createElement('span');
        contentWrapper.style.display = 'inline-flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.gap = '8px';

        const iconWrapper = document.createElement('span');
        iconWrapper.style.display = 'inline-flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        iconWrapper.style.width = '18px';
        iconWrapper.style.height = '18px';
        iconWrapper.style.flexShrink = '0';
        iconWrapper.style.borderRadius = '4px';
        iconWrapper.style.overflow = 'hidden';

        const createFallbackIcon = (symbol) => {
            const fallbackSpan = document.createElement('span');
            fallbackSpan.textContent = symbol;
            fallbackSpan.style.fontSize = '14px';
            fallbackSpan.style.lineHeight = '1';
            fallbackSpan.style.display = 'inline-flex';
            fallbackSpan.style.alignItems = 'center';
            fallbackSpan.style.justifyContent = 'center';
            return fallbackSpan;
        };

        const faviconUrl = (config && typeof config.favicon === 'string') ? config.favicon.trim() : '';
        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.alt = (labelForDisplay || name || '').trim() || 'icon';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.loading = 'lazy';
            img.referrerPolicy = 'no-referrer';
            img.decoding = 'async';
            img.onerror = () => {
                iconWrapper.textContent = '';
                iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
            };
            iconWrapper.appendChild(img);
        } else {
            iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = displayLabel;
        textSpan.style.display = 'inline-flex';
        textSpan.style.alignItems = 'center';

        contentWrapper.appendChild(iconWrapper);
        contentWrapper.appendChild(textSpan);
        button.appendChild(contentWrapper);
        // 鼠标悬停显示按钮模板文本
        button.title = config.text || '';
        // 确保嵌套元素不会拦截点击或拖拽事件
        contentWrapper.style.pointerEvents = 'none';
        textSpan.style.pointerEvents = 'none';
        iconWrapper.style.pointerEvents = 'none';
        return button;
    };

    const currentlyOpenFolder = {
        name: null,
        element: null
    };

    const showTemporaryFeedback = (element, message) => {
        const feedback = document.createElement('span');
        feedback.textContent = message;
        feedback.style.position = 'absolute';
        feedback.style.bottom = '10px';
        feedback.style.right = '10px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.color = '#fff';
        feedback.style.padding = '4px 8px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '10001';
        element.parentElement.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    const handleCut = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
            insertTextSmart(element, '', true);
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
            insertTextSmart(element, '', true);
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('✅ 已剪切输入框内容到剪贴板。'));
                showTemporaryFeedback(element, '剪切成功');
            }).catch(err => {
                console.error("剪切失败:", err);
                alert(t('剪切失败，请检查浏览器权限。'));
            });
        }
    };

    const handleCopy = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('✅ 已复制输入框内容到剪贴板。'));
                showTemporaryFeedback(element, '复制成功');
            }).catch(err => {
                console.error("复制失败:", err);
                alert(t('复制失败，请检查浏览器权限。'));
            });
        }
    };

    const handlePaste = async (element) => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            insertTextSmart(element, clipboardText);
            console.log(t('✅ 已粘贴剪贴板内容到输入框。'));
            showTemporaryFeedback(element, '粘贴成功');
        } catch (err) {
            console.error("粘贴失败:", err);
            alert(t('粘贴失败，请检查浏览器权限。'));
        }
    };

    const handleClear = (element) => {
        insertTextSmart(element, '', true);
        console.log(t('✅ 输入框内容已清空。'));
        showTemporaryFeedback(element, '清空成功');
    };

    createCustomButton = (name, config, folderName) => {
        const button = createCustomButtonElement(name, config, folderName);
        button.setAttribute('draggable', 'true');
        button.setAttribute('data-button-name', name);
        button.setAttribute('data-folder-name', folderName);

        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: name,
                sourceFolder: folderName,
                config: config
            }));
            e.currentTarget.style.opacity = '0.5';
        });

        button.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const focusedElement = document.activeElement;
            if (focusedElement && (focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                setTimeout(() => focusedElement.focus(), 0);
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        });

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (config.type === "template") {
                const focusedElement = document.activeElement;
                if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                    console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                    return;
                }

                const needsClipboard = config.text.includes('{clipboard}') || config.text.includes('{{inputboard}|{clipboard}}');

                let clipboardText = '';
                if (needsClipboard) {
                    try {
                        clipboardText = await navigator.clipboard.readText();
                    } catch (err) {
                        console.error("无法访问剪贴板内容:", err);
                        alert(t('无法访问剪贴板内容。请检查浏览器权限。'));
                        return;
                    }
                }

                let inputBoxText = '';
                if (focusedElement.tagName.toLowerCase() === 'textarea') {
                    inputBoxText = focusedElement.value;
                } else {
                    const childNodes = Array.from(focusedElement.childNodes);
                    const textParts = [];
                    let lastWasBr = false;
                    childNodes.forEach((node, index) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (node.textContent.trim() === '') {
                                if (!lastWasBr && index > 0) {
                                    textParts.push('\n');
                                }
                            } else {
                                textParts.push(node.textContent);
                                lastWasBr = false;
                            }
                        } else if (node.nodeName === 'BR') {
                            textParts.push('\n');
                            lastWasBr = true;
                        } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                            if (node.textContent.trim() === '') {
                                textParts.push('\n');
                            } else {
                                if (textParts.length > 0) {
                                    textParts.push('\n');
                                }
                                textParts.push(node.textContent);
                            }
                            lastWasBr = false;
                        }
                    });
                    inputBoxText = textParts.join('');
                }

                const selectionText = window.getSelection().toString();
                let finalText = config.text;

                const variableMap = {
                    '{{inputboard}|{clipboard}}': inputBoxText.trim() || clipboardText,
                    '{clipboard}': clipboardText,
                    '{inputboard}': inputBoxText,
                    '{selection}': selectionText
                };

                const replacementOrder = [
                    '{{inputboard}|{clipboard}}',
                    '{clipboard}',
                    '{inputboard}',
                    '{selection}'
                ];

                const placeholderMap = new Map();
                let placeholderCounter = 0;

                replacementOrder.forEach(variable => {
                    if (finalText.includes(variable)) {
                        const placeholder = `__SAFE_PLACEHOLDER_${placeholderCounter++}__`;
                        placeholderMap.set(placeholder, variableMap[variable]);
                        finalText = finalText.split(variable).join(placeholder);
                    }
                });

                placeholderMap.forEach((value, placeholder) => {
                    finalText = finalText.split(placeholder).join(value);
                });

                finalText = finalText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                const containsInputboard = config.text.includes("{inputboard}") ||
                    config.text.includes("{{inputboard}|{clipboard}}");

                if (containsInputboard) {
                    insertTextSmart(focusedElement, finalText, true);
                    console.log(t('✅ 使用 {inputboard} 变量，输入框内容已被替换。'));
                } else {
                    insertTextSmart(focusedElement, finalText, false);
                    console.log(t('✅ 插入了预设文本。'));
                }

                if (config.autoSubmit) {
                    try {
                        await waitForContentMatch(focusedElement, finalText, 100, 3000);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        const success = await submitForm();
                        if (success) {
                            console.log(t('✅ 自动提交成功（已确认内容替换完成）。'));
                        } else {
                            console.warn(t('⚠️ 自动提交失败。'));
                        }
                    } catch (error) {
                        console.error("自动提交前检测文本匹配超时或错误:", error);
                    }
                }

            } else if (config.type === "tool") {
                const focusedElement = document.activeElement;
                if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                    console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                    return;
                }
                switch (config.action) {
                    case "cut":
                        handleCut(focusedElement);
                        break;
                    case "copy":
                        handleCopy(focusedElement);
                        break;
                    case "paste":
                        handlePaste(focusedElement);
                        break;
                    case "clear":
                        handleClear(focusedElement);
                        break;
                    default:
                        console.warn(t('未知的工具按钮动作: {{action}}', { action: config.action }));
                }
            }

            if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element) {
                currentlyOpenFolder.element.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('✅ 弹窗 "{{folderName}}" 已立即关闭。', { folderName }));
            } else {
                console.warn(t('⚠️ 弹窗 "{{folderName}}" 未被识别为当前打开的弹窗。', { folderName }));
            }
        });

        return button;
    };

    const createFolderButton = (folderName, folderConfig) => {
        const folderButton = document.createElement('button');
        folderButton.innerText = folderName;
        folderButton.type = 'button';
        folderButton.style.backgroundColor = folderConfig.color;
        folderButton.style.color = folderConfig.textColor || '#ffffff';
        folderButton.style.border = 'none';
        folderButton.style.borderRadius = '4px';
        folderButton.style.padding = '6px 12px';
        folderButton.style.cursor = 'pointer';
        folderButton.style.fontSize = '14px';
        folderButton.style.fontWeight = '500';
        folderButton.style.transition = 'all 0.2s ease';
        folderButton.style.position = 'relative';
        folderButton.style.display = 'inline-flex';
        folderButton.style.alignItems = 'center';
        folderButton.style.whiteSpace = 'nowrap';
        folderButton.style.zIndex = '99';
        folderButton.classList.add('folder-button');
        folderButton.setAttribute('data-folder', folderName);

        folderButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        folderButton.addEventListener('mouseleave', () => {
            folderButton.style.transform = 'scale(1)';
            folderButton.style.boxShadow = 'none';
        });

        const buttonListContainer = document.createElement('div');
        buttonListContainer.style.position = 'fixed';
        buttonListContainer.style.display = 'none';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.backgroundColor = 'var(--folder-bg, rgba(255, 255, 255, 0.8))';
        buttonListContainer.style.backdropFilter = 'blur(5px)';
        buttonListContainer.style.border = `1px solid var(--border-color, #e5e7eb)`;
        buttonListContainer.style.borderRadius = '8px';
        buttonListContainer.style.padding = '10px';
        buttonListContainer.style.paddingBottom = '2.5px';
        buttonListContainer.style.boxShadow = `0 4px 12px var(--shadow-color, rgba(0,0,0,0.1))`;
        buttonListContainer.style.zIndex = '100';
        buttonListContainer.style.maxHeight = '800px';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.transition = 'all 0.3s ease';
        buttonListContainer.classList.add('button-list');
        buttonListContainer.setAttribute('data-folder-list', folderName);
        buttonListContainer.style.pointerEvents = 'auto';

        Object.entries(folderConfig.buttons).forEach(([name, config]) => {
            const customButton = createCustomButton(name, config, folderName);
            buttonListContainer.appendChild(customButton);
        });

        folderButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle popup visibility
            if (currentlyOpenFolder.name === folderName) {
                // 如果当前文件夹已经打开，则关闭它
                buttonListContainer.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('🔒 弹窗 "{{folderName}}" 已关闭。', { folderName }));
            } else {
                // 关闭其他文件夹的弹窗
                if (currentlyOpenFolder.element) {
                    currentlyOpenFolder.element.style.display = 'none';
                    console.log(t('🔒 弹窗 "{{folderName}}" 已关闭。', { folderName: currentlyOpenFolder.name }));
                }
                // 打开当前文件夹的弹窗
                buttonListContainer.style.display = 'flex';
                currentlyOpenFolder.name = folderName;
                currentlyOpenFolder.element = buttonListContainer;
                console.log(t('🔓 弹窗 "{{folderName}}" 已打开。', { folderName }));
                // 动态定位弹窗位置
                const rect = folderButton.getBoundingClientRect();
                buttonListContainer.style.bottom = `40px`;
                buttonListContainer.style.left = `${rect.left + window.scrollX - 20}px`;
                console.log(t('📍 弹窗位置设置为 Bottom: 40px, Left: {{left}}px', {
                    left: Math.round(rect.left + window.scrollX - 20)
                }));
            }
        });

        document.addEventListener('click', (e) => {
            const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
            const clickedInsideButton = path.includes(folderButton);
            const clickedInsideList = path.includes(buttonListContainer);
            if (!clickedInsideButton && !clickedInsideList) {
                // 点击了其他地方，关闭弹窗
                if (buttonListContainer.style.display !== 'none') {
                    buttonListContainer.style.display = 'none';
                    if (currentlyOpenFolder.name === folderName) {
                        currentlyOpenFolder.name = null;
                        currentlyOpenFolder.element = null;
                        console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（点击外部区域）。', { folderName }));
                    }
                }
            }
        });

        appendToMainLayer(buttonListContainer);
        return folderButton;
    };

    const toggleFolder = (folderName, state) => {
        const buttonList = queryUI(`.button-list[data-folder-list="${folderName}"]`);
        if (!buttonList) {
            console.warn(t('⚠️ 未找到与文件夹 "{{folderName}}" 关联的弹窗。', { folderName }));
            return;
        }
        if (state) {
            // 打开当前文件夹的弹窗
            buttonList.style.display = 'flex';
            currentlyOpenFolder.name = folderName;
            currentlyOpenFolder.element = buttonList;
            console.log(t('🔓 弹窗 "{{folderName}}" 已打开（toggleFolder）。', { folderName }));
        } else {
            // 关闭当前文件夹的弹窗
            buttonList.style.display = 'none';
            if (currentlyOpenFolder.name === folderName) {
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（toggleFolder）。', { folderName }));
            }
        }
        // 关闭其他文件夹的弹窗
        const root = getShadowRoot();
        const allButtonLists = root ? Array.from(root.querySelectorAll('.button-list')) : [];
        allButtonLists.forEach(bl => {
            if (bl.getAttribute('data-folder-list') !== folderName) {
                bl.style.display = 'none';
                const fname = bl.getAttribute('data-folder-list');
                if (currentlyOpenFolder.name === fname) {
                    currentlyOpenFolder.name = null;
                    currentlyOpenFolder.element = null;
                    console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（toggleFolder 关闭其他弹窗）。', { folderName: fname }));
                }
            }
        });
    };

    const closeExistingOverlay = (overlay) => {
        if (overlay && overlay.parentElement) {
            // 添加关闭动画
            overlay.style.opacity = '0';

            // 立即标记为已关闭，避免重复操作
            overlay.setAttribute('data-closing', 'true');

            // 延时移除DOM元素，确保动画完成
            setTimeout(() => {
                if (overlay.parentElement && overlay.getAttribute('data-closing') === 'true') {
                    overlay.parentElement.removeChild(overlay);
                    console.log(t('🔒 弹窗已关闭并从DOM中移除'));
                }
            }, 300);
        } else {
            console.warn(t('⚠️ 尝试关闭不存在的弹窗'));
        }
    };

    let currentConfirmOverlay = null;
    let currentSettingsOverlay = null;
    let isSettingsFolderPanelCollapsed = false;
    let settingsDialogMainContainer = null;
    let currentStyleOverlay = null;

    const showDeleteFolderConfirmDialog = (folderName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const folderConfig = buttonConfig.folders[folderName];
        if (!folderConfig) {
            alert(t('文件夹 "{{folderName}}" 不存在。', { folderName }));
            return;
        }
        // 构建文件夹内自定义按钮的垂直预览列表
        let buttonsPreviewHTML = '';
        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
            buttonsPreviewHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: 1px solid rgba(0,0,0,0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                        margin-right: 8px;
                    " disabled>${btnName}</button>
                    <span style="font-size: 12px; color: var(--text-color);">${btnName}</span>
                </div>
            `;
        });

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
            z-index: 11000;
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
            padding: 20px 24px 16px 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        const deleteFolderTitle = t('🗑️ 确认删除文件夹 "{{folderName}}"？', { folderName });
        const irreversibleNotice = t('❗️ 注意：此操作无法撤销！');
        const deleteFolderWarning = t('（删除文件夹将同时删除其中的所有自定义按钮！）');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteFolderTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNotice}<br/>${deleteFolderWarning}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <!-- 将文件夹按钮预览和文字标签放在一行 -->
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('1️⃣ 文件夹按钮外观：')}</strong>
                    <button style="
                        background-color: ${folderConfig.color};
                        color: ${folderConfig.textColor};
                        border: none;
                        border-radius:4px;
                        padding:6px 12px;
                        cursor: default;
                        font-size:14px;
                        font-weight:500;
                        box-shadow: none;
                    " disabled>${folderName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮名称：')} ${folderName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('背景颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('文字颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('2️⃣ 文件夹内，全部自定义按钮：')}</strong></p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${buttonsPreviewHTML}
                </div>
            </div>
            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="confirmDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius: 4px;
                ">${t('删除')}</button>
            </div>
        `);
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteFolder').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteFolder').addEventListener('click', () => {
            delete buttonConfig.folders[folderName];
            const idx = buttonConfig.folderOrder.indexOf(folderName);
            if (idx > -1) buttonConfig.folderOrder.splice(idx, 1);
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('🗑️ 文件夹 "{{folderName}}" 已删除。', { folderName }));
            // 更新按钮栏
            updateButtonContainer();
        });
    };

    // 修改 删除按钮确认对话框，增加显示按钮名称、颜色信息及样式预览
    const showDeleteButtonConfirmDialog = (folderName, btnName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const btnCfg = buttonConfig.folders[folderName].buttons[btnName];
        if (!btnCfg) {
            alert(t('按钮 "{{buttonName}}" 不存在于文件夹 "{{folderName}}" 中。', {
                buttonName: btnName,
                folderName
            }));
            return;
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
            z-index: 11000;
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
            padding: 20px 24px 16px 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        const deleteButtonTitle = t('🗑️ 确认删除按钮 "{{buttonName}}"？', { buttonName: btnName });
        const irreversibleShort = t('❗️ 注意：此操作无法撤销！');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteButtonTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleShort}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('1️⃣ 自定义按钮外观：')}</strong>
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                    " disabled>${btnName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮名称：')} ${btnName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮背景颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮文字颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('2️⃣ 按钮对应的文本模板：')}</strong></p>
                <textarea readonly style="
                    width:100%;
                    height:150px;
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:4px;
                    resize: vertical;
                ">${btnCfg.text || ''}</textarea>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmDeleteButton" style="
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

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteButton').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteButton').addEventListener('click', () => {
            delete buttonConfig.folders[folderName].buttons[btnName];
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('🗑️ 按钮 "{{buttonName}}" 已删除。', { buttonName: btnName }));
            // 更新按钮栏
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const showButtonEditDialog = (folderName, btnName = '', btnConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        // 禁止编辑/删除工具文件夹中的工具按钮
        if (folderName === "🖱️" && btnConfig.type === "tool") {
            alert(t('工具文件夹中的工具按钮无法编辑或删除。'));
            return;
        }
        const isEdit = btnName !== '';

        // Create overlay and dialog containers
        const overlay = document.createElement('div');
        overlay.classList.add('edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = btnName || '';
        const initialColor = btnConfig.color || '#FFC1CC';
        const initialTextColor = btnConfig.textColor || '#333333';
        const initialAutoSubmit = btnConfig.autoSubmit || false; // 新增字段
        const initialFavicon = typeof btnConfig.favicon === 'string' ? btnConfig.favicon : '';

        // 预览部分
        const buttonHeaderText = isEdit ? t('✏️ 编辑按钮：') : t('🆕 新建按钮：');
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${buttonHeaderText}
                </div>
                <div id="buttonPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || t('预览按钮')}</button>
                </div>
            </div>
        `;

        // Tab content for text template
        const textTemplateTab = `
        <div id="textTemplateTab" class="tab-content" style="display: block;">
            <div style="
                width: 100%;
                padding: 12px;
                border-radius: 4px;
                border: 1px solid var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                ">
                    <label style="
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        white-space: nowrap;
                    ">${t('插入变量：')}</label>
                    <div id="quickInsertButtons" style="
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                    ">
                        <button type="button" data-insert="{inputboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">📝 ${t('输入框')}</button>
                        <button type="button" data-insert="{clipboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('📋 剪贴板')}</button>
                        <button type="button" data-insert="{selection}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('🔍 选中')}</button>
                        <button type="button" data-insert="{{inputboard}|{clipboard}}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('🔄 输入框/剪贴板')}</button>
                    </div>
                </div>
                <textarea id="buttonText" style="
                    width: 100%;
                    height: 150px;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid var(--border-color, #e5e7eb);
                    background-color: var(--dialog-bg, #ffffff);
                    color: var(--text-color, #333333);
                    resize: vertical;
                ">${btnConfig.text || ''}</textarea>
            </div>
        </div>`;

        // Tab content for style settings
        const styleSettingsTab = `
            <div id="styleSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮名称：')}</label>
                    <input type="text" id="buttonName" value="${btnName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮图标：')}</label>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div id="buttonFaviconPreview" style="
                            width: 40px;
                            height: 40px;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: transparent;
                            flex-shrink: 0;
                        "></div>
                        <div style="flex: 1 1 auto; display: flex; flex-direction: column;">
                            <textarea id="buttonFaviconInput" rows="1" style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid var(--border-color, #d1d5db);
                                border-radius: 6px;
                                background-color: var(--dialog-bg, #ffffff);
                                box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
                                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                                outline: none;
                                font-size: 14px;
                                line-height: 1.5;
                                resize: vertical;
                                overflow-y: hidden;
                            " placeholder="${t('支持 https:// 链接或 data: URL')}">${initialFavicon}</textarea>
                            <div style="
                                margin-top: 6px;
                                font-size: 12px;
                                color: var(--muted-text-color, #6b7280);
                            ">${t('留空时将根据按钮名称中的符号展示默认图标。')}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮背景颜色：')}</label>
                    <input type="color" id="buttonColor" value="${btnConfig.color || '#FFC1CC'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮文字颜色：')}</label>
                    <input type="color" id="buttonTextColor" value="${btnConfig.textColor || '#333333'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 新增的提交设置子标签页
        const submitSettingsTab = `
            <div id="submitSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        cursor: pointer;
                        gap: 6px;
                    ">
                        <input type="checkbox" id="autoSubmitCheckbox" style="cursor: pointer;" ${initialAutoSubmit ? 'checked' : ''}>
                        ${t('自动提交 (在填充后自动提交内容)')}
                    </label>
                </div>
            </div>
        `;

        // Tab navigation
        const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="textTemplateTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('文本模板')}</button>
                <button class="tab-button" data-tab="styleSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('样式设置')}</button>
                <button class="tab-button" data-tab="submitSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('提交设置')}</button>
            </div>
        `;

        // Footer buttons
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="saveButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('确认')}</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${tabNavigation}
            ${textTemplateTab}
            ${styleSettingsTab}
            ${submitSettingsTab}
            ${footerButtons}
        `);

        // Add tab switching functionality
        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.dataset.tab;
                    // Update button styles
                    tabButtons.forEach(btn => {
                        if (btn === button) {
                            btn.style.backgroundColor = 'var(--primary-color, #3B82F6)';
                            btn.style.color = 'white';
                            btn.style.borderBottom = '2px solid var(--primary-color, #3B82F6)';
                        } else {
                            btn.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                            btn.style.color = 'var(--text-color, #333333)';
                            btn.style.borderBottom = '2px solid transparent';
                        }
                    });
                    // Show/hide content
                    tabContents.forEach(content => {
                        content.style.display = content.id === tabId ? 'block' : 'none';
                    });
                });
            });
        };

        // Rest of the existing dialog setup code...
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Setup tabs
        setupTabs();

        // Setup preview updates
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const buttonNameInput = dialog.querySelector('#buttonName');
            const buttonColorInput = dialog.querySelector('#buttonColor');
            const buttonTextColorInput = dialog.querySelector('#buttonTextColor');
            const autoSubmitCheckbox = dialog.querySelector('#autoSubmitCheckbox'); // 新增引用
            const buttonFaviconInput = dialog.querySelector('#buttonFaviconInput');
            const buttonFaviconPreview = dialog.querySelector('#buttonFaviconPreview');

            const updateFaviconPreview = () => {
                if (!buttonFaviconPreview) return;
                const currentName = buttonNameInput?.value.trim() || initialName || '';
                const faviconValue = buttonFaviconInput?.value.trim() || '';
                const { iconSymbol } = extractButtonIconParts(currentName);
                const fallbackSymbol = iconSymbol || (Array.from(currentName.trim())[0] || '🔖');
                const previewElement = createFaviconElement(
                    faviconValue,
                    currentName,
                    fallbackSymbol,
                    { withBackground: false }
                );
                setTrustedHTML(buttonFaviconPreview, '');
                buttonFaviconPreview.appendChild(previewElement);
            };

            buttonNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || t('预览按钮');
                updateFaviconPreview();
            });

            buttonColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            buttonTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });

            // 监听“自动提交”开关变化
            autoSubmitCheckbox?.addEventListener('change', (e) => {
                console.log(t('✅ 自动提交开关已设置为 {{state}}', { state: e.target.checked }));
            });

            if (buttonFaviconInput) {
                autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
                buttonFaviconInput.addEventListener('input', () => {
                    autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
                    updateFaviconPreview();
                });
            }

            updateFaviconPreview();
        };
        setupPreviewUpdates();

        // Setup quick insert buttons
        const setupQuickInsert = () => {
            const buttonText = dialog.querySelector('#buttonText');
            const quickInsertButtons = dialog.querySelector('#quickInsertButtons');
            quickInsertButtons?.addEventListener('click', (e) => {
                const button = e.target.closest('button[data-insert]');
                if (!button) return;
                e.preventDefault();
                const insertText = button.dataset.insert;
                const start = buttonText.selectionStart;
                const end = buttonText.selectionEnd;
                buttonText.value = buttonText.value.substring(0, start) +
                                   insertText +
                                   buttonText.value.substring(end);
                buttonText.selectionStart = buttonText.selectionEnd = start + insertText.length;
                buttonText.focus();
            });
            quickInsertButtons?.addEventListener('mousedown', (e) => {
                if (e.target.closest('button[data-insert]')) {
                    e.preventDefault();
                }
            });
        };
        setupQuickInsert();

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelButtonEdit')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#saveButtonEdit')?.addEventListener('click', () => {
            const newBtnName = dialog.querySelector('#buttonName').value.trim();
            const newBtnColor = dialog.querySelector('#buttonColor').value;
            const newBtnTextColor = dialog.querySelector('#buttonTextColor').value;
            const newBtnText = dialog.querySelector('#buttonText').value.trim();
            const autoSubmit = dialog.querySelector('#autoSubmitCheckbox')?.checked || false; // 获取自动提交状态
            const newBtnFavicon = (dialog.querySelector('#buttonFaviconInput')?.value || '').trim();

            if (!newBtnName) {
                alert(t('请输入按钮名称！'));
                return;
            }

            if (!isValidColor(newBtnColor) || !isValidColor(newBtnTextColor)) {
                alert(t('请选择有效的颜色！'));
                return;
            }

            if (newBtnName !== btnName && buttonConfig.folders[folderName].buttons[newBtnName]) {
                alert(t('按钮名称已存在！'));
                return;
            }

            // Get all buttons order
            const currentButtons = { ...buttonConfig.folders[folderName].buttons };

            if (btnConfig.type === "tool") {
                // 工具按钮不允许更改类型和动作
                buttonConfig.folders[folderName].buttons[newBtnName] = {
                    type: "tool",
                    action: btnConfig.action,
                    color: newBtnColor,
                    textColor: newBtnTextColor
                };
            } else {
                // 处理模板按钮
                // Handle button rename
                if (btnName && newBtnName !== btnName) {
                    const newButtons = {};
                    Object.keys(currentButtons).forEach(key => {
                        if (key === btnName) {
                            newButtons[newBtnName] = {
                                text: newBtnText,
                                color: newBtnColor,
                                textColor: newBtnTextColor,
                                type: "template",
                                autoSubmit: autoSubmit,
                                favicon: newBtnFavicon
                            };
                        } else {
                            newButtons[key] = currentButtons[key];
                        }
                    });
                    buttonConfig.folders[folderName].buttons = newButtons;
                } else {
                    // Update existing button
                    if (btnName) {
                        buttonConfig.folders[folderName].buttons[btnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit,
                            favicon: newBtnFavicon
                        };
                    } else {
                        // Create new button
                        buttonConfig.folders[folderName].buttons[newBtnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit,
                            favicon: newBtnFavicon
                        };
                    }
                }
            }

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('✅ 按钮 "{{buttonName}}" 已保存。', { buttonName: newBtnName }));
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    function isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    const showFolderEditDialog = (folderName = '', folderConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const isNew = !folderName;
        const overlay = document.createElement('div');
        overlay.classList.add('folder-edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('folder-edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = folderName || '';
        const initialColor = folderConfig.color || '#3B82F6';
        const initialTextColor = folderConfig.textColor || '#ffffff';

        // 预览部分
        const folderHeaderText = isNew ? t('🆕 新建文件夹：') : t('✏️ 编辑文件夹：');
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${folderHeaderText}
                </div>
                <div id="folderPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || t('预览文件夹')}</button>
                </div>
            </div>
        `;

        // 设置部分
        const settingsSection = `
            <div style="
                display:flex;
                flex-direction:column;
                gap:20px;
                margin-bottom:20px;
            ">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('文件夹名称：')}</label>
                    <input type="text" id="folderNameInput" value="${initialName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('按钮背景颜色：')}</label>
                    <input type="color" id="folderColorInput" value="${initialColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('按钮文字颜色：')}</label>
                    <input type="color" id="folderTextColorInput" value="${initialTextColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 底部按钮
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="saveFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('确认')}</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${settingsSection}
            ${footerButtons}
        `);

        // 添加事件监听器
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const folderNameInput = dialog.querySelector('#folderNameInput');
            const folderColorInput = dialog.querySelector('#folderColorInput');
            const folderTextColorInput = dialog.querySelector('#folderTextColorInput');

            folderNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || t('预览文件夹');
            });

            folderColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            folderTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });
        };
        setupPreviewUpdates();

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelFolderEdit').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        // 在showFolderEditDialog函数的保存按钮点击事件中
        dialog.querySelector('#saveFolderEdit').addEventListener('click', () => {
            const newFolderName = dialog.querySelector('#folderNameInput').value.trim();
            const newColor = dialog.querySelector('#folderColorInput').value;
            const newTextColor = dialog.querySelector('#folderTextColorInput').value;

            if (!newFolderName) {
                alert(t('请输入文件夹名称'));
                return;
            }

            if (isNew && buttonConfig.folders[newFolderName]) {
                alert(t('该文件夹已存在！'));
                return;
            }

            if (!isNew && newFolderName !== folderName && buttonConfig.folders[newFolderName]) {
                alert(t('该文件夹已存在！'));
                return;
            }

            if (!isNew && newFolderName !== folderName) {
                const oldButtons = buttonConfig.folders[folderName].buttons;
                buttonConfig.folders[newFolderName] = {
                    ...buttonConfig.folders[folderName],
                    color: newColor,
                    textColor: newTextColor,
                    buttons: { ...oldButtons }
                };
                delete buttonConfig.folders[folderName];
                const idx = buttonConfig.folderOrder.indexOf(folderName);
                if (idx > -1) {
                    buttonConfig.folderOrder[idx] = newFolderName;
                }
            } else {
                buttonConfig.folders[newFolderName] = buttonConfig.folders[newFolderName] || { buttons: {} };
                buttonConfig.folders[newFolderName].color = newColor;
                buttonConfig.folders[newFolderName].textColor = newTextColor;

                // 确保新建文件夹有hidden字段且默认为false
                if (typeof buttonConfig.folders[newFolderName].hidden !== 'boolean') {
                    buttonConfig.folders[newFolderName].hidden = false;
                }

                // 在isNew分支中把新建的文件夹名加入folderOrder
                if (isNew) {
                    buttonConfig.folderOrder.push(newFolderName);
                }
            }

            // 确保所有按钮都有'type'字段和'autoSubmit'字段
            Object.entries(buttonConfig.folders).forEach(([folderName, folderCfg]) => {
                Object.entries(folderCfg.buttons).forEach(([btnName, btnCfg]) => {
                    if (!btnCfg.type) {
                        if (folderName === "🖱️") {
                            btnCfg.type = "tool";
                        } else {
                            btnCfg.type = "template";
                        }
                    }
                    if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                        btnCfg.autoSubmit = false;
                    }
                });
            });

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn(newFolderName);
            console.log(t('✅ 文件夹 "{{folderName}}" 已保存。', { folderName: newFolderName }));
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const createSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = '⚙️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.addEventListener('click', showUnifiedSettingsDialog);
        return button;
    };

    const createCutButton = () => {
        const button = document.createElement('button');
        button.innerText = '✂️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('剪切输入框内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
                // 清空textarea内容
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(focusedElement, '');
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'deleteContent'
                });
                focusedElement.dispatchEvent(inputEvent);
            } else {
                // 处理contenteditable元素
                const childNodes = Array.from(focusedElement.childNodes);
                const textParts = [];
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textParts.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textParts.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textParts.push('\n');
                        textParts.push(node.textContent);
                    }
                });
                text = textParts.join('');
                // 清空contenteditable内容
                setTrustedHTML(focusedElement, '');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log(t('✅ 已剪切输入框内容到剪贴板。'));
                    showTemporaryFeedback(focusedElement, '剪切成功');
                }).catch(err => {
                    console.error("剪切失败:", err);
                    alert(t('剪切失败，请检查浏览器权限。'));
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log(t('✅ 输入框内容已清空。'));
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    const createCopyButton = () => {
        const button = document.createElement('button');
        button.innerText = '🅲';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('复制输入框内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
            } else {
                const textContent = [];
                const childNodes = Array.from(focusedElement.childNodes);
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textContent.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textContent.push('\n');
                        textContent.push(node.textContent);
                    }
                });
                text = textContent.join('');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log(t('✅ 已复制输入框内容到剪贴板。'));
                    showTemporaryFeedback(focusedElement, '复制成功');
                }).catch(err => {
                    console.error("复制失败:", err);
                    alert(t('复制失败，请检查浏览器权限。'));
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createPasteButton = () => {
        const button = document.createElement('button');
        button.innerText = '🆅';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('粘贴剪切板内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            try {
                const clipboardText = await navigator.clipboard.readText();
                // 使用现有的insertTextSmart函数插入文本
                insertTextSmart(focusedElement, clipboardText);
                // 添加视觉反馈
                const originalText = button.innerText;
                button.innerText = '✓';
                button.style.backgroundColor = 'var(--success-color, #22c55e)';
                button.style.color = 'white';
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                    button.style.color = 'var(--text-color, #333333)';
                }, 1000);
                    console.log(t('✅ 已粘贴剪贴板内容到输入框。'));
            } catch (err) {
                console.error("访问剪切板失败:", err);
                alert(t('粘贴失败，请检查浏览器权限。'));
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createClearButton = () => {
        const button = document.createElement('button');
        button.textContent = '✖';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--clear-icon-color, var(--text-color, #333333))';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('清空输入框');
        // 添加mousedown事件处理器来阻止焦点切换
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            // 使用现有的insertTextSmart函数清空内容
            insertTextSmart(focusedElement, '', true);
            // 确保立即重新聚焦
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log(t('✅ 输入框内容已清空。'));
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    // 新增的配置设置按钮和弹窗
    const createConfigSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = t('🛠️ 脚本配置');
        button.type = 'button';
        button.style.backgroundColor = 'var(--info-color, #4F46E5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.addEventListener('click', showConfigSettingsDialog);
        return button;
    };

    const createButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            updateButtonContainer();
            return existingContainer;
        }
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('folder-buttons-container');
        buttonContainer.style.pointerEvents = 'auto';

        buttonContainer.style.position = 'fixed';
        buttonContainer.style.right = '0px';
        buttonContainer.style.width = '100%';
        buttonContainer.style.zIndex = '1000';

        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'nowrap';
        buttonContainer.style.overflowX = 'auto';
        buttonContainer.style.overflowY = 'hidden';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '0px';
        buttonContainer.style.height = buttonConfig.buttonBarHeight + 'px';

        buttonContainer.style.scrollbarWidth = 'none';
        buttonContainer.style.msOverflowStyle = 'none';
        buttonContainer.classList.add('hide-scrollbar');

        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.padding = '6px 15px';

        buttonContainer.style.backgroundColor = 'transparent';
        buttonContainer.style.boxShadow = 'none';
        buttonContainer.style.borderRadius = '4px';

        buttonConfig.folderOrder.forEach((name) => {
            const config = buttonConfig.folders[name];
            if (config && !config.hidden) {
                const folderButton = createFolderButton(name, config);
                buttonContainer.appendChild(folderButton);
            }
        });

        buttonContainer.appendChild(createSettingsButton());
        buttonContainer.appendChild(createClearButton());

        buttonContainer.dataset.barPaddingY = '6';
        applyBarBottomSpacing(
            buttonContainer,
            buttonConfig.buttonBarBottomSpacing,
            buttonConfig.buttonBarBottomSpacing
        );

        return buttonContainer;
    };

    const updateButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            const settingsButton = existingContainer.querySelector('button:nth-last-child(2)');
            const clearButton = existingContainer.querySelector('button:last-child');

            setTrustedHTML(existingContainer, '');

            buttonConfig.folderOrder.forEach((name) => {
                const config = buttonConfig.folders[name];
                if (config && !config.hidden) {
                    const folderButton = createFolderButton(name, config);
                    existingContainer.appendChild(folderButton);
                }
            });

            if (settingsButton) existingContainer.appendChild(settingsButton);
            if (clearButton) existingContainer.appendChild(clearButton);

            console.log(t('✅ 按钮栏已更新（已过滤隐藏文件夹）。'));
        } else {
            console.warn(t('⚠️ 未找到按钮容器，无法更新按钮栏。'));
        }
        try {
            applyDomainStyles();
        } catch (err) {
            console.warn(t('应用域名样式失败:'), err);
        }
    };

    const attachButtonsToTextarea = (textarea) => {
        let buttonContainer = queryUI('.folder-buttons-container');
        if (!buttonContainer) {
            buttonContainer = createButtonContainer();
            appendToMainLayer(buttonContainer);
            try { applyDomainStyles(); } catch (_) {}
            console.log(t('✅ 按钮容器已固定到窗口底部。'));
        } else {
            console.log(t('ℹ️ 按钮容器已存在，跳过附加。'));
        }
        textarea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    };

    let attachTimeout;
    const attachButtons = () => {
        if (attachTimeout) clearTimeout(attachTimeout);
        attachTimeout = setTimeout(() => {
            const textareas = getAllTextareas();
            console.log(t('🔍 扫描到 {{count}} 个 textarea 或 contenteditable 元素。', {
                count: textareas.length
            }));
            if (textareas.length === 0) {
                console.warn(t('⚠️ 未找到任何 textarea 或 contenteditable 元素。'));
                return;
            }
            attachButtonsToTextarea(textareas[textareas.length - 1]);
            console.log(t('✅ 按钮已附加到最新的 textarea 或 contenteditable 元素。'));
        }, 300);
    };

    const observeShadowRoots = (node) => {
        if (node.shadowRoot) {
            const shadowObserver = new MutationObserver(() => {
                attachButtons();
            });
            shadowObserver.observe(node.shadowRoot, {
                childList: true,
                subtree: true,
            });
            node.shadowRoot.querySelectorAll('*').forEach(child => observeShadowRoots(child));
        }
    };
