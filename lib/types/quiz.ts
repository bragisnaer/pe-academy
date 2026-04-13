/**
 * Quiz domain types for PE Academy.
 *
 * QuizQuestion is the full DB row — never sent to the client.
 * QuizQuestionPublic strips correct_index before any data reaches the browser.
 */

// Full DB row — only used server-side (scoring route handler)
export type QuizQuestion = {
  id: string
  level_id: string
  topic_tag: string
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
}

// Safe subset — what the quiz page fetches and passes to QuizForm
// correct_index is deliberately omitted to prevent client-side cheating
export type QuizQuestionPublic = Omit<QuizQuestion, 'correct_index'>

export type QuizAttempt = {
  id: string
  user_id: string
  level_id: string
  score: number
  total: number
  passed: boolean
  answers: { question_id: string; selected_index: number }[]
  completed_at: string
}

export type QuizSubmitRequest = {
  level_id: string
  answers: { question_id: string; selected_index: number }[]
}

export type QuizSubmitResponse = {
  attempt_id: string
  score: number
  total: number
  passed: boolean
  topic_breakdown: Record<string, { correct: number; total: number }>
}
