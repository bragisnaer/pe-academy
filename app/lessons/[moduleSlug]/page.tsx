import { notFound } from "next/navigation"
import Link from "next/link"
import { Lock, CheckCircle2, BookOpen } from "lucide-react"
import type { Metadata } from "next"
import { MODULES, LEVELS } from "@/content/curriculum-taxonomy"
import { getLessonsByModule } from "@/lib/content"
import { getUnlockedLevelIds } from "@/lib/actions/progress"
import { getCompletedLessons } from "@/lib/actions/lessons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  return MODULES.map((mod) => ({ moduleSlug: mod.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string }>
}): Promise<Metadata> {
  const { moduleSlug } = await params
  const mod = MODULES.find((m) => m.slug === moduleSlug)
  if (!mod) return { title: "Module Not Found" }
  return {
    title: `${mod.title} | PE Academy`,
    description: mod.description,
  }
}

export default async function ModuleOverviewPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>
}) {
  const { moduleSlug } = await params
  const mod = MODULES.find((m) => m.slug === moduleSlug)
  if (!mod) notFound()

  const levelMeta = LEVELS.find((l) => l.number === mod.levelNumber)

  // Determine if this module is accessible to the current user
  const isFreeModule = mod.levelNumber === 1
  let isUnlocked = isFreeModule

  const [unlockedLevelIds, completedLessonUuids] = await Promise.all([
    getUnlockedLevelIds(),
    getCompletedLessons(),
  ])

  if (!isFreeModule && levelMeta) {
    isUnlocked = unlockedLevelIds.includes(levelMeta.uuid)
  }

  // Get file-system lessons only for unlocked modules
  const fsLessons = isUnlocked ? getLessonsByModule(moduleSlug) : []
  const sortedFsLessons = fsLessons.sort((a, b) => a.order - b.order)
  const completedInModule = sortedFsLessons.filter((l) =>
    completedLessonUuids.includes(l.uuid)
  ).length

  const tierLabel = isFreeModule ? "Free" : "Pro"
  const tierClass = isFreeModule
    ? "bg-success/10 text-success border border-success/20"
    : "bg-primary/10 text-primary border border-primary/20"

  return (
    <article>
      {/* Module header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", tierClass)}>
            {tierLabel}
          </span>
          {levelMeta && (
            <span className="text-xs text-muted-foreground">
              Level {mod.levelNumber} — {levelMeta.name}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold text-foreground">{mod.title}</h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {mod.description}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <BookOpen className="inline size-3.5 mr-1 -mt-0.5" />
          {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
        </p>

        {/* Progress bar — only shown for unlocked modules with lessons */}
        {isUnlocked && sortedFsLessons.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                {completedInModule} of {sortedFsLessons.length} complete
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round((completedInModule / sortedFsLessons.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(completedInModule / sortedFsLessons.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={completedInModule}
                aria-valuemin={0}
                aria-valuemax={sortedFsLessons.length}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson list */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Lessons</h2>
        </div>

        {isUnlocked ? (
          // Unlocked: show full lesson list with links
          <ul className="divide-y divide-border">
            {sortedFsLessons.map((lesson) => {
              const isCompleted = completedLessonUuids.includes(lesson.uuid)
              return (
                <li key={lesson.uuid}>
                  <Link
                    href={`/lessons/${moduleSlug}/${lesson.slugAsParams}`}
                    className="flex items-center justify-between px-4 py-3.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors group"
                  >
                    <span className="group-hover:text-foreground transition-colors">
                      {lesson.title}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          // Locked: show titles only, grayed out
          <>
            <ul className="divide-y divide-border">
              {mod.lessons.map((lesson) => (
                <li
                  key={lesson.uuid}
                  className="flex items-center justify-between px-4 py-3.5 text-sm text-muted-foreground/50 select-none"
                  aria-hidden="true"
                >
                  <span>{lesson.title}</span>
                  <Lock className="size-3.5 shrink-0 text-muted-foreground/40" />
                </li>
              ))}
            </ul>

            {/* Upgrade CTA */}
            <div className="px-4 py-5 bg-muted border-t border-border text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                This module is included in Pro
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Unlock all {mod.lessons.length} lessons and {MODULES.filter(m => m.locked).length} more modules for $29/month.
              </p>
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              >
                Upgrade to Pro
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  )
}
