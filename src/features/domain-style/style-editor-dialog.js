import {
    autoResizeTextarea,
    buttonConfig,
    createAutoFaviconIcon,
    createFaviconElement,
    createUnifiedDialog,
    generateDomainFavicon,
    persistButtonConfig,
    registerLocaleRefresh,
    t,
} from '../../core/runtime-services.js';
import { closeExistingOverlay } from '../toolbar/index.js';
import { applyDomainStyles } from './runtime.js';
import {
    clampBottomSpacing,
    clampStyleHeight,
    ensureStyleRule,
    getPrimaryHostFromMatchers,
    normalizeStyleMatcher,
    STYLE_MATCHER_TYPE,
    STYLE_RULE_SOURCE,
    summarizeMatchers,
} from './style-format.js';
import { cloneSerializable } from '../../shared/common.js';

let currentAddDomainOverlay = null;

const cloneDraftRule = (rule) => {
    return cloneSerializable(rule || {}, {
        fallback: { ...(rule || {}) },
        logLabel: '[Chat] Template Text Folders style draft clone failed:',
    });
};

const createDefaultDraftRule = () => ({
    name: document.title || t('style.untitled.custom'),
    source: STYLE_RULE_SOURCE.CUSTOM,
    enabled: true,
    matchers: [
        {
            type: STYLE_MATCHER_TYPE.DOMAIN,
            value: window.location.hostname || '',
        },
    ],
    layout: {},
    cssCode: '',
    favicon: generateDomainFavicon(window.location.hostname || ''),
});

const getMatcherPlaceholder = (type) => {
    if (type === STYLE_MATCHER_TYPE.URL_PREFIX) {
        return 'https://example.com/path';
    }
    if (type === STYLE_MATCHER_TYPE.URL) {
        return 'https://example.com/exact/path';
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
        return 'https://www\\.example\\.com/(chat|ai).*';
    }
    return 'example.com';
};

const createDraftName = (name, matchers) => {
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    if (normalizedName) {
        return normalizedName;
    }
    return summarizeMatchers(matchers, {
        maxItems: 1,
        emptyLabel: t('style.untitled.custom'),
    });
};

