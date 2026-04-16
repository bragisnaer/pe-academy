---
phase: 08-marketing-site
verified: 2026-04-15T12:00:00Z
status: human_needed
score: 5/5
overrides_applied: 0
human_verification:
  - test: "Paste the deployed homepage URL into a social link previewer (e.g. opengraph.xyz or the LinkedIn post inspector)"
    expected: "Preview card shows title 'PE Academy — From Novice to Industry-Ready', the description 'The structured PE curriculum paired with live market context. Level 1 is free.', and a large-image Twitter card"
    why_human: "The ROADMAP SC explicitly requires confirmation via a live URL in a link previewer. The metadata export is structurally correct in code, but crawler rendering can only be confirmed against a deployed URL."
---

# Phase 8: Marketing Site — Verification Report

**Phase Goal:** A public-facing marketing homepage exists at /, accessible without authentication, with a working public nav, dark mode toggle, above-the-fold value proposition, live PE news teaser, and SEO metadata — served from a dedicated route group that is cleanly separated from the authenticated app.
**Verified:** 2026-04-15T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A logged-out user visiting / sees the marketing homepage — not a redirect to /login | VERIFIED | `app/(marketing)/page.tsx:32-34` — `if (user) { redirect('/dashboard') }`. Unauthenticated requests fall through to render; the redirect target is `/dashboard`, not `/login`. |
| 2 | The public nav renders Logo, Features, Pricing, Sign In (ghost), and Get Started (primary) links on every marketing page | VERIFIED | `components/public-nav.tsx`: Logo "PE Academy" `href="/"` (line 10), Features `href="/#features"` (line 15), Pricing `href="/pricing"` (line 21), Sign In `variant: 'ghost'` (line 29), Get Started `variant: 'default'` (line 35). All 5 elements present. Nav is mounted in `app/(marketing)/layout.tsx` which wraps every marketing page. |
| 3 | The homepage hero contains an outcome-specific headline, sub-headline, and a Get Started Free CTA above the fold | VERIFIED | `app/(marketing)/page.tsx:60-71` — h1 "From PE Novice to Industry-Ready", sub-headline `<p>` "The only structured PE curriculum paired with live market context.", CTA `<Link href="/signup">Start Level 1 for Free</Link>` with `variant: 'default'` button styling. |
| 4 | A live strip of recent PE deal headlines from /news data is visible on the homepage without requiring login | VERIFIED | `app/(marketing)/page.tsx:44-49` — server-side `supabase.from('news_articles').select('id, title, published_at, source_name').order('published_at', { ascending: false }).limit(4)` using the server `createClient()`. `supabase/migrations/20260415000001_anon_news_select.sql` grants `SELECT` on `public.news_articles` to the `anon` role (`TO anon`), enabling the query without authentication. Empty-state fallback is intentional, not a stub. |
| 5 | The page returns valid Open Graph and title metadata | VERIFIED (code) / human_needed (live preview) | `app/(marketing)/page.tsx:11-24` — `export const metadata: Metadata` with `title`, `openGraph.title`, `openGraph.description`, `openGraph.type: 'website'`, and `twitter.card: 'summary_large_image'`. Structurally complete. ROADMAP SC explicitly requires confirmation via live link previewer — see Human Verification Required. |

