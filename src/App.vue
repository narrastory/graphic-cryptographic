<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DisplayWindow from './components/displayWindow/DisplayWindow.vue'
import SideConsole from './components/sideConsole/SideConsole.vue'
import MobileWarning from '@/components/mobileWarning/MobileWarning.vue' // 新建的警告组件

// 响应式宽度检测
const isMobile = ref(false)
const MOBILE_BREAKPOINT = 768 // 768px以下视为移动端

const checkScreenWidth = () => {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => {
  checkScreenWidth()
  window.addEventListener('resize', checkScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenWidth)
})
</script>

<template>
  <!-- 移动端警告界面 -->
  <MobileWarning v-if="isMobile" />
  
  <!-- 正常界面 -->
  <main v-else class="main_root">
    <SideConsole />
    <DisplayWindow />
  </main>
</template>

<style scoped>
.main_root {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.main_root > :first-child {
  flex-shrink: 0;
}

.main_root > :last-child {
  flex: 1;
  min-width: 0; 
  transition: margin-left 0.3s ease;
}

/* 添加一个额外的CSS媒体查询作为备用 */
@media (max-width: 767px) {
  .main_root {
    display: none;
  }
}
</style>
