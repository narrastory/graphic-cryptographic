import { LENGTH_MATRIX, JUMP_TABLE,LINE_TYPE_MAP } from './frozenData';
import deduplicateSymmetricPatterns from './filter';
import type { PasswordInfo } from '@/types';

// 检测是否存在不合规跳点，以及跳点数量
const gapPointDetect = (password: readonly number[]) => {
    let normalStyle = true;
    let skipPointNums = 0;
    const len = password.length;
    let visited = 0;
    visited |= 1 << (password[0]! - 1);
    for (let i = 0; i < len - 1; i++) {
        const curr = password[i]!;
        const next = password[i + 1]!;
        const jumpInfo = JUMP_TABLE[(curr << 8) | next]!;
        if (jumpInfo & 0x01) { 
            skipPointNums++;
            if (normalStyle && (jumpInfo & 0x02)) { 
                const mid = (jumpInfo >> 4) & 0x0F;
                if (!(visited & (1 << (mid - 1)))) {
                    normalStyle = false;
                }
            }
        }
        visited |= 1 << (next - 1);
    }
    return { normalStyle, skipPointNums };
};

/**
 * 线条长度计算函数
 * @param password 密码序列，元素为1-9的数字
 * @returns 线条总长度（精确到小数点后15位）
 */
const lineLengthCompute = (password: readonly number[]): number => {
    const len = password.length;
    if (len < 2) return 0;
    const matrix = LENGTH_MATRIX;
    let sum = 0.0;
    let prevIdx = password[0]! - 1;
    for (let i = 1; i < len; i++) {
        const currIdx = password[i]! - 1;
        sum += matrix[prevIdx]![currIdx]!;
        prevIdx = currIdx;
    }
    return sum;
};

// 检测线条为直线/斜线
const lineTypeDetect = (password: readonly number[]) => {
    const len = password.length - 1;
    let straightLines = 0;
    let diagonal45Lines = 0;
    let diagonalLines = 0;
    let i = 0;
    const arr = password;
    while (i < len) {
        const type = LINE_TYPE_MAP[arr[i]! * 10 + arr[i + 1]!];
        if (type === 0) {
            straightLines++;
        } else if (type === 1) {
            diagonal45Lines++;
        } else { 
            diagonalLines++;
        }
        i++;
    }
    return { straightLines, diagonal45Lines, diagonalLines };
};

/**
 * 生成所有4-9长度的图案密码排列组合
 * @returns number[][] - 所有可能的排列组合数组
 */
const generatePatternPasswords = (): number[][] => {
    const TOTAL_COMBINATIONS = 985824;
    const results: number[][] = new Array(TOTAL_COMBINATIONS);
    let resultIndex = 0;
    const path = new Uint8Array(9);
    let usedMask = 0;
    function backtrack(currentDepth: number): void {
        if (currentDepth >= 4) {
            const result = new Array(currentDepth);
            for (let i = 0; i < currentDepth; i++) {
                result[i] = path[i];
            }
            results[resultIndex++] = result;
        }
        if (currentDepth === 9) {
            return;
        }
        for (let num = 1; num <= 9; num++) {
            const bit = 1 << (num - 1);
            if ((usedMask & bit) === 0) {
                usedMask |= bit;
                path[currentDepth] = num;
                backtrack(currentDepth + 1);
                usedMask &= ~bit;
            }
        }
    }
    backtrack(0);
    if (resultIndex !== TOTAL_COMBINATIONS) {
        console.warn(
            `Warning: Expected ${TOTAL_COMBINATIONS} combinations, got ${resultIndex}`
        );
    }
    return results;
};

const generateTagPassword = (): PasswordInfo[] => {
    const allPatterns = generatePatternPasswords();
    // dedupedPatterns.length = 123228
    const dedupedPatterns = deduplicateSymmetricPatterns(allPatterns);
    return dedupedPatterns.map((password:number[]) => {
        let { normalStyle, skipPointNums } = gapPointDetect(password);
        let { straightLines, diagonal45Lines, diagonalLines } = lineTypeDetect(password);
        let points = password.length;
        let lineLength = lineLengthCompute(password);
        return {
            password,
            normalStyle,
            skipPointNums,
            points,
            lineLength,
            straightLines,
            diagonal45Lines,
            diagonalLines
        }
    })
};

// 数组打乱算法
const shuffleArray = (array:PasswordInfo[]) => {
  let currentIndex = array.length;
  let randomIndex, temp;
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex--);
    temp = array[currentIndex] as PasswordInfo;
    array[currentIndex] = array[randomIndex] as PasswordInfo;
    array[randomIndex] = temp;
  }
  return array;
}

export {
    generateTagPassword,
    shuffleArray
}