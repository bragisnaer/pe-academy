/**
 * Curriculum Taxonomy — Single Source of Truth
 *
 * This file defines all levels, modules, lessons, topic tags, and stable UUIDs
 * for the PE Academy curriculum. UUIDs are generated once and must never change —
 * they are the permanent identifiers used in the database and MDX frontmatter.
 *
 * DO NOT change UUIDs after they are written to MDX files or seeded to the DB.
 *
 * Structure:
 *   Level 1  — Foundations         (5 modules, 11 lessons)
 *   Level 2  — Financial Analysis  (1 module,   6 lessons)
 *   Level 3  — Valuation           (1 module,   5 lessons)
 *   Level 4  — Due Diligence       (1 module,   6 lessons)
 *   Level 5  — Value Creation      (1 module,  10 lessons)
 *   Level 6  — Exit Strategies     (1 module,   9 lessons)
 *   Level 7  — Fund Operations     (1 module,   9 lessons)
 *   Level 8  — Specialised Strat.  (1 module,  10 lessons)
 *   Level 9  — Global Markets      (1 module,   7 lessons)
 *   Level 10 — Mastery             (1 module,   9 lessons)
 *   Level 11 — Advanced           (10 modules, 48 lessons)
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
  description: string;
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
    name: "Foundations",
    slug: "foundations",
    description:
      "Core PE concepts — fund structure, key players, deal mechanics, and return metrics. No prior finance knowledge required.",
    uuid: "4d355fb9-493f-4101-9a9f-bc7ec6f85ca6",
  },
  {
    number: 2,
    name: "Financial Analysis",
    slug: "financial-analysis",
    description:
      "Read, interpret, and analyse financial statements through the lens of a PE investor. Understand the metrics PE firms use to evaluate businesses.",
    uuid: "68cca497-8e72-4064-9781-f387f05c8492",
  },
  {
    number: 3,
    name: "Valuation",
    slug: "valuation",
    description:
      "Understand how PE firms price and evaluate businesses using trading comps, precedent transactions, DCF, and LBO model construction.",
    uuid: "d348d0b0-a934-42b7-82ed-d95ce318cd15",
  },
  {
    number: 4,
    name: "Due Diligence",
    slug: "due-diligence",
    description:
      "Investigate targets before acquisition. Understand how commercial, financial, legal, operational, and ESG diligence feeds into deal decisions.",
    uuid: "84f9bd80-690c-4b2e-845f-bac3459e09c7",
  },
  {
    number: 5,
    name: "Value Creation",
    slug: "value-creation",
    description:
      "How PE firms improve businesses post-acquisition — from 100-day plans to buy-and-build strategy, pricing, and operational excellence.",
    uuid: "156004ab-c0e6-4690-9b7e-c695ccf5b16f",
  },
  {
    number: 6,
    name: "Exit Strategies",
    slug: "exit-strategies",
    description:
      "Selling portfolio companies and returning capital — trade sales, IPOs, secondary buyouts, dividend recaps, and exit preparation.",
    uuid: "ea48ac0c-0480-43dd-92d9-096a11ed3698",
  },
  {
    number: 7,
    name: "Fund Operations",
    slug: "fund-operations",
    description:
      "Running a PE firm — fundraising, LP relationships, fund terms, co-investments, GP economics, and regulatory framework.",
    uuid: "1be0566b-703c-41ab-ac96-49b024417378",
  },
  {
    number: 8,
    name: "Specialised Strategies",
    slug: "specialised-strategies",
    description:
      "Alternative PE approaches beyond buyouts — growth equity, private credit, distressed, infrastructure, secondaries, and ESG/impact.",
    uuid: "da8c23e6-04be-44ba-83e1-9bc07adb0bee",
  },
  {
    number: 9,
    name: "Global Markets",
    slug: "global-markets",
    description:
      "PE across geographies, currencies, and regulatory regimes — European and Asian markets, cross-border transactions, and macro cycles.",
    uuid: "878b07fd-c020-4bea-94c2-3a13270a5772",
  },
  {
    number: 10,
    name: "Mastery",
    slug: "mastery",
    description:
      "Senior-level synthesis — investment thesis construction, portfolio strategy, ethics, and career navigation in PE.",
    uuid: "cce5b1f3-b01d-492e-914d-3d3b8e447cce",
  },
  {
    number: 11,
    name: "Advanced",
    slug: "advanced",
    description:
      "Specialist deep dives for practitioners — financial modelling, behavioural finance, technology, people leadership, sector analysis, negotiation, accounting, restructuring, and tax structuring.",
    uuid: "37f39be5-11bd-43e6-b5dc-7366b920c3f4",
  },
];

// ─── Modules & Lessons ─────────────────────────────────────────────────────

export const MODULES: ModuleMeta[] = [

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 1 — FOUNDATIONS
  // ════════════════════════════════════════════════════════════════════

  {
    title: "PE Fundamentals",
    slug: "pe-fundamentals",
    levelNumber: 1,
    order: 1,
    topicTag: "pe-fundamentals",
    uuid: "e9920e55-41d1-4b8c-825d-319ab7bb057a",
    description: "The origins, structure, and current state of the private equity industry.",
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
      {
        title: "The Private Equity Landscape Today",
        slug: "pe-landscape-today",
        order: 3,
        topicTag: "pe-fundamentals",
        uuid: "e508fd0c-efc2-485e-9197-243e6d45711f",
      },
    ],
  },

  {
    title: "Key Players",
    slug: "key-players",
    levelNumber: 1,
    order: 2,
    topicTag: "key-players",
    uuid: "da2f6072-da8c-45d9-bb2d-9ba7c0be2666",
    description: "GPs, LPs, management teams, advisers, and lenders — who they are and what drives them.",
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

  {
    title: "Deal Concepts",
    slug: "deal-concepts",
    levelNumber: 1,
    order: 3,
    topicTag: "deal-concepts",
    uuid: "f5c0afb5-08aa-4b78-a8b9-ae0f004916a1",
    description: "How PE deals are structured and why leverage is the engine of buyout returns.",
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

  {
    title: "Fund Structure",
    slug: "fund-structure",
    levelNumber: 1,
    order: 4,
    topicTag: "fund-structure",
    uuid: "bc8b7100-7b80-4776-8908-10c3a75b04c7",
    description: "How PE funds are organised, governed, and wound down from first close to final distribution.",
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

  {
    title: "Return Metrics",
    slug: "return-metrics",
    levelNumber: 1,
    order: 5,
    topicTag: "return-metrics",
    uuid: "01b3b077-4f28-4c74-b189-25bff23f2c5d",
    description: "The MOIC and IRR calculations every PE professional lives by.",
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

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 2 — FINANCIAL ANALYSIS
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Financial Statements",
    slug: "financial-statements",
    levelNumber: 2,
    order: 1,
    topicTag: "financial-analysis",
    uuid: "9c8c8d22-d1f8-42ad-a03c-16bec3c681cb",
    description: "Read P&Ls, balance sheets, and cash flows through the lens of a PE investor.",
    locked: true,
    lessons: [
      {
        title: "Reading Financial Statements for PE",
        slug: "reading-financial-statements",
        order: 1,
        topicTag: "financial-analysis",
        uuid: "081238c4-056d-4702-81b0-6d6af56b4dab",
      },
      {
        title: "EBITDA Deep Dive",
        slug: "ebitda-deep-dive",
        order: 2,
        topicTag: "financial-analysis",
        uuid: "46f82db3-9f1f-46c5-b2f8-58a194d6300d",
      },
      {
        title: "Enterprise Value and Equity Value",
        slug: "enterprise-value-and-equity-value",
        order: 3,
        topicTag: "financial-analysis",
        uuid: "2daafb21-4eac-4cec-81c2-acd953b42904",
      },
      {
        title: "Debt Structures and Credit",
        slug: "debt-structures-and-credit",
        order: 4,
        topicTag: "financial-analysis",
        uuid: "41c3e5b3-3665-44b6-a215-5c6ed2a8d92a",
      },
      {
        title: "Working Capital Analysis",
        slug: "working-capital-analysis",
        order: 5,
        topicTag: "financial-analysis",
        uuid: "9b3d25f1-d1cb-41f9-8813-aec17bdc165a",
      },
      {
        title: "Free Cash Flow",
        slug: "free-cash-flow",
        order: 6,
        topicTag: "financial-analysis",
        uuid: "ed9cf07a-bf22-42a0-9cb8-f9a393255d93",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 3 — VALUATION
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Valuation Methods",
    slug: "valuation-methods",
    levelNumber: 3,
    order: 1,
    topicTag: "valuation",
    uuid: "c6f4f2c2-5831-4338-9dee-b00eb5c093eb",
    description: "Price businesses using trading comps, precedent transactions, DCF, and LBO models.",
    locked: true,
    lessons: [
      {
        title: "Comparable Company Analysis (Trading Comps)",
        slug: "comparable-company-analysis",
        order: 1,
        topicTag: "valuation",
        uuid: "cfab8446-d299-426a-a973-afc538691e73",
      },
      {
        title: "Precedent Transaction Analysis (Deal Comps)",
        slug: "precedent-transaction-analysis",
        order: 2,
        topicTag: "valuation",
        uuid: "93c9d2e5-dbdf-4c9d-b73f-196391b81fb6",
      },
      {
        title: "Discounted Cash Flow (DCF)",
        slug: "discounted-cash-flow",
        order: 3,
        topicTag: "valuation",
        uuid: "0829dff1-407b-4b07-8a9f-39b7baf03ca9",
      },
      {
        title: "LBO Model Construction",
        slug: "lbo-model-construction",
        order: 4,
        topicTag: "valuation",
        uuid: "5b0817ab-0165-4ff2-ba16-36fd6e412380",
      },
      {
        title: "Valuation in Practice",
        slug: "valuation-in-practice",
        order: 5,
        topicTag: "valuation",
        uuid: "da952df0-a25f-4d52-914f-4b6ab88fa418",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 4 — DUE DILIGENCE
  // Source: files2/04-level-4-due-diligence.md (expanded version)
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Due Diligence Deep Dive",
    slug: "due-diligence",
    levelNumber: 4,
    order: 1,
    topicTag: "due-diligence",
    uuid: "cb22daa1-068d-4237-b116-d0fb476be149",
    description: "Commercial, financial, legal, operational, and ESG diligence before signing.",
    locked: true,
    lessons: [
      {
        title: "Commercial Due Diligence",
        slug: "commercial-due-diligence",
        order: 1,
        topicTag: "due-diligence",
        uuid: "7847398c-ecb8-43c2-afde-d749db3fef8a",
      },
      {
        title: "Financial Due Diligence",
        slug: "financial-due-diligence",
        order: 2,
        topicTag: "due-diligence",
        uuid: "c1da2fca-e36f-4cfb-8ac9-76ea5863547c",
      },
      {
        title: "Legal Due Diligence",
        slug: "legal-due-diligence",
        order: 3,
        topicTag: "due-diligence",
        uuid: "6c35d8e3-675a-4372-8a5d-e42f15c61655",
      },
      {
        title: "Operational Due Diligence",
        slug: "operational-due-diligence",
        order: 4,
        topicTag: "due-diligence",
        uuid: "63bb7d5e-da5d-4510-98cd-85b99e7ef75e",
      },
      {
        title: "ESG Due Diligence",
        slug: "esg-due-diligence",
        order: 5,
        topicTag: "due-diligence",
        uuid: "ea6fe243-a8c6-404c-8fc9-ca19fbf9005d",
      },
      {
        title: "Red Flags and Deal Killers",
        slug: "red-flags-and-deal-killers",
        order: 6,
        topicTag: "due-diligence",
        uuid: "214e8fdc-86f9-4ebd-83e9-a4dc60eb7a59",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 5 — VALUE CREATION
  // Source: files/05 + files2/05b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Post-Acquisition Value Creation",
    slug: "value-creation",
    levelNumber: 5,
    order: 1,
    topicTag: "value-creation",
    uuid: "37c12a56-495a-4763-a49f-4d7f95216cef",
    description: "100-day plans, buy-and-build strategy, pricing levers, and portfolio governance.",
    locked: true,
    lessons: [
      {
        title: "The 100-Day Plan",
        slug: "the-100-day-plan",
        order: 1,
        topicTag: "value-creation",
        uuid: "b877d482-d64d-408f-8d80-b2be2c598e95",
      },
      {
        title: "Revenue Growth Strategies",
        slug: "revenue-growth-strategies",
        order: 2,
        topicTag: "value-creation",
        uuid: "a2c49be9-db34-43c9-94ec-d646fd168313",
      },
      {
        title: "Cost Optimisation and Margin Improvement",
        slug: "cost-optimisation-and-margin-improvement",
        order: 3,
        topicTag: "value-creation",
        uuid: "2b8e3e98-9bd2-40c3-bd6d-b774024411d7",
      },
      {
        title: "Management Incentivisation",
        slug: "management-incentivisation",
        order: 4,
        topicTag: "value-creation",
        uuid: "ae709e5a-84d7-46c2-b217-78dc691640fa",
      },
      {
        title: "Buy-and-Build Strategy",
        slug: "buy-and-build-strategy",
        order: 5,
        topicTag: "value-creation",
        uuid: "74706673-d3e3-46ee-9ee1-9b2a94e5abd0",
      },
      {
        title: "Digital Transformation as a Value Lever",
        slug: "digital-transformation-as-a-value-lever",
        order: 6,
        topicTag: "value-creation",
        uuid: "0e7de234-c1b2-4ded-aabe-f998a8124bb8",
      },
      {
        title: "Pricing Strategy as a Value Lever",
        slug: "pricing-strategy-as-a-value-lever",
        order: 7,
        topicTag: "value-creation",
        uuid: "b6da4a1a-6ef9-4380-9aad-c4e8708e617d",
      },
      {
        title: "Working Capital Optimisation",
        slug: "working-capital-optimisation",
        order: 8,
        topicTag: "value-creation",
        uuid: "dbf3b1f8-c536-4b22-a098-0930f5728b92",
      },
      {
        title: "Operational Excellence and Lean Principles",
        slug: "operational-excellence-and-lean-principles",
        order: 9,
        topicTag: "value-creation",
        uuid: "93a3e4ef-c029-410b-a89d-3df75e6a92ec",
      },
      {
        title: "Portfolio Company Governance",
        slug: "portfolio-company-governance",
        order: 10,
        topicTag: "value-creation",
        uuid: "df460ede-6671-47ab-9498-975fadf9ec2e",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 6 — EXIT STRATEGIES
  // Source: files/06 + files2/06b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Exit Execution",
    slug: "exit-execution",
    levelNumber: 6,
    order: 1,
    topicTag: "exit-strategies",
    uuid: "18dabde0-4e51-4e23-8583-c6ea372250b9",
    description: "Trade sales, IPOs, secondary buyouts, and how PE returns capital to investors.",
    locked: true,
    lessons: [
      {
        title: "Trade Sales",
        slug: "trade-sales",
        order: 1,
        topicTag: "exit-strategies",
        uuid: "821d7712-5bbd-4c81-aa6a-6775fdaa9e09",
      },
      {
        title: "Secondary Buyouts",
        slug: "secondary-buyouts",
        order: 2,
        topicTag: "exit-strategies",
        uuid: "03a5a8fe-bec3-4c7d-8602-05f428047a5e",
      },
      {
        title: "IPO Exit",
        slug: "ipo-exit",
        order: 3,
        topicTag: "exit-strategies",
        uuid: "73ac180c-07ae-4c02-9eda-48a222140f7a",
      },
      {
        title: "Dividend Recapitalisations",
        slug: "dividend-recapitalisations",
        order: 4,
        topicTag: "exit-strategies",
        uuid: "9e4322d3-a16a-45ad-9072-c99da6ee1682",
      },
      {
        title: "Timing the Exit",
        slug: "timing-the-exit",
        order: 5,
        topicTag: "exit-strategies",
        uuid: "d15863c5-d218-40a0-af8f-4b954504dc85",
      },
      {
        title: "Exit Preparation: Making a Company Sellable",
        slug: "exit-preparation",
        order: 6,
        topicTag: "exit-strategies",
        uuid: "46817706-9580-48f3-8bdc-b79317d7664b",
      },
      {
        title: "Sell-Side Process Management",
        slug: "sell-side-process-management",
        order: 7,
        topicTag: "exit-strategies",
        uuid: "55c2dd08-e3ce-490c-b5ab-270b44f74b1f",
      },
      {
        title: "Earn-Outs and Deferred Consideration",
        slug: "earn-outs-and-deferred-consideration",
        order: 8,
        topicTag: "exit-strategies",
        uuid: "fc79d2e4-ae51-4f7e-9cb6-57a409cdf089",
      },
      {
        title: "Partial Exits and Minority Sales",
        slug: "partial-exits-and-minority-sales",
        order: 9,
        topicTag: "exit-strategies",
        uuid: "585109e4-8baa-4029-a7ce-8d592f707e43",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 7 — FUND OPERATIONS
  // Source: files/07 + files2/07b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Running a PE Firm",
    slug: "running-a-pe-firm",
    levelNumber: 7,
    order: 1,
    topicTag: "fund-operations",
    uuid: "db54c1dc-6420-4601-8e58-494faeccf7fe",
    description: "Fundraising, fund terms, LP relationships, GP economics, and the regulatory framework.",
    locked: true,
    lessons: [
      {
        title: "The Fundraising Process",
        slug: "the-fundraising-process",
        order: 1,
        topicTag: "fund-operations",
        uuid: "cebceb12-1e95-47f1-99a9-4faae7987359",
      },
      {
        title: "Fund Terms and Negotiations",
        slug: "fund-terms-and-negotiations",
        order: 2,
        topicTag: "fund-operations",
        uuid: "1e1b462f-afe0-4cca-aeab-4531efb005d4",
      },
      {
        title: "Co-Investments",
        slug: "co-investments",
        order: 3,
        topicTag: "fund-operations",
        uuid: "57d13cb9-a2e0-4a18-8dd6-b4dd8ee52310",
      },
      {
        title: "GP Economics and Firm Building",
        slug: "gp-economics-and-firm-building",
        order: 4,
        topicTag: "fund-operations",
        uuid: "7ee5bb9e-86ca-433f-8ddb-141bba72cc76",
      },
      {
        title: "Regulatory Framework",
        slug: "regulatory-framework",
        order: 5,
        topicTag: "fund-operations",
        uuid: "c72abc79-fb8e-465a-853a-38c86d886fb5",
      },
      {
        title: "LP Due Diligence on GPs",
        slug: "lp-due-diligence-on-gps",
        order: 6,
        topicTag: "fund-operations",
        uuid: "10a5c9ad-e6f1-458f-a11b-11d7e508aaa5",
      },
      {
        title: "Fund Reporting and Valuation",
        slug: "fund-reporting-and-valuation",
        order: 7,
        topicTag: "fund-operations",
        uuid: "421d14e8-cf1a-46c3-8c6e-d2355380cf02",
      },
      {
        title: "GP-Led Secondaries: Advanced Structures",
        slug: "gp-led-secondaries-advanced-structures",
        order: 8,
        topicTag: "fund-operations",
        uuid: "f6eb68ca-76ea-48a0-9c4c-87cb650686bb",
      },
      {
        title: "Building a PE Firm: From First Fund to Institutional Platform",
        slug: "building-a-pe-firm",
        order: 9,
        topicTag: "fund-operations",
        uuid: "9318c78e-3a14-445a-adf1-d1d98573a4b6",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 8 — SPECIALISED STRATEGIES
  // Source: files/08 + files2/08b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Alternative PE Strategies",
    slug: "alternative-pe-strategies",
    levelNumber: 8,
    order: 1,
    topicTag: "specialised-strategies",
    uuid: "216d75a4-6fb9-47f3-b4f3-194d7b9207de",
    description: "Growth equity, private credit, distressed, infrastructure, secondaries, and real estate.",
    locked: true,
    lessons: [
      {
        title: "Growth Equity",
        slug: "growth-equity",
        order: 1,
        topicTag: "specialised-strategies",
        uuid: "d2929a38-20b4-448b-b6f1-5083712f09e5",
      },
      {
        title: "Private Credit and Direct Lending",
        slug: "private-credit-and-direct-lending",
        order: 2,
        topicTag: "specialised-strategies",
        uuid: "ccaad67d-ce5b-45e1-9893-3b3f46abad06",
      },
      {
        title: "Distressed and Turnaround Investing",
        slug: "distressed-and-turnaround-investing",
        order: 3,
        topicTag: "specialised-strategies",
        uuid: "2f76f8a2-ec71-423f-85de-46eeee9895a6",
      },
      {
        title: "Infrastructure Private Equity",
        slug: "infrastructure-private-equity",
        order: 4,
        topicTag: "specialised-strategies",
        uuid: "4b46f124-c6e4-4334-abe4-a7f6ce768d6d",
      },
      {
        title: "Secondaries",
        slug: "secondaries",
        order: 5,
        topicTag: "specialised-strategies",
        uuid: "83e17062-c6c1-46c5-8b15-a71a77b0d57e",
      },
      {
        title: "ESG and Impact Investing in PE",
        slug: "esg-and-impact-investing",
        order: 6,
        topicTag: "specialised-strategies",
        uuid: "4cc13006-977c-48d4-b34b-04c43d0d4d6c",
      },
      {
        title: "Corporate Carve-Outs",
        slug: "corporate-carve-outs",
        order: 7,
        topicTag: "specialised-strategies",
        uuid: "29cafa1d-1212-4f4b-91dd-6cacc34ae4a6",
      },
      {
        title: "Public-to-Private Transactions (Take-Privates)",
        slug: "public-to-private-transactions",
        order: 8,
        topicTag: "specialised-strategies",
        uuid: "dc5b4613-b10b-46c4-815b-2a5016bde9de",
      },
      {
        title: "Venture Capital: The Adjacent Asset Class",
        slug: "venture-capital-adjacent",
        order: 9,
        topicTag: "specialised-strategies",
        uuid: "a9db4d87-a1bf-45cd-b7f7-0ac243c45b99",
      },
      {
        title: "Real Estate Private Equity",
        slug: "real-estate-private-equity",
        order: 10,
        topicTag: "specialised-strategies",
        uuid: "b66d3f42-5cb3-4ad5-970c-7b86df5b05e3",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 9 — GLOBAL MARKETS
  // Source: files/09 + files2/09b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "PE Across Borders",
    slug: "pe-across-borders",
    levelNumber: 9,
    order: 1,
    topicTag: "global-markets",
    uuid: "dbd113c4-f69c-4fa0-86b3-2f5dd834c6bd",
    description: "Cross-border deal mechanics, European and Asian markets, currency risk, and macro cycles.",
    locked: true,
    lessons: [
      {
        title: "European Private Equity",
        slug: "european-private-equity",
        order: 1,
        topicTag: "global-markets",
        uuid: "296b9db2-92b4-40c2-b795-6368a345e009",
      },
      {
        title: "Asian PE Markets",
        slug: "asian-pe-markets",
        order: 2,
        topicTag: "global-markets",
        uuid: "1e7411ba-5c4d-4ab5-84c9-8484706db73a",
      },
      {
        title: "Cross-Border Transactions",
        slug: "cross-border-transactions",
        order: 3,
        topicTag: "global-markets",
        uuid: "34895de7-79a8-4c5b-bf05-34cd4fd2efe8",
      },
      {
        title: "Interest Rates, Credit Cycles, and PE",
        slug: "interest-rates-credit-cycles-and-pe",
        order: 4,
        topicTag: "global-markets",
        uuid: "a997c927-83b7-4451-aaf3-444b7d79ee64",
      },
      {
        title: "Emerging Markets PE",
        slug: "emerging-markets-pe",
        order: 5,
        topicTag: "global-markets",
        uuid: "82a915e5-8731-48b5-9156-5c387c0f4d7d",
      },
      {
        title: "Regulatory Divergence Across Jurisdictions",
        slug: "regulatory-divergence",
        order: 6,
        topicTag: "global-markets",
        uuid: "f1fb5774-0310-41a2-b843-05072f5eaf58",
      },
      {
        title: "Currency Risk Management in Detail",
        slug: "currency-risk-management",
        order: 7,
        topicTag: "global-markets",
        uuid: "798ed0b8-daaf-415a-8119-7b01bc4e65bc",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 10 — MASTERY
  // Source: files/10 + files2/10b merged
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Senior-Level Thinking",
    slug: "senior-level-thinking",
    levelNumber: 10,
    order: 1,
    topicTag: "mastery",
    uuid: "eed892e8-07c4-4dc1-a931-8d533dab1f9e",
    description: "Investment thesis construction, portfolio strategy, ethics, and career navigation.",
    locked: true,
    lessons: [
      {
        title: "Building an Investment Thesis",
        slug: "building-an-investment-thesis",
        order: 1,
        topicTag: "mastery",
        uuid: "16f2479b-4e7d-46d2-8584-bef5fdaf494a",
      },
      {
        title: "Portfolio Construction and Risk Management",
        slug: "portfolio-construction-and-risk-management",
        order: 2,
        topicTag: "mastery",
        uuid: "3d501b2e-8aab-4b81-882e-7af23ad4ae6b",
      },
      {
        title: "Ethics and Governance",
        slug: "ethics-and-governance",
        order: 3,
        topicTag: "mastery",
        uuid: "dee7115b-7a09-4ce8-9717-be7eb4a4a467",
      },
      {
        title: "The Future of Private Equity",
        slug: "the-future-of-private-equity",
        order: 4,
        topicTag: "mastery",
        uuid: "814b2646-27de-4c76-b5cc-cbce6004c9c1",
      },
      {
        title: "Career Navigation in PE",
        slug: "career-navigation-in-pe",
        order: 5,
        topicTag: "mastery",
        uuid: "5ddb577c-1e09-4f98-bfc0-5b2f576d205e",
      },
      {
        title: "Decision-Making Under Uncertainty",
        slug: "decision-making-under-uncertainty",
        order: 6,
        topicTag: "mastery",
        uuid: "634c5f0f-f107-47e0-afef-5d0dab6f5a7c",
      },
      {
        title: "LP Portfolio Strategy",
        slug: "lp-portfolio-strategy",
        order: 7,
        topicTag: "mastery",
        uuid: "04bf4099-a7ec-4414-8fb7-4a58caad840b",
      },
      {
        title: "PE's Role in the Economy: Evidence and Debate",
        slug: "pes-role-in-the-economy",
        order: 8,
        topicTag: "mastery",
        uuid: "ef3e1bf0-57ed-4135-89f7-28b6f7f38248",
      },
      {
        title: "The Next Decade: Emerging Themes",
        slug: "the-next-decade-emerging-themes",
        order: 9,
        topicTag: "mastery",
        uuid: "cd956f1d-f7c8-461f-9f60-d901838ed57e",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 11 — ADVANCED MODULES
  // ════════════════════════════════════════════════════════════════════

  {
    title: "Financial Modelling for Private Equity",
    slug: "advanced-financial-modelling",
    levelNumber: 11,
    order: 1,
    topicTag: "advanced-financial-modelling",
    uuid: "17812f0e-1410-4911-8a1d-90302608adbe",
    description: "Three-statement models, LBO construction, bolt-on modelling, and sensitivity analysis.",
    locked: true,
    lessons: [
      {
        title: "The Three-Statement Model",
        slug: "the-three-statement-model",
        order: 1,
        topicTag: "advanced-financial-modelling",
        uuid: "7c62a24c-e86f-4b01-97fc-91929a33849d",
      },
      {
        title: "The Debt Schedule",
        slug: "the-debt-schedule",
        order: 2,
        topicTag: "advanced-financial-modelling",
        uuid: "94f4f466-fab6-4acc-89fd-181529a26903",
      },
      {
        title: "The LBO Model: Putting It Together",
        slug: "the-lbo-model-putting-it-together",
        order: 3,
        topicTag: "advanced-financial-modelling",
        uuid: "6dd09170-b462-4592-bfcb-2b4a0ded0567",
      },
      {
        title: "Bolt-On Acquisition Modelling",
        slug: "bolt-on-acquisition-modelling",
        order: 4,
        topicTag: "advanced-financial-modelling",
        uuid: "26f4fb0a-7941-4118-a472-32a66049aff5",
      },
      {
        title: "Sensitivity Analysis and Scenario Planning",
        slug: "sensitivity-analysis-and-scenario-planning",
        order: 5,
        topicTag: "advanced-financial-modelling",
        uuid: "817039ba-6035-4bff-9730-ed2e3d9f6183",
      },
      {
        title: "Model Presentation Standards",
        slug: "model-presentation-standards",
        order: 6,
        topicTag: "advanced-financial-modelling",
        uuid: "a458a1f8-6228-4e52-b97f-b47e52ffea39",
      },
    ],
  },

  {
    title: "Behavioural Finance and Cognitive Biases in PE",
    slug: "advanced-behavioural-finance",
    levelNumber: 11,
    order: 2,
    topicTag: "advanced-behavioural-finance",
    uuid: "71fc7064-1f9a-446b-bad4-eeec5fb627c1",
    description: "The cognitive biases that distort PE deal-making and how to build resistant processes.",
    locked: true,
    lessons: [
      {
        title: "Why Biases Matter in PE",
        slug: "why-biases-matter-in-pe",
        order: 1,
        topicTag: "advanced-behavioural-finance",
        uuid: "f8fddada-4e28-4948-b95b-48b9dd729a0f",
      },
      {
        title: "The Core Biases in PE Deal-Making",
        slug: "core-biases-in-pe-deal-making",
        order: 2,
        topicTag: "advanced-behavioural-finance",
        uuid: "56badbc8-cd61-494a-96d1-0d7c981d7233",
      },
      {
        title: "Designing Bias-Resistant Investment Processes",
        slug: "designing-bias-resistant-investment-processes",
        order: 3,
        topicTag: "advanced-behavioural-finance",
        uuid: "24c15b8c-8224-4d17-ad88-5462e8effba3",
      },
    ],
  },

  {
    title: "Technology and the Digital GP",
    slug: "advanced-technology-digital-gp",
    levelNumber: 11,
    order: 3,
    topicTag: "advanced-technology-digital-gp",
    uuid: "208eed9e-17c3-4b25-8903-3a348a220f46",
    description: "AI deal sourcing, due diligence technology, portfolio monitoring, and cybersecurity.",
    locked: true,
    lessons: [
      {
        title: "AI-Powered Deal Sourcing",
        slug: "ai-powered-deal-sourcing",
        order: 1,
        topicTag: "advanced-technology-digital-gp",
        uuid: "c43593ad-326c-47f5-9322-200c4b95b6f2",
      },
      {
        title: "Due Diligence Technology",
        slug: "due-diligence-technology",
        order: 2,
        topicTag: "advanced-technology-digital-gp",
        uuid: "f4411160-dfa9-432f-b1c9-c6c7d0b5f355",
      },
      {
        title: "Portfolio Monitoring and Business Intelligence",
        slug: "portfolio-monitoring-and-business-intelligence",
        order: 3,
        topicTag: "advanced-technology-digital-gp",
        uuid: "6af489f9-70ce-44a5-9b73-af51d6a5c97e",
      },
      {
        title: "Technology in Value Creation",
        slug: "technology-in-value-creation",
        order: 4,
        topicTag: "advanced-technology-digital-gp",
        uuid: "9675ef36-6a1f-4379-8dc3-b2556e1a45e6",
      },
      {
        title: "Cybersecurity as a GP-Level Risk",
        slug: "cybersecurity-as-a-gp-level-risk",
        order: 5,
        topicTag: "advanced-technology-digital-gp",
        uuid: "7719fbc3-fa7b-4b1d-91a3-10aa7312f32e",
      },
    ],
  },

  {
    title: "People Leadership in PE-Backed Companies",
    slug: "advanced-people-leadership",
    levelNumber: 11,
    order: 4,
    topicTag: "advanced-people-leadership",
    uuid: "167a3841-959e-4bdc-a116-2cb9e4aa20a4",
    description: "Executive assessment, talent recruitment, org design, and performance management post-acquisition.",
    locked: true,
    lessons: [
      {
        title: "Executive Assessment",
        slug: "executive-assessment",
        order: 1,
        topicTag: "advanced-people-leadership",
        uuid: "f7d18278-218f-40ef-bc4d-178caa780182",
      },
      {
        title: "Talent Recruitment for Portfolio Companies",
        slug: "talent-recruitment-for-portfolio-companies",
        order: 2,
        topicTag: "advanced-people-leadership",
        uuid: "0e4164fc-c006-41ee-b8f6-e7b49795f3c7",
      },
      {
        title: "Organisational Design Post-Acquisition",
        slug: "organisational-design-post-acquisition",
        order: 3,
        topicTag: "advanced-people-leadership",
        uuid: "cc0fb69f-39be-49ee-9308-74348c01bb2b",
      },
      {
        title: "Performance Management in PE-Backed Companies",
        slug: "performance-management-in-pe-backed-companies",
        order: 4,
        topicTag: "advanced-people-leadership",
        uuid: "66571be3-5802-49a5-a3e9-fe24eaaa0aa9",
      },
    ],
  },

  {
    title: "Ethics Case Studies and Governance Failures",
    slug: "advanced-ethics-governance",
    levelNumber: 11,
    order: 5,
    topicTag: "advanced-ethics-governance",
    uuid: "751c0bfb-8f4a-4ef2-a065-53af63a9ee88",
    description: "Real-world governance failures analysed through an ethical and professional lens.",
    locked: true,
    lessons: [
      {
        title: "The Abraaj Group: LP Fund Misuse",
        slug: "the-abraaj-group",
        order: 1,
        topicTag: "advanced-ethics-governance",
        uuid: "07122cd3-831b-42f8-89e6-0cd50b9e6866",
      },
      {
        title: "Steward Health Care: PE and Patient Outcomes",
        slug: "steward-health-care",
        order: 2,
        topicTag: "advanced-ethics-governance",
        uuid: "7a06ce78-c4f8-47ea-833a-f2ff4bfb9b26",
      },
      {
        title: "Internal GP Conflicts: Carry Allocation Disputes",
        slug: "internal-gp-conflicts",
        order: 3,
        topicTag: "advanced-ethics-governance",
        uuid: "5571de12-e526-425f-9954-12bce5405026",
      },
      {
        title: "Debenhams and Toys \"R\" Us: Revisited as Governance Failures",
        slug: "debenhams-and-toys-r-us-governance",
        order: 4,
        topicTag: "advanced-ethics-governance",
        uuid: "e71ae3dc-444a-41ec-a939-7adcecd47801",
      },
      {
        title: "Ethical Framework for PE Professionals",
        slug: "ethical-framework-for-pe-professionals",
        order: 5,
        topicTag: "advanced-ethics-governance",
        uuid: "98a9808b-385b-480b-8101-8d45b902bfb4",
      },
    ],
  },

  {
    title: "Sector Deep Dives",
    slug: "advanced-sector-deep-dives",
    levelNumber: 11,
    order: 6,
    topicTag: "advanced-sector-deep-dives",
    uuid: "374617af-e149-436a-b8d1-9f8139a6fb06",
    description: "Sector-specific playbooks for software, healthcare, industrials, and financial services PE.",
    locked: true,
    lessons: [
      {
        title: "Software and Technology PE",
        slug: "software-and-technology-pe",
        order: 1,
        topicTag: "advanced-sector-deep-dives",
        uuid: "670ab8bc-f21b-4cc6-bcc5-9b0de385a78e",
      },
      {
        title: "Healthcare PE",
        slug: "healthcare-pe",
        order: 2,
        topicTag: "advanced-sector-deep-dives",
        uuid: "244d1ed8-f2b7-4432-90df-33a478a41927",
      },
      {
        title: "Industrial PE",
        slug: "industrial-pe",
        order: 3,
        topicTag: "advanced-sector-deep-dives",
        uuid: "d8eb3858-45d7-4987-9d0e-fc30fc5d0ec8",
      },
      {
        title: "Financial Services PE",
        slug: "financial-services-pe",
        order: 4,
        topicTag: "advanced-sector-deep-dives",
        uuid: "648e8b31-f976-4db2-90ac-565c8e091ae5",
      },
    ],
  },

  {
    title: "Negotiation and Deal Documentation",
    slug: "advanced-negotiation-documentation",
    levelNumber: 11,
    order: 7,
    topicTag: "advanced-negotiation-documentation",
    uuid: "93f1c4c2-76ae-4ac0-b362-787a5e39c18d",
    description: "SPA terms, reps and warranties, management equity, debt negotiation, and post-close disputes.",
    locked: true,
    lessons: [
      {
        title: "Negotiation Principles for PE",
        slug: "negotiation-principles-for-pe",
        order: 1,
        topicTag: "advanced-negotiation-documentation",
        uuid: "1f8dc247-a7f9-49c0-9e68-bb4c9d9e4322",
      },
      {
        title: "The Sale and Purchase Agreement (SPA)",
        slug: "the-sale-and-purchase-agreement",
        order: 2,
        topicTag: "advanced-negotiation-documentation",
        uuid: "506319f3-143c-4150-9048-1356af7d7c95",
      },
      {
        title: "Debt Negotiation",
        slug: "debt-negotiation",
        order: 3,
        topicTag: "advanced-negotiation-documentation",
        uuid: "bb7a217f-afa2-4b1d-b6b3-e25ca8effa08",
      },
      {
        title: "Management Equity Negotiation",
        slug: "management-equity-negotiation",
        order: 4,
        topicTag: "advanced-negotiation-documentation",
        uuid: "58de19bd-3e14-472d-a081-203b9f441d2a",
      },
      {
        title: "Post-Closing Disputes",
        slug: "post-closing-disputes",
        order: 5,
        topicTag: "advanced-negotiation-documentation",
        uuid: "3c6fadfb-5421-4266-87cd-c1ecd2795e7d",
      },
    ],
  },

  {
    title: "Accounting Judgement for PE Professionals",
    slug: "advanced-accounting-judgement",
    levelNumber: 11,
    order: 8,
    topicTag: "advanced-accounting-judgement",
    uuid: "1ac12421-1419-43db-8ca9-0d02ed6314f2",
    description: "Revenue recognition, lease accounting, goodwill, and the adjustments that move deal economics.",
    locked: true,
    lessons: [
      {
        title: "Revenue Recognition (IFRS 15 / ASC 606)",
        slug: "revenue-recognition",
        order: 1,
        topicTag: "advanced-accounting-judgement",
        uuid: "31386934-49ad-48f4-9774-34aa12ea3df9",
      },
      {
        title: "Lease Accounting (IFRS 16 / ASC 842)",
        slug: "lease-accounting",
        order: 2,
        topicTag: "advanced-accounting-judgement",
        uuid: "063bdd84-a22f-416b-9ae5-18601e0510e0",
      },
      {
        title: "Purchase Price Allocation and Goodwill",
        slug: "purchase-price-allocation-and-goodwill",
        order: 3,
        topicTag: "advanced-accounting-judgement",
        uuid: "8aab4f00-adf4-4b9b-b834-5f1d11a6e4ab",
      },
      {
        title: "Stock-Based Compensation",
        slug: "stock-based-compensation",
        order: 4,
        topicTag: "advanced-accounting-judgement",
        uuid: "b24d75f5-a892-42fa-a83b-4fc9ae877698",
      },
      {
        title: "Adjusted EBITDA: Bringing It All Together",
        slug: "adjusted-ebitda-bringing-it-all-together",
        order: 5,
        topicTag: "advanced-accounting-judgement",
        uuid: "ba7b7af2-76b5-4ade-92bc-adb261d07470",
      },
    ],
  },

  {
    title: "Restructuring and Distressed Situations",
    slug: "advanced-restructuring",
    levelNumber: 11,
    order: 9,
    topicTag: "advanced-restructuring",
    uuid: "a8aa3644-1281-44eb-bb68-c0cb11c21078",
    description: "Operational and financial restructuring across US Chapter 11, UK, EU/Nordic, and cross-border insolvency.",
    locked: true,
    lessons: [
      {
        title: "Universal Principles of Restructuring",
        slug: "universal-principles-of-restructuring",
        order: 1,
        topicTag: "advanced-restructuring",
        uuid: "04315241-0a75-4ba9-850f-5e2173a9fa9f",
      },
      {
        title: "US Restructuring: Chapter 11",
        slug: "us-restructuring-chapter-11",
        order: 2,
        topicTag: "advanced-restructuring",
        uuid: "4554b43e-c866-43a1-b8eb-37830d3d2045",
      },
      {
        title: "UK Restructuring",
        slug: "uk-restructuring",
        order: 3,
        topicTag: "advanced-restructuring",
        uuid: "e8e1833f-0baa-4179-b2cc-c7819fdb8c6d",
      },
      {
        title: "EU/Nordic Restructuring",
        slug: "eu-nordic-restructuring",
        order: 4,
        topicTag: "advanced-restructuring",
        uuid: "bd549eea-603a-4beb-9c62-dea0dd446a81",
      },
      {
        title: "Cross-Border Insolvency",
        slug: "cross-border-insolvency",
        order: 5,
        topicTag: "advanced-restructuring",
        uuid: "24b003f4-9223-41cc-b74e-ccce2ce57b50",
      },
    ],
  },

  {
    title: "Tax Structuring for PE Transactions",
    slug: "advanced-tax-structuring",
    levelNumber: 11,
    order: 10,
    topicTag: "advanced-tax-structuring",
    uuid: "f9ea113a-a477-4e5f-9e9e-9802f0284054",
    description: "Holding structures, interest deductibility, exit taxation, and carried interest — a global perspective.",
    locked: true,
    lessons: [
      {
        title: "Why Tax Matters in PE",
        slug: "why-tax-matters-in-pe",
        order: 1,
        topicTag: "advanced-tax-structuring",
        uuid: "8f67e354-3578-4206-ba7a-20f7361b45b1",
      },
      {
        title: "Holding Company Structures",
        slug: "holding-company-structures",
        order: 2,
        topicTag: "advanced-tax-structuring",
        uuid: "9834c6bb-d01b-42f8-8b6d-935e08cd3d88",
      },
      {
        title: "Interest Deductibility in the EU/Nordics",
        slug: "interest-deductibility-eu-nordics",
        order: 3,
        topicTag: "advanced-tax-structuring",
        uuid: "f97823c7-2531-461c-99d0-3893e061461b",
      },
      {
        title: "Exit Taxation in Europe",
        slug: "exit-taxation-in-europe",
        order: 4,
        topicTag: "advanced-tax-structuring",
        uuid: "585fab05-242d-41aa-9fe6-c3631d9666ec",
      },
      {
        title: "US Tax Considerations for PE",
        slug: "us-tax-considerations-for-pe",
        order: 5,
        topicTag: "advanced-tax-structuring",
        uuid: "20479634-ea27-4360-937d-8a80ce243804",
      },
      {
        title: "Carried Interest Taxation: The Global Debate",
        slug: "carried-interest-taxation",
        order: 6,
        topicTag: "advanced-tax-structuring",
        uuid: "fcb52707-d5c1-41e1-8803-75682edc5fd1",
      },
    ],
  },
];

// ─── Taxonomy lookup by topic_tag ──────────────────────────────────────────

export const TAXONOMY: Record<string, ModuleMeta> = Object.fromEntries(
  MODULES.map((m) => [m.topicTag, m])
);
