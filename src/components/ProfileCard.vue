<template>
  <div class="card" :class="{ dark: isDark }">
    <div class="profile-main">
      <div class="top">
        <img :src="userInfo.avatarUrl" class="avatar" alt="头像" />
        <div class="info">
          <div class="chips">
            <span class="chip">学生</span>
            <span class="chip soft">持续学习中</span>
          </div>
          <h2>{{ userInfo.name }}</h2>
          <p>{{ userInfo.className }} · {{ userInfo.major }}</p>
        </div>
      </div>

      <div class="profile-actions">
        <button class="action-button" @click="toggleDetail">
          {{ showDetail ? '收起个人简介' : '展开个人简介' }}
        </button>

        <button class="action-button theme-button" @click="toggleTheme">
          {{ isDark ? '切换亮色主题' : '切换暗色主题' }}
        </button>
      </div>
    </div>

    <div class="profile-details">
      <div v-show="showDetail" class="intro">
        <h3>关于我</h3>
        <p>{{ userInfo.intro }}</p>
        <div class="tags">
          <span v-for="tag in userInfo.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="skill-section">
        <div class="skill-heading">
          <h3>技能清单</h3>
          <span>{{ filterSkill.length }} 项</span>
        </div>
        <div class="search-box">
          <input v-model="searchWord" placeholder="输入关键词搜索技能" />
        </div>

        <div class="skill-list">
          <span v-for="item in filterSkill" :key="item" class="skill">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  },
  skillList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-detail'])
const searchWord = defineModel('searchWord', { default: '' })
const isDark = defineModel('isDark', { default: false })
const showDetail = ref(true)

const filterSkill = computed(() => {
  if (!searchWord.value) return props.skillList
  return props.skillList.filter(item => item.toLowerCase().includes(searchWord.value.toLowerCase()))
})

