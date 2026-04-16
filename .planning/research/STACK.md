# Technology Stack — v2.0 Additions

**Project:** PE Academy v2.0 Public Launch
**Researched:** 2026-04-14
**Scope:** NEW additions only — dark mode toggle, marketing pages, Stripe freemium integration

---

## What Already Exists (DO NOT RE-ADD)

| Already Present | Version | Notes |
|----------------|---------|-------|
| Next.js App Router + TypeScript | 16.2.3 | `--webpack` flag required; Turbopack incompatible |
| Tailwind CSS | v4 | CSS-first config, no tailwind.config.js |
| shadcn/ui | canary, base-nova preset | CSS variables + OKLCH colour system |
| Supabase auth + Postgres | @supabase/ssr ^0.10.2 | SSR-safe client configured |
| Vercel deployment | — | Hosting in place |
| tw-animate-css | ^1.4.0 | Animation utilities |
| zod, react-hook-form | — | Form validation in place |
| velite | ^0.3.1 | Content layer for MDX/YAML |

---

## Section 1: Dark Mode / Theming

### What Exists vs What's Missing

The project already has the full dark mode CSS infrastructure:

- `globals.css` defines both `:root` and `.dark` selector blocks with OKLCH variables
- `@custom-variant dark (&:is(.dark *))` is already declared
- All shadcn tokens (background, foreground, primary, card, sidebar, etc.) have dark values

**What is missing:** A mechanism to toggle the `.dark` class onto the `<html>` element at runtime, persist the user's preference, and avoid hydration flash.

### Recommended Addition

**`next-themes` v0.4.6** (current as of 2026-04-14, confirmed via `npm info`)

```bash
npm install next-themes
```

This is the standard, actively maintained library for theme switching in Next.js App Router. It handles:
- Injecting a blocking script before hydration to prevent flash (FOUC)
- Persisting preference to `localStorage`
- Respecting `prefers-color-scheme` system preference
- Toggling the class on `<html>` via `attribute="class"`

### Integration With Existing Stack

The existing `@custom-variant dark (&:is(.dark *))` declaration works with `attribute="class"` on `ThemeProvider`. When next-themes applies `class="dark"` to `<html>`, the Tailwind variant fires and the existing CSS variable swaps take effect.

**ThemeProvider setup (new `app/providers.tsx`):**

```tsx
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

Wrap in `app/layout.tsx` root layout. The `disableTransitionOnChange` flag prevents colour transition flicker on page load — important for a finance product where jarring transitions undermine perceived quality.

**Toggle component** uses `useTheme()` from next-themes. Must be rendered only after mount to avoid hydration mismatch (server does not know theme until client JS runs):

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null  // prevents hydration mismatch

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
```

### Colour System Work (CSS-only, no new packages)

The existing palette is neutral/zinc (greyscale OKLCH). For a finance/edtech product, this needs a branded accent colour — a deliberate blue or slate-blue for "trust + intelligence" — defined as additional CSS custom properties in `globals.css`. No new packages required; this is design token work in CSS.

Add to `globals.css` `:root` and `.dark` blocks:

```css
/* Example: brand accent */
--brand: oklch(0.55 0.18 240);          /* finance blue */
--brand-foreground: oklch(0.985 0 0);
```

Expose via `@theme inline`:

```css
--color-brand: var(--brand);
--color-brand-foreground: var(--brand-foreground);
```

This integrates cleanly with Tailwind v4's CSS-first system and requires zero config changes.

### Confidence: HIGH
Sources: npm registry (confirmed version), existing project CSS (read directly), shadcn docs on Tailwind v4, next-themes GitHub.

---

## Section 2: Marketing Site Components

### What Exists vs What's Missing

The project has no marketing pages. Required: a public homepage (`/`) with hero, features, social proof, and pricing CTA, plus a `/pricing` page with tier comparison.

### Recommended Approach: shadcn/ui Blocks (copy-paste, no new dependency)

shadcn/ui's official block registry includes marketing-ready components installable via CLI:

```bash
npx shadcn@latest add [block-url]
```

