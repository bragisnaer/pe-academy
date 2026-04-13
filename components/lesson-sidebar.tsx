import { getLessonsByLevel } from "@/lib/content"
import { MODULES } from "@/content/curriculum-taxonomy"
import { LevelTabs } from "@/components/level-tabs"
import { LessonSidebarItem } from "@/components/lesson-sidebar-item"

interface LessonSidebarProps {
  currentModuleSlug?: string
  currentLessonSlug?: string
  completedLessonUuids?: string[]
}

export function LessonSidebar({
  currentModuleSlug,
  currentLessonSlug,
  completedLessonUuids = [],
}: LessonSidebarProps) {
  const level1Lessons = getLessonsByLevel(1)

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
      <LevelTabs activeLevel={1} />

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
