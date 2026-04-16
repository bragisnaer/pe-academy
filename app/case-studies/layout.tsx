import Link from "next/link"

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb nav */}
      <nav
        className="max-w-3xl mx-auto px-6 pt-8 pb-0"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/lessons/pe-fundamentals/what-is-private-equity"
              className="hover:text-foreground transition-colors"
            >
              Curriculum
            </Link>
          </li>
          <li className="select-none" aria-hidden="true">
            /
          </li>
          <li className="text-foreground">Case Studies</li>
        </ol>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}
