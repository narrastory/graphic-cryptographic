<template>
  <!-- 通知弹窗 -->
  <transition name="notification-fade">
    <div 
      v-if="visible" 
      class="notification no-select"
      :class="[typeClass, { 'interactive': closeOnClick }]"
      @click="handleAlertClick"
      role="alert"
      aria-live="polite"
    >
      <!-- 状态图标 -->
      <div class="notification-icon">
        <svg 
          v-if="type === 'success'" 
          class="icon-success" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg 
          v-if="type === 'warning'" 
          class="icon-warning" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      
      <!-- 消息内容 -->
      <div class="notification-content">
        <p class="notification-message">{{ message }}</p>
      </div>
      
      <!-- 可选的关闭按钮 -->
      <button 
        v-if="showClose" 
        class="notification-close"
        @click.stop="close"
        aria-label="关闭通知"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// 组件属性定义
interface Props {
  // 消息类型：成功(success)或警告(warning)
  type?: 'success' | 'warning'
  // 显示的消息文本
  message?: string
  // 是否显示
  modelValue?: boolean
  // 自动关闭时间(毫秒)，0表示不自动关闭
  duration?: number
  // 是否显示关闭按钮
  showClose?: boolean
  // 点击弹窗是否关闭
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  message: '',
  modelValue: false,
  duration: 3000,
  showClose: false,
  closeOnClick: false
})

// 组件事件定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'click': []
}>()

// 响应式状态
const visible = ref(props.modelValue)
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

// 根据类型计算的样式类
const typeClass = computed(() => `notification-${props.type}`)

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    startAutoClose()
  } else {
    clearAutoClose()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
    clearAutoClose()
  }
})

// 启动自动关闭计时器
const startAutoClose = () => {
  if (props.duration > 0) {
    clearAutoClose()
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

// 清除自动关闭计时器
const clearAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

// 关闭弹窗
const close = () => {
  visible.value = false
}

// 点击弹窗事件
const handleAlertClick = () => {
  emit('click')
  if (props.closeOnClick) {
    close()
  }
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时清除事件监听和计时器
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  clearAutoClose()
})

// 暴露给父组件的方法
defineExpose({
  show: () => { visible.value = true },
  hide: close,
  close
})
</script>

<style scoped>
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
  
/* 重命名类名，更符合语义化 */
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 320px;
  max-width: 500px;
  padding: 8px 24px;
  border-radius: 10px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  background: rgb(255, 255, 255);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  will-change: transform, opacity;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 交互状态 - 更细腻的悬停效果 */
.notification.interactive {
  cursor: pointer;
}

.notification.interactive:hover {
  transform: translateX(-50%) translateY(-1px);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 成功状态 - 更现代的配色 */
.notification-success {
  border: 2px solid #10b981;
}

.notification-success .notification-icon {
  color: #10b981;
}

/* 警告状态 - 更现代的配色 */
.notification-warning {
  border: 2px solid #f50b0bde;
}

.notification-warning .notification-icon {
  color: #f50b0b;
}

/* 图标样式 - 优化设计 */
.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.notification-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2px;
}

/* 内容区域 */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  color: #1f2937;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 关闭按钮 - 重新设计 */
.notification-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.03);
  color: #374151;
  transform: rotate(90deg);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-close svg {
  width: 18px;
  height: 18px;
  stroke-width: 2px;
}

/* 优化动画 - 更流畅的弹性效果 */
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: 
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.notification-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-40px) scale(0.95);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-30px) scale(0.92);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.notification-fade-enter-to,
.notification-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 响应式优化 */
@media (max-width: 480px) {
  .notification {
    min-width: 280px;
    padding: 14px 20px;
    left: 16px;
    right: 16px;
    transform: none;
    width: calc(100% - 32px);
  }
  
  .notification-message {
    white-space: normal;
    line-height: 1.5;
  }
}

/* 优化性能 */
.notification {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 微交互优化 */
.notification-icon,
.notification-close svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification:hover .notification-icon,
.notification:hover .notification-close svg {
  transform: scale(1.05);
}
</style>