# Architecture: Dark Mode, Stripe Subscriptions, Marketing Pages

**Project:** PE Academy v2.0 Public Launch
**Researched:** 2026-04-14
**Confidence:** HIGH (verified against Next.js 16 App Router patterns, next-themes docs, Stripe official docs, existing codebase)

---

## 1. Theme System

### Constraint: Tailwind v4 + existing `.dark` class + shadcn base-nova

The app already ships a complete `.dark` CSS block in `globals.css` using `oklch` tokens mapped to shadcn CSS variables. The root layout hard-codes `className="dark"` on `<html>`. The existing `@custom-variant dark (&:is(.dark *))` directive already matches the class-based strategy. This is the right foundation — next-themes will manage toggling that class.

**Do not switch to `data-theme` strategy.** The existing `@custom-variant` and all shadcn component styles assume `.dark` class. Changing the strategy would require rewriting the variant directive and auditing every component. Stick with `attribute="class"`.

### What needs to change

**globals.css — no change required.** The existing `@custom-variant dark (&:is(.dark *))` works with next-themes `attribute="class"`. The `.dark` CSS block is already defined with correct token values.

**app/layout.tsx — two changes:**

1. Remove the hard-coded `dark` class from `<html>` and add `suppressHydrationWarning`.
2. Add `<ThemeProvider>` inside `<body>`.

```
BEFORE:
  <html lang="en" className={`${inter.variable} dark`}>
    <body ...>
      {children}
    </body>
  </html>

AFTER:
  <html lang="en" className={inter.variable} suppressHydrationWarning>
    <body ...>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </body>
  </html>
```

`defaultTheme="dark"` preserves the existing dark-first experience. `enableSystem` lets users who set their OS to dark mode get dark without a toggle interaction.

**New file: `components/theme-provider.tsx`**

```tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}
```

This is the required client boundary wrapper. `layout.tsx` is a Server Component — it cannot import next-themes directly because next-themes is a client library. The wrapper carries `"use client"` so the server layout can render it without errors.

**New file: `components/theme-toggle.tsx`**

```tsx
"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" /> // prevent layout shift

  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {/* Sun/Moon icon from lucide-react */}
    </button>
  )
}
```

The `mounted` guard is required. On the server, `resolvedTheme` is undefined because the cookie/localStorage hasn't been read yet. Rendering a placeholder of identical dimensions prevents layout shift.

### Zinc styles preservation

The existing lesson sidebar, lesson content, and dashboard all use direct `zinc-*` classes (e.g. `bg-zinc-900`, `border-white/10`). These are **not** affected by next-themes because they are not dark-mode toggled — they are just zinc colours. These components will look identical in both modes until you explicitly add light-mode overrides. That is acceptable for v2.0 scope: ship dark-first, fix light mode per-component in a follow-up pass.

The marketing pages and pricing page should be built using the CSS variable tokens (`bg-background`, `text-foreground`, `bg-card`, etc.) rather than raw zinc values so they respect both themes correctly from day one.

### Data flow — theme

```
User clicks toggle
  → ThemeToggle calls setTheme("light")
  → next-themes writes to localStorage + sets class on <html>
  → Tailwind's @custom-variant dark re-evaluates → light tokens apply
  → Next page load: ThemeProvider reads localStorage before first paint
  → No flash (next-themes injects inline script in <head> for this)
```

---

## 2. Stripe + Supabase Subscription Gate

### New Supabase table: `user_subscriptions`

Add a migration. This table is the source of truth for subscription state — the webhook writes here, server components read here.

```sql
CREATE TABLE public.user_subscriptions (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id       TEXT NOT NULL,
  stripe_subscription_id   TEXT NOT NULL UNIQUE,
  stripe_price_id          TEXT NOT NULL,
  status                   TEXT NOT NULL,  -- 'active' | 'canceled' | 'past_due' | 'trialing'
  plan                     TEXT NOT NULL,  -- 'pro' (covers levels 2+3)
  current_period_start     TIMESTAMPTZ NOT NULL,
  current_period_end       TIMESTAMPTZ NOT NULL,
  canceled_at              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)  -- one active subscription per user; update in place on renewal
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Webhook handler uses service_role key (bypasses RLS) for writes.

CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id
  ON public.user_subscriptions(stripe_subscription_id);
```

**Why `UNIQUE(user_id)` not a multi-row history table?** PE Academy has two tiers (free / pro). A single current-state row is sufficient. The webhook upserts into this row on every relevant event, keeping it current. No history needed for v2.0.

### Webhook handler: `app/api/stripe/webhook/route.ts`

This is a standard Next.js Route Handler. It must be excluded from middleware session refresh (it has no auth cookie, it uses the service role key directly).

