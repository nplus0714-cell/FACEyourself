import { FACE_BASELINE_V2_QUESTIONS, FACE_BASELINE_V2_VERSION } from '../data/faceQuestionsV2';
import type { AssessmentSelectedOption } from '../types';

const ASSESSMENT_PROGRESS_KEY = 'face-assessment-progress-v1';

const VALID_RESPONSES = new Set<AssessmentSelectedOption>([
  'A',
  'B',
  'very_agree',
  'somewhat_agree',
  'neutral',
  'somewhat_disagree',
  'very_disagree',
  'very_a',
  'somewhat_a',
  'balanced',
  'somewhat_b',
  'very_b',
  'not_applicable',
]);

export interface LocalAssessmentProgress {
  step: number;
  answers: Record<string, AssessmentSelectedOption>;
}

export const getLocalAssessmentProgress = (): LocalAssessmentProgress | null => {
  try {
    const raw = localStorage.getItem(ASSESSMENT_PROGRESS_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      version?: unknown;
      step?: unknown;
      answers?: unknown;
    };
    if (parsed.version !== FACE_BASELINE_V2_VERSION
      || typeof parsed.step !== 'number'
      || !Number.isInteger(parsed.step)
      || parsed.step < 0
      || parsed.step >= FACE_BASELINE_V2_QUESTIONS.length
      || !parsed.answers
      || typeof parsed.answers !== 'object') {
      localStorage.removeItem(ASSESSMENT_PROGRESS_KEY);
      return null;
    }

    const questionIds = new Set(FACE_BASELINE_V2_QUESTIONS.map((question) => question.id));
    const answers = Object.fromEntries(
      Object.entries(parsed.answers as Record<string, unknown>)
        .filter(([questionId, response]) => questionIds.has(questionId) && VALID_RESPONSES.has(response as AssessmentSelectedOption)),
    ) as Record<string, AssessmentSelectedOption>;

    return { step: parsed.step, answers };
  } catch {
    localStorage.removeItem(ASSESSMENT_PROGRESS_KEY);
    return null;
  }
};

export const saveLocalAssessmentProgress = (progress: LocalAssessmentProgress): void => {
  try {
    localStorage.setItem(ASSESSMENT_PROGRESS_KEY, JSON.stringify({
      version: FACE_BASELINE_V2_VERSION,
      step: progress.step,
      answers: progress.answers,
      updatedAt: new Date().toISOString(),
    }));
  } catch {
    // Progress recovery is helpful, but storage availability must never block the test.
  }
};

export const clearLocalAssessmentProgress = (): void => {
  try {
    localStorage.removeItem(ASSESSMENT_PROGRESS_KEY);
  } catch {
    // Ignore unavailable browser storage.
  }
};
