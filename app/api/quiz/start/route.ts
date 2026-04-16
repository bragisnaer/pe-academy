import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { LEVELS } from '@/content/curriculum-taxonomy'
import type { QuizQuestionPublic, QuizStartResponse } from '@/lib/types/quiz'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function selectPerTopic<T extends { topic_tag: string }>(questions: T[], totalTarget = 20): T[] {
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

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { level_id: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const level = LEVELS.find((l) => l.uuid === body.level_id)
  if (!level) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  // Level access check — same logic as quiz page
  if (level.number > 1) {
    const { data: progressRow } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('level_id', level.uuid)
      .maybeSingle()
    if (!progressRow) {
      return NextResponse.json({ error: 'Level not unlocked' }, { status: 403 })
    }
  }

  // Resume existing in-progress attempt instead of creating a duplicate
  const { data: existing } = await supabase
    .from('quiz_attempts')
    .select('id, question_ids')
    .eq('user_id', user.id)
    .eq('level_id', level.uuid)
    .eq('status', 'in_progress')
    .maybeSingle()

  if (existing) {
    const ids: string[] = existing.question_ids ?? []
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, level_id, topic_tag, question, options, explanation')
      .in('id', ids)
    const qMap = new Map((questions ?? []).map((q) => [q.id, q]))
    const ordered = ids.map((id) => qMap.get(id)).filter(Boolean) as QuizQuestionPublic[]
    return NextResponse.json({ attempt_id: existing.id, questions: ordered } satisfies QuizStartResponse)
  }

  // Fetch all questions for this level
  const { data: allQuestions } = await supabase
    .from('quiz_questions')
    .select('id, level_id, topic_tag, question, options, explanation')
    .eq('level_id', level.uuid)

  if (!allQuestions || allQuestions.length === 0) {
    return NextResponse.json({ error: 'No questions available' }, { status: 503 })
  }

  const selected = selectPerTopic(allQuestions as QuizQuestionPublic[])
  const questionIds = selected.map((q) => q.id)

  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      level_id: level.uuid,
      status: 'in_progress',
      question_ids: questionIds,
      score: 0,
      total: selected.length,
      passed: false,
      answers: [],
      completed_at: null,
    })
    .select('id')
    .single()

  if (error || !attempt) {
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 })
  }

  return NextResponse.json({ attempt_id: attempt.id, questions: selected } satisfies QuizStartResponse)
}
