<template>
  <el-container class="app-shell">
    <el-header class="site-header">
      <nav class="top-nav">
        <RouterLink :to="{ name: 'Home' }" class="brand">张又仁</RouterLink>
        <el-menu :default-active="$route.path" mode="horizontal" router class="site-menu">
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/projects">项目</el-menu-item>
          <el-menu-item index="/articles">文章</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
        <RouterLink :to="{ name: 'Admin' }" class="nav-link admin-link">后台管理</RouterLink>
        <el-button v-if="!isAuthenticated" type="primary" @click="router.push({ name: 'Login' })">登录</el-button>
        <el-button v-else type="danger" plain @click="logoutAdmin">退出</el-button>
      </nav>
    </el-header>
    <el-main class="page-wrap">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script>
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/user.js'
import {
  AboutPage,
  AdminArticlePage,
  AdminHomePage,
  AdminIntroPage,
  AdminLayout,
  AdminProjectPage,
  ArticlePage,
  HomePage,
  LoginPage,
  NotFoundPage,
  ProjectDetailPage,
  ProjectLayout,
  ProjectsPage,
  ProjectStatsPage
} from './views/index.js'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: HomePage, meta: { title: '个人主页' } },
  { path: '/about', name: 'About', component: AboutPage, meta: { title: '关于我' } },
  { path: '/articles', name: 'Articles', component: ArticlePage, meta: { title: '文章列表' } },
  {
    path: '/projects',
    component: ProjectLayout,
    meta: { title: '项目中心' },
    children: [
      { path: '', name: 'Projects', component: ProjectsPage, meta: { title: '项目列表' } },
      { path: ':id', name: 'ProjectDetail', component: ProjectDetailPage, meta: { title: '项目详情' } },
      { path: 'stats', name: 'ProjectStats', component: ProjectStatsPage, meta: { title: '项目统计' } }
    ]
  },
  { path: '/login', name: 'Login', component: LoginPage, meta: { title: '后台登录' } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      { path: '', name: 'Admin', component: AdminHomePage, meta: { title: '后台总览' } },
      { path: 'intro', name: 'AdminIntro', component: AdminIntroPage, meta: { title: '简介编辑' } },
      { path: 'project', name: 'AdminProject', component: AdminProjectPage, meta: { title: '项目管理' } },
      { path: 'articles', name: 'AdminArticles', component: AdminArticlePage, meta: { title: '文章管理' } }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage, meta: { title: '404' } }
]

