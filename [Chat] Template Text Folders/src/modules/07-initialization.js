/* -------------------------------------------------------------------------- *
 * Module 07 · Initialization workflow and runtime observers
 * -------------------------------------------------------------------------- */

    const initialize = () => {
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
                console.log(t('🔔 DOM 发生变化，尝试重新附加按钮。'));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log(t('🔔 MutationObserver 已启动，监听 DOM 变化。'));

        // 先尝试一次；再延迟一次，保证容器创建完成后也能生效
        try { applyDomainStyles(); } catch (_) {}
        setTimeout(() => { try { applyDomainStyles(); } catch (_) {} }, 350);
    };

    window.addEventListener('load', () => {
        console.log(t('⏳ 页面已完全加载，开始初始化脚本。'));
        initialize();
    });

    // 动态更新样式以适应主题变化
    const updateStylesOnThemeChange = () => {
        // Since we're using CSS variables, the styles are updated automatically
        // Just update the button container to apply new styles
        updateButtonContainer();
        // 重新应用一次域名样式，防止主题切换后高度或注入样式丢失
        try { applyDomainStyles(); } catch (_) {}
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setCSSVariables(getCurrentTheme());
        updateStylesOnThemeChange();
        console.log(t('🌓 主题模式已切换，样式已更新。'));
    });

    // Initial setting of CSS variables
    setCSSVariables(getCurrentTheme());
})();
