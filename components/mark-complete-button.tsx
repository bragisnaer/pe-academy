"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { markLessonComplete } from "@/lib/actions/lessons"

export interface MarkCompleteButtonProps {
  lessonUuid: string
  initialCompleted: boolean
}

/**
 * MarkCompleteButton — optimistic UI button for marking a lesson complete.
 *
 * Idle state: white fill button labelled "Mark complete".
 * Completed state: zinc-800 fill, emerald CheckCircle2 icon, "Completed" label, disabled.
 *
 * On click: immediately switches to completed state (optimistic), then calls
 * markLessonComplete server action. If the server action fails, reverts to idle.
 */
export function MarkCompleteButton({
  lessonUuid,
  initialCompleted,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = React.useState(initialCompleted)
  const [pending, setPending] = React.useState(false)

  async function handleClick() {
    if (completed || pending) return

    // Optimistic update — immediately show completed state
    setCompleted(true)
    setPending(true)

    const result = await markLessonComplete(lessonUuid)

    setPending(false)

    if (result?.error) {
      // Revert on error
      setCompleted(false)
    }
  }

  if (completed) {
    return (
      <button
        type="button"
        disabled
        aria-label="Lesson completed"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white cursor-default transition-colors duration-150 ease-in-out disabled:pointer-events-none"
      >
        <CheckCircle2
          className="size-4 text-emerald-500"
          aria-hidden="true"
        />
        Completed
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label="Mark lesson complete"
      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white/90 transition-colors duration-150 ease-in-out disabled:opacity-70 disabled:pointer-events-none"
    >
      Mark complete
    </button>
  )
}
