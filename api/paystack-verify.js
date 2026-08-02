// Vercel serverless function: verify a Paystack transaction by reference.
// The app calls this after the checkout to confirm the payment really succeeded.
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
    return res.status(200).json({
      status: data.data.status,        // "success" when paid
      amount: data.data.amount,        // kobo
      reference: data.data.reference,
      paid_at: data.data.paid_at,
    });
  } catch (e) {
    return res.status(500).json({ status: "error", message: String((e && e.message) || e) });
  }
}
