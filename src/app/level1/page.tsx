'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Languages } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUserProgress } from '../../hooks/useUserProgress'

export default function Level1() {
  const [words, setWords] = useState<string[]>([])
  const [sentence, setSentence] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [showNextLevel, setShowNextLevel] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { updateProgress } = useUserProgress()

  const level1Data = {
    sentence: "The quick brown fox jumps over the lazy dog",
    words: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
  }

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
    const shuffledWords = [...level1Data.words]
    shuffleArray(shuffledWords)
    setWords(shuffledWords)
    setSentence([])
  }

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const onDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("text", word)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.currentTarget.classList.contains('drop-zone')) {
      e.currentTarget.classList.add('drag-over')
    }
  }

  const onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.classList.contains('drop-zone')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const onDrop = (e: React.DragEvent, target: 'words' | 'sentence') => {
    e.preventDefault()
    const word = e.dataTransfer.getData("text")
    if (target === 'words') {
      setSentence(prev => prev.filter(w => w !== word))
      setWords(prev => [...prev, word])
    } else {
      setWords(prev => prev.filter(w => w !== word))
      setSentence(prev => [...prev, word])
    }
    if (e.currentTarget.classList.contains('drop-zone')) {
      e.currentTarget.classList.remove('drag-over')
    }
  }

  const checkAnswer = async () => {
    const userSentence = sentence.join(" ")
    const isCorrect = userSentence === level1Data.sentence
    setResult(isCorrect ? "Correct! Great job!" : "Incorrect. Try again!")
    
    if (isCorrect) {
      await updateProgress(2, 33) // Move to level 2, 33% progress
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
            Word Jumble Challenge
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Arrange the words to form a complete sentence
          </p>

          <div className="space-y-8">
            <div 
              className="bg-white p-6 rounded-2xl min-h-[100px] flex flex-wrap gap-2 shadow-md"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, 'words')}
            >
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

            <div
              className="drop-zone bg-white p-6 rounded-2xl min-h-[100px] flex flex-wrap gap-2 shadow-md"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, 'sentence')}
            >
              {sentence.map((word, index) => (
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

            {showNextLevel && (
              <Link
                href="/level2"
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