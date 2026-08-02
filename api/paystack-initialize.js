// Vercel serverless function: start a Paystack transaction (rent payment).
// Uses your SECRET key (server-side only). The app calls this to get a secure
// checkout link. The landlord split rides along via subaccount / split_code.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!SECRET) return res.status(500).json({ error: "Paystack not configured (PAYSTACK_SECRET_KEY missing)" });
  try {
    const { email, amount, subaccount, split_code, reference, metadata } = req.body || {};
    if (!email || !amount) return res.status(400).json({ error: "email and amount (in kobo) are required" });
    const body = {
      email,
      amount: Math.round(Number(amount)),          // kobo
      currency: "NGN",
      reference: reference || ("GIRARD-rent-" + Date.now()),
      ...(split_code ? { split_code } : subaccount ? { subaccount, bearer: "subaccount" } : {}),
      metadata: metadata || {},
    };
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: "Bearer " + SECRET, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!data || !data.status) return res.status(400).json({ error: (data && data.message) || "Initialize failed" });
    return res.status(200).json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
