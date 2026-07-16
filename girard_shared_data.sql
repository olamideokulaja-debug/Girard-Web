-- ===================================================================
-- GIRARD · Shared data for properties, invoices and payout accounts
-- Run this in Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.
--
-- Why this exists: properties, invoices and payout accounts used to be
-- stored in each person's browser. That meant a tenant on their phone
-- could not see a landlord's property, and rent could not be split to
-- the landlord's Paystack subaccount. These tables make that data
-- shared across every device.
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. PAYOUT ACCOUNTS (sensitive: holds bank account numbers)
--    One row per landlord/agent. Only the owner may read their row.
-- -------------------------------------------------------------------
create table if not exists public.banks (
  email       text primary key,
  bank_name   text,
  acct_name   text,
  acct_no     text,
  subaccount  text,          -- Paystack ACCT_xxx
  split_code  text,          -- Paystack SPL_xxx (95/5 group)
  updated_at  timestamptz default now()
);

alter table public.banks enable row level security;

-- A landlord can only ever see and change their OWN payout account.
drop policy if exists "banks own row" on public.banks;
create policy "banks own row" on public.banks
  for all to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- -------------------------------------------------------------------
-- 2. PROPERTIES (shared: every device must see the same listings)
--    NOTE: no bank account number here on purpose. Only the Paystack
--    subaccount/split code, which is what a rent payment needs.
-- -------------------------------------------------------------------
create table if not exists public.properties (
  id                 text primary key,
  owner_email        text,
  status             text,
  girard_managed     boolean default false,
  uploaded_by_girard boolean default false,
  subaccount         text,
  split_code         text,
  data               jsonb,   -- title, area, rent, photos, amenities, etc.
  updated_at         timestamptz default now()
);
create index if not exists properties_owner_idx on public.properties (lower(owner_email));

alter table public.properties enable row level security;

-- Anyone may browse listings (tenants and investors need this).
drop policy if exists "properties read" on public.properties;
create policy "properties read" on public.properties
  for select to anon, authenticated using (true);

-- Signed-in users may add and edit listings.
-- TIGHTEN THIS with your security adviser before launch: ideally only the
-- owner (owner_email = auth email) or a Girard admin should write.
drop policy if exists "properties write" on public.properties;
create policy "properties write" on public.properties
  for all to authenticated using (true) with check (true);

-- -------------------------------------------------------------------
-- 3. INVOICES (shared: the tenant pays what the landlord raised)
-- -------------------------------------------------------------------
create table if not exists public.invoices (
  id          text primary key,
  property_id text,
  tenant      text,
  amount      bigint,
  admin_fee   bigint default 0,
  status      text default 'Pending',
  data        jsonb,   -- due date, late fee, etc.
  updated_at  timestamptz default now()
);
create index if not exists invoices_property_idx on public.invoices (property_id);

alter table public.invoices enable row level security;

drop policy if exists "invoices read" on public.invoices;
create policy "invoices read" on public.invoices
  for select to anon, authenticated using (true);

drop policy if exists "invoices write" on public.invoices;
create policy "invoices write" on public.invoices
  for all to authenticated using (true) with check (true);

-- -------------------------------------------------------------------
-- Done. Check with:
--   select count(*) from public.properties;
--   select count(*) from public.invoices;
--   select count(*) from public.banks;
-- -------------------------------------------------------------------

-- -------------------------------------------------------------------
-- 4. MARKET INTELLIGENCE (real, sourced figures from the daily job)
--    Written by /api/refresh-intel using the service-role key.
--    Readable by everyone; never written from the browser.
-- -------------------------------------------------------------------
create table if not exists public.market_intel (
  market            text primary key,
  briefing          text,
  price_growth      text,
  price_growth_note text,
  gross_yield       text,
  gross_yield_note  text,
  avg_price         text,
  avg_price_note    text,
  as_at             text,
  sources           jsonb default '[]'::jsonb,
  updated_at        timestamptz default now()
);
alter table public.market_intel enable row level security;
drop policy if exists "intel read" on public.market_intel;
create policy "intel read" on public.market_intel for select to anon, authenticated using (true);
-- No write policy on purpose: only the service-role job may write.

-- -------------------------------------------------------------------
-- 5. APP SETTINGS (shared switches, e.g. "we are live, never seed samples")
-- -------------------------------------------------------------------
create table if not exists public.app_settings (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz default now()
);
alter table public.app_settings enable row level security;
drop policy if exists "settings read" on public.app_settings;
create policy "settings read" on public.app_settings for select to anon, authenticated using (true);
drop policy if exists "settings write" on public.app_settings;
create policy "settings write" on public.app_settings for all to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) like '%@girardpropertylimited.com')
  with check (lower(coalesce(auth.jwt() ->> 'email','')) like '%@girardpropertylimited.com');

-- -------------------------------------------------------------------
-- 6. ADMIN ACCESS REQUESTS
--    @girardpropertylimited.com accounts get admin access automatically.
--    Anyone else asking for admin lands here as "Pending" until approved.
-- -------------------------------------------------------------------
create table if not exists public.admin_requests (
  email      text primary key,
  name       text,
  status     text default 'Pending',   -- Pending | Approved | Declined
  decided_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.admin_requests enable row level security;

-- You may see and raise your own request.
drop policy if exists "admin_req own" on public.admin_requests;
create policy "admin_req own" on public.admin_requests
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email','')) or lower(coalesce(auth.jwt() ->> 'email','')) like '%@girardpropertylimited.com');

drop policy if exists "admin_req insert" on public.admin_requests;
create policy "admin_req insert" on public.admin_requests
  for insert to authenticated
  with check (lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));

-- Only Girard staff may approve or decline.
drop policy if exists "admin_req decide" on public.admin_requests;
create policy "admin_req decide" on public.admin_requests
  for update to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email','')) like '%@girardpropertylimited.com')
  with check (lower(coalesce(auth.jwt() ->> 'email','')) like '%@girardpropertylimited.com');
