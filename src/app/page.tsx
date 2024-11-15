'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Languages } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router, supabase.auth])

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
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Unlock English,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              One Word at A Time
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            VocaLab is your interactive virtual lab for mastering English! 
            Designed for learners of all levels, VocaLab transforms language learning into an exciting journey of discovery.
          </p>
          <Link href="/signin" className="bg-black text-white px-6 py-3 rounded-full text-lg font-medium inline-flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
            </svg>
            <span>Try now</span>
          </Link>
          <p className="text-sm text-gray-500 mt-4">Access Anytime, Anywhere.</p>
        </section>

        <section className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">
                  Learn English anytime,
                  <br />
                  anywhere.
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Use VocaLab to build your English skills,
                  <br />
                  whether you&apos;re studying at home or on the go.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Word Scrambles', icon: '✨' },
                    { name: 'Sentence Structure', icon: '✖' },
                    { name: 'Vocabulary Builder', icon: '👥' },
                    { name: 'Synonym Selection', icon: '🎥' },
                    { name: 'Ad-Free Learning', icon: '🌐' }
                  ].map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                      <span>{tag.icon}</span>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-4">
                <div className="icon-container w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Word" width={40} height={40} />
                </div>
                <div className="icon-container w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Sentence" width={40} height={40} />
                </div>
                <div className="icon-container w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Vocab" width={40} height={40} />
                </div>
                <div className="icon-container w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Free" width={40} height={40} />
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="Word Jumble Challenge"
                description="Test your vocabulary and spelling skills with our interactive word scramble challenges."
                features={[
                  "Multiple difficulty levels",
                  "Real-time scoring",
                  "Progress tracking"
                ]}
              />
              <FeatureCard
                title="Guess The Tenses"
                description="Master English grammar through interactive tense identification exercises."
                features={[
                  "Comprehensive tense coverage",
                  "Contextual examples",
                  "Adaptive learning"
                ]}
              />
              <FeatureCard
                title="Grow Your Vocabulary"
                description="Expand your English vocabulary with our comprehensive learning tools."
                features={[
                  "Personalized word lists",
                  "Etymology insights",
                  "Spaced repetition system"
                ]}
              />
            </div>
          </section>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
}

function FeatureCard({ title, description, features}: FeatureCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl group">
      <Image
        src="https://media.istockphoto.com/id/1300822108/photo/group-of-unrecognisable-international-students-having-online-meeting.jpg?s=612x612&w=0&k=20&c=-X6IUTSdDMfJrFdQFhrDuwhnMrM1BLjfrLzydpibCTA="
        alt="Students in online meeting"
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:bg-opacity-75"></div>
      <div className="relative z-10 p-6 h-full flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white mb-4">{description}</p>
          <ul className="text-white space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        )
      </div>
    </div>
  )
}