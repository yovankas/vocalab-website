'use client'

import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthComponent() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return
  }
}
