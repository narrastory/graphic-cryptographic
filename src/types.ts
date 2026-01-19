interface PasswordInfo {
  password: number[]
  normalStyle: boolean
  skipPointNums: number
  points: number
  lineLength: number
  straightLines: number
  diagonal45Lines: number
  diagonalLines: number
}

interface FilterStatusType {
    nodeCount: number;
    nodeRandom: boolean;
    normalMode: boolean;
    jumpCount: number;
    jumpRandom: boolean;
    lineLengthOrder: 'random' | 'desc';
    straightLines: number;
    straightRandom: boolean;
    oblique45Lines: number;
    oblique45Random: boolean;
    oblique12Lines: number;
    oblique12Random: boolean;
}

export type { PasswordInfo, FilterStatusType }