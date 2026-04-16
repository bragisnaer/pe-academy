# Phase 9: Pricing Page - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 delivers a public `/pricing` page within the `app/(marketing)/` route group. It displays Free and Pro tiers with unambiguous feature lists, the Pro monthly price, and auth-aware CTAs.

**Stripe is deferred** — the Upgrade to Pro CTA will be a disabled button with a tooltip ("Stripe checkout coming soon"). SC-2 ("initiates a Stripe checkout session") is explicitly out of scope for this phase. All other success criteria are in scope.

</domain>

<decisions>
## Implementation Decisions

### Pricing & Tier Content
- **Pro monthly price:** $29/month
- **Free tier includes:** Level 1 — LBO Fundamentals (all lessons), fully accessible after sign-up
- **Pro tier includes:** Levels 2 & 3 — Deal Walkthroughs + Interview Mastery
- **Locked items display:** Lock icon + "Pro" badge — always visible, no hover required
- **Free tier locked items:** Levels 2 and 3 listed but visually distinguished as Pro-only

### Stripe Integration (Deferred)
- No Stripe API routes, no `subscription_tier` DB column in this phase
- Upgrade to Pro CTA: disabled `<button>` with tooltip "Stripe checkout coming soon"
- When Stripe is set up (future phase), this button will be swapped for a checkout trigger
- SC-2 is deferred — all other SC (1, 3, 4) are in scope

### Page Layout
- **Pattern:** Side-by-side 2-column layout — Free (left), Pro (right, visually highlighted/accented)
- **Route:** `app/(marketing)/pricing/page.tsx` inside existing marketing route group
- **Semantic tokens only:** `bg-background`, `text-foreground`, `bg-card`, `border-border` — no raw colour classes
- **Pro column highlight:** Primary-coloured border or background accent to draw attention

### CTA Behaviour
- **Logged-out on Free tier:** "Get Started Free" button → `/signup`
- **Logged-out on Pro tier:** Disabled "Upgrade to Pro" button + tooltip "Stripe checkout coming soon"
- **Logged-in free user on Free tier:** "You're on Free" (non-interactive label)
- **Logged-in free user on Pro tier:** Disabled "Upgrade to Pro" + tooltip (same as logged-out)
- **Auth detection:** Server component reads `supabase.auth.getUser()` — same pattern as homepage

### Billing Notes
- "Cancel anytime" note: inline on Pro card, below the price — always visible without hover or expand
- "Monthly billing" note: inline on Pro card
- Annual billing: deferred to v2.1

### Claude's Discretion
- Icon choices for feature list items
- Exact copywriting for feature descriptions within the decided tier structure
- Spacing, typography weights, and card shadow/border styling within semantic tokens
- Mobile responsive breakpoints

</decisions>

<code_context>
## Existing Code Insights

**Route:** `app/(marketing)/pricing/page.tsx` — create new file inside existing marketing route group. Layout (PublicNav + MarketingFooter) is inherited from `app/(marketing)/layout.tsx` automatically.

**Auth pattern (from homepage):**
```tsx
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
// Conditional CTA rendering based on user presence
```

**Middleware:** `/pricing` is NOT in `authOnlyPaths` and NOT in `protectedPaths` — logged-in and logged-out users can both access it freely. Correct — no middleware changes needed.

**Button variants available (shadcn):** `default`, `ghost`, `outline`, `secondary`, `destructive`
- Free tier CTA: `default` variant ("Get Started Free")
- Pro upgrade CTA: `default` variant but `disabled` prop

**Semantic tokens:** Use `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`.

**Card component:** `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>` from shadcn — consistent with app patterns.

**Sitemap:** `app/sitemap.ts` already lists `/pricing` — no update needed.

</code_context>

<specifics>
## Specific Ideas

- Pro tier column should have a visual highlight (e.g. `border-primary` or `ring-2 ring-primary`) to draw the eye
- "Most popular" or "Recommended" badge on the Pro tier
- Feature list should use checkmark icons for included items, lock icon for Pro-only items
- Price display: "$29" large, "/month" smaller, "Monthly billing" subtext

</specifics>

<deferred>
## Deferred Ideas

- Stripe checkout session initiation (SC-2) — deferred until Stripe phase
- Annual billing toggle — deferred to v2.1
- Webhook handler and subscription status tracking — deferred
- Legal page creation (Terms / Privacy) — noted as must-have before public launch but out of Phase 9 scope

</deferred>
