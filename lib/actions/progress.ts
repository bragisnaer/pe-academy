'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Returns the list of level UUIDs the current user has unlocked.
 * Always includes Level 1 (seeded by signup trigger).
 * Returns [] if not authenticated.
 */
export async function getUnlockedLevelIds(): Promise<string[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('user_progress')
    .select('level_id')
    .eq('user_id', user.id)

  return (data ?? []).map((r: { level_id: string }) => r.level_id)
}
