import React, { useState, useEffect } from "react";
import {
  Building2, Repeat, LineChart, ArrowUpRight, ShieldCheck,
  Globe2, Menu, X, Home, Users, Briefcase, KeyRound, Sparkles, MapPin
} from "lucide-react";

/* Girard Property Estate Limited
   Stage 1: Public marketing landing and brand.
   Single-file App.jsx, premium and trust-led. Deep green with a restrained gold accent
   and a Fraunces serif display face. Later stages add auth, the two modules,
   the live feed, intelligence, concierge and pricing. */

const REGIONS = {
  Nigeria: {
    cur: "\u20a6",
    tag: "Lagos & Abuja",
    line: "Managing a 30-property Lagos portfolio and opening to landlords across Nigeria.",
    listings: [
      { title: "4-Bed Detached Duplex", place: "Lekki Phase 1, Lagos", price: "\u20a68.4M/yr", kind: "To let" },
      { title: "3-Bed Apartment", place: "Ikoyi, Lagos", price: "\u20a611.2M/yr", kind: "To let" },
      { title: "5-Bed Duplex", place: "Maitama, Abuja", place2: true, price: "\u20a6350M", kind: "For swap" },
      { title: "2-Bed Flat", place: "Yaba, Lagos", price: "\u20a63.0M/yr", kind: "To let" }
    ],
    instr: ["New instruction: 4-Bed in Magodo, Lagos", "New instruction: Penthouse on Victoria Island", "New swap: Abuja terrace seeking London"]
  },
  UK: {
    cur: "\u00a3",
    tag: "London & regions",
    line: "Cross-border management and swaps between the UK and Nigeria, with intelligence built in.",
    listings: [
      { title: "3-Bed Flat, Zone 2", place: "Islington, London", price: "\u00a32,950/mo", kind: "To let" },
      { title: "4-Bed Semi", place: "Didsbury, Manchester", price: "\u00a3720,000", kind: "For swap" },
      { title: "2-Bed Conversion", place: "Bristol", price: "\u00a31,650/mo", kind: "To let" },
      { title: "Georgian Townhouse", place: "Bath", price: "\u00a3410,000", kind: "For swap" }
    ],
    instr: ["New instruction: 2-Bed in Clapham, London", "New swap: London flat seeking Lagos", "New instruction: Family home, Birmingham"]
  },
  "Middle East": {
    cur: "AED",
    tag: "Dubai",
    line: "Serving owners and investors moving between the Gulf, Nigeria and the UK.",
    listings: [
      { title: "2-Bed Marina Apartment", place: "Dubai Marina", price: "AED 145,000/yr", kind: "To let" },
      { title: "3-Bed Villa", place: "Arabian Ranches, Dubai", price: "AED 3.1M", kind: "For swap" },
      { title: "Studio", place: "Downtown Dubai", price: "AED 78,000/yr", kind: "To let" },
      { title: "4-Bed Villa", place: "Palm Jumeirah", price: "AED 9.8M", kind: "For swap" }
    ],
    instr: ["New instruction: Marina 1-Bed, Dubai", "New swap: Dubai villa seeking London", "New instruction: Downtown studio"]
  },
  International: {
    cur: "$",
    tag: "Cross-border",
    line: "A single platform for property owners, tenants, agents and investors, across markets.",
    listings: [
      { title: "5-Bed Duplex", place: "Lekki, Lagos", price: "$310,000", kind: "For swap" },
      { title: "3-Bed Flat", place: "London, UK", price: "$3,750/mo", kind: "To let" },
      { title: "2-Bed Condo", place: "Brooklyn, New York", price: "$610,000", kind: "For swap" },
      { title: "3-Bed Villa", place: "Dubai, UAE", price: "$1.2M", kind: "For swap" }
    ],
    instr: ["New swap: Lagos duplex seeking London", "New instruction: Brooklyn 2-Bed", "New swap: Dubai villa seeking Lagos"]
  }
};

