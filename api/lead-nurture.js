// Daily follow-up for landlord and waiting-list leads that are still New.
// Runs from the Vercel cron at 08:00 UTC (09:00 Lagos). Three short emails at
// 1, 3 and 7 days after the enquiry, each recorded in lead_followups so it is
// never sent twice, and stopped the moment staff change the status or the
// person opts out. The opt-out link is a signed GET back to this route.
//
// Honest by construction: the emails say what Girard has and has not done,
// and none of them claims a property exists when it does not.
import { createHmac, timingSafeEqual } from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = "https://www.girardpropertylimited.com";
const FROM = process.env.MAIL_FROM || "Girard <no-reply@girardpropertylimited.com>";
const STEPS = [[1, 1], [2, 3], [3, 7]];   // [step, days after enquiry]

function sign(id) {
  const key = process.env.NURTURE_SECRET || SERVICE || "girard";
  return createHmac("sha256", key).update(String(id)).digest("hex").slice(0, 32);
}
function safeEq(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && timingSafeEqual(A, B);
}
const H = () => ({ apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" });

function copy(kind, step, name, id) {
  const first = String(name || "").trim().split(/\s+/)[0] || "there";
  const stop = SITE + "/api/lead-nurture?stop=" + encodeURIComponent(id) + "&t=" + sign(id);
  const foot = "\n\nGirard Property Limited\n21 Fatai Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos\nWhatsApp +234 704 817 3866\n\nIf you would rather not hear from us again about this: " + stop;
  if (kind === "Wanted") {
    return [
      null,
      ["You are on the Girard waiting list",
        "Hello " + first + ",\n\nYou are on the list. When a property matching what you told us is verified, you hear before it is published anywhere else.\n\nA word on why the list is short. Girard publishes only what it has checked: title, ownership and condition. That takes longer than copying a listing from WhatsApp, and it is the reason a Girard listing is real when you go to see it.\n\nIf your requirements change, reply to this email or WhatsApp us on +234 704 817 3866." + foot],
      ["What happens when a match is found",
        "Hello " + first + ",\n\nA short note on what to expect, so nothing is a surprise.\n\nWhen a verified property matches your area, budget and move date, you get an email and, if you gave a number, a WhatsApp message with the details and a viewing slot. If you want it, you apply on the platform, the agreement is signed with a recorded signature, and rent is paid through a licensed processor rather than into someone's personal account. The 5% fee comes out of the rent; nothing is added on top for you.\n\nNo match yet is the honest state today. We will not send you something that does not fit to look busy." + foot],
      ["Still looking?",
        "Hello " + first + ",\n\nA week on, we are still matching. If you have found somewhere in the meantime, reply with a word and we take you off the list. If you are still looking, you need do nothing: the list keeps working.\n\nOne thing that helps: if your budget or area has moved, tell us. A range that is slightly wider often turns a long wait into a viewing." + foot]
    ][step];
  }
  return [
    null,
    ["Your valuation request with Girard",
      "Hello " + first + ",\n\nThank you for telling us about the property. A person, not a bot, is looking at it and will come back with a rent range and a view on the right let type, usually within 2 working days of your request.\n\nWhat we will ask for before anything is published: proof of title, proof of who you are, and a look at the property's condition. That is the whole reason a Girard listing is trusted, and it is why the process is not instant.\n\nIf you would rather talk it through first, WhatsApp us on +234 704 817 3866." + foot],
    ["How a Girard landlord is paid",
      "Hello " + first + ",\n\nSince the money is usually the first question, here is how it works.\n\nRent is collected through a licensed payment processor and paid to your bank account directly. Girard's 5% management fee comes out of that rent as it is collected. There is no listing fee, no fee until rent is collected, and nothing added on top of the tenant's rent to fund it.\n\nTenants sign the agreement on the platform with a recorded, attributed signature, and every payment, request and repair sits on the record where you can see it.\n\nIf you have a question about any of that, reply here." + foot],
    ["Shall we move forward?",
      "Hello " + first + ",\n\nA week on from your request. If we have not yet spoken, reply to this email or WhatsApp +234 704 817 3866 and we will pick it up the same day.\n\nIf the property has been let elsewhere in the meantime, tell us with a word and we close the file. No hard feelings, and we would still be glad to look at the next one." + foot]
  ][step];
}

export default async function handler(req, res) {
  if (!SERVICE) return res.status(200).json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set" });

  // Opt-out link
  if (req.method === "GET" && req.query && req.query.stop) {
    const id = String(req.query.stop), t = String(req.query.t || "");
    if (!safeEq(t, sign(id))) return res.status(400).send("That link is not valid.");
    try {
      await fetch(SUPABASE_URL + "/rest/v1/lead_followups", { method: "POST", headers: { ...H(), Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify({ enquiry_id: id, step: 99 }) });
    } catch (e) {}
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send("<!doctype html><meta name=viewport content='width=device-width'><body style='font-family:system-ui;padding:40px;color:#1A1A1A'><h2>Done</h2><p>You will not receive further follow-up emails about this enquiry. If you change your mind, WhatsApp +234 704 817 3866.</p></body>");
  }

  // Cron entry. Vercel calls it with GET; a manual POST also works.
  const stats = { checked: 0, sent: 0, skipped: 0, errors: [] };
  try {
    const since = new Date(Date.now() - 10 * 86400000).toISOString();
    const rows = await (await fetch(SUPABASE_URL + "/rest/v1/enquiries?select=id,type,name,email,status,created_at&status=eq.New&type=in.(Landlord,Wanted)&created_at=gte." + since + "&order=created_at.asc", { headers: H() })).json();
    const leads = (Array.isArray(rows) ? rows : []).filter(r => r.email && /@/.test(r.email));
    stats.checked = leads.length;
    if (!leads.length) return res.status(200).json({ ok: true, ...stats });
    const ids = leads.map(l => '"' + l.id + '"').join(",");
    const doneRows = await (await fetch(SUPABASE_URL + "/rest/v1/lead_followups?select=enquiry_id,step&enquiry_id=in.(" + ids + ")", { headers: H() })).json();
    const done = {};
    (Array.isArray(doneRows) ? doneRows : []).forEach(d => { (done[d.enquiry_id] = done[d.enquiry_id] || new Set()).add(d.step); });

    for (const l of leads) {
      const had = done[l.id] || new Set();
      if (had.has(99)) { stats.skipped++; continue; }
      const ageDays = (Date.now() - new Date(l.created_at).getTime()) / 86400000;
      // Send only the single highest step that is due and not yet sent, so a
      // lead created before this cron existed gets one email, not three.
      let due = null;
      for (const [step, days] of STEPS) if (ageDays >= days && !had.has(step)) due = step;
      if (due == null) { stats.skipped++; continue; }
      const [subject, text] = copy(l.type, due, l.name, l.id);
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ from: FROM, to: [l.email], reply_to: "info@girardpropertylimited.com", subject, text })
        });
        if (!r.ok) { stats.errors.push(l.id + ": Resend " + r.status); continue; }
        // Record every lower step as well, so the sequence never back-fills.
        const marks = STEPS.filter(([s]) => s <= due && !had.has(s)).map(([s]) => ({ enquiry_id: l.id, step: s }));
        await fetch(SUPABASE_URL + "/rest/v1/lead_followups", { method: "POST", headers: { ...H(), Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify(marks) });
        stats.sent++;
      } catch (e) { stats.errors.push(l.id + ": " + String((e && e.message) || e).slice(0, 120)); }
    }
    return res.status(200).json({ ok: true, ...stats });
  } catch (e) {
    return res.status(200).json({ ok: false, ...stats, error: String((e && e.message) || e).slice(0, 200) });
  }
}
