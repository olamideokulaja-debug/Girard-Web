// Public review submission. Written with the service role as status pending,
// so nothing appears on the site until a staff member approves it in the
// Reviews screen. Turnstile is enforced once TURNSTILE_SECRET is set.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
function clean(v, n) { return String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n); }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });
  const name = clean(b.name, 80), body = clean(b.body, 1200), area = clean(b.area, 80), email = clean(b.email, 160).toLowerCase();
  const role = ["Landlord", "Tenant", "Buyer", "Other"].includes(b.role) ? b.role : "Other";
  const rating = Math.min(5, Math.max(1, parseInt(b.rating, 10) || 0));
  if (!name || body.length < 20 || !rating) return res.status(200).json({ ok: false, error: "A name, a rating and at least a sentence are needed." });
  const secret = process.env.TURNSTILE_SECRET;
  if (secret) {
    const tok = clean(b.cfToken, 2048);
    if (!tok) return res.status(200).json({ ok: false, error: "Please complete the verification box." });
    try {
      const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ secret, response: tok }) });
      const vj = await vr.json().catch(() => ({}));
      if (!vj.success) return res.status(200).json({ ok: false, error: "Verification did not pass. Please try again." });
    } catch (e) { return res.status(200).json({ ok: false, error: "Verification could not be reached. Please try again in a moment." }); }
  }
  if (!SERVICE) return res.status(200).json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set on this deployment" });
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/reviews", {
      method: "POST", headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ name, role, area, rating, body, email, status: "pending" })
    });
    if (!r.ok) return res.status(200).json({ ok: false, error: "Database " + r.status });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 200) }); }
}
