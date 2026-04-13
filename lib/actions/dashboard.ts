'use server'

import { createClient } from '@/lib/supabase/server'
import { LEVELS, MODULES } from '@/content/curriculum-taxonomy'
import { getLessonsByLevel } from '@/lib/content'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LevelProgress {
  levelNumber: number
  levelName: string
  levelSlug: string
  levelUuid: string
  unlocked: boolean
  completedCount: number
  totalCount: number
  percentage: number
  quizPassed: boolean
}

export interface RecentLesson {
  lessonTitle: string
  moduleName: string
  completedAt: Date
}

export interface NextStep {
  type: 'continue-lesson' | 'take-quiz' | 'level-complete'
  label: string
  description?: string
  href: string
}

export interface DashboardData {
  levels: LevelProgress[]
  recentLessons: RecentLesson[]
  nextStep: NextStep
}

// ─── Data Fetcher ─────────────────────────────────────────────────────────────

export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all data in parallel for fast SSR
  const [userProgressResult, lessonCompletionsResult, quizAttemptsResult] =
    await Promise.all([
      supabase
        .from('user_progress')
        .select('level_id')
        .eq('user_id', user.id),
      supabase
        .from('lesson_completions')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false }),
      supabase
        .from('quiz_attempts')
        .select('level_id, passed')
        .eq('user_id', user.id)
        .eq('passed', true),
    ])

  const unlockedLevelIds = new Set(
    (userProgressResult.data ?? []).map(
      (r: { level_id: string }) => r.level_id
    )
  )

  const allCompletions: { lesson_id: string; completed_at: string }[] =
    lessonCompletionsResult.data ?? []

  const passedQuizLevelIds = new Set(
    (quizAttemptsResult.data ?? []).map(
      (r: { level_id: string; passed: boolean }) => r.level_id
    )
  )

  const completedLessonIds = new Set(allCompletions.map((c) => c.lesson_id))

  // ─── Build levels ────────────────────────────────────────────────────────

  const levels: LevelProgress[] = LEVELS.map((level) => {
    // Level 1 is always unlocked (seeded by signup trigger; hardcoded per STATE.md decision)
    const unlocked = level.number === 1 || unlockedLevelIds.has(level.uuid)

    const levelLessons = getLessonsByLevel(level.number)
    const levelLessonUuids = new Set(levelLessons.map((l) => l.uuid))

    const totalCount = levelLessons.length
    const completedCount = [...levelLessonUuids].filter((uuid) =>
      completedLessonIds.has(uuid)
    ).length

    const percentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const quizPassed = passedQuizLevelIds.has(level.uuid)

    return {
      levelNumber: level.number,
      levelName: level.name,
      levelSlug: level.slug,
      levelUuid: level.uuid,
      unlocked,
      completedCount,
      totalCount,
      percentage,
      quizPassed,
    }
  })

  // ─── Build recentLessons ─────────────────────────────────────────────────

  const recentLessons: RecentLesson[] = allCompletions
    .slice(0, 5)
    .map((item) => {
      // Find module containing this lesson UUID
      const module = MODULES.find((m) =>
        m.lessons.some((l) => l.uuid === item.lesson_id)
      )
      const lesson = module?.lessons.find((l) => l.uuid === item.lesson_id)

      return {
        lessonTitle: lesson?.title ?? 'Unknown lesson',
        moduleName: module?.title ?? 'Unknown module',
        completedAt: new Date(item.completed_at),
      }
    })

  // ─── Build nextStep ──────────────────────────────────────────────────────

  // Current level = highest-numbered unlocked level where user is still working
  // (i.e., incomplete lessons or unpassed quiz)
  const unlockedLevels = levels.filter((l) => l.unlocked)

  // Find the "active" level — highest unlocked level that isn't fully complete
  // (either has incomplete lessons, or lessons all done but quiz not passed)
  let currentLevel =
    unlockedLevels.find((l) => l.completedCount < l.totalCount || !l.quizPassed) ??
    unlockedLevels[unlockedLevels.length - 1]

  if (!currentLevel) {
    currentLevel = levels[0]
  }

  const levelLessons = getLessonsByLevel(currentLevel.levelNumber)
  const levelIndex = LEVELS.findIndex(
    (l) => l.number === currentLevel.levelNumber
  )

  let nextStep: NextStep

  if (currentLevel.completedCount < currentLevel.totalCount) {
    // State 1: Incomplete lessons — find first incomplete lesson
    const firstIncomplete = levelLessons.find(
      (l) => !completedLessonIds.has(l.uuid)
    )

    if (firstIncomplete) {
      nextStep = {
        type: 'continue-lesson',
        label: `Continue: ${firstIncomplete.title}`,
        href: `/lessons/${firstIncomplete.module}/${firstIncomplete.slugAsParams}`,
      }
    } else {
      // Defensive fallback — should not happen given completedCount check
      nextStep = {
        type: 'continue-lesson',
        label: `Continue Level ${currentLevel.levelNumber}`,
        href: '/lessons',
      }
    }
  } else if (!currentLevel.quizPassed) {
    // State 2: All lessons done, quiz not yet passed
    const nextLevelNumber = currentLevel.levelNumber + 1
    nextStep = {
      type: 'take-quiz',
      label: `Take the Level ${currentLevel.levelNumber} Quiz`,
      description: `You've completed all Level ${currentLevel.levelNumber} lessons. Pass the quiz to unlock Level ${nextLevelNumber}.`,
      href: `/levels/${currentLevel.levelSlug}/quiz`,
    }
  } else {
    // State 3: All lessons done AND quiz passed
    const nextLevelMeta = LEVELS[levelIndex + 1]

    if (nextLevelMeta) {
      const nextLevelLessons = getLessonsByLevel(nextLevelMeta.number)
      const firstNextLesson = nextLevelLessons[0]
      const href = firstNextLesson
        ? `/lessons/${firstNextLesson.module}/${firstNextLesson.slugAsParams}`
        : '/lessons'

      nextStep = {
        type: 'level-complete',
        label: `You've completed Level ${currentLevel.levelNumber}!`,
        description: `Level ${nextLevelMeta.number} is now unlocked. Keep going.`,
        href,
      }
    } else {
      // All levels complete — no next level
      nextStep = {
        type: 'level-complete',
        label: `You've completed Level ${currentLevel.levelNumber}!`,
        description: 'You have completed all available levels.',
        href: '/lessons',
      }
    }
  }

  return {
    levels,
    recentLessons,
    nextStep,
  }
}
