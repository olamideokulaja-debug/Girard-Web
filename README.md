# Girard Property Estate Limited, web platform

Stage 1 of the Girard build: the public marketing landing and brand.

Stack: Vite + React (single-file `src/App.jsx`). Deep green with a restrained gold accent and a Fraunces serif display face, loaded from Google Fonts. No backend, no keys and no environment variables are required at this stage. Supabase, Stripe and the serverless functions arrive in Stage 2.

## What is on the page

- A sticky top bar with the Girard wordmark, navigation, Sign in and Get started.
- A hero with the 24/7 global positioning line and two calls to action.
- A region lens (Nigeria, UK, Middle East, International) that switches the market copy, currency symbol, the rotating new-instruction ticker and the blurred live-listings teaser. It defaults to a blended International view.
- A blurred, rotating live-listings teaser with a Sign in to view overlay.
- A services section covering Management, Property Swap, Market Intelligence and Support Services.
- A who-we-serve section for Owners and Landlords, Tenants, Agents, and Investors and Developers.
- A closing call to action and a footer.

## Run it on your own computer (optional)

You do not need to do this to go live. If you want to preview locally:

1. Install Node.js 18 or newer.
2. In a terminal, from inside this folder, run `npm install`.
3. Run `npm run dev` and open the address it prints, usually `http://localhost:5173`.

## Put it online, one step at a time (for a non-technical founder)

You will do this twice: once to place the code on GitHub, once to publish it on Vercel. It takes about 10 minutes and needs no coding.

### Part A, place the code on GitHub

1. Go to `github.com` and sign in, or create a free account.
2. Click the green **New** button to create a new repository.
3. Name it `girard-web`, leave everything else as default, and click **Create repository**.
4. On the next page, click the link that says **uploading an existing file**.
5. On your computer, unzip the file you were given and open the `girard-web` folder.
6. Select all the files and folders **inside** `girard-web` (not the folder itself) and drag them onto the GitHub upload area.
7. Wait for the upload to finish, then click **Commit changes**.

### Part B, publish it on Vercel

1. Go to `vercel.com` and sign in with your GitHub account.
2. Click **Add New**, then **Project**.
3. Find `girard-web` in the list and click **Import**.
4. Leave every setting as it is. Vercel detects Vite automatically.
5. Click **Deploy** and wait for it to finish.
6. Vercel gives you a live web address. That is your Girard landing page.

### Later, when you receive an update

1. Unzip the new file and open the `girard-web` folder.
2. In your GitHub repository, click **Add file**, then **Upload files**.
3. Select all the contents inside `girard-web` and drag them in, then **Commit changes**.
4. In Vercel, open the **Deployments** tab, find the newest entry, click the three-dot menu and choose **Redeploy**.
5. If a page looks unchanged, open it in a private or incognito window to bypass the cache.

## Environment variables

None for Stage 1. When Stage 2 adds sign-in and payments, you will be given the exact variable names to paste into Vercel under Settings, Environment Variables.

## Compliance note

Girard flags KYC, escrow handling, data privacy and Nigerian, UK and other conveyancing and tenancy matters as they arise. The platform keeps human oversight at critical steps and is not a substitute for legal or financial advice.
