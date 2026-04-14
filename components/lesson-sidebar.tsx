import Link from "next/link"
import { getLessonsByLevel } from "@/lib/content"
import { MODULES, LEVELS } from "@/content/curriculum-taxonomy"
import { LevelTabs } from "@/components/level-tabs"
import { LessonSidebarItem } from "@/components/lesson-sidebar-item"

interface LessonSidebarProps {
  currentModuleSlug?: string
  currentLessonSlug?: string
  completedLessonUuids?: string[]
  unlockedLevelIds?: string[]
}

export function LessonSidebar({
  currentModuleSlug,
  currentLessonSlug,
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
              <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {mod.title}
              </div>
              {lessons.map((lesson) => {
                const lessonSlug = lesson.slugAsParams
                const isActive =
                  lesson.module === currentModuleSlug &&
                  lessonSlug === currentLessonSlug
                const isCompleted = completedLessonUuids.includes(lesson.uuid)

                return (
                  <LessonSidebarItem
                    key={lesson.uuid}
                    title={lesson.title}
                    href={`/lessons/${lesson.module}/${lessonSlug}`}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isLocked={false}
                  />
                )
              })}
            </div>
          )
        })}

        {/* Quiz CTA — shown below Level 1 lessons */}
        <div className="px-4 pb-4 pt-2 border-t border-white/10 mt-2">
          <Link
            href="/levels/beginner/quiz"
            className="flex items-center justify-center gap-2 w-full rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2.5 transition-colors"
          >
            Take Level 1 Quiz
          </Link>
          <p className="text-xs text-zinc-500 text-center mt-1.5">Pass to unlock Level 2</p>
        </div>

        {/* News link — sidebar footer */}
        <div className="px-4 pb-2 pt-2">
          <Link
            href="/news"
            className="flex items-center justify-center gap-2 w-full rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium px-4 py-2 transition-colors"
          >
            PE News &rarr;
          </Link>
        </div>

        {/* Interview Prep link — sidebar footer */}
        <div className="px-4 pb-2">
          <Link
            href="/interview-prep"
            className="flex items-center justify-center gap-2 w-full rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium px-4 py-2 transition-colors"
          >
            Interview Prep &rarr;
          </Link>
        </div>

        {/* Resources link — sidebar footer */}
        <div className="px-4 pb-4">
          <Link
            href="/resources"
            className="flex items-center justify-center gap-2 w-full rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium px-4 py-2 transition-colors"
          >
            Resources &rarr;
          </Link>
        </div>

        {/* Locked placeholder modules */}
        {lockedModules.map((mod) => (
          <div key={mod.slug} className="mb-4">
            <div className="px-4 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              {mod.title}
            </div>
            {mod.lessons.map((lesson) => (
              <LessonSidebarItem
                key={lesson.uuid}
                title={lesson.title}
                href="#"
                isLocked={true}
              />
            ))}
          </div>
        ))}
      </div>
    </nav>
  )
}
