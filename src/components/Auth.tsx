import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase-client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthComponent() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Fetch session on component mount
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)  // Set the session state
    }

    fetchSession()

    // Listen for changes in authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession)  // Update session on state change
      }
    )

    return () => {
      subscription.unsubscribe()  // Cleanup subscription
    }
  }, []) // Only run once when the component is mounted

  // Render Auth component if no session is found
  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
      />
    )
  }

  // Render dashboard if session exists
  return (
    <div>
      <p>Logged in as {session.user?.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  )
}
