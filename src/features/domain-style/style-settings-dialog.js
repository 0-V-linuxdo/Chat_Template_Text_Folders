import {
    buttonConfig,
    createDialogCloseIconButton,
    createFaviconElement,
    createUnifiedDialog,
    generateDomainFavicon,
    persistButtonConfig,
    registerLocaleRefresh,
    t,
} from '../../core/runtime-services.js';
import { closeExistingOverlay } from '../toolbar/index.js';
import { applyDomainStyles } from './runtime.js';
import { showEditDomainStyleDialog } from './style-editor-dialog.js';
import { OFFICIAL_STYLE_SOURCE_URL } from './official-style-bundle.generated.js';
import {
    buildOfficialStyleBundleFromUserCss,
    ensureStyleBundle,
    ensureStyleRule,
    getPrimaryHostFromMatchers,
    splitRulesBySource,
    STYLE_MATCHER_TYPE,
    STYLE_RULE_SOURCE,
    parseUserStyleFile,
    serializeStylePackageToUserCss,
} from './style-format.js';
import { downloadTextFile } from '../../shared/common.js';

let currentStyleOverlay = null;
let currentSiteRulesOverlay = null;
let currentSiteRulesState = null;

const applyCurrentStyleConfig = () => {
    persistButtonConfig();
    try { applyDomainStyles(); } catch (_) {}
};

const getErrorMessage = (error) => {
    if (!error) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

const formatTimestamp = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return t('style.info.bundled_snapshot');
    }
    try {
        return new Date(numeric).toLocaleString();
    } catch {
        return t('style.info.bundled_snapshot');
    }
};

const formatSourceLabel = (value) => {
    const text = String(value || '').trim();
    if (!text) {
        return '-';
    }
    try {
        return new URL(text).hostname || text;
    } catch {
        return text;
    }
};

const buildExportFileName = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `[Chat] Template Text Folders Styles ${yyyy}-${mm}-${dd} ${hh}-${minutes}-${ss}.user.css`;
};

const createBadge = (label, options = {}) => {
    const badge = document.createElement('span');
    badge.textContent = label;
    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.padding = options.padding || '4px 10px';
    badge.style.borderRadius = options.borderRadius || '999px';
    badge.style.fontSize = options.fontSize || '12px';
    badge.style.fontWeight = options.fontWeight || '600';
    badge.style.lineHeight = options.lineHeight || '1.2';
    badge.style.whiteSpace = 'nowrap';
    badge.style.backgroundColor = options.background || 'rgba(59,130,246,0.12)';
    badge.style.color = options.color || 'var(--primary-color, #3B82F6)';
    badge.style.border = options.border || '1px solid rgba(59,130,246,0.18)';
    return badge;
};

const normalizeSiteHost = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');

const createSiteGroupKey = (host) => {
    const normalizedHost = normalizeSiteHost(host);
    if (!normalizedHost) {
        return '';
    }
    const parts = normalizedHost.split('.').filter(Boolean);
    if (parts.length <= 2) {
        return normalizedHost;
    }
    return parts.slice(-2).join('.');
};

const extractHostFromRegexpMatcher = (value) => {
    const normalized = String(value || '')
        .replace(/\\\./g, '.')
        .replace(/\\\//g, '/');
    const urlMatch = normalized.match(/https?:\/\/([^/)\]\s]+)/i);
    if (urlMatch?.[1]) {
        return urlMatch[1];
    }
    const hostMatch = normalized.match(/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    return hostMatch?.[1] || '';
};

const formatSiteLabelFromHost = (host) => {
    const normalizedHost = createSiteGroupKey(host);
    if (!normalizedHost) {
        return '';
    }
    const baseName = normalizedHost.split('.')[0] || normalizedHost;
    return baseName
        .split(/[-_]+/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
};

const extractSiteLabelFromRuleName = (name) => {
    const text = String(name || '').trim();
    if (!text) {
        return '';
    }
    const [prefix] = text.split(/\s+-\s+/, 1);
    return prefix ? prefix.trim() : '';
};

const escapeRegExp = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const stripSiteLabelPrefixFromRuleName = (name, siteLabel) => {
    const text = String(name || '').trim();
    const normalizedSiteLabel = String(siteLabel || '').trim();
    if (!text || !normalizedSiteLabel) {
        return text;
    }
    const prefixPattern = new RegExp(`^${escapeRegExp(normalizedSiteLabel)}\\s*[-–—:]\\s*`, 'i');
    const strippedText = text.replace(prefixPattern, '').trim();
    return strippedText || text;
};

const resolveRuleSiteInfo = (rule) => {
    const matchers = Array.isArray(rule?.matchers) ? rule.matchers : [];
    const directHost = getPrimaryHostFromMatchers(matchers);
    const regexpHost = directHost
        || matchers
            .filter((matcher) => matcher?.type === 'regexp')
            .map((matcher) => extractHostFromRegexpMatcher(matcher?.value))
            .find(Boolean)
        || '';
    const siteHost = createSiteGroupKey(regexpHost);
    const siteLabel = extractSiteLabelFromRuleName(rule?.name)
        || formatSiteLabelFromHost(siteHost || regexpHost)
        || t('style.grouped.other_site');
    const displayHost = normalizeSiteHost(directHost || regexpHost || siteHost);
    const faviconHost = displayHost || siteHost;

    return {
        key: siteHost || `other:${siteLabel.toLowerCase()}`,
        host: displayHost,
        label: siteLabel,
        favicon: rule?.favicon || (faviconHost ? generateDomainFavicon(faviconHost) : ''),
    };
};

const getMatcherTypeLabel = (type) => {
    if (type === STYLE_MATCHER_TYPE.DOMAIN) {
        return t('style.editor.type.domain');
    }
    if (type === STYLE_MATCHER_TYPE.URL_PREFIX) {
        return t('style.editor.type.url_prefix');
    }
    if (type === STYLE_MATCHER_TYPE.URL) {
        return t('style.editor.type.url');
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
        return t('style.editor.type.regexp');
    }
    return t('style.editor.matchers');
};

const shouldUseUrlSectionLabel = (matchers = []) => Array.isArray(matchers)
    && matchers.length > 0
    && matchers.every((matcher) => matcher?.type !== STYLE_MATCHER_TYPE.REGEXP);

const groupStyleMatchers = (matchers = []) => {
    const groups = [];
    const groupMap = new Map();

    if (!Array.isArray(matchers)) {
        return groups;
    }

    matchers.forEach((matcher) => {
        const type = matcher?.type || '';
        const value = String(matcher?.value || '').trim();
        if (!type || !value) {
            return;
        }

        let group = groupMap.get(type);
        if (!group) {
            group = { type, values: [] };
            groupMap.set(type, group);
            groups.push(group);
        }

        group.values.push(value);
    });

    return groups;
};

const createDraftRuleForSiteGroup = (group) => {
    const host = group?.host || window.location.hostname || '';
    return {
        name: '',
        source: STYLE_RULE_SOURCE.CUSTOM,
        enabled: true,
        matchers: host
            ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: host }]
            : [],
        layout: {},
        cssCode: '',
        favicon: group?.favicon || (host ? generateDomainFavicon(host) : ''),
    };
};

