import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Lock } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Pricing — PE Academy',
  description: 'Level 1 is free forever. Unlock Levels 2 & 3 with Pro at $29/month.',
  openGraph: {
    title: 'Pricing — PE Academy',
    description: 'Level 1 is free forever. Unlock Levels 2 & 3 with Pro at $29/month.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // DO NOT redirect here — /pricing is public

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-[28px] md:text-4xl font-semibold text-foreground leading-[1.15]">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Level 1 is free forever. Upgrade when you&apos;re ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4 mt-12">

        {/* Free Card — spacer above matches badge height on Pro */}
        <div className="flex flex-col">
          <div className="h-7" />
          <Card className="flex flex-col flex-1">
            <CardHeader>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Free
              </p>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground"> / forever</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Level 1 — LBO Fundamentals</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">All lessons in Level 1</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Live PE market news feed</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Interview prep question bank (Level 1)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Lock className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Level 2 — Deal Walkthroughs</span>
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                    Pro
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Lock className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Level 3 — Interview Mastery</span>
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                    Pro
                  </span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              {user ? (
                <div className={cn(buttonVariants({ variant: 'outline' }), 'w-full pointer-events-none opacity-60')}>
                  <span className="w-full text-center">You&apos;re on Free</span>
                </div>
              ) : (
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full text-center')}
                >
                  Get Started Free
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Pro Card — badge sits above card, not inside it */}
        <div className="flex flex-col">
          <div className="h-7 flex items-center">
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-medium">
              Most Popular
            </span>
          </div>
          <Card className="border-primary ring-2 ring-primary flex flex-col flex-1">
            <CardHeader>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Pro
              </p>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Monthly billing</p>
              <p className="text-xs text-muted-foreground mt-1">Cancel anytime.</p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Everything in Free</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Level 2 — Deal Walkthroughs</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Level 3 — Interview Mastery</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">Priority support</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              <span title="Stripe checkout coming soon" className="w-full">
                <button
                  disabled
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'w-full cursor-not-allowed opacity-60'
                  )}
                >
                  Upgrade to Pro
                </button>
              </span>
            </CardFooter>
          </Card>
        </div>

      </div>
    </section>
  )
}
