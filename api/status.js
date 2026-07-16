// Tells the app which notification channels actually have keys, so the
// interface can stop claiming things that may no longer be true.
// Returns booleans only, never the keys themselves.
export default async function handler(req, res) {
  const sid = process.env.TWILIO_ACCOUNT_SID, tok = process.env.TWILIO_AUTH_TOKEN;
  res.status(200).json({
    email: !!process.env.RESEND_API_KEY,
    sms: !!(sid && tok && process.env.TWILIO_FROM),
    whatsapp: !!(sid && tok && process.env.TWILIO_WHATSAPP_FROM),
    paystack: !!process.env.PAYSTACK_SECRET_KEY,
    ai: !!process.env.ANTHROPIC_API_KEY
  });
}
