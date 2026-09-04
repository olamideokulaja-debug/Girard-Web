/* Content for the static, crawlable pages.
   Every word here is lifted from the existing Girard landing page in
   src/App.jsx. Nothing is invented. If you change the copy on the site,
   change it here too so the two stay in step. */

export const SITE = {
  origin: "https://www.girardpropertylimited.com",
  name: "Girard Property Limited",
  tagline: "Property managed with discipline, moved without borders.",
  address: "21 Fatai Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos",
  phone: "+234 704 817 3866",
  phoneHref: "tel:+2347048173866",
  email: "info@girardpropertylimited.com",
  hours: "Monday to Saturday, 8am to 5pm. Sunday closed.",
  play: "https://play.google.com/store/apps/details?id=com.girardpropertylimited.twa",
  appStore: "https://apps.apple.com/app/id6795445952"
};

/* The 6 service lines. The slugs for property-and-estate-management and
   real-estate-investment-partnerships deliberately match the URLs the old
   site used, so those addresses become real pages again. */
export const SERVICES = [
  {
    slug: "real-estate-development",
    photo: "/img/bourdillon_tower.jpg",
    title: "Real Estate Development",
    body: "Premium residential, commercial and mixed-use properties engineered for durability, sustainability and elevated lifestyle experiences, guided by disciplined planning, architectural excellence and strict compliance with international standards."
  },
  {
    slug: "property-and-estate-management",
    photo: "/img/bourdillon_lobby.jpg",
    title: "Property & Estate Management",
    body: "End-to-end management of residential and commercial assets, ensuring operational efficiency, tenant satisfaction and long-term asset preservation, with technology-enabled real-time monitoring and data-driven performance tracking.",
    list: {
      heading: "What estate management covers",
      items: ["Facility & infrastructure management", "Lease administration", "Service charge management", "Maintenance oversight", "Vendor coordination", "Security operations", "Utilities management", "Financial reporting"]
    }
  },
  {
    slug: "short-let-and-holiday-stays",
    photo: "/img/bourdillon_bedroom.jpg",
    title: "Short Let & Holiday Stays",
    body: "Professional management of short-let and serviced residences, with positioning, guest operations and upkeep handled end-to-end so owners earn optimised returns from the hospitality market."
  },
  {
    slug: "buy-to-let-investment-solutions",
    photo: "/img/bourdillon_living.jpg",
    title: "Buy-to-Let Investment Solutions",
    body: "A structured pathway for investors seeking stable rental income and long-term wealth creation through professionally selected residential assets, each evaluated with rigorous financial modelling and risk assessment."
  },
  {
    slug: "real-estate-investment-partnerships",
    photo: "/img/bourdillon_entrance.jpg",
    title: "Real Estate Investment & Partnerships",
    body: "Secure investment models supported by disciplined due diligence, strong governance and transparent reporting, aligning investor objectives with sustainable asset performance and controlled risk exposure.",
    list: {
      heading: "Investment structures",
      items: ["Development partnerships", "Income-producing assets", "Land banking strategies", "Institutional investment platforms"]
    }
  },
  {
    slug: "real-estate-advisory-and-transaction-support",
    photo: "/img/bourdillon_pool.jpg",
    title: "Real Estate Advisory & Transaction Support",
    body: "Holistic advisory across legal, financial, compliance, development strategy and transaction execution, enabling informed decisions across acquisitions, disposals, restructuring and project feasibility."
  }
];

/* The case the homepage now leads with. Kept here so the static pages make the
   same argument as the site rather than an older one. */
