# Girard Property Limited — platform

A complete property platform: an editorial marketing site plus a role-aware web app for owners, tenants, agents, investors and admins. Vite + React, Supabase auth, optional AI and Stripe. Brand: deep navy and gold with the Lora typeface, the Girard logo, and real 1 Bourdillon Residences renders.

## Highlights

- Marketing landing with the real Girard logo, your service copy, the deep navy/gold brand palette and a featured 1 Bourdillon Residences band using the brochure renders.
- Sign in with a role picker; identity resolved by email.
- Founder / Admin workspace switcher: sign in as admin (or a founder email) and a "Workspace" switcher appears in the top bar to move between the owner, tenant, agent, investor and admin workspaces instantly, like Qura.
- Digital Property Management (1 Bourdillon Residences is the featured property, with a gallery and project stats), an Applications tab to review screening and approve (Owner, Admin and Agents), automatic rent reminders sent to tenants 3 months before rent is due (Owner and Admin), Property Swap Marketplace, Live feed, CRM, Analytics, Market Intelligence, Support Services, Plans & pricing, notifications, settings and admin user management.

## What is in the download

```
girard-web/
  index.html, package.json, package-lock.json, vite.config.js, vercel.json
  src/   (main.jsx, index.css, App.jsx)
  api/   (anthropic.js, refresh-intel.js, create-checkout-session.js, rent-reminders.js, whatsapp.js)
  public/img/   (six 1 Bourdillon renders: tower, lobby, living, bedroom, pool, entrance)
```

New this round: the `public/img` folder of renders, and an updated `src/index.css` (deeper navy) and `src/App.jsx`.

## Founder / Admin access and switcher

Admin access is limited to approved accounts: anyone signing in with a **@girardproperty.com** email may use the Admin workspace and the top-bar **WORKSPACE** switcher to move between all five workspaces. Anyone choosing Platform Admin with another email is blocked. Named founders (including olamideokulaja@girardproperty.com as Olamide Okulaja) are pre-approved; edit the `FOUNDERS` list and `ADMIN_DOMAIN` near the top of `src/App.jsx` to change this.

The Admin/Founder workspace has two aggregation tabs: **Financials** (total revenue, MRR, rent, swap fees, a revenue trend, source breakdown and recent transactions) and **Sign-ups** (total users, monthly growth, role breakdown, an activation funnel and recent sign-ups). Greetings now use first names, e.g. "Good day, Olamide".

## Environment variables (Vercel: Settings → Environment Variables)

Required for real accounts: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
Optional: `ANTHROPIC_API_KEY` (live AI + daily intelligence refresh), `STRIPE_SECRET_KEY` (real checkout), `RESEND_API_KEY` (reminder emails), and `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM` (reminder SMS), and `TWILIO_WHATSAPP_FROM` (WhatsApp notifications). All server-side, no `VITE_` prefix. Reminders and everything else work without them.

## Multi-user enquiries (Supabase)

Enquiries and viewings now save to Supabase so your whole team sees them on any device (they fall back to this-device storage if Supabase is not connected). One-time setup: in Supabase, open SQL Editor, paste the following and click Run.

```sql
create table if not exists public.enquiries (
  id text primary key,
  type text, prop_id text, prop_title text, area text,
  name text, phone text, email text, message text,
  date text, time text,
  status text default 'New',
  created_at timestamptz default now()
);
alter table public.enquiries enable row level security;
create policy "public insert" on public.enquiries for insert to anon, authenticated with check (true);
create policy "staff read"    on public.enquiries for select to authenticated using (true);
create policy "staff update"  on public.enquiries for update to authenticated using (true);
```

## Final upload (recommended: replace the whole folder)

Because individual files must sit in the right folders, the safest way to deploy this final version is to upload the entire project, so every file lands in place.

File placement (what goes where):
- Root folder: `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `vercel.json`
- `src/` : `App.jsx`, `main.jsx`, `index.css`
- `public/img/` : all images incl. `girard-emblem.png`, `girard-logo.png`, `team-1.jpg` ... `team-5.jpg`, and the `bourdillon_*.jpg` renders
- `api/` : `anthropic.js`, `refresh-intel.js`, `create-checkout-session.js`, `rent-reminders.js`, `whatsapp.js`

Steps:
1. Unzip `girard-web`. On GitHub, upload the folder contents (Add file, Upload files, then drag everything in, keeping folders), and Commit. This overwrites old files with the correct ones.
2. In Supabase (one time), run the enquiries SQL from the "Multi-user enquiries" section above.
3. In Vercel, confirm the environment variables (below), then Redeploy.
4. Open the site in a fresh Incognito window (or hard-refresh with Ctrl+Shift+R / Cmd+Shift+R). `src/App.jsx` should read about 3159 lines.

Sanity check after upload: root `index.html` starts with `<!doctype html>`; `src/index.css` starts with `:root {`.

