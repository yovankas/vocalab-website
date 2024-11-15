'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAuthStateChange = async (event: any, session: any) => {
    if (event === 'SIGNED_IN' && session) {
      console.log('User signed in:', session)
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-full p-5">
            <div className="text-left font-bold">
              <span className="text-green-500">Voca</span>Lab
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                {mode === 'signin' ? 'Sign in to Account' : 'Create Account'}
              </h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="default"
                showLinks={false}
                providers={[]}
                redirectTo={`${window.location.origin}/auth/callback`}
                onAuthStateChange={handleAuthStateChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}