import { notFound, redirect } from 'next/navigation'
import { LEVELS } from '@/content/curriculum-taxonomy'
import { createClient } from '@/lib/supabase/server'
import { QuizStartButton } from '@/components/quiz-start-button'

export default async function QuizSplashPage({
  params,
}: {
  params: Promise<{ levelSlug: string }>
}) {
  const { levelSlug } = await params

  const level = LEVELS.find((l) => l.slug === levelSlug)
  if (!level) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  if (level.number > 1) {
    const { data: progressRow } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('level_id', level.uuid)
      .maybeSingle()
    if (!progressRow) redirect('/dashboard')
  }

  // If an in-progress attempt exists, send straight to it
  const { data: existing } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('user_id', user.id)
    .eq('level_id', level.uuid)
    .eq('status', 'in_progress')
    .maybeSingle()

  if (existing) {
    redirect(`/levels/${levelSlug}/quiz/attempt?id=${existing.id}`)
  }

  const { data: gate } = await supabase
    .from('level_gates')
    .select('required_quiz_score_pct')
    .eq('level_id', level.uuid)
    .single()

  const threshold = gate?.required_quiz_score_pct ?? 70
  const questionCount = 20
  const passMark = Math.ceil(questionCount * threshold / 100)
  const estMinutes = questionCount

  return (
    <div className="bg-background min-h-screen text-foreground px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Level {level.number}: {level.name} Test
      </h1>
      <p className="text-muted-foreground mb-10">
        {questionCount} questions &middot; ~{estMinutes} min &middot; Pass mark: {threshold}% ({passMark}/{questionCount})
      </p>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Rules
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold mt-0.5">!</span>
            Complete in one sitting — you cannot pause and return.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold mt-0.5">!</span>
            No switching tabs or windows — three switches auto-submit your answers.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-muted-foreground/60 mt-0.5">·</span>
            Score {threshold}% or higher to pass and unlock the next level.
          </li>
        </ul>
      </div>

      <QuizStartButton levelId={level.uuid} levelSlug={levelSlug} />
    </div>
  )
}
