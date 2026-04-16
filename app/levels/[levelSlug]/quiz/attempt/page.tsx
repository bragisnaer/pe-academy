export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { LEVELS } from '@/content/curriculum-taxonomy'
import { createClient } from '@/lib/supabase/server'
import { QuizForm } from '@/components/quiz-form'
import type { QuizQuestionPublic } from '@/lib/types/quiz'

export default async function QuizAttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelSlug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { levelSlug } = await params
  const { id: attemptId } = await searchParams

  if (!attemptId) redirect(`/levels/${levelSlug}/quiz`)

  const level = LEVELS.find((l) => l.slug === levelSlug)
  if (!level) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('id, question_ids, total')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .maybeSingle()

  if (!attempt) redirect(`/levels/${levelSlug}/quiz`)

  const ids: string[] = attempt.question_ids ?? []
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id, level_id, topic_tag, question, options, explanation')
    .in('id', ids)

  if (!questions || questions.length === 0) redirect(`/levels/${levelSlug}/quiz`)

  const qMap = new Map(questions.map((q) => [q.id, q]))
  const ordered = ids.map((id) => qMap.get(id)).filter(Boolean) as QuizQuestionPublic[]

  const { data: gate } = await supabase
    .from('level_gates')
    .select('required_quiz_score_pct')
    .eq('level_id', level.uuid)
    .single()

  const threshold = gate?.required_quiz_score_pct ?? 70

  return (
    <div className="bg-background min-h-screen text-foreground px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Level {level.number}: {level.name} Test
      </h1>
      <p className="text-muted-foreground mb-10">
        {ordered.length} questions &middot; Pass mark: {threshold}%{' '}
        ({Math.ceil(ordered.length * threshold / 100)}/{ordered.length})
      </p>
      <QuizForm
        questions={ordered}
        levelId={level.uuid}
        levelSlug={levelSlug}
        attemptId={attemptId}
      />
    </div>
  )
}
