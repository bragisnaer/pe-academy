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

  // Check user_progress: level must be unlocked for this user
  const { data: progressRow } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('level_id', level.uuid)
    .maybeSingle()

  if (!progressRow) {
    // Level not yet unlocked — send to lessons to earn access
    redirect('/lessons')
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

  const shuffledQuestions = shuffle(questions as QuizQuestionPublic[])

  return (
    <div className="bg-zinc-950 min-h-screen text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-2">
        Level {level.number}: {level.name} Quiz
      </h1>
      <p className="text-zinc-400 mb-10">
        {shuffledQuestions.length} questions &middot; Pass mark: 70% (14/20)
      </p>

      <QuizForm
        questions={shuffledQuestions}
        levelId={level.uuid}
        levelSlug={levelSlug}
      />
    </div>
  )
}
