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
import { getSupabaseClient } from '../lib/supabase';
import type { AssessmentAnswer, FaceQuestion, FaceScores } from '../types';

type PendingAssessment = {
  assessmentVersion: string;
  answers: Record<string, AssessmentAnswer['selected_option']>;
  scores: FaceScores;
  savedAt: string;
  claim?: { userId: string; runId: string };
};

const PENDING_ASSESSMENTS: Array<{
  storageKey: string;
  version: string;
  questionCount: number;
  questions: FaceQuestion[];
}> = [
  {
    storageKey: 'face_pending_assessment_v3',
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
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const stableClaimRunId = async (memberId: string, version: string, pending: PendingAssessment): Promise<string> => {
  // Auth callbacks can run in several same-origin tabs at once. Every tab must
  // choose the same run ID before any of them writes the claim back to storage.
  const identity = JSON.stringify([
    memberId,
    version,
    pending.savedAt ?? '',
    Object.entries(pending.answers).sort(([left], [right]) => left.localeCompare(right)),
  ]);
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(identity))).slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
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
  if (!PENDING_ASSESSMENTS.some((source) => localStorage.getItem(source.storageKey))) return false;
  const { data: { session }, error } = await getSupabaseClient().auth.getSession();
  if (error || !session?.user || session.user.is_anonymous) {
    throw new Error('A member session is required to claim a guest assessment.');
  }
  const memberId = session.user.id;

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

    // Keep the same run ID across retries. A lost response after the server
    // saved the result must not create a duplicate assessment on refresh.
    const canReuseClaim = pending.claim?.userId === memberId
      && UUID_PATTERN.test(pending.claim.runId);
    const claimRunId = canReuseClaim
      ? pending.claim.runId
      : await stableClaimRunId(memberId, source.version, pending);
    if (!canReuseClaim) {
      pending = { ...pending, claim: { userId: memberId, runId: claimRunId } };
      localStorage.setItem(source.storageKey, JSON.stringify(pending));
    }
    const runId = await startAssessmentRun(claimRunId, source.version, source.questionCount);
    await completeFaceAssessmentRun(runId, source.questions, pending.answers, pending.scores, scoreValues);
    localStorage.removeItem(source.storageKey);
    claimedAny = true;
  }

  return claimedAny;
};
