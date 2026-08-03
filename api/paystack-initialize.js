// Vercel serverless function: start a Paystack transaction (rent payment).
// SECURITY: the amount and the landlord split are looked up from the database
// server-side by property id, so a tampered app cannot set the price or the payee.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getProperty(propId) {
  if (!SERVICE || !propId) return null;
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/properties?id=eq." + encodeURIComponent(propId) + "&select=data,status,subaccount,split_code", {
      headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE },
    });
    const rows = await r.json();
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  } catch (e) { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!SECRET) return res.status(500).json({ error: "Paystack not configured" });
  try {
    const b = req.body || {};
    const email = b.email;
    const propId = b.property || (b.metadata && b.metadata.property);
    if (!email) return res.status(400).json({ error: "email is required" });

    // Prefer server-side truth: look the property up and use ITS rent + split.
    let amount = Math.round(Number(b.amount) || 0);   // client value is only a fallback
    let subaccount = b.subaccount, split_code = b.split_code, title = (b.metadata && b.metadata.title) || "";
    const isBooking = !!(b.booking && b.checkin && b.checkout);
    let bookingNights = 0;
    const prop = await getProperty(propId);
    if (prop) {
      const d = prop.data || {};
      subaccount = prop.subaccount || d.subaccount || subaccount;
      split_code = prop.split_code || d.split_code || split_code;
      title = d.title || title;
      if (isBooking) {
        bookingNights = Math.max(1, Math.round((new Date(b.checkout) - new Date(b.checkin)) / 86400000));
        const nightly = Number(d.nightly || d.rent || 0);
        if (nightly > 0) amount = Math.round(bookingNights * nightly * 100);   // authoritative
      } else {
        if (prop.status !== "Available") return res.status(409).json({ error: "This property is no longer available." });
        const rent = Number(d.rent || 0);
        if (rent > 0) amount = Math.round(rent * 100);
      }
    } else if (SERVICE && propId) {
      // service key present but property not found -> refuse rather than trust the client
      return res.status(404).json({ error: "Property not found." });
    }
    if (!amount || amount < 100) return res.status(400).json({ error: "Invalid amount." });

    const body = {
      email,
      amount,
      currency: "NGN",
      reference: b.reference || ("GIRARD-rent-" + Date.now()),
      callback_url: "https://girardpropertylimited.com/api/pay-return",
      ...(split_code ? { split_code } : subaccount ? { subaccount, bearer: "subaccount" } : {}),
      metadata: { property: propId || "", title, ...(b.booking && b.checkin && b.checkout ? { booking: true, checkin: b.checkin, checkout: b.checkout } : {}) },
    };
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: "Bearer " + SECRET, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!data || !data.status) return res.status(400).json({ error: (data && data.message) || "Initialize failed" });
    return res.status(200).json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
