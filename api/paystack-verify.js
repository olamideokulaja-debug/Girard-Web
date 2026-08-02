// Vercel serverless function: verify a Paystack transaction by reference.
// On confirmed success, it also takes a LONG-LET rental off the market by
// setting its property status to "Leased" (server-authoritative, so a client
// can't fake it). Short-lets and sales are left unchanged.

const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function markLeasedIfLongLet(propId) {
  if (!SERVICE || !propId) return;          // no service key -> skip quietly
  try {
    const headers = { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" };
    const r = await fetch(SUPABASE_URL + "/rest/v1/properties?id=eq." + encodeURIComponent(propId) + "&select=data,status", { headers });
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) return;
    const d = rows[0].data || {};
    const intent = d.intent || "To let";
    const letType = d.letType || "Long let";
    if (intent === "For sale") return;                 // sales handled separately
    if (letType && letType !== "Long let") return;     // leave short-lets alone
    if (rows[0].status === "Leased") return;           // already taken
    await fetch(SUPABASE_URL + "/rest/v1/properties?id=eq." + encodeURIComponent(propId), {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ status: "Leased", updated_at: new Date().toISOString() }),
    });
  } catch (e) { /* best-effort: never block the payment confirmation */ }
}

export default async function handler(req, res) {
  const SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!SECRET) return res.status(500).json({ status: "error", message: "Paystack not configured" });
  const reference = (req.query && req.query.reference) || (req.body && req.body.reference);
  if (!reference) return res.status(400).json({ status: "error", message: "reference required" });
  try {
    const r = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
      headers: { Authorization: "Bearer " + SECRET },
    });
    const data = await r.json();
    if (!data || !data.status) return res.status(400).json({ status: "failed", message: (data && data.message) || "verify failed" });

    if (data.data && data.data.status === "success") {
      const propId = data.data.metadata && data.data.metadata.property;
      await markLeasedIfLongLet(propId);      // take long-let off the market
    }

    return res.status(200).json({
      status: data.data.status,
      amount: data.data.amount,
      reference: data.data.reference,
      paid_at: data.data.paid_at,
    });
  } catch (e) {
    return res.status(500).json({ status: "error", message: String((e && e.message) || e) });
  }
}
