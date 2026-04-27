// ==UserScript==
// @name         [Chat] Template Text Folders [20260427] v1.0.2
// @namespace    https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @description  在多个 AI 聊天网站中管理提示词文件夹与快捷按钮，支持变量插入、自动提交、样式定制和 Google Drive 同步。
//
// @version      [20260427] v1.0.2
// @update-log   新增 ChatHub 窄屏/移动端默认适配，使用位移抬升输入区，避免遮挡和布局空档。
//
// @match        https://chatgpt.com/*
// @match        https://chat01.ai/*
//
// @match        https://claude.*/*
//
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://business.gemini.google/*
//
// @match        https://copilot.microsoft.com/*
//
// @match        https://grok.com/*
// @match        https://grok.dairoot.cn/*
// @match        https://x.com/i/grok*
//
// @match        https://chat.deepseek.com/*
// @match        https://chat.z.ai/*
// @match        https://chat.qwen.ai/*
// @match        https://anuneko.com/*
// @match        https://cerebr.yym68686.top/*
//
// @match        https://chat.mistral.ai/*
//
// @match        https://*.perplexity.ai/*
//
// @match        https://arena.ai/*
// @match        https://manus.im/*
// @match        https://poe.com/*
// @match        https://kagi.com/assistant*
// @match        https://app.chathub.gg/*
// @match        https://monica.im/*
// @match        https://meta.ai/*
// @match        https://web.tabbitbrowser.com/*
//
// @match        https://setapp.typingcloud.com/*
//
// @match        https://www.notion.so/*
//
// @grant        GM_xmlhttpRequest
// @connect      oauth2.googleapis.com
// @connect      www.googleapis.com
// @connect      github.com
// @icon         https://raw.githubusercontent.com/0-V-linuxdo/Chat_Template_Text_Folders/main/Icon.svg
// ==/UserScript==

/* ===================== IMPORTANT · NOTICE · START =====================
 *
 * 1. [编辑指引 | Edit Guidance]
 *    • ⚠️ 这是一个自动生成的文件：请在 `src/` 目录下的源码中进行修改（如 `src/main.js`、`src/features/`、`src/core/`、`src/i18n/`），然后运行 `npm run build` 重新生成 `dist/` 目录下的产物。
 *    • ⚠️ This project bundles auto-generated artifacts. Make changes in the source files under `src/` (such as `src/main.js`, `src/features/`, `src/core/`, and `src/i18n/`), then run `npm run build` to regenerate the artifacts under `dist/`.
 *
 * ----------------------------------------------------------------------
 *
 * 2. [安全提示 | Safety Reminder]
 *    • ✅ 必须使用 `setTrustedHTML`，不得使用 `innerHTML`。
 *    • ✅ Always call `setTrustedHTML`; never rely on `innerHTML`.
 *
 * ====================== IMPORTANT · NOTICE · END ======================
 */

(() => {
  // src/i18n/catalog.js
  var messageCatalog = {
    "config.drive_unsaved.continue_edit": { zh: "继续编辑", en: "Continue Editing" },
    "config.drive_unsaved.discard_close": { zh: "放弃并关闭", en: "Discard & Close" },
    "config.drive_unsaved.message": { zh: "当前 Drive 草稿有未保存改动。你可以先保存再关闭，也可以放弃这些改动。", en: "Your Drive draft has unsaved changes. Save before closing, or discard those edits." },
    "config.drive_unsaved.save_close": { zh: "保存并关闭", en: "Save & Close" },
    "config.drive_unsaved.title": { zh: "Drive 设置尚未保存", en: "Unsaved Drive Settings" },
    "i18n.automation.method.enter": { zh: "Enter", en: "Enter" },
    "i18n.automation.method.modifier_enter": { zh: "Cmd+Enter", en: "Cmd+Enter" },
    "i18n.common.toggle_visibility": { zh: "切换可见性", en: "Toggle visibility" },
    "i18n.log.open_diff_preview_failed": { zh: "[Chat] Template Text Folders 打开配置差异预览失败:", en: "[Chat] Template Text Folders failed to open config diff preview:" },
    "i18n.log.submit_event_failed": { zh: "触发 'submit' 事件失败:", en: "Failed to trigger 'submit' event:" },
    "m_017b3765c0b7": { zh: "❗️ 注意：此操作无法撤销！", en: "❗️ Warning: This action cannot be undone!" },
    "m_01ecd4be7d8f": { zh: '🔒 弹窗 "{{folderName}}" 已关闭（点击外部区域）。', en: '🔒 Dialog "{{folderName}}" closed (outside click).' },
    "m_0294a7240855": { zh: "当前提交方式没有可配置的高级选项。", en: "Current submission method has no advanced options." },
    "m_02be516690b9": { zh: "输入框", en: "Input Box" },
    "m_05249fe6e6af": { zh: "暂无差异，导入配置的结构与当前一致。", en: "No differences; imported structure matches the current configuration." },
    "m_06aa3f222c01": { zh: '✅ 按钮 "{{buttonName}}" 的自动提交已设置为 {{state}}', en: '✅ Auto-submit for button "{{buttonName}}" set to {{state}}' },
    "m_06d200850c0e": { zh: '✅ 弹窗 "{{folderName}}" 已立即关闭。', en: '✅ Dialog "{{folderName}}" closed immediately.' },
    "m_07ad1432b715": { zh: "展开/折叠高级选项", en: "Expand/Collapse advanced options" },
    "m_0812cae9b471": { zh: "✅ 自动提交已通过触发 'submit' 事件触发。", en: '✅ Auto-submit triggered via "submit" event.' },
    "m_0996aa586f31": { zh: "自动提交方式:", en: "Auto-submit Method:" },
    "m_09b1c4a5e9a1": { zh: "+ 新建文件夹", en: "+ New Folder" },
    "m_09b58aa3422c": { zh: "外观", en: "Appearance" },
    "m_0b423d85c092": { zh: "请选择以本地或云端配置为准，点击“查看差异”可展开详细对比。", en: 'Choose whether to keep local or Drive config. Click "View Diff" for details.' },
    "m_0b60cfe06c48": { zh: "共有 {{count}} 个文件夹", en: "Total of {{count}} folders" },
    "m_0c63ec5814d3": { zh: "尝试通过键盘快捷键提交表单：{{combo}}", en: "Attempting to submit via keyboard shortcut: {{combo}}" },
    "m_0d58c801c155": { zh: "请输入文件夹名称", en: "Please enter a folder name" },
    "m_0f7d8cda98a5": { zh: '✅ 文件夹 "{{folderName}}" 的隐藏状态已设置为 {{state}}', en: '✅ Folder "{{folderName}}" hidden status set to {{state}}' },
    "m_10153590c3d8": { zh: '🗑️ 确认删除按钮 "{{buttonName}}"？', en: '🗑️ Delete button "{{buttonName}}"?' },
    "m_16ac0480568c": { zh: "Drive 设置已保存。", en: "Drive settings saved." },
    "m_16dba9301e32": { zh: "⚙️ 设置面板", en: "⚙️ Settings Panel" },
    "m_16e818a7d72f": { zh: "✏️ 编辑自定义样式", en: "✏️ Edit Custom Style" },
    "m_18b337f21ea0": { zh: "导入后将新增此文件夹", en: "This folder will be added after import" },
    "m_1919cf051451": { zh: "✅ 已复制输入框内容到剪贴板。", en: "✅ Input content copied to clipboard." },
    "m_1968d029fafd": { zh: '✅ 按钮 "{{buttonName}}" 已保存。', en: '✅ Button "{{buttonName}}" saved.' },
    "m_1a3a11c7369f": { zh: '✅ 工具文件夹 "{{folderName}}" 已添加到配置中。', en: '✅ Toolbox folder "{{folderName}}" added to config.' },
    "m_1a4da6293e0c": { zh: "当前配置中无此文件夹。", en: "This folder does not exist in the current configuration." },
    "m_1a75afb2bb8b": { zh: "默认方法", en: "Default Method" },
    "m_1a858143640c": { zh: '⚠️ 自定义选择器 "{{selector}}" 未匹配到提交按钮，尝试默认规则。', en: '⚠️ Custom selector "{{selector}}" did not match a submit button, trying default rules.' },
    "m_1bf9ab3da76d": { zh: "✅ 自动提交成功（已确认内容替换完成）。", en: "✅ Auto-submit succeeded (content replacement confirmed)." },
    "m_1c50edad461c": { zh: "📤 配置已导出。", en: "📤 Configuration exported." },
    "m_1c7ce90c05af": { zh: "🌓 主题模式已切换，样式已更新。", en: "🌓 Theme mode changed, styles updated." },
    "m_1cd80fd7a8b3": { zh: "重命名", en: "Renamed" },
    "m_1d0d89d4e859": { zh: "📥 配置已成功导入。", en: "📥 Configuration imported successfully." },
    "m_1f0526af38c9": { zh: "模板变量: {{variable}}", en: "Template variables: {{variable}}" },
    "m_1f24c1e5aafa": { zh: "图标", en: "Icon" },
    "m_1f4b4742d2c4": { zh: "背景颜色：", en: "Background Color:" },
    "m_1f88547d4371": { zh: "⚠️ 自动提交失败。", en: "⚠️ Auto-submit failed." },
    "m_1f990d8a3684": { zh: "自动提交 (在填充后自动提交内容)", en: "Auto submit (submit automatically after filling)" },
    "m_1fa2524ed60b": { zh: "📤 导出", en: "📤 Export" },
    "m_200126157e5c": { zh: "Enter 提交方式没有额外配置。", en: "Enter submission has no extra options." },
    "m_2024a7224ffb": { zh: "✅ 使用 {inputboard} 变量，输入框内容已被替换。", en: "✅ Used {inputboard} variable and replaced input content." },
    "m_20ee03ce7790": { zh: "顺序", en: "Order" },
    "m_213e31accd19": { zh: "变更文件夹 {{count}} 个", en: "{{count}} folder(s) changed" },
    "m_21a69e0d4f18": { zh: "站点图标：", en: "Site Icon:" },
    "m_21c3ca2c9302": { zh: "✅ 插入了预设文本。", en: "✅ Inserted preset text." },
    "m_21d6efbe9ff8": { zh: "自动提交前检测文本匹配超时或错误:", en: "Auto-submit pre-check timed out or mismatched:" },
    "m_2506cf6e63b0": { zh: "新网址规则", en: "New Domain Rule" },
    "m_25172369e83d": { zh: '⚠️ 弹窗 "{{folderName}}" 未被识别为当前打开的弹窗。', en: '⚠️ Dialog "{{folderName}}" was not recognized as the active dialog.' },
    "m_25fe6051280a": { zh: "使用 Windows / Linux 控制键组合模拟提交", en: "Use Windows/Linux control key combo to submit" },
    "m_26718a2ad193": { zh: "Drive 请求失败：", en: "Drive request failed:" },
    "m_26b0c4d3cf64": { zh: "（未指定网址）", en: "(No domain specified)" },
    "m_27964bc08178": { zh: "折叠左侧设置区域", en: "Collapse left settings panel" },
    "m_27ba06b21165": { zh: "以云端为准（覆盖本地）", en: "Use Drive version (overwrite local)" },
    "m_27e029bfe920": { zh: "查看差异", en: "View Diff" },
    "m_280779a502b3": { zh: "导入配置", en: "Imported configuration" },
    "m_29b653b40e8c": { zh: "剪切", en: "Cut" },
    "m_2a8bd3464401": { zh: "模拟点击提交按钮", en: "Simulate clicking the submit button" },
    "m_2b1a70945baf": { zh: "按钮文字颜色：", en: "Button Text Color:" },
    "m_2c4b05fe54d8": { zh: "✏️ 编辑文件夹：", en: "✏️ Edit Folder:" },
    "m_2cd9e6ce817d": { zh: "新增", en: "Added" },
    "m_2d79c11c0491": { zh: "无法访问剪贴板内容:", en: "Unable to access clipboard content:" },
    "m_2df28455fb66": { zh: "1️⃣ 文件夹按钮外观：", en: "1️⃣ Folder button preview:" },
    "m_2f752c005ec5": { zh: "移除", en: "Removed" },
    "m_307cc6a108b7": { zh: '文件夹 "{{folderName}}" 不存在。', en: 'Folder "{{folderName}}" does not exist.' },
    "m_315e9404693b": { zh: "正在检查云端配置…", en: "Checking Drive config…" },
    "m_3378a763fb15": { zh: "配置信息", en: "Configuration" },
    "m_340914857032": { zh: "resize事件触发失败:", en: "Failed to trigger resize event:" },
    "m_345f882bd9c1": { zh: "未找到云端配置文件。", en: "No Drive config file found." },
    "m_34ead5ec21ba": { zh: "未命名规则", en: "Unnamed rule" },
    "m_34f2f7532760": { zh: "请选择左侧文件夹查看差异", en: "Select a folder on the left to inspect differences" },
    "m_3755f56f2f83": { zh: "删除", en: "Delete" },
    "m_377b64f33744": { zh: "剪切失败:", en: "Cut failed:" },
    "m_37c14d8c2265": { zh: '🗑️ 确认删除自动化规则 "{{ruleName}}"？', en: '🗑️ Delete automation rule "{{ruleName}}"?' },
    "m_3a591ab6fe4d": { zh: "个按钮", en: "buttons" },
    "m_3aaf48c90271": { zh: "⏳ 页面已完全加载，开始初始化脚本。", en: "⏳ Page fully loaded, initializing script." },
    "m_3ac80afa5a53": { zh: "备注名称：", en: "Label:" },
    "m_3b8ac539b031": { zh: "🛠️ 脚本配置", en: "🛠️ Script Config" },
    "m_3b8ad2dfebd4": { zh: "操作已取消，配置保持不变。", en: "Operation cancelled, configuration unchanged." },
    "m_3c3b1f3f773c": { zh: "提交设置", en: "Submit Settings" },
    "m_3edae7a44072": { zh: "🔄 文件夹顺序已更新：{{draggedFolder}} 移动到 {{targetFolder}} 前。", en: "🔄 Folder order updated: {{draggedFolder}} moved before {{targetFolder}}." },
    "m_3eff91bbde22": { zh: "📥 确认导入配置", en: "📥 Confirm Configuration Import" },
    "m_3ff2205d80a9": { zh: "使用 macOS / Meta 键组合模拟提交", en: "Use macOS/Meta key combo to submit" },
    "m_41654e026827": { zh: "基础信息", en: "Basics" },
    "m_4167e112ae96": { zh: "✅ 已为自动化与样式配置补全 favicon 信息。", en: "✅ Filled missing favicons for automation and style rules." },
    "m_437dc4757804": { zh: "✅ 已根据自动化规则，触发 Ctrl + Enter 提交。", en: "✅ Triggered Ctrl + Enter submit per automation rule." },
    "m_43868e0d24e8": { zh: "💾 保存 Drive 设置", en: "💾 Save Drive Settings" },
    "m_453dea07d20d": { zh: "导入配置时发生错误，请检查文件格式。", en: "Error importing config, please verify the file format." },
    "m_45afc995dcaa": { zh: "确认重置所有配置为默认设置吗？", en: "Reset all configurations to default?" },
    "m_45d7b2b96726": { zh: "📥 拉取配置", en: "📥 Pull Config" },
    "m_46ecac29102a": { zh: "文件夹", en: "Folders" },
    "m_473202b8cf49": { zh: "自动提交", en: "Auto Submit" },
    "m_47347d4c883d": { zh: "📊 计数器已更新: {{folderCount}}个文件夹, {{buttonCount}}个按钮总数", en: "📊 Counters updated: {{folderCount}} folders, {{buttonCount}} buttons in total" },
    "m_4754b4803a61": { zh: "点击后隐藏文件夹图标", en: "Click to hide folder icons" },
    "m_494899e0f5df": { zh: '⚠️ 自定义选择器 "{{selector}}" 解析失败:', en: '⚠️ Custom selector "{{selector}}" failed to parse:' },
    "m_4968e7a93613": { zh: "该文件夹已存在！", en: "Folder already exists!" },
    "m_498354115398": { zh: '🔓 弹窗 "{{folderName}}" 已打开。', en: '🔓 Dialog "{{folderName}}" opened.' },
    "m_4a06399f371f": { zh: "文字颜色：", en: "Text Color:" },
    "m_4aa822bb679d": { zh: "📊 配置对比", en: "📊 Configuration Comparison" },
    "m_4ad738c53452": { zh: "⚠️ 提交正在进行中，跳过重复提交。", en: "⚠️ Submission in progress, skipping duplicate attempt." },
    "m_4afad877551a": { zh: "自动", en: "Auto" },
    "m_4b900794dc6e": { zh: "开启后启用 Drive 同步配置", en: "Enable to show Drive sync settings" },
    "m_4d0b4688c787": { zh: "取消", en: "Cancel" },
    "m_4d268c8dd14f": { zh: "请选择有效的颜色！", en: "Please choose a valid color!" },
    "m_4d34dcf31830": { zh: "应用域名样式失败:", en: "Failed to apply domain style:" },
    "m_4e6276dcd70a": { zh: "⚠️ 未知自动提交方式，进入fallback...", en: "⚠️ Unknown auto-submit method, falling back..." },
    "m_4edd1d00875d": { zh: "复制", en: "Copy" },
    "m_4f5c1763f26d": { zh: "Drive 模块加载失败", en: "Drive module failed to load" },
    "m_50c4041db726": { zh: "配置导入导出：", en: "Import / Export:" },
    "m_5261cd43403d": { zh: "所有文件夹共有 {{count}} 个按钮", en: "All folders contain {{count}} buttons" },
    "m_532ce5bbfa6a": { zh: "自定义 CSS：", en: "Custom CSS:" },
    "m_53d26abaeb0d": { zh: "目标文件名", en: "Target File Name" },
    "m_54304e70f4ab": { zh: "导入配置时发生错误:", en: "Error occurred while importing config:" },
    "m_5513f5f64683": { zh: "移除按钮 {{count}} 个", en: "{{count}} button(s) removed" },
    "m_564ba29dcede": { zh: "按钮栏高度", en: "Toolbar Height" },
    "m_56b200a4ed9c": { zh: "请输入有效的 CSS 选择器！", en: "Please enter a valid CSS selector!" },
    "m_56d99b4b6e9e": { zh: "剪切失败，请检查浏览器权限。", en: "Cut failed, please check browser permissions." },
    "m_56e195e887ab": { zh: "按钮背景颜色：", en: "Button Background Color:" },
    "m_57894b44cac3": { zh: "CSS 选择器语法错误，请检查后再试！", en: "CSS selector syntax error, please verify and try again!" },
    "m_58389daa203e": { zh: "🎨 网站样式", en: "🎨 Site Styles" },
    "m_58d4a48c7fb5": { zh: "✅ 脚本配置弹窗已自动关闭", en: "✅ Script config dialog closed automatically" },
    "m_5a6a5ca76776": { zh: "变更：{{types}}", en: "Changed: {{types}}" },
    "m_5ad8a58367cf": { zh: "可填写自定义图标地址", en: "Enter a custom icon URL" },
    "m_5b31c4e45971": { zh: "已重置为默认配置", en: "Reset to default configuration" },
    "m_5b8f82579075": { zh: "云端配置", en: "Drive config" },
    "m_5df1a31bee04": { zh: "云端配置格式无效！", en: "Drive config has an invalid format!" },
    "m_61e773658c92": { zh: "勾选后该文件夹将在主界面显示", en: "Show this folder in the main toolbar when checked" },
    "m_6219b5d715a7": { zh: '🆕 新建文件夹 "{{folderName}}" 已添加。', en: '🆕 Added new folder "{{folderName}}".' },
    "m_62734586e922": { zh: "按钮名称已存在！", en: "Button name already exists!" },
    "m_62c16c5424b3": { zh: "✏️ 编辑按钮：", en: "✏️ Edit Button:" },
    "m_633f61f8547f": { zh: "导入的配置文件解析失败！请确认文件格式正确。", en: "Failed to parse imported config file! Check the format." },
    "m_649df08a448e": { zh: "English", en: "English" },
    "m_64d4bcd2dfa8": { zh: "✅ 已确保所有按钮具有'type'、'autoSubmit'、'favicon'配置，以及文件夹具有'hidden'字段。", en: "✅ Ensured all buttons have type/autoSubmit/favicon and folders include hidden flag." },
    "m_64e35a7bb735": { zh: '🗑️ 文件夹 "{{folderName}}" 已删除。', en: '🗑️ Folder "{{folderName}}" deleted.' },
    "m_65c2254bc930": { zh: "↩️ 重置", en: "↩️ Reset" },
    "m_65d6fdd82a8e": { zh: '✅ 文件夹 "{{folderName}}" 已保存。', en: '✅ Folder "{{folderName}}" saved.' },
    "m_65f8d895a1dd": { zh: "客户端密钥", en: "Client Secret" },
    "m_67dedc24dc09": { zh: "云端配置与本地完全相同，无需更新。", en: "Drive config matches local; no update needed." },
    "m_68b9cc33d69a": { zh: "预览按钮", en: "Preview Button" },
    "m_68dd983f9f14": { zh: "移除文件夹 {{count}} 个", en: "{{count}} folder(s) removed" },
    "m_6a1cff602ef2": { zh: "✅ 自动提交已通过点击提交按钮触发。", en: "✅ Auto-submit triggered via submit button click." },
    "m_6af274b8d873": { zh: "文件夹名称", en: "Folder Name" },
    "m_6c14bd7f6f9e": { zh: "关闭", en: "Close" },
    "m_6ca48ae98250": { zh: "✅ 脚本配置弹窗已在导出后关闭", en: "✅ Script config dialog closed after export" },
    "m_6e71bc5b3758": { zh: "粘贴失败，请检查浏览器权限。", en: "Paste failed, please check browser permissions." },
    "m_6ed8b9ab61b3": { zh: "请输入能唯一定位提交按钮的 CSS 选择器。", en: "Enter a CSS selector that uniquely locates the submit button." },
    "m_6eeb5f84309c": { zh: "🔄 输入框/剪贴板", en: "🔄 Input/Clipboard" },
    "m_6f18d9d8f52a": { zh: "请输入按钮名称！", en: "Please enter a button name!" },
    "m_6ff5ff5942c2": { zh: "点击后显示文件夹图标", en: "Click to show folder icons" },
    "m_7104c3ab47fe": { zh: "高级选项:", en: "Advanced Options:" },
    "m_714a4a09117d": { zh: "使用自定义选择器定位需要点击的提交按钮。", en: "Use a custom selector to locate the submit button." },
    "m_71b6771bc789": { zh: "显示", en: "Visible" },
    "m_72077749f794": { zh: "无", en: "None" },
    "m_7353515a2d1e": { zh: "预览文件夹", en: "Preview Folder" },
    "m_73d95e612d17": { zh: "✅ 已根据自动化规则，触发 Cmd + Enter 提交。", en: "✅ Triggered Cmd + Enter submit per automation rule." },
    "m_76b7232d9d1f": { zh: "🆕 新建自定义样式", en: "🆕 New Custom Style" },
    "m_77a49f2c3874": { zh: "字段", en: "Fields" },
    "m_792829e5fbb9": { zh: "工具按钮不使用模板变量", en: "Utility buttons do not use template variables" },
    "m_794a66cb1c12": { zh: "无法访问剪贴板内容。请检查浏览器权限。", en: "Unable to access clipboard. Please check browser permissions." },
    "m_79f0f2a32a09": { zh: "⚠️ 所有自动提交方式均未成功。", en: "⚠️ All auto-submit methods failed." },
    "m_7a265525b90d": { zh: "✅ 已根据自动化规则，模拟点击提交按钮。", en: "✅ Simulated submit button click per automation rule." },
    "m_7b5e9ee8df7e": { zh: "ℹ️ 按钮容器已存在，跳过附加。", en: "ℹ️ Button container already exists, skipping attach." },
    "m_7bcb569d28a1": { zh: "✅ 已剪切输入框内容到剪贴板。", en: "✅ Input content cut to clipboard." },
    "m_7be2d2d20c10": { zh: "中文", en: "中文" },
    "m_7debf9cb0372": { zh: "设置", en: "Settings" },
    "m_7e0dafd33317": { zh: "暂无自动化规则，点击下方“+ 新建”开始配置。", en: 'No automation rules yet. Click "+ New" below to start.' },
    "m_7e239d13e43d": { zh: "💾 关闭并保存", en: "💾 Save & Close" },
    "m_80da4bc2bae8": { zh: "优先 GM 请求", en: "Prefer GM request" },
    "m_81a978ef036c": { zh: "当前操作：上传到 Drive", en: "Current action: Upload to Drive" },
    "m_81e2ed5c556d": { zh: "⚠️ 未找到表单元素，无法触发 'submit' 事件。", en: '⚠️ No form element found, cannot dispatch "submit" event.' },
    "m_82872ab8af7b": { zh: "模拟点击", en: "Simulated Click" },
    "m_82bf9384b6bd": { zh: "变更", en: "Changed" },
    "m_83e8afa3ecc6": { zh: "（删除文件夹将同时删除其中的所有自定义按钮！）", en: "(Deleting the folder will also remove all custom buttons inside.)" },
    "m_84dd0f1436ae": { zh: "粘贴成功", en: "Paste successful" },
    "m_84fcd70d4280": { zh: "清空", en: "Clear" },
    "m_85d6179efdab": { zh: "解释", en: "Explain" },
    "m_8698a81857f3": { zh: "🔍 配置差异预览", en: "🔍 Configuration Diff Preview" },
    "m_8aaf090a889e": { zh: "留空时将自动根据网址生成 Google Favicon。", en: "Leave blank to auto-generate a Google favicon." },
    "m_8b52bd0a4bd6": { zh: "样式设置", en: "Style Settings" },
    "m_8beaf4bf00c7": { zh: "无自定义CSS", en: "No custom CSS" },
    "m_8d46f43f96e9": { zh: "🔍 扫描到 {{count}} 个 textarea 或 contenteditable 元素。", en: "🔍 Found {{count}} textarea or contenteditable elements." },
    "m_8db845c5073b": { zh: "当前环境不支持跨域请求，请在脚本管理器中启用 GM_xmlhttpRequest。", en: "Cross-origin requests are unavailable; please enable GM_xmlhttpRequest in your userscript manager." },
    "m_8fa458fdbc46": { zh: "导入的配置文件内容无效！", en: "Imported config file content is invalid!" },
    "m_8fce89809baa": { zh: "请先开启 Drive 同步开关。", en: "Please enable Drive sync first." },
    "m_90e4e9bd1a78": { zh: "自动化", en: "Automation" },
    "m_9171c67e4cf3": { zh: "✅ 已粘贴剪贴板内容到输入框。", en: "✅ Clipboard content pasted into input." },
    "m_92041626595b": { zh: "客户端 ID", en: "Client ID" },
    "m_9278d9572dfc": { zh: "请输入网址和备注名称！", en: "Please provide the URL and label!" },
    "m_96630c75b125": { zh: "按钮名称：", en: "Button Name:" },
    "m_98bacf0e9e88": { zh: '"{{folderName}}" 文件夹有 {{count}} 个按钮', en: 'Folder "{{folderName}}" has {{count}} buttons' },
    "m_9a311c0d1474": { zh: "个文件夹", en: "folders" },
    "m_9b437d4c1413": { zh: "以本地为准（上传到云端）", en: "Use local (upload to Drive)" },
    "m_9bfdb8980275": { zh: "1️⃣ 自定义按钮外观：", en: "1️⃣ Custom button preview:" },
    "m_9d17eee70cd6": { zh: "变更按钮 {{count}} 个", en: "{{count}} button(s) changed" },
    "m_9ff363a0feeb": { zh: "当前未聚焦到有效的 textarea 或 contenteditable 元素。", en: "No active textarea or contenteditable element focused." },
    "m_a003ca900128": { zh: "Drive 同步默认关闭，开启后再启用。", en: "Drive sync is off by default; enable it to turn on." },
    "m_a0b85fe891d7": { zh: "复制失败，请检查浏览器权限。", en: "Copy failed, please check browser permissions." },
    "m_a28c37109b98": { zh: "自定义 CSS 选择器", en: "Custom CSS Selector" },
    "m_a2da04e54c4f": { zh: "✅ 脚本配置弹窗已在重置前关闭", en: "✅ Script config dialog closed before reset" },
    "m_a69ce2034bc4": { zh: "展开左侧设置区域", en: "Expand left settings panel" },
    "m_a72403beb9ad": { zh: "导入的配置文件无效！缺少必要字段。", en: "Imported config file invalid! Missing required fields." },
    "m_a7cdc1ea98b3": { zh: "2️⃣ 按钮对应的文本模板：", en: "2️⃣ Button text template:" },
    "m_a82dd6923716": { zh: "恢复默认设置：", en: "Restore defaults:" },
    "m_a865844eefdf": { zh: "变更字段：{{fields}}", en: "Changed fields: {{fields}}" },
    "m_a9a50f95b5e3": { zh: "未使用模板变量", en: "Template variables not used" },
    "m_a9d17afdc4cc": { zh: "✅ 按钮容器已固定到窗口底部。", en: "✅ Button container fixed to window bottom." },
    "m_aa13ec9bac8f": { zh: "弹窗标题", en: "Dialog Title" },
    "m_abdc48c69706": { zh: "📋 剪贴板", en: "📋 Clipboard" },
    "m_aca979fdbd33": { zh: "检测到云端与本地配置存在差异", en: "Drive and local configs differ" },
    "m_b1ed8accdb95": { zh: "⚠️ 未找到按钮容器，无法更新按钮栏。", en: "⚠️ Button container not found, cannot refresh toolbar." },
    "m_b2a17fcb4e17": { zh: "请先填写完整的 Drive 凭据。", en: "Please fill in all Drive credentials." },
    "m_b40cbaef0935": { zh: "正在初始化 Drive 同步模块…", en: "Initializing Drive sync module…" },
    "m_b418ca60d417": { zh: "变量", en: "Variables" },
    "m_b50818156298": { zh: "解析配置文件失败:", en: "Failed to parse config file:" },
    "m_b56d9ac6c5a0": { zh: "确认", en: "Confirm" },
    "m_b6157962b143": { zh: '🔒 弹窗 "{{folderName}}" 已关闭。', en: '🔒 Dialog "{{folderName}}" closed.' },
    "m_b83fafa31b39": { zh: "工具文件夹中的工具按钮无法编辑或删除。", en: "Tool buttons inside the toolbox folder cannot be edited or deleted." },
    "m_b8780f7f6543": { zh: "🖼️ 文件夹图标显示已切换为 {{state}}", en: "🖼️ Folder icon visibility switched to {{state}}" },
    "m_b90e30398d2f": { zh: "提交方式", en: "Submission Method" },
    "m_ba944be97d20": { zh: "高度调整失败:", en: "Height adjustment failed:" },
    "m_bb0e7e01aa8d": { zh: "隐藏", en: "Hidden" },
    "m_bb0ecaa69368": { zh: "自动提交方式：", en: "Auto-submit Method:" },
    "m_bb1fa21a1bc7": { zh: "自动获取站点图标", en: "Auto-fetch site icon" },
    "m_bc14d54e2a74": { zh: "清空成功", en: "Clear successful" },
    "m_bcba6579c508": { zh: "清空输入框", en: "Clear input" },
    "m_bd39b3a19cd8": { zh: "📥 导入", en: "📥 Import" },
    "m_bdbdb2a21ee9": { zh: "✅ 设置已保存并关闭设置面板。", en: "✅ Settings saved and panel closed." },
    "m_be3357587999": { zh: "文件夹图标：", en: "Folder Icons:" },
    "m_be4786217d60": { zh: "🆕 新建文件夹：", en: "🆕 New Folder:" },
    "m_bed2c8aee267": { zh: "文件夹名称：", en: "Folder Name:" },
    "m_bf5ff5754947": { zh: "⚠️ 未找到提交按钮，进入fallback...", en: "⚠️ Submit button missing, falling back..." },
    "m_c06301c561a1": { zh: '按钮 "{{buttonName}}" 不存在于文件夹 "{{folderName}}" 中。', en: 'Button "{{buttonName}}" does not exist in folder "{{folderName}}".' },
    "m_c0aa47e7a67c": { zh: "🔄 配置已重置为默认设置。", en: "🔄 Configuration reset to defaults." },
    "m_c182fdbf9d82": { zh: "支持 https:// 链接或 data: URL", en: "Supports https:// links or data: URLs" },
    "m_c1ef062e06cd": { zh: "复制成功", en: "Copy successful" },
    "m_c34a706f680d": { zh: "🆕 新建新网址规则", en: "🆕 New Domain Rule" },
    "m_c53a8a03c172": { zh: "⚠️ 尝试关闭不存在的弹窗", en: "⚠️ Tried to close a non-existent dialog" },
    "m_c57c190b6d9b": { zh: "读取方式", en: "Request mode" },
    "m_c8d00e5dddcb": { zh: "📊 重置后计数器已更新。", en: "📊 Counters updated after reset." },
    "m_c8d09cf955f5": { zh: "默认", en: "Default" },
    "m_c9c77517fe85": { zh: "修改", en: "Edit" },
    "m_cbfc561586be": { zh: "✅ 自动提交开关已设置为 {{state}}", en: "✅ Auto-submit toggle set to {{state}}" },
    "m_ccb47ee4e2ed": { zh: "距页面底部", en: "Bottom Offset" },
    "m_cd99b225a08e": { zh: "语言", en: "Language" },
    "m_ce39d809e5a2": { zh: "已使用云端配置覆盖本地，并完成同步。", en: "Applied Drive config locally and completed sync." },
    "m_cfca7737d2c0": { zh: "导入后将移除此文件夹", en: "This folder will be removed after import" },
    "m_d1dd773736d1": { zh: "+ 新建", en: "+ New" },
    "m_d254eb90deae": { zh: "✅ 脚本配置弹窗已通过点击外部关闭", en: "✅ Script config dialog closed by outside click" },
    "m_d291a7396aef": { zh: "插入变量：", en: "Insert variables:" },
    "m_d2e470b2e93a": { zh: "剪切成功", en: "Cut successful" },
    "m_d5320d94e958": { zh: "未知的工具按钮动作: {{action}}", en: "Unknown tool button action: {{action}}" },
    "m_d5bb7365ec02": { zh: "当前操作：从 Drive 拉取", en: "Current action: Pull from Drive" },
    "m_d75496a857cf": { zh: "✏️ 编辑自动化规则", en: "✏️ Edit Automation Rule" },
    "m_d7b8de9c54ed": { zh: "🔄 按钮顺序已更新：{{buttonName}} 移动到 {{targetName}} 前。", en: "🔄 Button order updated: {{buttonName}} moved before {{targetName}}." },
    "m_d7d7ce790b9a": { zh: "配置", en: "Config" },
    "m_d81628898afa": { zh: "🔔 MutationObserver 已启动，监听 DOM 变化。", en: "🔔 MutationObserver started to watch DOM changes." },
    "m_da47691c6642": { zh: "留空时系统将使用该网址的默认 Favicon。", en: "Leave blank to use the site's default favicon." },
    "m_da4c4e40abf2": { zh: "ℹ️ 未匹配到样式规则，使用默认按钮栏高度：{{height}}px", en: "ℹ️ No style rule matched, using default toolbar height: {{height}}px" },
    "m_dc910208b65d": { zh: "🔒 弹窗已关闭并从DOM中移除", en: "🔒 Dialog closed and removed from DOM" },
    "m_de56d7d6dfd2": { zh: "+ 新建按钮", en: "+ New Button" },
    "m_de6433b70d6c": { zh: "确认导入", en: "Confirm Import" },
    "m_de7fb7d3cf47": { zh: "粘贴", en: "Paste" },
    "m_de9deef0cff4": { zh: "🔍 选中", en: "🔍 Selection" },
    "m_e000c77e8526": { zh: "注意：导入配置将完全替换当前配置，此操作无法撤销！", en: "Warning: Importing configuration will completely replace the current setup and cannot be undone!" },
    "m_e054f40d5926": { zh: "☁️ Google Drive 同步", en: "☁️ Google Drive Sync" },
    "m_e0f2f560f582": { zh: "已使用云端配置覆盖本地，未上传本地修改。", en: "Applied Drive config locally (kept cloud version, skipped local upload)." },
    "m_e2574efd99b1": { zh: "自定义 CSS", en: "Custom CSS" },
    "m_e27ffecbfc9f": { zh: '如：button.send-btn 或 form button[type="submit"]', en: 'e.g. button.send-btn or form button[type="submit"]' },
    "m_e2ee892dbd90": { zh: "🔔 DOM 发生变化，尝试重新附加按钮。", en: "🔔 DOM changed, attempting to reattach buttons." },
    "m_e38e5c156eb8": { zh: "解析拖放数据失败:", en: "Failed to parse drag-and-drop data:" },
    "m_e42b7df278dc": { zh: '🔄 按钮 "{{buttonName}}" 已从 "{{sourceFolder}}" 移动到 "{{targetFolder}}"。', en: '🔄 Button "{{buttonName}}" moved from "{{sourceFolder}}" to "{{targetFolder}}".' },
    "m_e4ed67834352": { zh: "粘贴失败:", en: "Paste failed:" },
    "m_e55bc82d5fc4": { zh: '✅ 工具按钮 "{{buttonName}}" 已添加到文件夹 "{{folderName}}"。', en: '✅ Tool button "{{buttonName}}" added to folder "{{folderName}}".' },
    "m_e5da83735c27": { zh: "❌ 用户取消了配置导入。", en: "❌ User cancelled config import." },
    "m_e70aa94ac10e": { zh: "自动匹配常见的提交按钮进行点击。", en: "Automatically match and click common submit buttons." },
    "m_e88ab5ba616a": { zh: "同步", en: "Sync" },
    "m_e9599b643355": { zh: '✅ 已根据自动化规则，自定义选择器 "{{selector}}" 提交。', en: '✅ Auto-submit via custom selector "{{selector}}".' },
    "m_ea003e174e34": { zh: "适配：AdGuard", en: "AdGuard-friendly" },
    "m_eb13448ddd05": { zh: "2️⃣ 文件夹内，全部自定义按钮：", en: "2️⃣ All custom buttons in the folder:" },
    "m_ebcb252ebbd7": { zh: "📤 上传配置", en: "📤 Upload Config" },
    "m_ebec3a798b60": { zh: "导入配置中无此文件夹。", en: "This folder does not exist in the imported configuration." },
    "m_ecb00e6926eb": { zh: "复制失败:", en: "Copy failed:" },
    "m_ee15681d0604": { zh: "⚠️ 未找到任何 textarea 或 contenteditable 元素。", en: "⚠️ No textarea or contenteditable element found." },
    "m_ee3f7b61d3f1": { zh: "布局设置", en: "Layout" },
    "m_ee93296cfe75": { zh: "Refresh Token", en: "Refresh Token" },
    "m_efe0801dac67": { zh: "网址：", en: "URL:" },
    "m_f0ff49e5f7e6": { zh: "按钮预览", en: "Button Preview" },
    "m_f22440b1c745": { zh: "清理旧样式失败:", en: "Failed to clean old styles:" },
    "m_f27351c4a629": { zh: "已将本地配置上传到 Drive。", en: "Uploaded local config to Drive." },
    "m_f30f9402010e": { zh: "📍 弹窗位置设置为 Bottom: 40px, Left: {{left}}px", en: "📍 Dialog positioned at bottom 40px, left {{left}}px" },
    "m_f3cf53d80bf1": { zh: '🗑️ 确认删除文件夹 "{{folderName}}"？', en: '🗑️ Delete folder "{{folderName}}"?' },
    "m_f3e5cbd48d48": { zh: "文本模板", en: "Text Template" },
    "m_f412fe65e355": { zh: "网站｜网址", en: "Site | URL" },
    "m_f5b6e4660c67": { zh: "应用域名样式时出现问题:", en: "Issue occurred while applying domain style:" },
    "m_f62771f7d4b6": { zh: '🗑️ 按钮 "{{buttonName}}" 已删除。', en: '🗑️ Button "{{buttonName}}" deleted.' },
    "m_f63a0a40276e": { zh: "留空时将根据按钮名称中的符号展示默认图标。", en: "Leave blank to derive the default icon from the button name." },
    "m_f6a567f27fb0": { zh: "⚠️ 未找到提交按钮，尝试其他提交方式。", en: "⚠️ Submit button not found, trying other methods." },
    "m_f6d245dfbc61": { zh: "✅ 输入框内容已清空。", en: "✅ Input cleared." },
    "m_f870f5d3c7fa": { zh: "⚡ 自动化", en: "⚡ Automation" },
    "m_f873f0136721": { zh: "✅ 按钮已附加到最新的 textarea 或 contenteditable 元素。", en: "✅ Buttons attached to latest textarea or contenteditable element." },
    "m_f916d862e0af": { zh: "✅ 按钮栏已更新（已过滤隐藏文件夹）。", en: "✅ Toolbar refreshed (hidden folders filtered)." },
    "m_f9e235108e1a": { zh: "按钮图标：", en: "Button Icon:" },
    "m_fa60c9c7db86": { zh: "⚡ 自动化设置", en: "⚡ Automation Settings" },
    "m_fadf24dbc5a9": { zh: "保存", en: "Save" },
    "m_fcbd0932929e": { zh: "创建", en: "Create" },
    "m_fda475caeb26": { zh: "事件触发失败:", en: "Event dispatch failed:" },
    "m_fe67280a8e87": { zh: "当前配置", en: "Current configuration" },
    "m_fec91cac2de3": { zh: "优先 fetch", en: "Prefer fetch" },
    "m_ff310c80f940": { zh: "🆕 新建按钮：", en: "🆕 New Button:" },
    "m_ff95ea626043": { zh: "🔎 检测到本域名匹配的自动提交规则：", en: "🔎 Matched automation rules for this domain:" },
    "style.action.export_user_css": { zh: "导出", en: "Export" },
    "style.action.export_user_css_tooltip": { zh: "导出 .user.css", en: "Export .user.css" },
    "style.action.import_user_css": { zh: "导入", en: "Import" },
    "style.action.import_user_css_tooltip": { zh: "导入 .user.css", en: "Import .user.css" },
    "style.action.pull_official_latest": { zh: "拉取官方最新", en: "Pull Latest Official" },
    "style.custom.delete_confirm": { zh: "确认删除自定义样式“{{name}}”？", en: 'Delete custom style "{{name}}"?' },
    "style.custom.title": { zh: "用户自定义样式", en: "Custom Styles" },
    "style.editor.add_matcher": { zh: "+ 添加匹配规则", en: "+ Add Matcher" },
    "style.editor.bottom_spacing_optional": { zh: "按钮距页面底部间距 (px，可留空继承)：", en: "Toolbar bottom spacing (px, leave blank to inherit):" },
    "style.editor.height_optional": { zh: "按钮栏高度 (px，可留空继承)：", en: "Toolbar height (px, leave blank to inherit):" },
    "style.editor.matchers": { zh: "匹配规则", en: "Matchers" },
    "style.editor.no_matcher": { zh: "至少需要一条有效的匹配规则。", en: "At least one valid matcher is required." },
    "style.editor.remove_matcher": { zh: "移除匹配规则", en: "Remove matcher" },
    "style.editor.type.domain": { zh: "域名", en: "Domain" },
    "style.editor.type.regexp": { zh: "正则", en: "Regexp" },
    "style.editor.type.url": { zh: "完整网址", en: "Exact URL" },
    "style.editor.type.url_prefix": { zh: "网址前缀", en: "URL Prefix" },
    "style.export.failed": { zh: "导出 .user.css 失败：{{message}}", en: "Failed to export .user.css: {{message}}" },
    "style.export.success": { zh: "📤 样式包已导出为 .user.css。", en: "📤 Style package exported as .user.css." },
    "style.fetch.failed": { zh: "拉取官方样式失败：{{message}}", en: "Failed to pull official styles: {{message}}" },
    "style.fetch.success": { zh: "✅ 官方样式已更新到 {{version}}。", en: "✅ Official styles updated to {{version}}." },
    "style.grouped.current_site": { zh: "当前站点", en: "Current Site" },
    "style.grouped.detail_title": { zh: "站点规则", en: "Site Rules" },
    "style.grouped.empty": { zh: "当前还没有任何样式规则。", en: "There are no style rules yet." },
    "style.grouped.no_custom": { zh: "该站点下暂无自定义规则。", en: "No custom rules for this site yet." },
    "style.grouped.no_official": { zh: "该站点下暂无官方规则。", en: "No official rules for this site." },
    "style.grouped.other_site": { zh: "其他规则", en: "Other Rules" },
    "style.import.failed": { zh: "导入 .user.css 失败：{{message}}", en: "Failed to import .user.css: {{message}}" },
    "style.import.success": { zh: "✅ 已导入 .user.css 样式包。", en: "✅ Imported .user.css style package." },
    "style.import.summary": { zh: "即将导入样式包：\n\n官方规则：{{officialCount}} 条\n自定义规则：{{customCount}} 条\n官方版本：{{version}}\n\n这会替换当前样式系统配置，是否继续？", en: "About to import the style package:\n\nOfficial rules: {{officialCount}}\nCustom rules: {{customCount}}\nOfficial version: {{version}}\n\nThis replaces the current style-system configuration. Continue?" },
    "style.info.bundled_snapshot": { zh: "内置快照", en: "Bundled snapshot" },
    "style.info.last_fetched": { zh: "最近拉取", en: "Last fetched" },
    "style.info.official_version": { zh: "官方版本", en: "Official version" },
    "style.info.source": { zh: "来源", en: "Source" },
    "style.layout.inherit": { zh: "继承", en: "Inherit" },
    "style.matchers.empty": { zh: "未配置匹配规则", en: "No matchers configured" },
    "style.official.short_title": { zh: "官方内置", en: "Official" },
    "style.official.description": { zh: "只读的官方内置规则，可按条开启或关闭。", en: "Read-only official built-in rules that can be toggled individually." },
    "style.official.title": { zh: "官方内置样式", en: "Official Built-in Styles" },
    "style.custom.short_title": { zh: "自定义", en: "Custom" },
    "style.custom.description": { zh: "用户自定义规则优先级高于官方内置规则。", en: "Custom rules take precedence over official built-in rules." },
    "style.toggle.disable_rule": { zh: "当前已启用，点击停用此规则", en: "Rule is enabled. Click to disable it." },
    "style.toggle.enable_rule": { zh: "当前已停用，点击启用此规则", en: "Rule is disabled. Click to enable it." },
    "style.untitled.custom": { zh: "未命名自定义样式", en: "Untitled Custom Style" },
    "style.untitled.official": { zh: "未命名官方样式", en: "Untitled Official Style" }
  };

  // src/i18n/index.js
  var BOUND_ELEMENTS = /* @__PURE__ */ new Set();
  var LOCALE_REFRESHERS = /* @__PURE__ */ new Set();
  var ATTRIBUTE_BINDING_MAP = [
    ["data-i18n-title", "title"],
    ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-aria-label", "aria-label"],
    ["data-i18n-aria-description", "aria-description"],
    ["data-i18n-aria-describedby", "aria-describedby"],
    ["data-i18n-data-tooltip", "data-tooltip"]
  ];
  var normalizeLocale = (locale) => {
    if (!locale) {
      return "en";
    }
    const lower = String(locale).toLowerCase();
    if (lower === "zh" || lower.startsWith("zh-")) {
      return "zh";
    }
    return "en";
  };
  var detectBrowserLocale = () => {
    if (typeof navigator === "undefined") {
      return "en";
    }
    const { language, languages, userLanguage } = navigator;
    const first = Array.isArray(languages) && languages.length > 0 ? languages[0] : null;
    return normalizeLocale(first || language || userLanguage || "en");
  };
  var cachedLocale = detectBrowserLocale();
  var resolveValues = (values) => {
    if (typeof values === "function") {
      try {
        return values();
      } catch (error) {
        console.warn("[Chat] Template Text Folders i18n values resolver error:", error);
        return null;
      }
    }
    return values || null;
  };
  var applyReplacements = (text, replacements) => {
    if (!text || !replacements) {
      return text;
    }
    let result = text;
    Object.entries(replacements).forEach(([key, value]) => {
      const safeValue = value == null ? "" : String(value);
      result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), safeValue);
    });
    return result;
  };
  var translate = (messageId, replacements, overrideLocale) => {
    const locale = normalizeLocale(overrideLocale || cachedLocale);
    const entry = messageCatalog[messageId];
    if (!entry) {
      return applyReplacements(messageId, resolveValues(replacements));
    }
    const fallback = entry.en || entry.zh || messageId;
    const template = locale === "zh" ? entry.zh || fallback : entry[locale] || fallback;
    return applyReplacements(template, resolveValues(replacements));
  };
  var getLocale = () => cachedLocale;
  var refreshI18nElement = (element) => {
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
  var bindI18nText = (element, id, values, options = {}) => {
    if (!element) {
      return element;
    }
    element.__cttfI18nTextBinding = {
      id,
      values,
      overrideLocale: options.overrideLocale || null
    };
    BOUND_ELEMENTS.add(element);
    return refreshI18nElement(element);
  };
  var bindI18nAttr = (element, attr, id, values, options = {}) => {
    if (!element || !attr) {
      return element;
    }
    if (!element.__cttfI18nAttrBindings) {
      element.__cttfI18nAttrBindings = {};
    }
    element.__cttfI18nAttrBindings[attr] = {
      id,
      values,
      overrideLocale: options.overrideLocale || null
    };
    BOUND_ELEMENTS.add(element);
    return refreshI18nElement(element);
  };
  var refreshI18nTree = (root) => {
    if (!root) {
      return root;
    }
    if (root.nodeType === Node.ELEMENT_NODE) {
      refreshI18nElement(root);
    }
    const elements = root.querySelectorAll ? Array.from(root.querySelectorAll("*")) : [];
    elements.forEach((element) => refreshI18nElement(element));
    return root;
  };
  var hydrateI18nBindings = (root) => {
    if (!root) {
      return root;
    }
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("*")] : root.querySelectorAll ? Array.from(root.querySelectorAll("*")) : [];
    elements.forEach((element) => {
      const textId = element.getAttribute && element.getAttribute("data-i18n-text");
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
  var releaseI18nBindings = (root) => {
    if (!root) {
      return root;
    }
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("*")] : root.querySelectorAll ? Array.from(root.querySelectorAll("*")) : [];
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
  var refreshBoundElements = () => {
    Array.from(BOUND_ELEMENTS).forEach((element) => {
      if (!element || !element.isConnected) {
        BOUND_ELEMENTS.delete(element);
        return;
      }
      refreshI18nElement(element);
    });
  };
  var registerLocaleRefresh = (refresher) => {
    if (typeof refresher !== "function") {
      return () => {
      };
    }
    LOCALE_REFRESHERS.add(refresher);
    return () => {
      LOCALE_REFRESHERS.delete(refresher);
    };
  };
  var notifyLocaleChange = (previousLocale, nextLocale) => {
    refreshBoundElements();
    Array.from(LOCALE_REFRESHERS).forEach((refresher) => {
      try {
        refresher(nextLocale, previousLocale);
      } catch (error) {
        console.warn("[Chat] Template Text Folders locale refresher error:", error);
      }
    });
  };
  var setLocale = (nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    const previous = cachedLocale;
    cachedLocale = normalized;
    if (previous !== normalized) {
      notifyLocaleChange(previous, normalized);
    }
    return cachedLocale;
  };

  // src/features/domain-style/official-style-bundle.generated.js
  var OFFICIAL_STYLE_SOURCE_URL = "https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/raw/main/userstyle/%5BChat%5D%20Template%20Text%20Folders.user.css";
  var OFFICIAL_STYLE_BUNDLE = {
    "version": "[20260427] v1.0.2",
    "sourceUrl": "https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/raw/main/userstyle/%5BChat%5D%20Template%20Text%20Folders.user.css",
    "lastFetchedAt": 0,
    "rules": [
      {
        "id": "official-chat01-toolbar-space",
        "name": "Chat01 - Reserve toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "chat01.ai"
          }
        ],
        "cssCode": "main {\n    padding-bottom: 40px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-kagi-assistant-toolbar-space",
        "name": "Kagi Assistant - Reserve toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://kagi.com/assistant"
          }
        ],
        "cssCode": "main.main-center-box {\n    padding-bottom: 20px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-typingcloud-toolbar-space",
        "name": "TypingCloud - Reserve toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "setapp.typingcloud.com"
          }
        ],
        "cssCode": "main {\n    padding-bottom: 30px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-cerebr-toolbar-space",
        "name": "Cerebr - Reserve toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "cerebr.yym68686.top"
          }
        ],
        "cssCode": "#chat-container {\n    padding-bottom: calc(100px + env(safe-area-inset-bottom) + var(--chat-bottom-extra-padding, 0px)) !important;\n}\n\n#input-container {\n    bottom: 40px !important;\n}\n\n#scroll-to-bottom {\n    bottom: calc(112px + env(safe-area-inset-bottom) + var(--chat-bottom-extra-padding, 0px)) !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-chathub-mobile-toolbar-space",
        "name": "ChatHub - Mobile toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "app.chathub.gg"
          }
        ],
        "cssCode": '@media (max-width: 639px) {\n    :root {\n        --cttf-chathub-mobile-input-shift: calc(28px + env(safe-area-inset-bottom));\n        --cttf-chathub-mobile-scroll-space: calc(84px + env(safe-area-inset-bottom));\n    }\n\n    /* 只做视觉位移，不使用 margin 重排 flex 面板，避免底部出现额外空档。 */\n    div[class*="group/panel"][class*="h-full"][class*="overflow-hidden"] > div[class*="relative"][class*="mt-3"][class*="mx-4"] {\n        transform: translateY(calc(-1 * var(--cttf-chathub-mobile-input-shift))) !important;\n        will-change: transform;\n    }\n\n    /* 输入区被视觉抬升后，给消息区补滚动余量，避免末尾内容被输入区/脚本栏遮住。 */\n    div[class*="h-full"][class*="overflow-y-auto"] > div[class*="relative"][class*="flex"][class*="flex-col"][class*="pb-14"] {\n        padding-bottom: var(--cttf-chathub-mobile-scroll-space) !important;\n    }\n}',
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-perplexity-toolbar-space",
        "name": "Perplexity - Toolbar space and sidebar fix",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "perplexity.ai"
          }
        ],
        "cssCode": '.erp-tab\\:p-0 {\n    padding-bottom: 20px !important;\n}\n\n/* [Perplexity] 辅助 */\n/* 收窄 匿名模式选择器 */\ndiv[data-placement="top-start"] .w-sideBarWidth {\n  width: 100% !important;\n}',
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-perplexity-hide-toolbar-special-pages",
        "name": "Perplexity - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/settings"
          },
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/discover"
          },
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/spaces"
          },
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/library"
          },
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/computer/connectors"
          },
          {
            "type": "url-prefix",
            "value": "https://www.perplexity.ai/account"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}\n\n.erp-tab\\:p-0 {\n    padding-bottom: 0px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-poe-hide-toolbar-special-pages",
        "name": "Poe - Hide toolbar on explore, profile, settings, and utility pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://poe.com/explore"
          },
          {
            "type": "url",
            "value": "https://poe.com/chats"
          },
          {
            "type": "url-prefix",
            "value": "https://poe.com/profile"
          },
          {
            "type": "url-prefix",
            "value": "https://poe.com/settings"
          },
          {
            "type": "url-prefix",
            "value": "https://poe.com/create_bot"
          },
          {
            "type": "url-prefix",
            "value": "https://poe.com/api"
          },
          {
            "type": "url-prefix",
            "value": "https://poe.com/leaderboard"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-monica-toolbar-space",
        "name": "Monica - Reserve toolbar space",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "monica.im"
          }
        ],
        "cssCode": "#root {\n    padding-bottom: 40px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-monica-input-z-index",
        "name": "Monica - Raise input layer",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "monica.im"
          }
        ],
        "cssCode": 'div[class^="chat-input-v2--"][class^="chat-input--"],\ndiv[class^="chat-input-v2-"][class^="chat-input-"] {\n    z-index: 100 !important;\n}',
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-monica-search-hide-toolbar",
        "name": "Monica - Hide toolbar on home search",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url",
            "value": "https://monica.im/home/search"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}\n\n#root {\n    padding-bottom: 0px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-chat01-account-hide-toolbar",
        "name": "Chat01 - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "regexp",
            "value": "^https://chat01\\.ai/[^/]+/history(?:/?(?:[?#].*)?)$"
          },
          {
            "type": "regexp",
            "value": "^https://chat01\\.ai/[^/]+/pricing(?:/?(?:[?#].*)?)$"
          },
          {
            "type": "regexp",
            "value": "^https://chat01\\.ai/[^/]+/credits(?:/?(?:[?#].*)?)$"
          },
          {
            "type": "regexp",
            "value": "^https://chat01\\.ai/[^/]+/keys(?:/?(?:[?#].*)?)$"
          },
          {
            "type": "regexp",
            "value": "^https://chat01\\.ai/[^/]+/discover(?:/?(?:[?#].*)?)$"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-claude-login-hide-toolbar",
        "name": "Claude - Hide toolbar on login, settings, upgrade, gift, and downloads pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://claude.ai/login"
          },
          {
            "type": "url-prefix",
            "value": "https://claude.ai/settings"
          },
          {
            "type": "url-prefix",
            "value": "https://claude.ai/upgrade"
          },
          {
            "type": "url-prefix",
            "value": "https://claude.ai/gift"
          },
          {
            "type": "url-prefix",
            "value": "https://claude.ai/downloads"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-gemini-hide-toolbar-special-pages",
        "name": "Gemini - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/mystuff"
          },
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/gems"
          },
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/personalization-settings"
          },
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/saved-info"
          },
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/sharing"
          },
          {
            "type": "url-prefix",
            "value": "https://gemini.google.com/import"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-aistudio-non-prompts-hide-toolbar",
        "name": "AI Studio - Hide toolbar outside prompts",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "regexp",
            "value": "https://aistudio\\.google\\.com/(?!prompts(?:$|[/?#])).*"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-manus-hide-toolbar-special-pages",
        "name": "Manus - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://manus.im/app/agents"
          },
          {
            "type": "url-prefix",
            "value": "https://manus.im/app/library"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-arena-hide-toolbar-special-pages",
        "name": "Arena - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://arena.ai/history/search"
          },
          {
            "type": "url-prefix",
            "value": "https://arena.ai/leaderboard/text"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-grok-hide-toolbar-special-pages",
        "name": "Grok - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "regexp",
            "value": "^https://grok\\.com/(?:\\?[^#]*)?#subscribe(?:$|[/?#].*)"
          },
          {
            "type": "url-prefix",
            "value": "https://grok.com/files"
          },
          {
            "type": "url-prefix",
            "value": "https://grok.com/share-links"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-grok-dairoot-admin-hide-toolbar",
        "name": "Grok Dairoot - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://grok.dairoot.cn/admin"
          },
          {
            "type": "regexp",
            "value": "^https://grok\\.dairoot\\.cn/(?:\\?[^#]*)?#subscribe(?:$|[/?#].*)"
          },
          {
            "type": "url-prefix",
            "value": "https://grok.dairoot.cn/files"
          },
          {
            "type": "url-prefix",
            "value": "https://grok.dairoot.cn/share-links"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-x-non-grok-hide-toolbar",
        "name": "X - Hide toolbar outside Grok",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "regexp",
            "value": "https://x\\.com/(?!i/grok(?:$|[/?#])).*"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-chatgpt-special-pages-hide-toolbar",
        "name": "ChatGPT - Hide toolbar on special pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/codex"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/gpts"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/admin"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/payments"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/library"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/apps"
          },
          {
            "type": "url-prefix",
            "value": "https://chatgpt.com/#pricing"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-chatgpt-thread-bottom-compact",
        "name": "ChatGPT - Compact bottom disclaimer",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "domain",
            "value": "chatgpt.com"
          }
        ],
        "cssCode": "#thread-bottom-container > .text-xs > div {\n    min-height: 0 !important;\n    padding: 4px 0 !important;\n}\n\n#thread-bottom-container > .text-xs > div > div {\n    flex: 1 1 auto !important;\n    min-width: 0 !important;\n    overflow: hidden !important;\n    text-overflow: ellipsis !important;\n    white-space: nowrap !important;\n    padding-left: 8px !important;\n    padding-right: 8px !important;\n}",
        "layout": {},
        "favicon": ""
      },
      {
        "id": "official-notion-non-ai-hide-toolbar",
        "name": "Notion - Hide toolbar outside AI pages",
        "source": "official",
        "enabled": true,
        "matchers": [
          {
            "type": "regexp",
            "value": "https://www\\.notion\\.so/(?!ai|chat).*"
          }
        ],
        "cssCode": "#cttf-ui-host {\n    visibility: hidden !important;\n    pointer-events: none !important;\n}",
        "layout": {},
        "favicon": ""
      }
    ]
  };

  // src/features/domain-style/style-format.js
  var STYLE_RULE_SOURCE = {
    OFFICIAL: "official",
    CUSTOM: "custom"
  };
  var STYLE_MATCHER_TYPE = {
    DOMAIN: "domain",
    URL_PREFIX: "url-prefix",
    URL: "url",
    REGEXP: "regexp"
  };
  var SUPPORTED_MATCHER_TYPES = new Set(Object.values(STYLE_MATCHER_TYPE));
  var RULE_METADATA_KEYS = /* @__PURE__ */ new Set([
    "rule-id",
    "name",
    "source",
    "enabled",
    "toolbar-height",
    "toolbar-bottom-spacing",
    "favicon"
  ]);
  var GLOBAL_METADATA_KEYS = /* @__PURE__ */ new Set([
    "official-version",
    "official-source-url",
    "official-last-fetched-at"
  ]);
  var USERSTYLE_HEADER_START = "==UserStyle==";
  var USERSTYLE_HEADER_END = "==/UserStyle==";
  var normalizeWhitespace = (value) => String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  var normalizeRuleSource = (source, fallback = STYLE_RULE_SOURCE.CUSTOM) => {
    const normalized = normalizeWhitespace(source).toLowerCase();
    return normalized === STYLE_RULE_SOURCE.OFFICIAL || normalized === STYLE_RULE_SOURCE.CUSTOM ? normalized : fallback;
  };
  var clampStyleHeight = (value, fallback = void 0) => {
    if (value === "" || value == null) {
      return fallback;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(20, Math.min(200, Math.round(parsed)));
  };
  var clampBottomSpacing = (value, fallback = void 0) => {
    if (value === "" || value == null) {
      return fallback;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(-200, Math.min(200, Math.round(parsed)));
  };
  var createStableHash = (input) => {
    const text = String(input == null ? "" : input);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  };
  var createStyleRuleId = (seed, prefix = "cttf-style") => `${prefix}-${createStableHash(seed)}`;
  var toMetadataBoolean = (value, fallback = true) => {
    if (typeof value === "boolean") {
      return value;
    }
    const normalized = normalizeWhitespace(value).toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "off") {
      return false;
    }
    return fallback;
  };
  var normalizeMatcherType = (type) => {
    const normalized = normalizeWhitespace(type).toLowerCase();
    return SUPPORTED_MATCHER_TYPES.has(normalized) ? normalized : "";
  };
  var normalizeStyleMatcher = (matcher) => {
    if (!matcher || typeof matcher !== "object") {
      return null;
    }
    const type = normalizeMatcherType(matcher.type);
    const value = typeof matcher.value === "string" ? matcher.value.trim() : "";
    if (!type || !value) {
      return null;
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
      try {
        new RegExp(value);
      } catch (error) {
        throw new Error(`Invalid regexp matcher: ${value}`);
      }
    }
    return { type, value };
  };
  var getPrimaryHostFromMatchers = (matchers = []) => {
    for (const matcher of matchers) {
      if (!matcher || typeof matcher !== "object") {
        continue;
      }
      if (matcher.type === STYLE_MATCHER_TYPE.DOMAIN) {
        return matcher.value.trim();
      }
      if (matcher.type === STYLE_MATCHER_TYPE.URL || matcher.type === STYLE_MATCHER_TYPE.URL_PREFIX) {
        try {
          return new URL(matcher.value).hostname || "";
        } catch (_) {
          continue;
        }
      }
    }
    return "";
  };
  var ensureStyleRule = (rule, options = {}) => {
    if (!rule || typeof rule !== "object") {
      return null;
    }
    const fallbackSource = normalizeRuleSource(options.fallbackSource, STYLE_RULE_SOURCE.CUSTOM);
    const legacyDomain = typeof rule.domain === "string" ? rule.domain.trim() : "";
    const rawMatchers = Array.isArray(rule.matchers) ? rule.matchers : legacyDomain ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: legacyDomain }] : [];
    const matchers = [];
    rawMatchers.forEach((matcher) => {
      const normalizedMatcher = normalizeStyleMatcher(matcher);
      if (normalizedMatcher) {
        matchers.push(normalizedMatcher);
      }
    });
    if (!matchers.length) {
      return null;
    }
    const layout = {};
    const height = clampStyleHeight(rule.layout?.height ?? rule.height);
    const bottomSpacing = clampBottomSpacing(rule.layout?.bottomSpacing ?? rule.bottomSpacing);
    if (typeof height === "number") {
      layout.height = height;
    }
    if (typeof bottomSpacing === "number") {
      layout.bottomSpacing = bottomSpacing;
    }
    const cssCode = typeof rule.cssCode === "string" ? rule.cssCode.trim() : "";
    const name = typeof rule.name === "string" ? rule.name.trim() : "";
    const source = normalizeRuleSource(rule.source, fallbackSource);
    const favicon = typeof rule.favicon === "string" ? rule.favicon.trim() : "";
    const seed = [
      source,
      name,
      matchers.map((matcher) => `${matcher.type}:${matcher.value}`).join("|"),
      cssCode,
      layout.height ?? "",
      layout.bottomSpacing ?? ""
    ].join("\n");
    return {
      id: typeof rule.id === "string" && rule.id.trim() ? rule.id.trim() : createStyleRuleId(seed, source === STYLE_RULE_SOURCE.OFFICIAL ? "cttf-official-style" : "cttf-custom-style"),
      name,
      source,
      enabled: toMetadataBoolean(rule.enabled, true),
      matchers,
      cssCode,
      layout,
      favicon
    };
  };
  var migrateLegacyDomainStyleSettings = (legacyRules = []) => {
    if (!Array.isArray(legacyRules)) {
      return [];
    }
    return legacyRules.map((item, index) => ensureStyleRule({
      id: item?.id,
      name: item?.name,
      source: STYLE_RULE_SOURCE.CUSTOM,
      enabled: true,
      matchers: typeof item?.domain === "string" && item.domain.trim() ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: item.domain.trim() }] : [],
      cssCode: item?.cssCode || "",
      layout: {
        height: item?.height,
        bottomSpacing: item?.bottomSpacing
      },
      favicon: item?.favicon || ""
    }, {
      fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
      index
    })).filter(Boolean);
  };
  var ensureStyleBundle = (bundle, options = {}) => {
    const rawBundle = bundle && typeof bundle === "object" ? bundle : {};
    const fallbackSource = normalizeRuleSource(options.fallbackSource, STYLE_RULE_SOURCE.OFFICIAL);
    const rules = Array.isArray(rawBundle.rules) ? rawBundle.rules : Array.isArray(options.rules) ? options.rules : [];
    const normalizedRules = [];
    rules.forEach((rule, index) => {
      const normalizedRule = ensureStyleRule(rule, {
        fallbackSource,
        index
      });
      if (normalizedRule) {
        normalizedRules.push(normalizedRule);
      }
    });
    return {
      version: typeof rawBundle.version === "string" ? rawBundle.version.trim() : typeof options.version === "string" ? options.version.trim() : "",
      sourceUrl: typeof rawBundle.sourceUrl === "string" ? rawBundle.sourceUrl.trim() : typeof options.sourceUrl === "string" ? options.sourceUrl.trim() : "",
      lastFetchedAt: Number.isFinite(Number(rawBundle.lastFetchedAt)) ? Number(rawBundle.lastFetchedAt) : Number.isFinite(Number(options.lastFetchedAt)) ? Number(options.lastFetchedAt) : 0,
      rules: normalizedRules
    };
  };
  var splitRulesBySource = (rules = []) => {
    const grouped = {
      official: [],
      custom: []
    };
    if (!Array.isArray(rules)) {
      return grouped;
    }
    rules.forEach((rule) => {
      if (!rule || typeof rule !== "object") {
        return;
      }
      if (rule.source === STYLE_RULE_SOURCE.OFFICIAL) {
        grouped.official.push(rule);
        return;
      }
      grouped.custom.push(rule);
    });
    return grouped;
  };
  var summarizeMatchers = (matchers = [], options = {}) => {
    if (!Array.isArray(matchers) || !matchers.length) {
      return options.emptyLabel || "";
    }
    const maxItems = Math.max(1, Number(options.maxItems) || 2);
    const labels = matchers.map((matcher) => {
      if (!matcher || typeof matcher !== "object") {
        return "";
      }
      const prefix = matcher.type === STYLE_MATCHER_TYPE.DOMAIN ? "domain" : matcher.type === STYLE_MATCHER_TYPE.URL_PREFIX ? "prefix" : matcher.type === STYLE_MATCHER_TYPE.URL ? "url" : "regexp";
      return `${prefix}: ${matcher.value}`;
    }).filter(Boolean);
    if (labels.length <= maxItems) {
      return labels.join(" | ");
    }
    return `${labels.slice(0, maxItems).join(" | ")} | +${labels.length - maxItems}`;
  };
  var escapeUserStyleString = (value) => String(value == null ? "" : value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  var serializeMatcher = (matcher) => {
    if (!matcher || typeof matcher !== "object") {
      return "";
    }
    return `${matcher.type}("${escapeUserStyleString(matcher.value)}")`;
  };
  var parseUserStyleHeaderMetadata = (commentContent) => {
    const metadata = {};
    if (!commentContent || !commentContent.includes(USERSTYLE_HEADER_START)) {
      return metadata;
    }
    const normalized = commentContent.replace(/\r\n/g, "\n");
    const startIndex = normalized.indexOf(USERSTYLE_HEADER_START);
    const endIndex = normalized.indexOf(USERSTYLE_HEADER_END);
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return metadata;
    }
    const body = normalized.slice(startIndex + USERSTYLE_HEADER_START.length, endIndex);
    body.split("\n").forEach((line) => {
      const match = /^\s*@([A-Za-z0-9_-]+)\s+(.+?)\s*$/.exec(line);
      if (!match) {
        return;
      }
      metadata[match[1].toLowerCase()] = match[2];
    });
    return metadata;
  };
  var parseMetadataComment = (commentContent) => {
    const ruleMetadata = {};
    const globalMetadata = {};
    let firstPlainComment = "";
    const normalized = String(commentContent == null ? "" : commentContent).replace(/\r\n/g, "\n").split("\n").map((line) => line.replace(/^\s*\* ?/, "").trim()).filter(Boolean);
    normalized.forEach((line) => {
      const metadataMatch = /^@cttf-([a-z0-9-]+)\s*:?\s*(.*)$/i.exec(line);
      if (!metadataMatch) {
        if (!firstPlainComment) {
          firstPlainComment = line;
        }
        return;
      }
      const key = metadataMatch[1].toLowerCase();
      const rawValue = metadataMatch[2] || "";
      if (RULE_METADATA_KEYS.has(key)) {
        ruleMetadata[key] = rawValue;
        return;
      }
      if (GLOBAL_METADATA_KEYS.has(key)) {
        globalMetadata[key] = rawValue;
      }
    });
    return {
      ruleMetadata,
      globalMetadata,
      firstPlainComment
    };
  };
  var readBlockComment = (source, startIndex) => {
    const closeIndex = source.indexOf("*/", startIndex + 2);
    if (closeIndex === -1) {
      throw new Error("Unterminated block comment in .user.css");
    }
    return {
      content: source.slice(startIndex + 2, closeIndex),
      endIndex: closeIndex + 2
    };
  };
  var skipQuotedString = (source, startIndex, quoteChar) => {
    let index = startIndex + 1;
    while (index < source.length) {
      const char = source[index];
      if (char === "\\") {
        index += 2;
        continue;
      }
      if (char === quoteChar) {
        return index + 1;
      }
      index += 1;
    }
    throw new Error("Unterminated string in .user.css");
  };
  var splitTopLevelCommaSegments = (text) => {
    const segments = [];
    let start = 0;
    let parenDepth = 0;
    let index = 0;
    while (index < text.length) {
      const char = text[index];
      if (char === '"' || char === "'") {
        index = skipQuotedString(text, index, char);
        continue;
      }
      if (char === "/" && text[index + 1] === "*") {
        const comment = readBlockComment(text, index);
        index = comment.endIndex;
        continue;
      }
      if (char === "(") {
        parenDepth += 1;
        index += 1;
        continue;
      }
      if (char === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        index += 1;
        continue;
      }
      if (char === "," && parenDepth === 0) {
        segments.push(text.slice(start, index).trim());
        start = index + 1;
      }
      index += 1;
    }
    const trailing = text.slice(start).trim();
    if (trailing) {
      segments.push(trailing);
    }
    return segments.filter(Boolean);
  };
  var parseMozDocumentMatchers = (text) => {
    const segments = splitTopLevelCommaSegments(text);
    if (!segments.length) {
      throw new Error("Empty @-moz-document matcher list in .user.css");
    }
    return segments.map((segment) => {
      const match = /^([a-z-]+)\s*\(\s*"((?:\\.|[^"])*)"\s*\)\s*$/i.exec(segment);
      if (!match) {
        throw new Error(`Unsupported @-moz-document matcher: ${segment}`);
      }
      const type = normalizeMatcherType(match[1]);
      if (!type) {
        throw new Error(`Unsupported @-moz-document matcher type: ${match[1]}`);
      }
      const rawValue = match[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      return normalizeStyleMatcher({
        type,
        value: rawValue
      });
    });
  };
  var extractLeadingRuleMetadata = (cssCode) => {
    const source = String(cssCode == null ? "" : cssCode);
    let index = 0;
    const pendingComments = [];
    while (index < source.length) {
      const char = source[index];
      if (/\s/.test(char)) {
        index += 1;
        continue;
      }
      if (char === "/" && source[index + 1] === "*") {
        const comment = readBlockComment(source, index);
        pendingComments.push(comment.content);
        index = comment.endIndex;
        continue;
      }
      break;
    }
    const aggregated = {
      ruleMetadata: {},
      firstPlainComment: ""
    };
    pendingComments.forEach((commentContent) => {
      const parsed = parseMetadataComment(commentContent);
      Object.assign(aggregated.ruleMetadata, parsed.ruleMetadata);
      if (!aggregated.firstPlainComment && parsed.firstPlainComment) {
        aggregated.firstPlainComment = parsed.firstPlainComment;
      }
    });
    return {
      cssCode: source.slice(index).trim(),
      ruleMetadata: aggregated.ruleMetadata,
      firstPlainComment: aggregated.firstPlainComment
    };
  };
  var readMozDocumentBlock = (source, startIndex, pendingComments, options = {}) => {
    const directive = "@-moz-document";
    let index = startIndex + directive.length;
    let parenDepth = 0;
    while (index < source.length) {
      const char = source[index];
      if (char === '"' || char === "'") {
        index = skipQuotedString(source, index, char);
        continue;
      }
      if (char === "/" && source[index + 1] === "*") {
        const comment = readBlockComment(source, index);
        index = comment.endIndex;
        continue;
      }
      if (char === "(") {
        parenDepth += 1;
        index += 1;
        continue;
      }
      if (char === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        index += 1;
        continue;
      }
      if (char === "{" && parenDepth === 0) {
        break;
      }
      index += 1;
    }
    if (source[index] !== "{") {
      throw new Error("Invalid @-moz-document block: missing opening brace");
    }
    const matcherText = source.slice(startIndex + directive.length, index).trim();
    const matchers = parseMozDocumentMatchers(matcherText);
    let bodyIndex = index + 1;
    let braceDepth = 1;
    while (bodyIndex < source.length) {
      const char = source[bodyIndex];
      if (char === '"' || char === "'") {
        bodyIndex = skipQuotedString(source, bodyIndex, char);
        continue;
      }
      if (char === "/" && source[bodyIndex + 1] === "*") {
        const comment = readBlockComment(source, bodyIndex);
        bodyIndex = comment.endIndex;
        continue;
      }
      if (char === "{") {
        braceDepth += 1;
        bodyIndex += 1;
        continue;
      }
      if (char === "}") {
        braceDepth -= 1;
        if (braceDepth === 0) {
          break;
        }
      }
      bodyIndex += 1;
    }
    if (braceDepth !== 0) {
      throw new Error("Invalid @-moz-document block: missing closing brace");
    }
    const rawCssCode = source.slice(index + 1, bodyIndex);
    const leadingMetadata = extractLeadingRuleMetadata(rawCssCode);
    const metadataAccumulator = {
      ruleMetadata: {},
      firstPlainComment: ""
    };
    pendingComments.forEach((commentContent) => {
      const parsed = parseMetadataComment(commentContent);
      Object.assign(metadataAccumulator.ruleMetadata, parsed.ruleMetadata);
      if (!metadataAccumulator.firstPlainComment && parsed.firstPlainComment) {
        metadataAccumulator.firstPlainComment = parsed.firstPlainComment;
      }
    });
    Object.assign(metadataAccumulator.ruleMetadata, leadingMetadata.ruleMetadata);
    if (!metadataAccumulator.firstPlainComment && leadingMetadata.firstPlainComment) {
      metadataAccumulator.firstPlainComment = leadingMetadata.firstPlainComment;
    }
    const sourceFallback = normalizeRuleSource(options.defaultSource, STYLE_RULE_SOURCE.CUSTOM);
    const ruleMetadata = metadataAccumulator.ruleMetadata;
    const fallbackName = metadataAccumulator.firstPlainComment || summarizeMatchers(matchers, { maxItems: 1 });
    const fallbackSeed = [
      sourceFallback,
      matcherText,
      leadingMetadata.cssCode.trim(),
      fallbackName
    ].join("\n");
    const normalizedRule = ensureStyleRule({
      id: ruleMetadata["rule-id"],
      name: ruleMetadata.name || fallbackName,
      source: ruleMetadata.source || sourceFallback,
      enabled: ruleMetadata.enabled,
      matchers,
      cssCode: leadingMetadata.cssCode,
      layout: {
        height: ruleMetadata["toolbar-height"],
        bottomSpacing: ruleMetadata["toolbar-bottom-spacing"]
      },
      favicon: ruleMetadata.favicon || ""
    }, {
      fallbackSource: sourceFallback,
      seed: fallbackSeed
    });
    if (!normalizedRule) {
      throw new Error("Failed to normalize parsed style rule");
    }
    return {
      rule: normalizedRule,
      endIndex: bodyIndex + 1
    };
  };
  var parseUserStyleFile = (source, options = {}) => {
    const text = String(source == null ? "" : source);
    const rules = [];
    const pendingComments = [];
    const globalMetadata = {};
    let userStyleMetadata = {};
    let index = 0;
    while (index < text.length) {
      const char = text[index];
      if (/\s/.test(char)) {
        index += 1;
        continue;
      }
      if (char === "/" && text[index + 1] === "*") {
        const comment = readBlockComment(text, index);
        const parsedHeader = parseUserStyleHeaderMetadata(comment.content);
        const isUserStyleHeader = Object.keys(parsedHeader).length > 0;
        if (isUserStyleHeader) {
          userStyleMetadata = {
            ...userStyleMetadata,
            ...parsedHeader
          };
        }
        const parsedComment = parseMetadataComment(comment.content);
        Object.assign(globalMetadata, parsedComment.globalMetadata);
        if (!isUserStyleHeader) {
          pendingComments.push(comment.content);
        }
        index = comment.endIndex;
        continue;
      }
      if (text.startsWith("@-moz-document", index)) {
        const block = readMozDocumentBlock(text, index, pendingComments, {
          defaultSource: options.defaultSource || STYLE_RULE_SOURCE.CUSTOM
        });
        rules.push(block.rule);
        pendingComments.length = 0;
        index = block.endIndex;
        continue;
      }
      index += 1;
    }
    return {
      metadata: {
        userStyle: userStyleMetadata,
        officialVersion: typeof globalMetadata["official-version"] === "string" && globalMetadata["official-version"].trim() ? globalMetadata["official-version"].trim() : typeof userStyleMetadata.version === "string" ? userStyleMetadata.version.trim() : "",
        officialSourceUrl: typeof globalMetadata["official-source-url"] === "string" ? globalMetadata["official-source-url"].trim() : "",
        officialLastFetchedAt: Number.isFinite(Number(globalMetadata["official-last-fetched-at"])) ? Number(globalMetadata["official-last-fetched-at"]) : 0
      },
      rules
    };
  };
  var serializeRuleMetadataComment = (key, value) => `/* @cttf-${key}: ${value} */`;
  var serializeStyleRule = (rule) => {
    const normalizedRule = ensureStyleRule(rule, {
      fallbackSource: rule?.source || STYLE_RULE_SOURCE.CUSTOM
    });
    if (!normalizedRule) {
      return "";
    }
    const lines = [];
    lines.push(serializeRuleMetadataComment("rule-id", normalizedRule.id));
    if (normalizedRule.name) {
      lines.push(serializeRuleMetadataComment("name", normalizedRule.name));
    }
    lines.push(serializeRuleMetadataComment("source", normalizedRule.source));
    lines.push(serializeRuleMetadataComment("enabled", normalizedRule.enabled ? "true" : "false"));
    if (typeof normalizedRule.layout?.height === "number") {
      lines.push(serializeRuleMetadataComment("toolbar-height", normalizedRule.layout.height));
    }
    if (typeof normalizedRule.layout?.bottomSpacing === "number") {
      lines.push(serializeRuleMetadataComment("toolbar-bottom-spacing", normalizedRule.layout.bottomSpacing));
    }
    if (normalizedRule.favicon) {
      lines.push(serializeRuleMetadataComment("favicon", normalizedRule.favicon));
    }
    lines.push(`@-moz-document ${normalizedRule.matchers.map(serializeMatcher).join(", ")} {`);
    if (normalizedRule.cssCode) {
      lines.push(normalizedRule.cssCode);
    }
    lines.push("}");
    return lines.join("\n");
  };
  var formatTimestampForExport = (value) => {
    const date = value ? new Date(value) : /* @__PURE__ */ new Date();
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  };
  var serializeStylePackageToUserCss = (options = {}) => {
    const officialStyleBundle = ensureStyleBundle(options.officialStyleBundle, {
      fallbackSource: STYLE_RULE_SOURCE.OFFICIAL
    });
    const customStyleRules = Array.isArray(options.customStyleRules) ? options.customStyleRules.map((rule) => ensureStyleRule(rule, { fallbackSource: STYLE_RULE_SOURCE.CUSTOM })).filter(Boolean) : [];
    const allRules = [...officialStyleBundle.rules, ...customStyleRules];
    const version = officialStyleBundle.version || `[${formatTimestampForExport(Date.now())}] exported`;
    const headerLines = [
      "/* ==UserStyle==",
      "@name           [Chat] Template Text Folders Styles",
      "@namespace      https://github.com/0-V-linuxdo/Chat_Template_Text_Folders",
      "@description    Exported official and custom styles for [Chat] Template Text Folders.",
      `@version        ${version}`,
      "@license        MIT",
      "==/UserStyle== */",
      "",
      `/* @cttf-official-version: ${officialStyleBundle.version || ""} */`,
      `/* @cttf-official-source-url: ${officialStyleBundle.sourceUrl || ""} */`,
      `/* @cttf-official-last-fetched-at: ${officialStyleBundle.lastFetchedAt || 0} */`,
      ""
    ];
    const body = allRules.map((rule) => serializeStyleRule(rule)).filter(Boolean).join("\n\n");
    return `${headerLines.join("\n")}${body}
`;
  };
  var buildOfficialStyleBundleFromUserCss = (source, options = {}) => {
    const parsed = parseUserStyleFile(source, {
      defaultSource: STYLE_RULE_SOURCE.OFFICIAL
    });
    return ensureStyleBundle({
      version: parsed.metadata.officialVersion || options.version || "",
      sourceUrl: options.sourceUrl || parsed.metadata.officialSourceUrl || "",
      lastFetchedAt: Number.isFinite(Number(options.lastFetchedAt)) ? Number(options.lastFetchedAt) : parsed.metadata.officialLastFetchedAt || 0,
      rules: parsed.rules.map((rule) => ({
        ...rule,
        source: STYLE_RULE_SOURCE.OFFICIAL,
        enabled: typeof rule.enabled === "boolean" ? rule.enabled : true
      }))
    }, {
      fallbackSource: STYLE_RULE_SOURCE.OFFICIAL
    });
  };

  // src/shared/common.js
  var cloneSerializable = (value, options = {}) => {
    const {
      fallback = value,
      logLabel = "[Chat] Template Text Folders clone failed:"
    } = options;
    if (value == null) {
      return value;
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      console.warn(logLabel, error);
      return fallback;
    }
  };
  var downloadTextFile = (fileName, text, mimeType = "text/plain;charset=utf-8") => {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // src/core/runtime-services.js
  console.log("🎉 [Chat] Template Text Folders [20260427] v1.0.2 🎉");
  var trustedHTMLPolicy = null;
  var resolveTrustedTypes = () => {
    if (trustedHTMLPolicy) {
      return trustedHTMLPolicy;
    }
    const globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : null;
    const trustedTypesAPI = globalObj && globalObj.trustedTypes ? globalObj.trustedTypes : null;
    if (!trustedTypesAPI) {
      return null;
    }
    try {
      trustedHTMLPolicy = trustedTypesAPI.createPolicy("chat_template_text_folders_policy", {
        createHTML: (input) => input
      });
    } catch (error) {
      console.warn("[Chat] Template Text Folders Trusted Types policy creation failed", error);
      trustedHTMLPolicy = null;
    }
    return trustedHTMLPolicy;
  };
  var releaseI18nChildBindings = (element) => {
    if (!element?.children?.length) {
      return;
    }
    Array.from(element.children).forEach((child) => {
      releaseI18nBindings(child);
    });
  };
  var hydrateI18nChildBindings = (element) => {
    if (!element?.children?.length) {
      return;
    }
    Array.from(element.children).forEach((child) => {
      hydrateI18nBindings(child);
      refreshI18nTree(child);
    });
  };
  var setTrustedHTML = (element, html) => {
    if (!element) {
      return;
    }
    releaseI18nChildBindings(element);
    const value = typeof html === "string" ? html : html == null ? "" : String(html);
    const policy = resolveTrustedTypes();
    if (policy) {
      element.innerHTML = policy.createHTML(value);
    } else {
      element.innerHTML = value;
    }
    hydrateI18nChildBindings(element);
  };
  var UI_HOST_ID = "cttf-ui-host";
  var latestThemeValues = null;
  var uiShadowRoot = null;
  var uiMainLayer = null;
  var uiOverlayLayer = null;
  var t = (messageId, replacements, overrideLocale) => {
    try {
      return translate(messageId, replacements, overrideLocale);
    } catch (error) {
      console.warn("[Chat] Template Text Folders i18n translate error:", error);
      return messageId;
    }
  };
  var isNonChineseLocale = () => {
    const locale = getLocale();
    return locale ? !/^zh(?:-|$)/i.test(locale) : false;
  };
  var LANGUAGE_PREFERENCE_STORAGE_KEY = "cttf-language-preference";
  var readStoredLanguagePreference = () => {
    try {
      const stored = localStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
      if (stored === "zh" || stored === "en" || stored === "auto") {
        return stored;
      }
    } catch (error) {
      console.warn("[Chat] Template Text Folders] Failed to read language preference:", error);
    }
    return null;
  };
  var cachedLanguagePreference = "auto";
  var getLanguagePreference = () => cachedLanguagePreference;
  var writeLanguagePreference = (preference) => {
    try {
      if (!preference) {
        localStorage.removeItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
      } else {
        localStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, preference);
      }
    } catch (error) {
      console.warn("[Chat] Template Text Folders] Failed to persist language preference:", error);
    }
  };
  var applyLanguagePreference = (preference, options = {}) => {
    const normalizedPreference = preference === "zh" || preference === "en" ? preference : "auto";
    cachedLanguagePreference = normalizedPreference;
    let targetLocale = normalizedPreference;
    if (normalizedPreference === "auto") {
      targetLocale = detectBrowserLocale();
    }
    if (!targetLocale) {
      targetLocale = "en";
    }
    if (!options.skipSave) {
      writeLanguagePreference(normalizedPreference);
    }
    const appliedLocale = setLocale(targetLocale);
    if (typeof options.onApplied === "function") {
      try {
        options.onApplied(normalizedPreference, appliedLocale);
      } catch (_) {
      }
    }
    return { preference: normalizedPreference, locale: appliedLocale };
  };
  var initializeLanguagePreference = () => {
    const storedPreference = readStoredLanguagePreference();
    applyLanguagePreference(storedPreference || "auto", { skipSave: true });
  };
  initializeLanguagePreference();
  var ensureUIRoot = () => {
    if (uiShadowRoot && uiShadowRoot.host && uiShadowRoot.host.isConnected) {
      return uiShadowRoot;
    }
    if (!document.body) {
      return null;
    }
    let hostElement = document.getElementById(UI_HOST_ID);
    if (!hostElement) {
      hostElement = document.createElement("div");
      hostElement.id = UI_HOST_ID;
      document.body.appendChild(hostElement);
    }
    uiShadowRoot = hostElement.shadowRoot;
    if (!uiShadowRoot) {
      uiShadowRoot = hostElement.attachShadow({ mode: "open" });
      const baseStyle = document.createElement("style");
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
      uiMainLayer = uiShadowRoot.getElementById("cttf-main-layer");
      if (!uiMainLayer) {
        uiMainLayer = document.createElement("div");
        uiMainLayer.id = "cttf-main-layer";
        uiMainLayer.style.position = "fixed";
        uiMainLayer.style.inset = "0";
        uiMainLayer.style.pointerEvents = "none";
        uiShadowRoot.appendChild(uiMainLayer);
      }
    }
    if (!uiOverlayLayer || !uiOverlayLayer.isConnected) {
      uiOverlayLayer = uiShadowRoot.getElementById("cttf-overlay-layer");
      if (!uiOverlayLayer) {
        uiOverlayLayer = document.createElement("div");
        uiOverlayLayer.id = "cttf-overlay-layer";
        uiOverlayLayer.style.position = "fixed";
        uiOverlayLayer.style.inset = "0";
        uiOverlayLayer.style.pointerEvents = "none";
        uiOverlayLayer.style.zIndex = "20000";
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
  var getShadowRoot = () => ensureUIRoot();
  var getMainLayer = () => {
    const root = ensureUIRoot();
    return root ? uiMainLayer : null;
  };
  var getOverlayLayer = () => {
    const root = ensureUIRoot();
    return root ? uiOverlayLayer : null;
  };
  var appendToMainLayer = (node) => {
    const container = getMainLayer();
    const appended = container ? container.appendChild(node) : document.body.appendChild(node);
    hydrateI18nBindings(appended);
    refreshI18nTree(appended);
    return appended;
  };
  var appendToOverlayLayer = (node) => {
    const container = getOverlayLayer();
    const appended = container ? container.appendChild(node) : document.body.appendChild(node);
    hydrateI18nBindings(appended);
    refreshI18nTree(appended);
    return appended;
  };
  var queryUI = (selector) => {
    const root = getShadowRoot();
    return root ? root.querySelector(selector) : document.querySelector(selector);
  };
  var toCSSVariableName = (key) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  var autoResizeTextarea = (textarea, options = {}) => {
    if (!textarea) return;
    const { minRows = 1, maxRows = 5 } = options;
    textarea.style.height = "auto";
    const styles2 = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles2.lineHeight) || parseFloat(styles2.fontSize) * 1.2 || 20;
    const paddingTop = parseFloat(styles2.paddingTop) || 0;
    const paddingBottom = parseFloat(styles2.paddingBottom) || 0;
    const borderTop = parseFloat(styles2.borderTopWidth) || 0;
    const borderBottom = parseFloat(styles2.borderBottomWidth) || 0;
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom + borderTop + borderBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom + borderTop + borderBottom;
    let targetHeight = textarea.scrollHeight;
    if (targetHeight < minHeight) {
      targetHeight = minHeight;
    } else if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
    textarea.style.minHeight = `${minHeight}px`;
    textarea.style.maxHeight = `${maxHeight}px`;
    textarea.style.height = `${targetHeight}px`;
  };
  var SVG_NS = "http://www.w3.org/2000/svg";
  var createAutoFaviconIcon = () => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("data-name", "Layer 1");
    svg.setAttribute("id", "Layer_1");
    svg.setAttribute("fill", "#000000");
    svg.setAttribute("xmlns", SVG_NS);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.style.width = "18px";
    svg.style.height = "18px";
    svg.style.display = "block";
    const segments = [
      { d: "M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16", fill: "#00ac47" },
      { d: "M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16", fill: "#4285f4" },
      { d: "M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z", fill: "#ffba00" },
      { d: "M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z", fill: "#ea4435" },
      { d: "M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z", fill: "#4285f4" }
    ];
    segments.forEach(({ d, fill }) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", fill);
      svg.appendChild(path);
    });
    return svg;
  };
  var dialogOverlayStack = [];
  var pushDialogOverlay = (overlay) => {
    if (!overlay) {
      return;
    }
    const existingIndex = dialogOverlayStack.indexOf(overlay);
    if (existingIndex !== -1) {
      dialogOverlayStack.splice(existingIndex, 1);
    }
    dialogOverlayStack.push(overlay);
  };
  var removeDialogOverlay = (overlay) => {
    const index = dialogOverlayStack.lastIndexOf(overlay);
    if (index !== -1) {
      dialogOverlayStack.splice(index, 1);
    }
  };
  var isTopmostDialogOverlay = (overlay) => {
    return dialogOverlayStack.length > 0 && dialogOverlayStack[dialogOverlayStack.length - 1] === overlay;
  };
  var closeUnifiedDialogOverlay = (overlay, options = {}) => {
    if (!overlay) {
      return false;
    }
    if (overlay.__cttfClosing) {
      return true;
    }
    overlay.__cttfClosing = true;
    const dialog = overlay.__cttfDialogNode || overlay.querySelector(".cttf-dialog");
    const closeTransform = overlay.__cttfCloseTransform || "scale(0.95)";
    const onClose = typeof overlay.__cttfOnClose === "function" ? overlay.__cttfOnClose : null;
    if (!options.skipOnClose && onClose) {
      try {
        onClose();
      } catch (error) {
        console.warn("[Chat] Template Text Folders dialog close callback failed:", error);
      }
      overlay.__cttfOnClose = null;
    }
    if (dialog) {
      dialog.style.transform = closeTransform;
    }
    overlay.style.pointerEvents = "none";
    removeDialogOverlay(overlay);
    if (typeof overlay.__cttfEscapeCleanup === "function") {
      overlay.__cttfEscapeCleanup();
      overlay.__cttfEscapeCleanup = null;
    }
    if (typeof overlay.__cttfLocaleRefreshCleanup === "function") {
      overlay.__cttfLocaleRefreshCleanup();
      overlay.__cttfLocaleRefreshCleanup = null;
    }
    releaseI18nBindings(overlay);
    if (overlay.parentElement) {
      overlay.parentElement.removeChild(overlay);
      console.log(t("m_dc910208b65d"));
    }
    overlay.__cttfClosing = false;
    return true;
  };
  function createUnifiedDialog(options = {}) {
    const {
      title = "m_aa13ec9bac8f",
      showTitle = title !== null && title !== false && title !== "",
      width = "400px",
      maxWidth = "95vw",
      maxHeight = "80vh",
      padding = "24px",
      zIndex = "12000",
      onClose = null,
      onOverlayClick = null,
      closeOnOverlayClick = true,
      closeOnEscape = closeOnOverlayClick,
      beforeClose = null,
      overlayClassName = "",
      dialogClassName = "",
      overlayStyles = null,
      dialogStyles = null,
      titleStyles = null,
      initialTransform = "none",
      openTransform = "none",
      closeTransform = "none"
    } = options;
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "var(--overlay-bg, rgba(0,0,0,0.5))";
    overlay.style.backdropFilter = "blur(2px)";
    overlay.style.zIndex = String(zIndex);
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    if (overlayClassName) {
      overlayClassName.split(/\s+/).filter(Boolean).forEach((className) => overlay.classList.add(className));
    }
    if (overlayStyles && typeof overlayStyles === "object") {
      Object.assign(overlay.style, overlayStyles);
    }
    const dialog = document.createElement("div");
    dialog.classList.add("cttf-dialog");
    if (dialogClassName) {
      dialogClassName.split(/\s+/).filter(Boolean).forEach((className) => dialog.classList.add(className));
    }
    dialog.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    dialog.style.color = "var(--text-color, #333333)";
    dialog.style.borderRadius = "4px";
    dialog.style.padding = padding;
    dialog.style.boxShadow = "0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))";
    dialog.style.border = "1px solid var(--border-color, #e5e7eb)";
    dialog.style.width = width;
    dialog.style.maxWidth = maxWidth;
    dialog.style.maxHeight = maxHeight;
    dialog.style.overflowY = "auto";
    dialog.style.transform = initialTransform;
    if (dialogStyles && typeof dialogStyles === "object") {
      Object.assign(dialog.style, dialogStyles);
    }
    if (showTitle) {
      const titleEl = document.createElement("h2");
      bindI18nText(titleEl, title);
      titleEl.style.margin = "0";
      titleEl.style.marginBottom = "12px";
      titleEl.style.fontSize = "18px";
      titleEl.style.fontWeight = "600";
      if (titleStyles && typeof titleStyles === "object") {
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
    overlay.__cttfRequestClose = async (reason = "programmatic", event = null, closeOptions = {}) => {
      if (overlay.__cttfClosing) {
        return false;
      }
      if (overlay.__cttfPendingClosePromise) {
        return overlay.__cttfPendingClosePromise;
      }
      const pendingClose = (async () => {
        const guard = typeof overlay.__cttfBeforeClose === "function" ? overlay.__cttfBeforeClose : null;
        if (!closeOptions.skipBeforeClose && guard) {
          try {
            const guardResult = await guard({
              reason,
              event,
              overlay,
              dialog
            });
            if (guardResult === false) {
              return false;
            }
          } catch (error) {
            console.warn("[Chat] Template Text Folders dialog close guard failed:", error);
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
    overlay.style.opacity = "1";
    dialog.style.transform = openTransform;
    if (closeOnOverlayClick) {
      overlay.addEventListener("click", (event) => {
        if (event.target !== overlay) {
          return;
        }
        if (typeof onOverlayClick === "function") {
          try {
            onOverlayClick(event, overlay, dialog);
          } catch (error) {
            console.warn("[Chat] Template Text Folders overlay click handler failed:", error);
          }
        }
        void overlay.__cttfRequestClose("overlay", event);
      });
    } else {
      overlay.addEventListener("click", (event) => {
        if (event.target !== overlay) {
          return;
        }
        if (typeof onOverlayClick === "function") {
          try {
            onOverlayClick(event, overlay, dialog);
          } catch (error) {
            console.warn("[Chat] Template Text Folders overlay click handler failed:", error);
          }
        }
        event.stopPropagation();
        event.preventDefault();
      });
    }
    if (closeOnEscape) {
      const handleEscapeKeydown = (event) => {
        if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) {
          return;
        }
        if (!overlay.isConnected || !isTopmostDialogOverlay(overlay)) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        void overlay.__cttfRequestClose("escape", event);
      };
      document.addEventListener("keydown", handleEscapeKeydown, true);
      overlay.__cttfEscapeCleanup = () => {
        document.removeEventListener("keydown", handleEscapeKeydown, true);
      };
    }
    return {
      overlay,
      dialog,
      close: overlay.__cttfCloseDialog,
      requestClose: overlay.__cttfRequestClose
    };
  }
  var createDialogCloseIconButton = (onClick = null, options = {}) => {
    const { labelId = "m_6c14bd7f6f9e" } = options;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "✕";
    button.style.backgroundColor = "transparent";
    button.style.border = "none";
    button.style.width = "32px";
    button.style.height = "32px";
    button.style.padding = "0";
    button.style.borderRadius = "50%";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.cursor = "pointer";
    button.style.color = "var(--text-color, #333333)";
    button.style.transition = "background-color 0.2s ease";
    button.style.flex = "0 0 auto";
    bindI18nAttr(button, "aria-label", labelId);
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "rgba(148, 163, 184, 0.2)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "transparent";
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof onClick === "function") {
        onClick(event);
      }
    });
    return button;
  };
  var applyThemeToHost = (themeValues) => {
    const root = ensureUIRoot();
    const host = root ? root.host : null;
    if (!host) {
      return;
    }
    Object.entries(themeValues).forEach(([key, value]) => {
      host.style.setProperty(toCSSVariableName(key), value);
    });
  };
  var setCSSVariables = (currentTheme) => {
    latestThemeValues = currentTheme;
    const apply = () => applyThemeToHost(currentTheme);
    if (document.body) {
      apply();
    } else {
      window.addEventListener("DOMContentLoaded", apply, { once: true });
    }
  };
  var theme = {
    light: {
      folderBg: "rgba(255, 255, 255, 0.8)",
      dialogBg: "#ffffff",
      textColor: "#333333",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0, 0, 0, 0.1)",
      buttonBg: "#f3f4f6",
      buttonHoverBg: "#e5e7eb",
      clearIconColor: "#333333",
      dangerColor: "#ef4444",
      successColor: "#22c55e",
      addColor: "#fd7e14",
      primaryColor: "#3B82F6",
      infoColor: "#6366F1",
      cancelColor: "#6B7280",
      overlayBg: "rgba(0, 0, 0, 0.5)",
      tabBg: "#f3f4f6",
      tabActiveBg: "#3B82F6",
      tabHoverBg: "#e5e7eb",
      tabBorder: "#e5e7eb",
      inputTextColor: "#1f2937",
      inputPlaceholderColor: "#9ca3af",
      inputBg: "#ffffff",
      inputBorderColor: "#d1d5db"
    },
    dark: {
      folderBg: "rgba(17, 17, 17, 0.85)",
      dialogBg: "#111111",
      textColor: "#e5e7eb",
      borderColor: "#2a2a2a",
      shadowColor: "rgba(0, 0, 0, 0.5)",
      buttonBg: "#1f1f1f",
      buttonHoverBg: "#2c2c2c",
      clearIconColor: "#ffffff",
      dangerColor: "#dc2626",
      successColor: "#16a34a",
      addColor: "#fd7e14",
      primaryColor: "#2563EB",
      infoColor: "#4F46E5",
      cancelColor: "#3f3f46",
      overlayBg: "rgba(0, 0, 0, 0.7)",
      tabBg: "#1f1f1f",
      tabActiveBg: "#2563EB",
      tabHoverBg: "#2c2c2c",
      tabBorder: "#2a2a2a",
      inputTextColor: "#f9fafb",
      inputPlaceholderColor: "rgba(255, 255, 255, 0.7)",
      inputBg: "#1f1f1f",
      inputBorderColor: "#3f3f46"
    }
  };
  var isDarkMode = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  var getCurrentTheme = () => isDarkMode() ? theme.dark : theme.light;
  setCSSVariables(getCurrentTheme());
  var styles = {
    button: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease, color 0.2s ease",
      fontSize: "14px",
      fontWeight: "500",
      backgroundColor: "var(--button-bg, #f3f4f6)",
      color: "var(--text-color, #333333)"
    }
  };
  var AUTO_SUBMIT_METHODS = {
    ENTER: "enter",
    MODIFIER_ENTER: "modifier_enter",
    CLICK_SUBMIT: "click_submit"
  };
  var LEGACY_AUTO_SUBMIT_METHOD_MAP = {
    Enter: AUTO_SUBMIT_METHODS.ENTER,
    "Cmd+Enter": AUTO_SUBMIT_METHODS.MODIFIER_ENTER,
    "模拟点击提交按钮": AUTO_SUBMIT_METHODS.CLICK_SUBMIT
  };
  var TOOL_FOLDER_NAME = "🖱️";
  var DEFAULT_FOLDER_NAME_ID = "m_c8d09cf955f5";
  var DEFAULT_EXPLAIN_BUTTON_ID = "m_85d6179efdab";
  var DEFAULT_TOOL_BUTTON_IDS = {
    cut: "m_29b653b40e8c",
    copy: "m_4edd1d00875d",
    paste: "m_de7fb7d3cf47",
    clear: "m_84fcd70d4280"
  };
  var createDefaultUserButtons = (locale = getLocale()) => ({
    Review: {
      type: "template",
      text: "You are a code review expert:\n\n{clipboard}\n\nProvide constructive feedback and improvements.\n",
      color: "#E6E0FF",
      textColor: "#333333",
      autoSubmit: false
    },
    [t(DEFAULT_EXPLAIN_BUTTON_ID, null, locale)]: {
      type: "template",
      text: "Explain the following code concisely:\n\n{clipboard}\n\nFocus on key functionality and purpose.\n",
      color: "#ffebcc",
      textColor: "#333333",
      autoSubmit: false
    }
  });
  var createDefaultToolButtons = (locale = getLocale()) => ({
    [t(DEFAULT_TOOL_BUTTON_IDS.cut, null, locale)]: {
      type: "tool",
      action: "cut",
      color: "#FFC1CC",
      textColor: "#333333"
    },
    [t(DEFAULT_TOOL_BUTTON_IDS.copy, null, locale)]: {
      type: "tool",
      action: "copy",
      color: "#C1FFD7",
      textColor: "#333333"
    },
    [t(DEFAULT_TOOL_BUTTON_IDS.paste, null, locale)]: {
      type: "tool",
      action: "paste",
      color: "#C1D8FF",
      textColor: "#333333"
    },
    [t(DEFAULT_TOOL_BUTTON_IDS.clear, null, locale)]: {
      type: "tool",
      action: "clear",
      color: "#FFD1C1",
      textColor: "#333333"
    }
  });
  var TOOL_DEFAULT_ICONS = {
    cut: "✂️",
    copy: "📋",
    paste: "📥",
    clear: "✖️"
  };
  var generateDomainFavicon = (domain) => {
    if (!domain) return "";
    const trimmed = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(trimmed)}&sz=32`;
  };
  var createFaviconElement = (faviconUrl, label, fallbackEmoji = "🌐", options = {}) => {
    const { withBackground = true, size = 32 } = options || {};
    const normalizedSize = Math.max(16, Math.min(48, Number(size) || 32));
    const contentSize = Math.max(12, normalizedSize - 4);
    const emojiFontSize = Math.max(10, normalizedSize - 10);
    const borderRadius = Math.round(normalizedSize / 4);
    const wrapper = document.createElement("div");
    wrapper.style.width = `${normalizedSize}px`;
    wrapper.style.height = `${normalizedSize}px`;
    wrapper.style.borderRadius = `${borderRadius}px`;
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.backgroundColor = withBackground ? "rgba(148, 163, 184, 0.15)" : "transparent";
    wrapper.style.flexShrink = "0";
    if (faviconUrl) {
      const img = document.createElement("img");
      img.src = faviconUrl;
      img.alt = label || "site icon";
      img.style.width = `${contentSize}px`;
      img.style.height = `${contentSize}px`;
      img.style.objectFit = "cover";
      img.referrerPolicy = "no-referrer";
      img.loading = "lazy";
      img.onerror = () => {
        setTrustedHTML(wrapper, "");
        const emoji = document.createElement("span");
        emoji.textContent = fallbackEmoji;
        emoji.style.fontSize = `${emojiFontSize}px`;
        wrapper.appendChild(emoji);
      };
      wrapper.appendChild(img);
    } else {
      const emoji = document.createElement("span");
      emoji.textContent = fallbackEmoji;
      emoji.style.fontSize = `${emojiFontSize}px`;
      wrapper.appendChild(emoji);
    }
    return wrapper;
  };
  var createDefaultOfficialStyleBundle = () => cloneSerializable(OFFICIAL_STYLE_BUNDLE, {
    fallback: {
      version: "",
      sourceUrl: "",
      lastFetchedAt: 0,
      rules: []
    }
  }) || {
    version: "",
    sourceUrl: "",
    lastFetchedAt: 0,
    rules: []
  };
  var buildDefaultConfig = (locale = getLocale()) => {
    const defaultFolderName = t(DEFAULT_FOLDER_NAME_ID, null, locale);
    const toolButtons = createDefaultToolButtons(locale);
    return {
      folders: {
        [defaultFolderName]: {
          color: "#3B82F6",
          textColor: "#ffffff",
          hidden: false,
          buttons: createDefaultUserButtons(locale)
        },
        [TOOL_FOLDER_NAME]: {
          color: "#FFD700",
          textColor: "#ffffff",
          hidden: false,
          buttons: toolButtons
        }
      },
      folderOrder: [defaultFolderName, TOOL_FOLDER_NAME],
      domainAutoSubmitSettings: [
        {
          domain: "chatgpt.com",
          name: "ChatGPT",
          method: AUTO_SUBMIT_METHODS.CLICK_SUBMIT,
          favicon: generateDomainFavicon("chatgpt.com")
        },
        {
          domain: "chathub.gg",
          name: "ChatHub",
          method: AUTO_SUBMIT_METHODS.ENTER,
          favicon: generateDomainFavicon("chathub.gg")
        },
        {
          domain: "cerebr.yym68686.top",
          name: "Cerebr",
          method: AUTO_SUBMIT_METHODS.ENTER,
          favicon: generateDomainFavicon("cerebr.yym68686.top")
        }
      ],
      officialStyleBundle: createDefaultOfficialStyleBundle(),
      customStyleRules: [],
      showFolderIcons: false,
      buttonBarHeight: 40,
      buttonBarBottomSpacing: 0
    };
  };
  var createDefaultConfig = (locale = getLocale()) => buildDefaultConfig(locale);
  var defaultConfig = buildDefaultConfig();
  var CONFIG_STORAGE_KEY = "chatGPTButtonFoldersConfig";
  var normalizeOfficialStyleRule = (rule) => {
    const normalizedRule = ensureStyleRule({
      ...rule,
      source: STYLE_RULE_SOURCE.OFFICIAL
    }, {
      fallbackSource: STYLE_RULE_SOURCE.OFFICIAL
    });
    if (!normalizedRule) {
      return null;
    }
    if (!normalizedRule.name) {
      normalizedRule.name = summarizeMatchers(normalizedRule.matchers, {
        maxItems: 1,
        emptyLabel: "Official Style"
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
  var normalizeOfficialStyleBundle = (bundle, fallbackBundle = createDefaultOfficialStyleBundle()) => {
    const normalizedBundle = ensureStyleBundle(
      bundle && typeof bundle === "object" ? bundle : fallbackBundle,
      {
        fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
        version: fallbackBundle.version,
        sourceUrl: fallbackBundle.sourceUrl,
        lastFetchedAt: bundle && typeof bundle === "object" ? bundle.lastFetchedAt : fallbackBundle.lastFetchedAt,
        rules: bundle && typeof bundle === "object" ? bundle.rules : fallbackBundle.rules
      }
    );
    normalizedBundle.rules = normalizedBundle.rules.map((rule) => normalizeOfficialStyleRule(rule)).filter(Boolean);
    return normalizedBundle;
  };
  var OFFICIAL_STYLE_SOURCE_REPO_SLUG = "0-v-linuxdo/chat_template_text_folders";
  var OFFICIAL_STYLE_SOURCE_FILE_PATH = "/userstyle/[chat] template text folders.user.css";
  var normalizeOfficialStyleSourceUrl = (value) => typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
  var normalizeOfficialStyleSourcePath = (value) => String(value || "").trim().replace(/\/+/g, "/").replace(/\/+$/, "").toLowerCase();
  var parseOfficialStyleSourceDescriptor = (value) => {
    const normalized = normalizeOfficialStyleSourceUrl(value);
    if (!normalized) {
      return null;
    }
    try {
      const url = new URL(normalized);
      const hostname = url.hostname.toLowerCase();
      const pathParts = normalizeOfficialStyleSourcePath(decodeURIComponent(url.pathname)).split("/").filter(Boolean);
      if (hostname === "github.com" && pathParts.length >= 5 && pathParts[2] === "raw") {
        let branch = "";
        let filePathParts = [];
        if (pathParts[3] === "refs" && pathParts[4] === "heads" && pathParts.length >= 7) {
          branch = pathParts[5];
          filePathParts = pathParts.slice(6);
        } else {
          branch = pathParts[3];
          filePathParts = pathParts.slice(4);
        }
        return {
          repoSlug: `${pathParts[0]}/${pathParts[1]}`,
          branch,
          filePath: `/${filePathParts.join("/")}`
        };
      }
      if (hostname === "raw.githubusercontent.com" && pathParts.length >= 4) {
        return {
          repoSlug: `${pathParts[0]}/${pathParts[1]}`,
          branch: pathParts[2],
          filePath: `/${pathParts.slice(3).join("/")}`
        };
      }
    } catch (_) {
    }
    return null;
  };
  var isOfficialStyleSourceUrl = (value) => {
    const normalized = normalizeOfficialStyleSourceUrl(value);
    if (!normalized) {
      return true;
    }
    const descriptor = parseOfficialStyleSourceDescriptor(normalized);
    if (descriptor) {
      return descriptor.repoSlug === OFFICIAL_STYLE_SOURCE_REPO_SLUG && descriptor.branch === "main" && descriptor.filePath === OFFICIAL_STYLE_SOURCE_FILE_PATH;
    }
    const officialSourceUrl = normalizeOfficialStyleSourceUrl(OFFICIAL_STYLE_SOURCE_URL);
    return normalized === officialSourceUrl;
  };
  var parseOfficialStyleBundleVersion = (value) => {
    const text = typeof value === "string" ? value.trim() : "";
    const dateMatch = text.match(/\[(\d{8})\]/);
    const semverMatch = text.match(/\bv(\d+)(?:\.(\d+))?(?:\.(\d+))?\b/i);
    return {
      text,
      date: dateMatch ? Number(dateMatch[1]) : 0,
      parts: semverMatch ? [1, 2, 3].map((index) => Number(semverMatch[index] || 0)) : []
    };
  };
  var compareVersionParts = (leftParts = [], rightParts = []) => {
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
  var compareOfficialStyleBundleVersions = (leftVersion, rightVersion) => {
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
    return left.text.localeCompare(right.text, void 0, {
      numeric: true,
      sensitivity: "base"
    });
  };
  var shouldRefreshOfficialStyleBundleFromBundledSnapshot = (bundle, bundledBundle = createDefaultOfficialStyleBundle()) => {
    if (!bundle || typeof bundle !== "object") {
      return true;
    }
    const lastFetchedAt = Number(bundle.lastFetchedAt);
    if (!isOfficialStyleSourceUrl(bundle.sourceUrl)) {
      return false;
    }
    return !Number.isFinite(lastFetchedAt) || lastFetchedAt <= 0 || compareOfficialStyleBundleVersions(bundle.version, bundledBundle.version) < 0;
  };
  var ensureStyleConfiguration = (targetConfig = buttonConfig) => {
    if (!targetConfig || typeof targetConfig !== "object") {
      return false;
    }
    let updated = false;
    const nextDefaultBundle = createDefaultOfficialStyleBundle();
    const rawCustomRules = Array.isArray(targetConfig.customStyleRules) ? targetConfig.customStyleRules : Array.isArray(targetConfig.domainStyleSettings) ? migrateLegacyDomainStyleSettings(targetConfig.domainStyleSettings) : [];
    if (!Array.isArray(targetConfig.customStyleRules)) {
      updated = true;
    }
    const normalizedCustomRules = rawCustomRules.map((rule) => ensureStyleRule({
      ...rule,
      source: STYLE_RULE_SOURCE.CUSTOM
    }, {
      fallbackSource: STYLE_RULE_SOURCE.CUSTOM
    })).filter(Boolean).map((rule) => {
      const normalizedRule = { ...rule };
      if (!normalizedRule.name) {
        normalizedRule.name = summarizeMatchers(normalizedRule.matchers, {
          maxItems: 1,
          emptyLabel: "Custom Style"
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
      targetConfig.officialStyleBundle && typeof targetConfig.officialStyleBundle === "object" ? targetConfig.officialStyleBundle : nextDefaultBundle,
      nextDefaultBundle
    );
    let nextOfficialBundle = normalizedOfficialBundle;
    if (shouldRefreshOfficialStyleBundleFromBundledSnapshot(normalizedOfficialBundle, nextDefaultBundle)) {
      const enabledStateById = new Map(
        normalizedOfficialBundle.rules.map((rule) => [rule.id, rule.enabled !== false])
      );
      const migratedOfficialBundle = normalizeOfficialStyleBundle(nextDefaultBundle, nextDefaultBundle);
      migratedOfficialBundle.rules = migratedOfficialBundle.rules.map((rule) => ({
        ...rule,
        enabled: enabledStateById.has(rule.id) ? enabledStateById.get(rule.id) : rule.enabled !== false
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
    if (Object.prototype.hasOwnProperty.call(targetConfig, "domainStyleSettings")) {
      delete targetConfig.domainStyleSettings;
      updated = true;
    }
    return updated;
  };
  var normalizeAutoSubmitMethod = (method) => {
    if (method === AUTO_SUBMIT_METHODS.ENTER || method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER || method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
      return method;
    }
    if (LEGACY_AUTO_SUBMIT_METHOD_MAP[method]) {
      return LEGACY_AUTO_SUBMIT_METHOD_MAP[method];
    }
    return AUTO_SUBMIT_METHODS.ENTER;
  };
  var normalizeAutoSubmitAdvanced = (method, advanced) => {
    const normalizedMethod = normalizeAutoSubmitMethod(method);
    if (!advanced || typeof advanced !== "object") {
      return null;
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
      if (advanced.variant === "ctrl") {
        return { variant: "ctrl" };
      }
      if (advanced.variant === "cmd") {
        return { variant: "cmd" };
      }
      return null;
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
      if (advanced.variant === "selector") {
        const selector = typeof advanced.selector === "string" ? advanced.selector.trim() : "";
        return selector ? { variant: "selector", selector } : null;
      }
      if (advanced.variant === "default") {
        return { variant: "default" };
      }
      return null;
    }
    return null;
  };
  var createFallbackConfigClone = (locale = getLocale()) => {
    const fallbackConfig = createDefaultConfig(locale);
    return cloneSerializable(fallbackConfig, { fallback: fallbackConfig }) || fallbackConfig;
  };
  var readPersistedButtonConfig = (locale = getLocale()) => {
    const fallbackConfig = createFallbackConfigClone(locale);
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) {
        return fallbackConfig;
      }
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallbackConfig;
    } catch (error) {
      console.warn("[Chat] Template Text Folders config parse failed:", error);
      return fallbackConfig;
    }
  };
  var clampToolbarHeight = (value, fallback = 40) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(20, Math.min(200, Math.round(parsed)));
  };
  var persistButtonConfig = (config = buttonConfig) => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn("[Chat] Template Text Folders config persist failed:", error);
    }
    return config;
  };
  var ensureFolderOrder = (targetConfig = buttonConfig) => {
    if (!targetConfig || typeof targetConfig !== "object") {
      return false;
    }
    if (!targetConfig.folders || typeof targetConfig.folders !== "object" || Array.isArray(targetConfig.folders)) {
      targetConfig.folders = {};
    }
    const existingFolderNames = Object.keys(targetConfig.folders);
    const seen = /* @__PURE__ */ new Set();
    const nextFolderOrder = [];
    const currentOrder = Array.isArray(targetConfig.folderOrder) ? targetConfig.folderOrder : [];
    currentOrder.forEach((folderName) => {
      if (typeof folderName !== "string" || seen.has(folderName) || !Object.prototype.hasOwnProperty.call(targetConfig.folders, folderName)) {
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
  var ensureButtonTypes = (targetConfig = buttonConfig, options = {}) => {
    if (!targetConfig || typeof targetConfig !== "object") {
      return false;
    }
    let updated = false;
    if (!targetConfig.folders || typeof targetConfig.folders !== "object" || Array.isArray(targetConfig.folders)) {
      targetConfig.folders = {};
      updated = true;
    }
    Object.entries(targetConfig.folders).forEach(([folderName, originalFolderConfig]) => {
      let folderConfig = originalFolderConfig;
      if (!folderConfig || typeof folderConfig !== "object" || Array.isArray(folderConfig)) {
        folderConfig = {
          color: folderName === TOOL_FOLDER_NAME ? "#FFD700" : "#3B82F6",
          textColor: "#ffffff",
          hidden: false,
          buttons: {}
        };
        targetConfig.folders[folderName] = folderConfig;
        updated = true;
      }
      if (!folderConfig.buttons || typeof folderConfig.buttons !== "object" || Array.isArray(folderConfig.buttons)) {
        folderConfig.buttons = {};
        updated = true;
      }
      if (typeof folderConfig.hidden !== "boolean") {
        folderConfig.hidden = false;
        updated = true;
      }
      Object.entries(folderConfig.buttons).forEach(([btnName, originalBtnConfig]) => {
        let btnConfig = originalBtnConfig;
        if (!btnConfig || typeof btnConfig !== "object" || Array.isArray(btnConfig)) {
          btnConfig = {};
          folderConfig.buttons[btnName] = btnConfig;
          updated = true;
        }
        if (!btnConfig.type) {
          btnConfig.type = folderName === TOOL_FOLDER_NAME ? "tool" : "template";
          updated = true;
        }
        if (btnConfig.type === "template" && typeof btnConfig.autoSubmit !== "boolean") {
          btnConfig.autoSubmit = false;
          updated = true;
        }
        if (btnConfig.type === "template" && typeof btnConfig.favicon !== "string") {
          btnConfig.favicon = "";
          updated = true;
        }
      });
    });
    if (updated && !options.silent) {
      console.log(t("m_64d4bcd2dfa8"));
    }
    return updated;
  };
  var DEFAULT_DOMAIN_AUTO_SUBMIT_BACKFILL_DOMAINS = /* @__PURE__ */ new Set([
    "cerebr.yym68686.top"
  ]);
  var normalizeDomainAutoSubmitDomain = (domain) => {
    const raw = typeof domain === "string" ? domain.trim() : "";
    if (!raw) {
      return "";
    }
    try {
      const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
      return (url.hostname || "").trim().toLowerCase();
    } catch (_) {
      return raw.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim().toLowerCase();
    }
  };
  var ensureBackfilledDefaultDomainAutoSubmitRules = (targetConfig, fallbackDomainSettings) => {
    if (!Array.isArray(targetConfig?.domainAutoSubmitSettings) || !Array.isArray(fallbackDomainSettings)) {
      return false;
    }
    const existingDomains = new Set(
      targetConfig.domainAutoSubmitSettings.map((rule) => normalizeDomainAutoSubmitDomain(rule?.domain)).filter(Boolean)
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
  var ensureDomainMetadata = (targetConfig = buttonConfig, options = {}) => {
    if (!targetConfig || typeof targetConfig !== "object") {
      return false;
    }
    let updated = false;
    const fallbackDomainSettings = createFallbackConfigClone(options.locale).domainAutoSubmitSettings;
    if (!Array.isArray(targetConfig.domainAutoSubmitSettings)) {
      targetConfig.domainAutoSubmitSettings = cloneSerializable(fallbackDomainSettings, { fallback: fallbackDomainSettings }) || fallbackDomainSettings;
      updated = true;
    } else {
      const validRules = targetConfig.domainAutoSubmitSettings.filter((rule) => rule && typeof rule === "object" && !Array.isArray(rule));
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
        const currentAdvanced = rule.methodAdvanced && typeof rule.methodAdvanced === "object" ? JSON.stringify(rule.methodAdvanced) : "";
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
      console.log(t("m_4167e112ae96"));
    }
    return updated;
  };
  var ensureToolFolder = (targetConfig = buttonConfig, options = {}) => {
    if (!targetConfig || typeof targetConfig !== "object") {
      return false;
    }
    let updated = false;
    if (!targetConfig.folders || typeof targetConfig.folders !== "object" || Array.isArray(targetConfig.folders)) {
      targetConfig.folders = {};
      updated = true;
    }
    const toolFolderName = TOOL_FOLDER_NAME;
    const defaultToolButtons = createDefaultToolButtons(options.locale || getLocale());
    if (!targetConfig.folders[toolFolderName] || typeof targetConfig.folders[toolFolderName] !== "object" || Array.isArray(targetConfig.folders[toolFolderName])) {
      targetConfig.folders[toolFolderName] = {
        color: "#FFD700",
        textColor: "#ffffff",
        hidden: false,
        buttons: defaultToolButtons
      };
      updated = true;
      if (!options.silent) {
        console.log(t("m_1a3a11c7369f", { folderName: toolFolderName }));
      }
      return updated;
    }
    if (!targetConfig.folders[toolFolderName].buttons || typeof targetConfig.folders[toolFolderName].buttons !== "object" || Array.isArray(targetConfig.folders[toolFolderName].buttons)) {
      targetConfig.folders[toolFolderName].buttons = {};
      updated = true;
    }
    Object.entries(defaultToolButtons).forEach(([btnName, btnCfg]) => {
      if (!targetConfig.folders[toolFolderName].buttons[btnName]) {
        targetConfig.folders[toolFolderName].buttons[btnName] = btnCfg;
        updated = true;
        if (!options.silent) {
          console.log(t("m_e55bc82d5fc4", {
            buttonName: btnName,
            folderName: toolFolderName
          }));
        }
      }
    });
    return updated;
  };
  var hydrateButtonConfigDefaults = (targetConfig = buttonConfig, options = {}) => {
    if (!targetConfig || typeof targetConfig !== "object" || Array.isArray(targetConfig)) {
      return false;
    }
    let updated = false;
    const fallbackConfig = createFallbackConfigClone(options.locale);
    if (!targetConfig.folders || typeof targetConfig.folders !== "object" || Array.isArray(targetConfig.folders)) {
      targetConfig.folders = cloneSerializable(fallbackConfig.folders, { fallback: fallbackConfig.folders }) || fallbackConfig.folders;
      updated = true;
    }
    const normalizedHeight = clampToolbarHeight(targetConfig.buttonBarHeight, fallbackConfig.buttonBarHeight);
    if (targetConfig.buttonBarHeight !== normalizedHeight) {
      targetConfig.buttonBarHeight = normalizedHeight;
      updated = true;
    }
    const normalizedBottomSpacing = clampBottomSpacing(targetConfig.buttonBarBottomSpacing, fallbackConfig.buttonBarBottomSpacing);
    const resolvedBottomSpacing = typeof normalizedBottomSpacing === "number" ? normalizedBottomSpacing : fallbackConfig.buttonBarBottomSpacing;
    if (targetConfig.buttonBarBottomSpacing !== resolvedBottomSpacing) {
      targetConfig.buttonBarBottomSpacing = resolvedBottomSpacing;
      updated = true;
    }
    if (typeof targetConfig.showFolderIcons !== "boolean") {
      targetConfig.showFolderIcons = fallbackConfig.showFolderIcons;
      updated = true;
    }
    updated = ensureButtonTypes(targetConfig, options) || updated;
    updated = ensureToolFolder(targetConfig, options) || updated;
    updated = ensureFolderOrder(targetConfig) || updated;
    updated = ensureDomainMetadata(targetConfig, options) || updated;
    return updated;
  };
  var buttonConfig = readPersistedButtonConfig();
  if (hydrateButtonConfigDefaults(buttonConfig)) {
    persistButtonConfig(buttonConfig);
  }
  var isSubmitting = false;
  var isEditableElement = (node) => {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
    const tag = node.tagName ? node.tagName.toLowerCase() : "";
    return tag === "textarea" || node.isContentEditable;
  };
  var getDeepActiveElement = (root = document) => {
    const active = root && root.activeElement ? root.activeElement : null;
    if (active && active.shadowRoot && active.shadowRoot.activeElement) {
      return getDeepActiveElement(active.shadowRoot);
    }
    return active;
  };
  var findEditableDescendant = (root) => {
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
  var getFocusedEditableElement = () => {
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
    const selection = typeof window !== "undefined" ? window.getSelection() : null;
    const anchorElement = selection && selection.anchorNode ? selection.anchorNode.parentElement : null;
    if (isEditableElement(anchorElement)) {
      return anchorElement;
    }
    return null;
  };
  var getAllTextareas = (root = document) => {
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
  var normalizeEditableText = (value) => String(value == null ? "" : value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var readEditableText = (element) => {
    if (!isEditableElement(element)) {
      return "";
    }
    if (element.tagName.toLowerCase() === "textarea") {
      return normalizeEditableText(element.value);
    }
    const text = typeof element.innerText === "string" ? element.innerText : element.textContent || "";
    return normalizeEditableText(text);
  };
  var clearEditableText = (element, options = {}) => {
    if (!isEditableElement(element)) {
      return false;
    }
    insertTextSmart(element, "", true);
    if (options.focus) {
      element.focus();
      if (element.tagName.toLowerCase() === "textarea") {
        element.selectionStart = element.selectionEnd = 0;
      }
    }
    return true;
  };
  var insertTextSmart = (target, finalText, replaceAll = false) => {
    const normalizedText = finalText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (target.tagName.toLowerCase() === "textarea") {
      if (replaceAll) {
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
        nativeSetter.call(target, normalizedText);
        target.selectionStart = target.selectionEnd = normalizedText.length;
        const inputEvent = new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          inputType: "insertReplacementText",
          data: normalizedText
        });
        target.dispatchEvent(inputEvent);
      } else {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
        nativeSetter.call(target, target.value.substring(0, start) + normalizedText + target.value.substring(end));
        target.selectionStart = target.selectionEnd = start + normalizedText.length;
        const inputEvent = new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          inputType: "insertText",
          data: normalizedText
        });
        target.dispatchEvent(inputEvent);
      }
      target.focus();
    } else if (target.isContentEditable) {
      insertIntoContentEditable(target, normalizedText, replaceAll);
    }
  };
  var insertIntoContentEditable = (target, text, replaceAll) => {
    const editorType = detectEditorType(target);
    target.focus();
    if (replaceAll) {
      clearContentEditable(target, editorType);
    }
    insertTextIntoEditor(target, text, editorType);
    triggerEditorEvents(target, text, replaceAll);
    adjustEditorHeight(target, editorType);
  };
  var detectEditorType = (target) => {
    if (target.classList.contains("ProseMirror") || target.closest(".ProseMirror") || target.querySelector(".ProseMirror-trailingBreak")) {
      return "prosemirror";
    }
    if (target.classList.contains("ql-editor") || target.closest(".ql-editor")) {
      return "quill";
    }
    if (target.hasAttribute("data-placeholder") || target.querySelector("[data-placeholder]")) {
      return "modern";
    }
    return "simple";
  };
  var clearContentEditable = (target, editorType) => {
    if (editorType === "prosemirror") {
      const firstP = target.querySelector("p");
      if (firstP) {
        setTrustedHTML(firstP, '<br class="ProseMirror-trailingBreak">');
        const otherPs = target.querySelectorAll("p:not(:first-child)");
        otherPs.forEach((p) => p.remove());
      } else {
        setTrustedHTML(target, '<p><br class="ProseMirror-trailingBreak"></p>');
      }
    } else if (editorType === "quill") {
      setTrustedHTML(target, "<p><br></p>");
      target.classList.remove("ql-blank");
    } else {
      setTrustedHTML(target, "");
    }
  };
  var insertTextIntoEditor = (target, text, editorType) => {
    const selection = window.getSelection();
    if (editorType === "prosemirror") {
      insertIntoProseMirror(target, text, selection);
    } else if (editorType === "quill") {
      insertIntoQuillEditor(target, text, selection);
    } else {
      insertIntoSimpleEditor(target, text, selection);
    }
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  var insertIntoProseMirror = (target, text, selection) => {
    const lines = text.split("\n");
    let currentP = target.querySelector("p");
    if (!currentP) {
      currentP = document.createElement("p");
      target.appendChild(currentP);
    }
    const trailingBreak = currentP.querySelector(".ProseMirror-trailingBreak");
    if (trailingBreak) {
      trailingBreak.remove();
    }
    lines.forEach((line, index) => {
      if (index > 0) {
        currentP = document.createElement("p");
        target.appendChild(currentP);
      }
      if (line.trim() === "") {
        const br = document.createElement("br");
        br.className = "ProseMirror-trailingBreak";
        currentP.appendChild(br);
      } else {
        currentP.appendChild(document.createTextNode(line));
        if (index === lines.length - 1) {
          const br = document.createElement("br");
          br.className = "ProseMirror-trailingBreak";
          currentP.appendChild(br);
        }
      }
    });
    target.classList.remove("is-empty", "is-editor-empty");
    target.querySelectorAll("p").forEach((p) => {
      p.classList.remove("is-empty", "is-editor-empty");
    });
  };
  var insertIntoQuillEditor = (target, text, selection) => {
    const createFragment = () => {
      const fragment = document.createDocumentFragment();
      const lines = text.split("\n");
      if (lines.length === 0) {
        lines.push("");
      }
      lines.forEach((line) => {
        const p = document.createElement("p");
        if (line === "") {
          p.appendChild(document.createElement("br"));
        } else {
          p.appendChild(document.createTextNode(line));
        }
        fragment.appendChild(p);
      });
      return fragment;
    };
    const hasValidSelection = selection && selection.rangeCount > 0 && target.contains(selection.getRangeAt(0).startContainer) && target.contains(selection.getRangeAt(0).endContainer);
    if (hasValidSelection) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(createFragment());
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const isEmpty = target.classList.contains("ql-blank") || !target.textContent.trim();
      if (isEmpty) {
        setTrustedHTML(target, "");
      }
      target.appendChild(createFragment());
    }
    target.classList.remove("ql-blank");
  };
  var insertIntoSimpleEditor = (target, text, selection) => {
    const lines = text.split("\n");
    const fragment = document.createDocumentFragment();
    lines.forEach((line, index) => {
      if (line === "") {
        fragment.appendChild(document.createElement("br"));
      } else {
        fragment.appendChild(document.createTextNode(line));
      }
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(fragment);
      range.collapse(false);
    } else {
      target.appendChild(fragment);
    }
  };
  var triggerEditorEvents = (target, text, replaceAll) => {
    const events = [
      new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: replaceAll ? "insertReplacementText" : "insertText",
        data: text
      }),
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: replaceAll ? "insertReplacementText" : "insertText",
        data: text
      }),
      new Event("change", { bubbles: true }),
      new KeyboardEvent("keyup", { bubbles: true }),
      new Event("blur", { bubbles: true }),
      new Event("focus", { bubbles: true })
    ];
    events.forEach((event) => {
      try {
        target.dispatchEvent(event);
      } catch (e) {
        console.warn(t("m_fda475caeb26"), e);
      }
    });
    try {
      const compositionEvent = new CompositionEvent("compositionend", {
        bubbles: true,
        data: text
      });
      target.dispatchEvent(compositionEvent);
    } catch (e) {
    }
  };
  var adjustEditorHeight = (target, editorType) => {
    const containers = [
      target,
      target.parentElement,
      target.closest('[style*="height"]'),
      target.closest('[style*="max-height"]'),
      target.closest(".overflow-hidden"),
      target.closest('[style*="overflow"]')
    ].filter(Boolean);
    containers.forEach((container) => {
      try {
        if (container.style.height && container.style.height !== "auto") {
          const currentHeight = parseInt(container.style.height);
          if (currentHeight < 100) {
            container.style.height = "auto";
            container.style.minHeight = currentHeight + "px";
          }
        }
        if (container.style.overflowY === "hidden") {
          container.style.overflowY = "auto";
        }
        if (editorType === "prosemirror" && container === target) {
          container.style.minHeight = "3rem";
        }
      } catch (e) {
        console.warn(t("m_ba944be97d20"), e);
      }
    });
    setTimeout(() => {
      try {
        window.dispatchEvent(new Event("resize"));
        target.dispatchEvent(new Event("resize"));
      } catch (e) {
        console.warn(t("m_340914857032"), e);
      }
    }, 100);
  };
  async function waitForContentMatch(element, expectedText, interval = 100, maxWait = 3e3) {
    return new Promise((resolve, reject) => {
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += interval;
        const currentVal = element.tagName.toLowerCase() === "textarea" ? element.value : element.innerText;
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
  var waitForSubmitButton = async (maxAttempts = 10, delay = 300) => {
    for (let i = 0; i < maxAttempts; i++) {
      const submitButton = document.querySelector('button[type="submit"], button[data-testid="send-button"]');
      if (submitButton && !submitButton.disabled && submitButton.offsetParent !== null) {
        return submitButton;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return null;
  };
  var SUBMIT_WAIT_MAX_ATTEMPTS = 10;
  var SUBMIT_WAIT_DELAY = 300;
  var waitForElementBySelector = async (selector, maxAttempts = SUBMIT_WAIT_MAX_ATTEMPTS, delay = SUBMIT_WAIT_DELAY) => {
    if (!selector) return null;
    for (let i = 0; i < maxAttempts; i++) {
      let element = null;
      try {
        element = document.querySelector(selector);
      } catch (error) {
        console.warn(t("m_494899e0f5df", { selector }), error);
        return null;
      }
      if (element) {
        const isDisabled = typeof element.disabled === "boolean" && element.disabled;
        if (!isDisabled) {
          return element;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
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
    const keyboardEvent = new KeyboardEvent("keydown", eventInit);
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
    const keyboardEvent = new KeyboardEvent("keydown", eventInit);
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
    const keyboardEvent = new KeyboardEvent("keydown", eventInit);
    document.activeElement.dispatchEvent(keyboardEvent);
  }
  var submitForm = async () => {
    if (isSubmitting) {
      console.warn(t("m_4ad738c53452"));
      return false;
    }
    isSubmitting = true;
    try {
      const domainRules = buttonConfig.domainAutoSubmitSettings || [];
      const currentURL = window.location.href;
      const matchedRule = domainRules.find((rule) => currentURL.includes(rule.domain));
      if (matchedRule) {
        console.log(t("m_ff95ea626043"), matchedRule);
        const normalizedMethod = normalizeAutoSubmitMethod(matchedRule.method);
        switch (normalizedMethod) {
          case AUTO_SUBMIT_METHODS.ENTER: {
            simulateEnterKey();
            isSubmitting = false;
            return true;
          }
          case AUTO_SUBMIT_METHODS.MODIFIER_ENTER: {
            const variant = matchedRule.methodAdvanced && matchedRule.methodAdvanced.variant === "ctrl" ? "ctrl" : "cmd";
            if (variant === "ctrl") {
              simulateCtrlEnterKey();
              console.log(t("m_437dc4757804"));
            } else {
              simulateCmdEnterKey();
              console.log(t("m_73d95e612d17"));
            }
            isSubmitting = false;
            return true;
          }
          case AUTO_SUBMIT_METHODS.CLICK_SUBMIT: {
            const advanced = matchedRule.methodAdvanced || {};
            const selector = typeof advanced.selector === "string" ? advanced.selector.trim() : "";
            if (advanced.variant === "selector" && selector) {
              const customButton = await waitForElementBySelector(selector, SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
              if (customButton) {
                customButton.click();
                console.log(t("m_e9599b643355", { selector }));
                isSubmitting = false;
                return true;
              }
              console.warn(t("m_1a858143640c", { selector }));
            }
            const submitButton2 = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
            if (submitButton2) {
              submitButton2.click();
              console.log(t("m_7a265525b90d"));
              isSubmitting = false;
              return true;
            } else {
              console.warn(t("m_bf5ff5754947"));
            }
            break;
          }
          default:
            console.warn(t("m_4e6276dcd70a"));
            break;
        }
      }
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const submitKeys = isMac ? ["Enter", "Meta+Enter"] : ["Enter", "Control+Enter"];
      for (const keyCombo of submitKeys) {
        const [key, modifier] = keyCombo.split("+");
        const eventInit = {
          bubbles: true,
          cancelable: true,
          key,
          code: key,
          keyCode: key.charCodeAt(0),
          which: key.charCodeAt(0)
        };
        if (modifier === "Meta") eventInit.metaKey = true;
        if (modifier === "Control") eventInit.ctrlKey = true;
        const keyboardEvent = new KeyboardEvent("keydown", eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
        console.log(t("m_0c63ec5814d3", { combo: keyCombo }));
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
      if (submitButton) {
        submitButton.click();
        console.log(t("m_6a1cff602ef2"));
        return true;
      } else {
        console.warn(t("m_f6a567f27fb0"));
      }
      try {
        const form = document.querySelector("form");
        if (form) {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true
          });
          form.dispatchEvent(submitEvent);
          console.log(t("m_0812cae9b471"));
          return true;
        } else {
          console.warn(t("m_81e2ed5c556d"));
        }
      } catch (error) {
        console.error(t("i18n.log.submit_event_failed"), error);
      }
      console.warn(t("m_79f0f2a32a09"));
      return false;
    } finally {
      isSubmitting = false;
    }
  };
  var setButtonConfig = (nextConfig) => {
    buttonConfig = nextConfig && typeof nextConfig === "object" && !Array.isArray(nextConfig) ? nextConfig : createFallbackConfigClone();
    return buttonConfig;
  };

  // src/features/domain-style/runtime.js
  var clampBarSpacingValue = (value, fallback = 0) => {
    const normalized = clampBottomSpacing(value, clampBottomSpacing(fallback, 0));
    return typeof normalized === "number" ? normalized : 0;
  };
  var applyBarBottomSpacing = (container, spacing, fallbackSpacing = 0) => {
    if (!container) return 0;
    const desiredSpacing = clampBarSpacingValue(spacing, fallbackSpacing);
    const paddingY = Number(container.dataset.barPaddingY) || 0;
    const adjustedBottom = desiredSpacing - paddingY;
    container.style.transform = "translateY(0)";
    container.style.bottom = `${adjustedBottom}px`;
    container.dataset.barBottomSpacing = String(desiredSpacing);
    return desiredSpacing;
  };
  var updateButtonBarLayout = (container, targetHeight) => {
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
    const buttons = Array.from(container.children).filter((node) => node.tagName === "BUTTON");
    buttons.forEach((btn) => {
      btn.style.minHeight = `${innerHeight}px`;
      btn.style.height = `${innerHeight}px`;
      btn.style.padding = `${verticalPadding}px ${horizontalPadding}px`;
      btn.style.fontSize = `${fontSize}px`;
      btn.style.borderRadius = `${borderRadius}px`;
      btn.style.lineHeight = `${lineHeight}px`;
      if (!btn.style.display) btn.style.display = "inline-flex";
      if (!btn.style.alignItems) btn.style.alignItems = "center";
    });
    container.dataset.barHeight = String(barHeight);
    container.dataset.barPaddingY = String(verticalPadding);
  };
  var matchesDomain = (hostname, expectedDomain) => {
    const host = String(hostname || "").trim().toLowerCase();
    const target = String(expectedDomain || "").trim().toLowerCase();
    if (!host || !target) {
      return false;
    }
    return host === target || host.endsWith(`.${target}`);
  };
  var matcherMatchesLocation = (matcher, locationLike) => {
    if (!matcher || typeof matcher !== "object" || !locationLike) {
      return false;
    }
    const href = String(locationLike.href || "");
    const hostname = String(locationLike.hostname || "");
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
  var ruleMatchesLocation = (rule, locationLike) => {
    if (!rule || typeof rule !== "object" || rule.enabled === false) {
      return false;
    }
    if (!Array.isArray(rule.matchers) || !rule.matchers.length) {
      return false;
    }
    return rule.matchers.some((matcher) => matcherMatchesLocation(matcher, locationLike));
  };
  var getMatchingStyleRules = (locationLike = window.location) => {
    const officialRules = Array.isArray(buttonConfig.officialStyleBundle?.rules) ? buttonConfig.officialStyleBundle.rules : [];
    const customRules = Array.isArray(buttonConfig.customStyleRules) ? buttonConfig.customStyleRules : [];
    return {
      official: officialRules.filter((rule) => ruleMatchesLocation(rule, locationLike)),
      custom: customRules.filter((rule) => ruleMatchesLocation(rule, locationLike))
    };
  };
  var clearInjectedDomainStyles = () => {
    try {
      document.querySelectorAll("style[data-cttf-style-rule-id]").forEach((styleEl) => styleEl.remove());
    } catch (error) {
      console.warn(t("m_f22440b1c745"), error);
    }
  };
  var injectRuleStyles = (rules, source) => {
    const target = document.head || document.documentElement;
    if (!target) {
      return;
    }
    rules.forEach((rule, index) => {
      if (!rule || typeof rule !== "object" || !rule.cssCode) {
        return;
      }
      const styleEl = document.createElement("style");
      styleEl.setAttribute("data-cttf-style-rule-id", rule.id || `cttf-style-${source}-${index}`);
      styleEl.setAttribute("data-cttf-style-source", source);
      styleEl.textContent = rule.cssCode;
      target.appendChild(styleEl);
    });
  };
  var resolveLayoutValue = (customRules, officialRules, key, fallbackValue) => {
    for (let index = customRules.length - 1; index >= 0; index -= 1) {
      const value = customRules[index]?.layout?.[key];
      if (typeof value === "number") {
        return value;
      }
    }
    for (let index = officialRules.length - 1; index >= 0; index -= 1) {
      const value = officialRules[index]?.layout?.[key];
      if (typeof value === "number") {
        return value;
      }
    }
    return fallbackValue;
  };
  var applyDomainStyles = () => {
    try {
      const container = queryUI(".folder-buttons-container");
      const fallbackSpacing = clampBarSpacingValue(
        typeof buttonConfig.buttonBarBottomSpacing === "number" ? buttonConfig.buttonBarBottomSpacing : defaultConfig && typeof defaultConfig.buttonBarBottomSpacing === "number" ? defaultConfig.buttonBarBottomSpacing : 0
      );
      const fallbackHeight = buttonConfig && typeof buttonConfig.buttonBarHeight === "number" ? buttonConfig.buttonBarHeight : defaultConfig && typeof defaultConfig.buttonBarHeight === "number" ? defaultConfig.buttonBarHeight : 40;
      clearInjectedDomainStyles();
      const matchingRules = getMatchingStyleRules(window.location);
      injectRuleStyles(matchingRules.official, "official");
      injectRuleStyles(matchingRules.custom, "custom");
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
        "height",
        fallbackHeight
      );
      const clampedHeight = Math.min(200, Math.max(20, Number(resolvedHeight) || 40));
      container.style.height = `${clampedHeight}px`;
      updateButtonBarLayout(container, clampedHeight);
      const resolvedBottomSpacing = resolveLayoutValue(
        matchingRules.custom,
        matchingRules.official,
        "bottomSpacing",
        fallbackSpacing
      );
      applyBarBottomSpacing(container, resolvedBottomSpacing, fallbackSpacing);
      if (hasMatchingRules) {
        console.log(`[Chat] Template Text Folders applied ${matchingRules.official.length} official and ${matchingRules.custom.length} custom style rule(s).`);
        return;
      }
      console.log(t("m_da4c4e40abf2", {
        height: clampedHeight
      }));
    } catch (error) {
      console.warn(t("m_f5b6e4660c67"), error);
    }
  };

  // src/features/toolbar/index.js
  var showUnifiedSettingsDialogHandler = () => {
  };
  var showConfigSettingsDialogHandler = () => {
  };
  var updateCountersHandler = () => {
  };
  var setShowUnifiedSettingsDialogHandler = (handler) => {
    showUnifiedSettingsDialogHandler = typeof handler === "function" ? handler : () => {
    };
  };
  var setShowConfigSettingsDialogHandler = (handler) => {
    showConfigSettingsDialogHandler = typeof handler === "function" ? handler : () => {
    };
  };
  var setUpdateCountersHandler = (handler) => {
    updateCountersHandler = typeof handler === "function" ? handler : () => {
    };
  };
  var formatButtonDisplayLabel = (label) => {
    if (typeof label !== "string") {
      return "";
    }
    const firstSpaceIndex = label.indexOf(" ");
    if (firstSpaceIndex > 0 && firstSpaceIndex < label.length - 1) {
      const leadingSegment = label.slice(0, firstSpaceIndex);
      const remainingText = label.slice(firstSpaceIndex + 1);
      const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
      if (!hasAlphaNumeric && leadingSegment.length <= 4 && remainingText.trim().length > 0) {
        return `${leadingSegment} ${remainingText}`;
      }
    }
    return label;
  };
  var extractButtonIconParts = (label) => {
    if (typeof label !== "string") {
      return { iconSymbol: "", textLabel: "" };
    }
    const trimmedStart = label.trimStart();
    if (!trimmedStart) {
      return { iconSymbol: "", textLabel: "" };
    }
    const firstSpaceIndex = trimmedStart.indexOf(" ");
    if (firstSpaceIndex > 0) {
      const leadingSegment = trimmedStart.slice(0, firstSpaceIndex);
      const remaining = trimmedStart.slice(firstSpaceIndex + 1).trimStart();
      const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
      if (!hasAlphaNumeric) {
        return {
          iconSymbol: leadingSegment,
          textLabel: remaining || trimmedStart
        };
      }
    }
    const charUnits = Array.from(trimmedStart);
    const firstChar = charUnits[0] || "";
    if (firstChar && !/[0-9A-Za-z\u4E00-\u9FFF]/.test(firstChar)) {
      const remaining = trimmedStart.slice(firstChar.length).trimStart();
      return {
        iconSymbol: firstChar,
        textLabel: remaining || trimmedStart
      };
    }
    return {
      iconSymbol: "",
      textLabel: trimmedStart
    };
  };
  var createCustomButtonElement = (name, config) => {
    const button = document.createElement("button");
    const { iconSymbol, textLabel } = extractButtonIconParts(name);
    const labelForDisplay = textLabel || name || "";
    const displayLabel = formatButtonDisplayLabel(labelForDisplay);
    let fallbackSymbolSource = iconSymbol || (Array.from(labelForDisplay.trim())[0] || "🔖");
    if (config.type === "tool" && TOOL_DEFAULT_ICONS[config.action]) {
      fallbackSymbolSource = TOOL_DEFAULT_ICONS[config.action];
    }
    button.textContent = "";
    button.setAttribute("data-original-label", name);
    button.type = "button";
    button.style.backgroundColor = config.color;
    button.style.color = config.textColor || "#333333";
    button.style.border = "1px solid rgba(0,0,0,0.1)";
    button.style.borderRadius = "4px";
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.transition = "all 0.2s ease";
    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
    button.style.marginBottom = "6px";
    button.style.width = "fit-content";
    button.style.textAlign = "left";
    button.style.display = "block";
    const contentWrapper = document.createElement("span");
    contentWrapper.style.display = "inline-flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.style.gap = "8px";
    const iconWrapper = document.createElement("span");
    iconWrapper.style.display = "inline-flex";
    iconWrapper.style.alignItems = "center";
    iconWrapper.style.justifyContent = "center";
    iconWrapper.style.width = "18px";
    iconWrapper.style.height = "18px";
    iconWrapper.style.flexShrink = "0";
    iconWrapper.style.borderRadius = "4px";
    iconWrapper.style.overflow = "hidden";
    const createFallbackIcon = (symbol) => {
      const fallbackSpan = document.createElement("span");
      fallbackSpan.textContent = symbol;
      fallbackSpan.style.fontSize = "14px";
      fallbackSpan.style.lineHeight = "1";
      fallbackSpan.style.display = "inline-flex";
      fallbackSpan.style.alignItems = "center";
      fallbackSpan.style.justifyContent = "center";
      return fallbackSpan;
    };
    const faviconUrl = config && typeof config.favicon === "string" ? config.favicon.trim() : "";
    if (faviconUrl) {
      const img = document.createElement("img");
      img.src = faviconUrl;
      img.alt = (labelForDisplay || name || "").trim() || "icon";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.decoding = "async";
      img.onerror = () => {
        iconWrapper.textContent = "";
        iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
      };
      iconWrapper.appendChild(img);
    } else {
      iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
    }
    const textSpan = document.createElement("span");
    textSpan.textContent = displayLabel;
    textSpan.style.display = "inline-flex";
    textSpan.style.alignItems = "center";
    contentWrapper.appendChild(iconWrapper);
    contentWrapper.appendChild(textSpan);
    button.appendChild(contentWrapper);
    button.title = config.text || "";
    contentWrapper.style.pointerEvents = "none";
    textSpan.style.pointerEvents = "none";
    iconWrapper.style.pointerEvents = "none";
    return button;
  };
  var currentlyOpenFolder = {
    name: null,
    element: null,
    trigger: null
  };
  var contextMenuBoundEditables = /* @__PURE__ */ new WeakSet();
  var resetOpenFolderState = () => {
    currentlyOpenFolder.name = null;
    currentlyOpenFolder.element = null;
    currentlyOpenFolder.trigger = null;
  };
  var closeOpenFolderPopover = (messageId = null) => {
    const { name, element } = currentlyOpenFolder;
    if (element) {
      element.style.display = "none";
    }
    resetOpenFolderState();
    if (messageId && name) {
      console.log(t(messageId, { folderName: name }));
    }
  };
  var removeAllFolderPopovers = () => {
    const root = getShadowRoot();
    const scope = root || document;
    scope.querySelectorAll("[data-folder-list]").forEach((node) => node.remove());
    resetOpenFolderState();
  };
  document.addEventListener("click", (event) => {
    const openList = currentlyOpenFolder.element;
    if (!openList || openList.style.display === "none") {
      return;
    }
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (path.includes(openList) || path.includes(currentlyOpenFolder.trigger)) {
      return;
    }
    closeOpenFolderPopover("m_01ecd4be7d8f");
  });
  var showTemporaryFeedback = (element, message) => {
    const feedback = document.createElement("span");
    feedback.textContent = message;
    feedback.style.position = "absolute";
    feedback.style.bottom = "10px";
    feedback.style.right = "10px";
    feedback.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    feedback.style.color = "#fff";
    feedback.style.padding = "4px 8px";
    feedback.style.borderRadius = "4px";
    feedback.style.zIndex = "10001";
    element.parentElement.appendChild(feedback);
    setTimeout(() => {
      feedback.remove();
    }, 1500);
  };
  var handleCut = (element) => {
    const text = readEditableText(element);
    clearEditableText(element);
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        console.log(t("m_7bcb569d28a1"));
        showTemporaryFeedback(element, t("m_d2e470b2e93a"));
      }).catch((err) => {
        console.error(t("m_377b64f33744"), err);
        alert(t("m_56d99b4b6e9e"));
      });
    }
  };
  var handleCopy = (element) => {
    const text = readEditableText(element);
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        console.log(t("m_1919cf051451"));
        showTemporaryFeedback(element, t("m_c1ef062e06cd"));
      }).catch((err) => {
        console.error(t("m_ecb00e6926eb"), err);
        alert(t("m_a0b85fe891d7"));
      });
    }
  };
  var handlePaste = async (element) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      insertTextSmart(element, clipboardText);
      console.log(t("m_9171c67e4cf3"));
      showTemporaryFeedback(element, t("m_84dd0f1436ae"));
    } catch (err) {
      console.error(t("m_e4ed67834352"), err);
      alert(t("m_6e71bc5b3758"));
    }
  };
  var handleClear = (element) => {
    clearEditableText(element);
    console.log(t("m_f6d245dfbc61"));
    showTemporaryFeedback(element, t("m_bc14d54e2a74"));
  };
  var createCustomButton = (name, config, folderName) => {
    const button = createCustomButtonElement(name, config, folderName);
    button.setAttribute("draggable", "true");
    button.setAttribute("data-button-name", name);
    button.setAttribute("data-folder-name", folderName);
    button.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("application/json", JSON.stringify({
        buttonName: name,
        sourceFolder: folderName,
        config
      }));
      e.currentTarget.style.opacity = "0.5";
    });
    button.addEventListener("dragend", (e) => {
      e.currentTarget.style.opacity = "1";
    });
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const focusedElement = getFocusedEditableElement();
      if (isEditableElement(focusedElement)) {
        setTimeout(() => focusedElement && focusedElement.focus(), 0);
      }
    });
    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
    });
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      if (config.type === "template") {
        const focusedElement = getFocusedEditableElement();
        if (!isEditableElement(focusedElement)) {
          console.warn(t("m_9ff363a0feeb"));
          return;
        }
        const needsClipboard = config.text.includes("{clipboard}") || config.text.includes("{{inputboard}|{clipboard}}");
        let clipboardText = "";
        if (needsClipboard) {
          try {
            clipboardText = await navigator.clipboard.readText();
          } catch (err) {
            console.error(t("m_2d79c11c0491"), err);
            alert(t("m_794a66cb1c12"));
            return;
          }
        }
        const inputBoxText = readEditableText(focusedElement);
        const selectionText = window.getSelection().toString();
        let finalText = config.text;
        const variableMap = {
          "{{inputboard}|{clipboard}}": inputBoxText.trim() || clipboardText,
          "{clipboard}": clipboardText,
          "{inputboard}": inputBoxText,
          "{selection}": selectionText
        };
        const replacementOrder = [
          "{{inputboard}|{clipboard}}",
          "{clipboard}",
          "{inputboard}",
          "{selection}"
        ];
        const placeholderMap = /* @__PURE__ */ new Map();
        let placeholderCounter = 0;
        replacementOrder.forEach((variable) => {
          if (finalText.includes(variable)) {
            const placeholder = `__SAFE_PLACEHOLDER_${placeholderCounter++}__`;
            placeholderMap.set(placeholder, variableMap[variable]);
            finalText = finalText.split(variable).join(placeholder);
          }
        });
        placeholderMap.forEach((value, placeholder) => {
          finalText = finalText.split(placeholder).join(value);
        });
        finalText = finalText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        const containsInputboard = config.text.includes("{inputboard}") || config.text.includes("{{inputboard}|{clipboard}}");
        if (containsInputboard) {
          insertTextSmart(focusedElement, finalText, true);
          console.log(t("m_2024a7224ffb"));
        } else {
          insertTextSmart(focusedElement, finalText, false);
          console.log(t("m_21c3ca2c9302"));
        }
        if (config.autoSubmit) {
          try {
            await waitForContentMatch(focusedElement, finalText, 100, 3e3);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const success = await submitForm();
            if (success) {
              console.log(t("m_1bf9ab3da76d"));
            } else {
              console.warn(t("m_1f88547d4371"));
            }
          } catch (error) {
            console.error(t("m_21d6efbe9ff8"), error);
          }
        }
      } else if (config.type === "tool") {
        const focusedElement = getFocusedEditableElement();
        if (!isEditableElement(focusedElement)) {
          console.warn(t("m_9ff363a0feeb"));
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
            console.warn(t("m_d5320d94e958", { action: config.action }));
        }
      }
      if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element) {
        currentlyOpenFolder.element.style.display = "none";
        currentlyOpenFolder.name = null;
        currentlyOpenFolder.element = null;
        console.log(t("m_06d200850c0e", { folderName }));
      } else {
        console.warn(t("m_25172369e83d", { folderName }));
      }
    });
    return button;
  };
  var createFolderButton = (folderName, folderConfig) => {
    const folderButton = document.createElement("button");
    folderButton.innerText = folderName;
    folderButton.type = "button";
    folderButton.style.backgroundColor = folderConfig.color;
    folderButton.style.color = folderConfig.textColor || "#ffffff";
    folderButton.style.border = "none";
    folderButton.style.borderRadius = "4px";
    folderButton.style.padding = "6px 12px";
    folderButton.style.cursor = "pointer";
    folderButton.style.fontSize = "14px";
    folderButton.style.fontWeight = "500";
    folderButton.style.transition = "all 0.2s ease";
    folderButton.style.position = "relative";
    folderButton.style.display = "inline-flex";
    folderButton.style.alignItems = "center";
    folderButton.style.whiteSpace = "nowrap";
    folderButton.style.zIndex = "99";
    folderButton.classList.add("folder-button");
    folderButton.setAttribute("data-folder", folderName);
    folderButton.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    folderButton.addEventListener("mouseleave", () => {
      folderButton.style.transform = "scale(1)";
      folderButton.style.boxShadow = "none";
    });
    const buttonListContainer2 = document.createElement("div");
    buttonListContainer2.style.position = "fixed";
    buttonListContainer2.style.display = "none";
    buttonListContainer2.style.flexDirection = "column";
    buttonListContainer2.style.backgroundColor = "var(--folder-bg, rgba(255, 255, 255, 0.8))";
    buttonListContainer2.style.backdropFilter = "blur(5px)";
    buttonListContainer2.style.border = `1px solid var(--border-color, #e5e7eb)`;
    buttonListContainer2.style.borderRadius = "8px";
    buttonListContainer2.style.padding = "10px";
    buttonListContainer2.style.paddingBottom = "2.5px";
    buttonListContainer2.style.boxShadow = `0 4px 12px var(--shadow-color, rgba(0,0,0,0.1))`;
    buttonListContainer2.style.zIndex = "100";
    buttonListContainer2.style.maxHeight = "800px";
    buttonListContainer2.style.overflowY = "auto";
    buttonListContainer2.style.transition = "all 0.3s ease";
    buttonListContainer2.classList.add("button-list");
    buttonListContainer2.setAttribute("data-folder-list", folderName);
    buttonListContainer2.style.pointerEvents = "auto";
    Object.entries(folderConfig.buttons).forEach(([name, config]) => {
      const customButton = createCustomButton(name, config, folderName);
      buttonListContainer2.appendChild(customButton);
    });
    folderButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element === buttonListContainer2) {
        closeOpenFolderPopover("m_b6157962b143");
      } else {
        if (currentlyOpenFolder.element) {
          closeOpenFolderPopover("m_b6157962b143");
        }
        buttonListContainer2.style.display = "flex";
        currentlyOpenFolder.name = folderName;
        currentlyOpenFolder.element = buttonListContainer2;
        currentlyOpenFolder.trigger = folderButton;
        console.log(t("m_498354115398", { folderName }));
        const rect = folderButton.getBoundingClientRect();
        buttonListContainer2.style.bottom = `40px`;
        buttonListContainer2.style.left = `${rect.left + window.scrollX - 20}px`;
        console.log(t("m_f30f9402010e", {
          left: Math.round(rect.left + window.scrollX - 20)
        }));
      }
    });
    appendToMainLayer(buttonListContainer2);
    return folderButton;
  };
  var closeExistingOverlay = (overlay) => {
    if (overlay && typeof overlay.__cttfCloseDialog === "function") {
      overlay.__cttfCloseDialog();
      return;
    }
    if (overlay && typeof overlay.__cttfLocaleRefreshCleanup === "function") {
      overlay.__cttfLocaleRefreshCleanup();
      overlay.__cttfLocaleRefreshCleanup = null;
    }
    if (overlay && overlay.parentElement) {
      overlay.style.pointerEvents = "none";
      releaseI18nBindings(overlay);
      overlay.parentElement.removeChild(overlay);
      console.log(t("m_dc910208b65d"));
    } else {
      console.warn(t("m_c53a8a03c172"));
    }
  };
  var currentConfirmOverlay = null;
  var showDeleteFolderConfirmDialog = (folderName, rerenderFn) => {
    if (currentConfirmOverlay) {
      closeExistingOverlay(currentConfirmOverlay);
    }
    const folderConfig = buttonConfig.folders[folderName];
    if (!folderConfig) {
      alert(t("m_307cc6a108b7", { folderName }));
      return;
    }
    let buttonsPreviewHTML = "";
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
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "400px",
      maxWidth: "90vw",
      padding: "20px 24px 16px 24px",
      zIndex: "11000",
      closeOnOverlayClick: false,
      overlayClassName: "confirm-overlay",
      dialogClassName: "confirm-dialog",
      onClose: () => {
        if (currentConfirmOverlay === overlay) {
          currentConfirmOverlay = null;
        }
      }
    });
    const deleteFolderTitle = t("m_f3cf53d80bf1", { folderName });
    const irreversibleNotice = t("m_017b3765c0b7");
    const deleteFolderWarning = t("m_83e8afa3ecc6");
    setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteFolderTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNotice}<br/>${deleteFolderWarning}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <!-- 将文件夹按钮预览和文字标签放在一行 -->
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t("m_2df28455fb66")}</strong>
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
                    ${t("m_96630c75b125")} ${folderName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t("m_1f4b4742d2c4")} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t("m_4a06399f371f")} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t("m_eb13448ddd05")}</strong></p>
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
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t("m_4d0b4688c787")}</button>
                <button id="confirmDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius: 4px;
                ">${t("m_3755f56f2f83")}</button>
            </div>
        `);
    currentConfirmOverlay = overlay;
    dialog.querySelector("#cancelDeleteFolder").addEventListener("click", () => {
      closeExistingOverlay(overlay);
    });
    dialog.querySelector("#confirmDeleteFolder").addEventListener("click", () => {
      delete buttonConfig.folders[folderName];
      const idx = buttonConfig.folderOrder.indexOf(folderName);
      if (idx > -1) buttonConfig.folderOrder.splice(idx, 1);
      persistButtonConfig();
      closeExistingOverlay(overlay);
      currentConfirmOverlay = null;
      if (rerenderFn) rerenderFn();
      console.log(t("m_64e35a7bb735", { folderName }));
      updateButtonContainer();
    });
  };
  var showDeleteButtonConfirmDialog = (folderName, btnName, rerenderFn) => {
    if (currentConfirmOverlay) {
      closeExistingOverlay(currentConfirmOverlay);
    }
    const btnCfg = buttonConfig.folders[folderName].buttons[btnName];
    if (!btnCfg) {
      alert(t("m_c06301c561a1", {
        buttonName: btnName,
        folderName
      }));
      return;
    }
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "400px",
      maxWidth: "90vw",
      padding: "20px 24px 16px 24px",
      zIndex: "11000",
      closeOnOverlayClick: false,
      overlayClassName: "confirm-overlay",
      dialogClassName: "confirm-dialog",
      onClose: () => {
        if (currentConfirmOverlay === overlay) {
          currentConfirmOverlay = null;
        }
      }
    });
    const deleteButtonTitle = t("m_10153590c3d8", { buttonName: btnName });
    const irreversibleShort = t("m_017b3765c0b7");
    setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteButtonTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleShort}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t("m_9bfdb8980275")}</strong>
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
                    ${t("m_96630c75b125")} ${btnName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t("m_56e195e887ab")} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t("m_2b1a70945baf")} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t("m_a7cdc1ea98b3")}</strong></p>
                <textarea readonly style="
                    width:100%;
                    height:150px;
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:4px;
                    resize: vertical;
                ">${btnCfg.text || ""}</textarea>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t("m_4d0b4688c787")}</button>
                <button id="confirmDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t("m_3755f56f2f83")}</button>
            </div>
        `);
    currentConfirmOverlay = overlay;
    dialog.querySelector("#cancelDeleteButton").addEventListener("click", () => {
      closeExistingOverlay(overlay);
    });
    dialog.querySelector("#confirmDeleteButton").addEventListener("click", () => {
      delete buttonConfig.folders[folderName].buttons[btnName];
      persistButtonConfig();
      closeExistingOverlay(overlay);
      currentConfirmOverlay = null;
      if (rerenderFn) rerenderFn();
      console.log(t("m_f62771f7d4b6", { buttonName: btnName }));
      updateButtonContainer();
      updateCountersHandler();
    });
  };
  var showButtonEditDialog = (folderName, btnName = "", btnConfig = {}, rerenderFn) => {
    if (currentConfirmOverlay) {
      closeExistingOverlay(currentConfirmOverlay);
    }
    if (folderName === "🖱️" && btnConfig.type === "tool") {
      alert(t("m_b83fafa31b39"));
      return;
    }
    const isEdit = btnName !== "";
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "500px",
      maxWidth: "90vw",
      maxHeight: "none",
      padding: "24px",
      zIndex: "11000",
      closeOnOverlayClick: false,
      overlayClassName: "edit-overlay",
      dialogClassName: "edit-dialog",
      dialogStyles: {
        overflowY: "visible"
      },
      onClose: () => {
        if (currentConfirmOverlay === overlay) {
          currentConfirmOverlay = null;
        }
      }
    });
    const initialName = btnName || "";
    const initialColor = btnConfig.color || "#FFC1CC";
    const initialTextColor = btnConfig.textColor || "#333333";
    const initialAutoSubmit = btnConfig.autoSubmit || false;
    const initialFavicon = typeof btnConfig.favicon === "string" ? btnConfig.favicon : "";
    const buttonHeaderText = isEdit ? t("m_62c16c5424b3") : t("m_ff310c80f940");
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
                    ${buttonHeaderText}
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
                    ">${initialName || t("m_68b9cc33d69a")}</button>
                </div>
            </div>
        `;
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
                    ">${t("m_d291a7396aef")}</label>
                    <div id="quickInsertButtons" style="
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                    ">
                        <button type="button" data-insert="{inputboard}" style="
                            ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">📝 ${t("m_02be516690b9")}</button>
                        <button type="button" data-insert="{clipboard}" style="
                            ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t("m_abdc48c69706")}</button>
                        <button type="button" data-insert="{selection}" style="
                            ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t("m_de9deef0cff4")}</button>
                        <button type="button" data-insert="{{inputboard}|{clipboard}}" style="
                            ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t("m_6eeb5f84309c")}</button>
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
                ">${btnConfig.text || ""}</textarea>
            </div>
        </div>`;
    const styleSettingsTab = `
            <div id="styleSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t("m_96630c75b125")}</label>
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
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t("m_f9e235108e1a")}</label>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div id="buttonFaviconPreview" style="
                            width: 40px;
                            height: 40px;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: transparent;
                            flex-shrink: 0;
                        "></div>
                        <div style="flex: 1 1 auto; display: flex; flex-direction: column;">
                            <textarea id="buttonFaviconInput" rows="1" style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid var(--border-color, #d1d5db);
                                border-radius: 6px;
                                background-color: var(--dialog-bg, #ffffff);
                                box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
                                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                                outline: none;
                                font-size: 14px;
                                line-height: 1.5;
                                resize: vertical;
                                overflow-y: hidden;
                            " placeholder="${t("m_c182fdbf9d82")}">${initialFavicon}</textarea>
                            <div style="
                                margin-top: 6px;
                                font-size: 12px;
                                color: var(--muted-text-color, #6b7280);
                            ">${t("m_f63a0a40276e")}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t("m_56e195e887ab")}</label>
                    <input type="color" id="buttonColor" value="${btnConfig.color || "#FFC1CC"}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t("m_2b1a70945baf")}</label>
                    <input type="color" id="buttonTextColor" value="${btnConfig.textColor || "#333333"}" style="
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
                        <input type="checkbox" id="autoSubmitCheckbox" style="cursor: pointer;" ${initialAutoSubmit ? "checked" : ""}>
                        ${t("m_1f990d8a3684")}
                    </label>
                </div>
            </div>
        `;
    const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="textTemplateTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t("m_f3e5cbd48d48")}</button>
                <button class="tab-button" data-tab="styleSettingsTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t("m_8b52bd0a4bd6")}</button>
                <button class="tab-button" data-tab="submitSettingsTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t("m_3c3b1f3f773c")}</button>
            </div>
        `;
    const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t("m_4d0b4688c787")}</button>
                <button id="saveButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t("m_b56d9ac6c5a0")}</button>
            </div>
        `;
    setTrustedHTML(dialog, `
            ${previewSection}
            ${tabNavigation}
            ${textTemplateTab}
            ${styleSettingsTab}
            ${submitSettingsTab}
            ${footerButtons}
        `);
    const setupTabs = () => {
      const tabButtons = dialog.querySelectorAll(".tab-button");
      const tabContents = dialog.querySelectorAll(".tab-content");
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tabId = button.dataset.tab;
          tabButtons.forEach((btn) => {
            if (btn === button) {
              btn.style.backgroundColor = "var(--primary-color, #3B82F6)";
              btn.style.color = "white";
              btn.style.borderBottom = "2px solid var(--primary-color, #3B82F6)";
            } else {
              btn.style.backgroundColor = "var(--button-bg, #f3f4f6)";
              btn.style.color = "var(--text-color, #333333)";
              btn.style.borderBottom = "2px solid transparent";
            }
          });
          tabContents.forEach((content) => {
            content.style.display = content.id === tabId ? "block" : "none";
          });
        });
      });
    };
    currentConfirmOverlay = overlay;
    setupTabs();
    const setupPreviewUpdates = () => {
      const previewButton = dialog.querySelector("#previewButton");
      const buttonNameInput = dialog.querySelector("#buttonName");
      const buttonColorInput = dialog.querySelector("#buttonColor");
      const buttonTextColorInput = dialog.querySelector("#buttonTextColor");
      const autoSubmitCheckbox = dialog.querySelector("#autoSubmitCheckbox");
      const buttonFaviconInput = dialog.querySelector("#buttonFaviconInput");
      const buttonFaviconPreview = dialog.querySelector("#buttonFaviconPreview");
      const updateFaviconPreview = () => {
        if (!buttonFaviconPreview) return;
        const currentName = buttonNameInput?.value.trim() || initialName || "";
        const faviconValue = buttonFaviconInput?.value.trim() || "";
        const { iconSymbol } = extractButtonIconParts(currentName);
        const fallbackSymbol = iconSymbol || (Array.from(currentName.trim())[0] || "🔖");
        const previewElement = createFaviconElement(
          faviconValue,
          currentName,
          fallbackSymbol,
          { withBackground: false }
        );
        setTrustedHTML(buttonFaviconPreview, "");
        buttonFaviconPreview.appendChild(previewElement);
      };
      buttonNameInput?.addEventListener("input", (e) => {
        previewButton.textContent = e.target.value || t("m_68b9cc33d69a");
        updateFaviconPreview();
      });
      buttonColorInput?.addEventListener("input", (e) => {
        previewButton.style.backgroundColor = e.target.value;
      });
      buttonTextColorInput?.addEventListener("input", (e) => {
        previewButton.style.color = e.target.value;
      });
      autoSubmitCheckbox?.addEventListener("change", (e) => {
        console.log(t("m_cbfc561586be", { state: e.target.checked }));
      });
      if (buttonFaviconInput) {
        autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
        buttonFaviconInput.addEventListener("input", () => {
          autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
          updateFaviconPreview();
        });
      }
      updateFaviconPreview();
    };
    setupPreviewUpdates();
    const setupQuickInsert = () => {
      const buttonText = dialog.querySelector("#buttonText");
      const quickInsertButtons = dialog.querySelector("#quickInsertButtons");
      quickInsertButtons?.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-insert]");
        if (!button) return;
        e.preventDefault();
        const insertText = button.dataset.insert;
        const start = buttonText.selectionStart;
        const end = buttonText.selectionEnd;
        buttonText.value = buttonText.value.substring(0, start) + insertText + buttonText.value.substring(end);
        buttonText.selectionStart = buttonText.selectionEnd = start + insertText.length;
        buttonText.focus();
      });
      quickInsertButtons?.addEventListener("mousedown", (e) => {
        if (e.target.closest("button[data-insert]")) {
          e.preventDefault();
        }
      });
    };
    setupQuickInsert();
    dialog.querySelector("#cancelButtonEdit")?.addEventListener("click", () => {
      closeExistingOverlay(overlay);
    });
    dialog.querySelector("#saveButtonEdit")?.addEventListener("click", () => {
      const newBtnName = dialog.querySelector("#buttonName").value.trim();
      const newBtnColor = dialog.querySelector("#buttonColor").value;
      const newBtnTextColor = dialog.querySelector("#buttonTextColor").value;
      const newBtnText = dialog.querySelector("#buttonText").value.trim();
      const autoSubmit = dialog.querySelector("#autoSubmitCheckbox")?.checked || false;
      const newBtnFavicon = (dialog.querySelector("#buttonFaviconInput")?.value || "").trim();
      if (!newBtnName) {
        alert(t("m_6f18d9d8f52a"));
        return;
      }
      if (!isValidColor(newBtnColor) || !isValidColor(newBtnTextColor)) {
        alert(t("m_4d268c8dd14f"));
        return;
      }
      if (newBtnName !== btnName && buttonConfig.folders[folderName].buttons[newBtnName]) {
        alert(t("m_62734586e922"));
        return;
      }
      const currentButtons = { ...buttonConfig.folders[folderName].buttons };
      if (btnConfig.type === "tool") {
        buttonConfig.folders[folderName].buttons[newBtnName] = {
          type: "tool",
          action: btnConfig.action,
          color: newBtnColor,
          textColor: newBtnTextColor
        };
      } else {
        if (btnName && newBtnName !== btnName) {
          const newButtons = {};
          Object.keys(currentButtons).forEach((key) => {
            if (key === btnName) {
              newButtons[newBtnName] = {
                text: newBtnText,
                color: newBtnColor,
                textColor: newBtnTextColor,
                type: "template",
                autoSubmit,
                favicon: newBtnFavicon
              };
            } else {
              newButtons[key] = currentButtons[key];
            }
          });
          buttonConfig.folders[folderName].buttons = newButtons;
        } else {
          if (btnName) {
            buttonConfig.folders[folderName].buttons[btnName] = {
              text: newBtnText,
              color: newBtnColor,
              textColor: newBtnTextColor,
              type: "template",
              autoSubmit,
              favicon: newBtnFavicon
            };
          } else {
            buttonConfig.folders[folderName].buttons[newBtnName] = {
              text: newBtnText,
              color: newBtnColor,
              textColor: newBtnTextColor,
              type: "template",
              autoSubmit,
              favicon: newBtnFavicon
            };
          }
        }
      }
      persistButtonConfig();
      closeExistingOverlay(overlay);
      if (rerenderFn) rerenderFn();
      console.log(t("m_1968d029fafd", { buttonName: newBtnName }));
      updateButtonContainer();
      updateCountersHandler();
    });
  };
  function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  }
  var showFolderEditDialog = (folderName = "", folderConfig = {}, rerenderFn) => {
    if (currentConfirmOverlay) {
      closeExistingOverlay(currentConfirmOverlay);
    }
    const isNew = !folderName;
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "500px",
      maxWidth: "90vw",
      maxHeight: "none",
      padding: "24px",
      zIndex: "11000",
      closeOnOverlayClick: false,
      overlayClassName: "folder-edit-overlay",
      dialogClassName: "folder-edit-dialog",
      dialogStyles: {
        overflowY: "visible"
      },
      onClose: () => {
        if (currentConfirmOverlay === overlay) {
          currentConfirmOverlay = null;
        }
      }
    });
    const initialName = folderName || "";
    const initialColor = folderConfig.color || "#3B82F6";
    const initialTextColor = folderConfig.textColor || "#ffffff";
    const folderHeaderText = isNew ? t("m_be4786217d60") : t("m_2c4b05fe54d8");
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
                    ${folderHeaderText}
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
                    ">${initialName || t("m_7353515a2d1e")}</button>
                </div>
            </div>
        `;
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
                    ">${t("m_bed2c8aee267")}</label>
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
                    ">${t("m_56e195e887ab")}</label>
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
                    ">${t("m_2b1a70945baf")}</label>
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
    const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t("m_4d0b4688c787")}</button>
                <button id="saveFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t("m_b56d9ac6c5a0")}</button>
            </div>
        `;
    setTrustedHTML(dialog, `
            ${previewSection}
            ${settingsSection}
            ${footerButtons}
        `);
    const setupPreviewUpdates = () => {
      const previewButton = dialog.querySelector("#previewButton");
      const folderNameInput = dialog.querySelector("#folderNameInput");
      const folderColorInput = dialog.querySelector("#folderColorInput");
      const folderTextColorInput = dialog.querySelector("#folderTextColorInput");
      folderNameInput?.addEventListener("input", (e) => {
        previewButton.textContent = e.target.value || t("m_7353515a2d1e");
      });
      folderColorInput?.addEventListener("input", (e) => {
        previewButton.style.backgroundColor = e.target.value;
      });
      folderTextColorInput?.addEventListener("input", (e) => {
        previewButton.style.color = e.target.value;
      });
    };
    setupPreviewUpdates();
    currentConfirmOverlay = overlay;
    dialog.querySelector("#cancelFolderEdit").addEventListener("click", () => {
      closeExistingOverlay(overlay);
    });
    dialog.querySelector("#saveFolderEdit").addEventListener("click", () => {
      const newFolderName = dialog.querySelector("#folderNameInput").value.trim();
      const newColor = dialog.querySelector("#folderColorInput").value;
      const newTextColor = dialog.querySelector("#folderTextColorInput").value;
      if (!newFolderName) {
        alert(t("m_0d58c801c155"));
        return;
      }
      if (isNew && buttonConfig.folders[newFolderName]) {
        alert(t("m_4968e7a93613"));
        return;
      }
      if (!isNew && newFolderName !== folderName && buttonConfig.folders[newFolderName]) {
        alert(t("m_4968e7a93613"));
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
        if (typeof buttonConfig.folders[newFolderName].hidden !== "boolean") {
          buttonConfig.folders[newFolderName].hidden = false;
        }
        if (isNew) {
          buttonConfig.folderOrder.push(newFolderName);
        }
      }
      Object.entries(buttonConfig.folders).forEach(([folderName2, folderCfg]) => {
        Object.entries(folderCfg.buttons).forEach(([btnName, btnCfg]) => {
          if (!btnCfg.type) {
            if (folderName2 === "🖱️") {
              btnCfg.type = "tool";
            } else {
              btnCfg.type = "template";
            }
          }
          if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== "boolean") {
            btnCfg.autoSubmit = false;
          }
        });
      });
      persistButtonConfig();
      closeExistingOverlay(overlay);
      if (rerenderFn) rerenderFn(newFolderName);
      console.log(t("m_65d6fdd82a8e", { folderName: newFolderName }));
      updateButtonContainer();
      updateCountersHandler();
    });
  };
  var createSettingsButton = () => {
    const button = document.createElement("button");
    button.innerText = "⚙️";
    button.type = "button";
    button.style.backgroundColor = "var(--button-bg, #f3f4f6)";
    button.style.color = "var(--text-color, #333333)";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.marginLeft = "10px";
    button.addEventListener("click", () => showUnifiedSettingsDialogHandler());
    return button;
  };
  var createClearButton = () => {
    const button = document.createElement("button");
    button.textContent = "✖";
    button.type = "button";
    button.style.backgroundColor = "var(--button-bg, #f3f4f6)";
    button.style.color = "var(--clear-icon-color, var(--text-color, #333333))";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.marginLeft = "10px";
    button.title = t("m_bcba6579c508");
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const focusedElement = getFocusedEditableElement();
      if (!isEditableElement(focusedElement)) {
        console.warn(t("m_9ff363a0feeb"));
        return;
      }
      clearEditableText(focusedElement, { focus: true });
      console.log(t("m_f6d245dfbc61"));
      showTemporaryFeedback(focusedElement, t("m_bc14d54e2a74"));
    });
    return button;
  };
  var createConfigSettingsButton = () => {
    const button = document.createElement("button");
    button.innerText = t("m_3b8ac539b031");
    button.type = "button";
    button.style.backgroundColor = "var(--info-color, #4F46E5)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.addEventListener("click", () => showConfigSettingsDialogHandler());
    return button;
  };
  var createButtonContainer = () => {
    const root = getShadowRoot();
    let existingContainer = root ? root.querySelector(".folder-buttons-container") : null;
    if (existingContainer) {
      updateButtonContainer();
      return existingContainer;
    }
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("folder-buttons-container");
    buttonContainer.style.pointerEvents = "auto";
    buttonContainer.style.position = "fixed";
    buttonContainer.style.right = "0px";
    buttonContainer.style.width = "100%";
    buttonContainer.style.zIndex = "1000";
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexWrap = "nowrap";
    buttonContainer.style.overflowX = "auto";
    buttonContainer.style.overflowY = "hidden";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "0px";
    buttonContainer.style.height = buttonConfig.buttonBarHeight + "px";
    buttonContainer.style.scrollbarWidth = "none";
    buttonContainer.style.msOverflowStyle = "none";
    buttonContainer.classList.add("hide-scrollbar");
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.padding = "6px 15px";
    buttonContainer.style.backgroundColor = "transparent";
    buttonContainer.style.boxShadow = "none";
    buttonContainer.style.borderRadius = "4px";
    buttonConfig.folderOrder.forEach((name) => {
      const config = buttonConfig.folders[name];
      if (config && !config.hidden) {
        const folderButton = createFolderButton(name, config);
        buttonContainer.appendChild(folderButton);
      }
    });
    buttonContainer.appendChild(createSettingsButton());
    buttonContainer.appendChild(createClearButton());
    buttonContainer.dataset.barPaddingY = "6";
    applyBarBottomSpacing(
      buttonContainer,
      buttonConfig.buttonBarBottomSpacing,
      buttonConfig.buttonBarBottomSpacing
    );
    return buttonContainer;
  };
  var updateButtonContainer = () => {
    const root = getShadowRoot();
    let existingContainer = root ? root.querySelector(".folder-buttons-container") : null;
    if (existingContainer) {
      const settingsButton = existingContainer.querySelector("button:nth-last-child(2)");
      const clearButton = existingContainer.querySelector("button:last-child");
      removeAllFolderPopovers();
      setTrustedHTML(existingContainer, "");
      buttonConfig.folderOrder.forEach((name) => {
        const config = buttonConfig.folders[name];
        if (config && !config.hidden) {
          const folderButton = createFolderButton(name, config);
          existingContainer.appendChild(folderButton);
        }
      });
      if (settingsButton) existingContainer.appendChild(settingsButton);
      if (clearButton) existingContainer.appendChild(clearButton);
      console.log(t("m_f916d862e0af"));
    } else {
      console.warn(t("m_b1ed8accdb95"));
    }
    try {
      applyDomainStyles();
    } catch (err) {
      console.warn(t("m_4d34dcf31830"), err);
    }
  };
  var attachButtonsToTextarea = (textarea) => {
    let buttonContainer = queryUI(".folder-buttons-container");
    if (!buttonContainer) {
      buttonContainer = createButtonContainer();
      appendToMainLayer(buttonContainer);
      try {
        applyDomainStyles();
      } catch (_) {
      }
      console.log(t("m_a9d17afdc4cc"));
    } else {
      console.log(t("m_7b5e9ee8df7e"));
    }
    if (!contextMenuBoundEditables.has(textarea)) {
      textarea.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
      contextMenuBoundEditables.add(textarea);
    }
  };
  var attachTimeout;
  var attachButtons = () => {
    if (attachTimeout) clearTimeout(attachTimeout);
    attachTimeout = setTimeout(() => {
      const textareas = getAllTextareas();
      console.log(t("m_8d46f43f96e9", {
        count: textareas.length
      }));
      if (textareas.length === 0) {
        console.warn(t("m_ee15681d0604"));
        return;
      }
      attachButtonsToTextarea(textareas[textareas.length - 1]);
      console.log(t("m_f873f0136721"));
    }, 300);
  };
  var observeShadowRoots = (node) => {
    if (node.shadowRoot) {
      const shadowObserver = new MutationObserver(() => {
        attachButtons();
      });
      shadowObserver.observe(node.shadowRoot, {
        childList: true,
        subtree: true
      });
      node.shadowRoot.querySelectorAll("*").forEach((child) => observeShadowRoots(child));
    }
  };

  // src/features/automation/method-display.js
  var keyboardMethodPattern = /(enter|shift|caps|ctrl|control|cmd|meta|option|alt|space|tab|esc|escape|delete|backspace|home|end|page ?up|page ?down|arrow|up|down|left|right)/i;
  var createKeyCapElement = (label) => {
    const keyEl = document.createElement("span");
    keyEl.textContent = label;
    keyEl.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(17,17,17,0.95), rgba(45,45,45,0.95));
        box-shadow: inset 0 -1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.45);
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        line-height: 1.2;
        white-space: nowrap;
    `;
    return keyEl;
  };
  var resolveMethodDisplayValue = (rawMethod, rawAdvanced) => {
    const originalValue = typeof rawMethod === "string" ? rawMethod.trim() : "";
    if (!originalValue) {
      return "";
    }
    const shouldNormalize = [
      AUTO_SUBMIT_METHODS.ENTER,
      AUTO_SUBMIT_METHODS.MODIFIER_ENTER,
      AUTO_SUBMIT_METHODS.CLICK_SUBMIT,
      "Enter",
      "Cmd+Enter",
      "模拟点击提交按钮"
    ].includes(originalValue);
    if (!shouldNormalize) {
      return originalValue;
    }
    const normalizedMethod = normalizeAutoSubmitMethod(originalValue);
    if (normalizedMethod === AUTO_SUBMIT_METHODS.ENTER) {
      return t("i18n.automation.method.enter");
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
      return rawAdvanced && rawAdvanced.variant === "ctrl" ? "Ctrl+Enter" : t("i18n.automation.method.modifier_enter");
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
      return AUTO_SUBMIT_METHODS.CLICK_SUBMIT;
    }
    return originalValue;
  };
  var createMethodDisplay = (rawMethod, rawAdvanced = null) => {
    const methodValue = resolveMethodDisplayValue(rawMethod, rawAdvanced);
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.gap = "6px";
    container.style.flexWrap = "wrap";
    container.style.maxWidth = "100%";
    container.style.fontSize = "12px";
    container.style.fontWeight = "600";
    if (!methodValue) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "-";
      placeholder.style.color = "var(--muted-text-color, #6b7280)";
      placeholder.style.fontWeight = "500";
      container.appendChild(placeholder);
      return container;
    }
    if (methodValue === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
      const clickBadge = document.createElement("span");
      clickBadge.textContent = t("m_82872ab8af7b");
      clickBadge.style.cssText = `
            padding: 4px 12px;
            border-radius: 20px;
            background: linear-gradient(180deg, rgba(253,224,71,0.85), rgba(251,191,36,0.9));
            border: 1px solid rgba(217,119,6,0.4);
            box-shadow: inset 0 -1px 0 rgba(217,119,6,0.35), 0 1px 2px rgba(217,119,6,0.25);
            color: rgba(120,53,15,0.95);
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 0.02em;
            white-space: nowrap;
        `;
      container.appendChild(clickBadge);
      return container;
    }
    const shouldUseKeyStyle = keyboardMethodPattern.test(methodValue) || methodValue.includes("+") || methodValue.includes("/");
    if (!shouldUseKeyStyle) {
      const pill = document.createElement("span");
      pill.textContent = methodValue;
      pill.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(59,130,246,0.12);
            color: var(--primary-color, #3B82F6);
            border-radius: 999px;
            white-space: nowrap;
        `;
      container.appendChild(pill);
      return container;
    }
    const combos = methodValue.split("/").map((segment) => segment.trim()).filter(Boolean);
    combos.forEach((combo, comboIdx) => {
      if (comboIdx > 0) {
        const divider = document.createElement("span");
        divider.textContent = "/";
        divider.style.color = "var(--muted-text-color, #6b7280)";
        divider.style.fontSize = "11px";
        divider.style.fontWeight = "600";
        container.appendChild(divider);
      }
      const comboWrapper = document.createElement("div");
      comboWrapper.style.display = "flex";
      comboWrapper.style.alignItems = "center";
      comboWrapper.style.justifyContent = "center";
      comboWrapper.style.gap = "4px";
      const keys = combo.split("+").map((part) => part.trim()).filter(Boolean);
      if (!keys.length) {
        keys.push(combo);
      }
      keys.forEach((keyLabel, keyIdx) => {
        if (keyIdx > 0) {
          const plusSign = document.createElement("span");
          plusSign.textContent = "+";
          plusSign.style.color = "var(--muted-text-color, #6b7280)";
          plusSign.style.fontSize = "11px";
          plusSign.style.fontWeight = "600";
          comboWrapper.appendChild(plusSign);
        }
        comboWrapper.appendChild(createKeyCapElement(keyLabel));
      });
      container.appendChild(comboWrapper);
    });
    return container;
  };

  // src/features/automation/rule-editor-dialog.js
  var currentRuleEditorOverlay = null;
  function showAutomationRuleEditorDialog(ruleData = {}, onSave, options = {}) {
    const { methodExpanded = null } = options;
    if (currentRuleEditorOverlay) {
      closeExistingOverlay(currentRuleEditorOverlay);
    }
    const isEdit = !!ruleData && !!ruleData.domain;
    const presetDomain = isEdit ? ruleData.domain || "" : window.location.hostname || "";
    const presetFavicon = isEdit && ruleData.favicon ? ruleData.favicon : generateDomainFavicon(presetDomain);
    const { overlay, dialog } = createUnifiedDialog({
      title: isEdit ? "m_d75496a857cf" : "m_c34a706f680d",
      width: "480px",
      onClose: () => {
        if (currentRuleEditorOverlay === overlay) {
          currentRuleEditorOverlay = null;
        }
      },
      closeOnOverlayClick: false
    });
    currentRuleEditorOverlay = overlay;
    function closeEditor() {
      closeExistingOverlay(overlay);
      currentRuleEditorOverlay = null;
    }
    function createAutoSubmitMethodConfigUI(initialMethod = AUTO_SUBMIT_METHODS.ENTER, initialAdvanced = null, initialExpandedState = null) {
      const methodSection = document.createElement("div");
      methodSection.style.display = "flex";
      methodSection.style.flexDirection = "column";
      methodSection.style.gap = "8px";
      const titleRow = document.createElement("div");
      titleRow.style.display = "flex";
      titleRow.style.alignItems = "center";
      titleRow.style.justifyContent = "space-between";
      const methodTitle = document.createElement("div");
      methodTitle.textContent = t("m_0996aa586f31");
      methodTitle.style.fontSize = "13px";
      methodTitle.style.fontWeight = "600";
      methodTitle.style.color = "var(--text-color, #1f2937)";
      titleRow.appendChild(methodTitle);
      const expandButton = document.createElement("button");
      expandButton.type = "button";
      expandButton.title = t("m_07ad1432b715");
      expandButton.textContent = "▼";
      expandButton.style.width = "28px";
      expandButton.style.height = "28px";
      expandButton.style.padding = "0";
      expandButton.style.display = "flex";
      expandButton.style.alignItems = "center";
      expandButton.style.justifyContent = "center";
      expandButton.style.border = "1px solid transparent";
      expandButton.style.borderRadius = "4px";
      expandButton.style.background = "transparent";
      expandButton.style.cursor = "pointer";
      expandButton.style.transition = "background-color 0.2s ease, border-color 0.2s ease";
      expandButton.addEventListener("mouseenter", () => {
        expandButton.style.backgroundColor = "var(--button-bg, #f3f4f6)";
        expandButton.style.borderColor = "var(--border-color, #d1d5db)";
      });
      expandButton.addEventListener("mouseleave", () => {
        expandButton.style.backgroundColor = "transparent";
        expandButton.style.borderColor = "transparent";
      });
      titleRow.appendChild(expandButton);
      methodSection.appendChild(titleRow);
      const methodOptionsWrapper = document.createElement("div");
      methodOptionsWrapper.style.display = "flex";
      methodOptionsWrapper.style.flexWrap = "wrap";
      methodOptionsWrapper.style.gap = "15px";
      methodSection.appendChild(methodOptionsWrapper);
      const advancedContainer = document.createElement("div");
      advancedContainer.style.display = "none";
      advancedContainer.style.flexDirection = "column";
      advancedContainer.style.gap = "10px";
      advancedContainer.style.marginTop = "8px";
      advancedContainer.style.padding = "12px";
      advancedContainer.style.borderRadius = "6px";
      advancedContainer.style.border = "1px solid var(--border-color, #d1d5db)";
      advancedContainer.style.backgroundColor = "var(--dialog-bg, #ffffff)";
      advancedContainer.style.boxShadow = "inset 0 1px 2px rgba(15, 23, 42, 0.04)";
      advancedContainer.style.transition = "opacity 0.2s ease";
      advancedContainer.style.opacity = "0";
      methodSection.appendChild(advancedContainer);
      const methodOptions = [
        { value: AUTO_SUBMIT_METHODS.ENTER, text: t("i18n.automation.method.enter") },
        { value: AUTO_SUBMIT_METHODS.MODIFIER_ENTER, text: t("i18n.automation.method.modifier_enter") },
        { value: AUTO_SUBMIT_METHODS.CLICK_SUBMIT, text: t("m_2a8bd3464401") }
      ];
      const methodRadioName = `autoSubmitMethod_${Math.random().toString(36).slice(2, 8)}`;
      const uniqueSuffix = Math.random().toString(36).slice(2, 8);
      const getDefaultAdvancedForMethod = (method) => {
        if (method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
          return { variant: "cmd" };
        }
        if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
          return { variant: "default", selector: "" };
        }
        return null;
      };
      const normalizeAdvancedForMethod = (method, advanced) => {
        const defaults = getDefaultAdvancedForMethod(method);
        if (!defaults) return null;
        const normalized = { ...defaults };
        if (advanced && typeof advanced === "object") {
          if (method === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
            if (advanced.variant && ["cmd", "ctrl"].includes(advanced.variant)) {
              normalized.variant = advanced.variant;
            }
          } else if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
            if (advanced.variant && ["default", "selector"].includes(advanced.variant)) {
              normalized.variant = advanced.variant;
            }
            if (advanced.selector && typeof advanced.selector === "string") {
              normalized.selector = advanced.selector;
            }
          }
        }
        if (method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && normalized.variant !== "selector") {
          normalized.selector = "";
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
          return advancedState.variant === "ctrl";
        }
        if (selectedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
          return advancedState.variant === "selector" && advancedState.selector;
        }
        return false;
      };
      let isExpanded = typeof initialExpandedState === "boolean" ? initialExpandedState : shouldExpandInitially();
      const renderAdvancedContent = () => {
        setTrustedHTML(advancedContainer, "");
        if (!isExpanded) {
          advancedContainer.style.display = "none";
          advancedContainer.style.opacity = "0";
          return;
        }
        advancedContainer.style.display = "flex";
        advancedContainer.style.opacity = "1";
        const advancedTitle = document.createElement("div");
        advancedTitle.textContent = t("m_7104c3ab47fe");
        advancedTitle.style.fontSize = "12px";
        advancedTitle.style.fontWeight = "600";
        advancedTitle.style.opacity = "0.75";
        advancedContainer.appendChild(advancedTitle);
        if (selectedMethod === AUTO_SUBMIT_METHODS.ENTER) {
          const tip2 = document.createElement("div");
          tip2.textContent = t("m_200126157e5c");
          tip2.style.fontSize = "12px";
          tip2.style.color = "var(--muted-text-color, #6b7280)";
          advancedContainer.appendChild(tip2);
          return;
        }
        if (selectedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
          const variants = [
            { value: "cmd", label: "Cmd + Enter", desc: t("m_3ff2205d80a9") },
            { value: "ctrl", label: "Ctrl + Enter", desc: t("m_25fe6051280a") }
          ];
          const variantGroup = document.createElement("div");
          variantGroup.style.display = "flex";
          variantGroup.style.flexDirection = "column";
          variantGroup.style.gap = "8px";
          const variantRadioName = `autoSubmitCmdVariant_${uniqueSuffix}`;
          variants.forEach((variant) => {
            const label = document.createElement("label");
            label.style.display = "flex";
            label.style.alignItems = "flex-start";
            label.style.gap = "8px";
            label.style.cursor = "pointer";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = variantRadioName;
            radio.value = variant.value;
            radio.checked = advancedState?.variant === variant.value;
            radio.style.marginTop = "2px";
            radio.style.cursor = "pointer";
            radio.addEventListener("change", () => {
              if (radio.checked) {
                advancedState = { variant: variant.value };
              }
            });
            const textContainer = document.createElement("div");
            textContainer.style.display = "flex";
            textContainer.style.flexDirection = "column";
            textContainer.style.gap = "2px";
            const labelText = document.createElement("span");
            labelText.textContent = variant.label;
            labelText.style.fontSize = "13px";
            labelText.style.fontWeight = "600";
            const descText = document.createElement("span");
            descText.textContent = variant.desc;
            descText.style.fontSize = "12px";
            descText.style.opacity = "0.75";
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
            { value: "default", label: t("m_1a75afb2bb8b"), desc: t("m_e70aa94ac10e") },
            { value: "selector", label: t("m_a28c37109b98"), desc: t("m_714a4a09117d") }
          ];
          const variantGroup = document.createElement("div");
          variantGroup.style.display = "flex";
          variantGroup.style.flexDirection = "column";
          variantGroup.style.gap = "8px";
          const variantRadioName = `autoSubmitClickVariant_${uniqueSuffix}`;
          variants.forEach((variant) => {
            const label = document.createElement("label");
            label.style.display = "flex";
            label.style.alignItems = "flex-start";
            label.style.gap = "8px";
            label.style.cursor = "pointer";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = variantRadioName;
            radio.value = variant.value;
            radio.checked = advancedState?.variant === variant.value;
            radio.style.marginTop = "2px";
            radio.style.cursor = "pointer";
            radio.addEventListener("change", () => {
              if (radio.checked) {
                advancedState = normalizeAdvancedForMethod(selectedMethod, {
                  variant: variant.value,
                  selector: advancedState?.selector || ""
                });
                renderAdvancedContent();
              }
            });
            const textContainer = document.createElement("div");
            textContainer.style.display = "flex";
            textContainer.style.flexDirection = "column";
            textContainer.style.gap = "2px";
            const labelText = document.createElement("span");
            labelText.textContent = variant.label;
            labelText.style.fontSize = "13px";
            labelText.style.fontWeight = "600";
            const descText = document.createElement("span");
            descText.textContent = variant.desc;
            descText.style.fontSize = "12px";
            descText.style.opacity = "0.75";
            textContainer.appendChild(labelText);
            textContainer.appendChild(descText);
            label.appendChild(radio);
            label.appendChild(textContainer);
            variantGroup.appendChild(label);
          });
          advancedContainer.appendChild(variantGroup);
          if (advancedState?.variant === "selector") {
            const selectorInput = document.createElement("input");
            selectorInput.type = "text";
            selectorInput.placeholder = t("m_e27ffecbfc9f");
            selectorInput.value = advancedState.selector || "";
            selectorInput.style.width = "100%";
            selectorInput.style.height = "40px";
            selectorInput.style.padding = "0 12px";
            selectorInput.style.border = "1px solid var(--border-color, #d1d5db)";
            selectorInput.style.borderRadius = "6px";
            selectorInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
            selectorInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
            selectorInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
            selectorInput.style.outline = "none";
            selectorInput.style.fontSize = "14px";
            selectorInput.addEventListener("input", () => {
              advancedState = normalizeAdvancedForMethod(selectedMethod, {
                variant: "selector",
                selector: selectorInput.value
              });
            });
            advancedContainer.appendChild(selectorInput);
            const hint = document.createElement("div");
            hint.textContent = t("m_6ed8b9ab61b3");
            hint.style.fontSize = "12px";
            hint.style.color = "var(--muted-text-color, #6b7280)";
            advancedContainer.appendChild(hint);
          }
          return;
        }
        const tip = document.createElement("div");
        tip.textContent = t("m_0294a7240855");
        tip.style.fontSize = "12px";
        tip.style.color = "var(--muted-text-color, #6b7280)";
        advancedContainer.appendChild(tip);
      };
      methodOptions.forEach((option) => {
        const radioLabel = document.createElement("label");
        radioLabel.style.display = "inline-flex";
        radioLabel.style.alignItems = "center";
        radioLabel.style.cursor = "pointer";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = methodRadioName;
        radio.value = option.value;
        radio.checked = selectedMethod === option.value;
        radio.style.marginRight = "6px";
        radio.style.cursor = "pointer";
        radio.addEventListener("change", () => {
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
      expandButton.addEventListener("click", () => {
        isExpanded = !isExpanded;
        expandButton.textContent = isExpanded ? "▲" : "▼";
        expandButton.setAttribute("aria-expanded", String(isExpanded));
        renderAdvancedContent();
      });
      expandButton.setAttribute("aria-expanded", String(isExpanded));
      expandButton.textContent = isExpanded ? "▲" : "▼";
      renderAdvancedContent();
      return {
        container: methodSection,
        getConfig: () => {
          const normalized = normalizeAdvancedForMethod(selectedMethod, advancedState);
          let advancedForSave = null;
          if (selectedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER && normalized && normalized.variant && normalized.variant !== "cmd") {
            advancedForSave = { variant: normalized.variant };
          } else if (selectedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && normalized) {
            if (normalized.variant === "selector") {
              advancedForSave = {
                variant: "selector",
                selector: typeof normalized.selector === "string" ? normalized.selector : ""
              };
            } else if (normalized.variant !== "default") {
              advancedForSave = { variant: normalized.variant };
            }
          }
          return {
            method: selectedMethod,
            advanced: advancedForSave
          };
        },
        isExpanded: () => isExpanded
      };
    }
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "12px";
    container.style.marginBottom = "16px";
    container.style.padding = "16px";
    container.style.borderRadius = "6px";
    container.style.border = "1px solid var(--border-color, #e5e7eb)";
    container.style.backgroundColor = "var(--button-bg, #f3f4f6)";
    const domainLabel = document.createElement("label");
    domainLabel.textContent = t("m_efe0801dac67");
    domainLabel.style.display = "flex";
    domainLabel.style.flexDirection = "column";
    domainLabel.style.gap = "6px";
    domainLabel.style.fontSize = "13px";
    domainLabel.style.fontWeight = "600";
    domainLabel.style.color = "var(--text-color, #1f2937)";
    const domainInput = document.createElement("input");
    domainInput.type = "text";
    domainInput.style.width = "100%";
    domainInput.style.height = "40px";
    domainInput.style.padding = "0 12px";
    domainInput.style.border = "1px solid var(--border-color, #d1d5db)";
    domainInput.style.borderRadius = "6px";
    domainInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    domainInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    domainInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    domainInput.style.outline = "none";
    domainInput.style.fontSize = "14px";
    domainInput.value = presetDomain;
    domainLabel.appendChild(domainInput);
    container.appendChild(domainLabel);
    const nameLabel = document.createElement("label");
    nameLabel.textContent = t("m_3ac80afa5a53");
    nameLabel.style.display = "flex";
    nameLabel.style.flexDirection = "column";
    nameLabel.style.gap = "6px";
    nameLabel.style.fontSize = "13px";
    nameLabel.style.fontWeight = "600";
    nameLabel.style.color = "var(--text-color, #1f2937)";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.style.width = "100%";
    nameInput.style.height = "40px";
    nameInput.style.padding = "0 12px";
    nameInput.style.border = "1px solid var(--border-color, #d1d5db)";
    nameInput.style.borderRadius = "6px";
    nameInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    nameInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    nameInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    nameInput.style.outline = "none";
    nameInput.style.fontSize = "14px";
    nameInput.value = isEdit ? ruleData.name || "" : document.title || t("m_2506cf6e63b0");
    nameLabel.appendChild(nameInput);
    container.appendChild(nameLabel);
    const faviconLabel = document.createElement("label");
    faviconLabel.textContent = t("m_21a69e0d4f18");
    faviconLabel.style.display = "flex";
    faviconLabel.style.flexDirection = "column";
    faviconLabel.style.gap = "6px";
    faviconLabel.style.fontSize = "13px";
    faviconLabel.style.fontWeight = "600";
    faviconLabel.style.color = "var(--text-color, #1f2937)";
    const faviconFieldWrapper = document.createElement("div");
    faviconFieldWrapper.style.display = "flex";
    faviconFieldWrapper.style.alignItems = "flex-start";
    faviconFieldWrapper.style.gap = "12px";
    const faviconPreviewHolder = document.createElement("div");
    faviconPreviewHolder.style.width = "40px";
    faviconPreviewHolder.style.height = "40px";
    faviconPreviewHolder.style.borderRadius = "10px";
    faviconPreviewHolder.style.display = "flex";
    faviconPreviewHolder.style.alignItems = "center";
    faviconPreviewHolder.style.justifyContent = "center";
    faviconPreviewHolder.style.backgroundColor = "transparent";
    faviconPreviewHolder.style.flexShrink = "0";
    const faviconControls = document.createElement("div");
    faviconControls.style.display = "flex";
    faviconControls.style.flexDirection = "column";
    faviconControls.style.gap = "8px";
    faviconControls.style.flex = "1";
    const faviconInput = document.createElement("textarea");
    faviconInput.rows = 1;
    faviconInput.style.flex = "1 1 auto";
    faviconInput.style.padding = "10px 12px";
    faviconInput.style.border = "1px solid var(--border-color, #d1d5db)";
    faviconInput.style.borderRadius = "6px";
    faviconInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    faviconInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    faviconInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    faviconInput.style.outline = "none";
    faviconInput.style.fontSize = "14px";
    faviconInput.style.lineHeight = "1.5";
    faviconInput.style.resize = "vertical";
    faviconInput.style.overflowY = "hidden";
    faviconInput.placeholder = t("m_c182fdbf9d82");
    faviconInput.value = presetFavicon || "";
    const resizeFaviconTextarea = () => autoResizeTextarea(faviconInput, { minRows: 1, maxRows: 4 });
    const faviconActionsRow = document.createElement("div");
    faviconActionsRow.style.display = "flex";
    faviconActionsRow.style.alignItems = "center";
    faviconActionsRow.style.gap = "8px";
    faviconActionsRow.style.flexWrap = "nowrap";
    faviconActionsRow.style.fontSize = "12px";
    faviconActionsRow.style.color = "var(--muted-text-color, #6b7280)";
    faviconActionsRow.style.justifyContent = "flex-start";
    const faviconHelp = document.createElement("span");
    faviconHelp.textContent = t("m_8aaf090a889e");
    faviconHelp.style.flex = "1";
    faviconHelp.style.minWidth = "0";
    faviconHelp.style.marginRight = "12px";
    const autoFaviconBtn = document.createElement("button");
    autoFaviconBtn.type = "button";
    autoFaviconBtn.setAttribute("aria-label", t("m_bb1fa21a1bc7"));
    autoFaviconBtn.title = t("m_bb1fa21a1bc7");
    autoFaviconBtn.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    autoFaviconBtn.style.border = "1px solid var(--border-color, #d1d5db)";
    autoFaviconBtn.style.borderRadius = "50%";
    autoFaviconBtn.style.width = "32px";
    autoFaviconBtn.style.height = "32px";
    autoFaviconBtn.style.display = "flex";
    autoFaviconBtn.style.alignItems = "center";
    autoFaviconBtn.style.justifyContent = "center";
    autoFaviconBtn.style.cursor = "pointer";
    autoFaviconBtn.style.boxShadow = "0 2px 6px rgba(59, 130, 246, 0.16)";
    autoFaviconBtn.style.flexShrink = "0";
    autoFaviconBtn.style.padding = "0";
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
      setTrustedHTML(faviconPreviewHolder, "");
      faviconPreviewHolder.appendChild(
        createFaviconElement(
          currentFavicon || generateDomainFavicon(domainInput.value.trim()),
          nameInput.value.trim() || domainInput.value.trim() || t("m_90e4e9bd1a78"),
          "⚡",
          { withBackground: false }
        )
      );
    };
    const getFallbackFavicon = () => generateDomainFavicon(domainInput.value.trim());
    autoFaviconBtn.addEventListener("click", () => {
      const autoUrl = getFallbackFavicon();
      faviconInput.value = autoUrl;
      faviconManuallyEdited = false;
      updateFaviconPreview();
      resizeFaviconTextarea();
    });
    domainInput.addEventListener("input", () => {
      if (!faviconManuallyEdited) {
        faviconInput.value = getFallbackFavicon();
      }
      updateFaviconPreview();
      resizeFaviconTextarea();
    });
    faviconInput.addEventListener("input", () => {
      faviconManuallyEdited = true;
      updateFaviconPreview();
      resizeFaviconTextarea();
    });
    nameInput.addEventListener("input", updateFaviconPreview);
    updateFaviconPreview();
    resizeFaviconTextarea();
    requestAnimationFrame(resizeFaviconTextarea);
    const methodConfigUI = createAutoSubmitMethodConfigUI(
      isEdit && ruleData.method ? ruleData.method : AUTO_SUBMIT_METHODS.ENTER,
      isEdit ? ruleData.methodAdvanced : null,
      methodExpanded
    );
    container.appendChild(methodConfigUI.container);
    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "space-between";
    buttonRow.style.alignItems = "center";
    buttonRow.style.gap = "12px";
    buttonRow.style.marginTop = "20px";
    buttonRow.style.paddingTop = "20px";
    buttonRow.style.borderTop = "1px solid var(--border-color, #e5e7eb)";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = t("m_4d0b4688c787");
    cancelBtn.style.backgroundColor = "var(--cancel-color,#6B7280)";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "4px";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.fontSize = "14px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", closeEditor);
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = t("m_b56d9ac6c5a0");
    confirmBtn.style.backgroundColor = "var(--success-color,#22c55e)";
    confirmBtn.style.color = "#fff";
    confirmBtn.style.border = "none";
    confirmBtn.style.borderRadius = "4px";
    confirmBtn.style.padding = "8px 16px";
    confirmBtn.style.fontSize = "14px";
    confirmBtn.style.cursor = "pointer";
    confirmBtn.addEventListener("click", () => {
      const sanitizedDomain = domainInput.value.trim();
      const sanitizedName = nameInput.value.trim();
      const methodConfig = methodConfigUI.getConfig();
      const methodAdvanced = methodConfig.advanced;
      const newData = {
        domain: sanitizedDomain,
        name: sanitizedName,
        method: methodConfig.method,
        favicon: faviconInput.value.trim() || generateDomainFavicon(sanitizedDomain)
      };
      if (!newData.domain || !newData.name) {
        alert(t("m_9278d9572dfc"));
        return;
      }
      if (methodConfig.method === AUTO_SUBMIT_METHODS.CLICK_SUBMIT && methodAdvanced && methodAdvanced.variant === "selector") {
        const trimmedSelector = methodAdvanced.selector ? methodAdvanced.selector.trim() : "";
        if (!trimmedSelector) {
          alert(t("m_56b200a4ed9c"));
          return;
        }
        try {
          document.querySelector(trimmedSelector);
        } catch (_) {
          alert(t("m_57894b44cac3"));
          return;
        }
        methodAdvanced.selector = trimmedSelector;
      }
      if (methodAdvanced) {
        newData.methodAdvanced = methodAdvanced;
      }
      if (typeof onSave === "function") {
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
        methodAdvanced: draftMethodConfig.advanced
      }, onSave, {
        methodExpanded: methodConfigUI.isExpanded()
      });
    });
  }

  // src/features/automation/settings-dialog.js
  var currentAutomationOverlay = null;
  var currentConfirmOverlay2 = null;
  function showAutomationSettingsDialog() {
    if (currentAutomationOverlay) {
      closeExistingOverlay(currentAutomationOverlay);
    }
    const { overlay, dialog } = createUnifiedDialog({
      title: "m_fa60c9c7db86",
      width: "750px",
      showTitle: false,
      onClose: () => {
        if (currentAutomationOverlay === overlay) {
          currentAutomationOverlay = null;
        }
      },
      closeOnOverlayClick: true,
      closeOnEscape: true,
      beforeClose: () => {
        persistButtonConfig();
        return true;
      }
    });
    currentAutomationOverlay = overlay;
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
      if (currentAutomationOverlay !== overlay) {
        return;
      }
      if (currentConfirmOverlay2) {
        closeExistingOverlay(currentConfirmOverlay2);
        currentConfirmOverlay2 = null;
      }
      showAutomationSettingsDialog();
    });
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.gap = "12px";
    header.style.flexWrap = "wrap";
    header.style.marginBottom = "10px";
    const titleEl = document.createElement("h2");
    titleEl.textContent = t("m_fa60c9c7db86");
    titleEl.style.margin = "0";
    titleEl.style.fontSize = "18px";
    titleEl.style.fontWeight = "600";
    titleEl.style.color = "var(--text-color, #333333)";
    titleEl.style.flex = "1 1 auto";
    titleEl.style.minWidth = "0";
    const closeAutomationBtn = createDialogCloseIconButton((event) => {
      void overlay.__cttfRequestClose("button", event);
    });
    closeAutomationBtn.id = "closeAutomationBtn";
    const headerActions = document.createElement("div");
    headerActions.style.display = "flex";
    headerActions.style.alignItems = "center";
    headerActions.style.gap = "10px";
    headerActions.style.marginLeft = "auto";
    headerActions.style.flex = "0 0 auto";
    headerActions.appendChild(closeAutomationBtn);
    header.appendChild(titleEl);
    header.appendChild(headerActions);
    dialog.appendChild(header);
    const listContainer = document.createElement("div");
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
    `;
    const listHeader = document.createElement("div");
    listHeader.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;
    const headerColumns = [
      { label: t("m_1f24c1e5aafa"), flex: "0 0 32px", justify: "center" },
      { label: t("m_f412fe65e355"), flex: "1 1 0%", justify: "flex-start", paddingLeft: "8px" },
      { label: t("m_b90e30398d2f"), flex: "0 0 120px", justify: "center" },
      { label: t("m_c9c77517fe85"), flex: "0 0 40px", justify: "center" },
      { label: t("m_3755f56f2f83"), flex: "0 0 40px", justify: "center" }
    ];
    headerColumns.forEach(({ label, flex, justify, paddingLeft }) => {
      const column = document.createElement("div");
      column.textContent = label;
      column.style.display = "flex";
      column.style.alignItems = "center";
      column.style.justifyContent = justify;
      column.style.flex = flex;
      column.style.fontSize = "12px";
      column.style.fontWeight = "600";
      if (paddingLeft) {
        column.style.paddingLeft = paddingLeft;
      }
      listHeader.appendChild(column);
    });
    const listBody = document.createElement("div");
    listBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    listBody.classList.add("hide-scrollbar");
    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);
    const showAutomationRuleDeleteConfirmDialog = (rule, onConfirm) => {
      if (!rule) {
        if (typeof onConfirm === "function") {
          onConfirm();
        }
        return;
      }
      if (currentConfirmOverlay2) {
        closeExistingOverlay(currentConfirmOverlay2);
      }
      let confirmOverlayRef = null;
      const { overlay: confirmOverlay, dialog: confirmDialog } = createUnifiedDialog({
        title: null,
        showTitle: false,
        width: "420px",
        maxWidth: "90vw",
        padding: "24px",
        zIndex: "13000",
        closeOnOverlayClick: false,
        overlayClassName: "confirm-overlay",
        dialogClassName: "confirm-dialog",
        onClose: () => {
          if (currentConfirmOverlay2 === confirmOverlayRef) {
            currentConfirmOverlay2 = null;
          }
        }
      });
      confirmOverlayRef = confirmOverlay;
      const ruleName = rule.name || rule.domain || t("m_34ead5ec21ba");
      const ruleDomain = rule.domain || t("m_26b0c4d3cf64");
      const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
      const deleteAutomationTitle = t("m_37c14d8c2265", { ruleName });
      const irreversibleNoticeAutomation = t("m_017b3765c0b7");
      setTrustedHTML(confirmDialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteAutomationTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNoticeAutomation}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 12px; border-radius:6px; background-color: var(--button-bg, #f3f4f6);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${ruleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${ruleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280);">${ruleDomain}</span>
                    </div>
                </div>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t("m_bb0ecaa69368")}<span class="cttf-automation-method-container"></span>
                </p>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t("m_4d0b4688c787")}</button>
                <button id="confirmAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t("m_3755f56f2f83")}</button>
            </div>
        `);
      const methodPlaceholder = confirmDialog.querySelector(".cttf-automation-method-container");
      if (methodPlaceholder) {
        const methodDisplay = createMethodDisplay(rule.method, rule.methodAdvanced);
        methodDisplay.style.justifyContent = "flex-start";
        methodPlaceholder.replaceWith(methodDisplay);
      }
      currentConfirmOverlay2 = confirmOverlay;
      confirmDialog.querySelector("#cancelAutomationRuleDelete")?.addEventListener("click", () => {
        closeExistingOverlay(confirmOverlay);
      });
      confirmDialog.querySelector("#confirmAutomationRuleDelete")?.addEventListener("click", () => {
        if (typeof onConfirm === "function") {
          onConfirm();
        }
        closeExistingOverlay(confirmOverlay);
      });
    };
    function renderDomainRules() {
      setTrustedHTML(listBody, "");
      const rules = buttonConfig.domainAutoSubmitSettings;
      let metadataPatched = false;
      if (!rules.length) {
        const emptyState = document.createElement("div");
        emptyState.textContent = t("m_7e0dafd33317");
        emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
        listBody.appendChild(emptyState);
        return;
      }
      rules.forEach((rule, idx) => {
        const item = document.createElement("div");
        item.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
        item.addEventListener("mouseenter", () => {
          item.style.borderColor = "var(--primary-color, #3B82F6)";
          item.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)";
        });
        item.addEventListener("mouseleave", () => {
          item.style.borderColor = "var(--border-color, #e5e7eb)";
          item.style.boxShadow = "none";
        });
        const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
        if (!rule.favicon && rule.domain) {
          rule.favicon = faviconUrl;
          metadataPatched = true;
        }
        const faviconBadge = createFaviconElement(
          faviconUrl,
          rule.name || rule.domain,
          "🌐",
          { withBackground: false, size: 26 }
        );
        faviconBadge.title = rule.domain || "";
        const iconColumn = document.createElement("div");
        iconColumn.style.display = "flex";
        iconColumn.style.alignItems = "center";
        iconColumn.style.justifyContent = "center";
        iconColumn.style.flex = "0 0 30px";
        iconColumn.appendChild(faviconBadge);
        const infoColumn = document.createElement("div");
        infoColumn.style.display = "flex";
        infoColumn.style.flexDirection = "column";
        infoColumn.style.gap = "4px";
        infoColumn.style.minWidth = "0";
        infoColumn.style.flex = "1 1 0%";
        const nameEl = document.createElement("span");
        nameEl.textContent = rule.name || rule.domain || t("m_34ead5ec21ba");
        nameEl.style.fontWeight = "600";
        nameEl.style.fontSize = "14px";
        nameEl.style.color = "var(--text-color, #1f2937)";
        const domainEl = document.createElement("span");
        domainEl.textContent = rule.domain || "";
        domainEl.style.fontSize = "12px";
        domainEl.style.color = "var(--muted-text-color, #6b7280)";
        domainEl.style.whiteSpace = "nowrap";
        domainEl.style.overflow = "hidden";
        domainEl.style.textOverflow = "ellipsis";
        domainEl.style.maxWidth = "260px";
        domainEl.title = rule.domain || "";
        infoColumn.appendChild(nameEl);
        infoColumn.appendChild(domainEl);
        const methodDisplay = createMethodDisplay(rule.method || "-", rule.methodAdvanced);
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
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
                transition: background-color 0.2s ease;
            `;
        editBtn.addEventListener("mouseenter", () => {
          editBtn.style.backgroundColor = "rgba(59,130,246,0.12)";
        });
        editBtn.addEventListener("mouseleave", () => {
          editBtn.style.backgroundColor = "transparent";
        });
        editBtn.addEventListener("click", () => {
          const ruleToEdit = buttonConfig.domainAutoSubmitSettings[idx];
          showAutomationRuleEditorDialog(ruleToEdit, (newData) => {
            buttonConfig.domainAutoSubmitSettings[idx] = newData;
            persistButtonConfig();
            renderDomainRules();
          });
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
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
                transition: background-color 0.2s ease;
            `;
        deleteBtn.addEventListener("mouseenter", () => {
          deleteBtn.style.backgroundColor = "rgba(239,68,68,0.12)";
        });
        deleteBtn.addEventListener("mouseleave", () => {
          deleteBtn.style.backgroundColor = "transparent";
        });
        deleteBtn.addEventListener("click", () => {
          const ruleToDelete = buttonConfig.domainAutoSubmitSettings[idx];
          showAutomationRuleDeleteConfirmDialog(ruleToDelete, () => {
            buttonConfig.domainAutoSubmitSettings.splice(idx, 1);
            persistButtonConfig();
            renderDomainRules();
          });
        });
        const methodColumn = document.createElement("div");
        methodColumn.style.display = "flex";
        methodColumn.style.alignItems = "center";
        methodColumn.style.justifyContent = "center";
        methodColumn.style.flex = "0 0 120px";
        methodColumn.appendChild(methodDisplay);
        const editColumn = document.createElement("div");
        editColumn.style.display = "flex";
        editColumn.style.alignItems = "center";
        editColumn.style.justifyContent = "center";
        editColumn.style.flex = "0 0 40px";
        editColumn.appendChild(editBtn);
        const deleteColumn = document.createElement("div");
        deleteColumn.style.display = "flex";
        deleteColumn.style.alignItems = "center";
        deleteColumn.style.justifyContent = "center";
        deleteColumn.style.flex = "0 0 40px";
        deleteColumn.appendChild(deleteBtn);
        item.appendChild(iconColumn);
        item.appendChild(infoColumn);
        item.appendChild(methodColumn);
        item.appendChild(editColumn);
        item.appendChild(deleteColumn);
        listBody.appendChild(item);
      });
      if (metadataPatched) {
        persistButtonConfig();
      }
    }
    renderDomainRules();
    const addDiv = document.createElement("div");
    addDiv.style.marginTop = "12px";
    addDiv.style.textAlign = "left";
    const addBtn = document.createElement("button");
    addBtn.textContent = t("m_d1dd773736d1");
    addBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    addBtn.addEventListener("click", () => {
      showAutomationRuleEditorDialog({}, (newData) => {
        buttonConfig.domainAutoSubmitSettings.push(newData);
        persistButtonConfig();
        renderDomainRules();
      });
    });
    addDiv.appendChild(addBtn);
    dialog.appendChild(addDiv);
  }

  // src/features/domain-style/style-editor-dialog.js
  var currentAddDomainOverlay = null;
  var cloneDraftRule = (rule) => {
    return cloneSerializable(rule || {}, {
      fallback: { ...rule || {} },
      logLabel: "[Chat] Template Text Folders style draft clone failed:"
    });
  };
  var createDefaultDraftRule = () => ({
    name: document.title || t("style.untitled.custom"),
    source: STYLE_RULE_SOURCE.CUSTOM,
    enabled: true,
    matchers: [
      {
        type: STYLE_MATCHER_TYPE.DOMAIN,
        value: window.location.hostname || ""
      }
    ],
    layout: {},
    cssCode: "",
    favicon: generateDomainFavicon(window.location.hostname || "")
  });
  var getMatcherPlaceholder = (type) => {
    if (type === STYLE_MATCHER_TYPE.URL_PREFIX) {
      return "https://example.com/path";
    }
    if (type === STYLE_MATCHER_TYPE.URL) {
      return "https://example.com/exact/path";
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
      return "https://www\\.example\\.com/(chat|ai).*";
    }
    return "example.com";
  };
  var createDraftName = (name, matchers) => {
    const normalizedName = typeof name === "string" ? name.trim() : "";
    if (normalizedName) {
      return normalizedName;
    }
    return summarizeMatchers(matchers, {
      maxItems: 1,
      emptyLabel: t("style.untitled.custom")
    });
  };
  function showEditDomainStyleDialog(index, options = {}) {
    const {
      activeTab: initialActiveTab = "basic",
      draft = null,
      onSaved
    } = options;
    if (currentAddDomainOverlay) {
      closeExistingOverlay(currentAddDomainOverlay);
    }
    const isEdit = typeof index === "number";
    const styleItem = draft ? cloneDraftRule(draft) : isEdit ? cloneDraftRule(buttonConfig.customStyleRules[index]) : createDefaultDraftRule();
    if (!Array.isArray(styleItem.matchers) || !styleItem.matchers.length) {
      styleItem.matchers = createDefaultDraftRule().matchers;
    }
    if (!styleItem.layout || typeof styleItem.layout !== "object") {
      styleItem.layout = {};
    }
    if (!styleItem.favicon) {
      styleItem.favicon = generateDomainFavicon(getPrimaryHostFromMatchers(styleItem.matchers) || window.location.hostname || "");
    }
    const { overlay, dialog } = createUnifiedDialog({
      title: isEdit ? "m_16e818a7d72f" : "m_76b7232d9d1f",
      width: "560px",
      onClose: () => {
        if (currentAddDomainOverlay === overlay) {
          currentAddDomainOverlay = null;
        }
      },
      closeOnOverlayClick: false
    });
    currentAddDomainOverlay = overlay;
    const closeDialog = () => {
      closeExistingOverlay(overlay);
      currentAddDomainOverlay = null;
    };
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "16px";
    container.style.marginBottom = "16px";
    container.style.padding = "16px";
    container.style.borderRadius = "6px";
    container.style.border = "1px solid var(--border-color, #e5e7eb)";
    container.style.backgroundColor = "var(--button-bg, #f3f4f6)";
    const tabsHeader = document.createElement("div");
    tabsHeader.style.display = "flex";
    tabsHeader.style.gap = "8px";
    tabsHeader.style.flexWrap = "wrap";
    const tabConfig = [
      { id: "basic", label: t("m_41654e026827") },
      { id: "layout", label: t("m_ee3f7b61d3f1") },
      { id: "css", label: t("m_e2574efd99b1") }
    ];
    const tabButtons = [];
    const tabPanels = /* @__PURE__ */ new Map();
    const tabsBody = document.createElement("div");
    tabsBody.style.position = "relative";
    const setActiveTab = (targetId) => {
      tabButtons.forEach((button) => {
        const isActive = button.dataset.tabId === targetId;
        button.style.backgroundColor = isActive ? "var(--dialog-bg, #ffffff)" : "transparent";
        button.style.color = isActive ? "var(--text-color, #1f2937)" : "var(--muted-text-color, #6b7280)";
        button.style.fontWeight = isActive ? "600" : "500";
        button.style.boxShadow = isActive ? "0 2px 6px rgba(15, 23, 42, 0.08)" : "none";
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      tabPanels.forEach((panel, panelId) => {
        panel.style.display = panelId === targetId ? "flex" : "none";
      });
    };
    tabConfig.forEach(({ id, label }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.tabId = id;
      button.textContent = label;
      button.style.padding = "8px 14px";
      button.style.borderRadius = "20px";
      button.style.border = "1px solid var(--border-color, #d1d5db)";
      button.style.backgroundColor = "transparent";
      button.style.color = "var(--muted-text-color, #6b7280)";
      button.style.cursor = "pointer";
      button.style.fontSize = "13px";
      button.style.fontWeight = "500";
      button.addEventListener("click", () => setActiveTab(id));
      tabButtons.push(button);
      tabsHeader.appendChild(button);
      const panel = document.createElement("div");
      panel.dataset.tabId = id;
      panel.style.display = "none";
      panel.style.flexDirection = "column";
      panel.style.gap = "12px";
      tabPanels.set(id, panel);
      tabsBody.appendChild(panel);
    });
    setActiveTab(initialActiveTab);
    container.appendChild(tabsHeader);
    container.appendChild(tabsBody);
    const nameLabel = document.createElement("label");
    nameLabel.textContent = t("m_3ac80afa5a53");
    nameLabel.style.display = "flex";
    nameLabel.style.flexDirection = "column";
    nameLabel.style.gap = "6px";
    nameLabel.style.fontSize = "13px";
    nameLabel.style.fontWeight = "600";
    nameLabel.style.color = "var(--text-color, #1f2937)";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = styleItem.name || "";
    nameInput.style.width = "100%";
    nameInput.style.height = "40px";
    nameInput.style.padding = "0 12px";
    nameInput.style.border = "1px solid var(--border-color, #d1d5db)";
    nameInput.style.borderRadius = "6px";
    nameInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    nameInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    nameInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    nameInput.style.outline = "none";
    nameInput.style.fontSize = "14px";
    nameLabel.appendChild(nameInput);
    tabPanels.get("basic")?.appendChild(nameLabel);
    const matcherSection = document.createElement("div");
    matcherSection.style.display = "flex";
    matcherSection.style.flexDirection = "column";
    matcherSection.style.gap = "8px";
    const matcherTitle = document.createElement("label");
    matcherTitle.textContent = t("style.editor.matchers");
    matcherTitle.style.fontSize = "13px";
    matcherTitle.style.fontWeight = "600";
    matcherTitle.style.color = "var(--text-color, #1f2937)";
    matcherSection.appendChild(matcherTitle);
    const matcherRows = document.createElement("div");
    matcherRows.style.display = "flex";
    matcherRows.style.flexDirection = "column";
    matcherRows.style.gap = "8px";
    matcherSection.appendChild(matcherRows);
    const matcherRowRecords = [];
    const readCurrentMatchers = (options2 = {}) => matcherRowRecords.map((record) => ({
      type: record.typeSelect.value,
      value: record.valueInput.value.trim()
    })).map((matcher) => {
      try {
        return normalizeStyleMatcher(matcher);
      } catch (error) {
        if (options2.throwOnError) {
          throw error;
        }
        return null;
      }
    }).filter(Boolean);
    const getFallbackFaviconUrl = () => {
      const primaryHost = getPrimaryHostFromMatchers(readCurrentMatchers()) || window.location.hostname || "";
      return primaryHost ? generateDomainFavicon(primaryHost) : "";
    };
    const faviconLabel = document.createElement("label");
    faviconLabel.textContent = t("m_21a69e0d4f18");
    faviconLabel.style.display = "flex";
    faviconLabel.style.flexDirection = "column";
    faviconLabel.style.gap = "6px";
    faviconLabel.style.fontSize = "13px";
    faviconLabel.style.fontWeight = "600";
    faviconLabel.style.color = "var(--text-color, #1f2937)";
    const faviconFieldWrapper = document.createElement("div");
    faviconFieldWrapper.style.display = "flex";
    faviconFieldWrapper.style.alignItems = "flex-start";
    faviconFieldWrapper.style.gap = "12px";
    const faviconPreviewHolder = document.createElement("div");
    faviconPreviewHolder.style.width = "40px";
    faviconPreviewHolder.style.height = "40px";
    faviconPreviewHolder.style.borderRadius = "10px";
    faviconPreviewHolder.style.display = "flex";
    faviconPreviewHolder.style.alignItems = "center";
    faviconPreviewHolder.style.justifyContent = "center";
    faviconPreviewHolder.style.backgroundColor = "transparent";
    faviconPreviewHolder.style.flexShrink = "0";
    const faviconControls = document.createElement("div");
    faviconControls.style.display = "flex";
    faviconControls.style.flexDirection = "column";
    faviconControls.style.gap = "8px";
    faviconControls.style.flex = "1";
    const faviconInput = document.createElement("textarea");
    faviconInput.rows = 1;
    faviconInput.style.flex = "1 1 auto";
    faviconInput.style.padding = "10px 12px";
    faviconInput.style.border = "1px solid var(--border-color, #d1d5db)";
    faviconInput.style.borderRadius = "6px";
    faviconInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    faviconInput.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    faviconInput.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    faviconInput.style.outline = "none";
    faviconInput.style.fontSize = "14px";
    faviconInput.style.lineHeight = "1.5";
    faviconInput.style.resize = "vertical";
    faviconInput.style.overflowY = "hidden";
    faviconInput.placeholder = t("m_5ad8a58367cf");
    faviconInput.value = styleItem.favicon || "";
    const resizeFaviconTextarea = () => autoResizeTextarea(faviconInput, { minRows: 1, maxRows: 4 });
    const faviconActionsRow = document.createElement("div");
    faviconActionsRow.style.display = "flex";
    faviconActionsRow.style.alignItems = "center";
    faviconActionsRow.style.gap = "8px";
    faviconActionsRow.style.flexWrap = "nowrap";
    faviconActionsRow.style.fontSize = "12px";
    faviconActionsRow.style.color = "var(--muted-text-color, #6b7280)";
    faviconActionsRow.style.justifyContent = "flex-start";
    const faviconHelp = document.createElement("span");
    faviconHelp.textContent = t("m_da47691c6642");
    faviconHelp.style.flex = "1";
    faviconHelp.style.minWidth = "0";
    faviconHelp.style.marginRight = "12px";
    const autoFaviconBtn = document.createElement("button");
    autoFaviconBtn.type = "button";
    autoFaviconBtn.setAttribute("aria-label", t("m_bb1fa21a1bc7"));
    autoFaviconBtn.title = t("m_bb1fa21a1bc7");
    autoFaviconBtn.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    autoFaviconBtn.style.color = "#fff";
    autoFaviconBtn.style.border = "1px solid var(--border-color, #d1d5db)";
    autoFaviconBtn.style.borderRadius = "50%";
    autoFaviconBtn.style.width = "32px";
    autoFaviconBtn.style.height = "32px";
    autoFaviconBtn.style.display = "flex";
    autoFaviconBtn.style.alignItems = "center";
    autoFaviconBtn.style.justifyContent = "center";
    autoFaviconBtn.style.cursor = "pointer";
    autoFaviconBtn.style.boxShadow = "0 2px 6px rgba(59, 130, 246, 0.16)";
    autoFaviconBtn.style.flexShrink = "0";
    autoFaviconBtn.style.padding = "0";
    autoFaviconBtn.appendChild(createAutoFaviconIcon());
    faviconActionsRow.appendChild(faviconHelp);
    faviconActionsRow.appendChild(autoFaviconBtn);
    faviconControls.appendChild(faviconInput);
    faviconControls.appendChild(faviconActionsRow);
    faviconFieldWrapper.appendChild(faviconPreviewHolder);
    faviconFieldWrapper.appendChild(faviconControls);
    faviconLabel.appendChild(faviconFieldWrapper);
    tabPanels.get("basic")?.appendChild(matcherSection);
    tabPanels.get("basic")?.appendChild(faviconLabel);
    let faviconManuallyEdited = Boolean((styleItem.favicon || "").trim());
    const updateStyleFaviconPreview = () => {
      const previewUrl = faviconInput.value.trim() || getFallbackFaviconUrl();
      faviconPreviewHolder.replaceChildren(
        createFaviconElement(
          previewUrl,
          nameInput.value.trim() || t("style.untitled.custom"),
          "🎨",
          { withBackground: false }
        )
      );
    };
    const maybeRefreshAutoFavicon = () => {
      if (!faviconManuallyEdited) {
        faviconInput.value = getFallbackFaviconUrl();
        resizeFaviconTextarea();
      }
      updateStyleFaviconPreview();
    };
    const addMatcherRow = (initialMatcher = { type: STYLE_MATCHER_TYPE.DOMAIN, value: "" }) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "140px minmax(0, 1fr) auto";
      row.style.gap = "8px";
      row.style.alignItems = "center";
      const typeSelect = document.createElement("select");
      typeSelect.style.height = "40px";
      typeSelect.style.padding = "0 10px";
      typeSelect.style.border = "1px solid var(--border-color, #d1d5db)";
      typeSelect.style.borderRadius = "6px";
      typeSelect.style.backgroundColor = "var(--dialog-bg, #ffffff)";
      typeSelect.style.color = "var(--text-color, #1f2937)";
      typeSelect.style.fontSize = "14px";
      [
        { value: STYLE_MATCHER_TYPE.DOMAIN, label: t("style.editor.type.domain") },
        { value: STYLE_MATCHER_TYPE.URL_PREFIX, label: t("style.editor.type.url_prefix") },
        { value: STYLE_MATCHER_TYPE.URL, label: t("style.editor.type.url") },
        { value: STYLE_MATCHER_TYPE.REGEXP, label: t("style.editor.type.regexp") }
      ].forEach((optionConfig) => {
        const option = document.createElement("option");
        option.value = optionConfig.value;
        option.textContent = optionConfig.label;
        if (optionConfig.value === initialMatcher.type) {
          option.selected = true;
        }
        typeSelect.appendChild(option);
      });
      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.value = initialMatcher.value || "";
      valueInput.placeholder = getMatcherPlaceholder(initialMatcher.type || STYLE_MATCHER_TYPE.DOMAIN);
      valueInput.style.height = "40px";
      valueInput.style.padding = "0 12px";
      valueInput.style.border = "1px solid var(--border-color, #d1d5db)";
      valueInput.style.borderRadius = "6px";
      valueInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
      valueInput.style.color = "var(--text-color, #1f2937)";
      valueInput.style.fontSize = "14px";
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "✕";
      removeBtn.title = t("style.editor.remove_matcher");
      removeBtn.style.width = "36px";
      removeBtn.style.height = "36px";
      removeBtn.style.border = "none";
      removeBtn.style.borderRadius = "50%";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.backgroundColor = "rgba(239,68,68,0.12)";
      removeBtn.style.color = "var(--danger-color, #ef4444)";
      const record = { row, typeSelect, valueInput, removeBtn };
      matcherRowRecords.push(record);
      typeSelect.addEventListener("change", () => {
        valueInput.placeholder = getMatcherPlaceholder(typeSelect.value);
        maybeRefreshAutoFavicon();
      });
      valueInput.addEventListener("input", maybeRefreshAutoFavicon);
      removeBtn.addEventListener("click", () => {
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
    const addMatcherBtn = document.createElement("button");
    addMatcherBtn.type = "button";
    addMatcherBtn.textContent = t("style.editor.add_matcher");
    addMatcherBtn.style.alignSelf = "flex-start";
    addMatcherBtn.style.border = "none";
    addMatcherBtn.style.borderRadius = "6px";
    addMatcherBtn.style.padding = "8px 12px";
    addMatcherBtn.style.cursor = "pointer";
    addMatcherBtn.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    addMatcherBtn.style.color = "var(--primary-color, #3B82F6)";
    addMatcherBtn.addEventListener("click", () => {
      addMatcherRow({
        type: STYLE_MATCHER_TYPE.DOMAIN,
        value: ""
      });
    });
    matcherSection.appendChild(addMatcherBtn);
    autoFaviconBtn.addEventListener("click", () => {
      faviconInput.value = getFallbackFaviconUrl();
      faviconManuallyEdited = false;
      resizeFaviconTextarea();
      updateStyleFaviconPreview();
    });
    faviconInput.addEventListener("input", () => {
      faviconManuallyEdited = true;
      resizeFaviconTextarea();
      updateStyleFaviconPreview();
    });
    nameInput.addEventListener("input", updateStyleFaviconPreview);
    const heightLabel = document.createElement("label");
    heightLabel.textContent = t("style.editor.height_optional");
    heightLabel.style.display = "flex";
    heightLabel.style.flexDirection = "column";
    heightLabel.style.gap = "6px";
    heightLabel.style.fontSize = "13px";
    heightLabel.style.fontWeight = "600";
    heightLabel.style.color = "var(--text-color, #1f2937)";
    const heightInput = document.createElement("input");
    heightInput.type = "number";
    heightInput.min = "20";
    heightInput.max = "200";
    heightInput.step = "1";
    heightInput.placeholder = t("style.layout.inherit");
    heightInput.value = styleItem.layout?.height ?? "";
    heightInput.style.width = "100%";
    heightInput.style.height = "40px";
    heightInput.style.padding = "0 12px";
    heightInput.style.border = "1px solid var(--border-color, #d1d5db)";
    heightInput.style.borderRadius = "6px";
    heightInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    heightInput.style.fontSize = "14px";
    heightLabel.appendChild(heightInput);
    tabPanels.get("layout")?.appendChild(heightLabel);
    const bottomSpacingLabel = document.createElement("label");
    bottomSpacingLabel.textContent = t("style.editor.bottom_spacing_optional");
    bottomSpacingLabel.style.display = "flex";
    bottomSpacingLabel.style.flexDirection = "column";
    bottomSpacingLabel.style.gap = "6px";
    bottomSpacingLabel.style.fontSize = "13px";
    bottomSpacingLabel.style.fontWeight = "600";
    bottomSpacingLabel.style.color = "var(--text-color, #1f2937)";
    const bottomSpacingInput = document.createElement("input");
    bottomSpacingInput.type = "number";
    bottomSpacingInput.min = "-200";
    bottomSpacingInput.max = "200";
    bottomSpacingInput.step = "1";
    bottomSpacingInput.placeholder = t("style.layout.inherit");
    bottomSpacingInput.value = styleItem.layout?.bottomSpacing ?? "";
    bottomSpacingInput.style.width = "100%";
    bottomSpacingInput.style.height = "40px";
    bottomSpacingInput.style.padding = "0 12px";
    bottomSpacingInput.style.border = "1px solid var(--border-color, #d1d5db)";
    bottomSpacingInput.style.borderRadius = "6px";
    bottomSpacingInput.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    bottomSpacingInput.style.fontSize = "14px";
    bottomSpacingLabel.appendChild(bottomSpacingInput);
    tabPanels.get("layout")?.appendChild(bottomSpacingLabel);
    const cssLabel = document.createElement("label");
    cssLabel.textContent = t("m_532ce5bbfa6a");
    cssLabel.style.display = "flex";
    cssLabel.style.flexDirection = "column";
    cssLabel.style.gap = "6px";
    cssLabel.style.fontSize = "13px";
    cssLabel.style.fontWeight = "600";
    cssLabel.style.color = "var(--text-color, #1f2937)";
    const cssTextarea = document.createElement("textarea");
    cssTextarea.value = styleItem.cssCode || "";
    cssTextarea.style.width = "100%";
    cssTextarea.style.minHeight = "160px";
    cssTextarea.style.padding = "12px";
    cssTextarea.style.border = "1px solid var(--border-color, #d1d5db)";
    cssTextarea.style.borderRadius = "6px";
    cssTextarea.style.backgroundColor = "var(--dialog-bg, #ffffff)";
    cssTextarea.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    cssTextarea.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
    cssTextarea.style.outline = "none";
    cssTextarea.style.resize = "vertical";
    cssTextarea.style.fontSize = "13px";
    cssTextarea.style.lineHeight = "1.5";
    cssLabel.appendChild(cssTextarea);
    tabPanels.get("css")?.appendChild(cssLabel);
    dialog.appendChild(container);
    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.style.alignItems = "center";
    footer.style.gap = "12px";
    footer.style.marginTop = "20px";
    footer.style.paddingTop = "20px";
    footer.style.borderTop = "1px solid var(--border-color, #e5e7eb)";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = t("m_4d0b4688c787");
    cancelBtn.style.backgroundColor = "var(--cancel-color, #6B7280)";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "4px";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.fontSize = "14px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.addEventListener("click", closeDialog);
    footer.appendChild(cancelBtn);
    const createCurrentDraft = () => ({
      id: styleItem.id,
      name: nameInput.value.trim(),
      source: STYLE_RULE_SOURCE.CUSTOM,
      enabled: styleItem.enabled !== false,
      matchers: matcherRowRecords.map((record) => ({
        type: record.typeSelect.value,
        value: record.valueInput.value.trim()
      })),
      layout: {
        height: heightInput.value,
        bottomSpacing: bottomSpacingInput.value
      },
      cssCode: cssTextarea.value,
      favicon: faviconInput.value.trim()
    });
    const saveBtn = document.createElement("button");
    saveBtn.textContent = isEdit ? t("m_fadf24dbc5a9") : t("m_fcbd0932929e");
    saveBtn.style.backgroundColor = "var(--success-color,#22c55e)";
    saveBtn.style.color = "#fff";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "4px";
    saveBtn.style.padding = "8px 16px";
    saveBtn.style.fontSize = "14px";
    saveBtn.style.cursor = "pointer";
    saveBtn.addEventListener("click", () => {
      try {
        const currentDraft = createCurrentDraft();
        const normalizedMatchers = readCurrentMatchers({ throwOnError: true });
        if (!normalizedMatchers.length) {
          alert(t("style.editor.no_matcher"));
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
            bottomSpacing: clampBottomSpacing(currentDraft.layout.bottomSpacing)
          },
          favicon: currentDraft.favicon || generateDomainFavicon(getPrimaryHostFromMatchers(normalizedMatchers) || "")
        }, {
          fallbackSource: STYLE_RULE_SOURCE.CUSTOM
        });
        if (!normalizedRule) {
          alert(t("style.editor.no_matcher"));
          return;
        }
        if (isEdit) {
          buttonConfig.customStyleRules[index] = normalizedRule;
        } else {
          buttonConfig.customStyleRules.push(normalizedRule);
        }
        persistButtonConfig();
        try {
          applyDomainStyles();
        } catch (_) {
        }
        closeDialog();
        if (typeof onSaved === "function") {
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
      const activeTabId = tabButtons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.tabId || "basic";
      showEditDomainStyleDialog(isEdit ? index : void 0, {
        onSaved,
        activeTab: activeTabId,
        draft: createCurrentDraft()
      });
    });
  }

  // src/features/domain-style/style-settings-dialog.js
  var currentStyleOverlay = null;
  var currentSiteRulesOverlay = null;
  var currentSiteRulesState = null;
  var applyCurrentStyleConfig = () => {
    persistButtonConfig();
    try {
      applyDomainStyles();
    } catch (_) {
    }
  };
  var getErrorMessage = (error) => {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  };
  var formatTimestamp = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return t("style.info.bundled_snapshot");
    }
    try {
      return new Date(numeric).toLocaleString();
    } catch {
      return t("style.info.bundled_snapshot");
    }
  };
  var formatSourceLabel = (value) => {
    const text = String(value || "").trim();
    if (!text) {
      return "-";
    }
    try {
      return new URL(text).hostname || text;
    } catch {
      return text;
    }
  };
  var buildExportFileName = () => {
    const date = /* @__PURE__ */ new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `[Chat] Template Text Folders Styles ${yyyy}-${mm}-${dd} ${hh}-${minutes}-${ss}.user.css`;
  };
  var createBadge = (label, options = {}) => {
    const badge = document.createElement("span");
    badge.textContent = label;
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.style.padding = options.padding || "4px 10px";
    badge.style.borderRadius = options.borderRadius || "999px";
    badge.style.fontSize = options.fontSize || "12px";
    badge.style.fontWeight = options.fontWeight || "600";
    badge.style.lineHeight = options.lineHeight || "1.2";
    badge.style.whiteSpace = "nowrap";
    badge.style.backgroundColor = options.background || "rgba(59,130,246,0.12)";
    badge.style.color = options.color || "var(--primary-color, #3B82F6)";
    badge.style.border = options.border || "1px solid rgba(59,130,246,0.18)";
    return badge;
  };
  var normalizeSiteHost = (value) => String(value || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  var createSiteGroupKey = (host) => {
    const normalizedHost = normalizeSiteHost(host);
    if (!normalizedHost) {
      return "";
    }
    const parts = normalizedHost.split(".").filter(Boolean);
    if (parts.length <= 2) {
      return normalizedHost;
    }
    return parts.slice(-2).join(".");
  };
  var extractHostFromRegexpMatcher = (value) => {
    const normalized = String(value || "").replace(/\\\./g, ".").replace(/\\\//g, "/");
    const urlMatch = normalized.match(/https?:\/\/([^/)\]\s]+)/i);
    if (urlMatch?.[1]) {
      return urlMatch[1];
    }
    const hostMatch = normalized.match(/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    return hostMatch?.[1] || "";
  };
  var formatSiteLabelFromHost = (host) => {
    const normalizedHost = createSiteGroupKey(host);
    if (!normalizedHost) {
      return "";
    }
    const baseName = normalizedHost.split(".")[0] || normalizedHost;
    return baseName.split(/[-_]+/).filter(Boolean).map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" ");
  };
  var extractSiteLabelFromRuleName = (name) => {
    const text = String(name || "").trim();
    if (!text) {
      return "";
    }
    const [prefix] = text.split(/\s+-\s+/, 1);
    return prefix ? prefix.trim() : "";
  };
  var escapeRegExp = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var stripSiteLabelPrefixFromRuleName = (name, siteLabel) => {
    const text = String(name || "").trim();
    const normalizedSiteLabel = String(siteLabel || "").trim();
    if (!text || !normalizedSiteLabel) {
      return text;
    }
    const prefixPattern = new RegExp(`^${escapeRegExp(normalizedSiteLabel)}\\s*[-–—:]\\s*`, "i");
    const strippedText = text.replace(prefixPattern, "").trim();
    return strippedText || text;
  };
  var resolveRuleSiteInfo = (rule) => {
    const matchers = Array.isArray(rule?.matchers) ? rule.matchers : [];
    const directHost = getPrimaryHostFromMatchers(matchers);
    const regexpHost = directHost || matchers.filter((matcher) => matcher?.type === "regexp").map((matcher) => extractHostFromRegexpMatcher(matcher?.value)).find(Boolean) || "";
    const siteHost = createSiteGroupKey(regexpHost);
    const siteLabel = extractSiteLabelFromRuleName(rule?.name) || formatSiteLabelFromHost(siteHost || regexpHost) || t("style.grouped.other_site");
    const displayHost = normalizeSiteHost(directHost || regexpHost || siteHost);
    const faviconHost = displayHost || siteHost;
    return {
      key: siteHost || `other:${siteLabel.toLowerCase()}`,
      host: displayHost,
      label: siteLabel,
      favicon: rule?.favicon || (faviconHost ? generateDomainFavicon(faviconHost) : "")
    };
  };
  var getMatcherTypeLabel = (type) => {
    if (type === STYLE_MATCHER_TYPE.DOMAIN) {
      return t("style.editor.type.domain");
    }
    if (type === STYLE_MATCHER_TYPE.URL_PREFIX) {
      return t("style.editor.type.url_prefix");
    }
    if (type === STYLE_MATCHER_TYPE.URL) {
      return t("style.editor.type.url");
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
      return t("style.editor.type.regexp");
    }
    return t("style.editor.matchers");
  };
  var shouldUseUrlSectionLabel = (matchers = []) => Array.isArray(matchers) && matchers.length > 0 && matchers.every((matcher) => matcher?.type !== STYLE_MATCHER_TYPE.REGEXP);
  var groupStyleMatchers = (matchers = []) => {
    const groups = [];
    const groupMap = /* @__PURE__ */ new Map();
    if (!Array.isArray(matchers)) {
      return groups;
    }
    matchers.forEach((matcher) => {
      const type = matcher?.type || "";
      const value = String(matcher?.value || "").trim();
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
  var createDraftRuleForSiteGroup = (group) => {
    const host = group?.host || window.location.hostname || "";
    return {
      name: "",
      source: STYLE_RULE_SOURCE.CUSTOM,
      enabled: true,
      matchers: host ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: host }] : [],
      layout: {},
      cssCode: "",
      favicon: group?.favicon || (host ? generateDomainFavicon(host) : "")
    };
  };
  var resolveGMRequest = () => {
    try {
      if (typeof GM_xmlhttpRequest === "function") {
        return GM_xmlhttpRequest;
      }
      if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.GM_xmlhttpRequest === "function") {
        return unsafeWindow.GM_xmlhttpRequest;
      }
      if (typeof window !== "undefined" && typeof window.GM_xmlhttpRequest === "function") {
        return window.GM_xmlhttpRequest;
      }
    } catch (_) {
    }
    return null;
  };
  var resolveFetch = () => {
    try {
      if (typeof fetch === "function") {
        return fetch;
      }
      if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") {
        return globalThis.fetch;
      }
    } catch (_) {
    }
    return null;
  };
  var requestRemoteText = async (url) => {
    let lastError = null;
    const gmRequest = resolveGMRequest();
    if (gmRequest) {
      try {
        const responseText = await new Promise((resolve, reject) => {
          gmRequest({
            method: "GET",
            url,
            onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                resolve(response.responseText || "");
                return;
              }
              reject(new Error(`HTTP ${response.status}: ${response.responseText || "[empty response]"}`));
            },
            onerror: (error) => {
              reject(new Error(error?.error || error?.message || "GM request failed."));
            }
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
          method: "GET",
          cache: "no-store",
          mode: "cors",
          credentials: "omit"
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        return await response.text();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error(t("m_8db845c5073b"));
  };
  var fetchOfficialUserStyleText = async () => {
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
      title: "m_58389daa203e",
      width: "700px",
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
      }
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
    const currentSiteKey = createSiteGroupKey(window.location.hostname || "");
    const dialogTitle = dialog.querySelector("h2");
    if (dialogTitle) {
      dialogTitle.style.marginBottom = "0";
      dialogTitle.style.display = "flex";
      dialogTitle.style.alignItems = "center";
      dialogTitle.style.lineHeight = "1.2";
      dialogTitle.style.flexShrink = "0";
    }
    const closeMainDialog = () => {
      void overlay.__cttfRequestClose("button");
    };
    const createActionButton = (label, backgroundColor = "var(--info-color, #4F46E5)") => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.padding = "5px 10px";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.backgroundColor = backgroundColor;
      button.style.color = "#ffffff";
      button.style.cursor = "pointer";
      button.style.fontSize = "14px";
      button.style.fontWeight = "500";
      button.style.lineHeight = "1.2";
      button.style.whiteSpace = "nowrap";
      button.style.flex = "0 0 auto";
      button.style.boxSizing = "border-box";
      button.style.transition = "background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease";
      button.textContent = label;
      return button;
    };
    const createAddButton = (label = t("m_d1dd773736d1"), options = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.minWidth = options.minWidth || "auto";
      button.style.height = options.height || "32px";
      button.style.padding = options.padding || "0 12px";
      button.style.border = "none";
      button.style.borderRadius = options.borderRadius || "4px";
      button.style.backgroundColor = options.background || "var(--add-color, #fd7e14)";
      button.style.color = options.color || "#fff";
      button.style.cursor = "pointer";
      button.style.fontSize = options.fontSize || "14px";
      button.style.fontWeight = "500";
      button.style.lineHeight = "1";
      button.style.whiteSpace = "nowrap";
      button.style.flex = "0 0 auto";
      button.style.boxSizing = "border-box";
      return button;
    };
    const createListControlButton = (label, options = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.minWidth = options.minWidth || "36px";
      button.style.height = options.height || "32px";
      button.style.padding = options.padding || "0 10px";
      button.style.borderRadius = options.borderRadius || "4px";
      button.style.border = options.border || "1px solid rgba(59,130,246,0.18)";
      button.style.backgroundColor = options.background || "rgba(59,130,246,0.12)";
      button.style.color = options.color || "var(--primary-color, #3B82F6)";
      button.style.cursor = "pointer";
      button.style.fontSize = options.fontSize || "13px";
      button.style.fontWeight = "500";
      button.style.lineHeight = "1";
      button.style.whiteSpace = "nowrap";
      button.style.flex = "0 0 auto";
      button.style.boxSizing = "border-box";
      button.style.transition = "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease";
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-1px)";
        button.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.transform = "none";
        button.style.boxShadow = "none";
      });
      return button;
    };
    const createEmptyState = (message) => {
      const empty = document.createElement("div");
      empty.textContent = message;
      empty.style.padding = "18px";
      empty.style.border = "1px dashed var(--border-color, #d1d5db)";
      empty.style.borderRadius = "8px";
      empty.style.color = "var(--muted-text-color, #6b7280)";
      empty.style.backgroundColor = "var(--button-bg, #f3f4f6)";
      empty.style.fontSize = "13px";
      empty.style.textAlign = "center";
      return empty;
    };
    const buildSiteGroups = () => {
      const officialRules = Array.isArray(buttonConfig.officialStyleBundle?.rules) ? buttonConfig.officialStyleBundle.rules : [];
      const customRules = Array.isArray(buttonConfig.customStyleRules) ? buttonConfig.customStyleRules : [];
      const groups = /* @__PURE__ */ new Map();
      const ensureGroup = (siteInfo) => {
        if (!groups.has(siteInfo.key)) {
          groups.set(siteInfo.key, {
            key: siteInfo.key,
            host: siteInfo.host,
            label: siteInfo.label,
            favicon: siteInfo.favicon,
            official: [],
            custom: []
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
        return String(left.label || left.host || "").localeCompare(String(right.label || right.host || ""), void 0, {
          sensitivity: "base"
        });
      });
    };
    const getSiteGroupByKey = (groupKey) => buildSiteGroups().find((group) => group.key === groupKey) || null;
    const topToolbar = document.createElement("div");
    topToolbar.style.display = "flex";
    topToolbar.style.alignItems = "center";
    topToolbar.style.justifyContent = "space-between";
    topToolbar.style.gap = "12px";
    topToolbar.style.flexWrap = "wrap";
    topToolbar.style.marginBottom = "12px";
    dialog.insertBefore(topToolbar, dialog.firstChild);
    const toolbarLeft = document.createElement("div");
    toolbarLeft.style.display = "flex";
    toolbarLeft.style.alignItems = "center";
    toolbarLeft.style.gap = "12px";
    toolbarLeft.style.flexWrap = "wrap";
    toolbarLeft.style.flex = "1 1 auto";
    toolbarLeft.style.minWidth = "0";
    topToolbar.appendChild(toolbarLeft);
    const actionRow = document.createElement("div");
    actionRow.style.display = "flex";
    actionRow.style.alignItems = "center";
    actionRow.style.flexWrap = "wrap";
    actionRow.style.gap = "10px";
    if (dialogTitle) {
      toolbarLeft.appendChild(dialogTitle);
    }
    toolbarLeft.appendChild(actionRow);
    const toolbarRight = document.createElement("div");
    toolbarRight.style.display = "flex";
    toolbarRight.style.alignItems = "center";
    toolbarRight.style.gap = "10px";
    toolbarRight.style.marginLeft = "auto";
    topToolbar.appendChild(toolbarRight);
    const closeBtn = createDialogCloseIconButton(closeMainDialog);
    toolbarRight.appendChild(closeBtn);
    const pullOfficialBtn = createActionButton(t("style.action.pull_official_latest"), "var(--add-color, #fd7e14)");
    actionRow.appendChild(pullOfficialBtn);
    const infoBar = document.createElement("div");
    infoBar.style.display = "flex";
    infoBar.style.flexWrap = "wrap";
    infoBar.style.gap = "8px";
    infoBar.style.marginBottom = "12px";
    dialog.appendChild(infoBar);
    const listContainer = document.createElement("div");
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 500px;
    `;
    const listHeader = document.createElement("div");
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
      { label: t("m_1f24c1e5aafa"), flex: "0 0 34px", justify: "center" },
      { label: t("m_f412fe65e355"), flex: "1 1 0%", justify: "flex-start", paddingLeft: "8px" },
      { label: t("style.official.title"), flex: "0 0 96px", justify: "center" },
      { label: t("style.custom.title"), flex: "0 0 96px", justify: "center" }
    ].forEach(({ label, flex, justify, paddingLeft }) => {
      const column = document.createElement("div");
      column.textContent = label;
      column.style.display = "flex";
      column.style.alignItems = "center";
      column.style.justifyContent = justify;
      column.style.flex = flex;
      column.style.fontSize = "12px";
      column.style.fontWeight = "600";
      if (paddingLeft) {
        column.style.paddingLeft = paddingLeft;
      }
      listHeader.appendChild(column);
    });
    const listBody = document.createElement("div");
    listBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 440px;
    `;
    listBody.classList.add("hide-scrollbar");
    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);
    const renderInfoBar = () => {
      infoBar.replaceChildren(
        createBadge(`${t("style.info.official_version")}: ${buttonConfig.officialStyleBundle?.version || t("style.info.bundled_snapshot")}`, {
          background: "rgba(59,130,246,0.12)"
        }),
        createBadge(`${t("style.info.last_fetched")}: ${formatTimestamp(buttonConfig.officialStyleBundle?.lastFetchedAt)}`, {
          background: "rgba(16,185,129,0.12)",
          color: "var(--success-color, #22c55e)",
          border: "1px solid rgba(16,185,129,0.22)"
        }),
        createBadge(`${t("style.info.source")}: ${formatSourceLabel(buttonConfig.officialStyleBundle?.sourceUrl || OFFICIAL_STYLE_SOURCE_URL)}`, {
          background: "rgba(148,163,184,0.14)",
          color: "var(--text-color, #1f2937)",
          border: "1px solid rgba(148,163,184,0.18)"
        })
      );
    };
    const refreshMainDialog = () => {
      renderInfoBar();
      renderSiteRows();
    };
    const refreshAllOpenDialogs = () => {
      refreshMainDialog();
      if (currentSiteRulesState?.key) {
        showSiteRulesDialog(currentSiteRulesState.key, currentSiteRulesState.activeTab || "official");
      }
    };
    const openCreateCustomRuleDialog = (group = null) => {
      const fallbackHost = window.location.hostname || "";
      const draftGroup = group || getSiteGroupByKey(currentSiteKey) || {
        key: currentSiteKey || createSiteGroupKey(fallbackHost) || "",
        host: fallbackHost,
        label: formatSiteLabelFromHost(fallbackHost) || t("style.grouped.other_site"),
        favicon: fallbackHost ? generateDomainFavicon(fallbackHost) : ""
      };
      showEditDomainStyleDialog(void 0, {
        draft: createDraftRuleForSiteGroup(draftGroup),
        onSaved: (savedRule) => {
          const nextSiteKey = resolveRuleSiteInfo(savedRule).key || draftGroup.key || currentSiteKey;
          currentSiteRulesState = {
            key: nextSiteKey,
            activeTab: "custom"
          };
          refreshAllOpenDialogs();
        }
      });
    };
    const applyImportedStyleState = (officialBundle, customRules) => {
      buttonConfig.officialStyleBundle = ensureStyleBundle(officialBundle, {
        fallbackSource: STYLE_RULE_SOURCE.OFFICIAL
      });
      buttonConfig.customStyleRules = customRules.map((rule) => ensureStyleRule({
        ...rule,
        source: STYLE_RULE_SOURCE.CUSTOM
      }, {
        fallbackSource: STYLE_RULE_SOURCE.CUSTOM
      })).filter(Boolean);
      applyCurrentStyleConfig();
      refreshAllOpenDialogs();
    };
    const createRuleRow = (rule, options = {}) => {
      const {
        isOfficial = false,
        index = -1,
        afterChange = () => {
        },
        siteKey = "",
        siteLabel = "",
        trimSiteLabel = false,
        showLeadingIcon = true,
        showSourceBadge = true
      } = options;
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "flex-start";
      row.style.gap = showLeadingIcon ? "14px" : "12px";
      row.style.padding = "14px";
      row.style.border = "1px solid rgba(148,163,184,0.18)";
      row.style.borderRadius = "12px";
      row.style.backgroundColor = "var(--dialog-bg, #ffffff)";
      row.style.boxShadow = "0 8px 20px rgba(15,23,42,0.05)";
      row.style.opacity = rule.enabled === false ? "0.65" : "1";
      const fallbackName = isOfficial ? t("style.untitled.official") : t("style.untitled.custom");
      const rawRuleName = String(rule.name || "").trim();
      const displayRuleName = trimSiteLabel ? stripSiteLabelPrefixFromRuleName(rawRuleName, siteLabel) : rawRuleName;
      const resolvedRuleName = displayRuleName || rawRuleName || fallbackName;
      const matcherGroups = groupStyleMatchers(rule.matchers);
      let isExpanded = false;
      const main = document.createElement("div");
      main.style.display = "flex";
      main.style.flexDirection = "column";
      main.style.gap = "10px";
      main.style.flex = "1";
      main.style.minWidth = "0";
      const headerLine = document.createElement("div");
      headerLine.style.display = "flex";
      headerLine.style.alignItems = "flex-start";
      headerLine.style.justifyContent = "space-between";
      headerLine.style.gap = "10px";
      headerLine.style.flexWrap = "wrap";
      headerLine.style.cursor = "pointer";
      headerLine.title = t("i18n.common.toggle_visibility");
      headerLine.tabIndex = 0;
      headerLine.setAttribute("role", "button");
      const headerLeft = document.createElement("div");
      headerLeft.style.display = "flex";
      headerLeft.style.alignItems = "center";
      headerLeft.style.flexWrap = "wrap";
      headerLeft.style.gap = "10px";
      headerLeft.style.flex = "1 1 auto";
      headerLeft.style.minWidth = "0";
      const toggleWrap = document.createElement("label");
      toggleWrap.style.display = "inline-flex";
      toggleWrap.style.alignItems = "center";
      toggleWrap.style.gap = "0";
      toggleWrap.style.fontSize = "12px";
      toggleWrap.style.fontWeight = "600";
      toggleWrap.style.color = "var(--muted-text-color, #6b7280)";
      toggleWrap.style.whiteSpace = "nowrap";
      toggleWrap.style.cursor = "pointer";
      toggleWrap.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      const enabledCheckbox = document.createElement("input");
      enabledCheckbox.type = "checkbox";
      enabledCheckbox.checked = rule.enabled !== false;
      enabledCheckbox.style.cursor = "pointer";
      enabledCheckbox.style.accentColor = "var(--primary-color, #3B82F6)";
      const updateToggleTooltip = () => {
        const tooltipId = enabledCheckbox.checked ? "style.toggle.disable_rule" : "style.toggle.enable_rule";
        const tooltipText = t(tooltipId);
        toggleWrap.title = tooltipText;
        enabledCheckbox.title = tooltipText;
        enabledCheckbox.setAttribute("aria-label", tooltipText);
      };
      enabledCheckbox.addEventListener("change", () => {
        rule.enabled = enabledCheckbox.checked;
        row.style.opacity = enabledCheckbox.checked ? "1" : "0.65";
        updateToggleTooltip();
        applyCurrentStyleConfig();
      });
      updateToggleTooltip();
      toggleWrap.appendChild(enabledCheckbox);
      headerLeft.appendChild(toggleWrap);
      if (showLeadingIcon) {
        const faviconUrl = rule.favicon || generateDomainFavicon(getPrimaryHostFromMatchers(rule.matchers) || "");
        const icon = createFaviconElement(
          faviconUrl,
          resolvedRuleName,
          isOfficial ? "🎨" : "🧩",
          { withBackground: false, size: 28 }
        );
        headerLeft.appendChild(icon);
      }
      const titleWrap = document.createElement("div");
      titleWrap.style.display = "flex";
      titleWrap.style.alignItems = "center";
      titleWrap.style.flexWrap = "wrap";
      titleWrap.style.gap = "8px";
      titleWrap.style.flex = "1 1 auto";
      titleWrap.style.minWidth = "0";
      const nameEl = document.createElement("strong");
      nameEl.textContent = resolvedRuleName;
      nameEl.style.fontSize = "14px";
      nameEl.style.color = "var(--text-color, #1f2937)";
      titleWrap.appendChild(nameEl);
      if (showSourceBadge) {
        titleWrap.appendChild(createBadge(isOfficial ? t("style.official.title") : t("style.custom.title"), {
          background: isOfficial ? "rgba(59,130,246,0.12)" : "rgba(99,102,241,0.12)",
          color: isOfficial ? "var(--primary-color, #3B82F6)" : "var(--info-color, #4F46E5)",
          border: "1px solid rgba(99,102,241,0.18)"
        }));
      }
      headerLeft.appendChild(titleWrap);
      headerLine.appendChild(headerLeft);
      let actions = null;
      if (!isOfficial) {
        actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.alignItems = "center";
        actions.style.gap = "6px";
        actions.style.flexShrink = "0";
        actions.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "✏️";
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
        editBtn.addEventListener("click", () => {
          showEditDomainStyleDialog(index, {
            onSaved: (savedRule) => {
              const nextSiteKey = resolveRuleSiteInfo(savedRule).key || siteKey;
              currentSiteRulesState = {
                key: nextSiteKey,
                activeTab: "custom"
              };
              afterChange();
            }
          });
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "🗑️";
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
        deleteBtn.addEventListener("click", () => {
          if (!confirm(t("style.custom.delete_confirm", { name: rule.name || t("style.untitled.custom") }))) {
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
      const matcherSection = document.createElement("div");
      matcherSection.style.display = "flex";
      matcherSection.style.flexDirection = "column";
      matcherSection.style.gap = "6px";
      matcherSection.style.padding = "10px 12px";
      matcherSection.style.borderRadius = "10px";
      matcherSection.style.border = "1px solid rgba(59,130,246,0.14)";
      matcherSection.style.backgroundColor = "rgba(59,130,246,0.06)";
      const matcherLabel = document.createElement("span");
      matcherLabel.textContent = shouldUseUrlSectionLabel(rule.matchers) ? t("m_efe0801dac67") : t("style.editor.matchers");
      matcherLabel.style.fontSize = "11px";
      matcherLabel.style.fontWeight = "600";
      matcherLabel.style.color = "var(--muted-text-color, #6b7280)";
      matcherLabel.style.letterSpacing = "0.08em";
      matcherLabel.style.textTransform = "uppercase";
      matcherSection.appendChild(matcherLabel);
      const matcherList = document.createElement("div");
      matcherList.style.display = "flex";
      matcherList.style.flexDirection = "column";
      matcherList.style.gap = "6px";
      matcherList.style.minWidth = "0";
      if (matcherGroups.length > 0) {
        matcherGroups.forEach((group) => {
          const matcherGroup = document.createElement("div");
          matcherGroup.style.display = "flex";
          matcherGroup.style.flexDirection = "column";
          matcherGroup.style.gap = "8px";
          matcherGroup.style.padding = "10px 12px";
          matcherGroup.style.borderRadius = "8px";
          matcherGroup.style.backgroundColor = "rgba(59,130,246,0.08)";
          const matcherGroupHeader = document.createElement("div");
          matcherGroupHeader.style.display = "flex";
          matcherGroupHeader.style.alignItems = "center";
          matcherGroupHeader.style.gap = "8px";
          matcherGroupHeader.style.flexWrap = "wrap";
          const matcherTypeBadge = document.createElement("span");
          matcherTypeBadge.textContent = getMatcherTypeLabel(group.type);
          matcherTypeBadge.style.display = "inline-flex";
          matcherTypeBadge.style.alignItems = "center";
          matcherTypeBadge.style.justifyContent = "center";
          matcherTypeBadge.style.padding = "2px 8px";
          matcherTypeBadge.style.borderRadius = "999px";
          matcherTypeBadge.style.backgroundColor = "rgba(59,130,246,0.14)";
          matcherTypeBadge.style.color = "var(--primary-color, #3B82F6)";
          matcherTypeBadge.style.fontSize = "11px";
          matcherTypeBadge.style.fontWeight = "600";
          matcherTypeBadge.style.whiteSpace = "nowrap";
          matcherGroupHeader.appendChild(matcherTypeBadge);
          matcherGroup.appendChild(matcherGroupHeader);
          const hasMultipleValues = group.values.length > 1;
          const matcherValueList = document.createElement(hasMultipleValues ? "ul" : "div");
          matcherValueList.style.display = "block";
          matcherValueList.style.minWidth = "0";
          matcherValueList.style.margin = "0";
          matcherValueList.style.padding = hasMultipleValues ? "0 0 0 18px" : "0";
          if (hasMultipleValues) {
            matcherValueList.style.listStylePosition = "outside";
          }
          group.values.forEach((value, valueIndex) => {
            const matcherValueRow = document.createElement(hasMultipleValues ? "li" : "div");
            matcherValueRow.style.minWidth = "0";
            if (valueIndex < group.values.length - 1) {
              matcherValueRow.style.marginBottom = "6px";
            }
            if (hasMultipleValues) {
              matcherValueRow.style.color = "rgba(59,130,246,0.55)";
            }
            const matcherValue = document.createElement("span");
            matcherValue.textContent = value;
            matcherValue.style.display = "block";
            matcherValue.style.minWidth = "0";
            matcherValue.style.fontSize = "12px";
            matcherValue.style.color = "var(--text-color, #1f2937)";
            matcherValue.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
            matcherValue.style.whiteSpace = "pre-wrap";
            matcherValue.style.overflowWrap = "anywhere";
            matcherValue.style.wordBreak = "break-word";
            matcherValue.style.lineHeight = "1.6";
            matcherValueRow.appendChild(matcherValue);
            matcherValueList.appendChild(matcherValueRow);
          });
          matcherGroup.appendChild(matcherValueList);
          matcherList.appendChild(matcherGroup);
        });
      } else {
        const matcherEmpty = document.createElement("div");
        matcherEmpty.textContent = t("style.matchers.empty");
        matcherEmpty.style.padding = "10px 12px";
        matcherEmpty.style.borderRadius = "8px";
        matcherEmpty.style.backgroundColor = "rgba(59,130,246,0.08)";
        matcherEmpty.style.fontSize = "12px";
        matcherEmpty.style.color = "var(--muted-text-color, #6b7280)";
        matcherList.appendChild(matcherEmpty);
      }
      matcherSection.appendChild(matcherList);
      const cssSection = document.createElement("div");
      cssSection.style.display = "flex";
      cssSection.style.flexDirection = "column";
      cssSection.style.gap = "6px";
      cssSection.style.padding = "10px 12px";
      cssSection.style.borderRadius = "10px";
      cssSection.style.border = "1px solid rgba(148,163,184,0.16)";
      cssSection.style.backgroundColor = "rgba(15,23,42,0.03)";
      const cssLabel = document.createElement("span");
      cssLabel.textContent = "CSS";
      cssLabel.style.fontSize = "11px";
      cssLabel.style.fontWeight = "600";
      cssLabel.style.color = "var(--muted-text-color, #6b7280)";
      cssLabel.style.letterSpacing = "0.08em";
      cssLabel.style.textTransform = "uppercase";
      cssSection.appendChild(cssLabel);
      const cssPreview = document.createElement("pre");
      cssPreview.textContent = rule.cssCode || t("m_8beaf4bf00c7");
      cssPreview.title = rule.cssCode || t("m_8beaf4bf00c7");
      cssPreview.style.display = "block";
      cssPreview.style.margin = "0";
      cssPreview.style.padding = "10px 12px";
      cssPreview.style.borderRadius = "8px";
      cssPreview.style.border = "1px solid rgba(148,163,184,0.16)";
      cssPreview.style.backgroundColor = "rgba(15,23,42,0.045)";
      cssPreview.style.fontSize = "12px";
      cssPreview.style.color = "var(--text-color, #1f2937)";
      cssPreview.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
      cssPreview.style.whiteSpace = "pre-wrap";
      cssPreview.style.overflowWrap = "anywhere";
      cssPreview.style.wordBreak = "break-word";
      cssPreview.style.lineHeight = "1.6";
      cssSection.appendChild(cssPreview);
      const badgeLine = document.createElement("div");
      badgeLine.style.display = "flex";
      badgeLine.style.flexWrap = "wrap";
      badgeLine.style.gap = "6px";
      badgeLine.appendChild(createBadge(
        `${t("m_564ba29dcede")}: ${typeof rule.layout?.height === "number" ? `${rule.layout.height}px` : t("style.layout.inherit")}`,
        {
          background: "rgba(16,185,129,0.12)",
          color: "var(--success-color, #22c55e)",
          border: "1px solid rgba(16,185,129,0.18)"
        }
      ));
      badgeLine.appendChild(createBadge(
        `${t("m_ccb47ee4e2ed")}: ${typeof rule.layout?.bottomSpacing === "number" ? `${rule.layout.bottomSpacing}px` : t("style.layout.inherit")}`,
        {
          background: "rgba(59,130,246,0.12)",
          color: "var(--primary-color, #3B82F6)",
          border: "1px solid rgba(59,130,246,0.18)"
        }
      ));
      const detailsWrap = document.createElement("div");
      detailsWrap.style.display = "flex";
      detailsWrap.style.flexDirection = "column";
      detailsWrap.style.gap = "10px";
      detailsWrap.appendChild(matcherSection);
      detailsWrap.appendChild(cssSection);
      detailsWrap.appendChild(badgeLine);
      main.appendChild(headerLine);
      main.appendChild(detailsWrap);
      row.appendChild(main);
      const updateExpandedState = () => {
        detailsWrap.style.display = isExpanded ? "flex" : "none";
        if (actions) {
          actions.style.display = isExpanded ? "flex" : "none";
        }
        headerLine.setAttribute("aria-expanded", String(isExpanded));
      };
      const toggleExpandedState = () => {
        isExpanded = !isExpanded;
        updateExpandedState();
      };
      headerLine.addEventListener("click", () => {
        toggleExpandedState();
      });
      headerLine.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
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
        emptyMessage = "",
        maxBodyHeight = "420px",
        hideScrollbar = true,
        afterChange = () => {
        },
        siteKey = "",
        siteLabel = "",
        trimSiteLabel = false,
        footerActionButton = null,
        showHeader = true,
        showLeadingIcon = true,
        showSourceBadge = true
      } = options;
      const section = document.createElement("section");
      section.style.display = "flex";
      section.style.flexDirection = "column";
      section.style.gap = "10px";
      section.style.minWidth = "0";
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.justifyContent = "space-between";
      header.style.gap = "10px";
      header.style.flexWrap = "wrap";
      const headingWrap = document.createElement("div");
      headingWrap.style.display = "flex";
      headingWrap.style.alignItems = "center";
      headingWrap.style.gap = "8px";
      headingWrap.style.flexWrap = "wrap";
      const titleEl = document.createElement("strong");
      titleEl.textContent = title;
      titleEl.style.fontSize = "16px";
      titleEl.style.color = "var(--text-color, #1f2937)";
      headingWrap.appendChild(titleEl);
      headingWrap.appendChild(createBadge(String(items.length), {
        background: isOfficial ? "rgba(59,130,246,0.12)" : "rgba(99,102,241,0.12)",
        color: isOfficial ? "var(--primary-color, #3B82F6)" : "var(--info-color, #4F46E5)",
        border: "1px solid rgba(99,102,241,0.18)"
      }));
      header.appendChild(headingWrap);
      if (description) {
        const descEl = document.createElement("span");
        descEl.textContent = description;
        descEl.style.fontSize = "12px";
        descEl.style.color = "var(--muted-text-color, #6b7280)";
        header.appendChild(descEl);
      }
      const rulesContainer = document.createElement("div");
      rulesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            min-width: 0;
        `;
      const rulesBody = document.createElement("div");
      rulesBody.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 0;
            overflow-y: auto;
            max-height: ${maxBodyHeight};
        `;
      if (hideScrollbar) {
        rulesBody.classList.add("hide-scrollbar");
      }
      if (!items.length) {
        const empty = document.createElement("div");
        empty.textContent = emptyMessage;
        empty.style.padding = "18px 16px";
        empty.style.borderRadius = "10px";
        empty.style.border = "1px dashed rgba(148,163,184,0.24)";
        empty.style.backgroundColor = "rgba(148,163,184,0.08)";
        empty.style.color = "var(--muted-text-color, #6b7280)";
        empty.style.fontSize = "13px";
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
            showSourceBadge
          }));
        });
      }
      rulesContainer.appendChild(rulesBody);
      if (showHeader) {
        section.appendChild(header);
      }
      section.appendChild(rulesContainer);
      if (footerActionButton) {
        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-start";
        footer.style.marginTop = "2px";
        footer.appendChild(footerActionButton);
        section.appendChild(footer);
      }
      return section;
    };
    const createSiteIdentityLayout = (group, options = {}) => {
      const {
        flex = "1 1 auto",
        hostMaxWidth = "360px"
      } = options;
      const root = document.createElement("div");
      root.style.display = "flex";
      root.style.justifyContent = "flex-start";
      root.style.alignItems = "center";
      root.style.gap = "10px";
      root.style.minWidth = "0";
      root.style.flex = flex;
      const faviconBadge = createFaviconElement(
        group.favicon || generateDomainFavicon(group.host || ""),
        group.label || t("style.grouped.other_site"),
        "🌐",
        { withBackground: false, size: 26 }
      );
      faviconBadge.title = group.host || "";
      const iconColumn = document.createElement("div");
      iconColumn.style.display = "flex";
      iconColumn.style.alignItems = "center";
      iconColumn.style.justifyContent = "center";
      iconColumn.style.flex = "0 0 34px";
      iconColumn.appendChild(faviconBadge);
      const infoColumn = document.createElement("div");
      infoColumn.style.display = "flex";
      infoColumn.style.flexDirection = "column";
      infoColumn.style.gap = "2px";
      infoColumn.style.minWidth = "0";
      infoColumn.style.flex = "1 1 0%";
      const nameLine = document.createElement("div");
      nameLine.style.display = "flex";
      nameLine.style.alignItems = "center";
      nameLine.style.gap = "4px";
      nameLine.style.flexWrap = "wrap";
      const nameEl = document.createElement("span");
      nameEl.textContent = group.label || t("style.grouped.other_site");
      nameEl.style.fontWeight = "600";
      nameEl.style.fontSize = "14px";
      nameEl.style.lineHeight = "1.2";
      nameEl.style.color = "var(--text-color, #1f2937)";
      nameLine.appendChild(nameEl);
      if (group.key === currentSiteKey) {
        nameLine.appendChild(createBadge(t("style.grouped.current_site"), {
          background: "rgba(16,185,129,0.12)",
          color: "var(--success-color, #22c55e)",
          border: "1px solid rgba(16,185,129,0.22)",
          padding: "2px 8px",
          fontSize: "11px"
        }));
      }
      const hostEl = document.createElement("span");
      hostEl.textContent = group.host || t("style.grouped.other_site");
      hostEl.style.fontSize = "12px";
      hostEl.style.lineHeight = "1.2";
      hostEl.style.color = "var(--muted-text-color, #6b7280)";
      hostEl.style.whiteSpace = "nowrap";
      hostEl.style.overflow = "hidden";
      hostEl.style.textOverflow = "ellipsis";
      hostEl.style.maxWidth = hostMaxWidth;
      hostEl.title = group.host || "";
      infoColumn.appendChild(nameLine);
      infoColumn.appendChild(hostEl);
      root.appendChild(iconColumn);
      root.appendChild(infoColumn);
      return root;
    };
    const createSiteMetaRow = (group) => {
      const metaRow = document.createElement("div");
      metaRow.style.display = "flex";
      metaRow.style.alignItems = "center";
      metaRow.style.justifyContent = "flex-start";
      metaRow.style.minWidth = "0";
      metaRow.appendChild(createSiteIdentityLayout(group, {
        hostMaxWidth: "100%"
      }));
      return metaRow;
    };
    const showSiteRulesDialog = (groupKey, initialTab = "official") => {
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
        title: "style.grouped.detail_title",
        width: "654px",
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
        }
      });
      currentSiteRulesOverlay = siteOverlay;
      const siteDialogTitle = siteDialog.querySelector("h2");
      if (siteDialogTitle) {
        siteDialogTitle.style.marginBottom = "0";
        siteDialogTitle.style.display = "flex";
        siteDialogTitle.style.alignItems = "center";
        siteDialogTitle.style.lineHeight = "1.2";
        siteDialogTitle.style.flexShrink = "0";
      }
      let currentTab = initialTab === "custom" ? "custom" : "official";
      currentSiteRulesState = {
        key: groupKey,
        activeTab: currentTab
      };
      siteOverlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
        if (currentSiteRulesOverlay !== siteOverlay) {
          return;
        }
        showSiteRulesDialog(groupKey, currentTab);
      });
      const topBar = document.createElement("div");
      topBar.style.display = "flex";
      topBar.style.alignItems = "center";
      topBar.style.justifyContent = "space-between";
      topBar.style.gap = "12px";
      topBar.style.flexWrap = "wrap";
      topBar.style.marginBottom = "12px";
      siteDialog.insertBefore(topBar, siteDialog.firstChild);
      const topBarLeft = document.createElement("div");
      topBarLeft.style.display = "flex";
      topBarLeft.style.alignItems = "center";
      topBarLeft.style.flex = "1 1 auto";
      topBarLeft.style.minWidth = "0";
      if (siteDialogTitle) {
        topBarLeft.appendChild(siteDialogTitle);
      }
      topBar.appendChild(topBarLeft);
      const topBarRight = document.createElement("div");
      topBarRight.style.display = "flex";
      topBarRight.style.alignItems = "center";
      topBarRight.style.justifyContent = "flex-end";
      topBarRight.style.flex = "0 0 auto";
      topBar.appendChild(topBarRight);
      const officialTabBtn = createListControlButton("", {
        minWidth: "96px",
        padding: "0 14px"
      });
      const customTabBtn = createListControlButton("", {
        minWidth: "96px",
        padding: "0 14px",
        background: "rgba(99,102,241,0.12)",
        color: "var(--info-color, #4F46E5)",
        border: "1px solid rgba(99,102,241,0.18)"
      });
      const addCustomBtn = createAddButton(void 0, {
        minWidth: "96px",
        height: "32px",
        padding: "0 14px"
      });
      addCustomBtn.addEventListener("click", () => {
        const latestGroup = getSiteGroupByKey(groupKey);
        if (latestGroup) {
          openCreateCustomRuleDialog(latestGroup);
        }
      });
      const closeSiteBtn = createDialogCloseIconButton((event) => {
        void siteOverlay.__cttfRequestClose("button", event);
      });
      topBarRight.appendChild(closeSiteBtn);
      const summaryRow = document.createElement("div");
      summaryRow.style.display = "flex";
      summaryRow.style.alignItems = "center";
      summaryRow.style.justifyContent = "space-between";
      summaryRow.style.gap = "12px";
      summaryRow.style.flexWrap = "wrap";
      summaryRow.style.paddingBottom = "12px";
      summaryRow.style.marginBottom = "14px";
      summaryRow.style.borderBottom = "1px solid var(--border-color, #e5e7eb)";
      siteDialog.appendChild(summaryRow);
      const summaryHost = document.createElement("div");
      summaryHost.style.flex = "1 1 220px";
      summaryHost.style.minWidth = "0";
      summaryRow.appendChild(summaryHost);
      const summaryActions = document.createElement("div");
      summaryActions.style.display = "flex";
      summaryActions.style.alignItems = "center";
      summaryActions.style.justifyContent = "flex-end";
      summaryActions.style.gap = "10px";
      summaryActions.style.flex = "0 0 auto";
      summaryActions.style.flexWrap = "wrap";
      summaryActions.style.marginLeft = "auto";
      summaryRow.appendChild(summaryActions);
      const tabRow = document.createElement("div");
      tabRow.style.display = "flex";
      tabRow.style.alignItems = "center";
      tabRow.style.justifyContent = "flex-end";
      tabRow.style.gap = "8px";
      tabRow.style.flexWrap = "nowrap";
      summaryActions.appendChild(tabRow);
      tabRow.appendChild(officialTabBtn);
      tabRow.appendChild(customTabBtn);
      const sitePrimaryActionHost = document.createElement("div");
      sitePrimaryActionHost.style.display = "flex";
      sitePrimaryActionHost.style.alignItems = "center";
      sitePrimaryActionHost.style.justifyContent = "flex-end";
      sitePrimaryActionHost.style.flex = "0 0 auto";
      sitePrimaryActionHost.style.visibility = "hidden";
      sitePrimaryActionHost.style.pointerEvents = "none";
      sitePrimaryActionHost.appendChild(addCustomBtn);
      summaryActions.appendChild(sitePrimaryActionHost);
      const contentHost = document.createElement("div");
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
        officialTabBtn.textContent = t("style.official.short_title");
        customTabBtn.textContent = t("style.custom.short_title");
        officialTabBtn.title = `${t("style.official.title")} ${latestGroup.official.length}`;
        customTabBtn.title = `${t("style.custom.title")} ${latestGroup.custom.length}`;
        const applyTabState = (button, isActive, activeStyles, inactiveStyles) => {
          button.style.backgroundColor = isActive ? activeStyles.background : inactiveStyles.background;
          button.style.color = isActive ? activeStyles.color : inactiveStyles.color;
          button.style.border = isActive ? activeStyles.border : inactiveStyles.border;
        };
        applyTabState(
          officialTabBtn,
          currentTab === "official",
          {
            background: "rgba(59,130,246,0.18)",
            color: "var(--primary-color, #3B82F6)",
            border: "1px solid rgba(59,130,246,0.28)"
          },
          {
            background: "rgba(59,130,246,0.08)",
            color: "var(--primary-color, #3B82F6)",
            border: "1px solid rgba(59,130,246,0.16)"
          }
        );
        applyTabState(
          customTabBtn,
          currentTab === "custom",
          {
            background: "rgba(99,102,241,0.18)",
            color: "var(--info-color, #4F46E5)",
            border: "1px solid rgba(99,102,241,0.28)"
          },
          {
            background: "rgba(99,102,241,0.08)",
            color: "var(--info-color, #4F46E5)",
            border: "1px solid rgba(99,102,241,0.16)"
          }
        );
        currentSiteRulesState = {
          key: latestGroup.key,
          activeTab: currentTab
        };
        summaryHost.replaceChildren(createSiteMetaRow(latestGroup));
        if (currentTab === "custom") {
          sitePrimaryActionHost.style.visibility = "visible";
          sitePrimaryActionHost.style.pointerEvents = "auto";
        } else {
          sitePrimaryActionHost.style.visibility = "hidden";
          sitePrimaryActionHost.style.pointerEvents = "none";
        }
        contentHost.replaceChildren(
          createRuleTypeSection(
            currentTab === "official" ? t("style.official.title") : t("style.custom.title"),
            currentTab === "official" ? t("style.official.description") : t("style.custom.description"),
            currentTab === "official" ? latestGroup.official : latestGroup.custom,
            {
              isOfficial: currentTab === "official",
              emptyMessage: currentTab === "official" ? t("style.grouped.no_official") : t("style.grouped.no_custom"),
              maxBodyHeight: "460px",
              hideScrollbar: false,
              siteKey: latestGroup.key,
              siteLabel: latestGroup.label,
              trimSiteLabel: true,
              afterChange: refreshAllOpenDialogs,
              showHeader: false,
              showLeadingIcon: false,
              showSourceBadge: false
            }
          )
        );
      };
      officialTabBtn.addEventListener("click", () => {
        currentTab = "official";
        refreshSiteDialog();
      });
      customTabBtn.addEventListener("click", () => {
        currentTab = "custom";
        refreshSiteDialog();
      });
      refreshSiteDialog();
    };
    const renderSiteRows = () => {
      listBody.replaceChildren();
      const siteGroups = buildSiteGroups();
      if (!siteGroups.length) {
        listBody.appendChild(createEmptyState(t("style.grouped.empty")));
        return;
      }
      siteGroups.forEach((group) => {
        const item = document.createElement("div");
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
        item.addEventListener("mouseenter", () => {
          item.style.borderColor = "var(--primary-color, #3B82F6)";
          item.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)";
        });
        item.addEventListener("mouseleave", () => {
          item.style.borderColor = "var(--border-color, #e5e7eb)";
          item.style.boxShadow = "none";
        });
        const officialColumn = document.createElement("div");
        officialColumn.style.display = "flex";
        officialColumn.style.alignItems = "center";
        officialColumn.style.justifyContent = "center";
        officialColumn.style.flex = "0 0 96px";
        const officialBtn = createListControlButton(String(group.official.length), {
          background: "rgba(59,130,246,0.12)",
          color: "var(--primary-color, #3B82F6)",
          border: "1px solid rgba(59,130,246,0.18)",
          minWidth: "32px",
          height: "28px",
          padding: "0 8px",
          fontSize: "12px"
        });
        officialBtn.title = `${t("style.official.title")} ${group.official.length}`;
        officialBtn.addEventListener("click", () => {
          currentSiteRulesState = {
            key: group.key,
            activeTab: "official"
          };
          showSiteRulesDialog(group.key, "official");
        });
        officialColumn.appendChild(officialBtn);
        const customColumn = document.createElement("div");
        customColumn.style.display = "flex";
        customColumn.style.alignItems = "center";
        customColumn.style.justifyContent = "center";
        customColumn.style.flex = "0 0 96px";
        const customBtn = createListControlButton(String(group.custom.length), {
          background: "rgba(99,102,241,0.12)",
          color: "var(--info-color, #4F46E5)",
          border: "1px solid rgba(99,102,241,0.18)",
          minWidth: "32px",
          height: "28px",
          padding: "0 8px",
          fontSize: "12px"
        });
        customBtn.title = `${t("style.custom.title")} ${group.custom.length}`;
        customBtn.addEventListener("click", () => {
          currentSiteRulesState = {
            key: group.key,
            activeTab: "custom"
          };
          showSiteRulesDialog(group.key, "custom");
        });
        customColumn.appendChild(customBtn);
        item.appendChild(createSiteIdentityLayout(group, {
          flex: "1 1 0%"
        }));
        item.appendChild(officialColumn);
        item.appendChild(customColumn);
        listBody.appendChild(item);
      });
    };
    const footerRow = document.createElement("div");
    footerRow.style.display = "flex";
    footerRow.style.alignItems = "center";
    footerRow.style.justifyContent = "flex-start";
    footerRow.style.gap = "12px";
    footerRow.style.flexWrap = "wrap";
    footerRow.style.marginTop = "12px";
    const footerLeft = document.createElement("div");
    footerLeft.style.display = "flex";
    footerLeft.style.alignItems = "center";
    footerLeft.style.gap = "10px";
    footerLeft.style.flex = "1 1 auto";
    footerLeft.style.minWidth = "0";
    const footerRight = document.createElement("div");
    footerRight.style.display = "flex";
    footerRight.style.alignItems = "center";
    footerRight.style.justifyContent = "flex-end";
    footerRight.style.gap = "10px";
    footerRight.style.flex = "0 0 auto";
    footerRight.style.marginLeft = "auto";
    const importBtn = createActionButton(t("style.action.import_user_css"));
    importBtn.title = t("style.action.import_user_css_tooltip");
    const exportBtn = createActionButton(t("style.action.export_user_css"), "var(--success-color, #22c55e)");
    exportBtn.title = t("style.action.export_user_css_tooltip");
    const addBtn = createAddButton();
    addBtn.addEventListener("click", () => {
      openCreateCustomRuleDialog();
    });
    footerLeft.appendChild(addBtn);
    footerRight.appendChild(importBtn);
    footerRight.appendChild(exportBtn);
    footerRow.appendChild(footerLeft);
    footerRow.appendChild(footerRight);
    dialog.appendChild(footerRow);
    exportBtn.addEventListener("click", () => {
      try {
        const content = serializeStylePackageToUserCss({
          officialStyleBundle: buttonConfig.officialStyleBundle,
          customStyleRules: buttonConfig.customStyleRules
        });
        downloadTextFile(buildExportFileName(), content, "text/css;charset=utf-8");
        console.log(t("style.export.success"));
      } catch (error) {
        alert(t("style.export.failed", { message: getErrorMessage(error) }));
      }
    });
    importBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".css,.user.css,text/css";
      input.addEventListener("change", (event) => {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = parseUserStyleFile(reader.result || "", {
              defaultSource: STYLE_RULE_SOURCE.CUSTOM
            });
            const grouped = splitRulesBySource(parsed.rules);
            const nextOfficialBundle = ensureStyleBundle({
              version: parsed.metadata.officialVersion || "",
              sourceUrl: parsed.metadata.officialSourceUrl || "",
              lastFetchedAt: parsed.metadata.officialLastFetchedAt || 0,
              rules: grouped.official.map((rule) => ({
                ...rule,
                source: STYLE_RULE_SOURCE.OFFICIAL
              }))
            }, {
              fallbackSource: STYLE_RULE_SOURCE.OFFICIAL
            });
            const nextCustomRules = grouped.custom.map((rule) => ensureStyleRule({
              ...rule,
              source: STYLE_RULE_SOURCE.CUSTOM
            }, {
              fallbackSource: STYLE_RULE_SOURCE.CUSTOM
            })).filter(Boolean);
            const confirmed = confirm(t("style.import.summary", {
              officialCount: nextOfficialBundle.rules.length,
              customCount: nextCustomRules.length,
              version: nextOfficialBundle.version || t("style.info.bundled_snapshot")
            }));
            if (!confirmed) {
              return;
            }
            applyImportedStyleState(nextOfficialBundle, nextCustomRules);
            console.log(t("style.import.success"));
          } catch (error) {
            alert(t("style.import.failed", {
              message: getErrorMessage(error)
            }));
          }
        };
        reader.readAsText(file);
      });
      input.click();
    });
    pullOfficialBtn.addEventListener("click", async () => {
      pullOfficialBtn.disabled = true;
      try {
        const { text, url } = await fetchOfficialUserStyleText();
        const enabledStateById = new Map(
          (buttonConfig.officialStyleBundle?.rules || []).map((rule) => [rule.id, rule.enabled !== false])
        );
        const nextOfficialBundle = buildOfficialStyleBundleFromUserCss(text, {
          sourceUrl: url,
          lastFetchedAt: Date.now()
        });
        nextOfficialBundle.rules = nextOfficialBundle.rules.map((rule) => ({
          ...rule,
          enabled: enabledStateById.has(rule.id) ? enabledStateById.get(rule.id) : rule.enabled !== false
        }));
        buttonConfig.officialStyleBundle = nextOfficialBundle;
        applyCurrentStyleConfig();
        refreshAllOpenDialogs();
        console.log(t("style.fetch.success", {
          version: nextOfficialBundle.version || t("style.info.bundled_snapshot")
        }));
      } catch (error) {
        alert(t("style.fetch.failed", {
          message: getErrorMessage(error)
        }));
      } finally {
        pullOfficialBtn.disabled = false;
      }
    });
    refreshMainDialog();
  }

  // src/features/settings/index.js
  var selectedFolderName = buttonConfig.folderOrder[0] || null;
  var folderListContainer;
  var buttonListContainer;
  var currentSettingsOverlay = null;
  var isSettingsFolderPanelCollapsed = false;
  var settingsDialogMainContainer = null;
  var closeConfigOverlayHandler = () => {
  };
  var settingsHeaderActionButtons = null;
  var settingsHeaderCloseButton = null;
  var pendingSettingsHeaderAlignmentFrame = 0;
  var SETTINGS_HEADER_BUTTON_GAP = 10;
  var cancelPendingSettingsHeaderAlignment = () => {
    if (!pendingSettingsHeaderAlignmentFrame) {
      return;
    }
    window.cancelAnimationFrame(pendingSettingsHeaderAlignmentFrame);
    pendingSettingsHeaderAlignmentFrame = 0;
  };
  var syncSettingsHeaderButtonAlignment = () => {
    pendingSettingsHeaderAlignmentFrame = 0;
    if (!settingsHeaderActionButtons || !settingsHeaderCloseButton || !settingsHeaderActionButtons.isConnected || !settingsHeaderCloseButton.isConnected) {
      return;
    }
    const addNewButtonBtn = buttonListContainer?.querySelector?.('[data-settings-add-button="true"]');
    if (!addNewButtonBtn || !addNewButtonBtn.isConnected) {
      settingsHeaderCloseButton.style.marginLeft = `${SETTINGS_HEADER_BUTTON_GAP}px`;
      return;
    }
    const buttonPanelPaddingRight = parseFloat(window.getComputedStyle(buttonListContainer).paddingRight) || 0;
    const closeButtonWidth = settingsHeaderCloseButton.getBoundingClientRect().width || settingsHeaderCloseButton.offsetWidth || 32;
    const addButtonWidth = addNewButtonBtn.getBoundingClientRect().width || addNewButtonBtn.offsetWidth || 0;
    const automationButton = settingsHeaderActionButtons.querySelector('[data-settings-header-action="automation"]');
    const automationButtonWidth = automationButton ? automationButton.getBoundingClientRect().width || automationButton.offsetWidth || 0 : 0;
    const desiredGap = Math.max(
      SETTINGS_HEADER_BUTTON_GAP,
      Math.round(buttonPanelPaddingRight + addButtonWidth + automationButtonWidth / 2 - closeButtonWidth)
    );
    settingsHeaderCloseButton.style.marginLeft = `${desiredGap}px`;
  };
  var scheduleSettingsHeaderButtonAlignment = () => {
    cancelPendingSettingsHeaderAlignment();
    pendingSettingsHeaderAlignmentFrame = window.requestAnimationFrame(() => {
      syncSettingsHeaderButtonAlignment();
    });
  };
  var resetSettingsHeaderButtonAlignment = () => {
    cancelPendingSettingsHeaderAlignment();
    settingsHeaderActionButtons = null;
    settingsHeaderCloseButton = null;
  };
  var setSelectedFolderName = (nextFolderName) => {
    selectedFolderName = nextFolderName;
    return selectedFolderName;
  };
  var getCurrentSettingsOverlay = () => currentSettingsOverlay;
  var setCloseConfigOverlayHandler = (handler) => {
    closeConfigOverlayHandler = typeof handler === "function" ? handler : () => {
    };
  };
  var extractTemplateVariables = (text = "") => {
    if (typeof text !== "string" || !text.includes("{")) {
      return [];
    }
    const matches = /* @__PURE__ */ new Set();
    const fallbackMatches = text.match(/\{\{[A-Za-z0-9_-]+\}\|\{[A-Za-z0-9_-]+\}\}/g) || [];
    fallbackMatches.forEach((match) => matches.add(match));
    let sanitized = text;
    fallbackMatches.forEach((match) => {
      sanitized = sanitized.split(match).join(" ");
    });
    const singleMatches = sanitized.match(/\{[A-Za-z0-9_-]+\}/g) || [];
    singleMatches.forEach((match) => matches.add(match));
    return Array.from(matches);
  };
  var renderFolderList = () => {
    if (!folderListContainer) return;
    setTrustedHTML(folderListContainer, "");
    const foldersArray = buttonConfig.folderOrder.map((fname) => [fname, buttonConfig.folders[fname]]).filter(([f, c]) => c);
    foldersArray.forEach(([fname, fconfig]) => {
      const folderItem = document.createElement("div");
      folderItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border-radius: 4px;
                margin: 4px 0;
                background-color: ${selectedFolderName === fname ? isDarkMode() ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.1)" : "transparent"};
                cursor: move;
                direction: ltr;
                min-height: 36px;
            `;
      folderItem.classList.add("folder-item");
      folderItem.setAttribute("draggable", "true");
      folderItem.setAttribute("data-folder", fname);
      const { container: leftInfo, folderPreview } = (function createFolderPreview(fname2, fconfig2) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.gap = "10px";
        container.style.flex = "1";
        container.style.minWidth = "0";
        container.style.paddingRight = "8px";
        const showIcons = buttonConfig && buttonConfig.showFolderIcons === true;
        const { iconSymbol, textLabel } = extractButtonIconParts(fname2);
        const normalizedLabel = (textLabel || fname2 || "").trim();
        const fallbackLabel = normalizedLabel || fname2 || t("m_7353515a2d1e");
        const fallbackSymbol = iconSymbol || (Array.from(fallbackLabel)[0] || "📁");
        const previewButton = document.createElement("button");
        previewButton.type = "button";
        previewButton.setAttribute("data-folder-preview", fname2);
        previewButton.title = fname2;
        previewButton.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border-radius: 4px;
                background-color: transparent;
                border: none;
                cursor: grab;
                flex-shrink: 1;
                min-width: 0;
                max-width: 100%;
                margin: 0 8px 0 0;
            `;
        const pill = document.createElement("span");
        pill.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: ${showIcons ? "6px" : "0"};
                background: ${fconfig2.color || "var(--primary-color, #3B82F6)"};
                color: ${fconfig2.textColor || "#ffffff"};
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 14px;
                font-weight: ${selectedFolderName === fname2 ? "600" : "500"};
                min-width: 0;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
                transition: all 0.2s ease;
            `;
        if (showIcons) {
          const iconSpan = document.createElement("span");
          iconSpan.style.display = "inline-flex";
          iconSpan.style.alignItems = "center";
          iconSpan.style.justifyContent = "center";
          iconSpan.style.fontSize = "14px";
          iconSpan.style.lineHeight = "1";
          iconSpan.textContent = fallbackSymbol;
          pill.appendChild(iconSpan);
        }
        const textSpan = document.createElement("span");
        textSpan.style.display = "inline-flex";
        textSpan.style.alignItems = "center";
        textSpan.style.justifyContent = "center";
        textSpan.style.pointerEvents = "none";
        let textContent = showIcons ? normalizedLabel : fname2 || normalizedLabel;
        if (!showIcons && iconSymbol && !fname2.includes(iconSymbol)) {
          textContent = `${iconSymbol} ${textContent || ""}`.trim();
        }
        if (!showIcons && !textContent) {
          textContent = fallbackLabel;
        }
        if (textContent) {
          textSpan.textContent = textContent;
          pill.appendChild(textSpan);
        }
        previewButton.appendChild(pill);
        previewButton.style.whiteSpace = "nowrap";
        previewButton.style.alignSelf = "flex-start";
        container.appendChild(previewButton);
        return { container, folderPreview: previewButton };
      })(fname, fconfig);
      const rightBtns = document.createElement("div");
      rightBtns.style.display = "flex";
      rightBtns.style.gap = "4px";
      rightBtns.style.alignItems = "center";
      rightBtns.style.width = "130px";
      rightBtns.style.justifyContent = "flex-start";
      rightBtns.style.paddingLeft = "8px";
      rightBtns.style.paddingRight = "12px";
      const hiddenCheckboxContainer = document.createElement("div");
      hiddenCheckboxContainer.style.display = "flex";
      hiddenCheckboxContainer.style.alignItems = "center";
      hiddenCheckboxContainer.style.justifyContent = "center";
      hiddenCheckboxContainer.style.width = "36px";
      hiddenCheckboxContainer.style.marginRight = "4px";
      hiddenCheckboxContainer.style.padding = "2px";
      hiddenCheckboxContainer.style.borderRadius = "3px";
      hiddenCheckboxContainer.style.cursor = "pointer";
      hiddenCheckboxContainer.title = t("m_61e773658c92");
      const hiddenCheckbox = document.createElement("input");
      hiddenCheckbox.type = "checkbox";
      hiddenCheckbox.checked = !fconfig.hidden;
      hiddenCheckbox.style.cursor = "pointer";
      hiddenCheckbox.style.accentColor = "var(--primary-color, #3B82F6)";
      hiddenCheckbox.style.margin = "0";
      hiddenCheckbox.style.transform = "scale(1.1)";
      hiddenCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        const newHiddenState = !hiddenCheckbox.checked;
        fconfig.hidden = newHiddenState;
        persistButtonConfig();
        console.log(t("m_0f7d8cda98a5", {
          folderName: fname,
          state: fconfig.hidden
        }));
        updateButtonContainer();
      });
      hiddenCheckbox.addEventListener("click", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
      hiddenCheckboxContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.target !== hiddenCheckbox) {
          hiddenCheckbox.checked = !hiddenCheckbox.checked;
          const changeEvent = new Event("change", { bubbles: false });
          hiddenCheckbox.dispatchEvent(changeEvent);
        }
      });
      hiddenCheckboxContainer.appendChild(hiddenCheckbox);
      const editFolderBtn = document.createElement("button");
      editFolderBtn.textContent = "✏️";
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
      editFolderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showFolderEditDialog(fname, fconfig, (newFolderName) => {
          selectedFolderName = newFolderName;
          renderFolderList();
          renderButtonList();
        });
      });
      const deleteFolderBtn = document.createElement("button");
      deleteFolderBtn.textContent = "🗑️";
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
      deleteFolderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteFolderConfirmDialog(fname, () => {
          const allFolders = buttonConfig.folderOrder;
          selectedFolderName = allFolders[0] || null;
          renderFolderList();
          renderButtonList();
          updateCounters();
        });
      });
      rightBtns.appendChild(hiddenCheckboxContainer);
      rightBtns.appendChild(editFolderBtn);
      rightBtns.appendChild(deleteFolderBtn);
      folderItem.appendChild(leftInfo);
      folderItem.appendChild(rightBtns);
      folderItem.addEventListener("click", (e) => {
        if (rightBtns.contains(e.target)) {
          return;
        }
        selectedFolderName = fname;
        renderFolderList();
        renderButtonList();
      });
      folderItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", fname);
        folderItem.style.opacity = "0.5";
      });
      folderItem.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      folderItem.addEventListener("dragenter", () => {
        folderItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
      });
      folderItem.addEventListener("dragleave", () => {
        folderItem.style.border = "none";
      });
      folderItem.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedFolder = e.dataTransfer.getData("text/plain");
        if (draggedFolder && draggedFolder !== fname) {
          const draggedIndex = buttonConfig.folderOrder.indexOf(draggedFolder);
          const targetIndex = buttonConfig.folderOrder.indexOf(fname);
          if (draggedIndex > -1 && targetIndex > -1) {
            const [removed] = buttonConfig.folderOrder.splice(draggedIndex, 1);
            buttonConfig.folderOrder.splice(targetIndex, 0, removed);
            persistButtonConfig();
            renderFolderList();
            renderButtonList();
            console.log(t("m_3edae7a44072", {
              draggedFolder,
              targetFolder: fname
            }));
            updateButtonContainer();
          }
        }
        const buttonData = e.dataTransfer.getData("application/json");
        if (buttonData) {
          try {
            const { buttonName: draggedBtnName, sourceFolder } = JSON.parse(buttonData);
            if (draggedBtnName && sourceFolder && sourceFolder !== fname) {
              const button = buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
              if (button) {
                delete buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                buttonConfig.folders[fname].buttons[draggedBtnName] = button;
                persistButtonConfig();
                renderFolderList();
                renderButtonList();
                console.log(t("m_e42b7df278dc", {
                  buttonName: draggedBtnName,
                  sourceFolder,
                  targetFolder: fname
                }));
                updateButtonContainer();
              }
            }
          } catch (error) {
            console.error(t("m_e38e5c156eb8"), error);
          }
        }
        folderItem.style.border = "none";
      });
      folderItem.addEventListener("dragend", () => {
        folderItem.style.opacity = "1";
      });
      folderListContainer.appendChild(folderItem);
    });
  };
  var updateCounters = () => {
    const totalFolders = Object.keys(buttonConfig.folders).length;
    const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
      return sum + Object.keys(folder.buttons).length;
    }, 0);
    const folderCountBadge = queryUI("#folderCountBadge");
    if (folderCountBadge) {
      folderCountBadge.textContent = totalFolders.toString();
      folderCountBadge.title = t("m_0b60cfe06c48", { count: totalFolders });
    }
    const totalButtonCountBadge = queryUI("#totalButtonCountBadge");
    if (totalButtonCountBadge) {
      totalButtonCountBadge.textContent = totalButtons.toString();
      totalButtonCountBadge.title = t("m_5261cd43403d", { count: totalButtons });
    }
    if (selectedFolderName && buttonConfig.folders[selectedFolderName]) {
      const currentFolderButtonCount = Object.keys(buttonConfig.folders[selectedFolderName].buttons).length;
      const currentFolderBadge = queryUI("#currentFolderButtonCount");
      if (currentFolderBadge) {
        currentFolderBadge.textContent = currentFolderButtonCount.toString();
        currentFolderBadge.title = t("m_98bacf0e9e88", {
          folderName: selectedFolderName,
          count: currentFolderButtonCount
        });
      }
    }
    console.log(t("m_47347d4c883d", {
      folderCount: totalFolders,
      buttonCount: totalButtons
    }));
  };
  var renderButtonList = () => {
    if (!buttonListContainer) return;
    setTrustedHTML(buttonListContainer, "");
    scheduleSettingsHeaderButtonAlignment();
    if (!selectedFolderName) return;
    const currentFolderConfig = buttonConfig.folders[selectedFolderName];
    if (!currentFolderConfig) return;
    const rightHeader = document.createElement("div");
    rightHeader.style.display = "flex";
    rightHeader.style.justifyContent = "space-between";
    rightHeader.style.alignItems = "center";
    rightHeader.style.marginBottom = "8px";
    const folderNameLabel = document.createElement("h3");
    folderNameLabel.style.display = "flex";
    folderNameLabel.style.alignItems = "center";
    folderNameLabel.style.gap = "10px";
    folderNameLabel.style.margin = "0";
    const folderNameText = document.createElement("span");
    setTrustedHTML(folderNameText, `➤ <strong>${selectedFolderName}</strong>`);
    const buttonCountBadge = document.createElement("span");
    buttonCountBadge.id = "currentFolderButtonCount";
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
    const buttonCount = Object.keys(currentFolderConfig.buttons).length;
    buttonCountBadge.textContent = buttonCount.toString();
    buttonCountBadge.title = t("m_98bacf0e9e88", {
      folderName: selectedFolderName,
      count: buttonCount
    });
    buttonCountBadge.addEventListener("mouseenter", () => {
      buttonCountBadge.style.transform = "scale(1.15)";
      buttonCountBadge.style.boxShadow = "0 2px 5px rgba(0,0,0,0.15)";
    });
    buttonCountBadge.addEventListener("mouseleave", () => {
      buttonCountBadge.style.transform = "scale(1)";
      buttonCountBadge.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    });
    folderNameLabel.appendChild(folderNameText);
    folderNameLabel.appendChild(buttonCountBadge);
    const addNewButtonBtn = document.createElement("button");
    Object.assign(addNewButtonBtn.style, styles.button, {
      backgroundColor: "var(--add-color, #fd7e14)",
      color: "white",
      borderRadius: "4px"
    });
    addNewButtonBtn.setAttribute("data-settings-add-button", "true");
    addNewButtonBtn.textContent = t("m_de56d7d6dfd2");
    addNewButtonBtn.addEventListener("click", () => {
      showButtonEditDialog(selectedFolderName, "", {}, () => {
        renderButtonList();
      });
    });
    rightHeader.appendChild(folderNameLabel);
    rightHeader.appendChild(addNewButtonBtn);
    buttonListContainer.appendChild(rightHeader);
    scheduleSettingsHeaderButtonAlignment();
    const contentWithHeaderContainer = document.createElement("div");
    contentWithHeaderContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px;
    `;
    const buttonHeaderBar = document.createElement("div");
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
    const leftButtonHeaderLabel = document.createElement("div");
    leftButtonHeaderLabel.textContent = t("m_f0ff49e5f7e6");
    leftButtonHeaderLabel.style.flex = "1";
    leftButtonHeaderLabel.style.textAlign = "left";
    leftButtonHeaderLabel.style.paddingLeft = "calc(8px + 1em)";
    const rightButtonHeaderLabels = document.createElement("div");
    rightButtonHeaderLabels.style.display = "flex";
    rightButtonHeaderLabels.style.gap = "4px";
    rightButtonHeaderLabels.style.alignItems = "center";
    rightButtonHeaderLabels.style.width = "240px";
    rightButtonHeaderLabels.style.paddingLeft = "8px";
    rightButtonHeaderLabels.style.paddingRight = "12px";
    const variableLabel = document.createElement("div");
    variableLabel.textContent = t("m_b418ca60d417");
    variableLabel.style.width = "110px";
    variableLabel.style.textAlign = "center";
    variableLabel.style.fontSize = "12px";
    variableLabel.style.marginLeft = "-1em";
    const autoSubmitLabel = document.createElement("div");
    autoSubmitLabel.textContent = t("m_473202b8cf49");
    autoSubmitLabel.style.width = "64px";
    autoSubmitLabel.style.textAlign = "center";
    autoSubmitLabel.style.fontSize = "12px";
    autoSubmitLabel.style.marginLeft = "calc(-0.5em)";
    const editButtonLabel = document.createElement("div");
    editButtonLabel.textContent = t("m_c9c77517fe85");
    editButtonLabel.style.width = "40px";
    editButtonLabel.style.textAlign = "center";
    editButtonLabel.style.fontSize = "12px";
    const deleteButtonLabel = document.createElement("div");
    deleteButtonLabel.textContent = t("m_3755f56f2f83");
    deleteButtonLabel.style.width = "36px";
    deleteButtonLabel.style.textAlign = "center";
    deleteButtonLabel.style.fontSize = "12px";
    rightButtonHeaderLabels.appendChild(variableLabel);
    rightButtonHeaderLabels.appendChild(autoSubmitLabel);
    rightButtonHeaderLabels.appendChild(editButtonLabel);
    rightButtonHeaderLabels.appendChild(deleteButtonLabel);
    buttonHeaderBar.appendChild(leftButtonHeaderLabel);
    buttonHeaderBar.appendChild(rightButtonHeaderLabels);
    const btnScrollArea = document.createElement("div");
    btnScrollArea.style.cssText = `
        flex: 1;
        padding: 8px;
        overflow-y: visible;
        min-height: 0;
    `;
    const currentFolderButtons = Object.entries(currentFolderConfig.buttons);
    const createButtonPreview = (btnName, btnCfg) => {
      const btnEl = createCustomButtonElement(btnName, btnCfg);
      btnEl.style.marginBottom = "0px";
      btnEl.style.marginRight = "8px";
      btnEl.style.cursor = "grab";
      btnEl.style.flexShrink = "1";
      btnEl.style.minWidth = "0";
      btnEl.style.maxWidth = "100%";
      btnEl.style.whiteSpace = "normal";
      btnEl.style.wordBreak = "break-word";
      btnEl.style.overflow = "visible";
      btnEl.style.lineHeight = "1.4";
      btnEl.style.overflowWrap = "anywhere";
      btnEl.style.display = "inline-flex";
      btnEl.style.flexWrap = "wrap";
      btnEl.style.alignItems = "center";
      btnEl.style.justifyContent = "flex-start";
      btnEl.style.columnGap = "6px";
      btnEl.style.rowGap = "2px";
      btnEl.style.alignSelf = "flex-start";
      return btnEl;
    };
    currentFolderButtons.forEach(([btnName, cfg]) => {
      const btnItem = document.createElement("div");
      btnItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            padding: 4px;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px;
            background-color: var(--button-bg, #f3f4f6);
            cursor: move;
            width: 100%;
            box-sizing: border-box;
            overflow: visible;
        `;
      btnItem.setAttribute("draggable", "true");
      btnItem.setAttribute("data-button-name", btnName);
      const leftPart = document.createElement("div");
      leftPart.style.display = "flex";
      leftPart.style.alignItems = "flex-start";
      leftPart.style.gap = "8px";
      leftPart.style.flex = "1";
      leftPart.style.minWidth = "0";
      leftPart.style.overflow = "visible";
      const previewWrapper = document.createElement("div");
      previewWrapper.style.display = "flex";
      previewWrapper.style.alignItems = "flex-start";
      previewWrapper.style.flex = "1 1 auto";
      previewWrapper.style.maxWidth = "100%";
      previewWrapper.style.minWidth = "0";
      previewWrapper.style.overflow = "visible";
      previewWrapper.style.alignSelf = "flex-start";
      const btnPreview = createButtonPreview(btnName, cfg);
      previewWrapper.appendChild(btnPreview);
      leftPart.appendChild(previewWrapper);
      const opsDiv = document.createElement("div");
      opsDiv.style.display = "flex";
      opsDiv.style.gap = "4px";
      opsDiv.style.alignItems = "center";
      opsDiv.style.width = "240px";
      opsDiv.style.paddingLeft = "8px";
      opsDiv.style.paddingRight = "12px";
      opsDiv.style.flexShrink = "0";
      const variableInfoContainer = document.createElement("div");
      variableInfoContainer.style.display = "flex";
      variableInfoContainer.style.alignItems = "center";
      variableInfoContainer.style.justifyContent = "center";
      variableInfoContainer.style.flexDirection = "column";
      variableInfoContainer.style.width = "110px";
      variableInfoContainer.style.fontSize = "12px";
      variableInfoContainer.style.lineHeight = "1.2";
      variableInfoContainer.style.wordBreak = "break-word";
      variableInfoContainer.style.textAlign = "center";
      variableInfoContainer.style.color = "var(--text-color, #333333)";
      if (cfg.type === "template") {
        const variablesUsed = extractTemplateVariables(cfg.text || "");
        if (variablesUsed.length > 0) {
          const displayText = variablesUsed.join(isNonChineseLocale() ? ", " : "、");
          variableInfoContainer.textContent = displayText;
          variableInfoContainer.title = t("m_1f0526af38c9", { variable: displayText });
        } else {
          variableInfoContainer.textContent = t("m_72077749f794");
          variableInfoContainer.title = t("m_a9a50f95b5e3");
        }
      } else {
        variableInfoContainer.textContent = "—";
        variableInfoContainer.title = t("m_792829e5fbb9");
      }
      const autoSubmitContainer = document.createElement("div");
      autoSubmitContainer.style.display = "flex";
      autoSubmitContainer.style.alignItems = "center";
      autoSubmitContainer.style.justifyContent = "center";
      autoSubmitContainer.style.width = "60px";
      const autoSubmitCheckbox = document.createElement("input");
      autoSubmitCheckbox.type = "checkbox";
      autoSubmitCheckbox.checked = cfg.autoSubmit || false;
      autoSubmitCheckbox.style.cursor = "pointer";
      autoSubmitCheckbox.style.accentColor = "var(--primary-color, #3B82F6)";
      autoSubmitCheckbox.style.margin = "0";
      autoSubmitCheckbox.style.transform = "scale(1.1)";
      autoSubmitCheckbox.addEventListener("change", () => {
        cfg.autoSubmit = autoSubmitCheckbox.checked;
        persistButtonConfig();
        console.log(t("m_06aa3f222c01", {
          buttonName: btnName,
          state: autoSubmitCheckbox.checked
        }));
      });
      autoSubmitContainer.appendChild(autoSubmitCheckbox);
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
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
        `;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showButtonEditDialog(selectedFolderName, btnName, cfg, () => {
          renderButtonList();
        });
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
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
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteButtonConfirmDialog(selectedFolderName, btnName, () => {
          renderButtonList();
        });
      });
      opsDiv.appendChild(variableInfoContainer);
      opsDiv.appendChild(autoSubmitContainer);
      opsDiv.appendChild(editBtn);
      opsDiv.appendChild(deleteBtn);
      btnItem.appendChild(leftPart);
      btnItem.appendChild(opsDiv);
      btnItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("application/json", JSON.stringify({
          buttonName: btnName,
          sourceFolder: selectedFolderName
        }));
        btnItem.style.opacity = "0.5";
      });
      btnItem.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      btnItem.addEventListener("dragenter", () => {
        btnItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
      });
      btnItem.addEventListener("dragleave", () => {
        btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
      });
      btnItem.addEventListener("drop", (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
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
            reordered.forEach((k) => {
              newOrderedMap[k] = buttonConfig.folders[selectedFolderName].buttons[k];
            });
            buttonConfig.folders[selectedFolderName].buttons = newOrderedMap;
            persistButtonConfig();
            renderButtonList();
            console.log(t("m_d7b8de9c54ed", {
              buttonName: draggedBtnName,
              targetName: btnName
            }));
            updateButtonContainer();
          }
        }
        btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
      });
      btnItem.addEventListener("dragend", () => {
        btnItem.style.opacity = "1";
      });
      btnScrollArea.appendChild(btnItem);
    });
    contentWithHeaderContainer.appendChild(buttonHeaderBar);
    contentWithHeaderContainer.appendChild(btnScrollArea);
    buttonListContainer.appendChild(contentWithHeaderContainer);
  };
  var showUnifiedSettingsDialog = () => {
    if (settingsDialogMainContainer) {
      settingsDialogMainContainer.style.minHeight = "";
      settingsDialogMainContainer = null;
    }
    if (currentSettingsOverlay) {
      closeExistingOverlay(currentSettingsOverlay);
      currentSettingsOverlay = null;
    }
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "920px",
      maxWidth: "95vw",
      maxHeight: "80vh",
      padding: "24px",
      zIndex: "11000",
      closeOnOverlayClick: true,
      closeOnEscape: true,
      overlayClassName: "settings-overlay",
      dialogClassName: "settings-dialog",
      dialogStyles: {
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      },
      beforeClose: () => {
        persistButtonConfig();
        closeConfigOverlayHandler();
        if (settingsDialogMainContainer) {
          settingsDialogMainContainer.style.minHeight = "";
          settingsDialogMainContainer = null;
        }
        attachButtons();
        updateButtonContainer();
        return true;
      },
      onClose: () => {
        if (typeof overlay.__cttfSettingsHeaderAlignmentCleanup === "function") {
          overlay.__cttfSettingsHeaderAlignmentCleanup();
          overlay.__cttfSettingsHeaderAlignmentCleanup = null;
        }
        if (currentSettingsOverlay === overlay) {
          currentSettingsOverlay = null;
        }
      }
    });
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "12px";
    header.style.marginBottom = "16px";
    const title = document.createElement("h2");
    title.style.display = "flex";
    title.style.alignItems = "center";
    title.style.gap = "12px";
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.fontWeight = "600";
    title.style.flex = "1";
    title.style.minWidth = "0";
    const titleText = document.createElement("span");
    titleText.textContent = t("m_16dba9301e32");
    const collapseToggleBtn = document.createElement("button");
    collapseToggleBtn.type = "button";
    collapseToggleBtn.style.cssText = `
            background-color: transparent;
            color: var(--text-color, #333333);
            border: none;
            border-radius: 4px;
            padding: 4px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
    collapseToggleBtn.title = t("m_27964bc08178");
    collapseToggleBtn.setAttribute("aria-label", collapseToggleBtn.title);
    const collapseToggleSVG = `<svg fill="currentColor" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 7.7148 49.5742 L 48.2852 49.5742 C 53.1836 49.5742 55.6446 47.1367 55.6446 42.3086 L 55.6446 13.6914 C 55.6446 8.8633 53.1836 6.4258 48.2852 6.4258 L 7.7148 6.4258 C 2.8398 6.4258 .3554 8.8398 .3554 13.6914 L .3554 42.3086 C .3554 47.1602 2.8398 49.5742 7.7148 49.5742 Z M 7.7851 45.8008 C 5.4413 45.8008 4.1288 44.5586 4.1288 42.1211 L 4.1288 13.8789 C 4.1288 11.4414 5.4413 10.1992 7.7851 10.1992 L 18.2148 10.1992 L 18.2148 45.8008 Z M 48.2147 10.1992 C 50.5350 10.1992 51.8708 11.4414 51.8708 13.8789 L 51.8708 42.1211 C 51.8708 44.5586 50.5350 45.8008 48.2147 45.8008 L 21.8944 45.8008 L 21.8944 10.1992 Z M 13.7148 18.8945 C 14.4179 18.8945 15.0507 18.2617 15.0507 17.5820 C 15.0507 16.8789 14.4179 16.2696 13.7148 16.2696 L 8.6757 16.2696 C 7.9726 16.2696 7.3632 16.8789 7.3632 17.5820 C 7.3632 18.2617 7.9726 18.8945 8.6757 18.8945 Z M 13.7148 24.9649 C 14.4179 24.9649 15.0507 24.3320 15.0507 23.6289 C 15.0507 22.9258 14.4179 22.3398 13.7148 22.3398 L 8.6757 22.3398 C 7.9726 22.3398 7.3632 22.9258 7.3632 23.6289 C 7.3632 24.3320 7.9726 24.9649 8.6757 24.9649 Z M 13.7148 31.0118 C 14.4179 31.0118 15.0507 30.4258 15.0507 29.7227 C 15.0507 29.0196 14.4179 28.4102 13.7148 28.4102 L 8.6757 28.4102 C 7.9726 28.4102 7.3632 29.0196 7.3632 29.7227 C 7.3632 30.4258 7.9726 31.0118 8.6757 31.0118 Z"></path></g></svg>`;
    setTrustedHTML(collapseToggleBtn, collapseToggleSVG);
    collapseToggleBtn.style.flex = "0 0 auto";
    collapseToggleBtn.style.flexShrink = "0";
    collapseToggleBtn.style.width = "28px";
    collapseToggleBtn.style.height = "28px";
    collapseToggleBtn.style.minWidth = "28px";
    collapseToggleBtn.style.minHeight = "28px";
    collapseToggleBtn.style.maxWidth = "28px";
    collapseToggleBtn.style.maxHeight = "28px";
    collapseToggleBtn.style.padding = "0";
    collapseToggleBtn.style.lineHeight = "0";
    collapseToggleBtn.style.boxSizing = "border-box";
    collapseToggleBtn.style.aspectRatio = "1 / 1";
    const collapseToggleIcon = collapseToggleBtn.querySelector("svg");
    if (collapseToggleIcon) {
      collapseToggleIcon.style.width = "16px";
      collapseToggleIcon.style.height = "16px";
      collapseToggleIcon.style.display = "block";
      collapseToggleIcon.style.flex = "0 0 auto";
    }
    const countersContainer = document.createElement("div");
    countersContainer.style.display = "flex";
    countersContainer.style.gap = "8px";
    countersContainer.style.alignItems = "center";
    const folderCountBadge = document.createElement("span");
    folderCountBadge.id = "folderCountBadge";
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
    const totalButtonCountBadge = document.createElement("span");
    totalButtonCountBadge.id = "totalButtonCountBadge";
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
    const totalFolders = Object.keys(buttonConfig.folders).length;
    const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
      return sum + Object.keys(folder.buttons).length;
    }, 0);
    folderCountBadge.textContent = totalFolders.toString();
    folderCountBadge.title = t("m_0b60cfe06c48", { count: totalFolders });
    totalButtonCountBadge.textContent = totalButtons.toString();
    totalButtonCountBadge.title = t("m_5261cd43403d", { count: totalButtons });
    [folderCountBadge, totalButtonCountBadge].forEach((badge) => {
      badge.addEventListener("mouseenter", () => {
        badge.style.transform = "scale(1.1)";
        badge.style.boxShadow = "0 3px 6px rgba(0,0,0,0.15)";
      });
      badge.addEventListener("mouseleave", () => {
        badge.style.transform = "scale(1)";
        badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      });
    });
    countersContainer.appendChild(folderCountBadge);
    countersContainer.appendChild(totalButtonCountBadge);
    title.appendChild(collapseToggleBtn);
    title.appendChild(titleText);
    title.appendChild(countersContainer);
    const headerBtnsWrapper = document.createElement("div");
    headerBtnsWrapper.style.display = "flex";
    headerBtnsWrapper.style.alignItems = "center";
    headerBtnsWrapper.style.gap = `${SETTINGS_HEADER_BUTTON_GAP}px`;
    headerBtnsWrapper.style.flexWrap = "wrap";
    headerBtnsWrapper.style.justifyContent = "flex-end";
    const automationBtn = document.createElement("button");
    automationBtn.innerText = t("m_f870f5d3c7fa");
    automationBtn.type = "button";
    automationBtn.setAttribute("data-settings-header-action", "automation");
    automationBtn.style.backgroundColor = "var(--info-color, #4F46E5)";
    automationBtn.style.color = "white";
    automationBtn.style.border = "none";
    automationBtn.style.borderRadius = "4px";
    automationBtn.style.padding = "5px 10px";
    automationBtn.style.cursor = "pointer";
    automationBtn.style.fontSize = "14px";
    automationBtn.addEventListener("click", () => {
      showAutomationSettingsDialog();
    });
    headerBtnsWrapper.appendChild(automationBtn);
    const styleMgmtBtn = document.createElement("button");
    styleMgmtBtn.innerText = t("m_58389daa203e");
    styleMgmtBtn.type = "button";
    styleMgmtBtn.style.backgroundColor = "var(--info-color, #4F46E5)";
    styleMgmtBtn.style.color = "white";
    styleMgmtBtn.style.border = "none";
    styleMgmtBtn.style.borderRadius = "4px";
    styleMgmtBtn.style.padding = "5px 10px";
    styleMgmtBtn.style.cursor = "pointer";
    styleMgmtBtn.style.fontSize = "14px";
    styleMgmtBtn.addEventListener("click", () => {
      showStyleSettingsDialog();
    });
    headerBtnsWrapper.appendChild(styleMgmtBtn);
    const openConfigBtn = createConfigSettingsButton();
    headerBtnsWrapper.appendChild(openConfigBtn);
    const closeSettingsBtn = createDialogCloseIconButton((event) => {
      void overlay.__cttfRequestClose("button", event);
    });
    closeSettingsBtn.style.marginLeft = `${SETTINGS_HEADER_BUTTON_GAP}px`;
    settingsHeaderActionButtons = headerBtnsWrapper;
    settingsHeaderCloseButton = closeSettingsBtn;
    header.appendChild(title);
    header.appendChild(headerBtnsWrapper);
    header.appendChild(closeSettingsBtn);
    const mainContainer = document.createElement("div");
    mainContainer.style.display = "flex";
    mainContainer.style.flex = "1";
    mainContainer.style.overflow = "hidden";
    mainContainer.style.flexWrap = "nowrap";
    mainContainer.style.overflowX = "auto";
    mainContainer.style.borderTop = `1px solid var(--border-color, #e5e7eb)`;
    settingsDialogMainContainer = mainContainer;
    const folderPanel = document.createElement("div");
    folderPanel.style.display = "flex";
    folderPanel.style.flexDirection = "column";
    folderPanel.style.width = "280px";
    folderPanel.style.minWidth = "280px";
    folderPanel.style.marginRight = "12px";
    folderPanel.style.overflowY = "auto";
    folderPanel.style.padding = "2px 8px 4px 2px";
    const folderHeaderBar = document.createElement("div");
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
    const leftHeaderLabel = document.createElement("div");
    leftHeaderLabel.textContent = t("m_6af274b8d873");
    leftHeaderLabel.style.flex = "1";
    leftHeaderLabel.style.textAlign = "left";
    leftHeaderLabel.style.paddingLeft = "calc(8px + 1em)";
    const rightHeaderLabels = document.createElement("div");
    rightHeaderLabels.style.display = "flex";
    rightHeaderLabels.style.gap = "0px";
    rightHeaderLabels.style.alignItems = "center";
    rightHeaderLabels.style.width = "140px";
    rightHeaderLabels.style.paddingLeft = "8px";
    rightHeaderLabels.style.paddingRight = "12px";
    const showLabel = document.createElement("div");
    showLabel.textContent = t("m_71b6771bc789");
    showLabel.style.width = "36px";
    showLabel.style.textAlign = "center";
    showLabel.style.fontSize = "12px";
    showLabel.style.marginRight = "4px";
    const editLabel = document.createElement("div");
    editLabel.textContent = t("m_c9c77517fe85");
    editLabel.style.width = "36px";
    editLabel.style.textAlign = "center";
    editLabel.style.fontSize = "12px";
    editLabel.style.marginRight = "4px";
    const deleteLabel = document.createElement("div");
    deleteLabel.textContent = t("m_3755f56f2f83");
    deleteLabel.style.width = "36px";
    deleteLabel.style.textAlign = "center";
    deleteLabel.style.fontSize = "12px";
    rightHeaderLabels.appendChild(showLabel);
    rightHeaderLabels.appendChild(editLabel);
    rightHeaderLabels.appendChild(deleteLabel);
    folderHeaderBar.appendChild(leftHeaderLabel);
    folderHeaderBar.appendChild(rightHeaderLabels);
    folderListContainer = document.createElement("div");
    folderListContainer.style.flex = "1";
    folderListContainer.style.overflowY = "auto";
    folderListContainer.style.padding = "8px";
    folderListContainer.style.direction = "rtl";
    folderListContainer.style.border = "1px solid var(--border-color, #e5e7eb)";
    folderListContainer.style.borderTop = "none";
    folderListContainer.style.borderRadius = "0 0 4px 4px";
    const folderAddContainer = document.createElement("div");
    folderAddContainer.style.padding = "8px";
    folderAddContainer.style.display = "flex";
    folderAddContainer.style.justifyContent = "center";
    const addNewFolderBtn = document.createElement("button");
    Object.assign(addNewFolderBtn.style, styles.button, {
      backgroundColor: "var(--add-color, #fd7e14)",
      color: "white",
      borderRadius: "4px"
    });
    addNewFolderBtn.textContent = t("m_09b1c4a5e9a1");
    addNewFolderBtn.addEventListener("click", () => {
      showFolderEditDialog("", {}, (newFolderName) => {
        selectedFolderName = newFolderName;
        renderFolderList();
        renderButtonList();
        console.log(t("m_6219b5d715a7", { folderName: newFolderName }));
      });
    });
    folderAddContainer.appendChild(addNewFolderBtn);
    folderPanel.appendChild(folderHeaderBar);
    folderPanel.appendChild(folderListContainer);
    folderPanel.appendChild(folderAddContainer);
    buttonListContainer = document.createElement("div");
    buttonListContainer.style.flex = "1";
    buttonListContainer.style.overflowY = "auto";
    buttonListContainer.style.display = "flex";
    buttonListContainer.style.flexDirection = "column";
    buttonListContainer.style.padding = "8px 8px 4px 8px";
    buttonListContainer.style.minWidth = "520px";
    const updateFolderPanelVisibility = () => {
      const container = settingsDialogMainContainer || mainContainer;
      if (isSettingsFolderPanelCollapsed) {
        if (container) {
          const currentHeight = container.offsetHeight;
          if (currentHeight > 0) {
            container.style.minHeight = `${currentHeight}px`;
          } else {
            window.requestAnimationFrame(() => {
              if (!isSettingsFolderPanelCollapsed) return;
              const activeContainer = settingsDialogMainContainer || container;
              if (!activeContainer) return;
              const measuredHeight = activeContainer.offsetHeight;
              if (measuredHeight > 0) {
                activeContainer.style.minHeight = `${measuredHeight}px`;
              }
            });
          }
        }
        folderPanel.style.display = "none";
        collapseToggleBtn.title = t("m_a69ce2034bc4");
        collapseToggleBtn.setAttribute("aria-label", t("m_a69ce2034bc4"));
      } else {
        folderPanel.style.display = "flex";
        collapseToggleBtn.title = t("m_27964bc08178");
        collapseToggleBtn.setAttribute("aria-label", t("m_27964bc08178"));
        if (container) {
          container.style.minHeight = "";
        }
      }
    };
    collapseToggleBtn.addEventListener("click", () => {
      isSettingsFolderPanelCollapsed = !isSettingsFolderPanelCollapsed;
      updateFolderPanelVisibility();
    });
    updateFolderPanelVisibility();
    renderFolderList();
    renderButtonList();
    mainContainer.appendChild(folderPanel);
    mainContainer.appendChild(buttonListContainer);
    const footer = document.createElement("div");
    footer.style.display = "none";
    dialog.appendChild(header);
    dialog.appendChild(mainContainer);
    dialog.appendChild(footer);
    scheduleSettingsHeaderButtonAlignment();
    const handleSettingsDialogResize = () => {
      scheduleSettingsHeaderButtonAlignment();
    };
    window.addEventListener("resize", handleSettingsDialogResize);
    overlay.__cttfSettingsHeaderAlignmentCleanup = () => {
      window.removeEventListener("resize", handleSettingsDialogResize);
      resetSettingsHeaderButtonAlignment();
    };
    currentSettingsOverlay = overlay;
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
      if (currentSettingsOverlay !== overlay) {
        return;
      }
      showUnifiedSettingsDialog();
    });
  };

  // src/features/configuration/drive-sync.js
  var DRIVE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
  var DRIVE_FILES_ENDPOINT = "https://www.googleapis.com/drive/v3/files";
  var DRIVE_UPLOAD_ENDPOINT = "https://www.googleapis.com/upload/drive/v3/files";
  var DEFAULT_STORAGE_KEY = "cttfDriveSettings";
  var DEFAULT_FILE_NAME = "[Chat] Template Text Folders.backup.json";
  var safeStringify = (value, fallback = "") => {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  };
  function createDriveSyncModule(options = {}) {
    const storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    const defaultFileName = options.defaultFileName || DEFAULT_FILE_NAME;
    const translate2 = typeof options.translate === "function" ? options.translate : (text) => text;
    let t2 = translate2;
    let driveAccessToken = "";
    let driveAccessTokenExpireAt = 0;
    const resolveGMRequest2 = () => {
      try {
        if (typeof GM_xmlhttpRequest === "function") {
          return GM_xmlhttpRequest;
        }
        if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.GM_xmlhttpRequest === "function") {
          return unsafeWindow.GM_xmlhttpRequest;
        }
        if (typeof window !== "undefined" && typeof window.GM_xmlhttpRequest === "function") {
          return window.GM_xmlhttpRequest;
        }
      } catch (_) {
      }
      return null;
    };
    const resolveFetch2 = () => {
      try {
        if (typeof fetch === "function") {
          return fetch;
        }
        if (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function") {
          return globalThis.fetch;
        }
        if (typeof window !== "undefined" && typeof window.fetch === "function") {
          return window.fetch.bind(window);
        }
        if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.fetch === "function") {
          return unsafeWindow.fetch.bind(unsafeWindow);
        }
      } catch (_) {
      }
      return null;
    };
    const performDriveRequest = async (options2 = {}) => {
      const attemptGM = async () => {
        const gmRequest = resolveGMRequest2();
        if (!gmRequest) return null;
        return new Promise((resolve, reject) => {
          try {
            gmRequest({
              method: options2.method || "GET",
              url: options2.url,
              headers: options2.headers,
              data: options2.data,
              onload: (response) => {
                const payload = {
                  status: response.status,
                  responseText: response.responseText || ""
                };
                if (payload.status === 0) {
                  reject(new Error("GM_xmlhttpRequest returned status 0 (likely blocked or offline)."));
                  return;
                }
                resolve(payload);
              },
              onerror: (err) => {
                const message = err?.error || err?.message || safeStringify(err, "{}");
                reject(new Error(message));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      };
      const attemptFetch = async () => {
        const fetchApi = resolveFetch2();
        if (!fetchApi) return null;
        const response = await fetchApi(options2.url, {
          method: options2.method || "GET",
          headers: options2.headers,
          body: options2.data,
          credentials: "omit",
          mode: "cors",
          cache: "no-store"
        });
        return {
          status: response.status,
          responseText: await response.text()
        };
      };
      const pref = driveSyncSettings.requestMode === "adguard" ? ["fetch", "gm"] : ["gm", "fetch"];
      let lastError = null;
      for (const method of pref) {
        try {
          if (method === "gm") {
            const res = await attemptGM();
            if (res) return res;
          } else {
            const res = await attemptFetch();
            if (res) return res;
          }
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("No request API available for Drive sync.");
    };
    const buildHttpError = (label, response) => {
      const status = response?.status ?? 0;
      const text = response?.responseText || "";
      const error = new Error(`${label} HTTP ${status}: ${text || "[empty response]"}`);
      error.status = status;
      error.responseText = text;
      return error;
    };
    const baseSettings = {
      enabled: false,
      clientId: "",
      clientSecret: "",
      refreshToken: "",
      fileId: "",
      fileName: defaultFileName,
      lastSyncedAt: 0,
      requestMode: "default",
      // 'default' | 'adguard'
      configCollapsed: false
    };
    const readSettings = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return { ...baseSettings };
        const parsed = JSON.parse(raw);
        return {
          ...baseSettings,
          ...parsed && typeof parsed === "object" ? parsed : {}
        };
      } catch (error) {
        console.warn("[CTTF] Drive settings parse failed:", error);
        return { ...baseSettings };
      }
    };
    let driveSyncSettings = readSettings();
    const persistSettings = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(driveSyncSettings));
      } catch (error) {
        console.warn("[CTTF] Drive settings persist failed:", error);
      }
    };
    const setTranslator = (fn) => {
      if (typeof fn === "function") {
        t2 = fn;
      }
    };
    const resetAuthCache = () => {
      driveAccessToken = "";
      driveAccessTokenExpireAt = 0;
    };
    const normalizeRequestMode = (value) => value === "adguard" ? "adguard" : "default";
    const normalizeBool = (value, fallback = false) => typeof value === "boolean" ? value : fallback;
    const updateSettings = (partial = {}) => {
      const prev = { ...driveSyncSettings };
      driveSyncSettings = {
        ...driveSyncSettings,
        ...partial,
        requestMode: normalizeRequestMode(partial.requestMode ?? driveSyncSettings.requestMode),
        configCollapsed: normalizeBool(partial.configCollapsed ?? driveSyncSettings.configCollapsed, false)
      };
      const name = (driveSyncSettings.fileName || "").trim();
      driveSyncSettings.fileName = name || defaultFileName;
      const credsChanged = prev.clientId !== driveSyncSettings.clientId || prev.clientSecret !== driveSyncSettings.clientSecret || prev.refreshToken !== driveSyncSettings.refreshToken;
      const fileTargetChanged = prev.fileName !== driveSyncSettings.fileName;
      if (credsChanged) {
        resetAuthCache();
        driveSyncSettings.fileId = "";
      } else if (fileTargetChanged) {
        driveSyncSettings.fileId = "";
      }
      persistSettings();
      return { ...driveSyncSettings };
    };
    const getFileName = () => {
      const name = (driveSyncSettings.fileName || "").trim();
      if (name) {
        return name;
      }
      driveSyncSettings.fileName = defaultFileName;
      persistSettings();
      return driveSyncSettings.fileName;
    };
    const hasDriveCredentials = () => Boolean(
      driveSyncSettings.clientId && driveSyncSettings.clientSecret && driveSyncSettings.refreshToken
    );
    const ensureDriveSyncApiAvailable = () => {
      const available = Boolean(resolveGMRequest2() || resolveFetch2());
      if (!available) {
        try {
          alert(t2("m_8db845c5073b"));
        } catch (_) {
        }
      }
      return available;
    };
    const refreshDriveAccessToken = async () => {
      const body = [
        ["client_id", driveSyncSettings.clientId],
        ["client_secret", driveSyncSettings.clientSecret],
        ["refresh_token", driveSyncSettings.refreshToken],
        ["grant_type", "refresh_token"]
      ].map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value || ""))}`).join("&");
      let response;
      try {
        response = await performDriveRequest({
          method: "POST",
          url: DRIVE_TOKEN_ENDPOINT,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: body
        });
      } catch (error) {
        throw new Error(`Drive token request failed: ${error?.message || safeStringify(error, "{}")}`);
      }
      const text = response.responseText || "";
      const status = response.status;
      const json = text ? JSON.parse(text) : {};
      if (status >= 200 && status < 300) {
        if (json.error) {
          throw new Error(`Drive token error: ${safeStringify(json, "[invalid json]")}`);
        }
        return json;
      }
      throw new Error(`Drive token HTTP ${status}: ${text || "[empty response]"}`);
    };
    async function ensureDriveAccessToken() {
      const now = Date.now();
      if (driveAccessToken && now < driveAccessTokenExpireAt - 6e4) {
        return driveAccessToken;
      }
      const tokenPayload = await refreshDriveAccessToken();
      driveAccessToken = tokenPayload.access_token;
      const expiresIn = Number(tokenPayload.expires_in) || 3600;
      driveAccessTokenExpireAt = now + expiresIn * 1e3;
      return driveAccessToken;
    }
    async function listDriveConfigFiles(token, targetName = getFileName()) {
      const params = new URLSearchParams({
        pageSize: "5",
        fields: "files(id,name,mimeType,modifiedTime,size)",
        orderBy: "modifiedTime desc"
      });
      const sanitizedName = (targetName || "").replace(/'/g, "\\'");
      params.set("q", `(trashed = false) and name = '${sanitizedName}'`);
      let response;
      try {
        response = await performDriveRequest({
          method: "GET",
          url: `${DRIVE_FILES_ENDPOINT}?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
      } catch (error) {
        throw new Error(`Drive list network error: ${error?.message || safeStringify(error, "{}")}`);
      }
      if (response.status >= 200 && response.status < 300) {
        const data = JSON.parse(response.responseText || "{}");
        return Array.isArray(data.files) ? data.files : [];
      }
      throw buildHttpError("Drive list", response);
    }
    async function downloadDriveFileContent(fileId, token) {
      const encoded = encodeURIComponent(fileId);
      let response;
      try {
        response = await performDriveRequest({
          method: "GET",
          url: `${DRIVE_FILES_ENDPOINT}/${encoded}?alt=media`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error2) {
        throw new Error(`Drive download network error: ${error2?.message || safeStringify(error2, "{}")}`);
      }
      if (response.status >= 200 && response.status < 300) {
        return response.responseText || "";
      }
      let parsed;
      try {
        parsed = response.responseText ? JSON.parse(response.responseText) : null;
      } catch {
        parsed = null;
      }
      const err = parsed?.error?.message ? `Drive download HTTP ${response.status}: ${parsed.error.message}` : `Drive download HTTP ${response.status}: ${response.responseText || ""}`;
      const error = new Error(err);
      error.status = response.status;
      error.responseText = response.responseText || "";
      throw error;
    }
    async function uploadDriveConfigFile({ token, fileId, fileName, content }) {
      const boundary = `cttfBoundary${Date.now()}`;
      const metadata = {
        name: fileName || getFileName(),
        mimeType: "application/json"
      };
      const multipartBody = [
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        JSON.stringify(metadata),
        `--${boundary}`,
        "Content-Type: application/json",
        "",
        content,
        `--${boundary}--`,
        ""
      ].join("\r\n");
      const hasFileId = Boolean(fileId);
      const targetUrl = hasFileId ? `${DRIVE_UPLOAD_ENDPOINT}/${encodeURIComponent(fileId)}?uploadType=multipart` : `${DRIVE_UPLOAD_ENDPOINT}?uploadType=multipart`;
      let response;
      try {
        response = await performDriveRequest({
          method: hasFileId ? "PATCH" : "POST",
          url: targetUrl,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/related; boundary=${boundary}`
          },
          data: multipartBody
        });
      } catch (error) {
        throw new Error(`Drive upload network error: ${error?.message || safeStringify(error, "{}")}`);
      }
      const text = response.responseText || "";
      const json = text ? JSON.parse(text) : {};
      if (response.status >= 200 && response.status < 300) {
        return json;
      }
      throw new Error(`Drive upload HTTP ${response.status}: ${text || "[empty response]"}`);
    }
    const formatDriveError = (error) => {
      if (!error) return t2("m_26718a2ad193") + "Unknown error";
      if (typeof error === "string") return error;
      if (error?.message) return error.message;
      try {
        return JSON.stringify(error);
      } catch {
        return String(error);
      }
    };
    async function syncUploadConfigToDrive(content) {
      const token = await ensureDriveAccessToken();
      const serializedContent = typeof content === "string" ? content : safeStringify(content, "{}");
      const targetName = getFileName();
      const cachedId = (driveSyncSettings.fileId || "").trim();
      let uploadResult = null;
      try {
        uploadResult = await uploadDriveConfigFile({
          token,
          fileId: cachedId,
          fileName: targetName,
          content: serializedContent
        });
      } catch (error) {
        if (cachedId) {
          uploadResult = await uploadDriveConfigFile({
            token,
            fileId: "",
            fileName: targetName,
            content: serializedContent
          });
        } else {
          throw error;
        }
      }
      const resolvedId = uploadResult?.id || cachedId || "";
      driveSyncSettings.fileId = resolvedId;
      driveSyncSettings.fileName = uploadResult?.name || targetName;
      driveSyncSettings.lastSyncedAt = Date.now();
      persistSettings();
      return {
        uploadResult,
        settings: { ...driveSyncSettings }
      };
    }
    const isAuthError = (status) => status === 401 || status === 403;
    const isFileStaleError = (status) => status === 404 || isAuthError(status) || status === 400;
    async function syncDownloadConfigFromDrive() {
      let token = await ensureDriveAccessToken();
      const targetName = getFileName();
      const buildNotFoundError = () => {
        const err = new Error(t2("m_345f882bd9c1"));
        err.code = "NOT_FOUND";
        return err;
      };
      const fetchLatestFileMeta = async () => {
        const files = await listDriveConfigFiles(token, targetName);
        if (!Array.isArray(files) || files.length === 0) {
          throw buildNotFoundError();
        }
        return files[0];
      };
      const attemptDownload = async ({ forceRelist = false, allowTokenRetry = true } = {}) => {
        let fileMeta2 = null;
        let fileId2 = (driveSyncSettings.fileId || "").trim();
        if (!fileId2 || forceRelist) {
          try {
            fileMeta2 = await fetchLatestFileMeta();
            fileId2 = fileMeta2?.id || "";
          } catch (error) {
            const status = error?.status || 0;
            if (allowTokenRetry && isAuthError(status)) {
              resetAuthCache();
              token = await ensureDriveAccessToken();
              return attemptDownload({ forceRelist, allowTokenRetry: false });
            }
            throw error;
          }
        }
        try {
          const content2 = await downloadDriveFileContent(fileId2, token);
          return { content: content2, fileId: fileId2, fileMeta: fileMeta2 };
        } catch (error) {
          const status = error?.status || 0;
          if (allowTokenRetry && isAuthError(status)) {
            resetAuthCache();
            token = await ensureDriveAccessToken();
            return attemptDownload({ forceRelist, allowTokenRetry: false });
          }
          if (!forceRelist && isFileStaleError(status)) {
            return attemptDownload({ forceRelist: true, allowTokenRetry: false });
          }
          throw error;
        }
      };
      const { content, fileId, fileMeta } = await attemptDownload();
      driveSyncSettings.fileId = fileId;
      driveSyncSettings.fileName = fileMeta?.name || driveSyncSettings.fileName || targetName;
      driveSyncSettings.lastSyncedAt = Date.now();
      persistSettings();
      return {
        id: fileId,
        name: driveSyncSettings.fileName,
        content,
        settings: { ...driveSyncSettings }
      };
    }
    return {
      setTranslator,
      getSettings: () => ({ ...driveSyncSettings }),
      updateSettings,
      persistSettings,
      resetAuthCache,
      getFileName,
      hasDriveCredentials,
      ensureDriveSyncApiAvailable,
      formatDriveError,
      syncUploadConfigToDrive,
      syncDownloadConfigFromDrive
    };
  }

  // src/features/configuration/index.js
  var currentDiffOverlay = null;
  var currentConfigOverlay = null;
  var currentConfirmOverlay3 = null;
  var DRIVE_HOST_PREFS_KEY = "cttfDriveHostPrefs";
  var driveSyncService = null;
  var cachedDriveSettings = null;
  var driveHostPrefs = (() => {
    const fallback = { enabled: false };
    try {
      const raw = localStorage.getItem(DRIVE_HOST_PREFS_KEY);
      if (!raw) return { ...fallback };
      const parsed = JSON.parse(raw);
      return { ...fallback, ...parsed && typeof parsed === "object" ? parsed : {} };
    } catch (error) {
      console.warn("[Chat] Template Text Folders · Drive host prefs parse failed:", error);
      return { ...fallback };
    }
  })();
  var persistDriveHostPrefs = (patch = {}) => {
    driveHostPrefs = { ...driveHostPrefs, ...patch };
    try {
      localStorage.setItem(DRIVE_HOST_PREFS_KEY, JSON.stringify(driveHostPrefs));
    } catch (error) {
      console.warn("[Chat] Template Text Folders · Drive host prefs persist failed:", error);
    }
    return driveHostPrefs;
  };
  var formatDriveModuleLoadError = (error) => {
    if (!error) return t("m_4f5c1763f26d");
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  };
  var ensureDriveSyncService = async () => {
    if (driveSyncService) {
      if (driveSyncService.setTranslator) {
        try {
          driveSyncService.setTranslator(t);
        } catch (_) {
        }
      }
      return driveSyncService;
    }
    driveSyncService = createDriveSyncModule({
      defaultFileName: DEFAULT_FILE_NAME,
      translate: t
    });
    if (!driveSyncService || typeof driveSyncService.getSettings !== "function") {
      throw new Error("Drive sync module is invalid.");
    }
    if (driveSyncService.setTranslator) {
      try {
        driveSyncService.setTranslator(t);
      } catch (_) {
      }
    }
    cachedDriveSettings = driveSyncService.getSettings();
    return driveSyncService;
  };
  function applyConfigFromRemote(importedConfig) {
    if (!importedConfig || typeof importedConfig !== "object") {
      throw new Error(t("m_5df1a31bee04"));
    }
    if (!importedConfig.folders || !importedConfig.folderOrder) {
      throw new Error(t("m_5df1a31bee04"));
    }
    setButtonConfig(importedConfig);
    hydrateButtonConfigDefaults(buttonConfig, { silent: true });
    persistButtonConfig();
    setSelectedFolderName(buttonConfig.folderOrder[0] || null);
    updateButtonContainer();
    try {
      applyDomainStyles();
    } catch (_) {
    }
    if (getCurrentSettingsOverlay() && typeof renderFolderList === "function") {
      renderFolderList();
    }
    if (getCurrentSettingsOverlay() && typeof renderButtonList === "function") {
      renderButtonList();
    }
    setTimeout(() => {
      try {
        updateCounters();
      } catch (_) {
      }
    }, 80);
  }
  function exportConfig() {
    const date = /* @__PURE__ */ new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const fileName = `[Chat] Template Text Folders「${yyyy}-${mm}-${dd}」「${hh}：${minutes}：${ss}」.json`;
    const dataStr = JSON.stringify(buttonConfig, null, 2);
    downloadTextFile(fileName, dataStr, "application/json");
    console.log(t("m_1c50edad461c"));
  }
  var cloneConfigForComparison = (value) => {
    return cloneSerializable(value, {
      fallback: value,
      logLabel: "[Chat] Template Text Folders config clone failed:"
    });
  };
  var toComparableStructure = (value) => {
    if (value === null || typeof value !== "object") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => toComparableStructure(item));
    }
    const sorted = {};
    Object.keys(value).sort().forEach((key) => {
      sorted[key] = toComparableStructure(value[key]);
    });
    return sorted;
  };
  var configsStructurallyEqual = (a, b) => {
    if (a === b) return true;
    try {
      const left = toComparableStructure(cloneConfigForComparison(a));
      const right = toComparableStructure(cloneConfigForComparison(b));
      return JSON.stringify(left) === JSON.stringify(right);
    } catch (error) {
      console.warn("[Chat] Template Text Folders config compare failed:", error);
      return false;
    }
  };
  function showImportDiffPreview(currentConfig, importedConfig, options = {}) {
    if (currentDiffOverlay) {
      closeExistingOverlay(currentDiffOverlay);
      currentDiffOverlay = null;
    }
    const currentLabel = options.currentLabel || t("m_fe67280a8e87");
    const importedLabel = options.importedLabel || t("m_280779a502b3");
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "960px",
      maxWidth: "96vw",
      maxHeight: "82vh",
      padding: "8px 18px 16px",
      zIndex: "14000",
      closeOnOverlayClick: false,
      overlayClassName: "import-diff-overlay",
      dialogClassName: "import-diff-dialog",
      overlayStyles: {
        backgroundColor: "var(--overlay-bg, rgba(0, 0, 0, 0.55))",
        backdropFilter: "blur(3px)"
      },
      dialogStyles: {
        borderRadius: "6px",
        boxShadow: "0 18px 36px var(--shadow-color, rgba(15, 23, 42, 0.35))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      },
      onClose: () => {
        if (currentDiffOverlay === overlay) {
          currentDiffOverlay = null;
        }
      }
    });
    currentDiffOverlay = overlay;
    const cleanupFns = [];
    const cleanup = () => {
      while (cleanupFns.length) {
        const fn = cleanupFns.pop();
        try {
          fn();
        } catch (error) {
          console.warn("[Chat] Template Text Folders diff preview cleanup failed:", error);
        }
      }
    };
    const closeDiffOverlay = () => {
      if (overlay) {
        overlay.__cttfCloseDiff = null;
      }
      if (!overlay || !overlay.isConnected) {
        currentDiffOverlay = null;
        cleanup();
        return;
      }
      closeExistingOverlay(overlay);
      currentDiffOverlay = null;
      cleanup();
    };
    overlay.__cttfCloseDiff = closeDiffOverlay;
    const onKeydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDiffOverlay();
      }
    };
    document.addEventListener("keydown", onKeydown);
    cleanupFns.push(() => document.removeEventListener("keydown", onKeydown));
    const header = document.createElement("div");
    header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            margin-bottom: 6px;
        `;
    const title = document.createElement("div");
    title.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color, #333333);
        `;
    title.textContent = t("m_8698a81857f3");
    const headerActions = document.createElement("div");
    headerActions.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
        `;
    const closeBtn = createDialogCloseIconButton(() => {
      closeDiffOverlay();
    });
    headerActions.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(headerActions);
    dialog.appendChild(header);
    dialog.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    const safeClone = (value) => {
      return cloneSerializable(value, {
        fallback: value,
        logLabel: "[Chat] Template Text Folders diff preview clone failed:"
      });
    };
    const normalizeConfig = (config) => {
      const safe = config && typeof config === "object" ? config : {};
      const folders = safe.folders && typeof safe.folders === "object" ? safeClone(safe.folders) || {} : {};
      const folderOrder = Array.isArray(safe.folderOrder) ? [...safe.folderOrder] : Object.keys(folders);
      return { folders, folderOrder };
    };
    const toComparable = (value) => {
      if (value === null || typeof value !== "object") {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map((item) => toComparable(item));
      }
      const sorted = {};
      Object.keys(value).sort().forEach((key) => {
        sorted[key] = toComparable(value[key]);
      });
      return sorted;
    };
    const deepEqual = (a, b) => {
      if (a === b) return true;
      try {
        return JSON.stringify(toComparable(a)) === JSON.stringify(toComparable(b));
      } catch (error) {
        console.warn("[Chat] Template Text Folders diff preview compare failed:", error);
        return false;
      }
    };
    const createBadge2 = (label, variant = "neutral") => {
      const badge = document.createElement("span");
      badge.textContent = label;
      badge.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.01em;
                white-space: nowrap;
            `;
      const variants = {
        added: {
          background: "rgba(34, 197, 94, 0.15)",
          color: "var(--success-color, #22c55e)",
          border: "1px solid rgba(34, 197, 94, 0.3)"
        },
        removed: {
          background: "rgba(248, 113, 113, 0.15)",
          color: "var(--danger-color, #f87171)",
          border: "1px solid rgba(248, 113, 113, 0.3)"
        },
        changed: {
          background: "rgba(59, 130, 246, 0.14)",
          color: "var(--info-color, #4F46E5)",
          border: "1px solid rgba(59, 130, 246, 0.28)"
        },
        neutral: {
          background: "var(--button-bg, #f3f4f6)",
          color: "var(--text-color, #333333)",
          border: "1px solid var(--border-color, #e5e7eb)"
        }
      };
      const style = variants[variant] || variants.neutral;
      badge.style.background = style.background;
      badge.style.color = style.color;
      badge.style.border = style.border;
      return badge;
    };
    const statusVariantMap = {
      added: "added",
      removed: "removed",
      changed: "changed",
      unchanged: "neutral"
    };
    const statusTextMap = {
      added: "m_2cd9e6ce817d",
      removed: "m_2f752c005ec5",
      changed: "m_82bf9384b6bd"
    };
    const folderCountLabelMap = {
      added: "+{{count}}",
      removed: "m_68dd983f9f14",
      changed: "m_213e31accd19"
    };
    const buttonCountLabelMap = {
      added: "+{{count}}",
      removed: "m_5513f5f64683",
      changed: "m_9d17eee70cd6"
    };
    const normalizeButtonNameForDiff = (value) => {
      if (value == null) return "";
      const str = typeof value === "string" ? value : String(value);
      const normalized = typeof str.normalize === "function" ? str.normalize("NFKC") : str;
      return normalized.replace(/\s+/g, " ").trim();
    };
    const computeButtonDiffs = (currentFolderConfig, importedFolderConfig) => {
      const result = [];
      const currentButtons = currentFolderConfig && currentFolderConfig.buttons && typeof currentFolderConfig.buttons === "object" ? currentFolderConfig.buttons : {};
      const importedButtons = importedFolderConfig && importedFolderConfig.buttons && typeof importedFolderConfig.buttons === "object" ? importedFolderConfig.buttons : {};
      const currentOrder = Object.keys(currentButtons);
      const importedOrder = Object.keys(importedButtons);
      const importedBuckets = /* @__PURE__ */ new Map();
      importedOrder.forEach((btnName, idx) => {
        const normalized = normalizeButtonNameForDiff(btnName);
        if (!importedBuckets.has(normalized)) {
          importedBuckets.set(normalized, []);
        }
        importedBuckets.get(normalized).push({ name: btnName, index: idx });
      });
      const usedImportedNames = /* @__PURE__ */ new Set();
      const matched = [];
      currentOrder.forEach((btnName) => {
        const normalized = normalizeButtonNameForDiff(btnName);
        const bucket = importedBuckets.get(normalized) || [];
        const matchedEntry = bucket.find((candidate) => !usedImportedNames.has(candidate.name)) || null;
        if (matchedEntry) {
          usedImportedNames.add(matchedEntry.name);
          matched.push({ currentName: btnName, importedName: matchedEntry.name, importedIndex: matchedEntry.index });
        } else {
          matched.push({ currentName: btnName, importedName: null, importedIndex: -1 });
        }
      });
      const matchedImportedNames = /* @__PURE__ */ new Set();
      const matchedIndices = matched.filter((pair) => pair.importedIndex >= 0).map((pair) => pair.importedIndex);
      const lisIndices = /* @__PURE__ */ new Set();
      (function markLIS(seq) {
        const n = seq.length;
        if (!n) return;
        const dp = Array(n).fill(1);
        const prev = Array(n).fill(-1);
        let bestLen = 1;
        let bestIdx = 0;
        for (let i = 1; i < n; i++) {
          for (let j = 0; j < i; j++) {
            if (seq[j] < seq[i] && dp[j] + 1 > dp[i]) {
              dp[i] = dp[j] + 1;
              prev[i] = j;
            }
          }
          if (dp[i] > bestLen) {
            bestLen = dp[i];
            bestIdx = i;
          }
        }
        let idx = bestIdx;
        while (idx >= 0) {
          lisIndices.add(seq[idx]);
          idx = prev[idx];
        }
      })(matchedIndices);
      matched.forEach((pair) => {
        const currentBtn = currentButtons[pair.currentName] || null;
        const importedBtn = pair.importedName ? importedButtons[pair.importedName] || null : null;
        const fieldsChanged = [];
        let renamed = false;
        if (currentBtn && importedBtn) {
          const keys = /* @__PURE__ */ new Set([...Object.keys(currentBtn), ...Object.keys(importedBtn)]);
          keys.forEach((key) => {
            if (!deepEqual(currentBtn[key], importedBtn[key])) {
              fieldsChanged.push(key);
            }
          });
          const trimmedCurrent = typeof pair.currentName === "string" ? pair.currentName.trim() : pair.currentName;
          const trimmedImported = typeof pair.importedName === "string" ? pair.importedName.trim() : pair.importedName;
          renamed = Boolean(trimmedCurrent !== trimmedImported);
        }
        const orderChanged = pair.importedIndex >= 0 ? !lisIndices.has(pair.importedIndex) : false;
        let status = "unchanged";
        if (!importedBtn) {
          status = "removed";
        } else if (fieldsChanged.length || renamed || orderChanged) {
          status = "changed";
        }
        const normalized = normalizeButtonNameForDiff(pair.currentName || pair.importedName);
        result.push({
          id: normalized || pair.currentName || pair.importedName,
          name: pair.currentName || pair.importedName,
          currentName: pair.currentName,
          importedName: pair.importedName,
          current: currentBtn,
          imported: importedBtn,
          fieldsChanged,
          orderChanged,
          renamed,
          status
        });
        if (pair.importedName) {
          matchedImportedNames.add(pair.importedName);
        }
      });
      importedOrder.forEach((btnName) => {
        if (matchedImportedNames.has(btnName)) return;
        const normalized = normalizeButtonNameForDiff(btnName);
        const importedBtn = importedButtons[btnName] || null;
        result.push({
          id: normalized || btnName,
          name: btnName,
          currentName: null,
          importedName: btnName,
          current: null,
          imported: importedBtn,
          fieldsChanged: [],
          orderChanged: false,
          renamed: false,
          status: "added"
        });
      });
      return {
        list: result,
        currentOrder,
        importedOrder
      };
    };
    const current = normalizeConfig(currentConfig);
    const next = normalizeConfig(importedConfig);
    const allFolderNames = [];
    const pushFolderName = (name) => {
      if (!name || typeof name !== "string") return;
      if (!allFolderNames.includes(name)) {
        allFolderNames.push(name);
      }
    };
    current.folderOrder.forEach(pushFolderName);
    next.folderOrder.forEach(pushFolderName);
    Object.keys(current.folders).forEach(pushFolderName);
    Object.keys(next.folders).forEach(pushFolderName);
    const folderDiffs = [];
    const summary = {
      folder: { added: 0, removed: 0, changed: 0 },
      button: { added: 0, removed: 0, changed: 0 }
    };
    allFolderNames.forEach((folderName) => {
      const currentFolder = current.folders[folderName] || null;
      const importedFolder = next.folders[folderName] || null;
      const currentIndex = current.folderOrder.indexOf(folderName);
      const importedIndex = next.folderOrder.indexOf(folderName);
      const metaChanges = [];
      if (currentFolder && importedFolder) {
        ["color", "textColor", "hidden"].forEach((key) => {
          if (!deepEqual(currentFolder[key], importedFolder[key])) {
            metaChanges.push(key);
          }
        });
      }
      const { list: buttonDiffs, currentOrder, importedOrder } = computeButtonDiffs(currentFolder, importedFolder);
      const buttonCounts = {
        added: buttonDiffs.filter((item) => item.status === "added").length,
        removed: buttonDiffs.filter((item) => item.status === "removed").length,
        changed: buttonDiffs.filter((item) => item.status === "changed").length
      };
      summary.button.added += buttonCounts.added;
      summary.button.removed += buttonCounts.removed;
      summary.button.changed += buttonCounts.changed;
      const hasOrderChange = buttonDiffs.some((btn) => btn.orderChanged);
      let status = "unchanged";
      if (!currentFolder) {
        status = "added";
        summary.folder.added += 1;
      } else if (!importedFolder) {
        status = "removed";
        summary.folder.removed += 1;
      } else if (metaChanges.length || hasOrderChange || buttonCounts.added || buttonCounts.removed || buttonCounts.changed) {
        status = "changed";
        summary.folder.changed += 1;
      }
      folderDiffs.push({
        name: folderName,
        current: currentFolder,
        imported: importedFolder,
        currentIndex,
        importedIndex,
        metaChanges,
        hasOrderChange,
        buttonDiffs,
        buttonOrder: {
          current: currentOrder,
          imported: importedOrder
        },
        buttonCounts,
        status
      });
    });
    const folderDiffMap = new Map(folderDiffs.map((item) => [item.name, item]));
    let selectedFolderName2 = (folderDiffs.find((item) => item.status !== "unchanged") || folderDiffs[0] || {}).name || null;
    const folderPanelWidth = 260;
    const layoutGap = 16;
    const summaryBar = document.createElement("div");
    const applySummaryGridLayout = () => {
      summaryBar.style.display = "grid";
      summaryBar.style.gridTemplateColumns = `${folderPanelWidth}px ${layoutGap}px 1fr`;
      summaryBar.style.alignItems = "center";
      summaryBar.style.columnGap = "0";
      summaryBar.style.rowGap = "8px";
      summaryBar.style.marginBottom = "8px";
    };
    applySummaryGridLayout();
    const summaryGroupStyle = `
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        `;
    const folderSummary = document.createElement("div");
    folderSummary.style.cssText = summaryGroupStyle;
    folderSummary.style.gridColumn = "1 / 2";
    const buttonSummary = document.createElement("div");
    buttonSummary.style.cssText = summaryGroupStyle;
    buttonSummary.style.gridColumn = "3 / 4";
    summaryBar.appendChild(folderSummary);
    summaryBar.appendChild(buttonSummary);
    setTrustedHTML(folderSummary, "");
    setTrustedHTML(buttonSummary, "");
    let folderBadgeCount = 0;
    let buttonBadgeCount = 0;
    ["added", "removed", "changed"].forEach((key) => {
      const count = summary.folder[key];
      if (count > 0) {
        folderSummary.appendChild(createBadge2(t(folderCountLabelMap[key], { count }), statusVariantMap[key]));
        folderBadgeCount += 1;
      }
    });
    ["added", "removed", "changed"].forEach((key) => {
      const count = summary.button[key];
      if (count > 0) {
        buttonSummary.appendChild(createBadge2(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
        buttonBadgeCount += 1;
      }
    });
    if (!folderBadgeCount && !buttonBadgeCount) {
      setTrustedHTML(summaryBar, "");
      summaryBar.style.display = "flex";
      summaryBar.style.flexWrap = "wrap";
      summaryBar.style.alignItems = "center";
      summaryBar.style.justifyContent = "center";
      summaryBar.style.gap = "8px";
      summaryBar.style.marginBottom = "8px";
      const noDiff = document.createElement("span");
      noDiff.textContent = t("m_05249fe6e6af");
      noDiff.style.color = "var(--muted-text-color, #6b7280)";
      noDiff.style.fontSize = "13px";
      summaryBar.appendChild(noDiff);
    } else {
      applySummaryGridLayout();
      let spacer = summaryBar.querySelector(".cttf-summary-spacer");
      if (!spacer) {
        spacer = document.createElement("div");
        spacer.className = "cttf-summary-spacer";
        spacer.style.gridColumn = "2 / 3";
        summaryBar.appendChild(spacer);
      }
      folderSummary.style.display = folderBadgeCount ? "flex" : "none";
      buttonSummary.style.display = buttonBadgeCount ? "flex" : "none";
    }
    dialog.appendChild(summaryBar);
    const layoutContainer = document.createElement("div");
    layoutContainer.style.cssText = `
            display: flex;
            gap: 16px;
            flex: 1;
            min-height: 0;
        `;
    dialog.appendChild(layoutContainer);
    const folderPanel = document.createElement("div");
    folderPanel.style.cssText = `
            flex: 0 0 260px;
            display: flex;
            flex-direction: column;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            overflow: hidden;
        `;
    layoutContainer.appendChild(folderPanel);
    const folderPanelHeader = document.createElement("div");
    folderPanelHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            position: sticky;
            top: 0;
            z-index: 1;
        `;
    folderPanelHeader.textContent = t("m_46ecac29102a");
    folderPanel.appendChild(folderPanelHeader);
    const folderList = document.createElement("div");
    folderList.style.cssText = `
            flex: 1;
            overflow: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
    folderList.classList.add("cttf-scrollable");
    folderList.style.direction = "rtl";
    folderPanel.appendChild(folderList);
    const detailPanel = document.createElement("div");
    detailPanel.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            background-color: var(--dialog-bg, #ffffff);
            overflow: hidden;
        `;
    layoutContainer.appendChild(detailPanel);
    const renderFolderList2 = () => {
      setTrustedHTML(folderList, "");
      if (!folderDiffs.length) {
        const placeholder = document.createElement("div");
        placeholder.style.cssText = `
                    padding: 16px;
                    font-size: 13px;
                    color: var(--muted-text-color, #6b7280);
                    text-align: center;
                    border: 1px dashed var(--border-color, #e5e7eb);
                    border-radius: 6px;
                `;
        placeholder.textContent = t("m_05249fe6e6af");
        folderList.appendChild(placeholder);
        return;
      }
      folderDiffs.forEach((item) => {
        const folderButton = document.createElement("button");
        folderButton.type = "button";
        folderButton.dataset.folder = item.name;
        folderButton.style.cssText = `
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid ${selectedFolderName2 === item.name ? "var(--primary-color, #3B82F6)" : "var(--border-color, #e5e7eb)"};
                    background-color: ${selectedFolderName2 === item.name ? "rgba(79, 70, 229, 0.08)" : "var(--dialog-bg, #ffffff)"};
                    cursor: pointer;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                    color: var(--text-color, #333333);
                `;
        folderButton.style.direction = "ltr";
        folderButton.addEventListener("click", () => {
          selectedFolderName2 = item.name;
          renderFolderList2();
          renderFolderDetail();
        });
        const left = document.createElement("div");
        left.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                `;
        const nameEl = document.createElement("span");
        nameEl.textContent = item.name;
        nameEl.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    flex: 0 1 auto;
                    font-size: 14px;
                    font-weight: ${item.status !== "unchanged" ? "600" : "500"};
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 4px 10px;
                    border-radius: 4px;
                    border: none;
                    min-width: 0;
                    max-width: 100%;
                    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
                    background-color: rgba(148, 163, 184, 0.25);
                    pointer-events: none;
                `;
        let folderBackground = "#64748b";
        if (item.current && item.imported) {
          if (deepEqual(item.current.color, item.imported.color)) {
            folderBackground = item.current.color || folderBackground;
          } else {
            const currentColor = item.current.color || folderBackground;
            const importedColor = item.imported.color || folderBackground;
            folderBackground = `linear-gradient(90deg, ${currentColor} 0%, ${currentColor} 50%, ${importedColor} 50%, ${importedColor} 100%)`;
          }
        } else if (item.imported) {
          folderBackground = item.imported.color || folderBackground;
        } else if (item.current) {
          folderBackground = item.current.color || folderBackground;
        }
        nameEl.style.background = folderBackground;
        const resolvedTextColor = item.current && item.current.textColor || item.imported && item.imported.textColor || "var(--text-color, #333333)";
        nameEl.style.color = resolvedTextColor;
        left.appendChild(nameEl);
        const right = document.createElement("div");
        right.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                `;
        if (item.status !== "unchanged") {
          const statusVariant = statusVariantMap[item.status];
          let statusLabel = t(statusTextMap[item.status]);
          if (item.status === "changed") {
            const detailLabels = [];
            if (item.hasOrderChange) {
              detailLabels.push(t("m_20ee03ce7790"));
            }
            if (item.metaChanges.length) {
              detailLabels.push(t("m_7debf9cb0372"));
            }
            if (detailLabels.length) {
              const separator = isNonChineseLocale() ? ", " : "、";
              const colon = isNonChineseLocale() ? ": " : "：";
              statusLabel = `${statusLabel}${colon}${detailLabels.join(separator)}`;
            }
          }
          right.appendChild(createBadge2(statusLabel, statusVariant));
        }
        const buttonHiglight = item.status !== "unchanged" || item.metaChanges.length || item.hasOrderChange;
        if (buttonHiglight) {
          folderButton.setAttribute("data-diff", "true");
        }
        folderButton.appendChild(left);
        folderButton.appendChild(right);
        folderList.appendChild(folderButton);
      });
    };
    const renderFolderDetail = () => {
      setTrustedHTML(detailPanel, "");
      if (!selectedFolderName2) {
        const emptyState = document.createElement("div");
        emptyState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
        emptyState.textContent = folderDiffs.length ? t("m_34f2f7532760") : t("m_05249fe6e6af");
        detailPanel.appendChild(emptyState);
        return;
      }
      const folderData = folderDiffMap.get(selectedFolderName2);
      if (!folderData) {
        const missingState = document.createElement("div");
        missingState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
        missingState.textContent = t("m_05249fe6e6af");
        detailPanel.appendChild(missingState);
        return;
      }
      const detailHeader = document.createElement("div");
      detailHeader.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
            `;
      const headerLeft = document.createElement("div");
      headerLeft.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
            `;
      headerLeft.textContent = selectedFolderName2;
      const headerBadges = document.createElement("div");
      headerBadges.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            `;
      ["added", "removed", "changed"].forEach((key) => {
        const count = folderData.buttonCounts[key];
        if (count > 0) {
          headerBadges.appendChild(createBadge2(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
        }
      });
      detailHeader.appendChild(headerLeft);
      detailHeader.appendChild(headerBadges);
      detailPanel.appendChild(detailHeader);
      if (!folderData.current) {
        const info = document.createElement("div");
        info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--success-color, #22c55e);
                    background-color: rgba(34, 197, 94, 0.12);
                `;
        info.textContent = t("m_18b337f21ea0");
        detailPanel.appendChild(info);
      } else if (!folderData.imported) {
        const info = document.createElement("div");
        info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--danger-color, #f87171);
                    background-color: rgba(248, 113, 113, 0.12);
                `;
        info.textContent = t("m_cfca7737d2c0");
        detailPanel.appendChild(info);
      }
      const columnsContainer = document.createElement("div");
      columnsContainer.style.cssText = `
                flex: 1;
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
                padding: 20px;
                min-height: 0;
            `;
      detailPanel.appendChild(columnsContainer);
      const buttonDiffMap = /* @__PURE__ */ new Map();
      folderData.buttonDiffs.forEach((item) => {
        if (item.currentName) {
          buttonDiffMap.set(item.currentName, item);
        }
        if (item.importedName) {
          buttonDiffMap.set(item.importedName, item);
        }
        if (!item.currentName && !item.importedName) {
          buttonDiffMap.set(item.name || item.id, item);
        }
      });
      const createColumn = (label, buttons, order, side) => {
        const column = document.createElement("div");
        column.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    overflow: hidden;
                    background-color: var(--button-bg, #f3f4f6);
                `;
        const columnHeader = document.createElement("div");
        columnHeader.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 8px;
                    background-color: var(--button-bg, #f3f4f6);
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 4px 4px 0 0;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-color, #333333);
                    position: sticky;
                    top: 0;
                    z-index: 1;
                `;
        columnHeader.textContent = label;
        column.appendChild(columnHeader);
        const list = document.createElement("div");
        list.style.cssText = `
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 10px;
                    overflow: auto;
                `;
        list.classList.add("cttf-scrollable");
        column.appendChild(list);
        if (!order.length) {
          const empty = document.createElement("div");
          empty.style.cssText = `
                        padding: 20px;
                        font-size: 13px;
                        color: var(--muted-text-color, #6b7280);
                        text-align: center;
                    `;
          empty.textContent = side === "current" ? t("m_1a4da6293e0c") : t("m_ebec3a798b60");
          list.appendChild(empty);
          return column;
        }
        order.forEach((btnName) => {
          const diffInfo = buttonDiffMap.get(btnName);
          const btnConfig = buttons[btnName];
          const highlightStatus = diffInfo ? diffInfo.status : "unchanged";
          const backgroundColor = (() => {
            if (!diffInfo || highlightStatus === "unchanged") {
              return "var(--dialog-bg, #ffffff)";
            }
            if (highlightStatus === "added" && side === "imported") {
              return "rgba(34, 197, 94, 0.12)";
            }
            if (highlightStatus === "removed" && side === "current") {
              return "rgba(248, 113, 113, 0.12)";
            }
            if (highlightStatus === "changed") {
              return "rgba(59, 130, 246, 0.12)";
            }
            return "var(--dialog-bg, #ffffff)";
          })();
          const borderColor = (() => {
            if (!diffInfo || highlightStatus === "unchanged") {
              return "var(--border-color, #e5e7eb)";
            }
            if (highlightStatus === "added" && side === "imported") {
              return "rgba(34, 197, 94, 0.5)";
            }
            if (highlightStatus === "removed" && side === "current") {
              return "rgba(248, 113, 113, 0.5)";
            }
            if (highlightStatus === "changed") {
              return "rgba(59, 130, 246, 0.4)";
            }
            return "var(--border-color, #e5e7eb)";
          })();
          const item = document.createElement("div");
          item.style.cssText = `
                        border: 1px solid ${borderColor};
                        border-radius: 6px;
                        padding: 6px 8px;
                        display: flex;
                        flex-direction: column;
                        gap: 3px;
                        background-color: ${backgroundColor};
                    `;
          const row = document.createElement("div");
          row.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 4px;
                    `;
          const rowLeft = document.createElement("div");
          rowLeft.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        min-width: 0;
                    `;
          const previewButton = createCustomButtonElement(btnName, btnConfig || {});
          previewButton.style.marginBottom = "0";
          previewButton.style.marginRight = "0";
          previewButton.style.cursor = "default";
          previewButton.style.flexShrink = "1";
          previewButton.style.minWidth = "0";
          previewButton.style.maxWidth = "100%";
          previewButton.style.whiteSpace = "normal";
          previewButton.style.wordBreak = "break-word";
          previewButton.style.overflow = "visible";
          previewButton.style.lineHeight = "1.4";
          previewButton.style.overflowWrap = "anywhere";
          previewButton.style.display = "inline-flex";
          previewButton.style.flexWrap = "wrap";
          previewButton.style.alignItems = "center";
          previewButton.style.justifyContent = "flex-start";
          previewButton.style.columnGap = "6px";
          previewButton.style.rowGap = "2px";
          previewButton.style.pointerEvents = "none";
          previewButton.setAttribute("tabindex", "-1");
          previewButton.setAttribute("aria-hidden", "true");
          const fallbackTextColor = "var(--text-color, #333333)";
          if (!btnConfig || !btnConfig.textColor) {
            previewButton.style.color = fallbackTextColor;
          }
          if (!btnConfig || !btnConfig.color) {
            previewButton.style.backgroundColor = "rgba(148, 163, 184, 0.25)";
            previewButton.style.border = "1px solid rgba(100, 116, 139, 0.35)";
          }
          rowLeft.appendChild(previewButton);
          const rowRight = document.createElement("div");
          rowRight.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        flex-shrink: 0;
                    `;
          if (diffInfo && diffInfo.status !== "unchanged") {
            const statusVariant = statusVariantMap[diffInfo.status] || "neutral";
            let badgeLabel = t(statusTextMap[diffInfo.status]);
            if (diffInfo.status === "changed") {
              const changeTypeParts = [];
              if (diffInfo.renamed) {
                changeTypeParts.push(t("m_1cd80fd7a8b3"));
              }
              if (diffInfo.fieldsChanged.length) {
                changeTypeParts.push(t("m_77a49f2c3874"));
              }
              if (diffInfo.orderChanged) {
                changeTypeParts.push(t("m_20ee03ce7790"));
              }
              if (changeTypeParts.length) {
                const typesText = changeTypeParts.join(isNonChineseLocale() ? ", " : "、");
                badgeLabel = t("m_5a6a5ca76776", { types: typesText });
              }
            }
            rowRight.appendChild(createBadge2(badgeLabel, statusVariant));
          }
          row.appendChild(rowLeft);
          row.appendChild(rowRight);
          item.appendChild(row);
          if (diffInfo && diffInfo.fieldsChanged.length) {
            const fieldsInfo = document.createElement("div");
            fieldsInfo.style.cssText = `
                            font-size: 12px;
                            color: var(--muted-text-color, #6b7280);
                        `;
            fieldsInfo.textContent = t("m_a865844eefdf", { fields: diffInfo.fieldsChanged.join(", ") });
            item.appendChild(fieldsInfo);
          }
          list.appendChild(item);
        });
        return column;
      };
      const currentButtons = folderData.current && folderData.current.buttons ? folderData.current.buttons : {};
      const importedButtons = folderData.imported && folderData.imported.buttons ? folderData.imported.buttons : {};
      columnsContainer.appendChild(createColumn(currentLabel, currentButtons, folderData.buttonOrder.current || [], "current"));
      columnsContainer.appendChild(createColumn(importedLabel, importedButtons, folderData.buttonOrder.imported || [], "imported"));
    };
    renderFolderList2();
    renderFolderDetail();
  }
  function showImportConfirmDialog(importedConfig, onConfirm, onCancel) {
    if (currentConfirmOverlay3) {
      closeExistingOverlay(currentConfirmOverlay3);
    }
    const importFolderCount = Object.keys(importedConfig.folders || {}).length;
    const importButtonCount = Object.values(importedConfig.folders || {}).reduce((sum, folder) => {
      return sum + Object.keys(folder.buttons || {}).length;
    }, 0);
    const currentFolderCount = Object.keys(buttonConfig.folders).length;
    const currentButtonCount = Object.values(buttonConfig.folders).reduce((sum, folder) => {
      return sum + Object.keys(folder.buttons).length;
    }, 0);
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "480px",
      maxWidth: "90vw",
      maxHeight: "none",
      padding: "24px",
      zIndex: "13000",
      closeOnOverlayClick: false,
      overlayClassName: "import-confirm-overlay",
      dialogClassName: "import-confirm-dialog",
      dialogStyles: {
        borderRadius: "8px",
        overflowY: "visible"
      },
      onClose: () => {
        if (currentConfirmOverlay3 === overlay) {
          currentConfirmOverlay3 = null;
        }
      }
    });
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
                    ${t("m_3eff91bbde22")}
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
                ">${t("m_4aa822bb679d")}</h4>

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
                        ">${t("m_fe67280a8e87")}</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t("m_9a311c0d1474")}</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t("m_3a591ab6fe4d")}</span>
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
                        ">${t("m_280779a502b3")}</div>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t("m_9a311c0d1474")}</span>
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
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t("m_3a591ab6fe4d")}</span>
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
                    <strong>${t("m_e000c77e8526")}</strong>
                </div>
            </div>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            ">
                <button id="previewImportDiff" style="
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">${t("m_27e029bfe920")}</button>
                <div style="display: flex; gap: 12px;">
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
                    ">${t("m_4d0b4688c787")}</button>
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
                    ">${t("m_de6433b70d6c")}</button>
                </div>
            </div>
        `);
    currentConfirmOverlay3 = overlay;
    const previewDiffBtn = dialog.querySelector("#previewImportDiff");
    if (previewDiffBtn) {
      previewDiffBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
          showImportDiffPreview(buttonConfig, importedConfig);
        } catch (error) {
          console.error(t("i18n.log.open_diff_preview_failed"), error);
        }
      });
    }
    dialog.querySelector("#cancelImport").addEventListener("click", () => {
      if (currentDiffOverlay) {
        if (typeof currentDiffOverlay.__cttfCloseDiff === "function") {
          currentDiffOverlay.__cttfCloseDiff();
        } else {
          closeExistingOverlay(currentDiffOverlay);
          currentDiffOverlay = null;
        }
      }
      closeExistingOverlay(overlay);
      if (onCancel) onCancel();
    });
    dialog.querySelector("#confirmImport").addEventListener("click", () => {
      if (currentDiffOverlay) {
        if (typeof currentDiffOverlay.__cttfCloseDiff === "function") {
          currentDiffOverlay.__cttfCloseDiff();
        } else {
          closeExistingOverlay(currentDiffOverlay);
          currentDiffOverlay = null;
        }
      }
      closeExistingOverlay(overlay);
      setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        }
      }, 100);
    });
  }
  function importConfig(rerenderFn) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const importedConfig = JSON.parse(evt.target.result);
          if (importedConfig && typeof importedConfig === "object") {
            if (!importedConfig.folders || !importedConfig.folderOrder) {
              alert(t("m_a72403beb9ad"));
              return;
            }
            showImportConfirmDialog(
              importedConfig,
              () => {
                try {
                  applyConfigFromRemote(importedConfig);
                  if (rerenderFn) {
                    rerenderFn();
                  }
                  console.log(t("m_1d0d89d4e859"));
                } catch (error) {
                  console.error(t("m_54304e70f4ab"), error);
                  alert(t("m_453dea07d20d"));
                }
              },
              () => {
                console.log(t("m_e5da83735c27"));
              }
            );
          } else {
            alert(t("m_8fa458fdbc46"));
          }
        } catch (error) {
          console.error(t("m_b50818156298"), error);
          alert(t("m_633f61f8547f"));
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }
  var closeCurrentConfigOverlay = () => {
    if (currentConfigOverlay) {
      closeExistingOverlay(currentConfigOverlay);
      currentConfigOverlay = null;
    }
  };
  var showConfigSettingsDialog = (options = {}) => {
    const { state: initialState = null } = options;
    closeCurrentConfigOverlay();
    let handleConfigDialogBeforeClose = async () => true;
    const { overlay, dialog } = createUnifiedDialog({
      title: null,
      showTitle: false,
      width: "400px",
      maxWidth: "90vw",
      padding: "24px",
      zIndex: "12000",
      closeOnOverlayClick: true,
      closeOnEscape: true,
      beforeClose: (context) => handleConfigDialogBeforeClose(context),
      overlayClassName: "config-overlay",
      dialogClassName: "config-dialog",
      onClose: () => {
        if (currentConfigOverlay === overlay) {
          currentConfigOverlay = null;
        }
      }
    });
    const rowLabelStyle = "display:inline-flex;min-width:130px;justify-content:flex-start;margin-right:12px;color: var(--text-color, #333333);";
    const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="appearanceTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                " data-i18n-text="m_09b58aa3422c"></button>
                <button class="tab-button" data-tab="configTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                " data-i18n-text="m_d7d7ce790b9a"></button>
                <button class="tab-button" data-tab="syncTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(";")};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                " data-i18n-text="m_e88ab5ba616a"></button>
            </div>
        `;
    const appearanceTab = `
            <div id="appearanceTab" class="tab-content" style="display: block;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:20px;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}"><span data-i18n-text="m_cd99b225a08e"></span>:</span>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <button class="config-lang-btn" data-lang="auto" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_4afad877551a"></button>
                            <button class="config-lang-btn" data-lang="zh" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_7be2d2d20c10"></button>
                            <button class="config-lang-btn" data-lang="en" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            " data-i18n-text="m_649df08a448e"></button>
                        </div>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}" data-i18n-text="m_be3357587999"></span>
                        <div class="cttf-switch-wrapper">
                            <label class="cttf-switch">
                                <input id="folderIconToggleInput" type="checkbox" />
                                <span class="cttf-switch-slider"></span>
                            </label>
                            <span id="folderIconToggleText" style="
                                font-size: 13px;
                                color: var(--text-color, #333333);
                                font-weight: 500;
                                min-width: 38px;
                            ">${t("m_71b6771bc789")}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    const driveSyncSection = `
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <div style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:10px;
                    ">
                        <div style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                            font-size:15px;
                            font-weight:600;
                            color: var(--text-color, #333333);
                        " data-i18n-text="m_e054f40d5926"></div>
                        <div class="cttf-switch-wrapper">
                            <label class="cttf-switch" data-i18n-title="m_4b900794dc6e">
                                <input id="driveSyncEnableToggle" type="checkbox" />
                                <span class="cttf-switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div id="driveModuleStatus" style="
                        font-size: 12px;
                        color: var(--muted-text-color, #6b7280);
                        min-height: 0;
                        margin-top: 0;
                    "></div>
                </div>
                <div id="driveControlsWrapper" style="
                    display:none;
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:8px;
                    background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                    padding:12px;
                    flex-direction:column;
                    gap:8px;
                ">
                    <div id="driveControlsContainer" style="
                        display:flex;
                        flex-direction:column;
                        gap:4px;
                        padding-top:0;
                        margin-top:0;
                    ">
                        <div style="display:flex;flex-direction:column;gap:6px;margin-top:0; margin-bottom:10px;">
                            <div style="
                                display:grid;
                                grid-template-columns:auto 1fr;
                                align-items:center;
                                column-gap:12px;
                                row-gap:8px;
                                width:100%;
                            ">
                                <span style="font-size:16px;color:var(--text-color, #333333);white-space:nowrap;"><span data-i18n-text="m_c57c190b6d9b"></span>:</span>
                                <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end;width:100%;">
                                    <button type="button" data-drive-request-mode="default" style="
                                        padding:6px 12px;
                                        border-radius:18px;
                                        border:1px solid var(--border-color, #d1d5db);
                                        background: transparent;
                                        color: var(--text-color, #333333);
                                        cursor: pointer;
                                    " data-i18n-title="m_80da4bc2bae8" data-i18n-text="m_c8d09cf955f5"></button>
                                    <button type="button" data-drive-request-mode="adguard" style="
                                        padding:6px 12px;
                                        border-radius:18px;
                                        border:1px solid var(--border-color, #d1d5db);
                                        background: transparent;
                                        color: var(--text-color, #333333);
                                        cursor: pointer;
                                    " data-i18n-title="m_fec91cac2de3" data-i18n-text="m_ea003e174e34"></button>
                                </div>
                            </div>
                        </div>
                        <div style="height:1px;background:var(--border-color, #e5e7eb);margin:0 0 8px 0;"></div>
                        <div id="driveConfigFold" style="display:flex;flex-direction:column;gap:6px;">
                            <div style="
                                display:flex;
                                align-items:center;
                                justify-content:space-between;
                                gap:8px;
                                width:100%;
                                cursor:pointer;
                            " id="driveConfigFoldToggle">
                                <span style="font-size:16px;color:var(--text-color, #333333);" data-i18n-text="m_3378a763fb15"></span>
                                <span id="driveConfigFoldArrow" style="font-size:12px;color:var(--muted-text-color, #6b7280);">▼</span>
                            </div>
                            <div id="driveConfigFields" style="display:flex;flex-direction:column;gap:6px;">
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_92041626595b"></span></span>
                                        <div class="cttf-sync-field" data-secret="false" data-visible="true">
                                            <textarea id="driveClientIdInput" class="cttf-sync-textarea" rows="3" data-min-rows="3" autocomplete="off" spellcheck="false" placeholder="xxx.apps.googleusercontent.com"></textarea>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_65f8d895a1dd"></span></span>
                                        <div class="cttf-sync-field" data-secret="true" data-visible="false">
                                            <textarea id="driveClientSecretInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="your_client_secret"></textarea>
                                            <button type="button" class="cttf-sync-toggle" data-target="driveClientSecretInput" data-i18n-aria-label="i18n.common.toggle_visibility">👁</button>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_ee93296cfe75"></span></span>
                                        <div class="cttf-sync-field" data-secret="true" data-visible="false">
                                            <textarea id="driveRefreshTokenInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="ya29...."></textarea>
                                            <button type="button" class="cttf-sync-toggle" data-target="driveRefreshTokenInput" data-i18n-aria-label="i18n.common.toggle_visibility">👁</button>
                                        </div>
                                    </label>
                                    <label style="display:flex;flex-direction:column;gap:6px;">
                                        <span style="${rowLabelStyle}font-size:15px;">· <span data-i18n-text="m_53d26abaeb0d"></span></span>
                                        <div class="cttf-sync-field" data-secret="false" data-visible="true">
                                            <textarea id="driveFileNameInput" class="cttf-sync-textarea" rows="1" autocomplete="off" spellcheck="false" placeholder="[Chat] Template Text Folders.backup.json"></textarea>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                            <div id="driveSaveRow" style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                                <button id="saveDriveSettingsBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius:4px;
                            " data-i18n-text="m_43868e0d24e8"></button>
                            </div>
                        <div style="height:1px;background:var(--border-color, #e5e7eb);margin:4px 0 8px 0;"></div>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                            <div style="display:flex;flex:1;gap:8px;min-width:220px;">
                                <button id="uploadDriveConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius:4px;
                                flex:1;
                                " data-i18n-text="m_ebcb252ebbd7"></button>
                                <button id="downloadDriveConfigBtn" style="
                                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                                    background-color: var(--info-color, #4F46E5);
                                    color: white;
                                    border-radius:4px;
                                    flex:1;
                                " data-i18n-text="m_45d7b2b96726"></button>
                            </div>
                            <span id="driveSyncStatus" style="
                                font-size: 13px;
                                color: var(--muted-text-color, #6b7280);
                                min-height: 18px;
                                flex: 1;
                            "></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    const configTab = `
            <div id="configTab" class="tab-content" style="display: none;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:0;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}" data-i18n-text="m_a82dd6923716"></span>
                        <button id="resetSettingsBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_65c2254bc930"></button>
                    </div>
                <div style="
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                ">
                    <span style="${rowLabelStyle}" data-i18n-text="m_50c4041db726"></span>
                    <div style="display:flex;gap:8px;">
                        <button id="importConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--add-color, #fd7e14);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_bd39b3a19cd8"></button>
                        <button id="exportConfigBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="m_1fa2524ed60b"></button>
                    </div>
                </div>
                </div>
            </div>
        `;
    const syncTab = `
            <div id="syncTab" class="tab-content" style="display: none;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:0;
                ">
                    ${driveSyncSection}
                </div>
            </div>
        `;
    setTrustedHTML(dialog, `
            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                margin:0 0 20px 0;
            ">
                <h3 style="margin:0;font-size:18px;font-weight:600; color: var(--text-color, #333333);" data-i18n-text="m_3b8ac539b031"></h3>
                <div id="configDialogHeaderActions" style="
                    display:flex;
                    align-items:center;
                    gap:4px;
                    flex: 0 0 auto;
                "></div>
            </div>
            ${tabNavigation}
            ${appearanceTab}
            ${configTab}
            ${syncTab}
        `);
    const configDialogHeaderActions = dialog.querySelector("#configDialogHeaderActions");
    if (configDialogHeaderActions) {
      const closeConfigDialogBtn = createDialogCloseIconButton((event) => {
        void overlay.__cttfRequestClose("button", event);
      });
      closeConfigDialogBtn.id = "closeConfigDialogBtn";
      configDialogHeaderActions.appendChild(closeConfigDialogBtn);
    }
    let activateTab = () => {
    };
    const setupTabs = () => {
      const tabButtons = dialog.querySelectorAll(".tab-button");
      const tabContents = dialog.querySelectorAll(".tab-content");
      activateTab = (targetId) => {
        tabButtons.forEach((btn) => {
          const isActive = btn.dataset.tab === targetId;
          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-pressed", isActive ? "true" : "false");
          btn.style.backgroundColor = isActive ? "var(--primary-color, #3B82F6)" : "var(--button-bg, #f3f4f6)";
          btn.style.color = isActive ? "white" : "var(--text-color, #333333)";
          btn.style.borderBottom = isActive ? "2px solid var(--primary-color, #3B82F6)" : "2px solid transparent";
        });
        tabContents.forEach((content) => {
          content.style.display = content.id === targetId ? "block" : "none";
        });
      };
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId = button.dataset.tab;
          if (targetId) {
            activateTab(targetId);
          }
        });
      });
      activateTab(initialState && initialState.activeTab ? initialState.activeTab : "appearanceTab");
    };
    setupTabs();
    currentConfigOverlay = overlay;
    const langBtnStyle = document.createElement("style");
    langBtnStyle.textContent = `
            .config-lang-btn {
                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                color: var(--input-text-color, var(--text-color, #333333));
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .config-lang-btn:hover {
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .config-lang-btn.active {
                background-color: var(--primary-color, #3B82F6) !important;
                color: #ffffff !important;
                border-color: var(--primary-color, #3B82F6) !important;
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .cttf-switch-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            .cttf-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            .cttf-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .cttf-switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(148, 163, 184, 0.35);
                border-radius: 999px;
                transition: background-color 0.25s ease, box-shadow 0.25s ease;
            }
            .cttf-switch-slider::before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
                transition: transform 0.25s ease;
            }
            .cttf-switch input:checked + .cttf-switch-slider {
                background-color: #22c55e;
            }
            .cttf-switch input:checked + .cttf-switch-slider::before {
                transform: translateX(24px);
            }
            .cttf-switch input:focus-visible + .cttf-switch-slider {
                box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35);
            }
        `;
    dialog.appendChild(langBtnStyle);
    const syncStyle = document.createElement("style");
    syncStyle.textContent = `
            .cttf-sync-field {
                position: relative;
                width: 100%;
            }
            .cttf-sync-textarea {
                box-sizing: border-box;
                width: 100%;
                min-height: 36px;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                background: var(--input-bg, #ffffff);
                color: var(--input-text-color, var(--text-color, #333333));
                font-size: 13px;
                line-height: 1.4;
                resize: none;
                overflow: hidden;
                outline: none;
                transition: height 0.05s ease;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .cttf-sync-textarea:focus {
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .cttf-sync-toggle {
                position: absolute;
                top: 50%;
                right: 6px;
                transform: translateY(-50%);
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                background: var(--button-bg, #f3f4f6);
                color: var(--text-color, #333333);
                border-radius: 6px;
                padding: 4px 6px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
            }
            .cttf-sync-toggle:hover {
                border-color: var(--primary-color, #3B82F6);
                background: var(--input-bg, #ffffff);
            }
            .cttf-sync-field[data-visible="false"] .cttf-sync-textarea {
                color: transparent;
                text-shadow: 0 0 0 var(--text-color, #333333);
                -webkit-text-security: disc;
                caret-color: transparent;
                white-space: pre-wrap;
            }
            .cttf-sync-field[data-visible="true"] .cttf-sync-textarea {
                color: var(--input-text-color, var(--text-color, #333333));
                text-shadow: none;
                -webkit-text-security: none;
                caret-color: auto;
            }
        `;
    dialog.appendChild(syncStyle);
    const langButtons = Array.from(dialog.querySelectorAll(".config-lang-btn"));
    const updateLanguageButtonState = (preference) => {
      langButtons.forEach((btn) => {
        const isActive = btn.dataset.lang === preference;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };
    updateLanguageButtonState(getLanguagePreference());
    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedPreference = btn.dataset.lang || "auto";
        const result = applyLanguagePreference(selectedPreference);
        updateLanguageButtonState(result ? result.preference : selectedPreference);
      });
    });
    const folderIconToggleInput = dialog.querySelector("#folderIconToggleInput");
    const folderIconToggleText = dialog.querySelector("#folderIconToggleText");
    const folderIconToggleSlider = dialog.querySelector(".cttf-switch-slider");
    const folderIconToggleWrapper = dialog.querySelector(".cttf-switch-wrapper");
    const updateFolderIconToggleState = () => {
      if (!folderIconToggleInput) {
        return;
      }
      const enabled = buttonConfig.showFolderIcons === true;
      folderIconToggleInput.checked = enabled;
      folderIconToggleInput.setAttribute("aria-checked", enabled ? "true" : "false");
      if (folderIconToggleText) {
        folderIconToggleText.textContent = enabled ? t("m_71b6771bc789") : t("m_bb0e7e01aa8d");
        folderIconToggleText.style.color = enabled ? "var(--success-color, #22c55e)" : "var(--muted-text-color, #6b7280)";
      }
      const tooltipTarget = folderIconToggleWrapper || folderIconToggleSlider;
      if (tooltipTarget) {
        tooltipTarget.title = enabled ? t("m_4754b4803a61") : t("m_6ff5ff5942c2");
      }
    };
    if (folderIconToggleInput) {
      updateFolderIconToggleState();
      folderIconToggleInput.addEventListener("change", () => {
        const enabled = folderIconToggleInput.checked;
        buttonConfig.showFolderIcons = enabled;
        persistButtonConfig();
        updateFolderIconToggleState();
        console.log(t("m_b8780f7f6543", {
          state: enabled ? t("m_71b6771bc789") : t("m_bb0e7e01aa8d")
        }));
        if (getCurrentSettingsOverlay()) {
          renderFolderList();
        }
        updateButtonContainer();
      });
    }
    const driveSyncToggle = dialog.querySelector("#driveSyncEnableToggle");
    const driveModuleStatusEl = dialog.querySelector("#driveModuleStatus");
    const driveControlsWrapper = dialog.querySelector("#driveControlsWrapper");
    const driveControlsContainer = dialog.querySelector("#driveControlsContainer");
    const driveConfigFields = dialog.querySelector("#driveConfigFields");
    const driveConfigFoldToggle = dialog.querySelector("#driveConfigFoldToggle");
    const driveConfigFoldArrow = dialog.querySelector("#driveConfigFoldArrow");
    const driveSaveRow = dialog.querySelector("#driveSaveRow");
    const driveClientIdInput = dialog.querySelector("#driveClientIdInput");
    const driveClientSecretInput = dialog.querySelector("#driveClientSecretInput");
    const driveRefreshTokenInput = dialog.querySelector("#driveRefreshTokenInput");
    const driveFileNameInput = dialog.querySelector("#driveFileNameInput");
    const driveRequestModeButtons = Array.from(dialog.querySelectorAll("[data-drive-request-mode]"));
    const driveStatusEl = dialog.querySelector("#driveSyncStatus");
    const driveSaveBtn = dialog.querySelector("#saveDriveSettingsBtn");
    const driveUploadBtn = dialog.querySelector("#uploadDriveConfigBtn");
    const driveDownloadBtn = dialog.querySelector("#downloadDriveConfigBtn");
    let driveConfigCollapsed = false;
    let driveRequestModeValue = "default";
    let driveModuleStatusState = { type: "info", text: "", messageId: null, replacements: null };
    let driveStatusState = { type: "info", text: "", messageId: null, replacements: null };
    let driveDraftBaseline = null;
    let currentCloseGuardOverlay = null;
    const syncFields = Array.from(dialog.querySelectorAll(".cttf-sync-field"));
    const getFieldTextarea = (field) => field ? field.querySelector(".cttf-sync-textarea") : null;
    const toggleButtons = Array.from(dialog.querySelectorAll(".cttf-sync-toggle"));
    const computeHeightForLines = (el, lines = 1) => {
      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2 || 18;
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const borderTop = parseFloat(style.borderTopWidth) || 0;
      const borderBottom = parseFloat(style.borderBottomWidth) || 0;
      const rows = Math.max(1, Number(lines) || 1);
      return lineHeight * rows + paddingTop + paddingBottom + borderTop + borderBottom;
    };
    const computeMinHeight = (el) => {
      const minRowsAttr = Number(el?.dataset?.minRows || 1);
      const minRows = Number.isFinite(minRowsAttr) && minRowsAttr > 0 ? minRowsAttr : 1;
      return computeHeightForLines(el, minRows);
    };
    const adjustSyncFieldHeight = (field) => {
      if (!field) return;
      const textarea = getFieldTextarea(field);
      if (!textarea) return;
      const isSecret = field.dataset.secret === "true";
      const isVisible = field.dataset.visible === "true";
      const minHeight = computeMinHeight(textarea);
      const forceSingleLine = isSecret && !isVisible;
      const fixedRows = Number(textarea.dataset.fixedRows || 0);
      if (forceSingleLine) {
        textarea.style.overflowY = "hidden";
        textarea.style.height = `${computeHeightForLines(textarea, 1)}px`;
        return;
      }
      if (fixedRows > 0) {
        textarea.style.overflowY = "hidden";
        textarea.style.height = `${computeHeightForLines(textarea, fixedRows)}px`;
        return;
      }
      textarea.style.overflowY = "hidden";
      textarea.style.height = "auto";
      const measured = textarea.scrollHeight;
      const targetHeight = Math.max(measured, minHeight);
      textarea.style.height = `${targetHeight}px`;
    };
    const setFieldVisibility = (field, visible) => {
      if (!field) return;
      field.dataset.visible = visible ? "true" : "false";
      const toggleBtn = field.querySelector(".cttf-sync-toggle");
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-pressed", visible ? "true" : "false");
        toggleBtn.setAttribute("aria-label", t("i18n.common.toggle_visibility"));
        toggleBtn.title = visible ? t("m_bb0e7e01aa8d") || "Hide" : t("m_71b6771bc789") || "Show";
        toggleBtn.textContent = visible ? "🙈" : "👁";
      }
      const textarea = getFieldTextarea(field);
      if (textarea) {
        adjustSyncFieldHeight(field);
      }
    };
    const updateDriveRequestModeButtons = () => {
      if (!driveRequestModeButtons.length) {
        return;
      }
      driveRequestModeButtons.forEach((btn) => {
        const active = btn.dataset.driveRequestMode === driveRequestModeValue;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        btn.style.background = active ? "var(--primary-color, #3B82F6)" : "transparent";
        btn.style.color = active ? "#ffffff" : "var(--text-color, #333333)";
        btn.style.borderColor = active ? "var(--primary-color, #3B82F6)" : "var(--border-color, #d1d5db)";
      });
    };
    const applyDriveConfigFoldState = () => {
      if (driveConfigFields && driveConfigFoldArrow) {
        driveConfigFields.style.display = driveConfigCollapsed ? "none" : "flex";
        driveConfigFoldArrow.textContent = driveConfigCollapsed ? "▶" : "▼";
      }
      if (driveSaveRow) {
        driveSaveRow.style.display = driveConfigCollapsed ? "none" : "flex";
      }
    };
    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const field = targetId ? dialog.querySelector(`#${targetId}`)?.closest(".cttf-sync-field") : null;
        if (!field) return;
        const nextVisible = field.dataset.visible !== "true";
        setFieldVisibility(field, nextVisible);
        adjustSyncFieldHeight(field);
        requestAnimationFrame(() => adjustSyncFieldHeight(field));
      });
    });
    syncFields.forEach((field) => {
      const textarea = getFieldTextarea(field);
      if (!textarea) return;
      adjustSyncFieldHeight(field);
      textarea.addEventListener("input", () => {
        adjustSyncFieldHeight(field);
        requestAnimationFrame(() => adjustSyncFieldHeight(field));
      });
      if (field.dataset.secret === "true") {
        setFieldVisibility(field, false);
      } else {
        field.dataset.visible = "true";
      }
    });
    const refreshAllSyncHeights = () => {
      syncFields.forEach((field) => {
        adjustSyncFieldHeight(field);
      });
    };
    const resolveLocalizedStatusText = (state) => {
      if (!state) {
        return "";
      }
      if (state.messageId) {
        return t(state.messageId, state.replacements || null);
      }
      return state.text || "";
    };
    const setDriveModuleStatus = (type, text, options2 = {}) => {
      driveModuleStatusState = {
        type,
        text: text || "",
        messageId: options2.messageId || null,
        replacements: options2.replacements || null
      };
      if (!driveModuleStatusEl) return;
      driveModuleStatusEl.textContent = resolveLocalizedStatusText(driveModuleStatusState);
      const colorMap = {
        success: "var(--success-color, #22c55e)",
        error: "var(--danger-color, #ef4444)",
        info: "var(--muted-text-color, #6b7280)"
      };
      driveModuleStatusEl.style.color = colorMap[type] || "var(--muted-text-color, #6b7280)";
    };
    const toggleDriveButtons = (disabled) => {
      [driveSaveBtn, driveUploadBtn, driveDownloadBtn].forEach((btn) => {
        if (!btn) return;
        btn.disabled = disabled;
        btn.style.opacity = disabled ? "0.7" : "1";
      });
    };
    const setDriveControlsVisibility = (visible) => {
      if (driveControlsWrapper) {
        driveControlsWrapper.style.display = visible ? "flex" : "none";
      }
      if (driveControlsContainer) {
        driveControlsContainer.style.display = visible ? "flex" : "none";
      }
      toggleDriveButtons(!visible);
    };
    const setDriveStatus = (type, text, options2 = {}) => {
      driveStatusState = {
        type,
        text: text || "",
        messageId: options2.messageId || null,
        replacements: options2.replacements || null
      };
      if (!driveStatusEl) return;
      driveStatusEl.textContent = resolveLocalizedStatusText(driveStatusState);
      const colorMap = {
        success: "var(--success-color, #22c55e)",
        error: "var(--danger-color, #ef4444)",
        info: "var(--text-color, #333333)"
      };
      driveStatusEl.style.color = colorMap[type] || "var(--muted-text-color, #6b7280)";
    };
    const normalizeDriveDraft = (draft = {}) => {
      return {
        clientId: typeof draft.clientId === "string" ? draft.clientId.trim() : "",
        clientSecret: typeof draft.clientSecret === "string" ? draft.clientSecret.trim() : "",
        refreshToken: typeof draft.refreshToken === "string" ? draft.refreshToken.trim() : "",
        fileName: typeof draft.fileName === "string" && draft.fileName.trim() ? draft.fileName.trim() : DEFAULT_FILE_NAME,
        requestMode: draft.requestMode === "adguard" ? "adguard" : "default",
        configCollapsed: draft.configCollapsed === true
      };
    };
    const captureDriveDraftSnapshot = () => {
      return normalizeDriveDraft({
        clientId: driveClientIdInput ? driveClientIdInput.value : "",
        clientSecret: driveClientSecretInput ? driveClientSecretInput.value : "",
        refreshToken: driveRefreshTokenInput ? driveRefreshTokenInput.value : "",
        fileName: driveFileNameInput ? driveFileNameInput.value : DEFAULT_FILE_NAME,
        requestMode: driveRequestModeValue,
        configCollapsed: driveConfigCollapsed === true
      });
    };
    const updateDriveDraftBaseline = (draft = null) => {
      driveDraftBaseline = normalizeDriveDraft(draft || captureDriveDraftSnapshot());
      return driveDraftBaseline;
    };
    const hasPendingDriveDraftChanges = () => {
      const baseline = normalizeDriveDraft(driveDraftBaseline || cachedDriveSettings || {});
      const currentDraft = captureDriveDraftSnapshot();
      return JSON.stringify(currentDraft) !== JSON.stringify(baseline);
    };
    const promptDriveDraftCloseAction = () => new Promise((resolve) => {
      if (currentCloseGuardOverlay) {
        closeExistingOverlay(currentCloseGuardOverlay);
        currentCloseGuardOverlay = null;
      }
      const { overlay: guardOverlay, dialog: guardDialog } = createUnifiedDialog({
        title: null,
        showTitle: false,
        width: "420px",
        maxWidth: "92vw",
        padding: "20px",
        zIndex: "13500",
        closeOnOverlayClick: false,
        closeOnEscape: true,
        overlayClassName: "config-close-guard-overlay",
        dialogClassName: "config-close-guard-dialog",
        onClose: () => {
          if (currentCloseGuardOverlay === guardOverlay) {
            currentCloseGuardOverlay = null;
          }
        }
      });
      currentCloseGuardOverlay = guardOverlay;
      setTrustedHTML(guardDialog, `
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <h3 style="
                        margin:0;
                        font-size:18px;
                        font-weight:700;
                        color: var(--text-color, #333333);
                    " data-i18n-text="config.drive_unsaved.title"></h3>
                    <p style="
                        margin:0;
                        font-size:13px;
                        line-height:1.6;
                        color: var(--muted-text-color, #6b7280);
                    " data-i18n-text="config.drive_unsaved.message"></p>
                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:8px;
                        flex-wrap:wrap;
                        margin-top:4px;
                    ">
                        <button id="configContinueEditBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--button-bg, #f3f4f6);
                            color: var(--text-color, #333333);
                            border: 1px solid var(--border-color, #d1d5db);
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.continue_edit"></button>
                        <button id="configDiscardCloseBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--danger-color, #ef4444);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.discard_close"></button>
                        <button id="configSaveCloseBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:4px;
                        " data-i18n-text="config.drive_unsaved.save_close"></button>
                    </div>
                </div>
            `);
      const finish = (result) => {
        closeExistingOverlay(guardOverlay);
        if (currentCloseGuardOverlay === guardOverlay) {
          currentCloseGuardOverlay = null;
        }
        resolve(result);
      };
      const continueBtn = guardDialog.querySelector("#configContinueEditBtn");
      const discardBtn = guardDialog.querySelector("#configDiscardCloseBtn");
      const saveBtn = guardDialog.querySelector("#configSaveCloseBtn");
      continueBtn?.addEventListener("click", () => finish("cancel"));
      discardBtn?.addEventListener("click", () => finish("discard"));
      saveBtn?.addEventListener("click", () => finish("save"));
      const originalRequestClose = guardOverlay.__cttfRequestClose;
      guardOverlay.__cttfRequestClose = async (reason = "programmatic", event = null, closeOptions = {}) => {
        if (reason === "escape") {
          finish("cancel");
          return false;
        }
        if (typeof originalRequestClose === "function") {
          return originalRequestClose(reason, event, closeOptions);
        }
        return false;
      };
    });
    const hydrateDriveInputs = (settings) => {
      const source = settings || cachedDriveSettings || {
        clientId: "",
        clientSecret: "",
        refreshToken: "",
        fileName: DEFAULT_FILE_NAME,
        requestMode: "default",
        configCollapsed: false
      };
      if (driveClientIdInput) driveClientIdInput.value = source.clientId || "";
      if (driveClientSecretInput) driveClientSecretInput.value = source.clientSecret || "";
      if (driveRefreshTokenInput) driveRefreshTokenInput.value = source.refreshToken || "";
      if (driveFileNameInput) driveFileNameInput.value = source.fileName || DEFAULT_FILE_NAME;
      driveRequestModeValue = source.requestMode === "adguard" ? "adguard" : "default";
      updateDriveRequestModeButtons();
      driveConfigCollapsed = source.configCollapsed === true;
      applyDriveConfigFoldState();
      syncFields.forEach((field) => {
        const textarea = getFieldTextarea(field);
        if (field.dataset.secret === "true") {
          setFieldVisibility(field, false);
        } else {
          setFieldVisibility(field, true);
        }
        if (textarea) {
          adjustSyncFieldHeight(field);
          requestAnimationFrame(() => adjustSyncFieldHeight(field));
        }
      });
      requestAnimationFrame(refreshAllSyncHeights);
      updateDriveDraftBaseline(source);
    };
    const applyDriveInputChanges = () => {
      if (!driveSyncService || typeof driveSyncService.updateSettings !== "function") {
        return null;
      }
      const nextSettings = {
        enabled: driveSyncToggle ? driveSyncToggle.checked === true : true,
        clientId: driveClientIdInput ? driveClientIdInput.value.trim() : "",
        clientSecret: driveClientSecretInput ? driveClientSecretInput.value.trim() : "",
        refreshToken: driveRefreshTokenInput ? driveRefreshTokenInput.value.trim() : "",
        fileName: driveFileNameInput ? driveFileNameInput.value.trim() || DEFAULT_FILE_NAME : DEFAULT_FILE_NAME,
        requestMode: driveRequestModeValue,
        configCollapsed: driveConfigCollapsed === true
      };
      cachedDriveSettings = driveSyncService.updateSettings(nextSettings);
      updateDriveDraftBaseline(cachedDriveSettings || nextSettings);
      return cachedDriveSettings;
    };
    const ensureDriveModuleEnabled = async () => {
      if (!driveSyncToggle || !driveSyncToggle.checked) {
        setDriveModuleStatus("info", "", { messageId: "m_8fce89809baa" });
        setDriveControlsVisibility(false);
        return null;
      }
      toggleDriveButtons(true);
      setDriveModuleStatus("info", "", { messageId: "m_b40cbaef0935" });
      try {
        const service = await ensureDriveSyncService();
        driveSyncService = service;
        if (service && typeof service.setTranslator === "function") {
          try {
            service.setTranslator(t);
          } catch (_) {
          }
        }
        const updatedSettings = service && typeof service.updateSettings === "function" ? service.updateSettings({ enabled: true }) : service && typeof service.getSettings === "function" ? service.getSettings() : cachedDriveSettings;
        cachedDriveSettings = updatedSettings || cachedDriveSettings;
        setDriveControlsVisibility(true);
        hydrateDriveInputs(cachedDriveSettings);
        toggleDriveButtons(false);
        setDriveModuleStatus("info", "");
        return service;
      } catch (error) {
        console.error("Drive module load failed:", error);
        setDriveModuleStatus("error", formatDriveModuleLoadError(error));
        setDriveControlsVisibility(false);
        return null;
      }
    };
    const formatterFromService = (service) => {
      if (service && typeof service.formatDriveError === "function") {
        return service.formatDriveError;
      }
      return formatDriveModuleLoadError;
    };
    const parseDriveConfigContent = (content) => {
      try {
        const parsed = JSON.parse(content || "{}");
        if (!parsed || typeof parsed !== "object") {
          throw new Error(t("m_5df1a31bee04"));
        }
        return parsed;
      } catch (error) {
        const err = new Error(t("m_5df1a31bee04"));
        err.original = error;
        throw err;
      }
    };
    const fetchRemoteDriveConfig = async (service) => {
      try {
        const result = await service.syncDownloadConfigFromDrive();
        const parsedConfig = parseDriveConfigContent(result?.content ?? "");
        return {
          parsedConfig,
          meta: result,
          notFound: false
        };
      } catch (error) {
        if (error && error.code === "NOT_FOUND") {
          return { parsedConfig: null, meta: null, notFound: true };
        }
        throw error;
      }
    };
    const showDriveDiffChoiceDialog = ({ remoteConfig, mode = "download" }) => new Promise((resolve) => {
      if (currentConfirmOverlay3) {
        closeExistingOverlay(currentConfirmOverlay3);
      }
      const { overlay: overlay2, dialog: dialog2 } = createUnifiedDialog({
        title: null,
        showTitle: false,
        width: "560px",
        maxWidth: "94vw",
        maxHeight: "none",
        padding: "20px",
        zIndex: "13500",
        closeOnOverlayClick: false,
        overlayClassName: "drive-diff-choice-overlay",
        dialogClassName: "drive-diff-choice-dialog",
        dialogStyles: {
          borderRadius: "8px",
          boxShadow: "0 12px 28px var(--shadow-color, rgba(15, 23, 42, 0.28))",
          overflowY: "visible"
        },
        onClose: () => {
          if (currentConfirmOverlay3 === overlay2) {
            currentConfirmOverlay3 = null;
          }
        }
      });
      const statsOf = (config) => {
        const folderCount = Object.keys(config?.folders || {}).length;
        const buttonCount = Object.values(config?.folders || {}).reduce((sum, folder) => {
          return sum + Object.keys(folder.buttons || {}).length;
        }, 0);
        return { folderCount, buttonCount };
      };
      const localStats = statsOf(buttonConfig);
      const remoteStats = statsOf(remoteConfig);
      const actionLabel = mode === "upload" ? t("m_81a978ef036c") : t("m_d5bb7365ec02");
      setTrustedHTML(dialog2, `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom: 10px;">
                    <h3 style="
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--text-color, #333333);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        ☁️ ${t("m_aca979fdbd33")}
                    </h3>
                    <span style="
                        font-size: 12px;
                        padding: 4px 8px;
                        border-radius: 999px;
                        background-color: rgba(59, 130, 246, 0.12);
                        color: var(--info-color, #4F46E5);
                        border: 1px solid rgba(59, 130, 246, 0.25);
                    ">${actionLabel}</span>
                </div>

                <p style="
                    margin: 0 0 14px 0;
                    font-size: 13px;
                    color: var(--muted-text-color, #6b7280);
                    line-height: 1.5;
                ">
                    ${t("m_0b423d85c092")}
                </p>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 16px;
                ">
                    <div style="
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 8px;
                        padding: 12px;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-color, #333333);">
                            ${t("m_fe67280a8e87")}
                        </div>
                        <div style="font-size: 12px; color: var(--muted-text-color, #6b7280);">
                            ${localStats.folderCount} ${t("m_9a311c0d1474")} · ${localStats.buttonCount} ${t("m_3a591ab6fe4d")}
                        </div>
                    </div>
                    <div style="
                        border: 1px solid var(--info-color, #4F46E5);
                        border-radius: 8px;
                        padding: 12px;
                        background-color: rgba(79, 70, 229, 0.06);
                    ">
                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--info-color, #4F46E5);">
                            ${t("m_5b8f82579075")}
                        </div>
                        <div style="font-size: 12px; color: var(--info-color, #4F46E5);">
                            ${remoteStats.folderCount} ${t("m_9a311c0d1474")} · ${remoteStats.buttonCount} ${t("m_3a591ab6fe4d")}
                        </div>
                    </div>
                </div>

                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                ">
                    <button id="driveViewDiffBtn" style="
                        ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 6px;
                    ">${t("m_27e029bfe920")}</button>
                    <div style="display:flex; gap: 8px; align-items:center; flex-wrap: wrap; justify-content: flex-end;">
                        <button id="driveUseLocalBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--success-color, #22c55e);
                            color: white;
                            border-radius:6px;
                        ">${t("m_9b437d4c1413")}</button>
                        <button id="driveUseRemoteBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--info-color, #4F46E5);
                            color: white;
                            border-radius:6px;
                        ">${t("m_27ba06b21165")}</button>
                        <button id="cancelDriveSyncBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(";")};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:6px;
                        ">${t("m_4d0b4688c787")}</button>
                    </div>
                </div>
            `);
      currentConfirmOverlay3 = overlay2;
      const closeDialog = (result) => {
        if (currentDiffOverlay) {
          if (typeof currentDiffOverlay.__cttfCloseDiff === "function") {
            currentDiffOverlay.__cttfCloseDiff();
          } else {
            closeExistingOverlay(currentDiffOverlay);
            currentDiffOverlay = null;
          }
        }
        closeExistingOverlay(overlay2);
        resolve(result);
      };
      const diffBtn = dialog2.querySelector("#driveViewDiffBtn");
      if (diffBtn) {
        diffBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          try {
            showImportDiffPreview(buttonConfig, remoteConfig, {
              currentLabel: t("m_fe67280a8e87"),
              importedLabel: t("m_5b8f82579075")
            });
          } catch (error) {
            console.error("[CTTF] Drive diff preview failed:", error);
          }
        });
      }
      const useLocalBtn = dialog2.querySelector("#driveUseLocalBtn");
      if (useLocalBtn) {
        useLocalBtn.addEventListener("click", () => closeDialog("local"));
      }
      const useRemoteBtn = dialog2.querySelector("#driveUseRemoteBtn");
      if (useRemoteBtn) {
        useRemoteBtn.addEventListener("click", () => closeDialog("remote"));
      }
      const cancelBtn = dialog2.querySelector("#cancelDriveSyncBtn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => closeDialog("cancel"));
      }
    });
    const initializeDriveToggle = () => {
      if (!driveSyncToggle) return Promise.resolve(null);
      driveSyncToggle.checked = driveHostPrefs.enabled === true;
      if (driveSyncToggle.checked) {
        const loadPromise = ensureDriveModuleEnabled();
        driveSyncToggle.addEventListener("change", async () => {
          const enabled = driveSyncToggle.checked;
          persistDriveHostPrefs({ enabled });
          if (enabled) {
            await ensureDriveModuleEnabled();
          } else {
            if (driveSyncService && typeof driveSyncService.updateSettings === "function") {
              cachedDriveSettings = driveSyncService.updateSettings({ enabled: false });
            } else {
              cachedDriveSettings = { ...cachedDriveSettings || {}, enabled: false };
            }
            setDriveControlsVisibility(false);
            setDriveModuleStatus("info", "");
            setDriveStatus("info", "");
          }
        });
        return loadPromise;
      } else {
        setDriveControlsVisibility(false);
        setDriveModuleStatus("info", "", { messageId: "m_a003ca900128" });
      }
      driveSyncToggle.addEventListener("change", async () => {
        const enabled = driveSyncToggle.checked;
        persistDriveHostPrefs({ enabled });
        if (enabled) {
          await ensureDriveModuleEnabled();
        } else {
          if (driveSyncService && typeof driveSyncService.updateSettings === "function") {
            cachedDriveSettings = driveSyncService.updateSettings({ enabled: false });
          } else {
            cachedDriveSettings = { ...cachedDriveSettings || {}, enabled: false };
          }
          setDriveControlsVisibility(false);
          setDriveModuleStatus("info", "");
          setDriveStatus("info", "");
        }
      });
      return Promise.resolve(null);
    };
    handleConfigDialogBeforeClose = async () => {
      if (!hasPendingDriveDraftChanges()) {
        return true;
      }
      const closeAction = await promptDriveDraftCloseAction();
      if (closeAction === "cancel") {
        return false;
      }
      if (closeAction === "discard") {
        hydrateDriveInputs(cachedDriveSettings || driveDraftBaseline || {});
        setDriveStatus("info", "");
        return true;
      }
      try {
        await ensureDriveSyncService();
        applyDriveInputChanges();
        setDriveStatus("success", "", { messageId: "m_16ac0480568c" });
        return true;
      } catch (error) {
        console.error("Drive settings save before close failed:", error);
        setDriveStatus("error", formatDriveModuleLoadError(error));
        return false;
      }
    };
    const applyCapturedDialogState = (state) => {
      if (!state) {
        return;
      }
      if (typeof state.activeTab === "string" && state.activeTab) {
        activateTab(state.activeTab);
      }
      if (driveSyncToggle) {
        driveSyncToggle.checked = state.driveEnabled === true;
        if (!driveSyncToggle.checked) {
          setDriveControlsVisibility(false);
        }
      }
      if (driveClientIdInput) driveClientIdInput.value = state.driveClientId || "";
      if (driveClientSecretInput) driveClientSecretInput.value = state.driveClientSecret || "";
      if (driveRefreshTokenInput) driveRefreshTokenInput.value = state.driveRefreshToken || "";
      if (driveFileNameInput) driveFileNameInput.value = state.driveFileName || DEFAULT_FILE_NAME;
      driveRequestModeValue = state.driveRequestMode === "adguard" ? "adguard" : "default";
      updateDriveRequestModeButtons();
      driveConfigCollapsed = state.driveConfigCollapsed === true;
      applyDriveConfigFoldState();
      const secretField = driveClientSecretInput ? driveClientSecretInput.closest(".cttf-sync-field") : null;
      const refreshField = driveRefreshTokenInput ? driveRefreshTokenInput.closest(".cttf-sync-field") : null;
      if (secretField) {
        setFieldVisibility(secretField, state.driveClientSecretVisible === true);
      }
      if (refreshField) {
        setFieldVisibility(refreshField, state.driveRefreshTokenVisible === true);
      }
      refreshAllSyncHeights();
      updateDriveDraftBaseline();
    };
    const refreshConfigDialogLocale = () => {
      updateLanguageButtonState(getLanguagePreference());
      updateFolderIconToggleState();
      updateDriveRequestModeButtons();
      applyDriveConfigFoldState();
      syncFields.forEach((field) => {
        if (!field) {
          return;
        }
        setFieldVisibility(field, field.dataset.visible === "true");
      });
      setDriveModuleStatus(
        driveModuleStatusState.type,
        driveModuleStatusState.text,
        {
          messageId: driveModuleStatusState.messageId,
          replacements: driveModuleStatusState.replacements
        }
      );
      setDriveStatus(
        driveStatusState.type,
        driveStatusState.text,
        {
          messageId: driveStatusState.messageId,
          replacements: driveStatusState.replacements
        }
      );
      requestAnimationFrame(refreshAllSyncHeights);
    };
    updateDriveDraftBaseline();
    const driveToggleReady = initializeDriveToggle();
    Promise.resolve(driveToggleReady).finally(() => {
      if (initialState) {
        applyCapturedDialogState(initialState);
      }
    });
    if (driveRequestModeButtons.length) {
      driveRequestModeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.driveRequestMode === "adguard" ? "adguard" : "default";
          driveRequestModeValue = val;
          updateDriveRequestModeButtons();
          applyDriveInputChanges();
        });
      });
    }
    if (driveConfigFoldToggle && driveConfigFields && driveConfigFoldArrow) {
      driveConfigFoldToggle.addEventListener("click", () => {
        driveConfigCollapsed = !driveConfigCollapsed;
        applyDriveConfigFoldState();
        applyDriveInputChanges();
      });
    }
    if (driveSaveBtn) {
      driveSaveBtn.addEventListener("click", async () => {
        const service = await ensureDriveModuleEnabled();
        if (!service) return;
        applyDriveInputChanges();
        setDriveStatus("success", "", { messageId: "m_16ac0480568c" });
      });
    }
    if (driveUploadBtn) {
      driveUploadBtn.addEventListener("click", async () => {
        const service = await ensureDriveModuleEnabled();
        if (!service) return;
        applyDriveInputChanges();
        if (typeof service.ensureDriveSyncApiAvailable === "function" && !service.ensureDriveSyncApiAvailable()) {
          setDriveStatus("error", "", { messageId: "m_8db845c5073b" });
          return;
        }
        if (typeof service.hasDriveCredentials === "function" && !service.hasDriveCredentials()) {
          setDriveStatus("error", "", { messageId: "m_b2a17fcb4e17" });
          return;
        }
        const formatter = formatterFromService(service);
        toggleDriveButtons(true);
        setDriveStatus("info", "", { messageId: "m_315e9404693b" });
        try {
          const remote = await fetchRemoteDriveConfig(service);
          if (remote.notFound) {
            setDriveStatus("info", "", { messageId: "m_345f882bd9c1" });
            await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
            cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
            hydrateDriveInputs(cachedDriveSettings);
            setDriveStatus("success", "", { messageId: "m_f27351c4a629" });
            return;
          }
          const remoteConfig = remote.parsedConfig;
          if (configsStructurallyEqual(buttonConfig, remoteConfig)) {
            setDriveStatus("success", "", { messageId: "m_67dedc24dc09" });
            return;
          }
          const decision = await showDriveDiffChoiceDialog({
            remoteConfig,
            mode: "upload"
          });
          if (decision === "cancel") {
            setDriveStatus("info", "", { messageId: "m_3b8ad2dfebd4" });
            return;
          }
          if (decision === "remote") {
            applyConfigFromRemote(remoteConfig);
            cachedDriveSettings = remote.meta && remote.meta.settings || (service.getSettings ? service.getSettings() : cachedDriveSettings);
            hydrateDriveInputs(cachedDriveSettings);
            setDriveStatus("success", "", { messageId: "m_e0f2f560f582" });
            return;
          }
          await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
          cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
          hydrateDriveInputs(cachedDriveSettings);
          setDriveStatus("success", "", { messageId: "m_f27351c4a629" });
        } catch (error) {
          console.error("Drive upload failed:", error);
          const message = error?.message || formatter(error);
          setDriveStatus("error", message);
        } finally {
          toggleDriveButtons(false);
        }
      });
    }
    if (driveDownloadBtn) {
      driveDownloadBtn.addEventListener("click", async () => {
        const service = await ensureDriveModuleEnabled();
        if (!service) return;
        applyDriveInputChanges();
        if (typeof service.ensureDriveSyncApiAvailable === "function" && !service.ensureDriveSyncApiAvailable()) {
          setDriveStatus("error", "", { messageId: "m_8db845c5073b" });
          return;
        }
        if (typeof service.hasDriveCredentials === "function" && !service.hasDriveCredentials()) {
          setDriveStatus("error", "", { messageId: "m_b2a17fcb4e17" });
          return;
        }
        const formatter = formatterFromService(service);
        toggleDriveButtons(true);
        setDriveStatus("info", "", { messageId: "m_315e9404693b" });
        try {
          const remote = await fetchRemoteDriveConfig(service);
          if (remote.notFound) {
            setDriveStatus("error", "", { messageId: "m_345f882bd9c1" });
            return;
          }
          const remoteConfig = remote.parsedConfig;
          if (configsStructurallyEqual(buttonConfig, remoteConfig)) {
            setDriveStatus("success", "", { messageId: "m_67dedc24dc09" });
            return;
          }
          const decision = await showDriveDiffChoiceDialog({
            remoteConfig,
            mode: "download"
          });
          if (decision === "cancel") {
            setDriveStatus("info", "", { messageId: "m_3b8ad2dfebd4" });
            return;
          }
          if (decision === "local") {
            await service.syncUploadConfigToDrive(JSON.stringify(buttonConfig, null, 2));
            cachedDriveSettings = service.getSettings ? service.getSettings() : cachedDriveSettings;
            hydrateDriveInputs(cachedDriveSettings);
            setDriveStatus("success", "", { messageId: "m_f27351c4a629" });
            return;
          }
          applyConfigFromRemote(remoteConfig);
          cachedDriveSettings = remote.meta && remote.meta.settings || (service.getSettings ? service.getSettings() : cachedDriveSettings);
          hydrateDriveInputs(cachedDriveSettings);
          setDriveStatus("success", "", { messageId: "m_ce39d809e5a2" });
        } catch (error) {
          console.error("Drive download failed:", error);
          const message = error?.message || formatter(error);
          setDriveStatus("error", message);
        } finally {
          toggleDriveButtons(false);
        }
      });
    }
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
      if (currentConfigOverlay !== overlay) {
        return;
      }
      if (currentCloseGuardOverlay) {
        closeExistingOverlay(currentCloseGuardOverlay);
        currentCloseGuardOverlay = null;
      }
      if (currentConfirmOverlay3) {
        closeExistingOverlay(currentConfirmOverlay3);
        currentConfirmOverlay3 = null;
      }
      if (currentDiffOverlay) {
        if (typeof currentDiffOverlay.__cttfCloseDiff === "function") {
          currentDiffOverlay.__cttfCloseDiff();
        } else {
          closeExistingOverlay(currentDiffOverlay);
          currentDiffOverlay = null;
        }
      }
      refreshConfigDialogLocale();
    });
    dialog.querySelector("#importConfigBtn").addEventListener("click", () => {
      importConfig(() => {
        if (getCurrentSettingsOverlay()) {
          setSelectedFolderName(buttonConfig.folderOrder[0] || null);
          renderFolderList();
          renderButtonList();
          setTimeout(() => {
            updateCounters();
          }, 50);
        }
        if (currentConfigOverlay) {
          closeExistingOverlay(currentConfigOverlay);
          currentConfigOverlay = null;
          console.log(t("m_58d4a48c7fb5"));
        }
      });
    });
    dialog.querySelector("#exportConfigBtn").addEventListener("click", () => {
      exportConfig();
      setTimeout(() => {
        if (currentConfigOverlay) {
          closeExistingOverlay(currentConfigOverlay);
          currentConfigOverlay = null;
          console.log(t("m_6ca48ae98250"));
        }
      }, 500);
    });
    dialog.querySelector("#resetSettingsBtn").addEventListener("click", () => {
      if (confirm(t("m_45afc995dcaa"))) {
        if (currentConfigOverlay) {
          closeExistingOverlay(currentConfigOverlay);
          currentConfigOverlay = null;
          console.log(t("m_a2da04e54c4f"));
        }
        const nextDefaultConfig = createDefaultConfig();
        setButtonConfig(cloneSerializable(nextDefaultConfig, {
          fallback: nextDefaultConfig,
          logLabel: "[Chat] Template Text Folders default config clone failed:"
        }));
        hydrateButtonConfigDefaults(buttonConfig, { silent: true });
        persistButtonConfig();
        if (getCurrentSettingsOverlay()) {
          setSelectedFolderName(buttonConfig.folderOrder[0] || null);
          renderFolderList();
          renderButtonList();
        }
        console.log(t("m_c0aa47e7a67c"));
        updateButtonContainer();
        try {
          applyDomainStyles();
        } catch (_) {
        }
        setTimeout(() => {
          updateCounters();
          console.log(t("m_c8d00e5dddcb"));
          setTimeout(() => {
            alert(t("m_5b31c4e45971"));
          }, 50);
        }, 100);
      }
    });
  };

  // src/bootstrap/initialization.js
  var lastKnownLocationHref = "";
  var locationObserverInitialized = false;
  var pendingRefreshTimer = null;
  var pendingSettledRefreshTimer = null;
  var rerenderRuntimeUI = () => {
    attachButtons();
    try {
      applyDomainStyles();
    } catch (_) {
    }
  };
  var scheduleRuntimeRefresh = (delay = 0) => {
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
  var handleLocationChange = () => {
    const nextHref = window.location.href;
    if (!nextHref || nextHref === lastKnownLocationHref) {
      return;
    }
    lastKnownLocationHref = nextHref;
    scheduleRuntimeRefresh();
  };
  var patchHistoryMethod = (methodName) => {
    const originalMethod = history[methodName];
    if (typeof originalMethod !== "function" || originalMethod.__cttfPatched) {
      return;
    }
    const patchedMethod = function(...args) {
      const result = originalMethod.apply(this, args);
      handleLocationChange();
      return result;
    };
    patchedMethod.__cttfPatched = true;
    history[methodName] = patchedMethod;
  };
  var setupLocationObserver = () => {
    if (locationObserverInitialized) {
      return;
    }
    locationObserverInitialized = true;
    lastKnownLocationHref = window.location.href;
    patchHistoryMethod("pushState");
    patchHistoryMethod("replaceState");
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
  };
  var initialize = () => {
    lastKnownLocationHref = window.location.href;
    attachButtons();
    const observer = new MutationObserver((mutations) => {
      let triggered = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
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
        console.log(t("m_e2ee892dbd90"));
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log(t("m_d81628898afa"));
    setupLocationObserver();
    scheduleRuntimeRefresh();
  };
  var updateStylesOnThemeChange = () => {
    updateButtonContainer();
    try {
      applyDomainStyles();
    } catch (_) {
    }
  };
  var setupInitialization = () => {
    window.addEventListener("load", () => {
      console.log(t("m_3aaf48c90271"));
      initialize();
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      setCSSVariables(getCurrentTheme());
      updateStylesOnThemeChange();
      console.log(t("m_1c7ce90c05af"));
    });
    setCSSVariables(getCurrentTheme());
  };

  // src/main.js
  setShowUnifiedSettingsDialogHandler(showUnifiedSettingsDialog);
  setShowConfigSettingsDialogHandler(showConfigSettingsDialog);
  setUpdateCountersHandler(updateCounters);
  setCloseConfigOverlayHandler(closeCurrentConfigOverlay);
  setupInitialization();
})();
