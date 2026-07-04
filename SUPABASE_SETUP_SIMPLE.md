# Girard + Supabase — the very simple guide

Supabase is just a big online box that remembers things for everybody who uses your app (enquiries, partners, agent withdrawals, jobs and swaps). Right now your app already remembers these on each person's own device. After these steps, everyone shares the same box, so your team sees the same lists on any phone or computer.

You do this once. It takes about 5 minutes. Follow the steps in order.

---

## Step 1 — Open Supabase

1. Go to `supabase.com`.
2. Click **Sign in** (top right) and sign in.
3. Click your **Girard** project to open it.

## Step 2 — Let people join easily (turn off email confirmation)

1. On the left, click **Authentication**.
2. Click **Sign In / Providers** (in some versions it just says **Providers**).
3. Click **Email**.
4. Find **Confirm email** and switch it **off**.
5. Click **Save**.

## Step 3 — Make the tables (copy, paste, run)

This is the important one. It builds all the boxes your app needs.

1. On the left, click **SQL Editor**.
2. Click **New query**.
3. Copy **everything** in the grey box below and paste it into the big empty area.
4. Click **Run** (bottom right), or press Ctrl+Enter (Cmd+Enter on a Mac).
5. Wait for the green **Success** message. If you see any line that says something "already exists", that is totally fine — it just means it was already set up. You can run this whole block again any time; it will not break anything.

```sql
-- ===== GIRARD: run this whole block once =====

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
```

## Step 4 — Check the boxes are there

1. On the left, click **Table Editor**.
2. You should now see: **enquiries**, **partners**, **withdrawals**, **jobs**, **swaps**, **agents**, **units**.
3. They will look empty. That is correct. They fill up as people use the app.

## Step 5 — Make sure the app is connected (only if needed)

If enquiries already save for you across devices, you are already connected — skip this step. If not:

1. On the left, click **Project Settings** (the gear), then **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key.
4. Go to `vercel.com`, open your **girard-web** project, then **Settings → Environment Variables**.
5. Add two variables (scope **Production**):
   - Name `VITE_SUPABASE_URL`, value = the Project URL.
   - Name `VITE_SUPABASE_ANON_KEY`, value = the anon public key.
6. Click Save.

## Step 6 — Turn it on

1. In Vercel, go to **Deployments**, click the three dots on the newest one, and click **Redeploy**.
2. Open your site in a fresh **Incognito** window (or press Ctrl+Shift+R / Cmd+Shift+R).

Done. Your enquiries, partners, agent withdrawals, jobs and swaps are now shared across all devices.

---

## Step 7 — Turn on real payments (Paystack), optional

Right now the fees (agent registration, the $1,000 swap fee) are recorded but no real money moves. To take real payments:

1. Go to `paystack.com`, create an account, and finish the short business setup.
2. In the Paystack dashboard, go to **Settings → API Keys & Webhooks** and copy your **Public Key** (it starts with `pk_`).
3. In Vercel, open your **girard-web** project → **Settings → Environment Variables**.
4. Add one variable (scope **Production**): name `VITE_PAYSTACK_PUBLIC_KEY`, value = your `pk_...` key.
5. Redeploy.

Now when someone pays the agent fee or the swap fee, a real Paystack card box pops up. Without this key, the app still works and just records the payment for the demo.

Note: money coming IN (fees) works with just the public key. Money going OUT (agent withdrawals, escrow release) uses Paystack Transfers, which needs a bit more setup on Paystack's side; tell me when you want that and I'll wire it.

---

## How to know it worked

- Ask someone to submit a partner application on your site, then open **Table Editor → partners** in Supabase — you should see their row.
- Do the same with an enquiry (enquiries table), a job (jobs table) and a swap (swaps table).
- If rows appear in Supabase, everything is wired correctly.

If a table stays empty even though you used the app, it just means the app could not reach Supabase, so it saved on the device instead. Re-check Step 5 (the two Vercel variables) and Redeploy.