The official registry (`shadcn.com/blocks`) has hero blocks with the same `base-nova` preset this project uses. These are **not npm packages** — they are copied into your project as `.tsx` files you own and modify. No additional dependency is added.

**Blocks to target from the official registry:**
- `hero-*` blocks — centered or split-screen hero with headline + CTA
- Feature grid (3-column cards with icons from lucide-react, already installed)
- `pricing-*` blocks if available; otherwise build from shadcn Card + Badge primitives

The `shadcn` package (v4.2.0, already installed) is the CLI that installs blocks. No additional install needed.

**Third-party block sources (copy-paste, no dependency):**
- `shadcnblocks.com` — free tier includes hero, features, and CTA blocks built against the same shadcn/Tailwind v4 stack
- These are copy-paste TypeScript components — evaluate visually before adopting

### What NOT to Add

Do not add component libraries like `@tremor/react`, `framer-motion` for hero animations, or heavy marketing frameworks. Tailwind v4 utility classes + the existing `tw-animate-css` package handle any needed animation (fade-in, slide-up) without additional dependencies.

### Marketing-Specific Considerations

**Font loading:** The project currently uses system `font-sans`. A finance product benefits from a distinct display font for hero headlines. If a custom font is added:

```bash
# No package install — use next/font/google (built into Next.js)
import { Inter, DM_Serif_Display } from 'next/font/google'
```

`next/font` is built into Next.js 16 — no package install. Define in root layout and expose as `--font-heading` CSS variable (the slot already exists in `globals.css`).

**SEO:** Next.js App Router's `metadata` export handles `<title>`, `<meta description>`, `<og:*>` on marketing pages. No additional package needed.

**Analytics/conversion tracking:** Vercel Analytics is zero-config on Vercel deployments. Add `@vercel/analytics` (if not already tracking):

```bash
npm install @vercel/analytics
```

Then add `<Analytics />` to root layout. Lightweight (no consent banner required for anonymous events).

### Confidence: HIGH (for shadcn blocks approach), MEDIUM (for specific block selection — depends on what the official registry has at build time)

---

## Section 3: Stripe Subscription Integration

### Packages Required

| Package | Version | Side | Purpose |
|---------|---------|------|---------|
| `stripe` | ^22.0.1 | Server only | Stripe Node SDK — create checkout sessions, verify webhooks, manage subscriptions |
| `@stripe/stripe-js` | ^9.2.0 | Client only | Loads Stripe.js on client, required for redirect to hosted Checkout |

```bash
npm install stripe @stripe/stripe-js
```

`@stripe/react-stripe-js` is NOT needed for hosted Checkout (redirect flow). Only add it if using Stripe Elements (embedded card form in-page). For this project, **hosted Checkout** (redirect to stripe.com) is recommended — see rationale below.

### Hosted vs Embedded Checkout Decision

**Recommendation: Hosted Checkout (redirect)**

Rationale:
- Simpler Server Action: create session, return URL, redirect client
- No iframe CSP configuration required
- Stripe handles all PCI scope — zero compliance burden on a solo builder
- Conversion rates on Stripe's hosted page are strong (Stripe optimises it continuously)
- Embedded Checkout requires `@stripe/react-stripe-js` + more client-side plumbing

Use hosted Checkout for v2.0. Embedded Checkout can be considered in a future polish phase.

### Supabase Schema (new tables)

Two new tables are required. These are created via Supabase migrations, not packages.

**`stripe_customers` table** (links Supabase user to Stripe customer):

```sql
create table stripe_customers (
  user_id uuid references auth.users(id) on delete cascade primary key,
  stripe_customer_id text unique not null,
  created_at timestamptz default now()
);

alter table stripe_customers enable row level security;
create policy "Users can view own customer record"
  on stripe_customers for select
  using (auth.uid() = user_id);
```

**`subscriptions` table** (mirrors Stripe subscription state):

```sql
create table subscriptions (
  id text primary key,  -- Stripe subscription ID
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null, -- active | trialing | past_due | canceled | incomplete
  price_id text,        -- Stripe price ID (maps to your plan)
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);
```

**Freemium gate pattern:** Query `subscriptions` for the current user. If no row or `status != 'active'`, user is on free tier (Level 1 only). Levels 2+3 require `status = 'active'`. This check runs server-side in Route Handlers or Server Components — never trust the client.

