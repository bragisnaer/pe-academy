import { defineCollection, defineConfig, s } from "velite";

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\s*\n?/, "")
}

function countWords(raw: string): number {
  const text = stripFrontmatter(raw)
    .replace(/```[\s\S]*?```/g, " ")         // code blocks
    .replace(/`[^`]+`/g, " ")                // inline code
    .replace(/!\[.*?\]\(.*?\)/g, " ")        // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links — keep text
    .replace(/^#{1,6}\s+/gm, "")             // heading markers
    .replace(/[*_~>]/g, "")                  // formatting
  return (text.match(/\S+/g) ?? []).length
}

export interface LessonHeading {
  level: number
  text: string
  id: string
}

function extractHeadings(raw: string): LessonHeading[] {
  const text = stripFrontmatter(raw)
  const results: LessonHeading[] = []
  const headingPattern = /^(#{2,3})\s+(.+)$/gm
  let match = headingPattern.exec(text)
  while (match !== null) {
    const headingText = match[2].trim().replace(/[*_`~]/g, "")
    const id = headingText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    results.push({ level: match[1].length, text: headingText, id })
    match = headingPattern.exec(text)
  }
  return results
}

// ─── Collections ───────────────────────────────────────────────────────────

const lessons = defineCollection({
  name: "Lesson",
  pattern: "lessons/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      level: s.number(),
      module: s.string(),
      order: s.number(),
      topic_tag: s.string(),
      uuid: s.string(),
      locked: s.boolean().default(false),
      slug: s.slug("lessons"),
      raw: s.raw(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      // Strip the "lessons/" prefix so slugAsParams is just "module/lesson"
      slugAsParams: data.slug.replace(/^lessons\//, ""),
      wordCount: countWords(data.raw),
      headings: extractHeadings(data.raw),
    })),
});

const caseStudies = defineCollection({
  name: "CaseStudy",
  pattern: "case-studies/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      topic_tags: s.array(s.string()),
      uuid: s.string(),
      slug: s.slug("case-studies"),
      summary: s.string(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      // Strip the "case-studies/" prefix so slugAsParams is just the case study slug
      slugAsParams: data.slug.replace(/^case-studies\//, ""),
    })),
});

// ─── Config ────────────────────────────────────────────────────────────────

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: { lessons, caseStudies },
});
