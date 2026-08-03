
export type Language = 'zh' | 'en';

export interface FaceScores {
  A: number; P: number; R: number; I: number; L: number; T: number; C: number; D: number;
}

export interface Question {
  id: string;
  pair: string[];
  category: string;
  text: string;
  labels: string[];
}

export type FaceTrait = 'A' | 'P' | 'R' | 'I' | 'L' | 'T' | 'C' | 'D';

export type FaceDimension = 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';

export type FaceQuestionType = 'scenario' | 'image' | 'intuition' | 'agreement';

export interface FaceQuestionOption {
  id: 'a' | 'b';
  label: string;
  trait: FaceTrait;
}

export interface FaceImagePlaceholder {
  assetKey: string;
  alt: string;
  prompt: string;
}

export interface FaceCompositeImage {
  src: string;
  alt: string;
}

export interface FaceAgreementMapping {
  agreeTrait: FaceTrait;
  disagreeTrait: FaceTrait;
}

/**
 * The source of truth for a versioned FACE question.
 *
 * Unlike the legacy `Question` model, each answer declares the trait it
 * represents. That is required for reverse-scored agreement questions.
 */
export interface FaceQuestion {
  id: string;
  order: number;
  type: FaceQuestionType;
  dimension: FaceDimension;
  prompt: string;
  options?: [FaceQuestionOption, FaceQuestionOption];
  agreement?: FaceAgreementMapping;
  images?: [FaceImagePlaceholder, FaceImagePlaceholder];
  compositeImage?: FaceCompositeImage;
}

export interface AssessmentAnswer {
  question_code: string;
  selected_option: 'A' | 'B' | 'very_agree' | 'somewhat_agree' | 'neutral' | 'somewhat_disagree' | 'very_disagree';
  dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
  score_value: number;
  answered_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface PersonalityProfile {
  id: string;
  code: string;
  name: string;
  attributes: string;
  /** Legacy/default artwork. Keep this pointed at the full-colour landscape asset. */
  imageUrl: string;
  sketchImageUrl: string;
  landscapeImageUrl: string;
  portrait: string; // PDF 中的角色描述
  motto: string;    // PDF 中的座右銘
  psychology: {
    mechanism: string; // 核心心理機制
    scene: string;     // 交易心理場景
  };
  blindSpots: {
    title: string;
    description: string;
    behavior: string;
  }[];
  exercises: {
    title: string;
    technique: string;
    effect: string;
  }[];
  pouches: {
    safety: string;    // 保命（資金管理）
    mindset: string;   // 轉念（心理建設）
    behavior: string;  // 行為（行為制約）
  };
  antidote: string; // 解酒錠/靈魂祝福
}

export interface ReportContent {
  soulPortrait: { description: string; motto: string; };
  innerPain: string;
  blindSpot: string;
  zenSolution: string;
  antiHangover: { blessing: string; lifesaver: string; mindset: string; micro: string; };
}

export interface DiaryEntry {
  id: string; date: string; scores: FaceScores; marketScenario: string;
  report?: ReportContent; isBaseline?: boolean; userId?: string;
}

export interface UserState {
  user: AuthUser | null; dna: FaceScores | null; history: DiaryEntry[]; tempDaily: FaceScores | null;
}
