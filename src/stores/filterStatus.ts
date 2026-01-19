import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FilterStatusType } from '@/types'

export const useFilterStatusStore = defineStore('filterStatus', {
  state: (): FilterStatusType => ({
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
  }),
})
