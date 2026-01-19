<template>
  <div
    class="pattern-lock-container"
    :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
  >
    <canvas
      ref="canvasRef"
      :width="canvasWidth * pixelRatio"
      :height="canvasHeight * pixelRatio"
      :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, type Ref } from 'vue'

// 类型定义
interface PointPosition {
  x: number
  y: number
}

interface PointPositions {
  [key: number]: PointPosition
}

// 定义props类型
interface Props {
  points: number[]
  canvasWidth: number
  canvasHeight: number
  pointRadius: number
  activePointRadius: number
  inactiveColor: string
  activeColor: string
  startColor: string
  endColor: string
  lineWidth: number
  lineColor: string
  backgroundColor: string
}

// 验证points数组
const validator_array = (value: number[]): boolean => {
  if (value.length < 4 || value.length > 9) return false
  const uniquePoints = new Set(value)
  return value.every(
    (point) =>
      typeof point === 'number' && point >= 1 && point <= 9 && uniquePoints.size === value.length,
  )
}

// 定义props
const props = withDefaults(defineProps<Props>(), {
  canvasWidth: 200,
  canvasHeight: 200,
  pointRadius: 17,
  activePointRadius: 7,
  inactiveColor: 'rgb(216, 216, 216)',
  activeColor: 'rgb(138, 138, 138)',
  startColor: 'rgb(40, 115, 226)',
  endColor: 'rgb(226, 40, 40)',
  lineWidth: 6.5,
  lineColor: 'rgb(62, 62, 62)',
  backgroundColor: 'transparent',
})

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
const pixelRatio = ref(1)

// 点的位置映射 (1-9对应的位置)
const getPointPositions = (width: number, height: number): PointPositions => {
  const padding = Math.min(width, height) * 0.15
  const cellWidth = (width - padding * 2) / 2
  const cellHeight = (height - padding * 2) / 2

  return {
    1: { x: padding, y: padding },
    2: { x: padding + cellWidth, y: padding },
    3: { x: padding + cellWidth * 2, y: padding },
    4: { x: padding, y: padding + cellHeight },
    5: { x: padding + cellWidth, y: padding + cellHeight },
    6: { x: padding + cellWidth * 2, y: padding + cellHeight },
    7: { x: padding, y: padding + cellHeight * 2 },
    8: { x: padding + cellWidth, y: padding + cellHeight * 2 },
    9: { x: padding + cellWidth * 2, y: padding + cellHeight * 2 },
  }
}

const drawPattern = (points_array?: number[]): void => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = props.canvasWidth * pixelRatio.value
  const height = props.canvasHeight * pixelRatio.value

  // 设置canvas大小
  canvas.width = width
  canvas.height = height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 设置背景
  if (props.backgroundColor !== 'transparent') {
    ctx.fillStyle = props.backgroundColor
    ctx.fillRect(0, 0, width, height)
  }

  // 获取点的位置
  const positions = getPointPositions(width, height)

  // 1. 绘制所有9个点（先画未激活的）
  Object.keys(positions).forEach((key) => {
    const pos = positions[Number(key)] as PointPosition
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, props.pointRadius * pixelRatio.value, 0, Math.PI * 2)
    ctx.fillStyle = props.inactiveColor
    ctx.fill()
  })

  // 如果没有传入points_array，使用props.points
  const pointsToDraw:number[] = points_array || props.points
  
  // 2. 绘制连接线
  if (pointsToDraw.length >= 2) {
    ctx.beginPath()
    ctx.strokeStyle = props.lineColor
    ctx.lineWidth = props.lineWidth * pixelRatio.value
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 移动到起始点
    const startPos = positions[pointsToDraw[0]!] as PointPosition
    ctx.moveTo(startPos.x, startPos.y)

    // 连接所有点
    for (let i = 1; i < pointsToDraw.length; i++) {
      const pos = positions[pointsToDraw[i]!] as PointPosition
      ctx.lineTo(pos.x, pos.y)
    }

    ctx.stroke()
  }

  // 3. 绘制激活的点（覆盖在线上）
  pointsToDraw.forEach((point, index) => {
    const pos = positions[point] as PointPosition
    const radius = props.activePointRadius * pixelRatio.value

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)

    // 根据位置设置颜色
    if (index === 0) {
      ctx.fillStyle = props.startColor // 起始点
    } else if (index === pointsToDraw.length - 1) {
      ctx.fillStyle = props.endColor // 终点
    } else {
      ctx.fillStyle = props.activeColor // 中间点
    }

    ctx.fill()
  })
}

// 初始化和响应式更新
onMounted(() => {
  let points_array: number[] = []
  if (!validator_array(props.points)) {
    console.warn("Invalid points array prop passed to Graphical component.")
    points_array = [1, 9, 5, 3, 7] // 设置一个默认值以防止错误
  } else {
    points_array = props.points
  }

  // 获取设备像素比，用于高清显示
  pixelRatio.value = window.devicePixelRatio || 1

  // 首次绘制
  nextTick(() => {
    drawPattern(points_array)
  })
})

// 监听props变化
watch(() => props, () => {
  drawPattern()
}, { deep: true })
</script>

<style scoped>
.pattern-lock-container {
  position: relative;
  display: inline-block;
  background: transparent;
}
</style>
