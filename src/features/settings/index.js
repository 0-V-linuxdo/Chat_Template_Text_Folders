/* -------------------------------------------------------------------------- *
 * Feature · Settings panel, configuration flows, folder management helpers
 * -------------------------------------------------------------------------- */

import {
    buttonConfig,
    createDialogCloseIconButton,
    createUnifiedDialog,
    isDarkMode,
    isNonChineseLocale,
    persistButtonConfig,
    queryUI,
    registerLocaleRefresh,
    setTrustedHTML,
    styles,
    t,
} from '../../core/runtime-services.js';
import {
    attachButtons,
    closeExistingOverlay,
    createConfigSettingsButton,
    createCustomButtonElement,
    extractButtonIconParts,
    showButtonEditDialog,
    showDeleteButtonConfirmDialog,
    showDeleteFolderConfirmDialog,
    showFolderEditDialog,
    updateButtonContainer,
} from '../toolbar/index.js';
import {
    showAutomationSettingsDialog,
} from '../automation/settings-dialog.js';
import {
    showStyleSettingsDialog,
} from '../domain-style/style-settings-dialog.js';

let selectedFolderName = buttonConfig.folderOrder[0] || null; // 在设置面板中使用
let folderListContainer;
let buttonListContainer;
let currentSettingsOverlay = null;
let isSettingsFolderPanelCollapsed = false;
let settingsDialogMainContainer = null;
let closeConfigOverlayHandler = () => {};
let settingsHeaderActionButtons = null;
let settingsHeaderCloseButton = null;
let pendingSettingsHeaderAlignmentFrame = 0;

const SETTINGS_HEADER_BUTTON_GAP = 10;

const cancelPendingSettingsHeaderAlignment = () => {
    if (!pendingSettingsHeaderAlignmentFrame) {
        return;
    }
    window.cancelAnimationFrame(pendingSettingsHeaderAlignmentFrame);
    pendingSettingsHeaderAlignmentFrame = 0;
};

const syncSettingsHeaderButtonAlignment = () => {
    pendingSettingsHeaderAlignmentFrame = 0;

    if (
        !settingsHeaderActionButtons ||
        !settingsHeaderCloseButton ||
        !settingsHeaderActionButtons.isConnected ||
        !settingsHeaderCloseButton.isConnected
    ) {
        return;
    }

    const addNewButtonBtn = buttonListContainer?.querySelector?.('[data-settings-add-button="true"]');
    if (!addNewButtonBtn || !addNewButtonBtn.isConnected) {
        settingsHeaderCloseButton.style.marginLeft = `${SETTINGS_HEADER_BUTTON_GAP}px`;
        return;
    }

    const buttonPanelPaddingRight = parseFloat(window.getComputedStyle(buttonListContainer).paddingRight) || 0;
    const closeButtonWidth = settingsHeaderCloseButton.getBoundingClientRect().width || settingsHeaderCloseButton.offsetWidth || 32;
    const addButtonWidth = addNewButtonBtn.getBoundingClientRect().width || addNewButtonBtn.offsetWidth || 0;
    const automationButton = settingsHeaderActionButtons.querySelector('[data-settings-header-action="automation"]');
    const automationButtonWidth = automationButton
        ? (automationButton.getBoundingClientRect().width || automationButton.offsetWidth || 0)
        : 0;
    const desiredGap = Math.max(
        SETTINGS_HEADER_BUTTON_GAP,
        Math.round(buttonPanelPaddingRight + addButtonWidth + automationButtonWidth / 2 - closeButtonWidth),
    );

    settingsHeaderCloseButton.style.marginLeft = `${desiredGap}px`;
};

const scheduleSettingsHeaderButtonAlignment = () => {
    cancelPendingSettingsHeaderAlignment();
    pendingSettingsHeaderAlignmentFrame = window.requestAnimationFrame(() => {
        syncSettingsHeaderButtonAlignment();
    });
};

const resetSettingsHeaderButtonAlignment = () => {
    cancelPendingSettingsHeaderAlignment();
    settingsHeaderActionButtons = null;
    settingsHeaderCloseButton = null;
};

const setSelectedFolderName = (nextFolderName) => {
    selectedFolderName = nextFolderName;
    return selectedFolderName;
};

const getCurrentSettingsOverlay = () => currentSettingsOverlay;