```
app/
  api/
    stripe/
      webhook/
        route.ts      ← NEW
      checkout/
        route.ts      ← NEW (creates Checkout Session)
```

Key implementation requirements for the webhook handler:

1. **Read raw body with `await req.text()`** — `req.json()` breaks Stripe signature verification because it re-serialises. This is the most common mistake.
2. **Verify with `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)`**
3. **Use Supabase service role client** (not the user session client) — webhook has no auth cookie.
4. **Upsert on `stripe_subscription_id`**, update `status` and `current_period_end` on renewals.

Events to handle:

| Stripe Event | Action |
|---|---|
| `checkout.session.completed` | Create subscription row, set `status = 'active'` |
| `customer.subscription.updated` | Update status, period dates |
| `customer.subscription.deleted` | Set `status = 'canceled'`, set `canceled_at` |
| `invoice.payment_failed` | Set `status = 'past_due'` |

Return `{ received: true }` with HTTP 200 on success; HTTP 400 on signature failure.

**Middleware exclusion:** The existing middleware calls `updateSession()` which reads auth cookies. The webhook route has no session and should not be redirected. The existing matcher regex already excludes API routes implicitly because it matches all non-static paths. However, explicitly document that `/api/stripe/webhook` must never be behind an auth redirect. Verify the middleware `protectedPaths` array does not cover `/api/`.

### Checkout session creation: `app/api/stripe/checkout/route.ts`

A POST handler that:
1. Reads session via Supabase (server client with cookie).
2. Gets or creates a Stripe customer for the user (store `stripe_customer_id` in `user_subscriptions` or `profiles`).
3. Creates a `stripe.checkout.sessions.create(...)` with `mode: 'subscription'`, the pro price ID, and `success_url` / `cancel_url`.
4. Returns `{ url }` — client redirects to Stripe-hosted checkout.

**Why a Route Handler not a Server Action?** Server Actions redirect within the Next.js tree. Stripe checkout requires a redirect to `checkout.stripe.com`. A Server Action can do this with `redirect()`, but the pattern is cleaner as a Route Handler that returns the URL so the client controls the redirect. Either works; Route Handler is more explicit.

### Content gate: where subscription status is checked

**Do not gate in middleware.** Middleware runs on every request and adding a Supabase query there would add ~50-100ms to every page load. The existing middleware only does session refresh and two redirect checks — keep it that way.

**Gate in Server Components and Server Actions.** The pattern already established in `lessons/layout.tsx` (calling `getUnlockedLevelIds()`) is the correct model.

New server action: `lib/actions/subscription.ts`

```ts
'use server'
export async function getUserSubscription(): Promise<{ plan: 'free' | 'pro', status: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.id)
    .single()

  if (!data) return { plan: 'free', status: 'none' }

  const isActive = data.status === 'active' && new Date(data.current_period_end) > new Date()
  return { plan: isActive ? 'pro' : 'free', status: data.status }
}
```

**Where this gets called:**

- `lessons/layout.tsx` — already fetches `getUnlockedLevelIds()`. Add `getUserSubscription()` to the `Promise.all`. Pass `subscription` prop to `LessonSidebar` for locked-level UI.
- Individual lesson page (`lessons/[moduleSlug]/[lessonSlug]/page.tsx`) — check if the lesson's level requires pro; if so and user is free, render locked state instead of content.
- Dashboard page — show upgrade CTA if subscription is free.

### Data flow — subscription gate

```
User signs up
  → Level 1 auto-unlocked (existing trigger)
  → user_subscriptions row: none (free tier by default)

User clicks "Upgrade"
  → POST /api/stripe/checkout
  → Server creates Checkout Session → returns URL
  → Client redirects to Stripe
  → User pays

Stripe fires checkout.session.completed
  → POST /api/stripe/webhook
  → Webhook upserts user_subscriptions: status='active', plan='pro'

Next request to /lessons/[level-2-lesson]
  → lessons/layout.tsx calls getUserSubscription() → { plan: 'pro' }
  → Lesson content renders normally

User cancels subscription
  → Stripe fires customer.subscription.deleted
  → Webhook sets status='canceled'
  → Next lesson request: getUserSubscription() → { plan: 'free' }
  → Level 2/3 lessons render locked state
```

### Locked lesson UI

The lesson page server component gets the lesson's level number from Velite content metadata. It checks:

```
lesson.levelNumber > 1 && subscription.plan === 'free'
  → render <LockedLesson /> (not the MDX content)
```

`<LockedLesson />` is a simple Server Component: teaser text, upgrade CTA button pointing to `/pricing`. No client JS required.

The sidebar (`LessonSidebar`) receives the subscription plan as a prop (passed from `lessons/layout.tsx`) and renders a lock icon on Level 2 and Level 3 module groups when `plan === 'free'`. This is already the right shape — it mirrors the existing `unlockedLevelIds` pattern.

