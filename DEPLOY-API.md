# Paystack payment endpoints for your WEBSITE

Add these two files to your WEBSITE repo (the same one Vercel deploys), in the
`api` folder (create it if it doesn't exist — it likely already holds
paystack-subaccount.js etc.):

  api/paystack-initialize.js   <- starts a rent payment (returns a checkout link)
  api/paystack-verify.js       <- confirms a payment really succeeded

## Upload
GitHub -> your WEBSITE repo -> Add file -> Upload files -> drag the `api` folder
(or the two files into the existing api folder) -> Commit. Vercel redeploys.

They use your existing PAYSTACK_SECRET_KEY env var (already set for your other
Paystack functions). Nothing else to configure.
