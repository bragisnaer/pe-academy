"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface TermEntry {
  term: string
  definition: string
  full_definition: string
  related_topic_tags: string[]
}

interface GlossaryClientProps {
  terms: TermEntry[]
}

export function GlossaryClient({ terms }: GlossaryClientProps) {
  const [query, setQuery] = React.useState("")

  const filtered = query.trim()
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.full_definition.toLowerCase().includes(query.toLowerCase())
      )
    : terms

  // Group by first letter
  const groups = filtered.reduce<Record<string, TermEntry[]>>((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {})

  const letters = Object.keys(groups).sort()

  return (
    <div>
      {/* Filter input */}
      <div className="mb-8 flex gap-2 items-center">
        <Input
          type="search"
          placeholder="Filter terms…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm bg-card border-border text-foreground placeholder:text-muted-foreground"
          aria-label="Filter glossary terms"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Empty state */}
      {letters.length === 0 && (
        <p className="text-muted-foreground">
          No matching terms. Try a shorter or different search.
        </p>
      )}

      {/* Alphabetical letter groups */}
      {letters.map((letter) => (
        <div key={letter} className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-3">{letter}</h2>
          <Separator className="mb-6 bg-border" />
          <dl className="space-y-6">
            {groups[letter].map((term) => (
              <div key={term.term}>
                <dt className="text-base font-normal text-foreground mb-1">
                  {term.term}
                </dt>
                <dd className="text-base text-muted-foreground leading-relaxed">
                  {term.full_definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
