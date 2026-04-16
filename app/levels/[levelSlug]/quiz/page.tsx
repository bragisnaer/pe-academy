import { notFound, redirect } from 'next/navigation'
import { LEVELS } from '@/content/curriculum-taxonomy'
import { createClient } from '@/lib/supabase/server'
import { QuizForm } from '@/components/quiz-form'
import type { QuizQuestionPublic } from '@/lib/types/quiz'

// Fisher-Yates shuffle — runs server-side so hydration matches SSR output
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Select N random questions per topic_tag, then shuffle the combined set.
// Produces a 20-question quiz where each topic is equally represented.
// Works for any number of topics: 5 topics → 4 each, 10 topics → 2 each.
function selectPerTopic<T extends { topic_tag: string }>(
  questions: T[],
  totalTarget = 20,
): T[] {
  const groups = new Map<string, T[]>()
  for (const q of questions) {
    const g = groups.get(q.topic_tag) ?? []
    g.push(q)
    groups.set(q.topic_tag, g)
  }
  const perTopic = Math.floor(totalTarget / groups.size)
  const selected: T[] = []
  for (const group of groups.values()) {
    selected.push(...shuffle(group).slice(0, perTopic))
  }
  return shuffle(selected)
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ levelSlug: string }>
}) {
  const { levelSlug } = await params

  // Map slug to level metadata
  const level = LEVELS.find((l) => l.slug === levelSlug)
  if (!level) {
    notFound()
  }

  const supabase = await createClient()

  // Auth check — unauthenticated users redirected to home
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  // Level 1 is always unlocked (matches dashboard logic + lesson page).
  // For Level 2+, verify the user has a user_progress row.
  if (level.number > 1) {
    const { data: progressRow } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('level_id', level.uuid)
      .maybeSingle()

    if (!progressRow) {
      redirect('/dashboard')
    }
  }

  // Fetch quiz questions — explicitly exclude correct_index (T-03-01 mitigation)
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, level_id, topic_tag, question, options, explanation')
    .eq('level_id', level.uuid)

  if (error || !questions) {
    // No questions found — not a public-facing error; redirect gracefully
    redirect('/lessons')
  }

  const shuffledQuestions = selectPerTopic(questions as QuizQuestionPublic[])

  const { data: gate } = await supabase
    .from('level_gates')
    .select('required_quiz_score_pct')
    .eq('level_id', level.uuid)
    .single()

  const threshold = gate?.required_quiz_score_pct ?? 70

  return (
    <div className="bg-background min-h-screen text-foreground px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Level {level.number}: {level.name} Quiz
      </h1>
      <p className="text-muted-foreground mb-10">
        {shuffledQuestions.length} questions &middot; Pass mark: {threshold}% ({Math.ceil(shuffledQuestions.length * threshold / 100)}/{shuffledQuestions.length})
      </p>

      <QuizForm
        questions={shuffledQuestions}
        levelId={level.uuid}
        levelSlug={levelSlug}
      />
    </div>
  )
}
