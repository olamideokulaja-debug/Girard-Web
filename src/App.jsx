import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight, Building2, Repeat, LineChart, Sparkles, ShieldCheck,
  Globe2, MapPin, Menu, X, Home, KeyRound, Users, Briefcase, ArrowRight,
  LogOut, Mail, Lock, ArrowLeft, ChevronRight, Wallet, Wrench, FileText,
  Search, LayoutGrid, Plus, Upload, AlertTriangle, CheckCircle2, Clock,
  CreditCard, PenLine, Filter, LayoutDashboard, Bell, Send, Loader2, MoreHorizontal,
  Handshake, ArrowRightLeft, MessageSquare, Scale, Gavel, ClipboardCheck, Banknote, Globe, Check,
  Truck, Sofa, ConciergeBell, Tag, Settings, BadgeCheck, UserCog, UserPlus, TrendingUp, BellRing, Phone, Calendar
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* Girard Property Estate Limited
   Stage 1, rebuilt: editorial-luxury landing.
   Navy and gold, Lora display, alternating navy and ivory sections, imagery-led.
   Content leads with the two flagship modules, Digital Property Management and
   Property Swap, in Girard's own governance-led, institutional voice. */

const REGIONS = {
  Nigeria: {
    cur: "₦", tag: "Lagos & Abuja",
    line: "A 30-property Lagos portfolio under management, opening to landlords across Nigeria.",
    listings: [
      { title: "4-Bed Detached Duplex", place: "Lekki Phase 1, Lagos", price: "₦8.4M / yr", kind: "To let" },
      { title: "3-Bed Apartment", place: "Ikoyi, Lagos", price: "₦11.2M / yr", kind: "To let" },
      { title: "5-Bed Duplex", place: "Maitama, Abuja", price: "₦350M", kind: "For swap" },
      { title: "2-Bed Flat", place: "Yaba, Lagos", price: "₦3.0M / yr", kind: "To let" }
    ],
    instr: ["New instruction: 4-Bed in Magodo, Lagos", "New instruction: Penthouse on Victoria Island", "New swap: Abuja terrace seeking London"]
  },
  UK: {
    cur: "£", tag: "London & regions",
    line: "Cross-border management and swaps between the United Kingdom and Nigeria.",
    listings: [
      { title: "3-Bed Flat, Zone 2", place: "Islington, London", price: "£2,950 / mo", kind: "To let" },
      { title: "4-Bed Semi", place: "Didsbury, Manchester", price: "£720,000", kind: "For swap" },
      { title: "2-Bed Conversion", place: "Clifton, Bristol", price: "£1,650 / mo", kind: "To let" },
      { title: "Georgian Townhouse", place: "Bath", price: "£410,000", kind: "For swap" }
    ],
    instr: ["New instruction: 2-Bed in Clapham, London", "New swap: London flat seeking Lagos", "New instruction: Family home, Birmingham"]
  },
  "Middle East": {
    cur: "AED", tag: "Dubai",
    line: "Serving owners and investors moving between the Gulf, Nigeria and the UK.",
    listings: [
      { title: "2-Bed Marina Apartment", place: "Dubai Marina", price: "AED 145,000 / yr", kind: "To let" },
      { title: "3-Bed Villa", place: "Arabian Ranches, Dubai", price: "AED 3.1M", kind: "For swap" },
      { title: "Studio", place: "Downtown Dubai", price: "AED 78,000 / yr", kind: "To let" },
      { title: "4-Bed Villa", place: "Palm Jumeirah", price: "AED 9.8M", kind: "For swap" }
    ],
    instr: ["New instruction: Marina 1-Bed, Dubai", "New swap: Dubai villa seeking London", "New instruction: Downtown studio"]
  },
  International: {
    cur: "$", tag: "Cross-border",
    line: "One governed platform for owners, tenants, agents and investors, across markets.",
    listings: [
      { title: "5-Bed Duplex", place: "Lekki, Lagos", price: "$310,000", kind: "For swap" },
      { title: "3-Bed Flat", place: "London, UK", price: "$3,750 / mo", kind: "To let" },
      { title: "2-Bed Condo", place: "Brooklyn, New York", price: "$610,000", kind: "For swap" },
      { title: "3-Bed Villa", place: "Palm Jumeirah, Dubai", price: "$1.2M", kind: "For swap" }
    ],
    instr: ["New swap: Lagos duplex seeking London", "New instruction: Brooklyn 2-Bed", "New swap: Dubai villa seeking Lagos"]
  }
};

const MODULES = [
  {
    n: "01", icon: Building2, name: "Digital Property Management",
    copy: "List, let and run rentals online with the operational discipline Girard is known for. AI-recommended rents, tenant screening, e-signed leases, automated rent collection and maintenance, delivered with transparent reporting that protects asset value and stabilises cash flow.",
    points: ["AI-recommended rents", "Screening, leases and e-signature", "Rent collection and maintenance"]
  },
  {
    n: "02", icon: Repeat, name: "Property Swap Marketplace",
    copy: "Exchange properties directly across Nigeria, the UK and beyond. Independent AI valuations, reciprocal matching in a common currency, escrow for any difference and guided title transfer let owners move without the fees and friction of separate sales.",
    points: ["AI valuation and matching", "Escrow for value differences", "Guided cross-border title transfer"]
  }
];

const CAPABILITIES = [
  { icon: LineChart, name: "Market Intelligence", copy: "Sold prices, planning applications, local plans, auction results and yields, distilled for the decision at hand." },
  { icon: Sparkles, name: "Support Services", copy: "Conveyancing, surveys, removals, furnishing and finance, delivered as a managed concierge on a vetted partner network." }
];

const AUDIENCES = [
  { icon: Home, name: "Owners & Landlords", copy: "Let faster, price with confidence and protect asset value across a growing portfolio." },
  { icon: KeyRound, name: "Tenants", copy: "Find, apply for and secure a home online, then manage rent and repairs from one portal." },
  { icon: Users, name: "Agents", copy: "Run instructions, applications and offers through a single pipeline built for volume." },
  { icon: Briefcase, name: "Investors & Developers", copy: "Move on deals with intelligence, governance and cross-border swaps that reduce cost." }
];

const STATS = [
  { k: "30", v: "Lagos properties under management at launch" },
  { k: "3", v: "Core markets: Nigeria, the UK and international" },
  { k: "24/7", v: "Governed platform access, web and mobile" }
];

/* ---------- architectural art ---------- */
function BuildingPortrait() {
  return (
    <svg viewBox="0 0 340 460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12335F" /><stop offset="100%" stopColor="#0A1F3C" />
        </linearGradient>
      </defs>
      <rect x="14" y="14" width="312" height="432" rx="4" fill="url(#bp)" stroke="var(--gold)" strokeWidth="1.4" />
      <rect x="26" y="26" width="288" height="408" rx="2" fill="none" stroke="var(--navy-line)" strokeWidth="1" />
      {/* towers */}
      <g stroke="var(--gold)" strokeWidth="1.2" fill="none" opacity="0.9">
        <path d="M70 420 L70 150 L120 120 L120 420 Z" />
        <path d="M132 420 L132 90 L150 78 L168 90 L168 420 Z" />
        <path d="M182 420 L182 176 L236 176 L236 420 Z" />
        <path d="M248 420 L248 214 L286 214 L286 420 Z" />
      </g>
      {/* lit windows */}
      <g fill="var(--gold)" opacity="0.85">
        {Array.from({ length: 22 }).map((_, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return <rect key={i} x={80 + col * 13} y={170 + row * 30} width="6" height="9" opacity={(i * 7) % 5 === 0 ? 0.25 : 0.8} />;
        })}
        {Array.from({ length: 18 }).map((_, i) => {
          const col = i % 2, row = Math.floor(i / 2);
          return <rect key={"b" + i} x={195 + col * 22} y={192 + row * 26} width="8" height="10" opacity={(i * 5) % 4 === 0 ? 0.25 : 0.7} />;
        })}
      </g>
      <line x1="26" y1="420" x2="314" y2="420" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Skyline({ light }) {
  const stroke = light ? "var(--navy)" : "var(--gold)";
  return (
    <svg viewBox="0 0 1200 200" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
      <g stroke={stroke} strokeWidth="1.1" fill="none" opacity={light ? 0.16 : 0.22}>
        <path d="M0 200 L0 130 L60 130 L60 90 L110 90 L110 130 L170 130 L170 60 L200 40 L230 60 L230 130 L300 130 L300 100 L360 100 L360 150 L430 150 L430 80 L470 80 L470 120 L540 120 L540 40 L590 40 L590 200" />
        <path d="M600 200 L600 110 L660 110 L660 70 L720 70 L720 130 L780 130 L780 50 L810 30 L840 50 L840 130 L910 130 L910 95 L970 95 L970 150 L1040 150 L1040 75 L1090 75 L1090 120 L1160 120 L1160 60 L1200 60 L1200 200" />
      </g>
    </svg>
  );
}

function KindTag({ kind }) {
  const swap = kind === "For swap";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: swap ? "rgba(198,161,91,.16)" : "rgba(20,51,95,.10)", color: swap ? "var(--gold-2)" : "var(--navy-3)", fontSize: 10.5, fontWeight: 700, letterSpacing: .4, padding: "3px 9px", borderRadius: 3, textTransform: "uppercase" }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: swap ? "var(--gold)" : "var(--navy-3)" }} />{kind}
    </span>
  );
}

function ListingCard({ l }) {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 6, overflow: "hidden", flexShrink: 0, width: 250 }}>
      <div style={{ height: 120, position: "relative", background: "linear-gradient(140deg, var(--navy-3), var(--navy))" }}>
        <svg viewBox="0 0 250 120" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .2 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.2"><path d="M36 96 L36 54 L70 40 L104 54 L104 96 Z" /><path d="M118 96 L118 42 L152 42 L152 96 Z" /><rect x="166" y="60" width="30" height="36" /></g></svg>
        <span style={{ position: "absolute", top: 10, left: 10 }}><KindTag kind={l.kind} /></span>
      </div>
      <div style={{ padding: 14 }}>
        <div className="serif" style={{ fontSize: 16.5, fontWeight: 600, color: "var(--ink)" }}>{l.title}</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, margin: "5px 0 9px" }}><MapPin size={12} />{l.place}</div>
        <div style={{ fontWeight: 700, color: "var(--navy)", letterSpacing: .2 }}>{l.price}</div>
      </div>
    </div>
  );
}

const Rule = ({ light }) => <div style={{ width: 54, height: 2, background: "var(--gold)", opacity: light ? 1 : .9 }} />;

const IMG = {
  hero: "/img/bourdillon_tower.jpg",
  tower: "/img/bourdillon_lobby.jpg"
};

/* Girard emblem, recreated from the brand: a gold ring on an arc base with three towers. */
function GirardMark({ size = 34 }) {
  return <img src="/img/girard-emblem.png" alt="Girard Property Estate Limited" width={size} height={size} style={{ display: "block", objectFit: "contain" }} />;
}

/* Live counter of properties under management. Reads the store if it exists
   (updates as the owner adds or removes), otherwise shows a sensible default. */
function readPropCount() {
  try { const r = localStorage.getItem("girard_pm_v3"); if (r) { const d = JSON.parse(r); if (d && d.properties) return d.properties.length; } } catch (e) {}
  return 30;
}
function PropertyCounter({ style }) {
  const [n, setN] = useState(readPropCount);
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now(); const from = disp, to = n, dur = 900;
    const step = t => { const p = Math.min(1, (t - t0) / dur); setDisp(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [n]);
  useEffect(() => {
    const id = setInterval(() => { const v = readPropCount(); setN(x => x !== v ? v : x); }, 2500);
    const onS = () => setN(readPropCount());
    window.addEventListener("storage", onS);
    return () => { clearInterval(id); window.removeEventListener("storage", onS); };
  }, []);
  return <span className="serif" style={style}>{disp}</span>;
}

function ContactSection() {
  const [cf, setCf] = useState({ name: "", email: "", msg: "" });
  const send = () => {
    const subject = encodeURIComponent("Website enquiry from " + (cf.name || "a visitor"));
    const body = encodeURIComponent((cf.msg || "") + "\n\nFrom: " + cf.name + " (" + cf.email + ")");
    window.location.href = "mailto:info@girardpropertylimited.com?subject=" + subject + "&body=" + body;
  };
  const inp = { width: "100%", background: "var(--navy-2)", border: "1px solid var(--navy-line)", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, marginBottom: 12, fontFamily: "inherit" };
  const items = [
    { icon: MapPin, label: "Visit us", value: "21 Fatai Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos" },
    { icon: Phone, label: "Call us", value: "+234 805 873 3019", href: "tel:+2348058733019" },
    { icon: Mail, label: "Email us", value: "info@girardpropertylimited.com", href: "mailto:info@girardpropertylimited.com" },
    { icon: Clock, label: "Open hours", value: "Mon – Sat: 8am – 5pm · Sunday closed" }
  ];
  return <section id="contact" style={{ background: "var(--ivory)", padding: "88px 0" }}>
    <div className="wrap">
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <Rule light />
        <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Get in touch</div>
        <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>Contact us.</h2>
        <p style={{ color: "var(--muted)", fontSize: 15.5, marginTop: 12, lineHeight: 1.6, maxWidth: 520 }}>Speak with the Girard team about managing your property, listing with us, or investing in 1 Bourdillon Residences.</p>
      </div>
      <div className="cap-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map(it => { const inner = <><div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", flexShrink: 0 }}><it.icon size={20} /></div><div><div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gold-2)", textTransform: "uppercase", letterSpacing: .5 }}>{it.label}</div><div style={{ color: "var(--ink)", fontSize: 14.5, marginTop: 3, lineHeight: 1.5 }}>{it.value}</div></div></>; const st = { display: "flex", gap: 14, alignItems: "flex-start", background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 12, padding: 18 }; return it.href ? <a key={it.label} href={it.href} style={st}>{inner}</a> : <div key={it.label} style={st}>{inner}</div>; })}
        </div>
        <div style={{ background: "var(--navy)", borderRadius: 14, padding: 28 }}>
          <div className="serif" style={{ color: "#fff", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Send a message</div>
          <input value={cf.name} onChange={e => setCf({ ...cf, name: e.target.value })} placeholder="Your name" style={inp} />
          <input value={cf.email} onChange={e => setCf({ ...cf, email: e.target.value })} placeholder="Email address" style={inp} />
          <textarea value={cf.msg} onChange={e => setCf({ ...cf, msg: e.target.value })} rows={4} placeholder="How can we help?" style={{ ...inp, resize: "vertical" }} />
          <button onClick={send} className="btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 2 }}>Send message <ArrowUpRight size={16} /></button>
        </div>
      </div>
    </div>
  </section>;
}

const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1764722870631-877f5c694b76?auto=format&fit=crop&w=800&q=68",
  "https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=800&q=68",
  "https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?auto=format&fit=crop&w=800&q=68",
  "https://images.unsplash.com/photo-1759162788764-f40075c8857f?auto=format&fit=crop&w=800&q=68"
];
function poolPhoto(id) { let h = 0; const t = String(id); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return PHOTO_POOL[h % PHOTO_POOL.length]; }

/* Photo renders a stock image and falls back to premium gradient art if it fails to load.
   To use your own photography, drop files into public/img and point these at /img/your-file.jpg */
