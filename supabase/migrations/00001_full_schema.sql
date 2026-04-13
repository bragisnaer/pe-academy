-- ============================================================
-- PE Academy — Full Schema Migration
-- Phase 1: All tables for all 6 phases, with RLS and indexes
-- ============================================================

-- ============================================================
-- TABLE DEFINITIONS
-- ============================================================

-- Auth-linked (Phase 1): User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Curriculum (Phase 2): Levels
CREATE TABLE public.levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 3),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Curriculum (Phase 2): Modules
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  topic_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Curriculum (Phase 2): Lessons
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  mdx_path TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  topic_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Progress tracking (Phase 2 + 3): User progress (level unlocks)
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, level_id)
);

-- Progress tracking (Phase 2 + 3): Lesson completions
CREATE TABLE public.lesson_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Quiz (Phase 3): Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  topic_tag TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz (Phase 3): Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz (Phase 3): Level gates (pass thresholds)
CREATE TABLE public.level_gates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE UNIQUE,
  required_completion_pct INTEGER NOT NULL DEFAULT 100,
  required_quiz_score_pct INTEGER NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- News (Phase 5): News articles
CREATE TABLE public.news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  topic_tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  ingested_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Glossary (Phase 2): Glossary terms (DB-backed reference)
CREATE TABLE public.glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  related_topic_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY — Enable on all tables
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles: users can read/update/insert their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Content tables: all authenticated users can read
CREATE POLICY "Authenticated users can read levels" ON public.levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read modules" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read lessons" ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read quiz questions" ON public.quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read level gates" ON public.level_gates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read news" ON public.news_articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read glossary" ON public.glossary_terms FOR SELECT TO authenticated USING (true);

-- User data: users can only access their own data
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own completions" ON public.lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON public.lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for news (unauthenticated users can also browse news)
CREATE POLICY "Public can read news" ON public.news_articles FOR SELECT TO anon USING (true);

-- ============================================================
-- INDEXES
-- ============================================================

-- RLS policy column indexes (user_id columns used in auth.uid() = user_id policies)
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_lesson_completions_user_id ON public.lesson_completions(user_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);

-- Foreign key and query indexes
CREATE INDEX idx_modules_level_id ON public.modules(level_id);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_quiz_questions_level_id ON public.quiz_questions(level_id);
CREATE INDEX idx_quiz_attempts_level_id ON public.quiz_attempts(level_id);
CREATE INDEX idx_user_progress_level_id ON public.user_progress(level_id);
CREATE INDEX idx_lesson_completions_lesson_id ON public.lesson_completions(lesson_id);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_topic_tags ON public.news_articles USING GIN(topic_tags);
CREATE INDEX idx_lessons_topic_tag ON public.lessons(topic_tag);
CREATE INDEX idx_quiz_questions_topic_tag ON public.quiz_questions(topic_tag);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-unlock Level 1 on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, level_id)
  SELECT NEW.id, id FROM public.levels WHERE number = 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_progress();
