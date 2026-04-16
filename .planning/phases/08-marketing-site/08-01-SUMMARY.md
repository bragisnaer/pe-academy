---
phase: 08-marketing-site
plan: 08-01
subsystem: marketing
tags: [marketing, public-nav, homepage, seo]
key-files:
  created:
    - app/(marketing)/layout.tsx
    - app/(marketing)/page.tsx
    - components/public-nav.tsx
    - components/marketing-footer.tsx
    - app/robots.ts
    - app/sitemap.ts
    - supabase/migrations/20260415000001_anon_news_select.sql
  modified: []
decisions:
  - Route group app/(marketing)/ cleanly separates public pages from authenticated app/(app)/ routes
  - Server-side auth.getUser() redirect keeps logged-in users away from marketing pages without client exposure
  - Anon RLS policy on news_articles allows homepage news teaser without authentication
  - Static metadata export with openGraph and twitter.card for crawler-friendly SEO
metrics:
  tasks: 1
  files_changed: 0
  commits: 3
  duration: "verification only"
  completed: 2026-04-15
---

# Phase 8 Plan 01: Marketing Site Foundation Summary

Post-implementation verification of the marketing homepage committed in three pre-GSD commits. Route group architecture, PublicNav, MarketingFooter, hero section, live PE news teaser, features grid, social proof, and OG metadata — all verified against Phase 8 success criteria.

## Commits

| Hash | Description |
|------|-------------|
| `1e910c6` | Route group architecture (`app/(marketing)/`), SEO files, anon RLS migration |
| `6d98129` | PublicNav and MarketingFooter components |
| `23d420b` | Full marketing homepage (hero, news teaser, features, social proof, OG metadata) |

## Verification Results

| SC | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| SC-1 | Logged-out user visiting `/` sees homepage, not redirect to `/login` | PASS | `page.tsx:30-34` — `auth.getUser()` only redirects if `user` is truthy (logged in → `/dashboard`); unauthenticated requests fall through to render |
| SC-2 | Public nav renders Logo, Features, Pricing, Sign In (ghost), Get Started (primary) | PASS | `public-nav.tsx`: Logo "PE Academy" (line 10), Features `/#features` (line 15), Pricing `/pricing` (line 21), Sign In `variant: 'ghost'` (line 28), Get Started `variant: 'default'` (line 34) |
| SC-3 | Hero contains outcome-specific headline, sub-headline, and Get Started Free CTA | PASS | `page.tsx:60-71` — h1 "From PE Novice to Industry-Ready", sub-headline "The only structured PE curriculum...", CTA "Start Level 1 for Free" → `/signup` |
| SC-4 | Live strip of recent PE deal headlines visible without login | PASS | `page.tsx:43-53` — `news_articles` query with `.limit(4)` via server anon client; `20260415000001_anon_news_select.sql` grants SELECT to anon role |
| SC-5 | Page returns valid Open Graph and title metadata | PASS | `page.tsx:11-24` — `metadata` export with `openGraph.title`, `openGraph.description`, `openGraph.type: 'website'`, `twitter.card: 'summary_large_image'` |

## Deviations from Plan

None - plan executed exactly as written. This was a verification-only plan against pre-existing implementation. No code changes were needed or made.

## Known Stubs

None. The news teaser is fully wired to `news_articles` via anon RLS. Empty-state fallback renders "Live PE market data will appear here." when no articles are available — this is intentional, not a stub.

## Threat Flags

No new security surface discovered beyond what is documented in the plan's threat model:
- `T-08-01`: anon SELECT on `news_articles` — accepted; PE deal news is public information.
- `T-08-02`: server-side `auth.getUser()` redirect — mitigated; cannot be bypassed client-side.

## Self-Check: PASSED

Files verified present:
- `app/(marketing)/layout.tsx` — FOUND
- `app/(marketing)/page.tsx` — FOUND
- `components/public-nav.tsx` — FOUND
- `supabase/migrations/20260415000001_anon_news_select.sql` — FOUND

Commits verified:
- `1e910c6` — FOUND (route group architecture, SEO files, anon RLS migration)
- `6d98129` — FOUND (PublicNav and MarketingFooter components)
- `23d420b` — FOUND (full marketing homepage)
