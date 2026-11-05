import type { FaceScores } from '../types';

const PENDING_ASSESSMENT_KEYS = [
  'face_pending_assessment_v3',
  'face_pending_assessment_v1',
] as const;

export type BrowserAssessmentResult = {
  scores: FaceScores;
  completedAt?: string;
  ownerId?: string | null;
};

const RESULT_KEY = 'face_completed_result_v1';

/** A result snapshot is independent of authentication and the sync queue. */
export const saveBrowserAssessment = (scores: FaceScores, ownerId: string | null = null, completedAt = new Date().toISOString()): boolean => {
  if (!isFaceScores(scores)) return false;
  const result = JSON.stringify({ scores, ownerId, completedAt });
  let saved = false;
  for (const storage of [() => localStorage, () => sessionStorage]) {
    for (const key of [RESULT_KEY, ...(ownerId ? [`${RESULT_KEY}:${ownerId}`] : [])]) {
      try {
        let existing;
        try { existing = JSON.parse(storage().getItem(key) ?? 'null'); } catch { /* Replace corrupt data. */ }
        if (!isFaceScores(existing?.scores) || (existing.completedAt ?? '') <= completedAt) storage().setItem(key, result);
        saved = true;
      } catch { /* Try the other storage when persistent storage is unavailable. */ }
    }
  }
  return saved;
};

export const getSavedBrowserAssessment = (ownerId?: string): BrowserAssessmentResult | null => {
  const key = ownerId ? `${RESULT_KEY}:${ownerId}` : RESULT_KEY;
  const results: BrowserAssessmentResult[] = [];
  for (const storage of [() => localStorage, () => sessionStorage]) {
    try {
      const result = JSON.parse(storage().getItem(key) ?? 'null');
      if (isFaceScores(result?.scores) && (!ownerId || result.ownerId === ownerId)) results.push(result);
    } catch { /* Corrupt or unavailable storage must not prevent rendering. */ }
  }
  return results.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))[0] ?? null;
};

/** Restore the same browser result on logout, but never lend it to another account. */
export const scoresAfterAuthChange = (scores: FaceScores | null, previousOwner: string | null, nextOwner: string | null): FaceScores | null => {
  if (!nextOwner) return scores ?? getSavedBrowserAssessment()?.scores ?? null;
  if (previousOwner === nextOwner) return scores;
  const snapshot = getSavedBrowserAssessment();
  if (!previousOwner && !snapshot?.ownerId) return scores;
  return getSavedBrowserAssessment(nextOwner)?.scores ?? null;
};

export const isFaceScores = (value: unknown): value is FaceScores => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'].every(
    (key) => typeof candidate[key] === 'number' && Number.isFinite(candidate[key]) && (candidate[key] as number) >= 0 && (candidate[key] as number) <= 100,
  );
};

/**
 * Reads the newest guest assessment cached by either the current 24-question
 * flow or the legacy flow. This keeps `/my-result` usable after a refresh.
 */
export const getBrowserPendingAssessment = (ownerId?: string): BrowserAssessmentResult | null => {
  for (const key of PENDING_ASSESSMENT_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as {
        scores?: unknown;
        savedAt?: unknown;
        completedAt?: unknown;
        ownerId?: string;
        claim?: { userId?: string };
      };
      if (!isFaceScores(parsed.scores)) continue;
      const savedOwner = parsed.ownerId ?? parsed.claim?.userId ?? null;
      if (ownerId && savedOwner && savedOwner !== ownerId) continue;
      const completedAt = typeof parsed.savedAt === 'string'
        ? parsed.savedAt
        : typeof parsed.completedAt === 'string'
          ? parsed.completedAt
          : undefined;
      return { scores: parsed.scores, completedAt, ownerId: savedOwner };
    } catch {
      // A malformed legacy entry must not block the current result.
    }
  }
  return null;
};

export const markPendingAssessmentOwner = (ownerId: string): void => {
  for (const key of PENDING_ASSESSMENT_KEYS) {
    try {
      const result = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (isFaceScores(result?.scores) && !result.ownerId && !result.claim) {
        localStorage.setItem(key, JSON.stringify({ ...result, ownerId }));
      }
    } catch { /* The completed snapshot still protects the visible result. */ }
  }
};

export const getLatestBrowserAssessment = (ownerId?: string): BrowserAssessmentResult | null => {
  const pending = getBrowserPendingAssessment(ownerId);
  const saved = getSavedBrowserAssessment(ownerId);
  return [pending, saved].filter((item): item is BrowserAssessmentResult => !!item)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))[0] ?? null;
};
