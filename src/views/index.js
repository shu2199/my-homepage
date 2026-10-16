import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import ProfileCard from '../components/ProfileCard.vue'
import ProjectShowcase from '../components/ProjectShowcase.vue'
import { useArticleStore } from '../stores/articles.js'
import { useProjectStore } from '../stores/projects.js'
import { useUserStore } from '../stores/user.js'

export const skillList = ['HTML', 'CSS', 'JavaScript', 'Vue3', 'Java', 'MySQL']

export const HomePage = {
  name: 'HomePage',
  components: { ProfileCard, ProjectShowcase },
  template: `
    <div class="page" :class="{ dark: isDark }">
      <div class="layout">
        <header class="page-header">
          <span class="page-kicker">MY PORTFOLIO</span>
          <h1>个人主页</h1>
          <p>计算机科学与技术 · 24计科2班 <span class="header-divider">/</span> 用代码记录灵感与成长</p>
        </header>

        <main>
          <ProfileCard
            id="profile"
            :user-info="profile"
            :skill-list="skillList"
            v-model:search-word="searchWord"
            v-model:is-dark="isDark"
          />

          <ProjectShowcase id="projects" :projects="projects" @open-project="handleProjectOpen">
            <template #actions="{ project }">
              <button class="project-button" @click="handleProjectOpen(project)">查看详情</button>
            </template>
          </ProjectShowcase>
        </main>

        <footer class="page-footer">
          <p>© 2026 张又仁个人主页 · 记录学习、作品与成长</p>
        </footer>
      </div>
    </div>
  `,
  setup() {
    const searchWord = ref('')
    const isDark = ref(false)
    const router = useRouter()
    const userStore = useUserStore()
    const projectStore = useProjectStore()
    const { profile } = storeToRefs(userStore)
    const { projects } = storeToRefs(projectStore)
    const handleProjectOpen = (project) => router.push({ name: 'ProjectDetail', params: { id: project.id } })
    return { profile, skillList, searchWord, isDark, projects, handleProjectOpen }
  }
}

export const AboutPage = {
  name: 'AboutPage',
  template: `
    <section class="content-page">
      <el-card class="info-card" shadow="never">
        <h2>个人信息</h2>
        <p><strong>{{ profile.name }}</strong> · {{ profile.className }} · {{ profile.major }}</p>
        <p>{{ profile.intro }}</p>
        <div class="tag-list">
          <el-tag v-for="tag in tags" :key="tag" effect="light">{{ tag }}</el-tag>
        </div>
        <h3>学习与成长</h3>
        <el-timeline>
          <el-timeline-item v-for="event in milestones" :key="event.timestamp" :timestamp="event.timestamp" :type="event.type" placement="top">
            {{ event.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </section>
  `,
  setup() {
    const userStore = useUserStore()
    const { profile } = storeToRefs(userStore)
    const tags = ['前端', 'Vue3', 'JavaScript', '编程', '学习']
    const milestones = [
      { timestamp: '2024.09', content: '开始计算机专业学习，建立编程基础。', type: 'primary' },
      { timestamp: '2025.03', content: '学习 HTML、CSS 与 JavaScript，完成多个页面练习。', type: 'success' },
      { timestamp: '2025.09', content: '开始使用 Vue 组件化开发个人项目。', type: 'warning' },
      { timestamp: '2026.06', content: '整合 Vue Router、Pinia 与 Element Plus，完善个人主页。', type: 'primary' }
    ]
    return { profile, tags, milestones }
  }
}

export const ProjectsPage = {
  name: 'ProjectsPage',
  template: `
    <section class="projects-page">
      <div class="project-grid">
        <el-card v-for="project in projects" :key="project.id" class="project-card" shadow="hover">
          <div class="project-header">
            <h3>{{ project.name }}</h3>
            <el-tag :type="project.status === '已上线' ? 'success' : 'info'">{{ project.status }}</el-tag>
          </div>
          <p>{{ project.description }}</p>
          <ul>
            <li v-for="item in project.highlights" :key="item">{{ item }}</li>
          </ul>
          <el-button type="primary" @click="openProject(project)">查看详情</el-button>
        </el-card>
      </div>
      <el-empty v-if="!projects.length" description="暂时还没有项目" />
    </section>
  `,
  setup() {
    const router = useRouter()
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    const openProject = (project) => router.push({ name: 'ProjectDetail', params: { id: project.id } })
    return { projects, openProject }
  }
}

