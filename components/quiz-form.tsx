"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { QuizQuestionPublic, QuizSubmitRequest, QuizSubmitResponse } from '@/lib/types/quiz'

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
const AUTO_SUBMIT_AT = 3

interface QuizFormProps {
  questions: QuizQuestionPublic[]
  levelId: string
  levelSlug: string
  attemptId: string
}

export function QuizForm({ questions, levelId, levelSlug, attemptId }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)

  // Refs so event handlers always see current values
  const answersRef = useRef(answers)
  const submittingRef = useRef(submitting)
  const tabSwitchesRef = useRef(tabSwitches)
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { submittingRef.current = submitting }, [submitting])
  useEffect(() => { tabSwitchesRef.current = tabSwitches }, [tabSwitches])

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length

  const doSubmit = useCallback(async (currentAnswers: Record<string, number>, switchCount: number) => {
    if (submittingRef.current) return
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const body: QuizSubmitRequest = {
        attempt_id: attemptId,
        level_id: levelId,
        tab_switches: switchCount,
        answers: Object.entries(currentAnswers).map(([question_id, selected_index]) => ({
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
  }, [attemptId, levelId, levelSlug])

  useEffect(() => {
    function recordSwitch() {
      const next = tabSwitchesRef.current + 1
      tabSwitchesRef.current = next
      setTabSwitches(next)
      setShowTabWarning(true)
      if (next >= AUTO_SUBMIT_AT) {
        doSubmit(answersRef.current, next)
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') recordSwitch()
    }

    // window blur only fires for window/app switches when the tab stays visible
    function handleWindowBlur() {
      if (document.visibilityState === 'visible') recordSwitch()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [doSubmit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allAnswered || submitting) return
    await doSubmit(answers, tabSwitches)
  }

  return (
    <>
      {showTabWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border border-destructive rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
            <p className="text-lg font-semibold text-destructive mb-2">Focus violation recorded</p>
            <p className="text-sm text-foreground/80 mb-4">
              Leaving the quiz window is not allowed. This has been logged.{' '}
              {AUTO_SUBMIT_AT - tabSwitches > 0
                ? `${AUTO_SUBMIT_AT - tabSwitches} more violation${AUTO_SUBMIT_AT - tabSwitches === 1 ? '' : 's'} will auto-submit your answers.`
                : 'Your quiz is being submitted now.'}
            </p>
            <button
              type="button"
              onClick={() => setShowTabWarning(false)}
              className="w-full rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    <form onSubmit={handleSubmit}>

      {questions.map((question, index) => {
        const selected = answers[question.id]
        return (
          <div key={question.id} className="bg-card border border-border rounded-lg p-6 mb-6">
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
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
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
    </>
  )
}
