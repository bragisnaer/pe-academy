# Research Summary - PE Academy v2.0 Public Launch

**Synthesized:** 2026-04-14
**Sources:** STACK.md, ARCHITECTURE.md, codebase (globals.css, 02-UI-SPEC.md)
**Note:** FEATURES.md and PITFALLS.md were not produced by parallel researchers. Content drawn from the two completed research files and direct codebase inspection.

---

## Executive Summary

PE Academy v2.0 converts a working internal learning tool into a publicly launchable product. Three things must happen: the existing dark-only app gains a proper theme system (light/dark toggle without flash), a credible marketing presence is built (homepage + pricing page), and freemium monetisation is wired up end-to-end via Stripe. The technical foundations are strong -- Tailwind v4 CSS variables and shadcn base-nova already define both dark and light tokens; the subscription gate pattern is already proven in the existing lesson system. None of v2.0 requires architectural invention -- it requires correct sequencing of known patterns.

The audience (finance professionals and career changers targeting PE roles) will judge credibility on first impression. The marketing site must signal professional-grade quality: tight typography, no animation gimmicks, clear value proposition, and a pricing page that removes ambiguity about what is free. The dark mode implementation must be invisible -- zero flash, system-preference-aware, persistent. Stripe integration must be bulletproof on the webhook side; a lost checkout.session.completed event means a paying user gets no access.

The build has a hard dependency chain. Theme system first (touches app/layout.tsx). Route group restructure before any new pages. Supabase migration before any Stripe code. Content gate after the subscription table. Marketing pages last. Skipping this sequence causes breakage.

---

## Stack Additions

### New packages -- install exactly these four

    npm install next-themes stripe @stripe/stripe-js @vercel/analytics

| Package | Version | Why |
|---------|---------|-----|
| next-themes | ^0.4.6 | Manages .dark class on html element, flash prevention via blocking inline script, localStorage persistence, system-preference detection. Cannot be replicated correctly by hand. |
| stripe | ^22.0.1 | Server-only Stripe Node SDK -- webhook verification, checkout session creation, billing portal. |
| @stripe/stripe-js | ^9.2.0 | Client-side Stripe.js loader. Required even for hosted Checkout (redirect flow). |
| @vercel/analytics | latest | Zero-config anonymous page-view tracking on Vercel. No consent banner required. |

### What NOT to add

| Do not add | Why |
|------------|-----|
| @stripe/react-stripe-js | Only needed for embedded Checkout. Hosted Checkout does not need it. |
| framer-motion | tw-animate-css already covers all needed animation. |
| Any second component library | shadcn blocks cover marketing needs; a second design system creates reconciliation debt. |
| prisma or any ORM | Supabase client is already in place. Two new tables need a migration file, not a new ORM. |
---

## Feature Table Stakes

### Marketing Homepage

| Element | Requirement | Rationale |
|---------|-------------|-----------|
| Hero headline | Outcome-specific (e.g. Break into Private Equity), not product-centric | Finance audience is outcome-driven |
| Sub-headline | One sentence on the mechanism | Credibility signal |
| Primary CTA | Get Started Free above the fold | Free tier removes friction |
| Social proof | Testimonial, user count, or named firm types | Finance candidates care about peer validation |
| Feature highlights | 3-column grid: LBO modelling, deal walkthroughs, interview prep | Sets expectation before pricing |
| Live news teaser | Card strip from /news feed -- recent PE deal headlines | Single strongest differentiator -- signals current-intelligence, not a static course |
| Pricing CTA | Visible path to /pricing before fold ends | Serious candidates self-qualify quickly |
| Public nav | Logo, Features, Pricing, Sign In (ghost), Get Started (primary) | Standard SaaS nav pattern |
| Dark mode toggle | In public nav header | Must work on marketing pages from day one |
| Footer | Copyright, Terms, Privacy | Legal requirement before public launch |

### Pricing Page

| Element | Requirement |
|---------|-------------|
| Two-tier comparison | Free vs Pro with clear visual hierarchy |
| Free tier feature list | Explicit: Level 1 only; what they can and cannot access |
| Pro tier feature list | Explicit: Levels 1+2+3, all content types |
| Price displayed prominently | No dark patterns; show the monthly number clearly |
| Single CTA per tier | Free: Get Started Free (to /signup). Pro: Upgrade to Pro (to checkout). |
| Cancellation note | Cancel anytime reduces friction for finance professionals |
| Auth-aware CTA | Logged-in free users see Upgrade; logged-out users see Get Started |

### Dark Mode -- must-have implementation elements

