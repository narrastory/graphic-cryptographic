// 预计算并冻结矩阵，避免运行时优化障碍
const LENGTH_MATRIX: Float64Array[] = [
    new Float64Array([
        0,
        1,
        2,
        1,
        Math.sqrt(2),
        Math.sqrt(5),
        2,
        Math.sqrt(5),
        2 * Math.sqrt(2),
    ]),
    new Float64Array([
        1,
        0,
        1,
        Math.sqrt(2),
        1,
        Math.sqrt(2),
        Math.sqrt(5),
        2,
        Math.sqrt(5),
    ]),
    new Float64Array([
        2,
        1,
        0,
        Math.sqrt(5),
        Math.sqrt(2),
        1,
        2 * Math.sqrt(2),
        Math.sqrt(5),
        2,
    ]),
    new Float64Array([
        1,
        Math.sqrt(2),
        Math.sqrt(5),
        0,
        1,
        2,
        1,
        Math.sqrt(2),
        Math.sqrt(5),
    ]),
    new Float64Array([
        Math.sqrt(2),
        1,
        Math.sqrt(2),
        1,
        0,
        1,
        Math.sqrt(2),
        1,
        Math.sqrt(2),
    ]),
    new Float64Array([
        Math.sqrt(5),
        Math.sqrt(2),
        1,
        2,
        1,
        0,
        Math.sqrt(5),
        Math.sqrt(2),
        1,
    ]),
    new Float64Array([
        2,
        Math.sqrt(5),
        2 * Math.sqrt(2),
        1,
        Math.sqrt(2),
        Math.sqrt(5),
        0,
        1,
        2,
    ]),
    new Float64Array([
        Math.sqrt(5),
        2,
        Math.sqrt(5),
        Math.sqrt(2),
        1,
        Math.sqrt(2),
        1,
        0,
        1,
    ]),
    new Float64Array([
        2 * Math.sqrt(2),
        Math.sqrt(5),
        2,
        Math.sqrt(5),
        Math.sqrt(2),
        1,
        2,
        1,
        0,
    ]),
];

const GAP_FLAGS: number[] = new Array(512);
for (let mask = 0; mask < 512; mask++) {
    GAP_FLAGS[mask] = 0;
}
const midPoints: { [key: number]: number } = {
    0x13: 2,
    0x17: 4,
    0x19: 5,
    0x28: 5,
    0x31: 2,
    0x37: 5,
    0x39: 6,
    0x46: 5,
    0x64: 5,
    0x71: 4,
    0x73: 5,
    0x79: 8,
    0x82: 5,
    0x91: 5,
    0x93: 6,
    0x97: 8,
};
const JUMP_TABLE = new Uint8Array(65536);
for (let curr = 1; curr <= 9; curr++) {
    for (let next = 1; next <= 9; next++) {
        const key = (curr << 8) | next;
        const midKey = (curr << 4) | next;

        if (midPoints[midKey]) {
            const mid = midPoints[midKey];
            JUMP_TABLE[key] = (mid << 4) | 0x03;
        } else if (midPoints[(next << 4) | curr]) {
            const mid = midPoints[(next << 4) | curr]!;
            JUMP_TABLE[key] = (mid << 4) | 0x03;
        } else {
            JUMP_TABLE[key] = 0;
        }
    }
}

const LINE_TYPE_MAP: number[] = (() => {
    const map = new Array(100).fill(0); 
    const getCoords = (n: number): [number, number] => [
        Math.floor((n - 1) / 3),
        (n - 1) % 3
    ];
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            if (i === j) continue;
            const [x1, y1] = getCoords(i);
            const [x2, y2] = getCoords(j);
            const dx = Math.abs(x1 - x2);
            const dy = Math.abs(y1 - y2);
            let type = 2; 
            if (dx === 0 || dy === 0) {
                type = 0;
            } 
            else if (dx === dy) {
                type = 1;
            }
            map[i * 10 + j] = type;
        }
    }
    return map;
})();

export { LENGTH_MATRIX, JUMP_TABLE, LINE_TYPE_MAP };
