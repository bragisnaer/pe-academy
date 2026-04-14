import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'

const TOPIC_TAG_LABELS: Record<string, string> = {
  'pe-fundamentals': 'PE Fundamentals',
  'fund-structure': 'Fund Structure',
  'key-players': 'Key Players',
  'deal-concepts': 'Deal Concepts',
  'return-metrics': 'Return Metrics',
  'intermediate-topics': 'Intermediate Topics',
  'expert-topics': 'Expert Topics',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: articles } = await supabase
    .from('news_articles')
    .select('id, title, url, source_name, topic_tags, published_at')
    .order('published_at', { ascending: false })
    .limit(25)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation header */}
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 bg-zinc-950 border-b border-white/10">
        <Link href="/dashboard" className="text-sm font-semibold text-white">
          PE Academy
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/lessons/pe-fundamentals/what-is-private-equity"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Curriculum
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-white mb-8">PE News</h1>

        {!articles || articles.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            No articles yet — the feed refreshes every 6 hours. Check back shortly.
          </p>
        ) : (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li
                key={article.id}
                className="bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg px-5 py-4"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:underline"
                >
                  {article.title}
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-zinc-400 text-sm">{article.source_name}</span>
                  {article.published_at && (
                    <>
                      <span className="text-zinc-600 text-sm">&middot;</span>
                      <span className="text-zinc-400 text-sm">
                        {formatRelativeTime(new Date(article.published_at))}
                      </span>
                    </>
                  )}
                  {article.topic_tags &&
                    article.topic_tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full"
                      >
                        {TOPIC_TAG_LABELS[tag] ?? tag}
                      </span>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
