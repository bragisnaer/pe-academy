import { defineCollection, defineConfig, s } from "velite";

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
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      // Strip the "lessons/" prefix so slugAsParams is just "module/lesson"
      slugAsParams: data.slug.replace(/^lessons\//, ""),
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
