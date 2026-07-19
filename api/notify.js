// Girard notifications sender: email (Resend), SMS + WhatsApp (Twilio).
// POST { channels:["email","sms","whatsapp"], to:{email,phone}, subject, message }
// Sends on whichever channels have keys configured; records otherwise.
export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  const { channels = [], to = {}, subject, message } = req.body || {};
  const out = { email: null, sms: null, whatsapp: null, configured: false };
  try {
    if (channels.includes("email") && process.env.RESEND_API_KEY && to.email) {
      out.configured = true;
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.MAIL_FROM || "Girard <notifications@girardpropertylimited.com>", to: [to.email], subject: subject || "Girard", text: message || "" }) });
      out.email = r.ok;
    }
    const sid = process.env.TWILIO_ACCOUNT_SID, tok = process.env.TWILIO_AUTH_TOKEN;
    async function twilio(from, dest) {
      const body = new URLSearchParams({ From: from, To: dest, Body: message || "" });
      const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(sid + ":" + tok).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body });
      return r.ok;
    }
    if (channels.includes("sms") && sid && tok && process.env.TWILIO_FROM && to.phone) { out.configured = true; out.sms = await twilio(process.env.TWILIO_FROM, to.phone); }
    if (channels.includes("whatsapp") && sid && tok && process.env.TWILIO_WHATSAPP_FROM && to.phone) { out.configured = true; out.whatsapp = await twilio(process.env.TWILIO_WHATSAPP_FROM, "whatsapp:" + to.phone); }
    res.status(200).json({ ok: true, ...out });
  } catch (e) { res.status(200).json({ ok: false, error: String(e), ...out }); }
}
