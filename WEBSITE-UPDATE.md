WEBSITE update for the native app's new features
=================================================
Add/replace in your WEBSITE repo's api/ folder, then Commit (Vercel redeploys):
  api/paystack-initialize.js, paystack-verify.js, pay-return.js,
  paystack-webhook.js, send-push.js,
  api/landlord-earnings.js   <- NEW: powers the app's Earnings screen

App.jsx: unchanged from your last deploy (safe to re-upload; it just has the
push-on-message and push-on-verify hooks already included).

SQL (run once if not already): payments, reports, indexes, push-tokens.
The enquiries, banks, swaps, bookings, messages tables already exist.
