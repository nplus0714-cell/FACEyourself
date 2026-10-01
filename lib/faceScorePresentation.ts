import type { FaceDimension, FaceScores, FaceTrait } from '../types';

/** Keep guest and member score visualizations on the same 0–100 scale. */
export const faceTraitRatio = (first: number, second: number): number => {
  const total = first + second;
  return total === 0 ? 50 : Math.round((first / total) * 100);
};

const FACE_PAIRS: ReadonlyArray<{
  dimension: FaceDimension;
  label: string;
  l1Name: string;
  l2Name: string;
  l1Key: FaceTrait;
  l2Key: FaceTrait;
}> = [
  { dimension: 'FOCUS', label: '獲利動機', l1Name: '積極型 (A)', l2Name: '保守型 (P)', l1Key: 'A', l2Key: 'P' },
  { dimension: 'ANALYSIS', label: '決策邏輯', l1Name: '理性數據 (R)', l2Name: '感應直覺 (I)', l1Key: 'R', l2Key: 'I' },
  { dimension: 'CYCLE', label: '交易週期', l1Name: '長期投資 (L)', l2Name: '短期投機 (T)', l1Key: 'L', l2Key: 'T' },
  { dimension: 'EXPOSURE', label: '資金管理', l1Name: '集中 (C)', l2Name: '分散 (D)', l1Key: 'C', l2Key: 'D' },
];

export const getFaceScorePairs = (scores: FaceScores, includeConfidence = true) => FACE_PAIRS.map((pair) => {
  const v1 = faceTraitRatio(scores[pair.l1Key], scores[pair.l2Key]);
  return {
    ...pair,
    v1,
    v2: 100 - v1,
    isBalanced: v1 >= 45 && v1 <= 55,
    confidence: includeConfidence ? scores.assessmentMeta?.confidenceByDimension[pair.dimension] ?? null : null,
  };
});

export const getFaceRadarData = (scores: FaceScores, daily?: FaceScores | null) => {
  const values = (source: FaceScores) => {
    const a = faceTraitRatio(source.A, source.P);
    const r = faceTraitRatio(source.R, source.I);
    const l = faceTraitRatio(source.L, source.T);
    const c = faceTraitRatio(source.C, source.D);
    return [a, r, l, c, 100 - a, 100 - r, 100 - l, 100 - c];
  };
  const base = values(scores);
  const current = daily ? values(daily) : base;
  return ['積極 A', '理性 R', '長期 L', '集中 C', '保守 P', '感性 I', '交易 T', '分散 D']
    .map((subject, index) => ({ subject, base: base[index], current: current[index] }));
};
