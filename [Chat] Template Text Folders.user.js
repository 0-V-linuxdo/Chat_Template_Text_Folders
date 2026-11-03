// ==UserScript==
// @name         [Chat] Template Text Folders
// @namespace    https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @version      2.0.16
// @description  在 AI 聊天网页的输入框下方添加「提示词模板」文件夹与按钮,一键插入 / 发送常用文本;支持 WebDAV 同步。
// @author       0-V-linuxdo
// @icon         https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/raw/refs/heads/main/Icon.svg
// @homepageURL  https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @supportURL   https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/issues
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @match        *://chat01.ai/*
// @match        *://claude.ai/*
// @match        *://gemini.google.com/*
// @match        *://aistudio.google.com/*
// @match        *://business.gemini.google/*
// @match        *://grok.com/*
// @match        *://gk.dairoot.cn/*
// @match        *://x.com/i/grok*
// @match        *://chat.deepseek.com/*
// @match        *://chat.z.ai/*
// @match        *://chat.qwen.ai/*
// @match        *://anuneko.com/*
// @match        *://*.perplexity.ai/*
// @match        *://perplexity.ai/*
// @match        *://assistant.kagi.com/*
// @match        *://arena.ai/*
// @match        *://lmarena.ai/*
// @match        *://manus.im/*
// @match        *://poe.com/*
// @match        *://app.lobehub.com/*
// @match        *://monica.im/*
// @match        *://web.tabbit.ai/*
// @match        *://setapp.typingcloud.com/*
// @match        *://cerebr.fugue.pro/*
// @match        *://cerebr.vercel.app/*
// @match        *://cerebr.yym68686.top/*
// @match        *://cerebr.pages.dev/*
// @match        *://app.notion.com/*
// @match        *://www.notion.so/*
// @match        *://chat.mistral.ai/*
// @match        *://copilot.microsoft.com/*
// @match        *://web.telegram.org/a/*
// @match        *://meta.ai/*
// @match        *://www.meta.ai/*
// @run-at       document-start
// @inject-into  auto
// @sandbox      JavaScript
// @noframes
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __export = (target2, all) => {
    for (var name in all)
      __defProp(target2, name, { get: all[name], enumerable: true });
  };

  // <define:__USPP_SCRIPT__>
  var define_USPP_SCRIPT_default = { id: "cttf", name: "[Chat] Template Text Folders", global: null };

  // <define:__USPP_SITES__>
  var define_USPP_SITES_default = ["chat"];

  // ../Userscriptpp/core/env.js
  var W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
  var GM = {
    get: typeof GM_getValue === "function" ? GM_getValue : null,
    set: typeof GM_setValue === "function" ? GM_setValue : null,
    del: typeof GM_deleteValue === "function" ? GM_deleteValue : null,
    xhr: typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null,
    addListener: typeof GM_addValueChangeListener === "function" ? GM_addValueChangeListener : null,
    removeListener: typeof GM_removeValueChangeListener === "function" ? GM_removeValueChangeListener : null,
    menu: typeof GM_registerMenuCommand === "function" ? GM_registerMenuCommand : null,
    unmenu: typeof GM_unregisterMenuCommand === "function" ? GM_unregisterMenuCommand : null,
    clipboard: typeof GM_setClipboard === "function" ? GM_setClipboard : null
  };
  var VERSION = true ? "2.0.16" : "0.0.0";
  var IS_DEV = true ? false : false;
  var BUILD_TYPE = IS_DEV ? "development" : "production";
  var isChromium = () => !!W.chrome;
  var SCRIPT = typeof define_USPP_SCRIPT_default !== "undefined" ? define_USPP_SCRIPT_default : { id: "dev", name: "Userscript++ script", global: null };
  var SCRIPT_ID = SCRIPT.id;
  var SCRIPT_NAME = SCRIPT.name;
  var GLOBAL_NAME = SCRIPT.global || null;
  var INSTANCE_KEY = Symbol.for(`uspp:${SCRIPT_ID}`);
  var INSTANCE_EXPR = `window[Symbol.for(${JSON.stringify(`uspp:${SCRIPT_ID}`)})]`;
  var API_VERSION = 1;

  // sites/chat/u.js
  var U = null;
  var bindApi = (api) => {
    U = api;
  };
  var h = (...a3) => U.react.h(...a3);
  var Fragment = Symbol.for("react.fragment");
  var useState = (...a3) => U.react.useState(...a3);
  var useEffect = (...a3) => U.react.useEffect(...a3);
  var useRef = (...a3) => U.react.useRef(...a3);
  var useReducer = (...a3) => U.react.useReducer(...a3);

  // sites/chat/hosts.js
  var prefix = (...list) => (u3) => list.some((p3) => u3.pathname.startsWith(p3));
  var HOSTS = [
    {
      id: "chatgpt",
      name: "ChatGPT",
      ssr: true,
      readyInput: "div.ProseMirror[contenteditable='true']",
      matches: ["*://chatgpt.com/*", "*://chat.openai.com/*"],
      input: ["#prompt-textarea[contenteditable='true']", "form .ProseMirror[contenteditable='true']", "div.ProseMirror[contenteditable='true']", "textarea#prompt-textarea"],
      send: ["#composer-submit-button", "button[data-testid='send-button']", "form button[type='submit'][aria-label]"],
      hide: (u3) => prefix("/codex", "/gpts", "/admin", "/payments", "/library", "/apps", "/plugins")(u3) || u3.hash.startsWith("#pricing"),
      // 底部免责声明压成单行,避免输入框被按钮栏顶高
      css: `#thread-bottom-container .text-token-text-secondary, .text-codex-description { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`
    },
    { id: "chat01", name: "Chat01", matches: ["*://chat01.ai/*"], input: ["textarea"], send: ["button[type='submit']"], hide: (u3) => /^\/[^/]+\/(history|pricing|credits)/.test(u3.pathname), css: "main { padding-bottom: 40px; }" },
    {
      id: "claude",
      name: "Claude",
      ssr: true,
      matches: ["*://claude.ai/*"],
      input: ["div.ProseMirror[contenteditable='true']", "[data-testid='chat-input'] [contenteditable='true']"],
      send: ["button[aria-label='Send message']", "button[aria-label*='Send']", "button[aria-label*='发送']"],
      hide: prefix("/login", "/settings", "/upgrade", "/gift", "/downloads")
    },
    {
      id: "gemini",
      name: "Gemini",
      matches: ["*://gemini.google.com/*"],
      input: ["rich-textarea .ql-editor[contenteditable='true']", ".ql-editor[contenteditable='true']"],
      send: ["button.send-button", "button[aria-label*='Send']", "button[aria-label*='发送']"],
      hide: prefix("/mystuff", "/gems", "/personalization-settings", "/saved-info", "/apps", "/extensions")
    },
    {
      id: "aistudio",
      name: "Google AI Studio",
      matches: ["*://aistudio.google.com/*"],
      input: ["ms-prompt-input-wrapper textarea", "ms-chunk-input textarea", "textarea"],
      send: ["run-button button", "button[aria-label='Run']"],
      hide: (u3) => !u3.pathname.startsWith("/prompts"),
      bar: { height: 40, bottom: 6 }
    },
    { id: "gemini-business", name: "Gemini Business", matches: ["*://business.gemini.google/*"], input: ["[contenteditable='true']", "textarea"], send: [] },
    {
      id: "grok",
      name: "Grok",
      matches: ["*://grok.com/*", "*://gk.dairoot.cn/*", "*://x.com/i/grok*"],
      input: ["div.tiptap.ProseMirror[contenteditable='true']", "textarea[aria-label]", "textarea"],
      send: ["button[type='submit'][aria-label]"],
      hide: (u3) => u3.hash.startsWith("#subscribe") || prefix("/files", "/share-links", "/admin")(u3) || u3.hostname === "x.com" && !u3.pathname.startsWith("/i/grok")
    },
    { id: "deepseek", name: "DeepSeek", matches: ["*://chat.deepseek.com/*"], input: ["textarea#chat-input", "textarea"], send: ["div[role='button'][aria-disabled]"] },
    { id: "zai", name: "Z.ai", matches: ["*://chat.z.ai/*"], input: ["textarea#chat-input", "textarea"], send: ["button#send-message-button", "button[type='submit']"] },
    { id: "qwen", name: "Qwen", matches: ["*://chat.qwen.ai/*"], input: ["textarea#chat-input", "textarea"], send: ["button#send-message-button", "button.send-button"] },
    { id: "anuneko", name: "Anuneko", matches: ["*://anuneko.com/*"], input: ["textarea", "[contenteditable='true']"], send: [] },
    {
      id: "perplexity",
      name: "Perplexity",
      matches: ["*://*.perplexity.ai/*", "*://perplexity.ai/*"],
      input: ["#ask-input[contenteditable='true']", "div[contenteditable='true'][role='textbox']", "textarea"],
      send: ["button[data-testid='submit-button']", "button[aria-label='Submit']"],
      hide: prefix("/settings", "/discover", "/spaces", "/account", "/library")
    },
    { id: "kagi", name: "Kagi Assistant", matches: ["*://assistant.kagi.com/*"], input: ["textarea#promptBox", "textarea"], send: ["button[aria-label='Send message']", "button#submit[type='submit']"], css: "main.main-center-box { padding-bottom: 20px; } [data-uspp-cttf=bar] { z-index: 2147483000; }" },
    { id: "arena", name: "Arena", matches: ["*://arena.ai/*", "*://lmarena.ai/*"], input: ["textarea"], send: [], hide: prefix("/history/search", "/leaderboard") },
    { id: "manus", name: "Manus", matches: ["*://manus.im/*"], input: ["textarea", "[contenteditable='true']"], send: [], hide: prefix("/app/agents", "/app/library") },
    { id: "poe", name: "Poe", matches: ["*://poe.com/*"], input: ["textarea[class*='GrowingTextArea']", "textarea"], send: ["button[data-button-send='true']", "button[aria-label='Send message']"], hide: prefix("/explore", "/chats", "/profile", "/settings", "/create") },
    { id: "lobehub", name: "LobeHub", matches: ["*://app.lobehub.com/*"], input: ["[contenteditable='true'][data-lexical-editor='true']", "textarea"], send: [], bar: { height: 40, bottom: 6 } },
    { id: "monica", name: "Monica", matches: ["*://monica.im/*"], input: ["textarea"], send: [], hide: prefix("/home/search"), bar: { height: 40, bottom: 6 } },
    { id: "tabbit", name: "Tabbit Browser", matches: ["*://web.tabbit.ai/*"], input: ["textarea", "[contenteditable='true']"], send: [] },
    { id: "typingcloud", name: "TypingCloud SetApp", matches: ["*://setapp.typingcloud.com/*"], input: ["textarea"], send: [], css: "main { padding-bottom: 30px; }" },
    { id: "cerebr", name: "Cerebr", matches: ["*://cerebr.fugue.pro/*", "*://cerebr.vercel.app/*", "*://cerebr.yym68686.top/*", "*://cerebr.pages.dev/*"], input: ["#message-input", "[contenteditable='true']", "textarea"], send: [] },
    { id: "notion", name: "Notion", matches: ["*://app.notion.com/*", "*://www.notion.so/*"], input: ["[contenteditable='true'][role='textbox']"], send: [], hide: (u3) => !/(^|\/)(ai|chat)(\/|$|\?)/.test(u3.pathname + u3.search) },
    { id: "mistral", name: "Mistral", matches: ["*://chat.mistral.ai/*"], input: ["div.ProseMirror[contenteditable='true']", "textarea"], send: ["button[type='submit']"] },
    { id: "copilot", name: "Microsoft Copilot", matches: ["*://copilot.microsoft.com/*"], input: ["textarea#userInput", "textarea"], send: ["button[data-testid='submit-button']", "button[aria-label*='Submit']"] },
    {
      id: "telegram",
      name: "Telegram Web A",
      matches: ["*://web.telegram.org/a/*"],
      input: [".messages-layout .Transition_slide-active #editable-message-text", ".messages-layout .Transition > .Transition_slide-to #editable-message-text", "#editable-message-text", "#editable-message-text-modal", "#editable-story-input-text"],
      send: ["button.Button.send", ".middle-column-footer button.Button.send", ".Composer button.Button.send", "button.send.default", "button[class~='send']"],
      plainTextEditor: true,
      // 焦点在 Telegram 的输入区里时取 Telegram 自己的输入框
      special: { test: (el) => !!el.closest?.("#message-input-text, .Composer") },
      bar: { height: 40, bottom: 6 }
    },
    { id: "meta", name: "Meta AI", matches: ["*://meta.ai/*", "*://www.meta.ai/*"], input: ["[contenteditable='true'][role='textbox']", "textarea"], send: ["div[aria-label='Send Message']"] }
  ];
  var ALL_MATCHES = [...new Set(HOSTS.flatMap((x4) => x4.matches))];
  var toRe = (pattern) => {
    const m3 = /^(\*|https?):\/\/([^/]+)(\/.*)$/.exec(pattern);
    if (!m3) return null;
    const host2 = m3[2].replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/^\\\*\\\./, "(?:[^/]+\\.)?").replace(/\*/g, "[^/]*");
    const path = m3[3].replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${m3[1] === "*" ? "https?" : m3[1]}://${host2}${path}$`);
  };
  var GENERIC = { id: "generic", name: "Generic", matches: [], input: [], send: [] };
  function hostFor(url) {
    for (const x4 of HOSTS) if (x4.matches.some((p3) => toRe(p3)?.test(url))) return x4;
    return GENERIC;
  }

  // sites/chat/lib/composer.js
  var composer_exports = {};
  __export(composer_exports, {
    VAR_PATTERN: () => VAR_PATTERN,
    allEditables: () => allEditables,
    clearInput: () => clearInput,
    deepActive: () => deepActive,
    editorType: () => editorType,
    expandTemplate: () => expandTemplate,
    findTarget: () => findTarget,
    getProfile: () => getProfile,
    getText: () => getText,
    hasEditable: () => hasEditable,
    isEditable: () => isEditable,
    isTextControl: () => isTextControl,
    needsClipboard: () => needsClipboard,
    readClipboard: () => readClipboard,
    replacesInput: () => replacesInput,
    setProfile: () => setProfile,
    trackComposition: () => trackComposition,
    waitComposition: () => waitComposition,
    writeClipboard: () => writeClipboard,
    writeText: () => writeText
  });
  var profile = { input: [], send: [] };
  var setProfile = (p3) => {
    profile = p3 || profile;
  };
  var getProfile = () => profile;
  var EDITABLE_SEL = "textarea, [contenteditable='true'], [contenteditable=''], [contenteditable='plaintext-only']";
  var isOurs = (el) => !!el?.closest?.("[data-uspp-cttf], uspp-cttf-root");
  var isTextControl = (el) => !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" && /^(text|search)$/i.test(el.type || "text"));
  var isEditable = (el) => !!el && el.nodeType === 1 && !isOurs(el) && (el.tagName === "TEXTAREA" || el.isContentEditable === true || /^(true|plaintext-only|)$/.test(el.getAttribute?.("contenteditable") ?? "x"));
  var visible = (el) => {
    if (!el?.isConnected) return false;
    const r3 = el.getBoundingClientRect();
    if (r3.width === 0 && r3.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none";
  };
  var outermost = (el) => {
    let cur = el;
    while (cur.parentElement && cur.parentElement.isContentEditable && !isOurs(cur.parentElement)) cur = cur.parentElement;
    return cur;
  };
  function deepActive(doc = document) {
    let a3 = doc.activeElement;
    while (a3 && a3.shadowRoot && a3.shadowRoot.activeElement) a3 = a3.shadowRoot.activeElement;
    return a3;
  }
  function bySelectors(list) {
    for (const sel of list || []) {
      let nodes;
      try {
        nodes = [...document.querySelectorAll(sel)];
      } catch {
        continue;
      }
      const vis = nodes.filter((n2) => isEditable(n2) && visible(n2));
      if (vis.length) return vis.sort((a3, b3) => a3.getBoundingClientRect().bottom - b3.getBoundingClientRect().bottom).pop();
    }
    return null;
  }
  function allEditables(root2 = document, out = []) {
    for (const el of root2.querySelectorAll(EDITABLE_SEL)) if (isEditable(el)) out.push(el);
    for (const host2 of root2.querySelectorAll("*")) if (host2.shadowRoot) allEditables(host2.shadowRoot, out);
    return out;
  }
  var shadowHosts = null;
  var shadowScanAt = 0;
  function hasEditable() {
    if (bySelectors(profile.input)) return true;
    for (const el of document.querySelectorAll(EDITABLE_SEL)) if (isEditable(el)) return true;
    if (!shadowHosts || Date.now() - shadowScanAt > 5e3) {
      shadowHosts = [...document.querySelectorAll("*")].filter((n2) => n2.shadowRoot);
      shadowScanAt = Date.now();
    }
    return shadowHosts.some((h5) => h5.isConnected && allEditables(h5.shadowRoot).length > 0);
  }
  function findTarget() {
    const special = () => bySelectors(profile.input);
    const a3 = deepActive();
    if (a3 && a3 !== document.body) {
      if (profile.special && profile.special.test?.(a3)) return special() || a3;
      if (isEditable(a3)) return isTextControl(a3) ? a3 : outermost(a3);
      const inner = a3.shadowRoot ? allEditables(a3.shadowRoot)[0] : null;
      if (inner) return inner;
      const child = a3.querySelector?.(EDITABLE_SEL);
      if (child && isEditable(child)) return child;
    }
    const sel = document.getSelection?.();
    const node = sel?.anchorNode;
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (el && !isOurs(el)) {
      const ce = el.closest?.("[contenteditable='true'], textarea");
      if (ce && isEditable(ce)) return isTextControl(ce) ? ce : outermost(ce);
    }
    const s3 = special();
    if (s3) return s3;
    const list = allEditables().filter(visible).map((e3) => isTextControl(e3) ? e3 : outermost(e3));
    return list.length ? list.sort((x4, y3) => x4.getBoundingClientRect().bottom - y3.getBoundingClientRect().bottom).pop() : null;
  }
  function editorType(el) {
    if (!el) return null;
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return "textarea";
    if (profile.plainTextEditor || /^editable-(message|story)/.test(el.id || "")) return "plain";
    if (el.closest(".ProseMirror") || el.querySelector(".ProseMirror-trailingBreak")) return "prosemirror";
    if (el.closest(".ql-editor")) return "quill";
    if (el.getAttribute("data-lexical-editor") === "true") return "lexical";
    return "contenteditable";
  }
  var BLOCK = /^(P|DIV|H[1-6]|LI|PRE|BLOCKQUOTE)$/;
  function readBlock(node) {
    let s3 = "";
    for (const n2 of node.childNodes) {
      if (n2.nodeType === 3) s3 += n2.nodeValue;
      else if (n2.nodeName === "BR") {
        if (!n2.classList?.contains("ProseMirror-trailingBreak")) s3 += "\n";
      } else if (n2.nodeType === 1) s3 += BLOCK.test(n2.nodeName) ? readBlocks(n2) : readBlock(n2);
    }
    return s3;
  }
  function readBlocks(el) {
    const kids = [...el.childNodes].filter((n2) => !(n2.nodeType === 3 && !n2.nodeValue.trim()));
    if (kids.length && kids.every((n2) => n2.nodeType === 1 && BLOCK.test(n2.nodeName))) return kids.map(readBlock).join("\n");
    return readBlock(el);
  }
  function getText(el) {
    if (!el) return "";
    let s3;
    if (isTextControl(el)) s3 = el.value;
    else if (editorType(el) === "plain") s3 = el.textContent;
    else s3 = readBlocks(el);
    return String(s3 ?? "").replace(/\r\n?/g, "\n").replace(/ /g, " ");
  }
  var nativeSetter = (el) => {
    for (let p3 = Object.getPrototypeOf(el); p3; p3 = Object.getPrototypeOf(p3)) {
      const d3 = Object.getOwnPropertyDescriptor(p3, "value");
      if (d3?.set) return d3.set;
    }
    return null;
  };
  var squash = (s3) => String(s3).replace(/\s+/g, "");
  function fire(el, type, init = {}) {
    try {
      const E3 = type === "beforeinput" || type === "input" ? InputEvent : type.startsWith("key") ? KeyboardEvent : type.startsWith("composition") ? CompositionEvent : type === "focus" || type === "blur" ? FocusEvent : Event;
      el.dispatchEvent(new E3(type, { bubbles: type !== "focus" && type !== "blur", cancelable: type === "beforeinput", ...init }));
    } catch {
    }
  }
  function afterWrite(el, inputType, data) {
    fire(el, "input", { inputType, data });
    fire(el, "change");
    try {
      window.dispatchEvent(new Event("resize"));
    } catch {
    }
  }
  function selectionInside(el) {
    const sel = document.getSelection();
    return sel && sel.rangeCount > 0 && el.contains(sel.anchorNode) ? sel : null;
  }
  function caretToEnd(el) {
    const sel = document.getSelection();
    if (!sel) return;
    const r3 = document.createRange();
    r3.selectNodeContents(el);
    r3.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r3);
  }
  function selectAll(el) {
    const sel = document.getSelection();
    if (!sel) return;
    const r3 = document.createRange();
    r3.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(r3);
  }
  function pasteVia(el, text) {
    try {
      const dt = new DataTransfer();
      dt.setData("text/plain", text);
      const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
      if (!ev.clipboardData) Object.defineProperty(ev, "clipboardData", { value: dt });
      el.dispatchEvent(ev);
      return ev.defaultPrevented;
    } catch {
      return false;
    }
  }
  var execInsert = (text) => {
    try {
      return document.execCommand("insertText", false, text);
    } catch {
      return false;
    }
  };
  function domWrite(el, text, replace, type) {
    const lines = text.split("\n");
    const mkPara = (line) => {
      const p3 = document.createElement("p");
      if (line) p3.appendChild(document.createTextNode(line));
      else if (type === "prosemirror") {
        const br = document.createElement("br");
        br.className = "ProseMirror-trailingBreak";
        p3.appendChild(br);
      } else p3.appendChild(document.createElement("br"));
      return p3;
    };
    if (type === "plain") {
      if (replace) el.textContent = text;
      else {
        const sel = selectionInside(el);
        if (sel) {
          const r3 = sel.getRangeAt(0);
          r3.deleteContents();
          const n2 = document.createTextNode(text);
          r3.insertNode(n2);
          r3.setStartAfter(n2);
          r3.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r3);
        } else el.appendChild(document.createTextNode(text));
      }
    } else if (type === "prosemirror" || type === "quill") {
      const empty = !squash(getText(el));
      const sel = selectionInside(el);
      if (replace || empty || !sel) {
        if (replace || empty) el.replaceChildren();
        for (const l3 of lines) el.appendChild(mkPara(l3));
      } else {
        const r3 = sel.getRangeAt(0);
        r3.deleteContents();
        if (lines.length === 1) {
          const n2 = document.createTextNode(text);
          r3.insertNode(n2);
          r3.setStartAfter(n2);
          r3.collapse(true);
        } else {
          let block = r3.startContainer.nodeType === 1 ? r3.startContainer : r3.startContainer.parentElement;
          while (block && block.parentElement !== el) block = block.parentElement;
          const frag = document.createDocumentFragment();
          lines.forEach((l3) => frag.appendChild(mkPara(l3)));
          if (block) block.after(frag);
          else el.appendChild(frag);
        }
      }
      el.classList.remove("is-empty", "is-editor-empty", "ql-blank");
      el.querySelectorAll(".is-empty, .is-editor-empty").forEach((n2) => n2.classList.remove("is-empty", "is-editor-empty"));
    } else {
      const frag = document.createDocumentFragment();
      lines.forEach((l3, i3) => {
        if (i3) frag.appendChild(document.createElement("br"));
        if (l3) frag.appendChild(document.createTextNode(l3));
      });
      if (replace) el.replaceChildren(frag);
      else {
        const sel = selectionInside(el);
        if (sel) {
          const r3 = sel.getRangeAt(0);
          r3.deleteContents();
          const last2 = frag.lastChild;
          r3.insertNode(frag);
          if (last2) {
            r3.setStartAfter(last2);
            r3.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r3);
          }
        } else el.appendChild(frag);
      }
    }
    fire(el, "beforeinput", { inputType: replace ? "insertReplacementText" : "insertText", data: text });
    afterWrite(el, replace ? "insertReplacementText" : "insertText", text);
    for (const t4 of ["keyup", "compositionend"]) fire(el, t4);
    caretToEnd(el);
  }
  function writeText(el, text, { replace = false } = {}) {
    if (!el) return { ok: false };
    text = String(text ?? "").replace(/\r\n?/g, "\n");
    const type = editorType(el);
    el.focus?.({ preventScroll: true });
    if (type === "textarea") {
      const v3 = el.value;
      let s3 = el.selectionStart ?? v3.length, e3 = el.selectionEnd ?? v3.length;
      if (replace) {
        s3 = 0;
        e3 = v3.length;
      }
      const next = v3.slice(0, s3) + text + v3.slice(e3);
      try {
        el.setSelectionRange(s3, e3);
      } catch {
      }
      if (!(text && execInsert(text) && el.value === next)) {
        const set = nativeSetter(el);
        if (set) set.call(el, next);
        else el.value = next;
        try {
          el.setSelectionRange(s3 + text.length, s3 + text.length);
        } catch {
        }
        afterWrite(el, replace ? "insertReplacementText" : "insertText", text);
      }
      return { ok: true, el };
    }
    let before = getText(el);
    if (replace && text && before && !before.trim()) {
      writeText(el, "", { replace: true });
      before = getText(el);
    }
    if (replace) selectAll(el);
    else if (!selectionInside(el)) caretToEnd(el);
    const target2 = squash(replace ? text : before + text);
    const lead = (v3) => /^[ \t\u00a0]/.test(v3);
    const done2 = () => squash(getText(el)) === target2 && !(replace && lead(getText(el)) && !lead(text)) || !replace && squash(getText(el)).includes(squash(text)) && squash(getText(el)).length >= target2.length;
    if (!text) {
      if (!(execInsert("") || document.execCommand?.("delete")) || /[^\n]/.test(getText(el))) domWrite(el, "", true, type);
      return { ok: true, el };
    }
    if (type !== "plain") {
      if (pasteVia(el, text) && done2()) return { ok: true, el };
      if (replace) selectAll(el);
      if (execInsert(text) && done2()) return { ok: true, el };
    }
    domWrite(el, text, replace, type);
    return { ok: true, el };
  }
  var clearInput = (el) => writeText(el, "", { replace: true });
  var composing = false;
  function trackComposition() {
    document.addEventListener("compositionstart", () => {
      composing = true;
    }, true);
    document.addEventListener("compositionend", () => {
      composing = false;
    }, true);
  }
  async function waitComposition(ms = 3e3) {
    const end = Date.now() + ms;
    while (composing && Date.now() < end) await new Promise((r3) => setTimeout(r3, 50));
    return !composing;
  }
  var VAR_PATTERN = /\{\{inputboard\}\|\{clipboard\}\}|\{clipboard\}|\{inputboard\}|\{selection\}/g;
  var needsClipboard = (tpl) => /\{clipboard\}/.test(tpl);
  var replacesInput = (tpl) => /\{inputboard\}/.test(tpl);
  function expandTemplate(tpl, { input = "", clipboard = "", selection = "" }) {
    return String(tpl).replace(/\r\n?/g, "\n").replace(VAR_PATTERN, (m3) => {
      if (m3 === "{{inputboard}|{clipboard}}") return input.trim() ? input : clipboard;
      if (m3 === "{clipboard}") return clipboard;
      if (m3 === "{inputboard}") return input;
      return selection;
    });
  }
  async function readClipboard() {
    try {
      const t4 = await navigator.clipboard.readText();
      return typeof t4 === "string" ? t4.replace(/\r\n?/g, "\n") : null;
    } catch {
      return null;
    }
  }
  async function writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, "text");
        return true;
      }
    } catch {
    }
    return false;
  }

  // sites/chat/lib/store.js
  var hasGM = () => typeof GM_getValue === "function" && typeof GM_setValue === "function";
  var lsKey = (k4) => `cttf:${k4}`;
  function gmGet(key, fallback = null) {
    try {
      if (hasGM()) {
        const v3 = GM_getValue(key, void 0);
        if (v3 === void 0) return fallback;
        return typeof v3 === "string" ? JSON.parse(v3) : v3;
      }
      const raw2 = localStorage.getItem(lsKey(key));
      return raw2 == null ? fallback : JSON.parse(raw2);
    } catch {
      return fallback;
    }
  }
  function gmSet(key, value) {
    const json = JSON.stringify(value);
    if (hasGM()) GM_setValue(key, json);
    else localStorage.setItem(lsKey(key), json);
  }
  function gmWatch(key, fn2) {
    if (typeof GM_addValueChangeListener === "function") {
      try {
        const id = GM_addValueChangeListener(key, (_k, _old, v3, remote) => {
          if (!remote) return;
          try {
            fn2(typeof v3 === "string" ? JSON.parse(v3) : v3);
          } catch {
          }
        });
        return () => {
          try {
            GM_removeValueChangeListener?.(id);
          } catch {
          }
        };
      } catch {
      }
    }
    const on2 = (e3) => {
      if (e3.key === lsKey(key) && e3.newValue) {
        try {
          fn2(JSON.parse(e3.newValue));
        } catch {
        }
      }
    };
    window.addEventListener("storage", on2);
    return () => window.removeEventListener("storage", on2);
  }
  function createDocStore(key, normalize, makeDefault) {
    let doc = null;
    const listeners6 = /* @__PURE__ */ new Set();
    const emit6 = (source) => {
      for (const fn2 of [...listeners6]) {
        try {
          fn2(doc, source);
        } catch (e3) {
          console.error(e3);
        }
      }
    };
    const load = () => {
      const raw2 = gmGet(key);
      doc = raw2 && raw2.data ? { ...raw2, data: normalize(raw2.data) } : { schema: 1, updatedAt: 0, data: makeDefault() };
      if (raw2 && raw2.data && JSON.stringify(raw2.data) !== JSON.stringify(doc.data)) {
        try {
          gmSet(key, doc);
        } catch {
        }
      }
    };
    return {
      init() {
        load();
        gmWatch(key, (v3) => {
          if (!v3 || !v3.data) return;
          doc = { ...v3, data: normalize(v3.data) };
          emit6("tab");
        });
        return this;
      },
      get doc() {
        if (!doc) load();
        return doc;
      },
      get data() {
        if (!doc) load();
        return doc.data;
      },
      /** 整份替换;updatedAt 由 source 决定:本机修改用当前时间,拉取 / 导入沿用给定值 */
      set(data, { source = "local", updatedAt } = {}) {
        doc = { schema: 1, updatedAt: updatedAt ?? Date.now(), data: normalize(data) };
        gmSet(key, doc);
        emit6(source);
      },
      update(fn2, opts) {
        const draft = JSON.parse(JSON.stringify(this.data));
        const r3 = fn2(draft);
        this.set(r3 === void 0 ? draft : r3, opts);
      },
      subscribe(fn2) {
        listeners6.add(fn2);
        return () => listeners6.delete(fn2);
      }
    };
  }
  function createKV(key, defaults) {
    let cur = null;
    const listeners6 = /* @__PURE__ */ new Set();
    const emit6 = () => {
      for (const fn2 of [...listeners6]) {
        try {
          fn2(cur);
        } catch (e3) {
          console.error(e3);
        }
      }
    };
    const load = () => {
      const v3 = gmGet(key);
      cur = { ...defaults, ...v3 && typeof v3 === "object" ? v3 : {} };
    };
    let watching = false;
    return {
      get() {
        if (!cur) load();
        return cur;
      },
      set(patch) {
        if (!cur) load();
        cur = { ...cur, ...patch };
        gmSet(key, cur);
        emit6();
      },
      reload() {
        load();
        emit6();
      },
      watch() {
        if (watching) return;
        watching = true;
        gmWatch(key, (v3) => {
          cur = { ...defaults, ...v3 && typeof v3 === "object" ? v3 : {} };
          emit6();
        });
      },
      subscribe(fn2) {
        listeners6.add(fn2);
        return () => listeners6.delete(fn2);
      }
    };
  }

  // sites/chat/lib/config.js
  var TOOL_FOLDER = "🖱️";
  var TOOL_ACTIONS = ["cut", "copy", "paste", "clear"];
  var TOOL_COLORS = { cut: "#FFC1CC", copy: "#C1FFD7", paste: "#C1D8FF", clear: "#FFD1C1" };
  var TOOL_NAMES = {
    zh: { cut: "剪切", copy: "复制", paste: "粘贴", clear: "清空" },
    en: { cut: "Cut", copy: "Copy", paste: "Paste", clear: "Clear" }
  };
  var toolName = (action, lang2) => (TOOL_NAMES[lang2] || TOOL_NAMES.en)[action];
  var faviconFor = (domain) => {
    const host2 = String(domain || "").trim().replace(/^[a-z]+:\/\//i, "").split(/[/?#]/)[0];
    return host2 ? `https://www.google.com/s2/favicons?domain=${host2}&sz=32` : "";
  };
  var KAGI_SELECTOR = 'button[aria-label="Send message"], button[title="Send message"], button#submit[type="submit"], button[aria-label="Submit"][type="submit"]';
  var CEREBR = ["cerebr.fugue.pro", "cerebr.vercel.app", "cerebr.yym68686.top", "cerebr.pages.dev"];
  function defaultRules() {
    return [
      { domain: "chatgpt.com", name: "ChatGPT", method: "click_submit" },
      ...CEREBR.map((d3) => ({ domain: d3, name: "Cerebr", method: "enter" })),
      { domain: "assistant.kagi.com", name: "Kagi Assistant", method: "click_submit", methodAdvanced: { variant: "selector", selector: KAGI_SELECTOR } },
      { domain: "web.telegram.org", name: "Telegram Web A", method: "enter" }
    ].map((r3) => ({ ...r3, favicon: faviconFor(r3.domain) }));
  }
  var RESTORED_DOMAINS = [...CEREBR, "assistant.kagi.com", "web.telegram.org"];
  function toolFolder(lang2) {
    const buttons = {};
    for (const a3 of TOOL_ACTIONS) buttons[toolName(a3, lang2)] = { type: "tool", action: a3, color: TOOL_COLORS[a3], textColor: "#333333" };
    return { color: "#FFD700", textColor: "#ffffff", hidden: false, buttons };
  }
  function defaultConfig(lang2 = "en") {
    const zh = lang2 === "zh";
    const main2 = zh ? "默认" : "Default";
    return {
      folders: {
        [main2]: {
          color: "#3B82F6",
          textColor: "#ffffff",
          hidden: false,
          buttons: {
            Review: { type: "template", text: "You are a code review expert:\n\n{clipboard}\n\nProvide constructive feedback and improvements.\n", color: "#E6E0FF", textColor: "#333333", autoSubmit: false, favicon: "" },
            [zh ? "解释" : "Explain"]: { type: "template", text: "Explain the following code concisely:\n\n{clipboard}\n\nFocus on key functionality and purpose.\n", color: "#ffebcc", textColor: "#333333", autoSubmit: false, favicon: "" }
          }
        },
        [TOOL_FOLDER]: toolFolder(lang2)
      },
      folderOrder: [main2, TOOL_FOLDER],
      domainAutoSubmitSettings: defaultRules(),
      officialStyleBundle: null,
      customStyleRules: [],
      showFolderIcons: false,
      buttonBarHeight: 40,
      buttonBarBottomSpacing: 0
    };
  }
  var isObj = (v3) => v3 != null && typeof v3 === "object" && !Array.isArray(v3);
  var clamp = (v3, lo, hi, d3) => {
    const n2 = Math.round(Number(v3));
    return Number.isFinite(n2) ? Math.min(hi, Math.max(lo, n2)) : d3;
  };
  var METHOD_ALIASES = { "Enter": "enter", "Cmd+Enter": "modifier_enter", "模拟点击提交按钮": "click_submit" };
  function normalizeRule(r3) {
    const out = { ...r3 };
    out.domain = String(out.domain ?? "");
    out.name = String(out.name ?? "");
    let m3 = METHOD_ALIASES[out.method] ?? out.method;
    if (!["enter", "modifier_enter", "click_submit"].includes(m3)) m3 = "enter";
    out.method = m3;
    const adv = out.methodAdvanced;
    if (adv !== void 0) {
      const ok = isObj(adv) && (m3 === "modifier_enter" && ["cmd", "ctrl"].includes(adv.variant) || m3 === "click_submit" && (adv.variant === "default" || adv.variant === "selector" && typeof adv.selector === "string"));
      if (!ok) delete out.methodAdvanced;
    }
    if (!out.favicon) out.favicon = faviconFor(out.domain);
    return out;
  }
  function normalizeButton(b3, inToolFolder) {
    if (!isObj(b3)) return inToolFolder ? null : { type: "template", text: "", color: "#FFC1CC", textColor: "#333333", autoSubmit: false, favicon: "" };
    const out = { ...b3 };
    if (out.type !== "template" && out.type !== "tool") out.type = inToolFolder ? "tool" : "template";
    if (out.type === "template") {
      if (typeof out.text !== "string") out.text = String(out.text ?? "");
      if (typeof out.autoSubmit !== "boolean") out.autoSubmit = false;
      if (typeof out.favicon !== "string") out.favicon = "";
    } else if (!TOOL_ACTIONS.includes(out.action)) {
      return null;
    }
    return out;
  }
  function normalizeConfig(input, lang2 = "en") {
    const src = isObj(input) ? input : {};
    const cfg2 = { ...src };
    delete cfg2._sync;
    const def = defaultConfig(lang2);
    if (!isObj(cfg2.folders)) {
      cfg2.folders = def.folders;
      cfg2.folderOrder = def.folderOrder;
    }
    const folders = {};
    for (const [name, f3] of Object.entries(cfg2.folders)) {
      const tool = name === TOOL_FOLDER;
      const base = isObj(f3) ? { ...f3 } : { color: "#3B82F6", textColor: "#ffffff" };
      if (typeof base.hidden !== "boolean") base.hidden = false;
      const buttons = {};
      for (const [bn2, b3] of Object.entries(isObj(base.buttons) ? base.buttons : {})) {
        const nb = normalizeButton(b3, tool);
        if (nb) buttons[bn2] = nb;
      }
      base.buttons = buttons;
      folders[name] = base;
    }
    if (!folders[TOOL_FOLDER]) folders[TOOL_FOLDER] = toolFolder(lang2);
    else {
      const have = new Set(Object.values(folders[TOOL_FOLDER].buttons).filter((b3) => b3.type === "tool").map((b3) => b3.action));
      for (const a3 of TOOL_ACTIONS) {
        if (have.has(a3)) continue;
        let name = toolName(a3, lang2);
        while (folders[TOOL_FOLDER].buttons[name]) name += " ";
        folders[TOOL_FOLDER].buttons[name] = { type: "tool", action: a3, color: TOOL_COLORS[a3], textColor: "#333333" };
      }
    }
    cfg2.folders = folders;
    const seen = /* @__PURE__ */ new Set();
    const order = (Array.isArray(cfg2.folderOrder) ? cfg2.folderOrder : []).filter((n2) => typeof n2 === "string" && folders[n2] && !seen.has(n2) && seen.add(n2));
    for (const n2 of Object.keys(folders)) if (!seen.has(n2)) {
      order.push(n2);
      seen.add(n2);
    }
    cfg2.folderOrder = order;
    cfg2.buttonBarHeight = clamp(cfg2.buttonBarHeight, 20, 200, 40);
    cfg2.buttonBarBottomSpacing = clamp(cfg2.buttonBarBottomSpacing, -200, 200, 0);
    if (typeof cfg2.showFolderIcons !== "boolean") cfg2.showFolderIcons = false;
    if (!Array.isArray(cfg2.customStyleRules)) cfg2.customStyleRules = [];
    if (!("officialStyleBundle" in cfg2)) cfg2.officialStyleBundle = null;
    if (!Array.isArray(cfg2.domainAutoSubmitSettings)) cfg2.domainAutoSubmitSettings = def.domainAutoSubmitSettings;
    else {
      const rules = cfg2.domainAutoSubmitSettings.filter(isObj).map(normalizeRule);
      const have = new Set(rules.map((r3) => r3.domain));
      for (const r3 of def.domainAutoSubmitSettings) if (RESTORED_DOMAINS.includes(r3.domain) && !have.has(r3.domain)) rules.push(r3);
      cfg2.domainAutoSubmitSettings = rules;
    }
    return cfg2;
  }
  var isValidConfig = (v3) => isObj(v3) && "folders" in v3 && "folderOrder" in v3;
  function canonical(cfg2) {
    const c3 = { ...cfg2 };
    delete c3._sync;
    if (isObj(c3.folders)) c3.folders = Object.fromEntries(Object.entries(c3.folders).map(([n2, f3]) => [n2, isObj(f3) ? { ...f3, buttons: isObj(f3.buttons) ? Object.entries(f3.buttons) : f3.buttons } : f3]));
    const sort = (v3) => Array.isArray(v3) ? v3.map(sort) : isObj(v3) ? Object.fromEntries(Object.keys(v3).sort().map((k4) => [k4, sort(v3[k4])])) : v3;
    return JSON.stringify(sort(c3));
  }
  var sameConfig = (a3, b3) => canonical(a3) === canonical(b3);
  function hashConfig(cfg2) {
    const str = canonical(cfg2);
    let h1 = 3735928559, h22 = 1103547991;
    for (let i3 = 0; i3 < str.length; i3++) {
      const ch = str.charCodeAt(i3);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h22 = Math.imul(h22 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h22 ^ h22 >>> 13, 3266489909);
    h22 = Math.imul(h22 ^ h22 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return (4294967296 * (2097151 & h22) + (h1 >>> 0)).toString(36);
  }
  function stats(cfg2) {
    const folders = isObj(cfg2?.folders) ? Object.values(cfg2.folders) : [];
    return { folders: folders.length, buttons: folders.reduce((n2, f3) => n2 + (isObj(f3?.buttons) ? Object.keys(f3.buttons).length : 0), 0) };
  }
  function diffSummary(cur, next) {
    const a3 = cur.folders || {}, b3 = next.folders || {};
    const added = Object.keys(b3).filter((n2) => !(n2 in a3));
    const removed = Object.keys(a3).filter((n2) => !(n2 in b3));
    const changed = Object.keys(b3).filter((n2) => n2 in a3 && canonical({ f: a3[n2] }) !== canonical({ f: b3[n2] }));
    const common = (n2) => n2 in a3 && n2 in b3;
    const orderChanged = JSON.stringify((cur.folderOrder || []).filter(common)) !== JSON.stringify((next.folderOrder || []).filter(common));
    const strip = (c3) => {
      const x4 = { ...c3 };
      delete x4.folders;
      delete x4.folderOrder;
      delete x4._sync;
      return x4;
    };
    const settingsChanged = canonical(strip(cur)) !== canonical(strip(next));
    return { added, removed, changed, orderChanged, settingsChanged, same: !added.length && !removed.length && !changed.length && !orderChanged && !settingsChanged };
  }
  var WORDY = /[\p{L}\p{N}]/u;
  var graphemes = (s3) => {
    try {
      return [...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(s3)].map((x4) => x4.segment);
    } catch {
      return s3.match(new RegExp("(\\P{M}\\p{M}*)(\\u200d\\P{M}\\p{M}*)*", "gu")) || [];
    }
  };
  function splitName(name) {
    const s3 = String(name ?? "");
    const sp = s3.indexOf(" ");
    if (sp > 0) {
      const head = s3.slice(0, sp);
      if (!WORDY.test(head)) return { icon: head, text: s3.slice(sp + 1) };
    }
    const first = graphemes(s3)[0];
    if (first && !WORDY.test(first) && first.trim()) return { icon: first, text: s3.slice(first.length).trimStart() };
    return { icon: "", text: s3 };
  }
  var TOOL_ICONS = { cut: "✂️", copy: "📋", paste: "📥", clear: "✖️" };
  function buttonIcon(name, btn) {
    if (btn?.favicon && /^(https?:|data:)/i.test(btn.favicon)) return { url: btn.favicon, fallback: fallbackIcon(name, btn) };
    return { emoji: fallbackIcon(name, btn) };
  }
  function fallbackIcon(name, btn) {
    if (btn?.type === "tool" && TOOL_ICONS[btn.action]) return TOOL_ICONS[btn.action];
    const { icon, text } = splitName(name);
    return icon || graphemes(text)[0] || "🔖";
  }
  function templateVars(text) {
    const out = [];
    const s3 = String(text || "");
    for (const m3 of s3.matchAll(/\{\{([\w-]+)\}\|\{([\w-]+)\}\}|\{([\w-]+)\}/g)) {
      const v3 = m3[3] ? `{${m3[3]}}` : `{{${m3[1]}}|{${m3[2]}}}`;
      if (!out.includes(v3)) out.push(v3);
    }
    return out;
  }
  function renameKey(obj, oldKey, newKey, value) {
    const out = {};
    for (const [k4, v3] of Object.entries(obj)) {
      if (k4 === oldKey) out[newKey] = value ?? v3;
      else out[k4] = v3;
    }
    return out;
  }
  function moveKey(obj, key, toIndex) {
    const entries = Object.entries(obj);
    const i3 = entries.findIndex(([k4]) => k4 === key);
    if (i3 < 0) return obj;
    const [e3] = entries.splice(i3, 1);
    entries.splice(Math.max(0, Math.min(toIndex, entries.length)), 0, e3);
    return Object.fromEntries(entries);
  }

  // sites/chat/lib/state.js
  var prefs = createKV("cttf.prefs", { language: "auto" });
  var navLang = () => {
    const p3 = prefs.get().language;
    if (p3 === "zh" || p3 === "en") return p3;
    const nav = typeof navigator !== "undefined" && (navigator.languages?.[0] || navigator.language) || "en";
    return /^zh/i.test(nav) ? "zh" : "en";
  };
  var config = createDocStore("cttf.config", (data) => normalizeConfig(data, navLang()), () => defaultConfig(navLang()));
  var webdav = createKV("cttf.webdav", {
    enabled: false,
    serverUrl: "",
    username: "",
    password: "",
    remotePath: "ChatTemplateTextFolders/config.json",
    autoSync: false,
    lastSyncedAt: 0,
    lastRemoteETag: "",
    lastRemoteModified: "",
    lastSyncedHash: ""
  });
  var flags = createKV("cttf.flags", { legacyIgnored: {}, migrated: false });
  var editing = 0;
  var editingGuard = { enter() {
    editing++;
    return () => {
      editing = Math.max(0, editing - 1);
    };
  }, get active() {
    return editing > 0;
  } };

  // sites/chat/styles.js
  var UI_FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;
  var FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  function barMetrics(height, spacing = 0) {
    const clamp2 = (v3, a3, b3) => Math.min(b3, Math.max(a3, v3));
    const H3 = Math.max(32, Math.round(Number(height) || 40));
    const s3 = clamp2(H3 / 40, 0.6, 2.5);
    const py = Math.min(clamp2(Math.round(6 * s3), 4, 20), Math.max(4, Math.floor((H3 - 24) / 2)));
    const px = clamp2(Math.round(15 * s3), 12, 48);
    const gap = clamp2(Math.round(10 * s3), 6, 28);
    const bh = Math.max(20, H3 - 2 * py);
    const fs = clamp2(Math.round(14 * s3), 12, 22);
    const vp = Math.min(clamp2(Math.round(6 * s3), 4, 18), Math.max(4, Math.floor((bh - fs) / 2)));
    const hp = clamp2(Math.round(12 * s3), 12, 56);
    const r3 = clamp2(Math.round(4 * s3), 4, 20);
    const lh = Math.max(fs + 2, bh - 2 * vp);
    return { H: H3, py, px, gap, bh, fs, vp, hp, r: r3, lh, bottom: Math.round(Number(spacing) || 0) - vp };
  }
  var BAR_CSS = `
:root { --uspp-cttf-pop-bg: rgba(255,255,255,.82); --uspp-cttf-primary: #3B82F6; --uspp-cttf-danger: #ef4444; --uspp-cttf-success: #22c55e; --uspp-cttf-warn: #fd7e14; --uspp-cttf-cancel: #6B7280; --uspp-cttf-btn-bg: #f3f4f6; --uspp-cttf-btn-hover: #e5e7eb; --uspp-cttf-tool-fg: #333333; --uspp-cttf-clear-fg: #333333; --uspp-cttf-pop-border: rgba(0,0,0,.1); --uspp-cttf-pop-shadow: rgba(0,0,0,.15); }
:root[data-uspp-cttf-theme="dark"] { --uspp-cttf-pop-bg: rgba(17,17,17,.85); --uspp-cttf-primary: #2563EB; --uspp-cttf-danger: #dc2626; --uspp-cttf-success: #16a34a; --uspp-cttf-cancel: #3f3f46; --uspp-cttf-btn-bg: #1f1f1f; --uspp-cttf-btn-hover: #2c2c2c; --uspp-cttf-tool-fg: #e5e5e5; --uspp-cttf-clear-fg: #ffffff; --uspp-cttf-pop-border: rgba(255,255,255,.12); --uspp-cttf-pop-shadow: rgba(0,0,0,.5); }
@media (prefers-color-scheme: dark) { :root:not([data-uspp-cttf-theme]) { --uspp-cttf-pop-bg: rgba(17,17,17,.85); --uspp-cttf-primary: #2563EB; --uspp-cttf-danger: #dc2626; --uspp-cttf-success: #16a34a; --uspp-cttf-cancel: #3f3f46; --uspp-cttf-btn-bg: #1f1f1f; --uspp-cttf-btn-hover: #2c2c2c; --uspp-cttf-tool-fg: #e5e5e5; --uspp-cttf-clear-fg: #ffffff; --uspp-cttf-pop-border: rgba(255,255,255,.12); --uspp-cttf-pop-shadow: rgba(0,0,0,.5); } }
.uspp-cttf-bar { position: fixed; left: var(--uspp-cttf-bar-left, 0px); width: var(--uspp-cttf-bar-w, 100%); bottom: var(--uspp-cttf-bar-bottom, -6px); height: var(--uspp-cttf-bar-h, 40px); z-index: 1000; box-sizing: border-box; display: flex; flex-wrap: nowrap; justify-content: safe center; align-items: center; gap: var(--uspp-cttf-bar-gap, 10px); padding: var(--uspp-cttf-bar-py, 6px) var(--uspp-cttf-bar-px, 15px); overflow-x: auto; overflow-y: hidden; scrollbar-width: none; pointer-events: auto; border-radius: 4px; font-family: ${FONT}; color: var(--uspp-cttf-fg-primary); background: transparent; }
.uspp-cttf-bar *, .uspp-cttf-pop * { box-sizing: border-box; }
.uspp-cttf-bar::-webkit-scrollbar { display: none; }
.uspp-cttf-bar[data-hidden="true"] { visibility: hidden; pointer-events: none; }
.uspp-cttf-bar > * { flex: 0 0 auto; }
.uspp-cttf-chip-btn { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px; padding: 4px 10px; border-radius: 4px; font-size: 14px; line-height: 18px; max-width: 260px; margin: 0; border: none; background: var(--uspp-cttf-btn-bg); color: #333333; font-family: ${FONT}; font-weight: 500; cursor: pointer; white-space: nowrap; user-select: none; transition: all .2s ease; }
.uspp-cttf-bar > .uspp-cttf-chip-btn { height: var(--uspp-cttf-btn-h, 28px); min-height: var(--uspp-cttf-btn-h, 28px); padding: var(--uspp-cttf-btn-vp, 6px) var(--uspp-cttf-btn-hp, 12px); font-size: var(--uspp-cttf-btn-fs, 14px); line-height: var(--uspp-cttf-btn-lh, 16px); border-radius: var(--uspp-cttf-btn-r, 4px); gap: .3em; }
.uspp-cttf-chip-label { overflow: hidden; text-overflow: ellipsis; }
.uspp-cttf-ic { display: inline-flex; line-height: 1; }
.uspp-cttf-ic-img { width: 1.1em; height: 1.1em; object-fit: contain; border-radius: 3px; flex: 0 0 auto; }
.uspp-cttf-bar-tool { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; height: var(--uspp-cttf-btn-h, 28px); min-height: var(--uspp-cttf-btn-h, 28px); padding: var(--uspp-cttf-btn-vp, 6px) var(--uspp-cttf-btn-hp, 12px); margin: 0; font-size: var(--uspp-cttf-btn-fs, 14px); line-height: var(--uspp-cttf-btn-lh, 16px); border-radius: var(--uspp-cttf-btn-r, 4px); border: none; background: var(--uspp-cttf-btn-bg); color: var(--uspp-cttf-tool-fg); font-family: ${FONT}; font-weight: 400; cursor: pointer; transition: all .2s ease; }
/* 只有图标的按钮(⚙️、清空、名字只有一个符号的文件夹如 🖱️):正方形,边长 = 按钮高度,图标居中(TC 要求) */
.uspp-cttf-bar > .uspp-cttf-chip-btn.uspp-cttf-chip-icononly, .uspp-cttf-bar > .uspp-cttf-bar-tool { box-sizing: border-box !important; width: var(--uspp-cttf-btn-h, 28px) !important; min-width: var(--uspp-cttf-btn-h, 28px) !important; max-width: var(--uspp-cttf-btn-h, 28px) !important; height: var(--uspp-cttf-btn-h, 28px) !important; padding: 0 !important; aspect-ratio: 1 / 1; justify-content: center; align-items: center; overflow: hidden; gap: 0; }
.uspp-cttf-bar > .uspp-cttf-chip-btn.uspp-cttf-chip-icononly .uspp-cttf-ic, .uspp-cttf-bar > .uspp-cttf-bar-tool svg { flex: 0 0 auto; margin: 0; }
.uspp-cttf-bar-tool[data-uspp-cttf-action="clear"] { color: var(--uspp-cttf-clear-fg); }
.uspp-cttf-bar-tool:hover { background: var(--uspp-cttf-btn-hover); }
.uspp-cttf-bar-tool[data-state="error"] { color: var(--uspp-cttf-danger); }
.uspp-cttf-bar-tool[data-state="busy"] { opacity: .6; }
.uspp-cttf-pop { position: fixed; z-index: 1001; display: flex; flex-direction: column; align-items: flex-start; width: max-content; max-height: 800px; overflow-y: auto; overflow-x: hidden; padding: 10px 10px 2.5px; border-radius: 8px; background: var(--uspp-cttf-pop-bg); -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); border: 1px solid var(--uspp-cttf-pop-border); box-shadow: 0 4px 12px var(--uspp-cttf-pop-shadow); font-family: ${FONT}; color: var(--uspp-cttf-fg-primary); scrollbar-width: thin; }
.uspp-cttf-pop > .uspp-cttf-chip-btn { display: flex; width: fit-content; max-width: 100%; text-align: left; justify-content: flex-start; padding: 6px 12px; margin: 0 0 6px; font-size: 14px; line-height: normal; font-weight: 400; border-radius: 4px; border: 1px solid rgba(0,0,0,.1); box-shadow: 0 2px 4px rgba(0,0,0,.05); }
.uspp-cttf-pop > .uspp-cttf-chip-btn:hover { transform: scale(1.05); box-shadow: 0 3px 6px rgba(0,0,0,.1); }
.uspp-cttf-pop > .uspp-cttf-chip-btn .uspp-cttf-ic, .uspp-cttf-pop > .uspp-cttf-chip-btn .uspp-cttf-ic-img { width: 18px; height: 18px; border-radius: 4px; overflow: hidden; justify-content: center; align-items: center; font-size: 14px; line-height: 1; object-fit: contain; }
.uspp-cttf-pop-empty { padding: 6px 8px 10px; color: var(--uspp-cttf-fg-tertiary); font-size: 13px; }
`;
  var PANEL_CSS = `
.uspp-cttf-dlg-wrap { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 16px; pointer-events: auto; background: rgb(0 0 0 / .4); }
/* 叠在框架遮罩(0.5)上合计约 0.7,与原版一致;叠放的第二层弹窗不再加深 */
.uspp-cttf-overlay ~ .uspp-cttf-overlay .uspp-cttf-dlg-wrap { background: transparent; }
.uspp-cttf-dlg { position: relative; display: flex; flex-direction: column; max-height: min(85vh, 760px); background: var(--uspp-cttf-surface-l1); color: var(--uspp-cttf-fg-primary); border: 1px solid var(--uspp-cttf-border-l1); border-radius: 24px; box-shadow: 0 16px 48px rgb(0 0 0 / .35); font: 14px/1.45 ${UI_FONT}; overflow: hidden; animation: uspp-cttf-dlg-pop .14s ease-out; }
@keyframes uspp-cttf-dlg-pop { from { opacity: 0; transform: scale(.97) } to { opacity: 1; transform: none } }
.uspp-cttf-dlg-head { display: flex; align-items: center; gap: 8px; padding: 20px 16px 8px 24px; }
.uspp-cttf-dlg-title { font-size: 18px; font-weight: 600; white-space: nowrap; }
.uspp-cttf-dlg-head-extra { display: flex; align-items: center; gap: 6px; flex: 1; flex-wrap: wrap; min-width: 0; }
.uspp-cttf-x { margin-left: auto; width: 32px; height: 32px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; padding: 0; border-radius: 9999px; border: none; background: transparent; color: var(--uspp-cttf-fg-secondary); cursor: pointer; }
.uspp-cttf-x:hover { background: var(--uspp-cttf-button-ghost-hover); color: var(--uspp-cttf-fg-primary); }
.uspp-cttf-dlg-body { padding: 8px 24px 16px; overflow: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 14px; scrollbar-width: thin; }
.uspp-cttf-dlg-foot { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; padding: 12px 24px 20px; border-top: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-b { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--uspp-cttf-border-l2); background: transparent; color: var(--uspp-cttf-fg-primary); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap; }
.uspp-cttf-b:hover:not(:disabled) { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-b:disabled { opacity: .5; cursor: default; }
.uspp-cttf-b-primary { background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); border-color: transparent; }
.uspp-cttf-b-primary:hover:not(:disabled) { background: var(--uspp-cttf-fg-primary); opacity: .88; }
.uspp-cttf-b-danger { background: var(--uspp-cttf-fg-danger); border-color: transparent; color: #fff; }
.uspp-cttf-b-danger:hover:not(:disabled) { background: var(--uspp-cttf-fg-danger); opacity: .88; }
.uspp-cttf-b-success { background: var(--uspp-cttf-fg-primary); border-color: transparent; color: var(--uspp-cttf-surface-base); }
.uspp-cttf-b-cancel { background: transparent; }
.uspp-cttf-b-cancel:hover:not(:disabled) { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-b-icon { width: 32px; height: 32px; padding: 0; border-color: transparent; color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-b-icon:hover:not(:disabled) { color: var(--uspp-cttf-fg-primary); }
.uspp-cttf-b-sm { height: 30px; padding: 0 10px; font-size: 13px; }
.uspp-cttf-icon-b { width: 36px; height: 32px; padding: 0; border-radius: 4px; border: none; background: transparent; cursor: pointer; font-size: 14px; color: inherit; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }
.uspp-cttf-icon-b:hover { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-badge2 { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; border-radius: 50%; background: #3B82F6; color: #fff; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,.1); cursor: default; flex: 0 0 auto; transition: transform .15s ease; }
.uspp-cttf-badge2:hover { transform: scale(1.1); }
.uspp-cttf-badge2[data-kind="buttons"] { background: #22c55e; }
.uspp-cttf-badge2[data-kind="folder"] { width: 20px; height: 20px; font-size: 11px; background: #4F46E5; }
.uspp-cttf-badge2[data-kind="folder"]:hover { transform: scale(1.15); }
.uspp-cttf-side-toggle { width: 28px !important; height: 28px !important; min-width: 28px; max-width: 28px; min-height: 28px; max-height: 28px; aspect-ratio: 1 / 1; padding: 0 !important; border-radius: 4px !important; background: transparent; }
.uspp-cttf-field { display: flex; flex-direction: column; gap: 6px; }
.uspp-cttf-field-label { font-size: 13px; font-weight: 500; color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-field-hint { font-size: 12px; color: var(--uspp-cttf-fg-tertiary); }
.uspp-cttf-field-err { font-size: 12px; color: var(--uspp-cttf-fg-danger); }
.uspp-cttf-in, .uspp-cttf-ta, .uspp-cttf-sel { box-sizing: border-box; width: 100%; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--uspp-cttf-border-l1); background: var(--uspp-cttf-surface-l2); color: var(--uspp-cttf-fg-primary); font: inherit; outline: none; }
.uspp-cttf-in:focus, .uspp-cttf-ta:focus, .uspp-cttf-sel:focus { border-color: var(--uspp-cttf-ring); }
.uspp-cttf-ta { min-height: 150px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
.uspp-cttf-color-row { display: flex; gap: 8px; align-items: center; }
.uspp-cttf-color { width: 100px; height: 40px; padding: 2px; border: 1px solid var(--uspp-cttf-border-l1); border-radius: 12px; background: var(--uspp-cttf-surface-l2); cursor: pointer; flex: 0 0 auto; }
.uspp-cttf-tabbar { display: flex; flex-wrap: wrap; gap: 6px; }
.uspp-cttf-tab { height: 30px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--uspp-cttf-border-l1); background: transparent; color: var(--uspp-cttf-fg-secondary); font: inherit; font-size: 13px; cursor: pointer; }
.uspp-cttf-tab:hover { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-tab[aria-selected="true"] { background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); border-color: transparent; }
.uspp-cttf-preview { display: flex; justify-content: center; padding: 12px; border-radius: 16px; background: var(--uspp-cttf-surface-l2); }
.uspp-cttf-preview .uspp-cttf-chip-btn { height: 32px; }
.uspp-cttf-row2 { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.uspp-cttf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.uspp-cttf-check { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
/* 原生表单控件:站点(ChatGPT 的 Tailwind 重置等)会把 checkbox / radio / color 的外观清掉,这里强制恢复成浏览器原生外观 */
.uspp-cttf-dlg input[type="checkbox"], .uspp-cttf-dlg input[type="radio"] { -webkit-appearance: auto !important; appearance: auto !important; display: inline-block !important; position: static !important; width: 16px !important; height: 16px !important; min-width: 16px; margin: 0 !important; padding: 0 !important; opacity: 1 !important; visibility: visible !important; clip: auto !important; clip-path: none !important; pointer-events: auto !important; background: revert !important; border: revert !important; box-shadow: none !important; color-scheme: inherit; accent-color: var(--uspp-cttf-fg-primary); flex: 0 0 auto; cursor: pointer; vertical-align: middle; }
.uspp-cttf-dlg input[type="color"] { -webkit-appearance: auto !important; appearance: auto !important; display: inline-block !important; opacity: 1 !important; visibility: visible !important; }
.uspp-cttf-dlg { color-scheme: light; }
:root[data-uspp-cttf-theme="dark"] .uspp-cttf-dlg { color-scheme: dark; }
.uspp-cttf-check { gap: 8px; }
.uspp-cttf-check:has(input:checked) { font-weight: 500; }

.uspp-cttf-muted2 { color: var(--uspp-cttf-fg-secondary); font-size: 13px; }
.uspp-cttf-warn2 { color: var(--uspp-cttf-fg-danger); font-weight: 500; }
.uspp-cttf-status { padding: 10px 14px; border-radius: 14px; font-size: 13px; background: var(--uspp-cttf-surface-l2); }
.uspp-cttf-status[data-kind="ok"] { color: var(--uspp-cttf-success); }
.uspp-cttf-status[data-kind="error"] { color: var(--uspp-cttf-fg-danger); }
.uspp-cttf-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.uspp-cttf-col-card { padding: 12px 14px; border-radius: 16px; border: 1px solid var(--uspp-cttf-border-l1); background: var(--uspp-cttf-surface-l1); }
.uspp-cttf-col-card b { display: block; margin-bottom: 4px; }
.uspp-cttf-diff ul { margin: 4px 0 8px 18px; padding: 0; }
/* 设置面板 */
.uspp-cttf-mgr { display: flex; min-height: 360px; height: 100%; gap: 0; border-top: 1px solid var(--uspp-cttf-border-l1); overflow-x: auto; }
.uspp-cttf-mgr-side { flex: 0 0 280px; min-width: 280px; display: flex; flex-direction: column; border-right: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-mgr-side[data-collapsed="true"] { display: none; }
.uspp-cttf-mgr-main { flex: 1; display: flex; flex-direction: column; min-width: 520px; }
.uspp-cttf-tbl-head, .uspp-cttf-tbl-row { display: grid; align-items: center; gap: 6px; padding: 6px 10px; }
.uspp-cttf-mgr-side .uspp-cttf-tbl-head, .uspp-cttf-mgr-side .uspp-cttf-tbl-row { grid-template-columns: 1fr 36px 36px 36px; gap: 4px; }
.uspp-cttf-mgr-side .uspp-cttf-tbl-row { min-height: 36px; }
.uspp-cttf-mgr-main .uspp-cttf-tbl-head, .uspp-cttf-mgr-main .uspp-cttf-tbl-row { grid-template-columns: minmax(120px, 1fr) 110px 60px 40px 36px; gap: 4px; }
.uspp-cttf-mgr-main .uspp-cttf-vars { white-space: normal; text-align: center; line-height: 1.2; }
.uspp-cttf-tbl-head { font-size: 12px; color: var(--uspp-cttf-fg-tertiary); border-bottom: 1px solid var(--uspp-cttf-border-l1); position: sticky; top: 0; background: var(--uspp-cttf-surface-l1); z-index: 1; }
.uspp-cttf-tbl-row { border-bottom: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-tbl-row[data-selected="true"] { background: var(--uspp-cttf-surface-l2); }
.uspp-cttf-tbl-row[data-drop="true"] { box-shadow: inset 0 0 0 2px var(--uspp-cttf-ring); }
.uspp-cttf-tbl-row > * { min-width: 0; }
.uspp-cttf-tbl-row .uspp-cttf-chip-btn { height: 28px; max-width: 100%; }
.uspp-cttf-tbl-scroll { flex: 1; overflow: auto; scrollbar-width: thin; }
.uspp-cttf-mgr-foot { padding: 10px 12px; border-top: 1px solid var(--uspp-cttf-border-l1); display: flex; gap: 8px; align-items: center; }
.uspp-cttf-center { text-align: center; }
.uspp-cttf-vars { font-size: 12px; color: var(--uspp-cttf-fg-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 720px) { .uspp-cttf-mgr-side { flex-basis: 220px; } .uspp-cttf-mgr-main .uspp-cttf-tbl-head, .uspp-cttf-mgr-main .uspp-cttf-tbl-row { grid-template-columns: minmax(100px, 1fr) 64px 50px 32px 32px; } .uspp-cttf-cols, .uspp-cttf-grid2 { grid-template-columns: 1fr; } }
.uspp-cttf-rule-row { display: grid; grid-template-columns: 28px 1fr 140px 36px 36px; gap: 8px; align-items: center; padding: 8px 4px; border-bottom: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-rule-row img { width: 20px; height: 20px; }
.uspp-cttf-sub { font-size: 12px; color: var(--uspp-cttf-fg-tertiary); word-break: break-all; }
`;

  // sites/chat/lib/settle.js
  var resolve;
  var settled = new Promise((r3) => {
    resolve = r3;
  });
  var done = false;
  var isSettled = () => done;
  var finish = () => {
    if (!done) {
      done = true;
      resolve();
    }
  };
  var sleep = (ms) => new Promise((r3) => setTimeout(r3, ms));
  var idle = (timeout) => new Promise((r3) => typeof requestIdleCallback === "function" ? requestIdleCallback(() => r3(), { timeout }) : setTimeout(r3, 50));
  var domReady = () => new Promise((r3) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => r3(), { once: true }) : r3());
  function domQuiet(quiet, cap) {
    return new Promise((r3) => {
      let timer2 = 0;
      const end = () => {
        mo2.disconnect();
        clearTimeout(timer2);
        clearTimeout(capT);
        r3();
      };
      const mo2 = new MutationObserver(() => {
        clearTimeout(timer2);
        timer2 = setTimeout(end, quiet);
      });
      mo2.observe(document.documentElement, { childList: true, subtree: true });
      timer2 = setTimeout(end, quiet);
      const capT = setTimeout(end, cap);
    });
  }
  var frames = () => new Promise((r3) => requestAnimationFrame(() => requestAnimationFrame(() => r3())));
  function startSettle({ ssr = false, hasEditable: hasEditable2 = () => true, maxWait = 15e3, quiet = 400, quietCap = 3e3 } = {}) {
    if (done) return settled;
    setTimeout(finish, maxWait);
    (async () => {
      await domReady();
      if (!ssr) return finish();
      const t0 = Date.now();
      while (!hasEditable2() && Date.now() - t0 < 1e4) await sleep(100);
      await domQuiet(quiet, quietCap);
      await idle(1e3);
      await frames();
      finish();
    })().catch(finish);
    return settled;
  }

  // sites/chat/index.js
  var chat_default = (U4) => {
    bindApi(U4);
    const host2 = typeof location !== "undefined" ? hostFor(location.href) : null;
    let barEl = null, root2 = null;
    const stateListeners = /* @__PURE__ */ new Set();
    let lastState = "";
    function geometry() {
      const c3 = config.data;
      const o3 = typeof host2.bar === "function" ? host2.bar(location.href) || {} : host2.bar || {};
      return { height: o3.height ?? c3.buttonBarHeight, bottom: o3.bottom ?? c3.buttonBarBottomSpacing };
    }
    let regionEl = null, ro = null;
    function region() {
      const sels = host2.region || [];
      let el = null;
      for (const sel of sels) {
        try {
          el = [...document.querySelectorAll(sel)].find((e3) => e3.getBoundingClientRect().width > 200) || null;
        } catch {
          el = null;
        }
        if (el) break;
      }
      if (el !== regionEl) {
        ro?.disconnect();
        regionEl = el;
        if (el && typeof ResizeObserver === "function") {
          ro = new ResizeObserver(() => schedule());
          ro.observe(el);
        }
      }
      if (!el) return null;
      const r3 = el.getBoundingClientRect();
      return { left: Math.max(0, Math.round(r3.left)), width: Math.round(Math.min(r3.width, innerWidth - Math.max(0, r3.left))) };
    }
    const hiddenHere = () => {
      try {
        return typeof host2.hide === "function" ? !!host2.hide(new URL(location.href)) : false;
      } catch {
        return false;
      }
    };
    function BarHost() {
      const [, force] = U4.react.useReducer((x4) => x4 + 1, 0);
      U4.react.useEffect(() => U4.onSlotChange("bar", () => force()), []);
      const items = U4.getSlotItems("bar");
      return U4.react.h(U4.react.Fragment || "div", null, items.map((d3) => U4.react.h(U4.ErrorBoundary, { key: d3.id, fallback: null, label: `bar:${d3.id}` }, d3.render ? U4.react.h(d3.render, {}) : null)));
    }
    function update() {
      if (!isSettled()) return;
      const want = U4.getSlotItems("bar").length > 0 && hasEditable();
      if (!want) {
        if (barEl?.isConnected) U4.unmount(barEl);
        emitState();
        return;
      }
      if (!barEl) {
        barEl = document.createElement("div");
        barEl.className = "uspp-cttf-bar";
        barEl.setAttribute("data-uspp-cttf", "bar");
        barEl.setAttribute("data-host", host2.id);
        for (const ev of ["keydown", "keyup", "keypress"]) barEl.addEventListener(ev, (e3) => e3.stopPropagation());
      }
      if (!barEl.isConnected && document.body) U4.mount(document.body, barEl);
      const g4 = geometry();
      const m3 = barMetrics(g4.height, g4.bottom);
      for (const [k4, v3] of [["bar-h", m3.H], ["bar-bottom", m3.bottom], ["bar-py", m3.py], ["bar-px", m3.px], ["bar-gap", m3.gap], ["btn-h", m3.bh], ["btn-fs", m3.fs], ["btn-vp", m3.vp], ["btn-hp", m3.hp], ["btn-r", m3.r], ["btn-lh", m3.lh]]) U4.setStyle(barEl, `--uspp-cttf-${k4}`, `${v3}px`);
      const reg = region();
      U4.setStyle(barEl, "--uspp-cttf-bar-left", reg ? `${reg.left}px` : null);
      U4.setStyle(barEl, "--uspp-cttf-bar-w", reg ? `${reg.width}px` : null);
      U4.setAttr(barEl, "data-hidden", hiddenHere() ? "true" : null);
      if (!root2) {
        const R3 = U4.react.getRenderer();
        if (!R3) {
          setTimeout(update, 300);
          return;
        }
        root2 = R3.createRoot(barEl);
        root2.render(U4.react.h(BarHost, null));
      }
      emitState();
    }
    function emitState() {
      const s3 = JSON.stringify(barState());
      if (s3 === lastState) return;
      lastState = s3;
      for (const fn2 of [...stateListeners]) {
        try {
          fn2(barState());
        } catch (e3) {
          console.error(e3);
        }
      }
    }
    function barState() {
      const shown2 = !!barEl?.isConnected && barEl.getAttribute("data-hidden") !== "true";
      const g4 = geometry(), m3 = barMetrics(g4.height, g4.bottom);
      return { shown: shown2, height: m3.H, bottom: m3.bottom };
    }
    const schedule = U4.debounce(update, 150);
    const common = {
      host: host2,
      composer: composer_exports,
      get barElement() {
        return barEl;
      },
      barState,
      onBarStateChange: (fn2) => {
        stateListeners.add(fn2);
        return () => stateListeners.delete(fn2);
      },
      refresh: () => update()
    };
    function siteTheme() {
      const de = document.documentElement;
      if (!de) return null;
      const cls = de.classList, b3 = document.body?.classList;
      if (cls.contains("dark") || b3?.contains("dark") || cls.contains("theme-dark")) return "dark";
      if (cls.contains("light") || b3?.contains("light") || cls.contains("theme-light")) return "light";
      for (const a3 of ["data-theme", "data-color-mode", "data-mode", "data-bs-theme"]) {
        const v3 = (de.getAttribute(a3) || document.body?.getAttribute(a3) || "").toLowerCase();
        if (v3.includes("dark")) return "dark";
        if (v3.includes("light")) return "light";
      }
      const cs = (de.style.colorScheme || "").trim();
      if (cs === "dark" || cs === "light") return cs;
      return null;
    }
    const prefersDark = () => {
      try {
        return matchMedia("(prefers-color-scheme: dark)").matches;
      } catch {
        return false;
      }
    };
    function applyTheme2() {
      const de = document.documentElement;
      if (!de) return;
      const want = siteTheme() || (prefersDark() ? "dark" : "light");
      if (de.getAttribute("data-uspp-cttf-theme") !== want) U4.setAttr(de, "data-uspp-cttf-theme", want);
    }
    function watchTheme() {
      applyTheme2();
      try {
        matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme2);
      } catch {
      }
      const mo2 = new MutationObserver((recs) => {
        if (recs.some((r3) => r3.attributeName !== "data-uspp-cttf-theme")) applyTheme2();
      });
      const opts = { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-color-mode", "data-mode", "data-bs-theme"] };
      if (document.documentElement) mo2.observe(document.documentElement, opts);
      const onBody = () => {
        if (document.body) {
          mo2.observe(document.body, opts);
          applyTheme2();
        }
      };
      if (document.body) onBody();
      else document.addEventListener("DOMContentLoaded", onBody, { once: true });
    }
    return U4.defineSite({
      id: "chat",
      theme: () => siteTheme() || (prefersDark() ? "dark" : "light"),
      name: "AI Chat",
      matches: ALL_MATCHES,
      // 页面上出现输入框即视为就绪;一直没有时 20 秒后照常启动插件
      ready: () => hasEditable(),
      readyTimeout: 2e4,
      route: true,
      slots: [{ name: "bar", kind: "component", context: "{ render: 组件 }:渲染在页面底部按钮栏里,order 越小越靠左" }],
      common,
      start() {
        config.init();
        prefs.watch();
        setProfile(host2);
        trackComposition();
        U4.registerStyle("uspp-cttf-chat-bar", BAR_CSS + PANEL_CSS + (host2.css || ""));
        U4.onSlotChange("bar", schedule);
        config.subscribe(schedule);
        const sel = [.../* @__PURE__ */ new Set([...host2.input || [], "textarea", "[contenteditable='true']"])].join(",");
        U4.observe(sel, { added: schedule, removed: schedule });
        U4.onRouteChange(() => {
          schedule();
          setTimeout(schedule, 350);
        });
        addEventListener("resize", schedule);
        startSettle({
          ssr: !!host2.ssr,
          // 有 readyInput 的站点等真正的编辑器接管(ChatGPT 首屏的 textarea 只是 SSR 占位,写进去会丢)
          hasEditable: () => host2.readyInput ? !!document.querySelector(host2.readyInput) : hasEditable()
        }).then(() => {
          try {
            watchTheme();
          } catch {
          }
          try {
            U4.ensureUiRoot?.();
          } catch {
          }
          update();
        });
        schedule();
      }
    });
  };

  // sites/chat/lib/i18n.js
  var ZH = {
    appName: "[Chat] Template Text Folders",
    defaultFolder: "默认",
    explain: "解释",
    toolCut: "剪切",
    toolCopy: "复制",
    toolPaste: "粘贴",
    toolClear: "清空",
    cutOk: "剪切成功",
    copyOk: "复制成功",
    pasteOk: "粘贴成功",
    clearOk: "清空成功",
    cutFail: "剪切失败",
    copyFail: "复制失败",
    pasteFail: "粘贴失败",
    clipboardFail: "无法读取剪贴板,请检查浏览器权限",
    noInput: "没有找到输入框",
    settings: "设置",
    clearInput: "清空输入框",
    openSettings: "打开模板设置",
    emptyFolder: "这个文件夹还没有按钮",
    // 面板
    panelTitle: "⚙️ 设置面板",
    folderCount: "共有 {n} 个文件夹",
    buttonCount: "所有文件夹共有 {n} 个按钮",
    folderButtonCount: '"{name}" 文件夹有 {n} 个按钮',
    automation: "⚡ 自动化",
    pluginsEntry: "🧩 插件",
    scriptConfig: "🛠️ 脚本配置",
    close: "关闭",
    toggleSidebar: "折叠 / 展开文件夹列表",
    colFolderName: "文件夹名称",
    colShow: "显示",
    colEdit: "修改",
    colDelete: "删除",
    colPreview: "按钮预览",
    colVars: "变量",
    colAutoSubmit: "自动提交",
    newFolder: "+ 新建文件夹",
    newButton: "+ 新建按钮",
    noFolderSelected: "请选择左侧的文件夹",
    none: "无",
    // 文件夹编辑
    newFolderTitle: "🆕 新建文件夹",
    editFolderTitle: "✏️ 编辑文件夹",
    folderName: "文件夹名称",
    bgColor: "按钮背景颜色",
    textColor: "按钮文字颜色",
    errFolderName: "请输入文件夹名称",
    errFolderExists: "该文件夹已存在!",
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    delete: "删除",
    delFolderTitle: '确认删除文件夹 "{name}"?',
    irreversible: "此操作无法撤销!",
    delFolderWarn: "删除文件夹将同时删除其中的所有自定义按钮!",
    delToolFolderNote: "工具文件夹删除后,下次加载时会自动重建。",
    folderAppearance: "名称:{name} · 背景:{bg} · 文字:{fg}",
    // 按钮编辑
    newButtonTitle: "🆕 新建按钮",
    editButtonTitle: "✏️ 编辑按钮",
    tabTemplate: "文本模板",
    tabStyle: "样式设置",
    tabSubmit: "提交设置",
    insertVar: "插入变量:",
    varInput: "📝 输入框",
    varClipboard: "📋 剪贴板",
    varSelection: "🔍 选中",
    varInputOrClip: "🔄 输入框/剪贴板",
    templatePlaceholder: "输入模板文本,可插入上方的变量",
    buttonName: "按钮名称",
    buttonIcon: "按钮图标",
    buttonIconHint: "URL 或 data: URL;留空时将根据按钮名称中的符号展示默认图标",
    autoSubmitLabel: "自动提交(在填充后自动提交内容)",
    errButtonName: "请输入按钮名称!",
    errColor: "请选择有效的颜色!",
    errButtonExists: "按钮名称已存在!",
    toolLocked: "工具文件夹中的工具按钮无法编辑或删除",
    delButtonTitle: '确认删除按钮 "{name}"?',
    template: "模板文本",
    yes: "是",
    no: "否",
    moveConflict: '目标文件夹已有同名按钮 "{name}",已取消移动',
    // 自动化
    autoTitle: "⚡ 自动化规则",
    newRule: "+ 新建",
    colSite: "网站｜网址",
    colMethod: "提交方式",
    unnamedRule: "未命名规则",
    noUrl: "(未指定网址)",
    clickSubmit: "模拟点击提交按钮",
    newRuleTitle: "🆕 新建自动化规则",
    editRuleTitle: "✏️ 编辑自动化规则",
    ruleUrl: "网址",
    ruleName: "备注名称",
    ruleIcon: "站点图标",
    fetchIcon: "自动获取站点图标",
    submitMethod: "自动提交方式",
    advanced: "高级选项",
    modifierKey: "修饰键",
    clickDefault: "默认",
    clickSelector: "自定义 CSS 选择器",
    selectorPlaceholder: '如:button.send-btn 或 form button[type="submit"]',
    enterNoOptions: "Enter 提交方式没有额外配置",
    errRuleRequired: "请输入网址和备注名称!",
    errSelectorEmpty: "请输入有效的 CSS 选择器!",
    errSelectorSyntax: "CSS 选择器语法错误,请检查后再试!",
    delRuleConfirm: '确认删除自动化规则 "{name}"?此操作无法撤销',
    autoSubmitTimeout: "自动提交:等待输入框内容超时,未发送",
    autoSubmitFail: "自动提交失败:没有找到发送方式",
    // 脚本配置
    configTitle: "🛠️ 脚本配置",
    tabAppearance: "外观",
    tabConfig: "配置",
    tabSync: "同步",
    language: "语言",
    langAuto: "自动",
    langZh: "中文",
    langEn: "English",
    folderIcons: "文件夹图标",
    show: "显示",
    hide: "隐藏",
    export: "📤 导出",
    import: "📥 导入",
    reset: "↩️ 重置",
    exportHint: "导出当前配置为 JSON 文件(不含 WebDAV 密码)",
    importHint: "从 JSON 文件导入配置(会先预览)",
    resetHint: "恢复为默认配置(WebDAV 设置不受影响)",
    parseFail: "解析失败!请确认文件格式正确",
    invalidConfig: "配置文件无效!缺少必要字段",
    resetConfirm: "确认重置所有配置为默认设置吗?",
    resetDone: "已重置为默认配置",
    importTitle: "📥 确认导入配置",
    currentConfig: "当前配置",
    importedConfig: "导入配置",
    stats: "{f} 个文件夹 · {b} 个按钮",
    importWarn: "导入配置将完全替换当前配置,此操作无法撤销!",
    viewDiff: "查看差异",
    hideDiff: "收起差异",
    confirmImport: "确认导入",
    importDone: "导入成功",
    diffAdded: "新增文件夹",
    diffRemoved: "删除文件夹",
    diffChanged: "变更文件夹",
    diffOrder: "文件夹顺序变化",
    diffSettings: "其他设置变化",
    noDiff: "暂无差异",
    legacyFound: "此网站有旧版本地配置,是否查看并导入?",
    legacyView: "查看",
    saveFirst: "设置已修改:「测试连接」用当前填写的内容;上传和拉取请先点「保存设置」。",
    legacyIgnore: "忽略",
    // WebDAV
    webdavTitle: "WebDAV 同步",
    webdavEnable: "开启 WebDAV 同步",
    serverUrl: "服务器地址",
    username: "用户名",
    password: "密码 / 应用密码",
    remotePath: "远端文件路径",
    autoSync: "自动同步(启动时检查云端,修改后 10 秒上传)",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    saveSettings: "💾 保存",
    testConn: "🔌 测试连接",
    upload: "📤 上传",
    pull: "📥 拉取",
    lastSync: "上次同步:{t}",
    never: "从未",
    httpWarn: "明文传输密码,不安全",
    unsavedTitle: "设置尚未保存",
    saveAndClose: "保存并关闭",
    discardAndClose: "放弃并关闭",
    keepEditing: "继续编辑",
    saved: "已保存",
    syncNotEnabled: "请先开启 WebDAV 同步",
    syncIncomplete: "请先填写完整的 WebDAV 设置",
    noGM: "当前环境不支持跨域请求,请在脚本管理器中启用 GM_xmlhttpRequest",
    checking: "正在检查云端配置…",
    testing: "正在测试连接…",
    testOk: "连接成功",
    uploaded: "已将本地配置上传到 WebDAV",
    sameNoUpdate: "云端配置与本地完全相同,无需更新",
    noRemote: "云端还没有配置文件",
    pulled: "已使用云端配置覆盖本地",
    errAuth: "认证失败,请检查用户名和密码",
    errServer: "服务器或网络错误,本地配置未改动({s})",
    errInvalidRemote: "云端文件不是有效的配置,本地配置未改动",
    conflictTitle: "⚠️ 同步冲突",
    conflictMsg: "检测到云端与本地配置存在差异,请选择以哪一份为准",
    opUpload: "当前操作:上传",
    opPull: "当前操作:拉取",
    remoteConfig: "云端配置",
    remoteModified: "云端修改时间:{t}",
    keepLocal: "以本地为准(上传到云端)",
    useRemote: "以云端为准(覆盖本地)",
    cancelled: "操作已取消,配置保持不变",
    autoPulled: "已从 WebDAV 更新配置",
    autoConflict: "WebDAV 有冲突,点击处理",
    handle: "处理",
    syncFailed: "WebDAV 同步失败:{msg}"
  };
  var EN = {
    appName: "[Chat] Template Text Folders",
    defaultFolder: "Default",
    explain: "Explain",
    toolCut: "Cut",
    toolCopy: "Copy",
    toolPaste: "Paste",
    toolClear: "Clear",
    cutOk: "Cut",
    copyOk: "Copied",
    pasteOk: "Pasted",
    clearOk: "Cleared",
    cutFail: "Cut failed",
    copyFail: "Copy failed",
    pasteFail: "Paste failed",
    clipboardFail: "Cannot read the clipboard. Please check browser permissions.",
    noInput: "No input box found",
    settings: "Settings",
    clearInput: "Clear input",
    openSettings: "Open template settings",
    emptyFolder: "This folder has no buttons yet",
    panelTitle: "⚙️ Settings",
    folderCount: "{n} folders in total",
    buttonCount: "{n} buttons across all folders",
    folderButtonCount: 'Folder "{name}" has {n} buttons',
    automation: "⚡ Automation",
    pluginsEntry: "🧩 Plugins",
    scriptConfig: "🛠️ Script config",
    close: "Close",
    toggleSidebar: "Collapse / expand folder list",
    colFolderName: "Folder",
    colShow: "Show",
    colEdit: "Edit",
    colDelete: "Delete",
    colPreview: "Preview",
    colVars: "Variables",
    colAutoSubmit: "Auto submit",
    newFolder: "+ New folder",
    newButton: "+ New button",
    noFolderSelected: "Select a folder on the left",
    none: "None",
    newFolderTitle: "🆕 New folder",
    editFolderTitle: "✏️ Edit folder",
    folderName: "Folder name",
    bgColor: "Background color",
    textColor: "Text color",
    errFolderName: "Please enter a folder name",
    errFolderExists: "A folder with this name already exists!",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    delFolderTitle: 'Delete folder "{name}"?',
    irreversible: "This cannot be undone!",
    delFolderWarn: "Deleting the folder also deletes all of its buttons!",
    delToolFolderNote: "The tool folder will be recreated the next time the script loads.",
    folderAppearance: "Name: {name} · Background: {bg} · Text: {fg}",
    newButtonTitle: "🆕 New button",
    editButtonTitle: "✏️ Edit button",
    tabTemplate: "Template",
    tabStyle: "Style",
    tabSubmit: "Submit",
    insertVar: "Insert variable:",
    varInput: "📝 Input",
    varClipboard: "📋 Clipboard",
    varSelection: "🔍 Selection",
    varInputOrClip: "🔄 Input/Clipboard",
    templatePlaceholder: "Template text; you can insert the variables above",
    buttonName: "Button name",
    buttonIcon: "Button icon",
    buttonIconHint: "URL or data: URL. When empty, the symbol in the button name is used.",
    autoSubmitLabel: "Auto submit (send after filling)",
    errButtonName: "Please enter a button name!",
    errColor: "Please choose a valid color!",
    errButtonExists: "A button with this name already exists!",
    toolLocked: "Tool buttons in the tool folder cannot be edited or deleted",
    delButtonTitle: 'Delete button "{name}"?',
    template: "Template",
    yes: "Yes",
    no: "No",
    moveConflict: 'The target folder already has a button named "{name}"; move cancelled',
    autoTitle: "⚡ Automation rules",
    newRule: "+ New",
    colSite: "Site | URL",
    colMethod: "Submit method",
    unnamedRule: "Unnamed rule",
    noUrl: "(no URL)",
    clickSubmit: "Click the send button",
    newRuleTitle: "🆕 New automation rule",
    editRuleTitle: "✏️ Edit automation rule",
    ruleUrl: "URL",
    ruleName: "Name",
    ruleIcon: "Site icon",
    fetchIcon: "Fetch site icon",
    submitMethod: "Submit method",
    advanced: "Advanced",
    modifierKey: "Modifier key",
    clickDefault: "Default",
    clickSelector: "Custom CSS selector",
    selectorPlaceholder: 'e.g. button.send-btn or form button[type="submit"]',
    enterNoOptions: "Enter has no extra options",
    errRuleRequired: "Please enter a URL and a name!",
    errSelectorEmpty: "Please enter a valid CSS selector!",
    errSelectorSyntax: "Invalid CSS selector, please check it!",
    delRuleConfirm: 'Delete automation rule "{name}"? This cannot be undone',
    autoSubmitTimeout: "Auto submit: timed out waiting for the input; not sent",
    autoSubmitFail: "Auto submit failed: no way to send was found",
    configTitle: "🛠️ Script config",
    tabAppearance: "Appearance",
    tabConfig: "Config",
    tabSync: "Sync",
    language: "Language",
    langAuto: "Auto",
    langZh: "中文",
    langEn: "English",
    folderIcons: "Folder icons",
    show: "Show",
    hide: "Hide",
    export: "📤 Export",
    import: "📥 Import",
    reset: "↩️ Reset",
    exportHint: "Export the config as JSON (WebDAV password not included)",
    importHint: "Import a config from JSON (previewed first)",
    resetHint: "Restore the default config (WebDAV settings are kept)",
    parseFail: "Failed to parse! Please check the file format",
    invalidConfig: "Invalid config file! Required fields are missing",
    resetConfirm: "Reset all settings to defaults?",
    resetDone: "Reset to defaults",
    importTitle: "📥 Confirm import",
    currentConfig: "Current",
    importedConfig: "Imported",
    stats: "{f} folders · {b} buttons",
    importWarn: "Importing replaces the whole current config. This cannot be undone!",
    viewDiff: "View diff",
    hideDiff: "Hide diff",
    confirmImport: "Import",
    importDone: "Imported",
    diffAdded: "Added folders",
    diffRemoved: "Removed folders",
    diffChanged: "Changed folders",
    diffOrder: "Folder order changed",
    diffSettings: "Other settings changed",
    noDiff: "No differences",
    legacyFound: "This site has a local config from the old version. View and import it?",
    legacyView: "View",
    saveFirst: "Settings changed: Test connection uses what you entered; save the settings before uploading or pulling.",
    legacyIgnore: "Ignore",
    webdavTitle: "WebDAV sync",
    webdavEnable: "Enable WebDAV sync",
    serverUrl: "Server URL",
    username: "Username",
    password: "Password / app password",
    remotePath: "Remote file path",
    autoSync: "Auto sync (check on start, upload 10 s after changes)",
    showPassword: "Show password",
    hidePassword: "Hide password",
    saveSettings: "💾 Save",
    testConn: "🔌 Test connection",
    upload: "📤 Upload",
    pull: "📥 Pull",
    lastSync: "Last sync: {t}",
    never: "never",
    httpWarn: "Password is sent in plain text; not secure",
    unsavedTitle: "Settings not saved",
    saveAndClose: "Save and close",
    discardAndClose: "Discard and close",
    keepEditing: "Keep editing",
    saved: "Saved",
    syncNotEnabled: "Please enable WebDAV sync first",
    syncIncomplete: "Please complete the WebDAV settings first",
    noGM: "Cross-origin requests are not available. Please enable GM_xmlhttpRequest in your script manager",
    checking: "Checking the remote config…",
    testing: "Testing connection…",
    testOk: "Connected",
    uploaded: "Uploaded the local config to WebDAV",
    sameNoUpdate: "Remote and local configs are identical; nothing to update",
    noRemote: "There is no config file on the server yet",
    pulled: "Replaced the local config with the remote one",
    errAuth: "Authentication failed; check the username and password",
    errServer: "Server or network error; local config unchanged ({s})",
    errInvalidRemote: "The remote file is not a valid config; local config unchanged",
    conflictTitle: "⚠️ Sync conflict",
    conflictMsg: "The remote and local configs differ. Choose which one to keep",
    opUpload: "Operation: upload",
    opPull: "Operation: pull",
    remoteConfig: "Remote",
    remoteModified: "Remote modified: {t}",
    keepLocal: "Keep local (upload)",
    useRemote: "Use remote (overwrite local)",
    cancelled: "Cancelled; config unchanged",
    autoPulled: "Config updated from WebDAV",
    autoConflict: "WebDAV conflict. Click to resolve",
    handle: "Resolve",
    syncFailed: "WebDAV sync failed: {msg}"
  };
  function lang() {
    const p3 = prefs.get().language;
    if (p3 === "zh" || p3 === "en") return p3;
    const nav = typeof navigator !== "undefined" && (navigator.languages?.[0] || navigator.language) || "en";
    return /^zh/i.test(nav) ? "zh" : "en";
  }
  function t(key, vars) {
    const dict = lang() === "zh" ? ZH : EN;
    let s3 = dict[key] ?? EN[key] ?? key;
    if (vars) s3 = s3.replace(/\{(\w+)\}/g, (m3, k4) => k4 in vars ? String(vars[k4]) : m3);
    return s3;
  }
  var joinList = (list) => list.join(lang() === "zh" ? "、" : ", ");

  // sites/chat/lib/ui.js
  function useLive() {
    const [, force] = useReducer((x4) => x4 + 1, 0);
    useEffect(() => {
      const a3 = prefs.subscribe(() => force());
      const b3 = config.subscribe(() => force());
      return () => {
        a3();
        b3();
      };
    }, []);
  }
  function openDialog(Component, props = {}, { key, dismissable = true, width = 560 } = {}) {
    let closeFn = () => {
    };
    const k4 = U.openModal(({ onClose }) => {
      closeFn = onClose;
      return h(DialogFrame, { Component, props, onClose, dismissable, width });
    }, { modalKey: key ? `cttf-${key}` : void 0 });
    return () => U.closeModal(k4);
  }
  function DialogFrame({ Component, props, onClose, dismissable, width }) {
    useLive();
    return h("div", {
      className: "uspp-cttf-dlg-wrap",
      onClick: (e3) => {
        if (e3.target === e3.currentTarget && dismissable) onClose();
      }
    }, h(
      "div",
      { className: "uspp-cttf-dlg", role: "dialog", "aria-modal": "true", style: { width: `min(${width}px, 95vw)` }, onClick: (e3) => e3.stopPropagation() },
      h(Component, { ...props, close: onClose })
    ));
  }
  var CloseSvg = () => h("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", "aria-hidden": "true" }, h("path", { d: "M18 6 6 18M6 6l12 12" }));
  function DialogHeader({ title, children, close }) {
    return h(
      "div",
      { className: "uspp-cttf-dlg-head" },
      h("div", { className: "uspp-cttf-dlg-title" }, title),
      h("div", { className: "uspp-cttf-dlg-head-extra" }, children),
      close && h("button", { type: "button", className: "uspp-cttf-x", title: t("close"), "aria-label": t("close"), onClick: close }, h(CloseSvg))
    );
  }
  var DialogBody = ({ children, className }) => h("div", { className: "uspp-cttf-dlg-body " + (className || "") }, children);
  var DialogFooter = ({ children }) => h("div", { className: "uspp-cttf-dlg-foot" }, children);
  function Btn({ kind = "plain", children, ...rest }) {
    return h("button", { type: "button", className: `uspp-cttf-b uspp-cttf-b-${kind}`, ...rest }, children);
  }
  function Gone({ onGone, children }) {
    useEffect(() => () => onGone(), []);
    return children;
  }
  function confirmBox({ title, body, confirmText, cancelText, danger = false, width = 400 }) {
    return new Promise((resolve2) => {
      let done2 = false;
      const finish2 = (v3) => {
        if (!done2) {
          done2 = true;
          resolve2(v3);
        }
      };
      openDialog(
        ({ close }) => h(Gone, { onGone: () => finish2(false) }, h(
          Fragment,
          null,
          h(DialogHeader, { title: typeof title === "function" ? title() : title, close: () => {
            finish2(false);
            close();
          } }),
          h(DialogBody, null, typeof body === "function" ? body() : body),
          h(
            DialogFooter,
            null,
            h(Btn, { kind: "cancel", onClick: () => {
              finish2(false);
              close();
            } }, cancelText || t("cancel")),
            h(Btn, { kind: danger ? "danger" : "primary", onClick: () => {
              finish2(true);
              close();
            } }, confirmText || t("confirm"))
          )
        )),
        {},
        { width }
      );
    });
  }
  function chooseBox({ title, body, choices, width = 520 }) {
    return new Promise((resolve2) => {
      let done2 = false;
      const finish2 = (v3) => {
        if (!done2) {
          done2 = true;
          resolve2(v3);
        }
      };
      openDialog(
        ({ close }) => h(Gone, { onGone: () => finish2(null) }, h(
          Fragment,
          null,
          h(DialogHeader, { title, close: () => {
            finish2(null);
            close();
          } }),
          h(DialogBody, null, typeof body === "function" ? body() : body),
          h(DialogFooter, null, choices.map((c3) => h(Btn, { key: String(c3.value), kind: c3.kind || "plain", onClick: () => {
            finish2(c3.value);
            close();
          } }, c3.label)))
        )),
        {},
        { width, dismissable: false }
      );
    });
  }
  function Icon({ name, btn }) {
    const [broken, setBroken] = useState(false);
    const ic = buttonIcon(name, btn);
    if (ic.url && !broken) return h("img", { className: "uspp-cttf-ic-img", src: ic.url, alt: "", referrerPolicy: "no-referrer", loading: "lazy", onError: () => setBroken(true) });
    return h("span", { className: "uspp-cttf-ic" }, ic.emoji || ic.fallback);
  }
  function Chip({ name, btn, folder, title, onClick, onMouseDown, draggable, onDragStart, extraClass, withIcon = true, dataAttrs }) {
    const color = (btn || folder)?.color, textColor = (btn || folder)?.textColor;
    const { icon, text } = splitName(name);
    const showIcon = withIcon && (btn ? true : !!icon);
    const shownText = btn ? text || (icon ? "" : name) : withIcon && icon ? text : name;
    return h("button", {
      type: "button",
      className: "uspp-cttf-chip-btn " + (extraClass || "") + (showIcon && !shownText ? " uspp-cttf-chip-icononly" : ""),
      title: title ?? name,
      style: { background: color || void 0, color: textColor || void 0 },
      onMouseDown: (e3) => {
        e3.preventDefault();
        onMouseDown?.(e3);
      },
      onClick,
      draggable,
      onDragStart,
      ...dataAttrs || {}
    }, showIcon && (btn ? h(Icon, { name, btn }) : h("span", { className: "uspp-cttf-ic" }, icon)), shownText && h("span", { className: "uspp-cttf-chip-label" }, shownText));
  }
  function Tabs({ tabs, value, onChange }) {
    return h("div", { className: "uspp-cttf-tabbar", role: "tablist" }, tabs.map((tb) => h("button", {
      key: tb.value,
      type: "button",
      role: "tab",
      "aria-selected": String(tb.value === value),
      className: "uspp-cttf-tab",
      onClick: () => onChange(tb.value)
    }, tb.label)));
  }
  function Field({ label, hint, children, error }) {
    return h(
      "label",
      { className: "uspp-cttf-field" },
      h("span", { className: "uspp-cttf-field-label" }, label),
      children,
      hint && h("span", { className: "uspp-cttf-field-hint" }, hint),
      error && h("span", { className: "uspp-cttf-field-err" }, error)
    );
  }
  function ColorField({ label, value, onChange }) {
    const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : /^#[0-9a-f]{3}$/i.test(value) ? "#" + value.slice(1).split("").map((c3) => c3 + c3).join("") : "#000000";
    return h(
      Field,
      { label },
      h(
        "div",
        { className: "uspp-cttf-color-row" },
        h("input", { type: "color", className: "uspp-cttf-color", value: hex, onInput: (e3) => onChange(e3.target.value) }),
        h("input", { type: "text", className: "uspp-cttf-in", value, onInput: (e3) => onChange(e3.target.value), spellCheck: false })
      )
    );
  }
  var isValidColor = (c3) => {
    if (!c3 || typeof c3 !== "string") return false;
    try {
      return CSS.supports("color", c3);
    } catch {
      return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c3);
    }
  };
  var Badge = ({ title, children, kind }) => h("span", { className: "uspp-cttf-badge2", "data-kind": kind, title }, children);
  function download(text, filename, type = "application/json") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    a3.style.display = "none";
    (document.body || document.documentElement).appendChild(a3);
    a3.click();
    setTimeout(() => {
      a3.remove();
      URL.revokeObjectURL(url);
    }, 1e3);
  }
  function pickFile(accept = "application/json,.json") {
    return new Promise((resolve2) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.style.display = "none";
      input.onchange = () => {
        const f3 = input.files?.[0];
        input.remove();
        if (!f3) return resolve2(null);
        f3.text().then(resolve2, () => resolve2(null));
      };
      (document.body || document.documentElement).appendChild(input);
      input.click();
    });
  }
  var toast = (msg, type = "MESSAGE", duration) => U.showToast(msg, U.ToastType[type] || type, { duration: duration || (String(type).toUpperCase() === "ERROR" ? 3500 : 1500) });

  // sites/chat/lib/autosubmit.js
  var sleep2 = (ms) => new Promise((r3) => setTimeout(r3, ms));
  var squash2 = (s3) => String(s3).replace(/\s+/g, "");
  var isMac = () => /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");
  function ruleMatches(rule, url = location.href) {
    const d3 = String(rule?.domain || "").trim().toLowerCase();
    if (!d3) return false;
    if (d3.includes("/")) {
      const u3 = url.toLowerCase();
      const bare = u3.replace(/^[a-z]+:\/\//, "");
      return u3.startsWith(d3) || bare.startsWith(d3.replace(/^[a-z]+:\/\//, "")) || u3.includes(d3);
    }
    let host2;
    try {
      host2 = new URL(url).hostname.toLowerCase();
    } catch {
      return false;
    }
    const dom = d3.replace(/^\*\./, "").replace(/:\d+$/, "");
    return host2 === dom || host2.endsWith("." + dom);
  }
  var findRule = (rules, url) => (rules || []).find((r3) => ruleMatches(r3, url)) || null;
  var DEFAULT_SEND = ["button[type='submit']", "button[data-testid='send-button']"];
  var disabled = (b3) => b3.disabled || b3.getAttribute("aria-disabled") === "true";
  var shown = (b3) => {
    const r3 = b3.getBoundingClientRect();
    return (r3.width > 0 || r3.height > 0) && getComputedStyle(b3).visibility !== "hidden";
  };
  function firstUsable(selectors, needVisible) {
    for (const sel of selectors) {
      let list;
      try {
        list = document.querySelectorAll(sel);
      } catch {
        continue;
      }
      for (const b3 of list) if (!disabled(b3) && (!needVisible || shown(b3)) && !b3.closest("[data-uspp-cttf], uspp-cttf-root")) return b3;
    }
    return null;
  }
  async function pollClick(selectors, needVisible) {
    for (let i3 = 0; i3 < 10; i3++) {
      const b3 = firstUsable(selectors, needVisible);
      if (b3) {
        b3.click();
        return true;
      }
      await sleep2(300);
    }
    return false;
  }
  function pressEnter(target2, mods = {}) {
    const el = target2 || deepActive() || document.body;
    const init = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true, ...mods };
    el.dispatchEvent(new KeyboardEvent("keydown", init));
    el.dispatchEvent(new KeyboardEvent("keypress", init));
    el.dispatchEvent(new KeyboardEvent("keyup", init));
  }
  var busy = false;
  async function autoSubmit({ el, expected, rules, log = console }) {
    if (busy) return { ok: false, reason: "busy" };
    busy = true;
    try {
      const want = squash2(expected);
      let matched = false;
      for (let i3 = 0; i3 <= 30; i3++) {
        if (squash2(getText(el)) === want) {
          matched = true;
          break;
        }
        await sleep2(100);
      }
      if (!matched) {
        log.warn?.("[cttf] auto submit: input did not match the expected text in 3s");
        return { ok: false, reason: "timeout" };
      }
      await sleep2(500);
      const sent = () => !el.isConnected || !squash2(getText(el));
      const siteSend = [...getProfile().send || [], ...DEFAULT_SEND];
      const rule = findRule(rules, location.href);
      const focusTarget = () => el.isConnected ? el : deepActive();
      if (rule) {
        if (rule.method === "enter") {
          el.focus?.();
          pressEnter(focusTarget());
          return { ok: true };
        }
        if (rule.method === "modifier_enter") {
          const v3 = rule.methodAdvanced?.variant === "ctrl" ? { ctrlKey: true } : { metaKey: true };
          el.focus?.();
          pressEnter(focusTarget(), v3);
          return { ok: true };
        }
        if (rule.method === "click_submit") {
          const adv = rule.methodAdvanced;
          if (adv?.variant === "selector" && adv.selector?.trim()) {
            let valid = true;
            try {
              document.querySelector(adv.selector);
            } catch {
              valid = false;
            }
            if (valid && await pollClick([adv.selector], false)) return { ok: true };
            log.warn?.("[cttf] auto submit: custom selector found nothing; falling back to defaults");
          }
          if (await pollClick(siteSend, true)) return { ok: true };
        }
      }
      el.focus?.();
      pressEnter(focusTarget());
      await sleep2(500);
      if (sent()) return { ok: true };
      pressEnter(focusTarget(), isMac() ? { metaKey: true } : { ctrlKey: true });
      await sleep2(500);
      if (sent()) return { ok: true };
      if (await pollClick(siteSend, true)) return { ok: true };
      const form = el.closest?.("form") || document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        await sleep2(300);
        if (sent()) return { ok: true };
      }
      log.warn?.("[cttf] auto submit: no way to send was found");
      return { ok: false, reason: "notfound" };
    } finally {
      busy = false;
    }
  }

  // sites/chat/lib/actions.js
  var entry = { openManager: null, openScriptConfig: null, openAutomation: null, closeGuards: /* @__PURE__ */ new Set() };
  async function guardedClose(close) {
    for (const g4 of [...entry.closeGuards]) {
      try {
        if (!await g4()) return;
      } catch {
      }
    }
    close();
  }
  var warn = (...a3) => console.warn("[cttf]", ...a3);
  async function runTemplate(btn) {
    const selection = String(window.getSelection?.()?.toString() ?? "");
    const el = findTarget();
    if (!el) {
      warn("no input box found");
      toast(t("noInput"), "WARNING");
      return false;
    }
    if (!await waitComposition()) {
      warn("IME composition in progress; skipped");
      return false;
    }
    const tpl = String(btn.text ?? "");
    let clipboard = "";
    if (needsClipboard(tpl)) {
      const c3 = await readClipboard();
      if (c3 == null) {
        toast(t("clipboardFail"), "ERROR");
        return false;
      }
      clipboard = c3;
    }
    const input = getText(el);
    const text = expandTemplate(tpl, { input, clipboard, selection });
    const replace = replacesInput(tpl);
    const r3 = writeText(el, text, { replace });
    if (!r3.ok) return false;
    if (btn.autoSubmit) {
      const expected = replace ? text : getText(el);
      const res = await autoSubmit({ el, expected, rules: config.data.domainAutoSubmitSettings });
      if (!res.ok && res.reason === "timeout") toast(t("autoSubmitTimeout"), "WARNING");
      else if (!res.ok && res.reason === "notfound") toast(t("autoSubmitFail"), "WARNING");
    }
    return true;
  }
  async function runTool(action) {
    const el = findTarget();
    if (action === "paste") {
      const c3 = await readClipboard();
      if (c3 == null || !el) {
        toast(t("pasteFail"), "ERROR");
        return false;
      }
      writeText(el, c3, { replace: false });
      toast(t("pasteOk"), "SUCCESS", 1500);
      return true;
    }
    if (!el) {
      toast(t(action === "clear" ? "noInput" : `${action}Fail`), "ERROR");
      return false;
    }
    if (action === "clear") return clearAndFocus(el);
    const text = getText(el);
    if (action === "copy") {
      if (text && !await writeClipboard(text)) {
        toast(t("copyFail"), "ERROR");
        return false;
      }
      toast(t("copyOk"), "SUCCESS", 1500);
      return true;
    }
    if (action === "cut") {
      if (text && !await writeClipboard(text)) {
        toast(t("cutFail"), "ERROR");
        return false;
      }
      clearInput(el);
      toast(t("cutOk"), "SUCCESS", 1500);
      return true;
    }
    return false;
  }
  function clearAndFocus(el = findTarget()) {
    if (!el) {
      toast(t("noInput"), "WARNING");
      return false;
    }
    clearInput(el);
    el.focus?.({ preventScroll: true });
    try {
      if (isTextControl(el)) el.setSelectionRange(0, 0);
      else {
        const r3 = document.createRange();
        r3.setStart(el, 0);
        r3.collapse(true);
        const s3 = getSelection();
        s3.removeAllRanges();
        s3.addRange(r3);
      }
    } catch {
    }
    toast(t("clearOk"), "SUCCESS", 1500);
    return true;
  }
  var runButton = (btn) => btn.type === "tool" ? runTool(btn.action) : runTemplate(btn);

  // sites/chat/plugins/AutoSubmit/index.js
  var isMac2 = () => /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");
  function methodLabel(r3) {
    if (r3.method === "enter") return "Enter";
    if (r3.method === "modifier_enter") return (r3.methodAdvanced?.variant === "ctrl" ? "Ctrl" : "Cmd") + "+Enter";
    const base = t("clickSubmit");
    return r3.methodAdvanced?.variant === "selector" ? `${base} (${r3.methodAdvanced.selector})` : base;
  }
  function SiteIcon({ src }) {
    const [bad, setBad] = useState(false);
    if (!src || bad) return h("span", null, "🌐");
    return h("img", { src, alt: "", referrerPolicy: "no-referrer", loading: "lazy", onError: () => setBad(true) });
  }
  function RuleEditor({ close, index }) {
    useEffect(() => editingGuard.enter(), []);
    const cur = index != null ? config.data.domainAutoSubmitSettings[index] : null;
    const [domain, setDomain] = useState(cur?.domain ?? (index == null ? location.hostname : ""));
    const [name, setName] = useState(cur?.name ?? "");
    const [favicon, setFavicon] = useState(cur?.favicon ?? "");
    const [method, setMethod] = useState(cur?.method ?? "click_submit");
    const [modVariant, setModVariant] = useState(cur?.method === "modifier_enter" ? cur.methodAdvanced?.variant || "cmd" : isMac2() ? "cmd" : "ctrl");
    const [clickVariant, setClickVariant] = useState(cur?.method === "click_submit" && cur.methodAdvanced?.variant === "selector" ? "selector" : "default");
    const [selector, setSelector] = useState(cur?.methodAdvanced?.selector ?? "");
    const [showAdv, setShowAdv] = useState(!!cur?.methodAdvanced);
    const [err, setErr] = useState("");
    const submit = () => {
      if (!domain.trim() || !name.trim()) return setErr(t("errRuleRequired"));
      let adv;
      if (method === "modifier_enter") adv = { variant: modVariant };
      if (method === "click_submit") {
        if (clickVariant === "selector") {
          if (!selector.trim()) return setErr(t("errSelectorEmpty"));
          try {
            document.querySelector(selector);
          } catch {
            return setErr(t("errSelectorSyntax"));
          }
          adv = { variant: "selector", selector: selector.trim() };
        } else adv = { variant: "default" };
      }
      const rule = normalizeRule({ domain: domain.trim(), name: name.trim(), method, ...adv ? { methodAdvanced: adv } : {}, favicon: favicon.trim() || faviconFor(domain) });
      config.update((d3) => {
        if (index != null) d3.domainAutoSubmitSettings[index] = rule;
        else d3.domainAutoSubmitSettings.push(rule);
      });
      close();
    };
    const radio = (value, label) => h("label", { className: "uspp-cttf-check", key: value }, h("input", { type: "radio", name: "cttf-method", checked: method === value, onChange: () => setMethod(value) }), label);
    return h(
      Fragment,
      null,
      h(DialogHeader, { title: index != null ? t("editRuleTitle") : t("newRuleTitle"), close }),
      h(
        DialogBody,
        null,
        err && h("div", { className: "uspp-cttf-field-err" }, err),
        h(Field, { label: t("ruleUrl") }, h("input", { className: "uspp-cttf-in", value: domain, placeholder: "chatgpt.com", onInput: (e3) => {
          setDomain(e3.target.value);
          setErr("");
        } })),
        h(Field, { label: t("ruleName") }, h("input", { className: "uspp-cttf-in", value: name, placeholder: "ChatGPT", onInput: (e3) => {
          setName(e3.target.value);
          setErr("");
        } })),
        h(Field, { label: t("ruleIcon") }, h(
          "div",
          { className: "uspp-cttf-color-row" },
          h("span", { style: { width: "24px", display: "inline-flex" } }, h(SiteIcon, { src: favicon || faviconFor(domain) })),
          h("input", { className: "uspp-cttf-in", value: favicon, placeholder: faviconFor(domain || "example.com"), onInput: (e3) => setFavicon(e3.target.value) }),
          h(Btn, { onClick: () => setFavicon(faviconFor(domain)) }, t("fetchIcon"))
        )),
        h(Field, { label: t("submitMethod") }, h("div", { className: "uspp-cttf-row2" }, radio("enter", "Enter"), radio("modifier_enter", (isMac2() ? "Cmd" : "Ctrl") + "+Enter"), radio("click_submit", t("clickSubmit")))),
        h(
          "div",
          null,
          h(Btn, { kind: "plain", className: "uspp-cttf-b uspp-cttf-b-plain uspp-cttf-b-sm", onClick: () => setShowAdv(!showAdv) }, (showAdv ? "▾ " : "▸ ") + t("advanced")),
          showAdv && h(
            "div",
            { className: "uspp-cttf-col-card", style: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" } },
            method === "enter" && h("div", { className: "uspp-cttf-muted2" }, t("enterNoOptions")),
            method === "modifier_enter" && h(
              "div",
              { className: "uspp-cttf-row2" },
              h("span", { className: "uspp-cttf-muted2" }, t("modifierKey")),
              ["cmd", "ctrl"].map((v3) => h("label", { key: v3, className: "uspp-cttf-check" }, h("input", { type: "radio", name: "cttf-mod", checked: modVariant === v3, onChange: () => setModVariant(v3) }), v3 === "cmd" ? "Cmd" : "Ctrl"))
            ),
            method === "click_submit" && h(
              Fragment,
              null,
              h("div", { className: "uspp-cttf-row2" }, ["default", "selector"].map((v3) => h("label", { key: v3, className: "uspp-cttf-check" }, h("input", { type: "radio", name: "cttf-click", checked: clickVariant === v3, onChange: () => setClickVariant(v3) }), v3 === "default" ? t("clickDefault") : t("clickSelector")))),
              clickVariant === "selector" && h("input", { className: "uspp-cttf-in", value: selector, placeholder: t("selectorPlaceholder"), spellCheck: false, onInput: (e3) => {
                setSelector(e3.target.value);
                setErr("");
              } })
            )
          )
        )
      ),
      h(DialogFooter, null, h(Btn, { kind: "cancel", onClick: close }, t("cancel")), h(Btn, { kind: "primary", onClick: submit }, t("save")))
    );
  }
  function RulesDialog({ close }) {
    useLive();
    const rules = config.data.domainAutoSubmitSettings;
    const edit = (index) => openDialog(RuleEditor, { index }, { key: "rule-editor", dismissable: false, width: 480 });
    const del = async (i3) => {
      const r3 = rules[i3];
      const ok = await confirmBox({ title: t("delete"), body: t("delRuleConfirm", { name: r3.name || t("unnamedRule") }), danger: true, confirmText: t("delete"), width: 420 });
      if (ok) config.update((d3) => {
        d3.domainAutoSubmitSettings.splice(i3, 1);
      });
    };
    return h(
      Fragment,
      null,
      h(DialogHeader, { title: t("autoTitle"), close }, h("span", { style: { flex: 1 } }), h(Btn, { kind: "primary", onClick: () => edit(null) }, t("newRule"))),
      h(
        DialogBody,
        null,
        h("div", { className: "uspp-cttf-rule-row uspp-cttf-tbl-head", style: { position: "static" } }, h("span"), h("span", null, t("colSite")), h("span", null, t("colMethod")), h("span", null, t("colEdit")), h("span", null, t("colDelete"))),
        rules.map((r3, i3) => h(
          "div",
          { key: i3, className: "uspp-cttf-rule-row" },
          h(SiteIcon, { src: r3.favicon }),
          h("div", { style: { minWidth: 0 } }, h("div", null, r3.name || t("unnamedRule")), h("div", { className: "uspp-cttf-sub" }, r3.domain || t("noUrl"))),
          h("div", { className: "uspp-cttf-muted2", title: methodLabel(r3), style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 } }, methodLabel(r3)),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colEdit"), onClick: () => edit(i3) }, "✏️"),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colDelete"), onClick: () => del(i3) }, "🗑️")
        ))
      )
    );
  }
  var AutoSubmit_default = (U4) => {
    const open = () => openDialog(RulesDialog, {}, { key: "automation", width: 750 });
    return U4.definePlugin({
      name: "AutoSubmit",
      description: "Sends the message after a template is inserted, using per-site rules; includes the rule editor.",
      authors: ["0-V-linuxdo"],
      required: true,
      startAt: U4.StartAt.Init,
      slots: { managerHeader: { label: () => t("automation"), order: 10, onClick: open } },
      start() {
        entry.openAutomation = open;
      },
      stop() {
        entry.openAutomation = null;
      }
    });
  };

  // sites/chat/plugins/ConfigTransfer/index.js
  var LEGACY_KEY = "chatGPTButtonFoldersConfig";
  var LEGACY_LANG = "cttf-language-preference";
  var pad = (n2) => String(n2).padStart(2, "0");
  function exportFilename(d3 = /* @__PURE__ */ new Date()) {
    return `[Chat] Template Text Folders「${d3.getFullYear()}-${pad(d3.getMonth() + 1)}-${pad(d3.getDate())}」「${pad(d3.getHours())}：${pad(d3.getMinutes())}：${pad(d3.getSeconds())}」.json`;
  }
  function DiffSummary({ cur, next }) {
    const d3 = diffSummary(cur, next);
    if (d3.same) return h("div", { className: "uspp-cttf-muted2" }, t("noDiff"));
    const list = (label, items) => items.length ? h(Fragment, null, h("b", null, `${label} (${items.length})`), h("ul", null, items.map((n2) => h("li", { key: n2 }, n2)))) : null;
    return h(
      "div",
      { className: "uspp-cttf-diff" },
      list(t("diffAdded"), d3.added),
      list(t("diffRemoved"), d3.removed),
      list(t("diffChanged"), d3.changed),
      d3.orderChanged && h("div", null, "• " + t("diffOrder")),
      d3.settingsChanged && h("div", null, "• " + t("diffSettings"))
    );
  }
  function StatsCols({ left, right, leftLabel, rightLabel, extra: extra2 }) {
    const a3 = stats(left), b3 = stats(right);
    return h(
      "div",
      { className: "uspp-cttf-cols" },
      h("div", { className: "uspp-cttf-col-card" }, h("b", null, leftLabel), t("stats", { f: a3.folders, b: a3.buttons })),
      h("div", { className: "uspp-cttf-col-card" }, h("b", null, rightLabel), t("stats", { f: b3.folders, b: b3.buttons }), extra2 && h("div", { className: "uspp-cttf-sub" }, extra2))
    );
  }
  function confirmImport(incoming, { onCancel } = {}) {
    const next = normalizeConfig(incoming, lang());
    return new Promise((resolve2) => {
      let done2 = false;
      const finish2 = (v3) => {
        if (!done2) {
          done2 = true;
          if (!v3) onCancel?.();
          resolve2(v3);
        }
      };
      function View({ close }) {
        const [showDiff, setShowDiff] = useState(false);
        const cur = config.data;
        return h(Gone, { onGone: () => finish2(false) }, h(
          Fragment,
          null,
          h(DialogHeader, { title: t("importTitle"), close }),
          h(
            DialogBody,
            null,
            h(StatsCols, { left: cur, right: next, leftLabel: t("currentConfig"), rightLabel: t("importedConfig") }),
            h("div", { className: "uspp-cttf-warn2" }, t("importWarn")),
            showDiff && h(DiffSummary, { cur, next })
          ),
          h(
            DialogFooter,
            null,
            h(Btn, { onClick: () => setShowDiff(!showDiff) }, showDiff ? t("hideDiff") : t("viewDiff")),
            h("span", { style: { flex: 1 } }),
            h(Btn, { kind: "cancel", onClick: () => {
              finish2(false);
              close();
            } }, t("cancel")),
            h(Btn, { kind: "primary", onClick: () => {
              config.set(next, { source: "import" });
              toast(t("importDone"), "SUCCESS");
              finish2(true);
              close();
            } }, t("confirmImport"))
          )
        ));
      }
      openDialog(View, {}, { key: "import", dismissable: false, width: 480 });
    });
  }
  function parseConfigText(text) {
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      return { error: t("parseFail") };
    }
    if (!isValidConfig(obj)) return { error: t("invalidConfig") };
    return { config: obj };
  }
  async function importFromFile() {
    const text = await pickFile();
    if (text == null) return false;
    const r3 = parseConfigText(text);
    if (r3.error) {
      toast(r3.error, "ERROR");
      return false;
    }
    return confirmImport(r3.config);
  }
  function exportConfig() {
    const data = JSON.parse(JSON.stringify(config.data));
    for (const k4 of ["officialStyleBundle"]) if (data[k4] == null) delete data[k4];
    download(JSON.stringify(data, null, 2), exportFilename());
  }
  async function resetConfig() {
    const ok = await confirmBox({ title: t("reset"), body: t("resetConfirm"), danger: true, confirmText: t("confirm") });
    if (!ok) return;
    config.set(normalizeConfig(defaultConfig(lang()), lang()));
    toast(t("resetDone"), "SUCCESS");
  }
  var ConfigTransfer_default = (U4) => {
    function ScriptConfig({ close, tab: initial }) {
      useLive();
      const [tab, setTab] = useState(initial || "appearance");
      const [, force] = useState(0);
      useEffect(() => U4.onSlotChange("configTabs", () => force((x4) => x4 + 1)), []);
      const extra2 = U4.getSlotItems("configTabs");
      const tabs = [{ value: "appearance", label: t("tabAppearance") }, { value: "config", label: t("tabConfig") }, ...extra2.map((x4) => ({ value: x4.id, label: typeof x4.label === "function" ? x4.label() : x4.label }))];
      const p3 = prefs.get();
      const radio = (group, value, cur, label, onPick) => h("label", { key: value, className: "uspp-cttf-check" }, h("input", { type: "radio", name: `cttf-${group}`, checked: cur === value, onChange: onPick }), label);
      const ext = extra2.find((x4) => x4.id === tab);
      return h(
        Fragment,
        null,
        h(DialogHeader, { title: t("configTitle"), close: () => guardedClose(close) }),
        h(
          DialogBody,
          null,
          h(Tabs, { tabs, value: tab, onChange: setTab }),
          tab === "appearance" && h(
            Fragment,
            null,
            h(Field, { label: t("language") }, h(
              "div",
              { className: "uspp-cttf-row2" },
              [["auto", t("langAuto")], ["zh", t("langZh")], ["en", t("langEn")]].map(([v3, l3]) => radio("lang", v3, p3.language, l3, () => prefs.set({ language: v3 })))
            )),
            h(Field, { label: t("folderIcons") }, h(
              "div",
              { className: "uspp-cttf-row2" },
              [[true, t("show")], [false, t("hide")]].map(([v3, l3]) => radio("icons", String(v3), String(config.data.showFolderIcons), l3, () => config.update((d3) => {
                d3.showFolderIcons = v3;
              })))
            ))
          ),
          tab === "config" && h(
            Fragment,
            null,
            [["export", t("exportHint"), exportConfig], ["import", t("importHint"), importFromFile], ["reset", t("resetHint"), resetConfig]].map(([k4, hint, fn2]) => h("div", { key: k4, className: "uspp-cttf-row2" }, h(Btn, { kind: k4 === "reset" ? "danger" : "primary", onClick: () => fn2() }, t(k4)), h("span", { className: "uspp-cttf-muted2" }, hint)))
          ),
          ext && h(U4.ErrorBoundary, { fallback: null }, h(ext.render, { close }))
        )
      );
    }
    const open = (tab) => openDialog(ScriptConfig, { tab }, { key: "script-config", width: 400, dismissable: false });
    function migrateLegacy() {
      let raw2 = null;
      try {
        raw2 = localStorage.getItem(LEGACY_KEY);
      } catch {
      }
      let legacy = null;
      try {
        legacy = raw2 ? JSON.parse(raw2) : null;
      } catch {
        legacy = null;
      }
      if (!prefs.get().languageMigrated) {
        let l3 = null;
        try {
          l3 = localStorage.getItem(LEGACY_LANG);
        } catch {
        }
        prefs.set({ languageMigrated: true, ...["auto", "zh", "en"].includes(l3) && prefs.get().language === "auto" ? { language: l3 } : {} });
      }
      const first = gmGet("cttf.config") == null;
      if (first) {
        config.set(legacy && isValidConfig(legacy) ? normalizeConfig(legacy, lang()) : config.data, { source: "import" });
        return;
      }
      if (!legacy || !isValidConfig(legacy)) return;
      const host2 = location.hostname;
      const f3 = flags.get();
      if (f3.legacyIgnored?.[host2]) return;
      if (sameConfig(normalizeConfig(legacy, lang()), config.data)) return;
      flags.set({ legacyIgnored: { ...f3.legacyIgnored || {}, [host2]: Date.now() } });
      settled.then(() => U4.showNotice({ message: t("legacyFound"), type: "INFO", action: { label: t("legacyView"), onClick: () => confirmImport(legacy) } }));
    }
    return U4.definePlugin({
      name: "ConfigTransfer",
      description: "Script config: language and appearance, export / import with preview, reset, and migration from the old version's local data.",
      authors: ["0-V-linuxdo"],
      required: true,
      startAt: U4.StartAt.Init,
      slots: { managerHeader: { label: () => t("scriptConfig"), order: 30, onClick: () => open() } },
      start() {
        entry.openScriptConfig = open;
        try {
          migrateLegacy();
        } catch (e3) {
          console.warn("[cttf] legacy migration failed", e3);
        }
      },
      stop() {
        entry.openScriptConfig = null;
      }
    });
  };

  // sites/chat/plugins/PromptManager/index.js
  var DRAG_FOLDER = "application/x-cttf-folder";
  function PanelIcon({ open }) {
    const p3 = (d3) => h("path", { d: d3 });
    return h(
      "svg",
      { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
      h("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 }),
      p3("M9 3v18"),
      open ? p3("M16 15l-3-3 3-3") : p3("M14 9l3 3-3 3")
    );
  }
  var PromptManager_default = (U4) => {
    let selected = null;
    let sideCollapsed = false;
    const save = (fn2) => config.update(fn2);
    function moveButton(name, from, to) {
      if (!from || !to || from === to) return;
      const c3 = config.data;
      if (!c3.folders[from]?.buttons[name] || !c3.folders[to]) return;
      if (c3.folders[to].buttons[name]) {
        toast(t("moveConflict", { name }), "WARNING");
        return;
      }
      save((d3) => {
        const b3 = d3.folders[from].buttons[name];
        delete d3.folders[from].buttons[name];
        d3.folders[to].buttons[name] = b3;
      });
    }
    function FolderEditor({ close, name: original }) {
      useEffect(() => editingGuard.enter(), []);
      const cur = original ? config.data.folders[original] : null;
      const [name, setName] = useState(original || "");
      const [color, setColor] = useState(cur?.color || "#3B82F6");
      const [textColor, setTextColor] = useState(cur?.textColor || "#ffffff");
      const [err, setErr] = useState("");
      const submit = () => {
        const n2 = name.trim();
        if (!n2) return setErr(t("errFolderName"));
        if (n2 !== original && config.data.folders[n2]) return setErr(t("errFolderExists"));
        if (!isValidColor(color) || !isValidColor(textColor)) return setErr(t("errColor"));
        save((d3) => {
          if (original) {
            const f3 = { ...d3.folders[original], color, textColor };
            d3.folders = renameKey(d3.folders, original, n2, f3);
            d3.folderOrder = d3.folderOrder.map((x4) => x4 === original ? n2 : x4);
          } else {
            d3.folders[n2] = { color, textColor, hidden: false, buttons: {} };
            d3.folderOrder.push(n2);
          }
        });
        selected = n2;
        close();
      };
      return h(
        Fragment,
        null,
        h(DialogHeader, { title: original ? t("editFolderTitle") : t("newFolderTitle"), close }),
        h(
          DialogBody,
          null,
          h("div", { className: "uspp-cttf-preview" }, h(Chip, { name: name || "📁", folder: { color, textColor } })),
          h(Field, { label: t("folderName"), error: err }, h("input", { className: "uspp-cttf-in", value: name, autoFocus: true, onInput: (e3) => {
            setName(e3.target.value);
            setErr("");
          }, onKeyDown: (e3) => {
            if (e3.key === "Enter") submit();
          } })),
          h(
            "div",
            { className: "uspp-cttf-grid2" },
            h(ColorField, { label: t("bgColor"), value: color, onChange: setColor }),
            h(ColorField, { label: t("textColor"), value: textColor, onChange: setTextColor })
          )
        ),
        h(DialogFooter, null, h(Btn, { kind: "cancel", onClick: close }, t("cancel")), h(Btn, { kind: "primary", onClick: submit }, t("save")))
      );
    }
    const editFolder = (name) => openDialog(FolderEditor, { name }, { key: "folder-editor", dismissable: false, width: 500 });
    async function deleteFolder(name) {
      const f3 = config.data.folders[name];
      if (!f3) return;
      const ok = await confirmBox({
        title: () => t("delFolderTitle", { name }),
        danger: true,
        confirmText: t("delete"),
        body: () => h(
          Fragment,
          null,
          h("div", { className: "uspp-cttf-warn2" }, t("irreversible")),
          h("div", null, t("delFolderWarn")),
          name === TOOL_FOLDER && h("div", { className: "uspp-cttf-muted2" }, t("delToolFolderNote")),
          h("div", { className: "uspp-cttf-muted2" }, t("folderAppearance", { name, bg: f3.color, fg: f3.textColor })),
          h("div", { className: "uspp-cttf-preview", style: { flexWrap: "wrap", gap: "6px" } }, Object.entries(f3.buttons).map(([bn2, b3]) => h(Chip, { key: bn2, name: bn2, btn: b3 })))
        )
      });
      if (!ok) return;
      save((d3) => {
        delete d3.folders[name];
        d3.folderOrder = d3.folderOrder.filter((x4) => x4 !== name);
      });
      if (selected === name) selected = null;
    }
    function ButtonEditor({ close, folder, name: original }) {
      useEffect(() => editingGuard.enter(), []);
      const cur = original ? config.data.folders[folder]?.buttons[original] : null;
      const isTool = cur?.type === "tool";
      const [tab, setTab] = useState(isTool ? "style" : "template");
      const [name, setName] = useState(original || "");
      const [text, setText2] = useState(cur?.text || "");
      const [favicon, setFavicon] = useState(cur?.favicon || "");
      const [color, setColor] = useState(cur?.color || "#FFC1CC");
      const [textColor, setTextColor] = useState(cur?.textColor || "#333333");
      const [auto, setAuto] = useState(!!cur?.autoSubmit);
      const [err, setErr] = useState("");
      const ta = useRef(null), nameRef = useRef(null);
      useEffect(() => {
        if (tab === "style") requestAnimationFrame(() => nameRef.current?.focus());
        else if (tab === "template") requestAnimationFrame(() => ta.current?.focus());
      }, [tab]);
      const insertVar = (v3) => {
        const el = ta.current;
        const s3 = el ? el.selectionStart : text.length, e3 = el ? el.selectionEnd : text.length;
        const next = text.slice(0, s3) + v3 + text.slice(e3);
        setText2(next);
        requestAnimationFrame(() => {
          if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = s3 + v3.length;
          }
        });
      };
      const preview = isTool ? { ...cur, color, textColor } : { type: "template", text, favicon, color, textColor, autoSubmit: auto };
      const submit = () => {
        const n2 = name.trim();
        if (!n2) {
          setTab("style");
          return setErr(t("errButtonName"));
        }
        if (!isValidColor(color) || !isValidColor(textColor)) {
          setTab("style");
          return setErr(t("errColor"));
        }
        if (n2 !== original && config.data.folders[folder]?.buttons[n2]) {
          setTab("style");
          return setErr(t("errButtonExists"));
        }
        const value = isTool ? { ...cur, color, textColor } : { ...cur || {}, type: "template", text: text.trim(), favicon: favicon.trim(), color, textColor, autoSubmit: auto };
        save((d3) => {
          const f3 = d3.folders[folder];
          if (!f3) return;
          if (original) f3.buttons = renameKey(f3.buttons, original, n2, value);
          else f3.buttons[n2] = value;
        });
        close();
      };
      const tabs = isTool ? [{ value: "style", label: t("tabStyle") }] : [{ value: "template", label: t("tabTemplate") }, { value: "style", label: t("tabStyle") }, { value: "submit", label: t("tabSubmit") }];
      return h(
        Fragment,
        null,
        h(DialogHeader, { title: original ? t("editButtonTitle") : t("newButtonTitle"), close }),
        h(
          DialogBody,
          null,
          h("div", { className: "uspp-cttf-preview" }, h(Chip, { name: name || "🔖", btn: preview, title: text })),
          h(Tabs, { tabs, value: tab, onChange: setTab }),
          err && h("div", { className: "uspp-cttf-field-err" }, err),
          tab === "template" && h(
            Fragment,
            null,
            h(
              "div",
              { className: "uspp-cttf-row2" },
              h("span", { className: "uspp-cttf-muted2" }, t("insertVar")),
              [["varInput", "{inputboard}"], ["varClipboard", "{clipboard}"], ["varSelection", "{selection}"], ["varInputOrClip", "{{inputboard}|{clipboard}}"]].map(([k4, v3]) => h(Btn, { key: k4, kind: "plain", className: "uspp-cttf-b uspp-cttf-b-plain uspp-cttf-b-sm", onMouseDown: (e3) => e3.preventDefault(), onClick: () => insertVar(v3), title: v3 }, t(k4)))
            ),
            h("textarea", { ref: ta, className: "uspp-cttf-ta", value: text, placeholder: t("templatePlaceholder"), onInput: (e3) => setText2(e3.target.value), spellCheck: false })
          ),
          tab === "style" && h(
            Fragment,
            null,
            h(Field, { label: t("buttonName") }, h("input", { ref: nameRef, className: "uspp-cttf-in", value: name, onInput: (e3) => {
              setName(e3.target.value);
              setErr("");
            } })),
            !isTool && h(Field, { label: t("buttonIcon"), hint: t("buttonIconHint") }, h("input", { className: "uspp-cttf-in", value: favicon, placeholder: "https://… / data:image/…", onInput: (e3) => setFavicon(e3.target.value) })),
            h(
              "div",
              { className: "uspp-cttf-grid2" },
              h(ColorField, { label: t("bgColor"), value: color, onChange: setColor }),
              h(ColorField, { label: t("textColor"), value: textColor, onChange: setTextColor })
            )
          ),
          tab === "submit" && h("label", { className: "uspp-cttf-check" }, h("input", { type: "checkbox", checked: auto, onChange: (e3) => setAuto(e3.target.checked) }), t("autoSubmitLabel"))
        ),
        h(DialogFooter, null, h(Btn, { kind: "cancel", onClick: close }, t("cancel")), h(Btn, { kind: "primary", onClick: submit }, t("save")))
      );
    }
    const editButton = (folder, name) => {
      const b3 = name ? config.data.folders[folder]?.buttons[name] : null;
      if (b3?.type === "tool" && folder === TOOL_FOLDER) return toast(t("toolLocked"), "WARNING");
      openDialog(ButtonEditor, { folder, name }, { key: "button-editor", dismissable: false, width: 500 });
    };
    async function deleteButton(folder, name) {
      const b3 = config.data.folders[folder]?.buttons[name];
      if (!b3) return;
      if (b3.type === "tool" && folder === TOOL_FOLDER) return toast(t("toolLocked"), "WARNING");
      const ok = await confirmBox({
        title: () => t("delButtonTitle", { name }),
        danger: true,
        confirmText: t("delete"),
        body: () => h(
          Fragment,
          null,
          h("div", { className: "uspp-cttf-preview" }, h(Chip, { name, btn: b3 })),
          h("div", { className: "uspp-cttf-muted2" }, t("folderAppearance", { name, bg: b3.color, fg: b3.textColor })),
          b3.type === "template" && h(Field, { label: t("template") }, h("textarea", { className: "uspp-cttf-ta", style: { minHeight: "80px" }, readOnly: true, value: b3.text })),
          b3.type === "template" && h("div", { className: "uspp-cttf-muted2" }, `${t("colAutoSubmit")}: ${b3.autoSubmit ? t("yes") : t("no")}`),
          h("div", { className: "uspp-cttf-warn2" }, t("irreversible"))
        )
      });
      if (!ok) return;
      save((d3) => {
        delete d3.folders[folder].buttons[name];
      });
    }
    function Panel({ close }) {
      useLive();
      const [, setTick] = useState(0);
      const rerender = () => setTick((x4) => x4 + 1);
      const [collapsed, setCollapsed] = useState(sideCollapsed || innerWidth < 640);
      const [drop, setDrop] = useState(null);
      const c3 = config.data;
      if (!selected || !c3.folders[selected]) selected = c3.folderOrder[0] || null;
      const s3 = stats(c3);
      const folder = selected ? c3.folders[selected] : null;
      const headerItems = U4.getSlotItems("managerHeader");
      const folderRow = (name) => {
        const f3 = c3.folders[name];
        const n2 = Object.keys(f3.buttons).length;
        return h(
          "div",
          {
            key: name,
            className: "uspp-cttf-tbl-row",
            "data-selected": String(name === selected),
            "data-drop": String(drop === name),
            draggable: true,
            style: { cursor: "pointer" },
            onClick: () => {
              selected = name;
              rerender();
            },
            onDragStart: (e3) => {
              e3.dataTransfer.setData(DRAG_FOLDER, name);
              e3.dataTransfer.effectAllowed = "move";
            },
            onDragOver: (e3) => {
              e3.preventDefault();
              if (drop !== name) setDrop(name);
            },
            onDragLeave: () => setDrop((d3) => d3 === name ? null : d3),
            onDrop: (e3) => {
              e3.preventDefault();
              setDrop(null);
              const dragged = e3.dataTransfer.getData(DRAG_FOLDER);
              if (dragged) {
                if (dragged === name) return;
                save((d3) => {
                  const o3 = d3.folderOrder.filter((x4) => x4 !== dragged);
                  o3.splice(d3.folderOrder.indexOf(name), 0, dragged);
                  d3.folderOrder = o3;
                });
                return;
              }
              try {
                const j4 = JSON.parse(e3.dataTransfer.getData("application/json") || "null");
                if (j4?.buttonName) moveButton(j4.buttonName, j4.sourceFolder, name);
              } catch {
              }
            }
          },
          h("div", { style: { display: "flex", alignItems: "center", gap: "6px", minWidth: 0 } }, h(Chip, { name, folder: f3, withIcon: c3.showFolderIcons, title: t("folderButtonCount", { name, n: n2 }) })),
          h("label", { className: "uspp-cttf-center", onClick: (e3) => e3.stopPropagation() }, h("input", { type: "checkbox", checked: !f3.hidden, onChange: (e3) => save((d3) => {
            d3.folders[name].hidden = !e3.target.checked;
          }) })),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colEdit"), onClick: (e3) => {
            e3.stopPropagation();
            editFolder(name);
          } }, "✏️"),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colDelete"), onClick: (e3) => {
            e3.stopPropagation();
            deleteFolder(name);
          } }, "🗑️")
        );
      };
      const buttonRow = ([name, b3], idx) => {
        const vars = b3.type === "tool" ? "—" : ((v3) => v3.length ? joinList(v3) : t("none"))(templateVars(b3.text));
        return h(
          "div",
          {
            key: name,
            className: "uspp-cttf-tbl-row",
            draggable: true,
            "data-drop": String(drop === `b:${name}`),
            onDragStart: (e3) => {
              e3.dataTransfer.setData("application/json", JSON.stringify({ buttonName: name, sourceFolder: selected }));
              e3.dataTransfer.effectAllowed = "move";
            },
            onDragOver: (e3) => {
              e3.preventDefault();
              if (drop !== `b:${name}`) setDrop(`b:${name}`);
            },
            onDragLeave: () => setDrop((d3) => d3 === `b:${name}` ? null : d3),
            onDrop: (e3) => {
              e3.preventDefault();
              setDrop(null);
              let j4 = null;
              try {
                j4 = JSON.parse(e3.dataTransfer.getData("application/json") || "null");
              } catch {
              }
              if (!j4?.buttonName || j4.buttonName === name) return;
              if (j4.sourceFolder === selected) save((d3) => {
                d3.folders[selected].buttons = moveKey(d3.folders[selected].buttons, j4.buttonName, idx);
              });
              else moveButton(j4.buttonName, j4.sourceFolder, selected);
            }
          },
          h("div", { style: { minWidth: 0 } }, h(Chip, { name, btn: b3, title: b3.text })),
          h("div", { className: "uspp-cttf-vars", title: vars }, vars),
          h("div", { className: "uspp-cttf-center" }, b3.type === "tool" ? "—" : h("input", { type: "checkbox", checked: !!b3.autoSubmit, onChange: (e3) => save((d3) => {
            d3.folders[selected].buttons[name].autoSubmit = e3.target.checked;
          }) })),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colEdit"), onClick: () => editButton(selected, name) }, "✏️"),
          h("button", { type: "button", className: "uspp-cttf-icon-b", title: t("colDelete"), onClick: () => deleteButton(selected, name) }, "🗑️")
        );
      };
      return h(
        Fragment,
        null,
        h(
          DialogHeader,
          { title: t("panelTitle"), close },
          h("button", { type: "button", className: "uspp-cttf-b uspp-cttf-b-icon uspp-cttf-side-toggle", title: t("toggleSidebar"), "aria-label": t("toggleSidebar"), "aria-expanded": String(!collapsed), onClick: () => {
            sideCollapsed = !collapsed;
            setCollapsed(!collapsed);
          } }, h(PanelIcon, { open: !collapsed })),
          h(Badge, { kind: "folders", title: t("folderCount", { n: s3.folders }) }, String(s3.folders)),
          h(Badge, { kind: "buttons", title: t("buttonCount", { n: s3.buttons }) }, String(s3.buttons)),
          h("span", { style: { flex: 1 } }),
          headerItems.map((it) => h(Btn, { key: it.id, kind: "plain", onClick: () => it.onClick?.() }, typeof it.label === "function" ? it.label() : it.label))
        ),
        h(
          "div",
          { className: "uspp-cttf-mgr", style: { height: "min(70vh, 640px)" } },
          h(
            "div",
            { className: "uspp-cttf-mgr-side", "data-collapsed": String(collapsed) },
            h("div", { className: "uspp-cttf-tbl-head" }, h("span", null, t("colFolderName")), h("span", { className: "uspp-cttf-center" }, t("colShow")), h("span", null, t("colEdit")), h("span", null, t("colDelete"))),
            h("div", { className: "uspp-cttf-tbl-scroll" }, c3.folderOrder.filter((n2) => c3.folders[n2]).map(folderRow)),
            h("div", { className: "uspp-cttf-mgr-foot" }, h(Btn, { kind: "primary", onClick: () => editFolder(null) }, t("newFolder")))
          ),
          h(
            "div",
            { className: "uspp-cttf-mgr-main" },
            folder ? h(
              Fragment,
              null,
              h(
                "div",
                { className: "uspp-cttf-mgr-foot", style: { borderTop: "none", borderBottom: "1px solid var(--uspp-cttf-border-l1)" } },
                h(Chip, { name: selected, folder, withIcon: c3.showFolderIcons }),
                h(Badge, { kind: "folder", title: t("folderButtonCount", { name: selected, n: Object.keys(folder.buttons).length }) }, String(Object.keys(folder.buttons).length)),
                h("span", { style: { flex: 1 } }),
                h(Btn, { kind: "primary", onClick: () => editButton(selected, null) }, t("newButton"))
              ),
              h("div", { className: "uspp-cttf-tbl-head" }, h("span", null, t("colPreview")), h("span", null, t("colVars")), h("span", { className: "uspp-cttf-center" }, t("colAutoSubmit")), h("span", null, t("colEdit")), h("span", null, t("colDelete"))),
              h("div", { className: "uspp-cttf-tbl-scroll" }, Object.entries(folder.buttons).map(buttonRow))
            ) : h("div", { className: "uspp-cttf-pop-empty", style: { padding: "24px" } }, t("noFolderSelected"))
          )
        )
      );
    }
    const openManager = () => openDialog(Panel, {}, { key: "manager", width: 920 });
    return U4.definePlugin({
      name: "PromptManager",
      description: "Settings panel: add, edit, delete, hide and reorder folders and buttons.",
      authors: ["0-V-linuxdo"],
      required: true,
      startAt: U4.StartAt.Init,
      // 插件入口:框架设置面板的 Plugins 页(启用 / 停用、插件设置)
      slots: { managerHeader: { label: () => t("pluginsEntry"), order: 40, onClick: () => U4.openSettings({ tab: "plugins" }) } },
      start() {
        entry.openManager = openManager;
      },
      stop() {
        entry.openManager = null;
      }
    });
  };

  // sites/chat/plugins/PromptToolbar/index.js
  var svg = (...children) => h("svg", { width: "1.15em", height: "1.15em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, ...children);
  var GearIcon = () => svg(h("path", { d: "M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.8l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.8v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z" }), h("circle", { cx: 12, cy: 12, r: 3 }));
  var EraseIcon = () => svg(h("path", { d: "M10 5a2 2 0 0 0-1.34.52l-6.33 5.74a1 1 0 0 0 0 1.48l6.33 5.74A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" }), h("path", { d: "m12 9 6 6" }), h("path", { d: "m18 9-6 6" }));
  var PromptToolbar_default = (U4) => {
    const site = () => U4.sites.chat?.common;
    function Popover({ folderName, anchor, onClose }) {
      const ref = useRef(null);
      const [pos, setPos] = useState(null);
      const folder = config.data.folders[folderName];
      useEffect(() => {
        const a3 = anchor.getBoundingClientRect();
        const bar = site()?.barState?.() || { height: 40, bottom: -6 };
        const bottom = Math.max(0, bar.bottom + bar.height + 6);
        setPos({ left: Math.round(a3.left + scrollX - 20), bottom });
      }, [folderName, anchor]);
      useEffect(() => {
        const onDown = (e3) => {
          const p3 = e3.composedPath?.() || [];
          if (p3.includes(ref.current) || p3.includes(anchor)) return;
          onClose();
        };
        document.addEventListener("pointerdown", onDown, true);
        return () => document.removeEventListener("pointerdown", onDown, true);
      }, [anchor]);
      if (!folder) return null;
      const entries = Object.entries(folder.buttons);
      return h("div", {
        ref,
        className: "uspp-cttf-pop",
        "data-uspp-cttf": "popover",
        role: "menu",
        style: pos ? { left: pos.left + "px", bottom: pos.bottom + "px" } : { display: "none" }
      }, entries.length ? entries.map(([name, btn]) => h(Chip, {
        key: name,
        name,
        btn,
        title: btn.type === "template" ? btn.text : void 0,
        draggable: btn.type === "template",
        onDragStart: (e3) => {
          try {
            e3.dataTransfer.setData("application/json", JSON.stringify({ buttonName: name, sourceFolder: folderName }));
            e3.dataTransfer.effectAllowed = "move";
          } catch {
          }
        },
        onClick: () => {
          onClose();
          runButton(btn);
        },
        dataAttrs: { "data-uspp-cttf-button": name }
      })) : h("div", { className: "uspp-cttf-pop-empty" }, t("emptyFolder")));
    }
    function Toolbar() {
      useLive();
      const [open, setOpen] = useState(null);
      const c3 = config.data;
      if (open && (!c3.folders[open.name] || c3.folders[open.name].hidden)) setTimeout(() => setOpen(null), 0);
      const names = c3.folderOrder.filter((n2) => c3.folders[n2] && !c3.folders[n2].hidden);
      return h(
        Fragment,
        null,
        names.map((name) => h(Chip, {
          key: name,
          name,
          folder: c3.folders[name],
          withIcon: true,
          extraClass: "uspp-cttf-folder-btn",
          dataAttrs: { "data-open": String(open?.name === name), "data-uspp-cttf-folder": name },
          onClick: (e3) => {
            const anchor = e3.currentTarget;
            setOpen((o3) => o3?.name === name ? null : { name, anchor });
          }
        })),
        h("button", { type: "button", className: "uspp-cttf-bar-tool", title: t("settings"), "aria-label": t("settings"), "data-uspp-cttf-action": "settings", onMouseDown: (e3) => e3.preventDefault(), onClick: () => {
          setOpen(null);
          entry.openManager?.();
        } }, h(GearIcon)),
        h("button", { type: "button", className: "uspp-cttf-bar-tool", title: t("clearInput"), "aria-label": t("clearInput"), "data-uspp-cttf-action": "clear", onMouseDown: (e3) => e3.preventDefault(), onClick: () => {
          setOpen(null);
          clearAndFocus();
        } }, h(EraseIcon)),
        open && h(Popover, { key: open.name, folderName: open.name, anchor: open.anchor, onClose: () => setOpen(null) })
      );
    }
    return U4.definePlugin({
      name: "PromptToolbar",
      description: "Bottom toolbar with prompt template folders, tool buttons, and the settings / clear buttons.",
      authors: ["0-V-linuxdo"],
      required: true,
      startAt: U4.StartAt.DOMContentLoaded,
      slots: {
        bar: { render: Toolbar, order: 0 },
        menuCommand: { get label() {
          return t("openSettings");
        }, order: 0, onSelect: () => entry.openManager?.() }
      }
    });
  };

  // sites/chat/lib/webdav.js
  var WebDavError = class extends Error {
    constructor(code, status2, message) {
      super(message);
      this.code = code;
      this.status = status2;
    }
  };
  var b64 = (s3) => btoa(String.fromCharCode(...new TextEncoder().encode(s3)));
  function joinUrl(base, path) {
    const b3 = String(base || "").trim().replace(/\/+$/, "");
    const p3 = String(path || "").trim().replace(/^\/+/, "").split("/").filter(Boolean).map((seg) => encodeURIComponent(decodeURIComponentSafe(seg))).join("/");
    return p3 ? `${b3}/${p3}` : `${b3}/`;
  }
  function decodeURIComponentSafe(s3) {
    try {
      return decodeURIComponent(s3);
    } catch {
      return s3;
    }
  }
  function request({ method, url, headers = {}, data, timeout = 3e4 }) {
    return new Promise((resolve2, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") return reject(new WebDavError("nogm", 0, "GM_xmlhttpRequest unavailable"));
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        timeout,
        // 不带网页的 Cookie;部分管理器不认这个字段,不影响
        anonymous: true,
        responseType: "text",
        onload: (r3) => resolve2({ status: r3.status, text: r3.responseText ?? "", headers: parseHeaders(r3.responseHeaders) }),
        onerror: () => reject(new WebDavError("network", 0, "network error")),
        ontimeout: () => reject(new WebDavError("timeout", 0, "timeout")),
        onabort: () => reject(new WebDavError("abort", 0, "aborted"))
      });
    });
  }
  function parseHeaders(raw2) {
    const out = {};
    for (const line of String(raw2 || "").split(/\r?\n/)) {
      const i3 = line.indexOf(":");
      if (i3 > 0) out[line.slice(0, i3).trim().toLowerCase()] = line.slice(i3 + 1).trim();
    }
    return out;
  }
  var fail = (status2, what) => {
    if (status2 === 401 || status2 === 403) return new WebDavError("auth", status2, `${what}: ${status2} unauthorized`);
    if (status2 === 404 || status2 === 409) return new WebDavError("notfound", status2, `${what}: ${status2} not found`);
    if (status2 === 507) return new WebDavError("full", status2, `${what}: insufficient storage`);
    if (status2 >= 500) return new WebDavError("server", status2, `${what}: server error ${status2}`);
    return new WebDavError("http", status2, `${what}: HTTP ${status2}`);
  };
  function createClient(cfg2) {
    const auth = cfg2.username || cfg2.password ? { Authorization: `Basic ${b64(`${cfg2.username || ""}:${cfg2.password || ""}`)}` } : {};
    const fileUrl = joinUrl(cfg2.url, cfg2.path);
    const dirUrl = fileUrl.replace(/[^/]+$/, "");
    async function propfind(url, depth = "0") {
      const r3 = await request({ method: "PROPFIND", url, headers: { ...auth, Depth: depth, "Content-Type": "application/xml; charset=utf-8" }, data: `<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:getetag/><d:getlastmodified/><d:resourcetype/></d:prop></d:propfind>` });
      return r3;
    }
    async function ensureDir() {
      const base = String(cfg2.url || "").trim().replace(/\/+$/, "") + "/";
      const rest = dirUrl.slice(base.length).split("/").filter(Boolean);
      let cur = base;
      for (const seg of rest) {
        cur += seg + "/";
        const r3 = await request({ method: "MKCOL", url: cur, headers: auth });
        if (![200, 201, 204, 301, 405].includes(r3.status)) throw fail(r3.status, "MKCOL");
      }
    }
    return {
      fileUrl,
      /** 测试连接:能列出目录(或目录不存在但认证通过) */
      async test() {
        const r3 = await propfind(String(cfg2.url || "").trim().replace(/\/?$/, "/"));
        if (r3.status === 207 || r3.status === 200) return { ok: true };
        throw fail(r3.status, "PROPFIND");
      },
      /** 读文件:不存在时返回 null */
      async get() {
        const r3 = await request({ method: "GET", url: fileUrl, headers: { ...auth, "Cache-Control": "no-cache" } });
        if (r3.status === 404) return null;
        if (r3.status < 200 || r3.status >= 300) throw fail(r3.status, "GET");
        return { text: r3.text, etag: r3.headers.etag || "", modified: r3.headers["last-modified"] || "" };
      },
      /** 写文件:目录不存在时自动建好再写一次 */
      /** 写文件:ifMatch 时带 If-Match,412 视为冲突;目录不存在时自动建好再写一次 */
      async put(text, { ifMatch } = {}) {
        const headers = { ...auth, "Content-Type": "application/json; charset=utf-8" };
        if (ifMatch) headers["If-Match"] = ifMatch;
        const put = () => request({ method: "PUT", url: fileUrl, headers, data: text });
        let r3 = await put();
        if (r3.status === 404 || r3.status === 409) {
          await ensureDir();
          r3 = await put();
        }
        if (r3.status === 412) throw new WebDavError("conflict", 412, "PUT: precondition failed");
        if (r3.status < 200 || r3.status >= 300) throw fail(r3.status, "PUT");
        return { etag: r3.headers.etag || "", modified: r3.headers["last-modified"] || "" };
      }
    };
  }

  // sites/chat/plugins/WebDAVSync/index.js
  var CRED_KEYS = ["serverUrl", "username", "password", "remotePath"];
  var RUNTIME_KEY = "cttf.webdav.runtime";
  var TAB_ID = Math.random().toString(36).slice(2);
  var status = { kind: "info", text: "" };
  var statusListeners = /* @__PURE__ */ new Set();
  var setStatus = (kind, text) => {
    status = { kind, text };
    for (const fn2 of [...statusListeners]) fn2();
  };
  var device = () => `${navigator.userAgentData?.brands?.find((b3) => !/Not.?A.?Brand|Chromium/i.test(b3.brand))?.brand || navigator.userAgent.match(/(Firefox|Safari|Chrome)\/[\d.]+/)?.[1] || "Browser"} @ ${location.hostname}`;
  function messageFor(e3) {
    if (!(e3 instanceof WebDavError)) return t("errServer", { s: e3?.message || "?" });
    if (e3.code === "nogm") return t("noGM");
    if (e3.code === "auth") return t("errAuth");
    if (e3.code === "invalid") return t("errInvalidRemote");
    return t("errServer", { s: e3.status || e3.code });
  }
  function check() {
    const s3 = webdav.get();
    if (!s3.enabled) return t("syncNotEnabled");
    if (!s3.serverUrl.trim() || !s3.username.trim() || !s3.password || !s3.remotePath.trim()) return t("syncIncomplete");
    return null;
  }
  var client = () => createClient({ url: webdav.get().serverUrl, username: webdav.get().username, password: webdav.get().password, path: webdav.get().remotePath });
  function parseRemote(text) {
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      throw new WebDavError("invalid", 0, "invalid JSON");
    }
    if (!isValidConfig(obj)) throw new WebDavError("invalid", 0, "invalid config");
    return normalizeConfig(obj, lang());
  }
  var serialize = (cfg2) => JSON.stringify({ ...cfg2, _sync: { app: "chat-template-text-folders", schema: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), device: device() } }, null, 2);
  function markSynced(cfg2, remote) {
    webdav.set({ lastSyncedAt: Date.now(), lastRemoteETag: remote?.etag || "", lastRemoteModified: remote?.modified || "", lastSyncedHash: hashConfig(cfg2) });
  }
  var inFlight = null;
  var single = (fn2) => {
    if (inFlight) return inFlight;
    inFlight = (async () => {
      try {
        return await fn2();
      } finally {
        inFlight = null;
      }
    })();
    return inFlight;
  };
  async function putLocal(c3, remoteEtag) {
    const local = config.data;
    const r3 = await c3.put(serialize(local), { ifMatch: remoteEtag || void 0 });
    let meta = r3;
    if (!r3.etag) {
      try {
        const g4 = await c3.get();
        meta = g4 ? { etag: g4.etag, modified: g4.modified } : r3;
      } catch {
      }
    }
    markSynced(local, meta);
  }
  function applyRemote(remoteCfg, remote) {
    config.set(remoteCfg, { source: "remote" });
    markSynced(remoteCfg, remote);
  }
  function conflictBox(op, remoteCfg, remote) {
    function Body() {
      const [show, setShow] = useState(false);
      return h(
        Fragment,
        null,
        h("div", null, t("conflictMsg")),
        h("div", { className: "uspp-cttf-muted2" }, op === "upload" ? t("opUpload") : t("opPull")),
        h(StatsCols, { left: config.data, right: remoteCfg, leftLabel: t("currentConfig"), rightLabel: t("remoteConfig"), extra: remote.modified ? t("remoteModified", { t: new Date(remote.modified).toLocaleString() }) : null }),
        h(Btn, { onClick: () => setShow(!show) }, show ? t("hideDiff") : t("viewDiff")),
        show && h(DiffSummary, { cur: config.data, next: remoteCfg })
      );
    }
    const release = editingGuard.enter();
    return chooseBox({
      title: t("conflictTitle"),
      width: 560,
      body: () => h(Body),
      choices: [
        { label: t("cancel"), value: null, kind: "cancel" },
        { label: t("useRemote"), value: "remote", kind: "plain" },
        { label: t("keepLocal"), value: "local", kind: "primary" }
      ]
    }).finally(release);
  }
  async function resolveConflict(op, c3, remoteCfg, remote) {
    const pick = await conflictBox(op, remoteCfg, remote);
    if (pick === "local") {
      await putLocal(c3, remote.etag);
      return { kind: "ok", text: t("uploaded") };
    }
    if (pick === "remote") {
      applyRemote(remoteCfg, remote);
      return { kind: "ok", text: t("pulled") };
    }
    return { kind: "info", text: t("cancelled") };
  }
  function upload({ auto = false } = {}) {
    return single(async () => {
      const bad = check();
      if (bad) return { kind: "error", text: bad };
      const c3 = client();
      try {
        if (!auto) setStatus("info", t("checking"));
        const remote = await c3.get();
        if (!remote) {
          await putLocal(c3);
          return { kind: "ok", text: t("uploaded") };
        }
        const remoteCfg = parseRemote(remote.text);
        const local = config.data;
        if (sameConfig(remoteCfg, local)) {
          markSynced(local, remote);
          return { kind: "ok", text: t("sameNoUpdate") };
        }
        const s3 = webdav.get();
        const remoteUnchanged = s3.lastRemoteETag && remote.etag && remote.etag === s3.lastRemoteETag || s3.lastSyncedHash && hashConfig(remoteCfg) === s3.lastSyncedHash;
        if (remoteUnchanged) {
          try {
            await putLocal(c3, remote.etag);
            return { kind: "ok", text: t("uploaded") };
          } catch (e3) {
            if (e3.code !== "conflict") throw e3;
          }
        }
        if (auto) return { kind: "info", text: t("autoConflict"), conflict: { op: "upload", remoteCfg, remote } };
        return await resolveConflict("upload", c3, remoteCfg, remote);
      } catch (e3) {
        return { kind: "error", text: messageFor(e3) };
      }
    });
  }
  function pull({ auto = false } = {}) {
    return single(async () => {
      const bad = check();
      if (bad) return { kind: "error", text: bad };
      const c3 = client();
      try {
        if (!auto) setStatus("info", t("checking"));
        const remote = await c3.get();
        if (!remote) {
          if (auto) {
            await putLocal(c3);
            return { kind: "ok", text: t("uploaded") };
          }
          return { kind: "info", text: t("noRemote") };
        }
        const remoteCfg = parseRemote(remote.text);
        const local = config.data;
        if (sameConfig(remoteCfg, local)) {
          markSynced(local, remote);
          return { kind: "ok", text: t("sameNoUpdate") };
        }
        const s3 = webdav.get();
        const localUnchanged = !!s3.lastSyncedHash && hashConfig(local) === s3.lastSyncedHash;
        if (localUnchanged) {
          if (auto && editingGuard.active) return { kind: "info", text: "", deferred: true };
          applyRemote(remoteCfg, remote);
          return { kind: "ok", text: auto ? t("autoPulled") : t("pulled") };
        }
        if (auto) return { kind: "info", text: t("autoConflict"), conflict: { op: "pull", remoteCfg, remote } };
        return await resolveConflict("pull", c3, remoteCfg, remote);
      } catch (e3) {
        return { kind: "error", text: messageFor(e3) };
      }
    });
  }
  async function testConnection(draft) {
    const s3 = draft ? { ...webdav.get(), ...draft } : webdav.get();
    if (!s3.serverUrl.trim()) return { kind: "error", text: t("syncIncomplete") };
    setStatus("info", t("testing"));
    try {
      await createClient({ url: s3.serverUrl, username: s3.username, password: s3.password, path: s3.remotePath }).test();
      return { kind: "ok", text: t("testOk") };
    } catch (e3) {
      return { kind: "error", text: messageFor(e3) };
    }
  }
  function SyncTab() {
    useLive();
    const [, force] = useState(0);
    useEffect(() => {
      const f3 = () => force((x4) => x4 + 1);
      statusListeners.add(f3);
      const off2 = webdav.subscribe(f3);
      return () => {
        statusListeners.delete(f3);
        off2();
      };
    }, []);
    const saved = webdav.get();
    const [draft, setDraft] = useState(() => ({ ...saved }));
    const [showPw, setShowPw] = useState(false);
    const dirty2 = ["enabled", "autoSync", ...CRED_KEYS].some((k4) => draft[k4] !== saved[k4]);
    const set = (k4, v3) => setDraft((d3) => ({ ...d3, [k4]: v3 }));
    const doSave = () => {
      const credChanged = CRED_KEYS.some((k4) => draft[k4] !== saved[k4]);
      const patch = { enabled: !!draft.enabled, autoSync: !!draft.autoSync, serverUrl: draft.serverUrl.trim(), username: draft.username.trim(), password: draft.password, remotePath: draft.remotePath.trim() || "ChatTemplateTextFolders/config.json" };
      if (credChanged) Object.assign(patch, { lastRemoteETag: "", lastSyncedHash: "", lastRemoteModified: "" });
      webdav.set(patch);
      setDraft((d3) => ({ ...d3, ...patch }));
      setStatus("ok", t("saved"));
      return true;
    };
    useEffect(() => {
      const guard = async () => {
        if (!dirtyRef.dirty) return true;
        const pick = await chooseBox({ title: t("unsavedTitle"), body: "", choices: [
          { label: t("keepEditing"), value: "keep", kind: "plain" },
          { label: t("discardAndClose"), value: "discard", kind: "danger" },
          { label: t("saveAndClose"), value: "save", kind: "primary" }
        ], width: 420 });
        if (pick === "save") {
          dirtyRef.save();
          return true;
        }
        return pick === "discard";
      };
      entry.closeGuards.add(guard);
      return () => entry.closeGuards.delete(guard);
    }, []);
    dirtyRef.dirty = dirty2;
    dirtyRef.save = doSave;
    const run = async (fn2) => {
      const r3 = await fn2();
      if (r3?.text) setStatus(r3.kind, r3.text);
    };
    const off = !draft.enabled;
    const insecure = /^http:\/\//i.test(draft.serverUrl.trim());
    return h(
      Fragment,
      null,
      h("label", { className: "uspp-cttf-check" }, h("input", { type: "checkbox", checked: !!draft.enabled, onChange: (e3) => set("enabled", e3.target.checked) }), h("b", null, t("webdavEnable"))),
      !off && h(
        Fragment,
        null,
        h(Field, { label: t("serverUrl"), error: insecure ? t("httpWarn") : null }, h("input", { className: "uspp-cttf-in", value: draft.serverUrl, placeholder: "https://dav.jianguoyun.com/dav/", spellCheck: false, onInput: (e3) => set("serverUrl", e3.target.value) })),
        h(
          "div",
          { className: "uspp-cttf-grid2" },
          h(Field, { label: t("username") }, h("input", { className: "uspp-cttf-in", value: draft.username, autoComplete: "off", spellCheck: false, onInput: (e3) => set("username", e3.target.value) })),
          h(Field, { label: t("password") }, h(
            "div",
            { className: "uspp-cttf-color-row" },
            h("input", { className: "uspp-cttf-in", type: showPw ? "text" : "password", value: draft.password, autoComplete: "new-password", spellCheck: false, onInput: (e3) => set("password", e3.target.value) }),
            h("button", { type: "button", className: "uspp-cttf-icon-b", title: showPw ? t("hidePassword") : t("showPassword"), onClick: () => setShowPw(!showPw) }, showPw ? "🙈" : "👁")
          ))
        ),
        h(Field, { label: t("remotePath") }, h("input", { className: "uspp-cttf-in", value: draft.remotePath, placeholder: "ChatTemplateTextFolders/config.json", spellCheck: false, onInput: (e3) => set("remotePath", e3.target.value) })),
        h("label", { className: "uspp-cttf-check" }, h("input", { type: "checkbox", checked: !!draft.autoSync, onChange: (e3) => set("autoSync", e3.target.checked) }), t("autoSync"))
      ),
      h(
        "div",
        { className: "uspp-cttf-row2" },
        h(Btn, { kind: dirty2 ? "primary" : "plain", disabled: !dirty2, onClick: doSave }, t("saveSettings")),
        !off && h(
          Fragment,
          null,
          h(Btn, { disabled: !!inFlight, onClick: () => run(() => testConnection({ serverUrl: draft.serverUrl.trim(), username: draft.username.trim(), password: draft.password, remotePath: draft.remotePath.trim() || "ChatTemplateTextFolders/config.json" })) }, t("testConn")),
          h(Btn, { disabled: !!inFlight || dirty2, title: dirty2 ? t("saveFirst") : void 0, onClick: () => run(() => upload()) }, t("upload")),
          h(Btn, { disabled: !!inFlight || dirty2, title: dirty2 ? t("saveFirst") : void 0, onClick: () => run(() => pull()) }, t("pull"))
        )
      ),
      !off && dirty2 && h("div", { className: "uspp-cttf-muted2" }, t("saveFirst")),
      status.text && h("div", { className: "uspp-cttf-status", "data-kind": status.kind }, status.text),
      h("div", { className: "uspp-cttf-muted2" }, t("lastSync", { t: saved.lastSyncedAt ? new Date(saved.lastSyncedAt).toLocaleString() : t("never") }))
    );
  }
  var dirtyRef = { dirty: false, save: () => {
  } };
  function runtime() {
    return gmGet(RUNTIME_KEY, {}) || {};
  }
  function takeLock(ms = 3e4) {
    const r3 = runtime();
    const now2 = Date.now();
    if (r3.lock && r3.lock.owner !== TAB_ID && r3.lock.until > now2) return false;
    gmSet(RUNTIME_KEY, { ...r3, lock: { owner: TAB_ID, until: now2 + ms } });
    return runtime().lock?.owner === TAB_ID;
  }
  function releaseLock() {
    const r3 = runtime();
    if (r3.lock?.owner === TAB_ID) gmSet(RUNTIME_KEY, { ...r3, lock: null });
  }
  var pendingConflict = null;
  function showConflictNotice(U4, conflict) {
    pendingConflict = conflict;
    U4.showNotice({
      message: t("autoConflict"),
      type: "WARNING",
      action: { label: t("handle"), onClick: async () => {
        const cf = pendingConflict;
        pendingConflict = null;
        if (!cf) return;
        const r3 = await resolveConflict(cf.op, client(), cf.remoteCfg, cf.remote).catch((e3) => ({ kind: "error", text: messageFor(e3) }));
        if (r3.text) toast(r3.text, r3.kind === "error" ? "ERROR" : r3.kind === "ok" ? "SUCCESS" : "INFO");
      } }
    });
  }
  var WebDAVSync_default = (U4) => {
    let timer2 = 0;
    let offConfig = null;
    let lastUploadedHash = "";
    function report(r3) {
      if (!r3) return;
      if (r3.conflict) return showConflictNotice(U4, r3.conflict);
      if (r3.kind === "error") toast(t("syncFailed", { msg: r3.text }), "ERROR");
      else if (r3.text === t("autoPulled")) toast(r3.text, "SUCCESS");
    }
    async function autoUpload() {
      const s3 = webdav.get();
      if (!s3.enabled || !s3.autoSync || check()) return;
      const h0 = hashConfig(config.data);
      if (h0 === lastUploadedHash || h0 === s3.lastSyncedHash) return;
      if (!takeLock()) return;
      try {
        const r3 = await upload({ auto: true });
        if (r3.kind === "ok") lastUploadedHash = h0;
        report(r3);
      } finally {
        releaseLock();
      }
    }
    async function startupCheck() {
      const s3 = webdav.get();
      if (!s3.enabled || !s3.autoSync || check()) return;
      const r0 = runtime();
      if (r0.startupCheckAt && Date.now() - r0.startupCheckAt < 10 * 60 * 1e3) return;
      gmSet(RUNTIME_KEY, { ...r0, startupCheckAt: Date.now() });
      let r3 = await pull({ auto: true });
      for (let i3 = 0; r3?.deferred && i3 < 150; i3++) {
        await new Promise((res) => setTimeout(res, 2e3));
        if (!editingGuard.active) r3 = await pull({ auto: true });
      }
      report(r3);
    }
    return U4.definePlugin({
      name: "WebDAVSync",
      description: "Sync the template config through WebDAV: test, upload, pull, conflict resolution, optional auto sync.",
      authors: ["0-V-linuxdo"],
      required: true,
      startAt: U4.StartAt.SiteReady,
      slots: { configTabs: { label: () => t("tabSync"), order: 10, render: SyncTab } },
      start() {
        webdav.watch();
        offConfig = config.subscribe((_doc, source) => {
          if (source !== "local" && source !== "import") return;
          clearTimeout(timer2);
          timer2 = setTimeout(autoUpload, 1e4);
        });
        settled.then(() => setTimeout(() => {
          startupCheck().catch(() => {
          });
        }, 1500));
      },
      stop() {
        clearTimeout(timer2);
        offConfig?.();
      }
    });
  };

  // uspp:sites
  var sites_default = [{ id: "chat", site: chat_default, plugins: [((U4) => {
    const d3 = typeof AutoSubmit_default === "function" ? AutoSubmit_default(U4) : AutoSubmit_default;
    d3.site = "chat";
    return d3;
  }), ((U4) => {
    const d3 = typeof ConfigTransfer_default === "function" ? ConfigTransfer_default(U4) : ConfigTransfer_default;
    d3.site = "chat";
    return d3;
  }), ((U4) => {
    const d3 = typeof PromptManager_default === "function" ? PromptManager_default(U4) : PromptManager_default;
    d3.site = "chat";
    return d3;
  }), ((U4) => {
    const d3 = typeof PromptToolbar_default === "function" ? PromptToolbar_default(U4) : PromptToolbar_default;
    d3.site = "chat";
    return d3;
  }), ((U4) => {
    const d3 = typeof WebDAVSync_default === "function" ? WebDAVSync_default(U4) : WebDAVSync_default;
    d3.site = "chat";
    return d3;
  })] }];

  // uspp:plugins
  var plugins_default = [];

  // ../Userscriptpp/core/lib/logger.js
  var COLORS = { log: "#a78bfa", info: "#38bdf8", warn: "#f59e0b", error: "#ef4444", debug: "#9ca3af" };
  var Logger = class {
    constructor(name, color = "#a78bfa") {
      this.name = name;
      this.color = color;
    }
    _out(level, args) {
      if (level === "debug" && !IS_DEV) return;
      const fn2 = console[level] || console.log;
      fn2.call(
        console,
        `%c ${SCRIPT_NAME} %c %c ${this.name} `,
        `background:${COLORS[level]};color:#000;border-radius:4px 0 0 4px;font-weight:bold`,
        "",
        `background:${this.color};color:#000;border-radius:0 4px 4px 0`,
        ...args
      );
    }
    log(...a3) {
      this._out("log", a3);
    }
    info(...a3) {
      this._out("info", a3);
    }
    warn(...a3) {
      this._out("warn", a3);
    }
    error(...a3) {
      this._out("error", a3);
    }
    debug(...a3) {
      this._out("debug", a3);
    }
  };

  // ../Userscriptpp/core/lib/diag.js
  var DIAG_KEY = `UserscriptPP:${SCRIPT_ID}:diag`;
  var cfg = {};
  if (IS_DEV) {
    try {
      cfg = JSON.parse(W.localStorage.getItem(DIAG_KEY) || "{}") || {};
    } catch {
      cfg = {};
    }
  }
  var diag = Object.freeze({ ...cfg, disablePlugins: Array.isArray(cfg.disablePlugins) ? cfg.disablePlugins.slice() : [] });
  var diagOn = Object.keys(cfg).length > 0;
  var events = [];
  var counters = /* @__PURE__ */ Object.create(null);
  var now = () => Math.round(typeof performance !== "undefined" ? performance.now() : Date.now());
  function trace(kind, data) {
    if (!diag.log) return;
    if (events.length < 2e4) events.push(data === void 0 ? [now(), kind] : [now(), kind, data]);
  }
  function count(kind) {
    if (!diag.log) return;
    counters[kind] = (counters[kind] || 0) + 1;
  }
  function loadedScripts() {
    try {
      return [...new Set(performance.getEntriesByType("resource").filter((e3) => e3.initiatorType === "script" || /\.js(\?|$)/.test(e3.name)).map((e3) => {
        try {
          return new URL(e3.name).pathname;
        } catch {
          return e3.name;
        }
      }))].sort();
    } catch {
      return [];
    }
  }
  if (diag.log) {
    try {
      new PerformanceObserver((list) => {
        for (const e3 of list.getEntries()) if (e3.initiatorType === "script" || /\.js(\?|$)/.test(e3.name)) {
          let name = e3.name;
          try {
            name = new URL(e3.name).pathname;
          } catch {
          }
          trace("page.script", { name, start: Math.round(e3.startTime) });
        }
      }).observe({ type: "resource", buffered: true });
    } catch {
    }
  }
  var extra = () => ({});
  function setDiagExtra(fn2) {
    extra = fn2;
  }
  function diagReport() {
    return { script: SCRIPT_ID, config: cfg, at: now(), counters: { ...counters }, scripts: loadedScripts(), ...extra(), events: events.slice() };
  }

  // ../Userscriptpp/core/lib/utils.js
  var sleep3 = (ms) => new Promise((r3) => setTimeout(r3, ms));
  function debounce(fn2, ms = 100) {
    let t4;
    const d3 = function(...args) {
      clearTimeout(t4);
      t4 = setTimeout(() => fn2.apply(this, args), ms);
    };
    d3.flush = () => {
      clearTimeout(t4);
      fn2();
    };
    d3.cancel = () => clearTimeout(t4);
    return d3;
  }
  function onlyOnce(fn2) {
    let done2 = false, result;
    return function(...args) {
      if (done2) return result;
      done2 = true;
      return result = fn2.apply(this, args);
    };
  }
  var escapeRegExp = (s3) => String(s3).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function humanizeKey(key) {
    return String(key).replace(/[-_]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").trim().split(/\s+/).map((w4) => w4.charAt(0).toUpperCase() + w4.slice(1)).join(" ");
  }
  function classNameFactory(prefix2 = "") {
    return (...names) => names.flat(Infinity).filter(Boolean).map((n2) => prefix2 + n2).join(" ");
  }
  function classes(...names) {
    const out = [];
    for (const n2 of names.flat(Infinity)) {
      if (!n2) continue;
      if (typeof n2 === "object") {
        for (const k4 in n2) if (n2[k4]) out.push(k4);
      } else out.push(String(n2));
    }
    return out.join(" ");
  }
  async function copyToClipboard(text) {
    if (GM.clipboard) {
      try {
        const r3 = GM.clipboard(String(text), "text");
        if (r3 && typeof r3.then === "function") await r3;
        return true;
      } catch {
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
      }
      ta.remove();
      return ok;
    }
  }

  // ../Userscriptpp/core/lib/lazy.js
  function makeLazy(factory, attempts = 5) {
    let tries = 0, cache;
    return () => {
      if (cache == null && tries++ < attempts) cache = factory();
      return cache;
    };
  }
  function proxyLazy(factory, shouldRetry = () => true) {
    let resolved = false, value;
    const resolve2 = () => {
      if (!resolved && shouldRetry()) {
        value = factory();
        if (value != null) resolved = true;
      }
      return value;
    };
    const target2 = () => {
    };
    return new Proxy(target2, {
      get(_3, key) {
        if (key === "$$uspp_cttf_Resolve") return resolve2;
        const real = resolve2();
        if (real == null) return void 0;
        return Reflect.get(real, key);
      },
      set(_3, key, v3) {
        const real = resolve2();
        if (real == null) return false;
        return Reflect.set(real, key, v3);
      },
      has(_3, key) {
        const real = resolve2();
        return real != null && Reflect.has(real, key);
      },
      ownKeys() {
        const real = resolve2();
        const keys = real == null ? [] : Reflect.ownKeys(real).filter((k4) => k4 !== "length" && k4 !== "name");
        return [...keys, "length", "name"];
      },
      getOwnPropertyDescriptor(_3, key) {
        if (key === "length" || key === "name") return Reflect.getOwnPropertyDescriptor(target2, key);
        const real = resolve2();
        if (real == null) return void 0;
        const d3 = Reflect.getOwnPropertyDescriptor(real, key);
        if (d3) d3.configurable = true;
        return d3;
      },
      deleteProperty(_3, key) {
        const real = resolve2();
        return real != null && Reflect.deleteProperty(real, key);
      },
      apply(_3, thisArg, args) {
        const real = resolve2();
        if (typeof real !== "function") throw new Error("Userscript++: 懒加载的值尚未找到");
        return Reflect.apply(real, thisArg, args);
      },
      getPrototypeOf() {
        const real = resolve2();
        return real == null ? Function.prototype : Reflect.getPrototypeOf(real);
      }
    });
  }

  // ../Userscriptpp/core/lib/match.js
  var reCache = /* @__PURE__ */ new Map();
  var globToRe = (s3, any) => s3.split("*").map((x4) => x4.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(any);
  function compile(pattern) {
    const p3 = String(pattern || "").trim();
    if (!p3) return null;
    if (p3 === "*" || p3 === "<all_urls>" || p3 === "*://*/*") return /^/;
    const m3 = /^(\*|https?|file):\/\/([^/]*)(\/.*)?$/.exec(p3);
    if (!m3) {
      const h5 = p3.replace(/^\*\./, "");
      return new RegExp(`^https?://([^/]*\\.)?${globToRe(h5, "[^/]*")}(?::\\d+)?(/|$)`, "i");
    }
    const [, scheme, hostPat, path = "/*"] = m3;
    const sch = scheme === "*" ? "https?" : scheme;
    let hostRe;
    if (hostPat === "*") hostRe = "[^/]*";
    else if (hostPat.startsWith("*.")) hostRe = `([^/]*\\.)?${globToRe(hostPat.slice(2), "[^/]*")}`;
    else hostRe = globToRe(hostPat, "[^/]*");
    return new RegExp(`^${sch}://${hostRe}(?::\\d+)?${globToRe(path, ".*")}$`, "i");
  }
  function matchPattern(pattern, url = location.href) {
    let re = reCache.get(pattern);
    if (re === void 0) {
      re = compile(pattern);
      reCache.set(pattern, re);
    }
    return !!re && re.test(url);
  }
  function matchesUrl(patterns, url = location.href) {
    const list = Array.isArray(patterns) ? patterns : typeof patterns === "string" ? [patterns] : [];
    return list.some((p3) => matchPattern(p3, url));
  }
  function specificity(pattern) {
    const p3 = String(pattern || "");
    if (p3 === "*" || p3 === "<all_urls>") return 0;
    const m3 = /^[^:]+:\/\/([^/]*)(\/.*)?$/.exec(p3);
    const host2 = m3 ? m3[1] : p3;
    const path = m3 ? m3[2] || "" : "";
    return (host2.includes("*") ? 0 : 1e4) + host2.replace(/\*/g, "").length * 10 + path.replace(/\*/g, "").length;
  }

  // ../Userscriptpp/core/lib/sites.js
  var logger = new Logger("Sites", "#5eead4");
  var GENERIC2 = Object.freeze({ id: "generic", name: "Generic", matches: [], generic: true });
  var registry = /* @__PURE__ */ new Map();
  var current = null;
  var runtimeSwitchListeners = /* @__PURE__ */ new Set();
  var ID_RE = /^[a-z0-9-]+$/;
  function defineSite(def) {
    if (!def || typeof def !== "object") throw new Error("defineSite 需要一个对象");
    if (!ID_RE.test(def.id || "")) throw new Error(`站点 ID 只能是小写字母、数字和 -:${def.id}`);
    if (def.id === GENERIC2.id) throw new Error("generic 是保留的站点 ID");
    if (!def.name) throw new Error(`站点 ${def.id} 缺少 name`);
    if (!Array.isArray(def.matches) || !def.matches.length) throw new Error(`站点 ${def.id} 缺少 matches`);
    return def;
  }
  function addSite(def, { runtime: runtime3 = false } = {}) {
    defineSite(def);
    if (registry.has(def.id)) {
      logger.warn(`站点 ${def.id} 已注册,忽略`);
      return false;
    }
    if (runtime3 && def.driver) {
      logger.warn(`运行时注册的站点 ${def.id} 不能使用打包器驱动,已忽略 driver`);
      def = { ...def, driver: void 0 };
    }
    registry.set(def.id, def);
    return true;
  }
  var score = (def, url) => {
    if (!matchesUrl(def.matches, url)) return -1;
    if (def.excludeMatches && matchesUrl(def.excludeMatches, url)) return -1;
    return Math.max(...def.matches.filter((p3) => matchesUrl([p3], url)).map(specificity));
  };
  function pickSite(url = location.href, candidates2 = [...registry.values()]) {
    let best = null, bestScore = -1, tie = false;
    for (const def of candidates2) {
      const s3 = score(def, url);
      if (s3 < 0) continue;
      if (s3 > bestScore) {
        best = def;
        bestScore = s3;
        tie = false;
      } else if (s3 === bestScore) tie = true;
    }
    if (best && tie) logger.warn(`多个站点同样匹配当前网址,使用 ${best.id}`);
    return best;
  }
  function selectSite(url = location.href) {
    current = pickSite(url) || GENERIC2;
    return current;
  }
  var getSite = () => current || GENERIC2;
  var isGeneric = () => getSite() === GENERIC2;
  var isSite = (id) => getSite().id === id;
  var getSites = () => [...registry.values()];
  var getSiteById = (id) => registry.get(id) || (id === GENERIC2.id ? GENERIC2 : null);
  var siteKey = () => isGeneric() ? location.hostname || "local" : getSite().id;
  function switchTo(def) {
    if (!isGeneric() || current === def) return false;
    if (pickSite(location.href, [def]) !== def) return false;
    current = def;
    for (const fn2 of [...runtimeSwitchListeners]) {
      try {
        fn2(def);
      } catch (e3) {
        logger.error("站点切换监听者出错", e3);
      }
    }
    return true;
  }

  // ../Userscriptpp/core/lib/events.js
  var logger2 = new Logger("Events", "#fde68a");
  var handlers = /* @__PURE__ */ new Map();
  var Events = Object.freeze({
    PLUGIN_TOGGLE: "pluginToggle",
    PLUGIN_PIN: "pluginPin",
    PLUGIN_STAR: "pluginStar",
    RELOAD_NEEDED: "reloadNeeded",
    SETTINGS_SYNC: "settingsSync",
    SITE_READY: "siteReady",
    ROUTE_CHANGE: "routeChange"
  });
  var CORE = new Set(Object.values(Events));
  var siteEvents = /* @__PURE__ */ new Set();
  function setSiteEvents(list) {
    siteEvents = new Set(Array.isArray(list) ? list : []);
  }
  var isKnownEvent = (name) => CORE.has(name) || siteEvents.has(name);
  function subscribe(event, handler) {
    if (!isKnownEvent(event)) logger2.debug(`订阅了当前站点没有声明的事件 ${event}`);
    let set = handlers.get(event);
    if (!set) handlers.set(event, set = /* @__PURE__ */ new Set());
    set.add(handler);
    return () => set.delete(handler);
  }
  function dispatch(event, data) {
    const set = handlers.get(event);
    if (!set) return;
    for (const h5 of [...set]) {
      try {
        h5(data);
      } catch (e3) {
        logger2.error(`事件 ${event} 的处理函数出错`, e3);
      }
    }
  }

  // ../Userscriptpp/core/lib/settings.js
  var logger3 = new Logger("Settings", "#86efac");
  var STORAGE_KEY = "UserscriptPPSettings";
  var SITE_STORAGE_KEY = `UserscriptPP:${SCRIPT_ID}:settings`;
  var IDB_NAME = `UserscriptPP:${SCRIPT_ID}`;
  var IDB_STORE = "kv";
  var BIGINT_TAG = "$usppBigint";
  var PlainSettings = { plugins: {} };
  var defaultResolver = () => void 0;
  function setDefaultResolver(fn2) {
    defaultResolver = fn2;
  }
  var ready = false;
  var globalListeners = /* @__PURE__ */ new Set();
  var pathListeners = /* @__PURE__ */ new Map();
  var prefixListeners = /* @__PURE__ */ new Map();
  function addTo(map, key, fn2) {
    let s3 = map.get(key);
    if (!s3) map.set(key, s3 = /* @__PURE__ */ new Set());
    s3.add(fn2);
  }
  function callSafe(fn2, ...args) {
    try {
      fn2(...args);
    } catch (e3) {
      logger3.error("设置监听者出错", e3);
    }
  }
  var dirty = /* @__PURE__ */ new Set();
  function emitChange(path, value) {
    for (const fn2 of [...globalListeners]) callSafe(fn2, value, path);
    const exact = pathListeners.get(path);
    if (exact) for (const fn2 of [...exact]) callSafe(fn2, value, path);
    for (const [prefix2, set] of prefixListeners) {
      if (path.startsWith(prefix2)) {
        for (const fn2 of [...set]) callSafe(fn2, value, path);
      }
    }
  }
  function notify(path, value) {
    emitChange(path, value);
    if (ready) dirty.add(path);
    scheduleSave();
  }
  var SettingsStore = {
    addChangeListener(path, fn2) {
      addTo(pathListeners, path, fn2);
    },
    removeChangeListener(path, fn2) {
      pathListeners.get(path)?.delete(fn2);
    },
    addPrefixChangeListener(prefix2, fn2) {
      addTo(prefixListeners, prefix2, fn2);
    },
    removePrefixChangeListener(prefix2, fn2) {
      prefixListeners.get(prefix2)?.delete(fn2);
    },
    addGlobalChangeListener(fn2) {
      globalListeners.add(fn2);
    },
    removeGlobalChangeListener(fn2) {
      globalListeners.delete(fn2);
    },
    markAsChanged() {
      for (const fn2 of [...globalListeners]) callSafe(fn2, PlainSettings, "");
      scheduleSave();
    }
  };
  var RAW = Symbol("uspp.raw");
  var proxyCache = /* @__PURE__ */ new WeakMap();
  function makeProxy(obj, path) {
    let byPath = proxyCache.get(obj);
    if (!byPath) proxyCache.set(obj, byPath = /* @__PURE__ */ new Map());
    const cached = byPath.get(path);
    if (cached) return cached;
    const proxy = new Proxy(obj, {
      get(target2, key, receiver) {
        if (key === RAW) return target2;
        if (typeof key === "symbol") return Reflect.get(target2, key, receiver);
        let v3 = target2[key];
        const full = path ? `${path}.${key}` : key;
        if (v3 === void 0) {
          const parts = full.split(".");
          if (parts.length === 3 && parts[0] === "plugins") {
            const def = defaultResolver(parts[1], parts[2]);
            if (def !== void 0) {
              target2[key] = def;
              v3 = def;
            }
          }
        }
        if (v3 !== null && typeof v3 === "object" && !(v3 instanceof Date)) return makeProxy(v3, full);
        return v3;
      },
      set(target2, key, value) {
        if (typeof key === "symbol") return Reflect.set(target2, key, value);
        if (value && typeof value === "object" && value[RAW]) value = value[RAW];
        if (Object.is(target2[key], value) && key in target2) return true;
        target2[key] = value;
        notify(path ? `${path}.${key}` : key, value);
        return true;
      },
      deleteProperty(target2, key) {
        if (!(key in target2)) return true;
        delete target2[key];
        if (typeof key !== "symbol") notify(path ? `${path}.${key}` : key, void 0);
        return true;
      }
    });
    byPath.set(path, proxy);
    return proxy;
  }
  var Settings = makeProxy(PlainSettings, "");
  function replacer(_3, v3) {
    return typeof v3 === "bigint" ? { [BIGINT_TAG]: v3.toString() } : v3;
  }
  function reviver(_3, v3) {
    if (v3 && typeof v3 === "object" && typeof v3[BIGINT_TAG] === "string" && Object.keys(v3).length === 1) {
      try {
        return BigInt(v3[BIGINT_TAG]);
      } catch {
        return 0n;
      }
    }
    return v3;
  }
  var serialize2 = (obj) => JSON.stringify(obj, replacer);
  function parseStored(raw2) {
    try {
      let v3 = raw2;
      for (let i3 = 0; i3 < 3 && typeof v3 === "string"; i3++) v3 = JSON.parse(v3, reviver);
      if (v3 && typeof v3 === "object" && !Array.isArray(v3)) {
        v3 = JSON.parse(JSON.stringify(v3), reviver);
        if (v3.plugins && typeof v3.plugins === "object" && Object.keys(v3.plugins).length > 0) return v3;
      }
    } catch {
    }
    return null;
  }
  function idbOpen() {
    return new Promise((resolve2, reject) => {
      const idb = W.indexedDB || window.indexedDB;
      if (!idb) return reject(new Error("no indexedDB"));
      const req = idb.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve2(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbGet(key) {
    const db = await idbOpen();
    try {
      return await new Promise((resolve2, reject) => {
        const r3 = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(key);
        r3.onsuccess = () => resolve2(r3.result);
        r3.onerror = () => reject(r3.error);
      });
    } finally {
      db.close();
    }
  }
  async function idbSet(key, value) {
    const db = await idbOpen();
    try {
      await new Promise((resolve2, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(value, key);
        tx.oncomplete = () => resolve2();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }
  function lsGet() {
    try {
      return (W.localStorage || localStorage).getItem(SITE_STORAGE_KEY);
    } catch {
      return null;
    }
  }
  function replaceContents(data) {
    for (const k4 of Object.keys(PlainSettings)) delete PlainSettings[k4];
    Object.assign(PlainSettings, data);
    if (!PlainSettings.plugins || typeof PlainSettings.plugins !== "object") PlainSettings.plugins = {};
  }
  function mergeMissing(into, from) {
    for (const k4 of Object.keys(from)) {
      if (!(k4 in into)) into[k4] = from[k4];
      else if (into[k4] && from[k4] && typeof into[k4] === "object" && typeof from[k4] === "object" && !Array.isArray(into[k4])) mergeMissing(into[k4], from[k4]);
    }
    return into;
  }
  function loadSync() {
    if (!GM.get) return false;
    try {
      const raw2 = GM.get(STORAGE_KEY);
      if (raw2 && typeof raw2.then === "function") return false;
      const data = parseStored(raw2);
      if (data) {
        replaceContents(data);
        return true;
      }
    } catch (e3) {
      logger3.warn("同步读取设置失败", e3);
    }
    return false;
  }
  function richness(v3, key) {
    if (key === "enabled") return 0;
    if (Array.isArray(v3)) return 1 + v3.reduce((n2, x4) => n2 + richness(x4), 0);
    if (v3 && typeof v3 === "object") return 1 + Object.keys(v3).reduce((n2, k4) => n2 + richness(v3[k4], k4), 0);
    if (v3 === "" || v3 == null) return 0;
    return 1;
  }
  var isEmpty = (v3) => v3 == null || v3 === "" || Array.isArray(v3) && v3.length === 0 || typeof v3 === "object" && !Array.isArray(v3) && Object.keys(v3).length === 0;
  function fillFrom(into, from) {
    for (const k4 of Object.keys(from)) {
      const a3 = into[k4], b3 = from[k4];
      if (!(k4 in into) || isEmpty(a3) && !isEmpty(b3)) into[k4] = b3;
      else if (a3 && b3 && typeof a3 === "object" && typeof b3 === "object" && !Array.isArray(a3) && !Array.isArray(b3)) fillFrom(a3, b3);
    }
    return into;
  }
  var useSiteStorage = () => !isGeneric();
  async function loadAsync() {
    const sources = [["GM", async () => GM.get ? await GM.get(STORAGE_KEY) : null]];
    if (useSiteStorage()) sources.push(["IndexedDB", () => idbGet(SITE_STORAGE_KEY)], ["localStorage", lsGet]);
    const found = [];
    for (const [name, read] of sources) {
      try {
        const data = parseStored(await read());
        if (data) found.push({ name, data, score: richness(data) });
      } catch (e3) {
        logger3.debug(`从 ${name} 读取失败`, e3);
      }
    }
    if (found.length) {
      found.sort((a3, b3) => b3.score - a3.score);
      const data = found[0].data;
      for (const f3 of found.slice(1)) fillFrom(data, f3.data);
      const memory = JSON.parse(serialize2(PlainSettings), reviver);
      replaceContents(mergeMissing(data, memory));
      logger3.info(`设置已从 ${found.map((f3) => f3.name).join(" + ")} 读取`);
    }
    ready = true;
    return found.length > 0;
  }
  var underDirty = (path) => {
    for (const d3 of dirty) if (d3 === path || d3.startsWith(path + ".") || path.startsWith(d3 + ".")) return true;
    return false;
  };
  function applyRemote2(data) {
    if (!ready || !data || typeof data !== "object") return 0;
    const changedPaths = [];
    const walk = (target2, src, path) => {
      for (const k4 of Object.keys(src)) {
        const full = path ? `${path}.${k4}` : k4;
        const a3 = target2[k4], b3 = src[k4];
        if (a3 && b3 && typeof a3 === "object" && typeof b3 === "object" && !Array.isArray(a3) && !Array.isArray(b3)) {
          walk(a3, b3, full);
          continue;
        }
        if (underDirty(full)) continue;
        if (JSON.stringify(a3, replacer) === JSON.stringify(b3, replacer)) continue;
        target2[k4] = b3;
        changedPaths.push(full);
        emitChange(full, b3);
      }
    };
    walk(PlainSettings, data, "");
    if (changedPaths.length) {
      logger3.debug(`已从其他标签页同步 ${changedPaths.length} 项设置`);
      dispatch(Events.SETTINGS_SYNC, { paths: changedPaths });
    }
    return changedPaths.length;
  }
  function replaceAll(data) {
    const before = JSON.parse(serialize2(PlainSettings), reviver);
    replaceContents(data);
    const paths = [];
    const diff = (a3, b3, path) => {
      const isObj2 = (v3) => v3 && typeof v3 === "object" && !Array.isArray(v3);
      if (isObj2(a3) && isObj2(b3)) {
        for (const k4 of /* @__PURE__ */ new Set([...Object.keys(a3), ...Object.keys(b3)])) diff(a3[k4], b3[k4], path ? `${path}.${k4}` : k4);
        return;
      }
      if (JSON.stringify(a3, replacer) !== JSON.stringify(b3, replacer)) paths.push(path);
    };
    diff(before, PlainSettings, "");
    for (const path of paths) {
      const v3 = path.split(".").reduce((o3, k4) => o3 == null ? void 0 : o3[k4], PlainSettings);
      emitChange(path, v3);
      if (ready) dirty.add(path);
    }
    scheduleSave();
    return paths.length;
  }
  var syncInstalled = false;
  function installCrossTabSync() {
    if (syncInstalled) return;
    syncInstalled = true;
    if (GM.addListener) {
      try {
        GM.addListener(STORAGE_KEY, (_name, _old, value, remote) => {
          if (!remote) return;
          const data = parseStored(value);
          if (data) applyRemote2(data);
        });
      } catch (e3) {
        logger3.debug("监听脚本管理器存储失败", e3);
      }
    }
    if (useSiteStorage()) {
      W.addEventListener("storage", (e3) => {
        if (e3.key !== SITE_STORAGE_KEY || e3.newValue == null) return;
        const data = parseStored(e3.newValue);
        if (data) applyRemote2(data);
      });
    }
  }
  async function saveNow() {
    if (!ready) return;
    if (!PlainSettings.plugins || Object.keys(PlainSettings.plugins).length === 0) return;
    let json;
    try {
      json = serialize2(PlainSettings);
    } catch (e3) {
      logger3.warn("设置序列化失败", e3);
      return;
    }
    dirty.clear();
    pendingSave = false;
    if (GM.set) {
      try {
        try {
          const r3 = GM.set(STORAGE_KEY, JSON.parse(json));
          if (r3 && typeof r3.then === "function") await r3;
        } catch {
          const r3 = GM.set(STORAGE_KEY, json);
          if (r3 && typeof r3.then === "function") await r3;
        }
      } catch (e3) {
        logger3.warn("写入设置失败", e3);
      }
    }
    if (!useSiteStorage()) return;
    try {
      (W.localStorage || localStorage).setItem(SITE_STORAGE_KEY, json);
    } catch (e3) {
      logger3.debug("写入 localStorage 备份失败", e3);
    }
    try {
      await idbSet(SITE_STORAGE_KEY, json);
    } catch (e3) {
      logger3.debug("写入 IndexedDB 备份失败", e3);
    }
  }
  var pendingSave = false;
  var debouncedSave = debounce(() => {
    saveNow();
  }, 100);
  var scheduleSave = Object.assign(() => {
    pendingSave = true;
    debouncedSave();
  }, { cancel: () => debouncedSave.cancel() });
  function installUnloadSave() {
    const flush2 = () => {
      if (!pendingSave) return;
      scheduleSave.cancel();
      saveNow();
    };
    W.addEventListener("beforeunload", flush2);
    W.addEventListener("pagehide", flush2);
  }

  // ../Userscriptpp/core/lib/patches.js
  var logger4 = new Logger("Patcher", "#c4b5fd");
  var IDENT = "(?:[A-Za-z_$][\\w$]*)";
  function expandIdent(source) {
    let out = "";
    for (let i3 = 0; i3 < source.length; i3++) {
      const c3 = source[i3];
      if (c3 === "\\") {
        const n2 = source[i3 + 1];
        if (n2 === "i") out += IDENT;
        else out += c3 + (n2 ?? "");
        i3++;
      } else out += c3;
    }
    return out;
  }
  function canonicalizeRegex(re) {
    if (!(re instanceof RegExp)) return re;
    if (re.$$uspp_cttf_Canonical) return re;
    const expanded = new RegExp(expandIdent(re.source), re.flags);
    const original = re.toString();
    Object.defineProperty(expanded, "toString", { value: () => original, configurable: true });
    Object.defineProperty(expanded, "$$uspp_cttf_Canonical", { value: true });
    return expanded;
  }
  function canonicalizeFind(find2) {
    if (Array.isArray(find2)) return find2.map(canonicalizeRegex);
    return canonicalizeRegex(find2);
  }
  function matchesOne(code, f3) {
    if (typeof f3 === "string") return code.includes(f3);
    if (f3 instanceof RegExp) {
      f3.lastIndex = 0;
      return f3.test(code);
    }
    return false;
  }
  function matchesFind(code, find2) {
    if (Array.isArray(find2)) return find2.length > 0 && find2.every((f3) => matchesOne(code, f3));
    return matchesOne(code, find2);
  }
  var describeFind = (find2) => Array.isArray(find2) ? find2.map(String).join(" & ") : String(find2);
  var selfExpr = (name) => `${INSTANCE_EXPR}.plugins[${JSON.stringify(name)}]`;
  function countGroups(re) {
    try {
      return new RegExp(re.source + "|").exec("").length - 1;
    } catch {
      return 0;
    }
  }
  function canonicalizeReplacement(r3, pluginName, self = selfExpr(pluginName)) {
    const match = canonicalizeRegex(r3.match);
    let replace = r3.replace;
    if (typeof replace === "string") {
      if (IS_DEV && match instanceof RegExp) {
        const refs = [...replace.matchAll(/\$(\d+)/g)].map((m3) => +m3[1]);
        const max = refs.length ? Math.max(...refs) : 0;
        if (max > countGroups(match)) logger4.warn(`${pluginName}: 替换引用了 $${max},但 match 只有 ${countGroups(match)} 个捕获组`, String(match));
      }
      replace = replace.replaceAll("$self", self);
    } else if (typeof replace === "function") {
      const fn2 = replace;
      replace = (...args) => String(fn2(...args)).replaceAll("$self", self);
    }
    return { ...r3, match, replace };
  }
  var seq = 0;
  function canonicalizePatch(patch, pluginName, checkOnly = false, self) {
    const reps = Array.isArray(patch.replacement) ? patch.replacement : patch.replacement ? [patch.replacement] : [];
    return {
      id: ++seq,
      plugin: pluginName,
      find: canonicalizeFind(patch.find),
      rawFind: patch.find,
      replacement: reps.map((r3) => canonicalizeReplacement(r3, pluginName, self)),
      all: !!patch.all,
      group: !!patch.group,
      noWarn: !!patch.noWarn,
      predicate: patch.predicate,
      checkOnly,
      consumed: false
    };
  }
  function runPredicate(pred, label) {
    if (typeof pred !== "function") return true;
    try {
      return !!pred();
    } catch (e3) {
      logger4.error(`${label} 的 predicate 抛出异常`, e3);
      return false;
    }
  }
  function applyPatches(moduleId, source, patchList, stats2) {
    let code = source;
    const appliedPlugins = /* @__PURE__ */ new Set();
    const results = [];
    const mismatches = [];
    for (const p3 of patchList) {
      if (p3.consumed) continue;
      if (!runPredicate(p3.predicate, p3.plugin)) continue;
      let hit;
      try {
        hit = matchesFind(code, p3.find);
      } catch (e3) {
        logger4.error(`${p3.plugin}: find 出错`, e3);
        continue;
      }
      if (!hit) continue;
      if (!p3.all) p3.consumed = true;
      if (p3.checkOnly) {
        for (const r3 of p3.replacement) {
          if (!matchesOne(code, r3.match)) mismatches.push({ plugin: p3.plugin, find: describeFind(p3.rawFind), match: String(r3.match), moduleId });
        }
        continue;
      }
      const before = code;
      const statuses = [];
      let failed = false;
      for (const r3 of p3.replacement) {
        if (!runPredicate(r3.predicate, p3.plugin)) {
          statuses.push({ match: String(r3.match), status: "skipped" });
          continue;
        }
        try {
          if (r3.match instanceof RegExp) r3.match.lastIndex = 0;
          const next = code.replace(r3.match, r3.replace);
          if (next === code) {
            statuses.push({ match: String(r3.match), status: "noEffect" });
            stats2.noEffect++;
            failed = true;
            if (!p3.noWarn && !r3.noWarn) logger4.warn(`${p3.plugin}: 替换无效果(模块 ${moduleId})`, describeFind(p3.rawFind), String(r3.match));
          } else {
            code = next;
            statuses.push({ match: String(r3.match), status: "applied" });
          }
        } catch (e3) {
          statuses.push({ match: String(r3.match), status: "error", error: String(e3) });
          stats2.errors++;
          failed = true;
          logger4.error(`${p3.plugin}: 替换出错(模块 ${moduleId})`, describeFind(p3.rawFind), e3);
        }
      }
      if (p3.group && failed) {
        code = before;
        for (const s3 of statuses) if (s3.status === "applied" || s3.status === "noEffect") s3.status = "reverted";
        if (!p3.noWarn) logger4.warn(`${p3.plugin}: 成组补丁未全部生效,已撤销(模块 ${moduleId})`, describeFind(p3.rawFind));
      }
      const appliedCount = statuses.filter((s3) => s3.status === "applied").length;
      if (appliedCount) appliedPlugins.add(p3.plugin);
      results.push({ plugin: p3.plugin, find: describeFind(p3.rawFind), moduleId, replacements: statuses });
    }
    return { code, applied: [...appliedPlugins], results, mismatches };
  }

  // ../Userscriptpp/core/lib/turbopack.js
  var logger5 = new Logger("Turbopack", "#93c5fd");
  var fnToString = Function.prototype.toString;
  var META = Symbol.for("uspp.cttf.factory");
  var patches = [];
  var patchResults = [];
  var patchStats = { applied: 0, bypassed: 0, noEffect: 0, errors: 0, runtimeFallbacks: 0, patchedModules: /* @__PURE__ */ new Set(), injectionFallbacks: /* @__PURE__ */ new Set() };
  var checkOnlyMismatches = [];
  var moduleCache = /* @__PURE__ */ new Map();
  var factories = /* @__PURE__ */ new Map();
  var chunkPaths = /* @__PURE__ */ new Set();
  var wrapperOf = /* @__PURE__ */ new WeakMap();
  var wrappers = /* @__PURE__ */ new WeakSet();
  var metaById = /* @__PURE__ */ new Map();
  var loadListeners = /* @__PURE__ */ new Set();
  var cacheVersion = 0;
  var getCacheVersion = () => cacheVersion;
  var runtime2 = { registry: null, cache: null, ctx: null };
  var hasOwnToString = (f3) => {
    try {
      return Object.prototype.hasOwnProperty.call(f3, "toString");
    } catch {
      return false;
    }
  };
  function isForeignWrapper(f3) {
    try {
      if (!Object.prototype.hasOwnProperty.call(f3, "toString")) return false;
      return fnToString.call(f3) !== String(f3.toString());
    } catch {
      return false;
    }
  }
  var lostListeners = /* @__PURE__ */ new Set();
  var lostModules = /* @__PURE__ */ new Set();
  var onPatchLost = (cb) => {
    lostListeners.add(cb);
    for (const id of lostModules) safeLost(cb, id);
    return () => lostListeners.delete(cb);
  };
  function onPatchBypassed(pluginName, cb) {
    return onPatchLost((id, _plugins, results) => {
      const mine = results.filter((r3) => r3.plugin === pluginName);
      if (mine.length) cb(mine, id);
    });
  }
  function safeLost(cb, id) {
    if (diag.noFallback) {
      trace("fallback.suppressed", String(id));
      return;
    }
    const meta = metaById.get(id);
    try {
      cb(id, meta ? meta.plugins.slice() : [], meta ? meta.results.filter((r3) => r3.replacements.some((x4) => x4.status === "bypassed")) : []);
    } catch (e3) {
      logger5.error("补丁失效监听者出错", e3);
    }
  }
  var appliedEntries = (meta) => meta.results.flatMap((r3) => r3.replacements.filter((x4) => x4.status === "applied"));
  function markRan(meta) {
    if (meta.ranPatched) return;
    meta.ranPatched = true;
    patchStats.applied += appliedEntries(meta).length;
  }
  function markLost(id, why) {
    if (lostModules.has(id)) return;
    lostModules.add(id);
    const meta = metaById.get(id);
    if (meta) {
      const entries = appliedEntries(meta);
      for (const e3 of entries) {
        e3.status = "bypassed";
        e3.reason = why;
      }
      patchStats.bypassed += entries.length;
    }
    logger5.warn(`模块 ${id} 的补丁没有生效(${why}),相关插件改用运行时兜底:${meta ? meta.plugins.join(", ") : ""}`);
    trace("patch.lost", { id, why, plugins: meta ? meta.plugins : [] });
    for (const cb of [...lostListeners]) safeLost(cb, id);
  }
  function registerInjectionFallback(pluginName, detail) {
    if (patchStats.injectionFallbacks.has(pluginName)) return;
    patchStats.injectionFallbacks.add(pluginName);
    trace("fallback.enabled", { plugin: pluginName, detail });
    logger5.info(`${pluginName} 的补丁被绕过,已启用运行时兜底${detail ? `(${detail})` : ""}`);
  }
  function checkLostPatches() {
    const c3 = runtime2.cache;
    if (!c3) return;
    for (const [id, meta] of metaById) {
      if (meta.ranPatched || lostModules.has(id)) continue;
      const m0 = c3[id];
      if (!(m0 && m0.exports != null)) continue;
      meta.resolve?.();
      if (!meta.patched) continue;
      const m3 = c3[id];
      if (m3 && m3.exports != null && !meta.executing) markLost(id, "被其他脚本的包装绕过");
    }
  }
  var registeredKeys = /* @__PURE__ */ new Set();
  function addPatch(patch, pluginName, { checkOnly = false, key, self } = {}) {
    if (key) {
      if (registeredKeys.has(key)) return null;
      registeredKeys.add(key);
    }
    if (!runPredicate(patch.predicate, pluginName)) return null;
    const p3 = canonicalizePatch(patch, pluginName, checkOnly, self);
    patches.push(p3);
    if (replacedByOther || yieldedTo) queueMicrotask(bypassPending);
    return p3;
  }
  function onModuleLoad(cb) {
    loadListeners.add(cb);
    return () => loadListeners.delete(cb);
  }
  function registerExports(id, exports) {
    if (exports == null) return;
    moduleCache.set(id, exports);
    cacheVersion++;
    for (const cb of [...loadListeners]) {
      try {
        cb(exports, id);
      } catch (e3) {
        logger5.error("模块加载监听者出错", e3);
      }
    }
  }
  function rescanRuntimeCache() {
    const c3 = runtime2.cache;
    if (!c3) return 0;
    const fresh = [];
    for (const id of Object.keys(c3)) {
      const key = isNaN(+id) ? id : +id;
      if (moduleCache.has(key)) continue;
      const m3 = c3[id];
      if (m3 && !m3.error && m3.exports != null) {
        moduleCache.set(key, m3.exports);
        fresh.push([key, m3.exports]);
      }
    }
    if (fresh.length) cacheVersion++;
    for (const [key, exports] of fresh) {
      for (const cb of [...loadListeners]) {
        try {
          cb(exports, key);
        } catch (e3) {
          logger5.error("模块加载监听者出错", e3);
        }
      }
    }
    return fresh.length;
  }
  var lastRuntimeCount = -1;
  function syncRuntimeCache() {
    const c3 = runtime2.cache;
    if (!c3) return 0;
    let n2;
    try {
      n2 = Object.keys(c3).length;
    } catch {
      return 0;
    }
    if (n2 === lastRuntimeCount) return 0;
    lastRuntimeCount = n2;
    return rescanRuntimeCache();
  }
  var COMPILED = Symbol.for("uspp.cttf.compiled");
  function getNonce() {
    const s3 = document.querySelector("script[nonce]");
    return s3 ? s3.nonce || s3.getAttribute("nonce") || "" : "";
  }
  function compile2(id, code) {
    const sourceURL = `
//# sourceURL=uspp:///turbopack/module-${String(id).replace(/[^\w.-]/g, "_")}.js`;
    const ns = W[INSTANCE_KEY];
    try {
      if (ns && document.documentElement) {
        const bag = ns[COMPILED] || (Object.defineProperty(ns, COMPILED, { value: /* @__PURE__ */ Object.create(null) }), ns[COMPILED]);
        const key = "m" + String(id).replace(/[^\w]/g, "_");
        delete bag[key];
        const el = document.createElement("script");
        const nonce = getNonce();
        if (nonce) el.nonce = nonce;
        el.textContent = `${INSTANCE_EXPR}[Symbol.for("uspp.cttf.compiled")][${JSON.stringify(key)}]=(${code}
);${sourceURL}`;
        (document.head || document.documentElement).appendChild(el);
        el.remove();
        const fn2 = bag[key];
        delete bag[key];
        if (typeof fn2 === "function") return fn2;
      }
    } catch (e3) {
      logger5.debug("内联 script 编译失败,改用 Function", e3);
    }
    const F4 = W.Function || Function;
    return new F4(`return (${code}
);${sourceURL}`)();
  }
  function captureRuntime(ctx) {
    if (runtime2.registry || !ctx || typeof ctx !== "object") return;
    try {
      const proto = Object.getPrototypeOf(ctx);
      const reg = proto && proto.M;
      const cache = proto && proto.c;
      if (!(reg instanceof W.Map || reg instanceof Map) || !cache || typeof cache !== "object") return;
      runtime2.registry = reg;
      runtime2.cache = cache;
      runtime2.ctx = ctx;
      trace("runtime.captured", { registry: reg.size, cache: Object.keys(cache).length });
      if (diag.noRegistry) trace("registry.skipped");
      else hookRegistry(reg);
      rescanRuntimeCache();
    } catch (e3) {
      logger5.error("获取运行时注册表失败", e3);
    }
  }
  var nativeMapSet = Map.prototype.set;
  var seenModule = (id) => metaById.has(id) || metaById.has(String(id)) || metaById.has(+id);
  function hookRegistry(reg) {
    const prevSet = reg.set;
    for (const [id, f3] of reg) {
      if (typeof f3 !== "function" || wrappers.has(f3) || seenModule(id)) continue;
      if (runtime2.cache && runtime2.cache[id]) {
        if (!factories.has(id)) factories.set(id, f3);
        continue;
      }
      try {
        nativeMapSet.call(reg, id, wrapFactory(id, f3));
        trace("registry.rewrap", id);
      } catch {
      }
    }
    trace("registry.hooked", { size: reg.size });
    reg.set = function(id, f3) {
      count("registry.set");
      if (typeof f3 === "function" && !wrappers.has(f3) && !seenModule(id)) {
        f3 = wrapFactory(id, f3);
        trace("registry.wrapOnSet", id);
      }
      return prevSet.call(this, id, f3);
    };
  }
  function wrapFactory(id, original) {
    if (wrappers.has(original)) return original;
    const existing = wrapperOf.get(original);
    if (existing) return existing;
    if (!factories.has(id)) factories.set(id, original);
    const lazy2 = hasOwnToString(original);
    let foreign = false;
    let source = null;
    let resolved = false;
    trace("factory.wrap", { id, lazy: lazy2 });
    const meta = { id, original, patched: false, plugins: [], results: [], code: null, compiled: null, compileFailed: false, deferred: false, ranPatched: false, executing: false };
    const resolve2 = () => {
      if (resolved) return;
      resolved = true;
      try {
        if (lazy2) {
          const own = String(original.toString());
          foreign = own !== fnToString.call(original);
          source = own;
        } else source = fnToString.call(original);
      } catch {
      }
      if (!source) return;
      const res = applyPatches(id, source, patches, patchStats);
      if (res.results.length) patchResults.push(...res.results);
      if (res.mismatches.length) checkOnlyMismatches.push(...res.mismatches);
      if (res.code !== source) {
        meta.patched = true;
        meta.results = res.results;
        meta.plugins = res.applied;
        meta.code = res.code;
        patchStats.patchedModules.add(id);
        meta.deferred = foreign;
      }
    };
    meta.resolve = resolve2;
    if (!lazy2) resolve2();
    const wrapper = function(ctx, mod, exp) {
      captureRuntime(ctx);
      resolve2();
      trace("factory.run", { id, patched: meta.patched, deferred: meta.deferred });
      let fn2 = original;
      if (meta.patched && meta.deferred) {
        markLost(id, "内层是其他脚本的包装");
      } else if (meta.patched && !meta.compileFailed) {
        if (!meta.compiled) {
          try {
            meta.compiled = compile2(id, meta.code);
          } catch (e3) {
            meta.compileFailed = true;
            patchStats.errors++;
            logger5.error(`模块 ${id} 补丁后编译失败,改用原始代码(${meta.plugins.join(", ")})`, e3);
          }
        }
        if (meta.compiled) fn2 = meta.compiled;
        else markLost(id, "编译失败");
      }
      let ret;
      meta.executing = true;
      try {
        ret = fn2.apply(this, arguments);
        if (fn2 !== original) markRan(meta);
      } catch (e3) {
        if (fn2 === original) throw e3;
        meta.ranPatched = false;
        markLost(id, "运行出错");
        patchStats.runtimeFallbacks++;
        logger5.error(`模块 ${id} 补丁后运行出错,改用原始代码重新执行(${meta.plugins.join(", ")})`, e3);
        ret = runOriginalFresh(this, original, ctx, mod, exp, arguments);
      } finally {
        meta.executing = false;
      }
      try {
        registerExports(id, mod && mod.exports);
      } catch (e3) {
        logger5.error(e3);
      }
      return ret;
    };
    Object.defineProperty(wrapper, "toString", { value: () => {
      resolve2();
      return source != null ? source : fnToString.call(original);
    }, configurable: true, writable: true });
    Object.defineProperty(wrapper, "name", { value: original.name, configurable: true });
    Object.defineProperty(wrapper, META, { value: meta });
    wrappers.add(wrapper);
    wrapperOf.set(original, wrapper);
    if (!metaById.has(id)) metaById.set(id, meta);
    return wrapper;
  }
  function runOriginalFresh(self, original, ctx, mod, exp, args) {
    try {
      if (mod && ctx && typeof ctx === "object") {
        const fresh = {};
        mod.exports = fresh;
        mod.namespaceObject = void 0;
        mod.error = void 0;
        const Ctor = Object.getPrototypeOf(ctx).constructor;
        const freshCtx = new Ctor(mod, fresh);
        return original.call(self, freshCtx, mod, fresh);
      }
    } catch (e3) {
      if (!(e3 instanceof TypeError)) throw e3;
    }
    return original.apply(self, args);
  }
  function getPatchedCode(id) {
    const meta = metaById.get(id) ?? metaById.get(+id) ?? metaById.get(String(id));
    meta?.resolve?.();
    return meta && meta.patched ? meta.code : null;
  }
  function chunkName(head) {
    try {
      if (typeof head === "string") return head;
      if (head && typeof head.getAttribute === "function") return head.getAttribute("src") || "";
      if (head && typeof head.src === "string") return head.src;
    } catch {
    }
    return "";
  }
  var seenChunks = /* @__PURE__ */ new WeakSet();
  function handleChunk(chunk) {
    if (!Array.isArray(chunk) || seenChunks.has(chunk)) return;
    seenChunks.add(chunk);
    const name = chunkName(chunk[0]);
    if (name) chunkPaths.add(name);
    trace("chunk", { name, length: chunk.length });
    let ids = [];
    for (let i3 = 1; i3 < chunk.length; i3++) {
      const v3 = chunk[i3];
      if (typeof v3 === "function") {
        if (ids.length) {
          if (diag.noOwnWrap || diag.noForeignWrap && hasOwnToString(v3)) {
            if (!factories.has(ids[0])) factories.set(ids[0], v3);
            trace("factory.foreignLeft", ids[0]);
          } else {
            try {
              chunk[i3] = wrapFactory(ids[0], v3);
            } catch (e3) {
              logger5.error("包装工厂失败", e3);
            }
          }
        }
        ids = [];
      } else if (typeof v3 === "number" || typeof v3 === "string") {
        ids.push(v3);
      } else {
        ids = [];
      }
    }
  }
  var instrumented = /* @__PURE__ */ new WeakSet();
  var pushWrapperOf = /* @__PURE__ */ new WeakMap();
  var chainedPushOf = /* @__PURE__ */ new WeakMap();
  var pushCalls = 0;
  var isNativePush = (f3) => {
    try {
      return f3 === Array.prototype.push || f3 === W.Array?.prototype?.push;
    } catch {
      return false;
    }
  };
  var probed = 0;
  function instrument(value, { existing = false } = {}) {
    if (!value || typeof value !== "object" && typeof value !== "function" || instrumented.has(value)) return value;
    const origPush = value.push;
    const after = diag.pushAfter || existing && Array.isArray(value) && typeof origPush === "function" && !isNativePush(origPush);
    if (after) trace("push.after", { existing, array: Array.isArray(value) });
    if (Array.isArray(value)) {
      for (const c3 of value) handleChunk(c3);
    }
    if (typeof origPush === "function") {
      const mine = function(...chunks) {
        pushCalls++;
        count("push");
        try {
          const outer = value.push;
          if (outer !== mine) chainedPushOf.set(value, outer);
        } catch {
        }
        if (diag.noRead) return origPush.apply(this, chunks);
        if (diag.probeChunks && probed < 5) {
          probed++;
          const desc = (c3) => {
            try {
              return [0, 1, 2].map((i3) => {
                const d3 = Object.getOwnPropertyDescriptor(c3, i3);
                return d3 ? "get" in d3 ? "get" : typeof d3.value : "none";
              });
            } catch (e3) {
              return "err:" + e3.message;
            }
          };
          trace("chunk.probe", { phase: Array.isArray(value) ? "array" : "runtime", after, n: chunks.length, isArray: chunks.map((c3) => Array.isArray(c3)), desc: chunks.map(desc), protoNative: chunks.map((c3) => {
            try {
              return Object.getPrototypeOf(c3) === Array.prototype;
            } catch {
              return null;
            }
          }) });
        }
        if (after) {
          const r3 = origPush.apply(this, chunks);
          for (const c3 of chunks) {
            try {
              handleChunk(c3);
            } catch (e3) {
              logger5.error("处理分块失败", e3);
            }
          }
          return r3;
        }
        for (const c3 of chunks) {
          try {
            handleChunk(c3);
          } catch (e3) {
            logger5.error("处理分块失败", e3);
          }
        }
        return origPush.apply(this, chunks);
      };
      try {
        value.push = mine;
      } catch (e3) {
        logger5.warn("无法包装 TURBOPACK.push", e3);
      }
      if (value.push === mine) pushWrapperOf.set(value, mine);
    }
    instrumented.add(value);
    return value;
  }
  var installed = false;
  var ourGetter = null;
  var yieldedTo = null;
  function installInterceptor() {
    if (installed) return;
    installed = true;
    const desc = Object.getOwnPropertyDescriptor(W, "TURBOPACK");
    const pre = desc && ("get" in desc || "set" in desc) ? "TURBOPACK 已是别的脚本装的访问器" : desc && Array.isArray(desc.value) && typeof desc.value.push === "function" && !isNativePush(desc.value.push) ? "TURBOPACK.push 已被别的脚本换过" : null;
    if (pre && !diag.coexistActive) {
      yieldedTo = pre;
      trace("turbopack.yield", pre);
      logger5.info(`${pre},本脚本不再挂接,以免改变对方的行为;依赖补丁的功能改用渲染兜底或停用`);
      setTimeout(() => {
        bypassPending();
        notifyInactive();
      }, 0);
      return;
    }
    let current2;
    let chainGet = null, chainSet = null;
    if (desc && ("get" in desc || "set" in desc)) {
      chainGet = desc.get;
      chainSet = desc.set;
      try {
        instrument(chainGet ? chainGet.call(W) : void 0, { existing: true });
      } catch (e3) {
        logger5.warn(e3);
      }
    } else if (desc) {
      current2 = instrument(desc.value, { existing: true });
    }
    if (diag.noSet) {
      try {
        instrument(W.TURBOPACK, { existing: true });
      } catch {
      }
      trace("turbopack.install", { existing: desc ? "get" in desc || "set" in desc ? "accessor" : "value" : "none", noSet: true });
      return;
    }
    if (desc && !desc.configurable) {
      logger5.warn("TURBOPACK 不可配置,只能包装其 push");
      try {
        instrument(W.TURBOPACK, { existing: true });
      } catch {
      }
      return;
    }
    Object.defineProperty(W, "TURBOPACK", {
      configurable: true,
      enumerable: desc ? desc.enumerable : true,
      get: ourGetter = function() {
        count("turbopack.get");
        if (chainGet) {
          const v3 = chainGet.call(this);
          return instrument(v3, { existing: true });
        }
        return current2;
      },
      set: function(v3) {
        trace("turbopack.set", Array.isArray(v3) ? "array" : typeof v3);
        v3 = instrument(v3);
        if (chainSet) chainSet.call(this, v3);
        else if (!chainGet) current2 = v3;
      }
    });
    logger5.debug("已安装打包器拦截");
    trace("turbopack.install", { existing: desc ? "get" in desc || "set" in desc ? "accessor" : "value" : "none" });
  }
  function findInRegistry(test2) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const consider = (id, f3) => {
      if (seen.has(id) || typeof f3 !== "function") return;
      seen.add(id);
      let src;
      try {
        const o3 = f3[META]?.original ?? f3;
        src = isForeignWrapper(o3) ? String(o3.toString()) : fnToString.call(o3);
      } catch {
        return;
      }
      if (test2(src, id)) out.push([id, f3]);
    };
    if (runtime2.registry) for (const [id, f3] of runtime2.registry) consider(id, f3);
    for (const [id, f3] of factories) consider(id, f3);
    return out;
  }
  function buildReport() {
    const orphaned = [], pending = [];
    for (const p3 of patches) {
      if (p3.consumed || p3.all || p3.checkOnly) continue;
      const pend = findInRegistry((src) => {
        try {
          return matchesFind(src, p3.find);
        } catch {
          return false;
        }
      });
      const entry2 = `${p3.plugin}: ${describeFind(p3.rawFind)}`;
      if (pend.length) pending.push(entry2);
      else if (!p3.noWarn) orphaned.push(entry2);
    }
    return { orphaned, pending };
  }
  function patchReport() {
    const { orphaned, pending } = buildReport();
    return {
      stats: { ...patchStats, patchedModules: [...patchStats.patchedModules], injectionFallbacks: [...patchStats.injectionFallbacks], takenOver: replacedByOther, yielded: !!yieldedTo },
      results: patchResults.slice(),
      orphaned,
      pending
    };
  }
  function logHealthReport() {
    const { orphaned } = buildReport();
    if (replacedByOther || yieldedTo) {
      logger5.info(`补丁统计:${yieldedTo ? "TURBOPACK 让给了先装的脚本" : "TURBOPACK 已被其他脚本接管"},${patchStats.bypassed} 条补丁记为 bypassed,依赖它的功能改用渲染兜底或停用`);
      return;
    }
    if (orphaned.length) logger5.warn(`以下补丁找不到对应模块(孤儿):
${orphaned.join("\n")}`);
    const noEffect = patchResults.some((r3) => r3.replacements.some((s3) => s3.status === "noEffect"));
    if (patchStats.applied === 0 && (orphaned.length || noEffect)) logger5.warn("本次没有任何补丁生效,站点构建很可能已变化");
    if (IS_DEV && checkOnlyMismatches.length) {
      logger5.warn("已禁用插件中失配的补丁:", checkOnlyMismatches);
    }
    logger5.info(`补丁统计:applied ${patchStats.applied},bypassed ${patchStats.bypassed},noEffect ${patchStats.noEffect},errors ${patchStats.errors},运行时回退 ${patchStats.runtimeFallbacks},被补丁模块 ${patchStats.patchedModules.size}`);
  }
  var lostCheckTimer = 0;
  onModuleLoad(() => {
    if (lostCheckTimer) return;
    lostCheckTimer = setTimeout(() => {
      lostCheckTimer = 0;
      checkLostPatches();
    }, 300);
  });
  var replacedByOther = false;
  var takeoverListeners = /* @__PURE__ */ new Set();
  function onTakeover(cb) {
    if (replacedByOther || yieldedTo && inactiveNotified) {
      try {
        cb();
      } catch (e3) {
        logger5.error(e3);
      }
      return () => {
      };
    }
    takeoverListeners.add(cb);
    return () => takeoverListeners.delete(cb);
  }
  var TAKEOVER_GRACE_MS = 1e3;
  var suspect = null;
  var chainedValue = null;
  function takeoverReason() {
    const d3 = Object.getOwnPropertyDescriptor(W, "TURBOPACK");
    if (!d3) return null;
    const v3 = "value" in d3 ? d3.value : (() => {
      try {
        return W.TURBOPACK;
      } catch {
        return void 0;
      }
    })();
    if (v3 == null) return null;
    if (!instrumented.has(v3)) {
      if (v3 === chainedValue) return null;
      return d3.get && d3.get !== ourGetter ? "属性被重定义成别人的访问器,取到的值没经过本脚本" : "值被换掉,没经过本脚本";
    }
    const mine = pushWrapperOf.get(v3);
    if (!mine) return null;
    const push = v3.push;
    if (push === mine || chainedPushOf.get(v3) === push) return null;
    return "push 被换掉";
  }
  function declareTakeover(why) {
    replacedByOther = true;
    trace("takeover", why);
    logger5.warn(`TURBOPACK 被其他脚本接管且没有串联本脚本的处理(${why}),不再争夺;之后加载的模块不打补丁,依赖补丁的功能改用渲染兜底或停用`);
    bypassPending();
    notifyInactive();
  }
  var inactiveNotified = false;
  function notifyInactive() {
    inactiveNotified = true;
    for (const cb of [...takeoverListeners]) {
      try {
        cb();
      } catch (e3) {
        logger5.error(e3);
      }
    }
    if (!runtime2.registry) (yieldedTo ? logger5.info : logger5.warn).call(logger5, "没取到打包器的运行时,依赖站点模块的界面入口(渲染兜底等)无法启用;框架设置从脚本管理器菜单打开");
  }
  var takeoverSeq = 0;
  function bypassPending() {
    const results = [];
    for (const p3 of patches) {
      if (p3.consumed || p3.checkOnly || p3.all) continue;
      p3.consumed = true;
      const replacements = p3.replacement.map((r3) => ({ match: String(r3.match), status: "bypassed", reason: yieldedTo ? "TURBOPACK 让给先装的脚本" : "TURBOPACK 被接管" }));
      patchStats.bypassed += replacements.length;
      results.push({ plugin: p3.plugin, find: describeFind(p3.rawFind), moduleId: null, replacements });
    }
    patchResults.push(...results);
    if (!results.length) return;
    const id = `(${yieldedTo ? "TURBOPACK 让给先装的脚本" : "TURBOPACK 被接管"} #${++takeoverSeq})`;
    metaById.set(id, { id, patched: true, plugins: [...new Set(results.map((r3) => r3.plugin))], results, ranPatched: false });
    lostModules.add(id);
    for (const cb of [...lostListeners]) safeLost(cb, id);
  }
  function watchInstrumentation(durationMs = 2e4) {
    if (!installed || yieldedTo) return;
    const until = Date.now() + durationMs;
    const tick = () => {
      if (replacedByOther) return;
      try {
        const why = takeoverReason();
        if (!why) suspect = null;
        else if (!suspect) suspect = { why, since: Date.now(), calls: pushCalls };
        else if (pushCalls > suspect.calls) {
          if (why !== "push 被换掉") {
            try {
              chainedValue = W.TURBOPACK;
            } catch {
            }
          }
          suspect = null;
        } else if (Date.now() - suspect.since >= TAKEOVER_GRACE_MS) {
          declareTakeover(why);
          return;
        }
      } catch {
      }
      if (Date.now() < until || suspect) setTimeout(tick, 50);
    };
    tick();
  }

  // ../Userscriptpp/core/lib/styles.js
  var logger6 = new Logger("Styles", "#f9a8d4");
  var styles = /* @__PURE__ */ new Map();
  var container = null;
  var pendingDom = false;
  var useSheets = /* @__PURE__ */ (() => {
    let v3 = null;
    return () => {
      if (v3 === null) {
        try {
          v3 = getSite().styleHost !== "element" && "adoptedStyleSheets" in Document.prototype && typeof CSSStyleSheet.prototype.replaceSync === "function";
        } catch {
          v3 = false;
        }
      }
      return v3;
    };
  })();
  var ourSheets = /* @__PURE__ */ new WeakSet();
  function syncSheet(name) {
    const s3 = styles.get(name);
    const doc = document;
    if (s3) {
      if (!s3.sheet) {
        s3.sheet = new CSSStyleSheet();
        ourSheets.add(s3.sheet);
      }
      if (s3.sheetCss !== s3.css) {
        try {
          s3.sheet.replaceSync(s3.css);
        } catch (e3) {
          logger6.warn(`样式 ${name} 解析失败`, e3);
        }
        s3.sheetCss = s3.css;
      }
    }
    const others = doc.adoptedStyleSheets.filter((x4) => !ourSheets.has(x4));
    const ours = [...styles.values()].filter((x4) => x4.enabled && x4.sheet).map((x4) => x4.sheet);
    doc.adoptedStyleSheets = [...others, ...ours];
  }
  function ensureContainer() {
    if (!document.head) {
      if (!pendingDom) {
        pendingDom = true;
        const go = () => {
          pendingDom = false;
          rebuild();
        };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go, { once: true });
        else queueMicrotask(go);
        const mo2 = new MutationObserver(() => {
          if (document.head) {
            mo2.disconnect();
            go();
          }
        });
        mo2.observe(document.documentElement || document, { childList: true, subtree: true });
      }
      return null;
    }
    if (container && container.isConnected) return container;
    container = document.createElement("uspp-cttf-styles");
    container.style.display = "none";
    document.head.appendChild(container);
    return container;
  }
  function rebuild() {
    const c3 = ensureContainer();
    if (!c3) return;
    for (const [name, s3] of styles) {
      if (!s3.enabled) {
        s3.el?.remove();
        continue;
      }
      if (!s3.el || s3.el.parentNode !== c3) {
        s3.el = document.createElement("style");
        s3.el.setAttribute("data-uspp-cttf", name);
        s3.el.textContent = s3.css;
        c3.appendChild(s3.el);
      }
    }
  }
  function sync(name) {
    if (useSheets()) return syncSheet(name);
    const s3 = styles.get(name);
    if (!s3) return;
    const c3 = ensureContainer();
    if (!c3) return;
    if (!container.isConnected) return rebuild();
    if (!s3.enabled) {
      s3.el?.remove();
      return;
    }
    if (!s3.el || s3.el.parentNode !== c3) {
      if (s3.el && s3.el.parentNode !== c3) return rebuild();
      s3.el = document.createElement("style");
      s3.el.setAttribute("data-uspp-cttf", name);
      c3.appendChild(s3.el);
    }
    if (s3.el.textContent !== s3.css) s3.el.textContent = s3.css;
  }
  function registerStyle(name, css, enabled = true) {
    const s3 = styles.get(name);
    if (s3) {
      s3.css = css;
      if (enabled) s3.enabled = true;
    } else styles.set(name, { css, enabled, el: null });
    if (!useSheets() && container && !container.isConnected) {
      container = null;
      rebuild();
    } else sync(name);
  }
  function enableStyle(name) {
    const s3 = styles.get(name);
    if (!s3) {
      logger6.warn(`样式 ${name} 未注册`);
      return false;
    }
    if (s3.enabled) return false;
    s3.enabled = true;
    sync(name);
    return true;
  }
  function disableStyle(name) {
    const s3 = styles.get(name);
    if (!s3 || !s3.enabled) return false;
    s3.enabled = false;
    s3.el?.remove();
    s3.el = null;
    if (useSheets()) syncSheet(name);
    return true;
  }
  function unregisterStyle(name) {
    const s3 = styles.get(name);
    if (!s3) return false;
    s3.el?.remove();
    styles.delete(name);
    if (useSheets()) syncSheet(null);
    return true;
  }

  // ../Userscriptpp/core/lib/slots.js
  var logger7 = new Logger("Slots", "#fdba74");
  var slots = /* @__PURE__ */ new Map();
  var listeners = /* @__PURE__ */ new Map();
  var anyListeners = /* @__PURE__ */ new Set();
  var version = 0;
  function emit(slot) {
    version++;
    for (const fn2 of [...listeners.get(slot) || [], ...anyListeners]) {
      try {
        fn2(slot);
      } catch (e3) {
        logger7.error("注入点监听者出错", e3);
      }
    }
  }
  function addSlotItem(slot, id, def) {
    if (!slot || id == null) throw new Error("addSlotItem 需要注入点名和 ID");
    let m3 = slots.get(slot);
    if (!m3) slots.set(slot, m3 = /* @__PURE__ */ new Map());
    m3.set(String(id), { ...def, id: String(id) });
    emit(slot);
  }
  function removeSlotItem(slot, id) {
    if (slots.get(slot)?.delete(String(id))) emit(slot);
  }
  function getSlotItems(slot) {
    return [...slots.get(slot)?.values() ?? []].sort((a3, b3) => (a3.order ?? 0) - (b3.order ?? 0));
  }
  function onSlotChange(slot, fn2) {
    const set = slot === "*" ? anyListeners : listeners.get(slot) || (listeners.set(slot, /* @__PURE__ */ new Set()), listeners.get(slot));
    set.add(fn2);
    return () => set.delete(fn2);
  }
  var getSlotVersion = () => version;
  var slotValue = (v3, ctx) => typeof v3 === "function" ? !!v3(ctx) : !!v3;

  // ../Userscriptpp/core/lib/finders.js
  var logger8 = new Logger("Finders", "#67e8f9");
  var fnToString2 = Function.prototype.toString;
  var REACT_MEMO = Symbol.for("react.memo");
  var REACT_FORWARD_REF = Symbol.for("react.forward_ref");
  function isSkippable(v3) {
    if (v3 == null) return true;
    const t4 = typeof v3;
    if (t4 !== "object" && t4 !== "function") return true;
    try {
      if (v3 === W || v3 === window || v3 === W.document || v3 === document) return true;
      if (typeof W.Node === "function" && v3 instanceof W.Node) return true;
      if (v3 instanceof Map || v3 instanceof Set || v3 instanceof WeakMap || v3 instanceof WeakSet) return true;
      if (W.Map && (v3 instanceof W.Map || v3 instanceof W.Set || v3 instanceof W.WeakMap || v3 instanceof W.WeakSet)) return true;
      if (v3 instanceof ArrayBuffer || ArrayBuffer.isView(v3)) return true;
      if (W.ArrayBuffer && (v3 instanceof W.ArrayBuffer || W.ArrayBuffer.isView(v3))) return true;
      if (W.WebSocket && v3 instanceof W.WebSocket) return true;
      if (W.MessagePort && v3 instanceof W.MessagePort) return true;
      if (W.EventTarget && v3 instanceof W.EventTarget && !(t4 === "function")) return true;
      if (W.Promise && v3 instanceof W.Promise) return true;
      if (t4 === "function" || t4 === "object") {
        const probe = v3["$$uspp_probe_x"];
        if (probe != null) return true;
      }
    } catch {
      return true;
    }
    return false;
  }
  function quietly(fn2) {
    const c3 = W.console || console;
    const ow = c3.warn, oe = c3.error;
    c3.warn = () => {
    };
    c3.error = () => {
    };
    try {
      return fn2();
    } finally {
      c3.warn = ow;
      c3.error = oe;
    }
  }
  function testSafe(filter, v3) {
    try {
      return !!filter(v3);
    } catch {
      return false;
    }
  }
  var SKIP_KEYS = /* @__PURE__ */ new Set(["default"]);
  function* candidates(exports) {
    yield exports;
    if (isSkippable(exports)) return;
    let keys;
    try {
      keys = Object.keys(exports);
    } catch {
      return;
    }
    for (const k4 of keys) {
      if (k4.startsWith("__") || k4.startsWith("unstable_") || k4.startsWith("UNSAFE_")) continue;
      let v3;
      try {
        v3 = exports[k4];
      } catch {
        continue;
      }
      if (v3 == null || SKIP_KEYS.has(k4) && v3 === exports) continue;
      yield v3;
    }
  }
  function find(filter, { all = false } = {}) {
    if (typeof filter !== "function") throw new TypeError("filter 必须是函数");
    return quietly(() => {
      const found = [];
      const seen = /* @__PURE__ */ new Set();
      syncRuntimeCache();
      for (const exports of moduleCache.values()) {
        for (const v3 of candidates(exports)) {
          if (v3 == null || typeof v3 !== "object" && typeof v3 !== "function") continue;
          if (seen.has(v3)) continue;
          if (v3 !== exports && isSkippable(v3)) continue;
          if (testSafe(filter, v3)) {
            if (!all) return v3;
            seen.add(v3);
            found.push(v3);
          }
        }
      }
      return all ? found : null;
    });
  }
  var findAll = (filter) => find(filter, { all: true });
  var codeOf = (f3) => {
    try {
      return fnToString2.call(f3);
    } catch {
      return "";
    }
  };
  var toPatterns = (ps) => ps.map(canonicalizeRegex);
  var isZustandStore = (v3) => typeof v3 === "function" && typeof v3.getState === "function" && typeof v3.subscribe === "function" && typeof v3.setState === "function";
  var storeKey = (name) => "use" + (name.startsWith("use") ? name.slice(3) : name).replace(/Store$/, "") + "Store";
  var filters = {
    byProps: (...keys) => (v3) => keys.every((k4) => v3[k4] != null),
    byCode: (...patterns) => {
      const ps = toPatterns(patterns);
      return (v3) => typeof v3 === "function" && ps.every((p3) => matchesOne(codeOf(v3), p3));
    },
    byDisplayName: (name) => (v3) => v3.displayName === name || v3.render?.displayName === name || v3.type?.displayName === name,
    byStoreName: (name) => {
      const key = storeKey(name);
      return (v3) => isZustandStore(v3[key]);
    },
    componentByCode: (...patterns) => {
      const ps = toPatterns(patterns);
      const check3 = (f3) => typeof f3 === "function" && ps.every((p3) => matchesOne(codeOf(f3), p3));
      return (v3) => {
        if (check3(v3)) return true;
        if (v3.$$typeof === REACT_MEMO) return check3(v3.type) || check3(v3.type?.render);
        if (v3.$$typeof === REACT_FORWARD_REF) return check3(v3.render);
        return false;
      };
    }
  };
  var findByProps = (...keys) => find(filters.byProps(...keys));
  var findByCode = (...ps) => find(filters.byCode(...ps));
  var findByDisplayName = (name) => find(filters.byDisplayName(name));
  var findComponentByCode = (...ps) => find(filters.componentByCode(...ps));
  function findExportedComponent(...names) {
    const m3 = find((v3) => names.some((n2) => v3[n2] != null && (typeof v3[n2] === "function" || typeof v3[n2] === "object")));
    if (!m3) return null;
    for (const n2 of names) if (m3[n2] != null) return m3[n2];
    return null;
  }
  function findStore(name) {
    const key = storeKey(name);
    const m3 = find((v3) => isZustandStore(v3[key]));
    return m3 ? m3[key] : null;
  }
  function retryOnChange() {
    let last2 = -1;
    return () => {
      const v3 = getCacheVersion();
      if (v3 === last2) return false;
      last2 = v3;
      return true;
    };
  }
  var lazy = (fn2) => proxyLazy(fn2, retryOnChange());
  function lazyComponent(resolveFn, label) {
    let cached = null, last2 = -1;
    const get = () => {
      if (cached) return cached;
      const v3 = getCacheVersion();
      if (v3 === last2) return null;
      last2 = v3;
      cached = resolveFn();
      return cached;
    };
    const Lazy = (props) => {
      const C4 = get();
      if (!C4) return null;
      const React = getReact();
      return React ? React.createElement(C4, props) : null;
    };
    Lazy.displayName = `UsppLazy(${label})`;
    Lazy.$$uspp_cttf_Resolve = get;
    return Lazy;
  }
  var findLazy = (filter) => lazy(() => find(filter));
  var findByPropsLazy = (...keys) => lazy(() => findByProps(...keys));
  var findByCodeLazy = (...ps) => lazy(() => findByCode(...ps));
  var findByDisplayNameLazy = (name) => lazyComponent(() => findByDisplayName(name), name);
  var findComponentByCodeLazy = (...ps) => lazyComponent(() => findComponentByCode(...ps), String(ps[0]));
  var findExportedComponentLazy = (...names) => lazyComponent(() => findExportedComponent(...names), names[0]);
  var findStoreLazy = (name) => lazy(() => findStore(name));
  function srcMatcher(patterns) {
    const ps = toPatterns(patterns);
    return (src) => ps.every((p3) => matchesOne(src, p3));
  }
  function findModuleFactory(...patterns) {
    const hit = findInRegistry(srcMatcher(patterns))[0];
    return hit ?? null;
  }
  function findModuleId(...patterns) {
    const hit = findModuleFactory(...patterns);
    return hit ? hit[0] : null;
  }
  function search(...patterns) {
    const out = {};
    for (const [id, f3] of findInRegistry(srcMatcher(patterns))) out[id] = f3;
    return out;
  }
  function requireModule(id) {
    if (moduleCache.has(id)) return moduleCache.get(id);
    if (moduleCache.has(+id)) return moduleCache.get(+id);
    try {
      const c3 = runtime2.cache;
      if (c3 && c3[id] && !c3[id].error) return c3[id].exports;
      if (runtime2.ctx && typeof runtime2.ctx.r === "function") return runtime2.ctx.r(isNaN(+id) ? id : +id);
    } catch (e3) {
      logger8.debug(`加载模块 ${id} 失败`, e3);
    }
    return null;
  }
  function mapMangledModule(patterns, mappers) {
    const out = {};
    const id = findModuleId(...Array.isArray(patterns) ? patterns : [patterns]);
    if (id == null) return out;
    const exports = requireModule(id);
    if (!exports) return out;
    quietly(() => {
      for (const k4 of Object.keys(exports)) {
        let v3;
        try {
          v3 = exports[k4];
        } catch {
          continue;
        }
        if (v3 == null) continue;
        for (const [name, filter] of Object.entries(mappers)) {
          if (out[name] === void 0 && testSafe(filter, v3)) out[name] = v3;
        }
      }
    });
    return out;
  }
  function waitFor(filter, callback, timeoutMs) {
    const existing = find(filter);
    if (existing) {
      try {
        callback(existing);
      } catch (e3) {
        logger8.error("waitFor 回调出错", e3);
      }
      return () => {
      };
    }
    let timer2;
    const unsub = onModuleLoad((exports) => {
      let hit = null;
      quietly(() => {
        for (const v3 of candidates(exports)) {
          if (v3 == null || typeof v3 !== "object" && typeof v3 !== "function") continue;
          if (v3 !== exports && isSkippable(v3)) continue;
          if (testSafe(filter, v3)) {
            hit = v3;
            break;
          }
        }
      });
      if (hit) {
        cancel();
        try {
          callback(hit);
        } catch (e3) {
          logger8.error("waitFor 回调出错", e3);
        }
      }
    });
    const cancel = () => {
      unsub();
      clearTimeout(timer2);
    };
    if (timeoutMs) timer2 = setTimeout(() => {
      unsub();
      logger8.warn(`waitFor 超时(${timeoutMs} ms)`, filter);
    }, timeoutMs);
    return cancel;
  }
  function getAllStores() {
    const out = /* @__PURE__ */ new Map();
    quietly(() => {
      syncRuntimeCache();
      for (const exports of moduleCache.values()) {
        if (isSkippable(exports)) continue;
        let keys;
        try {
          keys = Object.keys(exports);
        } catch {
          continue;
        }
        for (const k4 of keys) {
          if (!k4.startsWith("use") || out.has(k4)) continue;
          let v3;
          try {
            v3 = exports[k4];
          } catch {
            continue;
          }
          if (isZustandStore(v3)) out.set(k4, v3);
        }
      }
    });
    return out;
  }
  var reactCache = null;
  function getReact() {
    if (reactCache) return reactCache;
    reactCache = find((v3) => typeof v3.createElement === "function" && typeof v3.useState === "function" && typeof v3.Component === "function" && typeof v3.Fragment !== "undefined" && v3.version != null) || null;
    return reactCache;
  }

  // ../Userscriptpp/node_modules/preact/compat/dist/compat.module.js
  var compat_module_exports = {};
  __export(compat_module_exports, {
    Children: () => L2,
    Component: () => C,
    Fragment: () => S,
    PureComponent: () => M2,
    StrictMode: () => S,
    Suspense: () => P3,
    SuspenseList: () => B3,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => an,
    cloneElement: () => mn,
    createContext: () => X,
    createElement: () => k,
    createFactory: () => sn,
    createPortal: () => $2,
    createRef: () => M,
    default: () => gn,
    findDOMNode: () => yn,
    flushSync: () => bn,
    forwardRef: () => D3,
    hydrate: () => tn,
    isElement: () => Sn,
    isFragment: () => vn,
    isMemo: () => dn,
    isValidElement: () => hn,
    lazy: () => z3,
    memo: () => N2,
    render: () => nn,
    startTransition: () => x3,
    unmountComponentAtNode: () => pn,
    unstable_batchedUpdates: () => _n,
    useCallback: () => q2,
    useContext: () => x2,
    useDebugValue: () => P2,
    useDeferredValue: () => w3,
    useEffect: () => h3,
    useErrorBoundary: () => b2,
    useId: () => g2,
    useImperativeHandle: () => F2,
    useInsertionEffect: () => I2,
    useLayoutEffect: () => _2,
    useMemo: () => T2,
    useReducer: () => y2,
    useRef: () => A2,
    useState: () => d2,
    useSyncExternalStore: () => C3,
    useTransition: () => k3,
    version: () => cn
  });

  // ../Userscriptpp/node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t2;
  var i;
  var r;
  var o;
  var e;
  var f;
  var c;
  var a;
  var s;
  var h2;
  var p;
  var v;
  var y;
  var d = {};
  var w = [];
  var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var g = Array.isArray;
  function m(n2, l3) {
    for (var u3 in l3) n2[u3] = l3[u3];
    return n2;
  }
  function b(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function k(l3, u3, t4) {
    var i3, r3, o3, e3 = {};
    for (o3 in u3) "key" == o3 ? i3 = u3[o3] : "ref" == o3 ? r3 = u3[o3] : e3[o3] = u3[o3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
    return x(l3, e3, i3, r3, null);
  }
  function x(n2, t4, i3, r3, o3) {
    var e3 = { type: n2, props: t4, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
    return null == o3 && null != l.vnode && l.vnode(e3), e3;
  }
  function M() {
    return { current: null };
  }
  function S(n2) {
    return n2.children;
  }
  function C(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function $(n2, l3) {
    if (null == l3) return n2.__ ? $(n2.__, n2.__i + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) return u3.__e;
    return "function" == typeof n2.type ? $(n2) : null;
  }
  function I(n2) {
    if (n2.__P && n2.__d) {
      var u3 = n2.__v, t4 = u3.__e, i3 = [], r3 = [], o3 = m({}, u3);
      o3.__v = u3.__v + 1, l.vnode && l.vnode(o3), q(n2.__P, o3, u3, n2.__n, n2.__P.namespaceURI, 32 & u3.__u ? [t4] : null, i3, null == t4 ? $(u3) : t4, !!(32 & u3.__u), r3), o3.__v = u3.__v, o3.__.__k[o3.__i] = o3, D(i3, o3, r3), u3.__e = u3.__ = null, o3.__e != t4 && P(o3);
    }
  }
  function P(n2) {
    if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
      if (null != l3 && null != l3.__e) return n2.__e = n2.__c.base = l3.__e;
    }), P(n2);
  }
  function A(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
  }
  function H() {
    try {
      for (var n2, l3 = 1; i.length; ) i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, I(n2);
    } finally {
      i.length = H.__r = 0;
    }
  }
  function L(n2, l3, u3, t4, i3, r3, o3, e3, f3, c3, a3) {
    var s3, h5, p3, v3, y3, _3, g4 = t4 && t4.__k || w, m3 = l3.length;
    for (f3 = T(u3, l3, g4, f3, m3), s3 = 0; s3 < m3; s3++) null != (p3 = u3.__k[s3]) && (h5 = -1 != p3.__i && g4[p3.__i] || d, p3.__i = s3, _3 = q(n2, p3, h5, i3, r3, o3, e3, f3, c3, a3), v3 = p3.__e, p3.ref && h5.ref != p3.ref && (h5.ref && J(h5.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y3 && null != v3 && (y3 = v3), 4 & p3.__u ? (f3 = j(p3, f3, n2), h5.__e && (h5.__e = null)) : "function" == typeof p3.type && void 0 !== _3 ? f3 = _3 : v3 && (f3 = v3.nextSibling), p3.__u &= -7);
    return u3.__e = y3, f3;
  }
  function T(n2, l3, u3, t4, i3) {
    var r3, o3, e3, f3, c3, a3 = u3.length, s3 = a3, h5 = 0;
    for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n2.__k[r3] = x(null, o3, null, null, null) : g(o3) ? o3 = n2.__k[r3] = x(S, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n2.__k[r3] = x(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n2.__k[r3] = o3, f3 = r3 + h5, o3.__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = O(o3, u3, f3, s3)) && (s3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > a3 ? h5-- : i3 < a3 && h5++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h5-- : c3 == f3 + 1 ? h5++ : (c3 > f3 ? h5-- : h5++, o3.__u |= 4))) : n2.__k[r3] = null;
    if (s3) for (r3 = 0; r3 < a3; r3++) null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t4 && (t4 = $(e3)), K(e3, e3));
    return t4;
  }
  function j(n2, l3, u3) {
    var t4, i3;
    if ("function" == typeof n2.type) {
      for (t4 = n2.__k, i3 = 0; t4 && i3 < t4.length; i3++) t4[i3] && (t4[i3].__ = n2, l3 = j(t4[i3], l3, u3));
      return l3;
    }
    n2.__e != l3 && (l3 && n2.type && !l3.parentNode && (l3 = $(n2)), l3 = u3.insertBefore(n2.__e, l3 || null));
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function F(n2, l3) {
    return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (g(n2) ? n2.some(function(n3) {
      F(n3, l3);
    }) : l3.push(n2)), l3;
  }
  function O(n2, l3, u3, t4) {
    var i3, r3, o3, e3 = n2.key, f3 = n2.type, c3 = l3[u3], a3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == e3 || a3 && e3 == c3.key && f3 == c3.type) return u3;
    if (t4 > (a3 ? 1 : 0)) {
      for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return o3;
    }
    return -1;
  }
  function z(n2, l3, u3) {
    "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || _.test(l3) ? u3 : u3 + "px";
  }
  function N(n2, l3, u3, t4, i3) {
    var r3, o3;
    n: if ("style" == l3) if ("string" == typeof u3) n2.style.cssText = u3;
    else {
      if ("string" == typeof t4 && (n2.style.cssText = t4 = ""), t4) for (l3 in t4) u3 && l3 in u3 || z(n2.style, l3, "");
      if (u3) for (l3 in u3) t4 && u3[l3] == t4[l3] || z(n2.style, l3, u3[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? t4 ? u3[a] = t4[a] : (u3[a] = h2, n2.addEventListener(l3, r3 ? v : p, r3)) : n2.removeEventListener(l3, r3 ? v : p, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u3 ? "" : u3;
        break n;
      } catch (n3) {
      }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
    }
  }
  function V(n2) {
    return function(u3) {
      if (this.l) {
        var t4 = this.l[u3.type + n2];
        if (null == u3[c]) u3[c] = h2++;
        else if (u3[c] < t4[a]) return;
        return t4(l.event ? l.event(u3) : u3);
      }
    };
  }
  function q(n2, u3, t4, i3, r3, o3, e3, f3, c3, a3) {
    var s3, h5, p3, v3, y3, d3, _3, k4, x4, M3, I3, P4, A4, H3, T4, j4, F4 = u3.type;
    if (void 0 !== u3.constructor) return null;
    128 & t4.__u && (c3 = !!(32 & t4.__u), o3 = [f3 = u3.__e = t4.__e]), (s3 = l.__b) && s3(u3);
    n: if ("function" == typeof F4) {
      h5 = e3.length;
      try {
        if (x4 = u3.props, M3 = F4.prototype && F4.prototype.render, I3 = (s3 = F4.contextType) && i3[s3.__c], P4 = s3 ? I3 ? I3.props.value : s3.__ : i3, t4.__c ? k4 = (p3 = u3.__c = t4.__c).__ = p3.__E : (M3 ? u3.__c = p3 = new F4(x4, P4) : (u3.__c = p3 = new C(x4, P4), p3.constructor = F4, p3.render = Q), I3 && I3.sub(p3), p3.state || (p3.state = {}), p3.__n = i3, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M3 && null == p3.__s && (p3.__s = p3.state), M3 && null != F4.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m({}, p3.__s)), m(p3.__s, F4.getDerivedStateFromProps(x4, p3.__s))), y3 = p3.props, d3 = p3.state, p3.__v = u3, v3) M3 && null == F4.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M3 && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
        else {
          if (M3 && null == F4.getDerivedStateFromProps && x4 !== y3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x4, P4), u3.__v == t4.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x4, p3.__s, P4)) {
            u3.__v != t4.__v && (p3.props = x4, p3.state = p3.__s, p3.__d = false), u3.__e = t4.__e, u3.__k = t4.__k, u3.__k.some(function(n3) {
              n3 && (n3.__ = u3);
            }), w.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f3 = $(t4);
            break n;
          }
          null != p3.componentWillUpdate && p3.componentWillUpdate(x4, p3.__s, P4), M3 && null != p3.componentDidUpdate && p3.__h.push(function() {
            p3.componentDidUpdate(y3, d3, _3);
          });
        }
        if (p3.context = P4, p3.props = x4, p3.__P = n2, p3.__e = false, A4 = l.__r, H3 = 0, M3) p3.state = p3.__s, p3.__d = false, A4 && A4(u3), s3 = p3.render(p3.props, p3.state, p3.context), w.push.apply(p3.__h, p3._sb), p3._sb = [];
        else do {
          p3.__d = false, A4 && A4(u3), s3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
        } while (p3.__d && ++H3 < 25);
        p3.state = p3.__s, null != p3.getChildContext && (i3 = m(m({}, i3), p3.getChildContext())), M3 && !v3 && null != p3.getSnapshotBeforeUpdate && (_3 = p3.getSnapshotBeforeUpdate(y3, d3)), T4 = null != s3 && s3.type === S && null == s3.key ? E(s3.props.children) : s3, f3 = L(n2, g(T4) ? T4 : [T4], u3, t4, i3, r3, o3, e3, f3, c3, a3), p3.base = u3.__e, u3.__u &= -161, p3.__h.length && e3.push(p3), k4 && (p3.__E = p3.__ = null);
      } catch (n3) {
        if (e3.length = h5, u3.__v = null, c3 || null != o3) {
          if (n3.then) {
            for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
            null != o3 && (o3[o3.indexOf(f3)] = null), u3.__e = f3;
          } else if (null != o3) for (j4 = o3.length; j4--; ) b(o3[j4]);
        } else u3.__e = t4.__e;
        null == u3.__k && (u3.__k = t4.__k || []), n3.then || B(u3), l.__e(n3, u3, t4);
      }
    } else null == o3 && u3.__v == t4.__v ? (u3.__k = t4.__k, u3.__e = t4.__e) : f3 = u3.__e = G(t4.__e, u3, t4, i3, r3, o3, e3, c3, a3);
    return (s3 = l.diffed) && s3(u3), 128 & u3.__u ? void 0 : f3;
  }
  function B(n2) {
    n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
  }
  function D(n2, u3, t4) {
    for (var i3 = 0; i3 < t4.length; i3++) J(t4[i3], t4[++i3], t4[++i3]);
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function E(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
  }
  function G(u3, t4, i3, r3, o3, e3, f3, c3, a3) {
    var s3, h5, p3, v3, y3, w4, _3, m3 = i3.props || d, k4 = t4.props, x4 = t4.type;
    if ("svg" == x4 ? o3 = "http://www.w3.org/2000/svg" : "math" == x4 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (s3 = 0; s3 < e3.length; s3++) if ((y3 = e3[s3]) && "setAttribute" in y3 == !!x4 && (x4 ? y3.localName == x4 : 3 == y3.nodeType)) {
        u3 = y3, e3[s3] = null;
        break;
      }
    }
    if (null == u3) {
      if (null == x4) return document.createTextNode(k4);
      u3 = document.createElementNS(o3, x4, k4.is && k4), c3 && (l.__m && l.__m(t4, e3), c3 = false), e3 = null;
    }
    if (null == x4) m3 === k4 || c3 && u3.data == k4 || (u3.data = k4);
    else {
      if (e3 = "textarea" == x4 && null != k4.defaultValue ? null : e3 && n.call(u3.childNodes), !c3 && null != e3) for (m3 = {}, s3 = 0; s3 < u3.attributes.length; s3++) m3[(y3 = u3.attributes[s3]).name] = y3.value;
      for (s3 in m3) y3 = m3[s3], "dangerouslySetInnerHTML" == s3 ? p3 = y3 : "children" == s3 || s3 in k4 || "value" == s3 && "defaultValue" in k4 || "checked" == s3 && "defaultChecked" in k4 || N(u3, s3, null, y3, o3);
      for (s3 in k4) y3 = k4[s3], "children" == s3 ? v3 = y3 : "dangerouslySetInnerHTML" == s3 ? h5 = y3 : "value" == s3 ? w4 = y3 : "checked" == s3 ? _3 = y3 : c3 && "function" != typeof y3 || m3[s3] === y3 || N(u3, s3, y3, m3[s3], o3);
      if (h5) c3 || p3 && (h5.__html == p3.__html || h5.__html == u3.innerHTML) || (u3.innerHTML = h5.__html), t4.__k = [];
      else if (p3 && (u3.innerHTML = ""), L("template" == t4.type ? u3.content : u3, g(v3) ? v3 : [v3], t4, i3, r3, "foreignObject" == x4 ? "http://www.w3.org/1999/xhtml" : o3, e3, f3, e3 ? e3[0] : i3.__k && $(i3, 0), c3, a3), null != e3) for (s3 = e3.length; s3--; ) b(e3[s3]);
      c3 && "textarea" != x4 || (s3 = "value", "progress" == x4 && null == w4 ? u3.removeAttribute("value") : null != w4 && (w4 !== u3[s3] || "progress" == x4 && !w4 || "option" == x4 && w4 != m3[s3]) && N(u3, s3, w4, m3[s3], o3), s3 = "checked", null != _3 && _3 != u3[s3] && N(u3, s3, _3, m3[s3], o3));
    }
    return u3;
  }
  function J(n2, u3, t4) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
      } else n2.current = u3;
    } catch (n3) {
      l.__e(n3, t4);
    }
  }
  function K(n2, u3, t4) {
    var i3, r3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || J(i3, null, u3)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
      i3.base = i3.__P = i3.__n = null;
    }
    if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && K(i3[r3], u3, t4 || "function" != typeof n2.type);
    t4 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function Q(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function R(u3, t4, i3) {
    var r3, o3, e3, f3;
    t4 == document && (t4 = document.documentElement), l.__ && l.__(u3, t4), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t4.__k, e3 = [], f3 = [], q(t4, u3 = (!r3 && i3 || t4).__k = k(S, null, [u3]), o3 || d, d, t4.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t4.firstChild ? n.call(t4.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t4.firstChild, r3, f3), D(e3, u3, f3), u3.props.children = null;
  }
  function U2(n2, l3) {
    R(n2, l3, U2);
  }
  function W2(l3, u3, t4) {
    var i3, r3, o3, e3, f3 = m({}, l3.props);
    for (o3 in l3.type && l3.type.defaultProps && (e3 = l3.type.defaultProps), u3) "key" == o3 ? i3 = u3[o3] : "ref" == o3 ? r3 = u3[o3] : f3[o3] = void 0 === u3[o3] && null != e3 ? e3[o3] : u3[o3];
    return arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : t4), x(l3.type, f3, i3 || l3.key, r3 || l3.ref, null);
  }
  function X(n2) {
    function l3(n3) {
      var u3, t4;
      return this.getChildContext || (u3 = /* @__PURE__ */ new Set(), (t4 = {})[l3.__c] = this, this.getChildContext = function() {
        return t4;
      }, this.componentWillUnmount = function() {
        u3 = null;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value != n4.value && u3.forEach(function(n5) {
          n5.__e = true, A(n5);
        });
      }, this.sub = function(n4) {
        u3.add(n4);
        var l4 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u3 && u3.delete(n4), l4 && l4.call(n4);
        };
      }), n3.children;
    }
    return l3.__c = "__cC" + y++, l3.__ = n2, l3.Provider = l3.__l = (l3.Consumer = function(n3, l4) {
      return n3.children(l4);
    }).contextType = l3, l3;
  }
  n = w.slice, l = { __e: function(n2, l3, u3, t4) {
    for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
      if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t4 || {}), o3 = i3.__d), o3) return i3.__E = i3;
    } catch (l4) {
      n2 = l4;
    }
    throw n2;
  } }, u = 0, t2 = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, C.prototype.setState = function(n2, l3) {
    var u3;
    u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u3), this.props)), n2 && m(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), A(this));
  }, C.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
  }, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
    return n2.__v.__b - l3.__v.__b;
  }, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h2 = 0, p = V(false), v = V(true), y = 0;

  // ../Userscriptpp/node_modules/preact/hooks/dist/hooks.module.js
  var t3;
  var r2;
  var u2;
  var i2;
  var o2 = 0;
  var f2 = [];
  var c2 = l;
  var e2 = c2.__b;
  var a2 = c2.__r;
  var v2 = c2.diffed;
  var l2 = c2.__c;
  var m2 = c2.unmount;
  var p2 = c2.__;
  function s2(n2, t4) {
    c2.__h && c2.__h(r2, n2, o2 || t4), o2 = 0;
    var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
  }
  function d2(n2) {
    return o2 = 1, y2(D2, n2);
  }
  function y2(n2, u3, i3) {
    var o3 = s2(t3++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
      var t4 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t4, n3);
      t4 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f3 = function(n3, t4, r3) {
        if (!o3.__c.__H) return true;
        var u4 = false, i4 = o3.__c.props !== n3;
        if (o3.__c.__H.__.some(function(n4) {
          if (n4.__N) {
            u4 = true;
            var t5 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t5 !== n4.__[0] && (i4 = true);
          }
        }), c3) {
          var f4 = c3.call(this, n3, t4, r3);
          return u4 ? f4 || i4 : f4;
        }
        return !u4 || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t4, r3) {
        if (this.__e) {
          var u4 = c3;
          c3 = void 0, f3(n3, t4, r3), c3 = u4;
        }
        e3 && e3.call(this, n3, t4, r3);
      }, r2.shouldComponentUpdate = f3;
    }
    return o3.__N || o3.__;
  }
  function h3(n2, u3) {
    var i3 = s2(t3++, 3);
    !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
  }
  function _2(n2, u3) {
    var i3 = s2(t3++, 4);
    !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__h.push(i3));
  }
  function A2(n2) {
    return o2 = 5, T2(function() {
      return { current: n2 };
    }, []);
  }
  function F2(n2, t4, r3) {
    o2 = 6, _2(function() {
      if ("function" == typeof n2) {
        var r4 = n2(t4());
        return function() {
          n2(null), r4 && "function" == typeof r4 && r4();
        };
      }
      if (n2) return n2.current = t4(), function() {
        return n2.current = null;
      };
    }, null == r3 ? r3 : r3.concat(n2));
  }
  function T2(n2, r3) {
    var u3 = s2(t3++, 7);
    return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
  }
  function q2(n2, t4) {
    return o2 = 8, T2(function() {
      return n2;
    }, t4);
  }
  function x2(n2) {
    var u3 = r2.context[n2.__c], i3 = s2(t3++, 9);
    return i3.c = n2, u3 ? (null == i3.__ && (i3.__ = true, u3.sub(r2)), u3.props.value) : n2.__;
  }
  function P2(n2, t4) {
    c2.useDebugValue && c2.useDebugValue(t4 ? t4(n2) : n2);
  }
  function b2(n2) {
    var u3 = s2(t3++, 10), i3 = d2();
    return u3.__ = n2, r2.componentDidCatch || (r2.componentDidCatch = function(n3, t4) {
      u3.__ && u3.__(n3, t4), i3[1](n3);
    }), [i3[0], function() {
      i3[1](void 0);
    }];
  }
  function g2() {
    var n2 = s2(t3++, 11);
    if (!n2.__) {
      for (var u3 = r2.__v; null !== u3 && !u3.__m && null !== u3.__; ) u3 = u3.__;
      var i3 = u3.__m || (u3.__m = [0, 0]);
      n2.__ = "P" + i3[0] + "-" + i3[1]++;
    }
    return n2.__;
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) {
      var t4 = n2.__H;
      if (n2.__P && t4) try {
        t4.__h.some(z2), t4.__h.some(B2), t4.__h = [];
      } catch (r3) {
        t4.__h = [], c2.__e(r3, n2.__v);
      }
    }
  }
  c2.__b = function(n2) {
    r2 = null, e2 && e2(n2);
  }, c2.__ = function(n2, t4) {
    n2 && t4.__k && t4.__k.__m && (n2.__m = t4.__k.__m), p2 && p2(n2, t4);
  }, c2.__r = function(n2) {
    a2 && a2(n2), t3 = 0;
    var i3 = (r2 = n2.__c).__H;
    i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t3 = 0)), u2 = r2;
  }, c2.diffed = function(n2) {
    v2 && v2(n2);
    var t4 = n2.__c;
    t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.some(function(n3) {
      n3.u && (n3.__H = n3.u, n3.u = void 0);
    })), u2 = r2 = null;
  }, c2.__c = function(n2, t4) {
    t4.some(function(n3) {
      try {
        n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B2(n4);
        });
      } catch (r3) {
        t4.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t4 = [], c2.__e(r3, n3.__v);
      }
    }), l2 && l2(n2, t4);
  }, c2.unmount = function(n2) {
    m2 && m2(n2);
    var t4, r3 = n2.__c;
    r3 && r3.__H && (r3.__H.__.some(function(n3) {
      try {
        z2(n3);
      } catch (n4) {
        t4 = n4;
      }
    }), r3.__H = void 0, t4 && c2.__e(t4, r3.__v));
  };
  var k2 = "function" == typeof requestAnimationFrame;
  function w2(n2) {
    var t4, r3 = function() {
      clearTimeout(u3), k2 && cancelAnimationFrame(t4), setTimeout(n2);
    }, u3 = setTimeout(r3, 35);
    k2 && (t4 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t4 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t4;
  }
  function B2(n2) {
    var t4 = r2;
    n2.__c = n2.__(), r2 = t4;
  }
  function C2(n2, t4) {
    return !n2 || n2.length !== t4.length || t4.some(function(t5, r3) {
      return t5 !== n2[r3];
    });
  }
  function D2(n2, t4) {
    return "function" == typeof t4 ? t4(n2) : t4;
  }

  // ../Userscriptpp/node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t4) {
    for (var e3 in t4) n2[e3] = t4[e3];
    return n2;
  }
  function E2(n2, t4) {
    for (var e3 in n2) if ("__source" !== e3 && !(e3 in t4)) return true;
    for (var r3 in t4) if ("__source" !== r3 && n2[r3] !== t4[r3]) return true;
    return false;
  }
  function C3(n2, t4) {
    var e3 = t4(), r3 = d2({ t: { __: e3, u: t4 } }), u3 = r3[0].t, o3 = r3[1];
    return _2(function() {
      u3.__ = e3, u3.u = t4, R2(u3) && o3({ t: u3 });
    }, [n2, e3, t4]), h3(function() {
      return R2(u3) && o3({ t: u3 }), n2(function() {
        R2(u3) && o3({ t: u3 });
      });
    }, [n2]), e3;
  }
  function R2(n2) {
    try {
      return !((t4 = n2.__) === (e3 = n2.u()) && (0 !== t4 || 1 / t4 == 1 / e3) || t4 != t4 && e3 != e3);
    } catch (n3) {
      return true;
    }
    var t4, e3;
  }
  function x3(n2) {
    n2();
  }
  function w3(n2) {
    return n2;
  }
  function k3() {
    return [false, x3];
  }
  var I2 = _2;
  function M2(n2, t4) {
    this.props = n2, this.context = t4;
  }
  function N2(n2, e3) {
    function r3(n3) {
      var t4 = this.props.ref;
      return t4 != n3.ref && t4 && ("function" == typeof t4 ? t4(null) : t4.current = null), e3 ? !e3(this.props, n3) || t4 != n3.ref : E2(this.props, n3);
    }
    function u3(e4) {
      return this.shouldComponentUpdate = r3, k(n2, e4);
    }
    return u3.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u3.__f = u3.prototype.isReactComponent = true, u3.type = n2, u3;
  }
  (M2.prototype = new C()).isPureReactComponent = true, M2.prototype.shouldComponentUpdate = function(n2, t4) {
    return E2(this.props, n2) || E2(this.state, t4);
  };
  var T3 = l.__b;
  l.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
  };
  var A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function D3(n2) {
    function t4(t5) {
      var e3 = g3({}, t5);
      return delete e3.ref, n2(e3, t5.ref || null);
    }
    return t4.$$typeof = A3, t4.render = n2, t4.prototype.isReactComponent = t4.__f = true, t4.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t4;
  }
  var F3 = function(n2, t4) {
    return null == n2 ? null : F(F(n2).map(t4));
  };
  var L2 = { map: F3, forEach: F3, count: function(n2) {
    return n2 ? F(n2).length : 0;
  }, only: function(n2) {
    var t4 = F(n2);
    if (1 !== t4.length) throw "Children.only";
    return t4[0];
  }, toArray: F };
  var O2 = l.__e;
  l.__e = function(n2, t4, e3, r3) {
    if (n2.then) {
      for (var u3, o3 = t4; o3 = o3.__; ) if ((u3 = o3.__c) && u3.__c) return null == t4.__e && (t4.__e = e3.__e, t4.__k = e3.__k || []), u3.__c(n2, t4);
    }
    O2(n2, t4, e3, r3);
  };
  var U3 = l.unmount;
  function V2(n2, t4, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t4), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V2(n3, t4, e3);
    })), n2;
  }
  function W3(n2, t4, e3) {
    return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W3(n3, t4, e3);
    }), n2.__c && n2.__c.__P === t4 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function P3() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j3(n2) {
    var t4 = n2.__ && n2.__.__c;
    return t4 && t4.__a && t4.__a(n2);
  }
  function z3(n2) {
    var e3, r3, u3, o3 = null;
    function i3(i4) {
      if (e3 || (e3 = n2()).then(function(n3) {
        n3 && (o3 = n3.default || n3), u3 = true;
      }, function(n3) {
        r3 = n3, u3 = true;
      }), r3) throw r3;
      if (!u3) throw e3;
      return o3 ? k(o3, i4) : null;
    }
    return i3.displayName = "Lazy", i3.__f = true, i3;
  }
  function B3() {
    this.i = null, this.l = null;
  }
  l.unmount = function(n2) {
    var t4 = n2.__c;
    t4 && (t4.__z = true), t4 && t4.__R && t4.__R(), t4 && 32 & n2.__u && (n2.type = null), U3 && U3(n2);
  }, (P3.prototype = new C()).__c = function(n2, t4) {
    var e3 = t4.__c, r3 = this;
    null == r3.o && (r3.o = []), r3.o.push(e3);
    var u3 = j3(r3.__v), o3 = false, i3 = function() {
      o3 || r3.__z || (o3 = true, e3.__R = null, u3 ? u3(f3) : f3());
    };
    e3.__R = i3;
    var l3 = e3.__P;
    e3.__P = null;
    var f3 = function() {
      if (!--r3.__u) {
        if (r3.state.__a) {
          var n3 = r3.state.__a;
          r3.__v.__k[0] = W3(n3, n3.__c.__P, n3.__c.__O);
        }
        var t5;
        for (r3.setState({ __a: r3.__b = null }); t5 = r3.o.pop(); ) t5.__P = l3, t5.forceUpdate();
      }
    };
    r3.__u++ || 32 & t4.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
  }, P3.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P3.prototype.render = function(n2, e3) {
    if (this.__b) {
      if (this.__v.__k) {
        var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
        this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
      }
      this.__b = null;
    }
    var i3 = e3.__a && k(S, null, n2.fallback);
    return i3 && (i3.__u &= -33), [k(S, null, e3.__a ? null : n2.children), i3];
  };
  var H2 = function(n2, t4, e3) {
    if (++e3[1] === e3[0] && n2.l.delete(t4), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
      for (; e3.length > 3; ) e3.pop()();
      if (e3[1] < e3[0]) break;
      n2.i = e3 = e3[2];
    }
  };
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e3 = this, r3 = n2.h;
    if (e3.componentWillUnmount = function() {
      R(null, e3.v), e3.v = null, e3.h = null;
    }, e3.h && e3.h !== r3 && e3.componentWillUnmount(), !e3.v) {
      for (var u3 = e3.__v; null !== u3 && !u3.__m && null !== u3.__; ) u3 = u3.__;
      e3.h = r3, e3.v = { nodeType: 1, parentNode: r3, childNodes: [], __k: { __m: u3.__m }, contains: function() {
        return true;
      }, namespaceURI: r3.namespaceURI, insertBefore: function(n3, t4) {
        this.childNodes.push(n3), e3.h.insertBefore(n3, t4);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.h.removeChild(n3);
      } };
    }
    R(k(Z, { context: e3.context }, n2.__v), e3.v);
  }
  function $2(n2, e3) {
    var r3 = k(Y, { __v: n2, h: e3 });
    return r3.containerInfo = e3, r3;
  }
  (B3.prototype = new C()).__a = function(n2) {
    var t4 = this, e3 = j3(t4.__v), r3 = t4.l.get(n2);
    return r3[0]++, function(u3) {
      var o3 = function() {
        t4.props.revealOrder ? (r3.push(u3), H2(t4, n2, r3)) : u3();
      };
      e3 ? e3(o3) : o3();
    };
  }, B3.prototype.render = function(n2) {
    this.i = null, this.l = /* @__PURE__ */ new Map();
    var t4 = F(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t4.reverse();
    for (var e3 = t4.length; e3--; ) this.l.set(t4[e3], this.i = [1, 0, this.i]);
    return n2.children;
  }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
    var n2 = this;
    this.l.forEach(function(t4, e3) {
      H2(n2, e3, t4);
    });
  };
  var q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
  var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
  var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
  var K2 = /[A-Z0-9]/g;
  var Q2 = "undefined" != typeof document;
  var X2 = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function nn(n2, t4, e3) {
    return null == t4.__k && (t4.textContent = ""), R(n2, t4), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
  }
  function tn(n2, t4, e3) {
    return U2(n2, t4), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
  }
  C.prototype.isReactComponent = true, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t4) {
    Object.defineProperty(C.prototype, t4, { configurable: true, get: function() {
      return this["UNSAFE_" + t4];
    }, set: function(n2) {
      Object.defineProperty(this, t4, { configurable: true, writable: true, value: n2 });
    } });
  });
  var en = l.event;
  l.event = function(n2) {
    return en && (n2 = en(n2)), n2.persist = function() {
    }, n2.isPropagationStopped = function() {
      return this.cancelBubble;
    }, n2.isDefaultPrevented = function() {
      return this.defaultPrevented;
    }, n2.nativeEvent = n2;
  };
  var rn;
  var un = { configurable: true, get: function() {
    return this.class;
  } };
  var on = l.vnode;
  l.vnode = function(n2) {
    "string" == typeof n2.type && (function(n3) {
      var t4 = n3.props, e3 = n3.type, u3 = {}, o3 = -1 == e3.indexOf("-");
      for (var i3 in t4) {
        var l3 = t4[i3];
        if (!("value" === i3 && "defaultValue" in t4 && null == l3 || Q2 && "children" === i3 && "noscript" === e3 || "class" === i3 || "className" === i3)) {
          var f3 = i3.toLowerCase();
          "defaultValue" === i3 && "value" in t4 && null == t4.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : "translate" === f3 && "no" === l3 ? l3 = false : "o" === f3[0] && "n" === f3[1] ? "ondoubleclick" === f3 ? i3 = "ondblclick" : "onchange" !== f3 || "input" !== e3 && "textarea" !== e3 || X2(t4.type) ? "onfocus" === f3 ? i3 = "onfocusin" : "onblur" === f3 ? i3 = "onfocusout" : J2.test(i3) && (i3 = f3) : f3 = i3 = "oninput" : o3 && G2.test(i3) ? i3 = i3.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === f3 && u3[i3 = f3] && (i3 = "oninputCapture"), u3[i3] = l3;
        }
      }
      "select" == e3 && (u3.multiple && Array.isArray(u3.value) && (u3.value = F(t4.children).forEach(function(n4) {
        n4.props.selected = -1 != u3.value.indexOf(n4.props.value);
      })), null != u3.defaultValue && (u3.value = F(t4.children).forEach(function(n4) {
        n4.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n4.props.value) : u3.defaultValue == n4.props.value;
      }))), t4.class && !t4.className ? (u3.class = t4.class, Object.defineProperty(u3, "className", un)) : t4.className && (u3.class = u3.className = t4.className), n3.props = u3;
    })(n2), n2.$$typeof = q3, on && on(n2);
  };
  var ln = l.__r;
  l.__r = function(n2) {
    ln && ln(n2), rn = n2.__c;
  };
  var fn = l.diffed;
  l.diffed = function(n2) {
    fn && fn(n2);
    var t4 = n2.props, e3 = n2.__e;
    null != e3 && "textarea" === n2.type && "value" in t4 && t4.value !== e3.value && (e3.value = null == t4.value ? "" : t4.value), rn = null;
  };
  var an = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return rn.__n[n2.__c].props.value;
  }, useCallback: q2, useContext: x2, useDebugValue: P2, useDeferredValue: w3, useEffect: h3, useId: g2, useImperativeHandle: F2, useInsertionEffect: I2, useLayoutEffect: _2, useMemo: T2, useReducer: y2, useRef: A2, useState: d2, useSyncExternalStore: C3, useTransition: k3 } } };
  var cn = "18.3.1";
  function sn(n2) {
    return k.bind(null, n2);
  }
  function hn(n2) {
    return !!n2 && n2.$$typeof === q3;
  }
  function vn(n2) {
    return hn(n2) && n2.type === S;
  }
  function dn(n2) {
    return !!n2 && "string" == typeof n2.displayName && 0 == n2.displayName.indexOf("Memo(");
  }
  function mn(n2) {
    return hn(n2) ? W2.apply(null, arguments) : n2;
  }
  function pn(n2) {
    return !!n2.__k && (R(null, n2), true);
  }
  function yn(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var _n = function(n2, t4) {
    return n2(t4);
  };
  var bn = function(n2, t4) {
    var r3, u3 = l.debounceRendering;
    l.debounceRendering = function(n3) {
      r3 = n3;
    };
    try {
      var o3 = n2(t4);
      return r3 && r3(), o3;
    } finally {
      l.debounceRendering = u3;
    }
  };
  var Sn = hn;
  var gn = { useState: d2, useId: g2, useReducer: y2, useEffect: h3, useLayoutEffect: _2, useInsertionEffect: I2, useTransition: k3, useDeferredValue: w3, useSyncExternalStore: C3, startTransition: x3, useRef: A2, useImperativeHandle: F2, useMemo: T2, useCallback: q2, useContext: x2, useDebugValue: P2, version: "18.3.1", Children: L2, render: nn, hydrate: tn, unmountComponentAtNode: pn, createPortal: $2, createElement: k, createContext: X, createFactory: sn, cloneElement: mn, createRef: M, Fragment: S, isValidElement: hn, isElement: Sn, isFragment: vn, isMemo: dn, findDOMNode: yn, Component: C, PureComponent: M2, memo: N2, forwardRef: D3, flushSync: bn, unstable_batchedUpdates: _n, StrictMode: S, Suspense: P3, SuspenseList: B3, lazy: z3, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: an };

  // ../Userscriptpp/core/ui/react.js
  var bundled = Object.freeze({
    name: "preact",
    site: false,
    React: compat_module_exports,
    createRoot: (container2) => ({ render: (v3) => nn(v3, container2), unmount: () => nn(null, container2) }),
    createPortal: $2,
    flushSync: bn ?? ((fn2) => fn2())
  });
  var locked = null;
  var siteReadyFlag = false;
  function markSiteReady() {
    siteReadyFlag = true;
  }
  function getRenderer() {
    if (locked) return locked;
    const site = getSite();
    if (typeof site.renderer === "function") {
      let r3 = null;
      try {
        r3 = site.renderer();
      } catch {
        r3 = null;
      }
      if (r3 && r3.React && typeof r3.createRoot === "function") return locked = Object.freeze({ name: "site", site: true, flushSync: (fn2) => fn2(), ...r3 });
      if (!siteReadyFlag) return null;
    }
    return locked = bundled;
  }
  var getReact2 = () => getRenderer()?.React ?? null;
  var usingSiteRenderer = () => !!getRenderer()?.site;
  function siteComponent(name) {
    if (!usingSiteRenderer() || diag.noSiteComponents) return null;
    const c3 = getSite().components;
    try {
      return (typeof c3 === "function" ? c3(name) : c3?.[name]) ?? null;
    } catch {
      return null;
    }
  }
  var Fragment2 = Symbol.for("react.fragment");
  function h4(type, props, ...children) {
    const R3 = getReact2();
    if (!R3) throw new Error("Userscript++: 渲染器尚未就绪");
    if (type === Fragment2) type = R3.Fragment;
    return R3.createElement(type, props, ...children);
  }
  var hook = (name) => (...args) => getReact2()[name](...args);
  var useState2 = hook("useState");
  var useEffect2 = hook("useEffect");
  var useLayoutEffect = hook("useLayoutEffect");
  var useMemo = hook("useMemo");
  var useRef2 = hook("useRef");
  var useCallback = hook("useCallback");
  var useReducer2 = hook("useReducer");
  var useContext = hook("useContext");
  var useId = hook("useId");
  var useSyncExternalStore = hook("useSyncExternalStore");
  function useForceUpdate() {
    const [, f3] = useReducer2((x4) => x4 + 1, 0);
    return f3;
  }
  function useSubscription(subscribe6) {
    const force = useForceUpdate();
    useEffect2(() => subscribe6(() => force()), []);
  }
  var EBs = /* @__PURE__ */ new WeakMap();
  function getErrorBoundary() {
    const R3 = getReact2();
    if (!R3) return null;
    if (EBs.has(R3)) return EBs.get(R3);
    class ErrorBoundary2 extends R3.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error };
      }
      componentDidCatch(error, info) {
        console.error("[Userscript++] 组件渲染出错", this.props.label || "", error, info?.componentStack);
        this.props.onError?.(error);
      }
      render() {
        if (this.state.error) {
          const fb = this.props.fallback;
          return typeof fb === "function" ? fb(this.state.error) : fb ?? null;
        }
        return this.props.children ?? null;
      }
    }
    EBs.set(R3, ErrorBoundary2);
    return ErrorBoundary2;
  }
  function ErrorBoundary(props) {
    const C4 = getErrorBoundary();
    return C4 ? h4(C4, props) : props.children;
  }
  ErrorBoundary.wrap = (Component, fallback = null) => {
    const Wrapped = (props) => h4(ErrorBoundary, { fallback, label: Component.displayName || Component.name }, h4(Component, props));
    Wrapped.displayName = `UsppBoundary(${Component.displayName || Component.name || "Component"})`;
    return Wrapped;
  };

  // ../Userscriptpp/core/lib/plugins.js
  var logger9 = new Logger("PluginManager", "#a5b4fc");
  var StartAt = Object.freeze({
    Init: "Init",
    DOMContentLoaded: "DOMContentLoaded",
    SiteReady: "SiteReady",
    // 旧名:Turbopack 站点上"模块稳定"就是站点就绪
    TurbopackReady: "SiteReady"
  });
  var OptionType = Object.freeze({
    STRING: 0,
    NUMBER: 1,
    BIGINT: 2,
    BOOLEAN: 3,
    SELECT: 4,
    SLIDER: 5,
    COMPONENT: 6,
    CUSTOM: 7
  });
  var plugins = {};
  var depEnabled = /* @__PURE__ */ new Set();
  var runtimeRegistered = /* @__PURE__ */ new Set();
  var otherSites = /* @__PURE__ */ new Set();
  var cleanup = /* @__PURE__ */ new Map();
  var definePlugin = (def) => def;
  function definePluginSettings(def, checks) {
    const ds = {
      def,
      checks: checks ?? {},
      pluginName: null,
      get store() {
        if (!this.pluginName) throw new Error("插件注册前不能访问 settings.store");
        return Settings.plugins[this.pluginName];
      },
      get plain() {
        if (!this.pluginName) throw new Error("插件注册前不能访问 settings.plain");
        return PlainSettings.plugins[this.pluginName] ??= {};
      },
      use(keys) {
        const React = getReact2();
        const [, force] = React.useReducer((x4) => x4 + 1, 0);
        const name = this.pluginName;
        React.useEffect(() => {
          const prefix2 = `plugins.${name}.`;
          const fn2 = (_3, path) => {
            const key = path.slice(prefix2.length).split(".")[0];
            if (!keys || keys.includes(key)) force();
          };
          SettingsStore.addPrefixChangeListener(prefix2, fn2);
          return () => SettingsStore.removePrefixChangeListener(prefix2, fn2);
        }, [name]);
        return this.store;
      },
      withPrivateSettings() {
        return this;
      }
    };
    return ds;
  }
  function getSettingDefault(setting) {
    if (!setting) return void 0;
    if (setting.type === OptionType.SELECT) return setting.options?.find((o3) => o3.default)?.value;
    return setting.default;
  }
  setDefaultResolver((pluginName, key) => {
    if (key === "enabled") return void 0;
    const s3 = plugins[pluginName]?.settings?.def?.[key];
    return getSettingDefault(s3);
  });
  function isPluginEnabled(name) {
    const p3 = plugins[name];
    if (!p3) return false;
    if (p3.chromiumOnly && !isChromium()) return false;
    if (p3.required || depEnabled.has(name)) return true;
    const stored = PlainSettings.plugins[name]?.enabled;
    if (typeof stored === "boolean") return stored;
    return !!p3.enabledByDefault;
  }
  var isEnabledAsDependency = (name) => depEnabled.has(name);
  var pluginHasPatches = (p3) => Array.isArray(p3.patches) && p3.patches.length > 0;
  var needsRestart = (p3) => pluginHasPatches(p3) && !!getSite().driver || !!p3.requiresRestart;
  function bindMethods(p3) {
    for (const k4 of Object.keys(p3)) {
      if (k4 === "start" || k4 === "stop") continue;
      const v3 = p3[k4];
      if (typeof v3 === "function" && !v3.$$uspp_cttf_Bound && !(v3.prototype && v3.prototype.isReactComponent) && k4 !== "icon") {
        const bound = v3.bind(p3);
        Object.defineProperty(bound, "$$uspp_cttf_Bound", { value: true });
        p3[k4] = bound;
      }
    }
  }
  function addPlugin(def, { runtime: runtime3 = false } = {}) {
    if (!def || !def.name) throw new Error("插件必须有 name");
    if (plugins[def.name]) return false;
    if (def.dev && !IS_DEV) return false;
    if (def.site == null) def.site = runtime3 ? getSite().id : "*";
    if (def.site !== "*" && def.site !== getSite().id) {
      otherSites.add(def.name);
      if (runtime3) logger9.warn(`${def.name} 属于站点 ${def.site},不是当前站点,未注册`);
      return false;
    }
    const p3 = def;
    p3.started = false;
    if (p3.settings) p3.settings.pluginName = p3.name;
    bindMethods(p3);
    PlainSettings.plugins[p3.name] ??= {};
    plugins[p3.name] = p3;
    if (runtime3) runtimeRegistered.add(p3.name);
    return true;
  }
  var patchesNotApplicable = /* @__PURE__ */ new Set();
  var siteHasDriver = () => !!getSite().driver;
  function registerPatches() {
    for (const p3 of Object.values(plugins)) {
      if (!pluginHasPatches(p3) || runtimeRegistered.has(p3.name)) continue;
      if (!siteHasDriver()) {
        patchesNotApplicable.add(p3.name);
        continue;
      }
      const enabled = isPluginEnabled(p3.name);
      if (!enabled && !IS_DEV) continue;
      p3.patches.forEach((patch, i3) => {
        try {
          addPatch(patch, p3.name, { checkOnly: !enabled, key: `${p3.name}#${i3}` });
        } catch (e3) {
          logger9.error(`登记 ${p3.name} 的第 ${i3} 条补丁失败`, e3);
        }
      });
    }
  }
  function pluginSlots(p3) {
    const out = { ...p3.slots || {} };
    const aliases = getSite().pluginAliases || {};
    for (const [field, map] of Object.entries(aliases)) {
      if (p3[field] == null || typeof map !== "function") continue;
      let extra2 = null;
      try {
        extra2 = map(p3[field], p3);
      } catch (e3) {
        logger9.error(`${p3.name}.${field} 转换失败`, e3);
      }
      for (const [slot, v3] of Object.entries(extra2 || {})) {
        if (v3 == null) continue;
        out[slot] = out[slot] ? [].concat(out[slot], v3) : v3;
      }
    }
    return out;
  }
  function track(name, fn2) {
    let list = cleanup.get(name);
    if (!list) cleanup.set(name, list = []);
    list.push(fn2);
  }
  function runCleanup(name) {
    const list = cleanup.get(name) || [];
    cleanup.delete(name);
    for (const fn2 of list.reverse()) {
      try {
        fn2();
      } catch (e3) {
        logger9.error(`${name} 清理出错`, e3);
      }
    }
  }
  function subscribeZustand(p3) {
    for (const [storeName, conf] of Object.entries(p3.zustand || {})) {
      let unsub = null, cancelled = false;
      const attach = (store2) => {
        if (cancelled) return;
        const handler = (cur, prev) => {
          try {
            conf.handler.call(p3, cur, prev);
          } catch (e3) {
            logger9.error(`${p3.name} 的 ${storeName} 处理函数出错`, e3);
          }
        };
        if (conf.selector) {
          if (store2.subscribe.length >= 2) {
            try {
              unsub = store2.subscribe(conf.selector, handler);
              if (typeof unsub === "function") return;
            } catch {
            }
          }
          let last2 = conf.selector(store2.getState());
          unsub = store2.subscribe((state) => {
            const next = conf.selector(state);
            if (Object.is(next, last2)) return;
            const prev = last2;
            last2 = next;
            handler(next, prev);
          });
        } else {
          unsub = store2.subscribe(handler);
        }
      };
      const store = findStore(storeName);
      let cancelWait = null;
      if (store) attach(store);
      else cancelWait = waitFor(filters.byStoreName(storeName), (m3) => {
        const key = "use" + storeName.replace(/^use/, "").replace(/Store$/, "") + "Store";
        attach(m3[key]);
      });
      track(p3.name, () => {
        cancelled = true;
        cancelWait?.();
        if (typeof unsub === "function") unsub();
      });
    }
  }
  function startPlugin(p3, stack = []) {
    if (typeof p3 === "string") p3 = plugins[p3];
    if (!p3) return false;
    if (p3.started) return true;
    if (diag.disablePlugins.includes(p3.name)) {
      trace("plugin.start.skipped", p3.name);
      return false;
    }
    trace("plugin.start", p3.name);
    if (stack.includes(p3.name)) {
      logger9.error(`发现循环依赖:${[...stack, p3.name].join(" -> ")}`);
      return false;
    }
    for (const dep of p3.dependencies || []) {
      const d3 = plugins[dep];
      if (!d3) {
        logger9.warn(`${p3.name} 依赖的插件 ${dep} 不存在`);
        return false;
      }
      if (!d3.started) {
        if (!isPluginEnabled(dep)) {
          depEnabled.add(dep);
          Settings.plugins[dep].enabled = true;
        }
        if (!startPlugin(d3, [...stack, p3.name])) return false;
      }
    }
    try {
      if (p3.managedStyle) {
        enableStyle(p3.managedStyle);
        if (!pluginHasPatches(p3)) track(p3.name, () => disableStyle(p3.managedStyle));
      }
      p3.start?.();
      for (const [slot, value] of Object.entries(pluginSlots(p3))) {
        const list = Array.isArray(value) ? value : [value];
        list.forEach((item, i3) => {
          if (!item) return;
          const id = list.length > 1 ? `${p3.name}:${i3}` : p3.name;
          addSlotItem(slot, id, item);
          track(p3.name, () => removeSlotItem(slot, id));
        });
      }
      for (const [ev, handler] of Object.entries(p3.events || {})) {
        const off = subscribe(ev, (data) => handler.call(p3, data));
        track(p3.name, off);
      }
      if (p3.zustand) subscribeZustand(p3);
      if (typeof p3.onSettingsChange === "function") {
        const prefix2 = `plugins.${p3.name}.`;
        const fn2 = (v3, path) => {
          if (path === `${prefix2}enabled`) return;
          try {
            p3.onSettingsChange(v3, path);
          } catch (e3) {
            logger9.error(`${p3.name}.onSettingsChange 出错`, e3);
          }
        };
        SettingsStore.addPrefixChangeListener(prefix2, fn2);
        track(p3.name, () => SettingsStore.removePrefixChangeListener(prefix2, fn2));
      }
      p3.started = true;
      logger9.debug(`已启动 ${p3.name}`);
      return true;
    } catch (e3) {
      logger9.error(`启动 ${p3.name} 失败`, e3);
      runCleanup(p3.name);
      if (p3.managedStyle && !pluginHasPatches(p3)) disableStyle(p3.managedStyle);
      p3.started = false;
      return false;
    }
  }
  function stopPlugin(p3) {
    if (typeof p3 === "string") p3 = plugins[p3];
    if (!p3) return false;
    if (!p3.started) return true;
    try {
      p3.stop?.();
    } catch (e3) {
      logger9.error(`${p3.name}.stop 出错`, e3);
    }
    runCleanup(p3.name);
    if (p3.managedStyle && !pluginHasPatches(p3)) {
      try {
        disableStyle(p3.managedStyle);
      } catch (e3) {
        logger9.error(e3);
      }
    }
    for (const sel of p3.cleanupSelectors || []) {
      try {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      } catch (e3) {
        logger9.error(`${p3.name} 清理选择器 ${sel} 出错`, e3);
      }
    }
    p3.started = false;
    logger9.debug(`已停止 ${p3.name}`);
    return true;
  }
  function syncEnabled(p3, enabled) {
    if (p3.required || depEnabled.has(p3.name) || isPluginEnabled(p3.name) === enabled) return;
    Settings.plugins[p3.name].enabled = enabled;
    dispatch(Events.PLUGIN_TOGGLE, { name: p3.name, enabled });
  }
  function startPluginApi(p3) {
    if (typeof p3 === "string") p3 = plugins[p3];
    const ok = startPlugin(p3);
    if (ok) syncEnabled(p3, true);
    return ok;
  }
  function stopPluginApi(p3) {
    if (typeof p3 === "string") p3 = plugins[p3];
    const ok = stopPlugin(p3);
    if (ok && p3) syncEnabled(p3, false);
    return ok;
  }
  function togglePlugin(name) {
    const p3 = plugins[name];
    if (!p3) return false;
    if (p3.required || depEnabled.has(name)) return false;
    const next = !isPluginEnabled(name);
    Settings.plugins[name].enabled = next;
    if (next) startPlugin(p3);
    else stopPlugin(p3);
    dispatch(Events.PLUGIN_TOGGLE, { name, enabled: next });
    return needsRestart(p3);
  }
  function registerPlugin(def) {
    if (!addPlugin(def, { runtime: true })) return false;
    const known = Settings.plugins.Settings?.knownPlugins;
    if (known && known[def.name] == null) known[def.name] = Date.now();
    return true;
  }
  function cleanStaleSettings() {
    for (const name of Object.keys(PlainSettings.plugins)) {
      if (!plugins[name] && !otherSites.has(name)) delete Settings.plugins[name];
    }
  }
  function recordKnownPlugins() {
    const s3 = Settings.plugins.Settings;
    if (!s3) return;
    if (!PlainSettings.plugins.Settings.knownPlugins || typeof PlainSettings.plugins.Settings.knownPlugins !== "object") s3.knownPlugins = {};
    const known = s3.knownPlugins;
    const now2 = Date.now();
    for (const name of Object.keys(plugins)) if (known[name] == null) known[name] = now2;
  }
  function enforceDependencies() {
    for (const p3 of Object.values(plugins)) {
      if (!isPluginEnabled(p3.name)) continue;
      for (const d3 of p3.dependencies || []) {
        const dep = plugins[d3];
        if (!dep) {
          logger9.warn(`${p3.name} 依赖的插件 ${d3} 不在当前站点`);
          continue;
        }
        if (!isPluginEnabled(d3)) {
          depEnabled.add(d3);
          Settings.plugins[d3].enabled = true;
        }
      }
    }
    if (PlainSettings.plugins.Settings && PlainSettings.plugins.Settings.enabled === false) Settings.plugins.Settings.enabled = true;
  }
  function startAllAt(stage) {
    const failed = [];
    for (const p3 of Object.values(plugins)) {
      if ((p3.startAt ?? StartAt.Init) !== stage) continue;
      if (!isPluginEnabled(p3.name) || p3.started) continue;
      if (!startPlugin(p3)) failed.push(p3);
    }
    return failed;
  }
  function sensitiveKeys(name) {
    const def = plugins[name]?.settings?.def;
    return def ? Object.keys(def).filter((k4) => def[k4]?.sensitive) : [];
  }
  function getVisibleSettings(p3) {
    const def = p3?.settings?.def;
    if (!def) return [];
    return Object.entries(def).filter(([, s3]) => s3 && !s3.hidden && s3.type !== OptionType.CUSTOM);
  }
  function migratePluginSettings(name, ...oldNames) {
    const all = PlainSettings.plugins;
    const cur = all[name];
    if (cur && Object.keys(cur).length) return false;
    for (const old of oldNames) {
      if (old !== name && all[old] && typeof all[old] === "object") {
        Settings.plugins[name] = { ...all[old] };
        delete Settings.plugins[old];
        logger9.info(`已把插件设置 ${old} 迁移到 ${name}`);
        return true;
      }
    }
    return false;
  }
  function migratePluginSetting(pluginName, newKey, oldKey) {
    const s3 = PlainSettings.plugins[pluginName];
    if (!s3 || !(oldKey in s3) || newKey in s3) return false;
    Settings.plugins[pluginName][newKey] = s3[oldKey];
    delete Settings.plugins[pluginName][oldKey];
    return true;
  }

  // ../Userscriptpp/core/lib/backup.js
  var logger10 = new Logger("Backup", "#93c5fd");
  var BACKUP_FORMAT = "userscript-pp-settings";
  var clone = (v3) => parseStored(serialize2(v3)) ?? JSON.parse(serialize2(v3));
  function exportSettings({ includeSensitive = false } = {}) {
    const settings2 = clone(PlainSettings);
    if (!includeSensitive) {
      for (const name of Object.keys(settings2.plugins || {})) {
        for (const k4 of sensitiveKeys(name)) if (settings2.plugins[name] && k4 in settings2.plugins[name]) delete settings2.plugins[name][k4];
      }
    }
    return { format: BACKUP_FORMAT, version: VERSION, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), settings: settings2 };
  }
  function parseBackup(text) {
    let obj;
    try {
      obj = typeof text === "string" ? JSON.parse(text) : text;
    } catch {
      throw new Error("This file is not valid JSON.");
    }
    const settings2 = obj && obj.format === BACKUP_FORMAT ? obj.settings : obj;
    const data = parseStored(settings2);
    if (!data) throw new Error("No Userscript++ settings found in this file.");
    const names = Object.keys(data.plugins);
    const s3 = data.plugins.Settings || {};
    const parts = s3.sites && typeof s3.sites === "object" ? Object.values(s3.sites) : [];
    const themes = parts.reduce((n2, p3) => n2 + (Array.isArray(p3?.themes) ? p3.themes.length : 0), Array.isArray(s3.themes) ? s3.themes.length : 0);
    return {
      settings: data,
      summary: {
        plugins: names.length,
        enabled: names.filter((n2) => data.plugins[n2]?.enabled === true).length,
        themes,
        sites: parts.length,
        quickCss: parts.some((p3) => typeof p3?.customCSS === "string" && p3.customCSS.length > 0) || typeof s3.customCSS === "string" && s3.customCSS.length > 0,
        version: obj?.version ?? null,
        exportedAt: obj?.exportedAt ?? null
      }
    };
  }
  async function importSettings(settings2) {
    const data = clone(settings2);
    data.plugins ??= {};
    for (const name of Object.keys(PlainSettings.plugins)) {
      for (const k4 of sensitiveKeys(name)) {
        const cur = PlainSettings.plugins[name]?.[k4];
        const inc = data.plugins[name]?.[k4];
        if ((inc == null || inc === "") && cur != null && cur !== "") (data.plugins[name] ??= {})[k4] = cur;
      }
    }
    const before = Object.fromEntries(Object.keys(plugins).map((n2) => [n2, isPluginEnabled(n2)]));
    for (const name of Object.keys(plugins)) data.plugins[name] ??= {};
    replaceAll(data);
    let reload = false;
    for (const [name, was] of Object.entries(before)) {
      const p3 = plugins[name];
      const now2 = isPluginEnabled(name);
      if (was === now2) continue;
      if (needsRestart(p3)) reload = true;
      try {
        if (now2) startPlugin(p3);
        else stopPlugin(p3);
      } catch (e3) {
        logger10.error(`导入后启停 ${name} 失败`, e3);
      }
      dispatch(Events.PLUGIN_TOGGLE, { name, enabled: now2 });
    }
    await saveNow();
    if (reload) dispatch(Events.RELOAD_NEEDED, { reason: "import" });
    return reload;
  }
  function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    a3.style.display = "none";
    (document.body || document.documentElement).appendChild(a3);
    a3.click();
    setTimeout(() => {
      a3.remove();
      URL.revokeObjectURL(url);
    }, 1e3);
  }
  var backupFilename = () => `userscript-pp-settings-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
  function pickJsonFile() {
    return new Promise((resolve2) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.style.display = "none";
      input.onchange = () => {
        const f3 = input.files?.[0];
        input.remove();
        if (!f3) return resolve2(null);
        f3.text().then(resolve2, () => resolve2(null));
      };
      (document.body || document.documentElement).appendChild(input);
      input.click();
    });
  }

  // ../Userscriptpp/core/lib/net.js
  function fetchExternal(url, { timeout = 3e4 } = {}) {
    if (!GM.xhr) return W.fetch(url);
    return new Promise((resolve2, reject) => {
      GM.xhr({
        method: "GET",
        url,
        timeout,
        responseType: "text",
        onload: (r3) => {
          const headers = new Headers();
          for (const line of String(r3.responseHeaders || "").split(/\r?\n/)) {
            const i3 = line.indexOf(":");
            if (i3 > 0) {
              try {
                headers.append(line.slice(0, i3).trim(), line.slice(i3 + 1).trim());
              } catch {
              }
            }
          }
          const status2 = r3.status || 200;
          const body = status2 === 204 || status2 === 304 ? null : r3.responseText ?? r3.response ?? "";
          try {
            resolve2(new Response(body, { status: status2 < 200 || status2 > 599 ? 200 : status2, statusText: r3.statusText || "", headers }));
          } catch (e3) {
            reject(e3);
          }
        },
        onerror: () => reject(new Error("网络错误")),
        ontimeout: () => reject(new Error("请求超时")),
        onabort: () => reject(new Error("请求被中止"))
      });
    });
  }

  // ../Userscriptpp/core/lib/themes.js
  var logger11 = new Logger("Themes", "#fcd34d");
  var cssCache = /* @__PURE__ */ new Map();
  var applied = /* @__PURE__ */ new Set();
  var CACHE_KEY = "UserscriptPPThemeCache";
  var REFRESH_MS = 24 * 60 * 60 * 1e3;
  var diskCache = null;
  function readDisk() {
    if (diskCache) return diskCache;
    diskCache = {};
    try {
      const v3 = GM.get ? GM.get(CACHE_KEY) : null;
      if (v3 && typeof v3 === "object" && typeof v3.then !== "function") diskCache = { ...v3 };
      else if (typeof v3 === "string") diskCache = JSON.parse(v3) || {};
    } catch {
      diskCache = {};
    }
    return diskCache;
  }
  function writeDisk() {
    try {
      const r3 = GM.set?.(CACHE_KEY, diskCache || {});
      r3?.catch?.(() => {
      });
    } catch (e3) {
      logger11.debug("写入主题缓存失败", e3);
    }
  }
  function cacheCss(url, css) {
    cssCache.set(url, css);
    readDisk()[url] = { css, at: Date.now() };
    writeDisk();
  }
  function dropCache(url) {
    cssCache.delete(url);
    if (readDisk()[url]) {
      delete diskCache[url];
      writeDisk();
    }
  }
  var SITES_PATH = "plugins.Settings.sites";
  var EMPTY = Object.freeze({});
  function readPartition(key = siteKey()) {
    const p3 = raw().sites?.[key];
    return p3 && typeof p3 === "object" ? p3 : EMPTY;
  }
  function writePartition(key = siteKey()) {
    const r3 = raw();
    if (!r3.sites || typeof r3.sites !== "object" || Array.isArray(r3.sites)) S2().sites = {};
    if (!r3.sites[key] || typeof r3.sites[key] !== "object") S2().sites[key] = {};
    return S2().sites[key];
  }
  var themesOf = (part) => Array.isArray(part?.themes) ? part.themes : [];
  var listeners2 = /* @__PURE__ */ new Set();
  var emit2 = () => {
    for (const l3 of [...listeners2]) {
      try {
        l3();
      } catch {
      }
    }
  };
  var subscribeThemes = (fn2) => {
    listeners2.add(fn2);
    return () => listeners2.delete(fn2);
  };
  var S2 = () => Settings.plugins.Settings;
  var raw = () => PlainSettings.plugins.Settings ??= {};
  var styleName = (id) => `theme:${id}`;
  function themesList() {
    return themesOf(readPartition());
  }
  var getThemes = () => themesList().map((t4) => ({ ...t4 }));
  function foreignAllSiteThemes() {
    const key = siteKey(), out = [];
    for (const [k4, part] of Object.entries(raw().sites || {})) if (k4 !== key) {
      for (const t4 of themesOf(part)) if (t4?.allSites) out.push(t4);
    }
    return out;
  }
  var isThemesEnabled = () => raw().themesEnabled !== false;
  var isOnlineThemesEnabled = () => raw().onlineThemesEnabled !== false;
  function saveThemes(list) {
    writePartition().themes = list.map((t4) => ({ ...t4 }));
    emit2();
  }
  function parseThemeMeta(css) {
    const meta = {};
    const m3 = /\/\*\*([\s\S]*?)\*\//.exec(css);
    if (m3) {
      for (const line of m3[1].split(/\r?\n/)) {
        const mm = /@(name|author|description)\s+(.+)$/.exec(line.replace(/^\s*\*?\s*/, ""));
        if (mm) meta[mm[1]] = mm[2].trim();
      }
    }
    return meta;
  }
  function nameFromUrl(url) {
    try {
      const file = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
      return file.replace(/\.css$/i, "").replace(/[-_]+/g, " ").trim() || url;
    } catch {
      return url;
    }
  }
  function validateThemeUrl(url) {
    let u3;
    try {
      u3 = new URL(String(url).trim());
    } catch {
      return "Enter a valid URL.";
    }
    if (u3.protocol !== "https:") return "Enter a valid URL.";
    if (!/\.css$/i.test(u3.pathname)) return "URL must point to a .css file.";
    return null;
  }
  async function fetchCss(url) {
    let res;
    try {
      res = await fetchExternal(url, { timeout: 3e4 });
    } catch (e3) {
      throw new Error(`Failed to fetch theme (${e3?.message || "network error"}).`);
    }
    if (!res.ok) throw new Error(`Failed to fetch theme (${res.status}).`);
    const css = await res.text();
    if (!css.trim()) throw new Error("Theme file is empty.");
    return css;
  }
  function applyTheme(t4) {
    const name = styleName(t4.url);
    if (!isThemesEnabled() || !t4.enabled) {
      disableStyle(name);
      return;
    }
    applied.add(t4.url);
    if (t4.local) {
      registerStyle(name, t4.css || "");
      return;
    }
    if (!isOnlineThemesEnabled()) {
      disableStyle(name);
      return;
    }
    const mem = cssCache.get(t4.url);
    if (mem != null) {
      registerStyle(name, mem);
      return;
    }
    const disk = readDisk()[t4.url];
    if (disk && typeof disk.css === "string") {
      cssCache.set(t4.url, disk.css);
      registerStyle(name, disk.css);
      if (Date.now() - (disk.at || 0) < REFRESH_MS) return;
    }
    fetchCss(t4.url).then((css) => {
      cacheCss(t4.url, css);
      const cur = [...themesList(), ...foreignAllSiteThemes()].find((x4) => x4.url === t4.url);
      if (!cur || !cur.enabled || !isThemesEnabled() || !isOnlineThemesEnabled()) return;
      registerStyle(name, css);
    }).catch((e3) => logger11.warn(`加载在线主题失败${disk ? "(继续使用缓存)" : ""}:${t4.url}`, e3.message));
  }
  function applyAllThemes() {
    const list = [...themesList(), ...foreignAllSiteThemes()];
    const ids = new Set(list.map((t4) => t4.url));
    for (const id of [...applied]) if (!ids.has(id)) {
      unregisterStyle(styleName(id));
      applied.delete(id);
    }
    for (const t4 of list) applyTheme(t4);
  }
  async function addTheme(url) {
    url = String(url || "").trim();
    const err = validateThemeUrl(url);
    if (err) throw new Error(err);
    if (themesList().some((t4) => t4.url === url)) throw new Error("This theme is already added.");
    const css = await fetchCss(url);
    cacheCss(url, css);
    const meta = parseThemeMeta(css);
    const theme = { url, name: meta.name || nameFromUrl(url), author: meta.author || "", description: meta.description || "", enabled: false };
    if (themesList().some((t4) => t4.url === url)) throw new Error("This theme is already added.");
    saveThemes([...themesList(), theme]);
    return { ...theme };
  }
  var randomId = () => "local-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  function addLocalTheme(name, css) {
    const meta = parseThemeMeta(css || "");
    const theme = {
      url: randomId(),
      name: String(name || "").trim() || meta.name || "Untitled",
      author: meta.author || "Local",
      description: meta.description || "",
      enabled: false,
      local: true,
      css: String(css || "")
    };
    saveThemes([...themesList(), theme]);
    return { ...theme };
  }
  function updateLocalTheme(id, { name, css } = {}) {
    const list = themesList().map((t5) => ({ ...t5 }));
    const t4 = list.find((x4) => x4.url === id && x4.local);
    if (!t4) return false;
    if (name != null) t4.name = String(name);
    if (css != null) {
      t4.css = String(css);
      const meta = parseThemeMeta(t4.css);
      if (meta.description != null) t4.description = meta.description;
      if (meta.author) t4.author = meta.author;
    }
    saveThemes(list);
    applyTheme(t4);
    return true;
  }
  function removeTheme(id) {
    const list = themesList();
    if (!list.some((t4) => t4.url === id)) return false;
    unregisterStyle(styleName(id));
    applied.delete(id);
    dropCache(id);
    saveThemes(list.filter((t4) => t4.url !== id));
    return true;
  }
  function setEnabled(id, enabled) {
    const list = themesList().map((t5) => ({ ...t5 }));
    const t4 = list.find((x4) => x4.url === id);
    if (!t4) return false;
    t4.enabled = enabled;
    saveThemes(list);
    if (enabled) applyTheme(t4);
    else disableStyle(styleName(id));
    return true;
  }
  var enableTheme = (id) => setEnabled(id, true);
  var disableTheme = (id) => setEnabled(id, false);
  function setThemeAllSites(id, allSites) {
    const list = themesList().map((t5) => ({ ...t5 }));
    const t4 = list.find((x4) => x4.url === id);
    if (!t4) return false;
    if (allSites) t4.allSites = true;
    else delete t4.allSites;
    saveThemes(list);
    applyTheme(t4);
    return true;
  }
  function setThemesEnabled(b3) {
    S2().themesEnabled = !!b3;
    if (b3) applyAllThemes();
    else for (const t4 of [...themesList(), ...foreignAllSiteThemes()]) disableStyle(styleName(t4.url));
    emit2();
  }
  function setOnlineThemesEnabled(b3) {
    S2().onlineThemesEnabled = !!b3;
    for (const t4 of [...themesList(), ...foreignAllSiteThemes()]) if (!t4.local) {
      if (b3) applyTheme(t4);
      else disableStyle(styleName(t4.url));
    }
    emit2();
  }
  var QUICK_CSS = "quick-css";
  function getQuickCss() {
    const p3 = readPartition();
    return { css: p3.customCSS || "", enabled: p3.customCSSEnabled !== false };
  }
  function setQuickCss({ css, enabled } = {}) {
    const st = writePartition();
    if (css != null) st.customCSS = String(css);
    if (enabled != null) st.customCSSEnabled = !!enabled;
  }
  function applyQuickCss() {
    const { css, enabled } = getQuickCss();
    if (enabled && css) registerStyle(QUICK_CSS, css);
    else disableStyle(QUICK_CSS);
  }

  // ../Userscriptpp/core/lib/dom.js
  var logger12 = new Logger("DOM", "#a7f3d0");
  var subs = /* @__PURE__ */ new Set();
  var mo = null;
  var pendingAdded = /* @__PURE__ */ new Set();
  var pendingRemoved = /* @__PURE__ */ new Set();
  var scheduled = false;
  var selfNodes = /* @__PURE__ */ new WeakSet();
  var selfWrites = /* @__PURE__ */ new WeakMap();
  var raf = (cb) => typeof requestAnimationFrame === "function" ? requestAnimationFrame(cb) : setTimeout(cb, 16);
  function isSelfRecord(r3) {
    if (r3.type === "childList") {
      const nodes = [...r3.addedNodes, ...r3.removedNodes];
      return nodes.length > 0 && nodes.every((n2) => selfNodes.has(n2));
    }
    const set = selfWrites.get(r3.target);
    if (!set) return false;
    if (r3.type === "attributes") return set.has(r3.attributeName);
    return set.has("#text");
  }
  function collect(records) {
    for (const r3 of records) {
      if (isSelfRecord(r3)) continue;
      if (r3.type !== "childList") continue;
      for (const n2 of r3.addedNodes) if (n2.nodeType === 1) pendingAdded.add(n2);
      for (const n2 of r3.removedNodes) if (n2.nodeType === 1) pendingRemoved.add(n2);
    }
    if ((pendingAdded.size || pendingRemoved.size) && !scheduled) {
      scheduled = true;
      raf(flush);
    }
  }
  function matchesIn(node, selector) {
    const out = [];
    try {
      if (node.matches?.(selector)) out.push(node);
      if (node.querySelectorAll) out.push(...node.querySelectorAll(selector));
    } catch {
    }
    return out;
  }
  function flush() {
    scheduled = false;
    const added = [...pendingAdded].filter((n2) => n2.isConnected), removed = [...pendingRemoved].filter((n2) => !n2.isConnected);
    pendingAdded = /* @__PURE__ */ new Set();
    pendingRemoved = /* @__PURE__ */ new Set();
    for (const s3 of [...subs]) {
      if (s3.added) {
        const hits = /* @__PURE__ */ new Set();
        for (const n2 of added) for (const m3 of matchesIn(n2, s3.selector)) if (!s3.root || s3.root.contains(m3)) hits.add(m3);
        for (const el of hits) {
          try {
            s3.added(el);
          } catch (e3) {
            logger12.error("observe 回调出错", e3);
          }
        }
      }
      if (s3.removed) {
        const hits = /* @__PURE__ */ new Set();
        for (const n2 of removed) for (const m3 of matchesIn(n2, s3.selector)) hits.add(m3);
        for (const el of hits) {
          try {
            s3.removed(el);
          } catch (e3) {
            logger12.error("observe 回调出错", e3);
          }
        }
      }
    }
  }
  function ensureObserver() {
    if (mo) return;
    const target2 = document.documentElement || document;
    mo = new MutationObserver(collect);
    mo.observe(target2, { childList: true, subtree: true });
  }
  function observe(selector, { added, removed, root: root2 } = {}) {
    const s3 = { selector, added, removed, root: root2 };
    subs.add(s3);
    ensureObserver();
    if (added) raf(() => {
      if (!subs.has(s3)) return;
      for (const el of matchesIn(root2 || document, selector)) {
        try {
          added(el);
        } catch (e3) {
          logger12.error("observe 回调出错", e3);
        }
      }
    });
    return () => subs.delete(s3);
  }
  function waitForElement(selector, { root: root2, timeout = 0 } = {}) {
    const now2 = (root2 || document).querySelector?.(selector);
    if (now2) return Promise.resolve(now2);
    return new Promise((resolve2) => {
      let timer2 = 0;
      const off = observe(selector, { root: root2, added: (el) => {
        off();
        clearTimeout(timer2);
        resolve2(el);
      } });
      if (timeout > 0) timer2 = setTimeout(() => {
        off();
        resolve2(null);
      }, timeout);
    });
  }
  function markWrite(el, key) {
    let set = selfWrites.get(el);
    if (!set) selfWrites.set(el, set = /* @__PURE__ */ new Set());
    set.add(key);
    if (mo) collect(mo.takeRecords());
  }
  function setAttr(el, name, value) {
    if (!el) return false;
    if (value == null || value === false) {
      if (!el.hasAttribute(name)) return false;
      el.removeAttribute(name);
    } else {
      const v3 = value === true ? "" : String(value);
      if (el.getAttribute(name) === v3) return false;
      el.setAttribute(name, v3);
    }
    markWrite(el, name);
    return true;
  }
  function setText(el, text) {
    if (!el) return false;
    const v3 = String(text ?? "");
    if (el.textContent === v3) return false;
    el.textContent = v3;
    markWrite(el, "#text");
    for (const n2 of el.childNodes) selfNodes.add(n2);
    return true;
  }
  function toggleClass(el, name, force) {
    if (!el) return false;
    const has = el.classList.contains(name);
    const want = force === void 0 ? !has : !!force;
    if (has === want) return false;
    el.classList.toggle(name, want);
    markWrite(el, "class");
    return true;
  }
  function setStyle(el, prop, value) {
    if (!el) return false;
    const v3 = value == null ? "" : String(value);
    if (el.style.getPropertyValue(prop) === v3) return false;
    if (v3) el.style.setProperty(prop, v3);
    else el.style.removeProperty(prop);
    markWrite(el, "style");
    return true;
  }
  function mount(parent, node, before = null) {
    if (!parent || !node) return node;
    selfNodes.add(node);
    if (node.parentNode === parent && (before == null ? node === parent.lastChild || node.nextSibling == null : node.nextSibling === before)) return node;
    parent.insertBefore(node, before);
    if (mo) collect(mo.takeRecords());
    return node;
  }
  function unmount(node) {
    if (!node?.parentNode) return;
    selfNodes.add(node);
    node.remove();
    if (mo) collect(mo.takeRecords());
  }

  // ../Userscriptpp/core/lib/route.js
  var installed2 = false;
  var last = null;
  var parser = null;
  function setRouteParser(fn2) {
    parser = typeof fn2 === "function" ? fn2 : null;
  }
  function check2() {
    const url = location.href;
    if (url === last) return;
    const prev = last;
    last = url;
    let info;
    if (parser) {
      try {
        info = parser(new URL(url));
      } catch {
        info = void 0;
      }
    }
    dispatch(Events.ROUTE_CHANGE, { url, previous: prev, info });
  }
  function installRouteWatcher() {
    if (installed2) return;
    installed2 = true;
    last = location.href;
    const H3 = W.history;
    for (const name of ["pushState", "replaceState"]) {
      const orig = H3[name];
      if (typeof orig !== "function") continue;
      const wrapped = function(...args) {
        const r3 = orig.apply(this, args);
        try {
          check2();
        } catch {
        }
        return r3;
      };
      try {
        H3[name] = wrapped;
      } catch {
      }
    }
    W.addEventListener("popstate", check2);
    W.addEventListener("hashchange", check2);
  }
  function onRouteChange(fn2) {
    installRouteWatcher();
    return subscribe(Events.ROUTE_CHANGE, fn2);
  }

  // ../Userscriptpp/core/lib/network.js
  var logger13 = new Logger("Network", "#c4b5fd");
  var reqSubs = /* @__PURE__ */ new Set();
  var resSubs = /* @__PURE__ */ new Set();
  var installed3 = false;
  var test = (matcher, url, method) => {
    try {
      if (!matcher) return true;
      if (typeof matcher === "string") return url.includes(matcher);
      if (matcher instanceof RegExp) return matcher.test(url);
      if (typeof matcher === "function") return !!matcher(url, method);
    } catch {
    }
    return false;
  };
  var call = (fn2, ctx) => {
    try {
      const r3 = fn2(ctx);
      r3?.catch?.((e3) => logger13.error("网络回调出错", e3));
    } catch (e3) {
      logger13.error("网络回调出错", e3);
    }
  };
  async function readChunks(res, onChunk) {
    const reader = res.body?.getReader?.();
    if (!reader) {
      onChunk(await res.text(), true);
      return;
    }
    const dec = new TextDecoder();
    for (; ; ) {
      const { value, done: done2 } = await reader.read();
      if (done2) {
        onChunk("", true);
        break;
      }
      onChunk(dec.decode(value, { stream: true }), false);
    }
  }
  function wrapFetch() {
    const orig = W.fetch;
    if (typeof orig !== "function") return;
    const wrapped = function(input, init) {
      let url = "", method = "GET";
      try {
        url = typeof input === "string" ? input : input?.url ?? String(input);
        method = (init?.method || input?.method || "GET").toUpperCase();
      } catch {
      }
      for (const s3 of reqSubs) if (test(s3.matcher, url, method)) call(s3.handler, { url, method, init, input });
      const p3 = orig.apply(this, arguments);
      if (resSubs.size) p3.then((res) => {
        for (const s3 of resSubs) if (test(s3.matcher, url, method)) {
          call(s3.handler, {
            url,
            method,
            status: res.status,
            headers: res.headers,
            type: "fetch",
            clone: () => res.clone(),
            text: () => res.clone().text(),
            json: () => res.clone().json(),
            onChunk: (cb) => readChunks(res.clone(), cb)
          });
        }
      }, () => {
      });
      return p3;
    };
    try {
      W.fetch = wrapped;
    } catch (e3) {
      logger13.warn("无法包装 fetch", e3);
    }
  }
  function wrapXhr() {
    const X3 = W.XMLHttpRequest;
    if (!X3?.prototype) return;
    const open = X3.prototype.open, send = X3.prototype.send;
    X3.prototype.open = function(method, url) {
      this.__uspp_cttf_Req = { method: String(method || "GET").toUpperCase(), url: String(url) };
      return open.apply(this, arguments);
    };
    X3.prototype.send = function(body) {
      const info = this.__uspp_cttf_Req;
      if (info) {
        for (const s3 of reqSubs) if (test(s3.matcher, info.url, info.method)) call(s3.handler, { ...info, body, type: "xhr" });
        if (resSubs.size) this.addEventListener("load", () => {
          for (const s3 of resSubs) if (test(s3.matcher, info.url, info.method)) {
            const rt = this.responseType;
            const text = () => Promise.resolve(rt === "" || rt === "text" ? this.responseText : rt === "json" ? JSON.stringify(this.response) : "");
            const json = () => rt === "json" ? Promise.resolve(this.response) : text().then(JSON.parse);
            call(s3.handler, { ...info, status: this.status, type: "xhr", text, json, clone: () => null, onChunk: (cb) => text().then((t4) => cb(t4, true)) });
          }
        });
      }
      return send.apply(this, arguments);
    };
  }
  function installNetworkHooks() {
    if (installed3) return;
    installed3 = true;
    wrapFetch();
    wrapXhr();
  }
  function onRequest(matcher, handler) {
    installNetworkHooks();
    const s3 = { matcher, handler };
    reqSubs.add(s3);
    return () => reqSubs.delete(s3);
  }
  function onResponse(matcher, handler) {
    installNetworkHooks();
    const s3 = { matcher, handler };
    resSubs.add(s3);
    return () => resSubs.delete(s3);
  }

  // ../Userscriptpp/core/lib/menu.js
  var logger14 = new Logger("Menu", "#fcd34d");
  var registered = /* @__PURE__ */ new Map();
  function sync2() {
    if (!GM.menu) return;
    const items = getSlotItems("menuCommand");
    const ids = new Set(items.map((d3) => d3.id));
    for (const [id, r3] of registered) {
      if (ids.has(id)) continue;
      try {
        GM.unmenu?.(r3.handle);
      } catch {
      }
      registered.delete(id);
    }
    for (const d3 of items) {
      const label = String(d3.label ?? d3.id);
      const r3 = registered.get(d3.id);
      if (r3 && r3.label === label) {
        r3.def = d3;
        continue;
      }
      if (r3) {
        try {
          GM.unmenu?.(r3.handle);
        } catch {
        }
      }
      const entry2 = { label, def: d3, handle: null };
      try {
        entry2.handle = GM.menu(label, () => {
          try {
            (entry2.def.onSelect || entry2.def.onClick)?.({});
          } catch (e3) {
            logger14.error(`菜单命令 ${label} 出错`, e3);
          }
        });
      } catch (e3) {
        logger14.debug("注册菜单命令失败", e3);
      }
      registered.set(d3.id, entry2);
    }
  }
  var installed4 = false;
  function installMenuCommands() {
    if (installed4) return;
    installed4 = true;
    onSlotChange("menuCommand", sync2);
    sync2();
  }

  // ../Userscriptpp/core/lib/fiber.js
  function getFiber(el) {
    if (!el) return null;
    for (const k4 of Object.keys(el)) {
      if (k4.startsWith("__reactFiber$") || k4.startsWith("__reactInternalInstance$")) return el[k4];
    }
    return null;
  }
  function getProps(el) {
    if (!el) return null;
    for (const k4 of Object.keys(el)) if (k4.startsWith("__reactProps$")) return el[k4];
    return null;
  }
  function walkFiberUp(fiber, predicate, max = 200) {
    for (let f3 = fiber, i3 = 0; f3 && i3 < max; f3 = f3.return, i3++) {
      try {
        if (predicate(f3)) return f3;
      } catch {
      }
    }
    return null;
  }
  function findFiberProps(el, key, max = 200) {
    const f3 = walkFiberUp(getFiber(el), (f4) => f4.memoizedProps && key in f4.memoizedProps, max);
    return f3 ? f3.memoizedProps : null;
  }

  // ../Userscriptpp/core/lib/jsxhook.js
  var logger15 = new Logger("RenderHook", "#fca5a5");
  var hooks = /* @__PURE__ */ new Map();
  var stringHooks = /* @__PURE__ */ new Map();
  var installed5 = false;
  var target = null;
  function isWritableJsx(exp) {
    try {
      if (!exp || typeof exp !== "object") return false;
      const d3 = Object.getOwnPropertyDescriptor(exp, "jsx");
      const d22 = Object.getOwnPropertyDescriptor(exp, "jsxs");
      return !!(d3 && d22 && "value" in d3 && d3.writable && typeof d3.value === "function" && typeof d22.value === "function" && exp.Fragment);
    } catch {
      return false;
    }
  }
  function locate() {
    const c3 = runtime2.cache;
    if (c3) for (const id of Object.keys(c3)) {
      const exp = c3[id]?.exports;
      if (isWritableJsx(exp)) return exp;
    }
    for (const exp of moduleCache.values()) if (isWritableJsx(exp)) return exp;
    return null;
  }
  var busy2 = false;
  function wrap(orig) {
    const wrapped = function(type, props, key) {
      const set = typeof type === "string" ? stringHooks.get(type) : hooks.get(type);
      if (!set || busy2 || !props) return orig.apply(this, arguments);
      busy2 = true;
      try {
        for (const fn2 of set) {
          try {
            const out = fn2(props, key, (p3 = props) => orig.call(this, type, p3, key));
            if (out !== void 0) return out;
          } catch (e3) {
            logger15.error("渲染兜底钩子出错", e3);
          }
        }
      } finally {
        busy2 = false;
      }
      return orig.apply(this, arguments);
    };
    wrapped.$$uspp_cttf_Original = orig;
    return wrapped;
  }
  function install() {
    if (installed5) return true;
    target = locate();
    if (!target) return false;
    try {
      target.jsx = wrap(target.jsx);
      target.jsxs = wrap(target.jsxs);
      installed5 = true;
      logger15.debug("已挂接 jsx 运行时");
      return true;
    } catch (e3) {
      logger15.warn("挂接 jsx 运行时失败", e3);
      return false;
    }
  }
  var waiting = false;
  function ensureInstalled() {
    if (install() || waiting) return;
    waiting = true;
    const off = onModuleLoad(() => {
      if (install()) {
        off();
        waiting = false;
      }
    });
  }
  function addRenderHook(type, fn2) {
    if (!type) return () => {
    };
    const map = typeof type === "string" ? stringHooks : hooks;
    let set = map.get(type);
    if (!set) map.set(type, set = /* @__PURE__ */ new Set());
    set.add(fn2);
    ensureInstalled();
    return () => set.delete(fn2);
  }
  var asArray = (c3) => c3 == null ? [] : Array.isArray(c3) ? c3 : [c3];
  function treeHas(node, test2, depth = 6) {
    if (node == null || depth < 0) return false;
    if (Array.isArray(node)) return node.some((n2) => treeHas(n2, test2, depth));
    if (typeof node !== "object") return false;
    if (test2(node)) return true;
    return treeHas(node.props?.children, test2, depth - 1);
  }

  // ../Userscriptpp/core/ui/components.js
  var components_exports = {};
  __export(components_exports, {
    Button: () => Button,
    CodeEditor: () => CodeEditor,
    Fragment: () => Fragment2,
    IconButton: () => IconButton,
    Input: () => Input,
    Row: () => Row,
    Select: () => Select,
    Switch: () => Switch,
    Tooltip: () => Tooltip
  });
  function withFallback(nativeRender, fallbackRender, label) {
    return (props) => {
      const fb = fallbackRender(props);
      let g4 = null;
      try {
        g4 = nativeRender(props);
      } catch {
        g4 = null;
      }
      if (!g4) return fb;
      return h4(ErrorBoundary, { fallback: fb, label }, g4);
    };
  }
  var Button = withFallback(
    ({ variant = "outline", size = "md", onClick, disabled: disabled2, children, title, className, type = "button" }) => {
      const B4 = siteComponent("Button");
      if (!B4) return null;
      const v3 = variant === "danger" ? "danger" : variant;
      return h4(B4, { variant: v3, size, shape: "pill", onClick, disabled: disabled2, title, className, type }, children);
    },
    ({ variant = "outline", size, onClick, disabled: disabled2, children, title, className, type = "button" }) => h4("button", {
      type,
      onClick,
      disabled: disabled2,
      title,
      className: classes("uspp-cttf-btn", variant === "primary" && "uspp-cttf-btn-primary", variant === "danger" && "uspp-cttf-btn-danger", variant === "ghost" && "uspp-cttf-btn-ghost", size === "sm" && "uspp-cttf-btn-sm", className)
    }, children),
    "Button"
  );
  function IconButton({ icon: Icon2, label, onClick, active, disabled: disabled2, className, size = 4 }) {
    return h4("button", {
      type: "button",
      "aria-label": label,
      title: label,
      onClick,
      disabled: disabled2,
      className: classes("uspp-cttf-btn", "uspp-cttf-btn-icon", active && "uspp-cttf-active", className)
    }, h4(Icon2, { size }));
  }
  var Switch = withFallback(
    ({ checked, onChange, disabled: disabled2, label }) => {
      const S3 = siteComponent("Switch");
      if (!S3) return null;
      return h4(S3, { checked: !!checked, onCheckedChange: (v3) => onChange?.(!!v3), disabled: !!disabled2, "aria-label": label });
    },
    ({ checked, onChange, disabled: disabled2, label }) => h4("button", {
      type: "button",
      role: "switch",
      "aria-checked": !!checked,
      "aria-label": label,
      "data-checked": String(!!checked),
      className: "uspp-cttf-switch",
      disabled: !!disabled2,
      onClick: () => onChange?.(!checked)
    }),
    "Switch"
  );
  var Select = withFallback(
    ({ value, options, onChange, label }) => {
      const [S3, SelectTrigger, SelectValue, SelectContent, SelectItem] = ["Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem"].map(siteComponent);
      if (!S3 || !SelectTrigger || !SelectValue || !SelectContent || !SelectItem) return null;
      const idx = options.findIndex((o3) => Object.is(o3.value, value));
      return h4(
        S3,
        { value: idx >= 0 ? String(idx) : void 0, onValueChange: (v3) => onChange?.(options[+v3]?.value) },
        h4(SelectTrigger, { "aria-label": label, style: { minWidth: 140 } }, h4(SelectValue, null)),
        h4(SelectContent, null, options.map((o3, i3) => h4(SelectItem, { key: i3, value: String(i3) }, o3.label)))
      );
    },
    ({ value, options, onChange, label }) => {
      const idx = options.findIndex((o3) => Object.is(o3.value, value));
      return h4(
        "select",
        { className: "uspp-cttf-select", "aria-label": label, value: idx >= 0 ? String(idx) : "", onChange: (e3) => onChange?.(options[+e3.target.value]?.value) },
        idx < 0 && h4("option", { value: "" }, ""),
        options.map((o3, i3) => h4("option", { key: i3, value: String(i3) }, o3.label))
      );
    },
    "Select"
  );
  function Input(props) {
    const { className, onEnter, ...rest } = props;
    return h4("input", {
      ...rest,
      className: classes("uspp-cttf-input", className),
      onKeyDown: (e3) => {
        if (e3.key === "Enter" && onEnter) {
          e3.preventDefault();
          onEnter(e3);
        }
        rest.onKeyDown?.(e3);
      }
    });
  }
  function CodeEditor({ value, onChange, placeholder, readOnly, minHeight = 240 }) {
    return h4("textarea", {
      className: "uspp-cttf-textarea",
      value,
      placeholder,
      readOnly: !!readOnly,
      spellCheck: false,
      style: { minHeight },
      onChange: (e3) => onChange?.(e3.target.value),
      onKeyDown: (e3) => {
        if (e3.key === "Tab" && !readOnly) {
          e3.preventDefault();
          const t4 = e3.target, s3 = t4.selectionStart, en2 = t4.selectionEnd;
          const next = t4.value.slice(0, s3) + "    " + t4.value.slice(en2);
          onChange?.(next);
          requestAnimationFrame(() => {
            t4.selectionStart = t4.selectionEnd = s3 + 4;
          });
        }
      }
    });
  }
  var Tooltip = withFallback(
    ({ content, children }) => {
      const [T4, TooltipTrigger, TooltipContent] = ["Tooltip", "TooltipTrigger", "TooltipContent"].map(siteComponent);
      if (!T4 || !TooltipTrigger || !TooltipContent || !content) return null;
      return h4(T4, null, h4(TooltipTrigger, { asChild: true }, children), h4(TooltipContent, null, content));
    },
    ({ content, children }) => h4("span", { title: typeof content === "string" ? content : void 0, style: { display: "inline-flex" } }, children),
    "Tooltip"
  );
  function Row({ title, description, children }) {
    return h4(
      "div",
      { className: "uspp-cttf-row" },
      h4(
        "div",
        { className: "uspp-cttf-row-text" },
        h4("div", { className: "uspp-cttf-row-title" }, title),
        description && h4("div", { className: "uspp-cttf-muted uspp-cttf-small" }, description)
      ),
      children
    );
  }

  // ../Userscriptpp/core/ui/icons.js
  var icons_exports = {};
  __export(icons_exports, {
    ArchiveIcon: () => ArchiveIcon,
    CheckIcon: () => CheckIcon,
    ChevronRightIcon: () => ChevronRightIcon,
    ChromiumIcon: () => ChromiumIcon,
    CloseIcon: () => CloseIcon,
    CodeIcon: () => CodeIcon,
    CopyIcon: () => CopyIcon,
    EditIcon: () => EditIcon,
    InfoIcon: () => InfoIcon,
    LockIcon: () => LockIcon,
    LogoIcon: () => LogoIcon,
    PaletteIcon: () => PaletteIcon,
    PinFillIcon: () => PinFillIcon,
    PinIcon: () => PinIcon,
    PlugIcon: () => PlugIcon,
    PuzzleIcon: () => PuzzleIcon,
    ReloadIcon: () => ReloadIcon,
    SlidersIcon: () => SlidersIcon,
    StarFillIcon: () => StarFillIcon,
    StarIcon: () => StarIcon,
    TrashIcon: () => TrashIcon,
    WarningIcon: () => WarningIcon,
    WrenchIcon: () => WrenchIcon
  });
  function svg2(paths, { viewBox = "0 0 24 24", fill = "none" } = {}) {
    const Icon2 = ({ size = 4, className, color, style }) => h4("svg", {
      width: size * 4,
      height: size * 4,
      viewBox,
      fill,
      className,
      stroke: fill === "none" ? color || "currentColor" : void 0,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { flexShrink: 0, color, ...style },
      "aria-hidden": true
    }, ...paths.map((d3, i3) => typeof d3 === "string" ? h4("path", { d: d3, key: i3 }) : { ...d3, key: i3 }));
    return Icon2;
  }
  var PlugIcon = svg2(["M9 2v6", "M15 2v6", "M6 8h12v3a6 6 0 0 1-12 0V8z", "M12 17v5"]);
  var PuzzleIcon = svg2(["M19.4 13a2 2 0 1 0 0-4H18V6a2 2 0 0 0-2-2h-3v1.6a2 2 0 1 1-4 0V4H6a2 2 0 0 0-2 2v3h1.6a2 2 0 1 1 0 4H4v3a2 2 0 0 0 2 2h3v-1.6a2 2 0 1 1 4 0V18h3a2 2 0 0 0 2-2v-3h1.4z"]);
  var PaletteIcon = svg2(["M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.4 3.4A1.5 1.5 0 0 1 12 22z", "M7.5 10.5h.01", "M10.5 7h.01", "M15 7.5h.01"]);
  var CodeIcon = svg2(["M16 18l6-6-6-6", "M8 6l-6 6 6 6"]);
  var InfoIcon = svg2(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16v-4", "M12 8h.01"]);
  var StarIcon = svg2(["M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"]);
  var StarFillIcon = svg2(["M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"], { fill: "currentColor" });
  var PinIcon = svg2(["M12 17v5", "M9 3h6l-1 6 4 4H6l4-4z"]);
  var PinFillIcon = svg2(["M12 17v5", "M9 3h6l-1 6 4 4H6l4-4z"], { fill: "currentColor" });
  var SlidersIcon = svg2(["M4 6h10", "M18 6h2", "M4 12h4", "M12 12h8", "M4 18h12", "M20 18h0", "M16 4v4", "M10 10v4", "M18 16v4"]);
  var WarningIcon = svg2(["M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z", "M12 9v4", "M12 17h.01"]);
  var LockIcon = svg2(["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"]);
  var CloseIcon = svg2(["M18 6L6 18", "M6 6l12 12"]);
  var ChromiumIcon = svg2(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M21.2 8H12", "M3.9 6.1l4.6 7.9", "M10.9 21.9l4.6-7.9"]);
  var WrenchIcon = svg2(["M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8z", "M14.7 6.3L10 2 2 10l4.3 4.7"]);
  var TrashIcon = svg2(["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"]);
  var EditIcon = svg2(["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"]);
  var CopyIcon = svg2(["M9 9h11v11H9z", "M5 15H4V4h11v1"]);
  var CheckIcon = svg2(["M20 6L9 17l-5-5"]);
  var ReloadIcon = svg2(["M21 12a9 9 0 1 1-3-6.7", "M21 3v6h-6"]);
  var ChevronRightIcon = svg2(["M9 6l6 6-6 6"]);
  var LogoIcon = svg2(["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M12 8v8", "M8 12h8"]);
  var ArchiveIcon = svg2(["M3 4h18v4H3z", "M5 8v12h14V8", "M10 12h4"]);

  // ../Userscriptpp/core/ui/theme.js
  function luminance(color) {
    const m3 = /rgba?\(([^)]+)\)/.exec(color || "");
    if (!m3) return null;
    const [r3, g4, b3, a3 = 1] = m3[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (!(a3 > 0)) return null;
    return (0.2126 * r3 + 0.7152 * g4 + 0.0722 * b3) / 255;
  }
  function detectTheme() {
    const site = getSite();
    if (typeof site.theme === "function") {
      try {
        const t4 = site.theme();
        if (t4 === "dark" || t4 === "light") return t4;
      } catch {
      }
    }
    for (const el of [document.body, document.documentElement]) {
      if (!el) continue;
      const l3 = luminance(getComputedStyle(el).backgroundColor);
      if (l3 != null) return l3 < 0.5 ? "dark" : "light";
    }
    try {
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  }
  var currentTheme = () => document.documentElement?.getAttribute("data-uspp-cttf-theme") || detectTheme();
  var installed6 = false;
  function installThemeWatcher() {
    if (installed6) return;
    installed6 = true;
    const update = () => {
      if (document.documentElement) setAttr(document.documentElement, "data-uspp-cttf-theme", detectTheme());
    };
    update();
    try {
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", update);
    } catch {
    }
    let t4 = 0;
    const later = () => {
      clearTimeout(t4);
      t4 = setTimeout(update, 50);
    };
    const mo2 = new MutationObserver((recs) => {
      if (recs.some((r3) => r3.attributeName !== "data-uspp-cttf-theme")) later();
    });
    const watch = () => {
      mo2.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-color-mode"] });
      if (document.body) mo2.observe(document.body, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    };
    if (document.body) watch();
    else document.addEventListener("DOMContentLoaded", () => {
      watch();
      update();
    }, { once: true });
  }

  // ../Userscriptpp/core/ui/root.js
  var logger16 = new Logger("UI", "#fbcfe8");
  var root = null;
  var host = null;
  var retry = 0;
  var layers = /* @__PURE__ */ new Map();
  var listeners3 = /* @__PURE__ */ new Set();
  var emit3 = () => {
    for (const l3 of [...listeners3]) l3();
  };
  var subscribe2 = (fn2) => {
    listeners3.add(fn2);
    return () => listeners3.delete(fn2);
  };
  function addLayer(key, Component) {
    layers.set(key, Component);
    emit3();
  }
  function Root() {
    useSubscription(subscribe2);
    return h4(Fragment2, null, [...layers].map(([key, C4]) => h4(ErrorBoundary, { key, label: key }, h4(C4, null))));
  }
  var STOP = ["pointerdown", "mousedown", "touchstart", "focusin", "focusout", "wheel"];
  function ensureRoot() {
    if (root) {
      if (host && !host.isConnected && document.body) document.body.appendChild(host);
      return true;
    }
    const R3 = getRenderer();
    if (!R3 || !document.body) {
      if (!retry) retry = setTimeout(() => {
        retry = 0;
        ensureRoot();
      }, 300);
      return false;
    }
    installThemeWatcher();
    try {
      host = document.createElement("uspp-cttf-root");
      for (const t4 of STOP) host.addEventListener(t4, (e3) => e3.stopPropagation());
      document.body.appendChild(host);
      root = R3.createRoot(host);
      root.render(h4(Root, null));
      return true;
    } catch (e3) {
      logger16.error("创建界面根失败", e3);
      host?.remove();
      root = null;
      host = null;
      return false;
    }
  }

  // ../Userscriptpp/core/ui/modal.js
  var logger17 = new Logger("Modal", "#fbcfe8");
  var modals = [];
  var listeners4 = /* @__PURE__ */ new Set();
  var emit4 = () => {
    for (const l3 of [...listeners4]) l3();
  };
  var subscribe3 = (fn2) => {
    listeners4.add(fn2);
    return () => listeners4.delete(fn2);
  };
  var seq2 = 0;
  function topHostDialog() {
    const list = [...document.querySelectorAll('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]')].filter((el) => !el.closest("uspp-cttf-root") && !el.closest(".uspp-cttf-overlay") && isBlockingDialog(el));
    return list[list.length - 1] || null;
  }
  function isBlockingDialog(el) {
    if (el.getAttribute("aria-modal") === "false") return false;
    const r3 = el.getBoundingClientRect();
    if (!(r3.width > 0 && r3.height > 0)) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none" && cs.pointerEvents !== "none";
  }
  function openModal(render, { modalKey } = {}) {
    const key = modalKey ?? `uspp-cttf-modal-${++seq2}`;
    modals = modals.filter((m3) => m3.key !== key);
    modals.push({ key, render, container: topHostDialog() });
    if (!ensureRoot()) logger17.warn("界面根尚未就绪,弹窗会在就绪后显示");
    emit4();
    return key;
  }
  function closeModal(key) {
    const before = modals.length;
    modals = modals.filter((m3) => m3.key !== key);
    if (modals.length !== before) emit4();
  }
  function closeAllModals() {
    if (!modals.length) return;
    modals = [];
    emit4();
  }
  function ModalFrame({ entry: entry2, isTop }) {
    const onClose = () => closeModal(entry2.key);
    useEffect2(() => {
      if (!isTop) return;
      const onKey = (e3) => {
        if (e3.key !== "Escape") return;
        e3.stopImmediatePropagation();
        e3.preventDefault();
        onClose();
      };
      window.addEventListener("keydown", onKey, true);
      return () => window.removeEventListener("keydown", onKey, true);
    }, [isTop]);
    let content;
    try {
      content = entry2.render({ onClose, modalKey: entry2.key });
    } catch (e3) {
      logger17.error("弹窗渲染出错", e3);
      content = null;
    }
    const overlay = h4("div", {
      className: "uspp-cttf-overlay",
      style: entry2.container ? { position: "fixed", zIndex: 2147483e3 } : void 0,
      onMouseDown: (e3) => {
        if (e3.target === e3.currentTarget) e3.currentTarget.dataset.down = "1";
      },
      onClick: (e3) => {
        if (e3.target === e3.currentTarget && e3.currentTarget.dataset.down === "1") onClose();
        e3.currentTarget.dataset.down = "";
      },
      onKeyDown: (e3) => e3.stopPropagation()
    }, h4(ErrorBoundary, { fallback: null, label: "modal" }, content));
    const R3 = getRenderer();
    if (entry2.container && entry2.container.isConnected && R3?.createPortal) return R3.createPortal(overlay, entry2.container);
    return overlay;
  }
  function ModalHost() {
    useSubscription(subscribe3);
    return h4(Fragment2, null, modals.map((m3, i3) => h4(ModalFrame, { key: m3.key, entry: m3, isTop: i3 === modals.length - 1 })));
  }
  addLayer("modals", ModalHost);
  function ModalCard({ title, subtitle, children, footer, onClose, width }) {
    return h4(
      "div",
      { className: "uspp-cttf-modal", role: "dialog", "aria-modal": "true", style: width ? { width: `min(${width}px, 100%)` } : void 0, onClick: (e3) => e3.stopPropagation() },
      h4("button", { type: "button", className: "uspp-cttf-btn uspp-cttf-btn-icon uspp-cttf-modal-close", "aria-label": "Close", onClick: onClose }, h4(CloseIcon, { size: 4 })),
      (title || subtitle) && h4(
        "div",
        { className: "uspp-cttf-modal-header" },
        title && h4("h2", { className: "uspp-cttf-modal-title" }, title),
        subtitle && h4("div", { className: "uspp-cttf-modal-subtitle" }, subtitle)
      ),
      h4("div", { className: "uspp-cttf-modal-body" }, children),
      footer && h4("div", { className: "uspp-cttf-modal-footer" }, footer)
    );
  }
  function confirmDialog({ title, body, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
    return new Promise((resolve2) => {
      let done2 = false;
      const finish2 = (v3) => {
        if (!done2) {
          done2 = true;
          resolve2(v3);
        }
      };
      const key = openModal(({ onClose }) => h4(ModalCard, {
        title,
        width: 420,
        onClose: () => {
          finish2(false);
          onClose();
        },
        footer: [
          h4("button", { key: "c", type: "button", className: "uspp-cttf-btn", onClick: () => {
            finish2(false);
            onClose();
          } }, cancelText),
          h4("button", { key: "o", type: "button", className: `uspp-cttf-btn ${danger ? "uspp-cttf-btn-danger" : "uspp-cttf-btn-primary"}`, onClick: () => {
            finish2(true);
            onClose();
          } }, confirmText)
        ]
      }, h4("div", { className: "uspp-cttf-muted" }, body)));
      const off = subscribe3(() => {
        if (!modals.some((m3) => m3.key === key)) {
          off();
          finish2(false);
        }
      });
    });
  }

  // ../Userscriptpp/core/ui/toast.js
  var logger18 = new Logger("Toast", "#fbcfe8");
  var ToastType = Object.freeze({
    MESSAGE: "MESSAGE",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    INFO: "INFO",
    WARNING: "WARNING",
    LOADING: "LOADING"
  });
  function showToast(message, type = ToastType.MESSAGE, options = {}) {
    const toast2 = siteToast();
    if (!toast2) return fallbackToast(message, type, options);
    try {
      const fn2 = {
        SUCCESS: toast2.success,
        ERROR: toast2.error,
        INFO: toast2.info,
        WARNING: toast2.warning,
        LOADING: toast2.loading,
        MESSAGE: toast2.message
      }[String(type).toUpperCase()] || toast2;
      return fn2.call(toast2, message, options);
    } catch (e3) {
      logger18.warn("显示 toast 失败", e3);
      return -1;
    }
  }
  function dismissToast(id) {
    if (id && typeof id === "object" && typeof id.remove === "function") {
      id.remove();
      return;
    }
    try {
      siteToast()?.dismiss?.(id);
    } catch {
    }
  }
  function siteToast() {
    const c3 = getSite().components;
    try {
      return (typeof c3 === "function" ? c3("toast") : c3?.toast) ?? null;
    } catch {
      return null;
    }
  }
  var notice = null;
  var listeners5 = /* @__PURE__ */ new Set();
  var emit5 = () => {
    for (const l3 of [...listeners5]) l3();
  };
  var subscribe4 = (fn2) => {
    listeners5.add(fn2);
    return () => listeners5.delete(fn2);
  };
  var timer = 0;
  function showNotice({ message, type = "INFO", action, duration } = {}) {
    clearTimeout(timer);
    notice = { message, type: String(type).toUpperCase(), action, id: Date.now() };
    ensureRoot();
    emit5();
    if (duration > 0) timer = setTimeout(closeNotice, duration);
  }
  function closeNotice() {
    clearTimeout(timer);
    if (!notice) return;
    notice = null;
    emit5();
  }
  var ICONS = { ERROR: WarningIcon, WARNING: WarningIcon, SUCCESS: CheckIcon };
  function NoticeHost() {
    useSubscription(subscribe4);
    if (!notice) return null;
    const Icon2 = ICONS[notice.type] || InfoIcon;
    const { action } = notice;
    return h4(
      "div",
      { className: "uspp-cttf-notice", "data-type": notice.type, role: "status" },
      h4(Icon2, { size: 4.5 }),
      h4("div", { className: "uspp-cttf-notice-msg" }, notice.message),
      action && h4("button", { type: "button", className: "uspp-cttf-btn uspp-cttf-btn-sm", onClick: () => {
        try {
          action.onClick?.();
        } finally {
          if (action.close !== false) closeNotice();
        }
      } }, action.label),
      h4("button", { type: "button", className: "uspp-cttf-btn uspp-cttf-btn-icon", "aria-label": "Close", onClick: closeNotice }, h4(CloseIcon, { size: 4 }))
    );
  }
  addLayer("notice", NoticeHost);
  var toastHost = null;
  function fallbackToast(message, type = "MESSAGE", { duration = 3500 } = {}) {
    if (!document.body && !document.documentElement) return -1;
    if (!toastHost || !toastHost.isConnected) {
      toastHost = document.createElement("uspp-cttf-toasts");
      const r3 = toastHost.attachShadow({ mode: "open" });
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`:host{all:initial}.list{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;font:13px/1.4 system-ui,sans-serif}
.t{background:#222;color:#fff;padding:9px 14px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.3);max-width:360px}.t[data-type=ERROR]{background:#b3261e}.t[data-type=SUCCESS]{background:#1b5e20}`);
        r3.adoptedStyleSheets = [sheet];
      } catch {
      }
      const list = document.createElement("div");
      list.className = "list";
      r3.append(list);
      (document.body || document.documentElement).appendChild(toastHost);
    }
    const t4 = document.createElement("div");
    t4.className = "t";
    t4.dataset.type = String(type).toUpperCase();
    t4.setAttribute("role", "status");
    t4.textContent = String(message);
    toastHost.shadowRoot.querySelector(".list").append(t4);
    setTimeout(() => t4.remove(), duration);
    return t4;
  }

  // ../Userscriptpp/core/ui/floating.js
  var subscribe5 = (fn2) => {
    const off = onSlotChange("floating", fn2);
    SettingsStore.addChangeListener("plugins.Settings.floatingPosition", fn2);
    return () => {
      off();
      SettingsStore.removeChangeListener("plugins.Settings.floatingPosition", fn2);
    };
  };
  function FloatingHost() {
    useSubscription(subscribe5);
    const items = getSlotItems("floating");
    if (!items.length) return null;
    const pos = String(PlainSettings.plugins.Settings?.floatingPosition || "bottom-right");
    return h4("div", { className: "uspp-cttf-floating", "data-pos": pos, "data-uspp-cttf-floating": "" }, items.map((d3) => {
      const ctx = {};
      return h4(
        ErrorBoundary,
        { key: d3.id, fallback: null, label: `floating:${d3.id}` },
        d3.render ? h4(d3.render, ctx) : h4("button", {
          type: "button",
          className: "uspp-cttf-floating-btn " + (d3.className || ""),
          title: d3.tooltip ?? d3.label,
          "aria-label": d3.label ?? d3.id,
          disabled: slotValue(d3.disabled, ctx),
          "data-active": String(slotValue(d3.active, ctx)),
          "data-uspp-cttf-floating-item": d3.id,
          onClick: () => {
            try {
              (d3.onSelect || d3.onClick)?.(ctx);
            } catch (e3) {
              console.error("[Userscript++] 悬浮按钮出错", e3);
            }
          }
        }, typeof d3.icon === "function" ? h4(d3.icon, { size: 4 }) : d3.icon, d3.icon != null && d3.label ? " " : null, d3.icon == null || d3.showLabel ? d3.label : null)
      );
    }));
  }
  var installed7 = false;
  function installFloating() {
    if (installed7) return;
    installed7 = true;
    addLayer("floating", FloatingHost);
    const tryMount = () => {
      if (getSlotItems("floating").length && !ensureRoot()) setTimeout(tryMount, 500);
    };
    onSlotChange("floating", tryMount);
    tryMount();
  }

  // ../Userscriptpp/core/ui/styles.css.js
  var LIGHT = `--uspp-cttf-surface-base:#fff;--uspp-cttf-surface-l1:#fff;--uspp-cttf-surface-l2:#f4f4f5;--uspp-cttf-surface-l3:#d4d4d8;--uspp-cttf-fg-primary:#111;--uspp-cttf-fg-secondary:#5f5f66;--uspp-cttf-fg-tertiary:#8a8a93;--uspp-cttf-fg-danger:#e5484d;--uspp-cttf-border-l1:rgb(0 0 0 / .1);--uspp-cttf-border-l2:rgb(0 0 0 / .16);--uspp-cttf-ring:#888;--uspp-cttf-button-ghost-hover:rgb(0 0 0 / .06);`;
  var DARK = `--uspp-cttf-surface-base:#151517;--uspp-cttf-surface-l1:#1c1c1f;--uspp-cttf-surface-l2:#26262a;--uspp-cttf-surface-l3:#3f3f46;--uspp-cttf-fg-primary:#f4f4f5;--uspp-cttf-fg-secondary:#a1a1aa;--uspp-cttf-fg-tertiary:#71717a;--uspp-cttf-fg-danger:#f06a6e;--uspp-cttf-border-l1:rgb(255 255 255 / .1);--uspp-cttf-border-l2:rgb(255 255 255 / .16);--uspp-cttf-ring:#a1a1aa;--uspp-cttf-button-ghost-hover:rgb(255 255 255 / .08);`;
  var UI_CSS = `
:root { ${LIGHT} }
:root[data-uspp-cttf-theme="dark"] { ${DARK} }
uspp-cttf-root { color-scheme: light dark; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
uspp-cttf-root { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; }
uspp-cttf-root > * { pointer-events: auto; }
.uspp-cttf-overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); display: flex; align-items: center; justify-content: center; padding: 16px; pointer-events: auto; animation: uspp-cttf-fade .12s ease-out; }
.uspp-cttf-modal { position: relative; background: var(--uspp-cttf-surface-l1); color: var(--uspp-cttf-fg-primary); border: 1px solid var(--uspp-cttf-border-l1); border-radius: 24px; box-shadow: 0 16px 48px rgb(0 0 0 / .35); width: min(560px, 100%); max-height: min(85vh, 760px); display: flex; flex-direction: column; overflow: hidden; font-size: 14px; animation: uspp-cttf-pop .14s ease-out; }
.uspp-cttf-modal-header { padding: 20px 56px 8px 24px; }
.uspp-cttf-modal-title { font-size: 18px; font-weight: 600; margin: 0; }
.uspp-cttf-modal-subtitle { color: var(--uspp-cttf-fg-secondary); margin-top: 4px; }
.uspp-cttf-modal-body { padding: 8px 24px 16px; overflow-y: auto; }
.uspp-cttf-modal-footer { padding: 12px 24px 20px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-modal-close { position: absolute; top: 14px; right: 14px; }
@keyframes uspp-cttf-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes uspp-cttf-pop { from { opacity: 0; transform: scale(.97) } to { opacity: 1; transform: none } }

.uspp-cttf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--uspp-cttf-border-l2); background: transparent; color: var(--uspp-cttf-fg-primary); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap; }
.uspp-cttf-btn:hover:not(:disabled) { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-btn:disabled { opacity: .5; cursor: default; }
.uspp-cttf-btn-primary { background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); border-color: transparent; }
.uspp-cttf-btn-primary:hover:not(:disabled) { background: var(--uspp-cttf-fg-primary); opacity: .88; }
.uspp-cttf-btn-danger { background: var(--uspp-cttf-fg-danger); color: #fff; border-color: transparent; }
.uspp-cttf-btn-danger:hover:not(:disabled) { background: var(--uspp-cttf-fg-danger); opacity: .88; }
.uspp-cttf-btn-ghost { border-color: transparent; }
.uspp-cttf-btn-icon { width: 32px; height: 32px; padding: 0; border-color: transparent; color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-btn-icon:hover:not(:disabled) { color: var(--uspp-cttf-fg-primary); }
.uspp-cttf-btn-icon.uspp-cttf-active { color: var(--uspp-cttf-fg-primary); }
.uspp-cttf-btn-sm { height: 30px; padding: 0 10px; font-size: 13px; }

.uspp-cttf-switch { position: relative; width: 44px; height: 24px; border-radius: 9999px; background: var(--uspp-cttf-surface-l3); border: none; cursor: pointer; flex-shrink: 0; padding: 0; transition: background .15s; }
.uspp-cttf-switch[data-checked="true"] { background: var(--uspp-cttf-fg-primary); }
.uspp-cttf-switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--uspp-cttf-surface-base); transition: transform .15s; }
.uspp-cttf-switch[data-checked="true"]::after { transform: translateX(20px); }
.uspp-cttf-switch:disabled { opacity: .5; cursor: not-allowed; }

.uspp-cttf-input, .uspp-cttf-textarea, .uspp-cttf-select { width: 100%; box-sizing: border-box; background: var(--uspp-cttf-surface-l2); color: var(--uspp-cttf-fg-primary); border: 1px solid var(--uspp-cttf-border-l1); border-radius: 12px; padding: 8px 12px; font: inherit; outline: none; }
.uspp-cttf-input:focus, .uspp-cttf-textarea:focus, .uspp-cttf-select:focus { border-color: var(--uspp-cttf-ring); }
.uspp-cttf-select { width: auto; min-width: 140px; }
.uspp-cttf-textarea { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.5; resize: vertical; min-height: 240px; white-space: pre; tab-size: 4; }
.uspp-cttf-textarea[readonly] { opacity: .6; }

.uspp-cttf-page { display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; padding-inline-end: 24px; color: var(--uspp-cttf-fg-primary); font-size: 14px; }
.uspp-cttf-row { display: flex; align-items: center; gap: 12px; justify-content: space-between; }
.uspp-cttf-row-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.uspp-cttf-row-title { font-weight: 500; }
.uspp-cttf-muted { color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-small { font-size: 12px; }
.uspp-cttf-section { display: flex; flex-direction: column; gap: 10px; padding: 16px; border: 1px solid var(--uspp-cttf-border-l1); border-radius: 16px; background: var(--uspp-cttf-surface-l1); }
.uspp-cttf-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.uspp-cttf-chip { height: 30px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--uspp-cttf-border-l1); background: transparent; color: var(--uspp-cttf-fg-secondary); font: inherit; font-size: 13px; cursor: pointer; }
.uspp-cttf-chip:hover { background: var(--uspp-cttf-button-ghost-hover); }
.uspp-cttf-chip[aria-selected="true"] { background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); border-color: transparent; }
.uspp-cttf-toolbar { display: flex; gap: 8px; align-items: center; }
.uspp-cttf-toolbar .uspp-cttf-input { flex: 1; }
.uspp-cttf-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 720px) { .uspp-cttf-grid { grid-template-columns: 1fr; } }
.uspp-cttf-divider { display: flex; align-items: center; gap: 8px; color: var(--uspp-cttf-fg-tertiary); font-size: 12px; margin: 4px 0; }
.uspp-cttf-divider::before, .uspp-cttf-divider::after { content: ""; flex: 1; height: 1px; background: var(--uspp-cttf-border-l1); }
.uspp-cttf-card { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border: 1px solid var(--uspp-cttf-border-l1); border-radius: 16px; background: var(--uspp-cttf-surface-l1); min-width: 0; }
.uspp-cttf-card[data-failed="true"] { border-color: var(--uspp-cttf-fg-danger); background: color-mix(in srgb, var(--uspp-cttf-fg-danger) 8%, transparent); }
.uspp-cttf-card-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
.uspp-cttf-card-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uspp-cttf-card-controls { margin-left: auto; display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
.uspp-cttf-card-desc { color: var(--uspp-cttf-fg-secondary); font-size: 13px; line-height: 1.4; }
.uspp-cttf-card-authors { color: var(--uspp-cttf-fg-tertiary); font-size: 12px; }
.uspp-cttf-badge { display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 6px; font-size: 11px; font-weight: 600; background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); }
.uspp-cttf-icon-badge { display: inline-flex; color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-icon-badge.uspp-cttf-warn { color: var(--uspp-cttf-fg-danger); }
.uspp-cttf-empty { padding: 32px 8px; text-align: center; color: var(--uspp-cttf-fg-secondary); }
.uspp-cttf-banner { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 14px; background: var(--uspp-cttf-surface-l2); }
.uspp-cttf-backup { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin-top: 18px; padding: 12px 14px; border-radius: 14px; border: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-backup-text { flex: 1 1 220px; display: flex; flex-direction: column; gap: 2px; }
.uspp-cttf-sites { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.uspp-cttf-site-badge { font-size: 11px; padding: 0 6px; border-radius: 6px; color: var(--uspp-cttf-fg-secondary); border: 1px solid var(--uspp-cttf-border-l1); white-space: nowrap; }
.uspp-cttf-panel { display: flex; flex-direction: column; gap: 14px; }
.uspp-cttf-panel .uspp-cttf-page { padding-inline-end: 0; }
.uspp-cttf-floating { position: fixed; z-index: 2147482000; display: flex; flex-direction: column; gap: 8px; pointer-events: auto; }
.uspp-cttf-floating[data-pos="bottom-right"] { right: 16px; bottom: 16px; }
.uspp-cttf-floating[data-pos="bottom-left"] { left: 16px; bottom: 16px; }
.uspp-cttf-floating[data-pos="top-right"] { right: 16px; top: 16px; }
.uspp-cttf-floating[data-pos="top-left"] { left: 16px; top: 16px; }
.uspp-cttf-floating-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 40px; height: 40px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--uspp-cttf-border-l2); background: var(--uspp-cttf-surface-l1); color: var(--uspp-cttf-fg-primary); box-shadow: 0 4px 16px rgb(0 0 0 / .18); font: inherit; cursor: pointer; }
.uspp-cttf-floating-btn:hover:not(:disabled) { background: var(--uspp-cttf-surface-l2); }
.uspp-cttf-floating-btn[data-active="true"] { background: var(--uspp-cttf-fg-primary); color: var(--uspp-cttf-surface-base); }
.uspp-cttf-error { color: var(--uspp-cttf-fg-danger); font-size: 13px; }
.uspp-cttf-setting { display: flex; flex-direction: column; gap: 6px; padding: 12px 0; border-bottom: 1px solid var(--uspp-cttf-border-l1); }
.uspp-cttf-setting:last-child { border-bottom: none; }
.uspp-cttf-slider-row { display: flex; gap: 12px; align-items: center; }
.uspp-cttf-slider-row input[type=range] { flex: 1; }
.uspp-cttf-tip { display: inline-flex; align-items: center; color: var(--uspp-cttf-fg-secondary); cursor: help; margin-left: 4px; }

.uspp-cttf-notice { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; max-width: min(640px, calc(100vw - 32px)); padding: 10px 12px 10px 16px; border-radius: 16px; background: var(--uspp-cttf-surface-l2); color: var(--uspp-cttf-fg-primary); border: 1px solid var(--uspp-cttf-border-l2); box-shadow: 0 8px 32px rgb(0 0 0 / .3); font-size: 14px; pointer-events: auto; }
.uspp-cttf-notice[data-type="ERROR"] { border-color: var(--uspp-cttf-fg-danger); }
.uspp-cttf-notice-msg { flex: 1; }

.uspp-cttf-menu-icon { display: inline-flex; margin-inline-end: 8px; color: var(--uspp-cttf-fg-secondary); }
`;

  // ../Userscriptpp/core/settings/index.js
  var NAME = "Settings";
  var MENU_COMMAND_ID = "uspp-cttf-settings";
  var settings = definePluginSettings({
    showSiteEntry: {
      type: OptionType.BOOLEAN,
      default: true,
      description: "Show this script's entry in the site's own menus and settings.",
      // 只有声明了 settingsHost 的站点才有站点入口
      get hidden() {
        return !getSite().settingsHost;
      }
    },
    floatingPosition: {
      type: OptionType.SELECT,
      description: "Where floating buttons from plugins appear.",
      options: [
        { label: "Bottom right", value: "bottom-right", default: true },
        { label: "Bottom left", value: "bottom-left" },
        { label: "Top right", value: "top-right" },
        { label: "Top left", value: "top-left" }
      ]
    }
  });
  var openSettings = () => {
  };
  function setSettingsOpener(fn2) {
    openSettings = fn2;
  }
  var settings_default = definePlugin({
    name: NAME,
    description: "Userscript++ settings panel and menu command, and loads themes and Quick CSS.",
    authors: ["Userscript++"],
    required: true,
    site: "*",
    settings,
    start() {
      migratePluginSetting(NAME, "showSiteEntry", "showMenu");
      applyQuickCss();
      if (isThemesEnabled()) applyAllThemes();
      let queued = false;
      this._apply = () => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          applyQuickCss();
          applyAllThemes();
        });
      };
      for (const k4 of [SITES_PATH, "plugins.Settings.themesEnabled", "plugins.Settings.onlineThemesEnabled"]) SettingsStore.addPrefixChangeListener(k4, this._apply);
      addSlotItem("menuCommand", MENU_COMMAND_ID, { label: `${SCRIPT_NAME} settings`, order: -1e3, onSelect: () => openSettings() });
    },
    stop() {
      if (this._apply) for (const k4 of [SITES_PATH, "plugins.Settings.themesEnabled", "plugins.Settings.onlineThemesEnabled"]) SettingsStore.removePrefixChangeListener(k4, this._apply);
      removeSlotItem("menuCommand", MENU_COMMAND_ID);
    }
  });

  // ../Userscriptpp/core/settings/PluginModal.js
  function usePluginSettings(name) {
    const force = useForceUpdate();
    useEffect2(() => {
      const prefix2 = `plugins.${name}.`;
      const fn2 = () => force();
      SettingsStore.addPrefixChangeListener(prefix2, fn2);
      return () => SettingsStore.removePrefixChangeListener(prefix2, fn2);
    }, [name]);
  }
  function NumberInput({ value, onCommit, bigint }) {
    const shown2 = value == null ? "" : String(value);
    const [text, setText2] = useState2(shown2);
    const focused = useRef2(false);
    useEffect2(() => {
      if (!focused.current) setText2(shown2);
    }, [shown2]);
    return h4(Input, {
      type: "text",
      inputMode: bigint ? "numeric" : "decimal",
      value: text,
      onFocus: () => {
        focused.current = true;
      },
      onBlur: () => {
        focused.current = false;
        setText2(shown2);
      },
      onChange: (e3) => {
        const raw2 = e3.target.value;
        setText2(raw2);
        const t4 = raw2.trim();
        if (bigint) {
          if (t4 === "") return onCommit(0n);
          try {
            onCommit(BigInt(t4));
          } catch {
          }
        } else if (t4 !== "" && !isNaN(Number(t4))) {
          onCommit(Number(t4));
        }
      }
    });
  }
  function SettingControl({ plugin, keyName, setting, onRestartChange }) {
    const store = Settings.plugins[plugin.name];
    const value = store[keyName];
    const set = (v3) => {
      const before = PlainSettings.plugins[plugin.name]?.[keyName];
      store[keyName] = v3;
      try {
        setting.onChange?.(v3);
      } catch (e3) {
        console.error("[Userscript++] 设置 onChange 出错", e3);
      }
      if (setting.restartNeeded) onRestartChange?.(plugin.name, keyName, before, v3);
    };
    const title = humanizeKey(keyName);
    const desc = setting.description && h4("div", { className: "uspp-cttf-muted uspp-cttf-small" }, setting.description);
    const inline = (control) => h4(
      "div",
      { className: "uspp-cttf-setting" },
      h4("div", { className: "uspp-cttf-row" }, h4("div", { className: "uspp-cttf-row-text" }, h4("div", { className: "uspp-cttf-row-title" }, title), desc), control)
    );
    const stacked = (control) => h4(
      "div",
      { className: "uspp-cttf-setting" },
      h4("div", { className: "uspp-cttf-row-text" }, h4("div", { className: "uspp-cttf-row-title" }, title), desc),
      control
    );
    switch (setting.type) {
      case OptionType.BOOLEAN:
        return inline(h4(Switch, { checked: !!value, onChange: set, label: title }));
      case OptionType.SELECT:
        return inline(h4(Select, { value, options: setting.options || [], onChange: set, label: title }));
      case OptionType.SLIDER: {
        const min = setting.min ?? 0, max = setting.max ?? 100;
        return stacked(h4(
          "div",
          { className: "uspp-cttf-slider-row" },
          h4("input", { type: "range", min, max, step: 1, value: Number(value ?? min), onChange: (e3) => set(Number(e3.target.value)), "aria-label": title }),
          h4("span", { className: "uspp-cttf-muted", style: { minWidth: 36, textAlign: "right" } }, String(value ?? min))
        ));
      }
      case OptionType.NUMBER:
        return stacked(h4(NumberInput, { value, onCommit: set }));
      case OptionType.BIGINT:
        return stacked(h4(NumberInput, { value, onCommit: set, bigint: true }));
      case OptionType.STRING:
        return stacked(h4(Input, { type: "text", value: value ?? "", placeholder: setting.placeholder, onChange: (e3) => set(e3.target.value) }));
      case OptionType.COMPONENT: {
        const C4 = setting.component;
        if (!C4) return null;
        return stacked(h4(ErrorBoundary, { fallback: null }, h4(C4, { setValue: set, setting, option: setting, value })));
      }
      default:
        return null;
    }
  }
  function PluginModal({ plugin, onClose, onRestartChange }) {
    usePluginSettings(plugin.name);
    const visible2 = getVisibleSettings(plugin);
    const reset = async () => {
      const ok = await confirmDialog({ title: "Reset settings", body: "Reset this plugin's settings to defaults? This cannot be undone.", confirmText: "Reset", danger: true });
      if (!ok) return;
      const store = Settings.plugins[plugin.name];
      for (const [key, s3] of visible2) {
        const before = PlainSettings.plugins[plugin.name]?.[key];
        delete store[key];
        const after = store[key];
        try {
          s3.onChange?.(after);
        } catch {
        }
        if (s3.restartNeeded) onRestartChange?.(plugin.name, key, before, after);
      }
    };
    return h4(
      ModalCard,
      {
        title: plugin.name,
        subtitle: plugin.description,
        onClose,
        footer: visible2.length ? h4(Button, { variant: "danger", onClick: reset }, "Reset") : null
      },
      h4("div", { className: "uspp-cttf-muted uspp-cttf-small", style: { marginBottom: 8 } }, "Authors: ", (plugin.authors || []).join(", ") || "Unknown"),
      visible2.length ? visible2.map(([key, s3]) => h4(ErrorBoundary, { key, fallback: null }, h4(SettingControl, { plugin, keyName: key, setting: s3, onRestartChange }))) : h4("div", { className: "uspp-cttf-empty" }, "No configurable settings.")
    );
  }

  // ../Userscriptpp/core/settings/site-label.js
  var siteLabel = () => isGeneric() ? location.hostname || "this site" : getSite().name;
  var pluginSiteLabel = (p3) => p3.site === "*" ? "All sites" : getSiteById(p3.site)?.name ?? p3.site;

  // ../Userscriptpp/core/settings/shared.js
  var TAB_IDS = { plugins: "uspp_cttf_plugins_tab", themes: "uspp_cttf_themes_tab", quickCss: "uspp_cttf_quickcss_tab", backup: "uspp_cttf_backup_tab" };
  var sys = () => Settings.plugins.Settings;
  var sysPlain = () => PlainSettings.plugins.Settings ??= {};
  function listSetting(key) {
    const v3 = sysPlain()[key];
    return Array.isArray(v3) ? v3.slice() : [];
  }

  // ../Userscriptpp/core/settings/PluginsTab.js
  var TAGS = [
    ["composer", "Composer"],
    ["messages", "Messages"],
    ["chats", "Chats"],
    ["media", "Media"],
    ["navigation", "Navigation"],
    ["notifications", "Notifications"],
    ["appearance", "Appearance"],
    ["declutter", "Declutter"],
    ["privacy", "Privacy"],
    ["developer", "Developer"]
  ];
  var DAY = 864e5;
  function visiblePlugins() {
    return Object.values(plugins).filter((p3) => !p3.hidden && !(p3.chromiumOnly && !isChromium()));
  }
  function useLive2() {
    const force = useForceUpdate();
    useEffect2(() => {
      const offs = [Events.PLUGIN_TOGGLE, Events.PLUGIN_PIN, Events.PLUGIN_STAR].map((e3) => subscribe(e3, () => force()));
      const fn2 = () => force();
      SettingsStore.addPrefixChangeListener("plugins.", fn2);
      const offSlot = onSlotChange("settings.pluginActions", fn2);
      return () => {
        offs.forEach((o3) => o3());
        offSlot();
        SettingsStore.removePrefixChangeListener("plugins.", fn2);
      };
    }, []);
  }
  function useReloadTracker() {
    const ref = useRef2(null);
    if (!ref.current) {
      ref.current = {
        initial: Object.fromEntries(Object.keys(plugins).map((n2) => [n2, isPluginEnabled(n2)])),
        settings: /* @__PURE__ */ new Map(),
        // "插件.键" -> 初始值
        dismissed: false
      };
    }
    const [, setTick] = useState2(0);
    const t4 = ref.current;
    const dirty2 = () => Object.values(plugins).some((p3) => needsRestart(p3) && (t4.initial[p3.name] ?? false) !== isPluginEnabled(p3.name)) || [...t4.settings].some(([k4, init]) => {
      const [n2, key] = k4.split(".");
      return !Object.is(Settings.plugins[n2]?.[key], init);
    });
    const prompt = async () => {
      setTick((x4) => x4 + 1);
      if (!dirty2()) {
        t4.dismissed = false;
        return;
      }
      dispatch(Events.RELOAD_NEEDED, null);
      if (t4.dismissed) return;
      const ok = await confirmDialog({ title: "Reload required", body: "This plugin changes the site's code, so you need to reload the page.", confirmText: "Reload", cancelText: "Later" });
      if (ok) location.reload();
      else {
        t4.dismissed = true;
        setTick((x4) => x4 + 1);
      }
    };
    return {
      get showBanner() {
        return t4.dismissed && dirty2();
      },
      onToggled: (p3) => {
        if (needsRestart(p3)) prompt();
        else setTick((x4) => x4 + 1);
      },
      onSettingRestart: (name, key, before) => {
        const k4 = `${name}.${key}`;
        if (!t4.settings.has(k4)) t4.settings.set(k4, before);
        prompt();
      }
    };
  }
  function Badges({ p: p3 }) {
    const out = [];
    const failed = !p3.required && isPluginEnabled(p3.name) && !p3.started;
    if (p3.required) out.push(h4(Tooltip, { key: "req", content: `This plugin is required for ${SCRIPT_NAME} to work` }, h4("span", { className: "uspp-cttf-icon-badge" }, h4(LockIcon, { size: 3.5 }))));
    if (failed) out.push(h4(Tooltip, { key: "fail", content: "This plugin failed to start" }, h4("span", { className: "uspp-cttf-icon-badge uspp-cttf-warn" }, h4(WarningIcon, { size: 3.5 }))));
    if (p3.chromiumOnly) out.push(h4(Tooltip, { key: "chr", content: "Chromium only" }, h4("span", { className: "uspp-cttf-icon-badge" }, h4(ChromiumIcon, { size: 3.5 }))));
    if (p3.dev) out.push(h4(Tooltip, { key: "dev", content: "Development build only" }, h4("span", { className: "uspp-cttf-icon-badge" }, h4(WrenchIcon, { size: 3.5 }))));
    const seen = sys().knownPlugins?.[p3.name];
    if (seen && Date.now() - seen < 2 * DAY) out.push(h4("span", { key: "new", className: "uspp-cttf-badge" }, "New"));
    return out;
  }
  function PluginCard({ p: p3, tracker }) {
    const enabled = isPluginEnabled(p3.name);
    const starred = listSetting("starredPlugins").includes(p3.name);
    const pinned = listSetting("pinnedPlugins").includes(p3.name);
    const failed = !p3.required && enabled && !p3.started;
    const hasSettings = getVisibleSettings(p3).length > 0;
    const Icon2 = p3.icon || PlugIcon;
    const toggleStar = () => {
      const list = listSetting("starredPlugins").filter((n2) => n2 !== p3.name);
      if (!starred) list.push(p3.name);
      sys().starredPlugins = list;
      dispatch(Events.PLUGIN_STAR, { name: p3.name, starred: !starred });
    };
    const togglePin = () => {
      const list = listSetting("pinnedPlugins").filter((n2) => n2 !== p3.name);
      if (!pinned) list.unshift(p3.name);
      sys().pinnedPlugins = list;
      dispatch(Events.PLUGIN_PIN, { name: p3.name, pinned: !pinned });
    };
    const openConfig = () => openModal(({ onClose }) => h4(PluginModal, { plugin: p3, onClose, onRestartChange: tracker.onSettingRestart }), { modalKey: `uspp-cttf-plugin-${p3.name}` });
    return h4(
      "div",
      { className: "uspp-cttf-card", "data-failed": String(failed), "data-uspp-cttf-plugin": p3.name },
      h4(
        "div",
        { className: "uspp-cttf-card-head" },
        h4("span", { className: "uspp-cttf-icon-badge" }, h4(ErrorBoundary, { fallback: h4(PlugIcon, { size: 4.5 }) }, h4(Icon2, { size: 4.5 }))),
        h4("span", { className: "uspp-cttf-card-name" }, p3.name),
        h4(Badges, { p: p3 }),
        h4("span", { className: "uspp-cttf-site-badge", "data-uspp-cttf-plugin-site": p3.site ?? "*" }, pluginSiteLabel(p3)),
        h4(
          "div",
          { className: "uspp-cttf-card-controls" },
          h4(PluginActions, { p: p3 }),
          h4(IconButton, { icon: starred ? StarFillIcon : StarIcon, label: starred ? "Unstar" : "Star", active: starred, onClick: toggleStar }),
          !p3.required && h4(IconButton, { icon: pinned ? PinFillIcon : PinIcon, label: pinned ? "Unpin" : "Pin", active: pinned, onClick: togglePin }),
          hasSettings && h4(IconButton, { icon: SlidersIcon, label: "config", onClick: openConfig }),
          h4(Switch, {
            checked: enabled,
            disabled: p3.required || isEnabledAsDependency(p3.name),
            label: p3.name,
            onChange: () => {
              togglePlugin(p3.name);
              tracker.onToggled(p3);
            }
          })
        )
      ),
      h4("div", { className: "uspp-cttf-card-desc" }, p3.description),
      h4("div", { className: "uspp-cttf-card-authors" }, (p3.authors || []).join(", "))
    );
  }
  function PluginActions({ p: p3 }) {
    const items = getSlotItems("settings.pluginActions").filter((d3) => !d3.plugin || d3.plugin === p3.name);
    const ctx = { plugin: p3 };
    return items.map((d3) => h4(
      ErrorBoundary,
      { key: d3.id, fallback: null },
      d3.render ? h4(d3.render, ctx) : h4("button", {
        type: "button",
        className: "uspp-cttf-btn uspp-cttf-btn-icon " + (d3.className || ""),
        title: d3.tooltip ?? d3.label,
        "aria-label": d3.label ?? d3.id,
        disabled: slotValue(d3.disabled, ctx),
        "data-active": String(slotValue(d3.active, ctx)),
        onClick: () => {
          try {
            (d3.onSelect || d3.onClick)?.(ctx);
          } catch (e3) {
            console.error("[Userscript++] 插件卡片按钮出错", e3);
          }
        }
      }, typeof d3.icon === "function" ? h4(d3.icon, { size: 4 }) : d3.icon ?? d3.label)
    ));
  }
  function sortPinned(list) {
    const pins = listSetting("pinnedPlugins");
    const pinned = pins.map((n2) => list.find((p3) => p3.name === n2)).filter(Boolean);
    return [...pinned, ...list.filter((p3) => !pins.includes(p3.name)).sort((a3, b3) => a3.name.localeCompare(b3.name))];
  }
  function PluginsTab() {
    useLive2();
    const tracker = useReloadTracker();
    const [cat, setCat] = useState2("favorites");
    const [query, setQuery] = useState2("");
    const [filter, setFilter] = useState2("all");
    const all = visiblePlugins();
    const hasRecent = all.some((p3) => p3.updatedAt);
    const cats = [["favorites", "Favorites"], ...hasRecent ? [["recent", "Recent"]] : [], ["all", "All"], ...TAGS.filter(([t4]) => all.some((p3) => p3.tags?.includes(t4)))];
    const q4 = query.trim().toLowerCase();
    const pass = (p3) => (!q4 || `${p3.name} ${p3.description}`.toLowerCase().includes(q4)) && (filter === "all" || filter === "enabled" === isPluginEnabled(p3.name));
    let body;
    const grid = (list) => h4("div", { className: "uspp-cttf-grid" }, list.map((p3) => h4(ErrorBoundary, { key: p3.name, fallback: null }, h4(PluginCard, { p: p3, tracker }))));
    const empty = (text) => h4("div", { className: "uspp-cttf-empty" }, text);
    if (cat === "favorites") {
      const stars = listSetting("starredPlugins").slice().reverse();
      const list = stars.map((n2) => all.find((p3) => p3.name === n2)).filter(Boolean).filter(pass);
      body = list.length ? grid(list) : empty(stars.length && q4 ? "No plugins match your search." : "No favorites yet. Star a plugin to see it here.");
    } else if (cat === "recent") {
      const list = all.filter((p3) => p3.updatedAt && Date.now() - p3.updatedAt < 7 * DAY).sort((a3, b3) => b3.updatedAt - a3.updatedAt).filter(pass);
      body = list.length ? grid(list) : empty(q4 ? "No plugins match your search." : "No plugins updated in the last 7 days.");
    } else if (cat === "all") {
      const normal = sortPinned(all.filter((p3) => !p3.required)).filter(pass);
      const req = all.filter((p3) => p3.required).sort((a3, b3) => a3.name.localeCompare(b3.name)).filter(pass);
      body = normal.length + req.length === 0 ? empty("No plugins match your search.") : h4(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 10 } },
        normal.length > 0 && grid(normal),
        req.length > 0 && h4("div", { className: "uspp-cttf-divider" }, "Required"),
        req.length > 0 && grid(req)
      );
    } else {
      const list = sortPinned(all.filter((p3) => p3.tags?.includes(cat))).filter(pass);
      body = list.length ? grid(list) : empty("No plugins match your search.");
    }
    return h4(
      "div",
      { className: "uspp-cttf-page", "data-uspp-cttf-page": "plugins" },
      tracker.showBanner && h4(
        "div",
        { className: "uspp-cttf-banner" },
        h4("span", { style: { flex: 1 } }, "Reload the page to apply plugin changes."),
        h4(Button, { variant: "primary", size: "sm", onClick: () => location.reload() }, "Reload")
      ),
      h4("div", { className: "uspp-cttf-tabs", role: "tablist" }, cats.map(([id, label]) => h4("button", {
        key: id,
        type: "button",
        role: "tab",
        className: "uspp-cttf-chip",
        "aria-selected": String(cat === id),
        onClick: () => setCat(id)
      }, label))),
      h4(
        "div",
        { className: "uspp-cttf-toolbar" },
        h4(Input, { type: "search", placeholder: `Search ${all.length} plugins...`, value: query, onChange: (e3) => setQuery(e3.target.value) }),
        h4(Select, { value: filter, label: "Filter", onChange: setFilter, options: [{ label: "All", value: "all" }, { label: "Enabled", value: "enabled" }, { label: "Disabled", value: "disabled" }] })
      ),
      body
    );
  }

  // ../Userscriptpp/core/settings/ThemesTab.js
  function OnlineThemeModal({ onClose }) {
    const [url, setUrl] = useState2("");
    const [busy3, setBusy] = useState2(false);
    const [error, setError] = useState2(null);
    const submit = async () => {
      if (busy3) return;
      setBusy(true);
      setError(null);
      try {
        await addTheme(url);
        onClose();
      } catch (e3) {
        setError(e3?.message || String(e3));
        setBusy(false);
      }
    };
    return h4(
      ModalCard,
      {
        title: "Add online theme",
        subtitle: "Paste a link to a .css file.",
        onClose,
        width: 480,
        footer: [
          h4(Button, { key: "c", onClick: onClose }, "Cancel"),
          h4(Button, { key: "i", variant: "primary", onClick: submit, disabled: busy3 || !url.trim() }, busy3 ? "Importing..." : "Import")
        ]
      },
      h4(Input, { autoFocus: true, type: "url", placeholder: "https://example.com/theme.css", value: url, onChange: (e3) => setUrl(e3.target.value), onEnter: submit, disabled: busy3 }),
      error && h4("div", { className: "uspp-cttf-error", role: "alert", style: { marginTop: 8 } }, error)
    );
  }
  function LocalThemeModal({ onClose, theme }) {
    const [name, setName] = useState2(theme?.name || "");
    const [css, setCss] = useState2(theme?.css || "");
    const ok = name.trim() && css.trim();
    const save = () => {
      if (!ok) return;
      if (theme) updateLocalTheme(theme.url, { name: name.trim(), css });
      else addLocalTheme(name.trim(), css);
      onClose();
    };
    return h4(
      ModalCard,
      {
        title: theme ? "Edit local theme" : "New local theme",
        onClose,
        width: 640,
        footer: [
          h4(Button, { key: "c", onClick: onClose }, "Cancel"),
          h4(Button, { key: "s", variant: "primary", onClick: save, disabled: !ok }, theme ? "Save" : "Create")
        ]
      },
      h4(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 10 } },
        h4("label", { className: "uspp-cttf-row-title" }, "Name"),
        h4(Input, { autoFocus: true, placeholder: "My theme", value: name, onChange: (e3) => setName(e3.target.value) }),
        h4("label", { className: "uspp-cttf-row-title" }, "CSS"),
        h4(CodeEditor, { value: css, onChange: setCss, placeholder: "/* your CSS */", minHeight: 260 })
      )
    );
  }
  function ThemeCard({ t: t4 }) {
    const remove = async () => {
      const ok = await confirmDialog({ title: "Remove theme", body: `Are you sure you want to remove "${t4.name}"?`, confirmText: "Remove", danger: true });
      if (ok) removeTheme(t4.url);
    };
    const copy = async () => {
      const ok = await copyToClipboard(t4.url);
      showToast(ok ? "Copied URL" : "Couldn't copy URL", ok ? ToastType.SUCCESS : ToastType.ERROR);
    };
    return h4(
      "div",
      { className: "uspp-cttf-card", "data-uspp-cttf-theme": t4.url },
      h4(
        "div",
        { className: "uspp-cttf-card-head" },
        h4("span", { className: "uspp-cttf-card-name" }, t4.name),
        h4("span", { className: "uspp-cttf-badge" }, t4.local ? "Local" : "Online"),
        h4(
          "div",
          { className: "uspp-cttf-card-controls" },
          t4.local ? h4(IconButton, { icon: EditIcon, label: "Edit", onClick: () => openModal(({ onClose }) => h4(LocalThemeModal, { onClose, theme: t4 }), { modalKey: "uspp-cttf-local-theme" }) }) : h4(IconButton, { icon: CopyIcon, label: "Copy URL", onClick: copy }),
          h4(IconButton, { icon: TrashIcon, label: "Delete", onClick: remove }),
          h4(Switch, { checked: t4.enabled, label: t4.name, onChange: (v3) => (v3 ? enableTheme : disableTheme)(t4.url) })
        )
      ),
      t4.description && h4("div", { className: "uspp-cttf-card-desc" }, t4.description),
      h4("div", { className: "uspp-cttf-card-authors" }, t4.author || ""),
      h4(
        "label",
        { className: "uspp-cttf-sites uspp-cttf-muted uspp-cttf-small" },
        h4("input", { type: "checkbox", checked: !!t4.allSites, onChange: (e3) => setThemeAllSites(t4.url, e3.target.checked), "data-uspp-cttf-theme-all": t4.url }),
        "Use on all sites"
      )
    );
  }
  function ThemesTab() {
    const force = useForceUpdate();
    useEffect2(() => subscribeThemes(() => force()), []);
    const [query, setQuery] = useState2("");
    const [filter, setFilter] = useState2("all");
    const themes = getThemes();
    const q4 = query.trim().toLowerCase();
    const list = themes.filter((t4) => (!q4 || `${t4.name} ${t4.author || ""} ${t4.description || ""}`.toLowerCase().includes(q4)) && (filter === "all" || filter === "enabled" && t4.enabled || filter === "disabled" && !t4.enabled || filter === "online" && !t4.local || filter === "local" && t4.local));
    const section = (title, desc, onManage) => h4(
      "div",
      { className: "uspp-cttf-section" },
      h4(
        "div",
        { className: "uspp-cttf-row" },
        h4(
          "div",
          { className: "uspp-cttf-row-text" },
          h4("div", { className: "uspp-cttf-row-title" }, title),
          h4("div", { className: "uspp-cttf-muted uspp-cttf-small" }, desc)
        ),
        h4(Button, { onClick: onManage }, "Manage")
      )
    );
    return h4(
      "div",
      { className: "uspp-cttf-page", "data-uspp-cttf-page": "themes" },
      h4("div", { className: "uspp-cttf-muted uspp-cttf-small" }, `Themes for ${siteLabel()}. Turn on "Use on all sites" to apply a theme everywhere.`),
      section(
        "Online Themes",
        "Load themes from a URL. They're cached on this device and checked for updates once a day.",
        () => openModal(({ onClose }) => h4(OnlineThemeModal, { onClose }), { modalKey: "uspp-cttf-online-theme" })
      ),
      section(
        "Local Themes",
        "Custom CSS that only lives on this device.",
        () => openModal(({ onClose }) => h4(LocalThemeModal, { onClose }), { modalKey: "uspp-cttf-local-theme" })
      ),
      themes.length > 0 && h4(
        "div",
        { className: "uspp-cttf-toolbar" },
        h4(Input, { type: "search", placeholder: `Search ${themes.length} themes...`, value: query, onChange: (e3) => setQuery(e3.target.value) }),
        h4(Select, {
          value: filter,
          label: "Filter",
          onChange: setFilter,
          options: [["all", "All"], ["enabled", "Enabled"], ["disabled", "Disabled"], ["online", "Online"], ["local", "Local"]].map(([value, label]) => ({ value, label }))
        })
      ),
      themes.length > 0 && (list.length ? h4("div", { className: "uspp-cttf-grid" }, list.map((t4) => h4(ErrorBoundary, { key: t4.url, fallback: null }, h4(ThemeCard, { t: t4 })))) : h4("div", { className: "uspp-cttf-empty" }, "No themes match your search."))
    );
  }

  // ../Userscriptpp/core/settings/QuickCssTab.js
  function QuickCssTab() {
    const force = useForceUpdate();
    useEffect2(() => {
      const fn2 = () => force();
      SettingsStore.addPrefixChangeListener(SITES_PATH, fn2);
      return () => SettingsStore.removePrefixChangeListener(SITES_PATH, fn2);
    }, []);
    const { css, enabled } = getQuickCss();
    return h4(
      "div",
      { className: "uspp-cttf-page", "data-uspp-cttf-page": "quickcss" },
      h4(
        Row,
        { title: "Enable Quick CSS", description: `Applies as you type, only on ${siteLabel()}. Turning it off keeps your code but stops applying it.` },
        h4(Switch, { checked: enabled, label: "Enable Quick CSS", onChange: (v3) => setQuickCss({ enabled: v3 }) })
      ),
      h4(CodeEditor, { value: css, readOnly: !enabled, placeholder: "Paste your CSS here...", minHeight: 360, onChange: (v3) => setQuickCss({ css: v3 }) })
    );
  }

  // ../Userscriptpp/core/settings/BackupTab.js
  async function runImport() {
    const text = await pickJsonFile();
    if (text == null) return false;
    let parsed;
    try {
      parsed = parseBackup(text);
    } catch (e3) {
      showToast(e3.message, ToastType.ERROR);
      return false;
    }
    const s3 = parsed.summary;
    const ok = await confirmDialog({
      title: "Import settings?",
      body: `This replaces all current ${SCRIPT_NAME} settings with the file's: ${s3.plugins} plugins (${s3.enabled} enabled), ${s3.themes} themes in ${s3.sites} site${s3.sites === 1 ? "" : "s"}${s3.exportedAt ? `, exported ${s3.exportedAt.slice(0, 10)}` : ""}.`,
      confirmText: "Import",
      danger: true
    });
    if (!ok) return false;
    const reload = await importSettings(parsed.settings);
    showToast("Settings imported.", ToastType.SUCCESS);
    if (reload && await confirmDialog({ title: "Reload required", body: "Some imported plugin changes need a page reload.", confirmText: "Reload", cancelText: "Later" })) location.reload();
    return true;
  }
  function BackupTab() {
    const [secrets, setSecrets] = useState2(false);
    return h4(
      "div",
      { className: "uspp-cttf-page", "data-uspp-cttf-page": "backup" },
      h4(
        "div",
        { className: "uspp-cttf-section" },
        h4(
          Row,
          { title: "Export settings", description: `Saves all ${SCRIPT_NAME} settings, for every site, to a JSON file.` },
          h4(Button, { onClick: () => downloadJson(exportSettings({ includeSensitive: secrets }), backupFilename()) }, "Export")
        ),
        h4(
          Row,
          { title: "Include sensitive values", description: "Plugin settings marked sensitive (such as keys) are left out unless this is on." },
          h4(Switch, { checked: secrets, label: "Include sensitive values", onChange: setSecrets })
        )
      ),
      h4(
        "div",
        { className: "uspp-cttf-section" },
        h4(
          Row,
          { title: "Import settings", description: "Replaces all current settings with a file you exported before. You'll be asked to confirm." },
          h4(Button, { onClick: () => {
            runImport();
          } }, "Import")
        )
      )
    );
  }

  // ../Userscriptpp/core/settings/pages.js
  var page = (C4, label) => {
    const P4 = () => h4(ErrorBoundary, { fallback: h4("div", { className: "uspp-cttf-page uspp-cttf-error" }, `${label} failed to render.`) }, h4(C4));
    P4.displayName = `Uspp${label.replace(/\s/g, "")}Page`;
    return P4;
  };
  var SETTINGS_PAGES = Object.freeze([
    { id: TAB_IDS.plugins, key: "plugins", label: "Plugins", icon: PuzzleIcon, component: page(PluginsTab, "Plugins") },
    { id: TAB_IDS.themes, key: "themes", label: "Themes", icon: PaletteIcon, component: page(ThemesTab, "Themes") },
    { id: TAB_IDS.quickCss, key: "quickCss", label: "Quick CSS", icon: CodeIcon, component: page(QuickCssTab, "Quick CSS") },
    { id: TAB_IDS.backup, key: "backup", label: "Backup", icon: ArchiveIcon, component: page(BackupTab, "Backup") }
  ]);
  var pageByKey = (key) => SETTINGS_PAGES.find((p3) => p3.key === key || p3.id === key) || SETTINGS_PAGES[0];

  // ../Userscriptpp/core/settings/SettingsPanel.js
  var PANEL_KEY = "uspp-cttf-settings-panel";
  function SettingsPanel({ tab, onClose }) {
    const [cur, setCur] = useState2(pageByKey(tab).key);
    const page2 = pageByKey(cur);
    return h4(
      ModalCard,
      { title: SCRIPT_NAME, subtitle: `${VERSION} · ${siteLabel()}`, onClose, width: 860 },
      h4(
        "div",
        { className: "uspp-cttf-panel", "data-uspp-cttf-panel": "" },
        h4("div", { className: "uspp-cttf-tabs", role: "tablist" }, SETTINGS_PAGES.map((p3) => h4("button", {
          key: p3.key,
          type: "button",
          role: "tab",
          className: "uspp-cttf-chip",
          "aria-selected": String(p3.key === cur),
          "data-uspp-cttf-panel-tab": p3.key,
          onClick: () => setCur(p3.key)
        }, p3.label))),
        h4(page2.component, { key: page2.key })
      )
    );
  }
  function openSettingsPanel({ tab = "plugins", plugin } = {}) {
    openModal(({ onClose }) => h4(SettingsPanel, { tab, onClose }), { modalKey: PANEL_KEY });
    const p3 = typeof plugin === "string" ? plugins[plugin] : plugin;
    if (p3) openModal(({ onClose }) => h4(PluginModal, { plugin: p3, onClose }), { modalKey: `uspp-cttf-plugin-${p3.name}` });
  }
  var closeSettingsPanel = () => closeModal(PANEL_KEY);

  // ../Userscriptpp/core/index.js
  var logger19 = new Logger("Core", "#c4b5fd");
  var DEFAULT_READY_TIMEOUT = 15e3;
  var BUILD_SITES = typeof define_USPP_SITES_default !== "undefined" ? define_USPP_SITES_default : [];
  function step(label, fn2) {
    try {
      return fn2();
    } catch (e3) {
      logger19.error(`${label} 失败`, e3);
    }
  }
  function openPluginSettings(plugin) {
    const p3 = typeof plugin === "string" ? plugins[plugin] : plugin;
    if (!p3) return false;
    openModal(({ onClose }) => h4(PluginModal, { plugin: p3, onClose }), { modalKey: `uspp-cttf-plugin-${p3.name}` });
    return true;
  }
  function openSettings2(opts = {}) {
    const host2 = getSite().settingsHost;
    if (host2 && typeof host2.open === "function" && PlainSettings.plugins.Settings?.showSiteEntry !== false) {
      let ok = false;
      try {
        ok = !!host2.open(opts);
      } catch (e3) {
        logger19.warn("站点设置界面打开失败", e3);
      }
      if (ok) {
        setTimeout(() => {
          const shown2 = typeof host2.isOpen === "function" ? host2.isOpen() : !!document.querySelector("[data-uspp-cttf-page]");
          if (!shown2) openSettingsPanel(opts);
        }, 800);
        return "site";
      }
    }
    openSettingsPanel(opts);
    return "panel";
  }
  function countIdleMutations(ms = 8e3) {
    const ours = (n2) => n2 && n2.nodeType === 1 && (n2.tagName.toLowerCase().startsWith("uspp-cttf-") || [...n2.attributes].some((a3) => a3.name.startsWith("data-uspp-cttf")) || [...n2.classList].some((c3) => c3.startsWith("uspp-cttf-")) || !!n2.querySelector?.("[data-uspp-cttf],[class*='uspp-cttf-'],uspp-cttf-root"));
    return new Promise((resolve2) => {
      let count2 = 0;
      const samples = [];
      const mo2 = new MutationObserver((list) => {
        for (const m3 of list) {
          const hit = [...m3.addedNodes, ...m3.removedNodes].some(ours) || m3.type === "attributes" && (ours(m3.target) || m3.attributeName?.startsWith("data-uspp-cttf"));
          if (hit) {
            count2++;
            if (samples.length < 10) samples.push(m3.target?.nodeName);
          }
        }
      });
      mo2.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
      setTimeout(() => {
        mo2.disconnect();
        resolve2({ count: count2, samples });
      }, ms);
    });
  }
  function installAliases(api) {
    const names = /* @__PURE__ */ new Set();
    for (const s3 of getSites()) for (const k4 of Object.keys(s3.api || {})) names.add(k4);
    for (const name of names) {
      if (name in api) continue;
      Object.defineProperty(api, name, {
        enumerable: true,
        get() {
          const own = getSite().api;
          if (own && name in own) return own[name];
          const sample = getSites().map((s3) => s3.api?.[name]).find((v3) => v3 != null);
          if (typeof sample === "function") return (...args) => {
            logger19.debug(`${name} 只在 ${siteNamesWith(name)} 上可用,当前站点忽略`, args[0]);
          };
          return {};
        }
      });
    }
  }
  var siteNamesWith = (name) => getSites().filter((s3) => s3.api && name in s3.api).map((s3) => s3.name).join("、");
  function registerHostPatches() {
    const host2 = getSite().settingsHost;
    (host2?.patches || []).forEach((patch, i3) => {
      try {
        addPatch(patch, "Settings", { key: `Settings#host${i3}`, self: `${INSTANCE_EXPR}.site.settingsHost` });
      } catch (e3) {
        logger19.error(`登记站点设置入口的第 ${i3} 条补丁失败`, e3);
      }
    });
  }
  function waitSiteReady(site, cb) {
    let fired = false;
    const r3 = site.ready;
    const timeoutMs = r3 && typeof r3 === "object" && r3.timeout || site.readyTimeout || DEFAULT_READY_TIMEOUT;
    const offs = [];
    const fire2 = () => {
      if (fired) return;
      fired = true;
      offs.forEach((o3) => {
        try {
          o3();
        } catch {
        }
      });
      clearTimeout(timer2);
      cb();
    };
    const timer2 = setTimeout(fire2, r3 ? timeoutMs : 0);
    if (!r3) return;
    if (typeof r3 === "function") {
      const check3 = () => {
        try {
          if (r3()) fire2();
        } catch {
        }
      };
      const iv = setInterval(check3, 200);
      offs.push(() => clearInterval(iv), onModuleLoad(check3));
      check3();
      return;
    }
    if (typeof r3.module === "function") {
      offs.push(waitFor(r3.module, () => setTimeout(fire2, 0)));
      offs.push(onTakeover(() => {
        if (!runtime2.registry) fire2();
      }));
      step("扫描模块缓存", rescanRuntimeCache);
    }
    if (r3.element) waitForElement(r3.element).then((el) => {
      if (el) fire2();
    });
  }
  function checkFingerprint(site) {
    const chunkPath = site.driverOptions?.chunkPath;
    const base = (s3) => {
      try {
        return new URL(s3, location.href).pathname.split("/").pop();
      } catch {
        return String(s3).split("/").pop();
      }
    };
    const names = /* @__PURE__ */ new Set();
    if (chunkPath) for (const s3 of document.querySelectorAll(`script[src*="${chunkPath}"]`)) names.add(base(s3.src));
    for (const p3 of chunkPaths) names.add(base(p3));
    const now2 = [...names].filter(Boolean).sort();
    if (!now2.length) return;
    const prev = Array.isArray(readPartition().chunkFingerprint) ? readPartition().chunkFingerprint : null;
    if (prev && prev.length) {
      const set = new Set(prev);
      const overlap = now2.filter((n2) => set.has(n2)).length;
      if (overlap / Math.max(now2.length, prev.length) < 0.5) logger19.warn(`${site.name} 的构建已变化(分块文件重合不到一半),部分补丁可能失效`);
    }
    if (!prev || prev.join("\n") !== now2.join("\n")) writePartition().chunkFingerprint = now2;
  }
  function retryFailed(list) {
    let pending = list.slice();
    const attempt = () => {
      rescanRuntimeCache();
      pending = pending.filter((p3) => isPluginEnabled(p3.name) && !p3.started && !startPlugin(p3));
    };
    const tick = debounce(() => {
      attempt();
      if (!pending.length) {
        off();
        clearTimeout(last2);
        logger19.info("之前启动失败的插件已全部启动");
      }
    }, 200);
    const off = onModuleLoad(tick);
    const last2 = setTimeout(() => {
      off();
      tick.cancel?.();
      attempt();
      if (pending.length) logger19.warn(`以下插件启动失败:${pending.map((p3) => p3.name).join(", ")}`);
      else logger19.info("之前启动失败的插件已全部启动");
    }, DEFAULT_READY_TIMEOUT);
  }
  var materialize = (entry2, api) => typeof entry2 === "function" ? entry2(api) : entry2;
  function main() {
    if (W.top !== W.self) return;
    if (W[INSTANCE_KEY]) {
      console.info(`[${SCRIPT_NAME}] 本脚本已在运行,跳过重复注入`);
      return;
    }
    let resolveReady;
    const onceReady = new Promise((r3) => {
      resolveReady = r3;
    });
    let siteReadyDone = false;
    const api = {
      version: VERSION,
      apiVersion: API_VERSION,
      buildType: BUILD_TYPE,
      scriptId: SCRIPT_ID,
      scriptName: SCRIPT_NAME,
      // 本脚本页面上名字的前缀(类名、元素名、data- 标记都以它开头),站点适配拼名字时用
      prefix: "uspp-cttf-",
      buildSites: BUILD_SITES.slice(),
      // 站点
      defineSite,
      // 运行时注册站点只作开发构建里的控制台调试手段
      registerSite: (def) => {
        if (!IS_DEV) {
          logger19.warn("registerSite 只在开发构建里可用");
          return false;
        }
        return registerSiteRuntime(def);
      },
      get site() {
        return getSite();
      },
      get sites() {
        return Object.fromEntries(getSites().map((s3) => [s3.id, s3]));
      },
      isSite,
      siteKey,
      // 插件
      plugins,
      registerPlugin,
      startPlugin: startPluginApi,
      stopPlugin: stopPluginApi,
      isPluginEnabled,
      togglePlugin,
      definePlugin,
      definePluginSettings,
      migratePluginSettings,
      migratePluginSetting,
      getVisibleSettings,
      OptionType,
      StartAt,
      // 设置
      Settings,
      PlainSettings,
      SettingsStore,
      openSettings: openSettings2,
      openSettingsPanel,
      closeSettingsPanel,
      openPluginSettings,
      settingsPages: SETTINGS_PAGES,
      exportSettings,
      importSettings,
      parseBackup,
      // 打包器(只在使用打包器驱动的站点上有内容)
      addPatch: (patch, pluginName) => addPatch(patch, pluginName),
      patches,
      patchStats,
      patchResults,
      patchReport: () => ({ ...patchReport(), notApplicable: [...patchesNotApplicable] }),
      getPatchedCode,
      onPatchBypassed,
      registerInjectionFallback,
      // 模块查找
      filters,
      find,
      findAll,
      findByProps,
      findByCode,
      findByDisplayName,
      findComponentByCode,
      findExportedComponent,
      findStore,
      findLazy,
      findByPropsLazy,
      findByCodeLazy,
      findByDisplayNameLazy,
      findComponentByCodeLazy,
      findExportedComponentLazy,
      findStoreLazy,
      findModuleId,
      findModuleFactory,
      mapMangledModule,
      requireModule,
      waitFor,
      search,
      onModuleLoad,
      onceReady,
      getAllStores,
      isZustandStore,
      findReact: getReact,
      // 被其他脚本包装执行的模块只在运行时缓存里:并入本系统的缓存;版本号在缓存变化时递增
      syncModuleCache: () => {
        try {
          syncRuntimeCache();
        } catch {
        }
      },
      moduleCacheVersion: getCacheVersion,
      // DOM / fiber / JSX
      waitForElement,
      observe,
      setAttr,
      setText,
      toggleClass,
      setStyle,
      mount,
      unmount,
      getFiber,
      getProps,
      walkFiberUp,
      findFiberProps,
      addRenderHook,
      asArray,
      treeHas,
      // 路由 / 网络
      onRouteChange,
      onRequest,
      onResponse,
      // 注入点
      addSlotItem,
      removeSlotItem,
      getSlotItems,
      onSlotChange,
      getSlotVersion,
      // 界面
      react: {
        h: h4,
        Fragment: Fragment2,
        getReact: getReact2,
        getRenderer,
        usingSiteRenderer,
        useState: useState2,
        useEffect: useEffect2,
        useLayoutEffect,
        useMemo,
        useRef: useRef2,
        useCallback,
        useReducer: useReducer2,
        useContext,
        useId,
        useSyncExternalStore,
        useForceUpdate,
        useSubscription
      },
      components: { ...components_exports, ModalCard, confirmDialog },
      icons: icons_exports,
      openModal,
      closeModal,
      closeAllModals,
      ensureUiRoot: () => diag.noEarlyUiRoot ? trace("uiRoot.early.skipped") : ensureRoot(),
      showToast,
      dismissToast,
      ToastType,
      showNotice,
      closeNotice,
      theme: currentTheme,
      // 样式与主题(作用于当前站点分区)
      registerStyle: (name, css) => registerStyle(name, css),
      enableStyle,
      disableStyle,
      unregisterStyle,
      classNameFactory,
      classes,
      getThemes,
      addTheme,
      addLocalTheme,
      updateLocalTheme,
      removeTheme,
      enableTheme,
      disableTheme,
      setThemeAllSites,
      isThemesEnabled,
      setThemesEnabled,
      isOnlineThemesEnabled,
      setOnlineThemesEnabled,
      getQuickCss,
      setQuickCss,
      // 事件
      subscribe,
      dispatch,
      Events,
      // 工具
      Logger,
      ErrorBoundary,
      makeLazy,
      proxyLazy,
      fetchExternal,
      copyToClipboard,
      debounce,
      sleep: sleep3,
      onlyOnce,
      escapeRegExp,
      humanizeKey,
      matchesUrl,
      matchPattern,
      isChromium,
      countIdleMutations
    };
    if (IS_DEV) {
      api.diag = { key: DIAG_KEY, config: diag, report: diagReport, set: (c3) => {
        W.localStorage.setItem(DIAG_KEY, JSON.stringify(c3));
        return "已保存,硬刷新后生效";
      }, clear: () => {
        W.localStorage.removeItem(DIAG_KEY);
        return "已清除,硬刷新后生效";
      } };
      setDiagExtra(() => {
        const rep = patchReport();
        let cacheIds = null;
        try {
          cacheIds = runtime2.cache ? Object.keys(runtime2.cache) : null;
        } catch {
        }
        return {
          stats: { ...rep.stats, orphaned: rep.orphaned.length },
          plugins: Object.values(plugins).map((p3) => `${p3.name}:${p3.started}`),
          moduleCache: moduleCache.size,
          runtimeCache: cacheIds ? cacheIds.length : null,
          runtimeCacheIds: cacheIds
        };
      });
      if (diagOn) logger19.warn(`诊断开关已打开:${JSON.stringify(diag)}(${DIAG_KEY})`);
    }
    Object.defineProperty(W, INSTANCE_KEY, { value: api, writable: false, configurable: true, enumerable: false });
    if (GLOBAL_NAME) {
      if (GLOBAL_NAME in W) logger19.warn(`全局名字 ${GLOBAL_NAME} 已被占用,未挂调试入口`);
      else Object.defineProperty(W, GLOBAL_NAME, { value: api, writable: false, configurable: true, enumerable: false });
    }
    step("同步读取设置", loadSync);
    step("注册核心插件", () => addPlugin(settings_default));
    setSettingsOpener(() => openSettings2());
    const sitePlugins = [];
    for (const entry2 of sites_default) {
      step(`载入站点 ${entry2?.id ?? ""}`, () => {
        const def = materialize(entry2.site, api);
        if (!def) return;
        addSite(def);
        for (const pe of entry2.plugins || []) {
          const pd = materialize(pe, api);
          if (pd) {
            pd.site = def.id;
            sitePlugins.push(pd);
          }
        }
        for (const pd of def.plugins || []) {
          pd.site ??= def.id;
          sitePlugins.push(pd);
        }
      });
    }
    const site = selectSite();
    step("站点事件", () => setSiteEvents(site.events));
    step("站点别名", () => installAliases(api));
    const genericPlugins = plugins_default.map((e3) => step("载入通用插件", () => materialize(e3, api))).filter(Boolean);
    for (const def of genericPlugins) {
      def.site ??= "*";
      step(`注册插件 ${def.name}`, () => addPlugin(def));
    }
    for (const def of sitePlugins) step(`注册插件 ${def.name}`, () => addPlugin(def));
    step("菜单命令", installMenuCommands);
    step("悬浮按钮", installFloating);
    step("注册界面样式", () => registerStyle("uspp-cttf-ui", UI_CSS));
    if (typeof site.routeInfo === "function") setRouteParser(site.routeInfo);
    if (site.network) step("网络旁路", installNetworkHooks);
    if (site.route) step("路由工具", installRouteWatcher);
    if (site.driver === "turbopack") {
      step("登记补丁", registerPatches);
      if (diag.noHostPatches) trace("hostPatches.skipped");
      else step("登记站点设置入口补丁", registerHostPatches);
      if (diag.noTurbopack) trace("turbopack.skipped");
      else {
        step("安装打包器拦截", installInterceptor);
        step("监视打包器", () => watchInstrumentation(2e4));
      }
    } else if (site.driver) {
      logger19.warn(`不支持的打包器驱动:${site.driver}`);
    }
    logger19.info(`${SCRIPT_NAME} ${VERSION}(${BUILD_TYPE}),脚本 ID ${SCRIPT_ID},当前站点 ${site.id},已注册 ${Object.keys(plugins).length} 个插件`);
    (async () => {
      try {
        await loadAsync();
      } catch (e3) {
        logger19.error("读取设置失败", e3);
      }
      step("安装卸载保存", installUnloadSave);
      step("多标签页同步", installCrossTabSync);
      step("清理旧设置", cleanStaleSettings);
      step("记录插件", recordKnownPlugins);
      step("强制依赖", enforceDependencies);
      if (site.driver === "turbopack") step("登记补丁", registerPatches);
      step("启动 Init 插件", () => startAllAt(StartAt.Init));
      const onDom = () => {
        step("启动 DOMContentLoaded 插件", () => startAllAt(StartAt.DOMContentLoaded));
        if (diag.noSiteStart) trace("site.start.skipped");
        else {
          trace("site.start");
          step("站点启动", () => site.start?.call(site, api));
        }
        waitSiteReady(site, () => onSiteReady(site));
      };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onDom, { once: true });
      else onDom();
    })();
    function onSiteReady(s3) {
      if (siteReadyDone) return;
      siteReadyDone = true;
      trace("site.ready", s3.id);
      markSiteReady();
      if (s3.driver === "turbopack") step("扫描模块缓存", rescanRuntimeCache);
      step("onceReady", () => resolveReady());
      dispatch(Events.SITE_READY, { site: s3.id });
      const failed = step("启动 SiteReady 插件", () => startAllAt(StartAt.SiteReady)) || [];
      if (failed.length) retryFailed(failed);
      if (s3.driver === "turbopack") {
        logger19.info(`站点已就绪,已加载 ${moduleCache.size} 个模块`);
        setInterval(() => {
          try {
            syncRuntimeCache();
          } catch {
          }
        }, 2e3);
        setTimeout(() => step("补丁健康报告", logHealthReport), 5e3);
        setTimeout(() => step("构建指纹", () => checkFingerprint(s3)), 0);
      }
    }
    function registerSiteRuntime(entry2) {
      const def = typeof entry2 === "function" ? entry2(api) : entry2;
      if (!addSite(def, { runtime: true })) return false;
      const stored = getSiteById(def.id);
      if (!switchTo(stored)) return true;
      logger19.info(`已切换到运行时注册的站点 ${stored.id}`);
      setSiteEvents(stored.events);
      installAliases(api);
      if (typeof stored.routeInfo === "function") setRouteParser(stored.routeInfo);
      if (stored.route) installRouteWatcher();
      for (const pd of stored.plugins || []) {
        pd.site ??= stored.id;
        addPlugin(pd, { runtime: true });
      }
      enforceDependencies();
      for (const stage of [StartAt.Init, StartAt.DOMContentLoaded]) startAllAt(stage);
      step("站点启动", () => stored.start?.call(stored, api));
      siteReadyDone = false;
      waitSiteReady(stored, () => onSiteReady(stored));
      return true;
    }
  }
  try {
    main();
  } catch (e3) {
    console.error(`[${SCRIPT_NAME}] 启动失败`, e3);
  }
})();
