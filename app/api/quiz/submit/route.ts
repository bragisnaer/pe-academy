import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { QuizSubmitRequest, QuizSubmitResponse } from '@/lib/types/quiz'

// Maps a level UUID to the next level UUID that should be unlocked on passing.
// Hardcoded server-side — not derived from client input (T-03-08 mitigation).
const LEVEL_UNLOCK_MAP: Record<string, string> = {
  '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6': '68cca497-8e72-4064-9781-f387f05c8492', // Level 1  → Level 2
  '68cca497-8e72-4064-9781-f387f05c8492': 'd348d0b0-a934-42b7-82ed-d95ce318cd15', // Level 2  → Level 3
  'd348d0b0-a934-42b7-82ed-d95ce318cd15': '84f9bd80-690c-4b2e-845f-bac3459e09c7', // Level 3  → Level 4
  '84f9bd80-690c-4b2e-845f-bac3459e09c7': '156004ab-c0e6-4690-9b7e-c695ccf5b16f', // Level 4  → Level 5
  '156004ab-c0e6-4690-9b7e-c695ccf5b16f': 'ea48ac0c-0480-43dd-92d9-096a11ed3698', // Level 5  → Level 6
  'ea48ac0c-0480-43dd-92d9-096a11ed3698': '1be0566b-703c-41ab-ac96-49b024417378', // Level 6  → Level 7
  '1be0566b-703c-41ab-ac96-49b024417378': 'da8c23e6-04be-44ba-83e1-9bc07adb0bee', // Level 7  → Level 8
  'da8c23e6-04be-44ba-83e1-9bc07adb0bee': '878b07fd-c020-4bea-94c2-3a13270a5772', // Level 8  → Level 9
  '878b07fd-c020-4bea-94c2-3a13270a5772': 'cce5b1f3-b01d-492e-914d-3d3b8e447cce', // Level 9  → Level 10
  'cce5b1f3-b01d-492e-914d-3d3b8e447cce': '37f39be5-11bd-43e6-b5dc-7366b920c3f4', // Level 10 → Level 11
  // Level 11 has no next level — omitted intentionally
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
