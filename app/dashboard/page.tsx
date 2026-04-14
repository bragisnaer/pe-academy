import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { getDashboardData } from '@/lib/actions/dashboard'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  // Auth guard — unauthenticated users are redirected to /login
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const data = await getDashboardData()

  if (!data) {
    redirect('/login')
  }

  // CTA button text by nextStep type
  const ctaText: Record<typeof data.nextStep.type, string> = {
    'continue-lesson': 'Continue lesson →',
    'take-quiz': 'Take quiz →',
    'level-complete': 'Start next level →',
  }

  return (
    <>
      {/* Navigation header */}
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 bg-zinc-950 border-b border-white/10">
        <Link href="/dashboard" className="text-sm font-semibold text-white">
          PE Academy
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/lessons/pe-fundamentals/what-is-private-equity"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Curriculum
          </Link>
          <Link
            href="/news"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            News
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Section 1 — Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400">Welcome back</p>
        </div>

        {/* Section 2 — Next-Step CTA Card */}
        {data.nextStep.type === 'level-complete' ? (
          <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Level complete
            </p>
            <h2 className="text-xl font-semibold text-white">
              {data.nextStep.label}
            </h2>
            {data.nextStep.description && (
              <p className="text-sm text-zinc-400">{data.nextStep.description}</p>
            )}
            <Link
              href={data.nextStep.href}
              className={buttonVariants({ variant: 'default' })}
            >
              {ctaText['level-complete']}
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Your next step
            </p>
            <h2 className="text-xl font-semibold text-white">
              {data.nextStep.label}
            </h2>
            {data.nextStep.description && (
              <p className="text-sm text-zinc-400">{data.nextStep.description}</p>
            )}
            <Link
              href={data.nextStep.href}
              className={buttonVariants({ variant: 'default' })}
            >
              {ctaText[data.nextStep.type]}
            </Link>
          </div>
        )}

        {/* Section 3 — Level Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.levels.map((level) =>
              level.unlocked ? (
                <div
                  key={level.levelUuid}
                  className="bg-zinc-800 rounded-xl p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-white">
                      {level.levelName}
                    </span>
                  </div>
                  <div className="bg-zinc-700 h-2 rounded-full w-full">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${level.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={level.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {level.completedCount}/{level.totalCount} lessons complete
                  </p>
                </div>
              ) : (
                <div
                  key={level.levelUuid}
                  className="bg-zinc-800/50 rounded-xl p-6 space-y-3 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-zinc-600" aria-hidden="true" />
                    <span className="text-xl font-semibold text-zinc-600">
                      {level.levelName}
                    </span>
                  </div>
                  <div className="bg-zinc-700/50 h-2 rounded-full w-full" />
                  <p className="text-sm text-zinc-600">
                    Locked — pass the Level {level.levelNumber - 1} quiz to unlock
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Section 4 — Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          {data.recentLessons.length > 0 ? (
            <ul className="space-y-1">
              {data.recentLessons.map((lesson, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm text-white">{lesson.lessonTitle}</p>
                    <p className="text-xs text-zinc-400">{lesson.moduleName}</p>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 ml-4">
                    {formatRelativeTime(lesson.completedAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-zinc-400">No lessons completed yet.</p>
              <Link
                href="/lessons/pe-fundamentals/what-is-private-equity"
                className="text-sm text-white underline underline-offset-4 hover:text-zinc-300 transition-colors"
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
