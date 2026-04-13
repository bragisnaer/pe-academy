"use client"

import * as React from "react"
import { GlossaryTooltip } from "@/components/glossary-tooltip"

export interface GlossaryTermHighlightProps {
  term: string
  definition: string
  children: React.ReactNode
}

/**
 * GlossaryTermHighlight — wraps the first occurrence of a glossary term in a
 * lesson with a dotted underline and a tooltip showing its definition.
 * Styling follows the UI-SPEC: text-white underline decoration-dotted decoration-zinc-400 cursor-help.
 */
export function GlossaryTermHighlight({
  term,
  definition,
  children,
}: GlossaryTermHighlightProps) {
  return (
    <GlossaryTooltip term={term} definition={definition}>
      <span
        className="text-white underline decoration-dotted decoration-zinc-400 cursor-help"
        data-glossary-term={term}
      >
        {children}
      </span>
    </GlossaryTooltip>
  )
}