const router = createRouter({
  history: import.meta.env.VITE_ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title || '个人主页'
  const userStore = useUserStore()
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

export { router }

export default {
  name: 'App',
  components: { RouterLink, RouterView },
  setup() {
    const userStore = useUserStore()
    const { isAuthenticated } = storeToRefs(userStore)
    const logoutAdmin = () => {
      userStore.logout()
      router.push({ name: 'Home' })
    }
    return { router, isAuthenticated, logoutAdmin }
  }
}
</script>

<style>
* { box-sizing: border-box; }
html, body, #app {
  margin: 0;
  min-height: 100%;
  font-family: 'Microsoft YaHei', sans-serif;
}
body {
  background: linear-gradient(135deg, #f9f3ff 0%, #eef8ff 100%);
}
button:not(.el-button) {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease;
}
button:not(.el-button):hover {
  transform: translateY(-1px);
}
button.secondary {
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
}
button.small-button {
  padding: 8px 12px;
}
button.nav-button {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}
button.nav-button.light {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
}
.app-shell {
  min-height: 100vh;
  padding: 20px 20px 40px;
}
.site-header {
  max-width: 1100px;
  height: auto !important;
  padding: 0;
  margin: 0 auto 20px;
}
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 18px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.88);
  color: #fff;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08);
}
.site-menu {
  flex: 1;
  min-width: 0;
  border-bottom: 0;
  background: transparent;
}
.site-menu.el-menu--horizontal > .el-menu-item {
  height: 48px;
  color: rgba(255,255,255,.82);
  border-bottom: 0;
  background: transparent;
}
.site-menu.el-menu--horizontal > .el-menu-item:hover,
.site-menu.el-menu--horizontal > .el-menu-item.is-active {
  color: #fff;
  background: rgba(255,255,255,.12);
}
.brand {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: inherit;
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.nav-link {
  color: rgba(255,255,255,0.82);
  text-decoration: none;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
}
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.admin-link {
  color: #d8b4fe;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-wrap {
  max-width: 1100px;
  margin: 0 auto;
}
.page {
  min-height: 100vh;
  padding: 32px 24px 56px;
  transition: background .3s ease;
  background:
    radial-gradient(circle at top left, rgba(168, 85, 247, 0.12), transparent 30%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 35%),
    linear-gradient(135deg, #f9f3ff 0%, #eef8ff 100%);
}
.page.dark {
  background:
    radial-gradient(circle at top left, rgba(129, 140, 248, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.12), transparent 35%),
    #0f172a;
}
.layout {
  max-width: 1100px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 18px;
  text-align: center;
}
.page-header h1 {
  margin: 0 0 6px;
  font-size: 2.4rem;
  color: #1f2937;
}
.page-header p {
  margin: 0;
  color: #64748b;
}
.page main {
  display: grid;
  gap: 24px;
}
.project-panel {
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 28px;
  padding: 26px;
  box-shadow: 0 22px 50px rgba(15, 23, 42, .06);
}
.page-footer {
  text-align: center;
  margin-top: 24px;
  padding: 18px 0 10px;
  color: #64748b;
}
.dark .page-header h1,
.dark .page-header p,
.dark .brand,
.dark .page-footer {
  color: #e2e8f0;
}
.dark .top-nav,
.dark .project-panel {
  background: rgba(15, 23, 42, 0.76);
  border-color: rgba(148, 163, 184, 0.3);
}
.dark .nav-links a,
.dark .page-footer {
  color: #cbd5e1;
}
.content-page {
  min-height: 640px;
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 24px;
  padding: 26px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
}
.project-tabs {
  display: flex;
  gap: 8px;
}
.project-tab {
  color: #475569;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
}
.project-tab.router-link-active,
.project-tab.router-link-exact-active {
  color: #fff;
  background: #0f766e;
}
.article-list {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}
.article-card h3 {
  margin: 0;
}
.article-project {
  color: #64748b;
  font-size: .9rem;
}
.info-card,
.detail-card,
.admin-panel {
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 22px;
  padding: 24px;
}
.info-card h2,
.detail-card h2,
.admin-panel h3 {
  margin-top: 0;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}
.tag-list > span:not(.el-tag) {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f5f3ff;
  color: #5b21b6;
  font-weight: 700;
}
.section-title,
.project-header,
.detail-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
}
.project-card {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
}
.project-card h3 {
  margin: 0;
}
.project-card p,
.detail-card p,
.info-card p,
.auth-card p {
  color: #475569;
  line-height: 1.8;
}
.project-card ul,
.detail-card ul {
  margin: 16px 0 20px;
  padding-left: 20px;
  color: #334155;
}
.status,
.status-box {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
}
.eyebrow {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}
.detail-card p,
.detail-card ul {
  margin-top: 18px;
}
.auth-page,
.empty-card {
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  max-width: 520px;
  width: 100%;
  text-align: center;
}
.admin-page {
  padding: 20px;
}
.admin-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
}
.admin-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  border-radius: 18px;
  padding: 20px 14px;
}
.admin-menu {
  width: 100%;
  border-right: 0;
  background: transparent;
}
.full-width {
  width: 100%;
}
.admin-menu .el-menu-item {
  color: rgba(255,255,255,.8);
  background: transparent;
}
.admin-menu .el-menu-item:hover,
.admin-menu .el-menu-item.is-active {
  color: #fff;
  background: rgba(255,255,255,.12);
}
.admin-sidebar h2 {
  margin: 0 0 12px;
  font-size: 1.3rem;
}
.admin-link-item {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  padding: 9px 12px;
  border-radius: 10px;
  font-weight: 600;
}
.admin-link-item.router-link-active {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.admin-content {
  min-width: 0;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 18px;
}
.stat-box {
  background: linear-gradient(135deg, #eef2ff, #ecfeff);
  border-radius: 16px;
  padding: 18px;
}
.stat-box span {
  display: block;
  color: #64748b;
  margin-bottom: 8px;
}
.stat-box strong {
  font-size: 1.8rem;
  color: #1f2937;
}
textarea {
  width: 100%;
  min-height: 140px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  resize: vertical;
  margin: 12px 0 16px;
}
.admin-create-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0 24px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
.admin-create-form h4 {
  grid-column: 1 / -1;
  margin: 0;
}
.admin-create-form label {
  display: grid;
  gap: 6px;
}
.admin-create-form label span {
  font-weight: 700;
}
.admin-create-form input,
.admin-create-form select {
  width: 100%;
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  font: inherit;
}
.admin-create-form .admin-create-description {
  grid-column: 1 / -1;
}
.admin-create-form textarea {
  min-height: 84px;
  margin: 0;
}
.admin-create-form button {
  justify-self: start;
}
.admin-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.admin-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
}
.admin-project-field {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 10px;
}
.admin-project-field label {
  display: grid;
  gap: 6px;
  font-weight: 700;
}
.admin-project-field input,
.admin-project-field select {
  width: 100%;
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  font: inherit;
}
.admin-project-field span {
  display: block;
  font-weight: 700;
}
.admin-project-field textarea {
  display: block;
  min-height: 76px;
  margin: 0;
}
.admin-actions {
  display: flex;
  gap: 8px;
}
.danger-button {
  background: linear-gradient(135deg, #dc2626, #f97316);
}
.save-message {
  color: #166534;
  font-weight: 700;
}
@media (max-width: 760px) {
  .top-nav {
    flex-direction: column;
    gap: 12px;
  }
  .nav-links {
    justify-content: center;
  }
  .project-section-title,
  .admin-item {
    align-items: stretch;
    flex-direction: column;
  }
  .admin-create-form {
    grid-template-columns: 1fr;
  }
  .admin-create-form h4,
  .admin-create-form .admin-create-description {
    grid-column: auto;
  }
  .admin-shell {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100% !important;
  }
  .site-menu.el-menu--horizontal > .el-menu-item {
    padding: 0 10px;
  }
}
@media (max-width: 640px) {
  .page {
    padding: 24px 16px 40px;
  }
  .nav-links {
    gap: 10px;
  }
}

:root {
  --app-ink: #172033;
  --app-muted: #68758a;
  --app-primary: #5b66d6;
  --app-border: #e6eaf2;
  --app-surface: #fff;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  color: var(--app-ink);
  font-family: Inter, "Segoe UI", "Microsoft YaHei", sans-serif;
  background:
    radial-gradient(ellipse at 12% 0%, rgba(124, 133, 232, .12), transparent 34rem),
    radial-gradient(ellipse at 92% 28%, rgba(71, 177, 185, .09), transparent 30rem),
    #f5f7fb;
}

.app-shell {
  padding: 24px 32px 48px;
}

.site-header,
.page-wrap {
  width: min(100%, 1440px);
  max-width: 1440px;
}

.site-header {
  position: sticky;
  top: 14px;
  z-index: 20;
  margin-bottom: 28px;
}

.top-nav {
  min-height: 72px;
  padding: 10px 18px 10px 24px;
  border: 1px solid rgba(226, 231, 241, .9);
  border-radius: 20px;
  background: rgba(255, 255, 255, .88);
  color: var(--app-ink);
  box-shadow: 0 12px 32px rgba(30, 43, 72, .08);
  backdrop-filter: blur(16px);
}

.brand {
  color: var(--app-ink);
  white-space: nowrap;
}

.site-menu {
  justify-content: center;
}

.site-menu.el-menu--horizontal {
  border-bottom: 0;
}

.site-menu.el-menu--horizontal > .el-menu-item {
  position: relative;
  height: 48px;
  margin: 0 3px;
  padding: 0 16px;
  border-radius: 12px;
  color: #596579;
  font-weight: 600;
  transition: color .2s ease, background .2s ease;
}

.site-menu.el-menu--horizontal > .el-menu-item:hover,
.site-menu.el-menu--horizontal > .el-menu-item.is-active {
  color: var(--app-primary);
  background: #f0f1ff;
}

.site-menu.el-menu--horizontal > .el-menu-item.is-active::after {
  display: none;
}

.admin-link {
  color: var(--app-primary);
  white-space: nowrap;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background: #f0f1ff;
  color: var(--app-primary);
}

.top-nav > .el-button {
  border-radius: 11px;
  font-weight: 650;
}

.page-wrap {
  padding: 0;
}

.page {
  min-height: auto;
  padding: 18px 0 32px;
  background: transparent;
}

.layout {
  max-width: 1360px;
}

.page-header {
  margin: 0 auto 34px;
  text-align: left;
}

.page-kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--app-primary);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .16em;
}

