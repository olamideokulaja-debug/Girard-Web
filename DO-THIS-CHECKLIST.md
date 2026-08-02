GIRARD — ONE FULL BUILD & DEPLOY CHECKLIST
==========================================

You are deploying: the native app (big upgrade) + website + server + database bits.
Do these in order. Nothing here needs a Terminal.

------------------------------------------------------------------
PART 1 — THE APP  (girard-native-FULL.zip)
------------------------------------------------------------------
1. Unzip girard-native-FULL.zip.
2. GitHub -> girard-native repo -> upload ALL of it (replace existing files),
   Commit to main.  (Drag the folder contents in; keep the structure.)
3. Build:  Builds -> Build from GitHub -> main -> profile "preview" -> Android -> Confirm.
4. Install the new APK on your phone.
   Only new dependency is expo-web-browser (already in package.json) — if the
   first build flags a version, send me the log and I'll fix it.

What's new in the app: onboarding, search + filters, favourites/Saved,
share, photo counter, thumbnails, skeletons, payment confirmation,
real Paystack Pay/Book with auto-return + auto-Leased, Account with
payment history, My listings (landlords) + verify-from-app (admins),
report-a-listing.

------------------------------------------------------------------
PART 2 — THE WEBSITE  (App.jsx + api/)
------------------------------------------------------------------
5. GitHub -> WEBSITE repo -> src/App.jsx -> replace with the App.jsx here -> Commit.
6. GitHub -> WEBSITE repo -> api/ folder -> upload these 4 files (replace if present):
   paystack-initialize.js, paystack-verify.js, pay-return.js, paystack-webhook.js
7. Wait for Vercel to show "Ready".

------------------------------------------------------------------
PART 3 — THE DATABASE  (sql/)  — run each once
------------------------------------------------------------------
8. Supabase -> SQL Editor -> New query -> paste + Run, one at a time:
   sql/payments-table.sql
   sql/reports-table.sql
   sql/indexes.sql

------------------------------------------------------------------
PART 4 — SETTINGS
------------------------------------------------------------------
9. Paystack dashboard -> Settings -> API Keys & Webhooks -> Webhook URL:
   https://girardpropertylimited.com/api/paystack-webhook
10. Vercel env: SUPABASE_SERVICE_ROLE_KEY should already be set (from before).
11. TESTING: keep PAYSTACK_SECRET_KEY on your sk_test_ key, pay with a test card,
    confirm: return to app -> "Payment successful" -> listing drops to Leased.
12. WHEN READY FOR REAL MONEY: switch PAYSTACK_SECRET_KEY back to your sk_live_ key.

------------------------------------------------------------------
STILL COMING (second package): biometric lock, deep links, accessibility,
tenant<->Girard messaging, short-let booking calendar, all-event push
notifications, emailed receipts.
