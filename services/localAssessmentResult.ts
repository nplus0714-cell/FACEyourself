import type { FaceScores } from '../types';

const PENDING_ASSESSMENT_KEYS = [
  'face_pending_assessment_v3',
  'face_pending_assessment_v1',
] as const;

export type BrowserAssessmentResult = {
  scores: FaceScores;
  completedAt?: string;
};

export const isFaceScores = (value: unknown): value is FaceScores => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'].every(
    (key) => typeof candidate[key] === 'number',
  );
};

/**
 * Reads the newest guest assessment cached by either the current 24-question
 * flow or the legacy flow. This keeps `/my-result` usable after a refresh.
 */
export const getBrowserPendingAssessment = (): BrowserAssessmentResult | null => {
  for (const key of PENDING_ASSESSMENT_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as {
        scores?: unknown;
        savedAt?: unknown;
        completedAt?: unknown;
      };
      if (!isFaceScores(parsed.scores)) continue;
      const completedAt = typeof parsed.savedAt === 'string'
        ? parsed.savedAt
        : typeof parsed.completedAt === 'string'
          ? parsed.completedAt
          : undefined;
      return { scores: parsed.scores, completedAt };
    } catch {
      // A malformed legacy entry must not block the current result.
    }
  }
  return null;
};
