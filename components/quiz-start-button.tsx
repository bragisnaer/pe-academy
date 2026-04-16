"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { QuizStartResponse } from '@/lib/types/quiz'

interface QuizStartButtonProps {
  levelId: string
  levelSlug: string
}

export function QuizStartButton({ levelId, levelSlug }: QuizStartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleStart() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level_id: levelId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError((err as { error?: string }).error ?? 'Failed to start test.')
        setLoading(false)
        return
      }
      const data: QuizStartResponse = await res.json()
      router.push(`/levels/${levelSlug}/quiz/attempt?id=${data.attempt_id}`)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? 'Starting…' : 'Start Test →'}
      </button>
    </div>
  )
}
