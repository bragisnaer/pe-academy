"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }

    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div
      className="fixed top-[56px] left-0 right-0 z-40 h-[2px] bg-primary/10"
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
