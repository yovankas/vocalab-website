'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Languages } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUserProgress } from '../../hooks/useUserProgress'

export default function Level3() {
  const [words, setWords] = useState<string[]>(["Ephemeral", "Ubiquitous", "Eloquent", "Enigmatic"])
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, null])
  const [result, setResult] = useState<string | null>(null)
  const [showFinish, setShowFinish] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { updateProgress } = useUserProgress()

  const definitions = [
    "Lasting for a very short time",
    "Present, appearing, or found everywhere",
    "Fluent or persuasive in speaking or writing",
    "Difficult to interpret or understand; mysterious"
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const onDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text", word)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.currentTarget.classList.contains('answer-slot')) {
      e.currentTarget.classList.add('drag-over')
    }
  }

  const onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.classList.contains('answer-slot')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const word = e.dataTransfer.getData("text")
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = word
      return newAnswers
    })
    setWords(prev => prev.filter(w => w !== word))
    if (e.currentTarget.classList.contains('answer-slot')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const checkAnswer = async () => {
    const correctOrder = ["Ephemeral", "Ubiquitous", "Eloquent", "Enigmatic"]
    const isCorrect = answers.every((answer, index) => answer === correctOrder[index])
    setResult(isCorrect ? "Correct! You've completed all levels!" : "Incorrect. Try again!")
    
    if (isCorrect) {
      await updateProgress(3, 100) // Complete all levels, 100% progress
      setShowFinish(true)
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
            Vocabulary Challenge
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Match each word with its correct definition
          </p>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {definitions.map((definition, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-md">
                    {definition}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="answer-slot bg-white p-4 rounded-xl h-[56px] flex items-center justify-center shadow-md"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, index)}
                  >
                    {answer || "Drop word here"}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {words.map((word, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, word)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl cursor-move hover:shadow-lg transition-shadow"
                >
                  {word}
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

            {showFinish && (
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Complete Game
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}