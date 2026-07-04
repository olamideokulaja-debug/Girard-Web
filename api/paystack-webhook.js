// Paystack webhook — confirms payments server-side, even if the buyer's tab closes.
//
// Paystack calls this URL after a payment. We verify it is really from Paystack
// (signature check with your secret key), then record the payment in Supabase and,
// for an agent registration, mark that agent activated.
//
// Setup:
//   1. Deploy this file at api/paystack-webhook.js.
//   2. In Vercel set PAYSTACK_SECRET_KEY (sk_...), and VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.
//   3. In Paystack -> Settings -> API Keys & Webhooks, set the Webhook URL to:
//        https://YOUR-DOMAIN/api/paystack-webhook
//
// Needs the raw request body for the signature, so body parsing is turned off.

import crypto from "crypto";

export const config = { api: { bodyParser: false } };

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) { res.status(200).json({ ok: false, reason: "not configured" }); return; }

  let raw = "";
  try { raw = await readRaw(req); } catch (e) { res.status(400).json({ ok: false }); return; }

  const signature = req.headers["x-paystack-signature"];
  const expected = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (signature !== expected) { res.status(401).json({ ok: false, reason: "bad signature" }); return; }

  let body = {};
  try { body = JSON.parse(raw); } catch (e) { res.status(400).json({ ok: false }); return; }

  // Acknowledge fast; Paystack only needs a 200.
  res.status(200).json({ ok: true });

  try {
    if (body.event === "charge.success") {
      const data = body.data || {};
      const meta = data.metadata || {};
      const purpose = meta.purpose || "payment";
      const target = meta.target || (data.customer && data.customer.email) || "";
      const amount = Math.round((data.amount || 0) / 100);
      const reference = data.reference;

      const url = process.env.VITE_SUPABASE_URL;
      const key = process.env.VITE_SUPABASE_ANON_KEY;
      if (url && key && reference) {
        const H = { "Content-Type": "application/json", apikey: key, Authorization: "Bearer " + key, Prefer: "resolution=merge-duplicates" };
        await fetch(url + "/rest/v1/payments", {
          method: "POST", headers: H,
          body: JSON.stringify({ reference, purpose, target, amount, status: "success", paid_at: new Date().toISOString() })
        });
        if (purpose === "agent" && target) {
          await fetch(url + "/rest/v1/agents", {
            method: "POST", headers: H,
            body: JSON.stringify({ email: target, paid: true, activated_at: new Date().toISOString() })
          });
        }
      }
    }
  } catch (e) {
    // Already responded 200; log only.
    console.error("webhook processing error", e);
  }
}
