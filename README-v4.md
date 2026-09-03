# Girard v4 site preview

Open `girard-home-v4.html` in a browser and use the navigation. Everything is
relative, so keep the folder together.

## Files

| File | What it is |
|---|---|
| `girard.css` | Shared stylesheet: tokens, navigation, mastheads, buttons, image frames, footer, motion. Becomes the single stylesheet when this is wired into `src/App.jsx`. |
| `girard.js` | Shared behaviour: nav solidify, scroll progress, reveals, counters, cursor, lazy photographs. Nothing here is load-bearing. |
| `girard-home-v4.html` | Landing page. Unchanged except: navigation added, buttons pointed at the real pages, footer expanded, one sentence of hero copy reworded. |
| `girard-listings.html` | New. |
| `girard-services.html` | New. |
| `girard-swap.html` | New. |
| `girard-about.html` | New. |
| `girard-contact.html` | New. |
| `girard-people.html` | Navigation, expanded footer, and 3 new colleagues added. |
| `img/` | 9 original images plus 3 new headshots. |

## Blocks marked for a decision

Each is wrapped in an HTML comment you can search for.

- `===== NAMED PROJECT =====` in `girard-services.html`. Ascendant House is a
  private residence. Delete the block unless the owner has agreed to be named.
- `===== THE GROUP =====` in `girard-about.html`. The page says "part of the
  Imadeforte group", which is true whether Girard is an affiliate or a
  subsidiary. Do not upgrade the wording without a filing that matches.
- `===== SECOND REAL LISTING =====` in `girard-listings.html`. An empty slot
  rather than an invented card. Replace it with a copy of the card above once
  the address, price and photograph are confirmed.
- `===== FORM WIRING =====` in `girard-contact.html`. The enquiry form posts
  nowhere. It should write to `enquiries` through `safeWrite()` and surface the
  real error rather than a silent success.
- `===== FILTERS =====` in `girard-listings.html`. Query-string links so they
  work without JavaScript. Sale, short let and long let is a three-way choice.

## Still to do

- Wire all 7 pages into `src/App.jsx`.
- Update `scripts/seo-content.mjs` so the 22 static pages carry this copy. The
  phone number on `/contact` and `/about` lives only in that file.
- Confirm the 3 new headshot filenames match the right people.
