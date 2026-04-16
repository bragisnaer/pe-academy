-- Quiz session integrity: add status, locked question IDs, tab switch count.
-- completed_at made nullable so in-progress attempts have no completion timestamp.
-- UPDATE policy added so the submit route can finalise in-progress attempts.

ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS question_ids JSONB,
  ADD COLUMN IF NOT EXISTS tab_switches INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.quiz_attempts
  ALTER COLUMN completed_at DROP NOT NULL;

-- Allow users to update their own attempts (submit finalises in-progress → completed)
DO $$ BEGIN
  CREATE POLICY "Users can update own quiz attempts"
    ON public.quiz_attempts FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
