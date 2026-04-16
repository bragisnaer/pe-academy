import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function AppNav() {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 bg-background border-b border-border">
      <Link href="/dashboard" className="text-sm font-semibold text-foreground">
        PE Academy
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          href="/lessons/pe-fundamentals/what-is-private-equity"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Curriculum
        </Link>
        <Link
          href="/news"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          News
        </Link>
        <Link
          href="/interview-prep"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Interview Prep
        </Link>
        <Link
          href="/resources"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Resources
        </Link>
        <ThemeToggle />
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </nav>
    </header>
  )
}
