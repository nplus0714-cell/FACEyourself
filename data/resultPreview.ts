import type { FaceScores, FaceTrait } from '../types';

export const RESULT_PREVIEW_CODES = [
  'ARLC', 'ARLD', 'ARTC', 'ARTD',
  'AILC', 'AILD', 'AITC', 'AITD',
  'PRLC', 'PRLD', 'PRTC', 'PRTD',
  'PILC', 'PILD', 'PITC', 'PITD',
] as const;

const OPPOSITES: Record<string, string> = {
  A: 'P', P: 'A', R: 'I', I: 'R',
  L: 'T', T: 'L', C: 'D', D: 'C',
};

/** Stable, clearly artificial scores for inspecting result-page layouts. */
export const createPreviewScores = (code: string): FaceScores => {
  const scores: FaceScores = { A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 };
  for (const trait of code) {
    scores[trait as FaceTrait] = 80;
    scores[OPPOSITES[trait] as FaceTrait] = 20;
  }
  return scores;
};
