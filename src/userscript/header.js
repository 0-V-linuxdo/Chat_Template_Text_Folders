// ==UserScript==
// @name               [Chat] Template Text Folders [20260620] v1.0.0
// @name:zh-CN         [聊天] 模板文本文件夹 [20260620] v1.0.0
// @namespace          https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @description        Manage prompt folders and shortcut buttons across AI chat sites, with variable insertion, auto-submit, style customization, and Google Drive sync.
// @description:zh-CN  在多个 AI 聊天网站中管理提示词文件夹与快捷按钮，支持变量插入、自动提交、样式定制和 Google Drive 同步。
//
// @version            [20260620] v1.0.0
// @update-log         Migrate Dairoot mirror URL to gk.dairoot.cn and remove ChatHub support.
// @update-log:zh-CN   迁移 Dairoot 镜像站 URL 至 gk.dairoot.cn，并移除 ChatHub 适配。
//
// [Group 1 | OpenAI/ChatGPT]
// @match              https://chatgpt.com/*
// @match              https://chat01.ai/*
//
// [Group 2 | Anthropic/Claude]
// @match              https://claude.ai/*
//
// [Group 3 | Google/Gemini]
// @match              https://gemini.google.com/*
// @match              https://aistudio.google.com/*
// @match              https://business.gemini.google/*
//
// [Group 4 | xAI/Grok]
// @match              https://grok.com/*
// @match              https://gk.dairoot.cn/*
// @match              https://x.com/i/grok*
//
// [Group 5 | China / deepseek GLM qwen anuneko]
// @match              https://chat.deepseek.com/*
// @match              https://chat.z.ai/*
// @match              https://chat.qwen.ai/*
// @match              https://anuneko.com/*
//
// [Group 6 | Search / perplexity kagi]
// @match              https://*.perplexity.ai/*
// @match              https://kagi.com/assistant*
// @match              https://assistant.kagi.com/*
//
// [Group 7 | 聚合]
// @match              https://arena.ai/*
// @match              https://manus.im/*
// @match              https://poe.com/*
// @match              https://app.lobehub.com/*
// @match              https://monica.im/*
// @match              https://web.tabbitbrowser.com/*
//
// [Group 8 | BYOK / typingcloud cerebr]
// @match              https://setapp.typingcloud.com/*
// @match              https://cerebr.fugue.pro/*
// @match              https://cerebr.vercel.app/*
// @match              https://cerebr.yym68686.top/*
// @match              https://cerebr.pages.dev/*
//
// [Group 9 | Notion/AI]
// @match              https://app.notion.com/*
// @match              https://www.notion.so/*
//
// [Group 10 | Mistral]
// @match              https://chat.mistral.ai/*
//
// [Group 11 | Microsoft/Copilot]
// @match              https://copilot.microsoft.com/*
//
// [Group 12 | Meta/AI]
// @match              https://meta.ai/*
//
// @grant              GM_xmlhttpRequest
// @connect            oauth2.googleapis.com
// @connect            www.googleapis.com
// @connect            github.com
//
// @icon               https://raw.githubusercontent.com/0-V-linuxdo/Chat_Template_Text_Folders/main/Icon.svg
// ==/UserScript==