.page-header h1 {
  margin-bottom: 8px;
  color: var(--app-ink);
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -.045em;
}

.page-header p {
  color: var(--app-muted);
  font-size: 1rem;
}

.project-panel,
.content-page {
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, .88);
  box-shadow: 0 16px 42px rgba(30, 43, 72, .055);
}

.project-panel {
  padding: 30px;
}

.project-list,
.project-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.content-page {
  min-height: 0;
  padding: clamp(22px, 4vw, 38px);
}

.info-card,
.detail-card,
.admin-panel {
  border-color: var(--app-border);
  border-radius: 18px;
  background: var(--app-surface);
  box-shadow: 0 8px 24px rgba(30, 43, 72, .035);
}

.project-card,
.article-card {
  border-color: var(--app-border);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(30, 43, 72, .035);
}

.project-card:hover,
.article-card:hover {
  border-color: #d7daf9;
  box-shadow: 0 14px 30px rgba(50, 63, 115, .09);
}

.project-grid .project-card {
  display: flex;
  overflow: hidden;
  padding: 0;
}

.project-grid .project-card .el-card__body {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
}

.project-grid .project-card .el-button {
  margin-top: auto;
}

.content-page h2,
.project-panel h2,
.admin-panel h3 {
  color: var(--app-ink);
  letter-spacing: -.025em;
}

