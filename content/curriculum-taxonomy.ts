/**
 * Curriculum Taxonomy — Single Source of Truth
 *
 * This file defines all levels, modules, lessons, topic tags, and stable UUIDs
 * for the PE Academy curriculum. UUIDs are generated once and must never change —
 * they are the permanent identifiers used in the database and MDX frontmatter.
 *
 * DO NOT change UUIDs after they are written to MDX files or seeded to the DB.
 */

export interface LessonMeta {
  title: string;
  slug: string;
  order: number;
  topicTag: string;
  uuid: string;
}

export interface ModuleMeta {
  title: string;
  slug: string;
  levelNumber: number;
  order: number;
  topicTag: string;
  uuid: string;
  locked?: boolean;
  lessons: LessonMeta[];
}

export interface LevelMeta {
  number: number;
  name: string;
  slug: string;
  description: string;
  uuid: string;
}

// ─── Levels ────────────────────────────────────────────────────────────────

export const LEVELS: LevelMeta[] = [
  {
    number: 1,
    name: "Beginner",
    slug: "beginner",
    description:
      "Core PE concepts — fund structure, key players, deal mechanics, and return metrics. No prior finance knowledge required.",
    uuid: "4d355fb9-493f-4101-9a9f-bc7ec6f85ca6",
  },
  {
    number: 2,
    name: "Intermediate",
    slug: "intermediate",
    description:
      "Deeper dives into valuation, LBO modelling, deal process, and portfolio management. Requires Level 1 completion.",
    uuid: "3fc65f4e-c36e-4045-a7d3-583f8c5b8b07",
  },
  {
    number: 3,
    name: "Expert",
    slug: "expert",
    description:
      "Advanced fund economics, credit structures, cross-border deals, and exit strategies. Requires Level 2 completion.",
    uuid: "c1d1a0f6-6a08-4199-8ba5-0c921847b9c3",
  },
];

// ─── Modules & Lessons ─────────────────────────────────────────────────────

export const MODULES: ModuleMeta[] = [
  // ── Level 1 Module 1 ──
  {
    title: "PE Fundamentals",
    slug: "pe-fundamentals",
    levelNumber: 1,
    order: 1,
    topicTag: "pe-fundamentals",
    uuid: "e9920e55-41d1-4b8c-825d-319ab7bb057a",
    lessons: [
      {
        title: "What is Private Equity?",
        slug: "what-is-private-equity",
        order: 1,
        topicTag: "pe-fundamentals",
        uuid: "dc7a0788-e2e8-4f17-aabf-162a016eb747",
      },
      {
        title: "History of Private Equity",
        slug: "history-of-pe",
        order: 2,
        topicTag: "pe-fundamentals",
        uuid: "1b975c27-31dc-461e-b3a0-89f8b7dea260",
      },
    ],
  },

  // ── Level 1 Module 2 ──
  {
    title: "Fund Structure",
    slug: "fund-structure",
    levelNumber: 1,
    order: 2,
    topicTag: "fund-structure",
    uuid: "bc8b7100-7b80-4776-8908-10c3a75b04c7",
    lessons: [
      {
        title: "How PE Funds Work",
        slug: "how-pe-funds-work",
        order: 1,
        topicTag: "fund-structure",
        uuid: "62c8ead7-c025-4ba4-b597-c6494c8e86df",
      },
      {
        title: "GP / LP Relationship",
        slug: "gp-lp-relationship",
        order: 2,
        topicTag: "fund-structure",
        uuid: "2db0ba77-c7ca-4887-a3ab-65080803b039",
      },
    ],
  },

  // ── Level 1 Module 3 ──
  {
    title: "Key Players",
    slug: "key-players",
    levelNumber: 1,
    order: 3,
    topicTag: "key-players",
    uuid: "da2f6072-da8c-45d9-bb2d-9ba7c0be2666",
    lessons: [
      {
        title: "Who Are the Key Players?",
        slug: "who-are-the-key-players",
        order: 1,
        topicTag: "key-players",
        uuid: "6af7a6f5-5e08-475b-9bec-39eca20ac34f",
      },
      {
        title: "Roles and Responsibilities",
        slug: "roles-and-responsibilities",
        order: 2,
        topicTag: "key-players",
        uuid: "0c4cff32-be3e-4d2d-adc9-a9afe5ce789c",
      },
    ],
  },

  // ── Level 1 Module 4 ──
  {
    title: "Deal Concepts",
    slug: "deal-concepts",
    levelNumber: 1,
    order: 4,
    topicTag: "deal-concepts",
    uuid: "f5c0afb5-08aa-4b78-a8b9-ae0f004916a1",
    lessons: [
      {
        title: "Anatomy of a Deal",
        slug: "anatomy-of-a-deal",
        order: 1,
        topicTag: "deal-concepts",
        uuid: "d238ba2e-a86f-42bc-9540-96c77804a7cc",
      },
      {
        title: "LBO Basics",
        slug: "lbo-basics",
        order: 2,
        topicTag: "deal-concepts",
        uuid: "6bba7f61-a25e-4e14-b61f-51c7270a0585",
      },
    ],
  },

  // ── Level 1 Module 5 ──
  {
    title: "Return Metrics",
    slug: "return-metrics",
    levelNumber: 1,
    order: 5,
    topicTag: "return-metrics",
    uuid: "01b3b077-4f28-4c74-b189-25bff23f2c5d",
    lessons: [
      {
        title: "Understanding MOIC",
        slug: "understanding-moic",
        order: 1,
        topicTag: "return-metrics",
        uuid: "63d36670-9cf5-48fb-9af7-0535dcbc29d0",
      },
      {
        title: "Understanding IRR",
        slug: "understanding-irr",
        order: 2,
        topicTag: "return-metrics",
        uuid: "780ced85-5736-4df9-ae2e-b729b1417660",
      },
    ],
  },

  // ── Level 2 Placeholder ──
  {
    title: "Intermediate Topics",
    slug: "intermediate-placeholder",
    levelNumber: 2,
    order: 1,
    topicTag: "intermediate-topics",
    uuid: "00ba3039-2fdc-45e3-9843-7bc95e0feedf",
    locked: true,
    lessons: [
      {
        title: "Coming Soon",
        slug: "coming-soon",
        order: 1,
        topicTag: "intermediate-topics",
        uuid: "002c517a-afe0-47a4-8a22-23751a15fce0",
      },
    ],
  },

  // ── Level 3 Placeholder ──
  {
    title: "Expert Topics",
    slug: "expert-placeholder",
    levelNumber: 3,
    order: 1,
    topicTag: "expert-topics",
    uuid: "d3a8c7e1-9b42-4f56-a234-1e2f3a4b5c6d",
    locked: true,
    lessons: [
      {
        title: "Coming Soon",
        slug: "coming-soon",
        order: 1,
        topicTag: "expert-topics",
        uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      },
    ],
  },
];

// ─── Taxonomy lookup by topic_tag ──────────────────────────────────────────

export const TAXONOMY: Record<string, ModuleMeta> = Object.fromEntries(
  MODULES.map((m) => [m.topicTag, m])
);