const toggleDetail = () => {
  showDetail.value = !showDetail.value
  emit('toggle-detail', showDetail.value)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 520px;
  margin: 0 auto 30px;
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 28px;
  box-shadow: 0 22px 50px rgba(99, 102, 241, 0.12);
  padding: 24px;
  transition: all .3s ease;
  backdrop-filter: blur(10px);
}
.card.dark {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(148, 163, 184, 0.35);
  color: #f9fafb;
}
.top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}
.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 12px 26px rgba(139, 92, 246, 0.25);
}
.info h2 {
  margin: 8px 0 4px;
  font-size: 2rem;
  letter-spacing: 0.04em;
}
.info p {
  margin: 0;
  color: #666;
  font-size: .92rem;
}
.card.dark .info p,
.card.dark .intro p {
  color: #d1d5db;
}
.chips { display: flex; gap: 8px; }
.chip {
  display: inline-block;
  background: linear-gradient(135deg, #dbeafe, #ecfeff);
  color: #1d4ed8;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
}
.chip.soft {
  background: linear-gradient(135deg, #dcfce7, #f0fdf4);
  color: #15803d;
}
button {
  width: 100%;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #8b5cf6, #f472b6);
  color: #fff;
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(139, 92, 246, .22);
  transition: transform .2s ease, box-shadow .2s ease;
}
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(139, 92, 246, .28);
}
.theme-button {
  margin-top: 10px;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}
.intro {
  background: linear-gradient(135deg, #f8f7ff, #f4fafd);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 18px;
  padding: 16px;
  margin-top: 18px;
}
.card.dark .intro {
  background: linear-gradient(135deg, #111827, #1f2937);
  border-color: rgba(148, 163, 184, 0.2);
}
.intro h3 {
  margin: 0 0 8px;
  font-size: 1rem;
}
.intro p {
  margin: 0;
  color: #555;
  line-height: 1.8;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.tag {
  background: linear-gradient(135deg, #fce7f3, #fdf2f8);
  color: #be185d;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
}
.search-box { margin-top: 18px; }
input {
  width: 100%;
  padding: 12px 13px;
  border: 1px solid rgba(196, 181, 253, 0.4);
  border-radius: 12px;
  outline: none;
  background: rgba(255,255,255,0.9);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.card.dark input {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(148, 163, 184, 0.4);
  color: #f9fafb;
}
input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, .18);
}
.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}
.skill {
  background: linear-gradient(135deg, #34d399, #22c55e);
  color: white;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(34, 197, 94, .15);
}
@media (max-width: 480px) {
  .card { padding: 20px; }
  .top { flex-direction: column; text-align: center; }
  .info h2 { font-size: 1.6rem; }
}

.card {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  gap: 28px;
  align-items: stretch;
  max-width: none;
  margin: 0;
  padding: 30px;
  border: 1px solid #e5e9f2;
  border-radius: 24px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 14px 36px rgba(30, 43, 72, .06);
  transition: background .3s ease, color .3s ease;
}

.card.dark {
  color: #f1f5f9;
  background: #1e293b;
  border-color: #334155;
}

.profile-main,
.profile-details {
  min-width: 0;
}

.profile-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 28px 8px 4px;
  border-right: 1px solid #edf0f5;
}

.card.dark .profile-main {
  border-color: #334155;
}

.top {
  gap: 22px;
  margin-bottom: 28px;
}

.avatar {
  flex: 0 0 auto;
  width: 112px;
  height: 112px;
  border: 4px solid #fff;
  box-shadow: 0 10px 24px rgba(91, 102, 214, .18);
}

.info h2 {
  margin: 10px 0 6px;
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  letter-spacing: -.04em;
}

.info p {
  color: #68758a;
  font-size: .95rem;
  line-height: 1.65;
}

.card.dark .info p,
.card.dark .intro p {
  color: #cbd5e1;
}

.chips {
  flex-wrap: wrap;
}

.chip {
  padding: 6px 11px;
  background: #eef0ff;
  color: #505ac4;
  font-size: 11px;
}

.chip.soft {
  background: #eaf7f1;
  color: #27845f;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-button {
  width: auto;
  padding: 11px 15px;
  border-radius: 11px;
  background: #5b66d6;
  box-shadow: none;
  transition: transform .2s ease, background .2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  background: #4b55c3;
  box-shadow: none;
}

.action-button.theme-button {
  margin-top: 0;
  color: #46516a;
  background: #eef1f6;
}

.action-button.theme-button:hover {
  background: #e3e7ef;
}

.intro {
  margin-top: 0;
  padding: 0 0 20px;
  border: 0;
  border-bottom: 1px solid #edf0f5;
  border-radius: 0;
  background: transparent;
}

.card.dark .intro {
  border-color: #334155;
  background: transparent;
}

.intro h3,
.skill-heading h3 {
  margin: 0;
  color: inherit;
  font-size: 1.05rem;
}

.intro p {
  margin: 10px 0 0;
  color: #596579;
  line-height: 1.75;
}

.tags {
  gap: 7px;
  margin-top: 14px;
}

.tag {
  color: #58647a;
  background: #f4f5f9;
}

.skill-section {
  padding-top: 20px;
}

.skill-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #263249;
}

.card.dark .skill-heading {
  color: #f1f5f9;
}

.skill-heading span {
  color: #8791a3;
  font-size: .82rem;
}

.search-box {
  margin-top: 12px;
}

.search-box input {
  padding: 11px 13px;
  border: 1px solid #e1e6ef;
  border-radius: 10px;
  color: #263249;
  background: #fbfcfe;
}

.card.dark .search-box input {
  color: #f1f5f9;
  background: #0f172a;
  border-color: #475569;
}

.search-box input:focus {
  border-color: #929be9;
  box-shadow: 0 0 0 3px rgba(91, 102, 214, .12);
}

.skill-list {
  gap: 8px;
  margin-top: 14px;
}

.skill {
  padding: 7px 11px;
  border: 1px solid #e7e9f7;
  border-radius: 9px;
  color: #515bb9;
  background: #f3f4ff;
  font-size: 12px;
  font-weight: 650;
  box-shadow: none;
}

@media (max-width: 760px) {
  .card {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 24px;
  }

  .profile-main {
    padding: 0 0 22px;
    border-right: 0;
    border-bottom: 1px solid #edf0f5;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }

  .top {
    flex-direction: row;
    gap: 14px;
    text-align: left;
  }

  .avatar {
    width: 82px;
    height: 82px;
  }

  .profile-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .info h2 {
    font-size: 1.6rem;
  }
}
</style>
