<template>
  <div class="screen-warning">
    <div class="warning-content">
      <div class="warning-icon">
        <svg viewBox="0 0 24 24" width="60" height="60">
          <path fill="#0066cc" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"/>
        </svg>
      </div>
      
      <h1>桌面端最佳体验</h1>
      
      <div class="main-message">
        <p>本工具为桌面端优化设计，在小屏幕设备上功能可能受限。</p>
        <p>建议使用电脑或平板设备（屏幕宽度≥768px）访问以获得完整体验。</p>
      </div>
      
      <div class="device-info">
        <div class="info-row">
          <span class="label">当前屏幕宽度：</span>
          <span class="value">{{ screenWidth }}px</span>
        </div>
        <div class="info-row">
          <span class="label">建议最小宽度：</span>
          <span class="value">768px</span>
        </div>
      </div>
      
      <div class="app-info">
        <h2>工具说明</h2>
        <p class="description">
          探索Android图案密码；本工具完整收录所有4-9位图案密码组合，提供高效的密码检索和图案可视化功能。支持按特殊样式快速查找密码序列。
        </p>
      </div>
      
      <div class="author-info">
        <h3>作者信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">作者：</span>
            <span class="info-value">Ming</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱：</span>
            <a href="mailto:NarratorCMH@aliyun.com" class="info-link">NarratorCMH@aliyun.com</a>
          </div>
          <div class="info-item">
            <span class="info-label">公众号：</span>
            <span class="info-value">Narrastory</span>
          </div>
          <div class="info-item">
            <span class="info-label">地址：</span>
            <span class="info-value">浙江杭州</span>
          </div>
          <div class="info-item">
            <span class="info-label">GitHub：</span>
            <a href="https://github.com/narrastory" target="_blank" class="info-link">github.com/narrastory</a>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="recheckScreen" class="retry-btn">
          重新检测屏幕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const screenWidth = ref(window.innerWidth)

const recheckScreen = () => {
  screenWidth.value = window.innerWidth
  if (screenWidth.value >= 768) {
    window.location.reload()
  }
}

onMounted(() => {
  window.addEventListener('orientationchange', recheckScreen)
  window.addEventListener('resize', recheckScreen)
})
</script>

<style scoped>
.screen-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f8fafc;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  z-index: 9999;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.warning-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  margin: 20px 0;
  max-height: 90vh;
  overflow-y: auto;
}

.warning-icon {
  margin-bottom: 20px;
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1e293b;
}

h2 {
  font-size: 1.25rem;
  margin: 24px 0 12px;
  font-weight: 600;
  color: #334155;
  text-align: left;
}

h3 {
  font-size: 1.125rem;
  margin: 24px 0 16px;
  font-weight: 600;
  color: #334155;
  text-align: left;
}

.main-message {
  margin-bottom: 24px;
}

.main-message p {
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 12px;
  color: #475569;
}

.device-info {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 18px;
  margin: 24px 0;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #64748b;
}

.value {
  font-weight: 600;
  color: #0066cc;
}

.app-info {
  text-align: left;
  margin-bottom: 24px;
}

.description {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #0066cc;
}

.author-info {
  text-align: left;
  margin-bottom: 30px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.info-label {
  font-weight: 500;
  color: #64748b;
  min-width: 85px;
  text-align: right;
  margin-right: 12px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

.info-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.info-link:hover {
  color: #0052a3;
  text-decoration: underline;
}

.actions {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

button {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn {
  background: #0066cc;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

.retry-btn:hover {
  background: #0052a3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.retry-btn:active {
  transform: translateY(0);
}

/* 滚动条样式 */
.warning-content::-webkit-scrollbar {
  width: 8px;
}

.warning-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.warning-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.warning-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .screen-warning {
    padding: 12px;
  }
  
  .warning-content {
    padding: 22px;
    margin: 10px 0;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  h2 {
    font-size: 1.15rem;
  }
  
  h3 {
    font-size: 1.05rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    min-width: auto;
    text-align: left;
    margin-right: 0;
    margin-bottom: 4px;
    font-size: 0.9rem;
  }
  
  button {
    width: 100%;
    padding: 14px;
  }
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .warning-content {
    padding: 18px;
  }
  
  .main-message p {
    font-size: 1rem;
  }
  
  .device-info {
    padding: 14px;
  }
}
</style>