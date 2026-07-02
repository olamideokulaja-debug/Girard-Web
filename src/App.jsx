import React, { useState, useEffect } from "react";
import {
  ArrowUpRight, Building2, Repeat, LineChart, Sparkles, ShieldCheck,
  Globe2, MapPin, Menu, X, Home, KeyRound, Users, Briefcase, ArrowRight,
  LogOut, Mail, Lock, ArrowLeft, ChevronRight, Wallet, Wrench, FileText,
  Search, LayoutGrid, Plus, Upload, AlertTriangle, CheckCircle2, Clock,
  CreditCard, PenLine, Filter, LayoutDashboard, Bell, Send, Loader2, MoreHorizontal,
  Handshake, ArrowRightLeft, MessageSquare, Scale, Gavel, ClipboardCheck, Banknote, Globe, Check
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
            <a className="btn-line on-navy" href="#" onClick={e => { e.preventDefault(); onSignIn(); }} style={{ padding: "9px 18px" }}>Sign in</a>
            <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Get started <ArrowUpRight size={16} /></a>
          </nav>
          <button className="burger" onClick={() => setMenu(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>{menu ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {menu && (
          <div className="wrap" style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#capabilities">Capabilities</a>
            <a className="nav-link" href="#who">Who we serve</a>
            <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }} style={{ justifyContent: "center" }}>Get started</a>
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
                <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onStart(); }}>Get started <ArrowUpRight size={16} /></a>
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
                <a className="btn-gold" href="#" onClick={e => { e.preventDefault(); onSignIn(); }} style={{ boxShadow: "0 12px 34px rgba(0,0,0,.4)" }}>Sign in to view live listings <ArrowUpRight size={16} /></a>
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
const FOUNDERS = {
  "principal@girard.example": { name: "Girard Principal", title: "Founder & Principal", greeting: "Welcome back" },
  "operations@girard.example": { name: "Operations Lead", title: "Platform Administration", greeting: "Welcome back" }
};
function initialsOf(name) { return (name || "G").split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
function resolveIdentity(email, role) {
  const key = (email || "").toLowerCase().trim();
  const f = FOUNDERS[key];
  if (f) return { email: key, role, name: f.name, title: f.title, greeting: f.greeting, initials: initialsOf(f.name), isFounder: true };
  const local = (key.split("@")[0] || "there").replace(/[._-]+/g, " ").trim();
  const name = local ? local.replace(/\b\w/g, c => c.toUpperCase()) : "There";
  return { email: key, role, name, title: ROLE_TITLE[role] || "Member", greeting: "Welcome", initials: initialsOf(name), isFounder: false };
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
      <svg viewBox="0 0 100 100" width="30" height="30"><rect x="6" y="6" width="88" height="88" rx="6" fill="none" stroke="var(--gold)" strokeWidth="6" /><path d="M30 74 L30 50 L46 38 L62 50 L62 74 Z M62 74 L62 44 L74 52 L74 74 Z" fill={dark ? "var(--navy)" : "#fff"} /><rect x="42" y="56" width="8" height="8" fill="var(--gold)" /></svg>
      <span className="serif" style={{ fontSize: 19, fontWeight: 600, color: dark ? "var(--ink)" : "#fff" }}>Girard</span>
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
            <h1 className="serif" style={{ fontSize: "clamp(30px,4.4vw,48px)", fontWeight: 600, letterSpacing: -.5, color: "var(--ink)" }}>Good {part}, {identity.name.split(" ")[0]}.</h1>
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
function pmSeed() {
  return {
    properties: seedProperties(),
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
function PmCard({ children, pad = 18, style }) { return <div style={{ background: "var(--white)", border: "1px solid var(--cream-line)", borderRadius: 12, padding: pad, ...style }}>{children}</div>; }
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
function HouseArt({ hue = 200, status, h = 140 }) {
  return <div style={{ position: "relative", height: h, borderRadius: 10, overflow: "hidden", background: "linear-gradient(140deg, hsl(" + hue + ",42%,22%), hsl(" + (hue - 10) + ",50%,34%))" }}>
    <svg viewBox="0 0 300 140" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .22 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.4"><path d="M60 110 L60 64 L96 44 L132 64 L132 110 Z" /><path d="M150 110 L150 52 L188 30 L226 52 L226 110 Z" /><rect x="240" y="74" width="34" height="36" /></g></svg>
    {status && <div style={{ position: "absolute", top: 10, left: 10 }}><PmPill label={status} /></div>}
  </div>;
}

/* ---------- mini charts (no dependencies) ---------- */
function MiniArea({ data, w = 520, h = 180 }) {
  const max = Math.max(...data.map(d => d.v)) * 1.15, min = 0;
  const X = i => (i / (data.length - 1)) * (w - 20) + 10;
  const Y = v => h - 24 - ((v - min) / (max - min)) * (h - 40);
  const line = data.map((d, i) => (i ? "L" : "M") + X(i) + " " + Y(d.v)).join(" ");
  const area = line + " L" + X(data.length - 1) + " " + (h - 24) + " L" + X(0) + " " + (h - 24) + " Z";
  return <svg viewBox={"0 0 " + w + " " + h} width="100%" height={h}>
    <defs><linearGradient id="ma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--gold)" stopOpacity=".35" /><stop offset="100%" stopColor="var(--gold)" stopOpacity="0" /></linearGradient></defs>
    <path d={area} fill="url(#ma)" /><path d={line} fill="none" stroke="var(--gold-2)" strokeWidth="2.5" />
    {data.map((d, i) => <text key={i} x={X(i)} y={h - 6} fontSize="11" fill="var(--muted)" textAnchor="middle">{d.m}</text>)}
  </svg>;
}
function MiniBars({ data, w = 520, h = 180 }) {
  const max = Math.max(...data.map(d => d.v)) * 1.15, bw = (w - 20) / data.length;
  return <svg viewBox={"0 0 " + w + " " + h} width="100%" height={h}>
    {data.map((d, i) => { const bh = (d.v / max) * (h - 40); return <g key={i}><rect x={10 + i * bw + bw * .2} y={h - 24 - bh} width={bw * .6} height={bh} rx="4" fill="var(--navy)" /><text x={10 + i * bw + bw * .5} y={h - 6} fontSize="10.5" fill="var(--muted)" textAnchor="middle">{d.m}</text></g>; })}
  </svg>;
}
function MiniDonut({ data, size = 170 }) {
  const total = data.reduce((s, d) => s + d.v, 0); let acc = 0; const r = size / 2 - 14, cx = size / 2, cy = size / 2;
  const seg = data.map(d => { const a0 = acc / total * Math.PI * 2 - Math.PI / 2; acc += d.v; const a1 = acc / total * Math.PI * 2 - Math.PI / 2; const big = a1 - a0 > Math.PI ? 1 : 0; const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1); return { d: "M" + x0 + " " + y0 + " A" + r + " " + r + " 0 " + big + " 1 " + x1 + " " + y1, c: d.c }; });
  return <svg viewBox={"0 0 " + size + " " + size} width={size} height={size}>{seg.map((s, i) => <path key={i} d={s.d} fill="none" stroke={s.c} strokeWidth="16" strokeLinecap="butt" />)}<text x={cx} y={cy + 5} textAnchor="middle" className="serif" fontSize="22" fill="var(--ink)" fontWeight="600">{total}</text></svg>;
}
function Legend({ items }) { return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{items.map(i => <div key={i.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}><span style={{ width: 10, height: 10, borderRadius: 3, background: i.c }} />{i.name} <b style={{ color: "var(--ink)", marginLeft: "auto" }}>{i.v}</b></div>)}</div>; }

const H2 = ({ title, sub, right }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}><div><h1 className="serif" style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: -.3 }}>{title}</h1>{sub && <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 3 }}>{sub}</div>}</div>{right}</div>;

/* ---------- OWNER DASHBOARD ---------- */
function OwnerDash({ st, identity }) {
  const leased = st.properties.filter(p => p.status === "Leased").length;
  const occ = Math.round(leased / st.properties.length * 100);
  const income = [{ m: "Feb", v: 58 }, { m: "Mar", v: 64 }, { m: "Apr", v: 61 }, { m: "May", v: 72 }, { m: "Jun", v: 78 }, { m: "Jul", v: 83 }];
  const byArea = PM_AREAS.slice(0, 6).map(a => ({ m: a.slice(0, 4), v: Math.round(st.properties.filter(p => p.area === a).reduce((s, p) => s + p.rent, 0) / 1e6) }));
  const occData = [{ name: "Leased", v: leased, c: "var(--navy)" }, { name: "Available", v: st.properties.length - leased, c: "var(--gold)" }];
  return <div>
    <H2 title={"Good day, " + identity.name.split(" ")[0]} sub="Girard-managed Lagos portfolio at a glance" />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
      <PmStat icon={Building2} label="Properties" value={String(st.properties.length)} sub="Lagos portfolio" tone="var(--muted)" />
      <PmStat icon={Home} label="Occupancy" value={occ + "%"} sub={leased + " leased"} />
      <PmStat icon={Wallet} label="Monthly income" value="₦83.4M" sub="+6.4% vs May" />
      <PmStat icon={Wrench} label="Open tickets" value={String(st.tickets.filter(t => t.status !== "Resolved").length)} sub="1 emergency" tone="var(--danger)" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="pm-grid2">
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Rental income trend (₦M)</div><MiniArea data={income} /></PmCard>
      <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Occupancy</div><div style={{ display: "flex", alignItems: "center", gap: 16 }}><MiniDonut data={occData} /><Legend items={occData} /></div></PmCard>
    </div>
    <PmCard><div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Portfolio rent by area (₦M p.a.)</div><MiniBars data={byArea} /></PmCard>
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
        <div onClick={() => setSel(p)}><HouseArt hue={p.hue} status={p.status} /></div>
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}><div className="serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{p.title}</div>{p.verified && <ShieldCheck size={15} color="var(--gold-2)" />}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, margin: "4px 0 8px" }}>{p.area} · {p.beds || "Studio"} bed</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ color: "var(--navy)", fontWeight: 700 }}>{money(p.rent)}<span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 11 }}>/yr</span></div><PmBtn size="sm" onClick={() => setSel(p)}>View</PmBtn></div>
        </div></PmCard>)}
    </div>
    {sel && <PmModal title={sel.title} onClose={() => setSel(null)} wide>
      <HouseArt hue={sel.hue} status={sel.status} h={190} />
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
        <div style={{ cursor: "pointer" }} onClick={() => setSel(p)}><HouseArt hue={p.hue} status="Available" /></div>
        <div style={{ padding: 14 }}><div className="serif" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{p.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, margin: "4px 0 8px" }}>{p.area} · {p.beds || "Studio"} bed</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ color: "var(--navy)", fontWeight: 700 }}>{money(p.rent)}<span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 11 }}>/yr</span></div><PmBtn size="sm" onClick={() => setApply(p)}>Apply</PmBtn></div>
        </div></PmCard>)}
    </div>
    {sel && !apply && <PmModal title={sel.title} onClose={() => setSel(null)} wide>
      <HouseArt hue={sel.hue} status="Available" h={190} />
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
function ApplicationsScreen({ st, setSt, toast }) {
  const [lease, setLease] = useState(null);
  const act = (id, status) => { setSt({ ...st, applications: st.applications.map(a => a.id === id ? { ...a, status } : a) }); toast("Application " + status.toLowerCase(), status === "Rejected" ? "danger" : "success"); };
  return <div>
    <H2 title="Applications" sub="Review tenant applications and screening results" />
    <PmCard pad={0} style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
        <thead><tr style={{ background: "var(--ivory)" }}>{["Applicant", "Property", "Income", "Score", "Status", "Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: .4 }}>{h}</th>)}</tr></thead>
        <tbody>{st.applications.map(a => { const p = propOf(st, a.property); return <tr key={a.id} style={{ borderTop: "1px solid var(--cream-line)" }}>
          <td style={{ padding: "13px 16px" }}><div style={{ fontWeight: 700, color: "var(--ink)" }}>{a.tenant}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{a.note}</div></td>
          <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{p ? p.title : a.property}<div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p ? p.area : ""}</div></td>
          <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--ink)" }}>{money(a.income)}</td>
          <td style={{ padding: "13px 16px" }}><b style={{ color: a.score > 720 ? "#1F9D57" : a.score > 650 ? "#E0A106" : "#D0453B" }}>{a.score}</b></td>
          <td style={{ padding: "13px 16px" }}><PmPill label={a.status} /></td>
          <td style={{ padding: "13px 16px" }}>{a.status === "Approved" ? <PmBtn size="sm" kind="gold" icon={FileText} onClick={() => setLease(a)}>Generate lease</PmBtn> : a.status === "Rejected" ? <span style={{ color: "var(--muted)", fontSize: 12.5 }}>Closed</span> : <div style={{ display: "flex", gap: 6 }}><PmBtn size="sm" onClick={() => act(a.id, "Approved")}>Approve</PmBtn><PmBtn size="sm" kind="ghost" onClick={() => act(a.id, "Rejected")}>Reject</PmBtn></div>}</td>
        </tr>; })}</tbody>
      </table></div>
    </PmCard>
    {lease && <LeaseModal st={st} setSt={setSt} app={lease} onClose={() => setLease(null)} toast={toast} />}
  </div>;
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
  return <div><H2 title={"Good day, " + identity.name.split(" ")[0]} sub={"Your " + (ROLES.find(r => r.key === identity.role)?.name || "member") + " workspace"} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>{tiles.map(t => <PmCard key={t.label}><div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", marginBottom: 14 }}><t.icon size={20} /></div><div className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{t.label}</div><div style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 }}>{t.note}</div><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gold-2)", background: "var(--gold-soft)", padding: "3px 9px", borderRadius: 4 }}>Coming next</span></PmCard>)}</div>
    <div style={{ marginTop: 26, color: "var(--muted)", fontSize: 14 }}>The {identity.role === "agent" ? "agent pipeline and CRM" : "investor intelligence and swap"} tools arrive in the next stages.</div>
  </div>;
}

