import Link from "next/link"
import { Lock } from "lucide-react"
import { getLessonsByLevel } from "@/lib/content"
import { MODULES, LEVELS } from "@/content/curriculum-taxonomy"
import { LevelTabs } from "@/components/level-tabs"
import { LessonSidebarItem } from "@/components/lesson-sidebar-item"

interface LessonSidebarProps {
  completedLessonUuids?: string[]
  unlockedLevelIds?: string[]
}

export function LessonSidebar({
  completedLessonUuids = [],
  unlockedLevelIds = [],
}: LessonSidebarProps) {
  const level1Lessons = getLessonsByLevel(1)

  // Convert UUID array to level number array for LevelTabs.
  // Always include Level 1 (seeded by signup trigger — may not appear in
  // user_progress for legacy accounts).
  const unlockedLevelNumbers = [
    1, // always unlocked
    ...LEVELS
      .filter((l) => l.number > 1 && unlockedLevelIds.includes(l.uuid))
      .map((l) => l.number),
  ]

  // Group Level 1 lessons by module
  const lessonsByModule = level1Lessons.reduce<Record<string, typeof level1Lessons>>(
    (acc, lesson) => {
      if (!acc[lesson.module]) acc[lesson.module] = []
      acc[lesson.module].push(lesson)
      return acc
    },
    {}
  )

  // Level 1 modules (unlocked)
  const level1Modules = MODULES.filter((m) => m.levelNumber === 1)

  // Locked placeholder modules (Level 2, Level 3)
  const lockedModules = MODULES.filter((m) => m.locked)

  return (
    <nav className="flex flex-col h-full" aria-label="Curriculum navigation">
      <LevelTabs activeLevel={1} unlockedLevelNumbers={unlockedLevelNumbers} />

      <div className="flex-1 overflow-y-auto py-2">
        {/* Level 1 modules */}
        {level1Modules.map((mod) => {
          const lessons = (lessonsByModule[mod.slug] ?? []).sort(
            (a, b) => a.order - b.order
          )

          return (
            <div key={mod.slug} className="mb-4">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {mod.title}
              </div>
              {lessons.map((lesson) => {
                const lessonSlug = lesson.slugAsParams
                const isCompleted = completedLessonUuids.includes(lesson.uuid)

                return (
                  <LessonSidebarItem
                    key={lesson.uuid}
                    title={lesson.title}
                    href={`/lessons/${lesson.module}/${lessonSlug}`}
                    isCompleted={isCompleted}
                    isLocked={false}
                  />
                )
              })}
            </div>
          )
        })}

        {/* Quiz CTA — shown below Level 1 lessons */}
        <div className="px-4 pb-4 pt-2 border-t border-border mt-2">
          <Link
            href="/levels/foundations/quiz"
            className="flex items-center justify-center gap-2 w-full rounded-md bg-card hover:bg-card/80 text-foreground text-sm font-medium px-4 py-2.5 transition-colors"
          >
            Take Level 1 Quiz
          </Link>
          <p className="text-xs text-muted-foreground/70 text-center mt-1.5">Pass to unlock Level 2</p>
        </div>

        {/* News link — sidebar footer */}
        <div className="px-4 pb-2 pt-2">
          <Link
            href="/news"
            className="flex items-center justify-center gap-2 w-full rounded-md text-muted-foreground hover:text-foreground hover:bg-card text-sm font-medium px-4 py-2 transition-colors"
          >
            PE News &rarr;
          </Link>
        </div>

        {/* Interview Prep link — sidebar footer */}
        <div className="px-4 pb-2">
          <Link
            href="/interview-prep"
            className="flex items-center justify-center gap-2 w-full rounded-md text-muted-foreground hover:text-foreground hover:bg-card text-sm font-medium px-4 py-2 transition-colors"
          >
            Interview Prep &rarr;
          </Link>
        </div>

        {/* Resources link — sidebar footer */}
        <div className="px-4 pb-4">
          <Link
            href="/resources"
            className="flex items-center justify-center gap-2 w-full rounded-md text-muted-foreground hover:text-foreground hover:bg-card text-sm font-medium px-4 py-2 transition-colors"
          >
            Resources &rarr;
          </Link>
        </div>

        {/* Pro modules — clickable title, no inline lesson list */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Pro Modules
          </p>
        </div>
        {lockedModules.map((mod) => (
          <Link
            key={mod.slug}
            href={`/lessons/${mod.slug}`}
            className="flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-card/30 transition-colors"
          >
            <span>{mod.title}</span>
            <Lock className="size-3 shrink-0 text-muted-foreground/40" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </nav>
  )
}
