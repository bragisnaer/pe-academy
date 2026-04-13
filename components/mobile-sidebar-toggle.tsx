"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { LessonSidebar } from "@/components/lesson-sidebar"

interface MobileSidebarToggleProps {
  currentModuleSlug?: string
  currentLessonSlug?: string
  completedLessonUuids?: string[]
}

export function MobileSidebarToggle({
  currentModuleSlug,
  currentLessonSlug,
  completedLessonUuids = [],
}: MobileSidebarToggleProps) {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="md:hidden flex items-center justify-center size-9 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        aria-label="Menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-72 bg-zinc-900 border-r border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span className="text-sm font-semibold text-white">Curriculum</span>
              <button
                type="button"
                className="flex items-center justify-center size-8 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <LessonSidebar
                currentModuleSlug={currentModuleSlug}
                currentLessonSlug={currentLessonSlug}
                completedLessonUuids={completedLessonUuids}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
