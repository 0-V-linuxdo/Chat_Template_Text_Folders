/* -------------------------------------------------------------------------- *
 * Feature · Toolbar UI (folder buttons, popovers, quick input tools)
 * -------------------------------------------------------------------------- */

import {
    appendToMainLayer,
    autoResizeTextarea,
    buttonConfig,
    clearEditableText,
    createFaviconElement,
    createUnifiedDialog,
    getAllTextareas,
    getFocusedEditableElement,
    getShadowRoot,
    insertTextSmart,
    isEditableElement,
    persistButtonConfig,
    queryUI,
    readEditableText,
    releaseI18nBindings,
    setTrustedHTML,
    styles,
    submitForm,
    t,
    TOOL_DEFAULT_ICONS,
    waitForContentMatch,
} from '../../core/runtime-services.js';
import {
    applyBarBottomSpacing,
    applyDomainStyles,
} from '../domain-style/runtime.js';

let showUnifiedSettingsDialogHandler = () => {};
let showConfigSettingsDialogHandler = () => {};
let updateCountersHandler = () => {};

const setShowUnifiedSettingsDialogHandler = (handler) => {
    showUnifiedSettingsDialogHandler = typeof handler === 'function' ? handler : () => {};
};

const setShowConfigSettingsDialogHandler = (handler) => {
    showConfigSettingsDialogHandler = typeof handler === 'function' ? handler : () => {};
};

