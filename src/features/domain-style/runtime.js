import {
    buttonConfig,
    defaultConfig,
    queryUI,
    t,
} from '../../core/runtime-services.js';
import {
    clampBottomSpacing,
    STYLE_MATCHER_TYPE,
} from './style-format.js';

const clampBarSpacingValue = (value, fallback = 0) => {
    const normalized = clampBottomSpacing(value, clampBottomSpacing(fallback, 0));
    return typeof normalized === 'number' ? normalized : 0;
};

const applyBarBottomSpacing = (container, spacing, fallbackSpacing = 0) => {
    if (!container) return 0;
    const desiredSpacing = clampBarSpacingValue(spacing, fallbackSpacing);
    const paddingY = Number(container.dataset.barPaddingY) || 0;
    const adjustedBottom = desiredSpacing - paddingY;
    container.style.transform = 'translateY(0)';
    container.style.bottom = `${adjustedBottom}px`;
    container.dataset.barBottomSpacing = String(desiredSpacing);
    return desiredSpacing;
};

const updateButtonBarLayout = (container, targetHeight) => {
    if (!container) return;
    const numericHeight = Number(targetHeight);
    if (!Number.isFinite(numericHeight) || numericHeight <= 0) return;

    const barHeight = Math.max(32, Math.round(numericHeight));
    const scale = Math.max(0.6, Math.min(2.5, barHeight / 40));

    const paddingYBase = Math.round(6 * scale);
    const paddingYMax = Math.max(4, Math.floor((barHeight - 24) / 2));
    const paddingY = Math.min(Math.max(4, Math.min(20, paddingYBase)), paddingYMax);
    const paddingX = Math.max(12, Math.min(48, Math.round(15 * scale)));
    const gapSize = Math.max(6, Math.min(28, Math.round(10 * scale)));

    container.style.padding = `${paddingY}px ${paddingX}px`;
    container.style.gap = `${gapSize}px`;

    const innerHeight = Math.max(20, barHeight - paddingY * 2);
    const fontSize = Math.max(12, Math.min(22, Math.round(14 * scale)));
    let verticalPadding = Math.max(4, Math.min(18, Math.round(6 * scale)));
    const maxVerticalPadding = Math.max(4, Math.floor((innerHeight - fontSize) / 2));
    if (verticalPadding > maxVerticalPadding) {
        verticalPadding = Math.max(4, maxVerticalPadding);
    }
    const horizontalPadding = Math.max(12, Math.min(56, Math.round(12 * scale)));
    const borderRadius = Math.max(4, Math.min(20, Math.round(4 * scale)));
    const lineHeight = Math.max(fontSize + 2, innerHeight - verticalPadding * 2);

    const buttons = Array.from(container.children).filter((node) => node.tagName === 'BUTTON');
    buttons.forEach((btn) => {
        btn.style.minHeight = `${innerHeight}px`;
        btn.style.height = `${innerHeight}px`;
        btn.style.padding = `${verticalPadding}px ${horizontalPadding}px`;
        btn.style.fontSize = `${fontSize}px`;
        btn.style.borderRadius = `${borderRadius}px`;
        btn.style.lineHeight = `${lineHeight}px`;
        if (!btn.style.display) btn.style.display = 'inline-flex';
        if (!btn.style.alignItems) btn.style.alignItems = 'center';
    });

    container.dataset.barHeight = String(barHeight);
    container.dataset.barPaddingY = String(verticalPadding);
};

const matchesDomain = (hostname, expectedDomain) => {
    const host = String(hostname || '').trim().toLowerCase();
    const target = String(expectedDomain || '').trim().toLowerCase();
    if (!host || !target) {
        return false;
    }
    return host === target || host.endsWith(`.${target}`);
};

const matcherMatchesLocation = (matcher, locationLike) => {
    if (!matcher || typeof matcher !== 'object' || !locationLike) {
        return false;
    }
    const href = String(locationLike.href || '');
    const hostname = String(locationLike.hostname || '');

    if (matcher.type === STYLE_MATCHER_TYPE.DOMAIN) {
        return matchesDomain(hostname, matcher.value);
    }
    if (matcher.type === STYLE_MATCHER_TYPE.URL_PREFIX) {
        return href.startsWith(matcher.value);
    }
    if (matcher.type === STYLE_MATCHER_TYPE.URL) {
        return href === matcher.value;
    }
    if (matcher.type === STYLE_MATCHER_TYPE.REGEXP) {
        try {
            return new RegExp(matcher.value).test(href);
        } catch (_) {
            return false;
        }
    }
    return false;
};

