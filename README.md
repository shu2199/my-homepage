# 张又仁个人主页

Vue 3 + Vue Router + Pinia + Element Plus 实验项目，包含个人主页、个人信息时间线、项目中心、文章列表、登录页和后台管理页面。

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 路由模式

默认使用 History 模式，地址示例：`/home`、`/projects/1`。如需切换为 Hash 模式，在启动开发服务器前设置环境变量：

PowerShell：

```powershell
$env:VITE_ROUTER_MODE = 'hash'
npm run dev
```

Hash 模式地址会包含 `#`，例如 `/#/home`。不设置该变量或将其设为其他值时使用 History 模式。

## 页面与验证

- `/` 重定向到 `/home`；顶部导航使用命名路由并显示当前页面状态。
- `/projects`、`/projects/:id`、`/projects/stats` 共享项目中心嵌套布局。
- `/articles` 显示文章，`/admin/articles` 提供文章新增、编辑和删除。
- `/admin` 及其子页面需要先通过 `/login`；登录态、个人简介、项目和文章数据由 Pinia Store 管理并保存至 `localStorage`。项目管理支持新增、编辑和删除，修改会同步到公开页面。
- 未匹配的地址显示 404 页面；页面标题由路由元信息更新。
- `main.js` 全局注册 Element Plus 并引入主题样式；页面使用布局容器、菜单、卡片、标签、时间线、表格、统计、表单、输入框、选择器、对话框、提示和空状态等组件。
- “关于”页从用户 Store 展示个人简介与标签，并以时间线呈现学习经历；项目/文章后台通过表格、表单和对话框完成新增、编辑、删除。

## 部署到 GitHub Pages

仓库已配置 GitHub Actions 自动部署。将项目推送到 GitHub 仓库的 `main` 或 `master` 分支后，工作流会自动构建并发布；也可以在仓库的 **Actions** 页面手动运行 `Deploy to GitHub Pages`。

首次部署前，在 GitHub 仓库 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**。等待 Actions 工作流成功后，可在该页面查看站点地址。项目仓库的地址形式为 `https://<用户名>.github.io/<仓库名>/#/home`；个人/组织站点仓库（`<用户名>.github.io`）使用根路径。部署构建会自动设置 Vite 资源基路径，并启用 Hash 路由以支持 GitHub Pages 的静态托管。

若 Pages 工作流失败，请先确认仓库 Pages 来源已选择 **GitHub Actions**，再查看 Actions 运行日志。

## Pinia Store

- `user`：`profile` 保存头像、姓名、班级、专业、简介和标签，`isAuthenticated` 保存登录状态；登录、退出及简介保存时分别调用 `login`、`logout`、`updateIntro`。
- `projects`：`projects` 保存项目 ID、名称、状态、描述和亮点；`completedCount`、`onlineCount` 是统计 getters。后台新增、保存和删除项目时分别调用 `createProject`、`updateProject`、`deleteProject`。
- `articles`：`articles` 保存文章 ID、标题、内容和关联项目 ID；`articleCount`、`getArticleById` 是查询 getters。后台发布、保存和删除文章时分别调用 `createArticle`、`updateArticle`、`deleteArticle`。
- 项目删除时，`projects` Store 调用 `articles.unlinkProject` 清除文章关联但保留文章内容；项目更新时，文章页按项目 ID 读取最新项目名称。
- 页面使用 `storeToRefs` 解构响应式 state/getters；刷新后通过 `localStorage` 恢复数据。
- `vite.config.js` 已启用 Vue DevTools 插件。运行开发服务器后，在 Vue DevTools 的 Pinia 面板检查 Store state/getters，并在项目/文章管理页面操作时查看相应 action 调用和状态变化。
- 后台登录为本实验的演示登录，不包含真实账号验证；客户端登录状态不能作为生产环境的安全边界。

构建验证：`npm run build`。
