/* Content for the static, crawlable pages.
   Every word here is lifted from the existing Girard landing page in
   src/App.jsx. Nothing is invented. If you change the copy on the site,
   change it here too so the two stay in step. */

export const SITE = {
  origin: "https://www.girardpropertylimited.com",
  name: "Girard Property Limited",
  tagline: "Property managed with discipline, moved without borders.",
  address: "21 Fatai Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos",
  phone: "+234 805 873 3019",
  phoneHref: "tel:+2348058733019",
  email: "info@girardpropertylimited.com",
  hours: "Monday to Saturday, 8am to 5pm. Sunday closed.",
  play: "https://play.google.com/store/apps/details?id=com.girardpropertylimited.twa"
};

/* The 6 service lines. The slugs for property-and-estate-management and
   real-estate-investment-partnerships deliberately match the URLs the old
   site used, so those addresses become real pages again. */
export const SERVICES = [
  {
    slug: "real-estate-development",
    title: "Real Estate Development",
    body: "Premium residential, commercial and mixed-use properties engineered for durability, sustainability and elevated lifestyle experiences, guided by disciplined planning, architectural excellence and strict compliance with international standards."
  },
  {
    slug: "property-and-estate-management",
    title: "Property & Estate Management",
    body: "End-to-end management of residential and commercial assets, ensuring operational efficiency, tenant satisfaction and long-term asset preservation, with technology-enabled real-time monitoring and data-driven performance tracking.",
    list: {
      heading: "What estate management covers",
      items: ["Facility & infrastructure management", "Lease administration", "Service charge management", "Maintenance oversight", "Vendor coordination", "Security operations", "Utilities management", "Financial reporting"]
    }
  },
  {
    slug: "short-let-and-holiday-stays",
    title: "Short Let & Holiday Stays",
    body: "Professional management of short-let and serviced residences, with positioning, guest operations and upkeep handled end-to-end so owners earn optimised returns from the hospitality market."
  },
  {
    slug: "buy-to-let-investment-solutions",
    title: "Buy-to-Let Investment Solutions",
    body: "A structured pathway for investors seeking stable rental income and long-term wealth creation through professionally selected residential assets, each evaluated with rigorous financial modelling and risk assessment."
  },
  {
    slug: "real-estate-investment-partnerships",
    title: "Real Estate Investment & Partnerships",
    body: "Secure investment models supported by disciplined due diligence, strong governance and transparent reporting, aligning investor objectives with sustainable asset performance and controlled risk exposure.",
    list: {
      heading: "Investment structures",
      items: ["Development partnerships", "Income-producing assets", "Land banking strategies", "Institutional investment platforms"]
    }
  },
  {
    slug: "real-estate-advisory-and-transaction-support",
    title: "Real Estate Advisory & Transaction Support",
    body: "Holistic advisory across legal, financial, compliance, development strategy and transaction execution, enabling informed decisions across acquisitions, disposals, restructuring and project feasibility."
  }
];

export const MODULES = [
  {
    n: "01",
    name: "Digital Property Management",
    copy: "List, let and run rentals online with the operational discipline Girard is known for. AI-recommended rents, tenant screening, e-signed leases, automated rent collection and maintenance, delivered with transparent reporting that protects asset value and stabilises cash flow.",
    points: ["AI-recommended rents", "Screening, leases and e-signature", "Rent collection and maintenance"]
  },
  {
    n: "02",
    name: "Property Swap Marketplace",
    copy: "Exchange properties directly across Nigeria, the UK and beyond. Independent AI valuations, reciprocal matching in a common currency, escrow for any difference and guided title transfer let owners move without the fees and friction of separate sales.",
    points: ["AI valuation and matching", "Escrow for value differences", "Guided cross-border title transfer"]
  }
];

export const ADVANTAGES = [
  { t: "Technology-powered operations", d: "Digital systems drive real-time monitoring, streamlined communication and data-driven performance across every asset." },
  { t: "Strong legal & governance framework", d: "Clear legal structures, compliance protocols and performance accountability standards govern every engagement." },
  { t: "Deep development & asset management expertise", d: "A fully integrated approach from site acquisition through delivery and long-term asset stewardship." },
  { t: "High-performing, multidimensional leadership", d: "Seasoned professionals in real estate law, project development, finance, governance and estate management." },
  { t: "Investor-centred transparency", d: "Transparent reporting frameworks and rigorous due diligence keep investors informed and protected." },
  { t: "Compliance with international best practices", d: "Compliance with global standards in building, safety, governance and financial reporting." },
  { t: "Premium architectural & engineering standards", d: "Developments that balance aesthetics, functionality, environmental responsibility and investor performance." }
];

export const AUDIENCES = [
  { name: "Owners & Landlords", copy: "Let faster, price with confidence and protect asset value across a growing portfolio." },
  { name: "Tenants", copy: "Find, apply for and secure a home online, then manage rent and repairs from one portal." },
  { name: "Agents", copy: "Run instructions, applications and offers through a single pipeline built for volume." },
  { name: "Investors & Developers", copy: "Move on deals with intelligence, governance and cross-border swaps that reduce cost." }
];

export const TEAM = [
  { name: "Dr. Olamide Okulaja", role: "Executive Chairman", bio: "A respected healthcare executive and entrepreneur with over two decades across clinical practice, public health and healthcare management, and CEO of Genesys Health Information Systems. His expertise in systems reform, policy and strategic leadership guides Girard's mission of excellence and impact." },
  { name: "Jennifer Kaja", role: "CEO / Managing Director", bio: "A distinguished Nigerian lawyer with first-class honours from the University of Wales and a decade of practice across corporate, commercial and real estate law. As Chief Legal Officer of Periwinkle Empire she oversaw landmark transactions, governance and compliance." },
  { name: "Pedro Cabulo", role: "Chief Strategy & Partnerships Officer", bio: "Leads corporate strategy and cultivates the partnerships that power Girard's growth and investment platforms." },
  { name: "Olayinka O. Odunlami", role: "Finance, Operations & Management", bio: "Drives financial discipline, operational excellence and management systems across the Girard portfolio." },
  { name: "Engr. Tomi Adebayo", role: "Projects Director", bio: "Oversees project delivery, engineering standards and construction quality across Girard developments." }
];

export const AT_A_GLANCE = [
  ["Sector", "Development, asset & estate management, property investment"],
  ["Head office", "21 Fatai Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos"],
  ["Portfolio", "Approximately 30 properties across various stages of development"],
  ["Service lines", "Six integrated services across development, management, investment and advisory"],
  ["Clients", "Investors, homeowners, institutions and development partners"],
  ["Office hours", "Monday to Saturday, 8am to 5pm"]
];

export const VALUES = [
  ["Integrity", "Anchored on transparency, sound governance and ethical practice."],
  ["Precision", "Disciplined planning, rigorous due diligence and strict compliance."],
  ["Innovation", "Technology-powered operations and advanced digital modelling."],
  ["Quality & Compliance", "Premium standards aligned with international best practices."],
  ["Strategic Growth", "Long-term value creation for clients, partners and communities."]
];