export const ArticlePage = {
  name: 'ArticlePage',
  template: `
    <section class="content-page">
      <div class="section-title">
        <h2>文章列表</h2>
        <span>{{ articles.length }} 篇文章</span>
      </div>
      <div v-if="articles.length" class="article-list">
        <el-card v-for="article in articles" :key="article.id" class="info-card article-card" shadow="hover">
          <h3>{{ article.title }}</h3>
          <p class="article-project"><el-tag size="small" type="info">关联项目：{{ getProjectName(article.projectId) }}</el-tag></p>
          <p>{{ article.content }}</p>
        </el-card>
      </div>
      <el-empty v-else description="暂时还没有文章" />
    </section>
  `,
  setup() {
    const articleStore = useArticleStore()
    const projectStore = useProjectStore()
    const { articles } = storeToRefs(articleStore)
    const { projects } = storeToRefs(projectStore)
    const getProjectName = projectId => projects.value.find(project => project.id === projectId)?.name || '未关联项目'
    return { articles, getProjectName }
  }
}

export const ProjectLayout = {
  name: 'ProjectLayout',
  components: { RouterLink, RouterView },
  template: `
    <section class="content-page">
      <div class="section-title project-section-title">
        <h2>项目中心</h2>
        <nav class="project-tabs">
          <RouterLink :to="{ name: 'Projects' }" class="project-tab" exact-active-class="router-link-exact-active">项目列表</RouterLink>
          <RouterLink :to="{ name: 'ProjectStats' }" class="project-tab">项目统计</RouterLink>
        </nav>
      </div>
      <RouterView />
    </section>
  `
}

export const ProjectDetailPage = {
  name: 'ProjectDetailPage',
  template: `
    <section class="detail-page">
      <div v-if="project" class="detail-card">
        <span class="eyebrow">项目详情</span>
        <h2>{{ project.name }}</h2>
        <div class="status-box">{{ project.status }}</div>
        <p>{{ project.description }}</p>
        <ul>
          <li v-for="item in project.highlights" :key="item">{{ item }}</li>
        </ul>
        <div class="detail-actions">
          <button @click="router.go(-1)">返回上一页</button>
          <button class="secondary" @click="router.push({ name: 'Projects' })">返回列表</button>
        </div>
      </div>
      <div v-else class="detail-card empty-card">
        <h2>无效项目地址</h2>
        <p>该项目编号不存在或链接已失效。</p>
        <button @click="backToProjects">返回项目列表</button>
      </div>
    </section>
  `,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    const project = computed(() => projects.value.find(item => Number(item.id) === Number(route.params.id)))
    const backToProjects = () => router.replace({ name: 'Projects' })
    return { project, router, backToProjects }
  }
}

export const ProjectStatsPage = {
  name: 'ProjectStatsPage',
  template: `
    <div class="stat-grid project-stat-grid">
      <el-card class="stat-box"><el-statistic title="项目总数" :value="projects.length" /></el-card>
      <el-card class="stat-box"><el-statistic title="已完成" :value="completedCount" /></el-card>
      <el-card class="stat-box"><el-statistic title="已上线" :value="onlineCount" /></el-card>
    </div>
  `,
  setup() {
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    const { completedCount, onlineCount } = storeToRefs(projectStore)
    return { projects, completedCount, onlineCount }
  }
}

export const LoginPage = {
  name: 'LoginPage',
  template: `
    <section class="content-page auth-page">
      <el-card class="info-card auth-card" shadow="hover">
        <h2>后台登录</h2>
        <p>登录后即可进入后台管理页面，管理员访问需要权限控制。</p>
        <el-alert title="此登录仅用于课程实验演示，不提供真实身份认证。" type="warning" :closable="false" />
        <el-button type="primary" @click="handleLogin">登录后台</el-button>
      </el-card>
    </section>
  `,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const handleLogin = () => {
      useUserStore().login()
      const redirect = route.query.redirect || '/admin'
      router.push(typeof redirect === 'string' ? redirect : '/admin')
    }
    return { handleLogin }
  }
}

