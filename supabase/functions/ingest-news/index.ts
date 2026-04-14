import Parser from 'https://esm.sh/rss-parser@3'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RSS_SOURCES = [
  { url: 'https://www.pehub.com/feed/', name: 'PE Hub', filterRequired: false },
  { url: 'https://seekingalpha.com/tag/private-equity.xml', name: 'Seeking Alpha PE', filterRequired: false },
  { url: 'https://www.penewswire.com/feed/', name: 'PE News Wire', filterRequired: false },
  { url: 'https://finance.yahoo.com/rss/topfinstories', name: 'Yahoo Finance', filterRequired: true },
  { url: 'https://feeds.nbcnews.com/nbcnews/public/markets', name: 'CNBC Markets', filterRequired: true },
]

const PE_FILTER_KEYWORDS = ['private equity', 'LBO', 'buyout', 'fund', 'GP', 'LP', 'EBITDA']

const TOPIC_TAG_MAP: Record<string, string[]> = {
  'pe-fundamentals': ['private equity', 'PE firm', 'buyout firm'],
  'fund-structure': ['fund', 'LP', 'GP', 'limited partner', 'general partner', 'carried interest', 'dry powder'],
  'key-players': ['KKR', 'Blackstone', 'Carlyle', 'Apollo', 'Bain Capital', 'TPG'],
  'deal-concepts': ['LBO', 'leveraged buyout', 'acquisition', 'buyout', 'deal', 'merger'],
  'return-metrics': ['IRR', 'MOIC', 'returns', 'multiple', 'DPI', 'RVPI'],
  'intermediate-topics': ['portfolio company', 'value creation', 'EBITDA', 'operational'],
  'expert-topics': ['credit facility', 'term loan', 'covenant', 'distressed', 'secondaries'],
}

function containsKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k.toLowerCase()))
}

function assignTopicTags(title: string, description: string): string[] {
  const combined = `${title} ${description}`
  return Object.entries(TOPIC_TAG_MAP)
    .filter(([, keywords]) => containsKeyword(combined, keywords))
    .map(([tag]) => tag)
}

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const parser = new Parser()
  let ingested = 0
  let skipped = 0

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url)
      for (const item of feed.items) {
        const title = item.title ?? ''
        const url = item.link ?? ''
        const description = item.contentSnippet ?? item.content ?? ''
        const published_at = item.isoDate ?? item.pubDate ?? null

        if (!title || !url) { skipped++; continue }

        if (source.filterRequired && !containsKeyword(`${title} ${description}`, PE_FILTER_KEYWORDS)) {
          skipped++
          continue
        }

        const topic_tags = assignTopicTags(title, description)

        const { error } = await supabase
          .from('news_articles')
          .upsert(
            { title, url, source_name: source.name, topic_tags, published_at },
            { onConflict: 'url', ignoreDuplicates: true }
          )

        if (error) {
          console.error('Upsert error:', error.message, url)
          skipped++
        } else {
          ingested++
        }
      }
    } catch (err) {
      console.error('Failed source:', source.name, err)
    }
  }

  return new Response(JSON.stringify({ ingested, skipped }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
