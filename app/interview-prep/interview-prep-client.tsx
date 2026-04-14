"use client"

import { useState } from "react"

interface Question {
  id: string
  topicTag: string
  category: "technical" | "conceptual" | "behavioral"
  question: string
  answer: string
}

interface InterviewPrepClientProps {
  grouped: Record<string, Question[]>
  topicLabels: Record<string, string>
}

const topicOrder = ["pe-fundamentals", "fund-structure", "deal-concepts", "return-metrics"]

export default function InterviewPrepClient({ grouped, topicLabels }: InterviewPrepClientProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div>
      {topicOrder
        .filter((topicTag) => grouped[topicTag])
        .map((topicTag) => (
          <section key={topicTag} className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">{topicLabels[topicTag]}</h2>
            <div className="space-y-3">
              {grouped[topicTag].map((q) => (
                <div key={q.id} className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 px-2 py-0.5 rounded bg-zinc-800">
                        {q.category}
                      </span>
                      <p className="text-white text-sm leading-relaxed">{q.question}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(q.id)}
                      aria-expanded={openIds.has(q.id)}
                      aria-controls={`answer-${q.id}`}
                      className="shrink-0 text-xs text-zinc-400 hover:text-white transition-colors mt-1"
                    >
                      {openIds.has(q.id) ? "Hide answer" : "Show answer"}
                    </button>
                  </div>
                  <div
                    id={`answer-${q.id}`}
                    className={openIds.has(q.id) ? "mt-3 pt-3 border-t border-white/10" : "hidden"}
                  >
                    <p className="text-zinc-400 text-sm leading-relaxed">{q.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
