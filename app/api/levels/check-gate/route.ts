import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  // Auth check — gate status is user-specific, requires authentication.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Read level_id from query params — no client-supplied counts are trusted.
  const { searchParams } = new URL(request.url)
  const levelId = searchParams.get('level_id')

  if (!levelId) {
    return NextResponse.json(
      { error: 'Missing required query param: level_id' },
      { status: 400 }
    )
  }

  // Fetch the level gate row to get the required completion threshold.
  const { data: gate, error: gateErr } = await supabase
    .from('level_gates')
    .select('required_completion_pct')
    .eq('level_id', levelId)
    .single()

  if (gateErr || !gate) {
    return NextResponse.json(
      { error: 'Level gate not found for this level_id' },
      { status: 404 }
    )
  }

  // Resolve module IDs for this level (lessons belong to modules which belong to levels).
  const { data: modules } = await supabase
    .from('modules')
    .select('id')
    .eq('level_id', levelId)

  const moduleIds = (modules ?? []).map((m: { id: string }) => m.id)

  if (moduleIds.length === 0) {
    // No modules means no lessons — treat as 0% complete.
    return NextResponse.json({
      meets_completion: false,
      completion_pct: 0,
      required_pct: gate.required_completion_pct,
    })
  }

  // Count total lessons across all modules for this level.
  const { count: totalLessons } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .in('module_id', moduleIds)

  // Fetch lesson IDs for this level (needed to filter lesson_completions by level).
  const { data: levelLessonRows } = await supabase
    .from('lessons')
    .select('id')
    .in('module_id', moduleIds)

  const lessonIds = (levelLessonRows ?? []).map((l: { id: string }) => l.id)

  // Count how many of those lessons this user has completed.
  const { count: completedCount } = await supabase
    .from('lesson_completions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds)

  const total = totalLessons ?? 0
  const completed = completedCount ?? 0
  const completion_pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const required_pct = gate.required_completion_pct

  return NextResponse.json({
    meets_completion: completion_pct >= required_pct,
    completion_pct,
    required_pct,
  })
}
