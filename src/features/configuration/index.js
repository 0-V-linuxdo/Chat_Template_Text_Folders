/* -------------------------------------------------------------------------- *
 * Feature · Script config (脚本配置)
 * -------------------------------------------------------------------------- */

import {
    applyLanguagePreference,
    buttonConfig,
    createDefaultConfig,
    createDialogCloseIconButton,
    createUnifiedDialog,
    getLanguagePreference,
    hydrateButtonConfigDefaults,
    isNonChineseLocale,
    persistButtonConfig,
    registerLocaleRefresh,
    setButtonConfig,
    setTrustedHTML,
    styles,
    t,
} from '../../core/runtime-services.js';
import {
    closeExistingOverlay,
    createCustomButtonElement,
    updateButtonContainer,
} from '../toolbar/index.js';
import {
    createDriveSyncModule,
    DEFAULT_FILE_NAME as DEFAULT_DRIVE_FILE_NAME,
} from './drive-sync.js';
import {
    getCurrentSettingsOverlay,
    renderButtonList,
    renderFolderList,
    setSelectedFolderName,
    updateCounters,
} from '../settings/index.js';
import { applyDomainStyles } from '../domain-style/runtime.js';
import {
    cloneSerializable,
    downloadTextFile,
} from '../../shared/common.js';

let currentDiffOverlay = null;
let currentConfigOverlay = null;
let currentConfirmOverlay = null;
const DRIVE_HOST_PREFS_KEY = 'cttfDriveHostPrefs';

