-- Allow anonymous (logged-out) users to read news articles for the marketing homepage teaser
CREATE POLICY "anon_select_news_articles"
  ON public.news_articles
  FOR SELECT
  TO anon
  USING (true);
