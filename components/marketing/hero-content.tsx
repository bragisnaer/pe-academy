"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ease = [0.25, 0.1, 0.25, 1] as const

export function HeroContent() {
  return (
    <div className="relative mx-auto max-w-2xl px-4 text-center">
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease }} className="text-[28px] md:text-4xl font-semibold text-foreground leading-[1.15]">
        From PE Novice to Industry-Ready
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }} className="mt-4 text-base text-muted-foreground">
        The only structured PE curriculum paired with live market context.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease }}>
        <Link href="/signup" className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8")}>
          Start Level 1 for Free
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">No credit card required</p>
      </motion.div>
    </div>
  )
}