/* ---------- APP SHELL ---------- */
const NAV = {
  owner: [["dash", "Dashboard", LayoutDashboard], ["props", "Properties", Building2], ["add", "Add property", Plus], ["apps", "Applications", Users], ["rent", "Rent & invoices", CreditCard], ["maint", "Maintenance", Wrench], ["swap", "Swap marketplace", Repeat]],
  tenant: [["find", "Find a home", Search], ["rent", "Pay rent", CreditCard], ["maint", "Maintenance", Wrench]],
  admin: [["dash", "Dashboard", LayoutDashboard], ["props", "Verify listings", ShieldCheck], ["apps", "Applications", Users], ["maint", "Maintenance", Wrench], ["swpipe", "Swap pipeline", Handshake]],
  agent: [["work", "Workspace", LayoutGrid]],
  investor: [["swap", "Swap marketplace", Repeat], ["intel", "Market intelligence", LineChart], ["work", "Overview", LayoutGrid]]
};
function AppShell({ identity, onSignOut, onSwitchRole }) {
  const nav = NAV[identity.role] || NAV.agent;
  const [view, setView] = useState(nav[0][0]);
  const [st, setStRaw] = useState(pmLoad);
  const [nav2Open, setNav2Open] = useState(false);
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
    if (view === "intel") return <IntelSoon />;
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
          <div><div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>{ROLES.find(r => r.key === identity.role)?.name || "Workspace"}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{(view === "swap" || view === "swpipe") ? "Property Swap Marketplace · Cross-border" : view === "intel" ? "Market Intelligence" : "Digital Property Management · Lagos"}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="serif" style={{ width: 34, height: 34, borderRadius: 999, background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{identity.initials}</div>
            <div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{identity.name}</div><div style={{ fontSize: 11, color: "var(--gold-2)" }}>{identity.title}</div></div>
          </div>
          <PmBtn kind="ghost" size="sm" icon={LogOut} onClick={onSignOut}>Sign out</PmBtn>
        </div>
      </header>
      <main style={{ padding: 24, flex: 1 }}>{screen()}</main>
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

function SwapCardArt({ hue, verified }) {
  return <div style={{ position: "relative", height: 130, borderRadius: 10, overflow: "hidden", background: "linear-gradient(140deg, hsl(" + hue + ",42%,22%), hsl(" + (hue - 12) + ",50%,34%))" }}>
    <svg viewBox="0 0 300 130" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: .22 }}><g fill="none" stroke="var(--gold)" strokeWidth="1.4"><path d="M50 104 L50 56 L92 34 L134 56 L134 104 Z" /><path d="M150 104 L150 66 L188 66 L188 104 Z" /><rect x="204" y="72" width="34" height="32" /></g></svg>
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
        <SwapCardArt hue={l.hue} verified={l.verified} />
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
        <PmCard pad={12}><SwapCardArt hue={x.hue} verified={x.verified} />
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
          <div style={{ width: 92, flexShrink: 0 }}><SwapCardArt hue={m.hue} verified={m.verified} /></div>
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
