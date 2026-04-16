"use client"

import { useEffect, useState } from "react"

interface Heading {
  level: number
  text: string
  id: string
}

interface LessonTOCProps {
  headings: Heading[]
}

export function LessonTOC({ headings }: LessonTOCProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Track the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Heading is "active" when it's in the top third of the viewport
        rootMargin: "0% 0% -70% 0%",
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="mb-8 p-4 bg-muted rounded-lg">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        In this lesson
      </p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              className={`text-sm transition-colors block py-0.5 border-l-2 pl-2 ${
                activeId === h.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
