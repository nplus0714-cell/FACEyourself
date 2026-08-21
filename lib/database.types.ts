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
          face_code: string | null;
          assessment_version: string | null;
          result: Json | null;
          completed_at: string | null;
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
          face_code?: string | null;
          assessment_version?: string | null;
          result?: Json | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          state_code?: 'steady' | 'watching' | 'chasing' | 'attached' | 'guarded' | 'resetting' | null;
          answers?: Json | null;
          face_code?: string | null;
          assessment_version?: string | null;
          result?: Json | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      member_entitlements: {
        Row: {
          id: string;
          user_id: string;
          product_code: string;
          status: 'active' | 'revoked' | 'expired';
          payment_order_id: string | null;
          starts_at: string;
          expires_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_code: string;
          status?: 'active' | 'revoked' | 'expired';
          payment_order_id?: string | null;
          starts_at?: string;
          expires_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'active' | 'revoked' | 'expired';
          expires_at?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      member_activity_events: {
        Row: {
          id: number;
          user_id: string;
          event_type: 'signed_in' | 'signed_out' | 'session_restored';
          occurred_at: string;
          metadata: Json;
        };
        Insert: {
          id?: number;
          user_id: string;
          event_type: 'signed_in' | 'signed_out' | 'session_restored';
          occurred_at?: string;
          metadata?: Json;
        };
        Update: never;
        Relationships: [];
      };
      content_reading_progress: {
        Row: {
          id: string;
          content_id: string;
          content_slug: string;
          access_mode: 'public' | 'login_required' | 'paid';
          user_id: string | null;
          anonymous_visitor_id: string | null;
          view_count: number;
          max_progress: number;
          first_viewed_at: string;
          last_viewed_at: string;
          completed_at: string | null;
          metadata: Json;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      early_access_waitlist: {
        Row: {
          id: string;
          email: string;
          nickname: string | null;
          interest: 'full_system' | 'survival_guide' | 'daily_journal' | 'trading_tools' | 'unsure' | null;
          source: string;
          status: 'subscribed' | 'unsubscribed';
          marketing_consent: boolean;
          consent_version: string;
          marketing_consented_at: string;
          unsubscribed_at: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
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
      join_early_access_waitlist: {
        Args: {
          p_email: string;
          p_nickname?: string | null;
          p_interest?: string | null;
          p_source?: string;
          p_marketing_consent?: boolean;
          p_consent_version?: string;
          p_website?: string | null;
        };
        Returns: { ok: boolean; status: string };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
