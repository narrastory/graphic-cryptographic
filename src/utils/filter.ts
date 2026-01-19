type TransformMap = number[];

const toRC = (d: number) => {
  const r = Math.floor((d - 1) / 3);
  const c = (d - 1) % 3;
  return { r, c };
};
const fromRC = (r: number, c: number) => r * 3 + c + 1;

const transformDigitMaps = (() => {
  const I: TransformMap = new Array(10);
  const R90: TransformMap = new Array(10);
  const R180: TransformMap = new Array(10);
  const R270: TransformMap = new Array(10);
  const F: TransformMap = new Array(10);      
  const FR90: TransformMap = new Array(10);
  const FR180: TransformMap = new Array(10);
  const FR270: TransformMap = new Array(10);

  for (let d = 1; d <= 9; d++) {
    const { r, c } = toRC(d);

    // 原图
    I[d] = d;

    // 旋转 90° (顺时针)：(r,c) -> (c, 2 - r)
    {
      const nr = c;
      const nc = 2 - r;
      R90[d] = fromRC(nr, nc);
    }

    // 旋转 180°：(r,c) -> (2 - r, 2 - c)
    {
      const nr = 2 - r;
      const nc = 2 - c;
      R180[d] = fromRC(nr, nc);
    }

    // 旋转 270°：(r,c) -> (2 - c, r)
    {
      const nr = 2 - c;
      const nc = r;
      R270[d] = fromRC(nr, nc);
    }

    // 水平镜像 F，左右翻转：(r,c) -> (r, 2 - c)
    {
      const nr = r;
      const nc = 2 - c;
      F[d] = fromRC(nr, nc);
    }
  }

  // 组合变换：F 后再 R90/R180/R270
  const FR90_: TransformMap = FR90;
  const FR180_: TransformMap = FR180;
  const FR270_: TransformMap = FR270;

  for (let d = 1; d <= 9; d++) {
    FR90_[d] = R90[F[d]!] as number;
    FR180_[d] = R180[F[d]!] as number;
    FR270_[d] = R270[F[d]!] as number;
  }

  return [I, R90, R180, R270, F, FR90_, FR180_, FR270_];
})();

// ------------- 求一个图案的 canonical form -------------
// 输入: pattern: number[] (例如 [1,2,3,5,7,8,9])
// 输出: 最小字典序的等价序列（新的 number[]）
const getCanonicalPattern = (pattern: number[]): number[] => {
  const transforms = transformDigitMaps;
  const len = pattern.length;
  const best = new Array<number>(len);
  for (let i = 0; i < len; i++) {
    best[i] = transforms[0]![pattern[i]!] as number; 
  }
  const tmp = new Array<number>(len);
  for (let t = 1; t < transforms.length; t++) {
    const map = transforms[t]!;
    for (let i = 0; i < len; i++) {
      tmp[i] = map[pattern[i]!]!;
    }
    let smaller = false;
    let greater = false;
    for (let i = 0; i < len; i++) {
      const a = tmp[i]!;
      const b = best[i]!;
      if (a < b) {
        smaller = true;
        break;
      } else if (a > b) {
        greater = true;
        break;
      }
    }
    if (smaller && !greater) {
      for (let i = 0; i < len; i++) {
        best[i] = tmp[i] as number;
      }
    }
  }
  return best;
};

/**
 * 从所有候选图案中去除「旋转/镜像等价」的冗余图案
 * @param allPatterns - 所有 4~9 长度的排列组合 (number[][])
 * @returns number[][] - 去重后的图案数组，每个等价类保留一个代表
 */
const deduplicateSymmetricPatterns = (allPatterns: number[][]): number[][] => {
  const seen = new Set<string>();
  const unique: number[][] = [];
  for (let i = 0; i < allPatterns.length; i++) {
    const p = allPatterns[i]!;
    const canonical = getCanonicalPattern(p);
    let key = "";
    for (let j = 0; j < canonical.length; j++) {
      if (j > 0) key += ",";
      key += canonical[j];
    }
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }
  return unique;
};

export default deduplicateSymmetricPatterns;