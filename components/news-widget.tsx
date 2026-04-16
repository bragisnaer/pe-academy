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

interface NewsWidgetProps {
  topicTag: string
}

export async function NewsWidget({ topicTag }: NewsWidgetProps) {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('news_articles')
    .select('id, title, url, source_name, published_at')
    .contains('topic_tags', [topicTag])
    .order('published_at', { ascending: false })
    .limit(3)

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <aside className="border-t border-border mt-8 pt-6">
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        In the news: {TOPIC_TAG_LABELS[topicTag] ?? topicTag}
      </p>
      <ul className="space-y-3">
        {articles.map((article) => (
          <li key={article.id}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground text-sm font-medium hover:underline"
            >
              {article.title}
            </a>
            <p className="text-muted-foreground text-xs mt-0.5">
              {article.source_name}
              {article.published_at && (
                <> &middot; {formatRelativeTime(new Date(article.published_at))}</>
              )}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
