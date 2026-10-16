<template>
  <section class="project-panel">
    <div class="panel-title">
      <h2>项目展示</h2>
      <span>精选作品</span>
    </div>

    <div class="project-list">
      <el-card v-for="project in projects" :key="project.id" class="project-card" shadow="hover">
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <el-tag :type="project.status === '已上线' ? 'success' : 'info'" effect="light">{{ project.status }}</el-tag>
        </div>
        <p>{{ project.description }}</p>
        <ul>
          <li v-for="item in project.highlights" :key="item">{{ item }}</li>
        </ul>

        <slot name="actions" :project="project">
          <button class="default-button" @click="$emit('open-project', project)">查看详情</button>
        </slot>
      </el-card>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-project'])
</script>

<style scoped>
.project-panel {
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 28px;
  padding: 26px;
  box-shadow: 0 22px 50px rgba(15, 23, 42, .06);
  backdrop-filter: blur(8px);
}
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.panel-title h2 {
  margin: 0;
  font-size: 1.8rem;
}
.panel-title span {
  color: #64748b;
}
.project-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.project-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e6eaf2;
  border-radius: 18px;
  transition: transform .2s ease, box-shadow .2s ease;
}
.project-card :deep(.el-card__body) {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 24px;
}
.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, .08);
}
.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.project-header h3 {
  margin: 0;
}
.status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  font-size: 12px;
  font-weight: 700;
}
.project-card p {
  margin: 0 0 14px;
  color: #475569;
  line-height: 1.7;
}
.project-card ul {
  margin: 0 0 18px;
  padding-left: 20px;
  color: #334155;
}
.project-card li + li {
  margin-top: 6px;
}
.project-card ul {
  margin-bottom: 22px;
}
.default-button,
.project-button {
  width: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white;
  padding: 11px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .2s ease, opacity .2s ease;
}
.project-card :deep(.project-button) {
  margin-top: auto;
}
.default-button:hover,
.project-button:hover {
  transform: translateY(-1px);
  opacity: 0.96;
}
@media (max-width: 760px) {
  .project-list {
    grid-template-columns: 1fr;
  }
}
</style>
