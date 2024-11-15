'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Languages } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('Sign in successful')
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign in error:', error)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <nav className="w-full max-w-3xl bg-gray-100 rounded-full px-6 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-semibold">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white">
              <Languages className="w-5 h-5" />
            </div>
            <span>VocaLab</span>
          </Link>
          <div className="flex space-x-2">
            <Link href="/signin" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
              Sign in
            </Link>
            <Link href="/signup" className="bg-white text-black border border-black px-4 py-2 rounded-full text-sm font-medium">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Sign in to
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"> VocaLab</span>
          </h1>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}