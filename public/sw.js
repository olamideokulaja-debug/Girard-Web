// Girard service worker: makes the app installable and works offline for the shell.
// Safe by design: only caches same-origin GETs, never API calls or Supabase.
const CACHE = "girard-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;      // ignore Supabase, fonts, CDNs
  if (url.pathname.startsWith("/api/")) return;     // never cache API
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") { const shell = await caches.match("/"); if (shell) return shell; }
      throw err;
    }
  })());
});
