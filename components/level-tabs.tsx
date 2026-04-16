"use client"

import { Lock } from "lucide-react"

interface LevelTabsProps {
  activeLevel?: number
  onLevelChange?: (level: number) => void
  unlockedLevelNumbers?: number[]
}

const TABS = [
  { level: 1, label: "Beginner" },
  { level: 2, label: "Intermediate" },
  { level: 3, label: "Expert" },
]

function getLockedTooltip(level: number): string {
  if (level === 2) return "Pass the Level 1 quiz to unlock Intermediate"
  if (level === 3) return "Complete Level 2 to unlock Expert"
  return "Complete previous levels to unlock"
}

export function LevelTabs({ activeLevel = 1, onLevelChange, unlockedLevelNumbers }: LevelTabsProps) {
  const unlockedSet = new Set(unlockedLevelNumbers ?? [1])

  return (
    <div className="flex items-center border-b border-border px-4">
      {TABS.map((tab) => {
        const isLocked = !unlockedSet.has(tab.level)
        const isActive = tab.level === activeLevel && !isLocked

        if (isLocked) {
          return (
            <button
              key={tab.level}
              type="button"
              className="flex h-10 items-center gap-1 px-3 text-sm font-normal text-muted-foreground cursor-not-allowed select-none"
              aria-disabled="true"
              tabIndex={-1}
              title={getLockedTooltip(tab.level)}
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
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
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
