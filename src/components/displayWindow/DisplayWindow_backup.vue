<script setup lang="ts">
import PatternPack from '@/components/graphical/PatternPack.vue';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { generateTagPassword, shuffleArray } from '../../utils/core';
import { useFilterStatusStore } from '@/stores/filterStatus'
import type { PasswordInfo, FilterStatusType } from '@/types'

const ALL_PASSWORDS: PasswordInfo[] = generateTagPassword();
const filterStatusStore = useFilterStatusStore()
const CARDS_PER_PAGE = 20; // 每一页的卡片数量
let currentPageNumber = ref(0); // 当前页码
let totalPagesNumber = ref(0); // 总页数
let passwordsCards: PasswordInfo[] = []
let currentPageCards = ref<PasswordInfo[]>([]);

const filterPasswords = (states:FilterStatusType):PasswordInfo[] => {
    let sieve = {
        normalStyle: states.normalMode,
        skipPointNums: states.jumpRandom ? -1 : states.jumpCount,
        points: states.nodeRandom ? -1 : states.nodeCount,
        lineLength: states.lineLengthOrder,
        straightLines: states.straightRandom ? -1 : states.straightLines,
        diagonal45Lines: states.oblique45Random ? -1 : states.oblique45Lines,
        diagonalLines: states.oblique12Random ? -1 : states.oblique12Lines,
    }
    let filterPasswords = ALL_PASSWORDS.filter((password:PasswordInfo) => {
        if (sieve.normalStyle !== password.normalStyle) {
            return false;
        }
        if (sieve.skipPointNums >= 0 && password.skipPointNums !== sieve.skipPointNums) {
            return false;
        }
        if (sieve.points >= 0 && password.points !== sieve.points) {
            return false;
        }
        if (sieve.straightLines >= 0 && password.straightLines !== sieve.straightLines) {
            return false;
        }
        if (sieve.diagonal45Lines >= 0 && password.diagonal45Lines !== sieve.diagonal45Lines) {
            return false;
        }
        if (sieve.diagonalLines >= 0 && password.diagonalLines !== sieve.diagonalLines) {
            return false;
        }
        return true;
    })
    if (sieve.lineLength === 'random') {
        return shuffleArray(filterPasswords)
    } else {
        return filterPasswords.sort((a, b) => b.lineLength - a.lineLength)
    }
}

const forwardBackwardPage = (direction: number) => {
    if (direction === 1 && currentPageNumber.value < totalPagesNumber.value) {
        currentPageNumber.value++;
    } else if (direction === -1 && currentPageNumber.value > 1) {
        currentPageNumber.value--;
    } else {
        window.alert('已经是第一页或最后一页！');
    }
}

filterStatusStore.$subscribe((mutation, state) => {
    passwordsCards = filterPasswords(state);
    let passwordsLength = passwordsCards.length;
    totalPagesNumber.value = Math.ceil(passwordsLength / CARDS_PER_PAGE);
    currentPageNumber.value = 1;
    handlePageChange(1, 1);
})

const handlePageChange = (newValue:number,oldValue:number) => {
    if (newValue <= 0 || newValue > totalPagesNumber.value) {
        window.alert('无效的页码！');
        currentPageNumber.value = oldValue;
    }
    let startIndex = (newValue - 1) * CARDS_PER_PAGE;
    let endIndex = Math.min(startIndex + CARDS_PER_PAGE, passwordsCards.length);
    currentPageCards.value = passwordsCards.slice(startIndex, endIndex);
    console.log(currentPageCards.value)
}

watch(currentPageNumber, handlePageChange)

