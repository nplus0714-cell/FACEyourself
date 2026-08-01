import { getSupabaseClient } from '../lib/supabase';
import type { FaceScores } from '../types';

export interface MemberAssessmentRecord {
  id: string;
  code: string;
  scores: FaceScores;
  completedAt: string;
}

const isFaceScores = (value: unknown): value is FaceScores => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'].every((key) => typeof candidate[key] === 'number');
};

/** Reads only the signed-in member's completed baseline assessments. RLS enforces ownership. */
export const getMemberAssessmentHistory = async (): Promise<MemberAssessmentRecord[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('assessment_runs')
    .select('id, face_code, scores, completed_at')
    .eq('assessment_type', 'baseline')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return (data ?? []).flatMap((row) => {
    if (!row.face_code || !row.completed_at || !isFaceScores(row.scores)) return [];
    return [{ id: row.id, code: row.face_code, scores: row.scores, completedAt: row.completed_at }];
  });
};
