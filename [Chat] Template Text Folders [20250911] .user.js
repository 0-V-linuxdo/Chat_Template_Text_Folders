// ==UserScript==
// @name         [Chat] Template Text Folders [20251011] +Enhanced
// @namespace    0_V userscripts/[Chat] Template Text Folders
// @version      [20251011]
// @description  在AI页面上添加预设文本文件夹和按钮，提升输入效率。
// @update-log   insertTextSmart Fixed
//
// @match        https://chatgpt.com/*
// @match        https://chat01.ai/*
//
// @match        https://claude.*/*
// @match        https://*.fuclaude.com/*
//
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
//
// @match        https://copilot.microsoft.com/*
//
// @match        https://grok.com/*
// @match        https://grok.dairoot.cn/*
//
// @match        https://chat.deepseek.com/*
// @match        https://chat.mistral.ai/*
//
// @match        https://*.perplexity.ai/*
//
// @match        https://poe.com/*
// @match        https://kagi.com/assistant*
// @match        https://lmarena.ai/*
// @match        https://app.chathub.gg/*
// @match        https://monica.im/home*
//
// @match        https://setapp.typingcloud.com/*
//
// @match        https://*.mynanian.top/*
// @match        https://free.share-ai.top/*
// @match        https://chat.kelaode.ai/*
//
// @match        https://*.aivvm.*/*
// @match        https://linux.do/discourse-ai/ai-bot/*
//
// @match        https://cursor.com/*
//
// @match        https://www.notion.so/*
//
// @grant        none
// @icon         https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/raw/refs/heads/main/Icon.svg
// ==/UserScript==

