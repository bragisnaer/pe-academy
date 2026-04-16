"use client"

import { useState } from "react"

interface Resource {
  id: string
  title: string
  author: string | null
  type: "book" | "podcast" | "annual-letter" | "article"
  level: "Beginner" | "Intermediate" | "Expert"
  description: string
  url: string | null
}

interface ResourcesClientProps {
  resources: Resource[]
}

const LEVELS = ["All", "Beginner", "Intermediate", "Expert"] as const
type LevelFilter = (typeof LEVELS)[number]

export function ResourcesClient({ resources }: ResourcesClientProps) {
  const [activeLevel, setActiveLevel] = useState<LevelFilter>("All")

  const filtered =
    activeLevel === "All"
      ? resources
      : resources.filter((r) => r.level === activeLevel)

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by level">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setActiveLevel(level)}
            aria-pressed={activeLevel === level}
            className={
              activeLevel === level
                ? "px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                : "px-4 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            }
          >
            {level}
          </button>
        ))}
      </div>

      {/* Resource list */}
      <div className="space-y-4">
        {filtered.map((resource) => (
          <div key={resource.id} className="bg-card rounded-lg p-5 space-y-2">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded bg-muted">
                {resource.type}
              </span>
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded bg-muted">
                {resource.level}
              </span>
            </div>
            <div>
              {resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-foreground/80 transition-colors underline underline-offset-2"
                >
                  {resource.title}
                </a>
              ) : (
                <p className="text-foreground font-medium">{resource.title}</p>
              )}
              {resource.author && (
                <p className="text-sm text-muted-foreground mt-0.5">{resource.author}</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-muted-foreground text-sm">No resources found for this level.</p>
      )}
    </div>
  )
}