**Score:** 5/5 truths verified (SC-5 code-verified; live URL confirmation pending human test)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/(marketing)/page.tsx` | Marketing homepage with hero, news teaser, features, social proof, metadata export | VERIFIED | 181 lines; exports `metadata`, auth redirect, `news_articles` server query, hero, news teaser, features grid, social proof sections all present |
| `app/(marketing)/layout.tsx` | Marketing route group layout wrapping all public pages | VERIFIED | Imports and renders `PublicNav` and `MarketingFooter`; wraps `{children}` in `<main>` |
| `components/public-nav.tsx` | PublicNav with Logo, Features, Pricing, Sign In (ghost), Get Started (default) | VERIFIED | All 5 required elements present; also includes `ThemeToggle` for dark mode |
| `components/marketing-footer.tsx` | MarketingFooter | VERIFIED | Logo link, copyright, Privacy, Terms links |
| `app/robots.ts` | robots.txt allowing all crawlers | VERIFIED | `allow: '/'` for all user agents; sitemap URL with env fallback |
| `app/sitemap.ts` | sitemap.xml listing public pages | VERIFIED | Lists `/` and `/pricing` with `changeFrequency` and `priority` |
| `supabase/migrations/20260415000001_anon_news_select.sql` | Anon RLS policy for news_articles | VERIFIED | `CREATE POLICY "anon_select_news_articles" ON public.news_articles FOR SELECT TO anon USING (true)` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/(marketing)/layout.tsx` | `components/public-nav.tsx` | `PublicNav` import | WIRED | Line 1 imports `PublicNav`; line 11 renders `<PublicNav />` |
| `app/(marketing)/layout.tsx` | `components/marketing-footer.tsx` | `MarketingFooter` import | WIRED | Line 2 imports `MarketingFooter`; line 13 renders `<MarketingFooter />` |
| `app/(marketing)/page.tsx` | `news_articles` table | anon RLS on `news_articles` | WIRED | Server query at lines 44-49; anon SELECT policy in migration `20260415000001_anon_news_select.sql` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `app/(marketing)/page.tsx` (news teaser) | `newsArticles` | `supabase.from('news_articles').select(...).limit(4)` | Yes — DB query against live table with anon RLS | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — server-side Next.js component; cannot execute without running the dev server. Route and data wiring verified statically.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status |
|-------------|------------|-------------|--------|
| MKT-01 | 08-01-PLAN.md | Public homepage accessible without auth | SATISFIED |
| MKT-02 | 08-01-PLAN.md | Route group separation (marketing vs app) | SATISFIED |
| MKT-03 | 08-01-PLAN.md | Public navigation with required links | SATISFIED |
| MKT-04 | 08-01-PLAN.md | Above-the-fold hero with CTA | SATISFIED |
| MKT-05 | 08-01-PLAN.md | Live news teaser from news_articles without login | SATISFIED |
| MKT-06 | 08-01-PLAN.md | OG and Twitter metadata | SATISFIED (code) — live preview pending |
| MKT-07 | 08-01-PLAN.md | robots.ts and sitemap.ts SEO files | SATISFIED |

---

### Anti-Patterns Found

No blockers or warnings detected.

| File | Pattern | Severity | Notes |
|------|---------|----------|-------|
| `app/(marketing)/page.tsx:98-106` | Empty-state render path (`newsArticles.length === 0`) | Info | Intentional fallback per implementation decision; try/catch suppresses errors gracefully |

---

### Human Verification Required

#### 1. Open Graph metadata — live link previewer confirmation

**Test:** Deploy the site (or use a staging URL). Paste the homepage URL into a social card previewer such as [opengraph.xyz](https://www.opengraph.xyz) or the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

**Expected:** Preview card displays:
- Title: "PE Academy — From Novice to Industry-Ready"
- Description: "The structured PE curriculum paired with live market context. Level 1 is free."
- Card type: large image (Twitter `summary_large_image`)

**Why human:** The ROADMAP success criterion explicitly states "confirmed by pasting the URL into a link previewer." Crawlers evaluate rendered HTML from a live URL. The metadata export is structurally correct in source code, but this test requires a deployed URL and cannot be verified programmatically from the codebase alone.

---

### Gaps Summary

No gaps. All five success criteria are satisfied in code. The `human_needed` status reflects the ROADMAP's explicit requirement for live link previewer confirmation of SC-5 — not a code deficiency. Once the site is deployed, run the one human test above to close the phase.

---

_Verified: 2026-04-15T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