const resolveGMRequest = () => {
    try {
        if (typeof GM_xmlhttpRequest === 'function') {
            return GM_xmlhttpRequest;
        }
        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.GM_xmlhttpRequest === 'function') {
            return unsafeWindow.GM_xmlhttpRequest;
        }
        if (typeof window !== 'undefined' && typeof window.GM_xmlhttpRequest === 'function') {
            return window.GM_xmlhttpRequest;
        }
    } catch (_) {
        /* ignore */
    }
    return null;
};

const resolveFetch = () => {
    try {
        if (typeof fetch === 'function') {
            return fetch;
        }
        if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
            return globalThis.fetch;
        }
    } catch (_) {
        /* ignore */
    }
    return null;
};

const requestRemoteText = async (url) => {
    let lastError = null;
    const gmRequest = resolveGMRequest();
    if (gmRequest) {
        try {
            const responseText = await new Promise((resolve, reject) => {
                gmRequest({
                    method: 'GET',
                    url,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText || '');
                            return;
                        }
                        reject(new Error(`HTTP ${response.status}: ${response.responseText || '[empty response]'}`));
                    },
                    onerror: (error) => {
                        reject(new Error(error?.error || error?.message || 'GM request failed.'));
                    },
                });
            });
            return responseText;
        } catch (error) {
            lastError = error;
        }
    }

    const fetchApi = resolveFetch();
    if (fetchApi) {
        try {
            const response = await fetchApi(url, {
                method: 'GET',
                cache: 'no-store',
                mode: 'cors',
                credentials: 'omit',
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            return await response.text();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error(t('m_8db845c5073b'));
};

const fetchOfficialUserStyleText = async () => {
    const text = await requestRemoteText(OFFICIAL_STYLE_SOURCE_URL);
    return { text, url: OFFICIAL_STYLE_SOURCE_URL };
};

function showStyleSettingsDialog() {
    if (currentStyleOverlay) {
        closeExistingOverlay(currentStyleOverlay);
    }
    if (currentSiteRulesOverlay) {
        closeExistingOverlay(currentSiteRulesOverlay);
        currentSiteRulesOverlay = null;
    }
    currentSiteRulesState = null;

    const { overlay, dialog } = createUnifiedDialog({
        title: 'm_58389daa203e',
        width: '700px',
        onClose: () => {
            if (currentStyleOverlay === overlay) {
                currentStyleOverlay = null;
                if (currentSiteRulesOverlay) {
                    closeExistingOverlay(currentSiteRulesOverlay);
                    currentSiteRulesOverlay = null;
                }
                currentSiteRulesState = null;
            }
        },
        closeOnOverlayClick: true,
        closeOnEscape: true,
        beforeClose: () => {
            persistButtonConfig();
            return true;
        },
    });
    currentStyleOverlay = overlay;
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
        if (currentStyleOverlay !== overlay) {
            return;
        }
        if (currentSiteRulesOverlay) {
            closeExistingOverlay(currentSiteRulesOverlay);
            currentSiteRulesOverlay = null;
        }
        currentSiteRulesState = null;
        showStyleSettingsDialog();
    });

    const currentSiteKey = createSiteGroupKey(window.location.hostname || '');
    const dialogTitle = dialog.querySelector('h2');
    if (dialogTitle) {
        dialogTitle.style.marginBottom = '0';
        dialogTitle.style.display = 'flex';
        dialogTitle.style.alignItems = 'center';
        dialogTitle.style.lineHeight = '1.2';
        dialogTitle.style.flexShrink = '0';
    }

    const closeMainDialog = () => {
        void overlay.__cttfRequestClose('button');
    };

    const createActionButton = (label, backgroundColor = 'var(--info-color, #4F46E5)') => {
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = backgroundColor;
        button.style.color = '#ffffff';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = '500';
        button.style.lineHeight = '1.2';
        button.style.whiteSpace = 'nowrap';
        button.style.flex = '0 0 auto';
        button.style.boxSizing = 'border-box';
        button.style.transition = 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease';
        button.textContent = label;
        return button;
    };

    const createAddButton = (label = t('m_d1dd773736d1'), options = {}) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.minWidth = options.minWidth || 'auto';
        button.style.height = options.height || '32px';
        button.style.padding = options.padding || '0 12px';
        button.style.border = 'none';
        button.style.borderRadius = options.borderRadius || '4px';
        button.style.backgroundColor = options.background || 'var(--add-color, #fd7e14)';
        button.style.color = options.color || '#fff';
        button.style.cursor = 'pointer';
        button.style.fontSize = options.fontSize || '14px';
        button.style.fontWeight = '500';
        button.style.lineHeight = '1';
        button.style.whiteSpace = 'nowrap';
        button.style.flex = '0 0 auto';
        button.style.boxSizing = 'border-box';
        return button;
    };

    const createListControlButton = (label, options = {}) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.minWidth = options.minWidth || '36px';
        button.style.height = options.height || '32px';
        button.style.padding = options.padding || '0 10px';
        button.style.borderRadius = options.borderRadius || '4px';
        button.style.border = options.border || '1px solid rgba(59,130,246,0.18)';
        button.style.backgroundColor = options.background || 'rgba(59,130,246,0.12)';
        button.style.color = options.color || 'var(--primary-color, #3B82F6)';
        button.style.cursor = 'pointer';
        button.style.fontSize = options.fontSize || '13px';
        button.style.fontWeight = '500';
        button.style.lineHeight = '1';
        button.style.whiteSpace = 'nowrap';
        button.style.flex = '0 0 auto';
        button.style.boxSizing = 'border-box';
        button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.12)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'none';
            button.style.boxShadow = 'none';
        });
        return button;
    };

    const createEmptyState = (message) => {
        const empty = document.createElement('div');
        empty.textContent = message;
        empty.style.padding = '18px';
        empty.style.border = '1px dashed var(--border-color, #d1d5db)';
        empty.style.borderRadius = '8px';
        empty.style.color = 'var(--muted-text-color, #6b7280)';
        empty.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        empty.style.fontSize = '13px';
        empty.style.textAlign = 'center';
        return empty;
    };

    const buildSiteGroups = () => {
        const officialRules = Array.isArray(buttonConfig.officialStyleBundle?.rules)
            ? buttonConfig.officialStyleBundle.rules
            : [];
        const customRules = Array.isArray(buttonConfig.customStyleRules)
            ? buttonConfig.customStyleRules
            : [];
        const groups = new Map();

        const ensureGroup = (siteInfo) => {
            if (!groups.has(siteInfo.key)) {
                groups.set(siteInfo.key, {
                    key: siteInfo.key,
                    host: siteInfo.host,
                    label: siteInfo.label,
                    favicon: siteInfo.favicon,
                    official: [],
                    custom: [],
                });
            }
            const group = groups.get(siteInfo.key);
            if (!group.label && siteInfo.label) {
                group.label = siteInfo.label;
            }
            if (!group.host && siteInfo.host) {
                group.host = siteInfo.host;
            }
            if (!group.favicon && siteInfo.favicon) {
                group.favicon = siteInfo.favicon;
            }
            return group;
        };

        officialRules.forEach((rule) => {
            const siteInfo = resolveRuleSiteInfo(rule);
            ensureGroup(siteInfo).official.push({ rule });
        });

        customRules.forEach((rule, index) => {
            const siteInfo = resolveRuleSiteInfo(rule);
            ensureGroup(siteInfo).custom.push({ rule, index });
        });

        return Array.from(groups.values()).sort((left, right) => {
            if (left.key === currentSiteKey && right.key !== currentSiteKey) {
                return -1;
            }
            if (right.key === currentSiteKey && left.key !== currentSiteKey) {
                return 1;
            }
            return String(left.label || left.host || '').localeCompare(String(right.label || right.host || ''), undefined, {
                sensitivity: 'base',
            });
        });
    };

    const getSiteGroupByKey = (groupKey) => buildSiteGroups().find((group) => group.key === groupKey) || null;

    const topToolbar = document.createElement('div');
    topToolbar.style.display = 'flex';
    topToolbar.style.alignItems = 'center';
    topToolbar.style.justifyContent = 'space-between';
    topToolbar.style.gap = '12px';
    topToolbar.style.flexWrap = 'wrap';
    topToolbar.style.marginBottom = '12px';
    dialog.insertBefore(topToolbar, dialog.firstChild);

    const toolbarLeft = document.createElement('div');
    toolbarLeft.style.display = 'flex';
    toolbarLeft.style.alignItems = 'center';
    toolbarLeft.style.gap = '12px';
    toolbarLeft.style.flexWrap = 'wrap';
    toolbarLeft.style.flex = '1 1 auto';
    toolbarLeft.style.minWidth = '0';
    topToolbar.appendChild(toolbarLeft);

    const actionRow = document.createElement('div');
    actionRow.style.display = 'flex';
    actionRow.style.alignItems = 'center';
    actionRow.style.flexWrap = 'wrap';
    actionRow.style.gap = '10px';
    if (dialogTitle) {
        toolbarLeft.appendChild(dialogTitle);
    }
    toolbarLeft.appendChild(actionRow);

    const toolbarRight = document.createElement('div');
    toolbarRight.style.display = 'flex';
    toolbarRight.style.alignItems = 'center';
    toolbarRight.style.gap = '10px';
    toolbarRight.style.marginLeft = 'auto';
    topToolbar.appendChild(toolbarRight);

    const closeBtn = createDialogCloseIconButton(closeMainDialog);
    toolbarRight.appendChild(closeBtn);

    const pullOfficialBtn = createActionButton(t('style.action.pull_official_latest'), 'var(--add-color, #fd7e14)');
    actionRow.appendChild(pullOfficialBtn);

    const infoBar = document.createElement('div');
    infoBar.style.display = 'flex';
    infoBar.style.flexWrap = 'wrap';
    infoBar.style.gap = '8px';
    infoBar.style.marginBottom = '12px';
    dialog.appendChild(infoBar);

    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 500px;
    `;

    const listHeader = document.createElement('div');
    listHeader.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    [
        { label: t('m_1f24c1e5aafa'), flex: '0 0 34px', justify: 'center' },
        { label: t('m_f412fe65e355'), flex: '1 1 0%', justify: 'flex-start', paddingLeft: '8px' },
        { label: t('style.official.title'), flex: '0 0 96px', justify: 'center' },
        { label: t('style.custom.title'), flex: '0 0 96px', justify: 'center' },
    ].forEach(({ label, flex, justify, paddingLeft }) => {
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
        max-height: 440px;
    `;
    listBody.classList.add('hide-scrollbar');

    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);

    const renderInfoBar = () => {
        infoBar.replaceChildren(
            createBadge(`${t('style.info.official_version')}: ${buttonConfig.officialStyleBundle?.version || t('style.info.bundled_snapshot')}`, {
                background: 'rgba(59,130,246,0.12)',
            }),
            createBadge(`${t('style.info.last_fetched')}: ${formatTimestamp(buttonConfig.officialStyleBundle?.lastFetchedAt)}`, {
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--success-color, #22c55e)',
                border: '1px solid rgba(16,185,129,0.22)',
            }),
            createBadge(`${t('style.info.source')}: ${formatSourceLabel(buttonConfig.officialStyleBundle?.sourceUrl || OFFICIAL_STYLE_SOURCE_URL)}`, {
                background: 'rgba(148,163,184,0.14)',
                color: 'var(--text-color, #1f2937)',
                border: '1px solid rgba(148,163,184,0.18)',
            }),
        );
    };

    const refreshMainDialog = () => {
        renderInfoBar();
        renderSiteRows();
    };

    const refreshAllOpenDialogs = () => {
        refreshMainDialog();
        if (currentSiteRulesState?.key) {
            showSiteRulesDialog(currentSiteRulesState.key, currentSiteRulesState.activeTab || 'official');
        }
    };

    const openCreateCustomRuleDialog = (group = null) => {
        const fallbackHost = window.location.hostname || '';
        const draftGroup = group || getSiteGroupByKey(currentSiteKey) || {
            key: currentSiteKey || createSiteGroupKey(fallbackHost) || '',
            host: fallbackHost,
            label: formatSiteLabelFromHost(fallbackHost) || t('style.grouped.other_site'),
            favicon: fallbackHost ? generateDomainFavicon(fallbackHost) : '',
        };

        showEditDomainStyleDialog(undefined, {
            draft: createDraftRuleForSiteGroup(draftGroup),
            onSaved: (savedRule) => {
                const nextSiteKey = resolveRuleSiteInfo(savedRule).key || draftGroup.key || currentSiteKey;
                currentSiteRulesState = {
                    key: nextSiteKey,
                    activeTab: 'custom',
                };
                refreshAllOpenDialogs();
            },
        });
    };

    const applyImportedStyleState = (officialBundle, customRules) => {
        buttonConfig.officialStyleBundle = ensureStyleBundle(officialBundle, {
            fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
        });
        buttonConfig.customStyleRules = customRules
            .map((rule) => ensureStyleRule({
                ...rule,
                source: STYLE_RULE_SOURCE.CUSTOM,
            }, {
                fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
            }))
            .filter(Boolean);
        applyCurrentStyleConfig();
        refreshAllOpenDialogs();
    };

    const createRuleRow = (rule, options = {}) => {
        const {
            isOfficial = false,
            index = -1,
            afterChange = () => {},
            siteKey = '',
            siteLabel = '',
            trimSiteLabel = false,
            showLeadingIcon = true,
            showSourceBadge = true,
        } = options;

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'flex-start';
        row.style.gap = showLeadingIcon ? '14px' : '12px';
        row.style.padding = '14px';
        row.style.border = '1px solid rgba(148,163,184,0.18)';
        row.style.borderRadius = '12px';
        row.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        row.style.boxShadow = '0 8px 20px rgba(15,23,42,0.05)';
        row.style.opacity = rule.enabled === false ? '0.65' : '1';

        const fallbackName = isOfficial ? t('style.untitled.official') : t('style.untitled.custom');
        const rawRuleName = String(rule.name || '').trim();
        const displayRuleName = trimSiteLabel
            ? stripSiteLabelPrefixFromRuleName(rawRuleName, siteLabel)
            : rawRuleName;
        const resolvedRuleName = displayRuleName || rawRuleName || fallbackName;
        const matcherGroups = groupStyleMatchers(rule.matchers);
        let isExpanded = false;

        const main = document.createElement('div');
        main.style.display = 'flex';
        main.style.flexDirection = 'column';
        main.style.gap = '10px';
        main.style.flex = '1';
        main.style.minWidth = '0';

        const headerLine = document.createElement('div');
        headerLine.style.display = 'flex';
        headerLine.style.alignItems = 'flex-start';
        headerLine.style.justifyContent = 'space-between';
        headerLine.style.gap = '10px';
        headerLine.style.flexWrap = 'wrap';
        headerLine.style.cursor = 'pointer';
        headerLine.title = t('i18n.common.toggle_visibility');
        headerLine.tabIndex = 0;
        headerLine.setAttribute('role', 'button');

        const headerLeft = document.createElement('div');
        headerLeft.style.display = 'flex';
        headerLeft.style.alignItems = 'center';
        headerLeft.style.flexWrap = 'wrap';
        headerLeft.style.gap = '10px';
        headerLeft.style.flex = '1 1 auto';
        headerLeft.style.minWidth = '0';

        const toggleWrap = document.createElement('label');
        toggleWrap.style.display = 'inline-flex';
        toggleWrap.style.alignItems = 'center';
        toggleWrap.style.gap = '0';
        toggleWrap.style.fontSize = '12px';
        toggleWrap.style.fontWeight = '600';
        toggleWrap.style.color = 'var(--muted-text-color, #6b7280)';
        toggleWrap.style.whiteSpace = 'nowrap';
        toggleWrap.style.cursor = 'pointer';
        toggleWrap.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        const enabledCheckbox = document.createElement('input');
        enabledCheckbox.type = 'checkbox';
        enabledCheckbox.checked = rule.enabled !== false;
        enabledCheckbox.style.cursor = 'pointer';
        enabledCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
        const updateToggleTooltip = () => {
            const tooltipId = enabledCheckbox.checked ? 'style.toggle.disable_rule' : 'style.toggle.enable_rule';
            const tooltipText = t(tooltipId);
            toggleWrap.title = tooltipText;
            enabledCheckbox.title = tooltipText;
            enabledCheckbox.setAttribute('aria-label', tooltipText);
        };
        enabledCheckbox.addEventListener('change', () => {
            rule.enabled = enabledCheckbox.checked;
            row.style.opacity = enabledCheckbox.checked ? '1' : '0.65';
            updateToggleTooltip();
            applyCurrentStyleConfig();
        });
        updateToggleTooltip();
        toggleWrap.appendChild(enabledCheckbox);
        headerLeft.appendChild(toggleWrap);

        if (showLeadingIcon) {
            const faviconUrl = rule.favicon || generateDomainFavicon(getPrimaryHostFromMatchers(rule.matchers) || '');
            const icon = createFaviconElement(
                faviconUrl,
                resolvedRuleName,
                isOfficial ? '🎨' : '🧩',
                { withBackground: false, size: 28 },
            );
            headerLeft.appendChild(icon);
        }

        const titleWrap = document.createElement('div');
        titleWrap.style.display = 'flex';
        titleWrap.style.alignItems = 'center';
        titleWrap.style.flexWrap = 'wrap';
        titleWrap.style.gap = '8px';
        titleWrap.style.flex = '1 1 auto';
        titleWrap.style.minWidth = '0';

        const nameEl = document.createElement('strong');
        nameEl.textContent = resolvedRuleName;
        nameEl.style.fontSize = '14px';
        nameEl.style.color = 'var(--text-color, #1f2937)';
        titleWrap.appendChild(nameEl);
        if (showSourceBadge) {
            titleWrap.appendChild(createBadge(isOfficial ? t('style.official.title') : t('style.custom.title'), {
                background: isOfficial ? 'rgba(59,130,246,0.12)' : 'rgba(99,102,241,0.12)',
                color: isOfficial ? 'var(--primary-color, #3B82F6)' : 'var(--info-color, #4F46E5)',
                border: '1px solid rgba(99,102,241,0.18)',
            }));
        }
        headerLeft.appendChild(titleWrap);
        headerLine.appendChild(headerLeft);

        let actions = null;
        if (!isOfficial) {
            actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.alignItems = 'center';
            actions.style.gap = '6px';
            actions.style.flexShrink = '0';
            actions.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
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
            `;
            editBtn.addEventListener('click', () => {
                showEditDomainStyleDialog(index, {
                    onSaved: (savedRule) => {
                        const nextSiteKey = resolveRuleSiteInfo(savedRule).key || siteKey;
                        currentSiteRulesState = {
                            key: nextSiteKey,
                            activeTab: 'custom',
                        };
                        afterChange();
                    },
                });
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
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
            `;
            deleteBtn.addEventListener('click', () => {
                if (!confirm(t('style.custom.delete_confirm', { name: rule.name || t('style.untitled.custom') }))) {
                    return;
                }
                buttonConfig.customStyleRules.splice(index, 1);
                applyCurrentStyleConfig();
                afterChange();
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            headerLine.appendChild(actions);
        }

        const matcherSection = document.createElement('div');
        matcherSection.style.display = 'flex';
        matcherSection.style.flexDirection = 'column';
        matcherSection.style.gap = '6px';
        matcherSection.style.padding = '10px 12px';
        matcherSection.style.borderRadius = '10px';
        matcherSection.style.border = '1px solid rgba(59,130,246,0.14)';
        matcherSection.style.backgroundColor = 'rgba(59,130,246,0.06)';

        const matcherLabel = document.createElement('span');
        matcherLabel.textContent = shouldUseUrlSectionLabel(rule.matchers)
            ? t('m_efe0801dac67')
            : t('style.editor.matchers');
        matcherLabel.style.fontSize = '11px';
        matcherLabel.style.fontWeight = '600';
        matcherLabel.style.color = 'var(--muted-text-color, #6b7280)';
        matcherLabel.style.letterSpacing = '0.08em';
        matcherLabel.style.textTransform = 'uppercase';
        matcherSection.appendChild(matcherLabel);

        const matcherList = document.createElement('div');
        matcherList.style.display = 'flex';
        matcherList.style.flexDirection = 'column';
        matcherList.style.gap = '6px';
        matcherList.style.minWidth = '0';

        if (matcherGroups.length > 0) {
            matcherGroups.forEach((group) => {
                const matcherGroup = document.createElement('div');
                matcherGroup.style.display = 'flex';
                matcherGroup.style.flexDirection = 'column';
                matcherGroup.style.gap = '8px';
                matcherGroup.style.padding = '10px 12px';
                matcherGroup.style.borderRadius = '8px';
                matcherGroup.style.backgroundColor = 'rgba(59,130,246,0.08)';

                const matcherGroupHeader = document.createElement('div');
                matcherGroupHeader.style.display = 'flex';
                matcherGroupHeader.style.alignItems = 'center';
                matcherGroupHeader.style.gap = '8px';
                matcherGroupHeader.style.flexWrap = 'wrap';

                const matcherTypeBadge = document.createElement('span');
                matcherTypeBadge.textContent = getMatcherTypeLabel(group.type);
                matcherTypeBadge.style.display = 'inline-flex';
                matcherTypeBadge.style.alignItems = 'center';
                matcherTypeBadge.style.justifyContent = 'center';
                matcherTypeBadge.style.padding = '2px 8px';
                matcherTypeBadge.style.borderRadius = '999px';
                matcherTypeBadge.style.backgroundColor = 'rgba(59,130,246,0.14)';
                matcherTypeBadge.style.color = 'var(--primary-color, #3B82F6)';
                matcherTypeBadge.style.fontSize = '11px';
                matcherTypeBadge.style.fontWeight = '600';
                matcherTypeBadge.style.whiteSpace = 'nowrap';
                matcherGroupHeader.appendChild(matcherTypeBadge);

                matcherGroup.appendChild(matcherGroupHeader);

                const hasMultipleValues = group.values.length > 1;
                const matcherValueList = document.createElement(hasMultipleValues ? 'ul' : 'div');
                matcherValueList.style.display = 'block';
                matcherValueList.style.minWidth = '0';
                matcherValueList.style.margin = '0';
                matcherValueList.style.padding = hasMultipleValues ? '0 0 0 18px' : '0';
                if (hasMultipleValues) {
                    matcherValueList.style.listStylePosition = 'outside';
                }

                group.values.forEach((value, valueIndex) => {
                    const matcherValueRow = document.createElement(hasMultipleValues ? 'li' : 'div');
                    matcherValueRow.style.minWidth = '0';
                    if (valueIndex < group.values.length - 1) {
                        matcherValueRow.style.marginBottom = '6px';
                    }
                    if (hasMultipleValues) {
                        matcherValueRow.style.color = 'rgba(59,130,246,0.55)';
                    }

                    const matcherValue = document.createElement('span');
                    matcherValue.textContent = value;
                    matcherValue.style.display = 'block';
                    matcherValue.style.minWidth = '0';
                    matcherValue.style.fontSize = '12px';
                    matcherValue.style.color = 'var(--text-color, #1f2937)';
                    matcherValue.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
                    matcherValue.style.whiteSpace = 'pre-wrap';
                    matcherValue.style.overflowWrap = 'anywhere';
                    matcherValue.style.wordBreak = 'break-word';
                    matcherValue.style.lineHeight = '1.6';
                    matcherValueRow.appendChild(matcherValue);

                    matcherValueList.appendChild(matcherValueRow);
                });

                matcherGroup.appendChild(matcherValueList);
                matcherList.appendChild(matcherGroup);
            });
        } else {
            const matcherEmpty = document.createElement('div');
            matcherEmpty.textContent = t('style.matchers.empty');
            matcherEmpty.style.padding = '10px 12px';
            matcherEmpty.style.borderRadius = '8px';
            matcherEmpty.style.backgroundColor = 'rgba(59,130,246,0.08)';
            matcherEmpty.style.fontSize = '12px';
            matcherEmpty.style.color = 'var(--muted-text-color, #6b7280)';
            matcherList.appendChild(matcherEmpty);
        }
        matcherSection.appendChild(matcherList);

        const cssSection = document.createElement('div');
        cssSection.style.display = 'flex';
        cssSection.style.flexDirection = 'column';
        cssSection.style.gap = '6px';
        cssSection.style.padding = '10px 12px';
        cssSection.style.borderRadius = '10px';
        cssSection.style.border = '1px solid rgba(148,163,184,0.16)';
        cssSection.style.backgroundColor = 'rgba(15,23,42,0.03)';

        const cssLabel = document.createElement('span');
        cssLabel.textContent = 'CSS';
        cssLabel.style.fontSize = '11px';
        cssLabel.style.fontWeight = '600';
        cssLabel.style.color = 'var(--muted-text-color, #6b7280)';
        cssLabel.style.letterSpacing = '0.08em';
        cssLabel.style.textTransform = 'uppercase';
        cssSection.appendChild(cssLabel);

        const cssPreview = document.createElement('pre');
        cssPreview.textContent = rule.cssCode || t('m_8beaf4bf00c7');
        cssPreview.title = rule.cssCode || t('m_8beaf4bf00c7');
        cssPreview.style.display = 'block';
        cssPreview.style.margin = '0';
        cssPreview.style.padding = '10px 12px';
        cssPreview.style.borderRadius = '8px';
        cssPreview.style.border = '1px solid rgba(148,163,184,0.16)';
        cssPreview.style.backgroundColor = 'rgba(15,23,42,0.045)';
        cssPreview.style.fontSize = '12px';
        cssPreview.style.color = 'var(--text-color, #1f2937)';
        cssPreview.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
        cssPreview.style.whiteSpace = 'pre-wrap';
        cssPreview.style.overflowWrap = 'anywhere';
        cssPreview.style.wordBreak = 'break-word';
        cssPreview.style.lineHeight = '1.6';
        cssSection.appendChild(cssPreview);

        const badgeLine = document.createElement('div');
        badgeLine.style.display = 'flex';
        badgeLine.style.flexWrap = 'wrap';
        badgeLine.style.gap = '6px';
        badgeLine.appendChild(createBadge(
            `${t('m_564ba29dcede')}: ${typeof rule.layout?.height === 'number' ? `${rule.layout.height}px` : t('style.layout.inherit')}`,
            {
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--success-color, #22c55e)',
                border: '1px solid rgba(16,185,129,0.18)',
            },
        ));
        badgeLine.appendChild(createBadge(
            `${t('m_ccb47ee4e2ed')}: ${typeof rule.layout?.bottomSpacing === 'number' ? `${rule.layout.bottomSpacing}px` : t('style.layout.inherit')}`,
            {
                background: 'rgba(59,130,246,0.12)',
                color: 'var(--primary-color, #3B82F6)',
                border: '1px solid rgba(59,130,246,0.18)',
            },
        ));

        const detailsWrap = document.createElement('div');
        detailsWrap.style.display = 'flex';
        detailsWrap.style.flexDirection = 'column';
        detailsWrap.style.gap = '10px';
        detailsWrap.appendChild(matcherSection);
        detailsWrap.appendChild(cssSection);
        detailsWrap.appendChild(badgeLine);

        main.appendChild(headerLine);
        main.appendChild(detailsWrap);
        row.appendChild(main);

        const updateExpandedState = () => {
            detailsWrap.style.display = isExpanded ? 'flex' : 'none';
            if (actions) {
                actions.style.display = isExpanded ? 'flex' : 'none';
            }
            headerLine.setAttribute('aria-expanded', String(isExpanded));
        };

        const toggleExpandedState = () => {
            isExpanded = !isExpanded;
            updateExpandedState();
        };

        headerLine.addEventListener('click', () => {
            toggleExpandedState();
        });
        headerLine.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleExpandedState();
            }
        });

        updateExpandedState();
        return row;
    };

    const createRuleTypeSection = (title, description, items, options = {}) => {
        const {
            isOfficial = false,
            emptyMessage = '',
            maxBodyHeight = '420px',
            hideScrollbar = true,
            afterChange = () => {},
            siteKey = '',
            siteLabel = '',
            trimSiteLabel = false,
            footerActionButton = null,
            showHeader = true,
            showLeadingIcon = true,
            showSourceBadge = true,
        } = options;

        const section = document.createElement('section');
        section.style.display = 'flex';
        section.style.flexDirection = 'column';
        section.style.gap = '10px';
        section.style.minWidth = '0';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.gap = '10px';
        header.style.flexWrap = 'wrap';

        const headingWrap = document.createElement('div');
        headingWrap.style.display = 'flex';
        headingWrap.style.alignItems = 'center';
        headingWrap.style.gap = '8px';
        headingWrap.style.flexWrap = 'wrap';

        const titleEl = document.createElement('strong');
        titleEl.textContent = title;
        titleEl.style.fontSize = '16px';
        titleEl.style.color = 'var(--text-color, #1f2937)';
        headingWrap.appendChild(titleEl);
        headingWrap.appendChild(createBadge(String(items.length), {
            background: isOfficial ? 'rgba(59,130,246,0.12)' : 'rgba(99,102,241,0.12)',
            color: isOfficial ? 'var(--primary-color, #3B82F6)' : 'var(--info-color, #4F46E5)',
            border: '1px solid rgba(99,102,241,0.18)',
        }));
        header.appendChild(headingWrap);

        if (description) {
            const descEl = document.createElement('span');
            descEl.textContent = description;
            descEl.style.fontSize = '12px';
            descEl.style.color = 'var(--muted-text-color, #6b7280)';
            header.appendChild(descEl);
        }

        const rulesContainer = document.createElement('div');
        rulesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            min-width: 0;
        `;

        const rulesBody = document.createElement('div');
        rulesBody.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 0;
            overflow-y: auto;
            max-height: ${maxBodyHeight};
        `;
        if (hideScrollbar) {
            rulesBody.classList.add('hide-scrollbar');
        }

        if (!items.length) {
            const empty = document.createElement('div');
            empty.textContent = emptyMessage;
            empty.style.padding = '18px 16px';
            empty.style.borderRadius = '10px';
            empty.style.border = '1px dashed rgba(148,163,184,0.24)';
            empty.style.backgroundColor = 'rgba(148,163,184,0.08)';
            empty.style.color = 'var(--muted-text-color, #6b7280)';
            empty.style.fontSize = '13px';
            rulesBody.appendChild(empty);
        } else {
            items.forEach(({ rule, index }) => {
                rulesBody.appendChild(createRuleRow(rule, {
                    isOfficial,
                    index,
                    afterChange,
                    siteKey,
                    siteLabel,
                    trimSiteLabel,
                    showLeadingIcon,
                    showSourceBadge,
                }));
            });
        }

        rulesContainer.appendChild(rulesBody);
        if (showHeader) {
            section.appendChild(header);
        }
        section.appendChild(rulesContainer);

        if (footerActionButton) {
            const footer = document.createElement('div');
            footer.style.display = 'flex';
            footer.style.justifyContent = 'flex-start';
            footer.style.marginTop = '2px';
            footer.appendChild(footerActionButton);
            section.appendChild(footer);
        }

        return section;
    };

    const createSiteIdentityLayout = (group, options = {}) => {
        const {
            flex = '1 1 auto',
            hostMaxWidth = '360px',
        } = options;

        const root = document.createElement('div');
        root.style.display = 'flex';
        root.style.justifyContent = 'flex-start';
        root.style.alignItems = 'center';
        root.style.gap = '10px';
        root.style.minWidth = '0';
        root.style.flex = flex;

        const faviconBadge = createFaviconElement(
            group.favicon || generateDomainFavicon(group.host || ''),
            group.label || t('style.grouped.other_site'),
            '🌐',
            { withBackground: false, size: 26 },
        );
        faviconBadge.title = group.host || '';

        const iconColumn = document.createElement('div');
        iconColumn.style.display = 'flex';
        iconColumn.style.alignItems = 'center';
        iconColumn.style.justifyContent = 'center';
        iconColumn.style.flex = '0 0 34px';
        iconColumn.appendChild(faviconBadge);

        const infoColumn = document.createElement('div');
        infoColumn.style.display = 'flex';
        infoColumn.style.flexDirection = 'column';
        infoColumn.style.gap = '2px';
        infoColumn.style.minWidth = '0';
        infoColumn.style.flex = '1 1 0%';

        const nameLine = document.createElement('div');
        nameLine.style.display = 'flex';
        nameLine.style.alignItems = 'center';
        nameLine.style.gap = '4px';
        nameLine.style.flexWrap = 'wrap';

        const nameEl = document.createElement('span');
        nameEl.textContent = group.label || t('style.grouped.other_site');
        nameEl.style.fontWeight = '600';
        nameEl.style.fontSize = '14px';
        nameEl.style.lineHeight = '1.2';
        nameEl.style.color = 'var(--text-color, #1f2937)';
        nameLine.appendChild(nameEl);

        if (group.key === currentSiteKey) {
            nameLine.appendChild(createBadge(t('style.grouped.current_site'), {
                background: 'rgba(16,185,129,0.12)',
                color: 'var(--success-color, #22c55e)',
                border: '1px solid rgba(16,185,129,0.22)',
                padding: '2px 8px',
                fontSize: '11px',
            }));
        }

        const hostEl = document.createElement('span');
        hostEl.textContent = group.host || t('style.grouped.other_site');
        hostEl.style.fontSize = '12px';
        hostEl.style.lineHeight = '1.2';
        hostEl.style.color = 'var(--muted-text-color, #6b7280)';
        hostEl.style.whiteSpace = 'nowrap';
        hostEl.style.overflow = 'hidden';
        hostEl.style.textOverflow = 'ellipsis';
        hostEl.style.maxWidth = hostMaxWidth;
        hostEl.title = group.host || '';

        infoColumn.appendChild(nameLine);
        infoColumn.appendChild(hostEl);

        root.appendChild(iconColumn);
        root.appendChild(infoColumn);

        return root;
    };

    const createSiteMetaRow = (group) => {
        const metaRow = document.createElement('div');
        metaRow.style.display = 'flex';
        metaRow.style.alignItems = 'center';
        metaRow.style.justifyContent = 'flex-start';
        metaRow.style.minWidth = '0';
        metaRow.appendChild(createSiteIdentityLayout(group, {
            hostMaxWidth: '100%',
        }));
        return metaRow;
    };

    const showSiteRulesDialog = (groupKey, initialTab = 'official') => {
        const initialGroup = getSiteGroupByKey(groupKey);
        if (!initialGroup) {
            if (currentSiteRulesOverlay) {
                closeExistingOverlay(currentSiteRulesOverlay);
                currentSiteRulesOverlay = null;
            }
            currentSiteRulesState = null;
            refreshMainDialog();
            return;
        }

        if (currentSiteRulesOverlay) {
            closeExistingOverlay(currentSiteRulesOverlay);
        }

        const { overlay: siteOverlay, dialog: siteDialog } = createUnifiedDialog({
            title: 'style.grouped.detail_title',
            width: '654px',
            onClose: () => {
                if (currentSiteRulesOverlay === siteOverlay) {
                    currentSiteRulesOverlay = null;
                    currentSiteRulesState = null;
                }
            },
            closeOnOverlayClick: true,
            closeOnEscape: true,
            beforeClose: () => {
                persistButtonConfig();
                return true;
            },
        });
        currentSiteRulesOverlay = siteOverlay;
        const siteDialogTitle = siteDialog.querySelector('h2');
        if (siteDialogTitle) {
            siteDialogTitle.style.marginBottom = '0';
            siteDialogTitle.style.display = 'flex';
            siteDialogTitle.style.alignItems = 'center';
            siteDialogTitle.style.lineHeight = '1.2';
            siteDialogTitle.style.flexShrink = '0';
        }

        let currentTab = initialTab === 'custom' ? 'custom' : 'official';
        currentSiteRulesState = {
            key: groupKey,
            activeTab: currentTab,
        };

        siteOverlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
            if (currentSiteRulesOverlay !== siteOverlay) {
                return;
            }
            showSiteRulesDialog(groupKey, currentTab);
        });

        const topBar = document.createElement('div');
        topBar.style.display = 'flex';
        topBar.style.alignItems = 'center';
        topBar.style.justifyContent = 'space-between';
        topBar.style.gap = '12px';
        topBar.style.flexWrap = 'wrap';
        topBar.style.marginBottom = '12px';
        siteDialog.insertBefore(topBar, siteDialog.firstChild);

        const topBarLeft = document.createElement('div');
        topBarLeft.style.display = 'flex';
        topBarLeft.style.alignItems = 'center';
        topBarLeft.style.flex = '1 1 auto';
        topBarLeft.style.minWidth = '0';
        if (siteDialogTitle) {
            topBarLeft.appendChild(siteDialogTitle);
        }
        topBar.appendChild(topBarLeft);

        const topBarRight = document.createElement('div');
        topBarRight.style.display = 'flex';
        topBarRight.style.alignItems = 'center';
        topBarRight.style.justifyContent = 'flex-end';
        topBarRight.style.flex = '0 0 auto';
        topBar.appendChild(topBarRight);

        const officialTabBtn = createListControlButton('', {
            minWidth: '96px',
            padding: '0 14px',
        });
        const customTabBtn = createListControlButton('', {
            minWidth: '96px',
            padding: '0 14px',
            background: 'rgba(99,102,241,0.12)',
            color: 'var(--info-color, #4F46E5)',
            border: '1px solid rgba(99,102,241,0.18)',
        });
        const addCustomBtn = createAddButton(undefined, {
            minWidth: '96px',
            height: '32px',
            padding: '0 14px',
        });
        addCustomBtn.addEventListener('click', () => {
            const latestGroup = getSiteGroupByKey(groupKey);
            if (latestGroup) {
                openCreateCustomRuleDialog(latestGroup);
            }
        });

        const closeSiteBtn = createDialogCloseIconButton((event) => {
            void siteOverlay.__cttfRequestClose('button', event);
        });
        topBarRight.appendChild(closeSiteBtn);

        const summaryRow = document.createElement('div');
        summaryRow.style.display = 'flex';
        summaryRow.style.alignItems = 'center';
        summaryRow.style.justifyContent = 'space-between';
        summaryRow.style.gap = '12px';
        summaryRow.style.flexWrap = 'wrap';
        summaryRow.style.paddingBottom = '12px';
        summaryRow.style.marginBottom = '14px';
        summaryRow.style.borderBottom = '1px solid var(--border-color, #e5e7eb)';
        siteDialog.appendChild(summaryRow);

        const summaryHost = document.createElement('div');
        summaryHost.style.flex = '1 1 220px';
        summaryHost.style.minWidth = '0';
        summaryRow.appendChild(summaryHost);

        const summaryActions = document.createElement('div');
        summaryActions.style.display = 'flex';
        summaryActions.style.alignItems = 'center';
        summaryActions.style.justifyContent = 'flex-end';
        summaryActions.style.gap = '10px';
        summaryActions.style.flex = '0 0 auto';
        summaryActions.style.flexWrap = 'wrap';
        summaryActions.style.marginLeft = 'auto';
        summaryRow.appendChild(summaryActions);

        const tabRow = document.createElement('div');
        tabRow.style.display = 'flex';
        tabRow.style.alignItems = 'center';
        tabRow.style.justifyContent = 'flex-end';
        tabRow.style.gap = '8px';
        tabRow.style.flexWrap = 'nowrap';
        summaryActions.appendChild(tabRow);
        tabRow.appendChild(officialTabBtn);
        tabRow.appendChild(customTabBtn);

        const sitePrimaryActionHost = document.createElement('div');
        sitePrimaryActionHost.style.display = 'flex';
        sitePrimaryActionHost.style.alignItems = 'center';
        sitePrimaryActionHost.style.justifyContent = 'flex-end';
        sitePrimaryActionHost.style.flex = '0 0 auto';
        sitePrimaryActionHost.style.visibility = 'hidden';
        sitePrimaryActionHost.style.pointerEvents = 'none';
        sitePrimaryActionHost.appendChild(addCustomBtn);
        summaryActions.appendChild(sitePrimaryActionHost);

        const contentHost = document.createElement('div');
        siteDialog.appendChild(contentHost);

        const refreshSiteDialog = () => {
            const latestGroup = getSiteGroupByKey(groupKey);
            if (!latestGroup) {
                closeExistingOverlay(siteOverlay);
                currentSiteRulesOverlay = null;
                currentSiteRulesState = null;
                refreshMainDialog();
                return;
            }

            officialTabBtn.textContent = t('style.official.short_title');
            customTabBtn.textContent = t('style.custom.short_title');
            officialTabBtn.title = `${t('style.official.title')} ${latestGroup.official.length}`;
            customTabBtn.title = `${t('style.custom.title')} ${latestGroup.custom.length}`;

            const applyTabState = (button, isActive, activeStyles, inactiveStyles) => {
                button.style.backgroundColor = isActive ? activeStyles.background : inactiveStyles.background;
                button.style.color = isActive ? activeStyles.color : inactiveStyles.color;
                button.style.border = isActive ? activeStyles.border : inactiveStyles.border;
            };

            applyTabState(
                officialTabBtn,
                currentTab === 'official',
                {
                    background: 'rgba(59,130,246,0.18)',
                    color: 'var(--primary-color, #3B82F6)',
                    border: '1px solid rgba(59,130,246,0.28)',
                },
                {
                    background: 'rgba(59,130,246,0.08)',
                    color: 'var(--primary-color, #3B82F6)',
                    border: '1px solid rgba(59,130,246,0.16)',
                },
            );
            applyTabState(
                customTabBtn,
                currentTab === 'custom',
                {
                    background: 'rgba(99,102,241,0.18)',
                    color: 'var(--info-color, #4F46E5)',
                    border: '1px solid rgba(99,102,241,0.28)',
                },
                {
                    background: 'rgba(99,102,241,0.08)',
                    color: 'var(--info-color, #4F46E5)',
                    border: '1px solid rgba(99,102,241,0.16)',
                },
            );

            currentSiteRulesState = {
                key: latestGroup.key,
                activeTab: currentTab,
            };
            summaryHost.replaceChildren(createSiteMetaRow(latestGroup));
            if (currentTab === 'custom') {
                sitePrimaryActionHost.style.visibility = 'visible';
                sitePrimaryActionHost.style.pointerEvents = 'auto';
            } else {
                sitePrimaryActionHost.style.visibility = 'hidden';
                sitePrimaryActionHost.style.pointerEvents = 'none';
            }
            contentHost.replaceChildren(
                createRuleTypeSection(
                    currentTab === 'official' ? t('style.official.title') : t('style.custom.title'),
                    currentTab === 'official' ? t('style.official.description') : t('style.custom.description'),
                    currentTab === 'official' ? latestGroup.official : latestGroup.custom,
                    {
                        isOfficial: currentTab === 'official',
                        emptyMessage: currentTab === 'official'
                            ? t('style.grouped.no_official')
                            : t('style.grouped.no_custom'),
                        maxBodyHeight: '460px',
                        hideScrollbar: false,
                        siteKey: latestGroup.key,
                        siteLabel: latestGroup.label,
                        trimSiteLabel: true,
                        afterChange: refreshAllOpenDialogs,
                        showHeader: false,
                        showLeadingIcon: false,
                        showSourceBadge: false,
                    },
                ),
            );
        };

        officialTabBtn.addEventListener('click', () => {
            currentTab = 'official';
            refreshSiteDialog();
        });
        customTabBtn.addEventListener('click', () => {
            currentTab = 'custom';
            refreshSiteDialog();
        });

        refreshSiteDialog();
    };

    const renderSiteRows = () => {
        listBody.replaceChildren();
        const siteGroups = buildSiteGroups();

        if (!siteGroups.length) {
            listBody.appendChild(createEmptyState(t('style.grouped.empty')));
            return;
        }

        siteGroups.forEach((group) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 8px;
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

            const officialColumn = document.createElement('div');
            officialColumn.style.display = 'flex';
            officialColumn.style.alignItems = 'center';
            officialColumn.style.justifyContent = 'center';
            officialColumn.style.flex = '0 0 96px';
            const officialBtn = createListControlButton(String(group.official.length), {
                background: 'rgba(59,130,246,0.12)',
                color: 'var(--primary-color, #3B82F6)',
                border: '1px solid rgba(59,130,246,0.18)',
                minWidth: '32px',
                height: '28px',
                padding: '0 8px',
                fontSize: '12px',
            });
            officialBtn.title = `${t('style.official.title')} ${group.official.length}`;
            officialBtn.addEventListener('click', () => {
                currentSiteRulesState = {
                    key: group.key,
                    activeTab: 'official',
                };
                showSiteRulesDialog(group.key, 'official');
            });
            officialColumn.appendChild(officialBtn);

            const customColumn = document.createElement('div');
            customColumn.style.display = 'flex';
            customColumn.style.alignItems = 'center';
            customColumn.style.justifyContent = 'center';
            customColumn.style.flex = '0 0 96px';
            const customBtn = createListControlButton(String(group.custom.length), {
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--info-color, #4F46E5)',
                border: '1px solid rgba(99,102,241,0.18)',
                minWidth: '32px',
                height: '28px',
                padding: '0 8px',
                fontSize: '12px',
            });
            customBtn.title = `${t('style.custom.title')} ${group.custom.length}`;
            customBtn.addEventListener('click', () => {
                currentSiteRulesState = {
                    key: group.key,
                    activeTab: 'custom',
                };
                showSiteRulesDialog(group.key, 'custom');
            });
            customColumn.appendChild(customBtn);

            item.appendChild(createSiteIdentityLayout(group, {
                flex: '1 1 0%',
            }));
            item.appendChild(officialColumn);
            item.appendChild(customColumn);
            listBody.appendChild(item);
        });
    };

    const footerRow = document.createElement('div');
    footerRow.style.display = 'flex';
    footerRow.style.alignItems = 'center';
    footerRow.style.justifyContent = 'flex-start';
    footerRow.style.gap = '12px';
    footerRow.style.flexWrap = 'wrap';
    footerRow.style.marginTop = '12px';

    const footerLeft = document.createElement('div');
    footerLeft.style.display = 'flex';
    footerLeft.style.alignItems = 'center';
    footerLeft.style.gap = '10px';
    footerLeft.style.flex = '1 1 auto';
    footerLeft.style.minWidth = '0';

    const footerRight = document.createElement('div');
    footerRight.style.display = 'flex';
    footerRight.style.alignItems = 'center';
    footerRight.style.justifyContent = 'flex-end';
    footerRight.style.gap = '10px';
    footerRight.style.flex = '0 0 auto';
    footerRight.style.marginLeft = 'auto';

    const importBtn = createActionButton(t('style.action.import_user_css'));
    importBtn.title = t('style.action.import_user_css_tooltip');

    const exportBtn = createActionButton(t('style.action.export_user_css'), 'var(--success-color, #22c55e)');
    exportBtn.title = t('style.action.export_user_css_tooltip');

    const addBtn = createAddButton();
    addBtn.addEventListener('click', () => {
        openCreateCustomRuleDialog();
    });

    footerLeft.appendChild(addBtn);
    footerRight.appendChild(importBtn);
    footerRight.appendChild(exportBtn);
    footerRow.appendChild(footerLeft);
    footerRow.appendChild(footerRight);
    dialog.appendChild(footerRow);

    exportBtn.addEventListener('click', () => {
        try {
            const content = serializeStylePackageToUserCss({
                officialStyleBundle: buttonConfig.officialStyleBundle,
                customStyleRules: buttonConfig.customStyleRules,
            });
            downloadTextFile(buildExportFileName(), content, 'text/css;charset=utf-8');
            console.log(t('style.export.success'));
        } catch (error) {
            alert(t('style.export.failed', { message: getErrorMessage(error) }));
        }
    });

    importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.css,.user.css,text/css';
        input.addEventListener('change', (event) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = parseUserStyleFile(reader.result || '', {
                        defaultSource: STYLE_RULE_SOURCE.CUSTOM,
                    });
                    const grouped = splitRulesBySource(parsed.rules);
                    const nextOfficialBundle = ensureStyleBundle({
                        version: parsed.metadata.officialVersion || '',
                        sourceUrl: parsed.metadata.officialSourceUrl || '',
                        lastFetchedAt: parsed.metadata.officialLastFetchedAt || 0,
                        rules: grouped.official.map((rule) => ({
                            ...rule,
                            source: STYLE_RULE_SOURCE.OFFICIAL,
                        })),
                    }, {
                        fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
                    });
                    const nextCustomRules = grouped.custom
                        .map((rule) => ensureStyleRule({
                            ...rule,
                            source: STYLE_RULE_SOURCE.CUSTOM,
                        }, {
                            fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
                        }))
                        .filter(Boolean);

                    const confirmed = confirm(t('style.import.summary', {
                        officialCount: nextOfficialBundle.rules.length,
                        customCount: nextCustomRules.length,
                        version: nextOfficialBundle.version || t('style.info.bundled_snapshot'),
                    }));
                    if (!confirmed) {
                        return;
                    }

                    applyImportedStyleState(nextOfficialBundle, nextCustomRules);
                    console.log(t('style.import.success'));
                } catch (error) {
                    alert(t('style.import.failed', {
                        message: getErrorMessage(error),
                    }));
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });

    pullOfficialBtn.addEventListener('click', async () => {
        pullOfficialBtn.disabled = true;
        try {
            const { text, url } = await fetchOfficialUserStyleText();
            const enabledStateById = new Map(
                (buttonConfig.officialStyleBundle?.rules || []).map((rule) => [rule.id, rule.enabled !== false]),
            );
            const nextOfficialBundle = buildOfficialStyleBundleFromUserCss(text, {
                sourceUrl: url,
                lastFetchedAt: Date.now(),
            });
            nextOfficialBundle.rules = nextOfficialBundle.rules.map((rule) => ({
                ...rule,
                enabled: enabledStateById.has(rule.id) ? enabledStateById.get(rule.id) : (rule.enabled !== false),
            }));
            buttonConfig.officialStyleBundle = nextOfficialBundle;
            applyCurrentStyleConfig();
            refreshAllOpenDialogs();
            console.log(t('style.fetch.success', {
                version: nextOfficialBundle.version || t('style.info.bundled_snapshot'),
            }));
        } catch (error) {
            alert(t('style.fetch.failed', {
                message: getErrorMessage(error),
            }));
        } finally {
            pullOfficialBtn.disabled = false;
        }
    });

    refreshMainDialog();
}

export {
    showStyleSettingsDialog,
};
