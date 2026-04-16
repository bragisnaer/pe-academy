import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { getLessons, getLessonBySlug, getLessonsByModule } from "@/lib/content"
import { MdxContent } from "@/components/mdx-content"
import { MarkCompleteButton } from "@/components/mark-complete-button"
import { NewsWidget } from "@/components/news-widget"
import { LessonTOC } from "@/components/lesson-toc"
import { ReadingProgress } from "@/components/reading-progress"
import { getUnlockedLevelIds } from "@/lib/actions/progress"
import { LEVELS } from "@/content/curriculum-taxonomy"

// ISR: revalidate lesson pages every hour.
// Auth is enforced by middleware (lib/supabase/middleware.ts) which redirects
// unauthenticated requests from /lessons/* to / before the page is reached.
// NOTE: initialCompleted is always false here (ISR page cannot be per-user dynamic).
// Sidebar checkmarks come from the layout which calls getCompletedLessons() per request.
export const revalidate = 3600

export async function generateStaticParams() {
  const lessons = getLessons()
  return lessons
    .filter((lesson) => !lesson.locked)
    .map((lesson) => ({
      moduleSlug: lesson.module,
      lessonSlug: lesson.slugAsParams,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>
}): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params
  const lesson = getLessonBySlug(moduleSlug, lessonSlug)

  if (!lesson) {
    return { title: "Lesson Not Found" }
  }

  return {
    title: `${lesson.title} | PE Academy`,
    description: `Learn about ${lesson.title} in the PE Academy curriculum.`,
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>
}) {
  const { moduleSlug, lessonSlug } = await params

  // Look up the lesson from Velite data
  const lesson = getLessonBySlug(moduleSlug, lessonSlug)

  // Return 404 for missing or locked lessons
  if (!lesson || lesson.locked) {
    notFound()
  }

  // Runtime access control for Level 2+ lessons.
  // Level 1 lessons are always accessible (seeded by signup trigger).
  // For Level 2+, verify the user has unlocked that level via user_progress.
  if (lesson.level > 1) {
    const levelMeta = LEVELS.find((l) => l.number === lesson.level)
    if (levelMeta) {
      const unlockedLevelIds = await getUnlockedLevelIds()
      if (!unlockedLevelIds.includes(levelMeta.uuid)) {
        // Redirect to the quiz that gates this level (level N-1 quiz)
        const prevLevel = LEVELS.find((l) => l.number === lesson.level - 1)
        redirect(prevLevel ? `/levels/${prevLevel.slug}/quiz` : '/dashboard')
      }
    }
  }

  const moduleLessons = getLessonsByModule(moduleSlug)
  const currentIndex = moduleLessons.findIndex((l) => l.slugAsParams === lessonSlug)
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null
  const readingTime = Math.max(1, Math.ceil(lesson.wordCount / 200))

  return (
    <article>
      <ReadingProgress />

      {/* Meta row — position + reading time */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <span>Lesson {currentIndex + 1} of {moduleLessons.length}</span>
        <span aria-hidden="true">·</span>
        <span>~{readingTime} min read</span>
      </div>

      <h1 className="text-3xl font-semibold text-foreground mb-6">{lesson.title}</h1>

      {/* Table of contents with active-state tracking */}
      <LessonTOC headings={lesson.headings} />

      <div className="lesson-prose">
        <MdxContent code={lesson.body} withGlossary />
      </div>

      {/* Contextual news widget */}
      <Suspense fallback={null}>
        <NewsWidget topicTag={lesson.topic_tag} />
      </Suspense>

      {/* Prev / Next lesson navigation */}
      <nav
        aria-label="Lesson navigation"
        className="flex items-start justify-between gap-4 mt-12 pt-8 border-t border-border"
      >
        {prevLesson ? (
          <Link
            href={`/lessons/${moduleSlug}/${prevLesson.slugAsParams}`}
            className="flex flex-col gap-0.5 group max-w-[45%]"
          >
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              ← {prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/lessons/${moduleSlug}/${nextLesson.slugAsParams}`}
            className="flex flex-col gap-0.5 items-end text-right group max-w-[45%]"
          >
            <span className="text-xs text-muted-foreground">Next</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {nextLesson.title} →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {/* Mark complete — right-aligned on desktop, full-width on mobile */}
      <div className="flex justify-end mt-8">
        <MarkCompleteButton lessonUuid={lesson.uuid} initialCompleted={false} />
      </div>
    </article>
  )
}