const setCloseConfigOverlayHandler = (handler) => {
    closeConfigOverlayHandler = typeof handler === 'function' ? handler : () => {};
};

    const extractTemplateVariables = (text = '') => {
        if (typeof text !== 'string' || !text.includes('{')) {
            return [];
        }

        const matches = new Set();
        const fallbackMatches = text.match(/\{\{[A-Za-z0-9_-]+\}\|\{[A-Za-z0-9_-]+\}\}/g) || [];
        fallbackMatches.forEach(match => matches.add(match));

        let sanitized = text;
        fallbackMatches.forEach(match => {
            sanitized = sanitized.split(match).join(' ');
        });

        const singleMatches = sanitized.match(/\{[A-Za-z0-9_-]+\}/g) || [];
        singleMatches.forEach(match => matches.add(match));

        return Array.from(matches);
    };

    const renderFolderList = () => {
        if (!folderListContainer) return;
        setTrustedHTML(folderListContainer, '');
        const foldersArray = buttonConfig.folderOrder.map(fname => [fname, buttonConfig.folders[fname]]).filter(([f,c])=>c);
        foldersArray.forEach(([fname, fconfig]) => {
            const folderItem = document.createElement('div');
            folderItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border-radius: 4px;
                margin: 4px 0;
                background-color: ${selectedFolderName === fname ? (isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)') : 'transparent'};
                cursor: move;
                direction: ltr;
                min-height: 36px;
            `;
            folderItem.classList.add('folder-item');
            folderItem.setAttribute('draggable', 'true');
            folderItem.setAttribute('data-folder', fname);

        const { container: leftInfo, folderPreview } = (function createFolderPreview(fname, fconfig) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';
            container.style.flex = '1';
            container.style.minWidth = '0';
            container.style.paddingRight = '8px';

            const showIcons = buttonConfig && buttonConfig.showFolderIcons === true;
            const { iconSymbol, textLabel } = extractButtonIconParts(fname);
            const normalizedLabel = (textLabel || fname || '').trim();
            const fallbackLabel = normalizedLabel || fname || t('m_7353515a2d1e');
            const fallbackSymbol = iconSymbol || (Array.from(fallbackLabel)[0] || '📁');

            const previewButton = document.createElement('button');
            previewButton.type = 'button';
            previewButton.setAttribute('data-folder-preview', fname);
            previewButton.title = fname;
            previewButton.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border-radius: 4px;
                background-color: transparent;
                border: none;
                cursor: grab;
                flex-shrink: 1;
                min-width: 0;
                max-width: 100%;
                margin: 0 8px 0 0;
            `;

            const pill = document.createElement('span');
            pill.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: ${showIcons ? '6px' : '0'};
                background: ${fconfig.color || 'var(--primary-color, #3B82F6)'};
                color: ${fconfig.textColor || '#ffffff'};
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 14px;
                font-weight: ${selectedFolderName === fname ? '600' : '500'};
                min-width: 0;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
                transition: all 0.2s ease;
            `;

            if (showIcons) {
                const iconSpan = document.createElement('span');
                iconSpan.style.display = 'inline-flex';
                iconSpan.style.alignItems = 'center';
                iconSpan.style.justifyContent = 'center';
                iconSpan.style.fontSize = '14px';
                iconSpan.style.lineHeight = '1';
                iconSpan.textContent = fallbackSymbol;
                pill.appendChild(iconSpan);
            }

            const textSpan = document.createElement('span');
            textSpan.style.display = 'inline-flex';
            textSpan.style.alignItems = 'center';
            textSpan.style.justifyContent = 'center';
            textSpan.style.pointerEvents = 'none';

            let textContent = showIcons ? normalizedLabel : (fname || normalizedLabel);
            if (!showIcons && iconSymbol && !fname.includes(iconSymbol)) {
                textContent = `${iconSymbol} ${textContent || ''}`.trim();
            }
            if (!showIcons && !textContent) {
                textContent = fallbackLabel;
            }
            if (textContent) {
                textSpan.textContent = textContent;
                pill.appendChild(textSpan);
            }

            previewButton.appendChild(pill);

            // Ensure the preview keeps the requested button style while remaining draggable/selectable
            previewButton.style.whiteSpace = 'nowrap';
            previewButton.style.alignSelf = 'flex-start';

            container.appendChild(previewButton);
            return { container, folderPreview: previewButton };
        })(fname, fconfig);

            const rightBtns = document.createElement('div');
            rightBtns.style.display = 'flex';
            rightBtns.style.gap = '4px'; // 增加按钮间的间距
            rightBtns.style.alignItems = 'center';
            rightBtns.style.width = '130px'; // 与标签栏保持一致的宽度
            rightBtns.style.justifyContent = 'flex-start'; // 改为左对齐
            rightBtns.style.paddingLeft = '8px'; // 添加左侧padding与标签栏对齐
            rightBtns.style.paddingRight = '12px'; // 添加右侧padding

            // 创建隐藏状态勾选框容器
            const hiddenCheckboxContainer = document.createElement('div');
            hiddenCheckboxContainer.style.display = 'flex';
            hiddenCheckboxContainer.style.alignItems = 'center';
            hiddenCheckboxContainer.style.justifyContent = 'center';
            hiddenCheckboxContainer.style.width = '36px'; // 与标签栏"显示"列宽度一致
            hiddenCheckboxContainer.style.marginRight = '4px'; // 添加右边距
            hiddenCheckboxContainer.style.padding = '2px';
            hiddenCheckboxContainer.style.borderRadius = '3px';
            hiddenCheckboxContainer.style.cursor = 'pointer';
            hiddenCheckboxContainer.title = t('m_61e773658c92');

            const hiddenCheckbox = document.createElement('input');
            hiddenCheckbox.type = 'checkbox';
            hiddenCheckbox.checked = !fconfig.hidden; // 勾选表示显示
            hiddenCheckbox.style.cursor = 'pointer';
            hiddenCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
            hiddenCheckbox.style.margin = '0';
            hiddenCheckbox.style.transform = 'scale(1.1)'; // 稍微放大勾选框以便操作

            // 删除了checkboxText元素，不再显示"显示"文字

            // 关键修复：先添加change事件监听器到checkbox
            hiddenCheckbox.addEventListener('change', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const newHiddenState = !hiddenCheckbox.checked;
                fconfig.hidden = newHiddenState;
                persistButtonConfig();
                console.log(t('m_0f7d8cda98a5', {
                    folderName: fname,
                    state: fconfig.hidden
                }));
                updateButtonContainer();
            });

            // 为checkbox添加click事件，确保优先处理
            hiddenCheckbox.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            });

            // 容器点击事件，点击容器时切换checkbox状态
            hiddenCheckboxContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 如果点击的不是checkbox本身，则手动切换checkbox状态
                if (e.target !== hiddenCheckbox) {
                    hiddenCheckbox.checked = !hiddenCheckbox.checked;
                    // 手动触发change事件
                    const changeEvent = new Event('change', { bubbles: false });
                    hiddenCheckbox.dispatchEvent(changeEvent);
                }
            });

            hiddenCheckboxContainer.appendChild(hiddenCheckbox);
            // 不再添加checkboxText


            // 创建编辑按钮
            const editFolderBtn = document.createElement('button');
            editFolderBtn.textContent = '✏️';
            editFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--primary-color, #3B82F6);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
            `;
            editFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showFolderEditDialog(fname, fconfig, (newFolderName) => {
                    selectedFolderName = newFolderName;
                    renderFolderList();
                    renderButtonList();
                });
            });

            const deleteFolderBtn = document.createElement('button');
            deleteFolderBtn.textContent = '🗑️';
            deleteFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--danger-color, #ef4444);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            deleteFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteFolderConfirmDialog(fname, () => {
                    const allFolders = buttonConfig.folderOrder;
                    selectedFolderName = allFolders[0] || null;
                    renderFolderList();
                    renderButtonList();
                    updateCounters(); // 更新所有计数器
                });
            });

            rightBtns.appendChild(hiddenCheckboxContainer);
            rightBtns.appendChild(editFolderBtn);
            rightBtns.appendChild(deleteFolderBtn);

            folderItem.appendChild(leftInfo);
            folderItem.appendChild(rightBtns);

            // 修改folderItem的点击事件，排除右侧按钮区域
            folderItem.addEventListener('click', (e) => {
                // 如果点击的是右侧按钮区域，不触发文件夹选择
                if (rightBtns.contains(e.target)) {
                    return;
                }
                selectedFolderName = fname;
                renderFolderList();
                renderButtonList();
            });

            folderItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', fname);
                folderItem.style.opacity = '0.5';
            });

            folderItem.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            folderItem.addEventListener('dragenter', () => {
                folderItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
            });

            folderItem.addEventListener('dragleave', () => {
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedFolder = e.dataTransfer.getData('text/plain');
                if (draggedFolder && draggedFolder !== fname) {
                    const draggedIndex = buttonConfig.folderOrder.indexOf(draggedFolder);
                    const targetIndex = buttonConfig.folderOrder.indexOf(fname);
                    if (draggedIndex > -1 && targetIndex > -1) {
                        const [removed] = buttonConfig.folderOrder.splice(draggedIndex, 1);
                        buttonConfig.folderOrder.splice(targetIndex, 0, removed);
                        persistButtonConfig();
                        renderFolderList();
                        renderButtonList();
                        console.log(t('m_3edae7a44072', {
                            draggedFolder,
                            targetFolder: fname
                        }));
                        // 更新按钮栏
                        updateButtonContainer();
                    }
                }
                // Check if a button is being dropped onto this folder
                const buttonData = e.dataTransfer.getData('application/json');
                if (buttonData) {
                    try {
                        const { buttonName: draggedBtnName, sourceFolder } = JSON.parse(buttonData);
                        if (draggedBtnName && sourceFolder && sourceFolder !== fname) {
                            // Move the button from sourceFolder to fname
                            const button = buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                            if (button) {
                                // Remove from source
                                delete buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                                // Add to target
                                buttonConfig.folders[fname].buttons[draggedBtnName] = button;
                                persistButtonConfig();
                                renderFolderList();
                                renderButtonList();
                                console.log(t('m_e42b7df278dc', {
                                    buttonName: draggedBtnName,
                                    sourceFolder,
                                    targetFolder: fname
                                }));
                                // Update button container
                                updateButtonContainer();
                            }
                        }
                    } catch (error) {
                        console.error(t('m_e38e5c156eb8'), error);
                    }
                }
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('dragend', () => {
                folderItem.style.opacity = '1';
            });

        folderListContainer.appendChild(folderItem);
    });
    };

    // 升级：更新所有计数显示的函数
    const updateCounters = () => {
        // 计算统计数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 更新文件夹总数计数
        const folderCountBadge = queryUI('#folderCountBadge');
        if (folderCountBadge) {
            folderCountBadge.textContent = totalFolders.toString();
            folderCountBadge.title = t('m_0b60cfe06c48', { count: totalFolders });
        }

        // 更新按钮总数计数
        const totalButtonCountBadge = queryUI('#totalButtonCountBadge');
        if (totalButtonCountBadge) {
            totalButtonCountBadge.textContent = totalButtons.toString();
            totalButtonCountBadge.title = t('m_5261cd43403d', { count: totalButtons });
        }

        // 更新当前文件夹按钮数计数
        if (selectedFolderName && buttonConfig.folders[selectedFolderName]) {
            const currentFolderButtonCount = Object.keys(buttonConfig.folders[selectedFolderName].buttons).length;
            const currentFolderBadge = queryUI('#currentFolderButtonCount');
            if (currentFolderBadge) {
                currentFolderBadge.textContent = currentFolderButtonCount.toString();
                currentFolderBadge.title = t('m_98bacf0e9e88', {
                    folderName: selectedFolderName,
                    count: currentFolderButtonCount
                });
            }
        }

        console.log(t('m_47347d4c883d', {
            folderCount: totalFolders,
            buttonCount: totalButtons
        }));
    };

    const renderButtonList = () => {
        if (!buttonListContainer) return;
        setTrustedHTML(buttonListContainer, '');
        scheduleSettingsHeaderButtonAlignment();
        if (!selectedFolderName) return;
        const currentFolderConfig = buttonConfig.folders[selectedFolderName];
        if (!currentFolderConfig) return;

    const rightHeader = document.createElement('div');
    rightHeader.style.display = 'flex';
    rightHeader.style.justifyContent = 'space-between';
    rightHeader.style.alignItems = 'center';
    rightHeader.style.marginBottom = '8px';

    const folderNameLabel = document.createElement('h3');
    folderNameLabel.style.display = 'flex';
    folderNameLabel.style.alignItems = 'center';
    folderNameLabel.style.gap = '10px';
    folderNameLabel.style.margin = '0';

    const folderNameText = document.createElement('span');
    setTrustedHTML(folderNameText, `➤ <strong>${selectedFolderName}</strong>`);

    const buttonCountBadge = document.createElement('span');
    buttonCountBadge.id = 'currentFolderButtonCount';
    buttonCountBadge.style.cssText = `
        background-color: var(--info-color, #6366F1);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        cursor: help;
        transition: all 0.2s ease;
    `;

    // 计算当前文件夹的按钮数量
    const buttonCount = Object.keys(currentFolderConfig.buttons).length;
    buttonCountBadge.textContent = buttonCount.toString();
    buttonCountBadge.title = t('m_98bacf0e9e88', {
        folderName: selectedFolderName,
        count: buttonCount
    });

    // 添加hover效果
    buttonCountBadge.addEventListener('mouseenter', () => {
        buttonCountBadge.style.transform = 'scale(1.15)';
        buttonCountBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    });
    buttonCountBadge.addEventListener('mouseleave', () => {
        buttonCountBadge.style.transform = 'scale(1)';
        buttonCountBadge.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });

    folderNameLabel.appendChild(folderNameText);
    folderNameLabel.appendChild(buttonCountBadge);

    const addNewButtonBtn = document.createElement('button');
    Object.assign(addNewButtonBtn.style, styles.button, {
        backgroundColor: 'var(--add-color, #fd7e14)',
        color: 'white',
        borderRadius: '4px'
    });
    addNewButtonBtn.setAttribute('data-settings-add-button', 'true');
    addNewButtonBtn.textContent = t('m_de56d7d6dfd2');
    addNewButtonBtn.addEventListener('click', () => {
        showButtonEditDialog(selectedFolderName, '', {}, () => {
            renderButtonList();
        });
    });

    rightHeader.appendChild(folderNameLabel);
    rightHeader.appendChild(addNewButtonBtn);

    buttonListContainer.appendChild(rightHeader);
    scheduleSettingsHeaderButtonAlignment();

    // 新增：创建包含标签栏和内容的容器，滚动条将出现在此容器右侧
    const contentWithHeaderContainer = document.createElement('div');
    contentWithHeaderContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px;
    `;

    // 创建按钮列表标签栏 - 固定在滚动容器顶部
    const buttonHeaderBar = document.createElement('div');
    buttonHeaderBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        position: sticky;
        top: 0;
        z-index: 2;
        flex-shrink: 0;
    `;

    const leftButtonHeaderLabel = document.createElement('div');
    leftButtonHeaderLabel.textContent = t('m_f0ff49e5f7e6');
    leftButtonHeaderLabel.style.flex = '1';
    leftButtonHeaderLabel.style.textAlign = 'left';
    leftButtonHeaderLabel.style.paddingLeft = 'calc(8px + 1em)';

    const rightButtonHeaderLabels = document.createElement('div');
    rightButtonHeaderLabels.style.display = 'flex';
    rightButtonHeaderLabels.style.gap = '4px';
    rightButtonHeaderLabels.style.alignItems = 'center';
    rightButtonHeaderLabels.style.width = '240px';
    rightButtonHeaderLabels.style.paddingLeft = '8px';
    rightButtonHeaderLabels.style.paddingRight = '12px';

    const variableLabel = document.createElement('div');
    variableLabel.textContent = t('m_b418ca60d417');
    variableLabel.style.width = '110px';
    variableLabel.style.textAlign = 'center';
    variableLabel.style.fontSize = '12px';
    variableLabel.style.marginLeft = '-1em';
    const autoSubmitLabel = document.createElement('div');
    autoSubmitLabel.textContent = t('m_473202b8cf49');
    autoSubmitLabel.style.width = '64px';
    autoSubmitLabel.style.textAlign = 'center';
    autoSubmitLabel.style.fontSize = '12px';
    autoSubmitLabel.style.marginLeft = 'calc(-0.5em)';

    const editButtonLabel = document.createElement('div');
    editButtonLabel.textContent = t('m_c9c77517fe85');
    editButtonLabel.style.width = '40px';
    editButtonLabel.style.textAlign = 'center';
    editButtonLabel.style.fontSize = '12px';

    const deleteButtonLabel = document.createElement('div');
    deleteButtonLabel.textContent = t('m_3755f56f2f83');
    deleteButtonLabel.style.width = '36px';
    deleteButtonLabel.style.textAlign = 'center';
    deleteButtonLabel.style.fontSize = '12px';

    rightButtonHeaderLabels.appendChild(variableLabel);
    rightButtonHeaderLabels.appendChild(autoSubmitLabel);
    rightButtonHeaderLabels.appendChild(editButtonLabel);
    rightButtonHeaderLabels.appendChild(deleteButtonLabel);

    buttonHeaderBar.appendChild(leftButtonHeaderLabel);
    buttonHeaderBar.appendChild(rightButtonHeaderLabels);

    // 修改：内容区域不再需要自己的滚动条和边框
    const btnScrollArea = document.createElement('div');
    btnScrollArea.style.cssText = `
        flex: 1;
        padding: 8px;
        overflow-y: visible;
        min-height: 0;
    `;

    const currentFolderButtons = Object.entries(currentFolderConfig.buttons);
    const createButtonPreview = (btnName, btnCfg) => {
        const btnEl = createCustomButtonElement(btnName, btnCfg);
        btnEl.style.marginBottom = '0px';
        btnEl.style.marginRight = '8px';
        btnEl.style.cursor = 'grab';
        btnEl.style.flexShrink = '1';
        btnEl.style.minWidth = '0';
        btnEl.style.maxWidth = '100%';
        btnEl.style.whiteSpace = 'normal';
        btnEl.style.wordBreak = 'break-word';
        btnEl.style.overflow = 'visible';
        btnEl.style.lineHeight = '1.4';
        btnEl.style.overflowWrap = 'anywhere';
        btnEl.style.display = 'inline-flex';
        btnEl.style.flexWrap = 'wrap';
        btnEl.style.alignItems = 'center';
        btnEl.style.justifyContent = 'flex-start';
        btnEl.style.columnGap = '6px';
        btnEl.style.rowGap = '2px';
        btnEl.style.alignSelf = 'flex-start';
        return btnEl;
    };

    currentFolderButtons.forEach(([btnName, cfg]) => {
        const btnItem = document.createElement('div');
        btnItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            padding: 4px;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px;
            background-color: var(--button-bg, #f3f4f6);
            cursor: move;
            width: 100%;
            box-sizing: border-box;
            overflow: visible;
        `;
        btnItem.setAttribute('draggable', 'true');
        btnItem.setAttribute('data-button-name', btnName);

        const leftPart = document.createElement('div');
        leftPart.style.display = 'flex';
        leftPart.style.alignItems = 'flex-start';
        leftPart.style.gap = '8px';
        leftPart.style.flex = '1';
        leftPart.style.minWidth = '0';
        leftPart.style.overflow = 'visible';

        const previewWrapper = document.createElement('div');
        previewWrapper.style.display = 'flex';
        previewWrapper.style.alignItems = 'flex-start';
        previewWrapper.style.flex = '1 1 auto';
        previewWrapper.style.maxWidth = '100%';
        previewWrapper.style.minWidth = '0';
        previewWrapper.style.overflow = 'visible';
        previewWrapper.style.alignSelf = 'flex-start';

        const btnPreview = createButtonPreview(btnName, cfg);
        previewWrapper.appendChild(btnPreview);
        leftPart.appendChild(previewWrapper);

        const opsDiv = document.createElement('div');
        opsDiv.style.display = 'flex';
        opsDiv.style.gap = '4px';
        opsDiv.style.alignItems = 'center';
        opsDiv.style.width = '240px';
        opsDiv.style.paddingLeft = '8px';
        opsDiv.style.paddingRight = '12px';
        opsDiv.style.flexShrink = '0';

        const variableInfoContainer = document.createElement('div');
        variableInfoContainer.style.display = 'flex';
        variableInfoContainer.style.alignItems = 'center';
        variableInfoContainer.style.justifyContent = 'center';
        variableInfoContainer.style.flexDirection = 'column';
        variableInfoContainer.style.width = '110px';
        variableInfoContainer.style.fontSize = '12px';
        variableInfoContainer.style.lineHeight = '1.2';
        variableInfoContainer.style.wordBreak = 'break-word';
        variableInfoContainer.style.textAlign = 'center';
        variableInfoContainer.style.color = 'var(--text-color, #333333)';

        if (cfg.type === 'template') {
            const variablesUsed = extractTemplateVariables(cfg.text || '');
            if (variablesUsed.length > 0) {
                const displayText = variablesUsed.join(isNonChineseLocale() ? ', ' : '、');
                variableInfoContainer.textContent = displayText;
                variableInfoContainer.title = t('m_1f0526af38c9', { variable: displayText });
            } else {
                variableInfoContainer.textContent = t('m_72077749f794');
                variableInfoContainer.title = t('m_a9a50f95b5e3');
            }
        } else {
            variableInfoContainer.textContent = '—';
            variableInfoContainer.title = t('m_792829e5fbb9');
        }

        // 创建"自动提交"开关容器
        const autoSubmitContainer = document.createElement('div');
        autoSubmitContainer.style.display = 'flex';
        autoSubmitContainer.style.alignItems = 'center';
        autoSubmitContainer.style.justifyContent = 'center';
        autoSubmitContainer.style.width = '60px';

        const autoSubmitCheckbox = document.createElement('input');
        autoSubmitCheckbox.type = 'checkbox';
        autoSubmitCheckbox.checked = cfg.autoSubmit || false;
        autoSubmitCheckbox.style.cursor = 'pointer';
        autoSubmitCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
        autoSubmitCheckbox.style.margin = '0';
        autoSubmitCheckbox.style.transform = 'scale(1.1)';
        autoSubmitCheckbox.addEventListener('change', () => {
            cfg.autoSubmit = autoSubmitCheckbox.checked;
            persistButtonConfig();
            console.log(t('m_06aa3f222c01', {
                buttonName: btnName,
                state: autoSubmitCheckbox.checked
            }));
        });

        autoSubmitContainer.appendChild(autoSubmitCheckbox);

        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--primary-color, #3B82F6);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showButtonEditDialog(selectedFolderName, btnName, cfg, () => {
                renderButtonList();
            });
        });

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--danger-color, #ef4444);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteButtonConfirmDialog(selectedFolderName, btnName, () => {
                renderButtonList();
            });
        });

        opsDiv.appendChild(variableInfoContainer);
        opsDiv.appendChild(autoSubmitContainer);
        opsDiv.appendChild(editBtn);
        opsDiv.appendChild(deleteBtn);

        btnItem.appendChild(leftPart);
        btnItem.appendChild(opsDiv);

        btnItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: btnName,
                sourceFolder: selectedFolderName
            }));
            btnItem.style.opacity = '0.5';
        });

        btnItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        btnItem.addEventListener('dragenter', () => {
            btnItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
        });

        btnItem.addEventListener('dragleave', () => {
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const { buttonName: draggedBtnName } = data;
            if (draggedBtnName && draggedBtnName !== btnName) {
                const buttonsKeys = Object.keys(buttonConfig.folders[selectedFolderName].buttons);
                const draggedIndex = buttonsKeys.indexOf(draggedBtnName);
                const targetIndex = buttonsKeys.indexOf(btnName);
                if (draggedIndex > -1 && targetIndex > -1) {
                    const reordered = [...buttonsKeys];
                    reordered.splice(draggedIndex, 1);
                    reordered.splice(targetIndex, 0, draggedBtnName);
                    const newOrderedMap = {};
                    reordered.forEach(k => {
                        newOrderedMap[k] = buttonConfig.folders[selectedFolderName].buttons[k];
                    });
                    buttonConfig.folders[selectedFolderName].buttons = newOrderedMap;
                    persistButtonConfig();
                    renderButtonList();
                    console.log(t('m_d7b8de9c54ed', {
                        buttonName: draggedBtnName,
                        targetName: btnName
                    }));
                    // 更新按钮栏
                    updateButtonContainer();
                }
            }
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('dragend', () => {
            btnItem.style.opacity = '1';
        });

        btnScrollArea.appendChild(btnItem);
    });

    // 修改：将标签栏和内容区域添加到新的容器中
    contentWithHeaderContainer.appendChild(buttonHeaderBar);
    contentWithHeaderContainer.appendChild(btnScrollArea);

    // 修改：将新容器添加到主容器中
    buttonListContainer.appendChild(contentWithHeaderContainer);
};

    const showUnifiedSettingsDialog = () => {
        if (settingsDialogMainContainer) {
            settingsDialogMainContainer.style.minHeight = '';
            settingsDialogMainContainer = null;
        }
        if (currentSettingsOverlay) {
            closeExistingOverlay(currentSettingsOverlay);
            currentSettingsOverlay = null;
        }
        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '920px',
            maxWidth: '95vw',
            maxHeight: '80vh',
            padding: '24px',
            zIndex: '11000',
            closeOnOverlayClick: true,
            closeOnEscape: true,
            overlayClassName: 'settings-overlay',
            dialogClassName: 'settings-dialog',
            dialogStyles: {
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            },
            beforeClose: () => {
                persistButtonConfig();
                closeConfigOverlayHandler();

                if (settingsDialogMainContainer) {
                    settingsDialogMainContainer.style.minHeight = '';
                    settingsDialogMainContainer = null;
                }

                attachButtons();
                updateButtonContainer();
                return true;
            },
            onClose: () => {
                if (typeof overlay.__cttfSettingsHeaderAlignmentCleanup === 'function') {
                    overlay.__cttfSettingsHeaderAlignmentCleanup();
                    overlay.__cttfSettingsHeaderAlignmentCleanup = null;
                }
                if (currentSettingsOverlay === overlay) {
                    currentSettingsOverlay = null;
                }
            },
        });

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '12px';
        header.style.marginBottom = '16px';

        const title = document.createElement('h2');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '12px';
        title.style.margin = '0';
        title.style.fontSize = '20px';
        title.style.fontWeight = '600';
        title.style.flex = '1';
        title.style.minWidth = '0';

        const titleText = document.createElement('span');
        titleText.textContent = t('m_16dba9301e32');

        const collapseToggleBtn = document.createElement('button');
        collapseToggleBtn.type = 'button';
        collapseToggleBtn.style.cssText = `
            background-color: transparent;
            color: var(--text-color, #333333);
            border: none;
            border-radius: 4px;
            padding: 4px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        collapseToggleBtn.title = t('m_27964bc08178');
        collapseToggleBtn.setAttribute('aria-label', collapseToggleBtn.title);
        const collapseToggleSVG = `<svg fill="currentColor" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 7.7148 49.5742 L 48.2852 49.5742 C 53.1836 49.5742 55.6446 47.1367 55.6446 42.3086 L 55.6446 13.6914 C 55.6446 8.8633 53.1836 6.4258 48.2852 6.4258 L 7.7148 6.4258 C 2.8398 6.4258 .3554 8.8398 .3554 13.6914 L .3554 42.3086 C .3554 47.1602 2.8398 49.5742 7.7148 49.5742 Z M 7.7851 45.8008 C 5.4413 45.8008 4.1288 44.5586 4.1288 42.1211 L 4.1288 13.8789 C 4.1288 11.4414 5.4413 10.1992 7.7851 10.1992 L 18.2148 10.1992 L 18.2148 45.8008 Z M 48.2147 10.1992 C 50.5350 10.1992 51.8708 11.4414 51.8708 13.8789 L 51.8708 42.1211 C 51.8708 44.5586 50.5350 45.8008 48.2147 45.8008 L 21.8944 45.8008 L 21.8944 10.1992 Z M 13.7148 18.8945 C 14.4179 18.8945 15.0507 18.2617 15.0507 17.5820 C 15.0507 16.8789 14.4179 16.2696 13.7148 16.2696 L 8.6757 16.2696 C 7.9726 16.2696 7.3632 16.8789 7.3632 17.5820 C 7.3632 18.2617 7.9726 18.8945 8.6757 18.8945 Z M 13.7148 24.9649 C 14.4179 24.9649 15.0507 24.3320 15.0507 23.6289 C 15.0507 22.9258 14.4179 22.3398 13.7148 22.3398 L 8.6757 22.3398 C 7.9726 22.3398 7.3632 22.9258 7.3632 23.6289 C 7.3632 24.3320 7.9726 24.9649 8.6757 24.9649 Z M 13.7148 31.0118 C 14.4179 31.0118 15.0507 30.4258 15.0507 29.7227 C 15.0507 29.0196 14.4179 28.4102 13.7148 28.4102 L 8.6757 28.4102 C 7.9726 28.4102 7.3632 29.0196 7.3632 29.7227 C 7.3632 30.4258 7.9726 31.0118 8.6757 31.0118 Z"></path></g></svg>`;
        setTrustedHTML(collapseToggleBtn, collapseToggleSVG);
        collapseToggleBtn.style.flex = '0 0 auto';
        collapseToggleBtn.style.flexShrink = '0';
        collapseToggleBtn.style.width = '28px';
        collapseToggleBtn.style.height = '28px';
        collapseToggleBtn.style.minWidth = '28px';
        collapseToggleBtn.style.minHeight = '28px';
        collapseToggleBtn.style.maxWidth = '28px';
        collapseToggleBtn.style.maxHeight = '28px';
        collapseToggleBtn.style.padding = '0';
        collapseToggleBtn.style.lineHeight = '0';
        collapseToggleBtn.style.boxSizing = 'border-box';
        collapseToggleBtn.style.aspectRatio = '1 / 1';
        const collapseToggleIcon = collapseToggleBtn.querySelector('svg');
        if (collapseToggleIcon) {
            collapseToggleIcon.style.width = '16px';
            collapseToggleIcon.style.height = '16px';
            collapseToggleIcon.style.display = 'block';
            collapseToggleIcon.style.flex = '0 0 auto';
        }

        // 计数器容器
        const countersContainer = document.createElement('div');
        countersContainer.style.display = 'flex';
        countersContainer.style.gap = '8px';
        countersContainer.style.alignItems = 'center';

        // 文件夹总数计数器（圆形）
        const folderCountBadge = document.createElement('span');
        folderCountBadge.id = 'folderCountBadge';
        folderCountBadge.style.cssText = `
            background-color: var(--primary-color, #3B82F6);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 按钮总数计数器（圆形）
        const totalButtonCountBadge = document.createElement('span');
        totalButtonCountBadge.id = 'totalButtonCountBadge';
        totalButtonCountBadge.style.cssText = `
            background-color: var(--success-color, #22c55e);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 计算初始数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 设置计数和提示
        folderCountBadge.textContent = totalFolders.toString();
        folderCountBadge.title = t('m_0b60cfe06c48', { count: totalFolders });

        totalButtonCountBadge.textContent = totalButtons.toString();
        totalButtonCountBadge.title = t('m_5261cd43403d', { count: totalButtons });

        // 添加hover效果
        [folderCountBadge, totalButtonCountBadge].forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
                badge.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });

        countersContainer.appendChild(folderCountBadge);
        countersContainer.appendChild(totalButtonCountBadge);

        title.appendChild(collapseToggleBtn);
        title.appendChild(titleText);
        title.appendChild(countersContainer);

        const headerBtnsWrapper = document.createElement('div');
        headerBtnsWrapper.style.display = 'flex';
        headerBtnsWrapper.style.alignItems = 'center';
        headerBtnsWrapper.style.gap = `${SETTINGS_HEADER_BUTTON_GAP}px`;
        headerBtnsWrapper.style.flexWrap = 'wrap';
        headerBtnsWrapper.style.justifyContent = 'flex-end';

        // 新建自动化按钮
        const automationBtn = document.createElement('button');
        automationBtn.innerText = t('m_f870f5d3c7fa');
        automationBtn.type = 'button';
        automationBtn.setAttribute('data-settings-header-action', 'automation');
        automationBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        automationBtn.style.color = 'white';
        automationBtn.style.border = 'none';
        automationBtn.style.borderRadius = '4px';
        automationBtn.style.padding = '5px 10px';
        automationBtn.style.cursor = 'pointer';
        automationBtn.style.fontSize = '14px';
        automationBtn.addEventListener('click', () => {
            showAutomationSettingsDialog();
        });
        headerBtnsWrapper.appendChild(automationBtn);

        // 样式管理按钮
        const styleMgmtBtn = document.createElement('button');
        styleMgmtBtn.innerText = t('m_58389daa203e');
        styleMgmtBtn.type = 'button';
        styleMgmtBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        styleMgmtBtn.style.color = 'white';
        styleMgmtBtn.style.border = 'none';
        styleMgmtBtn.style.borderRadius = '4px';
        styleMgmtBtn.style.padding = '5px 10px';
        styleMgmtBtn.style.cursor = 'pointer';
        styleMgmtBtn.style.fontSize = '14px';
        styleMgmtBtn.addEventListener('click', () => {
            showStyleSettingsDialog();
        });
        headerBtnsWrapper.appendChild(styleMgmtBtn);

        // 原有创建脚本配置按钮
        const openConfigBtn = createConfigSettingsButton();
        headerBtnsWrapper.appendChild(openConfigBtn);

        // 轻关闭按钮
        const closeSettingsBtn = createDialogCloseIconButton((event) => {
            void overlay.__cttfRequestClose('button', event);
        });
        closeSettingsBtn.style.marginLeft = `${SETTINGS_HEADER_BUTTON_GAP}px`;
        settingsHeaderActionButtons = headerBtnsWrapper;
        settingsHeaderCloseButton = closeSettingsBtn;

        header.appendChild(title);
        header.appendChild(headerBtnsWrapper);
        header.appendChild(closeSettingsBtn);

        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flex = '1';
        mainContainer.style.overflow = 'hidden';
        mainContainer.style.flexWrap = 'nowrap';
        mainContainer.style.overflowX = 'auto';
        mainContainer.style.borderTop = `1px solid var(--border-color, #e5e7eb)`;
        settingsDialogMainContainer = mainContainer;

        const folderPanel = document.createElement('div');
        folderPanel.style.display = 'flex';
        folderPanel.style.flexDirection = 'column';
        folderPanel.style.width = '280px';
        folderPanel.style.minWidth = '280px';
        folderPanel.style.marginRight = '12px';
        folderPanel.style.overflowY = 'auto';
        folderPanel.style.padding = '2px 8px 4px 2px';

        // 新增：创建文件夹列表标签栏
        const folderHeaderBar = document.createElement('div');
        folderHeaderBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            position: sticky;
            top: 0;
            z-index: 1;
        `;

        const leftHeaderLabel = document.createElement('div');
        leftHeaderLabel.textContent = t('m_6af274b8d873');
        leftHeaderLabel.style.flex = '1';
        leftHeaderLabel.style.textAlign = 'left';
        leftHeaderLabel.style.paddingLeft = 'calc(8px + 1em)';

        const rightHeaderLabels = document.createElement('div');
        rightHeaderLabels.style.display = 'flex';
        rightHeaderLabels.style.gap = '0px';
        rightHeaderLabels.style.alignItems = 'center';
        rightHeaderLabels.style.width = '140px'; // 增加宽度以提供更多间距
        rightHeaderLabels.style.paddingLeft = '8px'; // 添加左侧padding，向左移动标签
        rightHeaderLabels.style.paddingRight = '12px'; // 增加右侧间距

        const showLabel = document.createElement('div');
        showLabel.textContent = t('m_71b6771bc789');
        showLabel.style.width = '36px'; // 稍微减小宽度
        showLabel.style.textAlign = 'center';
        showLabel.style.fontSize = '12px';
        showLabel.style.marginRight = '4px'; // 添加右边距

        const editLabel = document.createElement('div');
        editLabel.textContent = t('m_c9c77517fe85');
        editLabel.style.width = '36px'; // 稍微减小宽度
        editLabel.style.textAlign = 'center';
        editLabel.style.fontSize = '12px';
        editLabel.style.marginRight = '4px'; // 添加右边距

        const deleteLabel = document.createElement('div');
        deleteLabel.textContent = t('m_3755f56f2f83');
        deleteLabel.style.width = '36px'; // 稍微减小宽度
        deleteLabel.style.textAlign = 'center';
        deleteLabel.style.fontSize = '12px';

        rightHeaderLabels.appendChild(showLabel);
        rightHeaderLabels.appendChild(editLabel);
        rightHeaderLabels.appendChild(deleteLabel);

        folderHeaderBar.appendChild(leftHeaderLabel);
        folderHeaderBar.appendChild(rightHeaderLabels);

        folderListContainer = document.createElement('div');
        folderListContainer.style.flex = '1';
        folderListContainer.style.overflowY = 'auto';
        folderListContainer.style.padding = '8px';
        folderListContainer.style.direction = 'rtl';
        folderListContainer.style.border = '1px solid var(--border-color, #e5e7eb)';
        folderListContainer.style.borderTop = 'none';
        folderListContainer.style.borderRadius = '0 0 4px 4px';

        const folderAddContainer = document.createElement('div');
        folderAddContainer.style.padding = '8px';
        folderAddContainer.style.display = 'flex';
        folderAddContainer.style.justifyContent = 'center';

        const addNewFolderBtn = document.createElement('button');
        Object.assign(addNewFolderBtn.style, styles.button, {
            backgroundColor: 'var(--add-color, #fd7e14)',
            color: 'white',
            borderRadius: '4px'
        });
        addNewFolderBtn.textContent = t('m_09b1c4a5e9a1');
        addNewFolderBtn.addEventListener('click', () => {
            showFolderEditDialog('', {}, (newFolderName) => {
                selectedFolderName = newFolderName;
                renderFolderList();
                renderButtonList();
                console.log(t('m_6219b5d715a7', { folderName: newFolderName }));
            });
        });
        folderAddContainer.appendChild(addNewFolderBtn);

        folderPanel.appendChild(folderHeaderBar);
        folderPanel.appendChild(folderListContainer);
        folderPanel.appendChild(folderAddContainer);

        buttonListContainer = document.createElement('div');
        buttonListContainer.style.flex = '1';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.display = 'flex';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.padding = '8px 8px 4px 8px';
        buttonListContainer.style.minWidth = '520px'; // 加宽右侧区域以提供更多内容空间

        const updateFolderPanelVisibility = () => {
            const container = settingsDialogMainContainer || mainContainer;
            if (isSettingsFolderPanelCollapsed) {
                if (container) {
                    const currentHeight = container.offsetHeight;
                    if (currentHeight > 0) {
                        container.style.minHeight = `${currentHeight}px`;
                    } else {
                        window.requestAnimationFrame(() => {
                            if (!isSettingsFolderPanelCollapsed) return;
                            const activeContainer = settingsDialogMainContainer || container;
                            if (!activeContainer) return;
                            const measuredHeight = activeContainer.offsetHeight;
                            if (measuredHeight > 0) {
                                activeContainer.style.minHeight = `${measuredHeight}px`;
                            }
                        });
                    }
                }
                folderPanel.style.display = 'none';
                collapseToggleBtn.title = t('m_a69ce2034bc4');
                collapseToggleBtn.setAttribute('aria-label', t('m_a69ce2034bc4'));
            } else {
                folderPanel.style.display = 'flex';
                collapseToggleBtn.title = t('m_27964bc08178');
                collapseToggleBtn.setAttribute('aria-label', t('m_27964bc08178'));
                if (container) {
                    container.style.minHeight = '';
                }
            }
        };

        collapseToggleBtn.addEventListener('click', () => {
            isSettingsFolderPanelCollapsed = !isSettingsFolderPanelCollapsed;
            updateFolderPanelVisibility();
        });

        updateFolderPanelVisibility();

        renderFolderList();
        renderButtonList();

        mainContainer.appendChild(folderPanel);
        mainContainer.appendChild(buttonListContainer);

        const footer = document.createElement('div');
        footer.style.display = 'none';
        dialog.appendChild(header);
        dialog.appendChild(mainContainer);
        dialog.appendChild(footer);
        scheduleSettingsHeaderButtonAlignment();

        const handleSettingsDialogResize = () => {
            scheduleSettingsHeaderButtonAlignment();
        };
        window.addEventListener('resize', handleSettingsDialogResize);
        overlay.__cttfSettingsHeaderAlignmentCleanup = () => {
            window.removeEventListener('resize', handleSettingsDialogResize);
            resetSettingsHeaderButtonAlignment();
        };

        currentSettingsOverlay = overlay;
        overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
            if (currentSettingsOverlay !== overlay) {
                return;
            }
            showUnifiedSettingsDialog();
        });
    };

export {
    getCurrentSettingsOverlay,
    renderButtonList,
    renderFolderList,
    setCloseConfigOverlayHandler,
    setSelectedFolderName,
    showUnifiedSettingsDialog,
    updateCounters,
};
