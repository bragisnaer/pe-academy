import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { getDashboardData } from '@/lib/actions/dashboard'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { AppNav } from '@/components/app-nav'

export default async function DashboardPage() {
  // Auth guard — unauthenticated users are redirected to /login
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user.email?.split('@')[0] ??
    ''

  const data = await getDashboardData()

  if (!data) {
    redirect('/login')
  }

  // CTA button text by nextStep type
  const ctaText: Record<typeof data.nextStep.type, string> = {
    'continue-lesson': 'Continue →',
    'take-quiz': 'Take test →',
    'level-complete': 'Start next level →',
  }

  return (
    <>
      <AppNav />

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Section 1 — Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back{displayName ? `, ${displayName}` : ''}
          </p>
        </div>

        {/* Stat callout */}
        {(() => {
          const totalCompleted = data.levels.reduce((s, l) => s + l.completedCount, 0)
          const totalLessons = data.levels.reduce((s, l) => s + l.totalCount, 0)
          const pct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
          return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="bg-card rounded-xl p-5 border border-border">
                <p className="text-3xl font-bold text-foreground tabular-nums">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Lessons completed</p>
              </div>
              <div className="bg-card rounded-xl p-5 border border-border">
                <p className="text-3xl font-bold text-foreground tabular-nums">{pct}%</p>
                <p className="text-xs text-muted-foreground mt-1">Overall progress</p>
              </div>
              <div className="bg-card rounded-xl p-5 border border-border col-span-2 sm:col-span-1">
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {data.levels.filter((l) => l.unlocked).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Levels unlocked</p>
              </div>
            </div>
          )
        })()}

        {/* Section 2 — Next-Step CTA Card */}
        {data.nextStep.type === 'level-complete' ? (
          <div className="bg-card rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Level complete
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              {data.nextStep.label}
            </h2>
            {data.nextStep.description && (
              <p className="text-sm text-muted-foreground">{data.nextStep.description}</p>
            )}
            <Link
              href={data.nextStep.href}
              className={buttonVariants({ variant: 'default' })}
            >
              {ctaText['level-complete']}
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your next step
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              {data.nextStep.label}
            </h2>
            {data.nextStep.description && (
              <p className="text-sm text-muted-foreground">{data.nextStep.description}</p>
            )}
            <Link
              href={data.nextStep.href}
              className={buttonVariants({ variant: 'default' })}
            >
              {ctaText[data.nextStep.type]}
            </Link>
          </div>
        )}

        {/* Onboarding — shown to users who haven't completed any lessons yet */}
        {data.recentLessons.length === 0 && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              How it works
            </p>
            <ol className="space-y-3">
              {[
                'Work through Level 1 lessons at your own pace',
                'Pass the Level 1 test to prove your knowledge',
                'Unlock Pro modules and advance to higher levels',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Section 3 — Level Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Progress</h2>
          <div className="space-y-2">
            {data.levels.map((level) =>
              level.unlocked ? (
                <Link
                  key={level.levelUuid}
                  href={level.firstLessonHref ?? '/dashboard'}
                  className="bg-card rounded-lg px-4 py-3 flex items-center gap-4 hover:bg-card/80 transition-colors"
                >
                  <span className="text-xs font-medium text-muted-foreground w-6 shrink-0 text-right">
                    {level.levelNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground w-44 shrink-0 truncate">
                    {level.levelName}
                  </span>
                  <div className="flex-1 bg-muted h-1.5 rounded-full min-w-0">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${level.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={level.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                    {level.completedCount}/{level.totalCount} lessons
                  </span>
                </Link>
              ) : (
                <div
                  key={level.levelUuid}
                  className="bg-card/50 rounded-lg px-4 py-3 flex items-center gap-4 opacity-50"
                >
                  <span className="text-xs font-medium text-muted-foreground w-6 shrink-0 text-right">
                    {level.levelNumber}
                  </span>
                  <div className="flex items-center gap-1.5 w-44 shrink-0">
                    <Lock className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-muted-foreground truncate">
                      {level.levelName}
                    </span>
                  </div>
                  <div className="flex-1 bg-muted/50 h-1.5 rounded-full min-w-0" />
                  <span className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                    Locked
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Section 4 — Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          {data.recentLessons.length > 0 ? (
            <ul className="space-y-1">
              {data.recentLessons.map((lesson, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm text-foreground">{lesson.lessonTitle}</p>
                    <p className="text-xs text-muted-foreground">{lesson.moduleName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-4">
                    {formatRelativeTime(lesson.completedAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-muted-foreground">No lessons completed yet.</p>
              <Link
                href="/lessons/pe-fundamentals/what-is-private-equity"
                className="text-sm text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
              >
                Start your first lesson →
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
