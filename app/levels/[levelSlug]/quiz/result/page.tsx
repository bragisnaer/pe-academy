import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LEVELS, MODULES, TAXONOMY } from '@/content/curriculum-taxonomy'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'

// Human-readable labels for topic_tags across all levels.
const TOPIC_LABELS: Record<string, string> = {
  // Level 1
  'pe-fundamentals': 'PE Fundamentals',
  'fund-structure': 'Fund Structure',
  'key-players': 'Key Players',
  'deal-concepts': 'Deal Concepts',
  'return-metrics': 'Return Metrics',
  // Level 2
  'financial-analysis-statements': 'Financial Statements',
  'financial-analysis-ebitda': 'EBITDA & Normalisation',
  'financial-analysis-enterprise-value': 'Enterprise Value',
  'financial-analysis-debt': 'Debt & Capital Structure',
  'financial-analysis-cashflow': 'Cash Flow Analysis',
  // Level 3
  'valuation-dcf': 'DCF Valuation',
  'valuation-trading-comps': 'Trading Comps',
  'valuation-precedent-transactions': 'Precedent Transactions',
  'valuation-in-practice': 'Valuation in Practice',
  'valuation-lbo-model': 'LBO Model',
  // Level 4
  'due-diligence-commercial': 'Commercial Due Diligence',
  'due-diligence-financial': 'Financial Due Diligence',
  'due-diligence-legal': 'Legal Due Diligence',
  'due-diligence-operational': 'Operational Due Diligence',
  'due-diligence-esg': 'ESG Due Diligence',
  'due-diligence-red-flags': 'Red Flags & Deal Killers',
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

  // Fetch attempt + pass mark in parallel.
  const [attemptResult, gateResult] = await Promise.all([
    supabase
      .from('quiz_attempts')
      .select('id, score, total, passed, answers, completed_at')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('level_gates')
      .select('required_quiz_score_pct')
      .eq('level_id', level.uuid)
      .single(),
  ])

  if (attemptResult.error || !attemptResult.data) {
    redirect(`/levels/${levelSlug}/quiz`)
  }

  const attempt = attemptResult.data
  const passMark = gateResult.data?.required_quiz_score_pct ?? 70

  // Next level (if any) for unlock message.
  const nextLevel = LEVELS.find((l) => l.number === level.number + 1)

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
    <div className="bg-background min-h-screen text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Pass / Fail banner */}
        {attempt.passed ? (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 text-center">
            <p className="text-2xl font-semibold text-primary">
              {nextLevel ? `Level ${nextLevel.number} Unlocked!` : 'Course Complete!'}
            </p>
            <p className="text-foreground/80 mt-1">
              {nextLevel
                ? `You passed the Level ${level.number} quiz. ${nextLevel.name} is now available.`
                : `You passed the final level. Congratulations!`}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 text-center">
            <p className="text-2xl font-semibold text-destructive">Keep Studying</p>
            <p className="text-foreground/80 mt-1">
              You need {passMark}% ({Math.ceil((passMark / 100) * attempt.total)}/{attempt.total}) to
              unlock {nextLevel ? `Level ${nextLevel.number}` : 'the next level'}. Review the topics
              below and retake when ready.
            </p>
          </div>
        )}

        {/* Score display */}
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-foreground">
            {attempt.score}/{attempt.total}
          </p>
          <p className="text-muted-foreground mt-1">{scorePct}% correct</p>
        </div>

        {/* Topic breakdown */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Topic Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([tag, { correct, total }]) => {
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0
            const passing = pct >= passMark
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
                <div className="flex items-center justify-between bg-card rounded-lg px-4 py-3">
                  <div>
                    <span className="text-foreground font-medium">{label}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {correct}/{total}
                    </span>
                  </div>
                  <span
                    className={
                      passing
                        ? 'bg-primary/20 text-primary text-sm font-medium px-2.5 py-1 rounded'
                        : 'bg-destructive/20 text-destructive text-sm font-medium px-2.5 py-1 rounded'
                    }
                  >
                    {pct}%
                  </span>
                </div>
                {!passing && reviewHref && (
                  <a
                    href={reviewHref}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1 block pl-4"
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
              href="/dashboard"
              className={buttonVariants({ variant: 'default' })}
            >
              {nextLevel ? `Continue to Level ${nextLevel.number}` : 'Go to Dashboard'} &rarr;
            </Link>
          ) : (
            <Link
              href={`/levels/${levelSlug}/quiz`}
              className={buttonVariants({ variant: 'default' })}
            >
              Retry Test
            </Link>
          )}
          <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Back to Lessons
          </Link>
        </div>
      </div>
    </div>
  )
}
