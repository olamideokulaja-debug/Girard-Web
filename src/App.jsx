import React, { useState, useEffect } from "react";
import {
  ArrowUpRight, Building2, Repeat, LineChart, Sparkles, ShieldCheck,
  Globe2, MapPin, Menu, X, Home, KeyRound, Users, Briefcase, ArrowRight
} from "lucide-react";

/* Girard Property Estate Limited
   Stage 1, rebuilt: editorial-luxury landing.
   Navy and gold, Lora display, alternating navy and ivory sections, imagery-led.
   Content leads with the two flagship modules, Digital Property Management and
   Property Swap, in Girard's own governance-led, institutional voice. */

const REGIONS = {
  Nigeria: {
    cur: "\u20a6", tag: "Lagos & Abuja",
    line: "A 30-property Lagos portfolio under management, opening to landlords across Nigeria.",
    listings: [
      { title: "4-Bed Detached Duplex", place: "Lekki Phase 1, Lagos", price: "\u20a68.4M / yr", kind: "To let" },
      { title: "3-Bed Apartment", place: "Ikoyi, Lagos", price: "\u20a611.2M / yr", kind: "To let" },
      { title: "5-Bed Duplex", place: "Maitama, Abuja", price: "\u20a6350M", kind: "For swap" },
      { title: "2-Bed Flat", place: "Yaba, Lagos", price: "\u20a63.0M / yr", kind: "To let" }
    ],
    instr: ["New instruction: 4-Bed in Magodo, Lagos", "New instruction: Penthouse on Victoria Island", "New swap: Abuja terrace seeking London"]
  },
  UK: {
    cur: "\u00a3", tag: "London & regions",
    line: "Cross-border management and swaps between the United Kingdom and Nigeria.",
    listings: [
      { title: "3-Bed Flat, Zone 2", place: "Islington, London", price: "\u00a32,950 / mo", kind: "To let" },
      { title: "4-Bed Semi", place: "Didsbury, Manchester", price: "\u00a3720,000", kind: "For swap" },
      { title: "2-Bed Conversion", place: "Clifton, Bristol", price: "\u00a31,650 / mo", kind: "To let" },
      { title: "Georgian Townhouse", place: "Bath", price: "\u00a3410,000", kind: "For swap" }
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

export default function App() {
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
        @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .rise{animation:rise .8s ease both}
        .hero-h{font-size:clamp(46px,7vw,92px);line-height:1.02;font-weight:600;letter-spacing:-1px}
        .sec-h{font-size:clamp(32px,4.4vw,52px);line-height:1.08;font-weight:600;letter-spacing:-.5px}
        @media(max-width:900px){
          .nav-links{display:none!important}.burger{display:inline-flex!important}
          .grid-2{grid-template-columns:1fr!important}.hero-grid{grid-template-columns:1fr!important}
          .hero-art{display:none!important}.mod-grid{grid-template-columns:1fr!important}
          .grid-4{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:560px){.grid-4{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,31,60,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--navy-line)" }}>
        <div className="wrap" style={{ height: 74, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg viewBox="0 0 100 100" width="34" height="34"><rect x="6" y="6" width="88" height="88" rx="6" fill="none" stroke="var(--gold)" strokeWidth="5" /><path d="M30 74 L30 50 L46 38 L62 50 L62 74 Z M62 74 L62 44 L74 52 L74 74 Z" fill="#fff" /><rect x="42" y="56" width="8" height="8" fill="var(--navy)" /></svg>
            <div>
              <div className="serif" style={{ fontSize: 21, fontWeight: 600, letterSpacing: .4, color: "#fff" }}>Girard</div>
              <div style={{ fontSize: 8, letterSpacing: 2.6, color: "var(--gold)", marginTop: -2 }}>PROPERTY ESTATE</div>
            </div>
          </div>
          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#capabilities">Capabilities</a>
            <a className="nav-link" href="#who">Who we serve</a>
            <a className="btn-line on-navy" href="#" style={{ padding: "9px 18px" }}>Sign in</a>
            <a className="btn-gold" href="#">Get started <ArrowUpRight size={16} /></a>
          </nav>
          <button className="burger" onClick={() => setMenu(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>{menu ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {menu && (
          <div className="wrap" style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#capabilities">Capabilities</a>
            <a className="nav-link" href="#who">Who we serve</a>
            <a className="btn-gold" href="#" style={{ justifyContent: "center" }}>Get started</a>
          </div>
        )}
      </header>

      {/* HERO (NAVY) */}
      <section style={{ background: "var(--navy)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, pointerEvents: "none" }}><Skyline /></div>
        <div className="wrap" style={{ paddingTop: 84, paddingBottom: 90, position: "relative" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 56, alignItems: "center" }}>
            <div className="rise">
              <div className="eyebrow" style={{ color: "var(--gold)", marginBottom: 22 }}>Digital management &amp; cross-border swaps</div>
              <h1 className="serif hero-h">
                Managed with <span style={{ fontStyle: "italic", color: "var(--gold)" }}>discipline.</span><br />
                Moved without <span style={{ fontStyle: "italic", color: "var(--gold)" }}>borders.</span>
              </h1>
              <p style={{ fontSize: 17.5, color: "rgba(255,255,255,.74)", marginTop: 26, maxWidth: 520, lineHeight: 1.65 }}>
                Girard brings digital property management and cross-border swaps onto one governed platform, built for owners, tenants, agents and investors across Nigeria, the UK and beyond.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <a className="btn-gold" href="#">Get started <ArrowUpRight size={16} /></a>
                <a className="btn-line on-navy" href="#platform">Explore the platform</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30, color: "rgba(255,255,255,.6)", fontSize: 13 }}>
                <ShieldCheck size={16} color="var(--gold)" /> Governance-led and compliance-first, with human oversight at every critical step.
              </div>
            </div>
            <div className="hero-art rise" style={{ height: 480 }}><BuildingPortrait /></div>
          </div>
        </div>
      </section>

      {/* MANIFESTO (IVORY) */}
      <section style={{ background: "var(--ivory)", padding: "88px 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 56, alignItems: "start" }} >
          <div className="grid-2" style={{ display: "contents" }}>
            <div>
              <Rule light />
              <div className="eyebrow" style={{ color: "var(--gold-2)", marginTop: 18 }}>The Girard standard</div>
            </div>
            <div>
              <h2 className="serif sec-h" style={{ color: "var(--ink)" }}>
                Property held to a higher standard, from the first listing to the final transfer.
              </h2>
              <p style={{ fontSize: 16.5, color: "var(--muted)", marginTop: 20, lineHeight: 1.7, maxWidth: 640 }}>
                Girard delivers professional, end-to-end management of residential and commercial property, built on reliability, transparency and regulatory compliance. That same discipline now extends across borders, letting owners exchange assets directly through a governed, secure marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FLAGSHIP MODULES (NAVY) */}
      <section id="platform" style={{ background: "var(--navy-2)", color: "#fff", padding: "92px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 54 }}>
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

      {/* LIVE LISTINGS + REGION LENS (IVORY) */}
      <section style={{ background: "var(--ivory)", padding: "88px 0" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 34 }}>
            <div>
              <Rule light />
              <div className="eyebrow" style={{ color: "var(--gold-2)", margin: "16px 0 12px" }}>Live on Girard</div>
              <h2 className="serif sec-h" style={{ color: "var(--ink)", maxWidth: 560 }}>Instructions and swaps, moving in real time.</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(REGIONS).map(k => (
                <button key={k} onClick={() => { setRegion(k); setOffset(0); }} className={"rpill" + (region === k ? " on" : "")} style={region === k ? {} : { color: "var(--muted)", borderColor: "var(--cream-line)" }}>{k}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--navy)", borderRadius: 10, padding: 26, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", marginBottom: 18 }}>
              <Globe2 size={16} color="var(--gold)" />
              <span className="serif" style={{ color: "var(--gold)", fontWeight: 600, fontSize: 15 }}>{R.tag}.</span>
              <span style={{ color: "rgba(255,255,255,.72)", fontSize: 14 }}>{R.line}</span>
            </div>
            <div style={{ background: "var(--navy-3)", borderRadius: 6, padding: "11px 15px", fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 9, marginBottom: 20, border: "1px solid var(--navy-line)" }}>
              <Sparkles size={15} color="var(--gold)" /><span key={instr} className="rise" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{instr}</span>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 14, overflow: "hidden", filter: "blur(3px)", opacity: .95, WebkitMaskImage: "linear-gradient(90deg,#000 68%,transparent)", maskImage: "linear-gradient(90deg,#000 68%,transparent)" }}>
                {rotated.map((l, i) => <ListingCard key={l.title + i} l={l} />)}
              </div>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <a className="btn-gold" href="#" style={{ boxShadow: "0 12px 34px rgba(0,0,0,.4)" }}>Sign in to view live listings <ArrowUpRight size={16} /></a>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.55)", marginTop: 14, textAlign: "center" }}>Values shown in {R.cur}. The full feed unlocks on sign-in.</div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES (NAVY) */}
      <section id="capabilities" style={{ background: "var(--navy)", color: "#fff", padding: "92px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <Rule />
            <div className="eyebrow" style={{ color: "var(--gold)", margin: "18px 0 14px" }}>Beyond the core</div>
            <h2 className="serif sec-h">Intelligence and services, on the same platform.</h2>
          </div>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {CAPABILITIES.map(c => (
              <div key={c.name} className="cap-card">
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(198,161,91,.14)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 18 }}><c.icon size={22} /></div>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{c.name}</h3>
                <p style={{ color: "rgba(255,255,255,.72)", fontSize: 14.5, lineHeight: 1.65 }}>{c.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE (IVORY) */}
      <section id="who" style={{ background: "var(--ivory)", padding: "92px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 60, borderTop: "1px solid var(--cream-line)", paddingTop: 40 }} className="grid-4">
            {STATS.map(s => (
              <div key={s.k}><div className="serif" style={{ fontSize: 46, fontWeight: 600, color: "var(--navy)" }}>{s.k}</div><div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{s.v}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (NAVY) */}
      <section style={{ background: "var(--navy-2)", color: "#fff", padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .5 }}><Skyline /></div>
        <div className="wrap" style={{ textAlign: "center", position: "relative" }}>
          <Rule /><div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><div style={{ width: 54, height: 2, background: "var(--gold)" }} /></div>
          <h2 className="serif" style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: -.5 }}>Begin with Girard.</h2>
          <p style={{ color: "rgba(255,255,255,.74)", fontSize: 17, marginTop: 16, maxWidth: 540, margin: "16px auto 0", lineHeight: 1.65 }}>Create an account, tell us who you are, and step into a property platform that works across borders.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <a className="btn-gold" href="#">Get started <ArrowUpRight size={16} /></a>
            <a className="btn-line on-navy" href="#">Speak with Girard <ArrowRight size={16} /></a>
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
            {[["Platform", ["Management", "Property Swap", "Intelligence", "Support Services"]], ["Markets", ["Nigeria", "United Kingdom", "Middle East", "International"]], ["Company", ["About", "Partners", "Contact", "Sign in"]]].map(([h, items]) => (
              <div key={h}>
                <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 12, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>{h}</div>
                {items.map(x => <div key={x} style={{ fontSize: 13.5, marginBottom: 9 }}>{x}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--navy-line)", marginTop: 42, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12.5, color: "rgba(255,255,255,.55)" }}>
            <div>&copy; 2026 Girard Property Estate Limited. All rights reserved.</div>
            <div>Governance-first. This platform is not a substitute for legal or financial advice.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
