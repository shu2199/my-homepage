import { defineStore } from 'pinia'
import { useArticleStore } from './articles.js'
import { readStoredValue, writeStoredValue } from './storage.js'

const defaultProjects = [
  {
    id: '1',
    name: '图书管理系统',
    status: '已上线',
    description: '基于 Vue 3 与 Vite 构建的图书借阅、查询和管理系统，支持分类展示与状态查看。',
    highlights: ['图书分类', '借阅管理', '数据展示']
  },
  {
    id: '2',
    name: '校园活动官网',
    status: '已完成',
    description: '用于校园活动宣传和报名信息展示，页面结构清晰，交互友好，便于活动信息维护。',
    highlights: ['活动介绍', '报名入口', '信息筛选']
  },
  {
    id: '3',
    name: '个人博客展示页',
    status: '已完成',
    description: '这是一个聚焦个人作品和技术展示的页面，适合用来介绍项目、技能和学习成果。',
    highlights: ['作品展示', '技能标签', '个人介绍']
  },
  {
    id: '4',
    name: '电商首页设计',
    status: '已完成',
    description: '面向电商场景的首页改版项目，聚焦结构层次、产品展示和互动体验优化。',
    highlights: ['轮播展示', '商品推荐', '视觉设计']
  }
]

const isProjectList = value => Array.isArray(value) && value.every(project =>
  project && typeof project.id === 'string' && typeof project.name === 'string' &&
  typeof project.description === 'string' && Array.isArray(project.highlights)
)

const loadProjects = () => {
  const savedDescriptions = readStoredValue(
    'project-descriptions',
    {},
    value => value && typeof value === 'object' && !Array.isArray(value)
  )
  const fallbackProjects = defaultProjects.map(project => ({
    ...project,
    description: savedDescriptions[project.id] || project.description
  }))
  return readStoredValue('projects', fallbackProjects, isProjectList)
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: loadProjects()
  }),
  getters: {
    completedCount: state => state.projects.filter(project => project.status === '已完成').length,
    onlineCount: state => state.projects.filter(project => project.status === '已上线').length
  },
  actions: {
    persist() {
      writeStoredValue('projects', this.projects)
    },
    createProject(project) {
      const nextId = String(Math.max(0, ...this.projects.map(item => Number(item.id) || 0)) + 1)
      const createdProject = { ...project, id: nextId }
      this.projects.push(createdProject)
      this.persist()
      return createdProject
    },
    updateProject(id, changes) {
      const project = this.projects.find(item => item.id === id)
      if (!project) return false
      Object.assign(project, changes)
      this.persist()
      return true
    },
    deleteProject(id) {
      const index = this.projects.findIndex(project => project.id === id)
      if (index === -1) return false
      useArticleStore().unlinkProject(id)
      this.projects.splice(index, 1)
      this.persist()
      return true
    }
  }
})