export const AdminHomePage = {
  name: 'AdminHomePage',
  template: `
    <div class="admin-panel">
      <h3>后台总览</h3>
      <div class="stat-grid">
        <el-card class="stat-box"><el-statistic title="项目数量" :value="projects.length" /></el-card>
        <el-card class="stat-box"><el-statistic title="文章数量" :value="articleCount" /></el-card>
        <el-card class="stat-box"><el-statistic title="浏览量（演示）" :value="12400" /></el-card>
        <el-card class="stat-box">
          <span class="stat-label">系统状态</span>
          <el-tag type="success" effect="light">正常</el-tag>
        </el-card>
      </div>
    </div>
  `,
  setup() {
    const projectStore = useProjectStore()
    const articleStore = useArticleStore()
    const { projects } = storeToRefs(projectStore)
    const { articleCount } = storeToRefs(articleStore)
    return { projects, articleCount }
  }
}

export const AdminIntroPage = {
  name: 'AdminIntroPage',
  template: `
    <div class="admin-panel">
      <h3>个人简介编辑</h3>
      <el-form label-position="top">
        <el-form-item label="个人简介">
          <el-input v-model="introText" type="textarea" :rows="6" maxlength="300" show-word-limit />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveIntro">保存修改</el-button>
      <p v-if="saved" class="save-message" role="status">个人简介已保存。</p>
    </div>
  `,
  setup() {
    const userStore = useUserStore()
    const { profile } = storeToRefs(userStore)
    const introText = ref(profile.value.intro)
    const saved = ref(false)
    const saveIntro = () => {
      userStore.updateIntro(introText.value.trim())
      saved.value = true
      ElMessage.success('个人简介已保存')
    }
    return { introText, saved, saveIntro }
  }
}

export const AdminProjectPage = {
  name: 'AdminProjectPage',
  template: `
    <div class="admin-panel">
      <div class="section-title">
        <h3>项目管理</h3>
        <el-button type="primary" @click="openCreateDialog">新建项目</el-button>
      </div>
      <el-table :data="projects" stripe empty-text="暂无项目">
        <el-table-column prop="name" label="项目名称" min-width="150" />
        <el-table-column prop="status" label="状态" width="110" />
        <el-table-column prop="description" label="项目描述" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteProject(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogVisible" :title="editingId ? '编辑项目' : '新建项目'" width="min(560px, 92vw)" destroy-on-close>
        <el-form :model="editingProject" label-position="top">
          <el-form-item label="项目名称" required>
            <el-input v-model.trim="editingProject.name" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="项目状态">
            <el-select v-model="editingProject.status" class="full-width">
              <el-option label="已完成" value="已完成" />
              <el-option label="已上线" value="已上线" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目描述" required>
            <el-input v-model.trim="editingProject.description" type="textarea" :rows="3" maxlength="300" show-word-limit />
          </el-form-item>
          <el-form-item label="项目亮点（使用中英文逗号分隔）">
            <el-input v-model="editingProject.highlights" placeholder="例如：组件化，响应式布局" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProject">保存</el-button>
        </template>
      </el-dialog>
    </div>
  `,
  setup() {
    const projectStore = useProjectStore()
    const { projects } = storeToRefs(projectStore)
    const dialogVisible = ref(false)
    const editingId = ref('')
    const editingProject = ref({
      name: '',
      status: '已完成',
      description: '',
      highlights: ''
    })
    const openCreateDialog = () => {
      editingId.value = ''
      editingProject.value = { name: '', status: '已完成', description: '', highlights: '' }
      dialogVisible.value = true
    }
    const openEditDialog = project => {
      editingId.value = project.id
      editingProject.value = { ...project, highlights: project.highlights.join('，') }
      dialogVisible.value = true
    }
    const saveProject = () => {
      const name = editingProject.value.name.trim()
      const description = editingProject.value.description.trim()
      if (!name || !description) {
        ElMessage.warning('请填写项目名称和项目描述')
        return
      }
      const changes = {
        name,
        status: editingProject.value.status,
        description,
        highlights: editingProject.value.highlights.split(/[,，]/).map(item => item.trim()).filter(Boolean)
      }
      const success = editingId.value
        ? projectStore.updateProject(editingId.value, changes)
        : (projectStore.createProject(changes), true)
      if (!success) {
        ElMessage.error('项目不存在，无法保存')
        return
      }
      dialogVisible.value = false
      ElMessage.success(editingId.value ? '项目信息已更新' : '项目已创建')
    }
    const deleteProject = project => {
      if (projectStore.deleteProject(project.id)) ElMessage.success('项目已删除')
    }
    return { projects, dialogVisible, editingId, editingProject, openCreateDialog, openEditDialog, saveProject, deleteProject }
  }
}

