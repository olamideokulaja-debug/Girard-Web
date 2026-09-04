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
    await alertStaff({ name, role, area, rating, body });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 200) }); }
}

// A review nobody knows about is a review that sits unpublished for weeks.
// Three alerts, none of which can fail the submission: a row in the
// notifications table (the bell in the admin portal), an email to the staff
// inbox, and a push to every device registered to an admin.
async function alertStaff({ name, role, area, rating, body }) {
  const H = { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" };
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const title = "New review waiting for approval";
  const line = name + " (" + role + (area ? ", " + area : "") + ") " + stars;
  try {
    await fetch(SUPABASE_URL + "/rest/v1/notifications", {
      method: "POST", headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify({ id: "NT-" + Date.now() + "-" + Math.floor(Math.random() * 1000), title, body: line, kind: "info", audience: "admin" })
    });
  } catch (e) {}
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || "Girard <no-reply@girardpropertylimited.com>",
          to: [process.env.LEADS_TO || "info@girardpropertylimited.com"],
          subject: "Review waiting for approval: " + name + " " + stars,
          text: [line, "", body, "", "Nothing is published until a staff member approves it. Sign in to the admin portal and open Reviews to approve or reject it.", "https://www.girardpropertylimited.com/"].join("\n")
        })
      });
    } catch (e) {}
  }
  try {
    const adm = await (await fetch(SUPABASE_URL + "/rest/v1/profiles?role=eq.admin&select=email", { headers: H })).json();
    const emails = new Set((Array.isArray(adm) ? adm : []).map(x => String(x.email || "").toLowerCase()).filter(Boolean));
    const tokRes = await (await fetch(SUPABASE_URL + "/rest/v1/push_tokens?select=token,email", { headers: H })).json();
    const tokens = [...new Set((Array.isArray(tokRes) ? tokRes : []).filter(t => {
      const e = String(t.email || "").toLowerCase();
      return emails.has(e) || e.endsWith("@girardpropertylimited.com");
    }).map(t => t.token).filter(Boolean))];
    if (tokens.length) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(tokens.map(to => ({ to, title, body: line, sound: "default", data: { screen: "reviews" } })))
      });
    }
  } catch (e) {}
}
