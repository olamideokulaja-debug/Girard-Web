// Paystack Transfers — outbound payouts (agent withdrawals, escrow release).
//
// POST { amount, account_number, bank_code, name, reason }
//   -> creates a transfer recipient, then initiates a transfer.
//
// Requires PAYSTACK_SECRET_KEY in Vercel (starts with sk_). Without it, the
// endpoint returns { configured:false } and the app records the payout instead.
//
// Note: live Paystack transfers may require you to enable Transfers and
// complete OTP/approval settings in your Paystack dashboard.

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const KEY = process.env.PAYSTACK_SECRET_KEY;
  const { amount, account_number, bank_code, name, reason } = req.body || {};
  if (!KEY) { res.status(200).json({ configured: false }); return; }
  const kobo = Math.round((Number(amount) || 0) * 100);
  if (!account_number || !bank_code || !(kobo > 0)) { res.status(200).json({ configured: true, ok: false, error: "Missing account_number, bank_code or amount" }); return; }
  const hdr = { Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
  try {
    const rr = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST", headers: hdr,
      body: JSON.stringify({ type: "nuban", name: name || "Girard payee", account_number, bank_code, currency: "NGN" })
    });
    const rd = await rr.json();
    if (!rd.status) { res.status(200).json({ configured: true, ok: false, error: rd.message || "Recipient failed" }); return; }
    const recipient = rd.data.recipient_code;
    const tr = await fetch("https://api.paystack.co/transfer", {
      method: "POST", headers: hdr,
      body: JSON.stringify({ source: "balance", amount: kobo, recipient, reason: reason || "Girard payout" })
    });
    const td = await tr.json();
    res.status(200).json({ configured: true, ok: !!td.status, status: td.data && td.data.status, reference: td.data && td.data.transfer_code, error: td.message });
  } catch (e) {
    res.status(200).json({ configured: true, ok: false, error: String(e) });
  }
}