function Photo({ src, hue = 212, alt = "", style, radius = 0, overlay, className }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", borderRadius: radius, ...style }}>
      {ok && src
        ? <img src={src} alt={alt} onError={() => setOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(140deg, hsl(" + hue + ",45%,19%), hsl(" + (hue - 14) + ",55%,33%))" }}>
            <svg viewBox="0 0 400 300" width="100%" height="100%" style={{ opacity: .2 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.4"><path d="M70 250 L70 140 L120 110 L170 140 L170 250 Z" /><path d="M190 250 L190 90 L250 60 L310 90 L310 250 Z" /><rect x="330" y="150" width="46" height="100" /></g></svg>
          </div>}
      {overlay && <div style={{ position: "absolute", inset: 0, background: overlay }} />}
    </div>
  );
}

/* Real capabilities and positioning, drawn from girardpropertylimited.com */
const MGMT_CAPS = ["Facility & infrastructure management", "Lease administration", "Service charge management", "Maintenance oversight", "Vendor coordination", "Security operations", "Utilities management", "Financial reporting"];
const INV_CAPS = ["Development partnerships", "Income-producing assets", "Land banking strategies", "Institutional investment platforms"];
const SERVICES = [
  { icon: Building2, t: "Real Estate Development", d: "Premium residential, commercial and mixed-use properties engineered for durability, sustainability and elevated lifestyle experiences, guided by disciplined planning, architectural excellence and strict compliance with international standards." },
  { icon: ShieldCheck, t: "Property & Estate Management", d: "End-to-end management of residential and commercial assets, ensuring operational efficiency, tenant satisfaction and long-term asset preservation, with technology-enabled real-time monitoring and data-driven performance tracking." },
  { icon: ConciergeBell, t: "Short Let & Airbnb Management", d: "Professional management of short-let and serviced residences, with positioning, guest operations and upkeep handled end-to-end so owners earn optimised returns from the hospitality market." },
  { icon: Wallet, t: "Buy-to-Let Investment Solutions", d: "A structured pathway for investors seeking stable rental income and long-term wealth creation through professionally selected residential assets, each evaluated with rigorous financial modelling and risk assessment." },
  { icon: TrendingUp, t: "Real Estate Investment & Partnerships", d: "Secure investment models supported by disciplined due diligence, strong governance and transparent reporting, aligning investor objectives with sustainable asset performance and controlled risk exposure." },
  { icon: ClipboardCheck, t: "Real Estate Advisory & Transaction Support", d: "Holistic advisory across legal, financial, compliance, development strategy and transaction execution, enabling informed decisions across acquisitions, disposals, restructuring and project feasibility." }
];
const ADVANTAGES = [
  { t: "Technology-powered operations", d: "Digital systems drive real-time monitoring, streamlined communication and data-driven performance across every asset." },
  { t: "Strong legal & governance framework", d: "Clear legal structures, compliance protocols and performance accountability standards govern every engagement." },
  { t: "Deep development & asset management expertise", d: "A fully integrated approach from site acquisition through delivery and long-term asset stewardship." },
  { t: "High-performing, multidimensional leadership", d: "Seasoned professionals in real estate law, project development, finance, governance and estate management." },
  { t: "Investor-centred transparency", d: "Transparent reporting frameworks and rigorous due diligence keep investors informed and protected." },
  { t: "Compliance with international best practices", d: "Compliance with global standards in building, safety, governance and financial reporting." },
  { t: "Premium architectural & engineering standards", d: "Developments that balance aesthetics, functionality, environmental responsibility and investor performance." }
];

/* Leadership. Add your real team and the section appears automatically.
   Example: { name: "Full Name", role: "Managing Director", photo: "/img/team-1.jpg" } */
const TEAM = [
  { name: "Dr. Olamide Okulaja", role: "Executive Chairman", photo: "/img/team-1.jpg", bio: "A respected healthcare executive and entrepreneur with over two decades across clinical practice, public health and healthcare management, and CEO of Genesys Health Information Systems. His expertise in systems reform, policy and strategic leadership guides Girard's mission of excellence and impact." },
  { name: "Jennifer Kaja", role: "CEO / Managing Director", photo: "/img/team-2.jpg", bio: "A distinguished Nigerian lawyer with first-class honours from the University of Wales and a decade of practice across corporate, commercial and real estate law. As Chief Legal Officer of Periwinkle Empire she oversaw landmark transactions, governance and compliance." },
  { name: "Pedro Cabulo", role: "Chief Strategy & Partnerships Officer", photo: "/img/team-3.jpg", bio: "Leads corporate strategy and cultivates the partnerships that power Girard's growth and investment platforms." },
  { name: "Olayinka O. Odunlami", role: "Finance, Operations & Management", photo: "/img/team-4.jpg", bio: "Drives financial discipline, operational excellence and management systems across the Girard portfolio." },
  { name: "Engr. Tomi Adebayo", role: "Projects Director", photo: "/img/team-5.jpg", bio: "Oversees project delivery, engineering standards and construction quality across Girard developments." }
];

function Reveal({ children, style }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(26px)", transition: "opacity .7s ease, transform .7s ease", ...style }}>{children}</div>;
}
function CountUp({ to, dur = 1300, prefix = "", suffix = "" }) {
  const ref = useRef(null); const [started, setStarted] = useState(false); const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return; let raf; const t0 = performance.now();
    const step = t => { const q = Math.min(1, (t - t0) / dur); setN(Math.round(to * (1 - Math.pow(1 - q, 3)))); if (q < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [started, to, dur]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}
const BGAL = ["/img/bourdillon_tower.jpg", "/img/bourdillon_lobby.jpg", "/img/bourdillon_living.jpg", "/img/bourdillon_bedroom.jpg", "/img/bourdillon_pool.jpg", "/img/bourdillon_entrance.jpg"];
function BourdillonGallery() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return; const id = setInterval(() => setI(x => (x + 1) % BGAL.length), 4000); return () => clearInterval(id); }, [paused]);
  return <div style={{ position: "relative", minHeight: 480, overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {BGAL.map((src, idx) => <img key={src} src={src} alt="1 Bourdillon Residences" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: idx === i ? 1 : 0, transition: "opacity .8s ease" }} />)}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,17,42,0) 55%, rgba(6,17,42,.5))", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", padding: "0 16px" }}>
      {BGAL.map((src, idx) => <button key={src} onClick={() => setI(idx)} aria-label={"View " + (idx + 1)} style={{ width: idx === i ? 26 : 10, height: 10, borderRadius: 999, border: "none", cursor: "pointer", background: idx === i ? "var(--gold)" : "rgba(255,255,255,.55)", transition: "all .3s" }} />)}
    </div>
  </div>;
}
function RoiCalculator() {
  const [price, setPrice] = useState(95000000);
  const [rent, setRent] = useState(9500000);
  const [costPct, setCostPct] = useState(20);
  const ngn = v => "₦" + Math.round(v).toLocaleString();
  const gross = price > 0 ? (rent / price * 100) : 0;
  const net = price > 0 ? (rent * (1 - costPct / 100) / price * 100) : 0;
  const payback = rent > 0 ? price / (rent * (1 - costPct / 100)) : 0;
  const slider = { width: "100%", accentColor: "#C6A15B", margin: "8px 0 2px" };
  const results = [
    { label: "Gross yield", value: gross.toFixed(1) + "%", c: "#3B82F6" },
    { label: "Net yield", value: net.toFixed(1) + "%", c: "#10B981" },
    { label: "Monthly income", value: ngn(rent / 12), c: "#8B5CF6" },
    { label: "Payback", value: payback.toFixed(1) + " yrs", c: "#F59E0B" }
  ];
  const rows = [
    { label: "Property price", val: ngn(price), v: price, set: setPrice, min: 10000000, max: 500000000, step: 1000000 },
    { label: "Expected annual rent", val: ngn(rent), v: rent, set: setRent, min: 500000, max: 60000000, step: 100000 },
    { label: "Annual costs", val: costPct + "%", v: costPct, set: setCostPct, min: 0, max: 50, step: 1 }
  ];
  return <section style={{ background: "var(--ivory)", padding: "88px 0" }}>
    <div className="wrap">
      <Reveal>
        <div style={{ maxWidth: 640, marginBottom: 34 }}>
          <Rule light />
          <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Buy-to-let</div>
          <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>Estimate your returns.</h2>
          <p style={{ color: "var(--muted)", fontSize: 15.5, marginTop: 12, lineHeight: 1.6, maxWidth: 520 }}>Move the sliders to model a buy-to-let investment. Figures are indicative; speak with Girard for a tailored analysis.</p>
        </div>
      </Reveal>
      <div className="roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 14, padding: 26 }}>
          {rows.map(r => <div key={r.label} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{r.label}</span><span className="serif" style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>{r.val}</span></div>
            <input type="range" min={r.min} max={r.max} step={r.step} value={r.v} onChange={e => r.set(Number(e.target.value))} style={slider} />
          </div>)}
        </div>
        <div style={{ background: "var(--navy)", borderRadius: 14, padding: 26, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignContent: "center" }}>
          {results.map(r => <div key={r.label} style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--navy-line)", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", fontWeight: 600 }}>{r.label}</div>
            <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: r.c, marginTop: 6 }}>{r.value}</div>
          </div>)}
          <div style={{ gridColumn: "1 / -1", marginTop: 4 }}><a className="btn-gold" href="#contact" style={{ width: "100%", justifyContent: "center" }}>Speak to an adviser <ArrowUpRight size={16} /></a></div>
        </div>
      </div>
      <style>{`@media(max-width:820px){.roi-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  </section>;
}

function Landing({ onStart, onSignIn }) {
  const [region, setRegion] = useState("International");
  const [menu, setMenu] = useState(false);
  const [tick, setTick] = useState(0);
  const [offset, setOffset] = useState(0);
  const R = REGIONS[region];

  useEffect(() => {
    const a = setInterval(() => setTick(t => t + 1), 3200);
    const b = setInterval(() => setOffset(o => (o + 1) % R.listings.length), 3600);
    return () => { clearInterval(a); clearInterval(b); };
  }, [region, R.listings.length]);

  useEffect(() => {
    const els = document.querySelectorAll("section .wrap");
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = "none"; io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach(el => { el.style.opacity = 0; el.style.transform = "translateY(22px)"; el.style.transition = "opacity .7s ease, transform .7s ease"; io.observe(el); });
    return () => io.disconnect();
  }, []);

  const rotated = [...R.listings.slice(offset), ...R.listings.slice(0, offset)];
  const instr = R.instr[tick % R.instr.length];

  return (
    <div>
      <style>{`
        .wrap{max-width:1200px;margin:0 auto;padding:0 28px}
        .eyebrow{font-size:12px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase}
        .btn-gold{background:var(--gold);color:#201601;border:none;padding:13px 24px;border-radius:2px;font-weight:600;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .18s,transform .06s;letter-spacing:.2px}
        .btn-gold:hover{background:var(--gold-2)}
        .btn-gold:active{transform:translateY(1px)}
        .btn-line{background:transparent;padding:12px 22px;border-radius:2px;font-weight:600;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s;letter-spacing:.2px}
        .btn-line.on-navy{border:1px solid rgba(255,255,255,.28);color:#fff}
        .btn-line.on-navy:hover{border-color:var(--gold);color:var(--gold)}
        .btn-line.on-ivory{border:1px solid var(--cream-line);color:var(--ink)}
        .btn-line.on-ivory:hover{border-color:var(--navy)}
        .rpill{border:1px solid var(--navy-line);background:transparent;color:rgba(255,255,255,.7);padding:7px 15px;border-radius:2px;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .18s;letter-spacing:.2px}
        .rpill:hover{border-color:var(--gold);color:var(--gold)}
        .rpill.on{background:var(--gold);border-color:var(--gold);color:#201601}
        .nav-link{color:rgba(255,255,255,.72);font-size:13.5px;font-weight:500;letter-spacing:.3px;transition:color .18s}
        .nav-link:hover{color:#fff}
        .cap-card{border:1px solid var(--navy-line);border-radius:6px;padding:26px;transition:border-color .2s,background .2s}
        .cap-card:hover{border-color:var(--gold);background:rgba(198,161,91,.05)}
        .aud-card{border:1px solid var(--cream-line);border-radius:6px;padding:24px;background:var(--white);transition:transform .2s,box-shadow .2s}
        .aud-card:hover{transform:translateY(-3px);box-shadow:0 20px 44px rgba(10,31,60,.10)}
        .val-card{background:var(--white);border:1px solid var(--cream-line);border-radius:8px;padding:24px;transition:transform .2s}
        .val-card:hover{transform:translateY(-3px)}
        .cap-li{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink);padding:7px 0}
        .team-card{background:var(--white);border:1px solid var(--cream-line);border-radius:10px;overflow:hidden}
        @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .rise{animation:rise .8s ease both}
        .hero-h{font-size:clamp(46px,6.6vw,86px);line-height:1.02;font-weight:600;letter-spacing:-1px}
        .sec-h{font-size:clamp(32px,4.4vw,52px);line-height:1.08;font-weight:600;letter-spacing:-.5px}
        @media(max-width:940px){
          .nav-links{display:none!important}.burger{display:inline-flex!important}
          .grid-2{grid-template-columns:1fr!important}.hero-grid{grid-template-columns:1fr!important}
          .hero-photo{display:none!important}.mod-grid{grid-template-columns:1fr!important}
          .grid-4{grid-template-columns:1fr 1fr!important}.cap-split{grid-template-columns:1fr!important}
        }
        @media(max-width:560px){.grid-4{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,31,60,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--navy-line)" }}>
        <div className="wrap" style={{ height: 74, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GirardMark size={38} />
            <div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: 1, color: "#fff" }}>GIRARD</div>
              <div style={{ fontSize: 8, letterSpacing: 2.6, color: "var(--gold)", marginTop: -1 }}>PROPERTY ESTATE</div>
            </div>
          </div>
          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#listings">Listings</a>
            <a className="nav-link" href="#leadership">Leadership</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#who">Who we serve</a>
            <a className="nav-link" href="#contact">Contact</a>
            <a className="btn-line on-navy" href="#" onClick={e => { e.preventDefault(); onSignIn(); }} style={{ padding: "9px 18px" }}>Sign in</a>
            <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Get started <ArrowUpRight size={16} /></a>
          </nav>
          <button className="burger" onClick={() => setMenu(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>{menu ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {menu && (
          <div className="wrap" style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#listings">Listings</a>
            <a className="nav-link" href="#leadership">Leadership</a>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#who">Who we serve</a>
            <a className="nav-link" href="#contact">Contact</a>
            <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }} style={{ justifyContent: "center" }}>Get started</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ background: "var(--navy)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div className="float-orb" style={{ position: "absolute", top: -90, right: -50, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,161,91,.20), transparent 70%)", pointerEvents: "none" }} />
        <div className="float-orb" style={{ position: "absolute", bottom: -110, left: -90, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,53,100,.55), transparent 70%)", pointerEvents: "none", animationDelay: "2.5s" }} />
        <div className="wrap" style={{ paddingTop: 72, paddingBottom: 78, position: "relative" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 54, alignItems: "center" }}>
            <div className="rise">
              <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 22 }}>Digital management &amp; cross-border swaps</div>
              <h1 className="serif hero-h">
                Managed with <span style={{ fontStyle: "italic", color: "var(--gold)" }}>discipline.</span><br />
                Moved without <span style={{ fontStyle: "italic", color: "var(--gold)" }}>borders.</span>
              </h1>
              <p style={{ fontSize: 17.5, color: "rgba(255,255,255,.76)", marginTop: 24, maxWidth: 520, lineHeight: 1.65 }}>
                Girard Property Estate Limited is a premier real estate development and asset management company, elevating the standards of luxury, urban living and sustainable property investment across Nigeria, now on one governed platform for management, cross-border swaps, intelligence and concierge services.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
                <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Get started <ArrowUpRight size={16} /></a>
                <a className="btn-line on-navy" href="#services">Explore services</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28, color: "rgba(255,255,255,.6)", fontSize: 13 }}>
                <ShieldCheck size={16} color="var(--gold)" /> Governance-led and compliance-first, with human oversight at every critical step.
              </div>
            </div>
            <div className="hero-photo rise" style={{ position: "relative" }}>
              <div style={{ border: "1px solid var(--gold)", padding: 10, borderRadius: 4 }}>
                <Photo src={IMG.hero} hue={210} alt="Modern residential towers" style={{ height: 440 }} overlay="linear-gradient(180deg, rgba(10,31,60,.18), rgba(10,31,60,.55))" />
              </div>
              <div style={{ position: "absolute", bottom: -22, left: -22, background: "var(--white)", color: "var(--ink)", borderRadius: 8, padding: "16px 20px", boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
                <PropertyCounter style={{ fontSize: 30, fontWeight: 600, color: "var(--navy)", display: "block" }} />
                <div style={{ fontSize: 12, color: "var(--muted)", maxWidth: 140 }}>Properties under management</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STRIP + REGION LENS */}
      <section style={{ background: "var(--navy-2)", color: "#fff", borderTop: "1px solid var(--navy-line)" }}>
        <div className="wrap" style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--gold)", fontWeight: 700, fontSize: 12.5, whiteSpace: "nowrap" }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--gold)" }} /> Live</span>
            <span key={instr} className="rise" style={{ color: "rgba(255,255,255,.82)", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{instr}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.keys(REGIONS).map(k => <button key={k} onClick={() => { setRegion(k); setOffset(0); }} className={"rpill" + (region === k ? " on" : "")}>{k}</button>)}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "var(--ivory-2)", padding: "84px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 820 }}>
            <Rule light />
            <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>About Girard</div>
            <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>Redefining excellence in real estate development.</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, marginTop: 18 }}>Girard Property Estate Limited is a premier real estate development and asset management company dedicated to elevating the standards of luxury, urban living and sustainable property investment across Nigeria's rapidly evolving landscape.</p>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, marginTop: 14 }}>Driven by a leadership team of seasoned professionals in real estate law, project development, finance, governance and estate management, the company upholds an unyielding commitment to quality, compliance and strategic growth.</p>
          </div>
          <div className="vm-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 34 }}>
            <div style={{ background: "var(--navy)", color: "#fff", borderRadius: 14, padding: 26 }}>
              <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 10 }}>Our vision</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "rgba(255,255,255,.86)" }}>To elevate the standards of luxury, urban living and sustainable property investment across Nigeria's rapidly evolving real estate landscape.</p>
            </div>
            <div style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 14, padding: 26 }}>
              <div className="eyebrow" style={{ color: "var(--gold-2)", marginBottom: 10 }}>Our mission</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink)" }}>To deliver world-class developments and professional asset management that blend architectural distinction with lifestyle functionality and long-term value creation, upheld by an unyielding commitment to quality, compliance and strategic growth.</p>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <div className="eyebrow" style={{ color: "var(--gold-2)", marginBottom: 16 }}>Our core values</div>
            <div className="val-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
              {[["Integrity", "Anchored on transparency, sound governance and ethical practice."], ["Precision", "Disciplined planning, rigorous due diligence and strict compliance."], ["Innovation", "Technology-powered operations and advanced digital modelling."], ["Quality & Compliance", "Premium standards aligned with international best practices."], ["Strategic Growth", "Long-term value creation for clients, partners and communities."]].map(([t, d]) => <div key={t} style={{ borderTop: "2px solid var(--gold)", paddingTop: 12 }}><div className="serif" style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{t}</div><div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.55 }}>{d}</div></div>)}
            </div>
          </div>
          <style>{`@media(max-width:820px){.vm-grid{grid-template-columns:1fr!important}.val-grid{grid-template-columns:1fr 1fr!important}}`}</style>
        </div>
      </section>

      {/* SERVICES DEEP-DIVE (real copy) */}
      <section id="services" style={{ background: "var(--ivory)", padding: "88px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 660, marginBottom: 46 }}>
            <Rule light />
            <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Our services</div>
            <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>A comprehensive suite of real estate solutions.</h2>
            <p style={{ color: "var(--muted)", fontSize: 15.5, marginTop: 14, lineHeight: 1.65, maxWidth: 620 }}>Tailored to investors, homeowners, institutions and development partners seeking reliability and excellence, delivered to premium architectural and engineering standards.</p>
          </div>
          <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {SERVICES.map(sv => <div key={sv.t} className="lift card-soft" style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 12, padding: 26 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 16 }}><sv.icon size={22} /></div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{sv.t}</div>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{sv.d}</p>
            </div>)}
          </div>
          <style>{`@media(max-width:960px){.svc-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:620px){.svc-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      </section>

      {/* FEATURED DEVELOPMENT */}
      <section style={{ background: "var(--navy)", color: "#fff" }}>
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <BourdillonGallery />
          <div style={{ padding: "72px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 14 }}>Featured development</div>
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: -.5 }}>1 Bourdillon Residences</h2>
            <div style={{ color: "var(--gold-soft)", fontWeight: 600, marginTop: 8, letterSpacing: 1, fontSize: 13 }}>IKOYI, LAGOS · AN ADDRESS OF DISTINCTION</div>
            <p style={{ color: "rgba(255,255,255,.74)", fontSize: 15.5, lineHeight: 1.7, margin: "18px 0 24px", maxWidth: 460 }}>A refined expression of vertical luxury: 40 bespoke residences with panoramic water views, floor-to-ceiling glazing, a rooftop infinity pool and round-the-clock concierge.</p>
            <div style={{ display: "flex", gap: 28, marginBottom: 26, flexWrap: "wrap" }}>
              {[[40, "Bespoke units", ""], [110, "Max height", "m"], [2039, "sq.m plot", ""]].map(([to, l, suf]) => <div key={l}><div className="serif" style={{ fontSize: 30, fontWeight: 600, color: "var(--gold)" }}><CountUp to={to} suffix={suf} /></div><div style={{ fontSize: 12.5, color: "rgba(255,255,255,.6)" }}>{l}</div></div>)}
            </div>
            <div><a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Enquire about 1 Bourdillon <ArrowUpRight size={16} /></a></div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.feat-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* FLAGSHIP PLATFORM MODULES */}
      <section id="platform" style={{ background: "var(--navy-2)", color: "#fff", padding: "92px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <Rule />
            <div className="eyebrow" style={{ color: "var(--gold)", margin: "18px 0 14px" }}>The platform</div>
            <h2 className="serif sec-h">Two flagship modules, one continuous journey.</h2>
          </div>
          <div className="mod-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {MODULES.map(m => (
              <div key={m.n} style={{ border: "1px solid var(--navy-line)", borderRadius: 8, padding: 34, background: "var(--navy)", position: "relative", overflow: "hidden" }}>
                <div className="serif" style={{ position: "absolute", top: 18, right: 26, fontSize: 60, color: "rgba(198,161,91,.16)", fontWeight: 600 }}>{m.n}</div>
                <div style={{ width: 52, height: 52, borderRadius: 8, background: "var(--gold)", color: "var(--navy)", display: "grid", placeItems: "center", marginBottom: 22 }}><m.icon size={24} /></div>
                <h3 className="serif" style={{ fontSize: 27, fontWeight: 600, marginBottom: 12 }}>{m.name}</h3>
                <p style={{ color: "rgba(255,255,255,.72)", fontSize: 15, lineHeight: 1.68, marginBottom: 22 }}>{m.copy}</p>
                <div style={{ borderTop: "1px solid var(--navy-line)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 11 }}>
                  {m.points.map(p => <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "rgba(255,255,255,.9)" }}><span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--gold)" }} />{p}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLIC LISTINGS */}
      <PublicListings onSignIn={onSignIn} />

      {/* WHY CHOOSE GIRARD */}
      <section style={{ background: "var(--navy)", color: "#fff", padding: "88px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 40 }}>
            <Rule />
            <div className="eyebrow" style={{ color: "var(--gold)", margin: "18px 0 12px" }}>Why choose Girard</div>
            <h2 className="serif sec-h">Strategic advantages that set us apart.</h2>
          </div>
          <div className="adv-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px 40px" }}>
            {ADVANTAGES.map(a => <div key={a.t} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--navy-line)" }}>
              <BadgeCheck size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} /><div><div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{a.t}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.66)", marginTop: 3, lineHeight: 1.55 }}>{a.d}</div></div>
            </div>)}
          </div>
          <style>{`@media(max-width:760px){.adv-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      </section>

      <RoiCalculator />

      {/* WHO WE SERVE */}
      <section id="who" style={{ background: "var(--ivory)", padding: "88px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 46 }}>
            <Rule light />
            <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Who we serve</div>
            <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>A role-aware platform, tuned to each user.</h2>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {AUDIENCES.map(a => (
              <div key={a.name} className="aud-card">
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 16 }}><a.icon size={20} /></div>
                <h3 className="serif" style={{ fontSize: 19, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{a.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{a.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      {TEAM.length > 0 && (
        <section id="leadership" style={{ background: "var(--navy)", color: "#fff", padding: "88px 0" }}>
          <div className="wrap">
            <div style={{ maxWidth: 780, marginBottom: 40 }}>
              <Rule />
              <div className="eyebrow" style={{ color: "var(--gold)", margin: "18px 0 12px" }}>Our people</div>
              <h2 className="serif sec-h">Our leadership.</h2>
              <p style={{ color: "rgba(255,255,255,.72)", fontSize: 15.5, marginTop: 14, lineHeight: 1.65 }}>We draw on our global network to assemble a team of experts, with a strong interest in coaching and capability building, and an emphasis on emotional intelligence and effective stakeholder relationships.</p>
            </div>
            <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {TEAM.map(t => (
                <div key={t.name} className="lift card-soft" style={{ background: "var(--white)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 260, flexShrink: 0, background: "var(--navy-2)", overflow: "hidden" }}><img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} /></div>
                  <div style={{ padding: 20, flex: 1 }}>
                    <div className="serif" style={{ fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--gold-2)", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: .5 }}>{t.role}</div>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
            <style>{`@media(max-width:900px){.team-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){.team-grid{grid-template-columns:1fr!important}}`}</style>
          </div>
        </section>
      )}

      <ContactSection />

      {/* CTA */}
      <section style={{ background: "var(--navy-2)", color: "#fff", padding: "92px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .5 }}><Skyline /></div>
        <div className="wrap" style={{ textAlign: "center", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><div style={{ width: 54, height: 2, background: "var(--gold)" }} /></div>
          <h2 className="serif" style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: -.5 }}>Let's build something enduring.</h2>
          <p style={{ color: "rgba(255,255,255,.74)", fontSize: 17, marginTop: 16, maxWidth: 600, margin: "16px auto 0", lineHeight: 1.65 }}>A comprehensive suite of real estate solutions tailored to investors, homeowners, institutions and development partners seeking reliability and excellence, delivering strong occupancy, enduring desirability and resilient capital appreciation.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
            <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Get started <ArrowUpRight size={16} /></a>
            <a className="btn-line on-navy" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Speak with Girard <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,.7)", padding: "56px 0 30px", borderTop: "1px solid var(--navy-line)" }}>
        <div className="wrap">
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 30 }}>
            <div>
              <div className="serif" style={{ fontSize: 23, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Girard</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.65, maxWidth: 260 }}>Girard Property Estate Limited. Property managed with discipline, moved without borders.</div>
            </div>
            {[["Services", ["Real Estate Development", "Property Management", "Buy-to-Let Solutions", "Investment & Partnerships", "Advisory & Transactions"]], ["Markets", ["Nigeria", "United Kingdom", "Middle East", "International"]], ["Company", ["About", "Why Girard", "Contact", "Sign in"]]].map(([h, items]) => (
              <div key={h}>
                <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 12, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>{h}</div>
                {items.map(x => <div key={x} style={{ fontSize: 13.5, marginBottom: 9 }}>{x}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--navy-line)", marginTop: 42, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12.5, color: "rgba(255,255,255,.55)" }}>
            <div>&copy; 2026 Girard Property Estate Limited. All rights reserved.</div>
            <div style={{ display: "flex", gap: 16 }}>{["Facebook", "Twitter", "YouTube"].map(soc => <span key={soc} style={{ color: "rgba(255,255,255,.55)" }}>{soc}</span>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===================================================================
   STAGE 2: deployable stack + entry flow
   Supabase auth when configured, a local demo store otherwise, a role
   picker, per-account identity resolved by sign-in email, and a
   role-aware home shell. Env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.
   =================================================================== */

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = SUPA_URL && SUPA_KEY ? createClient(SUPA_URL, SUPA_KEY) : null;
const DEMO = !supabase;

const ROLES = [
  { key: "owner", name: "Owner / Landlord", icon: Home, blurb: "List and manage rentals, collect rent and track income." },
  { key: "tenant", name: "Tenant", icon: KeyRound, blurb: "Find a home, apply, pay rent and request repairs." },
  { key: "agent", name: "Agent", icon: Users, blurb: "Run instructions, applications and offers in one pipeline." },
  { key: "investor", name: "Investor / Developer", icon: Briefcase, blurb: "Deal flow, market intelligence and cross-border swaps." },
  { key: "admin", name: "Platform Admin", icon: ShieldCheck, blurb: "Oversee listings, users, verification and the swap pipeline." }
];
const ROLE_TITLE = { owner: "Owner & Landlord", tenant: "Tenant", agent: "Estate Agent", investor: "Investor & Developer", admin: "Platform Administration" };

/* Per-account identity, resolved by sign-in email.
   Edit this map with your real team so each person is greeted by name and title. */
const ADMIN_DOMAIN = "girardproperty.com";
function isApprovedAdmin(email) { const e = (email || "").toLowerCase().trim(); return e.endsWith("@" + ADMIN_DOMAIN) || !!FOUNDERS[e]; }
const FOUNDERS = {
  "olamideokulaja@girardproperty.com": { name: "Olamide Okulaja", title: "Co-Founder & Administrator", greeting: "Welcome back", allAccess: true },
  "founder@girardproperty.com": { name: "Girard Founder", title: "Founder & Administrator", greeting: "Welcome back", allAccess: true },
  "admin@girardproperty.com": { name: "Girard Admin", title: "Platform Administration", greeting: "Welcome back", allAccess: true }
};
function initialsOf(name) { return (name || "G").split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
function resolveIdentity(email, role) {
  const key = (email || "").toLowerCase().trim();
  const approved = isApprovedAdmin(key);
  const eff = (role === "admin" && !approved) ? "owner" : role;
  const f = FOUNDERS[key];
  if (f) { const nm = f.name; return { email: key, role: eff, name: nm, firstName: nm.split(" ")[0], title: f.title, greeting: f.greeting, initials: initialsOf(nm), isFounder: true, allAccess: approved }; }
  const local = (key.split("@")[0] || "there").replace(/[._-]+/g, " ").trim();
  const name = local ? local.replace(/\b\w/g, c => c.toUpperCase()) : "There";
  return { email: key, role: eff, name, firstName: name.split(" ")[0], title: ROLE_TITLE[eff] || "Member", greeting: "Welcome", initials: initialsOf(name), isFounder: false, allAccess: approved };
}

/* auth adapters */
async function authRestore() {
  if (!DEMO) {
    const { data } = await supabase.auth.getSession();
    const u = data.session?.user;
    return u ? { email: u.email, role: u.user_metadata?.role || null } : null;
  }
  const email = localStorage.getItem("girard_session");
  if (!email) return null;
  const accts = JSON.parse(localStorage.getItem("girard_accounts") || "{}");
  return { email, role: accts[email]?.role || null };
}
async function authSignUp(email, password, role) {
  if (!DEMO) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } } });
    if (error) throw new Error(error.message);
    if (!data.session) {
      const r = await supabase.auth.signInWithPassword({ email, password });
      if (r.error) throw new Error("Account created. Please check your email to confirm, then sign in.");
    }
    return { email, role };
  }
  const key = email.toLowerCase().trim();
  const accts = JSON.parse(localStorage.getItem("girard_accounts") || "{}");
  if (accts[key]) throw new Error("An account with that email already exists. Please sign in.");
  accts[key] = { password, role };
  localStorage.setItem("girard_accounts", JSON.stringify(accts));
  localStorage.setItem("girard_session", key);
  return { email: key, role };
}
async function authSignIn(email, password) {
  if (!DEMO) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return { email: data.user.email, role: data.user.user_metadata?.role || null };
  }
  const key = email.toLowerCase().trim();
  const accts = JSON.parse(localStorage.getItem("girard_accounts") || "{}");
  const a = accts[key];
  if (!a || a.password !== password) throw new Error("We do not recognise that email and password.");
  localStorage.setItem("girard_session", key);
  return { email: key, role: a.role || null };
}
async function authSetRole(role) {
  if (!DEMO) { await supabase.auth.updateUser({ data: { role } }); return; }
  const email = localStorage.getItem("girard_session");
  const accts = JSON.parse(localStorage.getItem("girard_accounts") || "{}");
  if (accts[email]) { accts[email].role = role; localStorage.setItem("girard_accounts", JSON.stringify(accts)); }
}
async function authSignOut() {
  if (!DEMO) { await supabase.auth.signOut(); return; }
  localStorage.removeItem("girard_session");
}

function BrandMark({ dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <GirardMark size={30} />
      <div style={{ lineHeight: 1.05 }}>
        <div className="serif" style={{ fontSize: 17, fontWeight: 600, letterSpacing: .8, color: dark ? "var(--ink)" : "#fff" }}>GIRARD</div>
        <div style={{ fontSize: 7.5, letterSpacing: 2.2, color: "var(--gold)" }}>PROPERTY ESTATE</div>
      </div>
    </div>
  );
}

function EntryStyles() {
  return <style>{`
    .wrap{max-width:1200px;margin:0 auto;padding:0 28px}
    .eyebrow{font-size:12px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase}
    .btn-gold{background:var(--gold);color:#201601;border:none;padding:13px 24px;border-radius:2px;font-weight:600;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:background .18s;letter-spacing:.2px}
    .btn-gold:hover{background:var(--gold-2)}
    .btn-gold:disabled{cursor:default}
    .btn-line{background:transparent;padding:12px 22px;border-radius:2px;font-weight:600;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s}
    .btn-line.on-navy{border:1px solid rgba(255,255,255,.28);color:#fff}
    .btn-line.on-navy:hover{border-color:var(--gold);color:var(--gold)}
    .btn-line.on-ivory{border:1px solid var(--cream-line);color:var(--ink)}
    .btn-line.on-ivory:hover{border-color:var(--navy)}
    .field{width:100%;background:#0B2340;border:1px solid var(--navy-line);border-radius:4px;padding:13px 14px 13px 42px;color:#fff;font-size:14.5px;outline:none;transition:border-color .18s}
    .field:focus{border-color:var(--gold)}
    .field::placeholder{color:#6E829A}
    .role-card{text-align:left;width:100%;background:var(--navy-2);border:1px solid var(--navy-line);border-radius:10px;padding:22px;cursor:pointer;transition:border-color .18s,transform .1s,background .18s;color:#fff}
    .role-card:hover{border-color:var(--gold);background:#0E2A4E;transform:translateY(-2px)}
    .tile{background:var(--white);border:1px solid var(--cream-line);border-radius:10px;padding:22px;transition:transform .18s,box-shadow .18s}
    .tile:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(10,31,60,.10)}
    @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .rise{animation:rise .7s ease both}
    @media(max-width:840px){.auth-grid{grid-template-columns:1fr!important}.auth-brand{display:none!important}}
  `}</style>;
}

function RolePage({ onPick, onSignIn, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--navy)", color: "#fff", display: "flex", flexDirection: "column" }}>
      <div className="wrap" style={{ paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <button onClick={onBack} className="btn-line on-navy" style={{ padding: "8px 14px" }}><ArrowLeft size={15} /> Back</button>
        <div style={{ marginRight: "auto", marginLeft: 20 }}><BrandMark /></div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>Have an account? <a href="#" onClick={e => { e.preventDefault(); onSignIn(); }} style={{ color: "var(--gold)", fontWeight: 600 }}>Sign in</a></div>
      </div>
      <div className="wrap" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, paddingBottom: 60, maxWidth: 1000 }}>
        <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 14 }}>Welcome to Girard</div>
        <h1 className="serif" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, letterSpacing: -.5, marginBottom: 10 }}>Which best describes you?</h1>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 16, marginBottom: 34, maxWidth: 560, lineHeight: 1.6 }}>Choose your role and Girard tailors the platform, tools and pricing to you. You can change this later.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {ROLES.map(r => (
            <button key={r.key} className="role-card rise" onClick={() => onPick(r.key)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--gold)", color: "var(--navy)", display: "grid", placeItems: "center" }}><r.icon size={22} /></div>
                <ChevronRight size={18} color="var(--gold)" />
              </div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{r.name}</div>
              <div style={{ color: "rgba(255,255,255,.68)", fontSize: 13.5, lineHeight: 1.5 }}>{r.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, role, onAuthed, onBack, onToggle, onNeedRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";
  const submit = async () => {
    setErr("");
    if (!email || !password) { setErr("Please enter your email and password."); return; }
    if (isSignup && password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (isSignup && role === "admin" && !isApprovedAdmin(email)) { setErr("Admin access is limited to approved @girardproperty.com accounts."); return; }
    setBusy(true);
    try {
      const res = isSignup ? await authSignUp(email, password, role) : await authSignIn(email, password);
      if (!isSignup && !res.role) { onNeedRole(res.email); return; }
      onAuthed(resolveIdentity(res.email, res.role || role));
    } catch (e) { setErr(e.message || "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };
  return (
    <div className="auth-grid" style={{ minHeight: "100vh", background: "var(--navy)", color: "#fff", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      <div className="auth-brand" style={{ background: "var(--navy-2)", padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", borderRight: "1px solid var(--navy-line)" }}>
        <BrandMark />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: -.5 }}>Managed with <span style={{ fontStyle: "italic", color: "var(--gold)" }}>discipline.</span></h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: 16, fontSize: 15.5, maxWidth: 360, lineHeight: 1.6 }}>One governed platform for owners, tenants, agents and investors across Nigeria, the UK and beyond.</p>
        </div>
        <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, height: 200, opacity: .5 }}><Skyline /></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", position: "relative", zIndex: 2 }}>&copy; 2026 Girard Property Estate Limited</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <button onClick={onBack} className="btn-line on-navy" style={{ padding: "7px 13px", marginBottom: 26 }}><ArrowLeft size={14} /> Back</button>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 14, marginBottom: 22 }}>{isSignup ? <>Joining as <span style={{ color: "var(--gold)", fontWeight: 600 }}>{ROLES.find(r => r.key === role)?.name || "a member"}</span>.</> : "Sign in to your Girard account."}</p>
          {DEMO && <div style={{ background: "rgba(198,161,91,.12)", border: "1px solid rgba(198,161,91,.35)", borderRadius: 6, padding: "10px 12px", fontSize: 12.5, color: "var(--gold)", marginBottom: 18, lineHeight: 1.5 }}>Demo mode. Accounts are saved on this device only until Supabase is connected.</div>}
          <div style={{ position: "relative", marginBottom: 12 }}><Mail size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 15 }} /><input className="field" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div style={{ position: "relative", marginBottom: 12 }}><Lock size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 15 }} /><input className="field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} /></div>
          {err && <div style={{ color: "#ff9a90", fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{err}</div>}
          <button className="btn-gold" onClick={submit} disabled={busy} style={{ width: "100%", opacity: busy ? .7 : 1, marginTop: 4 }}>{busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"} <ArrowUpRight size={16} /></button>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "rgba(255,255,255,.65)" }}>
            {isSignup ? "Already have an account? " : "New to Girard? "}
            <a href="#" onClick={e => { e.preventDefault(); onToggle(); }} style={{ color: "var(--gold)", fontWeight: 600 }}>{isSignup ? "Sign in" : "Create one"}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const HOME_TILES = {
  owner: [
    { icon: Building2, label: "List a property", note: "Add a rental with AI-recommended rent" },
    { icon: Users, label: "Applications", note: "Review and approve tenants" },
    { icon: Wallet, label: "Rent & income", note: "Collection, receipts and analytics" },
    { icon: Wrench, label: "Maintenance", note: "Track and resolve tickets" }
  ],
  tenant: [
    { icon: Search, label: "Find a home", note: "Browse and filter listings" },
    { icon: FileText, label: "My application", note: "Apply and sign your lease" },
    { icon: Wallet, label: "Pay rent", note: "Secure online payment" },
    { icon: Wrench, label: "Report a repair", note: "Raise a maintenance request" }
  ],
  agent: [
    { icon: Building2, label: "Instructions", note: "Manage your listings" },
    { icon: LayoutGrid, label: "Applications & offers", note: "One pipeline built for volume" },
    { icon: LineChart, label: "Performance", note: "Track conversion and activity" }
  ],
  investor: [
    { icon: LineChart, label: "Market intelligence", note: "Sold prices, yields and local plans" },
    { icon: Repeat, label: "Swap marketplace", note: "Reciprocal cross-border matches" },
    { icon: Briefcase, label: "Deal flow", note: "Opportunities and partnerships" }
  ],
  admin: [
    { icon: ShieldCheck, label: "Verify listings", note: "Approve and badge properties" },
    { icon: Users, label: "Users", note: "Manage accounts and roles" },
    { icon: Repeat, label: "Swap pipeline", note: "Oversee every active deal" },
    { icon: LineChart, label: "Reports", note: "Platform analytics" }
  ]
};

function HomeShell({ identity, onSignOut, onSwitchRole }) {
  const hr = new Date().getHours();
  const part = hr < 12 ? "morning" : hr < 17 ? "afternoon" : "evening";
  const tiles = HOME_TILES[identity.role] || HOME_TILES.owner;
  return (
    <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <header style={{ background: "var(--navy)", color: "#fff", borderBottom: "1px solid var(--navy-line)" }}>
        <div className="wrap" style={{ height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandMark />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="serif" style={{ width: 36, height: 36, borderRadius: 999, background: "var(--gold)", color: "var(--navy)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{identity.initials}</div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{identity.name}</div>
                <div style={{ fontSize: 11, color: "var(--gold)" }}>{identity.title}</div>
              </div>
            </div>
            <button onClick={onSignOut} className="btn-line on-navy" style={{ padding: "7px 13px" }}><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </header>
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 70 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--gold-2)", marginBottom: 12 }}>{identity.greeting}</div>
            <h1 className="serif" style={{ fontSize: "clamp(30px,4.4vw,48px)", fontWeight: 600, letterSpacing: -.5, color: "var(--ink)" }}>Good {part}, {identity.firstName}.</h1>
            <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 10, maxWidth: 580, lineHeight: 1.6 }}>Your {ROLES.find(r => r.key === identity.role)?.name || "member"} workspace. The tools below come online as we build out the platform.</p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--navy)", color: "var(--gold)", padding: "8px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}><ShieldCheck size={14} /> {ROLE_TITLE[identity.role] || "Member"}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18, marginTop: 36 }}>
          {tiles.map(t => (
            <div key={t.label} className="tile">
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 16 }}><t.icon size={21} /></div>
              <div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{t.label}</div>
              <div style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 }}>{t.note}</div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gold-2)", background: "var(--gold-soft)", padding: "3px 9px", borderRadius: 4 }}>Coming next</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={onSwitchRole} className="btn-line on-ivory">Change role</button>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{DEMO ? "Demo mode: connect Supabase to save accounts across devices." : "Connected to Supabase."}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("loading");
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    let live = true;
    authRestore().then(s => {
      if (!live) return;
      if (s && s.role) { setIdentity(resolveIdentity(s.email, s.role)); setView("home"); }
      else if (s && !s.role) { setPendingEmail(s.email); setView("role"); }
      else setView("landing");
    }).catch(() => { if (live) setView("landing"); });
    return () => { live = false; };
  }, []);

  const goHome = (id) => { setIdentity(id); setView("home"); };

  if (view === "loading") return <div style={{ minHeight: "100vh", background: "var(--navy)", display: "grid", placeItems: "center" }}><EntryStyles /><BrandMark /></div>;

  return (
    <>
      <EntryStyles />
      {view === "landing" && <Landing
        onStart={() => { setRole(null); setMode("signup"); setView("role"); }}
        onSignIn={() => { setMode("signin"); setView("auth"); }} />}
      {view === "role" && <RolePage
        onPick={(r) => {
          if (pendingEmail) { authSetRole(r).then(() => { goHome(resolveIdentity(pendingEmail, r)); setPendingEmail(null); }); }
          else { setRole(r); setMode("signup"); setView("auth"); }
        }}
        onSignIn={() => { setMode("signin"); setView("auth"); }}
        onBack={() => setView(identity ? "home" : "landing")} />}
      {view === "auth" && <AuthPage mode={mode} role={role}
        onAuthed={goHome}
        onNeedRole={(email) => { setPendingEmail(email); setView("role"); }}
        onToggle={() => setMode(m => m === "signup" ? "signin" : "signup")}
        onBack={() => setView(mode === "signup" ? "role" : "landing")} />}
      {view === "home" && identity && <AppShell identity={identity}
        onSignOut={async () => { await authSignOut(); setIdentity(null); setRole(null); setPendingEmail(null); setView("landing"); }}
        onSwitchRole={() => { setPendingEmail(identity.email); setView("role"); }} />}
    </>
  );
}

/* ===================================================================
   STAGE 3: Digital Property Management module (Nigeria first)
   Use cases 1-3: listing with AI rent, tenant search + application +
   screening, lease generation + e-signature, rent collection and
   invoicing (Paystack / Flutterwave), maintenance ticketing, and an
   owner analytics dashboard. Data is seeded and persisted per browser.
   AI uses an optional server proxy at /api/anthropic, with a local
   fallback so every feature works without a key.
   =================================================================== */

const PM_AREAS = ["Lekki", "Ikoyi", "Victoria Island", "Yaba", "Surulere", "Ikeja", "Magodo", "Ajah", "Gbagada", "Maryland"];
const PM_TYPES = ["Apartment", "Terraced Duplex", "Semi-Detached Duplex", "Detached Duplex", "Studio", "Penthouse", "Bungalow"];
const PM_AMEN = ["24hr Power", "Borehole", "Parking", "Security", "Fitted Kitchen", "Gym", "Pool", "BQ", "CCTV", "Elevator"];
const PM_STREETS = ["Admiralty Way", "Bourdillon Rd", "Adeola Odeku St", "Herbert Macaulay Way", "Bode Thomas St", "Allen Ave"];
function baseRent(area, beds) {
  const b = { "Ikoyi": 9, "Victoria Island": 8, "Lekki": 6, "Magodo": 4.5, "Maryland": 4, "Ikeja": 4, "Gbagada": 3.5, "Yaba": 3, "Surulere": 2.8, "Ajah": 2.5 }[area] || 3;
  return Math.round((b + beds * 1.15) * 1000000);
}
const PM_SEEDSTATUS = ["Available", "Leased", "Pending Verification", "Available", "Leased", "Available"];
function seedProperties() {
  return Array.from({ length: 30 }).map((_, i) => {
    const area = PM_AREAS[i % PM_AREAS.length];
    const type = PM_TYPES[(i * 3) % PM_TYPES.length];
    const beds = type === "Studio" ? 0 : 1 + ((i * 2) % 5);
    const status = PM_SEEDSTATUS[i % PM_SEEDSTATUS.length];
    const am = PM_AMEN.filter((_, k) => (i + k) % 3 === 0).slice(0, 5);
    return {
      id: "PR-" + (1000 + i), title: (beds === 0 ? "Studio " : beds + "-Bed ") + type, area, type, beds,
      rent: baseRent(area, beds), status, verified: status !== "Pending Verification",
      amenities: am.length ? am : ["Parking", "Security"], address: (10 + i) + " " + PM_STREETS[i % 6] + ", " + area,
      hue: 200 + (i * 7) % 30
    };
  });
}
const BOURDILLON = {
  id: "PR-BOURDILLON", title: "1 Bourdillon Residences", area: "Ikoyi", type: "Luxury Apartment", beds: 3,
  rent: 95000000, status: "Available", verified: true, hue: 210, featured: true, img: "/img/bourdillon_tower.jpg",
  units: 40, height: "110m", plot: "2,039 sq.m",
  amenities: ["Rooftop Infinity Pool", "Fitness Studio", "24/7 Concierge", "Smart Home", "Secure Parking", "Panoramic Water Views"],
  address: "Bourdillon Road, Ikoyi, Lagos",
  blurb: "A refined expression of vertical luxury on Bourdillon Road, Ikoyi. 40 bespoke residences with panoramic water views, floor-to-ceiling glazing and world-class amenities, developed by Girard Property Estate Limited.",
  gallery: ["/img/bourdillon_tower.jpg", "/img/bourdillon_lobby.jpg", "/img/bourdillon_living.jpg", "/img/bourdillon_bedroom.jpg", "/img/bourdillon_pool.jpg", "/img/bourdillon_entrance.jpg"]
};

function pmSeed() {
  return {
    properties: [BOURDILLON, ...seedProperties()],
    applications: [
      { id: "AP-01", tenant: "Chidera Okonkwo", email: "chidera@example.com", property: "PR-1004", income: 14000000, score: 742, status: "Applied", note: "Fintech PM, 3yr employment" },
      { id: "AP-02", tenant: "Fatima Bello", email: "fatima@example.com", property: "PR-1010", income: 9500000, score: 688, status: "More Info Required", note: "Guarantor pending" }
    ],
    leases: [],
    invoices: [
      { id: "INV-9001", property: "PR-1001", tenant: "Ada Eze", amount: 7150000, due: "2026-07-01", status: "Paid" },
      { id: "INV-9002", property: "PR-1007", tenant: "Tunde Adeyemi", amount: 10350000, due: "2026-07-10", status: "Pending" },
      { id: "INV-9003", property: "PR-1013", tenant: "Grace N.", amount: 5750000, due: "2026-06-20", status: "Late", lateFee: 287500 }
    ],
    tickets: [
      { id: "MT-501", property: "PR-1004", tenant: "Fatima Bello", category: "Plumbing", desc: "Leaking faucet in master bath", status: "Open", priority: "Normal", vendor: null },
      { id: "MT-502", property: "PR-1010", tenant: "Tunde Adeyemi", category: "Electrical", desc: "Inverter not switching over", status: "Assigned", priority: "Emergency", vendor: "PowerFix Ltd" },
      { id: "MT-503", property: "PR-1001", tenant: "Ada Eze", category: "AC / HVAC", desc: "Living room AC not cooling", status: "Resolved", priority: "Normal", vendor: "CoolAir NG" }
    ]
  };
}
const PM_KEY = "girard_pm_v3";
function pmLoad() { try { const r = localStorage.getItem(PM_KEY); if (r) return JSON.parse(r); } catch (e) {} const s = pmSeed(); try { localStorage.setItem(PM_KEY, JSON.stringify(s)); } catch (e) {} return s; }
function pmSave(s) { try { localStorage.setItem(PM_KEY, JSON.stringify(s)); } catch (e) {} }

const money = (a, c) => (c || "₦") + Number(a || 0).toLocaleString("en-NG");
const propOf = (st, id) => st.properties.find(p => p.id === id);

async function aiProxy(prompt, system) {
  try {
    const r = await fetch("/api/anthropic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, system }) });
    if (!r.ok) throw new Error("proxy");
    const d = await r.json();
    const text = (d.text || d.content || "").toString().trim();
    if (!text) throw new Error("empty");
    return { ok: true, text };
  } catch (e) { return { ok: false, text: "" }; }
}
async function aiRent({ type, area, beds, amenities }) {
  const annual = baseRent(area, +beds || 0);
  const proxy = await aiProxy(`In one sentence, explain why an annual rent near ₦${annual.toLocaleString()} is competitive for a ${beds}-bed ${type} in ${area}, Lagos with amenities ${(amenities || []).join(", ") || "standard"}. No preamble.`);
  const rationale = proxy.ok ? proxy.text : `Based on comparable ${beds}-bed ${type.toLowerCase()} listings in ${area} and its amenity profile, this sits within the prevailing market band.`;
  return { annual, monthly: Math.round(annual / 12), rationale, offline: !proxy.ok };
}
async function aiLease({ tenant, prop }) {
  const proxy = await aiProxy(`Draft a concise residential tenancy agreement (about 160 words) under Nigerian tenancy law. Landlord: Girard Property Estate Limited. Tenant: ${tenant}. Property: ${prop.title} at ${prop.address}. Annual rent: ₦${prop.rent.toLocaleString()}. Term: 12 months from 1 August 2026. Include parties, rent, term and three standard obligations. Plain text, no markdown.`);
  if (proxy.ok) return { text: proxy.text, offline: false };
  return {
    offline: true,
    text: `THIS TENANCY AGREEMENT is made on 1 August 2026 between Girard Property Estate Limited (the Landlord) and ${tenant} (the Tenant) for the property known as ${prop.title}, ${prop.address}.\n\nThe Tenant shall pay an annual rent of ${money(prop.rent)} for a term of 12 months. The Tenant shall keep the premises in good and tenantable condition, shall not sublet or assign without the Landlord's written consent, and shall permit the Landlord reasonable access for inspection upon prior notice.\n\nThe Landlord shall ensure the Tenant's quiet enjoyment of the premises and shall maintain the structural elements of the property. This agreement is governed by the tenancy laws applicable in Lagos State, Nigeria.`
  };
}

/* ---------- PM primitives ---------- */
function PmBtn({ children, kind = "gold", size = "md", icon: Icon, onClick, disabled, style }) {
  const pad = size === "sm" ? "7px 13px" : "10px 17px";
  const kinds = {
    gold: { background: "var(--gold)", color: "#201601", border: "none" },
    navy: { background: "var(--navy)", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "var(--ink)", border: "1px solid var(--cream-line)" },
    danger: { background: "var(--danger)", color: "#fff", border: "none" },
    soft: { background: "var(--gold-soft)", color: "var(--gold-2)", border: "none" }
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...kinds[kind], padding: pad, borderRadius: 6, fontWeight: 600, fontSize: size === "sm" ? 13 : 14, cursor: disabled ? "default" : "pointer", opacity: disabled ? .55 : 1, display: "inline-flex", alignItems: "center", gap: 7, ...style }}>{Icon && <Icon size={size === "sm" ? 15 : 16} />}{children}</button>;
}
function PmPill({ label }) {
  const M = { Available: "#1F9D57", Verified: "var(--gold-2)", Leased: "#2F6FB0", "Pending Verification": "#E0A106", Applied: "#2F6FB0", Approved: "#1F9D57", Rejected: "#D0453B", "More Info Required": "#E0A106", Open: "#E0A106", Assigned: "#2F6FB0", Resolved: "#1F9D57", Paid: "#1F9D57", Pending: "#E0A106", Late: "#D0453B", Emergency: "#D0453B", Normal: "var(--muted)" };
  const c = M[label] || "var(--muted)";
  return <span style={{ background: c + "22", color: c, fontWeight: 700, fontSize: 11, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{label}</span>;
}
function PmCard({ children, pad = 18, style }) { return <div className="card-soft" style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 12, padding: pad, ...style }}>{children}</div>; }
function PmField({ label, value, onChange, placeholder, type }) {
  return <div>{label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>{label}</label>}
    <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: "10px 12px", color: "var(--ink)", fontSize: 14, outline: "none" }} /></div>;
}
function PmSelect({ label, value, onChange, options }) {
  return <div>{label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: "10px 12px", color: "var(--ink)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>;
}
function PmStat({ icon: Icon, label, value, sub, tone }) {
  return <PmCard pad={16} style={{ flex: 1, minWidth: 150 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div><div style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 600 }}>{label}</div>
        <div className="serif" style={{ color: "var(--ink)", fontSize: 26, fontWeight: 600, marginTop: 3 }}>{value}</div>
        {sub && <div style={{ color: tone || "#1F9D57", fontSize: 12, fontWeight: 600, marginTop: 2 }}>{sub}</div>}</div>
      <div style={{ background: "var(--navy)", color: "var(--gold)", width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center" }}><Icon size={19} /></div>
    </div></PmCard>;
}
function PmModal({ title, onClose, children, wide }) {
  return <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,20,35,.55)", zIndex: 60, display: "grid", placeItems: "center", padding: 16 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", borderRadius: 14, width: wide ? 720 : 500, maxWidth: "100%", maxHeight: "88vh", overflow: "auto" }}>
      <div style={{ position: "sticky", top: 0, background: "var(--white)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--cream-line)" }}>
        <div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>{title}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={20} /></button>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div></div>;
}
function AiPanel({ loading, offline, children }) {
  return <div style={{ background: "var(--gold-soft)", border: "1px solid var(--gold)", borderRadius: 10, padding: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--gold-2)", fontWeight: 700, fontSize: 12.5, marginBottom: 8 }}><Sparkles size={14} /> AI Engine{offline ? <span style={{ color: "var(--muted)", fontWeight: 600 }}> · offline estimate</span> : null}</div>
    {loading ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13 }}><Loader2 size={15} className="spin" /> Analysing market data…</div> : children}</div>;
}
function HouseArt({ hue = 200, status, h = 140, photo }) {
  const [ok, setOk] = useState(!!photo);
  return <div style={{ position: "relative", height: h, borderRadius: 10, overflow: "hidden", background: "linear-gradient(140deg, hsl(" + hue + ",42%,22%), hsl(" + (hue - 10) + ",50%,34%))" }}>
    {photo && ok ? <img src={photo} alt="" onError={() => setOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <svg viewBox="0 0 300 140" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .22 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.4"><path d="M60 110 L60 64 L96 44 L132 64 L132 110 Z" /><path d="M150 110 L150 52 L188 30 L226 52 L226 110 Z" /><rect x="240" y="74" width="34" height="36" /></g></svg>}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,31,60,0) 52%, rgba(10,31,60,.45))" }} />
    {status && <div style={{ position: "absolute", top: 10, left: 10 }}><PmPill label={status} /></div>}
  </div>;
}

/* ---------- mini charts (no dependencies) ---------- */
function MiniArea({ data, w = 520, h = 180, color = "#B8934A", fill = "#C6A15B" }) {
  const max = Math.max(...data.map(d => d.v)) * 1.15, min = 0;
  const X = i => (i / (data.length - 1)) * (w - 20) + 10;
  const Y = v => h - 24 - ((v - min) / (max - min)) * (h - 40);
  const line = data.map((d, i) => (i ? "L" : "M") + X(i) + " " + Y(d.v)).join(" ");
  const area = line + " L" + X(data.length - 1) + " " + (h - 24) + " L" + X(0) + " " + (h - 24) + " Z";
  const gid = "ma" + String(fill).replace(/[^a-zA-Z0-9]/g, "");
  return <svg viewBox={"0 0 " + w + " " + h} width="100%" height={h}>
    <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={fill} stopOpacity=".38" /><stop offset="100%" stopColor={fill} stopOpacity="0" /></linearGradient></defs>
    <path d={area} fill={"url(#" + gid + ")"} /><path className="chart-line" d={line} fill="none" stroke={color} strokeWidth="2.5" />
    {data.map((d, i) => <text key={i} x={X(i)} y={h - 6} fontSize="11" fill="var(--muted)" textAnchor="middle">{d.m}</text>)}
  </svg>;
}
function MiniBars({ data, w = 520, h = 180, colors }) {
  const max = Math.max(...data.map(d => d.v)) * 1.15, bw = (w - 20) / data.length;
  return <svg viewBox={"0 0 " + w + " " + h} width="100%" height={h}>
    {data.map((d, i) => { const bh = (d.v / max) * (h - 40); return <g key={i}><rect className="chart-bar" style={{ animationDelay: (i * 0.05) + "s" }} x={10 + i * bw + bw * .2} y={h - 24 - bh} width={bw * .6} height={bh} rx="4" fill={colors ? colors[i % colors.length] : "var(--navy)"} /><text x={10 + i * bw + bw * .5} y={h - 6} fontSize="10.5" fill="var(--muted)" textAnchor="middle">{d.m}</text></g>; })}
  </svg>;
}
function MiniDonut({ data, size = 170 }) {
  const total = data.reduce((s, d) => s + d.v, 0); let acc = 0; const r = size / 2 - 14, cx = size / 2, cy = size / 2;
  const seg = data.map(d => { const a0 = acc / total * Math.PI * 2 - Math.PI / 2; acc += d.v; const a1 = acc / total * Math.PI * 2 - Math.PI / 2; const big = a1 - a0 > Math.PI ? 1 : 0; const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1); return { d: "M" + x0 + " " + y0 + " A" + r + " " + r + " 0 " + big + " 1 " + x1 + " " + y1, c: d.c }; });
  return <svg className="chart-donut" viewBox={"0 0 " + size + " " + size} width={size} height={size}>{seg.map((s, i) => <path key={i} d={s.d} fill="none" stroke={s.c} strokeWidth="16" strokeLinecap="butt" />)}<text x={cx} y={cy + 5} textAnchor="middle" className="serif" fontSize="22" fill="var(--ink)" fontWeight="600">{total}</text></svg>;
}
function Legend({ items }) { return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{items.map(i => <div key={i.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}><span style={{ width: 10, height: 10, borderRadius: 3, background: i.c }} />{i.name} <b style={{ color: "var(--ink)", marginLeft: "auto" }}>{i.v}</b></div>)}</div>; }

/* Colourful palette + calm colour stat card for the dashboards */
const CHART_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#14B8A6", "#F43F5E", "#6366F1"];
function CStat({ icon: Icon, label, value, sub, c = "#3B82F6", bg = "#EAF2FE" }) {
  return <div className="lift card-soft" style={{ background: bg, borderRadius: 14, padding: 18, border: "1px solid " + c + "26" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{label}</span>
      <span style={{ width: 34, height: 34, borderRadius: 9, background: c, color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={17} /></span>
    </div>
    <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: "var(--ink)", lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: c, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </div>;
}

const H2 = ({ title, sub, right }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}><div><h1 className="serif" style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: -.3 }}>{title}</h1>{sub && <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 3 }}>{sub}</div>}</div>{right}</div>;

/* ---------- OWNER DASHBOARD ---------- */
function OwnerDash({ st, identity }) {
  const leased = st.properties.filter(p => p.status === "Leased").length;
  const occ = Math.round(leased / st.properties.length * 100);
  const income = [{ m: "Feb", v: 58 }, { m: "Mar", v: 64 }, { m: "Apr", v: 61 }, { m: "May", v: 72 }, { m: "Jun", v: 78 }, { m: "Jul", v: 83 }];
  const byArea = PM_AREAS.slice(0, 7).map(a => ({ m: a.slice(0, 4), v: Math.round(st.properties.filter(p => p.area === a).reduce((s, p) => s + p.rent, 0) / 1e6) }));
  const occData = [{ name: "Leased", v: leased, c: "#10B981" }, { name: "Available", v: st.properties.length - leased, c: "#F59E0B" }];
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const activity = [
    { icon: Users, t: "New application · 3-Bed Ikoyi", s: "12m ago" },
    { icon: Wallet, t: "Rent received · INV-9001", s: "1h ago" },
    { icon: Wrench, t: "Ticket resolved · Living room AC", s: "3h ago" },
    { icon: Building2, t: "New instruction · Penthouse VI", s: "Yesterday" }
  ];
  return <div>
    <H2 title={"Good day, " + identity.firstName} sub="Girard-managed portfolio at a glance" right={<span style={{ color: "var(--muted)", fontSize: 13 }}>{today}</span>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }} className="dash-kpi">
      <CStat icon={Wallet} label="Monthly income" value="₦83.4M" sub="▲ 6.4% vs May" c="#3B82F6" bg="#EAF2FE" />
      <CStat icon={Building2} label="Properties" value={String(st.properties.length)} sub="Under management" c="#8B5CF6" bg="#F1ECFE" />
      <CStat icon={Home} label="Occupancy" value={occ + "%"} sub={leased + " leased"} c="#10B981" bg="#E7F7F0" />
      <CStat icon={Wrench} label="Open tickets" value={String(st.tickets.filter(t => t.status !== "Resolved").length)} sub="1 emergency" c="#F59E0B" bg="#FEF4E3" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16, marginBottom: 16 }} className="pm-grid2">
      <PmCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div className="serif" style={{ fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>Rental income trend</div><span style={{ fontSize: 12, color: "var(--muted)" }}>₦ millions</span></div>
        <MiniArea data={income} w={720} h={230} color="#6366F1" fill="#3B82F6" />
      </PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Occupancy</div><div style={{ display: "flex", alignItems: "center", gap: 14 }}><MiniDonut data={occData} size={150} /><Legend items={occData} /></div></PmCard>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Rent by area (₦M)</div><MiniBars data={byArea} w={640} h={210} colors={CHART_COLORS} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Recent activity</div><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{activity.map((a, i) => { const cc = CHART_COLORS[i % CHART_COLORS.length]; return <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, background: cc + "1f", color: cc, display: "grid", placeItems: "center", flexShrink: 0 }}><a.icon size={15} /></div><div style={{ minWidth: 0 }}><div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.t}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{a.s}</div></div></div>; })}</div></PmCard>
    </div>
    <style>{`@media(max-width:900px){.dash-kpi{grid-template-columns:1fr 1fr!important}.pm-grid2{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

/* ---------- PROPERTIES ---------- */
function PropertiesScreen({ st, setSt, identity }) {
  const isAdmin = identity.role === "admin";
  const [area, setArea] = useState("All");
  const [sel, setSel] = useState(null);
  const list = st.properties.filter(p => area === "All" || p.area === area);
  const verify = (id) => { const next = { ...st, properties: st.properties.map(p => p.id === id ? { ...p, status: "Available", verified: true } : p) }; setSt(next); setSel(null); };
  return <div>
    <H2 title="Properties" sub={list.length + " of " + st.properties.length + " shown"} right={<div style={{ width: 200 }}><PmSelect value={area} onChange={setArea} options={["All", ...PM_AREAS]} /></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
      {list.map(p => <PmCard key={p.id} pad={0} style={{ overflow: "hidden", cursor: "pointer" }}>
        <div onClick={() => setSel(p)}><HouseArt hue={p.hue} status={p.status} photo={p.img || poolPhoto(p.id)} /></div>
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}><div className="serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{p.title}</div>{p.verified && <ShieldCheck size={15} color="var(--gold-2)" />}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, margin: "4px 0 8px" }}>{p.area} · {p.beds || "Studio"} bed</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ color: "var(--navy)", fontWeight: 700 }}>{money(p.rent)}<span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 11 }}>/yr</span></div><PmBtn size="sm" onClick={() => setSel(p)}>View</PmBtn></div>
        </div></PmCard>)}
    </div>
    {sel && <PmModal title={sel.title} onClose={() => setSel(null)} wide>
      <HouseArt hue={sel.hue} status={sel.status} h={190} photo={sel.img || poolPhoto(sel.id)} />
      {sel.featured && <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>{[["Units", sel.units], ["Max height", sel.height], ["Plot", sel.plot]].map(([k, v]) => <div key={k} style={{ flex: 1, minWidth: 110, background: "var(--ivory)", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 11, color: "var(--muted)" }}>{k}</div><div className="serif" style={{ fontWeight: 600, color: "var(--ink)", fontSize: 17 }}>{v}</div></div>)}</div>
        <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>{sel.blurb}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>{sel.gallery.slice(1).map(src => <img key={src} src={src} alt="" style={{ width: "100%", height: 78, objectFit: "cover", borderRadius: 8 }} />)}</div>
      </div>}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, margin: "16px 0" }}>
        <div><div style={{ color: "var(--muted)", fontSize: 12 }}>Annual rent</div><div className="serif" style={{ color: "var(--navy)", fontWeight: 600, fontSize: 22 }}>{money(sel.rent)}</div></div>
        <div><div style={{ color: "var(--muted)", fontSize: 12 }}>Address</div><div style={{ fontWeight: 600, color: "var(--ink)" }}>{sel.address}</div></div>
        <div><div style={{ color: "var(--muted)", fontSize: 12 }}>Type</div><div style={{ fontWeight: 600, color: "var(--ink)" }}>{sel.type}</div></div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>{sel.amenities.map(a => <span key={a} style={{ background: "var(--ivory)", color: "var(--muted)", fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 7 }}>{a}</span>)}</div>
      {isAdmin && sel.status === "Pending Verification" && <PmBtn kind="gold" icon={ShieldCheck} onClick={() => verify(sel.id)}>Verify and publish</PmBtn>}
    </PmModal>}
  </div>;
}

/* ---------- ADD PROPERTY ---------- */
function AddPropertyScreen({ st, setSt, toast }) {
  const [f, setF] = useState({ type: PM_TYPES[0], area: PM_AREAS[0], beds: "3", amenities: [] });
  const [ai, setAi] = useState(null);
  const [price, setPrice] = useState("");
  const [done, setDone] = useState(false);
  const toggle = a => setF(x => ({ ...x, amenities: x.amenities.includes(a) ? x.amenities.filter(z => z !== a) : [...x.amenities, a] }));
  const rec = async () => { setAi({ loading: true }); const r = await aiRent(f); setAi({ loading: false, ...r }); setPrice(String(r.annual)); };
  const submit = () => {
    const id = "PR-" + (2000 + st.properties.length);
    const p = { id, title: (f.beds === "0" ? "Studio " : f.beds + "-Bed ") + f.type, area: f.area, type: f.type, beds: +f.beds, rent: +price || baseRent(f.area, +f.beds), status: "Pending Verification", verified: false, amenities: f.amenities.length ? f.amenities : ["Parking", "Security"], address: "New listing, " + f.area, hue: 200 + st.properties.length % 30 };
    setSt({ ...st, properties: [p, ...st.properties] }); toast("Listing submitted, pending verification"); setDone(true);
  };
  if (done) return <div><H2 title="Add property" /><PmCard><div style={{ textAlign: "center", padding: 28 }}><div style={{ width: 56, height: 56, borderRadius: 999, background: "#E0A60622", margin: "0 auto 12px", display: "grid", placeItems: "center" }}><Clock size={26} color="#E0A106" /></div><div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>Submitted for verification</div><div style={{ color: "var(--muted)", margin: "8px 0 16px" }}>An admin verifies ownership, then it earns a Verified badge and goes live.</div><PmBtn onClick={() => { setDone(false); setAi(null); setPrice(""); }}>Add another</PmBtn></div></PmCard></div>;
  return <div>
    <H2 title="Add property" sub="List a rental and get an AI rent recommendation" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="pm-grid2">
      <PmCard><div style={{ display: "grid", gap: 14 }}>
        <PmSelect label="Property type" value={f.type} onChange={v => setF({ ...f, type: v })} options={PM_TYPES} />
        <PmSelect label="Area (Lagos)" value={f.area} onChange={v => setF({ ...f, area: v })} options={PM_AREAS} />
        <PmSelect label="Bedrooms" value={f.beds} onChange={v => setF({ ...f, beds: v })} options={["0", "1", "2", "3", "4", "5"]} />
        <div><label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Amenities</label><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{PM_AMEN.map(a => <button key={a} onClick={() => toggle(a)} style={{ border: "1px solid " + (f.amenities.includes(a) ? "var(--gold)" : "var(--cream-line)"), background: f.amenities.includes(a) ? "var(--gold-soft)" : "transparent", color: f.amenities.includes(a) ? "var(--gold-2)" : "var(--muted)", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{a}</button>)}</div></div>
        <PmBtn kind="navy" icon={Sparkles} onClick={rec}>Get AI rent recommendation</PmBtn>
      </div></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Pricing</div>
        {!ai ? <div style={{ color: "var(--muted)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>Enter details, then request an AI recommendation.</div>
          : <><AiPanel loading={ai.loading} offline={ai.offline}><div style={{ display: "flex", gap: 18, marginBottom: 8 }}><div><div style={{ color: "var(--muted)", fontSize: 11 }}>Recommended annual</div><div className="serif" style={{ fontWeight: 600, fontSize: 19, color: "var(--ink)" }}>{money(ai.annual)}</div></div><div><div style={{ color: "var(--muted)", fontSize: 11 }}>Monthly</div><div className="serif" style={{ fontWeight: 600, fontSize: 19, color: "var(--ink)" }}>{money(ai.monthly)}</div></div></div><div style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.5 }}>{ai.rationale}</div></AiPanel>
            <div style={{ marginTop: 14 }}><PmField label="Your set rent (₦/yr)" value={price} onChange={setPrice} /></div>
            {price && ai.annual && Math.abs(+price - ai.annual) / ai.annual > 0.15 && <div style={{ color: "#E0A106", fontSize: 12.5, marginTop: 6, display: "flex", gap: 6 }}><AlertTriangle size={14} /> Differs from the AI recommendation by more than 15%. This may affect time-to-let.</div>}
            <PmBtn kind="gold" icon={CheckCircle2} style={{ marginTop: 16 }} onClick={submit}>Submit listing</PmBtn></>}
      </PmCard>
    </div>
  </div>;
}

/* ---------- TENANT: FIND A HOME + APPLY ---------- */
function TenantFind({ st, setSt, identity, toast }) {
  const [area, setArea] = useState("All");
  const [beds, setBeds] = useState("Any");
  const [sel, setSel] = useState(null);
  const [apply, setApply] = useState(null);
  const list = st.properties.filter(p => p.status === "Available" && (area === "All" || p.area === area) && (beds === "Any" || (beds === "3+" ? p.beds >= 3 : p.beds === +beds)));
  return <div>
    <H2 title="Find a home" sub={list.length + " available"} right={<div style={{ display: "flex", gap: 10 }}><div style={{ width: 160 }}><PmSelect value={area} onChange={setArea} options={["All", ...PM_AREAS]} /></div><div style={{ width: 120 }}><PmSelect value={beds} onChange={setBeds} options={["Any", "1", "2", "3+"]} /></div></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
      {list.map(p => <PmCard key={p.id} pad={0} style={{ overflow: "hidden" }}>
        <div style={{ cursor: "pointer" }} onClick={() => setSel(p)}><HouseArt hue={p.hue} status="Available" photo={p.img || poolPhoto(p.id)} /></div>
        <div style={{ padding: 14 }}><div className="serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{p.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, margin: "4px 0 8px" }}>{p.area} · {p.beds || "Studio"} bed</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ color: "var(--navy)", fontWeight: 700 }}>{money(p.rent)}<span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 11 }}>/yr</span></div><PmBtn size="sm" onClick={() => setApply(p)}>Apply</PmBtn></div>
        </div></PmCard>)}
    </div>
    {sel && !apply && <PmModal title={sel.title} onClose={() => setSel(null)} wide>
      <HouseArt hue={sel.hue} status="Available" h={190} photo={sel.img || poolPhoto(sel.id)} />
      {sel.featured && <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>{[["Units", sel.units], ["Max height", sel.height], ["Plot", sel.plot]].map(([k, v]) => <div key={k} style={{ flex: 1, minWidth: 110, background: "var(--ivory)", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 11, color: "var(--muted)" }}>{k}</div><div className="serif" style={{ fontWeight: 600, color: "var(--ink)", fontSize: 17 }}>{v}</div></div>)}</div>
        <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>{sel.blurb}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>{sel.gallery.slice(1).map(src => <img key={src} src={src} alt="" style={{ width: "100%", height: 78, objectFit: "cover", borderRadius: 8 }} />)}</div>
      </div>}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, margin: "16px 0" }}><div><div style={{ color: "var(--muted)", fontSize: 12 }}>Annual rent</div><div className="serif" style={{ color: "var(--navy)", fontWeight: 600, fontSize: 22 }}>{money(sel.rent)}</div></div><div><div style={{ color: "var(--muted)", fontSize: 12 }}>Address</div><div style={{ fontWeight: 600, color: "var(--ink)" }}>{sel.address}</div></div></div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>{sel.amenities.map(a => <span key={a} style={{ background: "var(--ivory)", color: "var(--muted)", fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 7 }}>{a}</span>)}</div>
      <PmBtn kind="gold" icon={PenLine} onClick={() => { setApply(sel); }}>Apply to rent</PmBtn>
    </PmModal>}
    {apply && <ApplyModal st={st} setSt={setSt} identity={identity} prop={apply} onClose={() => { setApply(null); setSel(null); }} toast={toast} />}
  </div>;
}
function ApplyModal({ st, setSt, identity, prop, onClose, toast }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: identity.name, employer: "", income: "", ref: "" });
  const [result, setResult] = useState(null);
  const submit = () => {
    setStep(2);
    const inc = +String(f.income).replace(/\D/g, "") || 0;
    const ratio = inc ? prop.rent / inc : 9;
    setTimeout(() => {
      const r = ratio < 0.33 ? "Approved" : ratio < 0.45 ? "More Info Required" : "Rejected";
      const score = Math.max(560, Math.min(820, Math.round(820 - ratio * 500)));
      const app = { id: "AP-" + (100 + st.applications.length), tenant: f.name, email: identity.email, property: prop.id, income: inc, score, status: r, note: f.employer || "Applicant" };
      setSt({ ...st, applications: [app, ...st.applications] });
      setResult(r); toast("Application " + r.toLowerCase(), r === "Rejected" ? "danger" : "success");
    }, 1300);
  };
  return <PmModal title={"Apply · " + prop.title} onClose={onClose}>
    <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>{["Details", "Documents", "Screening"].map((s, i) => <div key={s} style={{ flex: 1, textAlign: "center", fontSize: 11.5, fontWeight: 700, color: i <= step ? "var(--gold-2)" : "var(--muted)", borderBottom: "3px solid " + (i <= step ? "var(--gold)" : "var(--cream-line)"), paddingBottom: 8 }}>{s}</div>)}</div>
    {step === 0 && <div style={{ display: "grid", gap: 12 }}>
      <PmField label="Full name" value={f.name} onChange={v => setF({ ...f, name: v })} />
      <PmField label="Employer" value={f.employer} onChange={v => setF({ ...f, employer: v })} />
      <PmField label="Annual income (₦)" value={f.income} onChange={v => setF({ ...f, income: v })} placeholder="e.g. 18,000,000" />
      <PmField label="Reference contact" value={f.ref} onChange={v => setF({ ...f, ref: v })} />
      <PmBtn onClick={() => setStep(1)} disabled={!f.name || !f.income}>Continue</PmBtn>
    </div>}
    {step === 1 && <div style={{ display: "grid", gap: 12 }}>
      {["Government ID", "Proof of income", "Employment letter"].map(d => <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed var(--cream-line)", borderRadius: 9, padding: 13 }}><span style={{ color: "var(--ink)", fontSize: 13.5, fontWeight: 600 }}>{d}</span><PmBtn kind="soft" size="sm" icon={Upload}>Upload</PmBtn></div>)}
      <PmBtn onClick={submit}>Submit application</PmBtn>
    </div>}
    {step === 2 && <div style={{ textAlign: "center", padding: "10px 0" }}>{!result ? <div style={{ color: "var(--muted)" }}><Loader2 size={30} className="spin" style={{ color: "var(--gold-2)" }} /><div style={{ marginTop: 12, fontWeight: 600 }}>Running automated screening…</div><div style={{ fontSize: 12.5 }}>Credit, rent-to-income and reference checks</div></div>
      : <div><div style={{ width: 58, height: 58, borderRadius: 999, margin: "0 auto 12px", display: "grid", placeItems: "center", background: (result === "Approved" ? "#1F9D57" : result === "Rejected" ? "#D0453B" : "#E0A106") + "22" }}>{result === "Approved" ? <Check size={28} color="#1F9D57" /> : result === "Rejected" ? <X size={28} color="#D0453B" /> : <AlertTriangle size={26} color="#E0A106" />}</div>
        <div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>{result}</div>
        <div style={{ color: "var(--muted)", fontSize: 13.5, margin: "8px 0 16px", lineHeight: 1.5 }}>{result === "Approved" ? "Your profile meets Girard's criteria. The owner will issue a lease to e-sign." : result === "Rejected" ? "The rent-to-income ratio is outside the acceptable range. Try other properties." : "We need a guarantor's details before final approval."}</div>
        <PmBtn onClick={onClose}>Done</PmBtn></div>}</div>}
  </PmModal>;
}

/* ---------- APPLICATIONS (owner/admin) ---------- */
function hashStr(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
const GUARANTOR_NAMES = ["Mr. BABATunde Coker", "Mrs. Amaka Obi", "Engr. Yusuf Danladi", "Dr. Ronke Adebayo", "Mr. Chukwuma Eze"];
const EMPLOYERS = ["Zenith Corporate Services", "MTN Nigeria", "Access Bank Plc", "Dangote Group", "Andela Nigeria"];
function appChecks(app, rent) {
  const h = hashStr(app.id);
  return [
    { k: "Affordability", doc: "Bank statement (6 months)", type: "bank", ok: app.income >= rent * 0.4 },
    { k: "Employment verified", doc: "Letter of employment", type: "employment", ok: true },
    { k: "Guarantor provided", doc: "Guarantor undertaking", type: "guarantor", ok: h % 5 !== 0 },
    { k: "Previous landlord reference", doc: "Landlord reference", type: "reference", ok: h % 4 !== 0 },
    { k: "KYC (BVN / NIN)", doc: "Identity verification", type: "kyc", ok: true },
    { k: "Advance-rent capacity", doc: "Proof of funds", type: "funds", ok: h % 3 !== 0 }
  ];
}
function DocRow({ children }) { return <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--cream-line)", fontSize: 13 }}>{children}</div>; }
function docBody(type, app, p, rent) {
  const h = hashStr(app.id);
  const salaryM = Math.round(app.income / 12);
  const emp = EMPLOYERS[h % EMPLOYERS.length];
  const gua = GUARANTOR_NAMES[h % GUARANTOR_NAMES.length];
  const nin = String(21000000000 + (h % 8999999999));
  const bvn = String(22000000000 + ((h * 7) % 7999999999));
  if (type === "bank") return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)" }}>First Bank of Nigeria</div>
    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Statement of account · {app.tenant}</div>
    <DocRow><span style={{ color: "var(--muted)" }}>Salary credit</span><b style={{ color: "#1F9D57" }}>+{money(salaryM)}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Salary credit</span><b style={{ color: "#1F9D57" }}>+{money(salaryM)}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Card & transfers</span><b>-{money(Math.round(salaryM * .5))}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Average monthly inflow</span><b>{money(salaryM)}</b></DocRow>
    <div style={{ marginTop: 10, fontWeight: 700, color: "var(--ink)" }}>Closing balance: {money(salaryM * 2)}</div>
  </div>;
  if (type === "employment") return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Letter of Employment</div>
    <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.6 }}>This is to confirm that {app.tenant} is employed at {emp} and earns a gross monthly salary of {money(salaryM)}. Their employment is confirmed and in good standing.</p>
    <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Human Resources, {emp}</div>
  </div>;
  if (type === "guarantor") return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Guarantor Undertaking</div>
    <DocRow><span style={{ color: "var(--muted)" }}>Guarantor</span><b>{gua}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Relationship</span><b>Employer / colleague</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Occupation</span><b>Senior manager</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Address</span><b>Ikoyi, Lagos</b></DocRow>
    <p style={{ fontSize: 13, color: "var(--ink)", marginTop: 10, lineHeight: 1.6 }}>I agree to stand as guarantor for {app.tenant} and accept liability in the event of default.</p>
  </div>;
  if (type === "reference") return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Previous Landlord Reference</div>
    <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.6 }}>{app.tenant} rented from me for two years. Rent was paid promptly each cycle and the property was kept in excellent condition. I recommend them without reservation.</p>
    <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Former landlord · +234 803 000 0000</div>
  </div>;
  if (type === "kyc") return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Identity Verification</div>
    <DocRow><span style={{ color: "var(--muted)" }}>Full name</span><b>{app.tenant}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>NIN</span><b>••• ••• {nin.slice(-4)}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>BVN</span><b>•••••• {bvn.slice(-4)}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Status</span><b style={{ color: "#1F9D57" }}>Verified via NIMC / BVN</b></DocRow>
  </div>;
  return <div>
    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Proof of Funds</div>
    <DocRow><span style={{ color: "var(--muted)" }}>Bank</span><b>GTBank</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Available balance</span><b style={{ color: "#1F9D57" }}>{money(Math.round(rent * 1.2))}</b></DocRow>
    <DocRow><span style={{ color: "var(--muted)" }}>Advance rent required</span><b>{money(rent)}</b></DocRow>
    <p style={{ fontSize: 13, color: "var(--ink)", marginTop: 10 }}>Funds are sufficient to cover the advance rent.</p>
  </div>;
}
function DocViewer({ app, p, check, onClose }) {
  const rent = p ? p.rent : 0;
  return <PmModal title={check.doc} onClose={onClose}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div><div style={{ fontWeight: 700, color: "var(--ink)" }}>{check.doc}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{app.tenant} · {check.k}</div></div>
      <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: check.ok ? "rgba(31,157,87,.14)" : "var(--gold-soft)", color: check.ok ? "#1F9D57" : "var(--gold-2)" }}>{check.ok ? "Received" : "Awaiting upload"}</span>
    </div>
    <div style={{ background: "#fff", border: "1px solid var(--cream-line)", borderRadius: 10, padding: 20, minHeight: 120 }}>
      {check.ok ? docBody(check.type, app, p, rent) : <div style={{ color: "var(--muted)", textAlign: "center", padding: "34px 0" }}>This document has not been uploaded yet.</div>}
    </div>
    <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--muted)" }}>Sample document shown for demonstration.</div>
  </PmModal>;
}
function ApplicationsScreen({ st, setSt, toast }) {
  const [lease, setLease] = useState(null);
  const [review, setReview] = useState(null);
  const act = (id, status) => { setSt({ ...st, applications: st.applications.map(a => a.id === id ? { ...a, status } : a) }); toast("Application " + status.toLowerCase(), status === "Rejected" ? "danger" : "success"); };
  const onAct = (id, s) => { act(id, s); setReview(null); };
  return <div>
    <H2 title="Applications" sub="Review tenant documents and approve" />
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
        <thead><tr style={{ background: "var(--ivory)" }}>{["Applicant", "Property", "Income", "Documents", "Status", "Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .4 }}>{h}</th>)}</tr></thead>
        <tbody>{st.applications.map(a => { const p = propOf(st, a.property); const chk = appChecks(a, p ? p.rent : 0); const got = chk.filter(c => c.ok).length; return <tr key={a.id} style={{ borderTop: "1px solid var(--cream-line)" }}>
          <td style={{ padding: "13px 16px" }}><div style={{ fontWeight: 700, color: "var(--ink)" }}>{a.tenant}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{a.note}</div></td>
          <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{p ? p.title : a.property}<div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p ? p.area : ""}</div></td>
          <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{money(a.income)}</td>
          <td style={{ padding: "13px 16px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: got === chk.length ? "#1F9D57" : "var(--gold-2)" }}><FileText size={14} />{got}/{chk.length}</span></td>
          <td style={{ padding: "13px 16px" }}><PmPill label={a.status} /></td>
          <td style={{ padding: "13px 16px" }}>{a.status === "Approved" ? <PmBtn size="sm" kind="gold" icon={FileText} onClick={() => setLease(a)}>Generate lease</PmBtn> : a.status === "Rejected" ? <span style={{ color: "var(--muted)", fontSize: 12.5 }}>Closed</span> : <div style={{ display: "flex", gap: 6 }}><PmBtn size="sm" kind="ghost" icon={Search} onClick={() => setReview(a)}>Review</PmBtn><PmBtn size="sm" onClick={() => act(a.id, "Approved")}>Approve</PmBtn><PmBtn size="sm" kind="ghost" onClick={() => act(a.id, "Rejected")}>Reject</PmBtn></div>}</td>
        </tr>; })}</tbody>
      </table></div>
    </PmCard>
    {lease && <LeaseModal st={st} setSt={setSt} app={lease} onClose={() => setLease(null)} toast={toast} />}
    {review && <ReviewModal st={st} app={review} onClose={() => setReview(null)} onAct={onAct} />}
  </div>;
}
function ReviewModal({ st, app, onClose, onAct }) {
  const p = propOf(st, app.property);
  const rent = p ? p.rent : 0;
  const checks = appChecks(app, rent);
  const [doc, setDoc] = useState(null);
  const got = checks.filter(c => c.ok).length;
  return <PmModal title={"Review application"} onClose={onClose}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
      <div><div className="serif" style={{ fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>{app.tenant}</div><div style={{ fontSize: 13, color: "var(--muted)" }}>{p ? p.title + " · " + p.area : app.property} · Income {money(app.income)}</div></div>
      <div style={{ textAlign: "right" }}><div style={{ fontSize: 11.5, color: "var(--muted)" }}>Documents</div><div className="serif" style={{ fontSize: 22, fontWeight: 600, color: got === checks.length ? "#1F9D57" : "var(--gold-2)" }}>{got}/{checks.length}</div></div>
    </div>
    {app.note && <div style={{ background: "var(--ivory)", borderRadius: 8, padding: 12, fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{app.note}</div>}
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>{checks.map(c => <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, padding: "8px 10px", background: "var(--ivory-2)", borderRadius: 8 }}>
      <span style={{ width: 20, height: 20, borderRadius: 999, background: c.ok ? "rgba(31,157,87,.15)" : "rgba(184,147,74,.18)", color: c.ok ? "#1F9D57" : "var(--gold-2)", display: "grid", placeItems: "center", flexShrink: 0 }}>{c.ok ? <Check size={13} /> : <Clock size={12} />}</span>
      <div style={{ minWidth: 0 }}><b style={{ color: "var(--ink)" }}>{c.k}</b><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.doc}</div></div>
      <button onClick={() => setDoc(c)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--cream-line)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: "var(--ink)", fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}><FileText size={13} /> View</button>
    </div>)}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><PmBtn kind="gold" icon={Check} onClick={() => onAct(app.id, "Approved")}>Approve</PmBtn><PmBtn kind="ghost" onClick={() => onAct(app.id, "More Info Required")}>Request info</PmBtn><PmBtn kind="ghost" onClick={() => onAct(app.id, "Rejected")}>Reject</PmBtn></div>
    {doc && <DocViewer app={app} p={p} check={doc} onClose={() => setDoc(null)} />}
  </PmModal>;
}
function LeaseModal({ st, setSt, app, onClose, toast }) {
  const prop = propOf(st, app.property);
  const [ai, setAi] = useState({ loading: true });
  const [signed, setSigned] = useState({ tenant: false, owner: false });
  useEffect(() => { aiLease({ tenant: app.tenant, prop }).then(r => setAi({ loading: false, ...r })); }, []);
  const both = signed.tenant && signed.owner;
  const finalize = () => {
    const inv = { id: "INV-" + (9100 + st.invoices.length), property: prop.id, tenant: app.tenant, amount: prop.rent, due: "2026-08-01", status: "Pending" };
    setSt({
      ...st,
      properties: st.properties.map(p => p.id === prop.id ? { ...p, status: "Leased" } : p),
      leases: [{ id: "LSE-" + (2200 + st.leases.length), property: prop.id, tenant: app.tenant, date: "2026-08-01" }, ...st.leases],
      applications: st.applications.map(a => a.id === app.id ? { ...a, status: "Approved" } : a),
      invoices: [inv, ...st.invoices]
    });
    toast("Lease executed, property leased, first invoice raised", "success"); onClose();
  };
  return <PmModal title="Lease agreement" onClose={onClose} wide>
    <AiPanel loading={ai.loading} offline={ai.offline}><div style={{ maxHeight: 240, overflow: "auto", background: "var(--ivory)", borderRadius: 9, padding: 14, color: "var(--ink)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{ai.text}</div></AiPanel>
    <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
      {[["Tenant", app.tenant, "tenant"], ["Landlord", "Girard Property Estate Ltd", "owner"]].map(([role, who, key]) => <div key={key} style={{ flex: 1, minWidth: 200, border: "1px solid " + (signed[key] ? "#1F9D57" : "var(--cream-line)"), borderRadius: 9, padding: 13 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{role}</div><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{who}</div>
        {signed[key] ? <span style={{ color: "#1F9D57", fontWeight: 700, fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}><CheckCircle2 size={16} /> Signed</span> : <PmBtn size="sm" icon={PenLine} onClick={() => setSigned(s => ({ ...s, [key]: true }))}>{key === "owner" ? "Countersign" : "e-Sign"}</PmBtn>}
      </div>)}
    </div>
    <PmBtn kind="gold" icon={CheckCircle2} disabled={!both} style={{ marginTop: 16 }} onClick={finalize}>Finalise and store lease</PmBtn>
  </PmModal>;
}

/* ---------- RENT & INVOICES ---------- */
function RentScreen({ st, setSt, identity, toast }) {
  const mine = identity.role === "tenant";
  const rows = mine ? st.invoices.filter(i => (i.tenant || "").toLowerCase().includes(identity.name.split(" ")[0].toLowerCase())) : st.invoices;
  const [pay, setPay] = useState(null);
  const paid = st.invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = st.invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const late = st.invoices.filter(i => i.status === "Late").reduce((s, i) => s + i.amount + (i.lateFee || 0), 0);
  return <div>
    <H2 title="Rent & invoices" sub={mine ? "Your rent schedule and receipts" : "Scheduled rent, receipts and collection status"} />
    {!mine && <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
      <PmStat icon={CheckCircle2} label="Collected" value={money(paid)} />
      <PmStat icon={Clock} label="Pending" value={money(pending)} tone="#E0A106" />
      <PmStat icon={AlertTriangle} label="Late" value={money(late)} tone="#D0453B" />
    </div>}
    <PmCard pad={0} style={{ overflow: "hidden" }}><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
      <thead><tr style={{ background: "var(--ivory)" }}>{["Invoice", "Tenant", "Property", "Amount", "Due", "Status", ""].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(i => { const p = propOf(st, i.property); return <tr key={i.id} style={{ borderTop: "1px solid var(--cream-line)" }}>
        <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{i.id}</td><td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{i.tenant}</td><td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--muted)" }}>{p ? p.area : ""}</td>
        <td style={{ padding: "13px 16px" }}><b style={{ color: "var(--ink)" }}>{money(i.amount)}</b>{i.lateFee && <div style={{ fontSize: 11, color: "#D0453B" }}>+{money(i.lateFee)} late fee</div>}</td>
        <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{i.due}</td><td style={{ padding: "13px 16px" }}><PmPill label={i.status} /></td>
        <td style={{ padding: "13px 16px" }}>{i.status !== "Paid" ? <PmBtn size="sm" icon={CreditCard} onClick={() => setPay(i)}>Pay</PmBtn> : <PmBtn size="sm" kind="ghost" icon={FileText} onClick={() => toast("Receipt downloaded")}>Receipt</PmBtn>}</td>
      </tr>; })}</tbody>
    </table></div></PmCard>
    {pay && <PayModal inv={pay} onClose={() => setPay(null)} onPaid={() => { setSt({ ...st, invoices: st.invoices.map(a => a.id === pay.id ? { ...a, status: "Paid", lateFee: undefined } : a) }); toast("Payment successful, receipt issued", "success"); setPay(null); }} />}
  </div>;
}
function PayModal({ inv, onClose, onPaid }) {
  const [gw, setGw] = useState("Paystack");
  const [loading, setLoading] = useState(false);
  const total = inv.amount + (inv.lateFee || 0);
  return <PmModal title="Pay rent" onClose={onClose}>
    <div style={{ background: "var(--ivory)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 13 }}><span>Rent</span><span>{money(inv.amount)}</span></div>
      {inv.lateFee && <div style={{ display: "flex", justifyContent: "space-between", color: "#D0453B", fontSize: 13, marginTop: 4 }}><span>Late fee</span><span>{money(inv.lateFee)}</span></div>}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--ink)", fontSize: 17, marginTop: 8, borderTop: "1px solid var(--cream-line)", paddingTop: 8 }}><span>Total</span><span>{money(total)}</span></div>
    </div>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Payment gateway</label>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["Paystack", "Flutterwave"].map(g => <button key={g} onClick={() => setGw(g)} style={{ flex: 1, border: "1px solid " + (gw === g ? "var(--gold)" : "var(--cream-line)"), background: gw === g ? "var(--gold-soft)" : "transparent", color: gw === g ? "var(--gold-2)" : "var(--muted)", borderRadius: 8, padding: "10px 0", fontWeight: 700, cursor: "pointer" }}>{g}</button>)}</div>
    <PmBtn kind="gold" icon={loading ? Loader2 : CreditCard} onClick={() => { setLoading(true); setTimeout(onPaid, 1200); }} style={{ width: "100%", justifyContent: "center" }}>{loading ? "Processing…" : "Pay " + money(total) + " via " + gw}</PmBtn>
  </PmModal>;
}

/* ---------- MAINTENANCE ---------- */
function MaintenanceScreen({ st, setSt, identity, toast }) {
  const mine = identity.role === "tenant";
  const [report, setReport] = useState(false);
  const cols = ["Open", "Assigned", "Resolved"];
  const move = (id, status, vendor) => { setSt({ ...st, tickets: st.tickets.map(t => t.id === id ? { ...t, status, vendor: vendor || t.vendor } : t) }); toast("Ticket " + status.toLowerCase()); };
  return <div>
    <H2 title="Maintenance" sub={mine ? "Report an issue and track it" : "Assign vendors and resolve tickets"} right={mine ? <PmBtn icon={Plus} onClick={() => setReport(true)}>Report issue</PmBtn> : null} />
    {mine ? <div style={{ display: "grid", gap: 12 }}>{st.tickets.map(t => { const p = propOf(st, t.property); return <PmCard key={t.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}><div><div className="serif" style={{ fontWeight: 600, color: "var(--ink)" }}>{t.category} · {p ? p.area : ""}</div><div style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>{t.desc}</div></div><div style={{ display: "flex", gap: 8, alignItems: "center" }}>{t.priority === "Emergency" && <PmPill label="Emergency" />}<PmPill label={t.status} /></div></div></PmCard>; })}</div>
      : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="pm-kanban">{cols.map(c => <div key={c} style={{ background: "var(--ivory)", borderRadius: 12, padding: 12, minHeight: 180 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}><span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13.5 }}>{c}</span><span style={{ background: "var(--white)", color: "var(--muted)", borderRadius: 999, padding: "2px 9px", fontSize: 11.5, fontWeight: 700 }}>{st.tickets.filter(t => t.status === c).length}</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{st.tickets.filter(t => t.status === c).map(t => { const p = propOf(st, t.property); return <PmCard key={t.id} pad={12}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13 }}>{t.category}</span>{t.priority === "Emergency" && <PmPill label="Emergency" />}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginBottom: 8, lineHeight: 1.4 }}>{t.desc}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>{p ? p.area : ""} · {t.tenant}{t.vendor ? " · " + t.vendor : ""}</div>
          {t.status === "Open" && <PmBtn size="sm" onClick={() => move(t.id, "Assigned", "PowerFix Ltd")}>Assign vendor</PmBtn>}
          {t.status === "Assigned" && <PmBtn size="sm" kind="soft" onClick={() => move(t.id, "Resolved")}>Mark resolved</PmBtn>}
          {t.status === "Resolved" && <PmBtn size="sm" kind="ghost" onClick={() => move(t.id, "Open")}>Reopen</PmBtn>}
        </PmCard>; })}</div>
      </div>)}</div>}
    {report && <ReportModal st={st} setSt={setSt} identity={identity} onClose={() => setReport(false)} toast={toast} />}
  </div>;
}
function ReportModal({ st, setSt, identity, onClose, toast }) {
  const [cat, setCat] = useState("Plumbing");
  const [desc, setDesc] = useState("");
  const [emergency, setEmergency] = useState(false);
  const submit = () => {
    const tk = { id: "MT-" + (600 + st.tickets.length), property: st.properties[0].id, tenant: identity.name, category: cat, desc: desc || "No description", status: "Open", priority: emergency ? "Emergency" : "Normal", vendor: null };
    setSt({ ...st, tickets: [tk, ...st.tickets] }); toast(emergency ? "Emergency ticket flagged, on-call staff alerted" : "Ticket created", emergency ? "danger" : "success"); onClose();
  };
  return <PmModal title="Report maintenance issue" onClose={onClose}>
    <div style={{ display: "grid", gap: 14 }}>
      <PmSelect label="Category" value={cat} onChange={setCat} options={["Plumbing", "Electrical", "AC / HVAC", "Structural", "Appliance", "Other"]} />
      <div><label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the issue…" style={{ width: "100%", background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: 12, color: "var(--ink)", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed var(--cream-line)", borderRadius: 9, padding: 12 }}><span style={{ color: "var(--ink)", fontSize: 13.5, fontWeight: 600 }}>Attach photo</span><PmBtn kind="soft" size="sm" icon={Upload}>Upload</PmBtn></div>
      <label style={{ display: "flex", gap: 9, alignItems: "center", color: "var(--ink)", fontSize: 13.5, cursor: "pointer" }}><input type="checkbox" checked={emergency} onChange={e => setEmergency(e.target.checked)} /> Flag as emergency (safety at risk)</label>
      {emergency && <div style={{ color: "#D0453B", fontSize: 12.5, display: "flex", gap: 6 }}><AlertTriangle size={15} /> For gas leaks or severe hazards call the 24hr line: 0700 GIRARD</div>}
      <PmBtn onClick={submit} disabled={!desc}>Submit ticket</PmBtn>
    </div>
  </PmModal>;
}

/* ---------- WORKSPACE PLACEHOLDER (agent / investor) ---------- */
function WorkspaceSoon({ identity }) {
  const tiles = HOME_TILES[identity.role] || [];
  return <div><H2 title={"Good day, " + identity.firstName} sub={"Your " + (ROLES.find(r => r.key === identity.role)?.name || "member") + " workspace"} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>{tiles.map(t => <PmCard key={t.label}><div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 14 }}><t.icon size={20} /></div><div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{t.label}</div><div style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 }}>{t.note}</div><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gold-2)", background: "var(--gold-soft)", padding: "3px 9px", borderRadius: 4 }}>Coming next</span></PmCard>)}</div>
    <div style={{ marginTop: 26, color: "var(--muted)", fontSize: 14 }}>The {identity.role === "agent" ? "agent pipeline and CRM" : "investor intelligence and swap"} tools arrive in the next stages.</div>
  </div>;
}

/* ---------- APP SHELL ---------- */
const NAV = {
  owner: [["dash", "Dashboard", LayoutDashboard], ["props", "Properties", Building2], ["add", "Add property", Plus], ["apps", "Applications", Users], ["enquiries", "Enquiries", Mail], ["rent", "Rent & invoices", CreditCard], ["reminders", "Rent reminders", BellRing], ["maint", "Maintenance", Wrench], ["swap", "Swap marketplace", Repeat], ["support", "Support services", ConciergeBell], ["plans", "Plans & pricing", Tag]],
  tenant: [["find", "Find a home", Search], ["rent", "Pay rent", CreditCard], ["maint", "Maintenance", Wrench], ["support", "Support services", ConciergeBell], ["plans", "Plans & pricing", Tag]],
  admin: [["dash", "Dashboard", LayoutDashboard], ["financials", "Financials", Banknote], ["signups", "Sign-ups", UserPlus], ["props", "Verify listings", ShieldCheck], ["apps", "Applications", Users], ["enquiries", "Enquiries", Mail], ["sales", "1 Bourdillon sales", Building2], ["reminders", "Rent reminders", BellRing], ["maint", "Maintenance", Wrench], ["swpipe", "Swap pipeline", Handshake], ["feed", "Live feed", Bell], ["reports", "Reports", LineChart], ["users", "Users", UserCog]],
  agent: [["feed", "Live feed", Bell], ["crm", "Pipeline / CRM", LayoutGrid], ["apps", "Applications", Users], ["enquiries", "Enquiries", Mail], ["sales", "1 Bourdillon sales", Building2], ["reports", "Analytics", LineChart]],
  investor: [["swap", "Swap marketplace", Repeat], ["intel", "Market intelligence", LineChart], ["support", "Support services", ConciergeBell], ["plans", "Plans & pricing", Tag], ["feed", "Live feed", Bell], ["work", "Overview", LayoutGrid]]
};
function AppShell({ identity: identity0, onSignOut, onSwitchRole }) {
  const canSwitch = identity0.allAccess;
  const [activeRole, setActiveRole] = useState(identity0.role);
  const identity = { ...identity0, role: activeRole };
  const nav = NAV[activeRole] || NAV.agent;
  const [view, setView] = useState(nav[0][0]);
  const [roleMenu, setRoleMenu] = useState(false);
  const switchWorkspace = (r) => { setActiveRole(r); setView((NAV[r] || NAV.agent)[0][0]); setRoleMenu(false); };
  const [st, setStRaw] = useState(pmLoad);
  const [nav2Open, setNav2Open] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const setSt = (next) => { setStRaw(next); pmSave(next); };
  const toast = (msg, tone) => { const id = Math.random(); setToasts(x => [...x, { id, msg, tone }]); setTimeout(() => setToasts(x => x.filter(t => t.id !== id)), 3000); };
  const screen = () => {
    const P = { st, setSt, identity, toast };
    if (view === "dash") return <OwnerDash st={st} identity={identity} />;
    if (view === "props") return <PropertiesScreen {...P} />;
    if (view === "add") return <AddPropertyScreen {...P} />;
    if (view === "apps") return <ApplicationsScreen {...P} />;
    if (view === "find") return <TenantFind {...P} />;
    if (view === "rent") return <RentScreen {...P} />;
    if (view === "maint") return <MaintenanceScreen {...P} />;
    if (view === "swap") return <SwapHub identity={identity} toast={toast} initial="browse" />;
    if (view === "swpipe") return <SwapHub identity={identity} toast={toast} initial="deals" />;
    if (view === "intel") return <IntelScreen />;
    if (view === "support") return <SupportServices identity={identity} toast={toast} />;
    if (view === "plans") return <PricingScreen identity={identity} toast={toast} />;
    if (view === "settings") return <SettingsScreen identity={identity} toast={toast} onSignOut={onSignOut} onSwitchRole={onSwitchRole} />;
    if (view === "users") return <AdminUsers toast={toast} />;
    if (view === "financials") return <FinancialsScreen />;
    if (view === "signups") return <SignupsScreen />;
    if (view === "reminders") return <RentRemindersScreen toast={toast} />;
    if (view === "enquiries") return <EnquiriesScreen toast={toast} />;
    if (view === "sales") return <SalesBoard toast={toast} />;
    if (view === "feed") return <LiveFeed identity={identity} />;
    if (view === "crm") return <PipelineCRM identity={identity} toast={toast} />;
    if (view === "reports") return <ReportsScreen identity={identity} toast={toast} />;
    return <WorkspaceSoon identity={identity} />;
  };
  return <div style={{ display: "flex", minHeight: "100vh", background: "var(--ivory)" }}>
    <style>{`
      .pm-side{width:240px;background:var(--navy);color:#fff;flex-shrink:0;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:18px 14px;z-index:40}
      .pm-nav{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:8px;border:none;cursor:pointer;background:transparent;color:rgba(255,255,255,.72);font-weight:500;font-size:13.5px;text-align:left;width:100%;transition:all .15s}
      .pm-nav:hover{color:#fff}
      .pm-nav.on{background:var(--gold);color:var(--navy);font-weight:700}
      .pm-burger{display:none}
      @media(max-width:860px){.pm-side{position:fixed;left:0;top:0;transform:translateX(-100%);transition:transform .25s}.pm-side.open{transform:translateX(0)}.pm-burger{display:inline-flex!important}.pm-grid2{grid-template-columns:1fr!important}.pm-kanban{grid-template-columns:1fr!important}}
      .spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
    `}</style>
    <aside className={"pm-side" + (nav2Open ? " open" : "")}>
      <div style={{ padding: "4px 8px 18px" }}><BrandMark /></div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {nav.map(([k, label, Icon]) => <button key={k} className={"pm-nav" + (view === k ? " on" : "")} onClick={() => { setView(k); setNav2Open(false); }}><Icon size={17} />{label}</button>)}
      </nav>
      <button className="pm-nav" onClick={onSwitchRole}><LayoutGrid size={17} />Change role</button>
      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)", padding: "10px 8px 0" }}>Girard Property Estate Limited</div>
    </aside>
    {nav2Open && <div onClick={() => setNav2Open(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 30 }} />}
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <header style={{ background: "var(--white)", borderBottom: "1px solid var(--cream-line)", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="pm-burger" onClick={() => setNav2Open(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink)" }}><Menu size={22} /></button>
          <div><div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>{ROLES.find(r => r.key === identity.role)?.name || "Workspace"}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{(view === "swap" || view === "swpipe") ? "Property Swap Marketplace · Cross-border" : view === "intel" ? "Market Intelligence" : view === "feed" ? "Live activity feed" : view === "crm" ? "Pipeline & CRM" : view === "reports" ? "Analytics & reporting" : view === "support" ? "Support Services · Concierge" : view === "plans" ? "Plans & pricing" : view === "settings" ? "Settings" : view === "users" ? "User management" : view === "financials" ? "Financials & revenue" : view === "signups" ? "Sign-ups & growth" : view === "reminders" ? "Rent reminders · Automatic" : view === "enquiries" ? "Enquiries & viewings" : view === "sales" ? "1 Bourdillon · Sales board" : "Digital Property Management · Lagos"}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="serif" style={{ width: 34, height: 34, borderRadius: 999, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{identity.initials}</div>
            <div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{identity.firstName}</div><div style={{ fontSize: 11, color: "var(--gold-2)" }}>{identity.title}</div></div>
          </div>
          {canSwitch && <div style={{ position: "relative" }}>
            <button onClick={() => setRoleMenu(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--navy)", color: "#fff", border: "1px solid var(--navy-line)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: "var(--gold)", fontSize: 10, fontWeight: 800, letterSpacing: .5 }}>WORKSPACE</span>
              {ROLES.find(r => r.key === activeRole)?.name || "Workspace"}
              <ChevronRight size={14} style={{ transform: "rotate(90deg)", color: "var(--gold)" }} />
            </button>
            {roleMenu && <div style={{ position: "absolute", left: 0, top: 44, width: 230, background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 10, boxShadow: "0 20px 50px rgba(10,31,60,.16)", zIndex: 50, overflow: "hidden" }}>
              <div style={{ padding: "9px 14px", fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid var(--cream-line)" }}>Switch workspace</div>
              {ROLES.map(r => <button key={r.key} onClick={() => switchWorkspace(r.key)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: activeRole === r.key ? "var(--ivory)" : "transparent", cursor: "pointer", color: "var(--ink)", fontSize: 13.5, fontWeight: activeRole === r.key ? 700 : 500 }}>
                <r.icon size={16} color="var(--gold-2)" />{r.name}{activeRole === r.key && <Check size={14} color="var(--gold-2)" style={{ marginLeft: "auto" }} />}
              </button>)}
            </div>}
          </div>}
          <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen(o => !o)} title="Notifications" style={{ position: "relative", background: "none", border: "1px solid var(--cream-line)", borderRadius: 8, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", color: "var(--ink)" }}>
              <Bell size={17} /><span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: 999, background: "var(--gold)" }} />
            </button>
            {notifOpen && <div style={{ position: "absolute", right: 0, top: 44, width: 300, background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 12, boxShadow: "0 20px 50px rgba(10,31,60,.16)", zIndex: 50, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--cream-line)", fontWeight: 700, color: "var(--ink)", fontSize: 13.5 }}>Notifications</div>
              {NOTIFS.map((n, i) => <div key={i} style={{ padding: "12px 16px", borderBottom: i < NOTIFS.length - 1 ? "1px solid var(--cream-line)" : "none", display: "flex", gap: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: n.unread ? "var(--gold)" : "var(--cream-line)", marginTop: 5, flexShrink: 0 }} />
                <div><div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>{n.text}</div><div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{n.time}</div></div>
              </div>)}
            </div>}
          </div>
          <button onClick={() => { setView("settings"); setNav2Open(false); }} title="Settings" style={{ background: "none", border: "1px solid var(--cream-line)", borderRadius: 8, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", color: "var(--ink)" }}><Settings size={17} /></button>
          <PmBtn kind="ghost" size="sm" icon={LogOut} onClick={onSignOut}>Sign out</PmBtn>
        </div>
      </header>
      <main style={{ padding: 24, flex: 1 }}><div key={view} className="view-enter">{screen()}</div></main>
    </div>
    <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 10, zIndex: 80 }}>
      {toasts.map(t => <div key={t.id} style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderLeft: "4px solid " + (t.tone === "danger" ? "#D0453B" : "#1F9D57"), borderRadius: 10, padding: "12px 16px", fontSize: 13.5, fontWeight: 600, color: "var(--ink)", maxWidth: 340, boxShadow: "0 10px 30px rgba(10,31,60,.14)" }}>{t.msg}</div>)}
    </div>
  </div>;
}

/* ===================================================================
   STAGE 4: Property Swap Marketplace (Nigeria, UK, US)
   Use cases 4-5: list for swap with AI valuation, reciprocal matching
   in a common currency, express interest and messaging, and a swap
   wizard through KYC, due diligence, inspections, escrow, signing and
   title transfer to completion, with handover into management.
   =================================================================== */

const FX = { "₦": 1 / 1600, "£": 1.27, "$": 1 };
const toUSD = (v, cur) => Math.round((+v || 0) * (FX[cur] || 1));
const usd = (v) => "$" + Number(v || 0).toLocaleString("en-US");
const CUR_OF = { Nigeria: "₦", UK: "£", US: "$" };

function swSeed() {
  return {
    listings: [
      { id: "SW-01", owner: "Girard Client A", city: "Lagos", country: "Nigeria", currency: "₦", value: 480000000, type: "5-Bed Detached Duplex", seeking: "London or Manchester, UK", verified: true, hue: 205 },
      { id: "SW-02", owner: "H. Whitmore", city: "London", country: "UK", currency: "£", value: 720000, type: "3-Bed Flat, Zone 2", seeking: "Lagos, Nigeria", verified: true, hue: 218 },
      { id: "SW-03", owner: "M. Adeleke", city: "Abuja", country: "Nigeria", currency: "₦", value: 350000000, type: "4-Bed Terrace", seeking: "New York or Atlanta, US", verified: true, hue: 198 },
      { id: "SW-04", owner: "J. Carter", city: "New York", country: "US", currency: "$", value: 610000, type: "2-Bed Condo, Brooklyn", seeking: "Lagos or Abuja, Nigeria", verified: true, hue: 210 },
      { id: "SW-05", owner: "R. Okafor", city: "Lagos", country: "Nigeria", currency: "₦", value: 260000000, type: "3-Bed Apartment, Ikoyi", seeking: "Bristol or Birmingham, UK", verified: false, hue: 190 },
      { id: "SW-06", owner: "S. Patel", city: "Manchester", country: "UK", currency: "£", value: 340000, type: "4-Bed Semi", seeking: "Lagos, Nigeria", verified: true, hue: 222 },
      { id: "SW-07", owner: "D. Thompson", city: "Austin", country: "US", currency: "$", value: 540000, type: "3-Bed House", seeking: "Abuja, Nigeria", verified: true, hue: 206 },
      { id: "SW-08", owner: "K. Ibrahim", city: "Lagos", country: "Nigeria", currency: "₦", value: 520000000, type: "Penthouse, Victoria Island", seeking: "Miami or New York, US", verified: true, hue: 200 },
      { id: "SW-09", owner: "L. Bennett", city: "Bristol", country: "UK", currency: "£", value: 410000, type: "Georgian Townhouse", seeking: "Lagos, Nigeria", verified: true, hue: 224 },
      { id: "SW-10", owner: "G. Alvarez", city: "Miami", country: "US", currency: "$", value: 690000, type: "Waterfront Condo", seeking: "Lagos, Nigeria", verified: false, hue: 208 },
      { id: "SW-11", owner: "T. Balogun", city: "Abuja", country: "Nigeria", currency: "₦", value: 300000000, type: "4-Bed Duplex, Maitama", seeking: "Birmingham, UK", verified: true, hue: 192 }
    ],
    deals: [
      { id: "DL-01", a: "Lagos 5-Bed Duplex", aCountry: "Nigeria", b: "London 3-Bed Flat", bCountry: "UK", stage: 6, cash: 240000, owed: "Owner A" },
      { id: "DL-02", a: "Abuja 4-Bed Terrace", aCountry: "Nigeria", b: "Austin 3-Bed House", bCountry: "US", stage: 3, cash: 90000, owed: "Owner B" },
      { id: "DL-03", a: "Lagos Penthouse VI", aCountry: "Nigeria", b: "Miami Waterfront", bCountry: "US", stage: 9, cash: 60000, owed: "Owner A" }
    ]
  };
}
const SW_KEY = "girard_swap_v1";
function swLoad() { try { const r = localStorage.getItem(SW_KEY); if (r) return JSON.parse(r); } catch (e) {} const s = swSeed(); try { localStorage.setItem(SW_KEY, JSON.stringify(s)); } catch (e) {} return s; }
function swSave(s) { try { localStorage.setItem(SW_KEY, JSON.stringify(s)); } catch (e) {} }

const SWAP_STAGES = ["Agree terms", "KYC both owners", "Proof of ownership", "Legal due diligence", "Inspections", "Finalise terms", "Escrow setup", "Contracts", "Digital signing", "Title transfer", "Escrow release", "Completed"];
const STAGE_DESC = [
  "Both owners confirm the agreed values and the cash difference needed to balance the trade.",
  "Each owner completes KYC. Nigerian owners verify with Smile ID; UK and US owners use the international ID check.",
  "Each owner uploads title documents (Certificate of Occupancy or title deed) for verification.",
  "Girard's legal partners run title searches and confirm there are no liens or encumbrances.",
  "Independent inspectors visit both properties and file condition reports.",
  "After inspection, both owners confirm terms or renegotiate any cash adjustment.",
  "The paying owner deposits the cash difference into a solicitor trust account.",
  "Final swap contracts are prepared from the AI draft with jurisdiction-specific clauses.",
  "Both owners e-sign, with notarisation arranged where a jurisdiction requires it.",
  "Legal partners lodge the transfers with each Land Registry.",
  "On confirmed transfer, escrow releases the cash difference and Girard's fee.",
  "The swap is complete. Both properties can now move into Girard management."
];

async function aiValue({ type, city, country, value }) {
  const cur = CUR_OF[country] || "₦";
  const local = +String(value).replace(/\D/g, "") || (country === "Nigeria" ? 300000000 : country === "UK" ? 450000 : 550000);
  const proxy = await aiProxy(`In one sentence, justify a market value near ${cur}${local.toLocaleString()} for a ${type || "property"} in ${city || "the area"}, ${country}. No preamble.`);
  return { local, usd: toUSD(local, cur), cur, rationale: proxy.ok ? proxy.text : `Based on comparable ${(type || "property").toLowerCase()} sales in ${city || country}, this value sits within the local market range.`, offline: !proxy.ok };
}
async function aiMatch(a, b) {
  const ua = toUSD(a.value, a.currency), ub = toUSD(b.value, b.currency);
  const diff = Math.abs(ua - ub);
  const score = Math.max(55, Math.min(97, Math.round(100 - diff / Math.max(ua, ub) * 120)));
  const proxy = await aiProxy(`Two properties for a possible swap. A: ${a.type} in ${a.city}, valued ${usd(ua)}. B: ${b.type} in ${b.city}, valued ${usd(ub)}. In two short sentences say whether this is an equitable swap and suggest any cash adjustment. No preamble.`);
  const note = proxy.ok ? proxy.text : `The valuations differ by ${usd(diff)}. A cash adjustment of about ${usd(diff)} from the lower-valued side would balance the exchange.`;
  return { score, note, diff, offline: !proxy.ok };
}

function SwapCardArt({ hue, verified, photo }) {
  const [ok, setOk] = useState(!!photo);
  return <div style={{ position: "relative", height: 130, borderRadius: 10, overflow: "hidden", background: "linear-gradient(140deg, hsl(" + hue + ",42%,22%), hsl(" + (hue - 12) + ",50%,34%))" }}>
    {photo && ok ? <img src={photo} alt="" onError={() => setOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <svg viewBox="0 0 300 130" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .22 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.4"><path d="M50 104 L50 56 L92 34 L134 56 L134 104 Z" /><path d="M150 104 L150 66 L188 66 L188 104 Z" /><rect x="204" y="72" width="34" height="32" /></g></svg>}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,31,60,0) 50%, rgba(10,31,60,.45))" }} />
    <div style={{ position: "absolute", top: 10, left: 10 }}><PmPill label={verified ? "Verified" : "Pending Verification"} /></div>
  </div>;
}

function SwapBrowse({ sw, setSw, toast }) {
  const [country, setCountry] = useState("All");
  const [sel, setSel] = useState(null);
  const list = sw.listings.filter(l => country === "All" || l.country === country);
  return <div>
    <H2 title="Browse swaps" sub={list.length + " listings · values shown locally and in USD"} right={<div style={{ width: 180 }}><PmSelect value={country} onChange={setCountry} options={["All", "Nigeria", "UK", "US"]} /></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
      {list.map(l => <PmCard key={l.id} pad={0} style={{ overflow: "hidden" }}>
        <SwapCardArt hue={l.hue} verified={l.verified} photo={poolPhoto(l.id)} />
        <div style={{ padding: 14 }}>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{l.type}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, margin: "4px 0 8px" }}>{l.city}, {l.country}</div>
          <div style={{ color: "var(--navy)", fontWeight: 700 }}>{money(l.value, l.currency)}</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>≈ {usd(toUSD(l.value, l.currency))}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0", display: "flex", gap: 5, alignItems: "center" }}><Repeat size={13} color="var(--gold-2)" /> Seeking: {l.seeking}</div>
          <PmBtn size="sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => setSel(l)}>View &amp; match</PmBtn>
        </div>
      </PmCard>)}
    </div>
    {sel && <MatchModal sw={sw} listing={sel} onClose={() => setSel(null)} toast={toast} />}
  </div>;
}

function MatchModal({ sw, listing, onClose, toast }) {
  const cand = sw.listings.find(s => s.id !== listing.id && s.country !== listing.country && listing.seeking.toLowerCase().includes(s.country.toLowerCase())) || sw.listings.find(s => s.country !== listing.country);
  const [ai, setAi] = useState({ loading: true });
  useEffect(() => { aiMatch(listing, cand).then(r => setAi({ loading: false, ...r })); }, []);
  return <PmModal title="Reciprocal match" onClose={onClose} wide>
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
      {[listing, cand].map((x, i) => <React.Fragment key={i}>
        {i === 1 && <div style={{ display: "grid", placeItems: "center", color: "var(--gold-2)" }}><ArrowRightLeft size={26} /></div>}
        <PmCard pad={12}><SwapCardArt hue={x.hue} verified={x.verified} photo={poolPhoto(x.id)} />
          <div className="serif" style={{ fontWeight: 600, color: "var(--ink)", marginTop: 10, fontSize: 14 }}>{x.type}</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>{x.city}, {x.country}</div>
          <div style={{ color: "var(--ink)", fontWeight: 700, marginTop: 6 }}>{usd(toUSD(x.value, x.currency))}</div>
          <div style={{ color: "var(--muted)", fontSize: 11.5 }}>{money(x.value, x.currency)}</div>
        </PmCard>
      </React.Fragment>)}
    </div>
    <div style={{ margin: "16px 0" }}><AiPanel loading={ai.loading} offline={ai.offline}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="serif" style={{ width: 52, height: 52, borderRadius: 999, display: "grid", placeItems: "center", background: "var(--navy)", color: "var(--gold)", fontWeight: 700, fontSize: 17, flexShrink: 0 }}>{ai.score}</div>
        <div style={{ color: "var(--ink)", fontSize: 13.5, lineHeight: 1.5 }}>{ai.note}</div>
      </div>
    </AiPanel></div>
    <div style={{ display: "flex", gap: 10 }}>
      <PmBtn icon={Send} onClick={() => { toast("Interest sent to owner of " + cand.type, "success"); onClose(); }}>Express interest</PmBtn>
      <PmBtn kind="ghost" onClick={onClose}>Close</PmBtn>
    </div>
  </PmModal>;
}

function SwapList({ sw, setSw, toast }) {
  const [f, setF] = useState({ type: "", city: "", country: "Nigeria", value: "", seeking: "" });
  const [ai, setAi] = useState(null);
  const [done, setDone] = useState(false);
  const cur = CUR_OF[f.country];
  const valuate = async () => { setAi({ loading: true }); const r = await aiValue(f); setAi({ loading: false, ...r }); };
  const submit = () => {
    const id = "SW-" + (50 + sw.listings.length);
    const l = { id, owner: "You", city: f.city || "Lagos", country: f.country, currency: cur, value: (ai ? ai.local : +String(f.value).replace(/\D/g, "")) || 300000000, type: f.type || "Property", seeking: f.seeking || "Cross-border", verified: false, hue: 195 + sw.listings.length % 30 };
    setSw({ ...sw, listings: [l, ...sw.listings] }); toast("Swap listing submitted for verification"); setDone(true);
  };
  if (done) return <div><H2 title="List for swap" /><PmCard><div style={{ textAlign: "center", padding: 28 }}><div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--gold-soft)", margin: "0 auto 12px", display: "grid", placeItems: "center" }}><ShieldCheck size={26} color="var(--gold-2)" /></div><div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>Listing submitted for verification</div><div style={{ color: "var(--muted)", margin: "8px 0 16px" }}>Once your title document is verified it earns a Verified badge and enters the matching engine.</div><PmBtn onClick={() => { setDone(false); setAi(null); }}>List another</PmBtn></div></PmCard></div>;
  return <div>
    <H2 title="List a property for swap" sub="Offer your property and set what you want in return" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="pm-grid2">
      <PmCard><div style={{ display: "grid", gap: 14 }}>
        <PmField label="Property type" value={f.type} onChange={v => setF({ ...f, type: v })} placeholder="e.g. 4-Bed Detached Duplex" />
        <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><PmField label="City" value={f.city} onChange={v => setF({ ...f, city: v })} placeholder="Lagos" /></div><div style={{ flex: 1 }}><PmSelect label="Country" value={f.country} onChange={v => setF({ ...f, country: v })} options={["Nigeria", "UK", "US"]} /></div></div>
        <PmField label={"Your estimated value (" + cur + ")"} value={f.value} onChange={v => setF({ ...f, value: v })} placeholder="e.g. 350,000,000" />
        <PmField label="What you're seeking" value={f.seeking} onChange={v => setF({ ...f, seeking: v })} placeholder="e.g. London or Manchester, UK" />
        <PmBtn kind="navy" icon={Sparkles} onClick={valuate}>Get AI valuation</PmBtn>
      </div></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>AI valuation</div>
        {!ai ? <div style={{ color: "var(--muted)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>Enter details, then request a valuation.</div>
          : <><AiPanel loading={ai.loading} offline={ai.offline}><div style={{ display: "flex", gap: 18, marginBottom: 8 }}><div><div style={{ color: "var(--muted)", fontSize: 11 }}>Local value</div><div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>{money(ai.local, cur)}</div></div><div><div style={{ color: "var(--muted)", fontSize: 11 }}>USD equivalent</div><div className="serif" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>{usd(ai.usd)}</div></div></div><div style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.5 }}>{ai.rationale}</div></AiPanel>
            <div style={{ marginTop: 14, background: "var(--ivory)", borderRadius: 8, padding: 12, fontSize: 12.5, color: "var(--muted)" }}>A one-time listing fee applies: {f.country === "Nigeria" ? "paid via Paystack or Flutterwave" : "paid via Stripe"}.</div>
            <PmBtn kind="gold" icon={CheckCircle2} style={{ marginTop: 14 }} onClick={submit}>Pay fee &amp; submit</PmBtn></>}
      </PmCard>
    </div>
  </div>;
}

function SwapMatches({ sw, toast, goDeals }) {
  const mine = sw.listings.find(l => l.owner === "You") || sw.listings.find(l => l.country === "Nigeria");
  const matches = sw.listings.filter(l => l.country !== mine.country).slice(0, 3);
  const [thread, setThread] = useState(null);
  return <div>
    <H2 title="My matches" sub={"Reciprocal matches for your " + mine.type + " in " + mine.city} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
      {matches.map((m, i) => <PmCard key={m.id}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 92, flexShrink: 0 }}><SwapCardArt hue={m.hue} verified={m.verified} photo={poolPhoto(m.id)} /></div>
          <div style={{ flex: 1 }}><div className="serif" style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{m.type}</div><div style={{ color: "var(--muted)", fontSize: 12 }}>{m.city}, {m.country}</div><div style={{ color: "var(--ink)", fontWeight: 700, marginTop: 4 }}>{usd(toUSD(m.value, m.currency))}</div></div>
          <div style={{ textAlign: "center" }}><div className="serif" style={{ width: 40, height: 40, borderRadius: 999, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{92 - i * 7}</div><div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>match</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <PmBtn size="sm" icon={MessageSquare} onClick={() => setThread(m)}>Message</PmBtn>
          <PmBtn size="sm" kind="gold" icon={Handshake} onClick={() => { toast("Swap initiated, opening pipeline", "success"); goDeals(); }}>Initiate swap</PmBtn>
        </div>
      </PmCard>)}
    </div>
    {thread && <ThreadModal match={thread} onClose={() => setThread(null)} />}
  </div>;
}

function ThreadModal({ match, onClose }) {
  const [msgs, setMsgs] = useState([{ me: false, text: "Hi, I saw your Lagos property and I'm interested in swapping with my " + match.type + " in " + match.city + "." }, { me: true, text: "Great to hear from you. The valuations look close. Shall we discuss the cash adjustment?" }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  const send = () => { if (!input.trim()) return; setMsgs(x => [...x, { me: true, text: input }]); setInput(""); };
  return <PmModal title={"Chat · owner of " + match.type} onClose={onClose}>
    <div style={{ display: "flex", flexDirection: "column", height: 340 }}>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "80%", background: m.me ? "var(--navy)" : "var(--ivory)", color: m.me ? "#fff" : "var(--ink)", padding: "10px 13px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.5 }}>{m.text}</div>)}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message…" style={{ flex: 1, background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: "10px 12px", color: "var(--ink)", fontSize: 13.5 }} />
        <PmBtn icon={Send} onClick={send}>Send</PmBtn>
      </div>
    </div>
  </PmModal>;
}

function SwapDeals({ sw, setSw, identity, toast }) {
  const [open, setOpen] = useState(null);
  const advance = (d) => { const ns = Math.min(11, d.stage + 1); setSw({ ...sw, deals: sw.deals.map(x => x.id === d.id ? { ...x, stage: ns } : x) }); setOpen(o => o ? { ...o, stage: ns } : o); toast(ns === 11 ? "Swap completed. Both properties can move into management." : "Advanced to " + SWAP_STAGES[ns]); };
  const cancel = (d, msg) => { setSw({ ...sw, deals: sw.deals.filter(x => x.id !== d.id) }); toast(msg, "danger"); setOpen(null); };
  return <div>
    <H2 title={identity.role === "admin" ? "Swap pipeline" : "My swaps"} sub="Every active cross-border deal and its current stage" />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
      <PmStat icon={Handshake} label="Initiated" value={String(sw.deals.length + 5)} />
      <PmStat icon={Clock} label="In progress" value={String(sw.deals.filter(d => d.stage < 11).length)} tone="#E0A106" />
      <PmStat icon={CheckCircle2} label="Completed" value="4" />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sw.deals.map(d => <PmCard key={d.id}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div><div style={{ fontWeight: 700, color: "var(--ink)", display: "flex", gap: 8, alignItems: "center" }}>{d.a} <ArrowRightLeft size={15} color="var(--gold-2)" /> {d.b}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{d.id} · cash difference {usd(d.cash)} owed to {d.owed}</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><PmPill label={d.stage >= 11 ? "Completed" : d.stage >= 6 ? "In Escrow" : "In Negotiation"} /><PmBtn size="sm" onClick={() => setOpen(d)}>Manage</PmBtn></div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 4 }}>{SWAP_STAGES.map((s, i) => <div key={i} title={s} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= d.stage ? "var(--gold)" : "var(--cream-line)" }} />)}</div>
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>Stage {d.stage + 1}/12 · {SWAP_STAGES[d.stage]}</div>
      </PmCard>)}
    </div>
    {open && <SwapWizard deal={open} onClose={() => setOpen(null)} onAdvance={() => advance(open)} onCancel={cancel} />}
  </div>;
}

function SwapWizard({ deal, onClose, onAdvance, onCancel }) {
  const StageIcon = [Scale, ShieldCheck, FileText, Gavel, ClipboardCheck, Handshake, Banknote, FileText, PenLine, Building2, Banknote, CheckCircle2][deal.stage];
  return <PmModal title={deal.id + " · " + SWAP_STAGES[deal.stage]} onClose={onClose} wide>
    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
      {SWAP_STAGES.map((s, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 999, display: "grid", placeItems: "center", background: i < deal.stage ? "#1F9D57" : i === deal.stage ? "var(--gold)" : "var(--cream-line)", color: i <= deal.stage ? (i === deal.stage ? "var(--navy)" : "#fff") : "var(--muted)", fontSize: 11, fontWeight: 800 }}>{i < deal.stage ? <Check size={12} /> : i + 1}</div>)}
    </div>
    <PmCard pad={16} style={{ background: "var(--ivory)", border: "none" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ color: "var(--gold-2)", marginTop: 2 }}>{StageIcon && <StageIcon size={20} />}</div>
        <div><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{SWAP_STAGES[deal.stage]}</div><div style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55 }}>{STAGE_DESC[deal.stage]}</div></div>
      </div>
    </PmCard>
    {deal.stage === 10 && <div style={{ background: "var(--gold-soft)", borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13, color: "var(--ink)" }}>Escrow will release {usd(deal.cash)} to {deal.owed} and deduct Girard's transaction fee.</div>}
    <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
      {deal.stage < 11 ? <>
        <PmBtn icon={ArrowRight} onClick={onAdvance}>Advance to {SWAP_STAGES[deal.stage + 1]}</PmBtn>
        <PmBtn kind="ghost" onClick={() => onCancel(deal, "Deal paused: due diligence flag raised")}>Raise issue</PmBtn>
        <PmBtn kind="ghost" onClick={() => onCancel(deal, "Party withdrew, earnest money forfeited per policy")}>Party backs out</PmBtn>
      </> : <PmBtn kind="gold" icon={CheckCircle2} onClick={onClose}>Swap completed</PmBtn>}
    </div>
  </PmModal>;
}

function IntelSoon() {
  return <div><H2 title="Market intelligence" sub="Sold prices, planning applications, local plans, auctions and yields" />
    <PmCard><div style={{ textAlign: "center", padding: 34 }}><div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--navy)", color: "var(--gold)", margin: "0 auto 14px", display: "grid", placeItems: "center" }}><LineChart size={26} /></div><div className="serif" style={{ fontWeight: 600, fontSize: 20, color: "var(--ink)" }}>Arriving in the next stage</div><div style={{ color: "var(--muted)", marginTop: 8, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>A premium, self-updating intelligence page pulling public data on sold prices, planning applications, local plans, auction results and yields, each item summarised by Girard.</div></div></PmCard>
  </div>;
}

const SWAP_TABS = [["browse", "Browse", Search], ["list", "List for swap", Plus], ["matches", "My matches", ArrowRightLeft], ["deals", "Deals", Handshake]];
function SwapHub({ identity, toast, initial }) {
  const [tab, setTab] = useState(initial || "browse");
  const [sw, setSwRaw] = useState(swLoad);
  const setSw = (n) => { setSwRaw(n); swSave(n); };
  const tabs = identity.role === "admin" ? SWAP_TABS.filter(t => t[0] === "browse" || t[0] === "deals") : SWAP_TABS;
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 22, borderBottom: "1px solid var(--cream-line)", flexWrap: "wrap" }}>
      {tabs.map(([k, label, Icon]) => <button key={k} onClick={() => setTab(k)} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", borderBottom: "2px solid " + (tab === k ? "var(--gold)" : "transparent"), color: tab === k ? "var(--ink)" : "var(--muted)", fontWeight: tab === k ? 700 : 500, fontSize: 14, padding: "10px 6px", cursor: "pointer", marginBottom: -1 }}><Icon size={15} />{label}</button>)}
    </div>
    {tab === "browse" && <SwapBrowse sw={sw} setSw={setSw} toast={toast} />}
    {tab === "list" && <SwapList sw={sw} setSw={setSw} toast={toast} />}
    {tab === "matches" && <SwapMatches sw={sw} toast={toast} goDeals={() => setTab("deals")} />}
    {tab === "deals" && <SwapDeals sw={sw} setSw={setSw} identity={identity} toast={toast} />}
  </div>;
}

/* ===================================================================
   STAGE 5: Live feed, Pipeline / CRM and Analytics
   A market-filtered live activity feed, a pipeline board for
   applications, offers, leads and swaps, and reporting dashboards.
   =================================================================== */

const FEED_KINDS = {
  instruction: { label: "New instruction", icon: Building2, c: "var(--navy)" },
  swap: { label: "New swap", icon: Repeat, c: "var(--gold-2)" },
  application: { label: "Application", icon: Users, c: "#2F6FB0" },
  offer: { label: "Offer", icon: Wallet, c: "#E0A106" },
  let: { label: "Let agreed", icon: CheckCircle2, c: "#1F9D57" },
  price: { label: "Price update", icon: LineChart, c: "var(--muted)" }
};
function seedFeed() {
  const pm = pmLoad(); const sw = swLoad();
  const ev = [];
  pm.properties.slice(0, 6).forEach((p, i) => ev.push({ kind: "instruction", market: "Nigeria", text: p.title + " listed in " + p.area, price: money(p.rent) + "/yr", mins: 3 + i * 7 }));
  sw.listings.slice(0, 6).forEach((l, i) => ev.push({ kind: "swap", market: l.country, text: l.type + " in " + l.city + " seeking " + l.seeking, price: usd(toUSD(l.value, l.currency)), mins: 5 + i * 9 }));
  ev.push({ kind: "application", market: "Nigeria", text: "New application for a 3-Bed in Ikoyi", price: "", mins: 11 });
  ev.push({ kind: "let", market: "Nigeria", text: "Let agreed on a 4-Bed in Lekki", price: "", mins: 18 });
  ev.push({ kind: "offer", market: "UK", text: "Offer received on a London flat", price: "£712,000", mins: 26 });
  ev.push({ kind: "price", market: "US", text: "Price update on a Brooklyn condo", price: "$598,000", mins: 34 });
  return ev.sort((a, b) => a.mins - b.mins);
}
const LIVE_POOL = [
  { kind: "instruction", market: "Nigeria", text: "New 2-Bed listed in Yaba", price: "₦3.0M/yr" },
  { kind: "swap", market: "UK", text: "Manchester semi seeking Lagos", price: "$431,800" },
  { kind: "application", market: "Nigeria", text: "New application for a duplex in Magodo", price: "" },
  { kind: "offer", market: "US", text: "Offer received on an Austin house", price: "$536,000" },
  { kind: "let", market: "Nigeria", text: "Let agreed on a studio in Surulere", price: "" },
  { kind: "swap", market: "US", text: "Miami condo seeking Lagos", price: "$690,000" },
  { kind: "price", market: "UK", text: "Price update on a Bristol townhouse", price: "£405,000" }
];
function ago(m) { return m < 1 ? "just now" : m < 60 ? m + "m ago" : Math.floor(m / 60) + "h ago"; }

function LiveFeed({ identity }) {
  const [market, setMarket] = useState("All");
  const [events, setEvents] = useState(seedFeed);
  useEffect(() => {
    const id = setInterval(() => {
      const e = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
      setEvents(x => [{ ...e, mins: 0, _id: Math.random() }, ...x].slice(0, 40));
    }, 5000);
    return () => clearInterval(id);
  }, []);
  const list = events.filter(e => market === "All" || e.market === market);
  return <div>
    <H2 title="Live feed" sub="Instructions, swaps, offers and lets across your markets" right={<div style={{ width: 180 }}><PmSelect value={market} onChange={setMarket} options={["All", "Nigeria", "UK", "US"]} /></div>} />
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderBottom: "1px solid var(--cream-line)", color: "#1F9D57", fontWeight: 700, fontSize: 12.5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#1F9D57", animation: "pulse 1.6s infinite" }} /> Live · updating in real time</div>
      {list.map((e, i) => { const K = FEED_KINDS[e.kind]; return <div key={e._id || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < list.length - 1 ? "1px solid var(--cream-line)" : "none", background: e.mins === 0 ? "var(--gold-soft)" : "transparent", transition: "background .5s" }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: K.c + "1f", color: K.c, display: "grid", placeItems: "center", flexShrink: 0 }}><K.icon size={18} /></div>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{e.text}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}><PmPill label={K.label} /> <span style={{ marginLeft: 6 }}>{e.market} · {ago(e.mins)}</span></div></div>
        {e.price && <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 13.5, whiteSpace: "nowrap" }}>{e.price}</div>}
      </div>; })}
    </PmCard>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
  </div>;
}

/* ---------- Pipeline / CRM ---------- */
const CRM_COLS = ["Lead", "Qualifying", "Negotiation", "Agreed", "Completed"];
const CRM_KIND_C = { Application: "#2F6FB0", Offer: "#E0A106", Swap: "var(--gold-2)", Lead: "var(--navy)" };
function crmSeed() {
  const pm = pmLoad(); const sw = swLoad(); const cards = [];
  pm.applications.forEach((a, i) => { const p = pm.properties.find(x => x.id === a.property); cards.push({ id: "C-A" + i, name: a.tenant, kind: "Application", market: "Nigeria", detail: (p ? p.area : "") + " · " + money(a.income), stage: a.status === "Approved" ? 3 : a.status === "Rejected" ? 4 : 1 }); });
  sw.deals.forEach((d, i) => cards.push({ id: "C-S" + i, name: d.a + " ⇄ " + d.b, kind: "Swap", market: d.aCountry, detail: "Cash " + usd(d.cash), stage: d.stage >= 11 ? 4 : d.stage >= 6 ? 3 : 2 }));
  cards.push({ id: "C-O1", name: "Offer · 3-Bed Ikoyi", kind: "Offer", market: "Nigeria", detail: "₦11.2M/yr", stage: 2 });
  cards.push({ id: "C-O2", name: "Offer · London flat", kind: "Offer", market: "UK", detail: "£712,000", stage: 2 });
  cards.push({ id: "C-L1", name: "Lead · London investor", kind: "Lead", market: "UK", detail: "Seeking Lagos swap", stage: 0 });
  cards.push({ id: "C-L2", name: "Lead · Abuja landlord", kind: "Lead", market: "Nigeria", detail: "2 properties to list", stage: 0 });
  cards.push({ id: "C-L3", name: "Lead · Austin developer", kind: "Lead", market: "US", detail: "Portfolio enquiry", stage: 0 });
  return { cards };
}
const CRM_KEY = "girard_crm_v1";
function crmLoad() { try { const r = localStorage.getItem(CRM_KEY); if (r) return JSON.parse(r); } catch (e) {} const s = crmSeed(); try { localStorage.setItem(CRM_KEY, JSON.stringify(s)); } catch (e) {} return s; }
function crmSave(s) { try { localStorage.setItem(CRM_KEY, JSON.stringify(s)); } catch (e) {} }

function PipelineCRM({ identity, toast }) {
  const [crm, setCrmRaw] = useState(crmLoad);
  const [kind, setKind] = useState("All");
  const [market, setMarket] = useState("All");
  const setCrm = (n) => { setCrmRaw(n); crmSave(n); };
  const move = (id, dir) => { setCrm({ ...crm, cards: crm.cards.map(c => c.id === id ? { ...c, stage: Math.max(0, Math.min(4, c.stage + dir)) } : c) }); };
  const cards = crm.cards.filter(c => (kind === "All" || c.kind === kind) && (market === "All" || c.market === market));
  return <div>
    <H2 title="Pipeline & CRM" sub={cards.length + " active items across applications, offers, leads and swaps"} right={<div style={{ display: "flex", gap: 10 }}><div style={{ width: 150 }}><PmSelect value={kind} onChange={setKind} options={["All", "Lead", "Application", "Offer", "Swap"]} /></div><div style={{ width: 140 }}><PmSelect value={market} onChange={setMarket} options={["All", "Nigeria", "UK", "US"]} /></div></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }} className="crm-board">
      {CRM_COLS.map((col, ci) => <div key={col} style={{ background: "var(--ivory)", borderRadius: 12, padding: 12, minHeight: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13 }}>{col}</span><span style={{ background: "var(--white)", color: "var(--muted)", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{cards.filter(c => c.stage === ci).length}</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{cards.filter(c => c.stage === ci).map(c => <PmCard key={c.id} pad={12}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}><span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 12.5, lineHeight: 1.3 }}>{c.name}</span></div>
          <div style={{ margin: "6px 0 8px" }}><span style={{ background: CRM_KIND_C[c.kind] + "1f", color: CRM_KIND_C[c.kind], fontWeight: 700, fontSize: 10.5, padding: "2px 7px", borderRadius: 999 }}>{c.kind}</span> <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.market}</span></div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 10 }}>{c.detail}</div>
          <div style={{ display: "flex", gap: 6 }}>{ci > 0 && <button onClick={() => move(c.id, -1)} style={{ border: "1px solid var(--cream-line)", background: "transparent", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "var(--muted)", fontSize: 12 }}>‹</button>}{ci < 4 && <button onClick={() => { move(c.id, 1); toast("Moved to " + CRM_COLS[ci + 1]); }} style={{ border: "none", background: "var(--navy)", color: "#fff", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Advance ›</button>}</div>
        </PmCard>)}</div>
      </div>)}
    </div>
    <style>{`@media(max-width:900px){.crm-board{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.crm-board{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

/* ---------- Analytics & reporting ---------- */
function MiniFunnel({ data }) {
  const max = Math.max(...data.map(d => d.v), 1);
  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{data.map(d => { const w = Math.max(6, d.v / max * 100); return <div key={d.label}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)", marginBottom: 3 }}><span>{d.label}</span><b style={{ color: "var(--ink)" }}>{d.v}</b></div>
    <div style={{ height: 14, background: "var(--ivory)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: w + "%", height: "100%", background: "linear-gradient(90deg, var(--navy), var(--gold))" }} /></div>
  </div>; })}</div>;
}
function ReportsScreen({ identity, toast }) {
  const pm = pmLoad(); const sw = swLoad(); const crm = crmLoad();
  const leased = pm.properties.filter(p => p.status === "Leased").length;
  const byMarket = [{ m: "NG", v: sw.listings.filter(l => l.country === "Nigeria").length + pm.properties.length }, { m: "UK", v: sw.listings.filter(l => l.country === "UK").length }, { m: "US", v: sw.listings.filter(l => l.country === "US").length }];
  const income = [{ m: "Feb", v: 58 }, { m: "Mar", v: 64 }, { m: "Apr", v: 61 }, { m: "May", v: 72 }, { m: "Jun", v: 78 }, { m: "Jul", v: 83 }];
  const funnel = CRM_COLS.map((c, i) => ({ label: c, v: crm.cards.filter(x => x.stage >= i).length }));
  const appStatus = ["Applied", "More Info Required", "Approved", "Rejected"].map((s, i) => ({ name: s, v: pm.applications.filter(a => a.status === s).length, c: ["#2F6FB0", "#E0A106", "#1F9D57", "#D0453B"][i] }));
  const appData = appStatus.filter(a => a.v > 0);
  const swapStage = [{ m: "Neg", v: sw.deals.filter(d => d.stage < 6).length }, { m: "Escrow", v: sw.deals.filter(d => d.stage >= 6 && d.stage < 11).length }, { m: "Done", v: 4 }];
  return <div>
    <H2 title="Analytics & reporting" sub="Portfolio, pipeline and marketplace performance" right={<PmBtn kind="ghost" icon={FileText} onClick={() => toast("Report exported")}>Export report</PmBtn>} />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
      <PmStat icon={Building2} label="Listings" value={String(pm.properties.length + sw.listings.length)} sub="Management + swap" tone="var(--muted)" />
      <PmStat icon={Home} label="Occupancy" value={Math.round(leased / pm.properties.length * 100) + "%"} />
      <PmStat icon={LayoutGrid} label="Pipeline items" value={String(crm.cards.length)} tone="var(--muted)" />
      <PmStat icon={Handshake} label="Active swaps" value={String(sw.deals.length)} tone="#E0A106" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Rental income trend (₦M)</div><MiniArea data={income} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Pipeline funnel</div><MiniFunnel data={funnel} /></PmCard>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="pm-grid3">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Listings by market</div><MiniBars data={byMarket} h={170} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Swap deals by stage</div><MiniBars data={swapStage} h={170} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Applications</div>{appData.length ? <div style={{ display: "flex", alignItems: "center", gap: 12 }}><MiniDonut data={appData} size={140} /><Legend items={appData} /></div> : <div style={{ color: "var(--muted)", fontSize: 13, padding: "20px 0" }}>No applications yet.</div>}</PmCard>
    </div>
    <style>{`@media(max-width:900px){.pm-grid3{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

/* ===================================================================
   STAGE 6: Market Intelligence
   A premium, self-updating intelligence page: sold-price trends, yields,
   planning applications, local plans and auction results, each distilled
   by the AI Engine. A daily serverless job (api/refresh-intel) can refresh
   the briefings; the page works from seeded intelligence without it.
   =================================================================== */

const INTEL = {
  Nigeria: {
    cur: "₦",
    kpis: [{ l: "Avg price growth (12m)", v: "+8.4%", t: "#1F9D57" }, { l: "Avg gross yield", v: "6.2%", t: "var(--muted)" }, { l: "Active listings", v: "1,240", t: "var(--muted)" }, { l: "Planning approvals (Q)", v: "312", t: "var(--muted)" }],
    priceTrend: [{ m: "Q1", v: 100 }, { m: "Q2", v: 103 }, { m: "Q3", v: 106 }, { m: "Q4", v: 105 }, { m: "Q1", v: 109 }, { m: "Q2", v: 112 }],
    yields: [{ m: "Lekki", v: 6.8 }, { m: "Ikoyi", v: 5.4 }, { m: "Yaba", v: 7.1 }, { m: "Ikeja", v: 6.5 }, { m: "Ajah", v: 7.6 }],
    planning: ["Lekki: 240-unit mixed-use scheme approved", "Eko Atlantic: phase 3 infrastructure filing lodged", "Yaba: tech-district densification consultation opened"],
    auctions: ["3-Bed Ikoyi flat cleared 4% above guide", "Vacant Lekki plot withdrawn, reserve not met"],
    localPlans: ["Lagos State regional master plan update in review", "Blue Line rail corridor flagged as value-uplift zone"]
  },
  UK: {
    cur: "£",
    kpis: [{ l: "Avg price growth (12m)", v: "+3.1%", t: "#1F9D57" }, { l: "Avg gross yield", v: "5.1%", t: "var(--muted)" }, { l: "Active listings", v: "3,880", t: "var(--muted)" }, { l: "Planning approvals (Q)", v: "1,204", t: "var(--muted)" }],
    priceTrend: [{ m: "Q1", v: 100 }, { m: "Q2", v: 101 }, { m: "Q3", v: 102 }, { m: "Q4", v: 102 }, { m: "Q1", v: 103 }, { m: "Q2", v: 103 }],
    yields: [{ m: "Manch", v: 6.2 }, { m: "Bristol", v: 5.5 }, { m: "B'ham", v: 6.0 }, { m: "London", v: 4.2 }, { m: "Leeds", v: 6.4 }],
    planning: ["Manchester: 1,000-home regeneration approved", "London Zone 2: tall-building policy consultation", "Bristol: harbourside mixed-use scheme resubmitted"],
    auctions: ["2-Bed London flat sold at guide", "Manchester terrace cleared 6% above guide"],
    localPlans: ["Greater Manchester spatial framework adopted", "London Plan review of density standards"]
  },
  US: {
    cur: "$",
    kpis: [{ l: "Avg price growth (12m)", v: "+4.7%", t: "#1F9D57" }, { l: "Avg gross yield", v: "5.8%", t: "var(--muted)" }, { l: "Active listings", v: "6,420", t: "var(--muted)" }, { l: "Permits (Q)", v: "2,910", t: "var(--muted)" }],
    priceTrend: [{ m: "Q1", v: 100 }, { m: "Q2", v: 102 }, { m: "Q3", v: 103 }, { m: "Q4", v: 104 }, { m: "Q1", v: 104 }, { m: "Q2", v: 105 }],
    yields: [{ m: "Austin", v: 6.3 }, { m: "Atlanta", v: 6.9 }, { m: "Miami", v: 5.6 }, { m: "NYC", v: 4.1 }, { m: "Dallas", v: 6.7 }],
    planning: ["Austin: mixed-use tower permit issued", "Miami: waterfront resilience overlay adopted", "Atlanta: transit-oriented rezoning advanced"],
    auctions: ["Brooklyn condo cleared at reserve", "Austin house sold 3% above guide"],
    localPlans: ["Austin comprehensive plan amendment", "Miami-Dade zoning modernisation phase 2"]
  }
};

function IntelScreen() {
  const [market, setMarket] = useState("Nigeria");
  const d = INTEL[market];
  const [ai, setAi] = useState({ loading: true });
  const [refreshed, setRefreshed] = useState(new Date());
  const brief = async () => {
    setAi({ loading: true });
    const r = await aiProxy(`Write a two-sentence residential property market briefing for ${market}: price growth ${d.kpis[0].v}, gross yield ${d.kpis[1].v}. Reference this planning highlight: ${d.planning[0]}. No preamble.`);
    setAi({ loading: false, offline: !r.ok, text: r.ok ? r.text : `${market} residential values are up ${d.kpis[0].v} over the past year on a gross yield near ${d.kpis[1].v}, with demand steady across prime and mid-market segments. Supply is being shaped by schemes such as ${d.planning[0].toLowerCase()}, supporting a constructive medium-term outlook.` });
    setRefreshed(new Date());
  };
  useEffect(() => { brief(); }, [market]);
  return <div>
    <H2 title="Market intelligence" sub={"Sold prices, yields, planning and auctions, distilled by the AI Engine"} right={<div style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 150 }}><PmSelect value={market} onChange={setMarket} options={["Nigeria", "UK", "US"]} /></div><PmBtn kind="navy" icon={Sparkles} onClick={brief}>Refresh briefing</PmBtn></div>} />
    <div style={{ marginBottom: 16 }}><AiPanel loading={ai.loading} offline={ai.offline}><div style={{ color: "var(--ink)", fontSize: 14, lineHeight: 1.6 }}>{ai.text}</div><div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8 }}>Last refreshed {refreshed.toLocaleString()}</div></AiPanel></div>
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
      {d.kpis.map(k => <PmStat key={k.l} icon={LineChart} label={k.l} value={k.v} tone={k.t} />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Sold-price index ({d.cur}, rebased to 100)</div><MiniArea data={d.priceTrend} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Gross yields by area (%)</div><MiniBars data={d.yields} h={180} /></PmCard>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="pm-grid3">
      {[["Planning applications", d.planning, Building2], ["Auction results", d.auctions, Gavel], ["Local plans", d.localPlans, FileText]].map(([title, items, Icon]) => (
        <PmCard key={title}><div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}><Icon size={16} color="var(--gold-2)" />{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{items.map(x => <div key={x} style={{ display: "flex", gap: 9, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}><span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--gold)", marginTop: 7, flexShrink: 0 }} />{x}</div>)}</div>
        </PmCard>
      ))}
    </div>
    <style>{`@media(max-width:900px){.pm-grid3{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

/* ===================================================================
   STAGE 7: Support Services concierge
   Conveyancing, surveys, removals, furnishing, finance and insurance,
   delivered as a managed concierge on a vetted partner network.
   =================================================================== */

const SUPPORT = [
  { key: "conveyancing", name: "Conveyancing", icon: Scale, partner: "Aegis Legal Partners", desc: "Title searches, contracts and completion, handled by vetted solicitors.", from: "₦450,000" },
  { key: "survey", name: "Surveys & valuation", icon: ClipboardCheck, partner: "Meridian Surveyors", desc: "Structural surveys and independent valuations before you commit.", from: "₦180,000" },
  { key: "removals", name: "Removals", icon: Truck, partner: "SwiftMove Logistics", desc: "Packing, transport and unpacking, insured from door to door.", from: "₦120,000" },
  { key: "furnishing", name: "Furnishing & fit-out", icon: Sofa, partner: "Atelier Interiors", desc: "Turnkey furnishing packages and full interior fit-out.", from: "₦900,000" },
  { key: "finance", name: "Finance & mortgages", icon: Banknote, partner: "Anchor Capital", desc: "Mortgage sourcing and bridging finance advisory.", from: "On request" },
  { key: "insurance", name: "Insurance", icon: ShieldCheck, partner: "Fortis Cover", desc: "Buildings, contents and landlord insurance, arranged fast.", from: "₦75,000" }
];
const SUP_KEY = "girard_support_v1";
function supLoad() { try { const r = localStorage.getItem(SUP_KEY); if (r) return JSON.parse(r); } catch (e) {} const s = { requests: [{ id: "SR-01", service: "Conveyancing", partner: "Aegis Legal Partners", status: "In progress", note: "Lekki 4-Bed purchase" }] }; try { localStorage.setItem(SUP_KEY, JSON.stringify(s)); } catch (e) {} return s; }
function supSave(s) { try { localStorage.setItem(SUP_KEY, JSON.stringify(s)); } catch (e) {} }
const SUP_STATUS_NEXT = { Requested: "Matched", Matched: "In progress", "In progress": "Completed" };

function SupportServices({ identity, toast }) {
  const [store, setStoreRaw] = useState(supLoad);
  const [req, setReq] = useState(null);
  const setStore = (n) => { setStoreRaw(n); supSave(n); };
  const submit = (svc, note) => {
    const r = { id: "SR-" + (10 + store.requests.length), service: svc.name, partner: svc.partner, status: "Requested", note: note || "" };
    setStore({ ...store, requests: [r, ...store.requests] }); toast("Request sent to " + svc.partner, "success"); setReq(null);
  };
  const advance = (id) => setStore({ ...store, requests: store.requests.map(r => r.id === id ? { ...r, status: SUP_STATUS_NEXT[r.status] || r.status } : r) });
  return <div>
    <H2 title="Support services" sub="A managed concierge on a vetted partner network" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 26 }}>
      {SUPPORT.map(s => <PmCard key={s.key}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 14 }}><s.icon size={21} /></div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>from <span style={{ color: "var(--ink)" }}>{s.from}</span></span>
        </div>
        <div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{s.name}</div>
        <div style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>{s.desc}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={13} color="var(--gold-2)" /> {s.partner}</span>
          <PmBtn size="sm" icon={ConciergeBell} onClick={() => setReq(s)}>Request</PmBtn>
        </div>
      </PmCard>)}
    </div>
    <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>My requests</div>
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      {store.requests.length === 0 ? <div style={{ padding: 20, color: "var(--muted)", fontSize: 14 }}>No requests yet. Choose a service above to get started.</div>
        : store.requests.map((r, i) => <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, borderTop: i ? "1px solid var(--cream-line)" : "none", flexWrap: "wrap", gap: 10 }}>
          <div><div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{r.service} <span style={{ color: "var(--muted)", fontWeight: 500 }}>· {r.partner}</span></div><div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{r.id}{r.note ? " · " + r.note : ""}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><PmPill label={r.status} />{r.status !== "Completed" && <PmBtn size="sm" kind="ghost" onClick={() => advance(r.id)}>Advance</PmBtn>}</div>
        </div>)}
    </PmCard>
    {req && <RequestModal svc={req} onClose={() => setReq(null)} onSubmit={submit} />}
  </div>;
}
function RequestModal({ svc, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  return <PmModal title={"Request · " + svc.name} onClose={onClose}>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, background: "var(--ivory)", borderRadius: 10, padding: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", flexShrink: 0 }}><svc.icon size={20} /></div>
      <div><div style={{ fontWeight: 700, color: "var(--ink)" }}>{svc.partner}</div><div style={{ fontSize: 12.5, color: "var(--muted)" }}>Vetted partner · from {svc.from}</div></div>
    </div>
    <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Details (property, timing, requirements)</label>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Tell the partner what you need…" style={{ width: "100%", background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: 12, color: "var(--ink)", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} /></div>
    <PmBtn kind="gold" icon={ConciergeBell} onClick={() => onSubmit(svc, note)}>Send request</PmBtn>
  </PmModal>;
}

/* ===================================================================
   STAGE 8: Pricing & subscriptions (Stripe)
   Persona-based tiers priced in the local market currency. Subscribe
   calls a serverless Stripe checkout; without a Stripe key it falls
   back to a clear message, so the page always works.
   STAGE 9: notifications, settings and admin user management.
   =================================================================== */

const NOTIFS = [
  { text: "New application received for a 3-Bed in Ikoyi", time: "12m ago", unread: true },
  { text: "Rent payment confirmed for INV-9001", time: "1h ago", unread: true },
  { text: "Swap DL-01 advanced to Escrow release", time: "3h ago", unread: false },
  { text: "Maintenance ticket MT-502 assigned to PowerFix Ltd", time: "Yesterday", unread: false }
];

const CUR_CODE = { Nigeria: "ngn", UK: "gbp", US: "usd" };
const CUR_SYM = { Nigeria: "₦", UK: "£", US: "$" };
const PLANS = {
  owner: [
    { name: "Single", tag: "Free", price: { Nigeria: "₦0", UK: "£0", US: "$0" }, amount: null, feats: ["1 property", "AI rent guidance", "Rent collection", "Maintenance requests"], cta: "Current plan" },
    { name: "Portfolio", tag: "Popular", price: { Nigeria: "₦25,000", UK: "£29", US: "$35" }, amount: { Nigeria: 2500000, UK: 2900, US: 3500 }, feats: ["Up to 25 properties", "Full analytics dashboard", "Priority support", "Automated invoicing"], cta: "Choose Portfolio" },
    { name: "Institutional", price: { Nigeria: "Custom", UK: "Custom", US: "Custom" }, amount: null, feats: ["Unlimited portfolio", "Dedicated account manager", "API & integrations", "Custom reporting"], cta: "Contact sales" }
  ],
  agent: [
    { name: "Starter", tag: "Free", price: { Nigeria: "₦0", UK: "£0", US: "$0" }, amount: null, feats: ["Up to 10 listings", "Shared pipeline", "Basic analytics"], cta: "Current plan" },
    { name: "Professional", tag: "Popular", price: { Nigeria: "₦40,000", UK: "£49", US: "$59" }, amount: { Nigeria: 4000000, UK: 4900, US: 5900 }, feats: ["Unlimited listings", "Full CRM & pipeline", "Live feed & intelligence", "Performance analytics"], cta: "Choose Professional" },
    { name: "Brokerage", price: { Nigeria: "Custom", UK: "Custom", US: "Custom" }, amount: null, feats: ["Team seats", "Brokerage dashboard", "Lead routing", "Priority partner access"], cta: "Contact sales" }
  ],
  investor: [
    { name: "Access", tag: "Free", price: { Nigeria: "₦0", UK: "£0", US: "$0" }, amount: null, feats: ["Browse swaps", "Basic market intelligence", "Live feed"], cta: "Current plan" },
    { name: "Pro", tag: "Popular", price: { Nigeria: "₦60,000", UK: "£75", US: "$89" }, amount: { Nigeria: 6000000, UK: 7500, US: 8900 }, feats: ["Full market intelligence", "Priority swap matching", "Deal-flow alerts", "Concierge access"], cta: "Choose Pro" },
    { name: "Institutional", price: { Nigeria: "Custom", UK: "Custom", US: "Custom" }, amount: null, feats: ["Portfolio tooling", "Dedicated analyst", "Off-market deal flow", "Custom mandates"], cta: "Contact sales" }
  ],
  tenant: [
    { name: "Free", tag: "Free", price: { Nigeria: "₦0", UK: "£0", US: "$0" }, amount: null, feats: ["Search & apply", "Pay rent online", "Report repairs"], cta: "Current plan" },
    { name: "Premium", tag: "Popular", price: { Nigeria: "₦5,000", UK: "£6", US: "$7" }, amount: { Nigeria: 500000, UK: 600, US: 700 }, feats: ["Early access to listings", "Priority applications", "Rent-reporting for credit", "Concierge move-in"], cta: "Go Premium" }
  ]
};
async function startCheckout(tier, market, role, toast) {
  if (!tier.amount) { toast(tier.cta === "Contact sales" ? "Our team will reach out about the " + tier.name + " plan" : "You are on the " + tier.name + " plan"); return; }
  try {
    const r = await fetch("/api/create-checkout-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: role + " · " + tier.name, amount: tier.amount[market], currency: CUR_CODE[market] }) });
    const d = await r.json();
    if (d && d.url) { window.location.href = d.url; return; }
    toast("Checkout is not enabled yet. Add your Stripe key to go live.", "danger");
  } catch (e) { toast("Checkout is not enabled yet. Add your Stripe key to go live.", "danger"); }
}
function PricingScreen({ identity, toast }) {
  const [market, setMarket] = useState("Nigeria");
  const tiers = PLANS[identity.role] || PLANS.owner;
  return <div>
    <H2 title="Plans & pricing" sub={"Tailored to " + (ROLES.find(r => r.key === identity.role)?.name || "you") + ", billed monthly"} right={<div style={{ width: 150 }}><PmSelect value={market} onChange={setMarket} options={["Nigeria", "UK", "US"]} /></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
      {tiers.map(t => { const pop = t.tag === "Popular"; return <div key={t.name} style={{ background: pop ? "var(--navy)" : "var(--white)", color: pop ? "#fff" : "var(--ink)", border: "1px solid " + (pop ? "var(--navy)" : "var(--cream-line)"), borderRadius: 14, padding: 26, position: "relative", boxShadow: pop ? "0 24px 60px rgba(10,31,60,.22)" : "none" }}>
        {t.tag && <span style={{ position: "absolute", top: 18, right: 20, background: pop ? "var(--gold)" : "var(--gold-soft)", color: pop ? "#201601" : "var(--gold-2)", fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase", letterSpacing: .5 }}>{t.tag}</span>}
        <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 16 }}><div className="serif" style={{ fontSize: 34, fontWeight: 600 }}>{t.price[market]}</div>{t.amount && <div style={{ color: pop ? "rgba(255,255,255,.6)" : "var(--muted)", fontSize: 13, marginBottom: 6 }}>/mo</div>}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>{t.feats.map(f => <div key={f} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13.5, color: pop ? "rgba(255,255,255,.88)" : "var(--ink)" }}><BadgeCheck size={16} color="var(--gold)" style={{ flexShrink: 0 }} />{f}</div>)}</div>
        <button onClick={() => startCheckout(t, market, identity.role, toast)} style={{ width: "100%", padding: "12px 0", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", background: pop ? "var(--gold)" : t.amount ? "var(--navy)" : "transparent", color: pop ? "#201601" : t.amount ? "#fff" : "var(--muted)", borderStyle: t.amount ? "none" : "solid", borderWidth: t.amount ? 0 : 1, borderColor: "var(--cream-line)" }}>{t.cta}</button>
      </div>; })}
    </div>
    <div style={{ marginTop: 22, color: "var(--muted)", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}><ShieldCheck size={14} color="var(--gold-2)" /> Transaction fees apply per service: management from 5% of collected rent, swaps at a flat completion fee. Prices shown in {CUR_SYM[market]}.</div>
  </div>;
}

function SettingsScreen({ identity, toast, onSignOut, onSwitchRole }) {
  const [market, setMarket] = useState("Nigeria");
  const [emailN, setEmailN] = useState(true);
  const [updatesN, setUpdatesN] = useState(false);
  return <div>
    <H2 title="Settings" sub="Your account and preferences" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="pm-grid2">
      <PmCard>
        <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Account</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div className="serif" style={{ width: 52, height: 52, borderRadius: 999, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18 }}>{identity.initials}</div>
          <div><div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{identity.name}</div><div style={{ fontSize: 13, color: "var(--muted)" }}>{identity.email}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}><span style={{ background: "var(--gold-soft)", color: "var(--gold-2)", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>{ROLE_TITLE[identity.role] || "Member"}</span>{identity.isFounder && <span style={{ background: "var(--navy)", color: "var(--gold)", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>Founder</span>}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><PmBtn kind="ghost" icon={LayoutGrid} onClick={onSwitchRole}>Change role</PmBtn><PmBtn kind="ghost" icon={LogOut} onClick={onSignOut}>Sign out</PmBtn></div>
      </PmCard>
      <PmCard>
        <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Preferences</div>
        <div style={{ marginBottom: 16 }}><PmSelect label="Home market" value={market} onChange={setMarket} options={["Nigeria", "UK", "US"]} /></div>
        {[["Email notifications", emailN, setEmailN], ["Product updates", updatesN, setUpdatesN]].map(([label, val, set]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--cream-line)" }}>
            <span style={{ fontSize: 14, color: "var(--ink)" }}>{label}</span>
            <button onClick={() => set(v => !v)} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", background: val ? "var(--gold)" : "var(--cream-line)", position: "relative", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, left: val ? 22 : 2, width: 20, height: 20, borderRadius: 999, background: "#fff", transition: "left .2s" }} /></button>
          </div>
        ))}
        <PmBtn kind="gold" style={{ marginTop: 16 }} onClick={() => toast("Preferences saved")}>Save preferences</PmBtn>
      </PmCard>
    </div>
    <div style={{ marginTop: 16, color: "var(--muted)", fontSize: 13 }}>{DEMO ? "Demo mode: preferences are stored on this device." : "Connected to Supabase."}</div>
  </div>;
}

const USR_KEY = "girard_users_v1";
function usrLoad() {
  try { const r = localStorage.getItem(USR_KEY); if (r) return JSON.parse(r); } catch (e) {}
  const s = {
    users: [
      { name: "Ada Eze", email: "ada@example.com", role: "tenant", status: "Active" },
      { name: "Tunde Adeyemi", email: "tunde@example.com", role: "owner", status: "Active" },
      { name: "Chidera Okonkwo", email: "chidera@example.com", role: "tenant", status: "Active" },
      { name: "Bola Agent", email: "bola@example.com", role: "agent", status: "Active" },
      { name: "Ken Investor", email: "ken@example.com", role: "investor", status: "Suspended" }
    ]
  };
  try { localStorage.setItem(USR_KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}
function usrSave(s) { try { localStorage.setItem(USR_KEY, JSON.stringify(s)); } catch (e) {} }
function AdminUsers({ toast }) {
  const [store, setStoreRaw] = useState(usrLoad);
  const setStore = (n) => { setStoreRaw(n); usrSave(n); };
  const setRole = (email, role) => setStore({ ...store, users: store.users.map(u => u.email === email ? { ...u, role } : u) });
  const toggle = (email) => { setStore({ ...store, users: store.users.map(u => u.email === email ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u) }); toast("User updated"); };
  return <div>
    <H2 title="User management" sub={store.users.length + " accounts"} />
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
        <thead><tr style={{ background: "var(--ivory)" }}>{["User", "Role", "Status", "Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{store.users.map((u, i) => <tr key={u.email} style={{ borderTop: "1px solid var(--cream-line)" }}>
          <td style={{ padding: "13px 16px" }}><div style={{ fontWeight: 700, color: "var(--ink)" }}>{u.name}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{u.email}</div></td>
          <td style={{ padding: "13px 16px", minWidth: 150 }}><select value={u.role} onChange={e => setRole(u.email, e.target.value)} style={{ background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 7, padding: "7px 10px", color: "var(--ink)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{ROLES.map(r => <option key={r.key} value={r.key}>{r.name}</option>)}</select></td>
          <td style={{ padding: "13px 16px" }}><PmPill label={u.status === "Active" ? "Approved" : "Rejected"} /></td>
          <td style={{ padding: "13px 16px" }}><PmBtn size="sm" kind="ghost" onClick={() => toggle(u.email)}>{u.status === "Active" ? "Suspend" : "Activate"}</PmBtn></td>
        </tr>)}</tbody>
      </table></div>
    </PmCard>
  </div>;
}

/* ===================================================================
   Founder / Admin: Financials and Sign-ups (aggregated), Qura-style
   =================================================================== */

function FinancialsScreen() {
  const pm = pmLoad(); const sw = swLoad();
  const rentCollected = pm.invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0) + 486000000;
  const swapFees = sw.deals.length * 4500000 + 31500000;
  const subs = 9200000;
  const services = 6400000;
  const total = rentCollected + swapFees + subs + services;
  const trend = [{ m: "Feb", v: 62 }, { m: "Mar", v: 71 }, { m: "Apr", v: 68 }, { m: "May", v: 84 }, { m: "Jun", v: 96 }, { m: "Jul", v: 108 }];
  const bySource = [
    { name: "Rent management", v: Math.round(rentCollected / 1e6), c: "#3B82F6" },
    { name: "Swap fees", v: Math.round(swapFees / 1e6), c: "#F59E0B" },
    { name: "Subscriptions", v: Math.round(subs / 1e6), c: "#8B5CF6" },
    { name: "Support services", v: Math.round(services / 1e6), c: "#10B981" }
  ];
  const txns = [
    ...pm.invoices.slice(0, 4).map(i => ({ id: i.id, src: "Rent", who: i.tenant, amt: i.amount, status: i.status })),
    { id: "SUB-2201", src: "Subscription", who: "Agent · Professional", amt: 4000000, status: "Paid" },
    { id: "SWP-4410", src: "Swap fee", who: "DL-01 completion", amt: 4500000, status: "Paid" }
  ];
  return <div>
    <H2 title="Financials & revenue" sub="Aggregated across management, swaps, subscriptions and services" right={<PmBtn kind="ghost" icon={FileText}>Export</PmBtn>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }} className="dash-kpi">
      <CStat icon={TrendingUp} label="Total revenue" value={money(total)} sub="▲ 12.6% YTD" c="#3B82F6" bg="#EAF2FE" />
      <CStat icon={CreditCard} label="Subscriptions (MRR)" value={money(subs)} sub="Recurring / month" c="#8B5CF6" bg="#F1ECFE" />
      <CStat icon={Wallet} label="Rent collected" value={money(rentCollected)} sub="Management" c="#10B981" bg="#E7F7F0" />
      <CStat icon={Handshake} label="Swap fees" value={money(swapFees)} sub="Completed deals" c="#F59E0B" bg="#FEF4E3" />
    </div>
    <PmCard style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div className="serif" style={{ fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>Revenue trend</div><span style={{ fontSize: 12, color: "var(--muted)" }}>₦ millions · last 6 months</span></div>
      <MiniArea data={trend} w={1060} h={240} color="#059669" fill="#10B981" />
    </PmCard>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Revenue by source (₦M)</div><div style={{ display: "flex", alignItems: "center", gap: 16 }}><MiniDonut data={bySource} size={160} /><Legend items={bySource} /></div></PmCard>
      <PmCard pad={0} style={{ overflow: "hidden" }}>
        <div style={{ fontWeight: 700, color: "var(--ink)", padding: "16px 18px 10px" }}>Recent transactions</div>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead><tr style={{ background: "var(--ivory)" }}>{["Ref", "Source", "Detail", "Amount", ""].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{txns.map((t, i) => <tr key={i} style={{ borderTop: "1px solid var(--cream-line)" }}>
            <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--ink)" }}>{t.id}</td>
            <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--muted)" }}>{t.src}</td>
            <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--muted)" }}>{t.who}</td>
            <td style={{ padding: "11px 16px", fontWeight: 700, color: "var(--ink)" }}>{money(t.amt)}</td>
            <td style={{ padding: "11px 16px" }}><PmPill label={t.status} /></td>
          </tr>)}</tbody>
        </table></div>
      </PmCard>
    </div>
    <style>{`@media(max-width:900px){.dash-kpi{grid-template-columns:1fr 1fr!important}.pm-grid2{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

function SignupsScreen() {
  const usr = usrLoad();
  const base = 1240;
  const total = usr.users.length + base;
  const trend = [{ m: "Feb", v: 120 }, { m: "Mar", v: 165 }, { m: "Apr", v: 190 }, { m: "May", v: 240 }, { m: "Jun", v: 300 }, { m: "Jul", v: 355 }];
  const byRole = [
    { name: "Tenants", v: 620, c: "#3B82F6" },
    { name: "Owners", v: 410, c: "#8B5CF6" },
    { name: "Agents", v: 180, c: "#F59E0B" },
    { name: "Investors", v: 118, c: "#10B981" }
  ];
  const funnel = [{ label: "Visitors", v: 8200 }, { label: "Sign-ups", v: 1330 }, { label: "Verified", v: 1120 }, { label: "Active", v: 940 }];
  const roleName = { tenant: "Tenant", owner: "Owner", agent: "Agent", investor: "Investor", admin: "Admin" };
  return <div>
    <H2 title="Sign-ups & growth" sub="New accounts and activation across all roles" right={<PmBtn kind="ghost" icon={FileText}>Export</PmBtn>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }} className="dash-kpi">
      <CStat icon={UserPlus} label="Total users" value={total.toLocaleString()} sub="▲ 355 this month" c="#3B82F6" bg="#EAF2FE" />
      <CStat icon={TrendingUp} label="New this month" value="355" sub="+18% vs June" c="#10B981" bg="#E7F7F0" />
      <CStat icon={CheckCircle2} label="Activation rate" value="71%" sub="Active / verified" c="#8B5CF6" bg="#F1ECFE" />
      <CStat icon={ShieldCheck} label="Verified" value="1,120" sub="KYC complete" c="#F59E0B" bg="#FEF4E3" />
    </div>
    <PmCard style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div className="serif" style={{ fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>New sign-ups per month</div><span style={{ fontSize: 12, color: "var(--muted)" }}>last 6 months</span></div>
      <MiniArea data={trend} w={1060} h={240} color="#7C3AED" fill="#8B5CF6" />
    </PmCard>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>By role</div><div style={{ display: "flex", alignItems: "center", gap: 16 }}><MiniDonut data={byRole} size={160} /><Legend items={byRole} /></div></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Activation funnel</div><MiniFunnel data={funnel} /></PmCard>
    </div>
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ fontWeight: 700, color: "var(--ink)", padding: "16px 18px 10px" }}>Recent sign-ups</div>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
        <thead><tr style={{ background: "var(--ivory)" }}>{["User", "Role", "Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{usr.users.map((u, i) => <tr key={u.email} style={{ borderTop: "1px solid var(--cream-line)" }}>
          <td style={{ padding: "11px 16px" }}><div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13.5 }}>{u.name}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{u.email}</div></td>
          <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--muted)" }}>{roleName[u.role] || u.role}</td>
          <td style={{ padding: "11px 16px" }}><PmPill label={u.status === "Active" ? "Approved" : "Rejected"} /></td>
        </tr>)}</tbody>
      </table></div>
    </PmCard>
  </div>;
}

/* ===================================================================
   Rent reminders: automatic notice to tenants 3 months before rent is due.
   Sends by email + SMS when RESEND / TWILIO keys are configured in Vercel
   (via /api/rent-reminders); otherwise reminders are scheduled and logged.
   =================================================================== */

function fmtDate(d) { return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
function tenancySeed() {
  const base = new Date();
  const mk = (id, name, email, phone, prop, area, rent, mAhead) => { const due = new Date(base); due.setMonth(due.getMonth() + mAhead); const rem = new Date(due); rem.setMonth(rem.getMonth() - 3); return { id, tenant: name, email, phone, property: prop, area, rent, due: due.toISOString(), remind: rem.toISOString() }; };
  return [
    mk("TEN-01", "Ada Eze", "ada@example.com", "+2348030000001", "3-Bed Flat, Lekki", "Lekki", 7200000, 2),
    mk("TEN-02", "Tunde Adeyemi", "tunde@example.com", "+2348030000002", "2-Bed Apartment, Yaba", "Yaba", 3600000, 1),
    mk("TEN-03", "Chidera Okonkwo", "chidera@example.com", "+2348030000003", "4-Bed Duplex, Ikoyi", "Ikoyi", 15000000, 5),
    mk("TEN-04", "Ngozi Balogun", "ngozi@example.com", "+2348030000004", "Studio, Surulere", "Surulere", 1800000, 3),
    mk("TEN-05", "Emeka Nwosu", "emeka@example.com", "+2348030000005", "3-Bed, Magodo", "Magodo", 5400000, 7),
    mk("TEN-06", "Fatima Bello", "fatima@example.com", "+2348030000006", "2-Bed, Ikeja", "Ikeja", 4200000, 4),
    mk("TEN-07", "Kunle Ojo", "kunle@example.com", "+2348030000007", "5-Bed, Victoria Island", "Victoria Island", 22000000, 9),
    mk("TEN-08", "Zainab Musa", "zainab@example.com", "+2348030000008", "1-Bed, Lekki", "Lekki", 2600000, 10)
  ];
}
const REM_KEY = "girard_reminders_v1";
function remLoad() { try { const r = localStorage.getItem(REM_KEY); if (r) return JSON.parse(r); } catch (e) {} return { sent: [] }; }
function remSave(s) { try { localStorage.setItem(REM_KEY, JSON.stringify(s)); } catch (e) {} }
function reminderMsg(t) { const first = t.tenant.split(" ")[0]; return "Dear " + first + ", this is a reminder from Girard Property Estate Limited that the rent for " + t.property + " (" + money(t.rent) + ") is due on " + fmtDate(t.due) + ". As this falls due in three months, we kindly ask that you begin making arrangements. For any questions, contact us on +234 906 000 1234. — Girard Property Estate Limited"; }

function RentRemindersScreen({ toast }) {
  const tens = tenancySeed();
  const [store, setStoreRaw] = useState(remLoad);
  const [preview, setPreview] = useState(null);
  const setStore = (n) => { setStoreRaw(n); remSave(n); };
  const now = Date.now();
  const statusOf = (t) => store.sent.includes(t.id) ? "Sent" : (now >= new Date(t.remind).getTime() ? "Ready to send" : "Scheduled");
  const send = async (t) => {
    try {
      const r = await fetch("/api/rent-reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: t.email, phone: t.phone, message: reminderMsg(t) }) });
      const d = await r.json();
      if (d && d.configured && d.results && (d.results.email || d.results.sms)) toast("Reminder sent to " + t.tenant, "success");
      else toast("Email/SMS not set up yet. Reminder logged and will send once configured.", "danger");
    } catch (e) { toast("Email/SMS not set up yet. Reminder logged.", "danger"); }
    setStore({ sent: [...new Set([...store.sent, t.id])] });
  };
  const dueSoon = tens.filter(t => statusOf(t) === "Ready to send").length;
  return <div>
    <H2 title="Rent reminders" sub="Automatic notice sent to tenants 3 months before rent is due" />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
      <PmStat icon={Users} label="Active tenancies" value={String(tens.length)} tone="var(--muted)" />
      <PmStat icon={BellRing} label="Reminders due now" value={String(dueSoon)} sub="Within 3 months" />
      <PmStat icon={CheckCircle2} label="Sent" value={String(store.sent.length)} tone="#1F9D57" />
    </div>
    <PmCard pad={16} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <BellRing size={18} color="var(--gold-2)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55 }}>Girard automatically emails and texts each tenant 3 months before their rent is due. To send live messages, add <b style={{ color: "var(--ink)" }}>RESEND_API_KEY</b> (email) and <b style={{ color: "var(--ink)" }}>TWILIO_ACCOUNT_SID</b>, <b style={{ color: "var(--ink)" }}>TWILIO_AUTH_TOKEN</b>, <b style={{ color: "var(--ink)" }}>TWILIO_FROM</b> (SMS) in Vercel. Until then, reminders are scheduled and logged.</div>
      </div>
    </PmCard>
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
        <thead><tr style={{ background: "var(--ivory)" }}>{["Tenant", "Property", "Rent", "Rent due", "Reminder date", "Status", "Action"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
        <tbody>{tens.map(t => { const stt = statusOf(t); return <tr key={t.id} style={{ borderTop: "1px solid var(--cream-line)" }}>
          <td style={{ padding: "12px 16px" }}><div style={{ fontWeight: 700, color: "var(--ink)" }}>{t.tenant}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.email}</div></td>
          <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--ink)" }}>{t.property}</td>
          <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--ink)" }}>{money(t.rent)}</td>
          <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--ink)" }}>{fmtDate(t.due)}</td>
          <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)" }}>{fmtDate(t.remind)}</td>
          <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: stt === "Sent" ? "rgba(31,157,87,.14)" : stt === "Ready to send" ? "var(--gold-soft)" : "var(--ivory)", color: stt === "Sent" ? "#1F9D57" : stt === "Ready to send" ? "var(--gold-2)" : "var(--muted)" }}>{stt}</span></td>
          <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 6 }}><PmBtn size="sm" kind="ghost" onClick={() => setPreview(t)}>Preview</PmBtn>{stt !== "Sent" && <PmBtn size="sm" icon={BellRing} onClick={() => send(t)}>Send now</PmBtn>}</div></td>
        </tr>; })}</tbody>
      </table></div>
    </PmCard>
    {preview && <PmModal title={"Reminder to " + preview.tenant} onClose={() => setPreview(null)}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>{[["Email", preview.email], ["SMS", preview.phone], ["Rent due", fmtDate(preview.due)]].map(([k, v]) => <div key={k} style={{ flex: 1, minWidth: 130, background: "var(--ivory)", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 11, color: "var(--muted)" }}>{k}</div><div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>{v}</div></div>)}</div>
      <div style={{ background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 10, padding: 16, fontSize: 14, color: "var(--ink)", lineHeight: 1.6, marginBottom: 16 }}>{reminderMsg(preview)}</div>
      <PmBtn kind="gold" icon={BellRing} onClick={() => { send(preview); setPreview(null); }}>Send now</PmBtn>
    </PmModal>}
  </div>;
}

/* ===================================================================
   Public listings, enquiries, viewings and WhatsApp notifications
   =================================================================== */
const OFFICE_WA = "2348058733019";
function waLink(phone, text) { const n = String(phone || OFFICE_WA).replace(/[^0-9]/g, ""); return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : ""); }
async function sendWhatsApp(to, message) {
  try { const r = await fetch("/api/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to, message }) }); const d = await r.json(); return !!(d && d.sent); } catch (e) { return false; }
}
const ENQ_KEY = "girard_enquiries_v1";
function enqLoad() {
  try { const r = localStorage.getItem(ENQ_KEY); if (r) return JSON.parse(r); } catch (e) {}
  const seed = { items: [
    { id: "ENQ-1001", type: "Viewing", propId: "PR-BOURDILLON", propTitle: "1 Bourdillon Residences", area: "Ikoyi", name: "Chuka Obi", phone: "+2348031111111", email: "chuka@example.com", message: "", date: "2026-07-20", time: "11:00", status: "New", createdAt: Date.now() - 3600000 },
    { id: "ENQ-1002", type: "Enquiry", propId: "", propTitle: "3-Bed Flat, Lekki", area: "Lekki", name: "Aisha Bello", phone: "+2348032222222", email: "aisha@example.com", message: "Is this still available and what is the service charge?", date: "", time: "", status: "Contacted", createdAt: Date.now() - 7200000 }
  ] };
  try { localStorage.setItem(ENQ_KEY, JSON.stringify(seed)); } catch (e) {}
  return seed;
}
function enqSave(s) { try { localStorage.setItem(ENQ_KEY, JSON.stringify(s)); } catch (e) {} }
function enqRecToRow(r) { return { id: r.id, type: r.type, prop_id: r.propId || null, prop_title: r.propTitle, area: r.area || null, name: r.name, phone: r.phone, email: r.email || null, message: r.message || null, date: r.date || null, time: r.time || null, status: r.status }; }
function enqRowToRec(r) { return { id: r.id, type: r.type, propId: r.prop_id, propTitle: r.prop_title, area: r.area, name: r.name, phone: r.phone, email: r.email, message: r.message, date: r.date, time: r.time, status: r.status, createdAt: r.created_at }; }
function enqMirrorCrm(rec) {
  try { const crm = crmLoad(); crm.cards = [{ id: "C-EN" + rec.id, name: (rec.type === "Viewing" ? "Viewing · " : "Enquiry · ") + rec.name, kind: "Lead", market: "Nigeria", detail: rec.propTitle + (rec.type === "Viewing" ? " · " + rec.date + " " + rec.time : ""), stage: 0 }, ...crm.cards]; crmSave(crm); } catch (e) {}
}
async function enqInsert(rec) {
  enqMirrorCrm(rec);
  if (supabase) { try { const { error } = await supabase.from("enquiries").insert([enqRecToRow(rec)]); if (!error) return true; } catch (e) {} }
  const st = enqLoad(); enqSave({ items: [rec, ...st.items] });
  return false;
}
async function enqFetch() {
  if (supabase) { try { const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false }); if (!error && data) return data.map(enqRowToRec); } catch (e) {} }
  return enqLoad().items;
}
async function enqSetStatusRemote(id, status) {
  if (supabase) { try { await supabase.from("enquiries").update({ status }).eq("id", id); return; } catch (e) {} }
  const st = enqLoad(); enqSave({ items: st.items.map(x => x.id === id ? { ...x, status } : x) });
}

function LeadModal({ mode, property, onClose }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "", date: "", time: "10:00" });
  const [done, setDone] = useState(null);
  const inp = { width: "100%", background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: "11px 13px", color: "var(--ink)", fontSize: 14, marginBottom: 10, fontFamily: "inherit" };
  const valid = f.name.trim() && f.phone.trim() && (mode !== "viewing" || f.date);
  const submit = () => {
    if (!valid) return;
    const rec = { id: "ENQ-" + Date.now(), type: mode === "viewing" ? "Viewing" : "Enquiry", propId: property.id, propTitle: property.title, area: property.area, name: f.name, phone: f.phone, email: f.email, message: f.message, date: f.date, time: f.time, status: "New", createdAt: Date.now() };
    enqInsert(rec);
    sendWhatsApp(OFFICE_WA, "New " + rec.type + " from " + f.name + " (" + f.phone + ") for " + property.title + (mode === "viewing" ? " on " + f.date + " at " + f.time : ""));
    const msg = mode === "viewing"
      ? "Hello Girard, I'd like to book a viewing of " + property.title + " (" + property.area + ") on " + f.date + " at " + f.time + ". My name is " + f.name + " (" + f.phone + ")."
      : "Hello Girard, I'm enquiring about " + property.title + " (" + property.area + "). My name is " + f.name + " (" + f.phone + ")." + (f.message ? " " + f.message : "");
    setDone(msg);
  };
  return <div style={{ position: "fixed", inset: 0, background: "rgba(6,17,42,.62)", zIndex: 200, display: "grid", placeItems: "center", padding: 18 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: "var(--white)", borderRadius: 16, padding: 26, width: "min(440px, 100%)", maxHeight: "90vh", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div><div className="serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{done ? "Request received" : mode === "viewing" ? "Book a viewing" : "Make an enquiry"}</div><div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{property.title} · {property.area}</div></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={20} /></button>
      </div>
      {done ? <div>
        <div style={{ background: "rgba(31,157,87,.1)", color: "#1F9D57", borderRadius: 10, padding: 14, fontSize: 13.5, marginBottom: 14 }}>Thank you, {f.name}. The Girard team will contact you shortly on {f.phone}.</div>
        <a href={waLink(OFFICE_WA, done)} target="_blank" rel="noreferrer" className="btn-gold" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>Continue on WhatsApp <ArrowUpRight size={16} /></a>
        <button onClick={onClose} className="btn-line on-ivory" style={{ width: "100%", justifyContent: "center" }}>Done</button>
      </div> : <div>
        <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Full name *" style={inp} />
        <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="Phone / WhatsApp *" style={inp} />
        <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Email (optional)" style={inp} />
        {mode === "viewing" ? <div style={{ display: "flex", gap: 10 }}>
          <input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} style={{ ...inp, flex: 1 }} />
          <select value={f.time} onChange={e => setF({ ...f, time: e.target.value })} style={{ ...inp, flex: 1 }}>{["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div> : <textarea value={f.message} onChange={e => setF({ ...f, message: e.target.value })} rows={3} placeholder="Your message (optional)" style={{ ...inp, resize: "vertical" }} />}
        <button onClick={submit} disabled={!valid} className="btn-gold" style={{ width: "100%", justifyContent: "center", opacity: valid ? 1 : .5, cursor: valid ? "pointer" : "not-allowed", marginTop: 4 }}>{mode === "viewing" ? "Confirm viewing" : "Send enquiry"} <ArrowUpRight size={16} /></button>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>No account needed. We'll reach out by phone or WhatsApp.</div>
      </div>}
    </div>
  </div>;
}

function PublicListings({ onSignIn }) {
  const all = (() => { try { return pmLoad().properties || []; } catch (e) { return []; } })();
  const avail = all.filter(p => p.status === "Available" || p.featured).slice(0, 9);
  const [lead, setLead] = useState(null);
  return <section id="listings" style={{ background: "var(--ivory)", padding: "88px 0" }}>
    <div className="wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 34 }}>
        <div style={{ maxWidth: 560 }}>
          <Rule light />
          <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Available now</div>
          <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>Browse our listings.</h2>
        </div>
        <a className="btn-line on-ivory" href="#" onClick={e => { e.preventDefault(); onSignIn(); }}>Sign in for the full portfolio <ArrowRight size={16} /></a>
      </div>
      <div className="listing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {avail.map(p => <div key={p.id} className="lift card-soft" style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", height: 180 }}>
            <img src={p.img || poolPhoto(p.id)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {p.featured && <span style={{ position: "absolute", top: 12, left: 12, background: "var(--gold)", color: "#201601", fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase", letterSpacing: .5 }}>Featured</span>}
          </div>
          <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{p.title}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", margin: "3px 0 10px" }}>{p.area}{p.beds ? " · " + p.beds + " bed" : ""}</div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--navy)", marginBottom: 14 }}>{money(p.rent)}<span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400 }}>/yr</span></div>
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              <button onClick={() => setLead({ mode: "viewing", property: p })} className="btn-gold" style={{ flex: 1, justifyContent: "center", fontSize: 13, padding: "10px 12px" }}>Book viewing</button>
              <button onClick={() => setLead({ mode: "enquire", property: p })} className="btn-line on-ivory" style={{ flex: 1, justifyContent: "center", fontSize: 13, padding: "10px 12px" }}>Enquire</button>
            </div>
          </div>
        </div>)}
      </div>
      {lead && <LeadModal mode={lead.mode} property={lead.property} onClose={() => setLead(null)} />}
      <style>{`@media(max-width:960px){.listing-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:620px){.listing-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  </section>;
}

const ENQ_STATUS = ["New", "Contacted", "Viewing booked", "Closed"];
function EnquiriesScreen({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let on = true; enqFetch().then(x => { if (on) { setItems(x); setLoading(false); } }); return () => { on = false; }; }, []);
  const setStatus = (id, status) => { setItems(items.map(x => x.id === id ? { ...x, status } : x)); enqSetStatusRemote(id, status); toast("Marked " + status.toLowerCase()); };
  const newCount = items.filter(x => x.status === "New").length;
  const viewings = items.filter(x => x.type === "Viewing").length;
  return <div>
    <H2 title="Enquiries & viewings" sub={supabase ? "Live leads from your database" : "Leads captured from the public listings"} />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
      <PmStat icon={Mail} label="New" value={String(newCount)} tone="#3B82F6" />
      <PmStat icon={Calendar} label="Viewings" value={String(viewings)} tone="#8B5CF6" />
      <PmStat icon={Users} label="Total leads" value={String(items.length)} tone="var(--muted)" />
    </div>
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      {loading ? <div style={{ padding: 20, color: "var(--muted)" }}>Loading enquiries…</div> : items.length === 0 ? <div style={{ padding: 20, color: "var(--muted)" }}>No enquiries yet.</div> : items.map((x, i) => <div key={x.id} style={{ padding: 16, borderTop: i ? "1px solid var(--cream-line)" : "none", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 9, background: x.type === "Viewing" ? "rgba(139,92,246,.14)" : "rgba(59,130,246,.14)", color: x.type === "Viewing" ? "#8B5CF6" : "#3B82F6", display: "grid", placeItems: "center", flexShrink: 0 }}>{x.type === "Viewing" ? <Calendar size={18} /> : <Mail size={18} />}</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, color: "var(--ink)" }}>{x.name} <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: 12.5 }}>· {x.type}</span></div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{x.propTitle}{x.area ? " · " + x.area : ""}{x.type === "Viewing" && x.date ? " · " + x.date + " at " + x.time : ""}</div>
          {x.message ? <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, fontStyle: "italic" }}>&ldquo;{x.message}&rdquo;</div> : null}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <a href={waLink(x.phone, "Hello " + x.name + ", thank you for your interest in " + x.propTitle + " with Girard Property.")} target="_blank" rel="noreferrer" title="WhatsApp" style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 8, background: "rgba(37,211,102,.16)", color: "#1FA855" }}><MessageSquare size={16} /></a>
          <a href={"tel:" + String(x.phone).replace(/[^0-9+]/g, "")} title="Call" style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid var(--cream-line)", color: "var(--ink)" }}><Phone size={15} /></a>
          <select value={x.status} onChange={e => setStatus(x.id, e.target.value)} style={{ background: "var(--ivory-2)", border: "1px solid var(--cream-line)", borderRadius: 8, padding: "7px 10px", color: "var(--ink)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{ENQ_STATUS.map(st => <option key={st} value={st}>{st}</option>)}</select>
        </div>
      </div>)}
    </PmCard>
    <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted)" }}>Enquiries also appear as leads in the Pipeline. WhatsApp opens a chat with the lead; automated confirmations send once WhatsApp keys are set in Vercel.</div>
  </div>;
}

/* ===================================================================
   1 Bourdillon Residences — unit-by-unit sales board (40 units)
   =================================================================== */
function unitSeed() {
  const units = [];
  for (let floor = 3; floor <= 22; floor++) {
    for (let u = 0; u < 2; u++) {
      const beds = floor >= 21 ? 4 : floor >= 14 ? 3 : 2;
      const label = floor >= 21 ? "Penthouse" : beds + "-Bed";
      const size = beds === 4 ? 320 : beds === 3 ? 210 : 155;
      const price = (180 + floor * 6 + u * 4) * 1000000;
      const id = "U" + floor + String.fromCharCode(65 + u);
      const r = hashStr(id) % 10;
      const status = r < 2 ? "Sold" : r < 4 ? "Reserved" : "Available";
      units.push({ id, floor, unit: String.fromCharCode(65 + u), beds, label, size, price, status, buyer: "", phone: "" });
    }
  }
  return units;
}
const UNIT_KEY = "girard_units_v1";
function unitLoad() { try { const r = localStorage.getItem(UNIT_KEY); if (r) return JSON.parse(r); } catch (e) {} const s = unitSeed(); try { localStorage.setItem(UNIT_KEY, JSON.stringify(s)); } catch (e) {} return s; }
function unitSave(s) { try { localStorage.setItem(UNIT_KEY, JSON.stringify(s)); } catch (e) {} }
const U_COLORS = { Available: "#10B981", Reserved: "#F59E0B", Sold: "#D0453B" };
function moneyShort(n) { return "\u20a6" + (n >= 1e9 ? (n / 1e9).toFixed(1) + "b" : (n / 1e6).toFixed(0) + "m"); }

function SalesBoard({ toast }) {
  const [units, setUnitsRaw] = useState(unitLoad);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const setUnits = (n) => { setUnitsRaw(n); unitSave(n); };
  const save = (u) => { setUnits(units.map(x => x.id === u.id ? u : x)); setSel(null); toast("Unit " + u.id.slice(1) + " · " + u.status.toLowerCase(), "success"); };
  const sold = units.filter(u => u.status === "Sold");
  const reserved = units.filter(u => u.status === "Reserved");
  const avail = units.filter(u => u.status === "Available");
  const committedValue = sold.reduce((s, u) => s + u.price, 0) + reserved.reduce((s, u) => s + u.price, 0);
  const shown = units.filter(u => filter === "All" || u.status === filter);
  const kpis = [
    { icon: CheckCircle2, label: "Sold", value: String(sold.length), c: "#D0453B", bg: "#FDECEA" },
    { icon: Clock, label: "Reserved", value: String(reserved.length), c: "#F59E0B", bg: "#FEF4E3" },
    { icon: Home, label: "Available", value: String(avail.length), c: "#10B981", bg: "#E7F7F0" },
    { icon: TrendingUp, label: "Committed value", value: moneyShort(committedValue), c: "#3B82F6", bg: "#EAF2FE" }
  ];
  return <div>
    <H2 title="1 Bourdillon · Sales board" sub="Unit-by-unit availability for the 40 residences" right={<div style={{ width: 160 }}><PmSelect value={filter} onChange={setFilter} options={["All", "Available", "Reserved", "Sold"]} /></div>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }} className="dash-kpi">
      {kpis.map(k => <CStat key={k.label} icon={k.icon} label={k.label} value={k.value} c={k.c} bg={k.bg} />)}
    </div>
    <PmCard>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>{Object.keys(U_COLORS).map(k => <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--muted)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: U_COLORS[k] }} />{k}</span>)}</div>
      <div className="unit-grid" style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 8 }}>
        {shown.map(u => <button key={u.id} onClick={() => setSel(u)} style={{ border: "1px solid " + U_COLORS[u.status] + "66", background: U_COLORS[u.status] + "14", borderRadius: 8, padding: "10px 6px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 13 }}>{u.id.slice(1)}</div>
          <div style={{ fontSize: 10.5, color: "var(--muted)" }}>{u.beds}-bed</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: U_COLORS[u.status] }}>{moneyShort(u.price)}</div>
        </button>)}
      </div>
      <style>{`@media(max-width:800px){.unit-grid{grid-template-columns:repeat(5,1fr)!important}}@media(max-width:480px){.unit-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
    </PmCard>
    {sel && <UnitModal unit={sel} onClose={() => setSel(null)} onSave={save} />}
  </div>;
}
function UnitModal({ unit, onClose, onSave }) {
  const [u, setU] = useState(unit);
  return <PmModal title={"Unit " + unit.id.slice(1) + " · Floor " + unit.floor} onClose={onClose}>
    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>{[["Type", unit.label], ["Size", unit.size + " sqm"], ["Price", moneyShort(unit.price)]].map(([k, v]) => <div key={k} style={{ flex: 1, minWidth: 100, background: "var(--ivory)", borderRadius: 8, padding: "10px 12px" }}><div style={{ fontSize: 11, color: "var(--muted)" }}>{k}</div><div className="serif" style={{ fontWeight: 600, color: "var(--ink)", fontSize: 16 }}>{v}</div></div>)}</div>
    <div style={{ marginBottom: 12 }}><PmSelect label="Status" value={u.status} onChange={v => setU({ ...u, status: v })} options={["Available", "Reserved", "Sold"]} /></div>
    {u.status !== "Available" && <div><PmField label="Buyer name" value={u.buyer} onChange={v => setU({ ...u, buyer: v })} placeholder="Full name" /><PmField label="Buyer phone" value={u.phone} onChange={v => setU({ ...u, phone: v })} placeholder="+234..." /></div>}
    <PmBtn kind="gold" onClick={() => onSave(u)} style={{ marginTop: 6 }}>Save unit</PmBtn>
  </PmModal>;
}