### Webhook Handler

Create `app/api/stripe/webhook/route.ts`:

```ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()          // MUST be raw text, not .json()
  const sig = (await headers()).get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  // handle events...
}
```

Key detail: `req.text()` not `req.json()` — Next.js App Router does not expose the raw body via `.body`, and Stripe signature verification requires the exact raw bytes. This is a known gotcha.

### Webhook Events to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update `stripe_customers` row; create `subscriptions` row with `active` status |
| `customer.subscription.updated` | Update `subscriptions` row — status, `current_period_end`, `cancel_at_period_end` |
| `customer.subscription.deleted` | Set `subscriptions` status to `canceled` |
| `invoice.payment_failed` | Set `subscriptions` status to `past_due` |

Missing any of these causes database drift — the user's Supabase state diverges from Stripe's ground truth.

### Environment Variables Required

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...   # client-safe
STRIPE_SECRET_KEY=sk_live_...                     # server only, never expose
STRIPE_WEBHOOK_SECRET=whsec_...                   # webhook endpoint secret
STRIPE_PRICE_ID_PRO=price_...                    # price ID for Levels 2+3 plan
```

Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `next.config.ts` env or `.env.local`. Never prefix the secret key with `NEXT_PUBLIC_`.

### Stripe Billing Portal (self-serve cancellation)

Add the Billing Portal so users can manage/cancel their own subscription without contacting support. This is a single server action that creates a portal session and redirects — no new package required beyond the `stripe` SDK already installed.

### Confidence: HIGH
Sources: Stripe official docs (webhook signature verification), npm registry (confirmed versions), Next.js App Router patterns from multiple 2025/2026 guides.

---

## Complete Installation Command

```bash
npm install next-themes stripe @stripe/stripe-js @vercel/analytics
```

That is all four new runtime dependencies for the entire v2.0 milestone.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Theme toggle | next-themes | Manual localStorage + useEffect | next-themes handles flash prevention (blocking inline script) — impossible to replicate correctly by hand without deep Next.js internals knowledge |
| Dark mode strategy | `attribute="class"` with existing `@custom-variant dark (&:is(.dark *))` | `attribute="data-theme"` | Would require rewriting the existing CSS custom-variant; existing `.dark` selector block in globals.css already targets class-based approach |
| Stripe checkout | Hosted (redirect) | Embedded (iframe) | Embedded needs `@stripe/react-stripe-js` + CSP config; hosted is simpler for a solo builder with no existing PCI considerations |
| Stripe-Supabase sync | Custom webhook handler | Supabase Stripe Sync Engine (one-click) | Sync Engine is appropriate for complex multi-table mirroring; a freemium model only needs 2 tables and 4 events — the sync engine adds operational overhead (separate service) |
| Marketing components | shadcn/ui blocks (copy-paste) | Framer, Acernity, Radix Marketing | shadcn blocks match the existing component system; no new design system to reconcile |

---

## Sources

- next-themes GitHub: https://github.com/pacocoursey/next-themes
- shadcn/ui Tailwind v4 docs: https://ui.shadcn.com/docs/tailwind-v4
- Dark mode class strategy (Tailwind v4 + next-themes): https://iifx.dev/en/articles/456423217/solved-enabling-class-based-dark-mode-with-next-15-next-themes-and-tailwind-4
- Stripe webhook signature verification (App Router): https://kitson-broadhurst.medium.com/next-js-app-router-stripe-webhook-signature-verification-ea9d59f3593f
- Stripe + Next.js 2025 guide: https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/
- Stripe subscription lifecycle guide: https://dev.to/thekarlesi/stripe-subscription-lifecycle-in-nextjs-the-complete-developer-guide-2026-4l9d
- Supabase + Stripe subscription schema: https://dev.to/alexzrlu/nextjs-supabase-stripe-subscriptions-integration-818
- shadcn/ui blocks registry: https://www.shadcn.io/blocks
- Vercel + Stripe quickstart: https://vercel.com/kb/guide/getting-started-with-nextjs-typescript-stripe
