// Landlord listing requests and tenant waiting-list entries from the public
// site. Written to the enquiries table with the service role, never through an
// anon policy (the 12 August audit is why), and emailed to staff through Resend.
// Returns what actually happened so the form can tell the visitor the truth:
// saved but not emailed, emailed but not saved, or neither.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const STAFF_EMAIL = process.env.LEADS_TO || "info@girardpropertylimited.com";

function clean(v, n) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const b = req.body || {};

  // Honeypot: real people never fill a field they cannot see.
  if (b.website) return res.status(200).json({ ok: true, saved: false, emailed: false });

  const kind = b.kind === "wanted" ? "Wanted" : "Landlord";
  const name = clean(b.name, 120);
  const email = clean(b.email, 160).toLowerCase();
  const phone = clean(b.phone, 40);
  const area = clean(b.area, 80);
  if (!name || (!email && !phone)) {
    return res.status(200).json({ ok: false, saved: false, emailed: false, error: "A name plus an email address or phone number is needed." });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(200).json({ ok: false, saved: false, emailed: false, error: "That email address does not look right." });
  }

  const fields = kind === "Wanted"
    ? [["Bedrooms", clean(b.beds, 12)], ["Budget per year", clean(b.budget, 60)], ["Move by", clean(b.moveBy, 40)], ["Let type", clean(b.letType, 30)], ["Notes", clean(b.notes, 1000)]]
    : [["Property type", clean(b.ptype, 60)], ["Expected rent per year", clean(b.rent, 60)], ["Let type", clean(b.letType, 30)], ["Currently occupied", clean(b.occupied, 20)], ["Notes", clean(b.notes, 1000)]];
  const message = fields.filter(([, v]) => v).map(([k, v]) => k + ": " + v).join("\n");
  const id = (kind === "Wanted" ? "WANT-" : "LAND-") + Date.now().toString(36).toUpperCase();
  const row = {
    id, type: kind, prop_id: "", prop_title: kind === "Wanted" ? "Waiting list" : "Listing request",
    area, name, phone, email, message,
    date: new Date().toISOString().slice(0, 10), time: "", status: "New"
  };

  const out = { ok: false, saved: false, emailed: false, error: null, id, captcha: "not configured" };

  // Turnstile. Enforced only once TURNSTILE_SECRET exists on the deployment,
  // so the forms keep working before the key is added and go strict after.
  const secret = process.env.TURNSTILE_SECRET;
  if (secret) {
    const tok = clean(b.cfToken, 2048);
    if (!tok) return res.status(200).json({ ...out, error: "Please complete the verification box above, or WhatsApp us on +234 704 817 3866." });
    try {
      const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
      const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: tok, remoteip: ip })
      });
      const vj = await vr.json().catch(() => ({}));
      if (!vj.success) return res.status(200).json({ ...out, captcha: "failed", error: "Verification did not pass. Please try again, or WhatsApp us on +234 704 817 3866." });
      out.captcha = "verified";
    } catch (e) {
      return res.status(200).json({ ...out, captcha: "unavailable", error: "Verification could not be reached. Please try again in a moment, or WhatsApp us on +234 704 817 3866." });
    }
  }

  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SERVICE) {
    out.error = "SUPABASE_SERVICE_ROLE_KEY is not set on this deployment";
  } else {
    try {
      const r = await fetch(SUPABASE_URL + "/rest/v1/enquiries", {
        method: "POST",
        headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(row)
      });
      out.saved = r.ok;
      if (!r.ok) out.error = "Database " + r.status + ": " + (await r.text()).slice(0, 200);
    } catch (e) {
      out.error = "Database: " + String((e && e.message) || e).slice(0, 200);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || "Girard <no-reply@girardpropertylimited.com>",
          to: [STAFF_EMAIL],
          reply_to: email || undefined,
          subject: (kind === "Wanted" ? "Waiting list: " : "Landlord lead: ") + name + (area ? " (" + area + ")" : ""),
          text: ["Name: " + name, "Email: " + (email || "not given"), "Phone: " + (phone || "not given"), "Area: " + (area || "not given"), "", message, "", "Reference: " + id, "Saved to enquiries: " + (out.saved ? "yes" : "NO, " + (out.error || "unknown"))].join("\n")
        })
      });
      out.emailed = r.ok;
      if (!r.ok && !out.error) out.error = "Resend " + r.status;
    } catch (e) {
      if (!out.error) out.error = "Email: " + String((e && e.message) || e).slice(0, 200);
    }
  } else if (!out.error) {
    out.error = "RESEND_API_KEY is not set on this deployment";
  }

  out.ok = out.saved || out.emailed;
  return res.status(200).json(out);
}