| Requirement | Detail |
|-------------|--------|
| No flash on load | next-themes injects a blocking inline script in head -- this is why the library is required, not optional |
| suppressHydrationWarning on html | Suppresses React hydration mismatch (server renders without class; client adds it) |
| mounted guard on ThemeToggle | Return same-size placeholder until after mount; prevents layout shift |
| defaultTheme dark | Preserves existing dark-first experience |
| attribute class | Matches existing @custom-variant dark directive in globals.css -- do not change strategy |
| Marketing pages use CSS variable tokens | Use bg-background, text-foreground -- NOT raw bg-zinc-950. Existing app pages can keep zinc for now. |

### Design System -- must-haves for finance credibility

| Requirement | Detail |
|-------------|--------|
| No decorative gradients or glassmorphism | Finance audience reads these as unprofessional |
| 4px-grid spacing discipline | Phase 2 UI spec spacing scale applies to marketing pages |
| Single accent colour for CTAs | One primary action colour per page |
| No stock photo collages | Typography as the hero element; photography only if authentic |
| Consistent card pattern | Use shadcn Card primitive; do not invent new card styles |

---

## Feature Differentiators

**1. Live PE news integration**
The app already has a /news route with real PE deal flow. Teasing this on the homepage -- a live card strip of recent deal headlines -- demonstrates current-intelligence, not a static course. No other PE prep product does this. This is the primary visual differentiator above the fold.

**2. Outcome specificity**
Generic edtech: Learn finance. PE Academy: Model a leveraged buyout. Walk through a live deal. Answer the carry question in an interview. Specificity at the skill level signals practitioner-built content.

**3. Dark-first aesthetic**
The existing dark theme reads as Bloomberg terminal, not Udemy. This is a deliberate brand signal to the target audience. The marketing site should default to dark mode to carry this signal from the first visit.

**4. Level 1 genuinely free (not a trial)**
Freemium with full Level 1 free converts better than a time-limited trial for this audience. Show the Level 1 content list to logged-out users -- what they get free, not just what they are missing.
---

## Architecture Highlights

### Build order (hard dependency chain)

Step 1 -- Theme system (no blockers)
  Install next-themes
  Create components/theme-provider.tsx (client boundary wrapper)
  Update app/layout.tsx: remove hard-coded dark class, add suppressHydrationWarning, add ThemeProvider
  Create components/theme-toggle.tsx with mounted guard
  Verify: toggle works, no hydration warning, no flash on reload

Step 2 -- Route group restructure (prerequisite for all new pages)
  Create app/(marketing)/layout.tsx with public nav shell
  Create app/(app)/layout.tsx with app nav shell
  Move existing routes under app/(app)/
  Update middleware protectedPaths to cover all app routes
  Verify: all existing routes still resolve, auth redirect still works

Step 3 -- Supabase subscription table
  Write migration: supabase/migrations/00003_user_subscriptions.sql
  Create lib/actions/subscription.ts with getUserSubscription()
  Verify: returns plan=free, status=none for a test user with no row

Step 4 -- Stripe webhook + checkout
  Install stripe and @stripe/stripe-js
  Create app/api/stripe/webhook/route.ts (raw body, signature verify, upsert)
  Create app/api/stripe/checkout/route.ts (session creation, return URL)
  Test locally: stripe listen --forward-to localhost:3000/api/stripe/webhook

Step 5 -- Content gate
  Update lessons/layout.tsx: add getUserSubscription() to existing Promise.all
  Pass subscription to LessonSidebar -- lock icons for Level 2/3 when plan=free
  Update lesson page: levelNumber > 1 and plan=free renders LockedLesson component
  Create components/locked-lesson.tsx -- teaser text + upgrade CTA

Step 6 -- Marketing homepage + pricing page
  Build app/(marketing)/page.tsx -- hero, features, news teaser, pricing CTA
  Build app/(marketing)/pricing/page.tsx -- tier comparison, Stripe checkout trigger
  Use CSS variable tokens throughout (bg-background, text-foreground, etc.)

### Key integration patterns

**next-themes + Tailwind v4**
The existing @custom-variant dark directive in globals.css is already correct for attribute=class. Remove the hard-coded dark class from the html element. Add suppressHydrationWarning. ThemeProvider must be a use-client wrapper component because layout.tsx is a Server Component and cannot import next-themes directly.

**Stripe webhook -- raw body is mandatory**
Use await req.text() NOT await req.json(). Stripe signature verification requires exact raw bytes. Using .json() means every webhook call returns 400. Test with Stripe CLI locally before merging.

**Route groups -- URLs are unaffected**
app/(marketing)/pricing/page.tsx produces the URL /pricing. Route group folder names never appear in URLs. All existing routes survive the restructure.

