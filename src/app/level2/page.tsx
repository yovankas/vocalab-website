'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Languages } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUserProgress } from '../../hooks/useUserProgress'

export default function Level2() {
  const [matches, setMatches] = useState<Array<{ sentence: string; tense: string; userTense?: string }>>([])
  const [tenses, setTenses] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [showNextLevel, setShowNextLevel] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { updateProgress } = useUserProgress()

  const level2Data = [
    { sentence: "I eat breakfast every morning", tense: "Present Simple" },
    { sentence: "She was watching TV when I called", tense: "Past Continuous" },
    { sentence: "They will have finished the project by next week", tense: "Future Perfect" }
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
      } else {
        startLevel()
      }
    }
    checkUser()
  }, [router, supabase.auth, startLevel])

  const startLevel = () => {
    setMatches(level2Data)
    const shuffledTenses = ["Present Simple", "Past Continuous", "Future Perfect"]
    shuffleArray(shuffledTenses)
    setTenses(shuffledTenses)
  }

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const onDragStart = (e: React.DragEvent, tense: string) => {
    e.dataTransfer.setData("text", tense)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.currentTarget.classList.contains('match-tense')) {
      e.currentTarget.classList.add('drag-over')
    }
  }

  const onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.classList.contains('match-tense')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const tense = e.dataTransfer.getData("text")
    setMatches(prev => prev.map((match, i) => 
      i === index ? { ...match, userTense: tense } : match
    ))
    setTenses(prev => prev.filter(t => t !== tense))
    if (e.currentTarget.classList.contains('match-tense')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const checkAnswer = async () => {
    const isCorrect = matches.every(match => match.tense === match.userTense)
    setResult(isCorrect ? "Correct! Great job!" : "Incorrect. Try again!")
    
    if (isCorrect) {
      await updateProgress(3, 66) // Move to level 3, 66% progress
      setShowNextLevel(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <nav className="w-full max-w-3xl bg-white rounded-full px-6 py-2 flex items-center justify-between shadow-md">
          <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-semibold">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white">
              <Languages className="w-5 h-5" />
            </div>
            <span>VocaLab</span>
          </Link>
        </nav>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Sentence Structure Master
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Match each sentence with its correct tense
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md">
                  <p className="text-left text-lg">{match.sentence}</p>
                  <div
                    className="match-tense bg-gray-100 px-6 py-3 rounded-xl min-w-[200px] h-[50px] flex items-center justify-center"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, index)}
                  >
                    {match.userTense || "Drop tense here"}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {tenses.map((tense, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, tense)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl cursor-move hover:shadow-lg transition-shadow"
                >
                  {tense}
                </div>
              ))}
            </div>

            <button
              onClick={checkAnswer}
              className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Check Answer
            </button>

            {result && (
              <div className={`text-lg font-medium ${result.includes("Correct") ? "text-green-500" : "text-red-500"}`}>
                {result}
              </div>
            )}

            {showNextLevel && (
              <Link
                href="/level3"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Next Level
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}