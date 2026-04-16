# Quiz Content Request — PE Academy

## Overview

This document specifies all quiz content required across 11 levels. The system is fully built — it just needs the questions.

### Quiz mechanics
- **20 questions per quiz attempt**
- **5 sub-topics per level, 4 questions drawn randomly per sub-topic per attempt**
- **200 questions per level** (40 per sub-topic)
- Because 4 questions are drawn randomly from a pool of 40, no two attempts produce the same quiz — answer-sharing sites are useless
- All questions: multiple choice, 4 options, one correct answer

### Pass marks (set per level in the database)
| Level | Pass mark |
|-------|-----------|
| 1 | 70% (14/20) |
| 2 | 75% (15/20) |
| 3 | 75% (15/20) |
| 4 | 75% (15/20) |
| 5 | 80% (16/20) |
| 6 | 80% (16/20) |
| 7 | 80% (16/20) |
| 8 | 85% (17/20) |
| 9 | 85% (17/20) |
| 10 | 85% (17/20) |
| 11 | 90% (18/20) |

---

## Question format

Each question must be delivered in this exact JSON structure:

```json
{
  "topic_tag": "pe-fundamentals",
  "question": "Which of the following best describes a leveraged buyout?",
  "options": [
    "Acquiring a company using only equity capital",
    "Acquiring a company using a mix of equity and borrowed money",
    "Purchasing publicly listed shares on a stock exchange",
    "Merging two companies of equal size"
  ],
  "correct_index": 1,
  "explanation": "An LBO uses equity from the PE fund and debt from lenders. The debt is secured against the target's assets and repaid from its cash flows."
}
```

**Rules:**
- `correct_index` is 0-based (0 = first option, 1 = second, 2 = third, 3 = fourth)
- All 4 options must be plausible — no obviously wrong distractors
- `explanation` is shown after submission — 1–3 sentences on why the correct answer is right
- Questions test understanding and application, not rote definition recall
- Difficulty must be consistent with a candidate who has read the lesson material thoroughly
- No two questions should test the same concept in the same way
- Scenario-based questions ("A PE firm is evaluating...") are preferred over pure definition questions

**Style reference:** `content/level-1-questions.json` — these 20 questions set the quality bar. All future questions should match this standard.

---

## File naming and delivery

One JSON file per level, delivered as a flat array of question objects:

```
content/quiz/level-1-questions.json    ← Level 1 (top up to 200 — see below)
content/quiz/level-2-questions.json
content/quiz/level-3-questions.json
...
content/quiz/level-11-questions.json
```

---

## Level 1 — Foundations (PARTIAL — needs top-up)

**Level ID:** `4d355fb9-493f-4101-9a9f-bc7ec6f85ca6`
**Status:** 20 questions already exist in `content/level-1-questions.json`
**Required:** 180 additional questions (to reach 200 total)

| Sub-topic tag | Module | Questions needed |
|---------------|--------|-----------------|
| `pe-fundamentals` | PE Fundamentals | 36 more (4 exist already) |
| `key-players` | Key Players | 36 more (4 exist) |
| `deal-concepts` | Deal Concepts | 36 more (4 exist) |
| `fund-structure` | Fund Structure | 36 more (4 exist) |
| `return-metrics` | Return Metrics | 36 more (4 exist) |

Deliver the top-up questions in a separate file: `content/quiz/level-1-additional.json`

---

## Level 2 — Financial Analysis

**Level ID:** `68cca497-8e72-4064-9781-f387f05c8492`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `financial-analysis-statements` | P&L, balance sheet, cash flow statement structure and PE-specific interpretation |
| `financial-analysis-ebitda` | EBITDA, EBITDA adjustments, quality of earnings, bridge from EBIT |
| `financial-analysis-enterprise-value` | Enterprise value, equity value, bridge between them, net debt |
| `financial-analysis-debt` | Debt structures, senior/junior tranches, credit metrics, covenants |
| `financial-analysis-cashflow` | Free cash flow, working capital dynamics, capex intensity, cash conversion |

---

## Level 3 — Valuation

**Level ID:** `d348d0b0-a934-42b7-82ed-d95ce318cd15`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `valuation-trading-comps` | Comparable company analysis, selecting comps, applying multiples |
| `valuation-precedent-transactions` | Deal comps, control premiums, precedent transaction methodology |
| `valuation-dcf` | DCF construction, WACC, terminal value, sensitivity analysis |
| `valuation-lbo-model` | LBO model mechanics, entry/exit assumptions, returns attribution |
| `valuation-in-practice` | When to use which method, valuation ranges, real-world application |

---

## Level 4 — Due Diligence

**Level ID:** `84f9bd80-690c-4b2e-845f-bac3459e09c7`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `due-diligence-commercial` | Market sizing, competitive position, customer analysis, commercial DD framework |
| `due-diligence-financial` | Quality of earnings, normalisation, financial DD red flags |
| `due-diligence-legal` | SPA mechanics, warranty and indemnity, legal red flags |
| `due-diligence-operational` | Operational DD, management assessment, IT systems, supply chain |
| `due-diligence-esg` | ESG frameworks in PE, regulatory requirements, impact on valuation, deal killers |

