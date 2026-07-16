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

  const { business_name, settlement_bank, account_number, percentage_charge, email, bvn } = req.body || {};
  if (!business_name || !settlement_bank || !account_number) {
    res.status(200).json({ configured: true, ok: false, error: "Missing business_name, settlement_bank or account_number" });
    return;
  }

  const hdr = { Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
  // Paystack limits LIVE bank resolves to 3/day while you are on test keys. The resolve is a
  // safety net for real money, so run it in live mode only and skip it in test mode.
  const isTest = String(KEY).startsWith("sk_test");

  try {
    // The account must actually belong to the person who gave us the BVN.
    // Without this, a fraudster can list someone else's property and point the
    // rent at their own account. Live keys only: Paystack cannot match in test.
    //
    // Three outcomes, and the difference matters:
    //   matched     -> verified, rent can flow
    //   mismatch    -> refused outright. This is the fraud control.
    //   unavailable -> Paystack could not answer (no balance, outage, not
    //                  enabled). NOT the landlord's fault, so we create the
    //                  account unverified and send it to Girard for review,
    //                  rather than freezing an honest person's income.
    let bvnMatched = false;
    let checkNote = "";
    if (!isTest) {
      if (!bvn || String(bvn).replace(/[^0-9]/g, "").length !== 11) {
        res.status(200).json({ configured: true, ok: false, error: "A valid 11-digit BVN is required to receive rent through Girard." });
        return;
      }
      try {
        const mr = await fetch("https://api.paystack.co/bank/match_bvn?account_number=" + encodeURIComponent(account_number) + "&bank_code=" + encodeURIComponent(settlement_bank) + "&bvn=" + encodeURIComponent(String(bvn).replace(/[^0-9]/g, "")), { headers: hdr });
        const md = await mr.json();
        const msg = (md && md.message) || "";
        const truthy = (v) => v === true || v === "true";
        const explicitlyFalse = (v) => v === false || v === "false";

        if (md && md.status === true) {
          const d = md.data || {};
          if (truthy(d.is_blacklisted)) {
            res.status(200).json({ configured: true, ok: false, bvn_mismatch: true, check: "mismatch", error: "This BVN is blacklisted and cannot be used to receive rent through Girard." });
            return;
          }
          if (explicitlyFalse(d.account_number)) {
            res.status(200).json({ configured: true, ok: false, bvn_mismatch: true, check: "mismatch", error: "Paystack says this bank account is not linked to that BVN, so Girard cannot pay rent into it. Paystack's exact words: \u201c" + msg + "\u201d" });
            return;
          }
          bvnMatched = true;
        } else if (/does not match|mismatch|invalid bvn|bvn is invalid/i.test(msg)) {
          // A real verdict from Paystack. Refuse.
          res.status(200).json({
            configured: true, ok: false, bvn_mismatch: true, check: "mismatch",
            error: "Paystack says this bank account is not linked to that BVN, so Girard cannot pay rent into it. Check the account number is the one tied to this BVN. If your bank holds an old BVN against this account, contact your bank. Paystack's exact words: \u201c" + msg + "\u201d"
          });
          return;
        } else {
          // Balance, outage, throttling, not enabled, anything unrecognised:
          // Paystack could not answer. Flag it, do not blame the landlord.
          checkNote = msg || "no response";
        }
      } catch (e) {
        checkNote = "Could not reach Paystack";
      }
    }

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
      bvn_verified: !isTest && bvnMatched,
      check: isTest ? "skipped" : (bvnMatched ? "matched" : "unavailable"),
      check_message: checkNote || null,
      subaccount_code,
      split_code,
      account_name: resolvedName
    });
  } catch (e) {
    res.status(200).json({ configured: true, ok: false, error: "Network error reaching Paystack" });
  }
}
