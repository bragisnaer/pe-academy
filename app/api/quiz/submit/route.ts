import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { QuizSubmitRequest, QuizSubmitResponse } from '@/lib/types/quiz'

// Maps a level UUID to the next level UUID that should be unlocked on passing.
// Hardcoded server-side — not derived from client input (T-03-08 mitigation).
const LEVEL_UNLOCK_MAP: Record<string, string> = {
  '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6': '3fc65f4e-c36e-4045-a7d3-583f8c5b8b07', // Level 1 → Level 2
}

export async function POST(request: Request) {
  const supabase = await createClient()

  // T-03-05: Auth check — user_id always from session, never from body.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Parse and validate request body shape.
  let body: QuizSubmitRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (
    typeof body.level_id !== 'string' ||
    !Array.isArray(body.answers) ||
    body.answers.length === 0
  ) {
    return NextResponse.json(
      { error: 'Request must include level_id (string) and answers (non-empty array)' },
      { status: 400 }
    )
  }

  // T-03-04 + T-03-06: Fetch correct_index for all questions belonging to this level from DB.
  // Server derives score from DB values — selected_index from client is only used for comparison.
  // Validates that all submitted question_ids belong to the submitted level_id.
  const { data: dbQuestions, error: qErr } = await supabase
    .from('quiz_questions')
    .select('id, topic_tag, correct_index')
    .eq('level_id', body.level_id)

  if (qErr || !dbQuestions) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const dbQuestionMap = new Map(dbQuestions.map((q) => [q.id, q]))

  // Cross-level injection check: every submitted question_id must belong to this level.
  const allBelong = body.answers.every((a) => dbQuestionMap.has(a.question_id))
  if (!allBelong) {
    return NextResponse.json(
      { error: 'Invalid question_id in answers' },
      { status: 400 }
    )
  }

  // Server-side scoring — correct_index sourced from DB, not from client payload.
  let score = 0
  const topic_breakdown: Record<string, { correct: number; total: number }> = {}

  for (const answer of body.answers) {
    const dbQ = dbQuestionMap.get(answer.question_id)!
    const tag = dbQ.topic_tag
    if (!topic_breakdown[tag]) topic_breakdown[tag] = { correct: 0, total: 0 }
    topic_breakdown[tag].total++
    if (answer.selected_index === dbQ.correct_index) {
      score++
      topic_breakdown[tag].correct++
    }
  }

  const total = body.answers.length

  // Fetch level gate to determine the pass threshold for this level.
  const { data: gate } = await supabase
    .from('level_gates')
    .select('required_quiz_score_pct')
    .eq('level_id', body.level_id)
    .single()

  const threshold = gate?.required_quiz_score_pct ?? 70
  const passed = total > 0 && (score / total) * 100 >= threshold

  // Store the quiz attempt. user_id always from session (T-03-05 mitigation).
  const { data: attempt, error: attemptErr } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      level_id: body.level_id,
      score,
      total,
      passed,
      answers: body.answers,
    })
    .select('id')
    .single()

  if (attemptErr || !attempt) {
    return NextResponse.json({ error: 'Failed to store attempt' }, { status: 500 })
  }

  // T-03-08: Level unlock — only fires when server-computed passed === true.
  // Target level_id is hardcoded server-side — never taken from client.
  if (passed) {
    const nextLevelId = LEVEL_UNLOCK_MAP[body.level_id]
    if (nextLevelId) {
      await supabase
        .from('user_progress')
        .upsert(
          { user_id: user.id, level_id: nextLevelId },
          { onConflict: 'user_id,level_id' }
        )
    }
  }

  const response: QuizSubmitResponse = {
    attempt_id: attempt.id,
    score,
    total,
    passed,
    topic_breakdown,
  }

  return NextResponse.json(response)
}
