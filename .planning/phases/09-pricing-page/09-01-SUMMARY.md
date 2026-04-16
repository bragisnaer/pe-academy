---
phase: 09-pricing-page
plan: 09-01
subsystem: marketing
tags: [pricing, marketing, auth-aware, stripe-deferred]
key-files:
  created:
    - app/(marketing)/pricing/page.tsx
  modified: []
decisions:
  - Stripe checkout deferred — disabled button with tooltip "Stripe checkout coming soon"
  - /pricing accessible to all users — no redirect in server component or middleware
  - Semantic tokens only — no raw Tailwind colour classes
metrics:
  tasks: 2
  files_changed: 1
  commits: 1
  duration: ~15min
  completed: 2026-04-15
---

# Phase 9 Plan 01: Pricing Page Summary

**One-liner:** Public /pricing server component with 2-column Free/Pro tier layout, auth-aware CTAs, and OG metadata — Stripe checkout deferred with disabled button and tooltip.

## What Was Built

Created `app/(marketing)/pricing/page.tsx` as a Next.js async server component inside the existing `(marketing)` route group. The page renders two pricing tiers side by side:

- **Free tier (left):** $0/forever, Level 1 included (checkmark icons), Levels 2 & 3 locked (lock icons + Pro badge)
- **Pro tier (right, highlighted):** $29/month, "Most Popular" badge, all levels included, "Cancel anytime." always visible below price

The page inherits `PublicNav` and `MarketingFooter` automatically from `app/(marketing)/layout.tsx`.

## Auth Pattern

Uses `createClient()` + `supabase.auth.getUser()` — identical to the homepage pattern but with **no redirect**. `/pricing` is intentionally accessible to both logged-out and logged-in users.

CTA behaviour:
- **Logged-out, Free tier:** "Get Started Free" link → `/signup`
- **Logged-in, Free tier:** "You're on Free" (non-interactive `<p>`)
- **Both states, Pro tier:** Disabled `<button>` wrapped in `<span title="Stripe checkout coming soon">` — cursor-not-allowed, opacity-60

## Stripe Deferral

The "Upgrade to Pro" CTA is a `disabled` HTML button with no form action or API call. Tooltip via `title` attribute on the wrapper span. No Stripe API routes, no `subscription_tier` DB column. Full checkout initiation is deferred to a future phase per CONTEXT.md.

## Middleware Verification (Task 2)

Confirmed `lib/supabase/middleware.ts`:
- `authOnlyPaths = ['/', '/login', '/signup']` — `/pricing` is NOT listed
- `protectedPaths = ['/lessons']` — `/pricing` is NOT listed
- No changes required. `/pricing` is accessible to all users by default.

## Semantic Tokens

All styling uses semantic tokens only. No raw colour classes (zinc, slate, red, blue, etc.):
- `text-foreground`, `text-muted-foreground`
- `bg-primary`, `text-primary-foreground`
- `border-primary`, `ring-primary`
- `bg-card`, `border-border`

## shadcn Components Used

`Card`, `CardHeader`, `CardContent`, `CardFooter` from `@/components/ui/card`
`buttonVariants` from `@/components/ui/button`
`cn` from `@/lib/utils`

## Deviations from Plan

None — plan executed exactly as written. The pre-existing `next build` Turbopack/webpack config error (present before this plan) was confirmed unrelated; build passes cleanly with `--webpack` flag and `/pricing` appears in route output.

## Verification Results

- `npx tsc --noEmit`: No errors (clean output)
- `npx next build --webpack`: Passed. `/pricing` appears as `ƒ /pricing` (dynamic server-rendered route)
- Pre-existing Turbopack error (missing `turbopack` config in next.config) confirmed pre-existing — not introduced by this plan

## Self-Check: PASSED

- [x] `app/(marketing)/pricing/page.tsx` exists and exports `metadata` + default async `PricingPage`
- [x] Commit `2bbbe7d` exists in git log
- [x] TypeScript clean
- [x] `/pricing` in build output
- [x] No raw colour classes used
- [x] Free tier: Level 1 included (Check), Levels 2&3 locked (Lock + Pro badge)
- [x] Pro tier: $29/month, "Cancel anytime.", all levels with Check icons, disabled CTA
- [x] Auth-aware: logged-out sees "Get Started Free", logged-in sees "You're on Free"
