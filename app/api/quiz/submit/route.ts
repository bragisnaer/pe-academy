import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { QuizSubmitRequest, QuizSubmitResponse } from '@/lib/types/quiz'

const LEVEL_UNLOCK_MAP: Record<string, string> = {
  '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6': '68cca497-8e72-4064-9781-f387f05c8492',
  '68cca497-8e72-4064-9781-f387f05c8492': 'd348d0b0-a934-42b7-82ed-d95ce318cd15',
  'd348d0b0-a934-42b7-82ed-d95ce318cd15': '84f9bd80-690c-4b2e-845f-bac3459e09c7',
  '84f9bd80-690c-4b2e-845f-bac3459e09c7': '156004ab-c0e6-4690-9b7e-c695ccf5b16f',
  '156004ab-c0e6-4690-9b7e-c695ccf5b16f': 'ea48ac0c-0480-43dd-92d9-096a11ed3698',
  'ea48ac0c-0480-43dd-92d9-096a11ed3698': '1be0566b-703c-41ab-ac96-49b024417378',
  '1be0566b-703c-41ab-ac96-49b024417378': 'da8c23e6-04be-44ba-83e1-9bc07adb0bee',
  'da8c23e6-04be-44ba-83e1-9bc07adb0bee': '878b07fd-c020-4bea-94c2-3a13270a5772',
  '878b07fd-c020-4bea-94c2-3a13270a5772': 'cce5b1f3-b01d-492e-914d-3d3b8e447cce',
  'cce5b1f3-b01d-492e-914d-3d3b8e447cce': '37f39be5-11bd-43e6-b5dc-7366b920c3f4',
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: QuizSubmitRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (
    typeof body.attempt_id !== 'string' ||
    typeof body.level_id !== 'string' ||
    !Array.isArray(body.answers)
  ) {
    return NextResponse.json({ error: 'Missing attempt_id, level_id, or answers' }, { status: 400 })
  }

  // Verify attempt belongs to user and is still in progress
  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('id, question_ids')
    .eq('id', body.attempt_id)
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .maybeSingle()

  if (!attempt) {
    return NextResponse.json({ error: 'Attempt not found or already submitted' }, { status: 400 })
  }

  // Fetch correct answers for this level
  const { data: dbQuestions, error: qErr } = await supabase
    .from('quiz_questions')
    .select('id, topic_tag, correct_index')
    .eq('level_id', body.level_id)

  if (qErr || !dbQuestions) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  const dbQuestionMap = new Map(dbQuestions.map((q) => [q.id, q]))
  const lockedIds = new Set<string>(attempt.question_ids ?? [])

  // Only score answers for the locked question set
  const scorableAnswers = body.answers.filter(
    (a) => lockedIds.has(a.question_id) && dbQuestionMap.has(a.question_id)
  )

  // Build breakdown totals from ALL locked questions so unanswered count as wrong
  const topic_breakdown: Record<string, { correct: number; total: number }> = {}
  for (const qId of lockedIds) {
    const dbQ = dbQuestionMap.get(qId)
    if (!dbQ) continue
    const tag = dbQ.topic_tag
    if (!topic_breakdown[tag]) topic_breakdown[tag] = { correct: 0, total: 0 }
    topic_breakdown[tag].total++
  }

  // Score only submitted answers
  let score = 0
  for (const answer of scorableAnswers) {
    const dbQ = dbQuestionMap.get(answer.question_id)!
    if (answer.selected_index === dbQ.correct_index) {
      score++
      topic_breakdown[dbQ.topic_tag].correct++
    }
  }

  const total = lockedIds.size

  const { data: gate } = await supabase
    .from('level_gates')
    .select('required_quiz_score_pct')
    .eq('level_id', body.level_id)
    .single()

  const threshold = gate?.required_quiz_score_pct ?? 70
  const passed = total > 0 && (score / total) * 100 >= threshold

  // Finalise attempt
  const { error: updateErr } = await supabase
    .from('quiz_attempts')
    .update({
      status: 'completed',
      score,
      total,
      passed,
      answers: body.answers,
      tab_switches: body.tab_switches ?? 0,
      completed_at: new Date().toISOString(),
    })
    .eq('id', body.attempt_id)
    .eq('user_id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
  }

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

  return NextResponse.json({
    attempt_id: body.attempt_id,
    score,
    total,
    passed,
    topic_breakdown,
  } satisfies QuizSubmitResponse)
}
