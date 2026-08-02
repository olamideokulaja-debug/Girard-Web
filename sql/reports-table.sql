-- Run once in Supabase -> SQL Editor. Lets tenants flag suspicious listings.
create table if not exists public.reports (
  id             uuid primary key default gen_random_uuid(),
  property_id    text,
  reporter_email text,
  reason         text,
  created_at     timestamptz default now()
);
alter table public.reports enable row level security;
-- any signed-in user can file a report; only staff read them (via service role / dashboard)
drop policy if exists "reports insert" on public.reports;
create policy "reports insert" on public.reports for insert to authenticated with check (true);
