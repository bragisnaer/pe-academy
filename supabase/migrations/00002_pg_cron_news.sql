-- ============================================================
-- PE Academy — pg_cron schedule for RSS ingest Edge Function
-- ============================================================

-- Enable required extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Idempotency guard: remove existing job before (re-)scheduling
-- Allows this migration to be re-run without error
SELECT cron.unschedule('ingest-pe-news')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'ingest-pe-news'
);

-- Schedule: ingest PE news every 6 hours
--
SELECT cron.schedule(
  'ingest-pe-news',                          -- job name (unique)
  '0 */6 * * *',                             -- every 6 hours at :00
  $$
  SELECT net.http_post(
    url := 'https://njwgksqgqphieefszsbd.supabase.co/functions/v1/ingest-news',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
