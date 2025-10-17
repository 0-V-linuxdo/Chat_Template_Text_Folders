/* -------------------------------------------------------------------------- *
 * Module 01 · Core runtime services (globals, utilities, config bootstrapping)
 * -------------------------------------------------------------------------- */

(function () {
    'use strict';

    console.log("🎉 [Chat] Template Text Folders [20251018] v1.0.0 🎉");

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

    const setTrustedHTML = (element, html) => {
        if (!element) {
            return;
        }
        const value = typeof html === 'string' ? html : (html == null ? '' : String(html));
        const policy = resolveTrustedTypes();
        if (policy) {
            element.innerHTML = policy.createHTML(value);
        } else {
            element.innerHTML = value;
        }
    };

    const UI_HOST_ID = 'cttf-ui-host';
    let latestThemeValues = null;
    let uiShadowRoot = null;
    let uiMainLayer = null;
    let uiOverlayLayer = null;

    const getLocaleBridge = () => {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.CTTFLocaleConfig) {
            return unsafeWindow.CTTFLocaleConfig;
        }
        if (typeof window !== 'undefined' && window.CTTFLocaleConfig) {
            return window.CTTFLocaleConfig;
        }
        return null;
    };

    const applyReplacementsFallback = (text, replacements) => {
        if (!text || !replacements) {
            return text;
        }
        let result = text;
        Object.entries(replacements).forEach(([key, value]) => {
            const safeValue = value == null ? '' : String(value);
            result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), safeValue);
        });
        return result;
    };

    const t = (sourceText, replacements, overrideLocale) => {
        const localeConfig = getLocaleBridge();
        if (localeConfig && typeof localeConfig.translate === 'function') {
            try {
                return localeConfig.translate(sourceText, replacements, overrideLocale);
            } catch (error) {
                console.warn('[Chat] Template Text Folders i18n translate error:', error);
            }
        }
        return applyReplacementsFallback(sourceText, replacements);
    };

    const isNonChineseLocale = () => {
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.getLocale !== 'function') {
            return false;
        }
        const locale = localeConfig.getLocale();
        return locale ? !/^zh(?:-|$)/i.test(locale) : false;
    };

    const LOCALIZABLE_ATTRIBUTES = ['title', 'placeholder', 'aria-label', 'aria-description', 'aria-describedby', 'data-tooltip'];
    const LANGUAGE_PREFERENCE_STORAGE_KEY = 'cttf-language-preference';

    let translationsCache = null;
    let reverseTranslationsCache = {};

    const normalizeLocaleKey = (locale) => {
        if (!locale) {
            return 'en';
        }
        const lower = locale.toLowerCase();
        if (lower.startsWith('zh')) {
            return 'zh';
        }
        return 'en';
    };

    const getTranslationsCache = () => {
        if (translationsCache) {
            return translationsCache;
        }
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.getTranslations !== 'function') {
            return null;
        }
        try {
            translationsCache = localeConfig.getTranslations();
            reverseTranslationsCache = {};
            return translationsCache;
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to obtain translations map:', error);
            translationsCache = null;
            return null;
        }
    };

    const resolveI18nKey = (rawValue, locale) => {
        if (!rawValue) {
            return null;
        }
        const cache = getTranslationsCache();
        if (!cache) {
            return null;
        }
        const normalizedLocale = normalizeLocaleKey(locale);
        const trimmedValue = rawValue.trim();
        if (!trimmedValue) {
            return null;
        }

        if (normalizedLocale === 'zh') {
            const zhDict = cache.zh || {};
            if (Object.prototype.hasOwnProperty.call(zhDict, trimmedValue)) {
                return trimmedValue;
            }
        }

        const ensureReverseIndex = (loc) => {
            if (!reverseTranslationsCache[loc]) {
                const dict = cache[loc] || {};
                const reverseMap = {};
                Object.entries(dict).forEach(([key, value]) => {
                    if (typeof value === 'string' && value.trim()) {
                        reverseMap[value] = key;
                    }
                });
                reverseTranslationsCache[loc] = reverseMap;
            }
            return reverseTranslationsCache[loc];
        };

        const reverseForLocale = ensureReverseIndex(normalizedLocale);
        if (reverseForLocale && reverseForLocale[trimmedValue]) {
            return reverseForLocale[trimmedValue];
        }

        const zhDict = cache.zh || {};
        if (Object.prototype.hasOwnProperty.call(zhDict, trimmedValue)) {
            return trimmedValue;
        }

        return null;
    };

    const localizeElement = (root) => {
        if (!root) {
            return root;
        }

        const getCurrentLocale = () => {
            const localeConfig = getLocaleBridge();
            if (!localeConfig || typeof localeConfig.getLocale !== 'function') {
                return null;
            }
            return localeConfig.getLocale();
        };

        const locale = getCurrentLocale();
        const normalizedLocaleKey = normalizeLocaleKey(locale || '');
        const isChineseLocale = normalizedLocaleKey === 'zh';

        const translateTextNode = (node) => {
            const original = node.nodeValue;
            if (!original) {
                return;
            }
            const storedOriginal = node.__cttfLocaleOriginal ?? original;
            if (node.__cttfLocaleOriginal == null) {
                node.__cttfLocaleOriginal = original;
            }
            const trimmed = storedOriginal.trim();
            if (!trimmed) {
                return;
            }
            let translationKey = node.__cttfLocaleKey || null;
            if (!translationKey) {
                translationKey = resolveI18nKey(trimmed, locale);
                if (translationKey) {
                    node.__cttfLocaleKey = translationKey;
                }
            }
            const sourceText = translationKey || trimmed;
            const startIdx = storedOriginal.indexOf(trimmed);
            const prefix = startIdx >= 0 ? storedOriginal.slice(0, startIdx) : '';
            const suffix = startIdx >= 0 ? storedOriginal.slice(startIdx + trimmed.length) : '';

            if (isChineseLocale) {
                const target = `${prefix}${sourceText}${suffix}`;
                if (node.nodeValue !== target) {
                    node.nodeValue = target;
                }
                return;
            }

            const translated = t(sourceText);
            const targetContent = translated === sourceText ? sourceText : translated;
            const target = `${prefix}${targetContent}${suffix}`;
            if (node.nodeValue !== target) {
                node.nodeValue = target;
            }
        };

        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return root;
        }

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let currentNode = walker.nextNode();
        while (currentNode) {
            translateTextNode(currentNode);
            currentNode = walker.nextNode();
        }

        const elements = root.nodeType === Node.ELEMENT_NODE
            ? [root, ...root.querySelectorAll('*')]
            : root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];

        elements.forEach((el) => {
            if (!el.__cttfAttrOriginals) {
                el.__cttfAttrOriginals = {};
            }
            LOCALIZABLE_ATTRIBUTES.forEach((attr) => {
                if (!el.hasAttribute(attr)) {
                    return;
                }
                const value = el.getAttribute(attr);
                if (!value) {
                    return;
                }
                if (!el.__cttfAttrOriginals[attr]) {
                    el.__cttfAttrOriginals[attr] = value;
                }
                if (!el.__cttfAttrKeys) {
                    el.__cttfAttrKeys = {};
                }
                const originalValue = el.__cttfAttrOriginals[attr];
                let attrKey = el.__cttfAttrKeys[attr] || null;
                if (!attrKey) {
                    attrKey = resolveI18nKey(originalValue, locale);
                    if (attrKey) {
                        el.__cttfAttrKeys[attr] = attrKey;
                    }
                }
                const sourceValue = attrKey || originalValue;
                if (isChineseLocale) {
                    if (value !== sourceValue) {
                        el.setAttribute(attr, sourceValue);
                    }
                    return;
                }
                const translated = t(sourceValue);
                if (translated !== sourceValue) {
                    el.setAttribute(attr, translated);
                } else if (value !== sourceValue) {
                    el.setAttribute(attr, sourceValue);
                }
            });
        });

        return root;
    };

    let localizationObserver = null;
    let localizationScheduled = false;
    const scheduleLocalization = () => {
        if (localizationScheduled) {
            return;
        }
        localizationScheduled = true;
        requestAnimationFrame(() => {
            localizationScheduled = false;
            if (uiShadowRoot) {
                localizeElement(uiShadowRoot);
            }
        });
    };

    const ensureLocalizationObserver = () => {
        if (!uiShadowRoot || localizationObserver) {
            return;
        }
        localizationObserver = new MutationObserver(() => scheduleLocalization());
        localizationObserver.observe(uiShadowRoot, { childList: true, subtree: true, attributes: true, characterData: true });
        scheduleLocalization();
    };

    let localizationRetryCount = 0;
    const trySetupLocalizationLater = () => {
        if (localizationObserver || localizationRetryCount > 10) {
            return;
        }
        if (!getLocaleBridge()) {
            localizationRetryCount += 1;
            setTimeout(trySetupLocalizationLater, 600);
            return;
        }
        ensureLocalizationObserver();
    };

    const readLanguagePreference = () => {
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
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.setLocale !== 'function') {
            console.warn('[Chat] Template Text Folders] Locale bridge unavailable, cannot apply language preference.');
            return null;
        }

        const normalizedPreference = preference === 'zh' || preference === 'en' ? preference : 'auto';
        let targetLocale = normalizedPreference;

        if (normalizedPreference === 'auto') {
            if (typeof localeConfig.detectBrowserLocale === 'function') {
                targetLocale = localeConfig.detectBrowserLocale();
            } else {
                targetLocale = 'en';
            }
        }

        if (!targetLocale) {
            targetLocale = 'en';
        }

        const appliedLocale = localeConfig.setLocale(targetLocale);

        if (!options.skipSave) {
            writeLanguagePreference(normalizedPreference);
        }

        translationsCache = null;
        reverseTranslationsCache = {};

        scheduleLocalization();
        ensureLocalizationObserver();
        if (uiShadowRoot) {
            localizeElement(uiShadowRoot);
        }

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
        const localeConfig = getLocaleBridge();
        if (!localeConfig) {
            setTimeout(initializeLanguagePreference, 200);
            return;
        }
        const storedPreference = readLanguagePreference();
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

        ensureLocalizationObserver();
        trySetupLocalizationLater();

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
        localizeElement(appended);
        scheduleLocalization();
        return appended;
    };

    const appendToOverlayLayer = (node) => {
        const container = getOverlayLayer();
        const appended = container ? container.appendChild(node) : document.body.appendChild(node);
        localizeElement(appended);
        scheduleLocalization();
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

    // 用于统一创建 overlay + dialog，样式与默认逻辑保持一致
    // 复用时只需传入自定义的内容与回调，外观也可统一
    function createUnifiedDialog(options) {
        const {
            title = t('弹窗标题'),
            width = '400px',
            maxHeight = '80vh',
            onClose = null, // 关闭时的回调
            closeOnOverlayClick = true
        } = options;

        // 创建overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'var(--overlay-bg, rgba(0,0,0,0.5))';
        overlay.style.backdropFilter = 'blur(2px)';
        overlay.style.zIndex = '12000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';

        // 创建dialog
        const dialog = document.createElement('div');
        dialog.classList.add('cttf-dialog');
        dialog.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        dialog.style.color = 'var(--text-color, #333333)';
        dialog.style.borderRadius = '4px';
        dialog.style.padding = '24px';
        dialog.style.boxShadow = '0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))';
        dialog.style.border = '1px solid var(--border-color, #e5e7eb)';
        dialog.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        dialog.style.width = width;
        dialog.style.maxWidth = '95vw';
        dialog.style.maxHeight = maxHeight;
        dialog.style.overflowY = 'auto';
        dialog.style.transform = 'scale(0.95)';

        // 标题
        const titleEl = document.createElement('h2');
        titleEl.textContent = t(title);
        titleEl.style.margin = '0';
        titleEl.style.marginBottom = '12px';
        titleEl.style.fontSize = '18px';
        titleEl.style.fontWeight = '600';
        dialog.appendChild(titleEl);

        // 向overlay添加dialog
        overlay.appendChild(dialog);

        // 将 overlay 挂载到 Shadow DOM 覆盖层
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);

        // 入场动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        if (closeOnOverlayClick) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    if (onClose) onClose();
                    overlay.remove();
                }
            });
        } else {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        }

        return { overlay, dialog };
    }

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
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--overlay-bg, rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(2px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.3s ease, opacity 0.3s ease'
        },
        dialog: {
            position: 'relative',
            backgroundColor: 'var(--dialog-bg, #ffffff)',
            color: 'var(--text-color, #333333)',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))',
            border: '1px solid var(--border-color, #e5e7eb)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
        },
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

    // 默认按钮
    const userProvidedButtons = {
        "Review": {
            type: "template",
            text: "You are a code review expert:\n\n{clipboard}\n\nProvide constructive feedback and improvements.\n",
            color: "#E6E0FF",
            textColor: "#333333",
            autoSubmit: false // 新增字段
        },
        // ... (其他默认按钮保持不变)
        "解释": {
            type: "template",
            text: "Explain the following code concisely:\n\n{clipboard}\n\nFocus on key functionality and purpose.\n",
            color: "#ffebcc",
            textColor: "#333333",
            autoSubmit: false // 新增字段
        }
    };

    // 默认工具按钮
    const defaultToolButtons = {
        "剪切": {
            type: "tool",
            action: "cut",
            color: "#FFC1CC",
            textColor: "#333333"
        },
        "复制": {
            type: "tool",
            action: "copy",
            color: "#C1FFD7",
            textColor: "#333333"
        },
        "粘贴": {
            type: "tool",
            action: "paste",
            color: "#C1D8FF",
            textColor: "#333333"
        },
        "清空": {
            type: "tool",
            action: "clear",
            color: "#FFD1C1",
            textColor: "#333333"
        }
    };
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

    // 默认配置
    const defaultConfig = {
        folders: {
            "默认": {
                color: "#3B82F6",
                textColor: "#ffffff",
                hidden: false, // 新增隐藏状态字段
                buttons: userProvidedButtons
            },
            "🖱️": {
                color: "#FFD700", // 金色，可根据需求调整
                textColor: "#ffffff",
                hidden: false, // 新增隐藏状态字段
                buttons: defaultToolButtons
            }
        },
        folderOrder: ["默认", "🖱️"],
        domainAutoSubmitSettings: [
            {
                domain: "chatgpt.com",
                name: "ChatGPT",
                method: "模拟点击提交按钮",
                favicon: generateDomainFavicon("chatgpt.com")
            },
            {
                domain: "chathub.gg",
                name: "ChatHub",
                method: "Enter",
                favicon: generateDomainFavicon("chathub.gg")
            }
        ],
        /**
         * domainStyleSettings: 数组，每个元素结构示例：
         * {
         *   domain: "chatgpt.com",
         *   name: "ChatGPT自定义样式",
         *   height: 90,
         *   cssCode: ".some-class { color: red; }"
         * }
         */
        domainStyleSettings: [],
        showFolderIcons: false
    };

    defaultConfig.buttonBarHeight = 40;
    defaultConfig.buttonBarBottomSpacing = 0;

    let buttonConfig = JSON.parse(localStorage.getItem('chatGPTButtonFoldersConfig')) || JSON.parse(JSON.stringify(defaultConfig));

    let configAdjusted = false;

    if (!Array.isArray(buttonConfig.domainStyleSettings)) {
        buttonConfig.domainStyleSettings = [];
        configAdjusted = true;
    }

    if (typeof buttonConfig.buttonBarHeight !== 'number') {
        buttonConfig.buttonBarHeight = defaultConfig.buttonBarHeight;
        configAdjusted = true;
    }

    if (typeof buttonConfig.buttonBarBottomSpacing !== 'number') {
        buttonConfig.buttonBarBottomSpacing = defaultConfig.buttonBarBottomSpacing;
        configAdjusted = true;
    }
    const clampedBottomSpacing = Math.max(-200, Math.min(200, Number(buttonConfig.buttonBarBottomSpacing) || 0));
    if (buttonConfig.buttonBarBottomSpacing !== clampedBottomSpacing) {
        buttonConfig.buttonBarBottomSpacing = clampedBottomSpacing;
        configAdjusted = true;
    }

    if (typeof buttonConfig.showFolderIcons !== 'boolean') {
        buttonConfig.showFolderIcons = false;
        configAdjusted = true;
    }

    if (configAdjusted) {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
    }

    // 若本地无此字段，则初始化
    if (!buttonConfig.domainAutoSubmitSettings) {
        buttonConfig.domainAutoSubmitSettings = JSON.parse(
            JSON.stringify(defaultConfig.domainAutoSubmitSettings)
        );
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
    }

    // 确保所有按钮都有'type'字段
    const ensureButtonTypes = () => {
        let updated = false;
        Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
            // 确保文件夹有hidden字段
            if (typeof folderConfig.hidden !== 'boolean') {
                folderConfig.hidden = false;
                updated = true;
            }

            Object.entries(folderConfig.buttons).forEach(([btnName, btnConfig]) => {
                if (!btnConfig.type) {
                    if (folderName === "🖱️") {
                        btnConfig.type = "tool";
                        updated = true;
                    } else {
                        btnConfig.type = "template";
                        updated = true;
                    }
                }
                // 确保 'autoSubmit' 字段存在，对于模板按钮
                if (btnConfig.type === "template" && typeof btnConfig.autoSubmit !== 'boolean') {
                    btnConfig.autoSubmit = false;
                    updated = true;
                }
                if (btnConfig.type === "template" && typeof btnConfig.favicon !== 'string') {
                    btnConfig.favicon = '';
                    updated = true;
                }
            });
        });
        if (updated) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t("✅ 已确保所有按钮具有'type'、'autoSubmit'、'favicon'配置，以及文件夹具有'hidden'字段。"));
        }
    };

    const ensureDomainMetadata = () => {
        let updated = false;
        (buttonConfig.domainAutoSubmitSettings || []).forEach(rule => {
            if (!rule.favicon) {
                rule.favicon = generateDomainFavicon(rule.domain);
                updated = true;
            }
        });
        (buttonConfig.domainStyleSettings || []).forEach(item => {
            if (!item.favicon) {
                item.favicon = generateDomainFavicon(item.domain);
                updated = true;
            }
            if (typeof item.bottomSpacing !== 'number') {
                item.bottomSpacing = buttonConfig.buttonBarBottomSpacing;
                updated = true;
            } else {
                const clamped = Math.max(-200, Math.min(200, Number(item.bottomSpacing) || 0));
                if (clamped !== item.bottomSpacing) {
                    item.bottomSpacing = clamped;
                    updated = true;
                }
            }
        });
        if (updated) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t('✅ 已为自动化与样式配置补全 favicon 信息。'));
        }
    };

    ensureButtonTypes();
    ensureDomainMetadata();

    // 确保工具文件夹存在并包含必要的工具按钮
    const ensureToolFolder = () => {
        const toolFolderName = "🖱️";
        if (!buttonConfig.folders[toolFolderName]) {
            buttonConfig.folders[toolFolderName] = {
                color: "#FFD700",
                textColor: "#ffffff",
                buttons: defaultToolButtons
            };
            buttonConfig.folderOrder.push(toolFolderName);
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t('✅ 工具文件夹 "{{folderName}}" 已添加到配置中。', { folderName: toolFolderName }));
        } else {
            // 确保工具按钮存在
            Object.entries(defaultToolButtons).forEach(([btnName, btnCfg]) => {
                if (!buttonConfig.folders[toolFolderName].buttons[btnName]) {
                    buttonConfig.folders[toolFolderName].buttons[btnName] = btnCfg;
                    console.log(t('✅ 工具按钮 "{{buttonName}}" 已添加到文件夹 "{{folderName}}"。', {
                        buttonName: btnName,
                        folderName: toolFolderName
                    }));
                }
            });
        }
    };
    ensureToolFolder();

    // 变量：防止重复提交
    let isSubmitting = false;
    // 占位函数，避免在真正实现前调用报错
    let applyDomainStyles = () => {};
    let updateButtonBarLayout = () => {};

    const getAllTextareas = (root = document) => {
        let textareas = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node = walker.nextNode();
        while (node) {
            if (node.tagName && (node.tagName.toLowerCase() === 'textarea' || node.getAttribute('contenteditable') === 'true')) {
                textareas.push(node);
            }
            if (node.shadowRoot) {
                textareas = textareas.concat(getAllTextareas(node.shadowRoot));
            }
            node = walker.nextNode();
        }
        return textareas;
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
        } else if (target.getAttribute('contenteditable') === 'true') {
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
                console.warn('事件触发失败:', e);
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
                console.warn('高度调整失败:', e);
            }
        });

        // 触发resize事件
        setTimeout(() => {
            try {
                window.dispatchEvent(new Event('resize'));
                target.dispatchEvent(new Event('resize'));
            } catch (e) {
                console.warn('resize事件触发失败:', e);
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
                console.warn(t('⚠️ 自定义选择器 "{{selector}}" 解析失败:', { selector }), error);
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
            console.warn(t('⚠️ 提交正在进行中，跳过重复提交。'));
            return false;
        }
        isSubmitting = true;
        try {
              const domainRules = buttonConfig.domainAutoSubmitSettings || [];
              const currentURL = window.location.href;
              const matchedRule = domainRules.find(rule => currentURL.includes(rule.domain));

              if (matchedRule) {
                  console.log(t('🔎 检测到本域名匹配的自动提交规则：'), matchedRule);
                  switch (matchedRule.method) {
                      case "Enter": {
                          simulateEnterKey();
                          isSubmitting = false;
                          return true;
                      }
                      case "Cmd+Enter": {
                          const variant = matchedRule.methodAdvanced && matchedRule.methodAdvanced.variant === 'ctrl'
                              ? 'ctrl'
                              : 'cmd';
                          if (variant === 'ctrl') {
                              simulateCtrlEnterKey();
                              console.log(t('✅ 已根据自动化规则，触发 Ctrl + Enter 提交。'));
                          } else {
                              simulateCmdEnterKey();
                              console.log(t('✅ 已根据自动化规则，触发 Cmd + Enter 提交。'));
                          }
                          isSubmitting = false;
                          return true;
                      }
                      case "模拟点击提交按钮": {
                          const advanced = matchedRule.methodAdvanced || {};
                          const selector = typeof advanced.selector === 'string' ? advanced.selector.trim() : '';
                          if (advanced.variant === 'selector' && selector) {
                              const customButton = await waitForElementBySelector(selector, SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                              if (customButton) {
                                  customButton.click();
                                  console.log(t('✅ 已根据自动化规则，自定义选择器 "{{selector}}" 提交。', { selector }));
                                  isSubmitting = false;
                                  return true;
                              }
                              console.warn(t('⚠️ 自定义选择器 "{{selector}}" 未匹配到提交按钮，尝试默认规则。', { selector }));
                          }
                          const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                          if (submitButton) {
                              submitButton.click();
                              console.log(t('✅ 已根据自动化规则，模拟点击提交按钮。'));
                              isSubmitting = false;
                              return true;
                          } else {
                              console.warn(t('⚠️ 未找到提交按钮，进入fallback...'));
                          }
                          break;
                      }
                      default:
                          console.warn(t('⚠️ 未知自动提交方式，进入fallback...'));
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
                console.log(t('尝试通过键盘快捷键提交表单：{{combo}}', { combo: keyCombo }));
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
                console.log(t('✅ 自动提交已通过点击提交按钮触发。'));
                return true;
            } else {
                console.warn(t('⚠️ 未找到提交按钮，尝试其他提交方式。'));
            }

            // 3. 尝试调用JavaScript提交函数
            // 需要知道具体的提交函数名称，这里假设为 `submitForm`
            // 根据实际情况调整函数名称
            try {
                if (typeof submitForm === 'function') {
                    submitForm();
                    console.log(t('✅ 自动提交已通过调用JavaScript函数触发。'));
                    return true;
                } else {
                    console.warn(t("⚠️ 未找到名为 'submitForm' 的提交函数。"));
                }
            } catch (error) {
                console.error("调用JavaScript提交函数失败:", error);
            }

            // 4. 确保事件监听器触发
            // 重新触发 'submit' 事件
            try {
                const form = document.querySelector('form');
                if (form) {
                    const submitEvent = new Event('submit', {
                        bubbles: true,
                        cancelable: true
                    });
                    form.dispatchEvent(submitEvent);
                    console.log(t("✅ 自动提交已通过触发 'submit' 事件触发。"));
                    return true;
                } else {
                    console.warn(t("⚠️ 未找到表单元素，无法触发 'submit' 事件。"));
                }
            } catch (error) {
                console.error("触发 'submit' 事件失败:", error);
            }

            console.warn(t('⚠️ 所有自动提交方式均未成功。'));
            return false;
        } finally {
            isSubmitting = false;
        }
    };





    // Toolbar-specific interactions are implemented in src/modules/02-toolbar.js
    let createCustomButton = (name, config, folderName) => {
        console.warn('createCustomButton is not initialized yet.');
        return document.createElement('button');
    };
