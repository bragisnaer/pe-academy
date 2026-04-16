"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { LEVELS, MODULES } from "@/content/curriculum-taxonomy"
import { getLessonsByLevel } from "@/lib/content"

interface LessonSidebarProps {
  completedLessonUuids?: string[]
  unlockedLevelIds?: string[]
}

export function LessonSidebar({
  completedLessonUuids = [],
  unlockedLevelIds = [],
}: LessonSidebarProps) {
  const pathname = usePathname()

  const unlockedLevelNumbers = new Set([
    1,
    ...LEVELS
      .filter((l) => l.number > 1 && unlockedLevelIds.includes(l.uuid))
      .map((l) => l.number),
  ])

  // Default: all unlocked levels open, first incomplete module per level open
  const [openLevels, setOpenLevels] = useState<Set<number>>(
    () => new Set([...unlockedLevelNumbers])
  )
  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const open = new Set<string>()
    for (const levelNum of unlockedLevelNumbers) {
      const levelLessons = getLessonsByLevel(levelNum)
      const levelModules = MODULES.filter((m) => m.levelNumber === levelNum)
      for (const mod of levelModules) {
        const modLessons = levelLessons.filter((l) => l.module === mod.slug)
        const allDone = modLessons.every((l) => completedLessonUuids.includes(l.uuid))
        if (!allDone) {
          open.add(mod.slug)
          break
        }
      }
    }
    return open
  })

  function toggleLevel(num: number) {
    setOpenLevels((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  function toggleModule(slug: string) {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <nav className="flex flex-col h-full" aria-label="Curriculum navigation">
      <div className="flex-1 overflow-y-auto py-2">
        {LEVELS.map((level) => {
          const isUnlocked = unlockedLevelNumbers.has(level.number)
          const isOpen = isUnlocked && openLevels.has(level.number)
          const levelLessons = getLessonsByLevel(level.number)
          const levelModules = MODULES.filter((m) => m.levelNumber === level.number)
          const completedInLevel = levelLessons.filter((l) =>
            completedLessonUuids.includes(l.uuid)
          ).length
          const allLessonsDone =
            levelLessons.length > 0 && completedInLevel === levelLessons.length

          // Quiz is passed if the next level is unlocked
          const nextLevel = LEVELS.find((l) => l.number === level.number + 1)
          const quizPassed = nextLevel
            ? unlockedLevelIds.includes(nextLevel.uuid) ||
              unlockedLevelNumbers.has(nextLevel.number)
            : false

          return (
            <div key={level.slug}>
              {/* Level header */}
              <button
                type="button"
                onClick={() => isUnlocked && toggleLevel(level.number)}
                disabled={!isUnlocked}
                className={cn(
                  "flex w-full items-start justify-between px-4 py-3 min-h-[44px] transition-colors text-left",
                  isUnlocked
                    ? "text-foreground hover:bg-card/50 cursor-pointer"
                    : "text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                <span className="flex items-start gap-2 text-sm font-semibold leading-snug">
                  {!isUnlocked && (
                    <Lock className="size-3 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  Level {level.number} — {level.name}
                </span>
                {isUnlocked && (
                  <span className="text-xs text-muted-foreground font-normal shrink-0 ml-3 mt-0.5">
                    {completedInLevel}/{levelLessons.length}
                  </span>
                )}
              </button>

              {/* Stepper */}
              {isOpen && (
                <div className="relative pb-2">
                  {/* Vertical line — behind dots, spans full stepper height */}
                  <div
                    className="absolute top-3 bottom-3 w-[2px] bg-muted-foreground/50"
                    style={{ left: "1.625rem", transform: "translateX(-50%)" }}
                    aria-hidden="true"
                  />

                  {levelModules.map((mod, modIndex) => {
                    const modLessons = levelLessons
                      .filter((l) => l.module === mod.slug)
                      .sort((a, b) => a.order - b.order)

                    const isAccessible =
                      modIndex === 0 ||
                      (() => {
                        const prev = levelModules[modIndex - 1]
                        const prevLessons = levelLessons.filter(
                          (l) => l.module === prev.slug
                        )
                        return prevLessons.every((l) =>
                          completedLessonUuids.includes(l.uuid)
                        )
                      })()

                    const allModDone = modLessons.every((l) =>
                      completedLessonUuids.includes(l.uuid)
                    )
                    const isModOpen = isAccessible && openModules.has(mod.slug)

                    const firstIncompleteIndex = modLessons.findIndex(
                      (l) => !completedLessonUuids.includes(l.uuid)
                    )

                    const dotCn = allModDone
                      ? "size-2 rounded-full bg-foreground"
                      : isAccessible
                        ? "size-2 rounded-full border-2 border-foreground bg-background"
                        : "size-2 rounded-full bg-muted-foreground/25"

                    return (
                      <div key={mod.slug}>
                        {/* Module row — subtle bg to distinguish from lesson rows */}
                        {isAccessible ? (
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.slug)}
                            className="relative z-10 flex w-full items-center gap-3 px-4 py-2.5 min-h-[44px] bg-muted/20 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                          >
                            <div className="w-5 shrink-0 flex justify-center">
                              <div className={dotCn} />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider leading-snug">
                              {mod.title}
                            </span>
                          </button>
                        ) : (
                          <div className="relative z-10 flex w-full items-center gap-3 px-4 py-2.5 min-h-[44px] bg-muted/20 cursor-not-allowed select-none">
                            <div className="w-5 shrink-0 flex justify-center">
                              <div className={dotCn} />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-wider leading-snug">
                              {mod.title}
                            </span>
                          </div>
                        )}

                        {/* Lessons */}
                        {isModOpen && (
                          <div className="pl-8 pr-4">
                            {modLessons.map((lesson, index) => {
                              const isCompleted = completedLessonUuids.includes(lesson.uuid)
                              const isLocked =
                                firstIncompleteIndex !== -1 &&
                                index > firstIncompleteIndex
                              const href = `/lessons/${lesson.module}/${lesson.slugAsParams}`
                              const isActive = pathname === href

                              const lessonDotCn = isCompleted
                                ? "size-2 rounded-full bg-foreground"
                                : isLocked
                                  ? "size-2 rounded-full bg-muted-foreground/25"
                                  : "size-2 rounded-full border-2 border-foreground bg-background"

                              const rowBase = "flex items-center gap-3 py-2.5 min-h-[44px] border-b border-border/30 last:border-0"

                              if (isLocked) {
                                return (
                                  <div
                                    key={lesson.uuid}
                                    className={cn(rowBase, "cursor-not-allowed select-none")}
                                    aria-disabled="true"
                                  >
                                    <div className="w-5 shrink-0 flex justify-center">
                                      <div className={lessonDotCn} />
                                    </div>
                                    <span className="text-sm leading-snug text-muted-foreground/40">
                                      {lesson.title}
                                    </span>
                                  </div>
                                )
                              }

                              return (
                                <Link
                                  key={lesson.uuid}
                                  href={href}
                                  className={cn(
                                    rowBase,
                                    "cursor-pointer transition-colors",
                                    isActive
                                      ? "bg-muted/30 text-foreground"
                                      : isCompleted
                                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                        : "text-foreground hover:bg-muted/70"
                                  )}
                                >
                                  <div className="w-5 shrink-0 flex justify-center">
                                    <div className={lessonDotCn} />
                                  </div>
                                  <span className={cn("text-sm leading-snug", isActive && "font-medium")}>
                                    {lesson.title}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Level Test node */}
                  <div className="relative z-10">
                    {allLessonsDone ? (
                      <Link
                        href={`/levels/${level.slug}/quiz`}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 min-h-[44px] bg-muted/20 hover:bg-muted/70 transition-colors cursor-pointer",
                          pathname === `/levels/${level.slug}/quiz`
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="w-5 shrink-0 flex justify-center">
                          <div
                            className={
                              quizPassed
                                ? "size-2 rounded-full bg-foreground"
                                : "size-2 rounded-full border-2 border-foreground bg-background"
                            }
                          />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider leading-snug">
                          Level {level.number} Test
                        </span>
                      </Link>
                    ) : (
                      <div className="flex w-full items-center gap-3 px-4 py-2.5 min-h-[44px] bg-muted/20 cursor-not-allowed select-none">
                        <div className="w-5 shrink-0 flex justify-center">
                          <div className="size-2 rounded-full bg-muted-foreground/25" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-wider leading-snug">
                          Level {level.number} Test
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
