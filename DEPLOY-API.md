# Paystack endpoints (WEBSITE) — with auto-return + auto-Leased

Replace/add in your WEBSITE repo's `api` folder, then Commit (Vercel redeploys):

  api/paystack-initialize.js  <- starts payment, returns to the app after
  api/paystack-verify.js      <- UPDATED: on success, marks a long-let property "Leased"
  api/pay-return.js           <- the page that bounces the browser back into the app

## ONE new environment variable needed (for the auto-Leased step)
Vercel -> website project -> Settings -> Environment Variables -> add:
  SUPABASE_SERVICE_ROLE_KEY = <your Supabase service_role key>
Get it from: Supabase dashboard -> Settings -> API -> Project API keys -> service_role (secret).
This is a SECRET server key. It lives only in Vercel env, NEVER in the app or the website code.
(Without it, payments still work; the listing just won't auto-flip to Leased.)

Keep PAYSTACK_SECRET_KEY on sk_test_ while testing.
