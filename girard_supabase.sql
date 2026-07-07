-- Girard database setup. Safe to run more than once.
-- In Supabase: SQL Editor -> New query -> paste ALL of this -> Run.

-- 1) Enquiries and viewings
create table if not exists public.enquiries (
  id text primary key,
  type text, prop_id text, prop_title text, area text,
  name text, phone text, email text, message text,
  date text, time text, status text default 'New',
  created_at timestamptz default now()
);
alter table public.enquiries enable row level security;
drop policy if exists "enq insert" on public.enquiries;
create policy "enq insert" on public.enquiries for insert to anon, authenticated with check (true);
drop policy if exists "enq read" on public.enquiries;
create policy "enq read" on public.enquiries for select to authenticated using (true);
drop policy if exists "enq update" on public.enquiries;
create policy "enq update" on public.enquiries for update to authenticated using (true);

-- 2) Partners (vendors and support providers)
create table if not exists public.partners (
  id text primary key,
  kind text, business text, category text,
  name text, phone text, email text, about text, years text,
  status text default 'Pending',
  created_at timestamptz default now()
);
alter table public.partners enable row level security;
drop policy if exists "ptn insert" on public.partners;
create policy "ptn insert" on public.partners for insert to anon, authenticated with check (true);
drop policy if exists "ptn read" on public.partners;
create policy "ptn read" on public.partners for select to authenticated using (true);
drop policy if exists "ptn update" on public.partners;
create policy "ptn update" on public.partners for update to authenticated using (true);

-- 3) Agent withdrawals
create table if not exists public.withdrawals (
  id text primary key,
  agent text, amount bigint, bank text,
  status text default 'Pending',
  created_at timestamptz default now()
);
alter table public.withdrawals enable row level security;
drop policy if exists "wd insert" on public.withdrawals;
create policy "wd insert" on public.withdrawals for insert to authenticated with check (true);
drop policy if exists "wd read" on public.withdrawals;
create policy "wd read" on public.withdrawals for select to authenticated using (true);
drop policy if exists "wd update" on public.withdrawals;
create policy "wd update" on public.withdrawals for update to authenticated using (true);

-- 4) Jobs and repairs
create table if not exists public.jobs (
  id text primary key,
  prop_title text, girard_owned boolean, category text, descr text,
  vendor_name text, status text, estimate bigint, final_cost bigint,
  paid_by text, rating int default 0, rated_ok boolean, review text,
  created_on text, created_at timestamptz default now()
);
alter table public.jobs enable row level security;
drop policy if exists "job all" on public.jobs;
create policy "job all" on public.jobs for all to anon, authenticated using (true) with check (true);

-- 5) Property swaps
create table if not exists public.swaps (
  id text primary key,
  owner text, stage int, value text,
  flagged boolean default false, stopped boolean default false,
  data jsonb, updated_at timestamptz default now()
);
alter table public.swaps enable row level security;
drop policy if exists "swap all" on public.swaps;
create policy "swap all" on public.swaps for all to anon, authenticated using (true) with check (true);

-- 6) Agent accounts (activation status per agent)
create table if not exists public.agents (
  email text primary key,
  paid boolean default false,
  activated_at timestamptz
);
alter table public.agents enable row level security;
drop policy if exists "agent all" on public.agents;
create policy "agent all" on public.agents for all to anon, authenticated using (true) with check (true);

-- 7) 1 Bourdillon sales board units
create table if not exists public.units (
  id text primary key,
  floor int, unit text, beds int, label text, size int, price bigint,
  status text, buyer text, phone text
);
alter table public.units enable row level security;
drop policy if exists "unit all" on public.units;
create policy "unit all" on public.units for all to anon, authenticated using (true) with check (true);

-- 8) Rent reminders (log of who has been reminded)
create table if not exists public.reminders (
  id text primary key,
  tenant text, property text, sent_at timestamptz default now()
);
alter table public.reminders enable row level security;
drop policy if exists "rem all" on public.reminders;
create policy "rem all" on public.reminders for all to anon, authenticated using (true) with check (true);

-- 9) Extra bank-detail columns on withdrawals (for real payouts)
alter table public.withdrawals add column if not exists account_number text;
alter table public.withdrawals add column if not exists bank_code text;
alter table public.withdrawals add column if not exists account_name text;

-- 10) Payments confirmed by the Paystack webhook
create table if not exists public.payments (
  reference text primary key,
  purpose text, target text, amount bigint, status text,
  paid_at timestamptz default now()
);
alter table public.payments enable row level security;
drop policy if exists "pay all" on public.payments;
create policy "pay all" on public.payments for all to anon, authenticated using (true) with check (true);

-- 11) Saved AI documents
create table if not exists public.documents (
  id text primary key,
  doc_type text, party_b text, subject text, body text, created_by text,
  deal_key text, deal_label text,
  created_at timestamptz default now()
);
alter table public.documents add column if not exists deal_key text;
alter table public.documents add column if not exists deal_label text;
alter table public.documents enable row level security;
drop policy if exists "doc all" on public.documents;
create policy "doc all" on public.documents for all to anon, authenticated using (true) with check (true);

-- 12) In-app notifications
create table if not exists public.notifications (
  id text primary key,
  title text, body text, kind text, audience text,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
drop policy if exists "notif all" on public.notifications;
create policy "notif all" on public.notifications for all to anon, authenticated using (true) with check (true);

-- 13) Audit / activity log
create table if not exists public.audit (
  id text primary key,
  action text, detail text, actor text,
  created_at timestamptz default now()
);
alter table public.audit enable row level security;
drop policy if exists "audit all" on public.audit;
create policy "audit all" on public.audit for all to anon, authenticated using (true) with check (true);

-- 14) Tenant <-> Girard messages
create table if not exists public.messages (
  id text primary key,
  tenant text, sender text, body text,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
drop policy if exists "msg all" on public.messages;
create policy "msg all" on public.messages for all to anon, authenticated using (true) with check (true);

-- Memberships: one row per user, tracks paid annual access
create table if not exists subscriptions (
  email      text primary key,
  role       text,
  paid_at    timestamptz,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

-- Moderation: user reports and blocks (UGC safety)
create table if not exists reports (
  id bigint generated always as identity primary key,
  target_type text, target_id text, target_label text,
  reason text, note text, reporter text, status text default 'open',
  created_at timestamptz default now()
);
create table if not exists blocks (
  who text primary key,
  created_at timestamptz default now()
);
