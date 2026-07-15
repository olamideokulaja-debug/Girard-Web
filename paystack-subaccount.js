// Paystack Subaccounts — used for Split Payments.
//
// Girard's model: rent is paid by the tenant, settles DIRECTLY to the landlord's
// (or agent's) own bank account, while Girard's 5% administrative fee is routed
// to the Girard payout account in the same transaction.
//
// Paystack does this with a "subaccount". When a subaccount is created with
// percentage_charge: 5, then on any transaction that names that subaccount,
// 5% goes to the MAIN account (Girard) and 95% goes to the SUBACCOUNT (landlord).
//
// POST { business_name, settlement_bank, account_number, percentage_charge?, email? }
//   -> { configured: true, ok: true, subaccount_code: "ACCT_xxx", account_name: "..." }
//
// Requires PAYSTACK_SECRET_KEY in Vercel (sk_live_... once you are live).
// Without it the endpoint returns { configured: false } and the app carries on
// recording the bank details only, so nothing breaks.

const FEE_PERCENT = 5;

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!KEY) { res.status(200).json({ configured: false }); return; }

  const { business_name, settlement_bank, account_number, percentage_charge, email } = req.body || {};
  if (!business_name || !settlement_bank || !account_number) {
    res.status(200).json({ configured: true, ok: false, error: "Missing business_name, settlement_bank or account_number" });
    return;
  }

  const hdr = { Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
  // Paystack limits LIVE bank resolves to 3/day while you are on test keys. The resolve is a
  // safety net for real money, so run it in live mode only and skip it in test mode.
  const isTest = String(KEY).startsWith("sk_test");

  try {
    let resolvedName = business_name;
    if (!isTest) {
      // Resolve the account first so we never create a subaccount against a wrong number.
      const vr = await fetch("https://api.paystack.co/bank/resolve?account_number=" + encodeURIComponent(account_number) + "&bank_code=" + encodeURIComponent(settlement_bank), { headers: hdr });
      const vd = await vr.json();
      if (!vd || !vd.status) {
        res.status(200).json({ configured: true, ok: false, error: (vd && vd.message) || "Could not resolve that account number with the selected bank" });
        return;
      }
      resolvedName = (vd.data && vd.data.account_name) || business_name;
    }

    const cr = await fetch("https://api.paystack.co/subaccount", {
      method: "POST", headers: hdr,
      body: JSON.stringify({
        business_name: resolvedName,
        settlement_bank,
        account_number,
        // 5% of every split transaction goes to the Girard main account.
        percentage_charge: Number(percentage_charge) > 0 ? Number(percentage_charge) : FEE_PERCENT,
        description: "Girard Property landlord/agent settlement account",
        primary_contact_email: email || undefined
      })
    });
    const cd = await cr.json();
    if (!cd || !cd.status) {
      let msg = (cd && cd.message) || "Paystack could not create the subaccount";
      if (isTest && /resolve|limit|exceeded/i.test(msg)) msg += " \u2014 in test mode use Paystack's test account: Zenith Bank, account number 0000000000.";
      res.status(200).json({ configured: true, ok: false, error: msg });
      return;
    }
    const subaccount_code = cd.data && cd.data.subaccount_code;

    // Create a split group for THIS vendor only: 95% to them, the 5% remainder
    // settles to the Girard main account. One group per vendor is deliberate —
    // a single group holding every vendor would split each rent payment across
    // all of them, instead of paying the one landlord who is owed it.
    let split_code = null;
    try {
      const share = 100 - (Number(percentage_charge) > 0 ? Number(percentage_charge) : FEE_PERCENT);
      const sr = await fetch("https://api.paystack.co/split", {
        method: "POST", headers: hdr,
        body: JSON.stringify({
          name: "Girard " + String(resolvedName).slice(0, 40) + " " + Date.now().toString().slice(-6),
          type: "percentage",
          currency: "NGN",
          subaccounts: [{ subaccount: subaccount_code, share }],
          bearer_type: "subaccount",
          bearer_subaccount: subaccount_code
        })
      });
      const sd = await sr.json();
      if (sd && sd.status && sd.data) split_code = sd.data.split_code;
    } catch (e) { /* subaccount alone is enough to split; split_code is a bonus */ }

    res.status(200).json({
      configured: true, ok: true, test_mode: isTest,
      subaccount_code,
      split_code,
      account_name: resolvedName
    });
  } catch (e) {
    res.status(200).json({ configured: true, ok: false, error: "Network error reaching Paystack" });
  }
}
