"use client"

import Link from "next/link"
import { CheckCircle2, Lock } from "lucide-react"

interface LessonSidebarItemProps {
  title: string
  href: string
  isActive?: boolean
  isCompleted?: boolean
  isLocked?: boolean
}

export function LessonSidebarItem({
  title,
  href,
  isActive = false,
  isCompleted = false,
  isLocked = false,
}: LessonSidebarItemProps) {
  if (isLocked) {
    return (
      <div
        className="flex min-h-[44px] items-center justify-between px-4 py-2 text-sm text-zinc-600 cursor-not-allowed select-none"
        aria-disabled="true"
        role="presentation"
      >
        <span>{title}</span>
        <Lock className="size-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`flex min-h-[44px] items-center justify-between px-4 py-2 text-sm transition-colors ${
        isActive
          ? "bg-zinc-800 text-white border-l-2 border-white"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
      }`}
    >
      <span>{title}</span>
      {isCompleted && (
        <CheckCircle2
          className="size-4 shrink-0 text-emerald-500"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
