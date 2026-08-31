// Girard notifications sender: email (Resend), SMS + WhatsApp (Twilio).
// POST { channels:["email","sms","whatsapp"], to:{email,phone}, subject, message }
//
// This used to record only `out.email = r.ok`, so a rejected send looked
// identical to a successful one from the outside and nobody could see why an
// invitation never arrived. It now returns Resend's own error message.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { channels = [], to = {}, subject, message, html } = req.body || {};
  const out = { email: null, sms: null, whatsapp: null, configured: false, error: null };
  try {
    if (channels.includes("email") && to.email) {
      if (!process.env.RESEND_API_KEY) {
        out.error = "RESEND_API_KEY is not set on this deployment";
      } else {
        out.configured = true;
        const from = process.env.MAIL_FROM || "Girard <no-reply@girardpropertylimited.com>";
        const payload = {
          from,
          to: [to.email],
          subject: subject || "Girard",
          text: message || ""
        };
        if (html) payload.html = html;
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + process.env.RESEND_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        out.email = r.ok;
        if (!r.ok) {
          // Surface the real reason: an unverified sender domain, a scoped key,
          // a malformed From, or a rate limit all land here.
          let detail = "";
          try { const j = await r.json(); detail = j && (j.message || j.name || JSON.stringify(j)); }
          catch (e) { try { detail = await r.text(); } catch (e2) { detail = ""; } }
          out.error = "Resend " + r.status + ": " + String(detail).slice(0, 300);
          out.from = from;
        }
      }
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const tok = process.env.TWILIO_AUTH_TOKEN;
    async function twilio(from, dest) {
      const body = new URLSearchParams({ From: from, To: dest, Body: message || "" });
      const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json", {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(sid + ":" + tok).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      return r.ok;
    }
    if (channels.includes("sms") && sid && tok && to.phone && process.env.TWILIO_SMS_FROM) {
      out.configured = true;
      out.sms = await twilio(process.env.TWILIO_SMS_FROM, to.phone);
    }
    if (channels.includes("whatsapp") && sid && tok && to.phone && process.env.TWILIO_WA_FROM) {
      out.configured = true;
      out.whatsapp = await twilio(process.env.TWILIO_WA_FROM, "whatsapp:" + to.phone);
    }

    return res.status(200).json({ ok: true, ...out });
  } catch (e) {
    return res.status(200).json({ ok: false, ...out, error: String((e && e.message) || e).slice(0, 300) });
  }
}
