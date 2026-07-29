import { getFaceCode } from '../constants';
import { getSupabaseClient } from '../lib/supabase';
import type { Json } from '../lib/database.types';
import type { AssessmentAnswer, FaceScores, Question } from '../types';

const VISITOR_ID_KEY = 'face_anonymous_visitor_id_v1';

export class AssessmentPersistenceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AssessmentPersistenceError';
  }
}

const getAnonymousVisitorId = (): string => {
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const visitorId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
};

const ensureAuthenticatedUserId = async (): Promise<string> => {
  const supabase = getSupabaseClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new AssessmentPersistenceError('無法讀取匿名測驗 session。', sessionError);
  }

  if (sessionData.session?.user.id) {
    return sessionData.session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new AssessmentPersistenceError(
      '無法建立匿名測驗 session。請確認 Supabase 已啟用 Anonymous Sign-Ins。',
      error,
    );
  }

  return data.user.id;
};

export const startAssessmentRun = async (
  runId: string,
  assessmentVersion: string,
  questionCount: number,
): Promise<string> => {
  try {
    const supabase = getSupabaseClient();
    const userId = await ensureAuthenticatedUserId();
    const { data, error } = await supabase
      .from('assessment_runs')
      .insert({
        id: runId,
        user_id: userId,
        anonymous_visitor_id: getAnonymousVisitorId(),
        assessment_version: assessmentVersion,
        assessment_type: 'baseline',
        question_count: questionCount,
      })
      .select('id')
      .single();

    if (!error) {
      return data.id;
    }

    // The insert may have succeeded even if its response was lost. Reusing a
    // client-generated UUID lets a retry recover that run instead of creating
    // a second incomplete assessment.
    if (error.code === '23505') {
      const { data: existing, error: readError } = await supabase
        .from('assessment_runs')
        .select('id')
        .eq('id', runId)
        .single();

      if (!readError && existing) {
        return existing.id;
      }
    }

    throw error;
  } catch (error) {
    if (error instanceof AssessmentPersistenceError) throw error;
    throw new AssessmentPersistenceError('無法開始保存這次測驗。', error);
  }
};

const normalizeDimension = (
  category: string,
): AssessmentAnswer['dimension'] => {
  const dimension = category.split(' ')[0];
  if (
    dimension === 'FOCUS'
    || dimension === 'ANALYSIS'
    || dimension === 'CYCLE'
    || dimension === 'EXPOSURE'
  ) {
    return dimension;
  }

  throw new AssessmentPersistenceError(`未知的測驗維度：${category}`);
};

const serializeAnswers = (
  questions: Question[],
  answers: Record<string, 'A' | 'B'>,
  weightPerQuestion: number,
): AssessmentAnswer[] => {
  return questions.map((question) => {
    const selectedOption = answers[question.id];
    if (!selectedOption) {
      throw new AssessmentPersistenceError(`題目 ${question.id} 尚未作答。`);
    }

    return {
      question_code: question.id,
      selected_option: selectedOption,
      dimension: normalizeDimension(question.category),
      score_value: weightPerQuestion,
      answered_at: new Date().toISOString(),
    };
  });
};

export const completeAssessmentRun = async (
  runId: string,
  assessmentVersion: string,
  questions: Question[],
  answers: Record<string, 'A' | 'B'>,
  scores: FaceScores,
  weightPerQuestion: number,
): Promise<string> => {
  try {
    const supabase = getSupabaseClient();
    const serializedAnswers = serializeAnswers(questions, answers, weightPerQuestion);
    const { data, error } = await supabase.rpc('complete_assessment', {
      p_run_id: runId,
      p_face_code: getFaceCode(scores),
      p_scores: scores as unknown as Json,
      p_answers: serializedAnswers as unknown as Json,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`測驗 ${assessmentVersion} 完成後未回傳 run id。`);
    }

    return data;
  } catch (error) {
    if (error instanceof AssessmentPersistenceError) throw error;
    throw new AssessmentPersistenceError('測驗答案尚未保存，請重試。', error);
  }
};
