"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const itemVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } } }

export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-8% 0px" })
  return (
    <motion.div ref={ref} className={className} variants={container} initial="hidden" animate={inView ? "show" : "hidden"}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div variants={itemVariant} className={className} whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}>
      {children}
    </motion.div>
  )
}
