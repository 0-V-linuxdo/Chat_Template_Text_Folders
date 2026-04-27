/* -------------------------------------------------------------------------- *
 * Bootstrap · Initialization workflow and runtime observers
 * -------------------------------------------------------------------------- */

import {
    getCurrentTheme,
    setCSSVariables,
    t,
} from '../core/runtime-services.js';
import {
    attachButtons,
    observeShadowRoots,
    updateButtonContainer,
} from '../features/toolbar/index.js';
import { applyDomainStyles } from '../features/domain-style/runtime.js';

let lastKnownLocationHref = '';
let locationObserverInitialized = false;
let pendingRefreshTimer = null;
let pendingSettledRefreshTimer = null;

const rerenderRuntimeUI = () => {
    attachButtons();
    try { applyDomainStyles(); } catch (_) {}
};

const scheduleRuntimeRefresh = (delay = 0) => {
    if (pendingRefreshTimer) {
        clearTimeout(pendingRefreshTimer);
    }
    if (pendingSettledRefreshTimer) {
        clearTimeout(pendingSettledRefreshTimer);
    }

    pendingRefreshTimer = setTimeout(() => {
        rerenderRuntimeUI();
        pendingSettledRefreshTimer = setTimeout(() => {
            rerenderRuntimeUI();
        }, 350);
    }, Math.max(0, delay));
};

const handleLocationChange = () => {
    const nextHref = window.location.href;
    if (!nextHref || nextHref === lastKnownLocationHref) {
        return;
    }
    lastKnownLocationHref = nextHref;
    scheduleRuntimeRefresh();
};

const patchHistoryMethod = (methodName) => {
    const originalMethod = history[methodName];
    if (typeof originalMethod !== 'function' || originalMethod.__cttfPatched) {
        return;
    }

    const patchedMethod = function (...args) {
        const result = originalMethod.apply(this, args);
        handleLocationChange();
        return result;
    };
    patchedMethod.__cttfPatched = true;
    history[methodName] = patchedMethod;
};

const setupLocationObserver = () => {
    if (locationObserverInitialized) {
        return;
    }

    locationObserverInitialized = true;
    lastKnownLocationHref = window.location.href;

    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
};

const initialize = () => {
    lastKnownLocationHref = window.location.href;
    attachButtons();
    const observer = new MutationObserver((mutations) => {
        let triggered = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        observeShadowRoots(node);
                        triggered = true;
                    }
                });
            }
        });
        if (triggered) {
            attachButtons();
            handleLocationChange();
            console.log(t('m_e2ee892dbd90'));
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    console.log(t('m_d81628898afa'));

    setupLocationObserver();
    scheduleRuntimeRefresh();
};

const updateStylesOnThemeChange = () => {
    updateButtonContainer();
    try { applyDomainStyles(); } catch (_) {}
};

const setupInitialization = () => {
    window.addEventListener('load', () => {
        console.log(t('m_3aaf48c90271'));
        initialize();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setCSSVariables(getCurrentTheme());
        updateStylesOnThemeChange();
        console.log(t('m_1c7ce90c05af'));
    });

    setCSSVariables(getCurrentTheme());
};

export {
    setupInitialization,
};