function showEditDomainStyleDialog(index, options = {}) {
    const {
        activeTab: initialActiveTab = 'basic',
        draft = null,
        onSaved,
    } = options;

    if (currentAddDomainOverlay) {
        closeExistingOverlay(currentAddDomainOverlay);
    }

    const isEdit = typeof index === 'number';
    const styleItem = draft
        ? cloneDraftRule(draft)
        : isEdit
            ? cloneDraftRule(buttonConfig.customStyleRules[index])
            : createDefaultDraftRule();

    if (!Array.isArray(styleItem.matchers) || !styleItem.matchers.length) {
        styleItem.matchers = createDefaultDraftRule().matchers;
    }
    if (!styleItem.layout || typeof styleItem.layout !== 'object') {
        styleItem.layout = {};
    }
    if (!styleItem.favicon) {
        styleItem.favicon = generateDomainFavicon(getPrimaryHostFromMatchers(styleItem.matchers) || window.location.hostname || '');
    }

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? 'm_16e818a7d72f' : 'm_76b7232d9d1f',
        width: '560px',
        onClose: () => {
            if (currentAddDomainOverlay === overlay) {
                currentAddDomainOverlay = null;
            }
        },
        closeOnOverlayClick: false,
    });
    currentAddDomainOverlay = overlay;

    const closeDialog = () => {
        closeExistingOverlay(overlay);
        currentAddDomainOverlay = null;
    };

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
        { id: 'basic', label: t('m_41654e026827') },
        { id: 'layout', label: t('m_ee3f7b61d3f1') },
        { id: 'css', label: t('m_e2574efd99b1') },
    ];

    const tabButtons = [];
    const tabPanels = new Map();
    const tabsBody = document.createElement('div');
    tabsBody.style.position = 'relative';

    const setActiveTab = (targetId) => {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tabId === targetId;
            button.style.backgroundColor = isActive ? 'var(--dialog-bg, #ffffff)' : 'transparent';
            button.style.color = isActive ? 'var(--text-color, #1f2937)' : 'var(--muted-text-color, #6b7280)';
            button.style.fontWeight = isActive ? '600' : '500';
            button.style.boxShadow = isActive ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none';
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        tabPanels.forEach((panel, panelId) => {
            panel.style.display = panelId === targetId ? 'flex' : 'none';
        });
    };

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

    setActiveTab(initialActiveTab);
    container.appendChild(tabsHeader);
    container.appendChild(tabsBody);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = t('m_3ac80afa5a53');
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
    tabPanels.get('basic')?.appendChild(nameLabel);

    const matcherSection = document.createElement('div');
    matcherSection.style.display = 'flex';
    matcherSection.style.flexDirection = 'column';
    matcherSection.style.gap = '8px';

    const matcherTitle = document.createElement('label');
    matcherTitle.textContent = t('style.editor.matchers');
    matcherTitle.style.fontSize = '13px';
    matcherTitle.style.fontWeight = '600';
    matcherTitle.style.color = 'var(--text-color, #1f2937)';
    matcherSection.appendChild(matcherTitle);

    const matcherRows = document.createElement('div');
    matcherRows.style.display = 'flex';
    matcherRows.style.flexDirection = 'column';
    matcherRows.style.gap = '8px';
    matcherSection.appendChild(matcherRows);

    const matcherRowRecords = [];

    const readCurrentMatchers = (options = {}) => matcherRowRecords
        .map((record) => ({
            type: record.typeSelect.value,
            value: record.valueInput.value.trim(),
        }))
        .map((matcher) => {
            try {
                return normalizeStyleMatcher(matcher);
            } catch (error) {
                if (options.throwOnError) {
                    throw error;
                }
                return null;
            }
        })
        .filter(Boolean);

    const getFallbackFaviconUrl = () => {
        const primaryHost = getPrimaryHostFromMatchers(readCurrentMatchers()) || window.location.hostname || '';
        return primaryHost ? generateDomainFavicon(primaryHost) : '';
    };

    const faviconLabel = document.createElement('label');
    faviconLabel.textContent = t('m_21a69e0d4f18');
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
    faviconInput.placeholder = t('m_5ad8a58367cf');
    faviconInput.value = styleItem.favicon || '';
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
    faviconHelp.textContent = t('m_da47691c6642');
    faviconHelp.style.flex = '1';
    faviconHelp.style.minWidth = '0';
    faviconHelp.style.marginRight = '12px';

    const autoFaviconBtn = document.createElement('button');
    autoFaviconBtn.type = 'button';
    autoFaviconBtn.setAttribute('aria-label', t('m_bb1fa21a1bc7'));
    autoFaviconBtn.title = t('m_bb1fa21a1bc7');
    autoFaviconBtn.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    autoFaviconBtn.style.color = '#fff';
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
    autoFaviconBtn.appendChild(createAutoFaviconIcon());

    faviconActionsRow.appendChild(faviconHelp);
    faviconActionsRow.appendChild(autoFaviconBtn);

    faviconControls.appendChild(faviconInput);
    faviconControls.appendChild(faviconActionsRow);
    faviconFieldWrapper.appendChild(faviconPreviewHolder);
    faviconFieldWrapper.appendChild(faviconControls);
    faviconLabel.appendChild(faviconFieldWrapper);
    tabPanels.get('basic')?.appendChild(matcherSection);
    tabPanels.get('basic')?.appendChild(faviconLabel);

    let faviconManuallyEdited = Boolean((styleItem.favicon || '').trim());
    const updateStyleFaviconPreview = () => {
        const previewUrl = faviconInput.value.trim() || getFallbackFaviconUrl();
        faviconPreviewHolder.replaceChildren(
            createFaviconElement(
                previewUrl,
                nameInput.value.trim() || t('style.untitled.custom'),
                '🎨',
                { withBackground: false },
            ),
        );
    };

    const maybeRefreshAutoFavicon = () => {
        if (!faviconManuallyEdited) {
            faviconInput.value = getFallbackFaviconUrl();
            resizeFaviconTextarea();
        }
        updateStyleFaviconPreview();
    };

    const addMatcherRow = (initialMatcher = { type: STYLE_MATCHER_TYPE.DOMAIN, value: '' }) => {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '140px minmax(0, 1fr) auto';
        row.style.gap = '8px';
        row.style.alignItems = 'center';

        const typeSelect = document.createElement('select');
        typeSelect.style.height = '40px';
        typeSelect.style.padding = '0 10px';
        typeSelect.style.border = '1px solid var(--border-color, #d1d5db)';
        typeSelect.style.borderRadius = '6px';
        typeSelect.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        typeSelect.style.color = 'var(--text-color, #1f2937)';
        typeSelect.style.fontSize = '14px';
        [
            { value: STYLE_MATCHER_TYPE.DOMAIN, label: t('style.editor.type.domain') },
            { value: STYLE_MATCHER_TYPE.URL_PREFIX, label: t('style.editor.type.url_prefix') },
            { value: STYLE_MATCHER_TYPE.URL, label: t('style.editor.type.url') },
            { value: STYLE_MATCHER_TYPE.REGEXP, label: t('style.editor.type.regexp') },
        ].forEach((optionConfig) => {
            const option = document.createElement('option');
            option.value = optionConfig.value;
            option.textContent = optionConfig.label;
            if (optionConfig.value === initialMatcher.type) {
                option.selected = true;
            }
            typeSelect.appendChild(option);
        });

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.value = initialMatcher.value || '';
        valueInput.placeholder = getMatcherPlaceholder(initialMatcher.type || STYLE_MATCHER_TYPE.DOMAIN);
        valueInput.style.height = '40px';
        valueInput.style.padding = '0 12px';
        valueInput.style.border = '1px solid var(--border-color, #d1d5db)';
        valueInput.style.borderRadius = '6px';
        valueInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        valueInput.style.color = 'var(--text-color, #1f2937)';
        valueInput.style.fontSize = '14px';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = '✕';
        removeBtn.title = t('style.editor.remove_matcher');
        removeBtn.style.width = '36px';
        removeBtn.style.height = '36px';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
        removeBtn.style.color = 'var(--danger-color, #ef4444)';

        const record = { row, typeSelect, valueInput, removeBtn };
        matcherRowRecords.push(record);

        typeSelect.addEventListener('change', () => {
            valueInput.placeholder = getMatcherPlaceholder(typeSelect.value);
            maybeRefreshAutoFavicon();
        });
        valueInput.addEventListener('input', maybeRefreshAutoFavicon);
        removeBtn.addEventListener('click', () => {
            const recordIndex = matcherRowRecords.indexOf(record);
            if (recordIndex >= 0) {
                matcherRowRecords.splice(recordIndex, 1);
            }
            row.remove();
            maybeRefreshAutoFavicon();
        });

        row.appendChild(typeSelect);
        row.appendChild(valueInput);
        row.appendChild(removeBtn);
        matcherRows.appendChild(row);
    };

    styleItem.matchers.forEach((matcher) => {
        addMatcherRow(matcher);
    });

    const addMatcherBtn = document.createElement('button');
    addMatcherBtn.type = 'button';
    addMatcherBtn.textContent = t('style.editor.add_matcher');
    addMatcherBtn.style.alignSelf = 'flex-start';
    addMatcherBtn.style.border = 'none';
    addMatcherBtn.style.borderRadius = '6px';
    addMatcherBtn.style.padding = '8px 12px';
    addMatcherBtn.style.cursor = 'pointer';
    addMatcherBtn.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    addMatcherBtn.style.color = 'var(--primary-color, #3B82F6)';
    addMatcherBtn.addEventListener('click', () => {
        addMatcherRow({
            type: STYLE_MATCHER_TYPE.DOMAIN,
            value: '',
        });
    });
    matcherSection.appendChild(addMatcherBtn);

    autoFaviconBtn.addEventListener('click', () => {
        faviconInput.value = getFallbackFaviconUrl();
        faviconManuallyEdited = false;
        resizeFaviconTextarea();
        updateStyleFaviconPreview();
    });

    faviconInput.addEventListener('input', () => {
        faviconManuallyEdited = true;
        resizeFaviconTextarea();
        updateStyleFaviconPreview();
    });
    nameInput.addEventListener('input', updateStyleFaviconPreview);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = t('style.editor.height_optional');
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
    heightInput.placeholder = t('style.layout.inherit');
    heightInput.value = styleItem.layout?.height ?? '';
    heightInput.style.width = '100%';
    heightInput.style.height = '40px';
    heightInput.style.padding = '0 12px';
    heightInput.style.border = '1px solid var(--border-color, #d1d5db)';
    heightInput.style.borderRadius = '6px';
    heightInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    heightInput.style.fontSize = '14px';
    heightLabel.appendChild(heightInput);
    tabPanels.get('layout')?.appendChild(heightLabel);

    const bottomSpacingLabel = document.createElement('label');
    bottomSpacingLabel.textContent = t('style.editor.bottom_spacing_optional');
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
    bottomSpacingInput.placeholder = t('style.layout.inherit');
    bottomSpacingInput.value = styleItem.layout?.bottomSpacing ?? '';
    bottomSpacingInput.style.width = '100%';
    bottomSpacingInput.style.height = '40px';
    bottomSpacingInput.style.padding = '0 12px';
    bottomSpacingInput.style.border = '1px solid var(--border-color, #d1d5db)';
    bottomSpacingInput.style.borderRadius = '6px';
    bottomSpacingInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    bottomSpacingInput.style.fontSize = '14px';
    bottomSpacingLabel.appendChild(bottomSpacingInput);
    tabPanels.get('layout')?.appendChild(bottomSpacingLabel);

    const cssLabel = document.createElement('label');
    cssLabel.textContent = t('m_532ce5bbfa6a');
    cssLabel.style.display = 'flex';
    cssLabel.style.flexDirection = 'column';
    cssLabel.style.gap = '6px';
    cssLabel.style.fontSize = '13px';
    cssLabel.style.fontWeight = '600';
    cssLabel.style.color = 'var(--text-color, #1f2937)';
    const cssTextarea = document.createElement('textarea');
    cssTextarea.value = styleItem.cssCode || '';
    cssTextarea.style.width = '100%';
    cssTextarea.style.minHeight = '160px';
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
    tabPanels.get('css')?.appendChild(cssLabel);

    dialog.appendChild(container);

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.alignItems = 'center';
    footer.style.gap = '12px';
    footer.style.marginTop = '20px';
    footer.style.paddingTop = '20px';
    footer.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = t('m_4d0b4688c787');
    cancelBtn.style.backgroundColor = 'var(--cancel-color, #6B7280)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', closeDialog);
    footer.appendChild(cancelBtn);

    const createCurrentDraft = () => ({
        id: styleItem.id,
        name: nameInput.value.trim(),
        source: STYLE_RULE_SOURCE.CUSTOM,
        enabled: styleItem.enabled !== false,
        matchers: matcherRowRecords.map((record) => ({
            type: record.typeSelect.value,
            value: record.valueInput.value.trim(),
        })),
        layout: {
            height: heightInput.value,
            bottomSpacing: bottomSpacingInput.value,
        },
        cssCode: cssTextarea.value,
        favicon: faviconInput.value.trim(),
    });

    const saveBtn = document.createElement('button');
    saveBtn.textContent = isEdit ? t('m_fadf24dbc5a9') : t('m_fcbd0932929e');
    saveBtn.style.backgroundColor = 'var(--success-color,#22c55e)';
    saveBtn.style.color = '#fff';
    saveBtn.style.border = 'none';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.padding = '8px 16px';
    saveBtn.style.fontSize = '14px';
    saveBtn.style.cursor = 'pointer';
    saveBtn.addEventListener('click', () => {
        try {
            const currentDraft = createCurrentDraft();
            const normalizedMatchers = readCurrentMatchers({ throwOnError: true });

            if (!normalizedMatchers.length) {
                alert(t('style.editor.no_matcher'));
                return;
            }

            const normalizedRule = ensureStyleRule({
                id: currentDraft.id,
                name: createDraftName(currentDraft.name, normalizedMatchers),
                source: STYLE_RULE_SOURCE.CUSTOM,
                enabled: currentDraft.enabled,
                matchers: normalizedMatchers,
                cssCode: currentDraft.cssCode,
                layout: {
                    height: clampStyleHeight(currentDraft.layout.height),
                    bottomSpacing: clampBottomSpacing(currentDraft.layout.bottomSpacing),
                },
                favicon: currentDraft.favicon || generateDomainFavicon(getPrimaryHostFromMatchers(normalizedMatchers) || ''),
            }, {
                fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
            });

            if (!normalizedRule) {
                alert(t('style.editor.no_matcher'));
                return;
            }

            if (isEdit) {
                buttonConfig.customStyleRules[index] = normalizedRule;
            } else {
                buttonConfig.customStyleRules.push(normalizedRule);
            }

            persistButtonConfig();
            try { applyDomainStyles(); } catch (_) {}
            closeDialog();
            if (typeof onSaved === 'function') {
                onSaved(normalizedRule);
            }
        } catch (error) {
            alert(error?.message || String(error));
        }
    });
    footer.appendChild(saveBtn);

    dialog.appendChild(footer);

    resizeFaviconTextarea();
    requestAnimationFrame(resizeFaviconTextarea);
    maybeRefreshAutoFavicon();

    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
        if (currentAddDomainOverlay !== overlay) {
            return;
        }
        const activeTabId = tabButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.tabId || 'basic';
        showEditDomainStyleDialog(isEdit ? index : undefined, {
            onSaved,
            activeTab: activeTabId,
            draft: createCurrentDraft(),
        });
    });
}

export {
    showEditDomainStyleDialog,
};
