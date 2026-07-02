// Serverless Stripe Checkout. Works only if STRIPE_SECRET_KEY is set in Vercel.
// Without it the endpoint returns { configured: false } and the app shows a
// clear message, so the pricing page always works.

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { res.status(200).json({ configured: false }); return; }
  try {
    const { name, amount, currency } = req.body || {};
    const origin = req.headers.origin || ("https://" + (req.headers.host || ""));
    const form = new URLSearchParams();
    form.append("mode", "subscription");
    form.append("success_url", origin + "/?checkout=success");
    form.append("cancel_url", origin + "/?checkout=cancel");
    form.append("line_items[0][quantity]", "1");
    form.append("line_items[0][price_data][currency]", currency || "usd");
    form.append("line_items[0][price_data][product_data][name]", "Girard " + (name || "Subscription"));
    form.append("line_items[0][price_data][recurring][interval]", "month");
    form.append("line_items[0][price_data][unit_amount]", String(amount || 0));

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });
    const data = await r.json();
    if (data && data.url) { res.status(200).json({ configured: true, url: data.url }); return; }
    res.status(200).json({ configured: true, error: (data && data.error && data.error.message) || "Could not create session" });
  } catch (e) {
    res.status(500).json({ configured: true, error: "checkout failed" });
  }
}
