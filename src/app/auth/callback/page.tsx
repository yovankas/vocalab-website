'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback initiated")
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/signin?error=auth_callback_error')
      } else if (data?.session) {
        console.log('Session established:', data.session)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('Error fetching user:', userError)
          router.push('/signin?error=user_fetch_error')
        } else if (user) {
          console.log('User fetched successfully:', user)
          router.push('/dashboard')
        } else {
          console.error('No user found')
          router.push('/signin?error=no_user')
        }
      } else {
        console.error('No session found')
        router.push('/signin?error=no_session')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return <div>Processing authentication...</div>
}