---

## 3. Route Layout Split — Public vs Auth

### Current problem

The root `app/page.tsx` is currently the login/marketing page. With a real marketing homepage, this page needs to become a full marketing site with its own nav (public nav: logo, Features, Pricing, Sign In, Get Started CTA). The app (dashboard, lessons, etc.) has a different nav.

The middleware currently redirects authenticated users away from `/` to `/dashboard`. This redirect must stay — authenticated users should not land on the marketing homepage.

### New route group structure

```
app/
  (marketing)/
    layout.tsx          ← NEW: public nav, footer, no auth required
    page.tsx            ← homepage (moved/rewritten from app/page.tsx)
    pricing/
      page.tsx          ← NEW: /pricing
  (app)/
    layout.tsx          ← NEW: app nav (existing shell from lessons nav)
    dashboard/
      page.tsx          ← moved
    lessons/
      layout.tsx        ← stays, nested inside (app)/layout
      [moduleSlug]/
        [lessonSlug]/
          page.tsx
    news/
      page.tsx
    case-studies/
    glossary/
    interview-prep/
    resources/
  (auth)/               ← already exists
    layout.tsx
    login/
    signup/
  api/
    stripe/
      webhook/
        route.ts        ← NEW
      checkout/
        route.ts        ← NEW
    auth/               ← existing Supabase auth callback
    ...
  layout.tsx            ← root: ThemeProvider, Inter font, globals.css
  globals.css
```

**Key rules:**

1. `(marketing)/layout.tsx` — Server Component. Renders public nav (ThemeToggle, Sign In link, Get Started button). No auth check. ISR-friendly.
2. `(app)/layout.tsx` — Server Component. Renders app nav (logo, user menu, theme toggle). Checks auth. The lesson sidebar is nested inside `lessons/layout.tsx`, not here.
3. `(auth)/layout.tsx` — minimal, no nav. Already exists.
4. Root `layout.tsx` — only ThemeProvider, font, globals.css. No nav of any kind.

**Route groups do not appear in URLs.** `/pricing` is the URL regardless of whether the file lives at `app/(marketing)/pricing/page.tsx`.

### Middleware changes

The existing middleware needs two updates:

**1. Authenticated users visiting `/pricing` should not be redirected.** Currently `authOnlyPaths = ['/', '/login', '/signup']` — `/pricing` is not in this list so it already works correctly. No change needed.

**2. Add all app routes to `protectedPaths`.** Currently only `/lessons` is protected. Add `/dashboard`, `/news`, `/case-studies`, `/glossary`, `/interview-prep`, `/resources`:

```ts
const protectedPaths = [
  '/dashboard',
  '/lessons',
  '/news',
  '/case-studies',
  '/glossary',
  '/interview-prep',
  '/resources',
]
```

**3. `/api/stripe/webhook` must not be in protected paths.** It has no session. Confirm the `isProtected` check uses `startsWith` — it does — and `/api/stripe/webhook` does not match any of the protected paths above.

### Public vs auth nav components

```
components/
  nav/
    public-nav.tsx      ← NEW: marketing nav (ThemeToggle, Sign In, CTA)
    app-nav.tsx         ← NEW: app shell nav (existing app header extracted)
    theme-toggle.tsx    ← NEW: client component (uses useTheme)
```

Both nav components are Server Components except for the ThemeToggle leaf node, which must be a Client Component (`"use client"` + `useTheme` hook). The nav renders the ThemeToggle as an island — everything else in the nav is server-rendered.

---

## 4. Build Order

Dependencies flow: theme system has no blockers. Marketing pages depend on theme. Stripe depends on Supabase table. Content gate depends on Stripe table. Route restructure is a prerequisite for marketing pages.

### Recommended build sequence

**Step 1 — Theme system (no external dependencies)**
1. Install `next-themes`: `npm install next-themes`
2. Create `components/theme-provider.tsx` (client wrapper)
3. Update `app/layout.tsx`: remove hard-coded `dark` class, add `suppressHydrationWarning`, add `<ThemeProvider>`
4. Create `components/theme-toggle.tsx` (client, mounted guard)
5. Verify: dev server starts with `npm run dev --webpack`, toggle works, no hydration warning in console

**Step 2 — Route group restructure (prerequisite for all new pages)**
1. Create `app/(marketing)/layout.tsx` with public nav shell
2. Move `app/page.tsx` → `app/(marketing)/page.tsx`
3. Create `app/(app)/layout.tsx` with app nav shell
4. Move `app/dashboard/`, `app/lessons/`, `app/news/`, `app/case-studies/`, `app/glossary/`, `app/interview-prep/`, `app/resources/` under `app/(app)/`
5. Update middleware `protectedPaths` array
6. Verify: existing routes still resolve, auth redirect still works, no broken imports