let driveSyncService = null;
let cachedDriveSettings = null;
let driveHostPrefs = (() => {
    const fallback = { enabled: false };
    try {
        const raw = localStorage.getItem(DRIVE_HOST_PREFS_KEY);
        if (!raw) return { ...fallback };
        const parsed = JSON.parse(raw);
        return { ...fallback, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
    } catch (error) {
        console.warn('[Chat] Template Text Folders · Drive host prefs parse failed:', error);
        return { ...fallback };
    }
})();

const persistDriveHostPrefs = (patch = {}) => {
    driveHostPrefs = { ...driveHostPrefs, ...patch };
    try {
        localStorage.setItem(DRIVE_HOST_PREFS_KEY, JSON.stringify(driveHostPrefs));
    } catch (error) {
        console.warn('[Chat] Template Text Folders · Drive host prefs persist failed:', error);
    }
    return driveHostPrefs;
};

const formatDriveModuleLoadError = (error) => {
    if (!error) return t('m_4f5c1763f26d');
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

const ensureDriveSyncService = async () => {
    if (driveSyncService) {
        if (driveSyncService.setTranslator) {
            try { driveSyncService.setTranslator(t); } catch (_) {}
        }
        return driveSyncService;
    }

    driveSyncService = createDriveSyncModule({
        defaultFileName: DEFAULT_DRIVE_FILE_NAME,
        translate: t,
    });

    if (!driveSyncService || typeof driveSyncService.getSettings !== 'function') {
        throw new Error('Drive sync module is invalid.');
    }

    if (driveSyncService.setTranslator) {
        try { driveSyncService.setTranslator(t); } catch (_) {}
    }
    cachedDriveSettings = driveSyncService.getSettings();
    return driveSyncService;
};

    function applyConfigFromRemote(importedConfig) {
        if (!importedConfig || typeof importedConfig !== 'object') {
            throw new Error(t('m_5df1a31bee04'));
        }
        if (!importedConfig.folders || !importedConfig.folderOrder) {
            throw new Error(t('m_5df1a31bee04'));
        }
        setButtonConfig(importedConfig);
        hydrateButtonConfigDefaults(buttonConfig, { silent: true });
        persistButtonConfig();
        setSelectedFolderName(buttonConfig.folderOrder[0] || null);
        updateButtonContainer();
        try { applyDomainStyles(); } catch (_) {}
        if (getCurrentSettingsOverlay() && typeof renderFolderList === 'function') {
            renderFolderList();
        }
        if (getCurrentSettingsOverlay() && typeof renderButtonList === 'function') {
            renderButtonList();
        }
        setTimeout(() => {
            try { updateCounters(); } catch (_) {}
        }, 80);
    }

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
        downloadTextFile(fileName, dataStr, 'application/json');
        console.log(t('m_1c50edad461c'));
    }

    const cloneConfigForComparison = (value) => {
        return cloneSerializable(value, {
            fallback: value,
            logLabel: '[Chat] Template Text Folders config clone failed:',
        });
    };

    const toComparableStructure = (value) => {
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map((item) => toComparableStructure(item));
        }
        const sorted = {};
        Object.keys(value).sort().forEach((key) => {
            sorted[key] = toComparableStructure(value[key]);
        });
        return sorted;
    };

    const configsStructurallyEqual = (a, b) => {
        if (a === b) return true;
        try {
            const left = toComparableStructure(cloneConfigForComparison(a));
            const right = toComparableStructure(cloneConfigForComparison(b));
            return JSON.stringify(left) === JSON.stringify(right);
        } catch (error) {
            console.warn('[Chat] Template Text Folders config compare failed:', error);
            return false;
        }
    };

    function showImportDiffPreview(currentConfig, importedConfig, options = {}) {
        if (currentDiffOverlay) {
            closeExistingOverlay(currentDiffOverlay);
            currentDiffOverlay = null;
        }
        const currentLabel = options.currentLabel || t('m_fe67280a8e87');
        const importedLabel = options.importedLabel || t('m_280779a502b3');

        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '960px',
            maxWidth: '96vw',
            maxHeight: '82vh',
            padding: '8px 18px 16px',
            zIndex: '14000',
            closeOnOverlayClick: false,
            overlayClassName: 'import-diff-overlay',
            dialogClassName: 'import-diff-dialog',
            overlayStyles: {
                backgroundColor: 'var(--overlay-bg, rgba(0, 0, 0, 0.55))',
                backdropFilter: 'blur(3px)',
            },
            dialogStyles: {
                borderRadius: '6px',
                boxShadow: '0 18px 36px var(--shadow-color, rgba(15, 23, 42, 0.35))',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            },
            onClose: () => {
                if (currentDiffOverlay === overlay) {
                    currentDiffOverlay = null;
                }
            },
        });
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
        title.textContent = t('m_8698a81857f3');

        const headerActions = document.createElement('div');
        headerActions.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
        `;

        const closeBtn = createDialogCloseIconButton(() => {
            closeDiffOverlay();
        });

        headerActions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(headerActions);
        dialog.appendChild(header);

        dialog.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const safeClone = (value) => {
            return cloneSerializable(value, {
                fallback: value,
                logLabel: '[Chat] Template Text Folders diff preview clone failed:',
            });
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
            added: 'm_2cd9e6ce817d',
            removed: 'm_2f752c005ec5',
            changed: 'm_82bf9384b6bd'
        };

        const folderCountLabelMap = {
            added: '+{{count}}',
            removed: 'm_68dd983f9f14',
            changed: 'm_213e31accd19'
        };

        const buttonCountLabelMap = {
            added: '+{{count}}',
            removed: 'm_5513f5f64683',
            changed: 'm_9d17eee70cd6'
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

            // 1) 建立名称桶，便于同名匹配（名称正规化）
            const importedBuckets = new Map();
            importedOrder.forEach((btnName, idx) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                if (!importedBuckets.has(normalized)) {
                    importedBuckets.set(normalized, []);
                }
                importedBuckets.get(normalized).push({ name: btnName, index: idx });
            });

            // 2) 先对齐同名按钮
            const usedImportedNames = new Set();
            const matched = []; // { currentName, importedName, importedIndex }

            currentOrder.forEach((btnName) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                const bucket = importedBuckets.get(normalized) || [];
                const matchedEntry = bucket.find((candidate) => !usedImportedNames.has(candidate.name)) || null;
                if (matchedEntry) {
                    usedImportedNames.add(matchedEntry.name);
                    matched.push({ currentName: btnName, importedName: matchedEntry.name, importedIndex: matchedEntry.index });
                } else {
                    matched.push({ currentName: btnName, importedName: null, importedIndex: -1 });
                }
            });

            // 3) 计算最长递增子序列，最小化标记的“顺序变更”集合
            const matchedImportedNames = new Set();
            const matchedIndices = matched
                .filter((pair) => pair.importedIndex >= 0)
                .map((pair) => pair.importedIndex);
            const lisIndices = new Set();
            (function markLIS(seq) {
                const n = seq.length;
                if (!n) return;
                const dp = Array(n).fill(1);
                const prev = Array(n).fill(-1);
                let bestLen = 1;
                let bestIdx = 0;
                for (let i = 1; i < n; i++) {
                    for (let j = 0; j < i; j++) {
                        if (seq[j] < seq[i] && dp[j] + 1 > dp[i]) {
                            dp[i] = dp[j] + 1;
                            prev[i] = j;
                        }
                    }
                    if (dp[i] > bestLen) {
                        bestLen = dp[i];
                        bestIdx = i;
                    }
                }
                let idx = bestIdx;
                while (idx >= 0) {
                    lisIndices.add(seq[idx]);
                    idx = prev[idx];
                }
            })(matchedIndices);

            matched.forEach((pair) => {
                const currentBtn = currentButtons[pair.currentName] || null;
                const importedBtn = pair.importedName ? (importedButtons[pair.importedName] || null) : null;
                const fieldsChanged = [];
                let renamed = false;
                if (currentBtn && importedBtn) {
                    const keys = new Set([...Object.keys(currentBtn), ...Object.keys(importedBtn)]);
                    keys.forEach((key) => {
                        if (!deepEqual(currentBtn[key], importedBtn[key])) {
                            fieldsChanged.push(key);
                        }
                    });
                    const trimmedCurrent = typeof pair.currentName === 'string' ? pair.currentName.trim() : pair.currentName;
                    const trimmedImported = typeof pair.importedName === 'string' ? pair.importedName.trim() : pair.importedName;
                    renamed = Boolean(trimmedCurrent !== trimmedImported);
                }
                const orderChanged = pair.importedIndex >= 0
                    ? !lisIndices.has(pair.importedIndex)
                    : false;
                let status = 'unchanged';
                if (!importedBtn) {
                    status = 'removed';
                } else if (fieldsChanged.length || renamed || orderChanged) {
                    status = 'changed';
                }
                const normalized = normalizeButtonNameForDiff(pair.currentName || pair.importedName);
                result.push({
                    id: normalized || pair.currentName || pair.importedName,
                    name: pair.currentName || pair.importedName,
                    currentName: pair.currentName,
                    importedName: pair.importedName,
                    current: currentBtn,
                    imported: importedBtn,
                    fieldsChanged,
                    orderChanged,
                    renamed,
                    status
                });
                if (pair.importedName) {
                    matchedImportedNames.add(pair.importedName);
                }
            });

            // 4) 仅存在于云端的按钮
            importedOrder.forEach((btnName) => {
                if (matchedImportedNames.has(btnName)) return;
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

            const hasOrderChange = buttonDiffs.some((btn) => btn.orderChanged);

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
            // Trusted Types: always clear via setTrustedHTML, never innerHTML, to stay compatible with strict hosts (e.g. Google).
            setTrustedHTML(summaryBar, '');
            summaryBar.style.display = 'flex';
            summaryBar.style.flexWrap = 'wrap';
            summaryBar.style.alignItems = 'center';
            summaryBar.style.justifyContent = 'center';
            summaryBar.style.gap = '8px';
            summaryBar.style.marginBottom = '8px';
            const noDiff = document.createElement('span');
            noDiff.textContent = t('m_05249fe6e6af');
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
        folderPanelHeader.textContent = t('m_46ecac29102a');
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
                placeholder.textContent = t('m_05249fe6e6af');
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
                    detailLabels.push(t('m_20ee03ce7790'));
                }
                if (item.metaChanges.length) {
                    detailLabels.push(t('m_7debf9cb0372'));
                }
                if (detailLabels.length) {
                    const separator = isNonChineseLocale() ? ', ' : '、';
                    const colon = isNonChineseLocale() ? ': ' : '：';
                    statusLabel = `${statusLabel}${colon}${detailLabels.join(separator)}`;
                }
            }
            right.appendChild(createBadge(statusLabel, statusVariant));
        }

        const buttonHiglight = item.status !== 'unchanged' || item.metaChanges.length || item.hasOrderChange;
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
                    ? t('m_34f2f7532760')
                    : t('m_05249fe6e6af');
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
                missingState.textContent = t('m_05249fe6e6af');
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
                info.textContent = t('m_18b337f21ea0');
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
                info.textContent = t('m_cfca7737d2c0');
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
                        ? t('m_1a4da6293e0c')
                        : t('m_ebec3a798b60');
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
                                changeTypeParts.push(t('m_1cd80fd7a8b3'));
                            }
                            if (diffInfo.fieldsChanged.length) {
                                changeTypeParts.push(t('m_77a49f2c3874'));
                            }
                            if (diffInfo.orderChanged) {
                                changeTypeParts.push(t('m_20ee03ce7790'));
                            }
                            if (changeTypeParts.length) {
                                const typesText = changeTypeParts.join(isNonChineseLocale() ? ', ' : '、');
                                badgeLabel = t('m_5a6a5ca76776', { types: typesText });
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
                        fieldsInfo.textContent = t('m_a865844eefdf', { fields: diffInfo.fieldsChanged.join(', ') });
                        item.appendChild(fieldsInfo);
                    }

                    list.appendChild(item);
                });

                return column;
            };

            const currentButtons = folderData.current && folderData.current.buttons ? folderData.current.buttons : {};
            const importedButtons = folderData.imported && folderData.imported.buttons ? folderData.imported.buttons : {};

            columnsContainer.appendChild(createColumn(currentLabel, currentButtons, folderData.buttonOrder.current || [], 'current'));
            columnsContainer.appendChild(createColumn(importedLabel, importedButtons, folderData.buttonOrder.imported || [], 'imported'));
        };

        renderFolderList();
        renderFolderDetail();
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

        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '480px',
            maxWidth: '90vw',
            maxHeight: 'none',
            padding: '24px',
            zIndex: '13000',
            closeOnOverlayClick: false,
            overlayClassName: 'import-confirm-overlay',
            dialogClassName: 'import-confirm-dialog',
            dialogStyles: {
                borderRadius: '8px',
                overflowY: 'visible',
            },
            onClose: () => {
                if (currentConfirmOverlay === overlay) {
                    currentConfirmOverlay = null;
                }
            },
        });

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
                    ${t('m_3eff91bbde22')}
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
                ">${t('m_4aa822bb679d')}</h4>

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
                        ">${t('m_fe67280a8e87')}</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('m_9a311c0d1474')}</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('m_3a591ab6fe4d')}</span>
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
                        ">${t('m_280779a502b3')}</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('m_9a311c0d1474')}</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('m_3a591ab6fe4d')}</span>
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
                    <strong>${t('m_e000c77e8526')}</strong>
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
                ">${t('m_27e029bfe920')}</button>
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
                    ">${t('m_4d0b4688c787')}</button>
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
                    ">${t('m_de6433b70d6c')}</button>
                </div>
            </div>
        `);

        currentConfirmOverlay = overlay;

        // 按钮事件
        const previewDiffBtn = dialog.querySelector('#previewImportDiff');
        if (previewDiffBtn) {
            previewDiffBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                try {
                    showImportDiffPreview(buttonConfig, importedConfig);
                } catch (error) {
                    console.error(t('i18n.log.open_diff_preview_failed'), error);
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

            // 添加短暂延时，确保弹窗关闭动画完成后再执行导入
            setTimeout(() => {
                if (onConfirm) {
                    onConfirm();
                }
            }, 100);
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
                            alert(t('m_a72403beb9ad'));
                            return;
                        }

                        // 显示预览确认对话框
                        showImportConfirmDialog(
                            importedConfig,
                            () => {
                                // 用户确认导入
                                try {
                                    applyConfigFromRemote(importedConfig);

                                    if (rerenderFn) {
                                        rerenderFn();
                                    }

                                    console.log(t('m_1d0d89d4e859'));
                                } catch (error) {
                                    console.error(t('m_54304e70f4ab'), error);
                                    alert(t('m_453dea07d20d'));
                                }
                            },
                            () => {
                                // 用户取消导入
                                console.log(t('m_e5da83735c27'));
                            }
                        );

                    } else {
                        alert(t('m_8fa458fdbc46'));
                    }
                } catch (error) {
                    console.error(t('m_b50818156298'), error);
                    alert(t('m_633f61f8547f'));
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    const closeCurrentConfigOverlay = () => {
        if (currentConfigOverlay) {
            closeExistingOverlay(currentConfigOverlay);
            currentConfigOverlay = null;
        }
    };

    // 新增的单独配置设置弹窗
    const showConfigSettingsDialog = (options = {}) => {
        const { state: initialState = null } = options;
        closeCurrentConfigOverlay();
        let handleConfigDialogBeforeClose = async () => true;
        const { overlay, dialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '400px',
            maxWidth: '90vw',
            padding: '24px',
            zIndex: '12000',
            closeOnOverlayClick: true,
            closeOnEscape: true,
            beforeClose: (context) => handleConfigDialogBeforeClose(context),
            overlayClassName: 'config-overlay',
            dialogClassName: 'config-dialog',
            onClose: () => {
                if (currentConfigOverlay === overlay) {
                    currentConfigOverlay = null;
                }
            },
        });

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
                " data-i18n-text="m_09b58aa3422c"></button>
                <button class="tab-button" data-tab="configTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                " data-i18n-text="m_d7d7ce790b9a"></button>
                <button class="tab-button" data-tab="syncTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                " data-i18n-text="m_e88ab5ba616a"></button>
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
                        <span style="${rowLabelStyle}"><span data-i18n-text="m_cd99b225a08e"></span>:</span>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <button class="config-lang-btn" data-lang="auto" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_4afad877551a"></button>
                            <button class="config-lang-btn" data-lang="zh" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_7be2d2d20c10"></button>
                            <button class="config-lang-btn" data-lang="en" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_649df08a448e"></button>
                        </div>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}" data-i18n-text="m_be3357587999"></span>
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
                            ">${t('m_71b6771bc789')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const driveSyncSection = `
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <div style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:10px;
                    ">
                        <div style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                            font-size:15px;
                            font-weight:600;
                            color: var(--text-color, #333333);
                        " data-i18n-text="m_e054f40d5926"></div>
                        <div class="cttf-switch-wrapper">
                            <label class="cttf-switch" data-i18n-title="m_4b900794dc6e">
                                <input id="driveSyncEnableToggle" type="checkbox" />
                                <span class="cttf-switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div id="driveModuleStatus" style="
                        font-size: 12px;
                        color: var(--muted-text-color, #6b7280);
                        min-height: 0;
                        margin-top: 0;
                    "></div>
                </div>
                <div id="driveControlsWrapper" style="
                    display:none;
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:8px;
                    background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                    padding:12px;
                    flex-direction:column;
                    gap:8px;
                ">
                    <div id="driveControlsContainer" style="
                        display:flex;
                        flex-direction:column;
                        gap:4px;
                        padding-top:0;
                        margin-top:0;
                    ">
                        <div style="display:flex;flex-direction:column;gap:6px;margin-top:0; margin-bottom:10px;">
                            <div style="
                                display:grid;
                                grid-template-columns:auto 1fr;
                                align-items:center;
                                column-gap:12px;
                                row-gap:8px;
                                width:100%;
                            ">
                                <span style="font-size:16px;color:var(--text-color, #333333);white-space:nowrap;"><span data-i18n-text="m_c57c190b6d9b"></span>:</span>
                                <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end;width:100%;">
                                    <button type="button" data-drive-request-mode="default" style="
                                        padding:6px 12px;
                                        border-radius:18px;
                                        border:1px solid var(--border-color, #d1d5db);
                                        background: transparent;
                                        color: var(--text-color, #333333);
                                        cursor: pointer;
                                    " data-i18n-title="m_80da4bc2bae8" data-i18n-text="m_c8d09cf955f5"></button>
                                    <button type="button" data-drive-request-mode="adguard" style="
                                        padding:6px 12px;
                                        border-radius:18px;
                                        border:1px solid var(--border-color, #d1d5db);
                                        background: transparent;
                                        color: var(--text-color, #333333);
                                        cursor: pointer;
                                    " data-i18n-title="m_fec91cac2de3" data-i18n-text="m_ea003e174e34"></button>
                                </div>
                            </div>
                        </div>
                        <div style="height:1px;background:var(--border-color, #e5e7eb);margin:0 0 8px 0;"></div>
                        <div id="driveConfigFold" style="display:flex;flex-direction:column;gap:6px;">
                            <div style="
                                display:flex;
                                align-items:center;
                                justify-content:space-between;
                                gap:8px;
                                width:100%;
                                cursor:pointer;
                            " id="driveConfigFoldToggle">
                                <span style="font-size:16px;color:var(--text-color, #333333);" data-i18n-text="m_3378a763fb15"></span>
                                <span id="driveConfigFoldArrow" style="font-size:12px;color:var(--muted-text-color, #6b7280);">▼</span>
                            </div>
                            <div id="driveConfigFields" style="display:flex;flex-direction:column;gap:6px;">
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_92041626595b"></span></span>
                                        <div class="cttf-sync-field" data-secret="false" data-visible="true">
                                            <textarea id="driveClientIdInput" class="cttf-sync-textarea" rows="3" data-min-rows="3" autocomplete="off" spellcheck="false" placeholder="xxx.apps.googleusercontent.com"></textarea>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_65f8d895a1dd"></span></span>
                                        <div class="cttf-sync-field" data-secret="true" data-visible="false">
                                            <textarea id="driveClientSecretInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="your_client_secret"></textarea>
                                            <button type="button" class="cttf-sync-toggle" data-target="driveClientSecretInput" data-i18n-aria-label="i18n.common.toggle_visibility">👁</button>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_ee93296cfe75"></span></span>
                                        <div class="cttf-sync-field" data-secret="true" data-visible="false">
                                            <textarea id="driveRefreshTokenInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="ya29...."></textarea>
                                            <button type="button" class="cttf-sync-toggle" data-target="driveRefreshTokenInput" data-i18n-aria-label="i18n.common.toggle_visibility">👁</button>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_53d26abaeb0d"></span></span>
                                        <div class="cttf-sync-field" data-secret="false" data-visible="true">
                                            <textarea id="driveFileNameInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="[Chat] Template Text Folders.backup.json"></textarea>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                            <div id="driveSaveRow" style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                                <button id="saveDriveSettingsBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius:4px;
                            " data-i18n-text="m_43868e0d24e8"></button>
                            </div>
                        <div style="height:1px;background:var(--border-color, #e5e7eb);margin:4px 0 8px 0;"></div>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                            <div style="display:flex;flex:1;gap:8px;min-width:220px;">
                                <button id="uploadDriveConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius:4px;
                                flex:1;
                                " data-i18n-text="m_ebcb252ebbd7"></button>
                                <button id="downloadDriveConfigBtn" style="
                                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                    background-color: var(--info-color, #4F46E5);
                                    color: white;
                                    border-radius:4px;
                                    flex:1;
                                " data-i18n-text="m_45d7b2b96726"></button>
                            </div>
                            <span id="driveSyncStatus" style="
                                font-size: 13px;
                                color: var(--muted-text-color, #6b7280);
                                min-height: 18px;
                                flex: 1;
                            "></span>
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
                        <span style="${rowLabelStyle}" data-i18n-text="m_a82dd6923716"></span>
                        <button id="resetSettingsBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_65c2254bc930"></button>
                    </div>
                <div style="
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                ">
                    <span style="${rowLabelStyle}" data-i18n-text="m_50c4041db726"></span>
                    <div style="display:flex;gap:8px;">
                        <button id="importConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--add-color, #fd7e14);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_bd39b3a19cd8"></button>
                        <button id="exportConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_1fa2524ed60b"></button>
                    </div>
                </div>
                </div>
            </div>
        `;
        const syncTab = `
            <div id="syncTab" class="tab-content" style="display: none;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:0;
                ">
                    ${driveSyncSection}
                </div>
            </div>
        `;

        setTrustedHTML(dialog, `
            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                margin:0 0 20px 0;
            ">
                <h3 style="margin:0;font-size:18px;font-weight:600; color: var(--text-color, #333333);" data-i18n-text="m_3b8ac539b031"></h3>
                <div id="configDialogHeaderActions" style="
                    display:flex;
                    align-items:center;
                    gap:4px;
                    flex: 0 0 auto;
                "></div>
            </div>
            ${tabNavigation}
            ${appearanceTab}
            ${configTab}
            ${syncTab}
        `);
        const configDialogHeaderActions = dialog.querySelector('#configDialogHeaderActions');
        if (configDialogHeaderActions) {
            const closeConfigDialogBtn = createDialogCloseIconButton((event) => {
                void overlay.__cttfRequestClose('button', event);
            });
            closeConfigDialogBtn.id = 'closeConfigDialogBtn';
            configDialogHeaderActions.appendChild(closeConfigDialogBtn);
        }
        let activateTab = () => {};
        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            activateTab = (targetId) => {
                tabButtons.forEach((btn) => {
                    const isActive = btn.dataset.tab === targetId;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
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
            activateTab(initialState && initialState.activeTab ? initialState.activeTab : 'appearanceTab');
        };
        setupTabs();

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
        const syncStyle = document.createElement('style');
        syncStyle.textContent = `
            .cttf-sync-field {
                position: relative;
                width: 100%;
            }
            .cttf-sync-textarea {
                box-sizing: border-box;
                width: 100%;
                min-height: 36px;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                background: var(--input-bg, #ffffff);
                color: var(--input-text-color, var(--text-color, #333333));
                font-size: 13px;
                line-height: 1.4;
                resize: none;
                overflow: hidden;
                outline: none;
                transition: height 0.05s ease;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .cttf-sync-textarea:focus {
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .cttf-sync-toggle {
                position: absolute;
                top: 50%;
                right: 6px;
                transform: translateY(-50%);
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                background: var(--button-bg, #f3f4f6);
                color: var(--text-color, #333333);
                border-radius: 6px;
                padding: 4px 6px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
            }
            .cttf-sync-toggle:hover {
                border-color: var(--primary-color, #3B82F6);
                background: var(--input-bg, #ffffff);
            }
            .cttf-sync-field[data-visible="false"] .cttf-sync-textarea {
                color: transparent;
                text-shadow: 0 0 0 var(--text-color, #333333);
                -webkit-text-security: disc;
                caret-color: transparent;
                white-space: pre-wrap;
            }
            .cttf-sync-field[data-visible="true"] .cttf-sync-textarea {
                color: var(--input-text-color, var(--text-color, #333333));
                text-shadow: none;
                -webkit-text-security: none;
                caret-color: auto;
            }
        `;
        dialog.appendChild(syncStyle);

        const langButtons = Array.from(dialog.querySelectorAll('.config-lang-btn'));
        const updateLanguageButtonState = (preference) => {
            langButtons.forEach((btn) => {
                const isActive = btn.dataset.lang === preference;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        };

        updateLanguageButtonState(getLanguagePreference());

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
                folderIconToggleText.textContent = enabled ? t('m_71b6771bc789') : t('m_bb0e7e01aa8d');
                folderIconToggleText.style.color = enabled
                    ? 'var(--success-color, #22c55e)'
                    : 'var(--muted-text-color, #6b7280)';
            }
            const tooltipTarget = folderIconToggleWrapper || folderIconToggleSlider;
            if (tooltipTarget) {
                tooltipTarget.title = enabled
                    ? t('m_4754b4803a61')
                    : t('m_6ff5ff5942c2');
            }
        };

        if (folderIconToggleInput) {
            updateFolderIconToggleState();
            folderIconToggleInput.addEventListener('change', () => {
                const enabled = folderIconToggleInput.checked;
                buttonConfig.showFolderIcons = enabled;
                persistButtonConfig();
                updateFolderIconToggleState();
                console.log(t('m_b8780f7f6543', {
                    state: enabled ? t('m_71b6771bc789') : t('m_bb0e7e01aa8d')
                }));
                if (getCurrentSettingsOverlay()) {
                    renderFolderList();
                }
                updateButtonContainer();
            });
        }

        const driveSyncToggle = dialog.querySelector('#driveSyncEnableToggle');
        const driveModuleStatusEl = dialog.querySelector('#driveModuleStatus');
        const driveControlsWrapper = dialog.querySelector('#driveControlsWrapper');
        const driveControlsContainer = dialog.querySelector('#driveControlsContainer');
        const driveConfigFields = dialog.querySelector('#driveConfigFields');
        const driveConfigFoldToggle = dialog.querySelector('#driveConfigFoldToggle');
        const driveConfigFoldArrow = dialog.querySelector('#driveConfigFoldArrow');
        const driveSaveRow = dialog.querySelector('#driveSaveRow');
        const driveClientIdInput = dialog.querySelector('#driveClientIdInput');
        const driveClientSecretInput = dialog.querySelector('#driveClientSecretInput');
        const driveRefreshTokenInput = dialog.querySelector('#driveRefreshTokenInput');
        const driveFileNameInput = dialog.querySelector('#driveFileNameInput');
        const driveRequestModeButtons = Array.from(dialog.querySelectorAll('[data-drive-request-mode]'));
        const driveStatusEl = dialog.querySelector('#driveSyncStatus');
        const driveSaveBtn = dialog.querySelector('#saveDriveSettingsBtn');
        const driveUploadBtn = dialog.querySelector('#uploadDriveConfigBtn');
        const driveDownloadBtn = dialog.querySelector('#downloadDriveConfigBtn');
        let driveConfigCollapsed = false;
        let driveRequestModeValue = 'default';
        let driveModuleStatusState = { type: 'info', text: '', messageId: null, replacements: null };
        let driveStatusState = { type: 'info', text: '', messageId: null, replacements: null };
        let driveDraftBaseline = null;
        let currentCloseGuardOverlay = null;

        const syncFields = Array.from(dialog.querySelectorAll('.cttf-sync-field'));
        const getFieldTextarea = (field) => field ? field.querySelector('.cttf-sync-textarea') : null;
        const toggleButtons = Array.from(dialog.querySelectorAll('.cttf-sync-toggle'));

        const computeHeightForLines = (el, lines = 1) => {
            const style = window.getComputedStyle(el);
            const lineHeight = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) * 1.2) || 18;
            const paddingTop = parseFloat(style.paddingTop) || 0;
            const paddingBottom = parseFloat(style.paddingBottom) || 0;
            const borderTop = parseFloat(style.borderTopWidth) || 0;
            const borderBottom = parseFloat(style.borderBottomWidth) || 0;
            const rows = Math.max(1, Number(lines) || 1);
            return (lineHeight * rows) + paddingTop + paddingBottom + borderTop + borderBottom;
        };

        const computeMinHeight = (el) => {
            const minRowsAttr = Number(el?.dataset?.minRows || 1);
            const minRows = Number.isFinite(minRowsAttr) && minRowsAttr > 0 ? minRowsAttr : 1;
            return computeHeightForLines(el, minRows);
        };

        const adjustSyncFieldHeight = (field) => {
            if (!field) return;
            const textarea = getFieldTextarea(field);
            if (!textarea) return;
            const isSecret = field.dataset.secret === 'true';
            const isVisible = field.dataset.visible === 'true';
            const minHeight = computeMinHeight(textarea);
            const forceSingleLine = isSecret && !isVisible;
            const fixedRows = Number(textarea.dataset.fixedRows || 0);
            if (forceSingleLine) {
                textarea.style.overflowY = 'hidden';
                textarea.style.height = `${computeHeightForLines(textarea, 1)}px`;
                return;
            }
            if (fixedRows > 0) {
                textarea.style.overflowY = 'hidden';
                textarea.style.height = `${computeHeightForLines(textarea, fixedRows)}px`;
                return;
            }
            textarea.style.overflowY = 'hidden';
            textarea.style.height = 'auto';
            const measured = textarea.scrollHeight;
            const targetHeight = Math.max(measured, minHeight);
            textarea.style.height = `${targetHeight}px`;
        };

        const setFieldVisibility = (field, visible) => {
            if (!field) return;
            field.dataset.visible = visible ? 'true' : 'false';
            const toggleBtn = field.querySelector('.cttf-sync-toggle');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-pressed', visible ? 'true' : 'false');
                toggleBtn.setAttribute('aria-label', t('i18n.common.toggle_visibility'));
                toggleBtn.title = visible ? t('m_bb0e7e01aa8d') || 'Hide' : t('m_71b6771bc789') || 'Show';
                toggleBtn.textContent = visible ? '🙈' : '👁';
            }
            const textarea = getFieldTextarea(field);
            if (textarea) {
                adjustSyncFieldHeight(field);
            }
        };

        const updateDriveRequestModeButtons = () => {
            if (!driveRequestModeButtons.length) {
                return;
            }
            driveRequestModeButtons.forEach((btn) => {
                const active = btn.dataset.driveRequestMode === driveRequestModeValue;
                btn.setAttribute('aria-pressed', active ? 'true' : 'false');
                btn.style.background = active ? 'var(--primary-color, #3B82F6)' : 'transparent';
                btn.style.color = active ? '#ffffff' : 'var(--text-color, #333333)';
                btn.style.borderColor = active ? 'var(--primary-color, #3B82F6)' : 'var(--border-color, #d1d5db)';
            });
        };

        const applyDriveConfigFoldState = () => {
            if (driveConfigFields && driveConfigFoldArrow) {
                driveConfigFields.style.display = driveConfigCollapsed ? 'none' : 'flex';
                driveConfigFoldArrow.textContent = driveConfigCollapsed ? '▶' : '▼';
            }
            if (driveSaveRow) {
                driveSaveRow.style.display = driveConfigCollapsed ? 'none' : 'flex';
            }
        };

        toggleButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const field = targetId ? dialog.querySelector(`#${targetId}`)?.closest('.cttf-sync-field') : null;
                if (!field) return;
                const nextVisible = field.dataset.visible !== 'true';
                setFieldVisibility(field, nextVisible);
                adjustSyncFieldHeight(field);
                requestAnimationFrame(() => adjustSyncFieldHeight(field));
            });
        });

        syncFields.forEach((field) => {
            const textarea = getFieldTextarea(field);
            if (!textarea) return;
            adjustSyncFieldHeight(field);
            textarea.addEventListener('input', () => {
                adjustSyncFieldHeight(field);
                requestAnimationFrame(() => adjustSyncFieldHeight(field));
            });
            if (field.dataset.secret === 'true') {
                setFieldVisibility(field, false);
            } else {
                field.dataset.visible = 'true';
            }
        });

        const refreshAllSyncHeights = () => {
            syncFields.forEach((field) => {
                adjustSyncFieldHeight(field);
            });
        };

        const resolveLocalizedStatusText = (state) => {
            if (!state) {
                return '';
            }
            if (state.messageId) {
                return t(state.messageId, state.replacements || null);
            }
            return state.text || '';
        };

        const setDriveModuleStatus = (type, text, options = {}) => {
            driveModuleStatusState = {
                type,
                text: text || '',
                messageId: options.messageId || null,
                replacements: options.replacements || null,
            };
            if (!driveModuleStatusEl) return;
            driveModuleStatusEl.textContent = resolveLocalizedStatusText(driveModuleStatusState);
            const colorMap = {
                success: 'var(--success-color, #22c55e)',
                error: 'var(--danger-color, #ef4444)',
                info: 'var(--muted-text-color, #6b7280)'
            };
            driveModuleStatusEl.style.color = colorMap[type] || 'var(--muted-text-color, #6b7280)';
        };

        const toggleDriveButtons = (disabled) => {
            [driveSaveBtn, driveUploadBtn, driveDownloadBtn].forEach((btn) => {
                if (!btn) return;
                btn.disabled = disabled;
                btn.style.opacity = disabled ? '0.7' : '1';
            });
        };

        const setDriveControlsVisibility = (visible) => {
            if (driveControlsWrapper) {
                driveControlsWrapper.style.display = visible ? 'flex' : 'none';
            }
            if (driveControlsContainer) {
                driveControlsContainer.style.display = visible ? 'flex' : 'none';
            }
            toggleDriveButtons(!visible);
        };

        const setDriveStatus = (type, text, options = {}) => {
            driveStatusState = {
                type,
                text: text || '',
                messageId: options.messageId || null,
                replacements: options.replacements || null,
            };
            if (!driveStatusEl) return;
            driveStatusEl.textContent = resolveLocalizedStatusText(driveStatusState);
            const colorMap = {
                success: 'var(--success-color, #22c55e)',
                error: 'var(--danger-color, #ef4444)',
                info: 'var(--text-color, #333333)'
            };
            driveStatusEl.style.color = colorMap[type] || 'var(--muted-text-color, #6b7280)';
        };

        const normalizeDriveDraft = (draft = {}) => {
            return {
                clientId: typeof draft.clientId === 'string' ? draft.clientId.trim() : '',
                clientSecret: typeof draft.clientSecret === 'string' ? draft.clientSecret.trim() : '',
                refreshToken: typeof draft.refreshToken === 'string' ? draft.refreshToken.trim() : '',
                fileName: typeof draft.fileName === 'string' && draft.fileName.trim()
                    ? draft.fileName.trim()
                    : DEFAULT_DRIVE_FILE_NAME,
                requestMode: draft.requestMode === 'adguard' ? 'adguard' : 'default',
                configCollapsed: draft.configCollapsed === true,
            };
        };

        const captureDriveDraftSnapshot = () => {
            return normalizeDriveDraft({
                clientId: driveClientIdInput ? driveClientIdInput.value : '',
                clientSecret: driveClientSecretInput ? driveClientSecretInput.value : '',
                refreshToken: driveRefreshTokenInput ? driveRefreshTokenInput.value : '',
                fileName: driveFileNameInput ? driveFileNameInput.value : DEFAULT_DRIVE_FILE_NAME,
                requestMode: driveRequestModeValue,
                configCollapsed: driveConfigCollapsed === true,
            });
        };

        const updateDriveDraftBaseline = (draft = null) => {
            driveDraftBaseline = normalizeDriveDraft(draft || captureDriveDraftSnapshot());
            return driveDraftBaseline;
        };

        const hasPendingDriveDraftChanges = () => {
            const baseline = normalizeDriveDraft(driveDraftBaseline || cachedDriveSettings || {});
            const currentDraft = captureDriveDraftSnapshot();
            return JSON.stringify(currentDraft) !== JSON.stringify(baseline);
        };

        const promptDriveDraftCloseAction = () => new Promise((resolve) => {
            if (currentCloseGuardOverlay) {
                closeExistingOverlay(currentCloseGuardOverlay);
                currentCloseGuardOverlay = null;
            }

            const { overlay: guardOverlay, dialog: guardDialog } = createUnifiedDialog({
                title: null,
                showTitle: false,
                width: '420px',
                maxWidth: '92vw',
                padding: '20px',
                zIndex: '13500',
                closeOnOverlayClick: false,
                closeOnEscape: true,
                overlayClassName: 'config-close-guard-overlay',
                dialogClassName: 'config-close-guard-dialog',
                onClose: () => {
                    if (currentCloseGuardOverlay === guardOverlay) {
                        currentCloseGuardOverlay = null;
                    }
                },
            });

            currentCloseGuardOverlay = guardOverlay;

            setTrustedHTML(guardDialog, `
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <h3 style="
                        margin:0;
                        font-size:18px;
                        font-weight:700;
                        color: var(--text-color, #333333);
                    " data-i18n-text="config.drive_unsaved.title"></h3>
                    <p style="
                        margin:0;
                        font-size:13px;
                        line-height:1.6;
                        color: var(--muted-text-color, #6b7280);
                    " data-i18n-text="config.drive_unsaved.message"></p>
                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:8px;
                        flex-wrap:wrap;
                        margin-top:4px;
                    ">
                        <button id="configContinueEditBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--button-bg, #f3f4f6);
                            color: var(--text-color, #333333);
                            border: 1px solid var(--border-color, #d1d5db);
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.continue_edit"></button>
                        <button id="configDiscardCloseBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--danger-color, #ef4444);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.discard_close"></button>
                        <button id="configSaveCloseBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.save_close"></button>
                    </div>
                </div>
            `);

            const finish = (result) => {
                closeExistingOverlay(guardOverlay);
                if (currentCloseGuardOverlay === guardOverlay) {
                    currentCloseGuardOverlay = null;
                }
                resolve(result);
            };

            const continueBtn = guardDialog.querySelector('#configContinueEditBtn');
            const discardBtn = guardDialog.querySelector('#configDiscardCloseBtn');
            const saveBtn = guardDialog.querySelector('#configSaveCloseBtn');

            continueBtn?.addEventListener('click', () => finish('cancel'));
            discardBtn?.addEventListener('click', () => finish('discard'));
            saveBtn?.addEventListener('click', () => finish('save'));

            const originalRequestClose = guardOverlay.__cttfRequestClose;
            guardOverlay.__cttfRequestClose = async (reason = 'programmatic', event = null, closeOptions = {}) => {
                if (reason === 'escape') {
                    finish('cancel');
                    return false;
                }
                if (typeof originalRequestClose === 'function') {
                    return originalRequestClose(reason, event, closeOptions);
                }
                return false;
            };
        });

        const hydrateDriveInputs = (settings) => {
            const source = settings || cachedDriveSettings || {
                clientId: '',
                clientSecret: '',
                refreshToken: '',
                fileName: DEFAULT_DRIVE_FILE_NAME,
                requestMode: 'default',
                configCollapsed: false
            };
            if (driveClientIdInput) driveClientIdInput.value = source.clientId || '';
            if (driveClientSecretInput) driveClientSecretInput.value = source.clientSecret || '';
            if (driveRefreshTokenInput) driveRefreshTokenInput.value = source.refreshToken || '';
            if (driveFileNameInput) driveFileNameInput.value = (source.fileName || DEFAULT_DRIVE_FILE_NAME);
            driveRequestModeValue = source.requestMode === 'adguard' ? 'adguard' : 'default';
            updateDriveRequestModeButtons();
            driveConfigCollapsed = source.configCollapsed === true;
            applyDriveConfigFoldState();
            syncFields.forEach((field) => {
                const textarea = getFieldTextarea(field);
                if (field.dataset.secret === 'true') {
                    setFieldVisibility(field, false);
                } else {
                    setFieldVisibility(field, true);
                }
                if (textarea) {
                    adjustSyncFieldHeight(field);
                    requestAnimationFrame(() => adjustSyncFieldHeight(field));
                }
            });
            requestAnimationFrame(refreshAllSyncHeights);
            updateDriveDraftBaseline(source);
        };

        const applyDriveInputChanges = () => {
            if (!driveSyncService || typeof driveSyncService.updateSettings !== 'function') {
                return null;
            }
            const nextSettings = {
                enabled: driveSyncToggle ? driveSyncToggle.checked === true : true,
                clientId: driveClientIdInput ? driveClientIdInput.value.trim() : '',
                clientSecret: driveClientSecretInput ? driveClientSecretInput.value.trim() : '',
                refreshToken: driveRefreshTokenInput ? driveRefreshTokenInput.value.trim() : '',
                fileName: driveFileNameInput
                    ? (driveFileNameInput.value.trim() || DEFAULT_DRIVE_FILE_NAME)
                    : DEFAULT_DRIVE_FILE_NAME,
                requestMode: driveRequestModeValue,
                configCollapsed: driveConfigCollapsed === true
            };
            cachedDriveSettings = driveSyncService.updateSettings(nextSettings);
            updateDriveDraftBaseline(cachedDriveSettings || nextSettings);
            return cachedDriveSettings;
        };

        const ensureDriveModuleEnabled = async () => {
            if (!driveSyncToggle || !driveSyncToggle.checked) {
                setDriveModuleStatus('info', '', { messageId: 'm_8fce89809baa' });
                setDriveControlsVisibility(false);
                return null;
            }
            toggleDriveButtons(true);
            setDriveModuleStatus('info', '', { messageId: 'm_b40cbaef0935' });
            try {
                const service = await ensureDriveSyncService();
                driveSyncService = service;
                if (service && typeof service.setTranslator === 'function') {
                    try { service.setTranslator(t); } catch (_) {}
                }
                const updatedSettings = service && typeof service.updateSettings === 'function'
                    ? service.updateSettings({ enabled: true })
                    : (service && typeof service.getSettings === 'function' ? service.getSettings() : cachedDriveSettings);
                cachedDriveSettings = updatedSettings || cachedDriveSettings;
                setDriveControlsVisibility(true);
                hydrateDriveInputs(cachedDriveSettings);
                toggleDriveButtons(false);
                setDriveModuleStatus('info', '');
                return service;
            } catch (error) {
                console.error('Drive module load failed:', error);
                setDriveModuleStatus('error', formatDriveModuleLoadError(error));
                setDriveControlsVisibility(false);
                return null;
            }
        };

        const formatterFromService = (service) => {
            if (service && typeof service.formatDriveError === 'function') {
                return service.formatDriveError;
            }
            return formatDriveModuleLoadError;
        };

        const parseDriveConfigContent = (content) => {
            try {
                const parsed = JSON.parse(content || '{}');
                if (!parsed || typeof parsed !== 'object') {
                    throw new Error(t('m_5df1a31bee04'));
                }
                return parsed;
            } catch (error) {
                const err = new Error(t('m_5df1a31bee04'));
                err.original = error;
                throw err;
            }
        };

        const fetchRemoteDriveConfig = async (service) => {
            try {
                const result = await service.syncDownloadConfigFromDrive();
                const parsedConfig = parseDriveConfigContent(result?.content ?? '');
                return {
                    parsedConfig,
                    meta: result,
                    notFound: false
                };
            } catch (error) {
                if (error && error.code === 'NOT_FOUND') {
                    return { parsedConfig: null, meta: null, notFound: true };
                }
                throw error;
            }
        };

        const showDriveDiffChoiceDialog = ({ remoteConfig, mode = 'download' }) => new Promise((resolve) => {
            if (currentConfirmOverlay) {
                closeExistingOverlay(currentConfirmOverlay);
            }

            const { overlay, dialog } = createUnifiedDialog({
                title: null,
                showTitle: false,
                width: '560px',
                maxWidth: '94vw',
                maxHeight: 'none',
                padding: '20px',
                zIndex: '13500',
                closeOnOverlayClick: false,
                overlayClassName: 'drive-diff-choice-overlay',
                dialogClassName: 'drive-diff-choice-dialog',
                dialogStyles: {
                    borderRadius: '8px',
                    boxShadow: '0 12px 28px var(--shadow-color, rgba(15, 23, 42, 0.28))',
                    overflowY: 'visible',
                },
                onClose: () => {
                    if (currentConfirmOverlay === overlay) {
                        currentConfirmOverlay = null;
                    }
                },
            });

            const statsOf = (config) => {
                const folderCount = Object.keys(config?.folders || {}).length;
                const buttonCount = Object.values(config?.folders || {}).reduce((sum, folder) => {
                    return sum + Object.keys(folder.buttons || {}).length;
                }, 0);
                return { folderCount, buttonCount };
            };

            const localStats = statsOf(buttonConfig);
            const remoteStats = statsOf(remoteConfig);
            const actionLabel = mode === 'upload'
                ? t('m_81a978ef036c')
                : t('m_d5bb7365ec02');

            setTrustedHTML(dialog, `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom: 10px;">
                    <h3 style="
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--text-color, #333333);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        ☁️ ${t('m_aca979fdbd33')}
                    </h3>
                    <span style="
                        font-size: 12px;
                        padding: 4px 8px;
                        border-radius: 999px;
                        background-color: rgba(59, 130, 246, 0.12);
                        color: var(--info-color, #4F46E5);
                        border: 1px solid rgba(59, 130, 246, 0.25);
                    ">${actionLabel}</span>
                </div>

                <p style="
                    margin: 0 0 14px 0;
                    font-size: 13px;
                    color: var(--muted-text-color, #6b7280);
                    line-height: 1.5;
                ">
                    ${t('m_0b423d85c092')}
                </p>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 16px;
                ">
                    <div style="
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 8px;
                        padding: 12px;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-color, #333333);">
                            ${t('m_fe67280a8e87')}
                        </div>
                        <div style="font-size: 12px; color: var(--muted-text-color, #6b7280);">
                            ${localStats.folderCount} ${t('m_9a311c0d1474')} · ${localStats.buttonCount} ${t('m_3a591ab6fe4d')}
                        </div>
                    </div>
                    <div style="
                        border: 1px solid var(--info-color, #4F46E5);
                        border-radius: 8px;
                        padding: 12px;
                        background-color: rgba(79, 70, 229, 0.06);
                    ">
                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--info-color, #4F46E5);">
                            ${t('m_5b8f82579075')}
                        </div>
                        <div style="font-size: 12px; color: var(--info-color, #4F46E5);">
                            ${remoteStats.folderCount} ${t('m_9a311c0d1474')} · ${remoteStats.buttonCount} ${t('m_3a591ab6fe4d')}
                        </div>
                    </div>
                </div>

                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                ">
                    <button id="driveViewDiffBtn" style="
                        ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 6px;
                    ">${t('m_27e029bfe920')}</button>
                    <div style="display:flex; gap: 8px; align-items:center; flex-wrap: wrap; justify-content: flex-end;">
                        <button id="driveUseLocalBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:6px;
                        ">${t('m_9b437d4c1413')}</button>
                        <button id="driveUseRemoteBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--info-color, #4F46E5);
                            color: white;
                            border-radius:6px;
                        ">${t('m_27ba06b21165')}</button>
                        <button id="cancelDriveSyncBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:6px;
                        ">${t('m_4d0b4688c787')}</button>
                    </div>
                </div>
            `);

            currentConfirmOverlay = overlay;

            const closeDialog = (result) => {
                if (currentDiffOverlay) {
                    if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                        currentDiffOverlay.__cttfCloseDiff();
                    } else {
                        closeExistingOverlay(currentDiffOverlay);
                        currentDiffOverlay = null;
                    }
                }
                closeExistingOverlay(overlay);
                resolve(result);
            };

            const diffBtn = dialog.querySelector('#driveViewDiffBtn');
            if (diffBtn) {
                diffBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    try {
                        showImportDiffPreview(buttonConfig, remoteConfig, {
                            currentLabel: t('m_fe67280a8e87'),
                            importedLabel: t('m_5b8f82579075')
                        });
                    } catch (error) {
                        console.error('[CTTF] Drive diff preview failed:', error);
                    }
                });
            }

            const useLocalBtn = dialog.querySelector('#driveUseLocalBtn');
            if (useLocalBtn) {
                useLocalBtn.addEventListener('click', () => closeDialog('local'));
            }
            const useRemoteBtn = dialog.querySelector('#driveUseRemoteBtn');
            if (useRemoteBtn) {
                useRemoteBtn.addEventListener('click', () => closeDialog('remote'));
            }
            const cancelBtn = dialog.querySelector('#cancelDriveSyncBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => closeDialog('cancel'));
            }

        });

        const initializeDriveToggle = () => {
            if (!driveSyncToggle) return Promise.resolve(null);
            driveSyncToggle.checked = driveHostPrefs.enabled === true;
            if (driveSyncToggle.checked) {
                const loadPromise = ensureDriveModuleEnabled();
                driveSyncToggle.addEventListener('change', async () => {
                    const enabled = driveSyncToggle.checked;
                    persistDriveHostPrefs({ enabled });
                    if (enabled) {
                        await ensureDriveModuleEnabled();
                    } else {
                        if (driveSyncService && typeof driveSyncService.updateSettings === 'function') {
                            cachedDriveSettings = driveSyncService.updateSettings({ enabled: false });
                        } else {
                            cachedDriveSettings = { ...(cachedDriveSettings || {}), enabled: false };
                        }
                        setDriveControlsVisibility(false);
                        setDriveModuleStatus('info', '');
                        setDriveStatus('info', '');
                    }
                });
                return loadPromise;
            } else {
                setDriveControlsVisibility(false);
                setDriveModuleStatus('info', '', { messageId: 'm_a003ca900128' });
            }
            driveSyncToggle.addEventListener('change', async () => {
                const enabled = driveSyncToggle.checked;
                persistDriveHostPrefs({ enabled });
                if (enabled) {
                    await ensureDriveModuleEnabled();
                } else {
                    if (driveSyncService && typeof driveSyncService.updateSettings === 'function') {
                        cachedDriveSettings = driveSyncService.updateSettings({ enabled: false });
                    } else {
                        cachedDriveSettings = { ...(cachedDriveSettings || {}), enabled: false };
                    }
                    setDriveControlsVisibility(false);
                    setDriveModuleStatus('info', '');
                    setDriveStatus('info', '');
                }
            });
            return Promise.resolve(null);
        };

        handleConfigDialogBeforeClose = async () => {
            if (!hasPendingDriveDraftChanges()) {
                return true;
            }

            const closeAction = await promptDriveDraftCloseAction();
            if (closeAction === 'cancel') {
                return false;
            }

            if (closeAction === 'discard') {
                hydrateDriveInputs(cachedDriveSettings || driveDraftBaseline || {});
                setDriveStatus('info', '');
                return true;
            }

            try {
                await ensureDriveSyncService();
                applyDriveInputChanges();
                setDriveStatus('success', '', { messageId: 'm_16ac0480568c' });
                return true;
            } catch (error) {
                console.error('Drive settings save before close failed:', error);
                setDriveStatus('error', formatDriveModuleLoadError(error));
                return false;
            }
        };

        const applyCapturedDialogState = (state) => {
            if (!state) {
                return;
            }
            if (typeof state.activeTab === 'string' && state.activeTab) {
                activateTab(state.activeTab);
            }
            if (driveSyncToggle) {
                driveSyncToggle.checked = state.driveEnabled === true;
                if (!driveSyncToggle.checked) {
                    setDriveControlsVisibility(false);
                }
            }
            if (driveClientIdInput) driveClientIdInput.value = state.driveClientId || '';
            if (driveClientSecretInput) driveClientSecretInput.value = state.driveClientSecret || '';
            if (driveRefreshTokenInput) driveRefreshTokenInput.value = state.driveRefreshToken || '';
            if (driveFileNameInput) driveFileNameInput.value = state.driveFileName || DEFAULT_DRIVE_FILE_NAME;
            driveRequestModeValue = state.driveRequestMode === 'adguard' ? 'adguard' : 'default';
            updateDriveRequestModeButtons();
            driveConfigCollapsed = state.driveConfigCollapsed === true;
            applyDriveConfigFoldState();
            const secretField = driveClientSecretInput ? driveClientSecretInput.closest('.cttf-sync-field') : null;
            const refreshField = driveRefreshTokenInput ? driveRefreshTokenInput.closest('.cttf-sync-field') : null;
            if (secretField) {
                setFieldVisibility(secretField, state.driveClientSecretVisible === true);
            }
            if (refreshField) {
                setFieldVisibility(refreshField, state.driveRefreshTokenVisible === true);
            }
            refreshAllSyncHeights();
            updateDriveDraftBaseline();
        };

        const refreshConfigDialogLocale = () => {
            updateLanguageButtonState(getLanguagePreference());
            updateFolderIconToggleState();
            updateDriveRequestModeButtons();
            applyDriveConfigFoldState();
            syncFields.forEach((field) => {
                if (!field) {
                    return;
                }
                setFieldVisibility(field, field.dataset.visible === 'true');
            });
            setDriveModuleStatus(
                driveModuleStatusState.type,
                driveModuleStatusState.text,
                {
                    messageId: driveModuleStatusState.messageId,
                    replacements: driveModuleStatusState.replacements,
                }
            );
            setDriveStatus(
                driveStatusState.type,
                driveStatusState.text,
                {
                    messageId: driveStatusState.messageId,
                    replacements: driveStatusState.replacements,
                }
            );
            requestAnimationFrame(refreshAllSyncHeights);
        };

        updateDriveDraftBaseline();
        const driveToggleReady = initializeDriveToggle();
        Promise.resolve(driveToggleReady).finally(() => {
            if (initialState) {
                applyCapturedDialogState(initialState);
            }
        });

        if (driveRequestModeButtons.length) {
            driveRequestModeButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.driveRequestMode === 'adguard' ? 'adguard' : 'default';
                    driveRequestModeValue = val;
                    updateDriveRequestModeButtons();
                    applyDriveInputChanges();
                });
            });
        }

        if (driveConfigFoldToggle && driveConfigFields && driveConfigFoldArrow) {
            driveConfigFoldToggle.addEventListener('click', () => {
                driveConfigCollapsed = !driveConfigCollapsed;
                applyDriveConfigFoldState();
                applyDriveInputChanges();
            });
        }

        if (driveSaveBtn) {
            driveSaveBtn.addEventListener('click', async () => {
                const service = await ensureDriveModuleEnabled();
                if (!service) return;
                applyDriveInputChanges();
                setDriveStatus('success', '', { messageId: 'm_16ac0480568c' });
            });
        }

        if (driveUploadBtn) {
            driveUploadBtn.addEventListener('click', async () => {
                const service = await ensureDriveModuleEnabled();
                if (!service) return;
                applyDriveInputChanges();
                if (typeof service.ensureDriveSyncApiAvailable === 'function' && !service.ensureDriveSyncApiAvailable()) {
                    setDriveStatus('error', '', { messageId: 'm_8db845c5073b' });
                    return;
                }
                if (typeof service.hasDriveCredentials === 'function' && !service.hasDriveCredentials()) {
                    setDriveStatus('error', '', { messageId: 'm_b2a17fcb4e17' });
                    return;
                }
                const formatter = formatterFromService(service);
                toggleDriveButtons(true);
                setDriveStatus('info', '', { messageId: 'm_315e9404693b' });
                try {
                    const remote = await fetchRemoteDriveConfig(service);
                    if (remote.notFound) {
                        setDriveStatus('info', '', { messageId: 'm_345f882bd9c1' });
                        await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
                        cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
                        hydrateDriveInputs(cachedDriveSettings);
                        setDriveStatus('success', '', { messageId: 'm_f27351c4a629' });
                        return;
                    }
                    const remoteConfig = remote.parsedConfig;
                    if (configsStructurallyEqual(buttonConfig, remoteConfig)) {
                        setDriveStatus('success', '', { messageId: 'm_67dedc24dc09' });
                        return;
                    }

                    const decision = await showDriveDiffChoiceDialog({
                        remoteConfig,
                        mode: 'upload'
                    });

                    if (decision === 'cancel') {
                        setDriveStatus('info', '', { messageId: 'm_3b8ad2dfebd4' });
                        return;
                    }

                    if (decision === 'remote') {
                        applyConfigFromRemote(remoteConfig);
                        cachedDriveSettings = (remote.meta && remote.meta.settings) || (service.getSettings ? service.getSettings() : cachedDriveSettings);
                        hydrateDriveInputs(cachedDriveSettings);
                        setDriveStatus('success', '', { messageId: 'm_e0f2f560f582' });
                        return;
                    }

                    await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
                    cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
                    hydrateDriveInputs(cachedDriveSettings);
                    setDriveStatus('success', '', { messageId: 'm_f27351c4a629' });
                } catch (error) {
                    console.error('Drive upload failed:', error);
                    const message = error?.message || formatter(error);
                    setDriveStatus('error', message);
                } finally {
                    toggleDriveButtons(false);
                }
            });
        }

        if (driveDownloadBtn) {
            driveDownloadBtn.addEventListener('click', async () => {
                const service = await ensureDriveModuleEnabled();
                if (!service) return;
                applyDriveInputChanges();
                if (typeof service.ensureDriveSyncApiAvailable === 'function' && !service.ensureDriveSyncApiAvailable()) {
                    setDriveStatus('error', '', { messageId: 'm_8db845c5073b' });
                    return;
                }
                if (typeof service.hasDriveCredentials === 'function' && !service.hasDriveCredentials()) {
                    setDriveStatus('error', '', { messageId: 'm_b2a17fcb4e17' });
                    return;
                }
                const formatter = formatterFromService(service);
                toggleDriveButtons(true);
                setDriveStatus('info', '', { messageId: 'm_315e9404693b' });
                try {
                    const remote = await fetchRemoteDriveConfig(service);
                    if (remote.notFound) {
                        setDriveStatus('error', '', { messageId: 'm_345f882bd9c1' });
                        return;
                    }
                    const remoteConfig = remote.parsedConfig;
                    if (configsStructurallyEqual(buttonConfig, remoteConfig)) {
                        setDriveStatus('success', '', { messageId: 'm_67dedc24dc09' });
                        return;
                    }

                    const decision = await showDriveDiffChoiceDialog({
                        remoteConfig,
                        mode: 'download'
                    });

                    if (decision === 'cancel') {
                        setDriveStatus('info', '', { messageId: 'm_3b8ad2dfebd4' });
                        return;
                    }

                    if (decision === 'local') {
                        await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
                        cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
                        hydrateDriveInputs(cachedDriveSettings);
                        setDriveStatus('success', '', { messageId: 'm_f27351c4a629' });
                        return;
                    }

                    applyConfigFromRemote(remoteConfig);
                    cachedDriveSettings = (remote.meta && remote.meta.settings) || (service.getSettings ? service.getSettings() : cachedDriveSettings);
                    hydrateDriveInputs(cachedDriveSettings);
                    setDriveStatus('success', '', { messageId: 'm_ce39d809e5a2' });
                } catch (error) {
                    console.error('Drive download failed:', error);
                    const message = error?.message || formatter(error);
                    setDriveStatus('error', message);
                } finally {
                    toggleDriveButtons(false);
                }
            });
        }

        overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
            if (currentConfigOverlay !== overlay) {
                return;
            }
            if (currentCloseGuardOverlay) {
                closeExistingOverlay(currentCloseGuardOverlay);
                currentCloseGuardOverlay = null;
            }
            if (currentConfirmOverlay) {
                closeExistingOverlay(currentConfirmOverlay);
                currentConfirmOverlay = null;
            }
            if (currentDiffOverlay) {
                if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                    currentDiffOverlay.__cttfCloseDiff();
                } else {
                    closeExistingOverlay(currentDiffOverlay);
                    currentDiffOverlay = null;
                }
            }
            refreshConfigDialogLocale();
        });

        dialog.querySelector('#importConfigBtn').addEventListener('click', () => {
            importConfig(() => {
                // 重新渲染主设置面板
                if (getCurrentSettingsOverlay()) {
                    setSelectedFolderName(buttonConfig.folderOrder[0] || null);
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
                    console.log(t('m_58d4a48c7fb5'));
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
                    console.log(t('m_6ca48ae98250'));
                }
            }, 500); // 给导出操作一些时间完成
        });

        dialog.querySelector('#resetSettingsBtn').addEventListener('click', () => {
        if (confirm(t('m_45afc995dcaa'))) {
                // 先关闭脚本配置弹窗，提升用户体验
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('m_a2da04e54c4f'));
                }

                // 执行配置重置
                const nextDefaultConfig = createDefaultConfig();
                setButtonConfig(cloneSerializable(nextDefaultConfig, {
                    fallback: nextDefaultConfig,
                    logLabel: '[Chat] Template Text Folders default config clone failed:',
                }));
                hydrateButtonConfigDefaults(buttonConfig, { silent: true });
                persistButtonConfig();

                // 重新渲染设置面板（如果还打开着）
                if (getCurrentSettingsOverlay()) {
                    setSelectedFolderName(buttonConfig.folderOrder[0] || null);
                    renderFolderList();
                    renderButtonList();
                }

                console.log(t('m_c0aa47e7a67c'));

                // 更新按钮栏
                updateButtonContainer();
                // 重置后应用默认/匹配样式
                try { applyDomainStyles(); } catch (_) {}

                // 立即更新计数器
                setTimeout(() => {
                    updateCounters();
                    console.log(t('m_c8d00e5dddcb'));

                    // 在所有更新完成后显示成功提示
                    setTimeout(() => {
                        alert(t('m_5b31c4e45971'));
                    }, 50);
                }, 100);
            }
        });
    };

export {
    closeCurrentConfigOverlay,
    showConfigSettingsDialog,
};