(function () {
    'use strict';

    console.log("🎉 [Chat] Template Text Folders [20250211] V2.2");

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
                .hide-scrollbar {
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
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
        return container ? container.appendChild(node) : document.body.appendChild(node);
    };

    const appendToOverlayLayer = (node) => {
        const container = getOverlayLayer();
        if (container) {
            container.appendChild(node);
        } else {
            document.body.appendChild(node);
        }
        return node;
    };

    const queryUI = (selector) => {
        const root = getShadowRoot();
        return root ? root.querySelector(selector) : document.querySelector(selector);
    };

    const toCSSVariableName = (key) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

    // 用于统一创建 overlay + dialog，样式与默认逻辑保持一致
    // 复用时只需传入自定义的内容与回调，外观也可统一
    function createUnifiedDialog(options) {
        const {
            title = '弹窗标题',
            width = '400px',
            maxHeight = '80vh',
            onClose = null // 关闭时的回调
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
        titleEl.textContent = title;
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

        // 点击overlay关闭
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay){
                if(onClose) onClose();
                overlay.remove();
            }
        });

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
            tabBorder: '#e5e7eb'
        },
        dark: {
            folderBg: 'rgba(31, 41, 55, 0.8)',
            dialogBg: '#1f2937',
            textColor: '#e5e7eb',
            borderColor: '#374151',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            buttonBg: '#374151',
            buttonHoverBg: '#4b5563',
            dangerColor: '#dc2626',
            successColor: '#16a34a',
            addColor: '#fd7e14',
            primaryColor: '#2563EB',
            infoColor: '#4F46E5',
            cancelColor: '#4B5563',
            overlayBg: 'rgba(0, 0, 0, 0.7)',
            tabBg: '#374151',
            tabActiveBg: '#2563EB',
            tabHoverBg: '#4b5563',
            tabBorder: '#4b5563'
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
                method: "模拟点击提交按钮"
            },
            {
                domain: "chathub.gg",
                name: "ChatHub",
                method: "Enter"
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
        domainStyleSettings: []
    };

    defaultConfig.buttonBarHeight = 40;

    let buttonConfig = JSON.parse(localStorage.getItem('chatGPTButtonFoldersConfig')) || JSON.parse(JSON.stringify(defaultConfig));

    if (!Array.isArray(buttonConfig.domainStyleSettings)) {
        buttonConfig.domainStyleSettings = [];
    }

    if (typeof buttonConfig.buttonBarHeight !== 'number') {
        buttonConfig.buttonBarHeight = defaultConfig.buttonBarHeight;
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
            });
        });
        if (updated) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log("✅ 已确保所有按钮具有'type'字段和'autoSubmit'配置，以及文件夹具有'hidden'字段。");
        }
    };

    ensureButtonTypes();

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
            console.log(`✅ 工具文件夹 "${toolFolderName}" 已添加到配置中。`);
        } else {
            // 确保工具按钮存在
            Object.entries(defaultToolButtons).forEach(([btnName, btnCfg]) => {
                if (!buttonConfig.folders[toolFolderName].buttons[btnName]) {
                    buttonConfig.folders[toolFolderName].buttons[btnName] = btnCfg;
                    console.log(`✅ 工具按钮 "${btnName}" 已添加到文件夹 "${toolFolderName}"。`);
                }
            });
        }
    };
    ensureToolFolder();

    // 变量：防止重复提交
    let isSubmitting = false;

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
    // 定义多种提交方式
    const submitForm = async () => {
        if (isSubmitting) {
            console.warn("⚠️ 提交正在进行中，跳过重复提交。");
            return false;
        }
        isSubmitting = true;
        try {
              const domainRules = buttonConfig.domainAutoSubmitSettings || [];
              const currentURL = window.location.href;
              const matchedRule = domainRules.find(rule => currentURL.includes(rule.domain));

              if (matchedRule) {
                  console.log("🔎 检测到本域名匹配的自动提交规则：", matchedRule);
                  switch (matchedRule.method) {
                      case "Enter":
                          simulateEnterKey();
                          isSubmitting = false;
                          return true;
                      case "Cmd+Enter":
                          simulateCmdEnterKey();
                          isSubmitting = false;
                          return true;
                      case "模拟点击提交按钮":
                          const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                          if (submitButton) {
                              submitButton.click();
                              console.log("✅ 已根据自动化规则，模拟点击提交按钮。");
                              isSubmitting = false;
                              return true;
                          } else {
                              console.warn("⚠️ 未找到提交按钮，进入fallback...");
                          }
                          break;
                      default:
                          console.warn("⚠️ 未知自动提交方式，进入fallback...");
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
                console.log(`尝试通过键盘快捷键提交表单：${keyCombo}`);
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
                console.log("✅ 自动提交已通过点击提交按钮触发。");
                return true;
            } else {
                console.warn("⚠️ 未找到提交按钮，尝试其他提交方式。");
            }

            // 3. 尝试调用JavaScript提交函数
            // 需要知道具体的提交函数名称，这里假设为 `submitForm`
            // 根据实际情况调整函数名称
            try {
                if (typeof submitForm === 'function') {
                    submitForm();
                    console.log("✅ 自动提交已通过调用JavaScript函数触发。");
                    return true;
                } else {
                    console.warn("⚠️ 未找到名为 'submitForm' 的提交函数。");
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
                    console.log("✅ 自动提交已通过触发 'submit' 事件触发。");
                    return true;
                } else {
                    console.warn("⚠️ 未找到表单元素，无法触发 'submit' 事件。");
                }
            } catch (error) {
                console.error("触发 'submit' 事件失败:", error);
            }

            console.warn("⚠️ 所有自动提交方式均未成功。");
            return false;
        } finally {
            isSubmitting = false;
        }
    };

    const createCustomButtonElement = (name, config) => {
        const button = document.createElement('button');
        button.innerText = name;
        button.type = 'button';
        button.style.backgroundColor = config.color;
        button.style.color = config.textColor || '#333333';
        button.style.border = '1px solid rgba(0,0,0,0.1)';
        button.style.borderRadius = '4px';
        button.style.padding = '6px 12px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.transition = 'all 0.2s ease';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        button.style.marginBottom = '6px';
        button.style.width = 'fit-content';
        button.style.textAlign = 'left';
        button.style.display = 'block';
        // 鼠标悬停显示按钮模板文本
        button.title = config.text || '';
        return button;
    };

    // 引入全局变量来跟踪当前打开的文件夹
    const currentlyOpenFolder = {
        name: null,
        element: null
    };

    const createCustomButton = (name, config, folderName) => {
        const button = createCustomButtonElement(name, config, folderName);
        button.setAttribute('draggable', 'true');
        button.setAttribute('data-button-name', name);
        button.setAttribute('data-folder-name', folderName);

        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: name,
                sourceFolder: folderName,
                config: config
            }));
            e.currentTarget.style.opacity = '0.5';
        });

        button.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const focusedElement = document.activeElement;
            if (focusedElement && (focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                setTimeout(() => focusedElement.focus(), 0);
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        });

        // 处理按钮点击事件
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (config.type === "template") {
                const focusedElement = document.activeElement;
                if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                    console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                    return;
                }

                // 检查模板是否需要剪切板内容
                const needsClipboard = config.text.includes('{clipboard}') || config.text.includes('{{inputboard}|{clipboard}}');

                let clipboardText = '';
                if (needsClipboard) {
                    try {
                        clipboardText = await navigator.clipboard.readText();
                    } catch (err) {
                        console.error("无法访问剪贴板内容:", err);
                        alert("无法访问剪贴板内容。请检查浏览器权限。");
                        return;
                    }
                }

                // 改进的内容获取方式
                let inputBoxText = '';
                if (focusedElement.tagName.toLowerCase() === 'textarea') {
                    inputBoxText = focusedElement.value;
                } else {
                    // 遍历 contenteditable 元素的子节点，正确处理换行
                    const childNodes = Array.from(focusedElement.childNodes);
                    const textParts = [];
                    let lastWasBr = false;
                    childNodes.forEach((node, index) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (node.textContent.trim() === '') {
                                if (!lastWasBr && index > 0) {
                                    textParts.push('\n');
                                }
                            } else {
                                textParts.push(node.textContent);
                                lastWasBr = false;
                            }
                        } else if (node.nodeName === 'BR') {
                            textParts.push('\n');
                            lastWasBr = true;
                        } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                            if (node.textContent.trim() === '') {
                                textParts.push('\n');
                            } else {
                                if (textParts.length > 0) {
                                    textParts.push('\n');
                                }
                                textParts.push(node.textContent);
                            }
                            lastWasBr = false;
                        }
                    });
                    inputBoxText = textParts.join('');
                }

                const selectionText = window.getSelection().toString();

                // 全新的安全变量替换逻辑 - 使用占位符防止嵌套替换
                let finalText = config.text;

                // 创建变量映射表 - 只有在需要时才包含剪切板内容
                const variableMap = {
                    '{{inputboard}|{clipboard}}': inputBoxText.trim() || clipboardText,
                    '{clipboard}': clipboardText,
                    '{inputboard}': inputBoxText,
                    '{selection}': selectionText
                };

                // 按照优先级顺序进行替换（复合变量优先）
                const replacementOrder = [
                    '{{inputboard}|{clipboard}}',
                    '{clipboard}',
                    '{inputboard}',
                    '{selection}'
                ];

                // 使用安全的占位符机制，确保一次性替换，避免嵌套
                const placeholderMap = new Map();
                let placeholderCounter = 0;

                // 第一阶段：将模板中的变量替换为唯一占位符
                replacementOrder.forEach(variable => {
                    if (finalText.includes(variable)) {
                        const placeholder = `__SAFE_PLACEHOLDER_${placeholderCounter++}__`;
                        placeholderMap.set(placeholder, variableMap[variable]);

                        // 使用 split().join() 确保精确匹配，避免正则表达式问题
                        finalText = finalText.split(variable).join(placeholder);
                    }
                });

                // 第二阶段：将占位符替换为实际值（此时不会再有嵌套问题）
                placeholderMap.forEach((value, placeholder) => {
                    finalText = finalText.split(placeholder).join(value);
                });

                // 统一换行符
                finalText = finalText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                const containsInputboard = config.text.includes("{inputboard}") ||
                    config.text.includes("{{inputboard}|{clipboard}}");

                if (containsInputboard) {
                    insertTextSmart(focusedElement, finalText, true);
                    console.log(`✅ 使用 {inputboard} 变量，输入框内容已被替换。`);
                } else {
                    insertTextSmart(focusedElement, finalText, false);
                    console.log(`✅ 插入了预设文本。`);
                }

                // 若开启autoSubmit，则先检测是否完成替换，再延时后提交
                if (config.autoSubmit) {
                    try {
                        // 1. 等待输入框内容与 finalText 匹配，最多等待3秒
                        await waitForContentMatch(focusedElement, finalText, 100, 3000);

                        // 2. 再额外等待500ms，确保渲染/加载稳定
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // 3. 调用自动提交
                        const success = await submitForm();
                        if (success) {
                            console.log("✅ 自动提交成功（已确认内容替换完成）。");
                        } else {
                            console.warn("⚠️ 自动提交失败。");
                        }
                    } catch (error) {
                        console.error("自动提交前检测文本匹配超时或错误:", error);
                    }
                }

            } else if (config.type === "tool") {
                const focusedElement = document.activeElement;
                if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                    console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                    return;
                }
                switch (config.action) {
                    case "cut":
                        handleCut(focusedElement);
                        break;
                    case "copy":
                        handleCopy(focusedElement);
                        break;
                    case "paste":
                        handlePaste(focusedElement);
                        break;
                    case "clear":
                        handleClear(focusedElement);
                        break;
                    default:
                        console.warn(`未知的工具按钮动作: ${config.action}`);
                }
            }

            // 立即关闭弹窗
            if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element) {
                currentlyOpenFolder.element.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(`✅ 弹窗 "${folderName}" 已立即关闭。`);
            } else {
                console.warn(`⚠️ 弹窗 "${folderName}" 未被识别为当前打开的弹窗。`);
            }
        });

        return button;
    };

    // 工具按钮动作处理
    const handleCut = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
            insertTextSmart(element, '', true);
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
            insertTextSmart(element, '', true);
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log("✅ 已剪切输入框内容到剪贴板。");
                showTemporaryFeedback(element, '剪切成功');
            }).catch(err => {
                console.error("剪切失败:", err);
                alert("剪切失败，请检查浏览器权限。");
            });
        }
    };

    const handleCopy = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log("✅ 已复制输入框内容到剪贴板。");
                showTemporaryFeedback(element, '复制成功');
            }).catch(err => {
                console.error("复制失败:", err);
                alert("复制失败，请检查浏览器权限。");
            });
        }
    };

    const handlePaste = async (element) => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            insertTextSmart(element, clipboardText);
            console.log("✅ 已粘贴剪贴板内容到输入框。");
            showTemporaryFeedback(element, '粘贴成功');
        } catch (err) {
            console.error("粘贴失败:", err);
            alert("粘贴失败，请检查浏览器权限。");
        }
    };

    const handleClear = (element) => {
        insertTextSmart(element, '', true);
        console.log("✅ 输入框内容已清空。");
        showTemporaryFeedback(element, '清空成功');
    };

    const showTemporaryFeedback = (element, message) => {
        const feedback = document.createElement('span');
        feedback.textContent = message;
        feedback.style.position = 'absolute';
        feedback.style.bottom = '10px';
        feedback.style.right = '10px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.color = '#fff';
        feedback.style.padding = '4px 8px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '10001';
        element.parentElement.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    const createFolderButton = (folderName, folderConfig) => {
        const folderButton = document.createElement('button');
        folderButton.innerText = folderName;
        folderButton.type = 'button';
        folderButton.style.backgroundColor = folderConfig.color;
        folderButton.style.color = folderConfig.textColor || '#ffffff';
        folderButton.style.border = 'none';
        folderButton.style.borderRadius = '4px';
        folderButton.style.padding = '6px 12px';
        folderButton.style.cursor = 'pointer';
        folderButton.style.fontSize = '14px';
        folderButton.style.fontWeight = '500';
        folderButton.style.transition = 'all 0.2s ease';
        folderButton.style.position = 'relative';
        folderButton.style.display = 'inline-flex';
        folderButton.style.alignItems = 'center';
        folderButton.style.whiteSpace = 'nowrap';
        folderButton.style.zIndex = '99';
        folderButton.classList.add('folder-button');
        folderButton.setAttribute('data-folder', folderName);

        folderButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        folderButton.addEventListener('mouseleave', () => {
            folderButton.style.transform = 'scale(1)';
            folderButton.style.boxShadow = 'none';
        });

        const buttonListContainer = document.createElement('div');
        buttonListContainer.style.position = 'fixed';
        buttonListContainer.style.display = 'none';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.backgroundColor = 'var(--folder-bg, rgba(255, 255, 255, 0.8))';
        buttonListContainer.style.backdropFilter = 'blur(5px)';
        buttonListContainer.style.border = `1px solid var(--border-color, #e5e7eb)`;
        buttonListContainer.style.borderRadius = '8px';
        buttonListContainer.style.padding = '10px';
        buttonListContainer.style.paddingBottom = '2.5px';
        buttonListContainer.style.boxShadow = `0 4px 12px var(--shadow-color, rgba(0,0,0,0.1))`;
        buttonListContainer.style.zIndex = '100';
        buttonListContainer.style.maxHeight = '800px';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.transition = 'all 0.3s ease';
        buttonListContainer.classList.add('button-list');
        buttonListContainer.setAttribute('data-folder-list', folderName);
        buttonListContainer.style.pointerEvents = 'auto';

        Object.entries(folderConfig.buttons).forEach(([name, config]) => {
            const customButton = createCustomButton(name, config, folderName);
            buttonListContainer.appendChild(customButton);
        });

        folderButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle popup visibility
            if (currentlyOpenFolder.name === folderName) {
                // 如果当前文件夹已经打开，则关闭它
                buttonListContainer.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(`🔒 弹窗 "${folderName}" 已关闭。`);
            } else {
                // 关闭其他文件夹的弹窗
                if (currentlyOpenFolder.element) {
                    currentlyOpenFolder.element.style.display = 'none';
                    console.log(`🔒 弹窗 "${currentlyOpenFolder.name}" 已关闭。`);
                }
                // 打开当前文件夹的弹窗
                buttonListContainer.style.display = 'flex';
                currentlyOpenFolder.name = folderName;
                currentlyOpenFolder.element = buttonListContainer;
                console.log(`🔓 弹窗 "${folderName}" 已打开。`);
                // 动态定位弹窗位置
                const rect = folderButton.getBoundingClientRect();
                buttonListContainer.style.bottom = `40px`;
                buttonListContainer.style.left = `${rect.left + window.scrollX - 20}px`;
                console.log(`📍 弹窗位置设置为 Bottom: 40px, Left: ${rect.left + window.scrollX - 20}px`);
            }
        });

        document.addEventListener('click', (e) => {
            const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
            const clickedInsideButton = path.includes(folderButton);
            const clickedInsideList = path.includes(buttonListContainer);
            if (!clickedInsideButton && !clickedInsideList) {
                // 点击了其他地方，关闭弹窗
                if (buttonListContainer.style.display !== 'none') {
                    buttonListContainer.style.display = 'none';
                    if (currentlyOpenFolder.name === folderName) {
                        currentlyOpenFolder.name = null;
                        currentlyOpenFolder.element = null;
                        console.log(`🔒 弹窗 "${folderName}" 已关闭（点击外部区域）。`);
                    }
                }
            }
        });

        appendToMainLayer(buttonListContainer);
        return folderButton;
    };

    const toggleFolder = (folderName, state) => {
        const buttonList = queryUI(`.button-list[data-folder-list="${folderName}"]`);
        if (!buttonList) {
            console.warn(`⚠️ 未找到与文件夹 "${folderName}" 关联的弹窗。`);
            return;
        }
        if (state) {
            // 打开当前文件夹的弹窗
            buttonList.style.display = 'flex';
            currentlyOpenFolder.name = folderName;
            currentlyOpenFolder.element = buttonList;
            console.log(`🔓 弹窗 "${folderName}" 已打开（toggleFolder）。`);
        } else {
            // 关闭当前文件夹的弹窗
            buttonList.style.display = 'none';
            if (currentlyOpenFolder.name === folderName) {
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(`🔒 弹窗 "${folderName}" 已关闭（toggleFolder）。`);
            }
        }
        // 关闭其他文件夹的弹窗
        const root = getShadowRoot();
        const allButtonLists = root ? Array.from(root.querySelectorAll('.button-list')) : [];
        allButtonLists.forEach(bl => {
            if (bl.getAttribute('data-folder-list') !== folderName) {
                bl.style.display = 'none';
                const fname = bl.getAttribute('data-folder-list');
                if (currentlyOpenFolder.name === fname) {
                    currentlyOpenFolder.name = null;
                    currentlyOpenFolder.element = null;
                    console.log(`🔒 弹窗 "${fname}" 已关闭（toggleFolder 关闭其他弹窗）。`);
                }
            }
        });
    };

    const closeExistingOverlay = (overlay) => {
        if (overlay && overlay.parentElement) {
            // 添加关闭动画
            overlay.style.opacity = '0';

            // 立即标记为已关闭，避免重复操作
            overlay.setAttribute('data-closing', 'true');

            // 延时移除DOM元素，确保动画完成
            setTimeout(() => {
                if (overlay.parentElement && overlay.getAttribute('data-closing') === 'true') {
                    overlay.parentElement.removeChild(overlay);
                    console.log("🔒 弹窗已关闭并从DOM中移除");
                }
            }, 300);
        } else {
            console.warn("⚠️ 尝试关闭不存在的弹窗");
        }
    };

    let currentConfirmOverlay = null;
    let currentSettingsOverlay = null;
    let currentConfigOverlay = null; // 新增的独立配置设置弹窗

    const showDeleteFolderConfirmDialog = (folderName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const folderConfig = buttonConfig.folders[folderName];
        if (!folderConfig) {
            alert(`文件夹 "${folderName}" 不存在。`);
            return;
        }
        // 构建文件夹内自定义按钮的垂直预览列表
        let buttonsPreviewHTML = '';
        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
            buttonsPreviewHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: 1px solid rgba(0,0,0,0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                        margin-right: 8px;
                    " disabled>${btnName}</button>
                    <span style="font-size: 12px; color: var(--text-color);">${btnName}</span>
                </div>
            `;
        });

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                🗑️ 确认删除文件夹 "${folderName}"？
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">❗️ 注意：此操作无法撤销！<br/>（删除文件夹将同时删除其中的所有自定义按钮！）</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <!-- 将文件夹按钮预览和文字标签放在一行 -->
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>1️⃣ 文件夹按钮外观：</strong>
                    <button style="
                        background-color: ${folderConfig.color};
                        color: ${folderConfig.textColor};
                        border: none;
                        border-radius:4px;
                        padding:6px 12px;
                        cursor: default;
                        font-size:14px;
                        font-weight:500;
                        box-shadow: none;
                    " disabled>${folderName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    按钮名称： ${folderName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    背景颜色： <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    文字颜色： <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>2️⃣ 文件夹内，全部自定义按钮：</strong></p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${buttonsPreviewHTML}
                </div>
            </div>
            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">取消</button>
                <button id="confirmDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius: 4px;
                ">删除</button>
            </div>
        `);
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteFolder').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteFolder').addEventListener('click', () => {
            delete buttonConfig.folders[folderName];
            const idx = buttonConfig.folderOrder.indexOf(folderName);
            if (idx > -1) buttonConfig.folderOrder.splice(idx, 1);
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(`🗑️ 文件夹 "${folderName}" 已删除。`);
            // 更新按钮栏
            updateButtonContainer();
        });
    };

    // 修改 删除按钮确认对话框，增加显示按钮名称、颜色信息及样式预览
    const showDeleteButtonConfirmDialog = (folderName, btnName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const btnCfg = buttonConfig.folders[folderName].buttons[btnName];
        if (!btnCfg) {
            alert(`按钮 "${btnName}" 不存在于文件夹 "${folderName}" 中。`);
            return;
        }
        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                🗑️ 确认删除按钮 "${btnName}"？
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">❗️ 注意：此操作无法撤销！</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>1️⃣ 自定义按钮外观：</strong>
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                    " disabled>${btnName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    按钮名称： ${btnName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    按钮背景颜色： <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    按钮文字颜色： <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>2️⃣ 按钮对应的文本模板：</strong></p>
                <textarea readonly style="
                    width:100%;
                    height:150px;
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:4px;
                    resize: vertical;
                ">${btnCfg.text || ''}</textarea>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">取消</button>
                <button id="confirmDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">删除</button>
            </div>
        `);
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteButton').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteButton').addEventListener('click', () => {
            delete buttonConfig.folders[folderName].buttons[btnName];
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(`🗑️ 按钮 "${btnName}" 已删除。`);
            // 更新按钮栏
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const showButtonEditDialog = (folderName, btnName = '', btnConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        // 禁止编辑/删除工具文件夹中的工具按钮
        if (folderName === "🖱️" && btnConfig.type === "tool") {
            alert('工具文件夹中的工具按钮无法编辑或删除。');
            return;
        }
        const isEdit = btnName !== '';

        // Create overlay and dialog containers
        const overlay = document.createElement('div');
        overlay.classList.add('edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = btnName || '';
        const initialColor = btnConfig.color || '#FFC1CC';
        const initialTextColor = btnConfig.textColor || '#333333';
        const initialAutoSubmit = btnConfig.autoSubmit || false; // 新增字段

        // 预览部分
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${isEdit ? '✏️ 编辑按钮：' : '🆕 新建按钮：'}
                </div>
                <div id="buttonPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || '预览按钮'}</button>
                </div>
            </div>
        `;

        // Tab content for text template
        const textTemplateTab = `
        <div id="textTemplateTab" class="tab-content" style="display: block;">
            <div style="
                width: 100%;
                padding: 12px;
                border-radius: 4px;
                border: 1px solid var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                ">
                    <label style="
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        white-space: nowrap;
                    ">插入变量：</label>
                    <div id="quickInsertButtons" style="
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                    ">
                        <button type="button" data-insert="{inputboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">📝 输入框</button>
                        <button type="button" data-insert="{clipboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">📋 剪贴板</button>
                        <button type="button" data-insert="{selection}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">🔍 选中</button>
                        <button type="button" data-insert="{{inputboard}|{clipboard}}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">🔄 输入框/剪贴板</button>
                    </div>
                </div>
                <textarea id="buttonText" style="
                    width: 100%;
                    height: 150px;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid var(--border-color, #e5e7eb);
                    background-color: var(--dialog-bg, #ffffff);
                    color: var(--text-color, #333333);
                    resize: vertical;
                ">${btnConfig.text || ''}</textarea>
            </div>
        </div>`;

        // Tab content for style settings
        const styleSettingsTab = `
            <div id="styleSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">按钮名称：</label>
                    <input type="text" id="buttonName" value="${btnName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">按钮背景颜色：</label>
                    <input type="color" id="buttonColor" value="${btnConfig.color || '#FFC1CC'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">按钮文字颜色：</label>
                    <input type="color" id="buttonTextColor" value="${btnConfig.textColor || '#333333'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 新增的提交设置子标签页
        const submitSettingsTab = `
            <div id="submitSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        cursor: pointer;
                        gap: 6px;
                    ">
                        <input type="checkbox" id="autoSubmitCheckbox" style="cursor: pointer;" ${initialAutoSubmit ? 'checked' : ''}>
                        自动提交 (在填充后自动提交内容)
                    </label>
                </div>
            </div>
        `;

        // Tab navigation
        const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="textTemplateTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">文本模板</button>
                <button class="tab-button" data-tab="styleSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">样式设置</button>
                <button class="tab-button" data-tab="submitSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">提交设置</button>
            </div>
        `;

        // Footer buttons
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                padding-top: 20px;
                border-top:1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">取消</button>
                <button id="saveButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">确认</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${tabNavigation}
            ${textTemplateTab}
            ${styleSettingsTab}
            ${submitSettingsTab}
            ${footerButtons}
        `);

        // Add tab switching functionality
        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.dataset.tab;
                    // Update button styles
                    tabButtons.forEach(btn => {
                        if (btn === button) {
                            btn.style.backgroundColor = 'var(--primary-color, #3B82F6)';
                            btn.style.color = 'white';
                            btn.style.borderBottom = '2px solid var(--primary-color, #3B82F6)';
                        } else {
                            btn.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                            btn.style.color = 'var(--text-color, #333333)';
                            btn.style.borderBottom = '2px solid transparent';
                        }
                    });
                    // Show/hide content
                    tabContents.forEach(content => {
                        content.style.display = content.id === tabId ? 'block' : 'none';
                    });
                });
            });
        };

        // Rest of the existing dialog setup code...
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Setup tabs
        setupTabs();

        // Setup preview updates
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const buttonNameInput = dialog.querySelector('#buttonName');
            const buttonColorInput = dialog.querySelector('#buttonColor');
            const buttonTextColorInput = dialog.querySelector('#buttonTextColor');
            const autoSubmitCheckbox = dialog.querySelector('#autoSubmitCheckbox'); // 新增引用

            buttonNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || '预览按钮';
            });

            buttonColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            buttonTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });

            // 监听“自动提交”开关变化
            autoSubmitCheckbox?.addEventListener('change', (e) => {
                console.log(`✅ 自动提交开关已设置为 ${e.target.checked}`);
            });
        };
        setupPreviewUpdates();

        // Setup quick insert buttons
        const setupQuickInsert = () => {
            const buttonText = dialog.querySelector('#buttonText');
            const quickInsertButtons = dialog.querySelector('#quickInsertButtons');
            quickInsertButtons?.addEventListener('click', (e) => {
                const button = e.target.closest('button[data-insert]');
                if (!button) return;
                e.preventDefault();
                const insertText = button.dataset.insert;
                const start = buttonText.selectionStart;
                const end = buttonText.selectionEnd;
                buttonText.value = buttonText.value.substring(0, start) +
                                   insertText +
                                   buttonText.value.substring(end);
                buttonText.selectionStart = buttonText.selectionEnd = start + insertText.length;
                buttonText.focus();
            });
            quickInsertButtons?.addEventListener('mousedown', (e) => {
                if (e.target.closest('button[data-insert]')) {
                    e.preventDefault();
                }
            });
        };
        setupQuickInsert();

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelButtonEdit')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#saveButtonEdit')?.addEventListener('click', () => {
            const newBtnName = dialog.querySelector('#buttonName').value.trim();
            const newBtnColor = dialog.querySelector('#buttonColor').value;
            const newBtnTextColor = dialog.querySelector('#buttonTextColor').value;
            const newBtnText = dialog.querySelector('#buttonText').value.trim();
            const autoSubmit = dialog.querySelector('#autoSubmitCheckbox')?.checked || false; // 获取自动提交状态

            if (!newBtnName) {
                alert('请输入按钮名称！');
                return;
            }

            if (!isValidColor(newBtnColor) || !isValidColor(newBtnTextColor)) {
                alert('请选择有效的颜色！');
                return;
            }

            if (newBtnName !== btnName && buttonConfig.folders[folderName].buttons[newBtnName]) {
                alert('按钮名称已存在！');
                return;
            }

            // Get all buttons order
            const currentButtons = { ...buttonConfig.folders[folderName].buttons };

            if (btnConfig.type === "tool") {
                // 工具按钮不允许更改类型和动作
                buttonConfig.folders[folderName].buttons[newBtnName] = {
                    type: "tool",
                    action: btnConfig.action,
                    color: newBtnColor,
                    textColor: newBtnTextColor
                };
            } else {
                // 处理模板按钮
                // Handle button rename
                if (btnName && newBtnName !== btnName) {
                    const newButtons = {};
                    Object.keys(currentButtons).forEach(key => {
                        if (key === btnName) {
                            newButtons[newBtnName] = {
                                text: newBtnText,
                                color: newBtnColor,
                                textColor: newBtnTextColor,
                                type: "template",
                                autoSubmit: autoSubmit
                            };
                        } else {
                            newButtons[key] = currentButtons[key];
                        }
                    });
                    buttonConfig.folders[folderName].buttons = newButtons;
                } else {
                    // Update existing button
                    if (btnName) {
                        buttonConfig.folders[folderName].buttons[btnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit
                        };
                    } else {
                        // Create new button
                        buttonConfig.folders[folderName].buttons[newBtnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit
                        };
                    }
                }
            }

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(`✅ 按钮 "${newBtnName}" 已保存。`);
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    function isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    const showFolderEditDialog = (folderName = '', folderConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const isNew = !folderName;
        const overlay = document.createElement('div');
        overlay.classList.add('folder-edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('folder-edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = folderName || '';
        const initialColor = folderConfig.color || '#3B82F6';
        const initialTextColor = folderConfig.textColor || '#ffffff';

        // 预览部分
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${isNew ? '🆕 新建文件夹：' : '✏️ 编辑文件夹：'}
                </div>
                <div id="folderPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || '预览文件夹'}</button>
                </div>
            </div>
        `;

        // 设置部分
        const settingsSection = `
            <div style="
                display:flex;
                flex-direction:column;
                gap:20px;
                margin-bottom:20px;
            ">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">文件夹名称：</label>
                    <input type="text" id="folderNameInput" value="${initialName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">按钮背景颜色：</label>
                    <input type="color" id="folderColorInput" value="${initialColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">按钮文字颜色：</label>
                    <input type="color" id="folderTextColorInput" value="${initialTextColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 底部按钮
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                padding-top: 20px;
                border-top:1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">取消</button>
                <button id="saveFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">确认</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${settingsSection}
            ${footerButtons}
        `);

        // 添加事件监听器
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const folderNameInput = dialog.querySelector('#folderNameInput');
            const folderColorInput = dialog.querySelector('#folderColorInput');
            const folderTextColorInput = dialog.querySelector('#folderTextColorInput');

            folderNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || '预览文件夹';
            });

            folderColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            folderTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });
        };
        setupPreviewUpdates();

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelFolderEdit').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        // 在showFolderEditDialog函数的保存按钮点击事件中
        dialog.querySelector('#saveFolderEdit').addEventListener('click', () => {
            const newFolderName = dialog.querySelector('#folderNameInput').value.trim();
            const newColor = dialog.querySelector('#folderColorInput').value;
            const newTextColor = dialog.querySelector('#folderTextColorInput').value;

            if (!newFolderName) {
                alert('请输入文件夹名称');
                return;
            }

            if (isNew && buttonConfig.folders[newFolderName]) {
                alert("该文件夹已存在！");
                return;
            }

            if (!isNew && newFolderName !== folderName && buttonConfig.folders[newFolderName]) {
                alert("该文件夹已存在！");
                return;
            }

            if (!isNew && newFolderName !== folderName) {
                const oldButtons = buttonConfig.folders[folderName].buttons;
                buttonConfig.folders[newFolderName] = {
                    ...buttonConfig.folders[folderName],
                    color: newColor,
                    textColor: newTextColor,
                    buttons: { ...oldButtons }
                };
                delete buttonConfig.folders[folderName];
                const idx = buttonConfig.folderOrder.indexOf(folderName);
                if (idx > -1) {
                    buttonConfig.folderOrder[idx] = newFolderName;
                }
            } else {
                buttonConfig.folders[newFolderName] = buttonConfig.folders[newFolderName] || { buttons: {} };
                buttonConfig.folders[newFolderName].color = newColor;
                buttonConfig.folders[newFolderName].textColor = newTextColor;

                // 确保新建文件夹有hidden字段且默认为false
                if (typeof buttonConfig.folders[newFolderName].hidden !== 'boolean') {
                    buttonConfig.folders[newFolderName].hidden = false;
                }

                // 在isNew分支中把新建的文件夹名加入folderOrder
                if (isNew) {
                    buttonConfig.folderOrder.push(newFolderName);
                }
            }

            // 确保所有按钮都有'type'字段和'autoSubmit'字段
            Object.entries(buttonConfig.folders).forEach(([folderName, folderCfg]) => {
                Object.entries(folderCfg.buttons).forEach(([btnName, btnCfg]) => {
                    if (!btnCfg.type) {
                        if (folderName === "🖱️") {
                            btnCfg.type = "tool";
                        } else {
                            btnCfg.type = "template";
                        }
                    }
                    if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                        btnCfg.autoSubmit = false;
                    }
                });
            });

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn(newFolderName);
            console.log(`✅ 文件夹 "${newFolderName}" 已保存。`);
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const createSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = '⚙️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.addEventListener('click', showUnifiedSettingsDialog);
        return button;
    };

    const createCutButton = () => {
        const button = document.createElement('button');
        button.innerText = '✂️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = '剪切输入框内容';
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
                // 清空textarea内容
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(focusedElement, '');
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'deleteContent'
                });
                focusedElement.dispatchEvent(inputEvent);
            } else {
                // 处理contenteditable元素
                const childNodes = Array.from(focusedElement.childNodes);
                const textParts = [];
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textParts.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textParts.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textParts.push('\n');
                        textParts.push(node.textContent);
                    }
                });
                text = textParts.join('');
                // 清空contenteditable内容
                setTrustedHTML(focusedElement, '');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log("✅ 已剪切输入框内容到剪贴板。");
                    showTemporaryFeedback(focusedElement, '剪切成功');
                }).catch(err => {
                    console.error("剪切失败:", err);
                    alert("剪切失败，请检查浏览器权限。");
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log("✅ 输入框内容已清空。");
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    const createCopyButton = () => {
        const button = document.createElement('button');
        button.innerText = '🅲';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = '复制输入框内容';
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
            } else {
                const textContent = [];
                const childNodes = Array.from(focusedElement.childNodes);
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textContent.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textContent.push('\n');
                        textContent.push(node.textContent);
                    }
                });
                text = textContent.join('');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log("✅ 已复制输入框内容到剪贴板。");
                    showTemporaryFeedback(focusedElement, '复制成功');
                }).catch(err => {
                    console.error("复制失败:", err);
                    alert("复制失败，请检查浏览器权限。");
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createPasteButton = () => {
        const button = document.createElement('button');
        button.innerText = '🆅';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = '粘贴剪切板内容';
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                return;
            }
            try {
                const clipboardText = await navigator.clipboard.readText();
                // 使用现有的insertTextSmart函数插入文本
                insertTextSmart(focusedElement, clipboardText);
                // 添加视觉反馈
                const originalText = button.innerText;
                button.innerText = '✓';
                button.style.backgroundColor = 'var(--success-color, #22c55e)';
                button.style.color = 'white';
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                    button.style.color = 'var(--text-color, #333333)';
                }, 1000);
                console.log("✅ 已粘贴剪贴板内容到输入框。");
            } catch (err) {
                console.error("访问剪切板失败:", err);
                alert("粘贴失败，请检查浏览器权限。");
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createClearButton = () => {
        const button = document.createElement('button');
        button.innerText = '✖️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = '清空输入框';
        // 添加mousedown事件处理器来阻止焦点切换
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement.tagName === 'TEXTAREA' || focusedElement.getAttribute('contenteditable') === 'true')) {
                console.warn("当前未聚焦到有效的 textarea 或 contenteditable 元素。");
                return;
            }
            // 使用现有的insertTextSmart函数清空内容
            insertTextSmart(focusedElement, '', true);
            // 确保立即重新聚焦
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log("✅ 输入框内容已清空。");
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    // 新增的配置设置按钮和弹窗
    const createConfigSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = '🛠️ 配置管理';
        button.type = 'button';
        button.style.backgroundColor = 'var(--info-color, #4F46E5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.addEventListener('click', showConfigSettingsDialog);
        return button;
    };

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
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        console.log("📤 配置已导出。");
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

        const overlay = document.createElement('div');
        overlay.classList.add('import-confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('import-confirm-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 480px;
            max-width: 90vw;
            transform: scale(0.95);
            position: relative;
            z-index: 13001;
        `;

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
                    📥 确认导入配置
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
                ">📊 配置对比</h4>

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
                        ">当前配置</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">个文件夹</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">个按钮</span>
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
                        ">导入配置</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">个文件夹</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">个按钮</span>
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
                    <strong>注意：导入配置将完全替换当前配置，此操作无法撤销！</strong>
                </div>
            </div>

            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            ">
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
                ">取消</button>
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
                ">确认导入</button>
            </div>
        `);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // 按钮事件
        dialog.querySelector('#cancelImport').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (onCancel) onCancel();
        });

        dialog.querySelector('#confirmImport').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;

            // 添加短暂延时，确保弹窗关闭动画完成后再执行导入
            setTimeout(() => {
                if (onConfirm) {
                    onConfirm();
                }
            }, 100);
        });

        // 点击外部关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeExistingOverlay(overlay);
                currentConfirmOverlay = null;
                if (onCancel) onCancel();
            }
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
                            alert('导入的配置文件无效！缺少必要字段。');
                            return;
                        }

                        // 显示预览确认对话框
                        showImportConfirmDialog(
                            importedConfig,
                            () => {
                                // 用户确认导入
                                try {
                                    // 替换现有配置
                                    buttonConfig = importedConfig;

                                    // 确保所有按钮都有'type'字段和'autoSubmit'字段
                                    Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                                        // 确保文件夹有hidden字段
                                        if (typeof folderConfig.hidden !== 'boolean') {
                                            folderConfig.hidden = false;
                                        }

                                        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
                                            if (!btnCfg.type) {
                                                if (folderName === "🖱️") {
                                                    btnCfg.type = "tool";
                                                } else {
                                                    btnCfg.type = "template";
                                                }
                                            }
                                            if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                                                btnCfg.autoSubmit = false;
                                            }
                                        });
                                    });

                                    // 保存配置
                                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

                                    // 重新渲染设置面板（如果打开）
                                    if (rerenderFn) {
                                        // 重置选中的文件夹为第一个
                                        selectedFolderName = buttonConfig.folderOrder[0] || null;
                                        rerenderFn();
                                    }

                                    console.log("📥 配置已成功导入。");

                                    // 更新按钮栏
                                    updateButtonContainer();

                                    // 立即更新所有计数器
                                    setTimeout(() => {
                                        updateCounters();
                                        console.log("📊 导入后计数器已更新。");

                                        // 延时执行回调函数，确保所有渲染完成
                                        setTimeout(() => {
                                            if (rerenderFn) {
                                                rerenderFn();
                                            }
                                        }, 150);
                                    }, 100);

                                } catch (error) {
                                    console.error('导入配置时发生错误:', error);
                                    alert('导入配置时发生错误，请检查文件格式。');
                                }
                            },
                            () => {
                                // 用户取消导入
                                console.log("❌ 用户取消了配置导入。");
                            }
                        );

                    } else {
                        alert('导入的配置文件内容无效！');
                    }
                } catch (error) {
                    console.error('解析配置文件失败:', error);
                    alert('导入的配置文件解析失败！请确认文件格式正确。');
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // 新增的单独配置设置弹窗
    const showConfigSettingsDialog = () => {
        if (currentConfigOverlay) {
            closeExistingOverlay(currentConfigOverlay);
        }
        const overlay = document.createElement('div');
        overlay.classList.add('config-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 12000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('config-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;

        setTrustedHTML(dialog, `
            <h3 style="margin:0 0 20px 0;font-size:18px;font-weight:600; color: var(--text-color, #333333);">🛠️ 配置管理</h3>
            <div style="
                display:flex;
                flex-direction:column;
                gap:20px;
                margin-bottom:20px;
            ">
                <!-- 重置按钮部分 -->
                <div style="
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                    padding-bottom:16px;
                    border-bottom:1px solid var(--border-color, #e5e7eb);
                ">
                    <span style="margin-right:12px;color: var(--text-color, #333333);">恢复默认设置：</span>
                    <button id="resetSettingsBtn" style="
                        ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                        background-color: var(--cancel-color, #6B7280);
                        color: white;
                        border-radius:4px;
                    ">↩️ 重置</button>
                </div>
                <!-- 导入导出部分 -->
                <div style="
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                ">
                    <span style="margin-right:12px;color: var(--text-color, #333333);">配置导入导出：</span>
                    <div style="display:flex;gap:8px;">
                        <button id="importConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--add-color, #fd7e14);
                            color: white;
                            border-radius:4px;
                        ">📥 导入</button>
                        <button id="exportConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:4px;
                        ">📤 导出</button>
                    </div>
                </div>
            </div>
        `);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfigOverlay = overlay;

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeExistingOverlay(overlay);
                if (currentConfigOverlay === overlay) {
                    currentConfigOverlay = null;
                }
                console.log("✅ 配置管理弹窗已通过点击外部关闭");
            }
        });

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#importConfigBtn').addEventListener('click', () => {
            importConfig(() => {
                // 重新渲染主设置面板
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                    // 确保计数器也被更新
                    setTimeout(() => {
                        updateCounters();
                    }, 50);
                }

                // 导入成功后关闭配置管理弹窗
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log("✅ 配置管理弹窗已自动关闭");
                }
            });
        });

        dialog.querySelector('#exportConfigBtn').addEventListener('click', () => {
            exportConfig();
            // 导出完成后关闭配置管理弹窗
            setTimeout(() => {
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log("✅ 配置管理弹窗已在导出后关闭");
                }
            }, 500); // 给导出操作一些时间完成
        });

        dialog.querySelector('#resetSettingsBtn').addEventListener('click', () => {
            if (confirm('确认重置所有配置为默认设置吗？')) {
                // 先关闭配置管理弹窗，提升用户体验
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log("✅ 配置管理弹窗已在重置前关闭");
                }

                // 执行配置重置
                buttonConfig = JSON.parse(JSON.stringify(defaultConfig));
                // 重置folderOrder
                buttonConfig.folderOrder = Object.keys(buttonConfig.folders);
                // 确保所有按钮都有'type'字段和'autoSubmit'字段
                Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                    Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
                        if (!btnCfg.type) {
                            if (folderName === "🖱️") {
                                btnCfg.type = "tool";
                            } else {
                                btnCfg.type = "template";
                            }
                        }
                        if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                            btnCfg.autoSubmit = false;
                        }
                    });
                });
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

                // 重新渲染设置面板（如果还打开着）
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                }

                console.log("🔄 配置已重置为默认设置。");

                // 更新按钮栏
                updateButtonContainer();

                // 立即更新计数器
                setTimeout(() => {
                    updateCounters();
                    console.log("📊 重置后计数器已更新。");

                    // 在所有更新完成后显示成功提示
                    setTimeout(() => {
                        alert('已重置为默认配置');
                    }, 50);
                }, 100);
            }
        });
    };

    let selectedFolderName = buttonConfig.folderOrder[0] || null; // 在设置面板中使用
    let folderListContainer, buttonListContainer; // 在渲染函数中定义

    const renderFolderList = () => {
        if (!folderListContainer) return;
        setTrustedHTML(folderListContainer, '');
        const foldersArray = buttonConfig.folderOrder.map(fname => [fname, buttonConfig.folders[fname]]).filter(([f,c])=>c);
        foldersArray.forEach(([fname, fconfig]) => {
            const folderItem = document.createElement('div');
            folderItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border-radius: 4px;
                margin: 4px 0;
                background-color: ${selectedFolderName === fname ? (isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)') : 'transparent'};
                cursor: move;
                direction: ltr;
                min-height: 36px;
            `;
            folderItem.classList.add('folder-item');
            folderItem.setAttribute('draggable', 'true');
            folderItem.setAttribute('data-folder', fname);

            const {container: leftInfo, folderPreview} = (function createFolderPreview(fname, fconfig){
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '8px';
                container.style.flex = '1';
                container.style.minWidth = '0'; // 允许收缩
                container.style.paddingRight = '8px';

                const folderPreview = document.createElement('button');
                folderPreview.textContent = fname;
                folderPreview.style.backgroundColor = fconfig.color;
                folderPreview.style.color = fconfig.textColor || '#ffffff';
                folderPreview.style.border = 'none';
                folderPreview.style.borderRadius = '4px';
                folderPreview.style.padding = '4px 8px';
                folderPreview.style.fontSize = '14px';
                folderPreview.style.cursor = 'grab';
                folderPreview.style.whiteSpace = 'nowrap';
                folderPreview.style.overflow = 'hidden';
                folderPreview.style.textOverflow = 'ellipsis';
                folderPreview.style.maxWidth = '140px';

                container.appendChild(folderPreview);
                return {container, folderPreview};
            })(fname, fconfig);

            const rightBtns = document.createElement('div');
            rightBtns.style.display = 'flex';
            rightBtns.style.gap = '4px'; // 增加按钮间的间距
            rightBtns.style.alignItems = 'center';
            rightBtns.style.width = '130px'; // 与标签栏保持一致的宽度
            rightBtns.style.justifyContent = 'flex-start'; // 改为左对齐
            rightBtns.style.paddingLeft = '8px'; // 添加左侧padding与标签栏对齐
            rightBtns.style.paddingRight = '12px'; // 添加右侧padding

            // 创建隐藏状态勾选框容器
            const hiddenCheckboxContainer = document.createElement('div');
            hiddenCheckboxContainer.style.display = 'flex';
            hiddenCheckboxContainer.style.alignItems = 'center';
            hiddenCheckboxContainer.style.justifyContent = 'center';
            hiddenCheckboxContainer.style.width = '36px'; // 与标签栏"显示"列宽度一致
            hiddenCheckboxContainer.style.marginRight = '4px'; // 添加右边距
            hiddenCheckboxContainer.style.padding = '2px';
            hiddenCheckboxContainer.style.borderRadius = '3px';
            hiddenCheckboxContainer.style.cursor = 'pointer';
            hiddenCheckboxContainer.title = '勾选后该文件夹将在主界面显示';

            const hiddenCheckbox = document.createElement('input');
            hiddenCheckbox.type = 'checkbox';
            hiddenCheckbox.checked = !fconfig.hidden; // 勾选表示显示
            hiddenCheckbox.style.cursor = 'pointer';
            hiddenCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
            hiddenCheckbox.style.margin = '0';
            hiddenCheckbox.style.transform = 'scale(1.1)'; // 稍微放大勾选框以便操作

            // 删除了checkboxText元素，不再显示"显示"文字

            // 关键修复：先添加change事件监听器到checkbox
            hiddenCheckbox.addEventListener('change', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const newHiddenState = !hiddenCheckbox.checked;
                fconfig.hidden = newHiddenState;
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                console.log(`✅ 文件夹 "${fname}" 的隐藏状态已设置为 ${fconfig.hidden}`);
                updateButtonContainer();
            });

            // 为checkbox添加click事件，确保优先处理
            hiddenCheckbox.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            });

            // 容器点击事件，点击容器时切换checkbox状态
            hiddenCheckboxContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 如果点击的不是checkbox本身，则手动切换checkbox状态
                if (e.target !== hiddenCheckbox) {
                    hiddenCheckbox.checked = !hiddenCheckbox.checked;
                    // 手动触发change事件
                    const changeEvent = new Event('change', { bubbles: false });
                    hiddenCheckbox.dispatchEvent(changeEvent);
                }
            });

            hiddenCheckboxContainer.appendChild(hiddenCheckbox);
            // 不再添加checkboxText


            // 创建编辑按钮
            const editFolderBtn = document.createElement('button');
            editFolderBtn.textContent = '✏️';
            editFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--primary-color, #3B82F6);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
            `;
            editFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showFolderEditDialog(fname, fconfig, (newFolderName) => {
                    selectedFolderName = newFolderName;
                    renderFolderList();
                    renderButtonList();
                });
            });

            const deleteFolderBtn = document.createElement('button');
            deleteFolderBtn.textContent = '🗑️';
            deleteFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--danger-color, #ef4444);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            deleteFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteFolderConfirmDialog(fname, () => {
                    const allFolders = buttonConfig.folderOrder;
                    selectedFolderName = allFolders[0] || null;
                    renderFolderList();
                    renderButtonList();
                    updateCounters(); // 更新所有计数器
                });
            });

            rightBtns.appendChild(hiddenCheckboxContainer);
            rightBtns.appendChild(editFolderBtn);
            rightBtns.appendChild(deleteFolderBtn);

            folderItem.appendChild(leftInfo);
            folderItem.appendChild(rightBtns);

            // 修改folderItem的点击事件，排除右侧按钮区域
            folderItem.addEventListener('click', (e) => {
                // 如果点击的是右侧按钮区域，不触发文件夹选择
                if (rightBtns.contains(e.target)) {
                    return;
                }
                selectedFolderName = fname;
                renderFolderList();
                renderButtonList();
            });

            folderItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', fname);
                folderItem.style.opacity = '0.5';
            });

            folderItem.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            folderItem.addEventListener('dragenter', () => {
                folderItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
            });

            folderItem.addEventListener('dragleave', () => {
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedFolder = e.dataTransfer.getData('text/plain');
                if (draggedFolder && draggedFolder !== fname) {
                    const draggedIndex = buttonConfig.folderOrder.indexOf(draggedFolder);
                    const targetIndex = buttonConfig.folderOrder.indexOf(fname);
                    if (draggedIndex > -1 && targetIndex > -1) {
                        const [removed] = buttonConfig.folderOrder.splice(draggedIndex, 1);
                        buttonConfig.folderOrder.splice(targetIndex, 0, removed);
                        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                        renderFolderList();
                        renderButtonList();
                        console.log(`🔄 文件夹顺序已更新：${draggedFolder} 移动到 ${fname} 前。`);
                        // 更新按钮栏
                        updateButtonContainer();
                    }
                }
                // Check if a button is being dropped onto this folder
                const buttonData = e.dataTransfer.getData('application/json');
                if (buttonData) {
                    try {
                        const { buttonName: draggedBtnName, sourceFolder } = JSON.parse(buttonData);
                        if (draggedBtnName && sourceFolder && sourceFolder !== fname) {
                            // Move the button from sourceFolder to fname
                            const button = buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                            if (button) {
                                // Remove from source
                                delete buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                                // Add to target
                                buttonConfig.folders[fname].buttons[draggedBtnName] = button;
                                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                                renderFolderList();
                                renderButtonList();
                                console.log(`🔄 按钮 "${draggedBtnName}" 已从 "${sourceFolder}" 移动到 "${fname}"。`);
                                // Update button container
                                updateButtonContainer();
                            }
                        }
                    } catch (error) {
                        console.error("解析拖放数据失败:", error);
                    }
                }
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('dragend', () => {
                folderItem.style.opacity = '1';
            });

            folderListContainer.appendChild(folderItem);
        });
    };

    // 升级：更新所有计数显示的函数
    const updateCounters = () => {
        // 计算统计数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 更新文件夹总数计数
        const folderCountBadge = queryUI('#folderCountBadge');
        if (folderCountBadge) {
            folderCountBadge.textContent = totalFolders.toString();
            folderCountBadge.title = `共有 ${totalFolders} 个文件夹`;
        }

        // 更新按钮总数计数
        const totalButtonCountBadge = queryUI('#totalButtonCountBadge');
        if (totalButtonCountBadge) {
            totalButtonCountBadge.textContent = totalButtons.toString();
            totalButtonCountBadge.title = `所有文件夹共有 ${totalButtons} 个按钮`;
        }

        // 更新当前文件夹按钮数计数
        if (selectedFolderName && buttonConfig.folders[selectedFolderName]) {
            const currentFolderButtonCount = Object.keys(buttonConfig.folders[selectedFolderName].buttons).length;
            const currentFolderBadge = queryUI('#currentFolderButtonCount');
            if (currentFolderBadge) {
                currentFolderBadge.textContent = currentFolderButtonCount.toString();
                currentFolderBadge.title = `"${selectedFolderName}" 文件夹有 ${currentFolderButtonCount} 个按钮`;
            }
        }

        console.log(`📊 计数器已更新: ${totalFolders}个文件夹, ${totalButtons}个按钮总数`);
    };

    const renderButtonList = () => {
        if (!buttonListContainer) return;
        setTrustedHTML(buttonListContainer, '');
        if (!selectedFolderName) return;
        const currentFolderConfig = buttonConfig.folders[selectedFolderName];
        if (!currentFolderConfig) return;

    const rightHeader = document.createElement('div');
    rightHeader.style.display = 'flex';
    rightHeader.style.justifyContent = 'space-between';
    rightHeader.style.alignItems = 'center';
    rightHeader.style.marginBottom = '8px';

    const folderNameLabel = document.createElement('h3');
    folderNameLabel.style.display = 'flex';
    folderNameLabel.style.alignItems = 'center';
    folderNameLabel.style.gap = '10px';
    folderNameLabel.style.margin = '0';

    const folderNameText = document.createElement('span');
    setTrustedHTML(folderNameText, `➤ <strong>${selectedFolderName}</strong>`);

    const buttonCountBadge = document.createElement('span');
    buttonCountBadge.id = 'currentFolderButtonCount';
    buttonCountBadge.style.cssText = `
        background-color: var(--info-color, #6366F1);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        cursor: help;
        transition: all 0.2s ease;
    `;

    // 计算当前文件夹的按钮数量
    const buttonCount = Object.keys(currentFolderConfig.buttons).length;
    buttonCountBadge.textContent = buttonCount.toString();
    buttonCountBadge.title = `"${selectedFolderName}" 文件夹有 ${buttonCount} 个按钮`;

    // 添加hover效果
    buttonCountBadge.addEventListener('mouseenter', () => {
        buttonCountBadge.style.transform = 'scale(1.15)';
        buttonCountBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    });
    buttonCountBadge.addEventListener('mouseleave', () => {
        buttonCountBadge.style.transform = 'scale(1)';
        buttonCountBadge.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });

    folderNameLabel.appendChild(folderNameText);
    folderNameLabel.appendChild(buttonCountBadge);

    const addNewButtonBtn = document.createElement('button');
    Object.assign(addNewButtonBtn.style, styles.button, {
        backgroundColor: 'var(--add-color, #fd7e14)',
        color: 'white',
        borderRadius: '4px'
    });
    addNewButtonBtn.textContent = '+ 新建按钮';
    addNewButtonBtn.addEventListener('click', () => {
        showButtonEditDialog(selectedFolderName, '', {}, () => {
            renderButtonList();
        });
    });

    rightHeader.appendChild(folderNameLabel);
    rightHeader.appendChild(addNewButtonBtn);

    buttonListContainer.appendChild(rightHeader);

    // 新增：创建包含标签栏和内容的容器，滚动条将出现在此容器右侧
    const contentWithHeaderContainer = document.createElement('div');
    contentWithHeaderContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px;
    `;

    // 创建按钮列表标签栏 - 固定在滚动容器顶部
    const buttonHeaderBar = document.createElement('div');
    buttonHeaderBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        position: sticky;
        top: 0;
        z-index: 2;
        flex-shrink: 0;
    `;

    const leftButtonHeaderLabel = document.createElement('div');
    leftButtonHeaderLabel.textContent = '按钮预览';
    leftButtonHeaderLabel.style.flex = '1';
    leftButtonHeaderLabel.style.textAlign = 'left';
    leftButtonHeaderLabel.style.paddingLeft = '8px';

    const rightButtonHeaderLabels = document.createElement('div');
    rightButtonHeaderLabels.style.display = 'flex';
    rightButtonHeaderLabels.style.gap = '0px';
    rightButtonHeaderLabels.style.alignItems = 'center';
    rightButtonHeaderLabels.style.width = '180px';
    rightButtonHeaderLabels.style.paddingLeft = '8px';
    rightButtonHeaderLabels.style.paddingRight = '12px';

    const autoSubmitLabel = document.createElement('div');
    autoSubmitLabel.textContent = '自动提交';
    autoSubmitLabel.style.width = '54px';
    autoSubmitLabel.style.textAlign = 'center';
    autoSubmitLabel.style.fontSize = '12px';
    autoSubmitLabel.style.marginRight = '4px';

    const editButtonLabel = document.createElement('div');
    editButtonLabel.textContent = '修改';
    editButtonLabel.style.width = '40px';
    editButtonLabel.style.textAlign = 'center';
    editButtonLabel.style.fontSize = '12px';
    editButtonLabel.style.marginRight = '4px';

    const deleteButtonLabel = document.createElement('div');
    deleteButtonLabel.textContent = '删除';
    deleteButtonLabel.style.width = '36px';
    deleteButtonLabel.style.textAlign = 'center';
    deleteButtonLabel.style.fontSize = '12px';

    rightButtonHeaderLabels.appendChild(autoSubmitLabel);
    rightButtonHeaderLabels.appendChild(editButtonLabel);
    rightButtonHeaderLabels.appendChild(deleteButtonLabel);

    buttonHeaderBar.appendChild(leftButtonHeaderLabel);
    buttonHeaderBar.appendChild(rightButtonHeaderLabels);

    // 修改：内容区域不再需要自己的滚动条和边框
    const btnScrollArea = document.createElement('div');
    btnScrollArea.style.cssText = `
        flex: 1;
        padding: 8px;
        overflow-y: visible;
        min-height: 0;
    `;

    const currentFolderButtons = Object.entries(currentFolderConfig.buttons);
    const createButtonPreview = (btnName, btnCfg) => {
        const btnEl = createCustomButtonElement(btnName, btnCfg);
        btnEl.style.marginBottom = '0px';
        btnEl.style.marginRight = '8px';
        btnEl.style.cursor = 'grab';
        return btnEl;
    };

    currentFolderButtons.forEach(([btnName, cfg]) => {
        const btnItem = document.createElement('div');
        btnItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 4px;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px;
            background-color: var(--button-bg, #f3f4f6);
            cursor: move;
        `;
        btnItem.setAttribute('draggable', 'true');
        btnItem.setAttribute('data-button-name', btnName);

        const leftPart = document.createElement('div');
        leftPart.style.display = 'flex';
        leftPart.style.alignItems = 'center';
        leftPart.style.gap = '8px';

        const btnPreview = createButtonPreview(btnName, cfg);
        leftPart.appendChild(btnPreview);

        const opsDiv = document.createElement('div');
        opsDiv.style.display = 'flex';
        opsDiv.style.gap = '0px';
        opsDiv.style.alignItems = 'center';
        opsDiv.style.width = '180px';
        opsDiv.style.paddingLeft = '8px';
        opsDiv.style.paddingRight = '12px';

        // 创建"自动提交"开关容器
        const autoSubmitContainer = document.createElement('div');
        autoSubmitContainer.style.display = 'flex';
        autoSubmitContainer.style.alignItems = 'center';
        autoSubmitContainer.style.justifyContent = 'center';
        autoSubmitContainer.style.width = '60px';
        autoSubmitContainer.style.marginRight = '4px';

        const autoSubmitCheckbox = document.createElement('input');
        autoSubmitCheckbox.type = 'checkbox';
        autoSubmitCheckbox.checked = cfg.autoSubmit || false;
        autoSubmitCheckbox.style.cursor = 'pointer';
        autoSubmitCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
        autoSubmitCheckbox.style.margin = '0';
        autoSubmitCheckbox.style.transform = 'scale(1.1)';
        autoSubmitCheckbox.addEventListener('change', () => {
            cfg.autoSubmit = autoSubmitCheckbox.checked;
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(`✅ 按钮 "${btnName}" 的自动提交已设置为 ${autoSubmitCheckbox.checked}`);
        });

        autoSubmitContainer.appendChild(autoSubmitCheckbox);

        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--primary-color, #3B82F6);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 4px;
        `;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showButtonEditDialog(selectedFolderName, btnName, cfg, () => {
                renderButtonList();
            });
        });

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--danger-color, #ef4444);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteButtonConfirmDialog(selectedFolderName, btnName, () => {
                renderButtonList();
            });
        });

        opsDiv.appendChild(autoSubmitContainer);
        opsDiv.appendChild(editBtn);
        opsDiv.appendChild(deleteBtn);

        btnItem.appendChild(leftPart);
        btnItem.appendChild(opsDiv);

        btnItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: btnName,
                sourceFolder: selectedFolderName
            }));
            btnItem.style.opacity = '0.5';
        });

        btnItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        btnItem.addEventListener('dragenter', () => {
            btnItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
        });

        btnItem.addEventListener('dragleave', () => {
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const { buttonName: draggedBtnName } = data;
            if (draggedBtnName && draggedBtnName !== btnName) {
                const buttonsKeys = Object.keys(buttonConfig.folders[selectedFolderName].buttons);
                const draggedIndex = buttonsKeys.indexOf(draggedBtnName);
                const targetIndex = buttonsKeys.indexOf(btnName);
                if (draggedIndex > -1 && targetIndex > -1) {
                    const reordered = [...buttonsKeys];
                    reordered.splice(draggedIndex, 1);
                    reordered.splice(targetIndex, 0, draggedBtnName);
                    const newOrderedMap = {};
                    reordered.forEach(k => {
                        newOrderedMap[k] = buttonConfig.folders[selectedFolderName].buttons[k];
                    });
                    buttonConfig.folders[selectedFolderName].buttons = newOrderedMap;
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderButtonList();
                    console.log(`🔄 按钮顺序已更新：${draggedBtnName} 移动到 ${btnName} 前。`);
                    // 更新按钮栏
                    updateButtonContainer();
                }
            }
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('dragend', () => {
            btnItem.style.opacity = '1';
        });

        btnScrollArea.appendChild(btnItem);
    });

    // 修改：将标签栏和内容区域添加到新的容器中
    contentWithHeaderContainer.appendChild(buttonHeaderBar);
    contentWithHeaderContainer.appendChild(btnScrollArea);

    // 修改：将新容器添加到主容器中
    buttonListContainer.appendChild(contentWithHeaderContainer);
};

    function updateButtonBarHeight(newHeight) {
        const clamped = Math.min(150, Math.max(50, newHeight)); // 限制范围
        buttonConfig.buttonBarHeight = clamped;
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

        // 更新容器高度
        const container = queryUI('.folder-buttons-container');
        if (container) {
            container.style.height = clamped + 'px';
        }
        console.log("🔧 按钮栏高度已更新为", clamped, "px");
    }

    const showUnifiedSettingsDialog = () => {
        if (currentSettingsOverlay) {
            closeExistingOverlay(currentSettingsOverlay);
        }
        const overlay = document.createElement('div');
        overlay.classList.add('settings-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('settings-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 800px;
            max-width: 95vw;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '16px';

        const title = document.createElement('h2');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '12px';
        title.style.margin = '0';
        title.style.fontSize = '20px';
        title.style.fontWeight = '600';

        const titleText = document.createElement('span');
        titleText.textContent = "⚙️ 设置面板";

        // 计数器容器
        const countersContainer = document.createElement('div');
        countersContainer.style.display = 'flex';
        countersContainer.style.gap = '8px';
        countersContainer.style.alignItems = 'center';

        // 文件夹总数计数器（圆形）
        const folderCountBadge = document.createElement('span');
        folderCountBadge.id = 'folderCountBadge';
        folderCountBadge.style.cssText = `
            background-color: var(--primary-color, #3B82F6);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 按钮总数计数器（圆形）
        const totalButtonCountBadge = document.createElement('span');
        totalButtonCountBadge.id = 'totalButtonCountBadge';
        totalButtonCountBadge.style.cssText = `
            background-color: var(--success-color, #22c55e);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 计算初始数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 设置计数和提示
        folderCountBadge.textContent = totalFolders.toString();
        folderCountBadge.title = `共有 ${totalFolders} 个文件夹`;

        totalButtonCountBadge.textContent = totalButtons.toString();
        totalButtonCountBadge.title = `所有文件夹共有 ${totalButtons} 个按钮`;

        // 添加hover效果
        [folderCountBadge, totalButtonCountBadge].forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
                badge.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });

        countersContainer.appendChild(folderCountBadge);
        countersContainer.appendChild(totalButtonCountBadge);

        title.appendChild(titleText);
        title.appendChild(countersContainer);

        const headerBtnsWrapper = document.createElement('div');
        headerBtnsWrapper.style.display = 'flex';
        headerBtnsWrapper.style.gap = '10px';

        // 新建自动化按钮
        const automationBtn = document.createElement('button');
        automationBtn.innerText = '⚡ 自动化';
        automationBtn.type = 'button';
        automationBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        automationBtn.style.color = 'white';
        automationBtn.style.border = 'none';
        automationBtn.style.borderRadius = '4px';
        automationBtn.style.padding = '5px 10px';
        automationBtn.style.cursor = 'pointer';
        automationBtn.style.fontSize = '14px';
        automationBtn.addEventListener('click', () => {
            showAutomationSettingsDialog();
        });
        headerBtnsWrapper.appendChild(automationBtn);

        // 样式管理按钮
        const styleMgmtBtn = document.createElement('button');
        styleMgmtBtn.innerText = '🎨 样式管理';
        styleMgmtBtn.type = 'button';
        styleMgmtBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        styleMgmtBtn.style.color = 'white';
        styleMgmtBtn.style.border = 'none';
        styleMgmtBtn.style.borderRadius = '4px';
        styleMgmtBtn.style.padding = '5px 10px';
        styleMgmtBtn.style.cursor = 'pointer';
        styleMgmtBtn.style.fontSize = '14px';
        styleMgmtBtn.addEventListener('click', () => {
            showStyleSettingsDialog();
        });
        headerBtnsWrapper.appendChild(styleMgmtBtn);

        // 原有创建配置管理按钮
        const openConfigBtn = createConfigSettingsButton();
        headerBtnsWrapper.appendChild(openConfigBtn);

        // 原有保存关闭按钮
        const saveSettingsBtn = document.createElement('button');
        Object.assign(saveSettingsBtn.style, styles.button, {
            backgroundColor: 'var(--success-color, #22c55e)',
            color: 'white',
            borderRadius: '4px'
        });
        saveSettingsBtn.textContent = '💾 关闭并保存';
        saveSettingsBtn.addEventListener('click', () => {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

            // 关闭所有相关弹窗
            if (currentConfigOverlay) {
                closeExistingOverlay(currentConfigOverlay);
                currentConfigOverlay = null;
            }

            closeExistingOverlay(overlay);
            currentSettingsOverlay = null;
            attachButtons();
            console.log("✅ 设置已保存并关闭设置面板。");
            updateButtonContainer();
        });
        headerBtnsWrapper.appendChild(saveSettingsBtn);

        header.appendChild(title);
        header.appendChild(headerBtnsWrapper);

        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flex = '1';
        mainContainer.style.overflow = 'hidden';
        mainContainer.style.flexWrap = 'nowrap';
        mainContainer.style.overflowX = 'auto';
        mainContainer.style.borderTop = `1px solid var(--border-color, #e5e7eb)`;

        const folderPanel = document.createElement('div');
        folderPanel.style.display = 'flex';
        folderPanel.style.flexDirection = 'column';
        folderPanel.style.width = '280px';
        folderPanel.style.borderRight = `1px solid var(--border-color, #e5e7eb)`;
        folderPanel.style.minWidth = '280px';
        folderPanel.style.marginRight = '12px';
        folderPanel.style.overflowY = 'auto';
        folderPanel.style.padding = '2px 8px 8px 2px';

        // 新增：创建文件夹列表标签栏
        const folderHeaderBar = document.createElement('div');
        folderHeaderBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            position: sticky;
            top: 0;
            z-index: 1;
        `;

        const leftHeaderLabel = document.createElement('div');
        leftHeaderLabel.textContent = '文件夹名称';
        leftHeaderLabel.style.flex = '1';
        leftHeaderLabel.style.textAlign = 'left';
        leftHeaderLabel.style.paddingLeft = '8px';

        const rightHeaderLabels = document.createElement('div');
        rightHeaderLabels.style.display = 'flex';
        rightHeaderLabels.style.gap = '0px';
        rightHeaderLabels.style.alignItems = 'center';
        rightHeaderLabels.style.width = '140px'; // 增加宽度以提供更多间距
        rightHeaderLabels.style.paddingLeft = '8px'; // 添加左侧padding，向左移动标签
        rightHeaderLabels.style.paddingRight = '12px'; // 增加右侧间距

        const showLabel = document.createElement('div');
        showLabel.textContent = '显示';
        showLabel.style.width = '36px'; // 稍微减小宽度
        showLabel.style.textAlign = 'center';
        showLabel.style.fontSize = '12px';
        showLabel.style.marginRight = '4px'; // 添加右边距

        const editLabel = document.createElement('div');
        editLabel.textContent = '修改';
        editLabel.style.width = '36px'; // 稍微减小宽度
        editLabel.style.textAlign = 'center';
        editLabel.style.fontSize = '12px';
        editLabel.style.marginRight = '4px'; // 添加右边距

        const deleteLabel = document.createElement('div');
        deleteLabel.textContent = '删除';
        deleteLabel.style.width = '36px'; // 稍微减小宽度
        deleteLabel.style.textAlign = 'center';
        deleteLabel.style.fontSize = '12px';

        rightHeaderLabels.appendChild(showLabel);
        rightHeaderLabels.appendChild(editLabel);
        rightHeaderLabels.appendChild(deleteLabel);

        folderHeaderBar.appendChild(leftHeaderLabel);
        folderHeaderBar.appendChild(rightHeaderLabels);

        folderListContainer = document.createElement('div');
        folderListContainer.style.flex = '1';
        folderListContainer.style.overflowY = 'auto';
        folderListContainer.style.padding = '8px';
        folderListContainer.style.direction = 'rtl';
        folderListContainer.style.border = '1px solid var(--border-color, #e5e7eb)';
        folderListContainer.style.borderTop = 'none';
        folderListContainer.style.borderRadius = '0 0 4px 4px';

        const folderAddContainer = document.createElement('div');
        folderAddContainer.style.padding = '8px';
        folderAddContainer.style.borderTop = `1px solid var(--border-color, #e5e7eb)`;
        folderAddContainer.style.display = 'flex';
        folderAddContainer.style.justifyContent = 'center';

        const addNewFolderBtn = document.createElement('button');
        Object.assign(addNewFolderBtn.style, styles.button, {
            backgroundColor: 'var(--add-color, #fd7e14)',
            color: 'white',
            borderRadius: '4px'
        });
        addNewFolderBtn.textContent = '+ 新建文件夹';
        addNewFolderBtn.addEventListener('click', () => {
            showFolderEditDialog('', {}, (newFolderName) => {
                selectedFolderName = newFolderName;
                renderFolderList();
                renderButtonList();
                console.log(`🆕 新建文件夹 "${newFolderName}" 已添加。`);
            });
        });
        folderAddContainer.appendChild(addNewFolderBtn);

        folderPanel.appendChild(folderHeaderBar);
        folderPanel.appendChild(folderListContainer);
        folderPanel.appendChild(folderAddContainer);

        buttonListContainer = document.createElement('div');
        buttonListContainer.style.flex = '1';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.display = 'flex';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.padding = '8px';
        buttonListContainer.style.minWidth = '400px'; // 增加最小宽度以适应新布局

        renderFolderList();
        renderButtonList();

        mainContainer.appendChild(folderPanel);
        mainContainer.appendChild(buttonListContainer);

        const footer = document.createElement('div');
        footer.style.display = 'none';
        dialog.appendChild(header);
        dialog.appendChild(mainContainer);
        dialog.appendChild(footer);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentSettingsOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
    };

let currentAutomationOverlay = null;
/**
 *
 * 弹窗：自动化设置，显示所有 domainAutoSubmitSettings，并可删除、点击添加
 */
function showAutomationSettingsDialog() {
    // 若已存在则先关闭
    if (currentAutomationOverlay) {
        closeExistingOverlay(currentAutomationOverlay);
    }

    // 使用 createUnifiedDialog 统一创建 overlay + dialog
    const { overlay, dialog } = createUnifiedDialog({
        title: '⚡ 自动化设置',
        width: '750px',  // 保留你想要的宽度
        onClose: () => {
            currentAutomationOverlay = null;
        }
    });
    currentAutomationOverlay = overlay;

    // 这里是新写法：在 dialog 里 appendChild 内部内容
    // 注意，createUnifiedDialog 已经注入了 overlay 与动画

    // 1) 构建内容区, 并插入到 dialog
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'right';
    infoDiv.style.marginBottom = '10px';

    // 原先的 "关闭并保存" 按钮
    const closeAutomationBtn = document.createElement('button');
    closeAutomationBtn.id = 'closeAutomationBtn';
    closeAutomationBtn.textContent = '💾 关闭并保存';
    closeAutomationBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute; /* 若想固定在右上角，可再自行定位 */
        top: 20px;
        right: 20px;
    `;
    closeAutomationBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        closeExistingOverlay(overlay);
        currentAutomationOverlay = null;
    });
    infoDiv.appendChild(closeAutomationBtn);
    dialog.appendChild(infoDiv);

    // 2) 表格容器 + 渲染 domainAutoSubmitSettings
    const tableContainer = document.createElement('div');
    tableContainer.style.border = '1px solid var(--border-color)';
    tableContainer.style.padding = '10px';
    tableContainer.style.borderRadius = '8px';
    tableContainer.style.maxHeight = '300px';
    tableContainer.style.overflow = 'auto';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    setTrustedHTML(thead, `
        <tr style="border-bottom:1px solid var(--border-color);">
            <th style="text-align:left;padding:4px;">备注名称</th>
            <th style="text-align:left;padding:4px;">网址</th>
            <th style="text-align:left;padding:4px;">自动提交方式</th>
            <th style="width:80px;"></th>
        </tr>
    `);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'domainRuleTbody';
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dialog.appendChild(tableContainer);

    function renderDomainRules() {
        setTrustedHTML(tbody, '');
        buttonConfig.domainAutoSubmitSettings.forEach((rule, idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            setTrustedHTML(tr, `
                <td style="padding:4px;">${rule.name}</td>
                <td style="padding:4px;">${rule.domain}</td>
                <td style="padding:4px;">${rule.method}</td>
                <td style="padding:4px;">
                    <button class="editRuleBtn" data-idx="${idx}" style="
                        background:none;border:none;cursor:pointer;color:var(--primary-color,#3B82F6);
                    ">✏️</button>
                    <button class="deleteRuleBtn" data-idx="${idx}" style="
                        background:none;border:none;cursor:pointer;color:var(--danger-color,#ef4444);
                    ">🗑️</button>
                </td>
            `);
            tbody.appendChild(tr);
        });

        // 删除、编辑逻辑
        tbody.querySelectorAll('.deleteRuleBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const delIdx = parseInt(btn.getAttribute('data-idx'), 10);
                buttonConfig.domainAutoSubmitSettings.splice(delIdx, 1);
                renderDomainRules();
            });
        });
        tbody.querySelectorAll('.editRuleBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const editIdx = parseInt(btn.getAttribute('data-idx'), 10);
                const ruleToEdit = buttonConfig.domainAutoSubmitSettings[editIdx];
                showDomainRuleEditorDialog(ruleToEdit, (newData) => {
                    buttonConfig.domainAutoSubmitSettings[editIdx] = newData;
                    renderDomainRules();
                });
            });
        });
    }
    renderDomainRules();

    // 3) 新建按钮
    const addDiv = document.createElement('div');
    addDiv.style.marginTop = '12px';
    addDiv.style.textAlign = 'left';

    const addBtn = document.createElement('button');
    addBtn.textContent = '+ 新建';
    addBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    addBtn.addEventListener('click', () => {
        showDomainRuleEditorDialog({}, (newData) => {
            buttonConfig.domainAutoSubmitSettings.push(newData);
            renderDomainRules();
        });
    });
    addDiv.appendChild(addBtn);
    dialog.appendChild(addDiv);

}


function showStyleSettingsDialog() {
    // 若已存在则关闭
    if (currentConfirmOverlay) {
        closeExistingOverlay(currentConfirmOverlay);
    }

    // 使用统一弹窗
    const { overlay, dialog } = createUnifiedDialog({
        title: '🎨 样式管理',
        width: '750px',
        onClose: () => {
            currentConfirmOverlay = null;
        }
    });
    currentConfirmOverlay = overlay;

    // 说明文字
    const desc = document.createElement('p');
    desc.textContent = '您可根据不同网址，自定义按钮栏高度和注入CSS样式。';
    dialog.appendChild(desc);

    // 表格容器
    const tableContainer = document.createElement('div');
    tableContainer.style.border = '1px solid var(--border-color)';
    tableContainer.style.padding = '10px';
    tableContainer.style.borderRadius = '8px';
    tableContainer.style.maxHeight = '300px';
    tableContainer.style.overflow = 'auto';
    tableContainer.style.marginBottom = '12px';

    const styleTable = document.createElement('table');
    styleTable.style.width = '100%';
    styleTable.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    setTrustedHTML(thead, `
        <tr style="border-bottom:1px solid var(--border-color);">
            <th style="text-align:left;padding:4px;">备注名称</th>
            <th style="text-align:left;padding:4px;">网址</th>
            <th style="text-align:left;padding:4px;">高度(px)</th>
            <th style="text-align:left;padding:4px;">自定义CSS</th>
            <th style="width:80px;"></th>
        </tr>
    `);
    styleTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    styleTable.appendChild(tbody);
    tableContainer.appendChild(styleTable);
    dialog.appendChild(tableContainer);

    function renderDomainStyles() {
        setTrustedHTML(tbody, '');
        buttonConfig.domainStyleSettings.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            setTrustedHTML(tr, `
                <td style="padding:4px;">${item.name || ''}</td>
                <td style="padding:4px;">${item.domain || ''}</td>
                <td style="padding:4px;">${item.height || ''}</td>
                <td style="padding:4px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                    title="${(item.cssCode || '').replace(/"/g, '&quot;')}">
                    ${(item.cssCode || '').substring(0, 30).replace(/\n/g, ' ')}...
                </td>
                <td style="padding:4px;">
                    <button class="editStyleBtn" data-idx="${idx}" style="
                        background:none;border:none;cursor:pointer;color:var(--primary-color,#3B82F6);
                    ">✏️</button>
                    <button class="deleteStyleBtn" data-idx="${idx}" style="
                        background:none;border:none;cursor:pointer;color:var(--danger-color,#ef4444);
                    ">🗑️</button>
                </td>
            `);
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.deleteStyleBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-idx'), 10);
                buttonConfig.domainStyleSettings.splice(index, 1);
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                renderDomainStyles();
            });
        });
        tbody.querySelectorAll('.editStyleBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-idx'), 10);
                showEditDomainStyleDialog(index);
            });
        });
    }
    renderDomainStyles();

    // 新建
    const addStyleBtn = document.createElement('button');
    addStyleBtn.textContent = '+ 新建';
    addStyleBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        margin-bottom: 12px;
    `;
    addStyleBtn.addEventListener('click', () => {
        showEditDomainStyleDialog(); // 新建
    });
    dialog.appendChild(addStyleBtn);

    // 右上角关闭并保存
    const closeSaveBtn = document.createElement('button');
    closeSaveBtn.textContent = '💾 关闭并保存';
    closeSaveBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute;
        top: 20px;
        right: 20px;
    `;
    closeSaveBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        closeExistingOverlay(overlay);
        currentConfirmOverlay = null;
    });
    dialog.style.position = 'relative';
    dialog.appendChild(closeSaveBtn);

}

    /**
     * 新建/编辑域名样式对话框
     * @param {number} index - 可选，若存在则为编辑，否则新建
     */
let currentAddDomainOverlay = null; // 保持原有声明
function showEditDomainStyleDialog(index) {
    if (currentAddDomainOverlay) {
        closeExistingOverlay(currentAddDomainOverlay);
    }
    const isEdit = (typeof index === 'number');
    const styleItem = isEdit
        ? { ...buttonConfig.domainStyleSettings[index] }
        : {
            domain: window.location.hostname,
            name: document.title || '新样式',
            height: 40,
            cssCode: ''
        };

    // 使用统一弹窗
    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? '编辑自定义样式' : '新建自定义样式',
        width: '400px',
        onClose: () => {
            currentAddDomainOverlay = null;
        }
    });
    currentAddDomainOverlay = overlay;

    // 对话框表单
    const title2 = document.createElement('h3');
    title2.textContent = isEdit ? '编辑自定义样式' : '新建自定义样式';
    dialog.appendChild(title2);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = '备注名称：';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = styleItem.name;
    nameInput.style.cssText = `
        width:100%;margin-bottom:8px;padding:6px;
        border:1px solid var(--border-color);border-radius:4px;
    `;
    dialog.appendChild(nameLabel);
    dialog.appendChild(nameInput);

    const domainLabel = document.createElement('label');
    domainLabel.textContent = '网址：';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.value = styleItem.domain;
    domainInput.style.cssText = `
        width:100%;margin-bottom:8px;padding:6px;
        border:1px solid var(--border-color);border-radius:4px;
    `;
    dialog.appendChild(domainLabel);
    dialog.appendChild(domainInput);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = '按钮栏高度(px)：';
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.min = '20';
    heightInput.max = '200';
    heightInput.value = styleItem.height;
    heightInput.style.cssText = `
        width:100%;margin-bottom:8px;padding:6px;
        border:1px solid var(--border-color);border-radius:4px;
    `;
    dialog.appendChild(heightLabel);
    dialog.appendChild(heightInput);

    const cssLabel = document.createElement('label');
    cssLabel.textContent = '自定义CSS：';
    const cssTextarea = document.createElement('textarea');
    cssTextarea.value = styleItem.cssCode;
    cssTextarea.style.cssText = `
        width:100%;height:80px;margin-bottom:8px;padding:6px;
        border:1px solid var(--border-color);border-radius:4px;resize:vertical;
    `;
    dialog.appendChild(cssLabel);
    dialog.appendChild(cssTextarea);

    // 底部按钮
    const footer2 = document.createElement('div');
    footer2.style.textAlign = 'right';
    footer2.style.display = 'flex';
    footer2.style.justifyContent = 'flex-end';
    footer2.style.gap = '12px';

    const cancelBtn2 = document.createElement('button');
    cancelBtn2.textContent = '取消';
    cancelBtn2.style.cssText = `
        background-color: var(--cancel-color, #6B7280);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    cancelBtn2.addEventListener('click', () => {
        closeExistingOverlay(overlay);
    });
    footer2.appendChild(cancelBtn2);

    const saveBtn2 = document.createElement('button');
    saveBtn2.textContent = isEdit ? '保存' : '创建';
    saveBtn2.style.cssText = `
        background-color: var(--success-color,#22c55e);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    saveBtn2.addEventListener('click', () => {
        const updatedItem = {
            domain: domainInput.value.trim(),
            name: nameInput.value.trim() || '未命名样式',
            height: parseInt(heightInput.value, 10) || 40,
            cssCode: cssTextarea.value
        };
        if (isEdit) {
            buttonConfig.domainStyleSettings[index] = updatedItem;
        } else {
            buttonConfig.domainStyleSettings.push(updatedItem);
        }
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        closeExistingOverlay(overlay);
        showStyleSettingsDialog(); // 刷新列表
    });
    footer2.appendChild(saveBtn2);

    dialog.appendChild(footer2);

}


// =============== [新增] showDomainRuleEditorDialog 统一新建/编辑弹窗 ===============
function showDomainRuleEditorDialog(ruleData, onSave) {
    // ruleData 若为空对象，则视为新建，否则编辑
    // 统一使用 createUnifiedDialog
    const isEdit = !!ruleData && ruleData.domain;

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? '编辑自动化规则' : '新建新网址规则',
        width: '400px',
        onClose: () => {
            // 关闭时的回调可写在此
        }
    });

    // 创建表单容器
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    container.style.marginBottom = '8px';

    // 网址
    const domainLabel = document.createElement('label');
    domainLabel.textContent = '网址：';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.style.width = '100%';
    domainInput.style.padding = '6px';
    domainInput.style.border = '1px solid var(--border-color)';
    domainInput.style.borderRadius = '4px';
    if(isEdit) {
        domainInput.value = ruleData.domain;
    } else {
        // 新建时，可选自动填当前页面
        domainInput.value = window.location.hostname || '';
    }
    domainLabel.appendChild(domainInput);
    container.appendChild(domainLabel);

    // 备注名称
    const nameLabel = document.createElement('label');
    nameLabel.textContent = '备注名称：';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.style.width = '100%';
    nameInput.style.padding = '6px';
    nameInput.style.border = '1px solid var(--border-color)';
    nameInput.style.borderRadius = '4px';
    if(isEdit) {
        nameInput.value = ruleData.name;
    } else {
        // 默认填充
        nameInput.value = document.title || '新网址规则';
    }
    nameLabel.appendChild(nameInput);
    container.appendChild(nameLabel);

    // 自动提交方式
    const methodLabel = document.createElement('label');
    methodLabel.textContent = '自动提交方式：';
    const methodSelect = document.createElement('select');
    methodSelect.style.width = '100%';
    methodSelect.style.padding = '6px';
    methodSelect.style.border = '1px solid var(--border-color)';
    methodSelect.style.borderRadius = '4px';

    ['Enter','Cmd+Enter','模拟点击提交按钮'].forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        methodSelect.appendChild(opt);
    });

    // 若编辑，设定默认选项
    if(isEdit && ruleData.method) {
        methodSelect.value = ruleData.method;
    }

    methodLabel.appendChild(methodSelect);
    container.appendChild(methodLabel);

    // 确认 & 取消 按钮
    const btnRow = document.createElement('div');
    btnRow.style.textAlign = 'right';
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '8px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.backgroundColor = 'var(--cancel-color,#6B7280)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.padding = '6px 12px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', () => {
        overlay.remove();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认';
    confirmBtn.style.backgroundColor = 'var(--success-color,#22c55e)';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.padding = '6px 12px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.addEventListener('click', () => {
        const newData = {
            domain: domainInput.value.trim(),
            name: nameInput.value.trim(),
            method: methodSelect.value
        };
        if(!newData.domain || !newData.name) {
            alert('请输入网址和备注名称！');
            return;
        }
        // 回调保存
        if(onSave) onSave(newData);
        // 关闭
        overlay.remove();
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    // 组装
    dialog.appendChild(container);
    dialog.appendChild(btnRow);

}

function isValidDomainInput(str) {
    // 简易：包含'.' 不含空格 即视为有效
    if (str.includes(' ')) return false;
    if (!str.includes('.')) return false;
    return true;
}

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setCSSVariables(getCurrentTheme());
        updateStylesOnThemeChange();
        console.log("🌓 主题模式已切换，样式已更新。");
    });

    const createButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            // 使用updateButtonContainer来处理已存在的容器
            updateButtonContainer();
            return existingContainer;
        }
        // 创建新容器
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('folder-buttons-container');
        buttonContainer.style.pointerEvents = 'auto';

        // 设置固定定位和位置
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '0px';
        buttonContainer.style.right = '0px';
        buttonContainer.style.width = '100%';
        buttonContainer.style.zIndex = '1000'; // 确保按钮容器始终显示在顶层

        // 基本样式
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'nowrap';  // 改为不换行
        buttonContainer.style.overflowX = 'auto';   // 横向滚动
        buttonContainer.style.overflowY = 'hidden'; // 禁止纵向滚动
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '0px';
        buttonContainer.style.height = buttonConfig.buttonBarHeight + 'px';

        // 滚动条处理
        buttonContainer.style.scrollbarWidth = 'none';        // for Firefox
        buttonContainer.style.msOverflowStyle = 'none';       // for IE/Edge
        buttonContainer.classList.add('hide-scrollbar');      // 用于自定义::-webkit-scrollbar

        // 内容布局
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.padding = '6px 15px';

        // 移除原有的背景色和阴影，设置为透明
        buttonContainer.style.backgroundColor = 'transparent';
        buttonContainer.style.boxShadow = 'none';
        buttonContainer.style.borderRadius = '4px';

        // 添加所有未隐藏的文件夹按钮
        buttonConfig.folderOrder.forEach((name) => {
            const config = buttonConfig.folders[name];
            if (config && !config.hidden) { // 只显示未隐藏的文件夹
                const folderButton = createFolderButton(name, config);
                buttonContainer.appendChild(folderButton);
            }
        });

        // 按顺序添加功能按钮
        // 现在所有工具按钮都在 '🖱️' 文件夹内，不再直接添加
        // 仅添加设置和清空按钮
        buttonContainer.appendChild(createSettingsButton());
        buttonContainer.appendChild(createClearButton());

        return buttonContainer;
    };

    const updateButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            // 保存所有功能按钮的引用
            const settingsButton = existingContainer.querySelector('button:nth-last-child(2)');
            const clearButton = existingContainer.querySelector('button:last-child');

            // 清空容器
            setTrustedHTML(existingContainer, '');

            // 重新添加未隐藏的文件夹按钮
            buttonConfig.folderOrder.forEach((name) => {
                const config = buttonConfig.folders[name];
                if (config && !config.hidden) { // 只显示未隐藏的文件夹
                    const folderButton = createFolderButton(name, config);
                    existingContainer.appendChild(folderButton);
                }
            });

            // 按正确顺序重新添加功能按钮
            if (settingsButton) existingContainer.appendChild(settingsButton);
            if (clearButton) existingContainer.appendChild(clearButton);

            console.log("✅ 按钮栏已更新（已过滤隐藏文件夹）。");
        } else {
            console.warn("⚠️ 未找到按钮容器，无法更新按钮栏。");
        }
    };

    const attachButtonsToTextarea = (textarea) => {
        // 仅附加一次按钮容器
        let buttonContainer = queryUI('.folder-buttons-container');
        if (!buttonContainer) {
            buttonContainer = createButtonContainer();
            // 插入按钮容器到 textarea 的父元素之后
            // 根据ChatGPT的DOM结构，可能需要调整插入位置
            // textarea.parentElement.insertBefore(buttonContainer, textarea.nextSibling);
            // console.log("✅ 按钮容器已附加到 textarea 元素。");
            appendToMainLayer(buttonContainer);
            console.log("✅ 按钮容器已固定到窗口底部。");
        } else {
            console.log("ℹ️ 按钮容器已存在，跳过附加。");
        }
        textarea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    };

    let attachTimeout;
    const attachButtons = () => {
        if (attachTimeout) clearTimeout(attachTimeout);
        attachTimeout = setTimeout(() => {
            const textareas = getAllTextareas();
            console.log(`🔍 扫描到 ${textareas.length} 个 textarea 或 contenteditable 元素。`);
            if (textareas.length === 0) {
                console.warn("⚠️ 未找到任何 textarea 或 contenteditable 元素。");
                return;
            }
            attachButtonsToTextarea(textareas[textareas.length - 1]);
            console.log("✅ 按钮已附加到最新的 textarea 或 contenteditable 元素。");
        }, 300);
    };

    const observeShadowRoots = (node) => {
        if (node.shadowRoot) {
            const shadowObserver = new MutationObserver(() => {
                attachButtons();
            });
            shadowObserver.observe(node.shadowRoot, {
                childList: true,
                subtree: true,
            });
            node.shadowRoot.querySelectorAll('*').forEach(child => observeShadowRoots(child));
        }
    };

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
                console.log("🔔 DOM 发生变化，尝试重新附加按钮。");
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log("🔔 MutationObserver 已启动，监听 DOM 变化。");

        (function applyDomainStyles() {
            const currentHost = window.location.hostname;
            // 找到第一个匹配的 domainStyleSettings (如需多个匹配，逻辑可自行修改)
            const matchedStyle = buttonConfig.domainStyleSettings.find(s => currentHost.includes(s.domain));
            if (matchedStyle) {
                // 1) 更新按钮栏高度
                const container = queryUI('.folder-buttons-container');
                if (container) {
                    const clamped = Math.min(200, Math.max(20, matchedStyle.height || 40));
                    container.style.height = clamped + 'px';
                    console.log(`✅ 已根据 ${matchedStyle.name} 设置按钮栏高度：${clamped}px`);
                }

                // 2) 注入自定义CSS
                if (matchedStyle.cssCode) {
                    const styleEl = document.createElement('style');
                    styleEl.setAttribute('data-domain-style', matchedStyle.domain);
                    styleEl.textContent = matchedStyle.cssCode;
                    document.head.appendChild(styleEl);
                    console.log(`✅ 已注入自定义CSS至 <head> 来自：${matchedStyle.name}`);
                }
            }
        })();
    };

    window.addEventListener('load', () => {
        console.log("⏳ 页面已完全加载，开始初始化脚本。");
        initialize();
    });

    // 动态更新样式以适应主题变化
    const updateStylesOnThemeChange = () => {
        // Since we're using CSS variables, the styles are updated automatically
        // Just update the button container to apply new styles
        updateButtonContainer();
    };

    // Initial setting of CSS variables
    setCSSVariables(getCurrentTheme());
})();