**Content gate -- server-side only**
Subscription status is checked in Server Components and Server Actions. Never in middleware (adds latency to every request) and never client-side (trivially bypassable). Pattern mirrors the existing getUnlockedLevelIds() call in lessons/layout.tsx -- add getUserSubscription() to the same Promise.all.

**Supabase service role in webhook**
The webhook handler has no user session. Use the service role Supabase client (bypasses RLS) for all writes. Never use the session client in webhook handlers.

**Middleware exclusion**
/api/stripe/webhook must not match any protectedPaths entry. Confirm the isProtected check uses startsWith and that /api/ is not in the protected list.
---

## Critical Pitfalls (Top 5)

**1. Webhook body read as JSON (severity: critical)**
Using req.json() instead of req.text() in the Stripe webhook handler silently breaks signature verification on every call. All checkout.session.completed events return 400 and no user gets access after paying. Prevention: always await req.text(). Test with Stripe CLI locally before any production deployment.

**2. Hard-coded dark class left on html element (severity: high)**
If the existing dark class is not removed from the html className when ThemeProvider is added, the dark class is always present and the toggle does nothing. suppressHydrationWarning suppresses the React error, making the bug silent. Prevention: the layout change is atomic -- remove dark from className AND add suppressHydrationWarning AND add ThemeProvider in the same commit.

**3. ThemeToggle rendered before mount (severity: high)**
useTheme() returns undefined on the server. Rendering the toggle immediately causes a hydration mismatch. Prevention: useState(false) + useEffect guard. Return a same-size placeholder until mounted.

**4. Marketing pages using raw zinc classes (severity: medium)**
bg-zinc-950 is always near-black regardless of theme. A light-mode user sees a dark marketing page. Prevention: marketing and pricing pages must use semantic tokens (bg-background, text-foreground, bg-card) throughout. Existing app pages can keep zinc values for v2.0.

**5. Stripe secret key exposed to client (severity: critical)**
STRIPE_SECRET_KEY must never be prefixed with NEXT_PUBLIC_. If it is, it is embedded in the client-side JS bundle. Prevention: only NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_...) is client-safe. All other Stripe keys must never be imported in use-client files.

---

## Open Questions

| Question | Recommendation |
|----------|----------------|
| What is the Pro price? | Monthly only for v2.0 -- simpler schema and pricing page. Add annual in v2.1. |
| Free-to-paid CTA on locked lesson pages? | Inline upgrade prompt (teaser + Upgrade button), not a silent lock icon. Converts better. |
| Display font for marketing headlines? | Decide before building the hero -- affects layout height and visual weight significantly. |
| Stripe test vs live keys on Vercel? | Test mode keys on preview environments; live keys only on production. Always. |
| Billing portal enabled? | Yes. Cancel anytime is a marketing claim; users must be able to do it self-serve. |
| Terms of Service + Privacy Policy? | Must exist before public launch. Use a legal template or SaaS (e.g. Iubenda). Do not delay launch over this. |

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|------------|-------|
| Theme system | HIGH | Verified against existing globals.css; confirmed next-themes v0.4.6 on npm; multiple 2025/2026 implementation guides |
| Stripe integration | HIGH | Official Stripe docs + multiple Next.js App Router guides; raw-body pattern well-documented |
| Route group restructure | HIGH | Standard Next.js App Router pattern; no edge cases for this project structure |
| Supabase subscription schema | HIGH | Simple two-tier model; minimal schema, well-understood |
| Marketing page copy and layout | MEDIUM | Technical architecture clear; actual copy and visual decisions need a dedicated pass |
| Feature prioritisation | MEDIUM | FEATURES.md not produced; recommendations synthesised from codebase context, not dedicated market research |

**Gaps:** No dedicated feature or pitfall research was completed (those researcher agents did not run). Validate pricing page structure against 2-3 comparable edtech/fintech pricing pages before finalising layout. Hero copy is a marketing decision, not a technical one -- allocate time for a copywriting pass before the homepage build step.

---

## Sources

- STACK.md -- .planning/research/STACK.md
- ARCHITECTURE.md -- .planning/research/ARCHITECTURE.md
- Phase 2 UI Spec -- .planning/phases/02-curriculum/02-UI-SPEC.md
- next-themes GitHub: https://github.com/pacocoursey/next-themes
- Stripe webhook + Next.js App Router: https://kitson-broadhurst.medium.com/next-js-app-router-stripe-webhook-signature-verification-ea9d59f3593f
- Stripe subscription lifecycle: https://dev.to/thekarlesi/stripe-subscription-lifecycle-in-nextjs-the-complete-developer-guide-2026-4l9d
- shadcn/ui Tailwind v4 dark mode: https://ui.shadcn.com/docs/dark-mode/next
