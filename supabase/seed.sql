-- ============================================================
-- PE Academy — Curriculum Seed Data
-- Populates levels, modules, and lessons tables with UUIDs
-- that match curriculum-taxonomy.ts exactly.
--
-- Run once against your Supabase project:
--   supabase db execute --file supabase/seed.sql
-- Or paste into the Supabase SQL Editor.
-- ============================================================

-- ─── Levels ───────────────────────────────────────────────────────────────

INSERT INTO public.levels (id, number, name, description) VALUES
  (
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    1,
    'Beginner',
    'Core PE concepts — fund structure, key players, deal mechanics, and return metrics. No prior finance knowledge required.'
  ),
  (
    '3fc65f4e-c36e-4045-a7d3-583f8c5b8b07',
    2,
    'Intermediate',
    'Deeper dives into valuation, LBO modelling, deal process, and portfolio management. Requires Level 1 completion.'
  ),
  (
    'c1d1a0f6-6a08-4199-8ba5-0c921847b9c3',
    3,
    'Expert',
    'Advanced fund economics, credit structures, cross-border deals, and exit strategies. Requires Level 2 completion.'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Modules ──────────────────────────────────────────────────────────────

INSERT INTO public.modules (id, level_id, title, "order", topic_tag) VALUES
  -- Level 1
  (
    'e9920e55-41d1-4b8c-825d-319ab7bb057a',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'PE Fundamentals',
    1,
    'pe-fundamentals'
  ),
  (
    'bc8b7100-7b80-4776-8908-10c3a75b04c7',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'Fund Structure',
    2,
    'fund-structure'
  ),
  (
    'da2f6072-da8c-45d9-bb2d-9ba7c0be2666',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'Key Players',
    3,
    'key-players'
  ),
  (
    'f5c0afb5-08aa-4b78-a8b9-ae0f004916a1',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'Deal Concepts',
    4,
    'deal-concepts'
  ),
  (
    '01b3b077-4f28-4c74-b189-25bff23f2c5d',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'Return Metrics',
    5,
    'return-metrics'
  ),
  -- Level 2 placeholder
  (
    '00ba3039-2fdc-45e3-9843-7bc95e0feedf',
    '3fc65f4e-c36e-4045-a7d3-583f8c5b8b07',
    'Intermediate Topics',
    1,
    'intermediate-topics'
  ),
  -- Level 3 placeholder
  (
    'd3a8c7e1-9b42-4f56-a234-1e2f3a4b5c6d',
    'c1d1a0f6-6a08-4199-8ba5-0c921847b9c3',
    'Expert Topics',
    1,
    'expert-topics'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Lessons ──────────────────────────────────────────────────────────────

INSERT INTO public.lessons (id, module_id, title, slug, mdx_path, "order", topic_tag) VALUES
  -- PE Fundamentals
  (
    'dc7a0788-e2e8-4f17-aabf-162a016eb747',
    'e9920e55-41d1-4b8c-825d-319ab7bb057a',
    'What is Private Equity?',
    'what-is-private-equity',
    'lessons/pe-fundamentals/what-is-private-equity.mdx',
    1,
    'pe-fundamentals'
  ),
  (
    '1b975c27-31dc-461e-b3a0-89f8b7dea260',
    'e9920e55-41d1-4b8c-825d-319ab7bb057a',
    'History of Private Equity',
    'history-of-pe',
    'lessons/pe-fundamentals/history-of-pe.mdx',
    2,
    'pe-fundamentals'
  ),
  -- Fund Structure
  (
    '62c8ead7-c025-4ba4-b597-c6494c8e86df',
    'bc8b7100-7b80-4776-8908-10c3a75b04c7',
    'How PE Funds Work',
    'how-pe-funds-work',
    'lessons/fund-structure/how-pe-funds-work.mdx',
    1,
    'fund-structure'
  ),
  (
    '2db0ba77-c7ca-4887-a3ab-65080803b039',
    'bc8b7100-7b80-4776-8908-10c3a75b04c7',
    'GP / LP Relationship',
    'gp-lp-relationship',
    'lessons/fund-structure/gp-lp-relationship.mdx',
    2,
    'fund-structure'
  ),
  -- Key Players
  (
    '6af7a6f5-5e08-475b-9bec-39eca20ac34f',
    'da2f6072-da8c-45d9-bb2d-9ba7c0be2666',
    'Who Are the Key Players?',
    'who-are-the-key-players',
    'lessons/key-players/who-are-the-key-players.mdx',
    1,
    'key-players'
  ),
  (
    '0c4cff32-be3e-4d2d-adc9-a9afe5ce789c',
    'da2f6072-da8c-45d9-bb2d-9ba7c0be2666',
    'Roles and Responsibilities',
    'roles-and-responsibilities',
    'lessons/key-players/roles-and-responsibilities.mdx',
    2,
    'key-players'
  ),
  -- Deal Concepts
  (
    'd238ba2e-a86f-42bc-9540-96c77804a7cc',
    'f5c0afb5-08aa-4b78-a8b9-ae0f004916a1',
    'Anatomy of a Deal',
    'anatomy-of-a-deal',
    'lessons/deal-concepts/anatomy-of-a-deal.mdx',
    1,
    'deal-concepts'
  ),
  (
    '6bba7f61-a25e-4e14-b61f-51c7270a0585',
    'f5c0afb5-08aa-4b78-a8b9-ae0f004916a1',
    'LBO Basics',
    'lbo-basics',
    'lessons/deal-concepts/lbo-basics.mdx',
    2,
    'deal-concepts'
  ),
  -- Return Metrics
  (
    '63d36670-9cf5-48fb-9af7-0535dcbc29d0',
    '01b3b077-4f28-4c74-b189-25bff23f2c5d',
    'Understanding MOIC',
    'understanding-moic',
    'lessons/return-metrics/understanding-moic.mdx',
    1,
    'return-metrics'
  ),
  (
    '780ced85-5736-4df9-ae2e-b729b1417660',
    '01b3b077-4f28-4c74-b189-25bff23f2c5d',
    'Understanding IRR',
    'understanding-irr',
    'lessons/return-metrics/understanding-irr.mdx',
    2,
    'return-metrics'
  ),
  -- Level 2 placeholder
  (
    '002c517a-afe0-47a4-8a22-23751a15fce0',
    '00ba3039-2fdc-45e3-9843-7bc95e0feedf',
    'Coming Soon',
    'intermediate-coming-soon',
    'lessons/intermediate-placeholder/coming-soon.mdx',
    1,
    'intermediate-topics'
  ),
  -- Level 3 placeholder
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'd3a8c7e1-9b42-4f56-a234-1e2f3a4b5c6d',
    'Coming Soon',
    'expert-coming-soon',
    'lessons/expert-placeholder/coming-soon.mdx',
    1,
    'expert-topics'
  )
ON CONFLICT (id) DO NOTHING;
