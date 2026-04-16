import Link from 'next/link'
import { BookOpen, ShieldCheck, Newspaper, Lock } from 'lucide-react'
import { HeroNetwork } from '@/components/hero-network'
import { HeroContent } from '@/components/marketing/hero-content'
import { FadeUp } from '@/components/marketing/fade-up'
import { StaggerGrid, StaggerItem } from '@/components/marketing/stagger-grid'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'
import { MODULES } from '@/content/curriculum-taxonomy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PE Academy — From Novice to Industry-Ready',
  description:
    'The structured PE curriculum paired with live market context. Level 1 is free.',
  openGraph: {
    title: 'PE Academy — From Novice to Industry-Ready',
    description:
      'The structured PE curriculum paired with live market context. Level 1 is free.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  let newsArticles: {
    id: string
    title: string
    published_at: string | null
    source_name: string | null
  }[] | null = null

  try {
    const { data } = await supabase
      .from('news_articles')
      .select('id, title, published_at, source_name')
      .order('published_at', { ascending: false })
      .limit(4)
    newsArticles = data
  } catch {
    // Suppress silently — render empty news section per UI-SPEC error contract
    newsArticles = null
  }

  return (
    <>
      {/* Section A — Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden min-h-[420px] flex items-center">
        {/* Animated PE deal-flow network — decorative background */}
        <div className="absolute inset-0">
          <HeroNetwork />
          {/* Fade edges so canvas blends into surrounding sections */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80 pointer-events-none" />
        </div>

        <HeroContent />
      </section>

      {/* Section B — Live News Teaser */}
      <section className="border-y border-border py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeUp delay={0.1}>
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">Live from PE Markets</h2>
                </div>
                <p className="text-sm text-muted-foreground pl-[18px]">
                  Real deals happening now — each one maps to what you&apos;re learning.
                </p>
              </div>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0 hidden sm:inline-flex')}
              >
                Full feed &rarr;
              </Link>
            </div>
          </FadeUp>

          <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
            {newsArticles && newsArticles.length > 0 ? (
              <>
                {newsArticles.slice(0, 3).map((article, i) => (
                  <FadeUp key={article.id} delay={0.18 + i * 0.08}>
                    <div className="flex items-start gap-3 px-4 py-3.5 bg-card hover:bg-muted/40 transition-colors">
                      <span className="shrink-0 mt-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                        {article.source_name?.split(' ')[0] ?? 'PE'}
                      </span>
                      <p className="flex-1 text-sm font-medium text-foreground leading-snug">{article.title}</p>
                      {article.published_at && (
                        <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(new Date(article.published_at))}
                        </span>
                      )}
                    </div>
                  </FadeUp>
                ))}
                {/* Blurred teaser row — drives sign-up */}
                <div className="relative">
                  <div
                    className="flex items-start gap-3 px-4 py-3.5 bg-card select-none"
                    style={{ filter: 'blur(3px)' }}
                    aria-hidden="true"
                  >
                    {newsArticles[3] ? (
                      <>
                        <span className="shrink-0 mt-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                          {newsArticles[3].source_name?.split(' ')[0] ?? 'PE'}
                        </span>
                        <p className="flex-1 text-sm font-medium text-foreground leading-snug">{newsArticles[3].title}</p>
                        <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">1h ago</span>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">More deals available...</p>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-4 bg-gradient-to-r from-transparent via-background/50 to-background/90">
                    <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }))}>
                      Sign up free &rarr;
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground bg-card">
                Live PE market data will appear here.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section C — Features */}
      <section id="features" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeUp>
            <h2 className="text-center text-2xl font-semibold text-foreground md:text-[28px]">
              Everything you need to break into PE
            </h2>
          </FadeUp>
          <StaggerGrid className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <StaggerItem hover className="bg-card border border-border rounded-lg p-6">
              <BookOpen className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Structured Curriculum</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Three progressive levels from PE fundamentals to advanced deal mechanics.
                Every concept builds on the last.
              </p>
            </StaggerItem>
            <StaggerItem hover className="bg-card border border-border rounded-lg p-6">
              <ShieldCheck className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Quiz-Gated Levels</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Prove you&apos;ve mastered each level before advancing. No skipping, no
                guessing — real knowledge gates.
              </p>
            </StaggerItem>
            <StaggerItem hover className="bg-card border border-border rounded-lg p-6">
              <Newspaper className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">Live Market Context</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Current PE deal headlines mapped to your curriculum topics. Theory and real
                deals, side by side.
              </p>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      {/* Section D — Curriculum Preview */}
      <section id="curriculum" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground md:text-[28px]">
            The full curriculum
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            24 modules · 130+ lessons · Foundations to Advanced
          </p>

          {/* Free modules */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                Free
              </span>
              <span className="text-sm text-muted-foreground">Level 1 — Foundations</span>
            </div>
            <StaggerGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.filter((m) => m.levelNumber === 1).map((mod) => (
                <StaggerItem key={mod.slug} hover className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>

          {/* Pro modules */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Pro
              </span>
              <span className="text-sm text-muted-foreground">Levels 2–11 · Unlock for $29/month</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.filter((m) => m.levelNumber > 1).map((mod) => (
                <div
                  key={mod.slug}
                  className="bg-card border border-border rounded-lg p-4 opacity-75"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                    <Lock className="size-3.5 shrink-0 text-muted-foreground/50 mt-0.5" aria-hidden="true" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              See pricing &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section E — Social Proof */}
      <section className="bg-muted py-12 md:py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Built by a PE career changer, for PE career changers
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            I spent two years piecing together PE knowledge from scattered blogs, YouTube
            videos, and expensive courses. I built PE Academy so the next generation of
            candidates has a real structured path.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">&mdash; Founder, PE Academy</p>
        </div>
      </section>
    </>
  )
}
