-- Run once in Supabase -> SQL Editor. Stores device push tokens per user.
create table if not exists public.push_tokens (
  token      text primary key,
  email      text,
  updated_at timestamptz default now()
);
alter table public.push_tokens enable row level security;
drop policy if exists "push tokens rw" on public.push_tokens;
create policy "push tokens rw" on public.push_tokens for all to authenticated using (true) with check (true);
