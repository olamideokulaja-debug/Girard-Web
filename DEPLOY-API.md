# Paystack endpoints + auto-return (WEBSITE)

Upload/replace these in your WEBSITE repo's `api` folder, then Commit (Vercel redeploys):

  api/paystack-initialize.js  <- UPDATED: now tells Paystack to return to the app after payment
  api/paystack-verify.js      <- (unchanged, include if not already there)
  api/pay-return.js           <- NEW: the page that bounces the browser back into the app

Uses your existing PAYSTACK_SECRET_KEY. Keep it on your sk_test_ key while testing.
