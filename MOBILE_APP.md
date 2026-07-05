# Putting Girard on phones

There are three levels, from easiest to hardest. You do not have to do them
all at once. Level 1 works today.

------------------------------------------------------------
## Level 1: Install it on a phone today (no store, no cost)

Girard is now a proper installable app. Anyone can add it to their phone and
it opens full screen with your Girard icon, just like a store app.

On Android (using Chrome):
1. Open your Girard web address.
2. Tap the three dots at the top right.
3. Tap Install app (or Add to Home screen).

On iPhone (using Safari):
1. Open your Girard web address in Safari.
2. Tap the Share button (the square with an arrow).
3. Tap Add to Home Screen.

This is perfect for your team and early users right now, while the store
versions are prepared. You can simply share the link and tell people to add it
to their home screen.

------------------------------------------------------------
## Level 2: Google Play Store (the doable one)

The easiest tool is PWABuilder, which is free and made by Microsoft.

1. Go to pwabuilder.com and paste your live Girard web address. Click Start.
2. It checks your app, then offers app packages. Choose the Android package
   (Google Play). Download it. It also gives you a signing key. Keep that key
   safe, you need the same one for every future update.
3. Create a Google Play developer account at play.google.com/console. There is
   a one-time fee of $25.
4. In the Play Console, create a new app, fill in the listing (name Girard, a
   description, a few phone screenshots, the icon), upload the package, and
   submit. Google's review usually takes a few days.

------------------------------------------------------------
## Level 3: Apple App Store (the hard one, plan ahead)

Apple needs more than Android:

- An Apple Developer account, which costs $99 per year (developer.apple.com).
- A Mac computer with the free Xcode app. Apple only allows iPhone apps to be
  built and submitted from a Mac. This cannot be done from Windows.
- PWABuilder can create an iPhone package too, but you still open and submit it
  from a Mac with Xcode.
- Apple reviews strictly and sometimes rejects apps that are only a wrapper
  around a website. Girard has real features (accounts, payments, swaps), which
  helps, but be ready in case they ask for a native touch like phone
  notifications.

If you do not have a Mac, the two normal options are to use a cloud Mac service
(search MacinCloud or MacStadium) for a short time, or to pay a freelance iPhone
developer for a day to build and submit it. The project is already set up so a
developer can do this quickly (see Level 4).

------------------------------------------------------------
## Level 4: The developer route (Capacitor, most control, both stores)

I have already added Capacitor to the project. It wraps your existing app into
real iPhone and Android apps that share one codebase and keep loading your live
site, so payments, AI and data all keep working.

Give this to a developer, or follow it on the right computer:

1. Open capacitor.config.json and set the server url to your live Vercel
   address, replacing REPLACE-WITH-YOUR-VERCEL-DOMAIN.
2. In a terminal, in the project folder:

   npm install
   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
   npm run build
   npx cap add android
   npx cap add ios        (Mac only)
   npx cap sync

3. Android: npx cap open android
   Opens Android Studio. Build the app bundle, then upload it to Play Console.
4. iPhone: npx cap open ios
   Opens Xcode on a Mac. Set signing with your Apple account, choose Archive,
   then upload to App Store Connect.

------------------------------------------------------------
## What to prepare for both stores

- App name: Girard
- A short description and a longer description
- A few phone screenshots of the app
- A public privacy policy web link (the app has Data and privacy inside; stores
  also want a public link, which I can set up for you)
- The app icon (already made, in the public/icons folder)

------------------------------------------------------------
## My honest recommendation

1. Turn on Level 1 today so people can use Girard on their phones straight away.
2. Do the Play Store next with PWABuilder. It is the most realistic to do
   yourself.
3. For iPhone, plan for the Apple account plus either a Mac or a freelance
   developer for a day. When you are ready, I will write your developer a short,
   exact brief so it is a quick job.

I can also write your store listing text and set up a public privacy policy page
whenever you want them.
