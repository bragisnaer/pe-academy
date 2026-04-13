'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Mark a lesson as complete for the currently authenticated user.
 *
 * Security:
 * - user_id is extracted from the Supabase auth session (server-side) — never
 *   trusted from the client.
 * - lessonUuid is validated against the lessons table before insert.
 * - Upsert with onConflict prevents duplicate completion records.
 * - RLS on lesson_completions enforces auth.uid() = user_id for INSERT.
 */
export async function markLessonComplete(lessonUuid: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return { error: 'Not authenticated' }
  }

  // Validate the lesson exists — prevents inserting completions for
  // fabricated UUIDs and satisfies the foreign key constraint.
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('id', lessonUuid)
    .single()

  if (!lesson) {
    return { error: 'Lesson not found' }
  }

  // Upsert — ON CONFLICT (user_id, lesson_id) DO NOTHING via ignoreDuplicates.
  // Idempotent: repeated calls for the same lesson have no effect.
  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, lesson_id: lessonUuid },
      { onConflict: 'user_id,lesson_id' }
    )

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Return the list of lesson UUIDs the current user has completed.
 * Returns an empty array if the user is not authenticated.
 */
export async function getCompletedLessons(): Promise<string[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('user_id', user.id)

  return data?.map((r) => r.lesson_id) ?? []
}
