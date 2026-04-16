"use client"

import * as React from "react"
import { GlossaryTermHighlight } from "@/components/glossary-term-highlight"
import termsData from "@/content/glossary/terms.json"

interface TermEntry {
  term: string
  definition: string
  full_definition: string
  related_topic_tags: string[]
}

const terms: TermEntry[] = termsData as TermEntry[]

/**
 * Builds a map of lowercased term -> TermEntry for fast lookup.
 * Sorted by term length descending so longer terms match before shorter ones
 * (e.g. "carried interest" before "carry").
 */
const termMap: Map<string, TermEntry> = new Map(
  [...terms]
    .sort((a, b) => b.term.length - a.term.length)
    .map((t) => [t.term.toLowerCase(), t])
)

/**
 * Processes a string of text and splits it into segments — plain strings
 * and matched glossary terms — for a given set of already-seen terms.
 * Modifies the seenTerms set in-place to track first occurrences per page.
 */
function processText(
  text: string,
  seenTerms: Set<string>
): Array<string | { match: string; term: TermEntry }> {
  const result: Array<string | { match: string; term: TermEntry }> = []
  let remaining = text

  while (remaining.length > 0) {
    let foundIndex = -1
    let foundLength = 0
    let foundTerm: TermEntry | null = null

    // Find the earliest occurrence of any unseen term in the remaining text
    for (const [key, entry] of termMap) {
      if (seenTerms.has(key)) continue

      const idx = remaining.toLowerCase().indexOf(key)
      if (idx === -1) continue

      if (foundIndex === -1 || idx < foundIndex) {
        foundIndex = idx
        foundLength = key.length
        foundTerm = entry
      }
    }

    if (foundIndex === -1 || foundTerm === null) {
      // No more terms found — push the rest as plain text
      result.push(remaining)
      break
    }

    // Push text before the match
    if (foundIndex > 0) {
      result.push(remaining.slice(0, foundIndex))
    }

    // Push the matched term (preserve original casing)
    const matchedText = remaining.slice(foundIndex, foundIndex + foundLength)
    result.push({ match: matchedText, term: foundTerm })
    seenTerms.add(foundTerm.term.toLowerCase())

    remaining = remaining.slice(foundIndex + foundLength)
  }

  return result
}

/**
 * Recursively processes React children, replacing first-occurrence glossary terms
 * in text nodes with GlossaryTermHighlight components.
 */
function processChildren(
  children: React.ReactNode,
  seenTerms: Set<string>
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      const segments = processText(child, seenTerms)
      if (segments.length === 1 && typeof segments[0] === "string") {
        return child
      }
      return segments.map((seg, i) => {
        if (typeof seg === "string") {
          return <React.Fragment key={i}>{seg}</React.Fragment>
        }
        return (
          <GlossaryTermHighlight
            key={i}
            term={seg.term.term}
            definition={seg.term.definition}
          >
            {seg.match}
          </GlossaryTermHighlight>
        )
      })
    }

    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{
        children?: React.ReactNode
      }>
      if (element.props.children) {
        return React.cloneElement(element, {
          ...element.props,
          children: processChildren(element.props.children, seenTerms),
        })
      }
    }

    return child
  })
}

/**
 * GlossaryParagraph — a custom `p` override for MDX rendering.
 * Processes its children for first-occurrence glossary term highlights.
 * Uses a module-level WeakMap keyed on the component instance to track
 * seen terms per render tree (per lesson page).
 */
function GlossaryParagraph({
  children,
  seenTerms,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { seenTerms: Set<string> }) {
  const processed = processChildren(children, seenTerms)
  return <p {...props}>{processed}</p>
}

/**
 * Derives a stable heading ID from React children — same slug logic as
 * velite.config.ts extractHeadings() so anchor links match TOC hrefs.
 */
function slugifyHeadingChildren(children: React.ReactNode): string {
  const text = React.Children.toArray(children)
    .map((c) => (typeof c === "string" ? c : ""))
    .join("")
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Creates a set of MDX component overrides with per-page glossary term
 * tracking. Call this once per lesson page render — the seenTerms Set
 * accumulates across all paragraphs to ensure only first occurrence is highlighted.
 *
 * Usage in MdxContent:
 *   const components = createMdxComponents()
 *   <Component components={components} />
 */
export function createMdxComponents(): Record<string, React.ComponentType> {
  const seenTerms = new Set<string>()

  return {
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <GlossaryParagraph {...props} seenTerms={seenTerms} />
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 id={slugifyHeadingChildren(children)} {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 id={slugifyHeadingChildren(children)} {...props}>{children}</h3>
    ),
  }
}

/**
 * Default export: static MDX components map for use where a fresh seenTerms
 * set is acceptable (e.g. case study pages, standalone content blocks).
 * Each render gets its own seenTerms set via createMdxComponents().
 */
export const mdxComponents = createMdxComponents()
