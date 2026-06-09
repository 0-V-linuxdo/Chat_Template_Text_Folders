// ==UserScript==
// @name         [Chat] Template Text Folders [20260609] v1.0.3
// @namespace    https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @description  在多个 AI 聊天网站中管理提示词文件夹与快捷按钮，支持变量插入、自动提交、样式定制和 Google Drive 同步。
//
// @version      [20260609] v1.0.3
// @update-log   优化 @match 分类分组，新增分组首行注释，并将 Copilot 与 Meta AI 分组置底。
//
// [OpenAI / ChatGPT]
// @match        https://chatgpt.com/*
// @match        https://chat01.ai/*
//
// [Anthropic / Claude]
// @match        https://claude.ai/*
//
// [Google / Gemini]
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://business.gemini.google/*
//
// [xAI / Grok]
// @match        https://grok.com/*
// @match        https://grok.dairoot.cn/*
// @match        https://x.com/i/grok*
//
// [China]
// @match        https://chat.deepseek.com/*
// @match        https://chat.z.ai/*
// @match        https://chat.qwen.ai/*
// @match        https://anuneko.com/*
//
// [Mistral]
// @match        https://chat.mistral.ai/*
//
// [Search]
// @match        https://*.perplexity.ai/*
// @match        https://kagi.com/assistant*
// @match        https://assistant.kagi.com/*
//
// [聚合]
// @match        https://arena.ai/*
// @match        https://manus.im/*
// @match        https://poe.com/*
// @match        https://app.chathub.gg/*
// @match        https://app.lobehub.com/*
// @match        https://monica.im/*
// @match        https://web.tabbitbrowser.com/*
//
// [BYOK]
// @match        https://setapp.typingcloud.com/*
// @match        https://cerebr.fugue.pro/*
// @match        https://cerebr.vercel.app/*
// @match        https://cerebr.yym68686.top/*
// @match        https://cerebr.pages.dev/*
//
// [Notion / AI]
// @match        https://app.notion.com/*
// @match        https://www.notion.so/*
//
// [Microsoft / Copilot]
// @match        https://copilot.microsoft.com/*
//
// [Meta AI]
// @match        https://meta.ai/*
//
// @grant        GM_xmlhttpRequest
// @connect      oauth2.googleapis.com
// @connect      www.googleapis.com
// @connect      github.com
// @icon         https://raw.githubusercontent.com/0-V-linuxdo/Chat_Template_Text_Folders/main/Icon.svg
// ==/UserScript==