export const AdminArticlePage = {
  name: 'AdminArticlePage',
  template: `
    <div class="admin-panel">
      <div class="section-title">
        <h3>文章管理</h3>
        <el-button type="primary" @click="openCreateDialog">新增文章</el-button>
      </div>
      <el-table :data="articles" stripe empty-text="暂无文章">
        <el-table-column prop="title" label="文章标题" min-width="180" />
        <el-table-column label="关联项目" min-width="140">
          <template #default="scope">{{ getProjectName(scope.row.projectId) }}</template>
        </el-table-column>
        <el-table-column prop="content" label="文章内容" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteArticle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogVisible" :title="editingId ? '编辑文章' : '新增文章'" width="min(560px, 92vw)" destroy-on-close>
        <el-form :model="editingArticle" label-position="top">
          <el-form-item label="文章标题" required>
            <el-input v-model.trim="editingArticle.title" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item label="关联项目">
            <el-select v-model="editingArticle.projectId" class="full-width" clearable placeholder="不关联项目">
              <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容" required>
            <el-input v-model.trim="editingArticle.content" type="textarea" :rows="6" maxlength="2000" show-word-limit />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveArticle">保存</el-button>
        </template>
      </el-dialog>
    </div>
  `,
  setup() {
    const articleStore = useArticleStore()
    const projectStore = useProjectStore()
    const { articles } = storeToRefs(articleStore)
    const { projects } = storeToRefs(projectStore)
    const dialogVisible = ref(false)
    const editingId = ref('')
    const editingArticle = ref({ title: '', projectId: '', content: '' })
    const getProjectName = projectId => projects.value.find(project => project.id === projectId)?.name || '未关联项目'
    const openCreateDialog = () => {
      editingId.value = ''
      editingArticle.value = { title: '', projectId: '', content: '' }
      dialogVisible.value = true
    }
    const openEditDialog = article => {
      editingId.value = article.id
      editingArticle.value = { ...article }
      dialogVisible.value = true
    }
    const saveArticle = () => {
      const title = editingArticle.value.title.trim()
      const content = editingArticle.value.content.trim()
      if (!title || !content) {
        ElMessage.warning('请填写文章标题和文章内容')
        return
      }
      const changes = { ...editingArticle.value, title, content }
      const success = editingId.value
        ? articleStore.updateArticle(editingId.value, changes)
        : (articleStore.createArticle(changes), true)
      if (!success) {
        ElMessage.error('文章不存在，无法保存')
        return
      }
      dialogVisible.value = false
      ElMessage.success(editingId.value ? '文章已更新' : '文章已发布')
    }
    const deleteArticle = article => {
      if (articleStore.deleteArticle(article.id)) ElMessage.success('文章已删除')
    }
    return { articles, projects, dialogVisible, editingId, editingArticle, getProjectName, openCreateDialog, openEditDialog, saveArticle, deleteArticle }
  }
}

export const AdminLayout = {
  name: 'AdminLayout',
  components: { RouterLink, RouterView },
  template: `
    <section class="content-page admin-page">
      <el-container class="admin-shell">
        <el-aside width="220px" class="admin-sidebar">
          <h2>后台管理</h2>
          <el-menu :default-active="$route.path" router class="admin-menu">
            <el-menu-item index="/admin">总览</el-menu-item>
            <el-menu-item index="/admin/intro">简介编辑</el-menu-item>
            <el-menu-item index="/admin/project">项目管理</el-menu-item>
            <el-menu-item index="/admin/articles">文章管理</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="admin-content">
          <RouterView />
        </el-main>
      </el-container>
    </section>
  `
}

export const NotFoundPage = {
  name: 'NotFoundPage',
  template: `
    <section class="content-page">
      <div class="info-card empty-card">
        <h2>404 页面不存在</h2>
        <p>当前地址没有匹配的页面，请返回首页继续浏览。</p>
        <button @click="$router.push({ name: 'Home' })">返回首页</button>
      </div>
    </section>
  `
}