---

## Level 5 — Value Creation

**Level ID:** `156004ab-c0e6-4690-9b7e-c695ccf5b16f`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `value-creation-100-day` | 100-day plan structure, prioritisation, quick wins vs. structural change |
| `value-creation-revenue` | Revenue growth levers, pricing strategy, commercial excellence |
| `value-creation-cost` | Cost optimisation, margin improvement, operational excellence |
| `value-creation-mna` | Buy-and-build strategy, bolt-on identification, integration planning |
| `value-creation-governance` | Management incentivisation, board structure, portfolio governance |

---

## Level 6 — Exit Strategies

**Level ID:** `ea48ac0c-0480-43dd-92d9-096a11ed3698`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `exit-trade-sale` | Trade sale process, buyer identification, strategic vs. financial buyers |
| `exit-ipo` | IPO mechanics, lock-ups, PE exit via public markets, timing considerations |
| `exit-secondary` | Secondary buyouts, GP-led secondaries, continuation funds |
| `exit-structuring` | Earn-outs, partial exits, dividend recaps, deferred consideration |
| `exit-preparation` | Exit readiness, vendor due diligence, sell-side process management |

---

## Level 7 — Fund Operations

**Level ID:** `1be0566b-703c-41ab-ac96-49b024417378`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `fund-operations-fundraising` | Fundraising process, LP targeting, road show, first close to final close |
| `fund-operations-terms` | LPA terms, management fee, carry, hurdle, LPAC, key-person provisions |
| `fund-operations-lp-relations` | LP reporting, investor relations, co-investment rights, LP types |
| `fund-operations-economics` | GP economics, carry mechanics, clawback, GP commitment, fee offsets |
| `fund-operations-regulatory` | AIFMD, SEC registration, regulatory obligations, fund reporting standards |

---

## Level 8 — Specialised Strategies

**Level ID:** `da8c23e6-04be-44ba-83e1-9bc07adb0bee`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `specialised-growth-equity` | Growth equity mechanics, minority vs. control, growth vs. buyout differences |
| `specialised-private-credit` | Direct lending, unitranche, mezzanine, private credit vs. bank lending |
| `specialised-distressed` | Distressed investing, turnaround mechanics, debt-to-equity, special situations |
| `specialised-infrastructure` | Infrastructure PE, concessions, regulated assets, infrastructure vs. buyout |
| `specialised-alternatives` | Secondaries, real estate PE, impact investing, ESG-linked structures |

---

## Level 9 — Global Markets

**Level ID:** `878b07fd-c020-4bea-94c2-3a13270a5772`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `global-european-pe` | European PE market, deal mechanics, DACH/Nordic/Southern Europe nuances |
| `global-asian-pe` | Asian PE markets, China/India/SEA, local vs. international GP dynamics |
| `global-cross-border` | Cross-border transactions, FX risk, regulatory divergence, carve-out complexity |
| `global-macro-cycles` | Credit cycles, interest rate impact on LBO returns, vintage year effects |
| `global-emerging-markets` | Emerging market PE, political risk, currency hedging, exit challenges |

---

## Level 10 — Mastery

**Level ID:** `cce5b1f3-b01d-492e-914d-3d3b8e447cce`
**Required:** 200 questions across 5 sub-topics (40 each)

| Sub-topic tag | What to test |
|---------------|-------------|
| `mastery-investment-thesis` | Thesis construction, sector selection, sourcing strategy, conviction building |
| `mastery-portfolio-strategy` | Portfolio construction, concentration vs. diversification, risk management at fund level |
| `mastery-ethics-governance` | PE ethics, conflicts of interest, governance standards, responsible investment |
| `mastery-future-pe` | Future of the asset class, AI/tech disruption, democratisation, macro headwinds |
| `mastery-career` | Career paths in PE, interview process, value-add in analyst/associate roles |

---

## Level 11 — Advanced

**Level ID:** `37f39be5-11bd-43e6-b5dc-7366b920c3f4`
**Required:** 200 questions — use the 10 existing topic tags (20 per tag)

This level has 10 distinct modules. Create 20 questions per tag. The quiz will draw 2 per topic = 20 per attempt.

| Sub-topic tag | Module |
|---------------|--------|
| `advanced-financial-modelling` | Financial Modelling for PE |
| `advanced-behavioural-finance` | Behavioural Finance and Cognitive Biases |
| `advanced-technology-digital-gp` | Technology and the Digital GP |
| `advanced-people-leadership` | People and Leadership |
| `advanced-ethics-governance` | Ethics and Governance |
| `advanced-sector-deep-dives` | Sector Deep Dives |
| `advanced-negotiation-documentation` | Negotiation and Documentation |
| `advanced-accounting-judgement` | Accounting Judgement |
| `advanced-restructuring` | Restructuring |
| `advanced-tax-structuring` | Tax Structuring |

