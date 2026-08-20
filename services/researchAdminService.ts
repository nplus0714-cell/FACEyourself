import { getSupabaseClient } from '../lib/supabase';

export type FaceScoreKey = 'A' | 'P' | 'R' | 'I' | 'L' | 'T' | 'C' | 'D';
export type ResearchReviewDecision = 'included' | 'excluded' | 'needs_review';
export type ResearchAnalysisStage = 'collecting' | 'preliminary' | 'screening' | 'stable';
export type ResearchQuestionStatus = 'collecting' | 'healthy' | 'watch' | 'review';

export type ResearchQuestionAnalysis = {
  code: string;
  dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
  type: 'binary' | 'bipolar';
  group: string | null;
  sampleSize: number;
  applicableCount: number;
  sideACount: number;
  middleCount: number;
  sideBCount: number;
  notApplicableCount: number;
  sideAPercentage: number;
  middlePercentage: number;
  sideBPercentage: number;
  notApplicablePercentage: number;
  meanAValue: number | null;
  discrimination: number | null;
  discriminationSampleSize: number;
  status: ResearchQuestionStatus;
  flags: string[];
};

export type ResearchDimensionAnalysis = {
  dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
  completeCaseCount: number;
  cronbachAlpha: number | null;
  calibrationCount: number;
  directionalCalibrationCount: number;
  directionalAgreementPercentage: number | null;
  meanCalibrationGap: number | null;
};

export type ResearchScenarioGroupAnalysis = {
  group: string;
  dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
  eligibleCount: number;
  sameDirectionCount: number;
  sameDirectionPercentage: number | null;
};

export type ResearchQuestionAnalysisData = {
  sampleSize: number;
  stage: ResearchAnalysisStage;
  minimumForItemReview: number;
  minimumForStableReview: number;
  questions: ResearchQuestionAnalysis[];
  dimensions: ResearchDimensionAnalysis[];
  scenarioGroups: ResearchScenarioGroupAnalysis[];
};

export type ResearchReview = {
  decision: ResearchReviewDecision;
  exclusionReason: string | null;
  notes: string | null;
  reviewedAt: string | null;
  reviewed: boolean;
};

export type ResearchSubmission = {
  id: string;
  participantId: string | null;
  submittedAt: string;
  receivedAt: string;
  resultReleasedAt: string | null;
  source: string;
  assessmentVersion: string;
  surveyRelease?: string | null;
  instrumentMode?: string | null;
  faceCode: string;
  scores: Record<FaceScoreKey, number>;
  answerCount: number;
  expectedAnswerCount: number;
  missingQuestionCount: number;
  notApplicableCount: number;
  insufficientData: boolean;
  email: string | null;
  emailMasked: string | null;
  emailUsable: boolean;
  consentResearch: boolean;
  consentResultEmail: boolean;
  consentMarketing: boolean;
  unsubscribed: boolean;
  researchReady: boolean;
  reviewDecision: ResearchReviewDecision;
  exclusionReason: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  reviewed: boolean;
  includedInAnalysis: boolean;
  duplicateCandidate: boolean;
  duplicateGroupSize: number;
  duplicateRank: number | null;
  canSendResult: boolean;
  canMarket: boolean;
  issues: string[];
  calibration: Record<string, string>;
  feedback: Record<string, string>;
  market: Record<string, unknown>;
  calibrationComplete: boolean;
};

export type ResearchAdminData = {
  generatedAt: string;
  currentAssessmentVersion: string;
  currentSurveyRelease: string;
  summary: {
    total: number;
    currentVersion: number;
    includedSamples: number;
    excludedSamples: number;
    needsSampleReview: number;
    duplicateCandidates: number;
    researchReady: number;
    needsReview: number;
    canSendResult: number;
    canMarket: number;
    byVersion: Record<string, number>;
  };
  questionAnalysis?: ResearchQuestionAnalysisData;
  submissions: ResearchSubmission[];
};

export const loadResearchAdminData = async (): Promise<ResearchAdminData> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke<ResearchAdminData>('research-admin', { method: 'GET' });
  if (error) throw error;
  if (!data) throw new Error('研究資料尚未回傳。');
  return data;
};

export const saveResearchReview = async (input: {
  submissionId: string;
  decision: ResearchReviewDecision;
  exclusionReason?: string;
  notes?: string;
}): Promise<ResearchReview> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke<{ review: ResearchReview }>('research-admin', {
    method: 'PATCH',
    body: input,
  });
  if (error) throw error;
  if (!data?.review) throw new Error('審查結果尚未回傳。');
  return data.review;
};
