import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { caseStudies } from "@/.velite"
import { createClient } from "@/lib/supabase/server"
import { MdxContent } from "@/components/mdx-content"
import { TAXONOMY } from "@/content/curriculum-taxonomy"
import Link from "next/link"

export const revalidate = 3600

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slugAsParams }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = caseStudies.find((c) => c.slugAsParams === slug)
  if (!cs) return { title: "Case Study Not Found" }
  return {
    title: `${cs.title} | PE Academy`,
    description: cs.summary,
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const cs = caseStudies.find((c) => c.slugAsParams === slug)
  if (!cs) {
    notFound()
  }

  return (
    <article>
      <h1 className="text-3xl font-semibold text-foreground mb-4">{cs.title}</h1>

      {/* Topic tag badges */}
      {cs.topic_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {cs.topic_tags.map((tag) => {
            const module = TAXONOMY[tag]
            const href = module
              ? `/lessons/${module.slug}/${module.lessons[0]?.slug ?? ""}`
              : "#"
            return (
              <Link
                key={tag}
                href={href}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                {module ? module.title : tag}
              </Link>
            )
          })}
        </div>
      )}

      {/* Summary */}
      <p className="text-base text-foreground/80 leading-relaxed mb-8 border-l-2 border-border pl-4 italic">
        {cs.summary}
      </p>

      {/* MDX body */}
      <div
        className={[
          "text-base text-muted-foreground leading-relaxed",
          "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
          "[&_li]:text-muted-foreground",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-foreground/80 [&_blockquote]:italic [&_blockquote]:my-4",
          "[&_strong]:text-foreground [&_strong]:font-semibold",
          "[&_p]:mb-4",
        ].join(" ")}
      >
        <MdxContent code={cs.body} withGlossary />
      </div>
    </article>
  )
}
