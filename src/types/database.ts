export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          location_city: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          location_city?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          location_city?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      plants: {
        Row: {
          id: string;
          user_id: string;
          nickname: string | null;
          species: string | null;
          approximate_age: number | null;
          history_note: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname?: string | null;
          species?: string | null;
          approximate_age?: number | null;
          history_note?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string | null;
          species?: string | null;
          approximate_age?: number | null;
          history_note?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      checkins: {
        Row: {
          id: string;
          plant_id: string;
          user_id: string;
          photo_urls: string[];
          user_note: string | null;
          weather_snapshot: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plant_id: string;
          user_id: string;
          photo_urls?: string[];
          user_note?: string | null;
          weather_snapshot?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          user_id?: string;
          photo_urls?: string[];
          user_note?: string | null;
          weather_snapshot?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      analysis_results: {
        Row: {
          id: string;
          checkin_id: string;
          plant_id: string;
          health_score: number;
          health_trend: string;
          insights: Json;
          recommendations: Json;
          prediction: Json | null;
          urgency_score: number;
          changes_summary: string | null;
          weather_impact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          checkin_id: string;
          plant_id: string;
          health_score: number;
          health_trend: string;
          insights?: Json;
          recommendations?: Json;
          prediction?: Json | null;
          urgency_score: number;
          changes_summary?: string | null;
          weather_impact?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          checkin_id?: string;
          plant_id?: string;
          health_score?: number;
          health_trend?: string;
          insights?: Json;
          recommendations?: Json;
          prediction?: Json | null;
          urgency_score?: number;
          changes_summary?: string | null;
          weather_impact?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      interventions: {
        Row: {
          id: string;
          plant_id: string;
          type: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plant_id: string;
          type: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          type?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