const handleKeyDown = (event:KeyboardEvent) => {
  if (event.key === 'd' || event.key === 'D') {
    event.preventDefault()
    forwardBackwardPage(1)
  } else if (event.key === 'a' || event.key === 'A') {
    event.preventDefault()
    forwardBackwardPage(-1)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

</script>

<template>
  <section class="display-window">
    <!-- 卡片展示区 -->
    <div class="cards-container">
      <div v-if="currentPageCards.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-text">没有找到匹配的卡片</p>
        <p class="empty-hint">请调整筛选条件以显示更多结果</p>
      </div>
      
      <div v-else class="cards-grid">
        <div 
          v-for="(card, index) in currentPageCards" 
          :key="card.password.toString()"
          class="card-wrapper"
        >
          <PatternPack :points="card.password" />
        </div>
      </div>
    </div>
    
    <!-- 控件区 -->
    <div v-if="totalPagesNumber > 0" class="controls-container">
      <div class="pagination-controls">
        <button 
          class="control-button prev-button no-select"
          @click="forwardBackwardPage(-1)"
          :disabled="currentPageNumber <= 1"
        >
          <span class="button-icon">‹</span>
          <span class="button-text">上一页</span>
        </button>
        
        <div class="page-info no-select">
          <span class="current-page">{{ currentPageNumber }}</span>
          <span class="page-separator">/</span>
          <span class="total-pages">{{ totalPagesNumber }}</span>
          <span class="page-label">页</span>
        </div>
        
        <button 
          class="control-button next-button no-select"
          @click="forwardBackwardPage(1)"
          :disabled="currentPageNumber >= totalPagesNumber"
        >
          <span class="button-text">下一页</span>
          <span class="button-icon">›</span>
        </button>
      </div>
      
      <div class="jump-control">
        <span class="jump-label no-select">跳转至</span>
        <input 
          type="number" 
          v-model.number="currentPageNumber"
          :min="1"
          :max="totalPagesNumber"
          class="page-input"
        />
        <span class="jump-label no-select">页</span>
      </div>

      <div class="jump-control">
        <span class="jump-label no-select">每页共</span>
        <input 
          type="number" 
          v-model.number="currentPageNumber"
          :min="1"
          :max="40"
          class="page-input"
        />
        <span class="jump-label no-select">个卡片</span>
      </div>
      
      <div class="cards-info no-select">
        <span class="info-text">
          共 {{ passwordsCards?.length || 0 }} 张卡片
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.no-select {
  user-select: none; 
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
}

.display-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f8fafc;
  overflow: hidden;
}

/* 卡片展示区 */
.cards-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #ffffff;
  border: 2px dashed rgb(189, 189, 189);
  border-radius: 12px;
  margin: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: 20px;   /* 左右间距保持不变 */
  row-gap: 30px;      /* 上下间距增加至30px */
  justify-items: center;
  align-items: start;
}

.card-wrapper {
  width: 220px;
  height: 280px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-2px);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #334155;
}

.empty-hint {
  font-size: 14px;
  color: #94a3b8;
}

/* 控件区 */
.controls-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  gap: 16px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
}

.control-button:hover:not(:disabled) {
  background-color: #e2e8f0;
  border-color: #94a3b8;
  color: #1e293b;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button:focus {
  outline: none;
}

.button-icon {
  font-size: 16px;
  line-height: 1;
}

.button-text {
  font-size: 14px;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #475569;
  min-width: 80px;
  justify-content: center;
}

.current-page {
  font-weight: 600;
  color: #1e293b;
}

.page-separator {
  color: #cbd5e1;
}

.total-pages {
  color: #64748b;
}

.page-label {
  margin-left: 2px;
  color: #94a3b8;
}

/* 跳转控制 */
.jump-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.jump-label {
  font-size: 14px;
  color: #475569;
}

.page-input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.page-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.page-input::-webkit-inner-spin-button,
.page-input::-webkit-outer-spin-button {
  opacity: 1;
  height: 20px;
}

/* 卡片信息 */
.cards-info {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.info-text {
  font-size: 14px;
  color: #64748b;
  padding: 6px 12px;
  background-color: #f1f5f9;
  border-radius: 6px;
}

/* 滚动条样式 */
.cards-container::-webkit-scrollbar {
  width: 8px;
}

.cards-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.cards-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.cards-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

button:focus { outline: none; }

/* 响应式调整 */
@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    column-gap: 16px;
    row-gap: 24px;  
  }
  
  .controls-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .jump-control {
    margin-left: 0;
    order: 3;
    flex: 1;
    justify-content: center;
  }
  
  .cards-info {
    margin-left: 0;
    order: 2;
  }
}

@media (max-width: 768px) {
  .cards-container {
    padding: 16px;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    column-gap: 12px;
    row-gap: 18px; 
  }
  
  .control-button {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .button-text {
    display: none;
  }
  
  .control-button .button-icon {
    font-size: 18px;
  }
}
</style>
