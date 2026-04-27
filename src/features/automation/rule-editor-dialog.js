import {
    AUTO_SUBMIT_METHODS,
    autoResizeTextarea,
    createAutoFaviconIcon,
    createFaviconElement,
    createUnifiedDialog,
    generateDomainFavicon,
    normalizeAutoSubmitMethod,
    registerLocaleRefresh,
    setTrustedHTML,
    t,
} from '../../core/runtime-services.js';
import { closeExistingOverlay } from '../toolbar/index.js';

let currentRuleEditorOverlay = null;

function showAutomationRuleEditorDialog(ruleData = {}, onSave, options = {}) {
    const { methodExpanded = null } = options;
    if (currentRuleEditorOverlay) {
        closeExistingOverlay(currentRuleEditorOverlay);
    }

    const isEdit = !!ruleData && !!ruleData.domain;
    const presetDomain = isEdit ? (ruleData.domain || '') : (window.location.hostname || '');
    const presetFavicon = (isEdit && ruleData.favicon) ? ruleData.favicon : generateDomainFavicon(presetDomain);

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? 'm_d75496a857cf' : 'm_c34a706f680d',
        width: '480px',
        onClose: () => {
            if (currentRuleEditorOverlay === overlay) {
                currentRuleEditorOverlay = null;
            }
        },
        closeOnOverlayClick: false,
    });
    currentRuleEditorOverlay = overlay;

    function closeEditor() {
        closeExistingOverlay(overlay);
        currentRuleEditorOverlay = null;
    }

    function createAutoSubmitMethodConfigUI(initialMethod = AUTO_SUBMIT_METHODS.ENTER, initialAdvanced = null, initialExpandedState = null) {
        const methodSection = document.createElement('div');
        methodSection.style.display = 'flex';
        methodSection.style.flexDirection = 'column';
        methodSection.style.gap = '8px';

        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.alignItems = 'center';
        titleRow.style.justifyContent = 'space-between';

        const methodTitle = document.createElement('div');
        methodTitle.textContent = t('m_0996aa586f31');
        methodTitle.style.fontSize = '13px';
        methodTitle.style.fontWeight = '600';
        methodTitle.style.color = 'var(--text-color, #1f2937)';
        titleRow.appendChild(methodTitle);

        const expandButton = document.createElement('button');
        expandButton.type = 'button';
        expandButton.title = t('m_07ad1432b715');
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
            { value: AUTO_SUBMIT_METHODS.ENTER, text: t('i18n.automation.method.enter') },
            { value: AUTO_SUBMIT_METHODS.MODIFIER_ENTER, text: t('i18n.automation.method.modifier_enter') },
            { value: AUTO_SUBMIT_METHODS.CLICK_SUBMIT, text: t('m_2a8bd3464401') },
        ];

        const methodRadioName = `autoSubmitMethod_${Math.random().toString(36).slice(2, 8)}`;
        const uniqueSuffix = Math.random().toString(36).slice(2, 8);

        const getDefaultAdvancedForMethod = (method) => {
            if (method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
                return { variant: 'cmd' };
            }
            if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
                return { variant: 'default', selector: '' };
            }
            return null;
        };

        const normalizeAdvancedForMethod = (method, advanced) => {
            const defaults = getDefaultAdvancedForMethod(method);
            if (!defaults) return null;
            const normalized = { ...defaults };
            if (advanced && typeof advanced === 'object') {
                if (method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
                    if (advanced.variant && ['cmd', 'ctrl'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                } else if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
                    if (advanced.variant && ['default', 'selector'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                    if (advanced.selector && typeof advanced.selector === 'string') {
                        normalized.selector = advanced.selector;
                    }
                }
            }
            if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && normalized.variant !== 'selector') {
                normalized.selector = '';
            }
            return normalized;
        };

        let selectedMethod = normalizeAutoSubmitMethod(initialMethod || methodOptions[0].value);
        if (!methodOptions.some((option) => option.value === selectedMethod)) {
            methodOptions.push({ value: selectedMethod, text: selectedMethod });
        }

        let advancedState = normalizeAdvancedForMethod(selectedMethod, initialAdvanced);

        const shouldExpandInitially = () => {
            if (!advancedState) return false;
            if (selectedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
                return advancedState.variant === 'ctrl';
            }
            if (selectedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
                return advancedState.variant === 'selector' && advancedState.selector;
            }
            return false;
        };

        let isExpanded = typeof initialExpandedState === 'boolean' ? initialExpandedState : shouldExpandInitially();

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
            advancedTitle.textContent = t('m_7104c3ab47fe');
            advancedTitle.style.fontSize = '12px';
            advancedTitle.style.fontWeight = '600';
            advancedTitle.style.opacity = '0.75';
            advancedContainer.appendChild(advancedTitle);

            if (selectedMethod === AUTO_SUBMIT_METHODS.ENTER) {
                const tip = document.createElement('div');
                tip.textContent = t('m_200126157e5c');
                tip.style.fontSize = '12px';
                tip.style.color = 'var(--muted-text-color, #6b7280)';
                advancedContainer.appendChild(tip);
                return;
            }

            if (selectedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
                const variants = [
                    { value: 'cmd', label: 'Cmd + Enter', desc: t('m_3ff2205d80a9') },
                    { value: 'ctrl', label: 'Ctrl + Enter', desc: t('m_25fe6051280a') },
                ];
                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitCmdVariant_${uniqueSuffix}`;
                variants.forEach((variant) => {
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

            if (selectedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
                const variants = [
                    { value: 'default', label: t('m_1a75afb2bb8b'), desc: t('m_e70aa94ac10e') },
                    { value: 'selector', label: t('m_a28c37109b98'), desc: t('m_714a4a09117d') },
                ];

                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitClickVariant_${uniqueSuffix}`;
                variants.forEach((variant) => {
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
                            advancedState = normalizeAdvancedForMethod(selectedMethod, {
                                variant: variant.value,
                                selector: advancedState?.selector || '',
                            });
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
                    selectorInput.placeholder = t('m_e27ffecbfc9f');
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
                            selector: selectorInput.value,
                        });
                    });
                    advancedContainer.appendChild(selectorInput);

                    const hint = document.createElement('div');
                    hint.textContent = t('m_6ed8b9ab61b3');
                    hint.style.fontSize = '12px';
                    hint.style.color = 'var(--muted-text-color, #6b7280)';
                    advancedContainer.appendChild(hint);
                }
                return;
            }

            const tip = document.createElement('div');
            tip.textContent = t('m_0294a7240855');
            tip.style.fontSize = '12px';
            tip.style.color = 'var(--muted-text-color, #6b7280)';
            advancedContainer.appendChild(tip);
        };

        methodOptions.forEach((option) => {
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
                if (selectedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER && normalized && normalized.variant && normalized.variant !== 'cmd') {
                    advancedForSave = { variant: normalized.variant };
                } else if (selectedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && normalized) {
                    if (normalized.variant === 'selector') {
                        advancedForSave = {
                            variant: 'selector',
                            selector: typeof normalized.selector === 'string' ? normalized.selector : '',
                        };
                    } else if (normalized.variant !== 'default') {
                        advancedForSave = { variant: normalized.variant };
                    }
                }
                return {
                    method: selectedMethod,
                    advanced: advancedForSave,
                };
            },
            isExpanded: () => isExpanded,
        };
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.marginBottom = '16px';
    container.style.padding = '16px';
    container.style.borderRadius = '6px';
    container.style.border = '1px solid var(--border-color, #e5e7eb)';
    container.style.backgroundColor = 'var(--button-bg, #f3f4f6)';

    const domainLabel = document.createElement('label');
    domainLabel.textContent = t('m_efe0801dac67');
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
    nameInput.value = isEdit ? (ruleData.name || '') : (document.title || t('m_2506cf6e63b0'));
    nameLabel.appendChild(nameInput);
    container.appendChild(nameLabel);

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
    faviconInput.placeholder = t('m_c182fdbf9d82');
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
    faviconHelp.textContent = t('m_8aaf090a889e');
    faviconHelp.style.flex = '1';
    faviconHelp.style.minWidth = '0';
    faviconHelp.style.marginRight = '12px';

    const autoFaviconBtn = document.createElement('button');
    autoFaviconBtn.type = 'button';
    autoFaviconBtn.setAttribute('aria-label', t('m_bb1fa21a1bc7'));
    autoFaviconBtn.title = t('m_bb1fa21a1bc7');
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
                nameInput.value.trim() || domainInput.value.trim() || t('m_90e4e9bd1a78'),
                '⚡',
                { withBackground: false },
            ),
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

    nameInput.addEventListener('input', updateFaviconPreview);

    updateFaviconPreview();
    resizeFaviconTextarea();
    requestAnimationFrame(resizeFaviconTextarea);

    const methodConfigUI = createAutoSubmitMethodConfigUI(
        (isEdit && ruleData.method) ? ruleData.method : AUTO_SUBMIT_METHODS.ENTER,
        isEdit ? ruleData.methodAdvanced : null,
        methodExpanded,
    );
    container.appendChild(methodConfigUI.container);

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.justifyContent = 'space-between';
    buttonRow.style.alignItems = 'center';
    buttonRow.style.gap = '12px';
    buttonRow.style.marginTop = '20px';
    buttonRow.style.paddingTop = '20px';
    buttonRow.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = t('m_4d0b4688c787');
    cancelBtn.style.backgroundColor = 'var(--cancel-color,#6B7280)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', closeEditor);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = t('m_b56d9ac6c5a0');
    confirmBtn.style.backgroundColor = 'var(--success-color,#22c55e)';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.padding = '8px 16px';
    confirmBtn.style.fontSize = '14px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.addEventListener('click', () => {
        const sanitizedDomain = domainInput.value.trim();
        const sanitizedName = nameInput.value.trim();
        const methodConfig = methodConfigUI.getConfig();
        const methodAdvanced = methodConfig.advanced;
        const newData = {
            domain: sanitizedDomain,
            name: sanitizedName,
            method: methodConfig.method,
            favicon: faviconInput.value.trim() || generateDomainFavicon(sanitizedDomain),
        };

        if (!newData.domain || !newData.name) {
            alert(t('m_9278d9572dfc'));
            return;
        }

        if (methodConfig.method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && methodAdvanced && methodAdvanced.variant === 'selector') {
            const trimmedSelector = methodAdvanced.selector ? methodAdvanced.selector.trim() : '';
            if (!trimmedSelector) {
                alert(t('m_56b200a4ed9c'));
                return;
            }
            try {
                document.querySelector(trimmedSelector);
            } catch (_) {
                alert(t('m_57894b44cac3'));
                return;
            }
            methodAdvanced.selector = trimmedSelector;
        }

        if (methodAdvanced) {
            newData.methodAdvanced = methodAdvanced;
        }

        if (typeof onSave === 'function') {
            onSave(newData);
        }
        closeEditor();
    });

    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(confirmBtn);

    dialog.appendChild(container);
    dialog.appendChild(buttonRow);
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
        if (currentRuleEditorOverlay !== overlay) {
            return;
        }
        const draftMethodConfig = methodConfigUI.getConfig();
        showAutomationRuleEditorDialog({
            domain: domainInput.value.trim(),
            name: nameInput.value.trim(),
            favicon: faviconInput.value.trim(),
            method: draftMethodConfig.method,
            methodAdvanced: draftMethodConfig.advanced,
        }, onSave, {
            methodExpanded: methodConfigUI.isExpanded(),
        });
    });
}

export {
    showAutomationRuleEditorDialog,
};
