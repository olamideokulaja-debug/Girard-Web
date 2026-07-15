-- ===================================================================
-- GIRARD · Tightened access rules (Row Level Security)
--
-- Run AFTER girard_shared_data.sql, in Supabase → SQL Editor.
-- Safe to run more than once.
--
-- What this changes, in plain terms:
--   * Payout accounts: a landlord can only ever see their own. (unchanged)
--   * Properties: anyone may BROWSE listings, but only the landlord who
--     owns a listing, or a Girard staff account, may add or change it.
--     Before this, any signed-in user could edit anyone's listing.
--   * Invoices: only the tenant it belongs to, the landlord who owns the
--     property, or Girard staff may see or change it. Before this, any
--     signed-in user could read every invoice on the platform.
-- ===================================================================

-- Girard staff are identified by their email domain, matching how the app
-- grants admin access (isApprovedAdmin in App.jsx).
create or replace function public.is_girard_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(lower(auth.jwt() ->> 'email') like '%@girardpropertylimited.com', false);
$$;

create or replace function public.current_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- -------------------------------------------------------------------
-- PROPERTIES
-- Browsing stays open: tenants, investors and the public landing page
-- all need to see listings. Writing is locked to the owner or Girard.
-- -------------------------------------------------------------------
drop policy if exists "properties read" on public.properties;
create policy "properties read" on public.properties
  for select to anon, authenticated using (true);

drop policy if exists "properties write" on public.properties;   -- the old permissive rule
drop policy if exists "properties insert" on public.properties;
drop policy if exists "properties update" on public.properties;
drop policy if exists "properties delete" on public.properties;

create policy "properties insert" on public.properties
  for insert to authenticated
  with check (lower(coalesce(owner_email, '')) = public.current_email() or public.is_girard_admin());

create policy "properties update" on public.properties
  for update to authenticated
  using (lower(coalesce(owner_email, '')) = public.current_email() or public.is_girard_admin())
  with check (lower(coalesce(owner_email, '')) = public.current_email() or public.is_girard_admin());

create policy "properties delete" on public.properties
  for delete to authenticated
  using (lower(coalesce(owner_email, '')) = public.current_email() or public.is_girard_admin());

-- -------------------------------------------------------------------
-- INVOICES
-- Money records. Visible only to the people they concern.
-- -------------------------------------------------------------------
alter table public.invoices add column if not exists tenant_email text;
create index if not exists invoices_tenant_idx on public.invoices (lower(tenant_email));

drop policy if exists "invoices read" on public.invoices;
drop policy if exists "invoices write" on public.invoices;
drop policy if exists "invoices insert" on public.invoices;
drop policy if exists "invoices update" on public.invoices;
drop policy if exists "invoices delete" on public.invoices;

create policy "invoices read" on public.invoices
  for select to authenticated
  using (
    public.is_girard_admin()
    or lower(coalesce(tenant_email, '')) = public.current_email()
    or exists (
      select 1 from public.properties p
      where p.id = invoices.property_id
        and lower(coalesce(p.owner_email, '')) = public.current_email()
    )
  );

-- Landlords and Girard raise invoices.
create policy "invoices insert" on public.invoices
  for insert to authenticated
  with check (
    public.is_girard_admin()
    or exists (
      select 1 from public.properties p
      where p.id = invoices.property_id
        and lower(coalesce(p.owner_email, '')) = public.current_email()
    )
  );

-- The tenant may update their own invoice (paying it), as may the landlord
-- who owns the property, and Girard.
create policy "invoices update" on public.invoices
  for update to authenticated
  using (
    public.is_girard_admin()
    or lower(coalesce(tenant_email, '')) = public.current_email()
    or exists (
      select 1 from public.properties p
      where p.id = invoices.property_id
        and lower(coalesce(p.owner_email, '')) = public.current_email()
    )
  )
  with check (
    public.is_girard_admin()
    or lower(coalesce(tenant_email, '')) = public.current_email()
    or exists (
      select 1 from public.properties p
      where p.id = invoices.property_id
        and lower(coalesce(p.owner_email, '')) = public.current_email()
    )
  );

create policy "invoices delete" on public.invoices
  for delete to authenticated
  using (public.is_girard_admin());

-- -------------------------------------------------------------------
-- PAYOUT ACCOUNTS: re-assert own-row-only, in case it was loosened.
-- -------------------------------------------------------------------
drop policy if exists "banks own row" on public.banks;
create policy "banks own row" on public.banks
  for all to authenticated
  using (lower(email) = public.current_email() or public.is_girard_admin())
  with check (lower(email) = public.current_email() or public.is_girard_admin());

-- -------------------------------------------------------------------
-- STILL WORTH DOING, with your security adviser:
--   1. public.properties currently exposes owner_email to anyone browsing.
--      Consider a public view that omits it, and pointing the landing page
--      at that view instead of the table.
--   2. Review the older permissive "for all ... using (true)" policies on
--      the tables in girard_supabase.sql (payments, enquiries, messages,
--      swaps, reports and so on) with the same lens applied here.
--   3. Confirm Girard staff really are only ever on @girardpropertylimited.com
--      addresses, since is_girard_admin() trusts that domain.
-- -------------------------------------------------------------------
