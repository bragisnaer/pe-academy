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
    <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-foreground mb-8">PE News</h1>

        {!articles || articles.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No articles yet — the feed refreshes every 6 hours. Check back shortly.
          </p>
        ) : (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li
                key={article.id}
                className="bg-card hover:bg-card/80 transition-colors rounded-lg px-5 py-4"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {article.title}
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-muted-foreground text-sm">{article.source_name}</span>
                  {article.published_at && (
                    <>
                      <span className="text-muted-foreground/60 text-sm">&middot;</span>
                      <span className="text-muted-foreground text-sm">
                        {formatRelativeTime(new Date(article.published_at))}
                      </span>
                    </>
                  )}
                  {article.topic_tags &&
                    article.topic_tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
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
  )
}
