export const dynamic = 'force-dynamic'

import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { getLessonBySlug, getLessonsByModule } from "@/lib/content"
import { MdxContent } from "@/components/mdx-content"
import { MarkCompleteButton, LESSON_BOTTOM_SENTINEL_ID } from "@/components/mark-complete-button"
import { NewsWidget } from "@/components/news-widget"
import { LessonTOC } from "@/components/lesson-toc"
import { ReadingProgress } from "@/components/reading-progress"
import { getUnlockedLevelIds } from "@/lib/actions/progress"
import { getCompletedLessons } from "@/lib/actions/lessons"
import { LEVELS, MODULES } from "@/content/curriculum-taxonomy"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>
}): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params
  const lesson = getLessonBySlug(moduleSlug, lessonSlug)
  if (!lesson) return { title: "Lesson Not Found" }
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

  const lesson = getLessonBySlug(moduleSlug, lessonSlug)
  if (!lesson || lesson.locked) notFound()

  // Level 2+ access gate
  if (lesson.level > 1) {
    const levelMeta = LEVELS.find((l) => l.number === lesson.level)
    if (levelMeta) {
      const unlockedLevelIds = await getUnlockedLevelIds()
      if (!unlockedLevelIds.includes(levelMeta.uuid)) {
        const prevLevel = LEVELS.find((l) => l.number === lesson.level - 1)
        redirect(prevLevel ? `/levels/${prevLevel.slug}/quiz` : '/dashboard')
      }
    }
  }

  const moduleLessons = getLessonsByModule(moduleSlug)
  const currentIndex = moduleLessons.findIndex((l) => l.slugAsParams === lessonSlug)
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null

  const completedLessonUuids = await getCompletedLessons()

  // Sequential gate — prev lesson must be completed before accessing this one
  if (prevLesson && !completedLessonUuids.includes(prevLesson.uuid)) {
    redirect('/dashboard')
  }

  const isCompleted = completedLessonUuids.includes(lesson.uuid)
  const readingTime = Math.max(1, Math.ceil(lesson.wordCount / 200))

  // Cross-module next href: within module → next lesson; last in module → first
  // lesson of next module; last module in level → level test splash.
  let nextHref: string | undefined
  let nextTitle: string | undefined
  if (nextLesson) {
    nextHref = `/lessons/${moduleSlug}/${nextLesson.slugAsParams}`
    nextTitle = nextLesson.title
  } else {
    const levelModules = MODULES
      .filter((m) => m.levelNumber === lesson.level)
      .sort((a, b) => a.order - b.order)
    const currentModIndex = levelModules.findIndex((m) => m.slug === moduleSlug)
    const nextMod = currentModIndex >= 0 ? levelModules[currentModIndex + 1] : undefined
    if (nextMod) {
      const nextModLessons = getLessonsByModule(nextMod.slug)
      if (nextModLessons[0]) {
        nextHref = `/lessons/${nextMod.slug}/${nextModLessons[0].slugAsParams}`
        nextTitle = nextModLessons[0].title
      }
    } else {
      const levelMeta = LEVELS.find((l) => l.number === lesson.level)
      if (levelMeta) {
        nextHref = `/levels/${levelMeta.slug}/quiz`
        nextTitle = `Level ${levelMeta.number} Test`
      }
    }
  }

  return (
    <article>
      <ReadingProgress />

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <span>Lesson {currentIndex + 1} of {moduleLessons.length}</span>
        <span aria-hidden="true">·</span>
        <span>~{readingTime} min read</span>
      </div>

      <h1 className="text-3xl font-semibold text-foreground mb-6">{lesson.title}</h1>

      <LessonTOC headings={lesson.headings} />

      <div className="lesson-prose">
        <MdxContent code={lesson.body} withGlossary />
      </div>

      <Suspense fallback={null}>
        <NewsWidget topicTag={lesson.topic_tag} />
      </Suspense>

      {prevLesson && (
        <div className="mt-12 pt-8 border-t border-border">
          <Link href={`/lessons/${moduleSlug}/${prevLesson.slugAsParams}`}
            className="flex flex-col gap-0.5 group w-fit">
            <span className="text-xs text-muted-foreground/60">Previous</span>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">
              ← {prevLesson.title}
            </span>
          </Link>
        </div>
      )}

      {/* Scroll sentinel — IntersectionObserver in MarkCompleteButton watches this */}
      <div id={LESSON_BOTTOM_SENTINEL_ID} aria-hidden="true" />

      <div className="flex justify-end mt-8">
        <MarkCompleteButton lessonUuid={lesson.uuid} initialCompleted={isCompleted} nextHref={nextHref} nextTitle={nextTitle} readingTimeMinutes={readingTime} />
      </div>
    </article>
  )
}
