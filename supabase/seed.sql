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

-- ─── Quiz Questions (Level 1) ─────────────────────────────────────────────
-- 20 multiple-choice questions for Level 1 (Beginner), 4 per topic_tag.
-- correct_index is 0-based. options is a JSONB string array of exactly 4 items.
-- All rows use ON CONFLICT (id) DO NOTHING for idempotent re-runs.

INSERT INTO public.quiz_questions (id, level_id, topic_tag, question, options, correct_index, explanation) VALUES

  -- pe-fundamentals (4 questions)
  (
    'f1000001-0000-4000-a000-000000000001',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'Private equity firms primarily invest in:',
    '["Publicly listed stocks on major exchanges", "Companies not listed on public stock markets", "Government bonds and treasury bills", "Foreign currency and commodities"]',
    1,
    'PE firms invest in private companies — those not listed on public stock exchanges — allowing them to restructure and grow the business away from short-term public market pressures.'
  ),
  (
    'f1000001-0000-4000-a000-000000000002',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'Which of the following best describes a "portfolio company" in PE?',
    '["A fund''s limited partner investors", "A company that manages multiple PE funds", "A business owned or partially owned by a PE fund", "The PE firm''s internal investment committee"]',
    2,
    'A portfolio company is a business that a PE fund has invested in. The fund typically holds a controlling stake and works to improve operations before exiting.'
  ),
  (
    'f1000001-0000-4000-a000-000000000003',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'PE fundraising cycles are typically measured in:',
    '["Monthly tranches tied to index performance", "10-year fund lifecycles (invest then harvest)", "Quarterly earnings seasons like public equities", "Annual government budget cycles"]',
    1,
    'PE funds typically run on a 10-year lifecycle: a ~5-year investment period followed by a ~5-year harvest/exit period during which portfolio companies are sold.'
  ),
  (
    'f1000001-0000-4000-a000-000000000004',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'What distinguishes private equity from venture capital?',
    '["PE only invests in technology companies", "PE targets mature businesses; VC targets early-stage startups", "PE funds are smaller than VC funds on average", "VC uses leverage; PE does not"]',
    1,
    'PE typically acquires controlling stakes in established, cash-flow-positive businesses using leverage. VC backs early-stage startups with equity, accepting higher failure rates for outsized returns.'
  ),

  -- fund-structure (4 questions)
  (
    'f2000001-0000-4000-a000-000000000001',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'In a PE fund structure, who makes the investment decisions?',
    '["Limited Partners (LPs)", "The pension funds backing the vehicle", "The General Partner (GP)", "An independent advisory board"]',
    2,
    'The General Partner manages the fund and makes all investment decisions. LPs commit capital but have no say in day-to-day investment choices — hence the "limited" in limited partner.'
  ),
  (
    'f2000001-0000-4000-a000-000000000002',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A management fee of 2% in a PE fund is typically charged on:',
    '["Annual fund profits only", "The GP''s personal capital contribution", "Committed capital during the investment period", "The total market value of all exits"]',
    2,
    'Management fees (typically 1.5-2%) are charged on committed capital during the investment period, covering the GP''s operating costs regardless of fund performance.'
  ),
  (
    'f2000001-0000-4000-a000-000000000003',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'What is "dry powder" in the context of PE?',
    '["Uncalled capital committed by LPs but not yet invested", "Debt raised for a specific LBO transaction", "The GP''s share of carried interest earnings", "A fund''s unrealised portfolio losses"]',
    0,
    'Dry powder refers to committed but uninvested capital — money LPs have pledged to a fund that the GP has not yet called and deployed into investments.'
  ),
  (
    'f2000001-0000-4000-a000-000000000004',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A typical PE fund charges "2 and 20". What does the "20" refer to?',
    '["A 20% annual management fee on AUM", "20 basis points charged on each transaction", "20% carried interest on profits above the hurdle rate", "A 20-year fund lifecycle guarantee"]',
    2,
    'The "20" in "2 and 20" is 20% carried interest — the GP''s share of profits above the hurdle rate (typically 8%). It aligns the GP''s incentives with LP returns.'
  ),

  -- key-players (4 questions)
  (
    'f3000001-0000-4000-a000-000000000001',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'Which role is responsible for sourcing new investment opportunities at a PE firm?',
    '["CFO / Finance Controller", "Analyst processing deal documentation", "Managing Director / Partner leading BD", "IR Manager communicating with LPs"]',
    2,
    'Partners and Managing Directors lead business development and deal origination. They leverage their networks and sector expertise to find proprietary deal flow.'
  ),
  (
    'f3000001-0000-4000-a000-000000000002',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'A sovereign wealth fund investing in a PE fund is acting as:',
    '["A General Partner making investment decisions", "A Limited Partner providing capital", "A co-investor taking a direct stake in a deal", "An advisory board member reviewing deals"]',
    1,
    'Sovereign wealth funds are institutional investors — like pension funds and endowments — that act as Limited Partners, committing capital to PE funds managed by GPs.'
  ),
  (
    'f3000001-0000-4000-a000-000000000003',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'In a PE deal team, the Associate''s primary responsibility is:',
    '["Negotiating the final purchase price with the seller", "Financial modelling, due diligence, and deal execution support", "Managing LP relations and quarterly reporting", "Setting the fund''s overall investment strategy"]',
    1,
    'Associates are the analytical backbone of a deal team. They build financial models, coordinate due diligence workstreams, and support Managing Directors through deal execution.'
  ),
  (
    'f3000001-0000-4000-a000-000000000004',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'What is the primary role of an Operating Partner at a PE firm?',
    '["Raising capital from new LP investors", "Trading the firm''s public equity positions", "Working with portfolio companies to drive operational improvement", "Structuring the debt financing for LBO transactions"]',
    2,
    'Operating Partners are industry executives who work directly with portfolio companies post-acquisition to drive operational improvements — cost reduction, revenue growth, management upgrades — that create value before exit.'
  ),

  -- deal-concepts (4 questions)
  (
    'f4000001-0000-4000-a000-000000000001',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'In an LBO, what is the primary source of equity returns?',
    '["Dividend income received annually from the target", "Expansion of the purchase price multiple at exit alone", "Combination of debt paydown, EBITDA growth, and multiple expansion", "Currency gains on the leveraged financing"]',
    2,
    'LBO returns come from three levers: debt paydown (reducing leverage improves equity value), EBITDA growth (operational improvement), and multiple expansion (selling at a higher EV/EBITDA than purchase). Most returns require all three.'
  ),
  (
    'f4000001-0000-4000-a000-000000000002',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'What does "EBITDA" stand for?',
    '["Earnings Before Interest, Taxes, Dividends, and Amortisation", "Earnings Before Interest, Taxes, Depreciation, and Amortisation", "Enterprise Basis Including Total Debt and Assets", "Equity Before Interest, Tax, Depreciation, and Administration"]',
    1,
    'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortisation) is the standard PE metric for operating cash generation — it strips out financing costs, tax structure, and non-cash charges to compare businesses on an apples-to-apples basis.'
  ),
  (
    'f4000001-0000-4000-a000-000000000003',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'A PE firm signs an LOI (Letter of Intent) with a target company. What does this signal?',
    '["The deal has legally closed and capital has transferred", "The PE firm is entering exclusive negotiations and due diligence", "The PE firm has passed final investment committee approval", "Debt financing has been committed by the lending banks"]',
    1,
    'An LOI (also called a term sheet) signals that the buyer and seller have agreed on headline terms and the PE firm is entering a period of exclusivity to complete due diligence before a binding SPA.'
  ),
  (
    'f4000001-0000-4000-a000-000000000004',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'Which of these best describes a "bolt-on acquisition" in PE?',
    '["A PE firm''s initial control investment in a new sector", "A follow-on acquisition to expand an existing portfolio company", "A deal structured with no leverage (pure equity)", "A secondary sale of a fund interest between two LPs"]',
    1,
    'A bolt-on is an add-on acquisition where a PE-backed platform company acquires a smaller competitor or adjacent business. Bolt-ons build scale, add capabilities, and often allow the combined entity to exit at a higher multiple.'
  ),

  -- return-metrics (4 questions)
  (
    'f5000001-0000-4000-a000-000000000001',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'An investment of €10M returns €30M after 3 years. What is the MOIC?',
    '["1.5x", "2.0x", "3.0x", "0.33x"]',
    2,
    'MOIC (Multiple on Invested Capital) = Total Value Returned / Capital Invested = €30M / €10M = 3.0x. MOIC measures gross return but ignores the time taken to achieve it.'
  ),
  (
    'f5000001-0000-4000-a000-000000000002',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'Why is IRR preferred over MOIC when comparing investments of different durations?',
    '["IRR accounts for the time value of money; MOIC does not", "IRR is easier to calculate without a financial model", "MOIC is only used for debt investments; IRR is for equity", "IRR is always a larger number, making returns look better"]',
    0,
    'IRR (Internal Rate of Return) is an annualised return measure that reflects the time value of money. A 3x MOIC in 2 years is a much higher IRR than 3x in 7 years — MOIC alone cannot distinguish these.'
  ),
  (
    'f5000001-0000-4000-a000-000000000003',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'What is the "J-curve" effect in PE fund performance?',
    '["A fund''s returns that are negative in early years then rise as exits are realised", "A valuation methodology comparing public and private market multiples", "The GP''s carried interest schedule, which starts low and rises steeply", "A graphical representation of leverage ratios across a portfolio"]',
    0,
    'The J-curve describes how PE fund returns are negative in early years (management fees, write-downs before exits) and then rise sharply in later years as successful investments are realised. On a chart, this resembles the letter J.'
  ),
  (
    'f5000001-0000-4000-a000-000000000004',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'A PE fund achieves a 25% IRR over 5 years. What is the approximate gross MOIC?',
    '["~2.0x", "~3.1x", "~1.5x", "~4.5x"]',
    1,
    'Using the compound growth formula: a 25% IRR compounded over 5 years approximates (1.25)^5 ≈ 3.05x MOIC. This is why PE benchmarks target ~25% gross IRR — it typically delivers 3x+ over a standard fund lifecycle.'
  )

ON CONFLICT (id) DO NOTHING;

-- ─── Level Gates ──────────────────────────────────────────────────────────
-- Level 1 gate: requires 100% lesson completion and 70% quiz score to unlock Level 2.
-- ON CONFLICT (level_id) DO NOTHING — safe to run twice (level_id is UNIQUE).

INSERT INTO public.level_gates (level_id, required_completion_pct, required_quiz_score_pct)
VALUES ('4d355fb9-493f-4101-9a9f-bc7ec6f85ca6', 100, 70)
ON CONFLICT (level_id) DO NOTHING;