const SERVICES = [
  { icon: Building2, name: "Digital Management", copy: "List, let and run rentals online. AI-recommended rents, screening, e-signed leases, rent collection and maintenance in one place." },
  { icon: Repeat, name: "Property Swap", copy: "Exchange properties directly across Nigeria, the UK and beyond. AI valuation, reciprocal matching, escrow and title transfer, orchestrated end to end." },
  { icon: LineChart, name: "Market Intelligence", copy: "Sold prices, planning applications, local plans, auction results and yields, distilled for the decision at hand and refreshed on a schedule." },
  { icon: Sparkles, name: "Support Services", copy: "Conveyancing, surveys, removals, furnishing and finance, delivered as a managed concierge on a vetted partner network." }
];

const AUDIENCES = [
  { icon: Home, name: "Owners & Landlords", copy: "Let faster, price with confidence and manage a portfolio without a linear rise in staff.", points: ["AI rent recommendations", "Automated leases and rent collection", "Occupancy and income analytics"] },
  { icon: KeyRound, name: "Tenants", copy: "Find, apply for and secure a home online, then manage rent and repairs from one portal.", points: ["Search and apply in minutes", "e-Sign leases securely", "Report maintenance and track it"] },
  { icon: Users, name: "Agents", copy: "Run instructions, applications and offers through a single pipeline built for volume.", points: ["Shared live listings feed", "Applications and offers CRM", "Subscription tiers by scale"] },
  { icon: Briefcase, name: "Investors & Developers", copy: "Move on deals with intelligence and cross-border swaps that avoid heavy fees and taxes.", points: ["Sold prices and yields", "Reciprocal swap matching", "Deal-flow and intelligence tiers"] }
];

const TRUST = [
  { k: "30", v: "Lagos properties under management at launch" },
  { k: "3", v: "Core markets: Nigeria, the UK and international" },
  { k: "24/7", v: "Global platform access, web and mobile" }
];

function KindDot({ kind }) {
  const c = kind === "For swap" ? "var(--gold)" : kind === "New instruction" ? "var(--green-line)" : "var(--green)";
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: c, marginRight: 7, verticalAlign: "middle" }} />;
}

