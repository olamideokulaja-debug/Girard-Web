// Rent reminders — sends automatically by email (Resend) and WhatsApp (Twilio), with optional SMS.
//
// GET  (the daily Vercel cron): scans tenancies and sends a reminder to every
//       tenant whose rent falls due in exactly 3 months, with no manual action.
// POST (the "Send now" button in the app): sends a single reminder immediately.
//
// Live sending requires keys in Vercel: RESEND_API_KEY (email) and
// TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM (WhatsApp).
// TWILIO_FROM (SMS) is optional. Without any keys the endpoint reports who
// would be reminded but sends nothing.
//
// In production the tenancy list below is replaced by a read from your database.

const TENANTS = [
  { name: "Ada Eze", email: "ada@example.com", phone: "+2348030000001", property: "3-Bed Flat, Lekki", rent: "₦7,200,000", dueMonth: 9, dueDay: 3 },
  { name: "Tunde Adeyemi", email: "tunde@example.com", phone: "+2348030000002", property: "2-Bed Apartment, Yaba", rent: "₦3,600,000", dueMonth: 8, dueDay: 15 },
  { name: "Chidera Okonkwo", email: "chidera@example.com", phone: "+2348030000003", property: "4-Bed Duplex, Ikoyi", rent: "₦15,000,000", dueMonth: 12, dueDay: 1 },
  { name: "Ngozi Balogun", email: "ngozi@example.com", phone: "+2348030000004", property: "Studio, Surulere", rent: "₦1,800,000", dueMonth: 10, dueDay: 20 },
  { name: "Emeka Nwosu", email: "emeka@example.com", phone: "+2348030000005", property: "3-Bed, Magodo", rent: "₦5,400,000", dueMonth: 2, dueDay: 10 },
  { name: "Fatima Bello", email: "fatima@example.com", phone: "+2348030000006", property: "2-Bed, Ikeja", rent: "₦4,200,000", dueMonth: 11, dueDay: 5 },
  { name: "Kunle Ojo", email: "kunle@example.com", phone: "+2348030000007", property: "5-Bed, Victoria Island", rent: "₦22,000,000", dueMonth: 4, dueDay: 12 },
  { name: "Zainab Musa", email: "zainab@example.com", phone: "+2348030000008", property: "1-Bed, Lekki", rent: "₦2,600,000", dueMonth: 5, dueDay: 25 }
];

function nextDue(month, day) {
  const now = new Date();
  let d = new Date(Date.UTC(now.getUTCFullYear(), month - 1, day));
  if (d < now) d = new Date(Date.UTC(now.getUTCFullYear() + 1, month - 1, day));
  return d;
}
function daysUntil(d) { return Math.round((d - new Date()) / 86400000); }
function fmt(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function message(t, due) {
  const first = t.name.split(" ")[0];
  return "Dear " + first + ", this is a reminder from Girard Property Estate Limited that the rent for " + t.property + " (" + t.rent + ") is due on " + fmt(due) + ". As this falls due in three months, we kindly ask that you begin making arrangements. For any questions, contact us on +234 906 000 1234. — Girard Property Estate Limited";
}

async function sendEmail(RESEND, to, text) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + RESEND, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "Girard Property <reminders@girardpropertylimited.com>", to: [to], subject: "Rent reminder — Girard Property", text })
  });
  return r.ok;
}
async function sendSms(sid, token, from, to, text) {
  const auth = Buffer.from(sid + ":" + token).toString("base64");
  const body = new URLSearchParams({ To: to, From: from, Body: text });
  const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json", {
    method: "POST",
    headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  return r.ok;
}
async function sendWhatsApp(sid, token, from, to, text) {
  const auth = Buffer.from(sid + ":" + token).toString("base64");
  const toWa = String(to).startsWith("whatsapp:") ? to : "whatsapp:" + to;
  const body = new URLSearchParams({ To: toWa, From: from, Body: text });
  const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json", {
    method: "POST",
    headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  return r.ok;
}

export default async function handler(req, res) {
  const RESEND = process.env.RESEND_API_KEY;
  const TW_SID = process.env.TWILIO_ACCOUNT_SID;
  const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TW_FROM = process.env.TWILIO_FROM;
  const TW_WA = process.env.TWILIO_WHATSAPP_FROM;
  const emailReady = !!RESEND;
  const waReady = !!(TW_SID && TW_TOKEN && TW_WA);
  const smsReady = !!(TW_SID && TW_TOKEN && TW_FROM);
  const configured = emailReady || waReady || smsReady;

  try {
    // Manual single send from the app
    if (req.method === "POST") {
      const { to, phone, message: msg } = req.body || {};
      const text = msg || "Your rent is due in three months. — Girard Property Estate Limited";
      const results = { email: false, whatsapp: false, sms: false };
      if (to && emailReady) results.email = await sendEmail(RESEND, to, text);
      if (phone && waReady) results.whatsapp = await sendWhatsApp(TW_SID, TW_TOKEN, TW_WA, phone, text);
      if (phone && smsReady) results.sms = await sendSms(TW_SID, TW_TOKEN, TW_FROM, phone, text);
      res.status(200).json({ ok: true, configured, results });
      return;
    }

    // Daily cron: auto-send to anyone due in exactly 3 months (about 90 days)
    const dueSoon = TENANTS.map(t => ({ t, due: nextDue(t.dueMonth, t.dueDay) }))
      .map(x => ({ ...x, days: daysUntil(x.due) }))
      .filter(x => x.days >= 89 && x.days <= 91);

    const sent = [];
    for (const { t, due } of dueSoon) {
      const text = message(t, due);
      const r = { name: t.name, email: false, whatsapp: false, sms: false };
      if (emailReady) r.email = await sendEmail(RESEND, t.email, text);
      if (waReady) r.whatsapp = await sendWhatsApp(TW_SID, TW_TOKEN, TW_WA, t.phone, text);
      if (smsReady) r.sms = await sendSms(TW_SID, TW_TOKEN, TW_FROM, t.phone, text);
      sent.push(r);
    }
    res.status(200).json({
      ok: true,
      configured,
      channels: { email: emailReady, whatsapp: waReady, sms: smsReady },
      dueInThreeMonths: dueSoon.map(x => x.t.name),
      sent,
      note: configured ? "Reminders sent automatically to tenants due in 3 months." : "No message keys set; add RESEND_API_KEY (email) and/or TWILIO_WHATSAPP_FROM (WhatsApp) in Vercel to send automatically."
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: "reminder run failed" });
  }
}
