-- Run once in Supabase -> SQL Editor. Speeds up the listings feed as data grows.
create index if not exists properties_status_idx  on public.properties (status);
create index if not exists properties_updated_idx on public.properties (updated_at desc);
