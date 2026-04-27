<img src="https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/raw/refs/heads/main/Icon.svg" alt="图标" width="60" height="60"/>

<h1>
  [Chat] Template Text Folders
  <a href="https://raw.githubusercontent.com/0-V-linuxdo/Chat_Template_Text_Folders/refs/heads/main/%5BChat%5D%20Template%20Text%20Folders.user.js">
    <img align="right" src="./assets/install-userscript-badge.svg" alt="安装 userscript"/>
  </a>
</h1>

<details open>
<summary>简介</summary>
  
- 在AI网页底部，添加 `提示词模版` 文件夹+按钮，
- 减少重复输入，提升输入效率！

  <details open>
  <summary>示例1：ChatGPT网页</summary>
    <img width="1462" height="1083" alt="image" src="https://github.com/user-attachments/assets/b7d417c7-5235-42de-8e70-ed3edac3cb31" />
  </details>

  <details>
  <summary>示例2：ChatHub网页</summary>
    <img width="1462" height="1060" alt="image" src="https://github.com/user-attachments/assets/7f370227-8864-4d31-bdeb-b57b2a56df98" />
  </details>

</details>

<details>
<summary>支持的浏览器</summary>
  
- Chrome
- Firefox
- Safari

注意：
Firefox/Safari 获取剪切板内容，需要手动确认！
</details>

<details>
<summary>支持的脚本管理器</summary>
  
- Adguard (app version) - All
- violentmonkey - Chrome/Firefox
- Stay - Safari

其他：
- Arc Boost
  
  <details>
  <summary>示例：ChatHub插件</summary>
  <img width="1445" height="1060" alt="image" src="https://github.com/user-attachments/assets/c717cdf0-5504-402b-bdc3-d7de0cd5f879" />
  </details>

提示：
脚本数据存储在 本地 - 浏览器localstorage 中！
</details>

<details>
<summary>支持的AI网页</summary>
  
| 图标 | 名称 | 网址 | 内置样式 | 备注 |
|:---:|---|---|:---:|---|
| <img src="https://www.google.com/s2/favicons?domain=chatgpt.com&amp;sz=32" width="20" height="20" alt="ChatGPT"> | ChatGPT | `https://chatgpt.com/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=chat01.ai&amp;sz=32" width="20" height="20" alt="Chat01"> | Chat01 | `https://chat01.ai/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=claude.ai&amp;sz=32" width="20" height="20" alt="Claude"> | Claude | `https://claude.*/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=gemini.google.com&amp;sz=32" width="20" height="20" alt="Gemini"> | Gemini | `https://gemini.google.com/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=aistudio.google.com&amp;sz=32" width="20" height="20" alt="Google AI Studio"> | Google AI Studio | `https://aistudio.google.com/*` | ✅ |  |
| <img src="https://auth.business.gemini.google/favicon.ico" width="20" height="20" alt="Gemini Business"> | Gemini Business | `https://business.gemini.google/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=copilot.microsoft.com&amp;sz=32" width="20" height="20" alt="Microsoft Copilot"> | Microsoft Copilot | `https://copilot.microsoft.com/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=grok.com&amp;sz=32" width="20" height="20" alt="Grok"> | Grok | `https://grok.com/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=grok.dairoot.cn&amp;sz=32" width="20" height="20" alt="Grok 镜像"> | Grok 镜像 | `https://grok.dairoot.cn/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=x.com&amp;sz=32" width="20" height="20" alt="X Grok"> | X Grok | `https://x.com/i/grok*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=chat.deepseek.com&amp;sz=32" width="20" height="20" alt="DeepSeek"> | DeepSeek | `https://chat.deepseek.com/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=chat.z.ai&amp;sz=32" width="20" height="20" alt="Z.ai"> | Z.ai | `https://chat.z.ai/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=chat.qwen.ai&amp;sz=32" width="20" height="20" alt="Qwen"> | Qwen | `https://chat.qwen.ai/*` | ❌ | 不支持 AdGuard 注入，因为网页严格限制 JS 来源 |
| <img src="https://www.google.com/s2/favicons?domain=anuneko.com&amp;sz=32" width="20" height="20" alt="Anuneko"> | Anuneko | `https://anuneko.com/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=cerebr.yym68686.top&amp;sz=32" width="20" height="20" alt="Cerebr"> | Cerebr | `https://cerebr.yym68686.top/*` | ✅ | 暂只支持网页版，插件版没有适配最新的插件系统 |
| <img src="https://www.google.com/s2/favicons?domain=chat.mistral.ai&amp;sz=32" width="20" height="20" alt="Mistral"> | Mistral | `https://chat.mistral.ai/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=perplexity.ai&amp;sz=32" width="20" height="20" alt="Perplexity"> | Perplexity | `https://*.perplexity.ai/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=arena.ai&amp;sz=32" width="20" height="20" alt="Arena"> | Arena | `https://arena.ai/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=manus.im&amp;sz=32" width="20" height="20" alt="Manus"> | Manus | `https://manus.im/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=poe.com&amp;sz=32" width="20" height="20" alt="Poe"> | Poe | `https://poe.com/*` | ✅ |  |
| <img src="./assets/kagi-assistant-icon.svg" width="20" height="20" alt="Kagi Assistant"> | Kagi Assistant | `https://kagi.com/assistant*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=app.chathub.gg&amp;sz=32" width="20" height="20" alt="ChatHub"> | ChatHub | `https://app.chathub.gg/*` | ✅ | ⚠️ 不推荐订阅！存在模型掺水问题！ |
| <img src="https://www.google.com/s2/favicons?domain=monica.im&amp;sz=32" width="20" height="20" alt="Monica"> | Monica | `https://monica.im/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=meta.ai&amp;sz=32" width="20" height="20" alt="Meta AI"> | Meta AI | `https://meta.ai/*` | ❌ |  |
| <img src="https://www.google.com/s2/favicons?domain=web.tabbitbrowser.com&amp;sz=32" width="20" height="20" alt="Tabbit Browser"> | Tabbit Browser | `https://web.tabbitbrowser.com/*` | ❌ | 不支持注入，需要魔改 .app |
| <img src="https://www.google.com/s2/favicons?domain=setapp.typingcloud.com&amp;sz=32" width="20" height="20" alt="TypingCloud SetApp"> | TypingCloud SetApp | `https://setapp.typingcloud.com/*` | ✅ |  |
| <img src="https://www.google.com/s2/favicons?domain=www.notion.so&amp;sz=32" width="20" height="20" alt="Notion"> | Notion | `https://www.notion.so/*` | ✅ |  |
</details>

---

完整源码请查看 [dev 分支](https://github.com/0-V-linuxdo/Chat_Template_Text_Folders/tree/dev)。
