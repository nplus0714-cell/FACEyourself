export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assessment_runs: {
        Row: {
          id: string;
          user_id: string;
          anonymous_visitor_id: string;
          assessment_version: string;
          assessment_type: 'baseline' | 'daily';
          question_count: number;
          face_code: string | null;
          focus_score: number | null;
          analysis_score: number | null;
          cycle_score: number | null;
          exposure_score: number | null;
          scores: Json | null;
          started_at: string;
          completed_at: string | null;
          result_viewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          anonymous_visitor_id: string;
          assessment_version: string;
          assessment_type?: 'baseline' | 'daily';
          question_count: number;
          face_code?: string | null;
          focus_score?: number | null;
          analysis_score?: number | null;
          cycle_score?: number | null;
          exposure_score?: number | null;
          scores?: Json | null;
          started_at?: string;
          completed_at?: string | null;
          result_viewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          result_viewed_at?: string | null;
        };
        Relationships: [];
      };
      assessment_answers: {
        Row: {
          id: number;
          assessment_run_id: string;
          question_code: string;
          selected_option: 'A' | 'B' | 'very_agree' | 'somewhat_agree' | 'neutral' | 'somewhat_disagree' | 'very_disagree' | 'very_a' | 'somewhat_a' | 'balanced' | 'somewhat_b' | 'very_b' | 'not_applicable';
          dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
          score_value: number;
          answered_at: string;
        };
        Insert: {
          id?: number;
          assessment_run_id: string;
          question_code: string;
          selected_option: 'A' | 'B' | 'very_agree' | 'somewhat_agree' | 'neutral' | 'somewhat_disagree' | 'very_disagree' | 'very_a' | 'somewhat_a' | 'balanced' | 'somewhat_b' | 'very_b' | 'not_applicable';
          dimension: 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
          score_value: number;
          answered_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      member_profiles: {
        Row: {
          user_id: string;
          nickname: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          nickname: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      awareness_diary_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          content: string;
          state_code: 'steady' | 'watching' | 'chasing' | 'attached' | 'guarded' | 'resetting' | null;
          answers: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          content?: string;
          state_code?: 'steady' | 'watching' | 'chasing' | 'attached' | 'guarded' | 'resetting' | null;
          answers?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          state_code?: 'steady' | 'watching' | 'chasing' | 'attached' | 'guarded' | 'resetting' | null;
          answers?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_assessment: {
        Args: {
          p_run_id: string;
          p_face_code: string;
          p_scores: Json;
          p_answers: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
