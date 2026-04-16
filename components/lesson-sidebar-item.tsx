"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle2, Lock } from "lucide-react"

interface LessonSidebarItemProps {
  title: string
  href: string
  isCompleted?: boolean
  isLocked?: boolean
}

export function LessonSidebarItem({
  title,
  href,
  isCompleted = false,
  isLocked = false,
}: LessonSidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (isLocked) {
    return (
      <div
        className="flex min-h-[44px] items-center justify-between px-4 py-2 text-sm text-muted-foreground cursor-not-allowed select-none"
        aria-disabled="true"
        role="presentation"
      >
        <span>{title}</span>
        <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`flex min-h-[44px] items-center justify-between px-4 py-2 text-sm transition-colors ${
        isActive
          ? "bg-card text-foreground border-l-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
      }`}
    >
      <span>{title}</span>
      {isCompleted && (
        <CheckCircle2
          className="size-4 shrink-0 text-success"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
