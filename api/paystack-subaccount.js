// Paystack Subaccounts (split payments) + payout-account verification.
//
// Girard's model: rent is paid by the tenant, settles DIRECTLY to the landlord's
// (or agent's) own bank account, while Girard's 5% administrative fee is routed to
// the Girard payout account in the same transaction, via a Paystack subaccount.
//
// WHY THIS FILE CHANGED
// Paystack sunset its /bank/match_bvn endpoint, which we used to confirm that a
// payout account actually belongs to the person whose BVN we hold. We now rebuild
// that same control from two pieces we own, independent of Paystack:
//   1. Paystack /bank/resolve   -> the name the bank holds ON THE ACCOUNT
//   2. Dojah   /api/v1/kyc/bvn  -> whether that name matches the BVN record
// If the account's OWN registered name matches the BVN, the account belongs to the
// BVN holder. A fraudster cannot fake this: it is the bank's registered name that is
// matched, not a name they typed. The BVN is used only for the match and never stored.
//
// POST { business_name, settlement_bank, account_number, percentage_charge?, email?, bvn }
//   -> { configured, ok, bvn_verified, check, check_message, subaccount_code, split_code, account_name }
//   (identical response shape to before, so the app needs no client changes here.)
//
// ENV (Vercel):
//   PAYSTACK_SECRET_KEY   sk_live_... (or sk_test_... - test mode skips all checks)
//   DOJAH_APP_ID          Dojah app id       (dashboard -> Developers -> Configuration)
//   DOJAH_SECRET_KEY      Dojah private key   (sent as-is, NOT as "Bearer ...")
//   DOJAH_BASE_URL        optional; https://api.dojah.io (default) | https://sandbox.dojah.io
// No Paystack key  -> { configured:false }, app just records bank details, nothing breaks.
// No Dojah keys    -> check is "unavailable": the account is created but sent to the
//                     manual Payout review queue, NEVER auto-verified. Safe by default.
//
// To switch provider (e.g. QoreID) later, replace bvnNameMatch() only; nothing else
// in this file depends on Dojah.

const FEE_PERCENT = 5;
const DOJAH_BASE = process.env.DOJAH_BASE_URL || "https://api.dojah.io";

// Split a bank-registered account name into usable name tokens.
//
// WHY THIS IS NOT "first word + last word":
// Nigerian bank names commonly run SURNAME FIRSTNAME MIDDLENAME, e.g.
// "OKULAJA OLAMIDE ADEKUNLE", where the BVN's registered FIRST name is the MIDDLE
// token. Comparing only the outer two tokens never tests it, and an honest landlord
// is hard-blocked as fraud. So we consider EVERY token, in every position.
// Titles and joint-account conjunctions are stripped; anything non-alphabetic goes.
const NAME_NOISE = ["MR", "MRS", "MS", "MISS", "DR", "PROF", "ENGR", "CHIEF", "ALHAJI", "ALHAJA", "PASTOR", "REV", "BARR", "AND"];
function nameTokens(fullName) {
  const seen = [];
  String(fullName || "").toUpperCase().split(/[^A-Z]+/).forEach(function (t) {
    if (t.length < 2) return;                       // drops initials and stray letters
    if (NAME_NOISE.indexOf(t) !== -1) return;
    if (seen.indexOf(t) === -1) seen.push(t);
  });
  return seen.slice(0, 4);                          // caps cost on very long names
}

// Pair the tokens in a ring: (t0,t1), (t1,t2), ... (tn,t0).
// Dojah answers first_name and last_name INDEPENDENTLY in one response, so a ring of
// n calls tests every token in BOTH positions - n calls instead of the n*(n-1) that
// checking every combination separately would cost.
function ringPairs(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    out.push({ first_name: tokens[i], last_name: tokens[(i + 1) % tokens.length] });
  }
  return out;
}

