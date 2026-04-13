import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LEVELS, MODULES, TAXONOMY } from '@/content/curriculum-taxonomy'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'

// Human-readable labels for each Level 1 topic_tag.
const TOPIC_LABELS: Record<string, string> = {
  'pe-fundamentals': 'PE Fundamentals',
  'fund-structure': 'Fund Structure',
  'key-players': 'Key Players',
  'deal-concepts': 'Deal Concepts',
  'return-metrics': 'Return Metrics',
}

// Next.js 16: both params and searchParams are Promises.
export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelSlug: string }>
  searchParams: Promise<{ attempt_id?: string }>
}) {
  const { levelSlug } = await params
  const { attempt_id } = await searchParams

  // Map slug to level metadata.
  const level = LEVELS.find((l) => l.slug === levelSlug)
  if (!level) {
    notFound()
  }

  const supabase = await createClient()

  // Auth check — result page is user-specific (T-03-07 mitigation).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Require attempt_id — if missing, redirect back to quiz.
  if (!attempt_id) {
    redirect(`/levels/${levelSlug}/quiz`)
  }

  // Fetch the attempt. Belt-and-suspenders: explicit user_id filter alongside RLS.
  // T-03-07: RLS policy on quiz_attempts restricts SELECT to auth.uid() = user_id.
  const { data: attempt, error: attemptErr } = await supabase
    .from('quiz_attempts')
    .select('id, score, total, passed, answers, completed_at')
    .eq('id', attempt_id)
    .eq('user_id', user.id)
    .single()

  if (attemptErr || !attempt) {
    redirect(`/levels/${levelSlug}/quiz`)
  }

  // Recompute topic_breakdown server-side from quiz_questions.
  // This avoids storing topic_breakdown in quiz_attempts and ensures
  // correct_index never reaches the client.
  const answerArray = attempt.answers as { question_id: string; selected_index: number }[]
  const questionIds = answerArray.map((a) => a.question_id)

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id, topic_tag, correct_index')
    .in('id', questionIds)

  const qMap = new Map((questions ?? []).map((q) => [q.id, q]))
  const breakdown: Record<string, { correct: number; total: number }> = {}

  for (const answer of answerArray) {
    const q = qMap.get(answer.question_id)
    if (!q) continue
    const tag = q.topic_tag
    if (!breakdown[tag]) breakdown[tag] = { correct: 0, total: 0 }
    breakdown[tag].total++
    if (answer.selected_index === q.correct_index) breakdown[tag].correct++
  }

  const scorePct = attempt.total > 0
    ? Math.round((attempt.score / attempt.total) * 100)
    : 0

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Pass / Fail banner */}
        {attempt.passed ? (
          <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-6 mb-8 text-center">
            <p className="text-2xl font-semibold text-emerald-400">Level 2 Unlocked!</p>
            <p className="text-zinc-300 mt-1">
              You passed the Level 1 quiz. Intermediate content is now available.
            </p>
          </div>
        ) : (
          <div className="bg-red-950 border border-red-800 rounded-lg p-6 mb-8 text-center">
            <p className="text-2xl font-semibold text-red-400">Keep Studying</p>
            <p className="text-zinc-300 mt-1">
              You need 70% (14/20) to unlock Level 2. Review the topics below and retake when
              ready.
            </p>
          </div>
        )}

        {/* Score display */}
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-white">
            {attempt.score}/{attempt.total}
          </p>
          <p className="text-zinc-400 mt-1">{scorePct}% correct</p>
        </div>

        {/* Topic breakdown */}
        <h2 className="text-lg font-semibold text-white mb-4">Topic Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([tag, { correct, total }]) => {
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0
            const passing = pct >= 70
            const label = TOPIC_LABELS[tag] ?? tag

            // Look up review link for failed topics.
            const moduleMeta = TAXONOMY[tag]
            const firstLesson = moduleMeta?.lessons[0]
            const reviewHref =
              moduleMeta && firstLesson
                ? `/lessons/${moduleMeta.slug}/${firstLesson.slug}`
                : null

            return (
              <div key={tag}>
                <div className="flex items-center justify-between bg-zinc-900 rounded-lg px-4 py-3">
                  <div>
                    <span className="text-white font-medium">{label}</span>
                    <span className="text-zinc-400 text-sm ml-2">
                      {correct}/{total}
                    </span>
                  </div>
                  <span
                    className={
                      passing
                        ? 'bg-emerald-900 text-emerald-300 text-sm font-medium px-2.5 py-1 rounded'
                        : 'bg-red-900 text-red-300 text-sm font-medium px-2.5 py-1 rounded'
                    }
                  >
                    {pct}%
                  </span>
                </div>
                {!passing && reviewHref && (
                  <a
                    href={reviewHref}
                    className="text-xs text-zinc-400 hover:text-white mt-1 block pl-4"
                  >
                    Review: {moduleMeta?.title} &rarr;
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center mt-10">
          {attempt.passed ? (
            <Link
              href="/lessons/intermediate-placeholder/coming-soon"
              className={buttonVariants({ variant: 'default' })}
            >
              Continue to Level 2 &rarr;
            </Link>
          ) : (
            <Link
              href={`/levels/${levelSlug}/quiz`}
              className={buttonVariants({ variant: 'default' })}
            >
              Retry Quiz
            </Link>
          )}
          <Link href="/lessons" className={buttonVariants({ variant: 'outline' })}>
            Back to Lessons
          </Link>
        </div>
      </div>
    </div>
  )
}
