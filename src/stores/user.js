import { defineStore } from 'pinia'
import { readStoredValue, writeStoredValue } from './storage.js'

const defaultProfile = {
  avatarUrl: `${import.meta.env.BASE_URL}1.jpg`,
  name: '张又仁',
  className: '24计科2班',
  major: '计算机科学与技术',
  intro: '喜欢看小说、喜欢编程，爱好打羽毛球，也会在空闲时间做一些前端练习。',
  tags: ['前端', '编程', '阅读', '羽毛球', '学习']
}

const loadProfile = () => {
  const savedProfile = readStoredValue(
    'user-profile',
    null,
    value => value && typeof value === 'object' && typeof value.intro === 'string'
  )
  if (savedProfile) return { ...defaultProfile, ...savedProfile }
  return {
    ...defaultProfile,
    intro: readStoredValue('profile-intro', defaultProfile.intro, value => typeof value === 'string')
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: loadProfile(),
    isAuthenticated: readStoredValue('user-authenticated', false, value => typeof value === 'boolean')
  }),
  getters: {
    displayName: state => state.profile.name
  },
  actions: {
    updateIntro(intro) {
      this.profile.intro = intro
      writeStoredValue('user-profile', this.profile)
      writeStoredValue('profile-intro', intro)
    },
    login() {
      this.isAuthenticated = true
      writeStoredValue('user-authenticated', this.isAuthenticated)
    },
    logout() {
      this.isAuthenticated = false
      writeStoredValue('user-authenticated', this.isAuthenticated)
    }
  }
})
