GIRARD — FINAL FULL BUILD & DEPLOY (everything)
===============================================
This supersedes the earlier package. Do it in order. No Terminal needed.

--- PART 1: THE APP (girard-native-FULL.zip) ---
1. Unzip. GitHub -> girard-native -> upload ALL contents (replace) -> Commit to main.
2. Build: Builds -> Build from GitHub -> main -> profile "preview" -> Android -> Confirm.
   NEW native modules in this build: expo-local-authentication, expo-notifications,
   expo-device, expo-constants. If the first build flags a version on any of them,
   send me the log and I'll pin the exact SDK-54 version (quick fix).
3. Install the new APK.

New in the app: onboarding, search/filters, favourites, share, photo counter,
thumbnails, skeletons, payment confirmation, real Paystack pay + auto-return +
auto-Leased, Account (payment history, biometric lock toggle, Messages),
My listings + admin verify-from-app, report-a-listing, deep links,
tenant<->Girard chat, and the short-let booking calendar.

--- PART 2: THE WEBSITE (App.jsx + api/) ---
4. WEBSITE repo -> src/App.jsx -> replace with App.jsx here -> Commit.
5. WEBSITE repo -> api/ -> upload the 5 files here (replace if present):
   paystack-initialize.js, paystack-verify.js, pay-return.js,
   paystack-webhook.js, send-push.js
6. Wait for Vercel "Ready".

--- PART 3: DATABASE (sql/) run each once in Supabase SQL Editor ---
7. payments-table.sql, reports-table.sql, indexes.sql, push-tokens-table.sql
   (The "bookings" and "messages" tables already exist from your website.)
8. Supabase -> Database -> Replication -> enable Realtime for the "messages"
   table (so in-app chat updates live).

--- PART 4: SETTINGS ---
9. Paystack dashboard -> Webhook URL: https://girardpropertylimited.com/api/paystack-webhook
10. Vercel env: SUPABASE_SERVICE_ROLE_KEY (already set).
11. TEST with your sk_test_ key first: long-let pay -> auto-return -> Leased;
    short-let -> pick dates -> pay -> booking confirmed; message replies; receipt email.
12. Push notifications: only work on a real device with this build (not Expo Go).
    Test by triggering a payment/message/verification.
13. WHEN READY FOR REAL MONEY: switch PAYSTACK_SECRET_KEY back to sk_live_.
