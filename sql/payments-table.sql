-- Run this ONCE in Supabase -> SQL Editor -> New query -> paste -> Run.
-- Creates the payments table the app + webhook use for history and reconciliation.

create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  reference    text unique not null,
  property_id  text,
  title        text,
  tenant_email text,
  amount       bigint,                       -- in kobo (divide by 100 for Naira)
  status       text,
  paid_at      timestamptz,
  created_at   timestamptz default now()
);

alter table public.payments enable row level security;

-- Tenants can read only their own payments; the server (service role) bypasses RLS to write.
drop policy if exists "payments read own" on public.payments;
create policy "payments read own" on public.payments
  for select to authenticated
  using (lower(tenant_email) = lower(auth.jwt() ->> 'email'));

-- Helpful index for history queries
create index if not exists payments_tenant_idx on public.payments (lower(tenant_email), paid_at desc);
