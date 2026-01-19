<script setup lang="ts">
import { ref, reactive, toRaw } from 'vue'
import { useFilterStatusStore } from '@/stores/filterStatus'
import type { FilterStatusType } from '@/types'

const filterStatusStore = useFilterStatusStore()

// 侧边栏展开/收起状态
const isCollapsed = ref(false)

// 筛选数据对象
const filterData: FilterStatusType = reactive({
  nodeCount: 9,
  nodeRandom: false,
  normalMode: false,
  jumpCount: 5,
  jumpRandom: true,
  lineLengthOrder: 'random', // 'desc'降序, 'random'随机
  straightLines: 7,
  straightRandom: false,
  oblique45Lines: 3,
  oblique45Random: true,
  oblique12Lines: 3,
  oblique12Random: true,
})

// 应用筛选
const applyFilters = () => {
  filterStatusStore.$patch(toRaw(filterData))
}
</script>

<template>
  <div class="sidebar-container no-select" :class="{ collapsed: isCollapsed }">
    <!-- 展开/收起按钮 -->
    <button
      class="collapse-btn"
      @click="isCollapsed = !isCollapsed"
      :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      {{ isCollapsed ? '›' : '‹' }}
    </button>

    <aside class="sidebar">
      <h2 class="sidebar-title">
        <span class="title-icon">⚙️</span>
        <span class="title-text">控制面板</span>
        <a
        class="github-link"
        href="https://github.com/narrastory/graphic-cryptographic"
        target="_blank"
        :title="isCollapsed ? 'GitHub仓库' : '访问我们的GitHub仓库'"
      >
        <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        <span class="github-text" v-show="!isCollapsed">GitHub</span>
      </a>
      </h2>

      <div class="section">
        <h3 class="section-title">节点设置</h3>
        <div class="control-group">
          <label class="control-label">
            <span>节点数量: {{ filterData.nodeCount }}</span>
            <input
              type="range"
              v-model.number="filterData.nodeCount"
              min="4"
              max="9"
              class="slider"
            />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterData.nodeRandom" class="checkbox" />
            <span>随机节点数量</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">模式选择</h3>
        <label class="checkbox-label">
          <input type="checkbox" v-model="filterData.normalMode" class="checkbox" />
          <span>限制模式</span>
        </label>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">跳点设置</h3>
        <div class="control-group">
          <label class="control-label">
            <span>跳点数量: {{ filterData.jumpCount }}</span>
            <input
              type="range"
              v-model.number="filterData.jumpCount"
              min="0"
              max="5"
              class="slider"
            />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterData.jumpRandom" class="checkbox" />
            <span>随机跳点数量</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">线长排序</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="filterData.lineLengthOrder" value="desc" class="radio" />
            <span>按照总线长降序排列</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="filterData.lineLengthOrder" value="random" class="radio" />
            <span>按照总线长随机排列</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">线条样式设置</h3>
        <div class="control-group">
          <label class="control-label">
            <span>水平垂直线条数: {{ filterData.straightLines }}</span>
            <input
              type="range"
              v-model.number="filterData.straightLines"
              min="0"
              max="8"
              class="slider"
            />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterData.straightRandom" class="checkbox" />
            <span>随机</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">45度斜线</h3>
        <div class="control-group">
          <label class="control-label">
            <span>线条数: {{ filterData.oblique45Lines }}</span>
            <input
              type="range"
              v-model.number="filterData.oblique45Lines"
              min="0"
              max="7"
              class="slider"
            />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterData.oblique45Random" class="checkbox" />
            <span>随机</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">1:2斜线</h3>
        <div class="control-group">
          <label class="control-label">
            <span>线条数: {{ filterData.oblique12Lines }}</span>
            <input
              type="range"
              v-model.number="filterData.oblique12Lines"
              min="0"
              max="7"
              class="slider"
            />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterData.oblique12Random" class="checkbox" />
            <span>随机</span>
          </label>
        </div>
      </div>

      <hr class="divider" />

      <div class="action-section">
        <button class="apply-btn" @click="applyFilters">应用筛选</button>
        <a
          class="doc-link"
          href="https://juejin.cn/post/7596670644286144512"
          target="_blank"
          :title="isCollapsed ? '说明文档' : '点击查看详细说明文档'"
        >
          <span class="doc-icon">📖</span>
          <span class="doc-text" v-show="!isCollapsed">说明文档</span>
        </a>
        <div class="hint">
          © 2026 Narrastory & Ming. <br />
          All rights reserved.
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
button:focus {
  outline: none;
}

.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.sidebar-container {
  position: relative;
  transition: width 0.3s ease;
  width: 260px;
}

.sidebar-container.collapsed {
  width: 0;
}

.collapse-btn {
  position: absolute;
  right: -30px;
  top: 20px;
  width: 30px;
  height: 40px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-left: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.collapse-btn:hover {
  background: #e9ecef;
  color: #212529;
}

.sidebar {
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e9ecef;
  padding: 24px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.collapsed .sidebar {
  opacity: 0;
  transform: translateX(-100%);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  color: #212529;
  font-size: 18px;
  font-weight: 600;
}

.title-icon {
  font-size: 20px;
}

.title-text {
  flex: 1;
}

.section {
  margin: 20px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
}

.checkbox-label:hover,
.radio-label:hover {
  color: #212529;
}

.checkbox,
.radio {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4a6fa5;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e9ecef;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a6fa5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a6fa5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.divider {
  height: 1px;
  background: #e9ecef;
  border: none;
  margin: 24px 0;
}

.action-section {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.apply-btn {
  width: 100%;
  padding: 12px 24px;
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn:hover {
  background: #3a5a8a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(58, 90, 138, 0.2);
}

.apply-btn:active {
  transform: translateY(0);
}

.hint {
  margin-top: 12px;
  font-size: 12px;
  color: #868e96;
  text-align: center;
  font-style: italic;
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* 说明文档链接样式 */
.doc-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
  padding: 10px 16px;
  color: #58a6ff;
  text-decoration: none;
  border-radius: 6px;
  background-color: rgba(88, 166, 255, 0.08);
  border: 1px solid rgba(88, 166, 255, 0.2);
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.doc-link:hover {
  background-color: rgba(88, 166, 255, 0.15);
  border-color: rgba(88, 166, 255, 0.4);
  color: #79b8ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.doc-link:active {
  transform: translateY(0);
  transition: none;
}

.doc-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.doc-text {
  white-space: nowrap;
}

/* 侧边栏收起状态下的样式 */
.sidebar-container.collapsed .doc-link {
  justify-content: center;
  padding: 10px;
  min-width: 40px;
  min-height: 40px;
  margin: 16px auto;
  width: 40px;
}

.sidebar-container.collapsed .doc-text {
  display: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .doc-link {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* GitHub仓库链接样式 */
.github-link {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 4px 8px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
}

.github-link:hover {
  background-color: #fff;
  border-color: #333;
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.github-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.github-text {
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* 调整标题容器布局 */
.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 8px;
}

.title-icon {
  font-size: 18px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 侧边栏收起状态下的GitHub链接样式 */
.sidebar-container.collapsed .github-link {
  justify-content: center;
  margin-left: 0;
  margin-top: 8px;
  padding: 6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
}

.sidebar-container.collapsed .github-text {
  display: none;
}

.sidebar-container.collapsed .sidebar-title {
  flex-direction: column;
  align-items: center;
  padding-right: 0;
}

.sidebar-container.collapsed .title-text {
  display: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .github-link {
    padding: 3px 6px;
    font-size: 11px;
  }

  .github-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