const setUpdateCountersHandler = (handler) => {
    updateCountersHandler = typeof handler === 'function' ? handler : () => {};
};

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
        element: null,
        trigger: null,
    };
    const contextMenuBoundEditables = new WeakSet();

    const resetOpenFolderState = () => {
        currentlyOpenFolder.name = null;
        currentlyOpenFolder.element = null;
        currentlyOpenFolder.trigger = null;
    };

    const closeOpenFolderPopover = (messageId = null) => {
        const { name, element } = currentlyOpenFolder;
        if (element) {
            element.style.display = 'none';
        }
        resetOpenFolderState();
        if (messageId && name) {
            console.log(t(messageId, { folderName: name }));
        }
    };

    const removeAllFolderPopovers = () => {
        const root = getShadowRoot();
        const scope = root || document;
        scope.querySelectorAll('[data-folder-list]').forEach((node) => node.remove());
        resetOpenFolderState();
    };

    document.addEventListener('click', (event) => {
        const openList = currentlyOpenFolder.element;
        if (!openList || openList.style.display === 'none') {
            return;
        }
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        if (path.includes(openList) || path.includes(currentlyOpenFolder.trigger)) {
            return;
        }
        closeOpenFolderPopover('m_01ecd4be7d8f');
    });

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
        const text = readEditableText(element);
        clearEditableText(element);
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('m_7bcb569d28a1'));
                showTemporaryFeedback(element, t('m_d2e470b2e93a'));
            }).catch(err => {
                console.error(t('m_377b64f33744'), err);
                alert(t('m_56d99b4b6e9e'));
            });
        }
    };

    const handleCopy = (element) => {
        const text = readEditableText(element);
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('m_1919cf051451'));
                showTemporaryFeedback(element, t('m_c1ef062e06cd'));
            }).catch(err => {
                console.error(t('m_ecb00e6926eb'), err);
                alert(t('m_a0b85fe891d7'));
            });
        }
    };

    const handlePaste = async (element) => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            insertTextSmart(element, clipboardText);
            console.log(t('m_9171c67e4cf3'));
            showTemporaryFeedback(element, t('m_84dd0f1436ae'));
        } catch (err) {
            console.error(t('m_e4ed67834352'), err);
            alert(t('m_6e71bc5b3758'));
        }
    };

    const handleClear = (element) => {
        clearEditableText(element);
        console.log(t('m_f6d245dfbc61'));
        showTemporaryFeedback(element, t('m_bc14d54e2a74'));
    };

    const createCustomButton = (name, config, folderName) => {
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
            const focusedElement = getFocusedEditableElement();
            if (isEditableElement(focusedElement)) {
                setTimeout(() => focusedElement && focusedElement.focus(), 0);
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
                const focusedElement = getFocusedEditableElement();
                if (!isEditableElement(focusedElement)) {
                    console.warn(t('m_9ff363a0feeb'));
                    return;
                }

                const needsClipboard = config.text.includes('{clipboard}') || config.text.includes('{{inputboard}|{clipboard}}');

                let clipboardText = '';
                if (needsClipboard) {
                    try {
                        clipboardText = await navigator.clipboard.readText();
                    } catch (err) {
                        console.error(t('m_2d79c11c0491'), err);
                        alert(t('m_794a66cb1c12'));
                        return;
                    }
                }

                const inputBoxText = readEditableText(focusedElement);

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
                    console.log(t('m_2024a7224ffb'));
                } else {
                    insertTextSmart(focusedElement, finalText, false);
                    console.log(t('m_21c3ca2c9302'));
                }

                if (config.autoSubmit) {
                    try {
                        await waitForContentMatch(focusedElement, finalText, 100, 3000);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        const success = await submitForm();
                        if (success) {
                            console.log(t('m_1bf9ab3da76d'));
                        } else {
                            console.warn(t('m_1f88547d4371'));
                        }
                    } catch (error) {
                        console.error(t('m_21d6efbe9ff8'), error);
                    }
                }

            } else if (config.type === "tool") {
                const focusedElement = getFocusedEditableElement();
                if (!isEditableElement(focusedElement)) {
                    console.warn(t('m_9ff363a0feeb'));
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
                        console.warn(t('m_d5320d94e958', { action: config.action }));
                }
            }

            if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element) {
                currentlyOpenFolder.element.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('m_06d200850c0e', { folderName }));
            } else {
                console.warn(t('m_25172369e83d', { folderName }));
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
            if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element === buttonListContainer) {
                closeOpenFolderPopover('m_b6157962b143');
            } else {
                if (currentlyOpenFolder.element) {
                    closeOpenFolderPopover('m_b6157962b143');
                }
                buttonListContainer.style.display = 'flex';
                currentlyOpenFolder.name = folderName;
                currentlyOpenFolder.element = buttonListContainer;
                currentlyOpenFolder.trigger = folderButton;
                console.log(t('m_498354115398', { folderName }));
                const rect = folderButton.getBoundingClientRect();
                buttonListContainer.style.bottom = `40px`;
                buttonListContainer.style.left = `${rect.left + window.scrollX - 20}px`;
                console.log(t('m_f30f9402010e', {
                    left: Math.round(rect.left + window.scrollX - 20)
                }));
            }
        });

        appendToMainLayer(buttonListContainer);
        return folderButton;
    };

    const closeExistingOverlay = (overlay) => {
        if (overlay && typeof overlay.__cttfCloseDialog === 'function') {
            overlay.__cttfCloseDialog();
            return;
        }
        if (overlay && typeof overlay.__cttfLocaleRefreshCleanup === 'function') {
            overlay.__cttfLocaleRefreshCleanup();
            overlay.__cttfLocaleRefreshCleanup = null;
        }
        if (overlay && overlay.parentElement) {
            overlay.style.pointerEvents = 'none';
            releaseI18nBindings(overlay);
            overlay.parentElement.removeChild(overlay);
            console.log(t('m_dc910208b65d'));
        } else {
            console.warn(t('m_c53a8a03c172'));
        }
    };

    let currentConfirmOverlay = null;

    const showDeleteFolderConfirmDialog = (folderName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const folderConfig = buttonConfig.folders[folderName];
        if (!folderConfig) {
            alert(t('m_307cc6a108b7', { folderName }));
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

        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '400px',
            maxWidth: '90vw',
            padding: '20px 24px 16px 24px',
            zIndex: '11000',
            closeOnOverlayClick: false,
            overlayClassName: 'confirm-overlay',
            dialogClassName: 'confirm-dialog',
            onClose: () => {
                if (currentConfirmOverlay === overlay) {
                    currentConfirmOverlay = null;
                }
            },
        });
        const deleteFolderTitle = t('m_f3cf53d80bf1', { folderName });
        const irreversibleNotice = t('m_017b3765c0b7');
        const deleteFolderWarning = t('m_83e8afa3ecc6');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteFolderTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNotice}<br/>${deleteFolderWarning}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <!-- 将文件夹按钮预览和文字标签放在一行 -->
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('m_2df28455fb66')}</strong>
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
                    ${t('m_96630c75b125')} ${folderName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('m_1f4b4742d2c4')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('m_4a06399f371f')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('m_eb13448ddd05')}</strong></p>
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
                ">${t('m_4d0b4688c787')}</button>
                <button id="confirmDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius: 4px;
                ">${t('m_3755f56f2f83')}</button>
            </div>
        `);
        currentConfirmOverlay = overlay;

        dialog.querySelector('#cancelDeleteFolder').addEventListener('click', () => {
            closeExistingOverlay(overlay);
        });

        dialog.querySelector('#confirmDeleteFolder').addEventListener('click', () => {
            delete buttonConfig.folders[folderName];
            const idx = buttonConfig.folderOrder.indexOf(folderName);
            if (idx > -1) buttonConfig.folderOrder.splice(idx, 1);
            persistButtonConfig();
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('m_64e35a7bb735', { folderName }));
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
            alert(t('m_c06301c561a1', {
                buttonName: btnName,
                folderName
            }));
            return;
        }
        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '400px',
            maxWidth: '90vw',
            padding: '20px 24px 16px 24px',
            zIndex: '11000',
            closeOnOverlayClick: false,
            overlayClassName: 'confirm-overlay',
            dialogClassName: 'confirm-dialog',
            onClose: () => {
                if (currentConfirmOverlay === overlay) {
                    currentConfirmOverlay = null;
                }
            },
        });
        const deleteButtonTitle = t('m_10153590c3d8', { buttonName: btnName });
        const irreversibleShort = t('m_017b3765c0b7');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteButtonTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleShort}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('m_9bfdb8980275')}</strong>
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
                    ${t('m_96630c75b125')} ${btnName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('m_56e195e887ab')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('m_2b1a70945baf')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('m_a7cdc1ea98b3')}</strong></p>
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
                ">${t('m_4d0b4688c787')}</button>
                <button id="confirmDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('m_3755f56f2f83')}</button>
            </div>
        `);
        currentConfirmOverlay = overlay;

        dialog.querySelector('#cancelDeleteButton').addEventListener('click', () => {
            closeExistingOverlay(overlay);
        });

        dialog.querySelector('#confirmDeleteButton').addEventListener('click', () => {
            delete buttonConfig.folders[folderName].buttons[btnName];
            persistButtonConfig();
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('m_f62771f7d4b6', { buttonName: btnName }));
            // 更新按钮栏
            updateButtonContainer();
            updateCountersHandler(); // 更新所有计数器
        });
    };

    const showButtonEditDialog = (folderName, btnName = '', btnConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        // 禁止编辑/删除工具文件夹中的工具按钮
        if (folderName === "🖱️" && btnConfig.type === "tool") {
            alert(t('m_b83fafa31b39'));
            return;
        }
        const isEdit = btnName !== '';

        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '500px',
            maxWidth: '90vw',
            maxHeight: 'none',
            padding: '24px',
            zIndex: '11000',
            closeOnOverlayClick: false,
            overlayClassName: 'edit-overlay',
            dialogClassName: 'edit-dialog',
            dialogStyles: {
                overflowY: 'visible',
            },
            onClose: () => {
                if (currentConfirmOverlay === overlay) {
                    currentConfirmOverlay = null;
                }
            },
        });

        const initialName = btnName || '';
        const initialColor = btnConfig.color || '#FFC1CC';
        const initialTextColor = btnConfig.textColor || '#333333';
        const initialAutoSubmit = btnConfig.autoSubmit || false; // 新增字段
        const initialFavicon = typeof btnConfig.favicon === 'string' ? btnConfig.favicon : '';

        // 预览部分
        const buttonHeaderText = isEdit ? t('m_62c16c5424b3') : t('m_ff310c80f940');
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
                    ">${initialName || t('m_68b9cc33d69a')}</button>
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
                    ">${t('m_d291a7396aef')}</label>
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
                        ">📝 ${t('m_02be516690b9')}</button>
                        <button type="button" data-insert="{clipboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('m_abdc48c69706')}</button>
                        <button type="button" data-insert="{selection}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('m_de9deef0cff4')}</button>
                        <button type="button" data-insert="{{inputboard}|{clipboard}}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('m_6eeb5f84309c')}</button>
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
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('m_96630c75b125')}</label>
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
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('m_f9e235108e1a')}</label>
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
                            " placeholder="${t('m_c182fdbf9d82')}">${initialFavicon}</textarea>
                            <div style="
                                margin-top: 6px;
                                font-size: 12px;
                                color: var(--muted-text-color, #6b7280);
                            ">${t('m_f63a0a40276e')}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('m_56e195e887ab')}</label>
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
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('m_2b1a70945baf')}</label>
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
                        ${t('m_1f990d8a3684')}
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
                ">${t('m_f3e5cbd48d48')}</button>
                <button class="tab-button" data-tab="styleSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('m_8b52bd0a4bd6')}</button>
                <button class="tab-button" data-tab="submitSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('m_3c3b1f3f773c')}</button>
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
                ">${t('m_4d0b4688c787')}</button>
                <button id="saveButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('m_b56d9ac6c5a0')}</button>
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
                previewButton.textContent = e.target.value || t('m_68b9cc33d69a');
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
                console.log(t('m_cbfc561586be', { state: e.target.checked }));
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

        // Setup buttons
        dialog.querySelector('#cancelButtonEdit')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
        });

        dialog.querySelector('#saveButtonEdit')?.addEventListener('click', () => {
            const newBtnName = dialog.querySelector('#buttonName').value.trim();
            const newBtnColor = dialog.querySelector('#buttonColor').value;
            const newBtnTextColor = dialog.querySelector('#buttonTextColor').value;
            const newBtnText = dialog.querySelector('#buttonText').value.trim();
            const autoSubmit = dialog.querySelector('#autoSubmitCheckbox')?.checked || false; // 获取自动提交状态
            const newBtnFavicon = (dialog.querySelector('#buttonFaviconInput')?.value || '').trim();

            if (!newBtnName) {
                alert(t('m_6f18d9d8f52a'));
                return;
            }

            if (!isValidColor(newBtnColor) || !isValidColor(newBtnTextColor)) {
                alert(t('m_4d268c8dd14f'));
                return;
            }

            if (newBtnName !== btnName && buttonConfig.folders[folderName].buttons[newBtnName]) {
                alert(t('m_62734586e922'));
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

            persistButtonConfig();
            closeExistingOverlay(overlay);
            if (rerenderFn) rerenderFn();
            console.log(t('m_1968d029fafd', { buttonName: newBtnName }));
            updateButtonContainer();
            updateCountersHandler(); // 更新所有计数器
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
        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '500px',
            maxWidth: '90vw',
            maxHeight: 'none',
            padding: '24px',
            zIndex: '11000',
            closeOnOverlayClick: false,
            overlayClassName: 'folder-edit-overlay',
            dialogClassName: 'folder-edit-dialog',
            dialogStyles: {
                overflowY: 'visible',
            },
            onClose: () => {
                if (currentConfirmOverlay === overlay) {
                    currentConfirmOverlay = null;
                }
            },
        });

        const initialName = folderName || '';
        const initialColor = folderConfig.color || '#3B82F6';
        const initialTextColor = folderConfig.textColor || '#ffffff';

        // 预览部分
        const folderHeaderText = isNew ? t('m_be4786217d60') : t('m_2c4b05fe54d8');
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
                    ">${initialName || t('m_7353515a2d1e')}</button>
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
                    ">${t('m_bed2c8aee267')}</label>
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
                    ">${t('m_56e195e887ab')}</label>
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
                    ">${t('m_2b1a70945baf')}</label>
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
                ">${t('m_4d0b4688c787')}</button>
                <button id="saveFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('m_b56d9ac6c5a0')}</button>
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
                previewButton.textContent = e.target.value || t('m_7353515a2d1e');
            });

            folderColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            folderTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });
        };
        setupPreviewUpdates();

        currentConfirmOverlay = overlay;

        // Setup buttons
        dialog.querySelector('#cancelFolderEdit').addEventListener('click', () => {
            closeExistingOverlay(overlay);
        });

        // 在showFolderEditDialog函数的保存按钮点击事件中
        dialog.querySelector('#saveFolderEdit').addEventListener('click', () => {
            const newFolderName = dialog.querySelector('#folderNameInput').value.trim();
            const newColor = dialog.querySelector('#folderColorInput').value;
            const newTextColor = dialog.querySelector('#folderTextColorInput').value;

            if (!newFolderName) {
                alert(t('m_0d58c801c155'));
                return;
            }

            if (isNew && buttonConfig.folders[newFolderName]) {
                alert(t('m_4968e7a93613'));
                return;
            }

            if (!isNew && newFolderName !== folderName && buttonConfig.folders[newFolderName]) {
                alert(t('m_4968e7a93613'));
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

            persistButtonConfig();
            closeExistingOverlay(overlay);
            if (rerenderFn) rerenderFn(newFolderName);
            console.log(t('m_65d6fdd82a8e', { folderName: newFolderName }));
            updateButtonContainer();
            updateCountersHandler(); // 更新所有计数器
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
        button.addEventListener('click', () => showUnifiedSettingsDialogHandler());
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
        button.title = t('m_bcba6579c508');
        // 添加mousedown事件处理器来阻止焦点切换
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            const focusedElement = getFocusedEditableElement();
            if (!isEditableElement(focusedElement)) {
                console.warn(t('m_9ff363a0feeb'));
                return;
            }
            clearEditableText(focusedElement, { focus: true });
            console.log(t('m_f6d245dfbc61'));
            showTemporaryFeedback(focusedElement, t('m_bc14d54e2a74'));
        });
        return button;
    };

    // 新增的配置设置按钮和弹窗
    const createConfigSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = t('m_3b8ac539b031');
        button.type = 'button';
        button.style.backgroundColor = 'var(--info-color, #4F46E5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.addEventListener('click', () => showConfigSettingsDialogHandler());
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
            removeAllFolderPopovers();

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

            console.log(t('m_f916d862e0af'));
        } else {
            console.warn(t('m_b1ed8accdb95'));
        }
        try {
            applyDomainStyles();
        } catch (err) {
            console.warn(t('m_4d34dcf31830'), err);
        }
    };

    const attachButtonsToTextarea = (textarea) => {
        let buttonContainer = queryUI('.folder-buttons-container');
        if (!buttonContainer) {
            buttonContainer = createButtonContainer();
            appendToMainLayer(buttonContainer);
            try { applyDomainStyles(); } catch (_) {}
            console.log(t('m_a9d17afdc4cc'));
        } else {
            console.log(t('m_7b5e9ee8df7e'));
        }
        if (!contextMenuBoundEditables.has(textarea)) {
            textarea.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            contextMenuBoundEditables.add(textarea);
        }
    };

    let attachTimeout;
    const attachButtons = () => {
        if (attachTimeout) clearTimeout(attachTimeout);
        attachTimeout = setTimeout(() => {
            const textareas = getAllTextareas();
            console.log(t('m_8d46f43f96e9', {
                count: textareas.length
            }));
            if (textareas.length === 0) {
                console.warn(t('m_ee15681d0604'));
                return;
            }
            attachButtonsToTextarea(textareas[textareas.length - 1]);
            console.log(t('m_f873f0136721'));
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

export {
    attachButtons,
    closeExistingOverlay,
    createConfigSettingsButton,
    createCustomButtonElement,
    extractButtonIconParts,
    observeShadowRoots,
    setShowConfigSettingsDialogHandler,
    setShowUnifiedSettingsDialogHandler,
    setUpdateCountersHandler,
    showButtonEditDialog,
    showDeleteButtonConfirmDialog,
    showDeleteFolderConfirmDialog,
    showFolderEditDialog,
    updateButtonContainer,
};
