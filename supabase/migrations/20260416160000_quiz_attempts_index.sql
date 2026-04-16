-- Index for the (user_id, level_id, status) pattern used by:
--   GET /levels/[slug]/quiz  — check for in_progress attempt
--   POST /api/quiz/start     — resume or create attempt
--   lib/actions/dashboard.ts — fetch passed attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_level_status
  ON public.quiz_attempts (user_id, level_id, status);
