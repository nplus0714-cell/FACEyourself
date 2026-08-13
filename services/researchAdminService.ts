import { getSupabaseClient } from '../lib/supabase';

export type ResearchSubmission = {
  id: string;
  submittedAt: string;
  assessmentVersion: string;
  faceCode: string;
  scores: Record<'A' | 'P' | 'R' | 'I' | 'L' | 'T' | 'C' | 'D', number>;
  answerCount: number;
  missingQuestionCount: number;
  notApplicableCount: number;
  insufficientData: boolean;
  emailMasked: string | null;
  emailUsable: boolean;
  consentResultEmail: boolean;
  consentMarketing: boolean;
  unsubscribed: boolean;
  researchReady: boolean;
  canSendResult: boolean;
  canMarket: boolean;
  issues: string[];
};

export type ResearchAdminData = {
  generatedAt: string;
  summary: { total: number; researchReady: number; needsReview: number; canSendResult: number; canMarket: number };
  submissions: ResearchSubmission[];
};

export const loadResearchAdminData = async (): Promise<ResearchAdminData> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke<ResearchAdminData>('research-admin', { method: 'GET' });
  if (error) throw error;
  if (!data) throw new Error('研究資料尚未回傳。');
  return data;
};
