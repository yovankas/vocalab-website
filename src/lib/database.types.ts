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
      user_progress: {
        Row: {
          id: number
          user_id: string
          current_level: number
          progress: number
          levels_completed: number
        }
        Insert: {
          id: number
          user_id: string
          current_level?: number
          progress?: number
          levels_completed?: number
        }
        Update: {
          id: number
          user_id?: string
          current_level?: number
          progress?: number
          levels_completed?: number
        }
      }
    }
  }
}