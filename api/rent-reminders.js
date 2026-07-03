// Sends a rent reminder by email (Resend) and SMS (Twilio) when those keys
// are set in Vercel. Without keys it returns { configured: false } and the app
// simply logs the reminder. A daily cron (vercel.json) can also hit this.

export default async function handler(req, res) {
  const RESEND = process.env.RESEND_API_KEY;
  const TW_SID = process.env.TWILIO_ACCOUNT_SID;
  const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TW_FROM = process.env.TWILIO_FROM;
  const configured = !!(RESEND || (TW_SID && TW_TOKEN && TW_FROM));

  if (req.method !== "POST") {
    // Cron / health check
    res.status(200).json({ ok: true, configured, note: configured ? "Reminder channel ready." : "No email/SMS keys set; reminders are logged in-app." });
    return;
  }

  const { to, phone, message } = req.body || {};
  const text = message || "This is a reminder that your rent is due in three months. — Girard Property Estate Limited";
  const results = { email: false, sms: false };
  try {
    if (to && RESEND) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": "Bearer " + RESEND, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "Girard Property <reminders@girardproperty.com>", to: [to], subject: "Rent reminder — Girard Property Estate Limited", text })
      });
      results.email = r.ok;
    }
    if (phone && TW_SID && TW_TOKEN && TW_FROM) {
      const body = new URLSearchParams({ To: phone, From: TW_FROM, Body: text });
      const auth = Buffer.from(TW_SID + ":" + TW_TOKEN).toString("base64");
      const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + TW_SID + "/Messages.json", {
        method: "POST",
        headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      results.sms = r.ok;
    }
    res.status(200).json({ ok: true, configured, results });
  } catch (e) {
    res.status(500).json({ ok: false, configured, error: "send failed" });
  }
}
