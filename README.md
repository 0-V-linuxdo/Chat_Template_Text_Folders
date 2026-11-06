# [Chat] Template Text Folders · Userscript++ 版(2.0)

在 AI 聊天网页底部放一条**按钮栏**:文件夹 → 模板按钮,一键把常用提示词写进输入框,可选自动发送;支持 **WebDAV 同步**。
本版基于 [Userscript++](https://github.com/0-V-linuxdo/Userscriptpp) 框架,按功能规格净室重写,不含原实现代码。 构建所用框架版本:Userscriptpp main `ec1795a`(必需插件卡片保持正常外观、开关锁定)。

## 本体插件(只内置必要的)

| 插件 | 作用 |
| --- | --- |
| `Settings` | 框架自带:框架设置面板、菜单命令 |
| `PromptToolbar` | 底部按钮栏、文件夹弹层、模板 / 工具按钮、⚙️ 设置、✖ 清空、「打开模板设置」菜单 |
| `PromptManager` | 设置面板:文件夹 / 按钮增删改、显示开关、拖拽排序(文件夹、按钮、跨文件夹移动) |
| `AutoSubmit` | 写入后自动发送;「⚡ 自动化」规则管理(Enter / Cmd·Ctrl+Enter / 点击发送按钮 / 自定义选择器) |
| `ConfigTransfer` | 「🛠️ 脚本配置」:语言、文件夹图标、导出 / 导入(带差异预览)/ 重置;旧版本地数据迁移 |
| `WebDAVSync` | WebDAV 测试连接 / 上传 / 拉取、冲突选择框、可选自动同步 |

写入输入框(定位输入框、四个模板变量、按编辑器类型写入)是站点公共件 `lib/composer.js`,不能被单独关掉。
可选插件(网站样式规则、Google Drive 同步、详细差异视图)不在本体里。

## 模板变量

| 变量 | 含义 |
| --- | --- |
| `{inputboard}` | 输入框当前全部文本(含它时整体替换输入框) |
| `{clipboard}` | 剪贴板文本(读不到时不写入) |
| `{selection}` | 点击时页面选中的文本 |
| `{{inputboard}\|{clipboard}}` | 输入框非空用输入框,否则用剪贴板(整体替换) |

## 数据与同步

- 配置、语言偏好、WebDAV 设置存在脚本管理器的 GM 存储(键 `cttf.config` / `cttf.prefs` / `cttf.webdav`),**所有网站共用一份**,多标签页自动同步;不写进网页的 localStorage / IndexedDB。
- 首次运行会导入当前网站上旧版的 `localStorage['chatGPTButtonFoldersConfig']`;之后在其他网站发现不同的旧数据时提示一次。旧数据不删除。
- 导出的 JSON 与原版格式兼容,原版导出的文件可直接导入。导出文件里没有 WebDAV 密码。
- WebDAV:请求全部走 `GM_xmlhttpRequest`(`@connect *`),Basic 认证;远端文件 = 导出格式 + `_sync` 字段;目录不存在时自动逐级创建;上传带 `If-Match`,远端在别处改过时弹出「以本地为准 / 以云端为准」。坚果云示例:地址 `https://dav.jianguoyun.com/dav/`,密码用「应用密码」。
- 自动同步(可选):页面就绪后检查一次云端(10 分钟内多标签只查一次),本地修改后 10 秒合并上传;冲突时只显示提示条,点击处理。

## 支持的网站

ChatGPT、Chat01、Claude、Gemini、AI Studio、Gemini Business、Grok(含镜像与 X)、DeepSeek、Z.ai、Qwen、Anuneko、Perplexity、Kagi Assistant、Arena、Manus、Poe、LobeHub、Monica、Tabbit、TypingCloud、Cerebr、Notion、Mistral、Copilot、Meta AI、Telegram Web A。
新增网站只需在 `sites/chat/hosts.js` 加一项(输入框 / 发送按钮选择器、隐藏按钮栏的页面、固定样式)。

## 构建与测试

```sh
git clone https://github.com/0-V-linuxdo/Userscriptpp ../Userscriptpp && (cd ../Userscriptpp && npm install)
npm install
npm run build   # 产出 dist/*.user.js(发布 / 开发两种),并复制发布构建到仓库根目录
npm test        # 构建 + jsdom 冒烟测试(仿 ChatGPT 页面 + 内存 WebDAV 服务器)
```

也可以用 `USPP_DIR=<框架目录>` 指定框架位置。

## 目录

- `sites/chat/index.js`:站点适配(按钮栏宿主、显示 / 隐藏、注入点 `bar`)
- `sites/chat/hosts.js`:各网站差异表
- `sites/chat/lib/`:配置模型、存储、写入输入框、自动提交、WebDAV 客户端、界面公共件、中英文
- `sites/chat/plugins/`:六个本体插件
- `test/`:冒烟测试

## 框架补丁

`patches/` 下的补丁会在构建时自动打到 Userscript++ 框架上(已打过则跳过):

- `userscriptpp-modal-host-dialog.patch`:框架弹窗只放进站点真正的模态框里。ChatGPT 页面常驻一个非模态、零尺寸、不接收点击的 quick chat 浮层(`section[role=dialog][data-state=open][aria-modal=false]`),原逻辑会把弹窗塞进去,导致编辑、删除、横幅「查看」等按钮点了看不见弹窗。建议合入框架上游。
