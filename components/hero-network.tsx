"use client"

import { useEffect, useRef } from "react"

// PE/finance domain concepts that appear as network nodes
const PE_NODES = [
  "LBO", "IRR", "EBITDA", "Carry",
  "Fund II", "GP", "LP", "Buyout",
  "MOIC", "Due Diligence", "Cap Table",
  "Deal Flow", "Portfolio", "Exit",
  "Leverage",
]

interface NetworkNode {
  x: number
  y: number
  vx: number
  vy: number
  label: string
}

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const rawCanvas = canvasRef.current
    if (!rawCanvas) return
    const rawCtx = rawCanvas.getContext("2d")
    if (!rawCtx) return

    // Non-null typed aliases so TypeScript doesn't lose narrowing inside closures
    const canvas: HTMLCanvasElement = rawCanvas
    const ctx: CanvasRenderingContext2D = rawCtx

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let animId: number

    function resize() {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()

    // Seed nodes in upper two-thirds to frame content, not compete with it
    const nodes: NetworkNode[] = PE_NODES.map((label) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.18,
      label,
    }))

    // Detect dark mode
    function isDark() {
      return document.documentElement.classList.contains("dark")
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      const dark = isDark()
      // Primary ≈ oklch(0.476 0.185 264) ≈ #5B45E0
      const nodeColor = dark ? "rgba(139, 120, 245, " : "rgba(91, 69, 224, "
      const edgeColor = dark ? "rgba(139, 120, 245, " : "rgba(91, 69, 224, "
      const labelColor = dark ? "rgba(139, 120, 245, 0.55)" : "rgba(91, 69, 224, 0.45)"

      const MAX_DIST = 170

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = edgeColor + alpha + ")"
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Nodes + labels
      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor + "0.55)"
        ctx.fill()

        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
        ctx.fillStyle = labelColor
        ctx.fillText(node.label, node.x + 7, node.y + 4)
      })

      // Update positions with boundary bounce
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
