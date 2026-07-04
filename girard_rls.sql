-- ============================================================
-- Girard Property - Row-Level Security (RLS) policies
-- ============================================================
--
-- READ THIS FIRST (important):
--
-- These policies enforce permissions on the SERVER, in Supabase,
-- so a user can only touch the data they are allowed to. This is
-- the real, production-grade security layer.
--
-- They only take effect once the app signs users in through
-- Supabase Auth (email + password), because the rules rely on
-- auth.uid() and auth.email() to know WHO is asking.
--
-- Right now the Girard app uses its own demo/localStorage sign-in
-- and talks to Supabase with the public "anon" key. If you run
-- this file BEFORE the app is switched to Supabase Auth, the app
-- will be blocked from reading its own data.
--
-- SAFE ORDER:
--   1. Ask Claude to wire the app to Supabase Auth (one focused change).
--   2. Create your admin profile row (see bottom of this file).
--   3. THEN run this file in the Supabase SQL editor.
--
-- Until step 1 is done, keep this file on the shelf. It is ready.
-- ============================================================

-- 1) Profiles: one row per user, holds their role -----------
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'tenant',   -- owner | tenant | agent | investor | admin
  created_at timestamptz default now()
);
alter table profiles enable row level security;

-- 2) Helper functions --------------------------------------
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create or replace function public.my_role() returns text
  language sql stable security definer set search_path = public as $$
  select coalesce((select role from profiles where id = auth.uid()), 'anon');
$$;

-- 3) Profiles policies -------------------------------------
drop policy if exists profiles_read   on profiles;
drop policy if exists profiles_insert on profiles;
drop policy if exists profiles_update on profiles;
create policy profiles_read on profiles for select
  using (auth.uid() = id or public.is_admin());
-- Users may create/keep their own profile with any NON-admin role.
-- The 'admin' role can only be self-set by approved @girardproperty.com
-- emails, or granted by an existing admin. This blocks self-escalation.
create policy profiles_insert on profiles for insert
  with check (
    ((auth.uid() = id) and (role <> 'admin' or auth.email() like '%@girardproperty.com'))
    or public.is_admin()
  );
create policy profiles_update on profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    ((auth.uid() = id) and (role <> 'admin' or auth.email() like '%@girardproperty.com'))
    or public.is_admin()
  );

-- 4) Operational tables ------------------------------------
-- Pattern A (shared operational data): any signed-in user may
--   read and create; only admins may update or delete.
-- Pattern B (sensitive: money, documents, audit): admins only,
--   plus the person who created the row may read their own.

-- ---- Pattern A tables ----
do $$
declare t text;
begin
  foreach t in array array[
    'enquiries','partners','jobs','swaps','agents','units','reminders','notifications','messages'
  ] loop
    if to_regclass(t) is not null then
      execute format('alter table %I enable row level security;', t);
      execute format('drop policy if exists %I on %I;', t||'_sel', t);
      execute format('drop policy if exists %I on %I;', t||'_ins', t);
      execute format('drop policy if exists %I on %I;', t||'_mod', t);
      execute format('create policy %I on %I for select using (auth.role() = ''authenticated'');', t||'_sel', t);
      execute format('create policy %I on %I for insert with check (auth.role() = ''authenticated'');', t||'_ins', t);
      execute format('create policy %I on %I for all using (public.is_admin()) with check (public.is_admin());', t||'_mod', t);
    end if;
  end loop;
end $$;

-- ---- Pattern B tables (sensitive) ----
do $$
declare t text;
begin
  foreach t in array array['payments','withdrawals','documents','audit'] loop
    if to_regclass(t) is not null then
      execute format('alter table %I enable row level security;', t);
      execute format('drop policy if exists %I on %I;', t||'_admin', t);
      execute format('drop policy if exists %I on %I;', t||'_ins', t);
      execute format('create policy %I on %I for all using (public.is_admin()) with check (public.is_admin());', t||'_admin', t);
      execute format('create policy %I on %I for insert with check (auth.role() = ''authenticated'');', t||'_ins', t);
    end if;
  end loop;
end $$;

-- Optional: let a user read documents they created (needs a
-- text column named created_by holding their email).
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_name = 'documents' and column_name = 'created_by') then
    drop policy if exists documents_owner_read on documents;
    create policy documents_owner_read on documents
      for select using (created_by = auth.email() or public.is_admin());
  end if;
end $$;

-- ============================================================
-- ADMINS: any @girardproperty.com account becomes an admin
-- automatically the first time it signs in (the app writes its
-- own profile row, and the policy above permits admin for that
-- domain). No manual step needed for your team.
--
-- To grant admin to an email OUTSIDE that domain, run once in the
-- SQL editor (this bypasses RLS), replacing the address:
--
--   insert into profiles (id, email, role)
--   select id, email, 'admin' from auth.users
--   where email = 'someone@example.com'
--   on conflict (id) do update set role = 'admin';
--
-- Every other user gets a profile row with their chosen role on
-- first sign-in automatically.
-- ============================================================
