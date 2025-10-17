/* -------------------------------------------------------------------------- *
 * Module 04 · Script config (脚本配置)
 * -------------------------------------------------------------------------- */

    let currentDiffOverlay = null;
    let currentConfigOverlay = null;

    function exportConfig() {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        const fileName = `[Chat] Template Text Folders「${yyyy}-${mm}-${dd}」「${hh}：${minutes}：${ss}」.json`;
        const dataStr = JSON.stringify(buttonConfig, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        console.log(t('📤 配置已导出。'));
    }

    function showImportDiffPreview(currentConfig, importedConfig) {
        if (currentDiffOverlay) {
            closeExistingOverlay(currentDiffOverlay);
            currentDiffOverlay = null;
        }

        const overlay = document.createElement('div');
        overlay.classList.add('import-diff-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.55));
            backdrop-filter: blur(3px);
            z-index: 14000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('import-diff-dialog');
        dialog.classList.add('cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 6px;
            padding: 8px 18px 16px;
            box-shadow: 0 18px 36px var(--shadow-color, rgba(15, 23, 42, 0.35));
            border: 1px solid var(--border-color, #e5e7eb);
            width: 960px;
            max-width: 96vw;
            max-height: 82vh;
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transition: transform 0.3s ease;
            overflow: hidden;
        `;

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentDiffOverlay = overlay;

        const cleanupFns = [];
        const cleanup = () => {
            while (cleanupFns.length) {
                const fn = cleanupFns.pop();
                try {
                    fn();
                } catch (error) {
                    console.warn('[Chat] Template Text Folders diff preview cleanup failed:', error);
                }
            }
        };

        const closeDiffOverlay = () => {
            if (overlay) {
                overlay.__cttfCloseDiff = null;
            }
            if (!overlay || !overlay.isConnected) {
                currentDiffOverlay = null;
                cleanup();
                return;
            }
            dialog.style.transform = 'scale(0.95)';
            closeExistingOverlay(overlay);
            currentDiffOverlay = null;
            cleanup();
        };
        overlay.__cttfCloseDiff = closeDiffOverlay;

        const onKeydown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeDiffOverlay();
            }
        };
        document.addEventListener('keydown', onKeydown);
        cleanupFns.push(() => document.removeEventListener('keydown', onKeydown));

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            margin-bottom: 6px;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color, #333333);
        `;
        title.textContent = t('🔍 配置差异预览');

        const headerActions = document.createElement('div');
        headerActions.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.style.cssText = `
            background-color: transparent;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-color, #333333);
            transition: background-color 0.2s ease;
        `;
        closeBtn.textContent = '✕';
        closeBtn.setAttribute('aria-label', t('关闭'));
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeDiffOverlay();
        });

        headerActions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(headerActions);
        dialog.appendChild(header);

        const overlayClickHandler = (event) => {
            if (event.target === overlay) {
                event.stopPropagation();
                event.preventDefault();
            }
        };
        overlay.addEventListener('click', overlayClickHandler);
        cleanupFns.push(() => overlay.removeEventListener('click', overlayClickHandler));

        dialog.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const safeClone = (value) => {
            if (value == null) return value;
            try {
                return JSON.parse(JSON.stringify(value));
            } catch (error) {
                console.warn('[Chat] Template Text Folders diff preview clone failed:', error);
                return value;
            }
        };

        const normalizeConfig = (config) => {
            const safe = (config && typeof config === 'object') ? config : {};
            const folders = safe.folders && typeof safe.folders === 'object' ? safeClone(safe.folders) || {} : {};
            const folderOrder = Array.isArray(safe.folderOrder) ? [...safe.folderOrder] : Object.keys(folders);
            return { folders, folderOrder };
        };

        const toComparable = (value) => {
            if (value === null || typeof value !== 'object') {
                return value;
            }
            if (Array.isArray(value)) {
                return value.map((item) => toComparable(item));
            }
            const sorted = {};
            Object.keys(value).sort().forEach((key) => {
                sorted[key] = toComparable(value[key]);
            });
            return sorted;
        };

        const deepEqual = (a, b) => {
            if (a === b) return true;
            try {
                return JSON.stringify(toComparable(a)) === JSON.stringify(toComparable(b));
            } catch (error) {
                console.warn('[Chat] Template Text Folders diff preview compare failed:', error);
                return false;
            }
        };

        const createBadge = (label, variant = 'neutral') => {
            const badge = document.createElement('span');
            badge.textContent = label;
            badge.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.01em;
                white-space: nowrap;
            `;
            const variants = {
                added: {
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: 'var(--success-color, #22c55e)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                },
                removed: {
                    background: 'rgba(248, 113, 113, 0.15)',
                    color: 'var(--danger-color, #f87171)',
                    border: '1px solid rgba(248, 113, 113, 0.3)'
                },
                changed: {
                    background: 'rgba(59, 130, 246, 0.14)',
                    color: 'var(--info-color, #4F46E5)',
                    border: '1px solid rgba(59, 130, 246, 0.28)'
                },
                neutral: {
                    background: 'var(--button-bg, #f3f4f6)',
                    color: 'var(--text-color, #333333)',
                    border: '1px solid var(--border-color, #e5e7eb)'
                }
            };
            const style = variants[variant] || variants.neutral;
            badge.style.background = style.background;
            badge.style.color = style.color;
            badge.style.border = style.border;
            return badge;
        };

        const statusVariantMap = {
            added: 'added',
            removed: 'removed',
            changed: 'changed',
            unchanged: 'neutral'
        };

        const statusTextMap = {
            added: '新增',
            removed: '移除',
            changed: '变更'
        };

        const folderCountLabelMap = {
            added: '+{{count}}',
            removed: '移除文件夹 {{count}} 个',
            changed: '修改：{{count}}'
        };

        const buttonCountLabelMap = {
            added: '+{{count}}',
            removed: '-{{count}}',
            changed: '修改：{{count}}'
        };

        const normalizeButtonNameForDiff = (value) => {
            if (value == null) return '';
            const str = typeof value === 'string' ? value : String(value);
            const normalized = typeof str.normalize === 'function' ? str.normalize('NFKC') : str;
            return normalized.replace(/\s+/g, ' ').trim();
        };

        const computeButtonDiffs = (currentFolderConfig, importedFolderConfig) => {
            const result = [];
            const currentButtons = currentFolderConfig && currentFolderConfig.buttons && typeof currentFolderConfig.buttons === 'object'
                ? currentFolderConfig.buttons
                : {};
            const importedButtons = importedFolderConfig && importedFolderConfig.buttons && typeof importedFolderConfig.buttons === 'object'
                ? importedFolderConfig.buttons
                : {};
            const currentOrder = Object.keys(currentButtons);
            const importedOrder = Object.keys(importedButtons);

            const importedBuckets = new Map();
            importedOrder.forEach((btnName) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                if (!importedBuckets.has(normalized)) {
                    importedBuckets.set(normalized, []);
                }
                importedBuckets.get(normalized).push(btnName);
            });

            const usedImportedNames = new Set();

            currentOrder.forEach((btnName) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                const bucket = importedBuckets.get(normalized) || [];
                const matchedName = bucket.find((candidate) => !usedImportedNames.has(candidate)) || null;
                if (matchedName) {
                    usedImportedNames.add(matchedName);
                }
                const currentBtn = currentButtons[btnName] || null;
                const importedBtn = matchedName ? (importedButtons[matchedName] || null) : null;
                const fieldsChanged = [];
                if (currentBtn && importedBtn) {
                    const keys = new Set([
                        ...Object.keys(currentBtn),
                        ...Object.keys(importedBtn)
                    ]);
                    keys.forEach((key) => {
                        if (!deepEqual(currentBtn[key], importedBtn[key])) {
                            fieldsChanged.push(key);
                        }
                    });
                }
                const orderChanged = currentBtn && importedBtn
                    ? currentOrder.indexOf(btnName) !== importedOrder.indexOf(matchedName)
                    : false;
                const trimmedCurrent = typeof btnName === 'string' ? btnName.trim() : btnName;
                const trimmedImported = typeof matchedName === 'string' ? matchedName.trim() : matchedName;
                const renamed = Boolean(currentBtn && importedBtn && trimmedCurrent !== trimmedImported);
                let status = 'unchanged';
                if (!importedBtn) {
                    status = 'removed';
                } else if (fieldsChanged.length || orderChanged || renamed) {
                    status = 'changed';
                }
                result.push({
                    id: normalized || btnName,
                    name: btnName,
                    currentName: btnName,
                    importedName: matchedName,
                    current: currentBtn,
                    imported: importedBtn,
                    fieldsChanged,
                    orderChanged,
                    renamed,
                    status
                });
            });

            importedOrder.forEach((btnName) => {
                if (usedImportedNames.has(btnName)) {
                    return;
                }
                const normalized = normalizeButtonNameForDiff(btnName);
                const importedBtn = importedButtons[btnName] || null;
                result.push({
                    id: normalized || btnName,
                    name: btnName,
                    currentName: null,
                    importedName: btnName,
                    current: null,
                    imported: importedBtn,
                    fieldsChanged: [],
                    orderChanged: false,
                    renamed: false,
                    status: 'added'
                });
            });

            return {
                list: result,
                currentOrder,
                importedOrder
            };
        };

        const current = normalizeConfig(currentConfig);
        const next = normalizeConfig(importedConfig);

        const allFolderNames = [];
        const pushFolderName = (name) => {
            if (!name || typeof name !== 'string') return;
            if (!allFolderNames.includes(name)) {
                allFolderNames.push(name);
            }
        };
        current.folderOrder.forEach(pushFolderName);
        next.folderOrder.forEach(pushFolderName);
        Object.keys(current.folders).forEach(pushFolderName);
        Object.keys(next.folders).forEach(pushFolderName);

        const folderDiffs = [];
        const summary = {
            folder: { added: 0, removed: 0, changed: 0 },
            button: { added: 0, removed: 0, changed: 0 }
        };

        allFolderNames.forEach((folderName) => {
            const currentFolder = current.folders[folderName] || null;
            const importedFolder = next.folders[folderName] || null;
            const currentIndex = current.folderOrder.indexOf(folderName);
            const importedIndex = next.folderOrder.indexOf(folderName);
            const metaChanges = [];
            if (currentFolder && importedFolder) {
                ['color', 'textColor', 'hidden'].forEach((key) => {
                    if (!deepEqual(currentFolder[key], importedFolder[key])) {
                        metaChanges.push(key);
                    }
                });
            }
            const { list: buttonDiffs, currentOrder, importedOrder } = computeButtonDiffs(currentFolder, importedFolder);
            const buttonCounts = {
                added: buttonDiffs.filter((item) => item.status === 'added').length,
                removed: buttonDiffs.filter((item) => item.status === 'removed').length,
                changed: buttonDiffs.filter((item) => item.status === 'changed').length
            };
            summary.button.added += buttonCounts.added;
            summary.button.removed += buttonCounts.removed;
            summary.button.changed += buttonCounts.changed;

            const hasOrderChange = currentFolder && importedFolder && currentIndex !== importedIndex;

            let status = 'unchanged';
            if (!currentFolder) {
                status = 'added';
                summary.folder.added += 1;
            } else if (!importedFolder) {
                status = 'removed';
                summary.folder.removed += 1;
            } else if (metaChanges.length || hasOrderChange || buttonCounts.added || buttonCounts.removed || buttonCounts.changed) {
                status = 'changed';
                summary.folder.changed += 1;
            }

            folderDiffs.push({
                name: folderName,
                current: currentFolder,
                imported: importedFolder,
                currentIndex,
                importedIndex,
                metaChanges,
                hasOrderChange,
                buttonDiffs,
                buttonOrder: {
                    current: currentOrder,
                    imported: importedOrder
                },
                buttonCounts,
                status
            });
        });

        const folderDiffMap = new Map(folderDiffs.map((item) => [item.name, item]));
        let selectedFolderName = (folderDiffs.find((item) => item.status !== 'unchanged') || folderDiffs[0] || {}).name || null;

        const folderPanelWidth = 260;
        const layoutGap = 16;

        const summaryBar = document.createElement('div');
        const applySummaryGridLayout = () => {
            summaryBar.style.display = 'grid';
            summaryBar.style.gridTemplateColumns = `${folderPanelWidth}px ${layoutGap}px 1fr`;
            summaryBar.style.alignItems = 'center';
            summaryBar.style.columnGap = '0';
            summaryBar.style.rowGap = '8px';
            summaryBar.style.marginBottom = '8px';
        };
        applySummaryGridLayout();

        const summaryGroupStyle = `
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        `;

        const folderSummary = document.createElement('div');
        folderSummary.style.cssText = summaryGroupStyle;
        folderSummary.style.gridColumn = '1 / 2';

        const buttonSummary = document.createElement('div');
        buttonSummary.style.cssText = summaryGroupStyle;
        buttonSummary.style.gridColumn = '3 / 4';

        summaryBar.appendChild(folderSummary);
        summaryBar.appendChild(buttonSummary);

        setTrustedHTML(folderSummary, '');
        setTrustedHTML(buttonSummary, '');

        let folderBadgeCount = 0;
        let buttonBadgeCount = 0;

        ['added', 'removed', 'changed'].forEach((key) => {
            const count = summary.folder[key];
            if (count > 0) {
                folderSummary.appendChild(createBadge(t(folderCountLabelMap[key], { count }), statusVariantMap[key]));
                folderBadgeCount += 1;
            }
        });

        ['added', 'removed', 'changed'].forEach((key) => {
            const count = summary.button[key];
            if (count > 0) {
                buttonSummary.appendChild(createBadge(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
                buttonBadgeCount += 1;
            }
        });

        if (!folderBadgeCount && !buttonBadgeCount) {
            summaryBar.innerHTML = '';
            summaryBar.style.display = 'flex';
            summaryBar.style.flexWrap = 'wrap';
            summaryBar.style.alignItems = 'center';
            summaryBar.style.justifyContent = 'center';
            summaryBar.style.gap = '8px';
            summaryBar.style.marginBottom = '8px';
            const noDiff = document.createElement('span');
            noDiff.textContent = t('暂无差异，导入配置的结构与当前一致。');
            noDiff.style.color = 'var(--muted-text-color, #6b7280)';
            noDiff.style.fontSize = '13px';
            summaryBar.appendChild(noDiff);
        } else {
            applySummaryGridLayout();
            let spacer = summaryBar.querySelector('.cttf-summary-spacer');
            if (!spacer) {
                spacer = document.createElement('div');
                spacer.className = 'cttf-summary-spacer';
                spacer.style.gridColumn = '2 / 3';
                summaryBar.appendChild(spacer);
            }
            folderSummary.style.display = folderBadgeCount ? 'flex' : 'none';
            buttonSummary.style.display = buttonBadgeCount ? 'flex' : 'none';
        }

        dialog.appendChild(summaryBar);

        const layoutContainer = document.createElement('div');
        layoutContainer.style.cssText = `
            display: flex;
            gap: 16px;
            flex: 1;
            min-height: 0;
        `;
        dialog.appendChild(layoutContainer);

        const folderPanel = document.createElement('div');
        folderPanel.style.cssText = `
            flex: 0 0 260px;
            display: flex;
            flex-direction: column;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            overflow: hidden;
        `;
        layoutContainer.appendChild(folderPanel);

        const folderPanelHeader = document.createElement('div');
        folderPanelHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            position: sticky;
            top: 0;
            z-index: 1;
        `;
        folderPanelHeader.textContent = t('文件夹');
        folderPanel.appendChild(folderPanelHeader);

        const folderList = document.createElement('div');
        folderList.style.cssText = `
            flex: 1;
            overflow: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        folderList.classList.add('cttf-scrollable');
        folderList.style.direction = 'rtl';
        folderPanel.appendChild(folderList);

        const detailPanel = document.createElement('div');
        detailPanel.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            background-color: var(--dialog-bg, #ffffff);
            overflow: hidden;
        `;
        layoutContainer.appendChild(detailPanel);

        const renderFolderList = () => {
            setTrustedHTML(folderList, '');
            if (!folderDiffs.length) {
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    padding: 16px;
                    font-size: 13px;
                    color: var(--muted-text-color, #6b7280);
                    text-align: center;
                    border: 1px dashed var(--border-color, #e5e7eb);
                    border-radius: 6px;
                `;
                placeholder.textContent = t('暂无差异，导入配置的结构与当前一致。');
                folderList.appendChild(placeholder);
                return;
            }

            folderDiffs.forEach((item) => {
                const folderButton = document.createElement('button');
                folderButton.type = 'button';
                folderButton.dataset.folder = item.name;
                folderButton.style.cssText = `
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid ${selectedFolderName === item.name ? 'var(--primary-color, #3B82F6)' : 'var(--border-color, #e5e7eb)'};
                    background-color: ${selectedFolderName === item.name ? 'rgba(79, 70, 229, 0.08)' : 'var(--dialog-bg, #ffffff)'};
                    cursor: pointer;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                    color: var(--text-color, #333333);
                `;
                folderButton.style.direction = 'ltr';
                folderButton.addEventListener('click', () => {
                    selectedFolderName = item.name;
                    renderFolderList();
                    renderFolderDetail();
                });

                const left = document.createElement('div');
                left.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                `;

                const nameEl = document.createElement('span');
                nameEl.textContent = item.name;
                nameEl.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    flex: 0 1 auto;
                    font-size: 14px;
                    font-weight: ${item.status !== 'unchanged' ? '600' : '500'};
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 4px 10px;
                    border-radius: 4px;
                    border: none;
                    min-width: 0;
                    max-width: 100%;
                    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
                    background-color: rgba(148, 163, 184, 0.25);
                    pointer-events: none;
                `;

                let folderBackground = '#64748b';
                if (item.current && item.imported) {
                    if (deepEqual(item.current.color, item.imported.color)) {
                        folderBackground = item.current.color || folderBackground;
                    } else {
                        const currentColor = item.current.color || folderBackground;
                        const importedColor = item.imported.color || folderBackground;
                        folderBackground = `linear-gradient(90deg, ${currentColor} 0%, ${currentColor} 50%, ${importedColor} 50%, ${importedColor} 100%)`;
                    }
                } else if (item.imported) {
                    folderBackground = item.imported.color || folderBackground;
                } else if (item.current) {
                    folderBackground = item.current.color || folderBackground;
                }
                nameEl.style.background = folderBackground;

                const resolvedTextColor = (item.current && item.current.textColor)
                    || (item.imported && item.imported.textColor)
                    || 'var(--text-color, #333333)';
                nameEl.style.color = resolvedTextColor;

                left.appendChild(nameEl);

                const right = document.createElement('div');
                right.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                `;

                if (item.status !== 'unchanged') {
                    const statusVariant = statusVariantMap[item.status];
                    let statusLabel = t(statusTextMap[item.status]);
                    if (item.status === 'changed') {
                        const detailLabels = [];
                        if (item.hasOrderChange) {
                            detailLabels.push(t('顺序'));
                        }
                        if (item.metaChanges.length) {
                            detailLabels.push(t('设置'));
                        }
                        if (detailLabels.length) {
                            const separator = isNonChineseLocale() ? ', ' : '、';
                            const colon = isNonChineseLocale() ? ': ' : '：';
                            statusLabel = `${statusLabel}${colon}${detailLabels.join(separator)}`;
                        }
                    }
                    right.appendChild(createBadge(statusLabel, statusVariant));
                }

                const buttonHiglight = item.status !== 'unchanged' || item.hasOrderChange || item.metaChanges.length;
                if (buttonHiglight) {
                    folderButton.setAttribute('data-diff', 'true');
                }

                folderButton.appendChild(left);
                folderButton.appendChild(right);
                folderList.appendChild(folderButton);
            });
        };

        const renderFolderDetail = () => {
            setTrustedHTML(detailPanel, '');
            if (!selectedFolderName) {
                const emptyState = document.createElement('div');
                emptyState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
                emptyState.textContent = folderDiffs.length
                    ? t('请选择左侧文件夹查看差异')
                    : t('暂无差异，导入配置的结构与当前一致。');
                detailPanel.appendChild(emptyState);
                return;
            }

            const folderData = folderDiffMap.get(selectedFolderName);
            if (!folderData) {
                const missingState = document.createElement('div');
                missingState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
                missingState.textContent = t('暂无差异，导入配置的结构与当前一致。');
                detailPanel.appendChild(missingState);
                return;
            }

            const detailHeader = document.createElement('div');
            detailHeader.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
            `;

            const headerLeft = document.createElement('div');
            headerLeft.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
            `;
            headerLeft.textContent = selectedFolderName;

            const headerBadges = document.createElement('div');
            headerBadges.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            `;

            // 避免与左侧列表重复提示，仅保留按钮数量类徽标
            ['added', 'removed', 'changed'].forEach((key) => {
                const count = folderData.buttonCounts[key];
                if (count > 0) {
                    headerBadges.appendChild(createBadge(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
                }
            });

            detailHeader.appendChild(headerLeft);
            detailHeader.appendChild(headerBadges);
            detailPanel.appendChild(detailHeader);

            if (!folderData.current) {
                const info = document.createElement('div');
                info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--success-color, #22c55e);
                    background-color: rgba(34, 197, 94, 0.12);
                `;
                info.textContent = t('导入后将新增此文件夹');
                detailPanel.appendChild(info);
            } else if (!folderData.imported) {
                const info = document.createElement('div');
                info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--danger-color, #f87171);
                    background-color: rgba(248, 113, 113, 0.12);
                `;
                info.textContent = t('导入后将移除此文件夹');
                detailPanel.appendChild(info);
            }

            const columnsContainer = document.createElement('div');
            columnsContainer.style.cssText = `
                flex: 1;
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
                padding: 20px;
                min-height: 0;
            `;
            detailPanel.appendChild(columnsContainer);

            const buttonDiffMap = new Map();
            folderData.buttonDiffs.forEach((item) => {
                if (item.currentName) {
                    buttonDiffMap.set(item.currentName, item);
                }
                if (item.importedName) {
                    buttonDiffMap.set(item.importedName, item);
                }
                if (!item.currentName && !item.importedName) {
                    buttonDiffMap.set(item.name || item.id, item);
                }
            });

            const createColumn = (label, buttons, order, side) => {
                const column = document.createElement('div');
                column.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    overflow: hidden;
                    background-color: var(--button-bg, #f3f4f6);
                `;

                const columnHeader = document.createElement('div');
                columnHeader.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 8px;
                    background-color: var(--button-bg, #f3f4f6);
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 4px 4px 0 0;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-color, #333333);
                    position: sticky;
                    top: 0;
                    z-index: 1;
                `;
                columnHeader.textContent = label;
                column.appendChild(columnHeader);

                const list = document.createElement('div');
                list.style.cssText = `
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 10px;
                    overflow: auto;
                `;
                list.classList.add('cttf-scrollable');
                column.appendChild(list);

                if (!order.length) {
                    const empty = document.createElement('div');
                    empty.style.cssText = `
                        padding: 20px;
                        font-size: 13px;
                        color: var(--muted-text-color, #6b7280);
                        text-align: center;
                    `;
                    empty.textContent = side === 'current'
                        ? t('当前配置中无此文件夹。')
                        : t('导入配置中无此文件夹。');
                    list.appendChild(empty);
                    return column;
                }

                order.forEach((btnName) => {
                    const diffInfo = buttonDiffMap.get(btnName);
                    const btnConfig = buttons[btnName];
                    const highlightStatus = diffInfo ? diffInfo.status : 'unchanged';
                    const backgroundColor = (() => {
                        if (!diffInfo || highlightStatus === 'unchanged') {
                            return 'var(--dialog-bg, #ffffff)';
                        }
                        if (highlightStatus === 'added' && side === 'imported') {
                            return 'rgba(34, 197, 94, 0.12)';
                        }
                        if (highlightStatus === 'removed' && side === 'current') {
                            return 'rgba(248, 113, 113, 0.12)';
                        }
                        if (highlightStatus === 'changed') {
                            return 'rgba(59, 130, 246, 0.12)';
                        }
                        return 'var(--dialog-bg, #ffffff)';
                    })();
                    const borderColor = (() => {
                        if (!diffInfo || highlightStatus === 'unchanged') {
                            return 'var(--border-color, #e5e7eb)';
                        }
                        if (highlightStatus === 'added' && side === 'imported') {
                            return 'rgba(34, 197, 94, 0.5)';
                        }
                        if (highlightStatus === 'removed' && side === 'current') {
                            return 'rgba(248, 113, 113, 0.5)';
                        }
                        if (highlightStatus === 'changed') {
                            return 'rgba(59, 130, 246, 0.4)';
                        }
                        return 'var(--border-color, #e5e7eb)';
                    })();

                    const item = document.createElement('div');
                    item.style.cssText = `
                        border: 1px solid ${borderColor};
                        border-radius: 6px;
                        padding: 6px 8px;
                        display: flex;
                        flex-direction: column;
                        gap: 3px;
                        background-color: ${backgroundColor};
                    `;

                    const row = document.createElement('div');
                    row.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 4px;
                    `;

                    const rowLeft = document.createElement('div');
                    rowLeft.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        min-width: 0;
                    `;
                    const previewButton = createCustomButtonElement(btnName, btnConfig || {});
                    previewButton.style.marginBottom = '0';
                    previewButton.style.marginRight = '0';
                    previewButton.style.cursor = 'default';
                    previewButton.style.flexShrink = '1';
                    previewButton.style.minWidth = '0';
                    previewButton.style.maxWidth = '100%';
                    previewButton.style.whiteSpace = 'normal';
                    previewButton.style.wordBreak = 'break-word';
                    previewButton.style.overflow = 'visible';
                    previewButton.style.lineHeight = '1.4';
                    previewButton.style.overflowWrap = 'anywhere';
                    previewButton.style.display = 'inline-flex';
                    previewButton.style.flexWrap = 'wrap';
                    previewButton.style.alignItems = 'center';
                    previewButton.style.justifyContent = 'flex-start';
                    previewButton.style.columnGap = '6px';
                    previewButton.style.rowGap = '2px';
                    previewButton.style.pointerEvents = 'none';
                    previewButton.setAttribute('tabindex', '-1');
                    previewButton.setAttribute('aria-hidden', 'true');

                    const fallbackTextColor = 'var(--text-color, #333333)';
                    if (!btnConfig || !btnConfig.textColor) {
                        previewButton.style.color = fallbackTextColor;
                    }
                    if (!btnConfig || !btnConfig.color) {
                        previewButton.style.backgroundColor = 'rgba(148, 163, 184, 0.25)';
                        previewButton.style.border = '1px solid rgba(100, 116, 139, 0.35)';
                    }

                    rowLeft.appendChild(previewButton);

                    const rowRight = document.createElement('div');
                    rowRight.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        flex-shrink: 0;
                    `;
                        if (diffInfo && diffInfo.status !== 'unchanged') {
                            const statusVariant = statusVariantMap[diffInfo.status] || 'neutral';
                            let badgeLabel = t(statusTextMap[diffInfo.status]);
                            if (diffInfo.status === 'changed') {
                                const changeTypeParts = [];
                                if (diffInfo.renamed) {
                                    changeTypeParts.push(t('重命名'));
                                }
                                if (diffInfo.fieldsChanged.length) {
                                    changeTypeParts.push(t('字段'));
                                }
                                if (diffInfo.orderChanged) {
                                    changeTypeParts.push(t('顺序'));
                                }
                                if (changeTypeParts.length) {
                                    const typesText = changeTypeParts.join(isNonChineseLocale() ? ', ' : '、');
                                    badgeLabel = t('变更：{{types}}', { types: typesText });
                                }
                            }
                            rowRight.appendChild(createBadge(badgeLabel, statusVariant));
                        }

                    row.appendChild(rowLeft);
                    row.appendChild(rowRight);
                    item.appendChild(row);

                    if (diffInfo && diffInfo.fieldsChanged.length) {
                        const fieldsInfo = document.createElement('div');
                        fieldsInfo.style.cssText = `
                            font-size: 12px;
                            color: var(--muted-text-color, #6b7280);
                        `;
                        fieldsInfo.textContent = t('变更字段：{{fields}}', { fields: diffInfo.fieldsChanged.join(', ') });
                        item.appendChild(fieldsInfo);
                    }

                    list.appendChild(item);
                });

                return column;
            };

            const currentButtons = folderData.current && folderData.current.buttons ? folderData.current.buttons : {};
            const importedButtons = folderData.imported && folderData.imported.buttons ? folderData.imported.buttons : {};

            columnsContainer.appendChild(createColumn(t('当前配置'), currentButtons, folderData.buttonOrder.current || [], 'current'));
            columnsContainer.appendChild(createColumn(t('导入配置'), importedButtons, folderData.buttonOrder.imported || [], 'imported'));
        };

        renderFolderList();
        renderFolderDetail();

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
    }

    // 新增：显示导入配置预览确认对话框
    function showImportConfirmDialog(importedConfig, onConfirm, onCancel) {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        // 计算导入配置的统计信息
        const importFolderCount = Object.keys(importedConfig.folders || {}).length;
        const importButtonCount = Object.values(importedConfig.folders || {}).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons || {}).length;
        }, 0);

        // 计算当前配置的统计信息
        const currentFolderCount = Object.keys(buttonConfig.folders).length;
        const currentButtonCount = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        const overlay = document.createElement('div');
        overlay.classList.add('import-confirm-overlay');
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
        dialog.classList.add('import-confirm-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 480px;
            max-width: 90vw;
            transform: scale(0.95);
            position: relative;
            z-index: 13001;
        `;

        setTrustedHTML(dialog, `
            <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            ">
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--info-color, #4F46E5);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${t('📥 确认导入配置')}
                </h3>
            </div>

            <div style="
                background-color: var(--button-bg, #f3f4f6);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
                border: 1px solid var(--border-color, #e5e7eb);
            ">
                <h4 style="
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                ">${t('📊 配置对比')}</h4>

                <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 12px;
                ">
                    <div style="
                        background-color: var(--dialog-bg, #ffffff);
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid var(--border-color, #e5e7eb);
                    ">
                        <div style="
                            font-size: 12px;
                            color: var(--text-color, #666);
                            margin-bottom: 8px;
                            font-weight: 500;
                        ">${t('当前配置')}</div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${currentFolderCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个文件夹')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${currentButtonCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个按钮')}</span>
                        </div>
                    </div>

                    <div style="
                        background-color: var(--dialog-bg, #ffffff);
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid var(--info-color, #4F46E5);
                        position: relative;
                    ">
                        <div style="
                            font-size: 12px;
                            color: var(--info-color, #4F46E5);
                            margin-bottom: 8px;
                            font-weight: 600;
                        ">${t('导入配置')}</div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${importFolderCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个文件夹')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${importButtonCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个按钮')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="
                background-color: #fef3c7;
                border: 1px solid #fbbf24;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 20px;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #92400e;
                    font-size: 13px;
                ">
                    <span style="font-size: 16px;">⚠️</span>
                    <strong>${t('注意：导入配置将完全替换当前配置，此操作无法撤销！')}</strong>
                </div>
            </div>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            ">
                <button id="previewImportDiff" style="
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">${t('查看差异')}</button>
                <div style="display: flex; gap: 12px;">
                    <button id="cancelImport" style="
                        background-color: var(--cancel-color, #6B7280);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">${t('取消')}</button>
                    <button id="confirmImport" style="
                        background-color: var(--info-color, #4F46E5);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">${t('确认导入')}</button>
                </div>
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

        // 按钮事件
        const previewDiffBtn = dialog.querySelector('#previewImportDiff');
        if (previewDiffBtn) {
            previewDiffBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                try {
                    showImportDiffPreview(buttonConfig, importedConfig);
                } catch (error) {
                    console.error('[Chat] Template Text Folders 打开配置差异预览失败:', error);
                }
            });
        }

        dialog.querySelector('#cancelImport').addEventListener('click', () => {
            if (currentDiffOverlay) {
                if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                    currentDiffOverlay.__cttfCloseDiff();
                } else {
                    closeExistingOverlay(currentDiffOverlay);
                    currentDiffOverlay = null;
                }
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (onCancel) onCancel();
        });

        dialog.querySelector('#confirmImport').addEventListener('click', () => {
            if (currentDiffOverlay) {
                if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                    currentDiffOverlay.__cttfCloseDiff();
                } else {
                    closeExistingOverlay(currentDiffOverlay);
                    currentDiffOverlay = null;
                }
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;

            // 添加短暂延时，确保弹窗关闭动画完成后再执行导入
            setTimeout(() => {
                if (onConfirm) {
                    onConfirm();
                }
            }, 100);
        });

        // 点击外部忽略
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    function importConfig(rerenderFn) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const importedConfig = JSON.parse(evt.target.result);
                    if (importedConfig && typeof importedConfig === 'object') {
                        if (!importedConfig.folders || !importedConfig.folderOrder) {
                            alert(t('导入的配置文件无效！缺少必要字段。'));
                            return;
                        }

                        // 显示预览确认对话框
                        showImportConfirmDialog(
                            importedConfig,
                            () => {
                                // 用户确认导入
                                try {
                                    // 替换现有配置
                                    buttonConfig = importedConfig;

                                    if (typeof buttonConfig.showFolderIcons !== 'boolean') {
                                        buttonConfig.showFolderIcons = false;
                                    }

                                    // 确保所有按钮都有'type'字段和'autoSubmit'字段
                                    Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                                        // 确保文件夹有hidden字段
                                        if (typeof folderConfig.hidden !== 'boolean') {
                                            folderConfig.hidden = false;
                                        }

                                        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
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

                                    // 保存配置
                                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

                                    // 重新渲染设置面板（如果打开）
                                    if (rerenderFn) {
                                        // 重置选中的文件夹为第一个
                                        selectedFolderName = buttonConfig.folderOrder[0] || null;
                                        rerenderFn();
                                    }

                                    console.log(t('📥 配置已成功导入。'));

                                    // 更新按钮栏
                                    updateButtonContainer();
                                    // 应用新配置下的域名样式
                                    try { applyDomainStyles(); } catch (_) {}

                                    // 立即更新所有计数器
                                    setTimeout(() => {
                                        updateCounters();
                                        console.log(t('📊 导入后计数器已更新。'));

                                        // 延时执行回调函数，确保所有渲染完成
                                        setTimeout(() => {
                                            if (rerenderFn) {
                                                rerenderFn();
                                            }
                                        }, 150);
                                    }, 100);

                                } catch (error) {
                                    console.error('导入配置时发生错误:', error);
                                    alert(t('导入配置时发生错误，请检查文件格式。'));
                                }
                            },
                            () => {
                                // 用户取消导入
                                console.log(t('❌ 用户取消了配置导入。'));
                            }
                        );

                    } else {
                        alert(t('导入的配置文件内容无效！'));
                    }
                } catch (error) {
                    console.error('解析配置文件失败:', error);
                    alert(t('导入的配置文件解析失败！请确认文件格式正确。'));
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // 新增的单独配置设置弹窗
    const showConfigSettingsDialog = () => {
        if (currentConfigOverlay) {
            closeExistingOverlay(currentConfigOverlay);
        }
        const overlay = document.createElement('div');
        overlay.classList.add('config-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 12000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('config-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;

        const configTitle = t('🛠️ 脚本配置');
        const rowLabelStyle = 'display:inline-flex;min-width:130px;justify-content:flex-start;margin-right:12px;color: var(--text-color, #333333);';
        const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="appearanceTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('外观')}</button>
                <button class="tab-button" data-tab="configTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('配置')}</button>
            </div>
        `;
        const appearanceTab = `
            <div id="appearanceTab" class="tab-content" style="display: block;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:20px;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('语言')}：</span>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <button class="config-lang-btn" data-lang="auto" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('自动')}</button>
                            <button class="config-lang-btn" data-lang="zh" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('中文')}</button>
                            <button class="config-lang-btn" data-lang="en" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('English')}</button>
                        </div>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('文件夹图标：')}</span>
                        <div class="cttf-switch-wrapper">
                            <label class="cttf-switch">
                                <input id="folderIconToggleInput" type="checkbox" />
                                <span class="cttf-switch-slider"></span>
                            </label>
                            <span id="folderIconToggleText" style="
                                font-size: 13px;
                                color: var(--text-color, #333333);
                                font-weight: 500;
                                min-width: 38px;
                            ">${t('显示')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const configTab = `
            <div id="configTab" class="tab-content" style="display: none;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:0;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('恢复默认设置：')}</span>
                        <button id="resetSettingsBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:4px;
                        ">${t('↩️ 重置')}</button>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                    ">
                        <span style="${rowLabelStyle}">${t('配置导入导出：')}</span>
                        <div style="display:flex;gap:8px;">
                            <button id="importConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--add-color, #fd7e14);
                                color: white;
                                border-radius:4px;
                            ">${t('📥 导入')}</button>
                            <button id="exportConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius:4px;
                            ">${t('📤 导出')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTrustedHTML(dialog, `
            <h3 style="margin:0 0 20px 0;font-size:18px;font-weight:600; color: var(--text-color, #333333);">${configTitle}</h3>
            ${tabNavigation}
            ${appearanceTab}
            ${configTab}
        `);

        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            const activateTab = (targetId) => {
                tabButtons.forEach((btn) => {
                    const isActive = btn.dataset.tab === targetId;
                    btn.classList.toggle('active', isActive);
                    btn.style.backgroundColor = isActive
                        ? 'var(--primary-color, #3B82F6)'
                        : 'var(--button-bg, #f3f4f6)';
                    btn.style.color = isActive ? 'white' : 'var(--text-color, #333333)';
                    btn.style.borderBottom = isActive
                        ? '2px solid var(--primary-color, #3B82F6)'
                        : '2px solid transparent';
                });
                tabContents.forEach((content) => {
                    content.style.display = content.id === targetId ? 'block' : 'none';
                });
            };
            tabButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const targetId = button.dataset.tab;
                    if (targetId) {
                        activateTab(targetId);
                    }
                });
            });
            activateTab('appearanceTab');
        };
        setupTabs();

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfigOverlay = overlay;

        const langBtnStyle = document.createElement('style');
        langBtnStyle.textContent = `
            .config-lang-btn {
                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                color: var(--input-text-color, var(--text-color, #333333));
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .config-lang-btn:hover {
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .config-lang-btn.active {
                background-color: var(--primary-color, #3B82F6) !important;
                color: #ffffff !important;
                border-color: var(--primary-color, #3B82F6) !important;
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .cttf-switch-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            .cttf-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            .cttf-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .cttf-switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(148, 163, 184, 0.35);
                border-radius: 999px;
                transition: background-color 0.25s ease, box-shadow 0.25s ease;
            }
            .cttf-switch-slider::before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
                transition: transform 0.25s ease;
            }
            .cttf-switch input:checked + .cttf-switch-slider {
                background-color: #22c55e;
            }
            .cttf-switch input:checked + .cttf-switch-slider::before {
                transform: translateX(24px);
            }
            .cttf-switch input:focus-visible + .cttf-switch-slider {
                box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35);
            }
        `;
        dialog.appendChild(langBtnStyle);

        const langButtons = Array.from(dialog.querySelectorAll('.config-lang-btn'));
        const updateLanguageButtonState = (preference) => {
            langButtons.forEach((btn) => {
                const isActive = btn.dataset.lang === preference;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        };

        updateLanguageButtonState(readLanguagePreference() || 'auto');

        langButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const selectedPreference = btn.dataset.lang || 'auto';
                const result = applyLanguagePreference(selectedPreference);
                updateLanguageButtonState(result ? result.preference : selectedPreference);
            });
        });

        const folderIconToggleInput = dialog.querySelector('#folderIconToggleInput');
        const folderIconToggleText = dialog.querySelector('#folderIconToggleText');
        const folderIconToggleSlider = dialog.querySelector('.cttf-switch-slider');
        const folderIconToggleWrapper = dialog.querySelector('.cttf-switch-wrapper');
        const updateFolderIconToggleState = () => {
            if (!folderIconToggleInput) {
                return;
            }
        const enabled = buttonConfig.showFolderIcons === true;
            folderIconToggleInput.checked = enabled;
            folderIconToggleInput.setAttribute('aria-checked', enabled ? 'true' : 'false');
            if (folderIconToggleText) {
                folderIconToggleText.textContent = enabled ? t('显示') : t('隐藏');
                folderIconToggleText.style.color = enabled
                    ? 'var(--success-color, #22c55e)'
                    : 'var(--muted-text-color, #6b7280)';
            }
            const tooltipTarget = folderIconToggleWrapper || folderIconToggleSlider;
            if (tooltipTarget) {
                tooltipTarget.title = enabled
                    ? t('点击后隐藏文件夹图标')
                    : t('点击后显示文件夹图标');
            }
        };

        if (folderIconToggleInput) {
            updateFolderIconToggleState();
            folderIconToggleInput.addEventListener('change', () => {
                const enabled = folderIconToggleInput.checked;
                buttonConfig.showFolderIcons = enabled;
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                updateFolderIconToggleState();
                console.log(t('🖼️ 文件夹图标显示已切换为 {{state}}', {
                    state: enabled ? t('显示') : t('隐藏')
                }));
                if (currentSettingsOverlay) {
                    renderFolderList();
                }
                updateButtonContainer();
            });
        }

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeExistingOverlay(overlay);
                if (currentConfigOverlay === overlay) {
                    currentConfigOverlay = null;
                }
                console.log(t('✅ 脚本配置弹窗已通过点击外部关闭'));
            }
        });

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#importConfigBtn').addEventListener('click', () => {
            importConfig(() => {
                // 重新渲染主设置面板
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                    // 确保计数器也被更新
                    setTimeout(() => {
                        updateCounters();
                    }, 50);
                }

                // 导入成功后关闭脚本配置弹窗
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已自动关闭'));
                }
            });
        });

        dialog.querySelector('#exportConfigBtn').addEventListener('click', () => {
            exportConfig();
            // 导出完成后关闭脚本配置弹窗
            setTimeout(() => {
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已在导出后关闭'));
                }
            }, 500); // 给导出操作一些时间完成
        });

        dialog.querySelector('#resetSettingsBtn').addEventListener('click', () => {
        if (confirm(t('确认重置所有配置为默认设置吗？'))) {
                // 先关闭脚本配置弹窗，提升用户体验
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已在重置前关闭'));
                }

                // 执行配置重置
                buttonConfig = JSON.parse(JSON.stringify(defaultConfig));
                // 重置folderOrder
                buttonConfig.folderOrder = Object.keys(buttonConfig.folders);
                // 确保所有按钮都有'type'字段和'autoSubmit'字段
                Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                    Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
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

                // 重新渲染设置面板（如果还打开着）
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                }

                console.log(t('🔄 配置已重置为默认设置。'));

                // 更新按钮栏
                updateButtonContainer();
                // 重置后应用默认/匹配样式
                try { applyDomainStyles(); } catch (_) {}

                // 立即更新计数器
                setTimeout(() => {
                    updateCounters();
                    console.log(t('📊 重置后计数器已更新。'));

                    // 在所有更新完成后显示成功提示
                    setTimeout(() => {
                        alert(t('已重置为默认配置'));
                    }, 50);
                }, 100);
            }
        });
    };
