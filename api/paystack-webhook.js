// Paystack webhook: fires server-to-server on every payment event, so a payment
// is recorded and the property is leased even if the app closed mid-flow.
// Verified with the Paystack signature (HMAC-SHA512 of the raw body, secret key).
import crypto from "crypto";

export const config = { api: { bodyParser: false } };

const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function rawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString("utf8");
}

async function sb(path, opts) {
  return fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...opts,
    headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", ...(opts && opts.headers) },
  });
}

async function recordPayment(p) {
  if (!SERVICE || !p.reference) return;
  try {
    // upsert on reference so retries don't duplicate
    await sb("payments?on_conflict=reference", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify([p]),
    });
  } catch (e) {}
}

async function markLeasedIfLongLet(propId) {
  if (!SERVICE || !propId) return;
  try {
    const r = await sb("properties?id=eq." + encodeURIComponent(propId) + "&select=data,status", {});
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) return;
    const d = rows[0].data || {};
    if ((d.intent || "To let") === "For sale") return;
    if (d.letType && d.letType !== "Long let") return;
    if (rows[0].status === "Leased") return;
    await sb("properties?id=eq." + encodeURIComponent(propId), {
      method: "PATCH", headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "Leased", updated_at: new Date().toISOString() }),
    });
  } catch (e) {}
}

export default async function handler(req, res) {
  const SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!SECRET) return res.status(500).end();
  let raw;
  try { raw = await rawBody(req); } catch (e) { return res.status(400).end(); }
  const sig = req.headers["x-paystack-signature"];
  const hash = crypto.createHmac("sha512", SECRET).update(raw).digest("hex");
  if (!sig || hash !== sig) return res.status(401).end();   // reject forgeries

  let event;
  try { event = JSON.parse(raw); } catch (e) { return res.status(400).end(); }

  if (event && event.event === "charge.success" && event.data) {
    const d = event.data;
    const meta = d.metadata || {};
    await recordPayment({
      reference: d.reference,
      property_id: meta.property || null,
      title: meta.title || null,
      tenant_email: (d.customer && d.customer.email) || null,
      amount: d.amount || null,
      status: "success",
      paid_at: d.paid_at || new Date().toISOString(),
    });
    await markLeasedIfLongLet(meta.property);
  }
  return res.status(200).json({ received: true });
}
