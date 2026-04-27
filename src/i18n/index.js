import { messageCatalog } from './catalog.js';

const BOUND_ELEMENTS = new Set();
const LOCALE_REFRESHERS = new Set();

const ATTRIBUTE_BINDING_MAP = [
    ['data-i18n-title', 'title'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-aria-description', 'aria-description'],
    ['data-i18n-aria-describedby', 'aria-describedby'],
    ['data-i18n-data-tooltip', 'data-tooltip'],
];

const normalizeLocale = (locale) => {
    if (!locale) {
        return 'en';
    }
    const lower = String(locale).toLowerCase();
    if (lower === 'zh' || lower.startsWith('zh-')) {
        return 'zh';
    }
    return 'en';
};

const detectBrowserLocale = () => {
    if (typeof navigator === 'undefined') {
        return 'en';
    }
    const { language, languages, userLanguage } = navigator;
    const first = Array.isArray(languages) && languages.length > 0 ? languages[0] : null;
    return normalizeLocale(first || language || userLanguage || 'en');
};

let cachedLocale = detectBrowserLocale();

const resolveValues = (values) => {
    if (typeof values === 'function') {
        try {
            return values();
        } catch (error) {
            console.warn('[Chat] Template Text Folders i18n values resolver error:', error);
            return null;
        }
    }
    return values || null;
};

const applyReplacements = (text, replacements) => {
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

const translate = (messageId, replacements, overrideLocale) => {
    const locale = normalizeLocale(overrideLocale || cachedLocale);
    const entry = messageCatalog[messageId];
    if (!entry) {
        return applyReplacements(messageId, resolveValues(replacements));
    }
    const fallback = entry.en || entry.zh || messageId;
    const template = locale === 'zh'
        ? (entry.zh || fallback)
        : (entry[locale] || fallback);
    return applyReplacements(template, resolveValues(replacements));
};

const getLocale = () => cachedLocale;

const refreshI18nElement = (element) => {
    if (!element) {
        return element;
    }
    const textBinding = element.__cttfI18nTextBinding;
    if (textBinding) {
        element.textContent = translate(textBinding.id, textBinding.values, textBinding.overrideLocale);
    }
    const attrBindings = element.__cttfI18nAttrBindings;
    if (attrBindings) {
        Object.entries(attrBindings).forEach(([attr, binding]) => {
            element.setAttribute(attr, translate(binding.id, binding.values, binding.overrideLocale));
        });
    }
    return element;
};

const bindI18nText = (element, id, values, options = {}) => {
    if (!element) {
        return element;
    }
    element.__cttfI18nTextBinding = {
        id,
        values,
        overrideLocale: options.overrideLocale || null,
    };
    BOUND_ELEMENTS.add(element);
    return refreshI18nElement(element);
};

const bindI18nAttr = (element, attr, id, values, options = {}) => {
    if (!element || !attr) {
        return element;
    }
    if (!element.__cttfI18nAttrBindings) {
        element.__cttfI18nAttrBindings = {};
    }
    element.__cttfI18nAttrBindings[attr] = {
        id,
        values,
        overrideLocale: options.overrideLocale || null,
    };
    BOUND_ELEMENTS.add(element);
    return refreshI18nElement(element);
};

const refreshI18nTree = (root) => {
    if (!root) {
        return root;
    }
    if (root.nodeType === Node.ELEMENT_NODE) {
        refreshI18nElement(root);
    }
    const elements = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
    elements.forEach((element) => refreshI18nElement(element));
    return root;
};

const hydrateI18nBindings = (root) => {
    if (!root) {
        return root;
    }
    const elements = root.nodeType === Node.ELEMENT_NODE
        ? [root, ...root.querySelectorAll('*')]
        : (root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : []);

    elements.forEach((element) => {
        const textId = element.getAttribute && element.getAttribute('data-i18n-text');
        if (textId) {
            bindI18nText(element, textId);
        }
        ATTRIBUTE_BINDING_MAP.forEach(([dataAttr, attr]) => {
            const bindingId = element.getAttribute && element.getAttribute(dataAttr);
            if (bindingId) {
                bindI18nAttr(element, attr, bindingId);
            }
        });
    });

    return root;
};

const releaseI18nBindings = (root) => {
    if (!root) {
        return root;
    }
    const elements = root.nodeType === Node.ELEMENT_NODE
        ? [root, ...root.querySelectorAll('*')]
        : (root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : []);

    elements.forEach((element) => {
        if (!element) {
            return;
        }
        BOUND_ELEMENTS.delete(element);
        delete element.__cttfI18nTextBinding;
        delete element.__cttfI18nAttrBindings;
    });

    return root;
};

const refreshBoundElements = () => {
    Array.from(BOUND_ELEMENTS).forEach((element) => {
        if (!element || !element.isConnected) {
            BOUND_ELEMENTS.delete(element);
            return;
        }
        refreshI18nElement(element);
    });
};

const registerLocaleRefresh = (refresher) => {
    if (typeof refresher !== 'function') {
        return () => {};
    }
    LOCALE_REFRESHERS.add(refresher);
    return () => {
        LOCALE_REFRESHERS.delete(refresher);
    };
};

const notifyLocaleChange = (previousLocale, nextLocale) => {
    refreshBoundElements();

    Array.from(LOCALE_REFRESHERS).forEach((refresher) => {
        try {
            refresher(nextLocale, previousLocale);
        } catch (error) {
            console.warn('[Chat] Template Text Folders locale refresher error:', error);
        }
    });
};

const setLocale = (nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    const previous = cachedLocale;
    cachedLocale = normalized;
    if (previous !== normalized) {
        notifyLocaleChange(previous, normalized);
    }
    return cachedLocale;
};

export {
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
};
