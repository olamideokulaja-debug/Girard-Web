/* Girard static SEO page generator.
   Runs after `vite build`. Writes real HTML pages into dist/ so that Google
   receives full content instead of an empty app shell.

   Generates:
     - 12 section pages  (/about, /services, /platform, ...)
     - 6 service pages   (/service/<slug>)
     - 1 page per LIVE property (Available, not demo) at /property/<slug>
     - sitemap.xml covering everything that exists

   Property pages need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, which
   Vercel already provides at build time. If they are missing the script
   warns and carries on. It never fails the build. */

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, SERVICES, MODULES, ADVANTAGES, AUDIENCES, TEAM, AT_A_GLANCE, VALUES, IMAGES, DEVELOPMENT_GALLERY, WALKTHROUGH } from "./seo-content.mjs";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const urls = [];

/* ---------- helpers ---------- */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const slugify = (s) => String(s || "")
  .toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "").slice(0, 70) || "listing";

const naira = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "";
  return "\u20A6" + v.toLocaleString("en-NG");
};

/* Strip tags so a description meta tag is always plain text. */
const plain = (s) => String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const NAV = [
  ["/", "Home"], ["/about", "About"], ["/services", "Services"],
  ["/platform", "Platform"], ["/how-it-works", "How it works"],
  ["/who-we-serve", "Who we serve"], ["/listings", "Listings"],
  ["/developments", "Developments"], ["/leadership", "Leadership"],
  ["/partners", "Partners"], ["/contact", "Contact"]
];

