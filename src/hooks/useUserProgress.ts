import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchProgress()
  }, [])

  async function fetchProgress() {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // No data found
          // Initialize progress if it doesn't exist
          const initialProgress: Omit<UserProgress, 'id'> = {
            user_id: user.id,
            current_level: 1,
            progress: 0,
            levels_completed: 0
          }

          const { data: newProgress, error: insertError } = await supabase
            .from('user_progress')
            .insert(initialProgress)
            .select()
            .single()

          if (insertError) {
            throw insertError
          }

          setProgress(newProgress)
        } else {
          throw fetchError
        }
      } else if (data) {
        setProgress(data)
      }
    } catch (err) {
      console.error('Error in fetchProgress:', err)
      setError('Failed to fetch or initialize progress')
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProgress(level: number, progressPercent: number) {
    try {
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('No authenticated user')
        return
      }

      if (!progress) {
        throw new Error('No existing progress to update')
      }

      const updatedProgress: Partial<UserProgress> = {
        current_level: level,
        progress: progressPercent,
        levels_completed: progressPercent === 0
            ? 0
            : progressPercent === 33
            ? 1
            : progressPercent === 66
            ? 2
            : progressPercent === 100
            ? 3
            : 0 // Default fallback jika nilai progressPercent tidak sesuai
    };
    

      const { data, error } = await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('id', progress.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProgress(data)
      }

      // Fetch fresh data after update to ensure consistency
      await fetchProgress()
    } catch (err) {
      console.error('Error in updateProgress:', err)
      setError('Failed to update progress')
    }
  }

  return { 
    progress, 
    isLoading, 
    error, 
    updateProgress, 
    fetchProgress 
  }
}