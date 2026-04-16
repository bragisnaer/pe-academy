"use client"

import * as React from "react"

export interface GlossaryTooltipProps {
  term: string
  definition: string
  children: React.ReactNode
}

/**
 * GlossaryTooltip — shows a one-line definition on hover (desktop) or tap (mobile).
 * Uses a custom implementation to avoid @base-ui Tooltip API complexity with dynamic
 * terms. Tooltip is positioned above the trigger with 8px offset.
 * Accessibility: role="tooltip" on tooltip, aria-describedby on trigger.
 */
export function GlossaryTooltip({
  term,
  definition,
  children,
}: GlossaryTooltipProps) {
  const [visible, setVisible] = React.useState(false)
  const tooltipId = React.useId()
  const containerRef = React.useRef<HTMLSpanElement>(null)

  // Close on outside click (mobile tap-away dismissal)
  React.useEffect(() => {
    if (!visible) return

    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [visible])

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </span>

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          aria-label={`Definition of ${term}`}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded bg-card px-2 py-1.5 text-sm text-foreground shadow-lg pointer-events-none"
        >
          {definition}
        </span>
      )}
    </span>
  )
}
