import {
  FACE_BASELINE_40_QUESTION_COUNT,
  FACE_BASELINE_40_QUESTIONS,
  FACE_BASELINE_40_VERSION,
} from '../data/faceQuestions';
import { completeFaceAssessmentRun, startAssessmentRun } from './assessmentPersistence';
import type { AssessmentAnswer, FaceScores } from '../types';

const LOCAL_PENDING_ASSESSMENT_KEY = 'face_pending_assessment_v1';

type PendingAssessment = {
  assessmentVersion: string;
  answers: Record<string, AssessmentAnswer['selected_option']>;
  scores: FaceScores;
  savedAt: string;
};

const isPendingAssessment = (value: unknown): value is PendingAssessment => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<PendingAssessment>;
  return item.assessmentVersion === FACE_BASELINE_40_VERSION && !!item.answers && !!item.scores;
};

const agreementValues: Record<Exclude<AssessmentAnswer['selected_option'], 'A' | 'B'>, number> = {
  very_agree: 10,
  somewhat_agree: 7,
  neutral: 5,
  somewhat_disagree: 3,
  very_disagree: 0,
};

/** Copies one completed guest result into the account selected by the visitor. */
export const claimPendingGuestAssessment = async (): Promise<boolean> => {
  const raw = localStorage.getItem(LOCAL_PENDING_ASSESSMENT_KEY);
  if (!raw) return false;

  let pending: PendingAssessment;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPendingAssessment(parsed)) return false;
    pending = parsed;
  } catch {
    return false;
  }

  const scoreValues = Object.fromEntries(FACE_BASELINE_40_QUESTIONS.map((question) => {
    const answer = pending.answers[question.id];
    const value = question.type === 'agreement'
      ? agreementValues[answer as Exclude<AssessmentAnswer['selected_option'], 'A' | 'B'>]
      : 10;
    return [question.id, value];
  }));

  const runId = await startAssessmentRun(crypto.randomUUID(), FACE_BASELINE_40_VERSION, FACE_BASELINE_40_QUESTION_COUNT);
  await completeFaceAssessmentRun(runId, FACE_BASELINE_40_QUESTIONS, pending.answers, pending.scores, scoreValues);
  localStorage.removeItem(LOCAL_PENDING_ASSESSMENT_KEY);
  return true;
};
