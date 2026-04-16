"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { markLessonComplete } from "@/lib/actions/lessons"

export const LESSON_BOTTOM_SENTINEL_ID = 'lesson-bottom-sentinel'
const COUNTDOWN_SECONDS = 30

export interface MarkCompleteButtonProps {
  lessonUuid: string
  initialCompleted: boolean
  nextHref?: string
}

export function MarkCompleteButton({ lessonUuid, initialCompleted, nextHref }: MarkCompleteButtonProps) {
  const router = useRouter()
  const [completed, setCompleted] = React.useState(initialCompleted)
  const [pending, setPending] = React.useState(false)
  const [secondsLeft, setSecondsLeft] = React.useState(COUNTDOWN_SECONDS)
  const [scrolled, setScrolled] = React.useState(false)
  const [timerClicks, setTimerClicks] = React.useState(0)

  const timerDone = secondsLeft === 0
  const unlocked = initialCompleted || (timerDone && scrolled)

  React.useEffect(() => {
    if (initialCompleted) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [initialCompleted])

  React.useEffect(() => {
    if (initialCompleted) return
    const sentinel = document.getElementById(LESSON_BOTTOM_SENTINEL_ID)
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setScrolled(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [initialCompleted])

  async function handleClick() {
    if (completed || pending || !unlocked) return
    setCompleted(true)
    setPending(true)
    const result = await markLessonComplete(lessonUuid)
    setPending(false)
    if (result?.error) {
      setCompleted(false)
    } else {
      router.refresh()
      if (nextHref) router.push(nextHref)
    }
  }

  if (completed) {
    return (
      <button type="button" disabled aria-label="Lesson completed"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground cursor-default disabled:pointer-events-none">
        <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
        Completed
      </button>
    )
  }

  if (!unlocked) {
    const hint = !timerDone
      ? `Available in ${secondsLeft}s`
      : 'Scroll to the end to continue'
    return (
      <button
        type="button"
        aria-label={hint}
        onClick={() => {
          const next = timerClicks + 1
          setTimerClicks(next)
          if (next >= 10) setSecondsLeft(0)
        }}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
        {hint}
      </button>
    )
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} aria-label="Mark lesson complete"
      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:pointer-events-none">
      {pending ? 'Saving…' : nextHref ? 'Complete & continue →' : 'Mark complete'}
    </button>
  )
}
