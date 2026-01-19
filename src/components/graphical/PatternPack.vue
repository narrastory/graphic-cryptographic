<script setup lang="ts">
import Graphical from './Graphical.vue'

const defalutGraphicalStyle = {
  canvasWidth: 180,
  canvasHeight: 180,
  pointRadius: 16,
  activePointRadius: 7,
  inactiveColor: 'rgb(216, 216, 216)',
  activeColor: 'rgb(138, 138, 138)',
  startColor: 'rgb(40, 115, 226)',
  endColor: 'rgb(226, 40, 40)',
  lineWidth: 6.5,
  lineColor: 'rgb(72, 72, 72)',
  backgroundColor: 'transparent',
}

const props = defineProps<{
  points: number[]
}>()

let points = props.points

// 计算包裹组件的宽度，比画布宽度大40px（两边各多20px）
const wrapperWidth = defalutGraphicalStyle.canvasWidth + 40
</script>

<template>
  <div 
    class="graphicPack" 
    :style="{ width: `${wrapperWidth}px` }"
  >
    <Graphical :points="points" v-bind="defalutGraphicalStyle" />
    <p>{{ '[' + points.join(' ') + ']' }}</p>
  </div>
</template>

<style scoped>
.graphicPack {
    background-color: #ffffff;
    border: 1px solid #757575;
    border-radius: 12px;
    padding: 24px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    max-width: 100%;
    box-sizing: border-box;
}

.graphicPack:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    border-color: #757575;
}

.graphicPack p {
    margin: 0;
    padding: 12px 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    font-family: 'Consolas', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    color: #333;
    text-align: center;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip; 
    border: 1px solid #eaeaea;
    transition: background-color 0.3s ease;
    cursor: default;
    box-sizing: border-box;
}

.graphicPack p::selection {
    background-color: #f0ec29; /* 选中背景色 */
    color: rgb(136, 21, 21);              /* 选中文字颜色 */
}
</style>