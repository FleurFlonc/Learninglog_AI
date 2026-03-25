export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Relationships: []
        Row: {
          id: string
          user_id: string
          user_display_name: string
          created_at: string
          updated_at: string
          task_description: string
          status: 'success' | 'partial' | 'failed'
          lesson_learned: string
          what_went_wrong: string | null
          resolution: string | null
          reflection_notes: string | null
          ai_tools: string[] | null
          task_type: string | null
          problem_category: string | null
          resolution_type: string | null
          duration_minutes: number | null
          prompt_goal: string | null
          system_prompt: string | null
          user_prompt: string | null
          prompt_output: string | null
          improved_prompt: string | null
          prompt_id: string | null
          is_favorite: boolean | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          user_display_name: string
          created_at?: string
          updated_at?: string
          task_description: string
          status: 'success' | 'partial' | 'failed'
          lesson_learned: string
          what_went_wrong?: string | null
          resolution?: string | null
          reflection_notes?: string | null
          ai_tools?: string[] | null
          task_type?: string | null
          problem_category?: string | null
          resolution_type?: string | null
          duration_minutes?: number | null
          prompt_goal?: string | null
          system_prompt?: string | null
          user_prompt?: string | null
          prompt_output?: string | null
          improved_prompt?: string | null
          prompt_id?: string | null
          is_favorite?: boolean | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          user_display_name?: string
          created_at?: string
          updated_at?: string
          task_description?: string
          status?: 'success' | 'partial' | 'failed'
          lesson_learned?: string
          what_went_wrong?: string | null
          resolution?: string | null
          reflection_notes?: string | null
          ai_tools?: string[] | null
          task_type?: string | null
          problem_category?: string | null
          resolution_type?: string | null
          duration_minutes?: number | null
          prompt_goal?: string | null
          system_prompt?: string | null
          user_prompt?: string | null
          prompt_output?: string | null
          improved_prompt?: string | null
          prompt_id?: string | null
          is_favorite?: boolean | null
          tags?: string[] | null
        }
      }
      prompts: {
        Relationships: [
          {
            foreignKeyName: "prompts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
        Row: {
          id: string
          user_id: string
          user_display_name: string
          created_at: string
          updated_at: string
          title: string
          ai_tools: string[]
          task_type: string | null
          goal_summary: string
          goal_full: string | null
          system_prompt_summary: string | null
          system_prompt_full: string | null
          user_prompt_summary: string
          user_prompt_full: string | null
          output_summary: string | null
          output_full: string | null
          prompt_rating: number | null
          session_id: string | null
          is_favorite: boolean | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          user_display_name: string
          created_at?: string
          updated_at?: string
          title: string
          ai_tools: string[]
          task_type?: string | null
          goal_summary: string
          goal_full?: string | null
          system_prompt_summary?: string | null
          system_prompt_full?: string | null
          user_prompt_summary: string
          user_prompt_full?: string | null
          output_summary?: string | null
          output_full?: string | null
          prompt_rating?: number | null
          session_id?: string | null
          is_favorite?: boolean | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          user_display_name?: string
          created_at?: string
          updated_at?: string
          title?: string
          ai_tools?: string[]
          task_type?: string | null
          goal_summary?: string
          goal_full?: string | null
          system_prompt_summary?: string | null
          system_prompt_full?: string | null
          user_prompt_summary?: string
          user_prompt_full?: string | null
          output_summary?: string | null
          output_full?: string | null
          prompt_rating?: number | null
          session_id?: string | null
          is_favorite?: boolean | null
          tags?: string[] | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
