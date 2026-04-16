# Phase 7: Design System - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning
**Mode:** Gap-closure context (discuss skipped — single remaining gap is fully specified in VERIFICATION.md)

<domain>
## Phase Boundary

Phase 7 is 95% complete. The design token system, ThemeToggle, ThemeProvider wiring, suppressHydrationWarning, and full `red-*` → `destructive` token migration are all done and committed.

The one remaining gap blocking goal achievement is:

**Gap 1**: `app/layout.tsx` line 24 has `enableSystem={false}` — this must be changed to `enableSystem={true}`. This is the only change needed to satisfy Success Criterion 3 ("A first-time visitor with a system dark-mode preference sees dark mode without selecting it"). The `defaultTheme="dark"` prop stays in place as the fallback when no system preference is stored.

After this fix, all 5 success criteria will be met and Phase 7 can be closed.

</domain>

<decisions>
## Implementation Decisions

### enableSystem fix
- Change `enableSystem={false}` to `enableSystem={true}` in `app/layout.tsx` ThemeProvider props
- Keep `defaultTheme="dark"` — this serves as the fallback for users who have no stored preference AND no system preference (e.g. system pref is "no preference")
- Keep `disableTransitionOnChange` — prevents colour flash during theme switch

### Claude's Discretion
All other implementation choices remain as-is from prior commits. No other changes needed.

</decisions>

<code_context>
## Existing Code Insights

**`app/layout.tsx` line 24:**
```tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
```

Change `enableSystem={false}` to `enableSystem={true}`. That is the complete fix.

**next-themes behaviour with enableSystem={true}:**
- On first visit with no stored preference: reads `prefers-color-scheme` media query
- If system pref is dark → dark mode
- If system pref is light → light mode
- If no system pref → falls back to `defaultTheme="dark"`
- Manual toggle persists to localStorage and overrides system pref on subsequent visits

</code_context>

<specifics>
## Specific Ideas

Single fix: `enableSystem={false}` → `enableSystem={true}` in `app/layout.tsx`.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
