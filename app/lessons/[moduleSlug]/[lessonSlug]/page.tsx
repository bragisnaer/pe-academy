import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getLessons, getLessonBySlug } from "@/lib/content"
import { MdxContent } from "@/components/mdx-content"
import { MarkCompleteButton } from "@/components/mark-complete-button"

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

  return (
    <article>
      <h1 className="text-3xl font-semibold text-white mb-8">{lesson.title}</h1>

      <div
        className={[
          "text-base text-zinc-400 leading-relaxed",
          "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
          "[&_li]:text-zinc-400",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-300 [&_blockquote]:italic [&_blockquote]:my-4",
          "[&_strong]:text-white [&_strong]:font-semibold",
          "[&_p]:mb-4",
        ].join(" ")}
      >
        <MdxContent code={lesson.body} withGlossary />
      </div>

      {/* Mark complete — right-aligned on desktop, full-width on mobile */}
      <div className="flex justify-end mt-8">
        <MarkCompleteButton lessonUuid={lesson.uuid} initialCompleted={false} />
      </div>
    </article>
  )
}