const ruleMatchesLocation = (rule, locationLike) => {
    if (!rule || typeof rule !== 'object' || rule.enabled === false) {
        return false;
    }
    if (!Array.isArray(rule.matchers) || !rule.matchers.length) {
        return false;
    }
    return rule.matchers.some((matcher) => matcherMatchesLocation(matcher, locationLike));
};

const getMatchingStyleRules = (locationLike = window.location) => {
    const officialRules = Array.isArray(buttonConfig.officialStyleBundle?.rules)
        ? buttonConfig.officialStyleBundle.rules
        : [];
    const customRules = Array.isArray(buttonConfig.customStyleRules)
        ? buttonConfig.customStyleRules
        : [];

    return {
        official: officialRules.filter((rule) => ruleMatchesLocation(rule, locationLike)),
        custom: customRules.filter((rule) => ruleMatchesLocation(rule, locationLike)),
    };
};

const clearInjectedDomainStyles = () => {
    try {
        document.querySelectorAll('style[data-cttf-style-rule-id]').forEach((styleEl) => styleEl.remove());
    } catch (error) {
        console.warn(t('m_f22440b1c745'), error);
    }
};

const injectRuleStyles = (rules, source) => {
    const target = document.head || document.documentElement;
    if (!target) {
        return;
    }

    rules.forEach((rule, index) => {
        if (!rule || typeof rule !== 'object' || !rule.cssCode) {
            return;
        }
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-cttf-style-rule-id', rule.id || `cttf-style-${source}-${index}`);
        styleEl.setAttribute('data-cttf-style-source', source);
        styleEl.textContent = rule.cssCode;
        target.appendChild(styleEl);
    });
};

const resolveLayoutValue = (customRules, officialRules, key, fallbackValue) => {
    for (let index = customRules.length - 1; index >= 0; index -= 1) {
        const value = customRules[index]?.layout?.[key];
        if (typeof value === 'number') {
            return value;
        }
    }
    for (let index = officialRules.length - 1; index >= 0; index -= 1) {
        const value = officialRules[index]?.layout?.[key];
        if (typeof value === 'number') {
            return value;
        }
    }
    return fallbackValue;
};

const applyDomainStyles = () => {
    try {
        const container = queryUI('.folder-buttons-container');
        const fallbackSpacing = clampBarSpacingValue(
            typeof buttonConfig.buttonBarBottomSpacing === 'number'
                ? buttonConfig.buttonBarBottomSpacing
                : (defaultConfig && typeof defaultConfig.buttonBarBottomSpacing === 'number'
                    ? defaultConfig.buttonBarBottomSpacing
                    : 0),
        );
        const fallbackHeight = (buttonConfig && typeof buttonConfig.buttonBarHeight === 'number')
            ? buttonConfig.buttonBarHeight
            : ((defaultConfig && typeof defaultConfig.buttonBarHeight === 'number')
                ? defaultConfig.buttonBarHeight
                : 40);

        clearInjectedDomainStyles();

        const matchingRules = getMatchingStyleRules(window.location);
        injectRuleStyles(matchingRules.official, 'official');
        injectRuleStyles(matchingRules.custom, 'custom');
        const hasMatchingRules = matchingRules.official.length > 0 || matchingRules.custom.length > 0;

        if (!container) {
            if (hasMatchingRules) {
                console.log(`[Chat] Template Text Folders applied ${matchingRules.official.length} official and ${matchingRules.custom.length} custom style rule(s) without toolbar container.`);
            }
            return;
        }

        const resolvedHeight = resolveLayoutValue(
            matchingRules.custom,
            matchingRules.official,
            'height',
            fallbackHeight,
        );
        const clampedHeight = Math.min(200, Math.max(20, Number(resolvedHeight) || 40));
        container.style.height = `${clampedHeight}px`;
        updateButtonBarLayout(container, clampedHeight);

        const resolvedBottomSpacing = resolveLayoutValue(
            matchingRules.custom,
            matchingRules.official,
            'bottomSpacing',
            fallbackSpacing,
        );
        applyBarBottomSpacing(container, resolvedBottomSpacing, fallbackSpacing);

        if (hasMatchingRules) {
            console.log(`[Chat] Template Text Folders applied ${matchingRules.official.length} official and ${matchingRules.custom.length} custom style rule(s).`);
            return;
        }

        console.log(t('m_da4c4e40abf2', {
            height: clampedHeight,
        }));
    } catch (error) {
        console.warn(t('m_f5b6e4660c67'), error);
    }
};

export {
    applyBarBottomSpacing,
    applyDomainStyles,
};
