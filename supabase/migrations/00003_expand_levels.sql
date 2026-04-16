-- ============================================================
-- PE Academy — Migration 00003: Expand curriculum to 11 levels
-- ============================================================

-- Expand number constraint on levels table (was 1-3, now 1-11)
ALTER TABLE public.levels DROP CONSTRAINT IF EXISTS levels_number_check;
ALTER TABLE public.levels ADD CONSTRAINT levels_number_check CHECK (number BETWEEN 1 AND 11);

-- Expand current_level constraint on profiles table (was 1-3, now 1-11)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_current_level_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_current_level_check CHECK (current_level BETWEEN 1 AND 11);

-- Remove old placeholder levels (cascade deletes their modules and lessons).
-- These were Intermediate (number=2) and Expert (number=3) placeholders
-- replaced by the full 10-level + Advanced curriculum.
DELETE FROM public.levels WHERE id IN (
  '3fc65f4e-c36e-4045-a7d3-583f8c5b8b07',
  'c1d1a0f6-6a08-4199-8ba5-0c921847b9c3'
);