**Step 3 — Supabase subscription table**
1. Write migration: `supabase/migrations/00003_user_subscriptions.sql`
2. Apply to local Supabase: `supabase db reset` or `supabase migration up`
3. Create `lib/actions/subscription.ts` with `getUserSubscription()`
4. Verify action returns `{ plan: 'free', status: 'none' }` for a test user

**Step 4 — Stripe webhook + checkout**
1. Install Stripe SDK: `npm install stripe`
2. Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`
3. Create `app/api/stripe/webhook/route.ts` — raw body read, signature verify, upsert handler
4. Create `app/api/stripe/checkout/route.ts` — session creation, return URL
5. Test webhook locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
6. Verify upsert writes correct row to `user_subscriptions`

**Step 5 — Content gate**
1. Update `lessons/layout.tsx` to call `getUserSubscription()` in the existing `Promise.all`
2. Pass `subscription` to `LessonSidebar` — add lock icon for Level 2/3 when `plan === 'free'`
3. Update lesson page to check `lesson.levelNumber > 1 && plan === 'free'` → render `<LockedLesson />`
4. Create `components/locked-lesson.tsx` — teaser + upgrade CTA
5. Verify: test user (no subscription row) sees locked UI on Level 2 lessons; after subscribing (webhook test), content unlocks

**Step 6 — Marketing homepage + pricing page**
1. Build `app/(marketing)/page.tsx` — hero, features, pricing CTA, public nav
2. Build `app/(marketing)/pricing/page.tsx` — plan comparison table, Stripe checkout trigger
3. Wire CTA buttons to `/api/stripe/checkout` (unauthenticated users get redirected to signup first)
4. Add dark mode token usage (use `bg-background`, `text-foreground`, not raw zinc)

---

## Integration Points Summary

| Concern | File | Change Type |
|---|---|---|
| ThemeProvider boundary | `app/layout.tsx` | Modify |
| ThemeProvider client wrapper | `components/theme-provider.tsx` | New |
| Theme toggle component | `components/theme-toggle.tsx` | New |
| CSS variant | `app/globals.css` | No change |
| Marketing layout | `app/(marketing)/layout.tsx` | New |
| App layout | `app/(app)/layout.tsx` | New |
| Public nav | `components/nav/public-nav.tsx` | New |
| App nav | `components/nav/app-nav.tsx` | New |
| Stripe webhook handler | `app/api/stripe/webhook/route.ts` | New |
| Stripe checkout handler | `app/api/stripe/checkout/route.ts` | New |
| Subscription table | `supabase/migrations/00003_user_subscriptions.sql` | New |
| Subscription action | `lib/actions/subscription.ts` | New |
| Lessons layout (gate) | `app/(app)/lessons/layout.tsx` | Modify |
| Lesson page (gate) | `app/(app)/lessons/[m]/[l]/page.tsx` | Modify |
| Locked lesson UI | `components/locked-lesson.tsx` | New |
| Sidebar (lock icons) | `components/lesson-sidebar.tsx` | Modify |
| Middleware | `middleware.ts` | Modify (protectedPaths) |
| Homepage | `app/(marketing)/page.tsx` | Rewrite |
| Pricing page | `app/(marketing)/pricing/page.tsx` | New |

---

## Webpack Constraint Compatibility

All patterns above are compatible with the `--webpack` flag requirement:

- next-themes has no Turbopack dependency
- Stripe SDK is Node.js-only (used in Route Handlers and Server Components, never in client bundles)
- The Velite webpack plugin (`next.config.ts`) is unchanged — route group restructuring does not affect Velite's content scanning of the `content/` directory
- Route group folders are a Next.js filesystem convention, not a build tool concern

---

## Sources

- [next-themes — GitHub](https://github.com/pacocoursey/next-themes)
- [shadcn/ui dark mode — Next.js guide](https://ui.shadcn.com/docs/dark-mode/next)
- [Tailwind CSS v4 dark mode — Tailwind docs](https://tailwindcss.com/docs/dark-mode)
- [Vercel nextjs-subscription-payments webhook reference](https://github.com/vercel/nextjs-subscription-payments/blob/main/app/api/webhooks/route.ts)
- [Stripe integration guide for Next.js 15 with Supabase — DEV](https://dev.to/flnzba/33-stripe-integration-guide-for-nextjs-15-with-supabase-13b5)
- [Stripe + Next.js complete guide 2025 — Pedro Alonso](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/)
- [Next.js Route Groups — official docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Dark mode with Tailwind v4 and next-themes — Jian Liao](https://jianliao.github.io/blog/tailwindcss-v4)
