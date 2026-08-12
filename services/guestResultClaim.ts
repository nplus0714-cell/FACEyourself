import {
  FACE_BASELINE_40_QUESTION_COUNT,
  FACE_BASELINE_40_QUESTIONS,
  FACE_BASELINE_40_VERSION,
} from '../data/faceQuestions';
import {
  FACE_BASELINE_V2_QUESTION_COUNT,
  FACE_BASELINE_V2_QUESTIONS,
  FACE_BASELINE_V2_VERSION,
} from '../data/faceQuestionsV2';
import { completeFaceAssessmentRun, startAssessmentRun } from './assessmentPersistence';
import type { AssessmentAnswer, FaceQuestion, FaceScores } from '../types';

type PendingAssessment = {
  assessmentVersion: string;
  answers: Record<string, AssessmentAnswer['selected_option']>;
  scores: FaceScores;
  savedAt: string;
};

const PENDING_ASSESSMENTS: Array<{
  storageKey: string;
  version: string;
  questionCount: number;
  questions: FaceQuestion[];
}> = [
  {
    storageKey: 'face_pending_assessment_v2',
    version: FACE_BASELINE_V2_VERSION,
    questionCount: FACE_BASELINE_V2_QUESTION_COUNT,
    questions: FACE_BASELINE_V2_QUESTIONS,
  },
  {
    storageKey: 'face_pending_assessment_v1',
    version: FACE_BASELINE_40_VERSION,
    questionCount: FACE_BASELINE_40_QUESTION_COUNT,
    questions: FACE_BASELINE_40_QUESTIONS,
  },
];

const gradedValues: Partial<Record<AssessmentAnswer['selected_option'], number>> = {
  very_agree: 10,
  somewhat_agree: 7,
  neutral: 5,
  somewhat_disagree: 3,
  very_disagree: 0,
  very_a: 10,
  somewhat_a: 7,
  balanced: 5,
  somewhat_b: 3,
  very_b: 0,
  not_applicable: 0,
};

const isPendingAssessment = (value: unknown, version: string): value is PendingAssessment => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<PendingAssessment>;
  return item.assessmentVersion === version && !!item.answers && !!item.scores;
};

const getScoreValue = (question: FaceQuestion, answer: AssessmentAnswer['selected_option']): number => {
  if (question.type === 'agreement' || question.responseMode === 'bipolar' || answer === 'not_applicable') {
    return gradedValues[answer] ?? 0;
  }
  return 10;
};

/** Copies completed guest results into the account selected by the visitor. */
export const claimPendingGuestAssessment = async (): Promise<boolean> => {
  let claimedAny = false;

  for (const source of PENDING_ASSESSMENTS) {
    const raw = localStorage.getItem(source.storageKey);
    if (!raw) continue;

    let pending: PendingAssessment;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isPendingAssessment(parsed, source.version)) continue;
      pending = parsed;
    } catch {
      continue;
    }

    const scoreValues = Object.fromEntries(source.questions.map((question) => {
      const answer = pending.answers[question.id];
      return [question.id, getScoreValue(question, answer)];
    }));

    const runId = await startAssessmentRun(crypto.randomUUID(), source.version, source.questionCount);
    await completeFaceAssessmentRun(runId, source.questions, pending.answers, pending.scores, scoreValues);
    localStorage.removeItem(source.storageKey);
    claimedAny = true;
  }

  return claimedAny;
};
