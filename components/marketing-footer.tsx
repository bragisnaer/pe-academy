import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6">
        <Link href="/" className="text-sm font-semibold text-foreground">
          PE Academy
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>&copy; 2026 PE Academy. All rights reserved.</span>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