export const CASE = {
  heading: "A market full of listings that were never real.",
  body: "Girard verifies title, ownership and condition before anything is published. Landlords are paid directly through a licensed processor. Tenants sign an agreement with a recorded, attributed signature. The work that used to happen over WhatsApp and in paper files happens here, on the record.",
  points: [
    ["Verified", "Every listing checked before it is published"],
    ["5%", "Taken out of rent, never added on top"],
    ["One place", "Apply, sign and pay without leaving the platform"]
  ]
};

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
  /* Mirrors TEAM in src/App.jsx. The group directors are NOT here: they are
     listed separately in GROUP_BOARD on the site and must not read as Girard's
     own team on the crawlable page either. Keep this list in step with App.jsx. */
  { name: "Dr. Olamide Okulaja", role: "Executive Chairman", photo: "/img/team-okulaja.jpg", bio: "A respected healthcare executive and entrepreneur with over two decades across clinical practice, public health and healthcare management, and CEO of Genesys Health Information Systems. His work in systems reform and strategic leadership sets Girard's direction." },
  { name: "Jennifer Kaja", role: "Chief Executive Officer", photo: "/img/team-kaja.jpg", bio: "A distinguished Nigerian lawyer with first-class honours from the University of Wales and a decade of practice across corporate, commercial and real estate law. As Chief Legal Officer of Periwinkle Empire she oversaw landmark transactions, governance and compliance." },
  { name: "Goodness Onyeneke", role: "Property Manager", photo: "/img/team-onyeneke.jpg", bio: "Runs the managed portfolio day to day: tenancies, inspections, maintenance and the standard every Girard property is held to once the keys have changed hands." },
  { name: "Sandra Ndukwe", role: "Head of People & Culture", photo: "/img/team-ndukwe.jpg", bio: "A people and culture leader with over 10 years across fintech, legal, property and facility management, real estate, media and venture capital, in Nigeria and the United Kingdom. She joined BRB Capital as its first employee and built both the HR function and the business infrastructure around it from nothing, scaling the group past 200 people, and went on to lead HR for its property arm, Juban Realty. Chartered by the Chartered Institute of Personnel Management of Nigeria, she is reading for an MBA in Human Resources at the University of Lagos and holds a degree from the University of Port Harcourt." },
  { name: "Okediji Adebayo Alao", role: "Finance Manager", photo: "/img/team-adebayo.jpg", bio: "A chartered accountant who has built a finance department from nothing and run group reporting on top of it. At C-3V Holdings he rose from accountant to Head of Account, setting up the accounts function and carrying monthly group reporting, payables, payroll, bank reconciliation and PAYE remittance while the group's poultry operation grew 150% and its logistics fleet went from 1 truck to 4. Most recently Reporting Manager at Hartleys Supermarket and Stores, preparing monthly, quarterly and annual accounts, managing budgets and handling external audit. ACA and AAT of the Institute of Chartered Accountants of Nigeria, HND Accounting from Lagos State Polytechnic, with a postgraduate diploma in Economics." },
  { name: "Emmanuella Ezeakor", role: "Client Services Officer", photo: "/img/team-ezeakor.jpg", bio: "Came to Girard from aviation, where she worked the counter and the ramp for Dornier Aviation: passenger check-in and travel documentation, special assistance for elderly and disabled passengers and unaccompanied minors, and the complaints that arrive when a flight does not go to plan. She also supported ground operations, dispatching flight plans, load sheets and weather briefings, and completed the Flight Dispatcher Programme at Lagos Aviation Academy. She holds a BSc in History and International Relations from Chukwuemeka Odumegwu Ojukwu University and is certified in data analysis." }
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

/* Images that already live in public/. Nothing new is uploaded. */
export const IMAGES = {
  emblem: "/img/girard-emblem.png",
  home: "/img/bourdillon_tower.jpg",
  about: "/img/bourdillon_lobby.jpg",
  services: "/img/bourdillon_entrance.jpg",
  platform: "/img/bourdillon_living.jpg",
  howItWorks: "/walkthrough/1.jpg",
  whoWeServe: "/img/bourdillon_bedroom.jpg",
  whyGirard: "/img/bourdillon_lobby.jpg",
  leadership: "/img/our-people.jpg",
  developments: "/img/bourdillon_tower.jpg",
  partners: "/img/bourdillon_pool.jpg",
  contact: "/img/bourdillon_entrance.jpg",
  listings: "/img/bourdillon_living.jpg"
};

