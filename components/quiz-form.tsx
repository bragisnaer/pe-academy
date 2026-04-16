"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { QuizQuestionPublic, QuizSubmitRequest, QuizSubmitResponse } from '@/lib/types/quiz'

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

interface QuizFormProps {
  questions: QuizQuestionPublic[]
  levelId: string
  levelSlug: string
}

export function QuizForm({ questions, levelId, levelSlug }: QuizFormProps) {
  // answers: question_id → selected_index
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const allAnswered =
    questions.length > 0 && Object.keys(answers).length === questions.length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allAnswered || submitting) return

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const body: QuizSubmitRequest = {
        level_id: levelId,
        answers: Object.entries(answers).map(([question_id, selected_index]) => ({
          question_id,
          selected_index,
        })),
      }

      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorMessage((err as { error?: string }).error ?? 'Submission failed. Please try again.')
        setSubmitting(false)
        return
      }

      const data: QuizSubmitResponse = await res.json()
      window.location.href = `/levels/${levelSlug}/quiz/result?attempt_id=${data.attempt_id}`
    } catch {
      setErrorMessage('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => {
        const selected = answers[question.id]

        return (
          <div
            key={question.id}
            className="bg-card border border-border rounded-lg p-6 mb-6"
          >
            <p className="text-foreground font-medium mb-4">
              Q{index + 1}. {question.question}
            </p>

            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                    }
                    className={cn(
                      'rounded-md border px-4 py-3 text-sm text-left w-full transition-colors',
                      isSelected
                        ? 'bg-muted border-primary text-foreground'
                        : 'bg-card border-border text-foreground/80 hover:border-border'
                    )}
                  >
                    <span className="font-medium mr-2">{OPTION_LABELS[optionIndex]}.</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {errorMessage && (
        <p className="text-destructive text-sm mb-4">{errorMessage}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!allAnswered || submitting}
          className={cn(
            'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            (!allAnswered || submitting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </form>
  )
}
