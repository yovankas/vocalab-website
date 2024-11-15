import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase-client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthComponent() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)  // No comparison with setSession
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        // Compare the new session's access_token with the current session's
        if (newSession?.access_token !== session?.access_token) {
          setSession(newSession)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [session]) // Depend on the session so it updates properly

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
      />
    )
  }

  return (
    <div>
      <p>Logged in as {session?.user?.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  )
}
