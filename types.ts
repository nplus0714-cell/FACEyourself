
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

export interface AssessmentAnswer {
  question_code: string;
  selected_option: 'A' | 'B';
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
  imageUrl: string;
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
