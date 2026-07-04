// Sends a WhatsApp message via Twilio's WhatsApp API when the keys are set in
// Vercel. Without them it returns { sent: false } and the app falls back to the
// click-to-chat wa.me links, which work with no setup.
//
// Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
//      (e.g. "whatsapp:+14155238886")

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(200).json({ ok: true, sent: false, note: "POST { to, message } to send." }); return; }
  const SID = process.env.TWILIO_ACCOUNT_SID;
  const TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM = process.env.TWILIO_WHATSAPP_FROM;
  if (!(SID && TOKEN && FROM)) { res.status(200).json({ ok: true, configured: false, sent: false }); return; }
  try {
    const { to, message } = req.body || {};
    const num = String(to || "").replace(/[^0-9]/g, "");
    const body = new URLSearchParams({ To: "whatsapp:+" + num, From: FROM, Body: message || "" });
    const auth = Buffer.from(SID + ":" + TOKEN).toString("base64");
    const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + SID + "/Messages.json", {
      method: "POST",
      headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    res.status(200).json({ ok: true, configured: true, sent: r.ok });
  } catch (e) {
    res.status(500).json({ ok: false, sent: false, error: "send failed" });
  }
}