.section-title {
  margin-bottom: 20px;
}

.section-title h2,
.section-title h3 {
  margin: 0;
}

.article-list {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  align-items: stretch;
}

.article-card {
  height: 100%;
}

.admin-page {
  padding: 22px;
}

.admin-shell {
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}

.admin-sidebar {
  min-height: 420px;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 20px;
  background: #202940;
  box-shadow: 0 12px 28px rgba(30, 43, 72, .12);
}

.admin-sidebar h2 {
  color: #fff;
}

.admin-menu .el-menu-item {
  margin: 4px 0;
  border-radius: 10px;
}

.admin-menu .el-menu-item:hover,
.admin-menu .el-menu-item.is-active {
  color: #fff;
  background: rgba(255, 255, 255, .13);
}

.admin-content {
  padding: 0;
}

.admin-panel {
  min-height: 260px;
  padding: 28px;
}

.stat-box {
  border: 1px solid #e7ebf4;
  border-radius: 16px;
  background: linear-gradient(145deg, #f7f8ff, #f1fbfb);
}

.el-button--primary {
  --el-button-bg-color: var(--app-primary);
  --el-button-border-color: var(--app-primary);
  --el-button-hover-bg-color: #4b55c3;
  --el-button-hover-border-color: #4b55c3;
}

.el-input__wrapper,
.el-select__wrapper {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e1e6ef inset;
}

.el-input__wrapper:hover,
.el-select__wrapper:hover {
  box-shadow: 0 0 0 1px #aeb4ed inset;
}

.el-dialog {
  border-radius: 18px;
  overflow: hidden;
}

.page-footer {
  color: #8791a3;
  font-size: .88rem;
}

@media (max-width: 760px) {
  .app-shell {
    padding: 14px 16px 32px;
  }

  .site-header {
    position: static;
    margin-bottom: 18px;
  }

  .top-nav {
    padding: 12px;
    border-radius: 16px;
  }

  .site-menu {
    width: 100%;
    justify-content: center;
  }

  .site-menu.el-menu--horizontal > .el-menu-item {
    padding: 0 12px;
  }

  .page {
    padding-top: 8px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .project-panel {
    padding: 22px;
  }

  .project-list,
  .project-grid {
    grid-template-columns: 1fr;
  }

  .admin-shell {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .admin-sidebar {
    min-height: 0;
  }

  .admin-menu {
    display: flex;
    flex-wrap: wrap;
  }

  .admin-menu .el-menu-item {
    flex: 1 0 40%;
  }

  .admin-content {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .app-shell {
    padding: 10px 12px 28px;
  }

  .top-nav {
    gap: 8px;
  }

  .top-nav .brand {
    font-size: 1rem;
  }

  .site-menu.el-menu--horizontal > .el-menu-item {
    padding: 0 9px;
    font-size: .85rem;
  }

  .admin-page {
    padding: 16px;
  }

  .admin-panel {
    padding: 20px;
  }

  .section-title,
  .project-section-title {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
