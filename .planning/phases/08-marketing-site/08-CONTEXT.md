# Phase 8: Marketing Site - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning
**Mode:** Post-implementation context (work committed before GSD tracking — documenting existing implementation)

<domain>
## Phase Boundary

Phase 8 delivers a public-facing marketing homepage at `/` accessible without authentication. Work was implemented in three commits prior to GSD planning:

- `1e910c6` — Route group architecture (`app/(marketing)/`), SEO files, anon RLS migration
- `6d98129` — PublicNav and MarketingFooter components
- `23d420b` — Full marketing homepage (hero, news teaser, features, social proof, OG metadata)

The implementation is complete. This CONTEXT.md documents what was built and informs verification.

</domain>

<decisions>
## Implementation Decisions

### Route Architecture
- Split into `app/(marketing)/` route group — cleanly separated from authenticated `app/(app)/` routes
- `app/(marketing)/layout.tsx` wraps all marketing pages with PublicNav + MarketingFooter
- Logged-in users visiting `/` are redirected to `/dashboard` via server-side auth check
- Route group name does not appear in URLs

### Public Navigation
- PublicNav: sticky header, logo ("PE Academy"), Features anchor (/#features), Pricing link (/pricing), ThemeToggle, Sign In (ghost button), Get Started (primary button → /signup)
- Server component; ThemeToggle handles its own client boundary
- MarketingFooter: logo, copyright 2026, privacy and terms placeholder links

### Homepage Content
- Hero: outcome-first headline, sub-headline, Get Started Free CTA (→ /signup), trust signal
- News teaser: server-side query of `news_articles` via anon RLS, 4 cards with relative timestamps, empty-state fallback
- Features section: 3-column grid (Structured Curriculum, Quiz-Gated Levels, Live Market Context) with Lucide icons at `id="features"`
- Social proof: founder note section

### SEO & Metadata
- Static `metadata` export with OG title/description and Twitter card (`summary_large_image`)
- `app/robots.ts` — allows all crawlers
- `app/sitemap.ts` — lists `/` and `/pricing`

### Anon Data Access
- Migration `20260415000001_anon_news_select.sql` adds SELECT on `news_articles` for anon role
- News teaser uses `createClient()` with try/catch for graceful empty-state

### Claude's Discretion
Aesthetic and layout choices (column grid, spacing, typography) were made at implementation time.

</decisions>

<code_context>
## Existing Code Insights

**Key files:**
- `app/(marketing)/layout.tsx` — marketing layout wrapper
- `app/(marketing)/page.tsx` — homepage (server component, ~180 lines)
- `components/public-nav.tsx` — PublicNav component
- `components/marketing-footer.tsx` — MarketingFooter component
- `app/robots.ts` — robots.txt generation
- `app/sitemap.ts` — sitemap.xml generation
- `supabase/migrations/20260415000001_anon_news_select.sql` — anon RLS policy

**Semantic tokens used:** `bg-background`, `text-foreground`, `border-border` — consistent with Phase 7 design system.

</code_context>

<specifics>
## Specific Ideas

Implementation complete as specified in ROADMAP.md Phase 8 success criteria.

</specifics>

<deferred>
## Deferred Ideas

None within Phase 8 scope.

</deferred>
