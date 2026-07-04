# Turning on real accounts and security (go-live)

Right now Girard runs in demo mode: accounts are saved in each browser.
Everything below flips it to real Supabase accounts with server-enforced
security. The app already contains all the code. You are just switching it on.

Do these in order. It takes about 15 minutes.

---

## Step 1. Connect Supabase (turns demo mode off)

In Vercel, open your project, go to Settings, then Environment Variables,
and add these two (you have both in your Supabase project under
Settings, then API):

- `VITE_SUPABASE_URL`  = your Project URL
- `VITE_SUPABASE_ANON_KEY`  = your anon public key

Save, then redeploy. The moment these are set, Girard signs people in
through Supabase instead of the browser. Nothing else in the app changes.

## Step 2. Choose how new users confirm their email

In Supabase, go to Authentication, then Providers, then Email.

- Easiest for launch: turn OFF "Confirm email". People can sign in straight away.
- More secure: leave it ON. New users get a confirmation email first.

Either is fine. You can change it later.

## Step 3. Create the database tables (if you have not already)

In Supabase, open the SQL editor and run `girard_supabase.sql`.
If your tables already exist, you can skip this. It is safe to run again.

## Step 4. Turn on security (the RLS policies)

In the SQL editor, run `girard_rls.sql`.

This is the step that enforces who can see and change what, on the server.
Run it only AFTER Steps 1 to 3, because it relies on real sign-in.

That is it. From now on:

- Every new user automatically gets a profile with their chosen role
  the first time they sign in.
- Any `@girardproperty.com` account automatically becomes an admin on
  first sign-in. No manual step for your team.
- Two-factor authentication (Security screen) now protects the real account.

## Step 5. Redeploy and check

Redeploy in Vercel, then open the app and hard-refresh (Ctrl+Shift+R).
Create a test account, sign in, and confirm you land in the right workspace.

---

### If something looks off

- The app loads but cannot read data: you probably ran `girard_rls.sql`
  before Step 1. Make sure the two environment variables are set and the
  app has redeployed, then try again.
- A teammate is not an admin: check their email is exactly on the
  `@girardproperty.com` domain, and that they have signed in at least once.
- You want to make an outside email an admin: see the note at the bottom
  of `girard_rls.sql`.