---

## Case Studies

Two distinct formats — both valuable, serve different purposes.

---

### Format A: Case set questions (in the quiz)

A mini-scenario (1–2 paragraphs, fictional company + key financials) followed by 4 questions that all reference it. Counts toward the 200-question pool — one case set replaces 4 individual questions within a sub-topic.

**When to use:** Levels 5–11. Higher levels test application, not just recall.

**Required mix:**
| Levels | Minimum case set proportion |
|--------|-----------------------------|
| 1–4 | None — individual questions only |
| 5–7 | ≥10% of questions per sub-topic (4 of 40) |
| 8–11 | ≥25% of questions per sub-topic (10 of 40) |

**Case set format:**

```json
{
  "type": "case_set",
  "topic_tag": "value-creation-mna",
  "scenario": "Meridian Capital, a €2.5bn mid-market PE fund, acquired NordPack — a Scandinavian industrial packaging manufacturer — for €180M (9x EBITDA) in January 2022. NordPack generates €20M EBITDA with 60% recurring revenue from long-term supply contracts. Meridian's thesis is buy-and-build: acquire 3–4 bolt-ons over a 4-year hold to build a regional packaging platform and exit at 11–12x EBITDA. Twelve months in, Meridian has identified two targets: PackFast (€4M EBITDA, €28M asking price) and ScanBox (€6M EBITDA, €54M asking price, requires €8M capex integration).",
  "questions": [
    {
      "question": "Which acquisition offers the better entry multiple?",
      "options": ["PackFast at 7.0x", "ScanBox at 9.0x", "PackFast at 7.5x", "ScanBox at 7.5x"],
      "correct_index": 0,
      "explanation": "PackFast: €28M / €4M = 7.0x. ScanBox: €54M / €6M = 9.0x. PackFast is cheaper on entry, though ScanBox's larger scale may justify the premium depending on synergies."
    },
    {
      "question": "If ScanBox requires €8M capex to integrate, what is the all-in cost and effective multiple?",
      "options": [
        "€62M total, 10.3x EBITDA",
        "€54M total, 9.0x EBITDA",
        "€46M total, 7.7x EBITDA",
        "€62M total, 8.0x EBITDA"
      ],
      "correct_index": 0,
      "explanation": "All-in cost = €54M acquisition + €8M capex = €62M. Effective multiple = €62M / €6M EBITDA = 10.3x. Integration capex must be included in the true acquisition cost."
    },
    {
      "question": "Meridian underwrites €3M of annual synergies from acquiring both targets. On a combined basis (NordPack + PackFast + ScanBox), what is pro-forma EBITDA?",
      "options": ["€30M", "€33M", "€27M", "€32M"],
      "correct_index": 1,
      "explanation": "Combined EBITDA = €20M + €4M + €6M + €3M synergies = €33M. Synergy underwriting is standard in buy-and-build models but must be stress-tested — synergies are rarely fully achieved on schedule."
    },
    {
      "question": "At a 12x exit multiple on €33M pro-forma EBITDA, and assuming €120M of net debt at exit, what is the equity value at exit?",
      "options": ["€276M", "€396M", "€516M", "€156M"],
      "correct_index": 0,
      "explanation": "Enterprise value = 12x × €33M = €396M. Equity value = €396M − €120M net debt = €276M. The equity check paid was approximately €60M (€180M EV minus opening debt), implying a rough MOIC of ~4.6x before accounting for bolt-on equity."
    }
  ]
}
```

---

### Format B: Standalone case studies (separate content, `/case-studies` route)

Full deal walkthroughs — not quiz questions, but reading/study material. These live in the app's existing case study section.

**Structure per case study:**
1. **Company overview** — sector, size, geography, ownership background
2. **Investment thesis** — why the PE firm bought it, entry assumptions
3. **Capital structure** — sources and uses, leverage at entry
4. **Value creation plan** — 100-day priorities, key operational levers
5. **Outcome** — exit route, returns achieved, what worked and what didn't
6. **Lessons** — 3–5 takeaways linked to curriculum topics

**Volume:** 2–3 per level for Levels 3–11 (skip Levels 1–2 — too early for full deal walkthroughs).

**Real vs. fictional:** Fictional companies are preferred (no legal risk, easier to control the numbers). Use realistic industry sectors and geographically plausible names. Real companies can be referenced in passing (e.g., "similar to how Carlyle approached...") but the case subject itself should be fictional.

**Deliver as:** One MDX file per case study in `content/case-studies/`, using the same format as existing files in that directory.

---

## Priority order

1. **Level 1 top-up** (180 questions) — gates the free tier, highest urgency
2. **Level 2** — first Pro level, users unlock it immediately after Level 1
3. **Levels 3–5** — complete the core progression + first standalone case studies
4. **Levels 6–11** — complete the full platform + case sets mixed into question banks
