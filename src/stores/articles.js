import { defineStore } from 'pinia'
import { readStoredValue, writeStoredValue } from './storage.js'

const defaultArticles = [
  {
    id: '1',
    title: '用 Vue 3 构建个人项目展示页',
    projectId: '3',
    content: '记录使用 Vue 3 和组件化方式搭建个人作品展示页面的实践过程。'
  },
  {
    id: '2',
    title: '校园活动官网的交互设计',
    projectId: '2',
    content: '从信息结构、活动报名和内容维护几个方面整理校园活动官网的设计思路。'
  }
]

const isArticleList = value => Array.isArray(value) && value.every(article =>
  article && typeof article.id === 'string' && typeof article.title === 'string' &&
  typeof article.content === 'string' && typeof article.projectId === 'string'
)

export const useArticleStore = defineStore('articles', {
  state: () => ({
    articles: readStoredValue('articles', defaultArticles, isArticleList)
  }),
  getters: {
    articleCount: state => state.articles.length,
    getArticleById: state => id => state.articles.find(article => article.id === id)
  },
  actions: {
    persist() {
      writeStoredValue('articles', this.articles)
    },
    createArticle(article) {
      const nextId = String(Math.max(0, ...this.articles.map(item => Number(item.id) || 0)) + 1)
      const createdArticle = { ...article, id: nextId }
      this.articles.push(createdArticle)
      this.persist()
      return createdArticle
    },
    updateArticle(id, changes) {
      const article = this.articles.find(item => item.id === id)
      if (!article) return false
      Object.assign(article, changes)
      this.persist()
      return true
    },
    unlinkProject(projectId) {
      let hasChanges = false
      this.articles.forEach(article => {
        if (article.projectId === projectId) {
          article.projectId = ''
          hasChanges = true
        }
      })
      if (hasChanges) this.persist()
      return hasChanges
    },
    deleteArticle(id) {
      const index = this.articles.findIndex(article => article.id === id)
      if (index === -1) return false
      this.articles.splice(index, 1)
      this.persist()
      return true
    }
  }
})
