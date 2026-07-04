# Girard — do this now (very simple, in order)

Do the parts in order. Each step is one small thing. Tick the box when done.

---

## Part 1 — Put the newest app online

You have a file called **girard-web.zip**. Inside are all the app files.

1. [ ] On your computer, unzip **girard-web.zip** (double-click it). You now have a folder called `girard-web`.
2. [ ] Go to `github.com` and open your Girard code (the same place you upload to each time).
3. [ ] Click **Add file**, then **Upload files**.
4. [ ] Open the `girard-web` folder and drag **everything inside it** into the GitHub upload box (keep the little folders like `src`, `api`, `public` as they are).
5. [ ] Scroll down and click **Commit changes**.

That saves the newest app. Do not press deploy yet — we add the keys first, then deploy once.

---

## Part 2 — Set up the database (Supabase)

1. [ ] Go to `supabase.com`, sign in, and open your **Girard** project.
2. [ ] On the left click **Authentication** → **Sign In / Providers** → **Email**. Turn **Confirm email** OFF. Click **Save**.
3. [ ] On the left click **SQL Editor** → **New query**.
4. [ ] Open the file **SUPABASE_SETUP_SIMPLE.md**, copy the big grey code block (Step 3), paste it in, and click **Run**.
5. [ ] Wait for the green **Success**. If it says anything "already exists", that is fine.
6. [ ] On the left click **Table Editor**. You should see these boxes: enquiries, partners, withdrawals, jobs, swaps, agents, units, reminders.

---

## Part 3 — Add the secret keys (Vercel)

These make the database and real payments work. You only do this once.

1. [ ] Go to `vercel.com`, open your **girard-web** project, click **Settings**, then **Environment Variables**.
2. [ ] Add each one below (Name, then Value), set to **Production**, and click Save each time.

**For the database (from Supabase → Project Settings → API):**
- [ ] `VITE_SUPABASE_URL` = your Project URL
- [ ] `VITE_SUPABASE_ANON_KEY` = your anon public key

(If enquiries already save across devices, these are already there — skip them.)

**For taking payments IN (from Paystack → Settings → API Keys):**
- [ ] `VITE_PAYSTACK_PUBLIC_KEY` = your key starting with `pk_`

**For the AI document studio (agreements, MOUs, letters):**
- [ ] `ANTHROPIC_API_KEY` = your Anthropic API key (from console.anthropic.com → API Keys). No `VITE_` prefix.

**For sending payouts OUT (agent withdrawals, escrow):**
- [ ] `PAYSTACK_SECRET_KEY` = your key starting with `sk_`
- [ ] In Paystack, go to **Settings → Transfers** and turn Transfers on (follow any steps it asks for).

**Turn on automatic payment confirmation (webhook):**
- [ ] In Paystack, go to **Settings → API Keys & Webhooks**.
- [ ] In the **Webhook URL** box, paste: `https://YOUR-SITE-ADDRESS/api/paystack-webhook` (replace YOUR-SITE-ADDRESS with your real website address, e.g. girardpropertylimited.com).
- [ ] Save. Now payments are confirmed by Paystack even if the person closes the tab.

(Optional, only if you want live emails and texts: `RESEND_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `TWILIO_WHATSAPP_FROM`.)

---

## Part 4 — Switch it on and check

1. [ ] In Vercel, click **Deployments**, click the three dots on the newest one, and click **Redeploy**.
2. [ ] Wait for it to finish (about a minute).
3. [ ] Open your website in a new **Incognito** window (or press Ctrl+Shift+R on Windows / Cmd+Shift+R on Mac).

Now test that it worked:
- [ ] On the site, apply as a partner ("Which best describes you?" → Vendor / Partner). Then in Supabase → Table Editor → **partners**, you should see a new row.
- [ ] Book a viewing on a listing. Check the **enquiries** table has a new row.
- [ ] If you added the Paystack public key, a real card box should pop up when you start a swap or activate an agent.

If rows appear in Supabase, everything is connected. 🎉

---

## Quick safety checks
- Root `index.html` starts with `<!doctype html>`.
- `src/index.css` starts with `:root {`.
- `src/App.jsx` is about 3951 lines.

If anything looks wrong, tell me which step and what you saw, and I'll help.