function page({ path, title, description, h1, eyebrow, body, jsonld, image }) {
  const canonical = SITE.origin + path;
  const desc = plain(description).slice(0, 300);
  const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
${image ? `<meta property="og:image" content="${esc(SITE.origin + image)}">` : ""}
<meta name="theme-color" content="#0A1A38">
<link rel="apple-touch-icon" href="/icons/apple-touch-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--navy:#0A1A38;--navy-2:#0C2145;--navy-line:#2A456E;--gold:#C6A15B;--gold-2:#B8934A;--ivory:#F5F0E6;--ivory-2:#FBF8F1;--cream-line:#E4DAC7;--ink:#12203A;--muted:#5A6472;--white:#fff}
*{box-sizing:border-box}
body{margin:0;background:var(--ivory);color:var(--ink);font:400 16px/1.65 Inter,system-ui,-apple-system,Segoe UI,sans-serif}
.serif{font-family:Lora,Georgia,serif}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}
header{background:var(--navy);color:#fff;padding:18px 0}
header .row{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.brand{display:inline-flex;align-items:center;gap:11px;font-family:Lora,Georgia,serif;font-size:22px;font-weight:600;letter-spacing:2px;color:#fff;text-decoration:none}
.brand img{display:block;object-fit:contain}
.brand small{display:block;font-family:Inter,sans-serif;font-size:9.5px;letter-spacing:3px;color:var(--gold);font-weight:600}
nav a{color:rgba(255,255,255,.72);text-decoration:none;font-size:13.5px;margin-right:16px;line-height:2.2;white-space:nowrap}
nav a:hover{color:var(--gold)}
.hero{background:var(--navy);color:#fff;padding:56px 0 64px}
.eyebrow{font-size:11.5px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
h1{font-family:Lora,Georgia,serif;font-size:clamp(30px,5vw,50px);line-height:1.1;font-weight:600;letter-spacing:-.5px;margin:0 0 18px}
.hero p{color:rgba(255,255,255,.82);font-size:17px;max-width:70ch;margin:0}
.hero-grid{display:grid;grid-template-columns:1fr;gap:34px;align-items:center}
.hero-img img{width:100%;height:auto;border-radius:10px;border:1px solid var(--navy-line);display:block}
.team{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;margin:24px 0}
.team figure{margin:0;background:var(--white);border:1px solid var(--cream-line);border-radius:10px;overflow:hidden}
.team figure img{width:100%;height:300px;object-fit:cover;object-position:center top;display:block}
.team figcaption{padding:18px 20px}
.team h3{margin:0 0 4px}
.team .role{font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--gold-2);font-weight:600;margin:0 0 10px}
.team p{margin:0;font-size:14.5px;color:var(--muted)}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin:22px 0}
.shots img{width:100%;height:auto;border-radius:10px;border:1px solid var(--cream-line);display:block}
main{padding:52px 0 64px}
h2{font-family:Lora,Georgia,serif;font-size:26px;font-weight:600;margin:40px 0 14px;letter-spacing:-.2px}
h2:first-child{margin-top:0}
h3{font-family:Lora,Georgia,serif;font-size:19px;font-weight:600;margin:0 0 8px}
p{max-width:76ch}
a{color:var(--gold-2)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin:22px 0}
.card{background:var(--white);border:1px solid var(--cream-line);border-radius:10px;padding:22px}
.card p{margin:0;color:var(--muted);font-size:14.5px}
.card h3 a{text-decoration:none;color:var(--ink)}
.card h3 a:hover{color:var(--gold-2)}
ul{padding-left:20px;max-width:76ch}
li{margin:6px 0}
dl{display:grid;grid-template-columns:1fr;gap:0;margin:22px 0;border-top:1px solid var(--cream-line)}
dt{font-size:11.5px;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted);font-weight:600;padding-top:14px}
dd{margin:0 0 14px;padding-bottom:14px;border-bottom:1px solid var(--cream-line);font-size:15px}
.cta{display:inline-block;background:var(--gold);color:#201601;padding:13px 24px;border-radius:2px;font-weight:600;font-size:14.5px;text-decoration:none;margin-top:8px}
.cta:hover{background:var(--gold-2)}
.cta.line{background:transparent;border:1px solid var(--cream-line);color:var(--ink);margin-left:8px}
.meta{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 4px;padding:0;list-style:none}
.meta li{background:var(--ivory-2);border:1px solid var(--cream-line);border-radius:999px;padding:6px 14px;font-size:13.5px;margin:0}
.price{font-family:Lora,Georgia,serif;font-size:34px;font-weight:600;color:var(--ink);margin:6px 0 0}
figure{margin:22px 0}
figure img{width:100%;max-width:100%;border-radius:10px;display:block;border:1px solid var(--cream-line)}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.note{background:var(--ivory-2);border:1px solid var(--cream-line);border-left:3px solid var(--gold);border-radius:8px;padding:18px 20px;margin:32px 0}
.note p{margin:0;font-size:14.5px;color:var(--muted)}
footer{background:var(--navy);color:rgba(255,255,255,.62);padding:40px 0;font-size:13.5px;margin-top:20px}
footer a{color:rgba(255,255,255,.72);text-decoration:none;margin-right:16px}
footer a:hover{color:var(--gold)}
footer .fnav{margin-bottom:16px}
@media(min-width:860px){.hero-grid{grid-template-columns:1.15fr .85fr}}
@media(min-width:640px){dl{grid-template-columns:230px 1fr}dt{border-bottom:1px solid var(--cream-line);padding-bottom:14px}dd{padding-top:14px}}
</style>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body>
<header><div class="wrap row">
<a class="brand" href="/"><img src="${IMAGES.emblem}" alt="" width="38" height="38"><span>GIRARD<small>PROPERTY LIMITED</small></span></a>
<nav>${NAV.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join("")}</nav>
</div></header>
<div class="hero"><div class="wrap hero-grid">
<div>
${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
<h1>${esc(h1)}</h1>
${description ? `<p>${esc(plain(description))}</p>` : ""}
</div>
${image ? `<div class="hero-img"><img src="${esc(image)}" alt="${esc(h1)}" width="640" height="480"></div>` : ""}
</div></div>
<main><div class="wrap">
${body}
<div class="note"><p>Girard Property Limited, ${esc(SITE.address)}. Telephone <a href="${SITE.phoneHref}">${esc(SITE.phone)}</a>, email <a href="mailto:${SITE.email}">${esc(SITE.email)}</a>. ${esc(SITE.hours)}</p></div>
</div></main>
<footer><div class="wrap">
<div class="fnav">${NAV.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join("")}</div>
<div>&copy; ${new Date().getFullYear()} ${esc(SITE.name)}. ${esc(SITE.tagline)}</div>
<div style="margin-top:12px"><a href="/terms">Terms of Use</a><a href="/privacy">Privacy Policy</a><a href="/dispute-resolution">Dispute Resolution &amp; Refunds</a><a href="/delete-account">Delete account</a></div>
</div></footer>
</body>
</html>`;
  return { path, doc };
}

async function emit({ path, doc }) {
  const dir = join(DIST, path === "/" ? "" : path.replace(/^\//, ""));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), doc, "utf8");
  urls.push(path);
}

const cards = (items, get) => `<div class="grid">${items.map(i => {
  const { h, p, href } = get(i);
  return `<div class="card"><h3>${href ? `<a href="${href}">${esc(h)}</a>` : esc(h)}</h3><p>${esc(p)}</p></div>`;
}).join("")}</div>`;

const APP_CTA = `<p><a class="cta" href="/">Open the Girard platform</a><a class="cta line" href="/contact">Speak with Girard</a></p>`;

/* ---------- section pages ---------- */

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  url: SITE.origin,
  telephone: SITE.phone,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: "21 Fatai Arobieke Street, Off Admiralty Way", addressLocality: "Lekki Phase 1, Lagos", addressCountry: "NG" },
  areaServed: ["Nigeria", "United Kingdom"]
};

async function buildSections() {
  await emit(page({
    path: "/about",
    image: IMAGES.about,
    title: "About Girard Property Limited | Lagos real estate development & asset management",
    eyebrow: "About Girard",
    h1: "Redefining excellence in real estate development.",
    description: "Girard Property Limited is a premier real estate development and asset management company dedicated to elevating the standards of luxury, urban living and sustainable property investment across Nigeria's rapidly evolving landscape.",
    jsonld: ORG_JSONLD,
    body: `
<p>Driven by a leadership team of seasoned professionals in real estate law, project development, finance, governance and estate management, the company upholds an unyielding commitment to quality, compliance and strategic growth.</p>
<h2>At a glance</h2>
<dl>${AT_A_GLANCE.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
<h2>Our vision</h2>
<p>To elevate the standards of luxury, urban living and sustainable property investment across Nigeria's rapidly evolving real estate landscape.</p>
<h2>Our mission</h2>
<p>To deliver world-class developments and professional asset management that blend architectural distinction with lifestyle functionality and long-term value creation, upheld by an unyielding commitment to quality, compliance and strategic growth.</p>
<h2>Our core values</h2>
${cards(VALUES, ([t, d]) => ({ h: t, p: d }))}
${APP_CTA}`
  }));

  await emit(page({
    path: "/services",
    image: IMAGES.services,
    title: "Our services | Girard Property Limited, Lagos",
    eyebrow: "Our services",
    h1: "A comprehensive suite of real estate solutions.",
    description: "Tailored to investors, homeowners, institutions and development partners seeking reliability and excellence, delivered to premium architectural and engineering standards.",
    jsonld: ORG_JSONLD,
    body: `${cards(SERVICES, s => ({ h: s.title, p: s.body, href: "/service/" + s.slug }))}${APP_CTA}`
  }));

  for (const s of SERVICES) {
    await emit(page({
      path: "/service/" + s.slug,
      image: s.photo,
      title: s.title + " | Girard Property Limited, Lagos",
      eyebrow: "Our services",
      h1: s.title,
      description: s.body,
      jsonld: { "@context": "https://schema.org", "@type": "Service", name: s.title, description: plain(s.body), provider: { ...ORG_JSONLD, "@context": undefined }, areaServed: "Lagos, Nigeria" },
      body: `
${s.list ? `<h2>${esc(s.list.heading)}</h2><ul>${s.list.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
<h2>Other Girard services</h2>
${cards(SERVICES.filter(x => x.slug !== s.slug), x => ({ h: x.title, p: x.body, href: "/service/" + x.slug }))}
${APP_CTA}`
    }));
  }

  await emit(page({
    path: "/platform",
    image: IMAGES.platform,
    title: "The Girard platform | Digital property management & cross-border swaps",
    eyebrow: "The platform",
    h1: "Two flagship modules, one continuous journey.",
    description: "Digital property management and a cross-border property swap marketplace, on one governed platform across Nigeria, the UK and beyond.",
    body: `${MODULES.map(m => `
<h2>${esc(m.n)} &middot; ${esc(m.name)}</h2>
<p>${esc(m.copy)}</p>
<ul>${m.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`).join("")}${APP_CTA}`
  }));

  await emit(page({
    path: "/how-it-works",
    image: IMAGES.howItWorks,
    title: "How it works | Girard Property Limited",
    eyebrow: "See how it works",
    h1: "A guided tour of the platform.",
    description: "How listing, letting, paying rent and swapping property work on the Girard platform, from first enquiry to signed lease.",
    body: `
<h2>For owners and landlords</h2>
<p>List a property with photographs, title documents and an asking rent. Girard verifies the listing before it goes live. Once let, rent is collected automatically and your share is settled directly to your bank account, with the Girard administration fee taken from the payment rather than added on top.</p>
<h2>For tenants</h2>
<p>Browse verified listings, enquire or apply online, and pay rent through the platform. Leases are issued and signed electronically, and maintenance requests are logged and tracked from the same account.</p>
<h2>For investors and developers</h2>
<p>Review for-sale opportunities, model returns before committing, and use the swap marketplace to exchange property across Nigeria, the UK and beyond with independent valuations and escrow for any difference in value.</p>
<h2>Inside the platform</h2>
<div class="shots">${WALKTHROUGH.map((src, i) => `<img src="${esc(src)}" alt="Girard platform walkthrough, screen ${i + 1}" loading="lazy" width="1080" height="675">`).join("")}</div>
<h2>Governance</h2>
<p>Governance-led and compliance-first, with human oversight at every critical step.</p>
${APP_CTA}`
  }));

  await emit(page({
    path: "/who-we-serve",
    image: IMAGES.whoWeServe,
    title: "Who we serve | Girard Property Limited",
    eyebrow: "Who we serve",
    h1: "A role-aware platform, tuned to each user.",
    description: "Girard serves owners and landlords, tenants, agents, and investors and developers, with a platform that adapts to each role.",
    body: `${cards(AUDIENCES, a => ({ h: a.name, p: a.copy }))}${APP_CTA}`
  }));

  await emit(page({
    path: "/why-girard",
    image: IMAGES.whyGirard,
    title: "Why choose Girard | Strategic advantages",
    eyebrow: "Why choose Girard",
    h1: "Strategic advantages that set us apart.",
    description: "Technology-powered operations, a strong legal and governance framework, deep development expertise and investor-centred transparency.",
    body: `${cards(ADVANTAGES, a => ({ h: a.t, p: a.d }))}${APP_CTA}`
  }));

  await emit(page({
    path: "/leadership",
    image: IMAGES.leadership,
    title: "Leadership | Girard Property Limited",
    eyebrow: "Leadership",
    h1: "The team behind Girard.",
    description: "Seasoned professionals in real estate law, project development, finance, governance and estate management.",
    body: `<div class="team">${TEAM.map(m => `<figure>${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}, ${esc(m.role)}, Girard Property Limited" loading="lazy" width="480" height="600">` : ""}<figcaption><h3>${esc(m.name)}</h3><p class="role">${esc(m.role)}</p><p>${esc(m.bio)}</p></figcaption></figure>`).join("")}</div>${APP_CTA}`
  }));

  await emit(page({
    path: "/developments",
    image: IMAGES.developments,
    title: "Developments | Girard Property Limited, Ikoyi Lagos",
    eyebrow: "Featured development",
    h1: "Developments.",
    description: "Ikoyi, Lagos. An address of distinction. A refined expression of vertical luxury: 40 bespoke residences with panoramic water views, floor-to-ceiling glazing, a rooftop infinity pool and round-the-clock concierge.",
    body: `
<h2>At a glance</h2>
<ul>
<li>40 bespoke units</li>
<li>110m maximum height</li>
<li>2,039 sq.m plot</li>
<li>Ikoyi, Lagos</li>
</ul>
<h2>Gallery</h2>
<div class="shots">${DEVELOPMENT_GALLERY.map(([src, alt]) => `<img src="${esc(src)}" alt="${esc(alt)}, Girard development, Ikoyi Lagos" loading="lazy" width="900" height="600">`).join("")}</div>
<p><a class="cta" href="/contact">Enquire about our developments</a></p>`
  }));

  await emit(page({
    path: "/partners",
    image: IMAGES.partners,
    title: "Partner with Girard | Vendor & support-service network",
    eyebrow: "Partner with Girard",
    h1: "Join our partner network.",
    description: "We work with maintenance vendors and support-service providers across legal, insurance, valuation, logistics and more, who receive job referrals across the Girard portfolio.",
    body: `
<h2>Who we work with</h2>
<ul><li>Maintenance vendors</li><li>Support services across legal, insurance, valuation and logistics</li><li>Vetted and verified providers</li></ul>
<h2>Apply to partner</h2>
<p>Vendors and support providers can register in a couple of minutes. No account needed.</p>
<p><a class="cta" href="/">Become a partner</a></p>`
  }));

  await emit(page({
    path: "/contact",
    image: IMAGES.contact,
    title: "Contact Girard Property Limited | Lekki Phase 1, Lagos",
    eyebrow: "Get in touch",
    h1: "Contact us.",
    description: "Speak with the Girard team about managing your property, listing with us, or investing in our developments.",
    jsonld: ORG_JSONLD,
    body: `
<dl>
<dt>Visit us</dt><dd>${esc(SITE.address)}</dd>
<dt>Call us</dt><dd><a href="${SITE.phoneHref}">${esc(SITE.phone)}</a></dd>
<dt>Email us</dt><dd><a href="mailto:${SITE.email}">${esc(SITE.email)}</a></dd>
<dt>Open hours</dt><dd>${esc(SITE.hours)}</dd>
</dl>
<p><a class="cta" href="mailto:${SITE.email}">Send a message</a><a class="cta line" href="/">Open the platform</a></p>`
  }));
}

/* ---------- listings ---------- */

async function fetchLive() {
  const url = (process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!url || !key) {
    console.warn("[seo] Supabase env vars not set. Skipping property pages.");
    return [];
  }
  try {
    const r = await fetch(`${url}/rest/v1/properties?select=id,status,data&status=eq.Available`, {
      headers: { apikey: key, Authorization: "Bearer " + key }
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const rows = await r.json();
    /* Only genuine, available inventory is published. Demo and seeded rows
       are excluded so that Google never indexes a property that does not exist. */
    return rows.filter(x => {
      const d = x && x.data;
      if (!d || d._demo) return false;
      if (/^DEMO-|^PR-TEST/i.test(String(x.id || ""))) return false;
      return !!d.title;
    });
  } catch (e) {
    console.warn("[seo] Could not read properties:", e.message, "- skipping property pages.");
    return [];
  }
}

async function buildListings(live) {
  const items = live.map(row => {
    const d = row.data || {};
    const forSale = String(d.intent || "").toLowerCase().includes("sale");
    return {
      id: row.id,
      slug: slugify([d.title, d.area].filter(Boolean).join("-")) + "-" + slugify(row.id),
      title: d.title,
      area: d.area || "",
      address: d.address || "",
      beds: d.beds,
      type: d.type || "",
      price: d.rent,
      forSale,
      letType: d.letType || "",
      term: d.term || "",
      description: d.description || "",
      photos: Array.isArray(d.photos) ? d.photos.filter(p => typeof p === "string" && /^https?:\/\//.test(p)).slice(0, 6) : [],
      amenities: Array.isArray(d.amenities) ? d.amenities : []
    };
  });

  for (const p of items) {
    const priceLabel = naira(p.price) + (p.forSale ? "" : p.letType === "Short let" ? " per night" : " per year");
    const metaBits = [p.beds ? p.beds + " bed" : "", p.type, p.area, p.forSale ? "For sale" : "To let"].filter(Boolean);
    await emit(page({
      path: "/property/" + p.slug,
      title: `${p.title}${p.area ? ", " + p.area : ""} | ${p.forSale ? "For sale" : "To let"} | Girard`,
      eyebrow: p.forSale ? "For sale" : "To let",
      h1: p.title + (p.area ? ", " + p.area : ""),
      description: plain(p.description) || `${p.title}${p.area ? " in " + p.area : ""}, ${p.forSale ? "for sale" : "available to let"} through Girard Property Limited.`,
      jsonld: {
        "@context": "https://schema.org",
        "@type": "Residence",
        name: p.title,
        description: plain(p.description).slice(0, 400),
        address: { "@type": "PostalAddress", streetAddress: p.address || undefined, addressLocality: p.area || "Lagos", addressCountry: "NG" },
        numberOfRooms: p.beds || undefined,
        image: p.photos.length ? p.photos : undefined,
        url: SITE.origin + "/property/" + p.slug
      },
      body: `
${p.price ? `<p class="price">${esc(priceLabel)}</p>` : ""}
<ul class="meta">${metaBits.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
${p.photos.length ? `<figure class="gallery">${p.photos.map(src => `<img src="${esc(src)}" alt="${esc(p.title)}" loading="lazy">`).join("")}</figure>` : ""}
${p.description ? `<h2>About this property</h2><p>${esc(p.description)}</p>` : ""}
${p.address ? `<h2>Location</h2><p>${esc(p.address)}</p>` : ""}
${p.amenities.length ? `<h2>Amenities</h2><ul>${p.amenities.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
<h2>Enquire</h2>
<p>Enquiries and applications for this property are handled on the Girard platform. Rent is collected through the platform and the Girard administration fee is taken from the payment rather than added on top.</p>
<p><a class="cta" href="/">Enquire on the platform</a><a class="cta line" href="/contact">Contact Girard</a></p>`
    }));
  }

  await emit(page({
    path: "/listings",
    image: IMAGES.listings,
    title: "Property listings in Lagos | To let and for sale | Girard",
    eyebrow: "Browse our listings",
    h1: "Available now.",
    description: "Verified residential and commercial property to let and for sale in Lagos, managed by Girard Property Limited.",
    body: items.length
      ? `${cards(items, p => ({
          h: p.title + (p.area ? ", " + p.area : ""),
          p: [naira(p.price), p.beds ? p.beds + " bed" : "", p.type, p.forSale ? "For sale" : "To let"].filter(Boolean).join(" \u00B7 "),
          href: "/property/" + p.slug
        }))}${APP_CTA}`
      : `<p>There are no listings published on this page at the moment. Live availability, including properties still being verified, is shown on the Girard platform.</p>${APP_CTA}`
  }));

  return items;
}

/* ---------- sitemap ---------- */

async function buildSitemap() {
  const statics = ["/", "/privacy", "/terms", "/dispute-resolution", "/delete-account"];
  const all = [...new Set([...statics, ...urls])];
  const today = new Date().toISOString().slice(0, 10);
  const body = all.map(u => `  <url>
    <loc>${SITE.origin}${u === "/" ? "/" : u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u === "/" || u === "/listings" || u.startsWith("/property/") ? "daily" : "monthly"}</changefreq>
    <priority>${u === "/" ? "1.0" : u.startsWith("/property/") || u === "/listings" ? "0.9" : u.startsWith("/service/") ? "0.8" : "0.7"}</priority>
  </url>`).join("\n");
  await writeFile(join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, "utf8");
  await writeFile(join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`, "utf8");
  return all.length;
}

/* ---------- run ---------- */

try {
  await buildSections();
  const live = await fetchLive();
  const items = await buildListings(live);
  const total = await buildSitemap();
  console.log(`[seo] ${urls.length} pages generated (${items.length} live property pages). Sitemap lists ${total} URLs.`);
} catch (e) {
  console.error("[seo] generator failed, continuing without static pages:", e);
}
