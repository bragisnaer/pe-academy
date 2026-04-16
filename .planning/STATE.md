---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: Internal Learning Platform ✅ SHIPPED
status: complete
last_updated: "2026-04-16T13:22:19.373Z"
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 3
  completed_plans: 4
  percent: 100
---

# PE Academy — Project State

_Last updated: 2026-04-15_

---

## Project Reference

**Core value**: PE Academy teaches finance professionals and career changers to break into private equity — through LBO modelling, deal walkthroughs, and interview prep. Level 1 is permanently free; Level 2 and 3 are Pro.

**Current milestone**: v2.0 — Public Launch ✅ COMPLETE

---

## Current Position

| Field | Value |
|-------|-------|
| Milestone | v2.0 — COMPLETE |
| Next milestone | v3.0 — TBD (run `/gsd-new-milestone`) |

**Progress (v2.0):**

```
Phase 7 [██████████] 100%  Design System ✓
Phase 8 [██████████] 100%  Marketing Site ✓
Phase 9 [██████████] 100%  Pricing Page ✓
```

---

## Milestone v2.0 Summary

v2.0 shipped 2026-04-15. PE Academy is now a public-facing product:

- CSS token design system with dark/light mode (next-themes, system preference detection)
- Route group split: `app/(marketing)/` vs `app/(app)/`
- Marketing homepage at `/` — hero, live PE news teaser, features grid, OG metadata
- Public `/pricing` — Free/Pro tiers, auth-aware CTAs, $29/month Pro, Cancel anytime visible
- WCAG AA compliance via semantic tokens and destructive token migration
- Stripe checkout deferred to v3.0

**Archive:** `.planning/milestones/v2.0-ROADMAP.md`

---

## Milestone v1.0 Summary

Phases 1–6 completed. The app is a working internal learning tool:

- Next.js App Router, Supabase auth, MDX lesson content
- Three levels (LBO Fundamentals, Deal Walkthroughs, Interview Mastery)
- /news route with live PE deal feed via pg_cron RSS ingest
- /interview-prep and /resources supporting content routes
- Dashboard with level cards and progress tracking

---

## Carried Forward Decisions (for v3.0)

- **Stripe**: Webhook handler must use `await req.text()` not `await req.json()`. Raw body mandatory for signature verification.
- **Stripe key**: `STRIPE_SECRET_KEY` must never have `NEXT_PUBLIC_` prefix.
- **Stripe webhook route**: `/api/stripe/webhook` must not appear in any `protectedPaths` middleware list.
- **Billing**: Annual billing deferred from v2.0 — plan for v3.0.
- **Legal pages**: Terms and Privacy must exist before any paid marketing push.
- **Pro price**: $29/month (confirmed in Phase 9).
- **Dark-first default**: `defaultTheme="dark"` — Bloomberg terminal aesthetic is deliberate brand signal.

## Deferred Items (non-blocking, acknowledged at v2.0 close)

| Item | Context |
|------|---------|
| Browser WCAG contrast check | text-destructive on bg-destructive/10 in light mode — confirm when deployed |
| OG card preview (Phase 8) | Paste deployed URL into opengraph.xyz — code correct, live URL needed |
| OG card preview (Phase 9) | Same — confirm when deployed |
| Stripe checkout (PRICE-03) | Disabled CTA placeholder — full integration is v3.0 primary goal |

---

## Blockers

None.

---

## Session Continuity

v2.0 milestone is archived. Next action: run `/gsd-new-milestone` to plan v3.0.
