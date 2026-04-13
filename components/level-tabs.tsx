"use client"

import { Lock } from "lucide-react"

interface LevelTabsProps {
  activeLevel?: number
  onLevelChange?: (level: number) => void
}

const TABS = [
  { level: 1, label: "Beginner", locked: false },
  { level: 2, label: "Intermediate", locked: true },
  { level: 3, label: "Expert", locked: true },
]

export function LevelTabs({ activeLevel = 1, onLevelChange }: LevelTabsProps) {
  return (
    <div className="flex items-center border-b border-white/10 px-4">
      {TABS.map((tab) => {
        const isActive = tab.level === activeLevel && !tab.locked

        if (tab.locked) {
          return (
            <button
              key={tab.level}
              type="button"
              className="flex h-10 items-center gap-1 px-3 text-sm font-normal text-zinc-600 cursor-not-allowed select-none"
              aria-disabled="true"
              tabIndex={-1}
              title="Complete Beginner level to unlock"
            >
              <Lock className="size-3" aria-hidden="true" />
              {tab.label}
            </button>
          )
        }

        return (
          <button
            key={tab.level}
            type="button"
            className={`flex h-10 items-center px-3 text-sm font-normal transition-colors ${
              isActive
                ? "text-white border-b-2 border-white"
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => onLevelChange?.(tab.level)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