export const DEVELOPMENT_GALLERY = [
  ["/img/bourdillon_tower.jpg", "The tower"],
  ["/img/bourdillon_entrance.jpg", "Entrance"],
  ["/img/bourdillon_lobby.jpg", "Lobby"],
  ["/img/bourdillon_living.jpg", "Living space"],
  ["/img/bourdillon_bedroom.jpg", "Bedroom"],
  ["/img/bourdillon_pool.jpg", "Rooftop infinity pool"]
];

export const WALKTHROUGH = ["/walkthrough/1.jpg", "/walkthrough/3.jpg", "/walkthrough/5.jpg", "/walkthrough/7.jpg"];


/* Area pages. Service-led on purpose: what Girard does for an owner or a
   tenant in each area, with no invented market figures and no listings claims.
   Each links into the landlord form and the waiting list. */
export const AREAS = [
  { slug: "ikoyi", name: "Ikoyi", intro: "Ikoyi is the most established of Lagos's premium residential districts: mature streets, large plots, embassies and long-standing family homes alongside newer towers on the waterfront. Owners here tend to hold for the long term, and the tenants they want are professionals and families who expect a property to be run properly.", owner: "For an Ikoyi owner the question is rarely whether the property will let. It is whether the tenancy will be run to a standard that protects the asset: rent collected on time and paid straight to the owner, service charges administered, repairs handled through vetted vendors, and a record of all of it. That is the work Girard does for a 5% fee taken out of the rent.", tenant: "For a tenant, Ikoyi means paying a premium and expecting the property to be exactly as described. Girard publishes only properties whose title, ownership and condition have been checked, so a listing you see is one you can actually go and view." },
  { slug: "victoria-island", name: "Victoria Island", intro: "Victoria Island is the commercial heart of Lagos and a residential district at the same time: offices, hotels and restaurants on the main roads, apartments and serviced units on the streets behind them. Demand here is short-let and corporate as much as long-let, which changes how a property should be run.", owner: "An owner on Victoria Island often has a choice between a long tenancy and a short-let or serviced model, and the right answer depends on the unit, the building and the owner's appetite for turnover. Girard will give a straight view on which, manage either, and take 5% out of what is collected rather than adding a fee on top.", tenant: "Whether you need a serviced apartment for 3 months or a home for 3 years, a Girard listing on Victoria Island has been verified before it was published, and the agreement, the payments and every request during the tenancy sit on one record." },
  { slug: "lekki-phase-1", name: "Lekki Phase 1", intro: "Lekki Phase 1 is where a great deal of Lagos's newer housing stock sits: terraces, flats and detached homes in planned estates, close to Victoria Island but with room to live. Girard's own office is here, on Fatai Arobieke Street off Admiralty Way.", owner: "Lekki Phase 1 owners are often professionals with one or two investment properties and no time to run them. Girard takes the tenancy end to end: verification before listing, tenant applications and signatures on the platform, rent through a licensed processor to the owner's account, and repairs through vetted vendors. 5%, out of the rent.", tenant: "Lekki Phase 1 has the widest choice of homes for families and professionals in the corridor, and also the widest choice of listings that turn out not to exist. Girard's list is shorter because every entry has been checked. Join the waiting list with the estate and budget you have in mind and you hear first when a verified property matches." },
  { slug: "ikeja-gra", name: "Ikeja GRA", intro: "Ikeja GRA is the mainland's premium address: wide tree-lined roads, large compounds, and proximity to the airport and the state government district. It attracts owners who want a quieter, more established setting and tenants who work on the mainland or travel often.", owner: "Properties in Ikeja GRA are often large, older and valuable, which makes condition and maintenance the heart of the management job. Girard checks the property before listing, describes it as it is, and runs repairs and service charges on the record so the owner can see what is being done and what it costs. The fee is 5% of rent collected.", tenant: "A verified Ikeja GRA listing on Girard has had its title, ownership and condition checked, and the tenancy agreement is signed on the platform with a recorded signature. If nothing on the list fits, the waiting list is the fastest way to hear when something does." }
];
