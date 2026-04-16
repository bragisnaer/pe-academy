import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold text-foreground">
          PE Academy
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href="/#features"
            className="hidden md:inline-flex px-3 py-2 text-sm text-foreground hover:text-foreground/80"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="hidden md:inline-flex px-3 py-2 text-sm text-foreground hover:text-foreground/80"
          >
            Pricing
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-sm')}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}
