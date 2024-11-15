'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Languages, User } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useUserProgress } from '@/hooks/useUserProgress'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { progress, isLoading, fetchProgress } = useUserProgress()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchProgress()
      } else {
        router.push('/signin')
      }
    }
    checkUser()
  }, [router, supabase.auth, fetchProgress])

  const startLevel = (level: number) => {
    router.push(`/level${level}`)
  }

  const signOut = async () => {

    await supabase.auth.signOut()

    router.push('/')

  }
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <nav className="w-full max-w-7xl bg-white rounded-full px-6 py-2 flex items-center justify-between shadow-md">
          <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-semibold">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white">
              <Languages className="w-5 h-5" />
            </div>
            <span>VocaLab</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">Sign Out</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Welcome to
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"> VocaLab</span>
          </h1>

          <div className="mb-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Learning Journey</h2>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Overall Progress</span>
                <span>{progress?.progress ?? 0}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full" 
                  style={{ width: `${progress?.progress ?? 0}%` }}
                ></div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((level) => (
                <div key={level} className={`p-4 rounded-xl ${level <= (progress?.current_level ?? 1) ? 'bg-white shadow-md' : 'bg-gray-100'}`}>
                  <h3 className="font-semibold mb-2">Level {level}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {level === 1 ? 'Word Jumble Challenge' : 
                     level === 2 ? 'Sentence Structure Master' : 
                     'Vocabulary Challenge'}
                  </p>
                  {level <= (progress?.levels_completed ?? 0) ? (
                    <span className="text-green-500 font-medium">Completed</span>
                  ) : level === (progress?.current_level ?? 1) ? (
                    <button
                      onClick={() => startLevel(level)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Start Level
                    </button>
                  ) : (
                    <span className="text-gray-400">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Current Level" value={progress?.current_level ?? 1} />
              <StatCard title="Levels Completed" value={progress?.levels_completed ?? 0} />
              <StatCard title="Total Challenges" value="3" />
              <StatCard title="Overall Progress" value={`${progress?.progress ?? 0}%`} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">{value}</p>
    </div>
  )
}