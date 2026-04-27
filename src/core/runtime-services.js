/* -------------------------------------------------------------------------- *
 * Core · Runtime services (globals, utilities, config bootstrapping)
 * -------------------------------------------------------------------------- */

import {
    bindI18nAttr,
    bindI18nText,
    detectBrowserLocale,
    getLocale,
    hydrateI18nBindings,
    releaseI18nBindings,
    refreshI18nTree,
    registerLocaleRefresh,
    setLocale,
    translate,
} from '../i18n/index.js';
import {
    OFFICIAL_STYLE_BUNDLE,
    OFFICIAL_STYLE_SOURCE_URL,
} from '../features/domain-style/official-style-bundle.generated.js';
import {
    clampBottomSpacing,
    ensureStyleBundle,
    ensureStyleRule,
    getPrimaryHostFromMatchers,
    migrateLegacyDomainStyleSettings,
    STYLE_RULE_SOURCE,
    summarizeMatchers,
} from '../features/domain-style/style-format.js';
import { cloneSerializable } from '../shared/common.js';

console.log('🎉 [Chat] Template Text Folders [20260427] v1.0.2 🎉');

    let trustedHTMLPolicy = null;
    const resolveTrustedTypes = () => {
        if (trustedHTMLPolicy) {
            return trustedHTMLPolicy;
        }
        const globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
        const trustedTypesAPI = globalObj && globalObj.trustedTypes ? globalObj.trustedTypes : null;
        if (!trustedTypesAPI) {
            return null;
        }
        try {
            trustedHTMLPolicy = trustedTypesAPI.createPolicy('chat_template_text_folders_policy', {
                createHTML: (input) => input
            });
        } catch (error) {
            console.warn('[Chat] Template Text Folders Trusted Types policy creation failed', error);
            trustedHTMLPolicy = null;
        }
        return trustedHTMLPolicy;
    };

    const releaseI18nChildBindings = (element) => {
        if (!element?.children?.length) {
            return;
        }
        Array.from(element.children).forEach((child) => {
            releaseI18nBindings(child);
        });
    };

    const hydrateI18nChildBindings = (element) => {
        if (!element?.children?.length) {
            return;
        }
        Array.from(element.children).forEach((child) => {
            hydrateI18nBindings(child);
            refreshI18nTree(child);
        });
    };

    // Trusted Types: always call this helper instead of element.innerHTML to keep every injection compatible with strict hosts.
    const setTrustedHTML = (element, html) => {
        if (!element) {
            return;
        }
        releaseI18nChildBindings(element);
        const value = typeof html === 'string' ? html : (html == null ? '' : String(html));
        const policy = resolveTrustedTypes();
        if (policy) {
            element.innerHTML = policy.createHTML(value);
        } else {
            element.innerHTML = value;
        }
        hydrateI18nChildBindings(element);
    };

    const UI_HOST_ID = 'cttf-ui-host';
    let latestThemeValues = null;
    let uiShadowRoot = null;
    let uiMainLayer = null;
    let uiOverlayLayer = null;

    const t = (messageId, replacements, overrideLocale) => {
        try {
            return translate(messageId, replacements, overrideLocale);
        } catch (error) {
            console.warn('[Chat] Template Text Folders i18n translate error:', error);
            return messageId;
        }
    };

    const isNonChineseLocale = () => {
        const locale = getLocale();
        return locale ? !/^zh(?:-|$)/i.test(locale) : false;
    };
    const LANGUAGE_PREFERENCE_STORAGE_KEY = 'cttf-language-preference';

    const readStoredLanguagePreference = () => {
        try {
            const stored = localStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
            if (stored === 'zh' || stored === 'en' || stored === 'auto') {
                return stored;
            }
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to read language preference:', error);
        }
        return null;
    };

    let cachedLanguagePreference = 'auto';

    const getLanguagePreference = () => cachedLanguagePreference;

    const writeLanguagePreference = (preference) => {
        try {
            if (!preference) {
                localStorage.removeItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
            } else {
                localStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, preference);
            }
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to persist language preference:', error);
        }
    };

    const applyLanguagePreference = (preference, options = {}) => {
        const normalizedPreference = preference === 'zh' || preference === 'en' ? preference : 'auto';
        cachedLanguagePreference = normalizedPreference;
        let targetLocale = normalizedPreference;

        if (normalizedPreference === 'auto') {
            targetLocale = detectBrowserLocale();
        }

        if (!targetLocale) {
            targetLocale = 'en';
        }

        if (!options.skipSave) {
            writeLanguagePreference(normalizedPreference);
        }

        const appliedLocale = setLocale(targetLocale);

        if (typeof options.onApplied === 'function') {
            try {
                options.onApplied(normalizedPreference, appliedLocale);
            } catch (_) {
                // 忽略回调中的错误，避免影响主流程
            }
        }

        return { preference: normalizedPreference, locale: appliedLocale };
    };

    const initializeLanguagePreference = () => {
        const storedPreference = readStoredLanguagePreference();
        applyLanguagePreference(storedPreference || 'auto', { skipSave: true });
    };

    initializeLanguagePreference();

    const ensureUIRoot = () => {
        if (uiShadowRoot && uiShadowRoot.host && uiShadowRoot.host.isConnected) {
            return uiShadowRoot;
        }

        if (!document.body) {
            return null;
        }

        let hostElement = document.getElementById(UI_HOST_ID);
        if (!hostElement) {
            hostElement = document.createElement('div');
            hostElement.id = UI_HOST_ID;
            document.body.appendChild(hostElement);
        }

        uiShadowRoot = hostElement.shadowRoot;
        if (!uiShadowRoot) {
            uiShadowRoot = hostElement.attachShadow({ mode: 'open' });
            const baseStyle = document.createElement('style');
            baseStyle.textContent = `
                :host {
                    all: initial;
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                :host *, :host *::before, :host *::after {
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .cttf-dialog,
                .cttf-dialog * {
                    scrollbar-width: thin;
                    scrollbar-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6)) transparent;
                }
                .cttf-dialog::-webkit-scrollbar,
                .cttf-dialog *::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                }
                .cttf-dialog::-webkit-scrollbar-track,
                .cttf-dialog *::-webkit-scrollbar-track {
                    background: transparent;
                    border: none;
                    margin: 0;
                }
                .cttf-dialog::-webkit-scrollbar-thumb,
                .cttf-dialog *::-webkit-scrollbar-thumb {
                    background-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6));
                    border-radius: 999px;
                    border: none;
                }
                .cttf-dialog::-webkit-scrollbar-corner,
                .cttf-dialog *::-webkit-scrollbar-corner {
                    background: transparent;
                }
                .cttf-dialog::-webkit-scrollbar-button,
                .cttf-dialog *::-webkit-scrollbar-button {
                    display: none;
                }
                .cttf-scrollable {
                    scrollbar-width: thin;
                    scrollbar-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6)) transparent;
                }
                .cttf-scrollable::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                }
                .cttf-scrollable::-webkit-scrollbar-track {
                    background: transparent;
                    border: none;
                    margin: 0;
                }
                .cttf-scrollable::-webkit-scrollbar-thumb {
                    background-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6));
                    border-radius: 999px;
                    border: none;
                }
                .cttf-scrollable::-webkit-scrollbar-corner {
                    background: transparent;
                }
                .cttf-scrollable::-webkit-scrollbar-button {
                    display: none;
                }
                .hide-scrollbar {
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .cttf-dialog input,
                .cttf-dialog textarea,
                .cttf-dialog select {
                    color: var(--input-text-color, var(--text-color, #333333));
                    background-color: var(--input-bg, var(--dialog-bg, #ffffff));
                    border-color: var(--input-border-color, var(--border-color, #d1d5db));
                }
                .cttf-dialog input::placeholder,
                .cttf-dialog textarea::placeholder,
                .cttf-dialog input::-webkit-input-placeholder,
                .cttf-dialog textarea::-webkit-input-placeholder {
                    color: var(--input-placeholder-color, var(--input-text-color, rgba(107, 114, 128, 0.75)));
                }
            `;
            uiShadowRoot.appendChild(baseStyle);
        }

        if (!uiMainLayer || !uiMainLayer.isConnected) {
            uiMainLayer = uiShadowRoot.getElementById('cttf-main-layer');
            if (!uiMainLayer) {
                uiMainLayer = document.createElement('div');
                uiMainLayer.id = 'cttf-main-layer';
                uiMainLayer.style.position = 'fixed';
                uiMainLayer.style.inset = '0';
                uiMainLayer.style.pointerEvents = 'none';
                uiShadowRoot.appendChild(uiMainLayer);
            }
        }

        if (!uiOverlayLayer || !uiOverlayLayer.isConnected) {
            uiOverlayLayer = uiShadowRoot.getElementById('cttf-overlay-layer');
            if (!uiOverlayLayer) {
                uiOverlayLayer = document.createElement('div');
                uiOverlayLayer.id = 'cttf-overlay-layer';
                uiOverlayLayer.style.position = 'fixed';
                uiOverlayLayer.style.inset = '0';
                uiOverlayLayer.style.pointerEvents = 'none';
                uiOverlayLayer.style.zIndex = '20000';
                uiShadowRoot.appendChild(uiOverlayLayer);
            }
        }

        if (latestThemeValues && hostElement) {
            Object.entries(latestThemeValues).forEach(([key, value]) => {
                hostElement.style.setProperty(toCSSVariableName(key), value);
            });
        }

        return uiShadowRoot;
    };

    const getShadowRoot = () => ensureUIRoot();

    const getMainLayer = () => {
        const root = ensureUIRoot();
        return root ? uiMainLayer : null;
    };

    const getOverlayLayer = () => {
        const root = ensureUIRoot();
        return root ? uiOverlayLayer : null;
    };

    const appendToMainLayer = (node) => {
        const container = getMainLayer();
        const appended = container ? container.appendChild(node) : document.body.appendChild(node);
        hydrateI18nBindings(appended);
        refreshI18nTree(appended);
        return appended;
    };

    const appendToOverlayLayer = (node) => {
        const container = getOverlayLayer();
        const appended = container ? container.appendChild(node) : document.body.appendChild(node);
        hydrateI18nBindings(appended);
        refreshI18nTree(appended);
        return appended;
    };

    const queryUI = (selector) => {
        const root = getShadowRoot();
        return root ? root.querySelector(selector) : document.querySelector(selector);
    };

    const toCSSVariableName = (key) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

    /**
     * 自动根据内容调整 textarea 高度，确保上下内边距空间充足。
     * @param {HTMLTextAreaElement} textarea
     * @param {{minRows?: number, maxRows?: number}} options
     */
    const autoResizeTextarea = (textarea, options = {}) => {
        if (!textarea) return;
        const { minRows = 1, maxRows = 5 } = options;
        textarea.style.height = 'auto';
        const styles = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(styles.lineHeight) || (parseFloat(styles.fontSize) * 1.2) || 20;
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const borderTop = parseFloat(styles.borderTopWidth) || 0;
        const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
        const minHeight = (lineHeight * minRows) + paddingTop + paddingBottom + borderTop + borderBottom;
        const maxHeight = (lineHeight * maxRows) + paddingTop + paddingBottom + borderTop + borderBottom;
        let targetHeight = textarea.scrollHeight;
        if (targetHeight < minHeight) {
            targetHeight = minHeight;
        } else if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
        textarea.style.minHeight = `${minHeight}px`;
        textarea.style.maxHeight = `${maxHeight}px`;
        textarea.style.height = `${targetHeight}px`;
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';

const createAutoFaviconIcon = () => {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('data-name', 'Layer 1');
        svg.setAttribute('id', 'Layer_1');
        svg.setAttribute('fill', '#000000');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.style.width = '18px';
        svg.style.height = '18px';
        svg.style.display = 'block';

        const segments = [
            { d: 'M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16', fill: '#00ac47' },
            { d: 'M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16', fill: '#4285f4' },
            { d: 'M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z', fill: '#ffba00' },
            { d: 'M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z', fill: '#ea4435' },
            { d: 'M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z', fill: '#4285f4' }
        ];

        segments.forEach(({ d, fill }) => {
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', d);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        });

    return svg;
};

const dialogOverlayStack = [];
const pushDialogOverlay = (overlay) => {
    if (!overlay) {
        return;
    }
    const existingIndex = dialogOverlayStack.indexOf(overlay);
    if (existingIndex !== -1) {
        dialogOverlayStack.splice(existingIndex, 1);
    }
    dialogOverlayStack.push(overlay);
};
const removeDialogOverlay = (overlay) => {
    const index = dialogOverlayStack.lastIndexOf(overlay);
    if (index !== -1) {
        dialogOverlayStack.splice(index, 1);
    }
};
const isTopmostDialogOverlay = (overlay) => {
    return dialogOverlayStack.length > 0 && dialogOverlayStack[dialogOverlayStack.length - 1] === overlay;
};

const closeUnifiedDialogOverlay = (overlay, options = {}) => {
    if (!overlay) {
        return false;
    }
        if (overlay.__cttfClosing) {
            return true;
        }
        overlay.__cttfClosing = true;
        const dialog = overlay.__cttfDialogNode || overlay.querySelector('.cttf-dialog');
        const closeTransform = overlay.__cttfCloseTransform || 'scale(0.95)';
        const onClose = typeof overlay.__cttfOnClose === 'function' ? overlay.__cttfOnClose : null;

        if (!options.skipOnClose && onClose) {
            try {
                onClose();
            } catch (error) {
                console.warn('[Chat] Template Text Folders dialog close callback failed:', error);
            }
            overlay.__cttfOnClose = null;
        }
        if (dialog) {
            dialog.style.transform = closeTransform;
        }
        overlay.style.pointerEvents = 'none';
        removeDialogOverlay(overlay);
        if (typeof overlay.__cttfEscapeCleanup === 'function') {
            overlay.__cttfEscapeCleanup();
            overlay.__cttfEscapeCleanup = null;
        }
        if (typeof overlay.__cttfLocaleRefreshCleanup === 'function') {
            overlay.__cttfLocaleRefreshCleanup();
            overlay.__cttfLocaleRefreshCleanup = null;
        }
        releaseI18nBindings(overlay);
        if (overlay.parentElement) {
            overlay.parentElement.removeChild(overlay);
            console.log(t('m_dc910208b65d'));
        }
        overlay.__cttfClosing = false;

        return true;
    };

    function createUnifiedDialog(options = {}) {
        const {
            title = 'm_aa13ec9bac8f',
            showTitle = title !== null && title !== false && title !== '',
            width = '400px',
            maxWidth = '95vw',
            maxHeight = '80vh',
            padding = '24px',
            zIndex = '12000',
            onClose = null,
            onOverlayClick = null,
            closeOnOverlayClick = true,
            closeOnEscape = closeOnOverlayClick,
            beforeClose = null,
            overlayClassName = '',
            dialogClassName = '',
            overlayStyles = null,
            dialogStyles = null,
            titleStyles = null,
            initialTransform = 'none',
            openTransform = 'none',
            closeTransform = 'none',
        } = options;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'var(--overlay-bg, rgba(0,0,0,0.5))';
        overlay.style.backdropFilter = 'blur(2px)';
        overlay.style.zIndex = String(zIndex);
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        if (overlayClassName) {
            overlayClassName.split(/\s+/).filter(Boolean).forEach((className) => overlay.classList.add(className));
        }
        if (overlayStyles && typeof overlayStyles === 'object') {
            Object.assign(overlay.style, overlayStyles);
        }

        const dialog = document.createElement('div');
        dialog.classList.add('cttf-dialog');
        if (dialogClassName) {
            dialogClassName.split(/\s+/).filter(Boolean).forEach((className) => dialog.classList.add(className));
        }
        dialog.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        dialog.style.color = 'var(--text-color, #333333)';
        dialog.style.borderRadius = '4px';
        dialog.style.padding = padding;
        dialog.style.boxShadow = '0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))';
        dialog.style.border = '1px solid var(--border-color, #e5e7eb)';
        dialog.style.width = width;
        dialog.style.maxWidth = maxWidth;
        dialog.style.maxHeight = maxHeight;
        dialog.style.overflowY = 'auto';
        dialog.style.transform = initialTransform;
        if (dialogStyles && typeof dialogStyles === 'object') {
            Object.assign(dialog.style, dialogStyles);
        }

        if (showTitle) {
            const titleEl = document.createElement('h2');
            bindI18nText(titleEl, title);
            titleEl.style.margin = '0';
            titleEl.style.marginBottom = '12px';
            titleEl.style.fontSize = '18px';
            titleEl.style.fontWeight = '600';
            if (titleStyles && typeof titleStyles === 'object') {
                Object.assign(titleEl.style, titleStyles);
            }
            dialog.appendChild(titleEl);
        }

        overlay.appendChild(dialog);
        appendToOverlayLayer(overlay);
        pushDialogOverlay(overlay);

        overlay.__cttfDialogNode = dialog;
        overlay.__cttfCloseTransform = closeTransform;
        overlay.__cttfCloseDuration = 0;
        overlay.__cttfOnClose = onClose;
        overlay.__cttfBeforeClose = beforeClose;
        overlay.__cttfCloseDialog = (closeOptions = {}) => closeUnifiedDialogOverlay(overlay, closeOptions);
        overlay.__cttfRequestClose = async (reason = 'programmatic', event = null, closeOptions = {}) => {
            if (overlay.__cttfClosing) {
                return false;
            }
            if (overlay.__cttfPendingClosePromise) {
                return overlay.__cttfPendingClosePromise;
            }
            const pendingClose = (async () => {
                const guard = typeof overlay.__cttfBeforeClose === 'function'
                    ? overlay.__cttfBeforeClose
                    : null;
                if (!closeOptions.skipBeforeClose && guard) {
                    try {
                        const guardResult = await guard({
                            reason,
                            event,
                            overlay,
                            dialog,
                        });
                        if (guardResult === false) {
                            return false;
                        }
                    } catch (error) {
                        console.warn('[Chat] Template Text Folders dialog close guard failed:', error);
                        return false;
                    }
                }
                return overlay.__cttfCloseDialog(closeOptions);
            })();
            overlay.__cttfPendingClosePromise = pendingClose;
            pendingClose.finally(() => {
                if (overlay.__cttfPendingClosePromise === pendingClose) {
                    overlay.__cttfPendingClosePromise = null;
                }
            });
            return pendingClose;
        };
        overlay.style.opacity = '1';
        dialog.style.transform = openTransform;

        if (closeOnOverlayClick) {
            overlay.addEventListener('click', (event) => {
                if (event.target !== overlay) {
                    return;
                }
                if (typeof onOverlayClick === 'function') {
                    try {
                        onOverlayClick(event, overlay, dialog);
                    } catch (error) {
                        console.warn('[Chat] Template Text Folders overlay click handler failed:', error);
                    }
                }
                void overlay.__cttfRequestClose('overlay', event);
            });
        } else {
            overlay.addEventListener('click', (event) => {
                if (event.target !== overlay) {
                    return;
                }
                if (typeof onOverlayClick === 'function') {
                    try {
                        onOverlayClick(event, overlay, dialog);
                    } catch (error) {
                        console.warn('[Chat] Template Text Folders overlay click handler failed:', error);
                    }
                }
                event.stopPropagation();
                event.preventDefault();
            });
        }

        if (closeOnEscape) {
            const handleEscapeKeydown = (event) => {
                if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) {
                    return;
                }
                if (!overlay.isConnected || !isTopmostDialogOverlay(overlay)) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                void overlay.__cttfRequestClose('escape', event);
            };
            document.addEventListener('keydown', handleEscapeKeydown, true);
            overlay.__cttfEscapeCleanup = () => {
                document.removeEventListener('keydown', handleEscapeKeydown, true);
            };
        }

        return {
            overlay,
            dialog,
            close: overlay.__cttfCloseDialog,
            requestClose: overlay.__cttfRequestClose,
        };
    }

    const createDialogCloseIconButton = (onClick = null, options = {}) => {
        const { labelId = 'm_6c14bd7f6f9e' } = options;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '✕';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.padding = '0';
        button.style.borderRadius = '50%';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.cursor = 'pointer';
        button.style.color = 'var(--text-color, #333333)';
        button.style.transition = 'background-color 0.2s ease';
        button.style.flex = '0 0 auto';

        bindI18nAttr(button, 'aria-label', labelId);

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'transparent';
        });
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (typeof onClick === 'function') {
                onClick(event);
            }
        });

        return button;
    };

    // 主题样式配置（使用CSS变量）
    const applyThemeToHost = (themeValues) => {
        const root = ensureUIRoot();
        const host = root ? root.host : null;
        if (!host) {
            return;
        }
        Object.entries(themeValues).forEach(([key, value]) => {
            host.style.setProperty(toCSSVariableName(key), value);
        });
    };

    const setCSSVariables = (currentTheme) => {
        latestThemeValues = currentTheme;
        const apply = () => applyThemeToHost(currentTheme);

        if (document.body) {
            apply();
        } else {
            window.addEventListener('DOMContentLoaded', apply, { once: true });
        }
    };

    const theme = {
        light: {
            folderBg: 'rgba(255, 255, 255, 0.8)',
            dialogBg: '#ffffff',
            textColor: '#333333',
            borderColor: '#e5e7eb',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            buttonBg: '#f3f4f6',
            buttonHoverBg: '#e5e7eb',
            clearIconColor: '#333333',
            dangerColor: '#ef4444',
            successColor: '#22c55e',
            addColor: '#fd7e14',
            primaryColor: '#3B82F6',
            infoColor: '#6366F1',
            cancelColor: '#6B7280',
            overlayBg: 'rgba(0, 0, 0, 0.5)',
            tabBg: '#f3f4f6',
            tabActiveBg: '#3B82F6',
            tabHoverBg: '#e5e7eb',
            tabBorder: '#e5e7eb',
            inputTextColor: '#1f2937',
            inputPlaceholderColor: '#9ca3af',
            inputBg: '#ffffff',
            inputBorderColor: '#d1d5db'
        },
        dark: {
            folderBg: 'rgba(17, 17, 17, 0.85)',
            dialogBg: '#111111',
            textColor: '#e5e7eb',
            borderColor: '#2a2a2a',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            buttonBg: '#1f1f1f',
            buttonHoverBg: '#2c2c2c',
            clearIconColor: '#ffffff',
            dangerColor: '#dc2626',
            successColor: '#16a34a',
            addColor: '#fd7e14',
            primaryColor: '#2563EB',
            infoColor: '#4F46E5',
            cancelColor: '#3f3f46',
            overlayBg: 'rgba(0, 0, 0, 0.7)',
            tabBg: '#1f1f1f',
            tabActiveBg: '#2563EB',
            tabHoverBg: '#2c2c2c',
            tabBorder: '#2a2a2a',
            inputTextColor: '#f9fafb',
            inputPlaceholderColor: 'rgba(255, 255, 255, 0.7)',
            inputBg: '#1f1f1f',
            inputBorderColor: '#3f3f46'
        }
    };

    const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const getCurrentTheme = () => isDarkMode() ? theme.dark : theme.light;

    setCSSVariables(getCurrentTheme());

    const styles = {
        button: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: 'var(--button-bg, #f3f4f6)',
            color: 'var(--text-color, #333333)'
        }
    };

    const AUTO_SUBMIT_METHODS = {
        ENTER: 'enter',
        MODIFIER_ENTER: 'modifier_enter',
        CLICK_SUBMIT: 'click_submit',
    };
    const LEGACY_AUTO_SUBMIT_METHOD_MAP = {
        Enter: AUTO_SUBMIT_METHODS.ENTER,
        'Cmd+Enter': AUTO_SUBMIT_METHODS.MODIFIER_ENTER,
        '模拟点击提交按钮': AUTO_SUBMIT_METHODS.CLICK_SUBMIT,
    };
    const TOOL_FOLDER_NAME = '🖱️';
    const DEFAULT_FOLDER_NAME_ID = 'm_c8d09cf955f5';
    const DEFAULT_EXPLAIN_BUTTON_ID = 'm_85d6179efdab';
    const DEFAULT_TOOL_BUTTON_IDS = {
        cut: 'm_29b653b40e8c',
        copy: 'm_4edd1d00875d',
        paste: 'm_de7fb7d3cf47',
        clear: 'm_84fcd70d4280',
    };

    const createDefaultUserButtons = (locale = getLocale()) => ({
        Review: {
            type: 'template',
            text: 'You are a code review expert:\n\n{clipboard}\n\nProvide constructive feedback and improvements.\n',
            color: '#E6E0FF',
            textColor: '#333333',
            autoSubmit: false
        },
        [t(DEFAULT_EXPLAIN_BUTTON_ID, null, locale)]: {
            type: 'template',
            text: 'Explain the following code concisely:\n\n{clipboard}\n\nFocus on key functionality and purpose.\n',
            color: '#ffebcc',
            textColor: '#333333',
            autoSubmit: false
        }
    });

    const createDefaultToolButtons = (locale = getLocale()) => ({
        [t(DEFAULT_TOOL_BUTTON_IDS.cut, null, locale)]: {
            type: 'tool',
            action: 'cut',
            color: '#FFC1CC',
            textColor: '#333333'
        },
        [t(DEFAULT_TOOL_BUTTON_IDS.copy, null, locale)]: {
            type: 'tool',
            action: 'copy',
            color: '#C1FFD7',
            textColor: '#333333'
        },
        [t(DEFAULT_TOOL_BUTTON_IDS.paste, null, locale)]: {
            type: 'tool',
            action: 'paste',
            color: '#C1D8FF',
            textColor: '#333333'
        },
        [t(DEFAULT_TOOL_BUTTON_IDS.clear, null, locale)]: {
            type: 'tool',
            action: 'clear',
            color: '#FFD1C1',
            textColor: '#333333'
        }
    });
    const TOOL_DEFAULT_ICONS = {
        cut: '✂️',
        copy: '📋',
        paste: '📥',
        clear: '✖️'
    };

    const generateDomainFavicon = (domain) => {
        if (!domain) return '';
        const trimmed = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(trimmed)}&sz=32`;
    };

    const createFaviconElement = (faviconUrl, label, fallbackEmoji = '🌐', options = {}) => {
        const { withBackground = true, size = 32 } = options || {};
        const normalizedSize = Math.max(16, Math.min(48, Number(size) || 32));
        const contentSize = Math.max(12, normalizedSize - 4);
        const emojiFontSize = Math.max(10, normalizedSize - 10);
        const borderRadius = Math.round(normalizedSize / 4);

        const wrapper = document.createElement('div');
        wrapper.style.width = `${normalizedSize}px`;
        wrapper.style.height = `${normalizedSize}px`;
        wrapper.style.borderRadius = `${borderRadius}px`;
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.backgroundColor = withBackground ? 'rgba(148, 163, 184, 0.15)' : 'transparent';
        wrapper.style.flexShrink = '0';

        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.alt = label || 'site icon';
            img.style.width = `${contentSize}px`;
            img.style.height = `${contentSize}px`;
            img.style.objectFit = 'cover';
            img.referrerPolicy = 'no-referrer';
            img.loading = 'lazy';
            img.onerror = () => {
                setTrustedHTML(wrapper, '');
                const emoji = document.createElement('span');
                emoji.textContent = fallbackEmoji;
                emoji.style.fontSize = `${emojiFontSize}px`;
                wrapper.appendChild(emoji);
            };
            wrapper.appendChild(img);
        } else {
            const emoji = document.createElement('span');
            emoji.textContent = fallbackEmoji;
            emoji.style.fontSize = `${emojiFontSize}px`;
            wrapper.appendChild(emoji);
        }

        return wrapper;
    };

    const createDefaultOfficialStyleBundle = () => cloneSerializable(OFFICIAL_STYLE_BUNDLE, {
        fallback: {
            version: '',
            sourceUrl: '',
            lastFetchedAt: 0,
            rules: [],
        },
    }) || {
        version: '',
        sourceUrl: '',
        lastFetchedAt: 0,
        rules: [],
    };

    const buildDefaultConfig = (locale = getLocale()) => {
        const defaultFolderName = t(DEFAULT_FOLDER_NAME_ID, null, locale);
        const toolButtons = createDefaultToolButtons(locale);
        return {
            folders: {
                [defaultFolderName]: {
                    color: '#3B82F6',
                    textColor: '#ffffff',
                    hidden: false,
                    buttons: createDefaultUserButtons(locale)
                },
                [TOOL_FOLDER_NAME]: {
                    color: '#FFD700',
                    textColor: '#ffffff',
                    hidden: false,
                    buttons: toolButtons
                }
            },
            folderOrder: [defaultFolderName, TOOL_FOLDER_NAME],
            domainAutoSubmitSettings: [
                {
                    domain: 'chatgpt.com',
                    name: 'ChatGPT',
                    method: AUTO_SUBMIT_METHODS.CLICK_SUBMIT,
                    favicon: generateDomainFavicon('chatgpt.com')
                },
                {
                    domain: 'chathub.gg',
                    name: 'ChatHub',
                    method: AUTO_SUBMIT_METHODS.ENTER,
                    favicon: generateDomainFavicon('chathub.gg')
                },
                {
                    domain: 'cerebr.yym68686.top',
                    name: 'Cerebr',
                    method: AUTO_SUBMIT_METHODS.ENTER,
                    favicon: generateDomainFavicon('cerebr.yym68686.top')
                }
            ],
            officialStyleBundle: createDefaultOfficialStyleBundle(),
            customStyleRules: [],
            showFolderIcons: false,
            buttonBarHeight: 40,
            buttonBarBottomSpacing: 0
        };
    };

    const createDefaultConfig = (locale = getLocale()) => buildDefaultConfig(locale);

    const defaultConfig = buildDefaultConfig();
    const CONFIG_STORAGE_KEY = 'chatGPTButtonFoldersConfig';

    const normalizeOfficialStyleRule = (rule) => {
        const normalizedRule = ensureStyleRule({
            ...rule,
            source: STYLE_RULE_SOURCE.OFFICIAL,
        }, {
            fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
        });
        if (!normalizedRule) {
            return null;
        }
        if (!normalizedRule.name) {
            normalizedRule.name = summarizeMatchers(normalizedRule.matchers, {
                maxItems: 1,
                emptyLabel: 'Official Style',
            });
        }
        if (!normalizedRule.favicon) {
            const primaryHost = getPrimaryHostFromMatchers(normalizedRule.matchers);
            if (primaryHost) {
                normalizedRule.favicon = generateDomainFavicon(primaryHost);
            }
        }
        return normalizedRule;
    };

    const normalizeOfficialStyleBundle = (bundle, fallbackBundle = createDefaultOfficialStyleBundle()) => {
        const normalizedBundle = ensureStyleBundle(
            bundle && typeof bundle === 'object' ? bundle : fallbackBundle,
            {
                fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
                version: fallbackBundle.version,
                sourceUrl: fallbackBundle.sourceUrl,
                lastFetchedAt: bundle && typeof bundle === 'object'
                    ? bundle.lastFetchedAt
                    : fallbackBundle.lastFetchedAt,
                rules: bundle && typeof bundle === 'object'
                    ? bundle.rules
                    : fallbackBundle.rules,
            },
        );

        normalizedBundle.rules = normalizedBundle.rules
            .map((rule) => normalizeOfficialStyleRule(rule))
            .filter(Boolean);

        return normalizedBundle;
    };

    const OFFICIAL_STYLE_SOURCE_REPO_SLUG = '0-v-linuxdo/chat_template_text_folders';
    const OFFICIAL_STYLE_SOURCE_FILE_PATH = '/userstyle/[chat] template text folders.user.css';
    const normalizeOfficialStyleSourceUrl = (value) => (
        typeof value === 'string'
            ? value.trim().replace(/\/+$/, '')
            : ''
    );

    const normalizeOfficialStyleSourcePath = (value) => String(value || '')
        .trim()
        .replace(/\/+/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase();

    const parseOfficialStyleSourceDescriptor = (value) => {
        const normalized = normalizeOfficialStyleSourceUrl(value);
        if (!normalized) {
            return null;
        }

        try {
            const url = new URL(normalized);
            const hostname = url.hostname.toLowerCase();
            const pathParts = normalizeOfficialStyleSourcePath(decodeURIComponent(url.pathname))
                .split('/')
                .filter(Boolean);

            if (hostname === 'github.com' && pathParts.length >= 5 && pathParts[2] === 'raw') {
                let branch = '';
                let filePathParts = [];

                if (pathParts[3] === 'refs' && pathParts[4] === 'heads' && pathParts.length >= 7) {
                    branch = pathParts[5];
                    filePathParts = pathParts.slice(6);
                } else {
                    branch = pathParts[3];
                    filePathParts = pathParts.slice(4);
                }

                return {
                    repoSlug: `${pathParts[0]}/${pathParts[1]}`,
                    branch,
                    filePath: `/${filePathParts.join('/')}`,
                };
            }

            if (hostname === 'raw.githubusercontent.com' && pathParts.length >= 4) {
                return {
                    repoSlug: `${pathParts[0]}/${pathParts[1]}`,
                    branch: pathParts[2],
                    filePath: `/${pathParts.slice(3).join('/')}`,
                };
            }
        } catch (_) {
            // Ignore invalid URLs here and let the fallback comparison handle them.
        }

        return null;
    };

    const isOfficialStyleSourceUrl = (value) => {
        const normalized = normalizeOfficialStyleSourceUrl(value);
        if (!normalized) {
            return true;
        }

        const descriptor = parseOfficialStyleSourceDescriptor(normalized);
        if (descriptor) {
            return descriptor.repoSlug === OFFICIAL_STYLE_SOURCE_REPO_SLUG
                && descriptor.branch === 'main'
                && descriptor.filePath === OFFICIAL_STYLE_SOURCE_FILE_PATH;
        }

        const officialSourceUrl = normalizeOfficialStyleSourceUrl(OFFICIAL_STYLE_SOURCE_URL);
        return normalized === officialSourceUrl;
    };

    const parseOfficialStyleBundleVersion = (value) => {
        const text = typeof value === 'string' ? value.trim() : '';
        const dateMatch = text.match(/\[(\d{8})\]/);
        const semverMatch = text.match(/\bv(\d+)(?:\.(\d+))?(?:\.(\d+))?\b/i);

        return {
            text,
            date: dateMatch ? Number(dateMatch[1]) : 0,
            parts: semverMatch
                ? [1, 2, 3].map((index) => Number(semverMatch[index] || 0))
                : [],
        };
    };

    const compareVersionParts = (leftParts = [], rightParts = []) => {
        const maxLength = Math.max(leftParts.length, rightParts.length);
        for (let index = 0; index < maxLength; index += 1) {
            const leftValue = Number(leftParts[index] || 0);
            const rightValue = Number(rightParts[index] || 0);
            if (leftValue !== rightValue) {
                return leftValue - rightValue;
            }
        }
        return 0;
    };

    const compareOfficialStyleBundleVersions = (leftVersion, rightVersion) => {
        const left = parseOfficialStyleBundleVersion(leftVersion);
        const right = parseOfficialStyleBundleVersion(rightVersion);

        if (!left.text && !right.text) {
            return 0;
        }
        if (!left.text) {
            return -1;
        }
        if (!right.text) {
            return 1;
        }
        if (left.date && right.date && left.date !== right.date) {
            return left.date - right.date;
        }

        const partsComparison = compareVersionParts(left.parts, right.parts);
        if (partsComparison !== 0) {
            return partsComparison;
        }
        if (left.date !== right.date) {
            return left.date - right.date;
        }

        return left.text.localeCompare(right.text, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    };

    const shouldRefreshOfficialStyleBundleFromBundledSnapshot = (bundle, bundledBundle = createDefaultOfficialStyleBundle()) => {
        if (!bundle || typeof bundle !== 'object') {
            return true;
        }

        const lastFetchedAt = Number(bundle.lastFetchedAt);
        if (!isOfficialStyleSourceUrl(bundle.sourceUrl)) {
            return false;
        }

        return (!Number.isFinite(lastFetchedAt) || lastFetchedAt <= 0)
            || compareOfficialStyleBundleVersions(bundle.version, bundledBundle.version) < 0;
    };

    const ensureStyleConfiguration = (targetConfig = buttonConfig) => {
        if (!targetConfig || typeof targetConfig !== 'object') {
            return false;
        }

        let updated = false;
        const nextDefaultBundle = createDefaultOfficialStyleBundle();
        const rawCustomRules = Array.isArray(targetConfig.customStyleRules)
            ? targetConfig.customStyleRules
            : (Array.isArray(targetConfig.domainStyleSettings)
                ? migrateLegacyDomainStyleSettings(targetConfig.domainStyleSettings)
                : []);
        if (!Array.isArray(targetConfig.customStyleRules)) {
            updated = true;
        }

        const normalizedCustomRules = rawCustomRules
            .map((rule) => ensureStyleRule({
                ...rule,
                source: STYLE_RULE_SOURCE.CUSTOM,
            }, {
                fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
            }))
            .filter(Boolean)
            .map((rule) => {
                const normalizedRule = { ...rule };
                if (!normalizedRule.name) {
                    normalizedRule.name = summarizeMatchers(normalizedRule.matchers, {
                        maxItems: 1,
                        emptyLabel: 'Custom Style',
                    });
                }
                if (!normalizedRule.favicon) {
                    const primaryHost = getPrimaryHostFromMatchers(normalizedRule.matchers);
                    if (primaryHost) {
                        normalizedRule.favicon = generateDomainFavicon(primaryHost);
                    }
                }
                return normalizedRule;
            });

        const normalizedOfficialBundle = normalizeOfficialStyleBundle(
            targetConfig.officialStyleBundle && typeof targetConfig.officialStyleBundle === 'object'
                ? targetConfig.officialStyleBundle
                : nextDefaultBundle,
            nextDefaultBundle,
        );

        let nextOfficialBundle = normalizedOfficialBundle;

        // Official style bundles live in per-origin localStorage. Refresh older official-source bundles,
        // including legacy raw.githubusercontent.com snapshots from older releases.
        if (shouldRefreshOfficialStyleBundleFromBundledSnapshot(normalizedOfficialBundle, nextDefaultBundle)) {
            const enabledStateById = new Map(
                normalizedOfficialBundle.rules.map((rule) => [rule.id, rule.enabled !== false]),
            );
            const migratedOfficialBundle = normalizeOfficialStyleBundle(nextDefaultBundle, nextDefaultBundle);
            migratedOfficialBundle.rules = migratedOfficialBundle.rules.map((rule) => ({
                ...rule,
                enabled: enabledStateById.has(rule.id)
                    ? enabledStateById.get(rule.id)
                    : (rule.enabled !== false),
            }));
            nextOfficialBundle = migratedOfficialBundle;
        }

        const previousCustomJson = JSON.stringify(targetConfig.customStyleRules || []);
        const nextCustomJson = JSON.stringify(normalizedCustomRules);
        if (previousCustomJson !== nextCustomJson) {
            targetConfig.customStyleRules = normalizedCustomRules;
            updated = true;
        }

        const previousBundleJson = JSON.stringify(targetConfig.officialStyleBundle || null);
        const nextBundleJson = JSON.stringify(nextOfficialBundle);
        if (previousBundleJson !== nextBundleJson) {
            targetConfig.officialStyleBundle = nextOfficialBundle;
            updated = true;
        }

        if (Object.prototype.hasOwnProperty.call(targetConfig, 'domainStyleSettings')) {
            delete targetConfig.domainStyleSettings;
            updated = true;
        }

        return updated;
    };

    const normalizeAutoSubmitMethod = (method) => {
        if (method === AUTO_SUBMIT_METHODS.ENTER || method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER || method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
            return method;
        }
        if (LEGACY_AUTO_SUBMIT_METHOD_MAP[method]) {
            return LEGACY_AUTO_SUBMIT_METHOD_MAP[method];
        }
        return AUTO_SUBMIT_METHODS.ENTER;
    };

    const normalizeAutoSubmitAdvanced = (method, advanced) => {
        const normalizedMethod = normalizeAutoSubmitMethod(method);
        if (!advanced || typeof advanced !== 'object') {
            return null;
        }
        if (normalizedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
            if (advanced.variant === 'ctrl') {
                return { variant: 'ctrl' };
            }
            if (advanced.variant === 'cmd') {
                return { variant: 'cmd' };
            }
            return null;
        }
        if (normalizedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
            if (advanced.variant === 'selector') {
                const selector = typeof advanced.selector === 'string' ? advanced.selector.trim() : '';
                return selector ? { variant: 'selector', selector } : null;
            }
            if (advanced.variant === 'default') {
                return { variant: 'default' };
            }
            return null;
        }
        return null;
    };

    const createFallbackConfigClone = (locale = getLocale()) => {
        const fallbackConfig = createDefaultConfig(locale);
        return cloneSerializable(fallbackConfig, { fallback: fallbackConfig }) || fallbackConfig;
    };

    const readPersistedButtonConfig = (locale = getLocale()) => {
        const fallbackConfig = createFallbackConfigClone(locale);
        try {
            const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
            if (!raw) {
                return fallbackConfig;
            }
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed
                : fallbackConfig;
        } catch (error) {
            console.warn('[Chat] Template Text Folders config parse failed:', error);
            return fallbackConfig;
        }
    };

    const clampToolbarHeight = (value, fallback = 40) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }
        return Math.max(20, Math.min(200, Math.round(parsed)));
    };

    const persistButtonConfig = (config = buttonConfig) => {
        try {
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        } catch (error) {
            console.warn('[Chat] Template Text Folders config persist failed:', error);
        }
        return config;
    };

    const ensureFolderOrder = (targetConfig = buttonConfig) => {
        if (!targetConfig || typeof targetConfig !== 'object') {
            return false;
        }
        if (!targetConfig.folders || typeof targetConfig.folders !== 'object' || Array.isArray(targetConfig.folders)) {
            targetConfig.folders = {};
        }
        const existingFolderNames = Object.keys(targetConfig.folders);
        const seen = new Set();
        const nextFolderOrder = [];
        const currentOrder = Array.isArray(targetConfig.folderOrder) ? targetConfig.folderOrder : [];

        currentOrder.forEach((folderName) => {
            if (typeof folderName !== 'string' || seen.has(folderName) || !Object.prototype.hasOwnProperty.call(targetConfig.folders, folderName)) {
                return;
            }
            seen.add(folderName);
            nextFolderOrder.push(folderName);
        });

        existingFolderNames.forEach((folderName) => {
            if (seen.has(folderName)) {
                return;
            }
            seen.add(folderName);
            nextFolderOrder.push(folderName);
        });

        const currentOrderJson = JSON.stringify(currentOrder);
        const nextOrderJson = JSON.stringify(nextFolderOrder);
        if (currentOrderJson === nextOrderJson) {
            return false;
        }
        targetConfig.folderOrder = nextFolderOrder;
        return true;
    };

    const ensureButtonTypes = (targetConfig = buttonConfig, options = {}) => {
        if (!targetConfig || typeof targetConfig !== 'object') {
            return false;
        }
        let updated = false;
        if (!targetConfig.folders || typeof targetConfig.folders !== 'object' || Array.isArray(targetConfig.folders)) {
            targetConfig.folders = {};
            updated = true;
        }
        Object.entries(targetConfig.folders).forEach(([folderName, originalFolderConfig]) => {
            let folderConfig = originalFolderConfig;
            if (!folderConfig || typeof folderConfig !== 'object' || Array.isArray(folderConfig)) {
                folderConfig = {
                    color: folderName === TOOL_FOLDER_NAME ? '#FFD700' : '#3B82F6',
                    textColor: '#ffffff',
                    hidden: false,
                    buttons: {},
                };
                targetConfig.folders[folderName] = folderConfig;
                updated = true;
            }
            if (!folderConfig.buttons || typeof folderConfig.buttons !== 'object' || Array.isArray(folderConfig.buttons)) {
                folderConfig.buttons = {};
                updated = true;
            }
            if (typeof folderConfig.hidden !== 'boolean') {
                folderConfig.hidden = false;
                updated = true;
            }

            Object.entries(folderConfig.buttons).forEach(([btnName, originalBtnConfig]) => {
                let btnConfig = originalBtnConfig;
                if (!btnConfig || typeof btnConfig !== 'object' || Array.isArray(btnConfig)) {
                    btnConfig = {};
                    folderConfig.buttons[btnName] = btnConfig;
                    updated = true;
                }
                if (!btnConfig.type) {
                    btnConfig.type = folderName === TOOL_FOLDER_NAME ? 'tool' : 'template';
                    updated = true;
                }
                if (btnConfig.type === 'template' && typeof btnConfig.autoSubmit !== 'boolean') {
                    btnConfig.autoSubmit = false;
                    updated = true;
                }
                if (btnConfig.type === 'template' && typeof btnConfig.favicon !== 'string') {
                    btnConfig.favicon = '';
                    updated = true;
                }
            });
        });
        if (updated && !options.silent) {
            console.log(t('m_64d4bcd2dfa8'));
        }
        return updated;
    };

    const DEFAULT_DOMAIN_AUTO_SUBMIT_BACKFILL_DOMAINS = new Set([
        'cerebr.yym68686.top',
    ]);

    const normalizeDomainAutoSubmitDomain = (domain) => {
        const raw = typeof domain === 'string' ? domain.trim() : '';
        if (!raw) {
            return '';
        }

        try {
            const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
            return (url.hostname || '').trim().toLowerCase();
        } catch (_) {
            return raw
                .replace(/^https?:\/\//i, '')
                .replace(/\/.*$/, '')
                .trim()
                .toLowerCase();
        }
    };

    const ensureBackfilledDefaultDomainAutoSubmitRules = (targetConfig, fallbackDomainSettings) => {
        if (!Array.isArray(targetConfig?.domainAutoSubmitSettings) || !Array.isArray(fallbackDomainSettings)) {
            return false;
        }

        const existingDomains = new Set(
            targetConfig.domainAutoSubmitSettings
                .map((rule) => normalizeDomainAutoSubmitDomain(rule?.domain))
                .filter(Boolean)
        );
        let updated = false;

        fallbackDomainSettings.forEach((fallbackRule) => {
            const domainKey = normalizeDomainAutoSubmitDomain(fallbackRule?.domain);
            if (!DEFAULT_DOMAIN_AUTO_SUBMIT_BACKFILL_DOMAINS.has(domainKey) || existingDomains.has(domainKey)) {
                return;
            }

            const clonedRule = cloneSerializable(fallbackRule, { fallback: fallbackRule }) || { ...fallbackRule };
            targetConfig.domainAutoSubmitSettings.push(clonedRule);
            existingDomains.add(domainKey);
            updated = true;
        });

        return updated;
    };

    const ensureDomainMetadata = (targetConfig = buttonConfig, options = {}) => {
        if (!targetConfig || typeof targetConfig !== 'object') {
            return false;
        }
        let updated = false;
        const fallbackDomainSettings = createFallbackConfigClone(options.locale).domainAutoSubmitSettings;
        if (!Array.isArray(targetConfig.domainAutoSubmitSettings)) {
            targetConfig.domainAutoSubmitSettings = cloneSerializable(fallbackDomainSettings, { fallback: fallbackDomainSettings }) || fallbackDomainSettings;
            updated = true;
        } else {
            const validRules = targetConfig.domainAutoSubmitSettings.filter((rule) => rule && typeof rule === 'object' && !Array.isArray(rule));
            if (validRules.length !== targetConfig.domainAutoSubmitSettings.length) {
                targetConfig.domainAutoSubmitSettings = validRules;
                updated = true;
            }
            updated = ensureBackfilledDefaultDomainAutoSubmitRules(targetConfig, fallbackDomainSettings) || updated;
        }

        (targetConfig.domainAutoSubmitSettings || []).forEach((rule) => {
            const normalizedMethod = normalizeAutoSubmitMethod(rule.method);
            if (rule.method !== normalizedMethod) {
                rule.method = normalizedMethod;
                updated = true;
            }
            const normalizedAdvanced = normalizeAutoSubmitAdvanced(rule.method, rule.methodAdvanced);
            if (normalizedAdvanced) {
                const currentAdvanced = rule.methodAdvanced && typeof rule.methodAdvanced === 'object'
                    ? JSON.stringify(rule.methodAdvanced)
                    : '';
                const nextAdvanced = JSON.stringify(normalizedAdvanced);
                if (currentAdvanced !== nextAdvanced) {
                    rule.methodAdvanced = normalizedAdvanced;
                    updated = true;
                }
            } else if (rule.methodAdvanced) {
                delete rule.methodAdvanced;
                updated = true;
            }
            if (!rule.favicon) {
                rule.favicon = generateDomainFavicon(rule.domain);
                updated = true;
            }
        });

        if (ensureStyleConfiguration(targetConfig)) {
            updated = true;
        }
        if (updated && !options.silent) {
            console.log(t('m_4167e112ae96'));
        }
        return updated;
    };

    const ensureToolFolder = (targetConfig = buttonConfig, options = {}) => {
        if (!targetConfig || typeof targetConfig !== 'object') {
            return false;
        }
        let updated = false;
        if (!targetConfig.folders || typeof targetConfig.folders !== 'object' || Array.isArray(targetConfig.folders)) {
            targetConfig.folders = {};
            updated = true;
        }
        const toolFolderName = TOOL_FOLDER_NAME;
        const defaultToolButtons = createDefaultToolButtons(options.locale || getLocale());

        if (!targetConfig.folders[toolFolderName] || typeof targetConfig.folders[toolFolderName] !== 'object' || Array.isArray(targetConfig.folders[toolFolderName])) {
            targetConfig.folders[toolFolderName] = {
                color: '#FFD700',
                textColor: '#ffffff',
                hidden: false,
                buttons: defaultToolButtons,
            };
            updated = true;
            if (!options.silent) {
                console.log(t('m_1a3a11c7369f', { folderName: toolFolderName }));
            }
            return updated;
        }

        if (!targetConfig.folders[toolFolderName].buttons || typeof targetConfig.folders[toolFolderName].buttons !== 'object' || Array.isArray(targetConfig.folders[toolFolderName].buttons)) {
            targetConfig.folders[toolFolderName].buttons = {};
            updated = true;
        }

        Object.entries(defaultToolButtons).forEach(([btnName, btnCfg]) => {
            if (!targetConfig.folders[toolFolderName].buttons[btnName]) {
                targetConfig.folders[toolFolderName].buttons[btnName] = btnCfg;
                updated = true;
                if (!options.silent) {
                    console.log(t('m_e55bc82d5fc4', {
                        buttonName: btnName,
                        folderName: toolFolderName,
                    }));
                }
            }
        });

        return updated;
    };

    const hydrateButtonConfigDefaults = (targetConfig = buttonConfig, options = {}) => {
        if (!targetConfig || typeof targetConfig !== 'object' || Array.isArray(targetConfig)) {
            return false;
        }
        let updated = false;
        const fallbackConfig = createFallbackConfigClone(options.locale);
        if (!targetConfig.folders || typeof targetConfig.folders !== 'object' || Array.isArray(targetConfig.folders)) {
            targetConfig.folders = cloneSerializable(fallbackConfig.folders, { fallback: fallbackConfig.folders }) || fallbackConfig.folders;
            updated = true;
        }
        const normalizedHeight = clampToolbarHeight(targetConfig.buttonBarHeight, fallbackConfig.buttonBarHeight);
        if (targetConfig.buttonBarHeight !== normalizedHeight) {
            targetConfig.buttonBarHeight = normalizedHeight;
            updated = true;
        }
        const normalizedBottomSpacing = clampBottomSpacing(targetConfig.buttonBarBottomSpacing, fallbackConfig.buttonBarBottomSpacing);
        const resolvedBottomSpacing = typeof normalizedBottomSpacing === 'number'
            ? normalizedBottomSpacing
            : fallbackConfig.buttonBarBottomSpacing;
        if (targetConfig.buttonBarBottomSpacing !== resolvedBottomSpacing) {
            targetConfig.buttonBarBottomSpacing = resolvedBottomSpacing;
            updated = true;
        }
        if (typeof targetConfig.showFolderIcons !== 'boolean') {
            targetConfig.showFolderIcons = fallbackConfig.showFolderIcons;
            updated = true;
        }
        updated = ensureButtonTypes(targetConfig, options) || updated;
        updated = ensureToolFolder(targetConfig, options) || updated;
        updated = ensureFolderOrder(targetConfig) || updated;
        updated = ensureDomainMetadata(targetConfig, options) || updated;
        return updated;
    };

    let buttonConfig = readPersistedButtonConfig();

    if (hydrateButtonConfigDefaults(buttonConfig)) {
        persistButtonConfig(buttonConfig);
    }

    // 变量：防止重复提交
    let isSubmitting = false;

    const isEditableElement = (node) => {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        const tag = node.tagName ? node.tagName.toLowerCase() : '';
        return tag === 'textarea' || node.isContentEditable;
    };

    const getDeepActiveElement = (root = document) => {
        const active = root && root.activeElement ? root.activeElement : null;
        if (active && active.shadowRoot && active.shadowRoot.activeElement) {
            return getDeepActiveElement(active.shadowRoot);
        }
        return active;
    };

    const findEditableDescendant = (root) => {
        if (!root) return null;
        if (isEditableElement(root)) return root;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node = walker.nextNode();
        while (node) {
            if (isEditableElement(node)) {
                return node;
            }
            if (node.shadowRoot) {
                const nested = findEditableDescendant(node.shadowRoot);
                if (nested) return nested;
            }
            node = walker.nextNode();
        }
        return null;
    };

    const getFocusedEditableElement = () => {
        const activeElement = getDeepActiveElement();
        if (isEditableElement(activeElement)) {
            return activeElement;
        }
        if (activeElement && activeElement.shadowRoot) {
            const shadowEditable = findEditableDescendant(activeElement.shadowRoot);
            if (shadowEditable) return shadowEditable;
        }
        if (activeElement) {
            const childEditable = findEditableDescendant(activeElement);
            if (childEditable) return childEditable;
        }
        const selection = typeof window !== 'undefined' ? window.getSelection() : null;
        const anchorElement = selection && selection.anchorNode ? selection.anchorNode.parentElement : null;
        if (isEditableElement(anchorElement)) {
            return anchorElement;
        }
        return null;
    };

    const getAllTextareas = (root = document) => {
        let textareas = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node = walker.nextNode();
        while (node) {
            if (isEditableElement(node)) {
                textareas.push(node);
            }
            if (node.shadowRoot) {
                textareas = textareas.concat(getAllTextareas(node.shadowRoot));
            }
            node = walker.nextNode();
        }
        return textareas;
    };

    const normalizeEditableText = (value) => String(value == null ? '' : value)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

    const readEditableText = (element) => {
        if (!isEditableElement(element)) {
            return '';
        }
        if (element.tagName.toLowerCase() === 'textarea') {
            return normalizeEditableText(element.value);
        }
        const text = typeof element.innerText === 'string'
            ? element.innerText
            : element.textContent || '';
        return normalizeEditableText(text);
    };

    const clearEditableText = (element, options = {}) => {
        if (!isEditableElement(element)) {
            return false;
        }
        insertTextSmart(element, '', true);
        if (options.focus) {
            element.focus();
            if (element.tagName.toLowerCase() === 'textarea') {
                element.selectionStart = element.selectionEnd = 0;
            }
        }
        return true;
    };

    /**
     * 增强版插入文本到textarea或contenteditable元素中，支持现代编辑器
     * @param {HTMLElement} target - 目标元素
     * @param {string} finalText - 要插入的文本
     * @param {boolean} replaceAll - 是否替换全部内容
     */
    const insertTextSmart = (target, finalText, replaceAll = false) => {
        const normalizedText = finalText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        if (target.tagName.toLowerCase() === 'textarea') {
            // 处理textarea - 保持原有逻辑
            if (replaceAll) {
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(target, normalizedText);
                target.selectionStart = target.selectionEnd = normalizedText.length;
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertReplacementText',
                    data: normalizedText,
                });
                target.dispatchEvent(inputEvent);
            } else {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(target, target.value.substring(0, start) + normalizedText + target.value.substring(end));
                target.selectionStart = target.selectionEnd = start + normalizedText.length;
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: normalizedText,
                });
                target.dispatchEvent(inputEvent);
            }
            target.focus();
        } else if (target.isContentEditable) {
            // 增强的contenteditable处理
            insertIntoContentEditable(target, normalizedText, replaceAll);
        }
    };

    /**
     * 专门处理contenteditable元素的文本插入
     * @param {HTMLElement} target - contenteditable元素
     * @param {string} text - 要插入的文本
     * @param {boolean} replaceAll - 是否替换全部内容
     */
    const insertIntoContentEditable = (target, text, replaceAll) => {
        // 检测编辑器类型
        const editorType = detectEditorType(target);

        target.focus();

        if (replaceAll) {
            // 替换全部内容
            clearContentEditable(target, editorType);
        }

        // 插入文本
        insertTextIntoEditor(target, text, editorType);

        // 触发事件和调整高度
        triggerEditorEvents(target, text, replaceAll);
        adjustEditorHeight(target, editorType);
    };

    /**
     * 检测编辑器类型
     * @param {HTMLElement} target
     * @returns {string} 编辑器类型
     */
    const detectEditorType = (target) => {
        // 检测ProseMirror
        if (target.classList.contains('ProseMirror') ||
            target.closest('.ProseMirror') ||
            target.querySelector('.ProseMirror-trailingBreak')) {
            return 'prosemirror';
        }

        // Gemini / Quill 编辑器
        if (target.classList.contains('ql-editor') ||
            target.closest('.ql-editor')) {
            return 'quill';
        }

        // 检测其他特殊编辑器
        if (target.hasAttribute('data-placeholder') ||
            target.querySelector('[data-placeholder]')) {
            return 'modern';
        }

        // 默认简单contenteditable
        return 'simple';
    };

    /**
     * 清空contenteditable内容
     * @param {HTMLElement} target
     * @param {string} editorType
     */
    const clearContentEditable = (target, editorType) => {
        if (editorType === 'prosemirror') {
            // ProseMirror需要保持基本结构
            const firstP = target.querySelector('p');
            if (firstP) {
                setTrustedHTML(firstP, '<br class="ProseMirror-trailingBreak">');
                // 删除其他段落
                const otherPs = target.querySelectorAll('p:not(:first-child)');
                otherPs.forEach(p => p.remove());
            } else {
                setTrustedHTML(target, '<p><br class="ProseMirror-trailingBreak"></p>');
            }
        } else if (editorType === 'quill') {
            setTrustedHTML(target, '<p><br></p>');
            target.classList.remove('ql-blank');
        } else {
            setTrustedHTML(target, '');
        }
    };

    /**
     * 向编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {string} editorType
     */
    const insertTextIntoEditor = (target, text, editorType) => {
        const selection = window.getSelection();

        if (editorType === 'prosemirror') {
            insertIntoProseMirror(target, text, selection);
        } else if (editorType === 'quill') {
            insertIntoQuillEditor(target, text, selection);
        } else {
            insertIntoSimpleEditor(target, text, selection);
        }

        // 确保光标位置正确
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    /**
     * 向ProseMirror编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoProseMirror = (target, text, selection) => {
        const lines = text.split('\n');
        let currentP = target.querySelector('p');

        if (!currentP) {
            currentP = document.createElement('p');
            target.appendChild(currentP);
        }

        // 清除现有内容但保持结构
        const trailingBreak = currentP.querySelector('.ProseMirror-trailingBreak');
        if (trailingBreak) {
            trailingBreak.remove();
        }

        lines.forEach((line, index) => {
            if (index > 0) {
                // 创建新段落
                currentP = document.createElement('p');
                target.appendChild(currentP);
            }

            if (line.trim() === '') {
                // 空行需要br
                const br = document.createElement('br');
                br.className = 'ProseMirror-trailingBreak';
                currentP.appendChild(br);
            } else {
                // 有内容的行
                currentP.appendChild(document.createTextNode(line));
                if (index === lines.length - 1) {
                    // 最后一行添加trailing break
                    const br = document.createElement('br');
                    br.className = 'ProseMirror-trailingBreak';
                    currentP.appendChild(br);
                }
            }
        });

        // 移除is-empty类
        target.classList.remove('is-empty', 'is-editor-empty');
        target.querySelectorAll('p').forEach(p => {
            p.classList.remove('is-empty', 'is-editor-empty');
        });
    };

    /**
     * 向 Quill 编辑器（Gemini 输入框）插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoQuillEditor = (target, text, selection) => {
        const createFragment = () => {
            const fragment = document.createDocumentFragment();
            const lines = text.split('\n');
            if (lines.length === 0) {
                lines.push('');
            }
            lines.forEach(line => {
                const p = document.createElement('p');
                if (line === '') {
                    p.appendChild(document.createElement('br'));
                } else {
                    p.appendChild(document.createTextNode(line));
                }
                fragment.appendChild(p);
            });
            return fragment;
        };

        const hasValidSelection = selection &&
            selection.rangeCount > 0 &&
            target.contains(selection.getRangeAt(0).startContainer) &&
            target.contains(selection.getRangeAt(0).endContainer);

        if (hasValidSelection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(createFragment());
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const isEmpty = target.classList.contains('ql-blank') || !target.textContent.trim();
            if (isEmpty) {
                setTrustedHTML(target, '');
            }
            target.appendChild(createFragment());
        }

        target.classList.remove('ql-blank');
    };

    /**
     * 向简单编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoSimpleEditor = (target, text, selection) => {
        const lines = text.split('\n');
        const fragment = document.createDocumentFragment();

        lines.forEach((line, index) => {
            if (line === '') {
                fragment.appendChild(document.createElement('br'));
            } else {
                fragment.appendChild(document.createTextNode(line));
            }

            if (index < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        // 使用Selection API插入
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(fragment);
            range.collapse(false);
        } else {
            target.appendChild(fragment);
        }
    };

    /**
     * 触发编辑器事件
     * @param {HTMLElement} target
     * @param {string} text
     * @param {boolean} replaceAll
     */
    const triggerEditorEvents = (target, text, replaceAll) => {
        // 触发多种事件确保兼容性
        const events = [
            new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: replaceAll ? 'insertReplacementText' : 'insertText',
                data: text
            }),
            new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: replaceAll ? 'insertReplacementText' : 'insertText',
                data: text
            }),
            new Event('change', { bubbles: true }),
            new KeyboardEvent('keyup', { bubbles: true }),
            new Event('blur', { bubbles: true }),
            new Event('focus', { bubbles: true })
        ];

        events.forEach(event => {
            try {
                target.dispatchEvent(event);
            } catch (e) {
                console.warn(t('m_fda475caeb26'), e);
            }
        });

        // 特殊处理：触发compositionend事件（某些框架需要）
        try {
            const compositionEvent = new CompositionEvent('compositionend', {
                bubbles: true,
                data: text
            });
            target.dispatchEvent(compositionEvent);
        } catch (e) {
            // CompositionEvent可能不被支持，忽略错误
        }
    };

    /**
     * 调整编辑器高度
     * @param {HTMLElement} target
     * @param {string} editorType
     */
    const adjustEditorHeight = (target, editorType) => {
        // 查找可能需要调整的容器
        const containers = [
            target,
            target.parentElement,
            target.closest('[style*="height"]'),
            target.closest('[style*="max-height"]'),
            target.closest('.overflow-hidden'),
            target.closest('[style*="overflow"]')
        ].filter(Boolean);

        containers.forEach(container => {
            try {
                // 移除可能阻止显示的样式
                if (container.style.height && container.style.height !== 'auto') {
                    const currentHeight = parseInt(container.style.height);
                    if (currentHeight < 100) { // 只调整明显过小的高度
                        container.style.height = 'auto';
                        container.style.minHeight = currentHeight + 'px';
                    }
                }

                // 确保显示滚动条
                if (container.style.overflowY === 'hidden') {
                    container.style.overflowY = 'auto';
                }

                // 对于特定的编辑器容器，强制最小高度
                if (editorType === 'prosemirror' && container === target) {
                    container.style.minHeight = '3rem';
                }

            } catch (e) {
                console.warn(t('m_ba944be97d20'), e);
            }
        });

        // 触发resize事件
        setTimeout(() => {
            try {
                window.dispatchEvent(new Event('resize'));
                target.dispatchEvent(new Event('resize'));
            } catch (e) {
                console.warn(t('m_340914857032'), e);
            }
        }, 100);
    };

    /**
   * 轮询检测输入框内容是否与预期文本一致。
   * @param {HTMLElement} element - 要检测的textarea或contenteditable元素。
   * @param {string} expectedText - 期望出现的文本。
   * @param {number} interval - 轮询时间间隔（毫秒）。
   * @param {number} maxWait - 最大等待时长（毫秒），超时后reject。
   * @returns {Promise<void>} - 匹配成功resolve，否则reject。
   */
    async function waitForContentMatch(element, expectedText, interval = 100, maxWait = 3000) {
        return new Promise((resolve, reject) => {
            let elapsed = 0;
            const timer = setInterval(() => {
                elapsed += interval;
                const currentVal = (element.tagName.toLowerCase() === 'textarea')
                    ? element.value
                    : element.innerText; // contenteditable时用innerText

                if (currentVal === expectedText) {
                    clearInterval(timer);
                    resolve();
                } else if (elapsed >= maxWait) {
                    clearInterval(timer);
                    reject(new Error("waitForContentMatch: 超时，输入框内容未能匹配预期文本"));
                }
            }, interval);
        });
    }

    // 定义等待提交按钮的函数
    const waitForSubmitButton = async (maxAttempts = 10, delay = 300) => {
        for (let i = 0; i < maxAttempts; i++) {
            const submitButton = document.querySelector('button[type="submit"], button[data-testid="send-button"]');
            if (submitButton && !submitButton.disabled && submitButton.offsetParent !== null) {
                return submitButton;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return null;
    };

    // 定义等待时间和尝试次数
    const SUBMIT_WAIT_MAX_ATTEMPTS = 10;
    const SUBMIT_WAIT_DELAY = 300; // 毫秒

    const waitForElementBySelector = async (selector, maxAttempts = SUBMIT_WAIT_MAX_ATTEMPTS, delay = SUBMIT_WAIT_DELAY) => {
        if (!selector) return null;
        for (let i = 0; i < maxAttempts; i++) {
            let element = null;
            try {
                element = document.querySelector(selector);
            } catch (error) {
                console.warn(t('m_494899e0f5df', { selector }), error);
                return null;
            }

            if (element) {
                const isDisabled = typeof element.disabled === 'boolean' && element.disabled;
                if (!isDisabled) {
                    return element;
                }
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return null;
    };

    function simulateEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }

    function simulateCmdEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            metaKey: true
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }

    function simulateCtrlEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            ctrlKey: true
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }
    // 定义多种提交方式
    const submitForm = async () => {
        if (isSubmitting) {
            console.warn(t('m_4ad738c53452'));
            return false;
        }
        isSubmitting = true;
        try {
              const domainRules = buttonConfig.domainAutoSubmitSettings || [];
              const currentURL = window.location.href;
              const matchedRule = domainRules.find(rule => currentURL.includes(rule.domain));

              if (matchedRule) {
                  console.log(t('m_ff95ea626043'), matchedRule);
                  const normalizedMethod = normalizeAutoSubmitMethod(matchedRule.method);
                  switch (normalizedMethod) {
                      case AUTO_SUBMIT_METHODS.ENTER: {
                          simulateEnterKey();
                          isSubmitting = false;
                          return true;
                      }
                      case AUTO_SUBMIT_METHODS.MODIFIER_ENTER: {
                          const variant = matchedRule.methodAdvanced && matchedRule.methodAdvanced.variant === 'ctrl'
                              ? 'ctrl'
                              : 'cmd';
                          if (variant === 'ctrl') {
                              simulateCtrlEnterKey();
                              console.log(t('m_437dc4757804'));
                          } else {
                              simulateCmdEnterKey();
                              console.log(t('m_73d95e612d17'));
                          }
                          isSubmitting = false;
                          return true;
                      }
                      case AUTO_SUBMIT_METHODS.CLICK_SUBMIT: {
                          const advanced = matchedRule.methodAdvanced || {};
                          const selector = typeof advanced.selector === 'string' ? advanced.selector.trim() : '';
                          if (advanced.variant === 'selector' && selector) {
                              const customButton = await waitForElementBySelector(selector, SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                              if (customButton) {
                                  customButton.click();
                                  console.log(t('m_e9599b643355', { selector }));
                                  isSubmitting = false;
                                  return true;
                              }
                              console.warn(t('m_1a858143640c', { selector }));
                          }
                          const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                          if (submitButton) {
                              submitButton.click();
                              console.log(t('m_7a265525b90d'));
                              isSubmitting = false;
                              return true;
                          } else {
                              console.warn(t('m_bf5ff5754947'));
                          }
                          break;
                      }
                      default:
                          console.warn(t('m_4e6276dcd70a'));
                          break;
                  }
            }
            // 1. 尝试键盘快捷键提交
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const submitKeys = isMac ? ['Enter', 'Meta+Enter'] : ['Enter', 'Control+Enter'];
            for (const keyCombo of submitKeys) {
                const [key, modifier] = keyCombo.split('+');
                const eventInit = {
                    bubbles: true,
                    cancelable: true,
                    key: key,
                    code: key,
                    keyCode: key.charCodeAt(0),
                    which: key.charCodeAt(0),
                };
                if (modifier === 'Meta') eventInit.metaKey = true;
                if (modifier === 'Control') eventInit.ctrlKey = true;
                const keyboardEvent = new KeyboardEvent('keydown', eventInit);
                document.activeElement.dispatchEvent(keyboardEvent);
                console.log(t('m_0c63ec5814d3', { combo: keyCombo }));
                // 等待短暂时间，查看是否提交成功
                await new Promise(resolve => setTimeout(resolve, 500));
                // 检查是否页面已提交（可以通过某种标识来确认）
                // 这里假设页面会有某种变化，如URL变化或特定元素出现
                // 由于具体实现不同，这里仅提供日志
            }

            // 2. 尝试点击提交按钮
            const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
            if (submitButton) {
                submitButton.click();
                console.log(t('m_6a1cff602ef2'));
                return true;
            } else {
                console.warn(t('m_f6a567f27fb0'));
            }

            // 3. 确保事件监听器触发
            // 重新触发 'submit' 事件
            try {
                const form = document.querySelector('form');
                if (form) {
                    const submitEvent = new Event('submit', {
                        bubbles: true,
                        cancelable: true
                    });
                    form.dispatchEvent(submitEvent);
                    console.log(t('m_0812cae9b471'));
                    return true;
                } else {
                    console.warn(t('m_81e2ed5c556d'));
                }
            } catch (error) {
                console.error(t('i18n.log.submit_event_failed'), error);
            }

            console.warn(t('m_79f0f2a32a09'));
            return false;
        } finally {
            isSubmitting = false;
        }
    };

    const setButtonConfig = (nextConfig) => {
        buttonConfig = nextConfig && typeof nextConfig === 'object' && !Array.isArray(nextConfig)
            ? nextConfig
            : createFallbackConfigClone();
        return buttonConfig;
    };

export {
    appendToMainLayer,
    appendToOverlayLayer,
    applyLanguagePreference,
    autoResizeTextarea,
    buttonConfig,
    clearEditableText,
    createAutoFaviconIcon,
    createDefaultConfig,
    createDialogCloseIconButton,
    createFaviconElement,
    createUnifiedDialog,
    defaultConfig,
    generateDomainFavicon,
    getAllTextareas,
    getLanguagePreference,
    getCurrentTheme,
    getFocusedEditableElement,
    getShadowRoot,
    hydrateI18nBindings,
    hydrateButtonConfigDefaults,
    insertTextSmart,
    isDarkMode,
    isEditableElement,
    isNonChineseLocale,
    persistButtonConfig,
    queryUI,
    readEditableText,
    registerLocaleRefresh,
    releaseI18nBindings,
    refreshI18nTree,
    setButtonConfig,
    setCSSVariables,
    setTrustedHTML,
    styles,
    submitForm,
    t,
    AUTO_SUBMIT_METHODS,
    TOOL_DEFAULT_ICONS,
    waitForContentMatch,
    normalizeAutoSubmitMethod,
};