function ListingCard({ l }) {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", flexShrink: 0, width: 244 }}>
      <div style={{ height: 118, position: "relative", background: "linear-gradient(135deg, var(--green) 0%, var(--green-line) 100%)" }}>
        <svg viewBox="0 0 244 118" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.16 }}>
          <g fill="#fff">
            <path d="M40 92 L40 58 L66 40 L92 58 L92 92 Z" />
            <path d="M104 92 L104 48 L134 28 L164 48 L164 92 Z" />
            <rect x="176" y="62" width="28" height="30" />
          </g>
        </svg>
        <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,.92)", color: "var(--ink)", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}><KindDot kind={l.kind} />{l.kind}</span>
      </div>
      <div style={{ padding: 13 }}>
        <div className="serif" style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{l.title}</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, margin: "4px 0 8px" }}><MapPin size={12} />{l.place}</div>
        <div style={{ fontWeight: 700, color: "var(--green)" }}>{l.price}</div>
      </div>
    </div>
  );
}

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
        .btn-primary{background:var(--green);color:#fff;border:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .18s,transform .06s}
        .btn-primary:hover{background:var(--green-deep)}
        .btn-primary:active{transform:scale(.985)}
        .btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line);padding:11px 20px;border-radius:999px;font-weight:600;font-size:14.5px;cursor:pointer;transition:border-color .18s}
        .btn-ghost:hover{border-color:var(--green)}
        .region-pill{border:1px solid var(--line);background:transparent;color:var(--muted);padding:7px 15px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s}
        .region-pill:hover{border-color:var(--green);color:var(--green)}
        .region-pill.on{background:var(--green);border-color:var(--green);color:#fff}
        .svc-card{background:var(--white);border:1px solid var(--line);border-radius:18px;padding:26px;transition:transform .2s,box-shadow .2s}
        .svc-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(16,59,44,.10)}
        .aud-card{background:var(--white);border:1px solid var(--line);border-radius:18px;padding:24px}
        .nav-link{color:var(--muted);font-size:14px;font-weight:500;transition:color .18s}
        .nav-link:hover{color:var(--ink)}
        .wrap{max-width:1160px;margin:0 auto;padding:0 24px}
        @keyframes floatIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:floatIn .7s ease both}
        @media(max-width:860px){
          .nav-links{display:none!important}
          .burger{display:inline-flex!important}
          .hero-h{font-size:44px!important}
          .grid-2{grid-template-columns:1fr!important}
          .grid-4{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:560px){.grid-4{grid-template-columns:1fr!important}.hero-h{font-size:36px!important}}
      `}</style>

      {/* NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(246,243,236,.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <svg viewBox="0 0 100 100" width="34" height="34"><rect x="6" y="6" width="88" height="88" rx="9" fill="none" stroke="var(--gold)" strokeWidth="5" /><path d="M30 74 L30 50 L46 38 L62 50 L62 74 Z M62 74 L62 44 L74 52 L74 74 Z" fill="var(--green)" /><rect x="42" y="56" width="8" height="8" fill="var(--cream)" /></svg>
            <div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: .3, color: "var(--ink)" }}>Girard</div>
              <div style={{ fontSize: 8.5, letterSpacing: 2.4, color: "var(--muted)", marginTop: -2 }}>PROPERTY ESTATE</div>
            </div>
          </div>
          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#audiences">Who we serve</a>
            <a className="nav-link" href="#markets">Markets</a>
            <a className="btn-ghost" href="#" style={{ marginLeft: 4 }}>Sign in</a>
            <a className="btn-primary" href="#">Get started <ArrowUpRight size={16} /></a>
          </nav>
          <button className="burger" onClick={() => setMenu(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--ink)" }}>{menu ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {menu && (
          <div className="wrap" style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#audiences">Who we serve</a>
            <a className="nav-link" href="#markets">Markets</a>
            <a className="btn-primary" href="#" style={{ justifyContent: "center" }}>Get started</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ background: "linear-gradient(180deg, var(--cream) 0%, var(--cream-2) 100%)", paddingTop: 72, paddingBottom: 20 }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 48, alignItems: "center" }} className="grid-2">
            <div className="fade">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold-soft)", color: "var(--gold-deep)", padding: "6px 13px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, marginBottom: 22 }}>
                <Globe2 size={14} /> Property, managed and moved. Worldwide.
              </div>
              <h1 className="serif hero-h" style={{ fontSize: 58, lineHeight: 1.04, fontWeight: 600, color: "var(--ink)", letterSpacing: -.5 }}>
                One home for property across Nigeria, the UK and beyond.
              </h1>
              <p style={{ fontSize: 17, color: "var(--muted)", marginTop: 20, maxWidth: 500, lineHeight: 1.6 }}>
                Girard brings digital management, cross-border swaps, market intelligence and a concierge of trusted services onto a single platform, built for owners, tenants, agents and investors.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a className="btn-primary" href="#">Get started <ArrowUpRight size={16} /></a>
                <a className="btn-ghost" href="#services">Explore services</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 24, color: "var(--muted)", fontSize: 13 }}>
                <ShieldCheck size={16} color="var(--green)" /> Trust-led, compliance-first, with human oversight at every critical step.
              </div>
            </div>

            {/* Region lens + live teaser */}
            <div className="fade" id="markets">
              <div style={{ background: "var(--white)", border: "1px solid var(--line)", borderRadius: 22, padding: 20, boxShadow: "0 24px 60px rgba(16,59,44,.10)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", letterSpacing: .3 }}>REGION LENS</div>
                  <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--green)", display: "inline-block", animation: "floatIn 1s" }} /> Live</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                  {Object.keys(REGIONS).map(k => (
                    <button key={k} className={"region-pill" + (region === k ? " on" : "")} onClick={() => { setRegion(k); setOffset(0); }}>{k}</button>
                  ))}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5, marginBottom: 14 }}>
                  <span className="serif" style={{ color: "var(--gold-deep)", fontWeight: 600 }}>{R.tag}. </span>{R.line}
                </div>

                {/* rotating instruction ticker */}
                <div style={{ background: "var(--green)", color: "#fff", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 9, marginBottom: 16, overflow: "hidden" }}>
                  <Sparkles size={15} color="var(--gold)" />
                  <span key={instr} className="fade" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{instr}</span>
                </div>

                {/* blurred rotating listings */}
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", gap: 12, overflow: "hidden", filter: "blur(3px)", opacity: .92, maskImage: "linear-gradient(90deg, #000 70%, transparent)" }}>
                    {rotated.map((l, i) => <ListingCard key={l.title + i} l={l} />)}
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                    <a href="#" className="btn-primary" style={{ boxShadow: "0 10px 30px rgba(11,42,32,.35)" }}>Sign in to view live listings <ArrowUpRight size={16} /></a>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>Currency shown in {R.cur}. Full feed unlocks on sign-in.</div>
              </div>
            </div>
          </div>

          {/* trust strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 56, marginBottom: 8, borderTop: "1px solid var(--line)", paddingTop: 30 }} className="grid-4">
            {TRUST.map(x => (
              <div key={x.k}>
                <div className="serif" style={{ fontSize: 40, fontWeight: 600, color: "var(--green)" }}>{x.k}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "84px 0", background: "var(--cream)" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 44 }}>
            <div style={{ color: "var(--gold-deep)", fontWeight: 700, fontSize: 13, letterSpacing: 1.4, marginBottom: 12 }}>WHAT GIRARD DOES</div>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 600, color: "var(--ink)", lineHeight: 1.12 }}>Four services, one continuous property journey.</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 14, lineHeight: 1.6 }}>From the first listing to the final transfer, and everything that keeps a property running in between.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="grid-2">
            {SERVICES.map(s => (
              <div key={s.name} className="svc-card">
                <div style={{ width: 48, height: 48, borderRadius: 13, background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", marginBottom: 18 }}><s.icon size={22} /></div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{s.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.62 }}>{s.copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section id="audiences" style={{ padding: "84px 0", background: "var(--green)", color: "#fff" }}>
        <div className="wrap">
          <div style={{ maxWidth: 640, marginBottom: 44 }}>
            <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, letterSpacing: 1.4, marginBottom: 12 }}>WHO WE SERVE</div>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.12 }}>A role-aware platform, tuned to each user.</h2>
            <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16, marginTop: 14, lineHeight: 1.6 }}>Everyone signs in to their own experience, their own tools and their own pricing.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="grid-2">
            {AUDIENCES.map(a => (
              <div key={a.name} style={{ background: "var(--green-deep)", border: "1px solid var(--green-line)", borderRadius: 18, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--gold-soft)", color: "var(--green)", display: "grid", placeItems: "center" }}><a.icon size={20} /></div>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{a.name}</div>
                </div>
                <div style={{ color: "rgba(255,255,255,.74)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 14 }}>{a.copy}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {a.points.map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "rgba(255,255,255,.9)" }}>
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--gold)" }} />{p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "88px 0", background: "var(--cream)" }}>
        <div className="wrap">
          <div style={{ background: "linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%)", borderRadius: 26, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: 999, background: "rgba(194,161,90,.16)" }} />
            <h2 className="serif" style={{ fontSize: 42, fontWeight: 600, color: "#fff", lineHeight: 1.12, position: "relative" }}>Ready when you are.</h2>
            <p style={{ color: "rgba(255,255,255,.78)", fontSize: 16.5, marginTop: 14, maxWidth: 520, margin: "14px auto 0", lineHeight: 1.6, position: "relative" }}>Create an account, tell us who you are, and step into a property platform that works across borders.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap", position: "relative" }}>
              <a href="#" className="btn-primary" style={{ background: "var(--gold)", color: "#201803" }}>Get started <ArrowUpRight size={16} /></a>
              <a href="#" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,.3)", color: "#fff" }}>Talk to Girard</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--charcoal)", color: "rgba(255,255,255,.7)", padding: "52px 0 30px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 30 }} className="grid-4">
            <div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Girard</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, maxWidth: 260 }}>Girard Property Estate Limited. Property managed and moved, worldwide.</div>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Services</div>
              {["Management", "Property Swap", "Intelligence", "Support Services"].map(x => <div key={x} style={{ fontSize: 13.5, marginBottom: 8 }}>{x}</div>)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Markets</div>
              {["Nigeria", "United Kingdom", "Middle East", "International"].map(x => <div key={x} style={{ fontSize: 13.5, marginBottom: 8 }}>{x}</div>)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Company</div>
              {["About", "Partners", "Contact", "Sign in"].map(x => <div key={x} style={{ fontSize: 13.5, marginBottom: 8 }}>{x}</div>)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", marginTop: 40, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12.5 }}>
            <div>&copy; 2026 Girard Property Estate Limited. All rights reserved.</div>
            <div>Compliance-first. This platform is not a substitute for legal or financial advice.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