// Ask Dojah whether the name registered on the bank account matches the BVN.
// Returns "matched" | "mismatch" | "unavailable" plus a short note.
async function bvnNameMatch({ bvn, fullName }) {
  const appId = process.env.DOJAH_APP_ID;
  const secret = process.env.DOJAH_SECRET_KEY;
  if (!appId || !secret) return { result: "unavailable", note: "Identity check not configured" };

  const tokens = nameTokens(fullName);
  if (tokens.length < 2) return { result: "unavailable", note: "Account name too short to match" };

  const hdr = { AppId: appId, Authorization: secret };  // Dojah: raw key, not Bearer
  let sawValidBvn = false;
  let lastNote = "";
  const isFirst = {};   // token -> Dojah confirmed it as the BVN's first name
  const isLast = {};    // token -> Dojah confirmed it as the BVN's last name

  for (const o of ringPairs(tokens)) {
    try {
      const url = DOJAH_BASE + "/api/v1/kyc/bvn?bvn=" + encodeURIComponent(bvn)
        + "&first_name=" + encodeURIComponent(o.first_name)
        + "&last_name=" + encodeURIComponent(o.last_name);
      const r = await fetch(url, { headers: hdr });
      const d = await r.json();
      if (d && d.error) { lastNote = String(d.error); continue; }
      const e = (d && d.entity) || {};
      const bvnValid = !!(e.bvn && e.bvn.status);
      const firstOk = !!(e.first_name && e.first_name.status);
      const lastOk = !!(e.last_name && e.last_name.status);
      if (!bvnValid) continue;
      sawValidBvn = true;
      // Both halves confirmed in one answer: done, no further calls needed.
      if (firstOk && lastOk) return { result: "matched", note: "" };
      if (firstOk) isFirst[o.first_name] = true;
      if (lastOk) isLast[o.last_name] = true;
    } catch (err) {
      lastNote = "Could not reach identity service";
    }
  }

  // Confirmations can land in DIFFERENT calls: for "OKULAJA OLAMIDE ADEKUNLE" the BVN's
  // first name (OLAMIDE) and last name (OKULAJA) are confirmed one call apart. Two
  // different tokens holding the two positions is a match.
  for (const a of tokens) {
    if (!isFirst[a]) continue;
    for (const b of tokens) {
      if (a !== b && isLast[b]) return { result: "matched", note: "" };
    }
  }

  // The BVN is real, but the account's registered holder is not the BVN holder.
  // That is the fraud signal: refuse.
  if (sawValidBvn) return { result: "mismatch", note: "Account name does not match the BVN" };
  // We never got a clean answer (bad BVN, outage, throttling). Not the landlord's
  // fault: create the account unverified and route it to a human, do not freeze them.
  return { result: "unavailable", note: lastNote || "Identity check unavailable" };
}

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
  // Paystack limits LIVE resolves while on test keys; the whole check is a live-money
  // safety net, so run it in live mode only and skip it in test mode.
  const isTest = String(KEY).startsWith("sk_test");

  try {
    let resolvedName = business_name;
    let bvnMatched = false;
    let checkNote = "";

    if (!isTest) {
      // 1. Resolve the account number -> the name the bank holds on it. Do this first,
      //    so we never create a subaccount against a wrong number, and so we have the
      //    real registered name to match against the BVN.
      const vr = await fetch("https://api.paystack.co/bank/resolve?account_number=" + encodeURIComponent(account_number) + "&bank_code=" + encodeURIComponent(settlement_bank), { headers: hdr });
      const vd = await vr.json();
      if (!vd || !vd.status) {
        res.status(200).json({ configured: true, ok: false, error: (vd && vd.message) || "Could not resolve that account number with the selected bank" });
        return;
      }
      resolvedName = (vd.data && vd.data.account_name) || business_name;

      // 2. A valid BVN is required to receive rent through Girard.
      const cleanBvn = String(bvn || "").replace(/[^0-9]/g, "");
      if (cleanBvn.length !== 11) {
        res.status(200).json({ configured: true, ok: false, error: "A valid 11-digit BVN is required to receive rent through Girard." });
        return;
      }

      // 3. Does the account's registered name match the BVN?
      //   matched     -> verified, rent can flow
      //   mismatch    -> refused outright (this is the fraud control), no subaccount created
      //   unavailable -> could not check; create unverified and send for manual review
      const m = await bvnNameMatch({ bvn: cleanBvn, fullName: resolvedName });
      if (m.result === "mismatch") {
        res.status(200).json({
          configured: true, ok: false, bvn_mismatch: true, check: "mismatch",
          error: "The name on this bank account (" + resolvedName + ") does not match the BVN provided, so Girard cannot pay rent into it. Check the account number is the one tied to this BVN. If your bank holds an old BVN against this account, contact your bank."
        });
        return;
      }
      if (m.result === "matched") bvnMatched = true;
      else checkNote = m.note;
    }

    // 4. Create the subaccount. percentage_charge: 5 means 5% of every split
    //    transaction settles to the Girard main account, 95% to this vendor.
    const cr = await fetch("https://api.paystack.co/subaccount", {
      method: "POST", headers: hdr,
      body: JSON.stringify({
        business_name: resolvedName,
        settlement_bank,
        account_number,
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

    // 5. One split group per vendor: their share to them, the 5% remainder to Girard's
    //    main account. One group per vendor is deliberate - a shared group would split
    //    each rent payment across every landlord instead of paying the one who is owed.
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
