// Completes an account deletion request from the account_deletions queue.
// Only a signed-in staff member may call it: the caller's Supabase access
// token is verified and their profile checked before anything is touched.
// What is deleted: the auth user, the profile row and device tokens, which
// ends sign-in and removes the person's identity from the platform. What is
// kept: financial records (invoices, payments) and signed agreements, which
// Girard is required to retain and which are held against an email address
// rather than the deleted account. The privacy page says exactly this.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!SERVICE) return res.status(200).json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set on this deployment" });
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ ok: false, error: "Sign in required" });
  const H = { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json" };
  try {
    const me = await (await fetch(SUPABASE_URL + "/auth/v1/user", { headers: { apikey: ANON || SERVICE, Authorization: "Bearer " + token } })).json();
    const callerEmail = String((me && me.email) || "").toLowerCase();
    if (!me || !me.id) return res.status(401).json({ ok: false, error: "Sign in required" });
    const prof = await (await fetch(SUPABASE_URL + "/rest/v1/profiles?id=eq." + me.id + "&select=role", { headers: H })).json();
    const isStaff = (Array.isArray(prof) && prof[0] && prof[0].role === "admin") || callerEmail.endsWith("@girardpropertylimited.com");
    if (!isStaff) return res.status(403).json({ ok: false, error: "Staff only" });

    const { id } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, error: "id required" });
    const rows = await (await fetch(SUPABASE_URL + "/rest/v1/account_deletions?id=eq." + encodeURIComponent(id) + "&select=id,email,completed_at", { headers: H })).json();
    const reqRow = Array.isArray(rows) && rows[0];
    if (!reqRow) return res.status(404).json({ ok: false, error: "Request not found" });
    if (reqRow.completed_at) return res.status(200).json({ ok: true, note: "already completed" });
    const email = String(reqRow.email || "").toLowerCase();
    if (!email) return res.status(400).json({ ok: false, error: "Request has no email" });
    if (email === callerEmail) return res.status(400).json({ ok: false, error: "You cannot process your own deletion from here" });

    const list = await (await fetch(SUPABASE_URL + "/auth/v1/admin/users?page=1&per_page=1000", { headers: H })).json();
    const user = (list && Array.isArray(list.users) ? list.users : []).find(u => String(u.email || "").toLowerCase() === email);
    const out = { ok: true, deletedAuth: false, deletedProfile: false };
    if (user) {
      const d = await fetch(SUPABASE_URL + "/auth/v1/admin/users/" + user.id, { method: "DELETE", headers: H });
      if (!d.ok) return res.status(200).json({ ok: false, error: "Auth delete failed " + d.status });
      out.deletedAuth = true;
      const p = await fetch(SUPABASE_URL + "/rest/v1/profiles?id=eq." + user.id, { method: "DELETE", headers: H });
      out.deletedProfile = p.ok;
    } else {
      out.note = "no auth user found for that email; marking complete";
    }
    try { await fetch(SUPABASE_URL + "/rest/v1/push_tokens?email=eq." + encodeURIComponent(email), { method: "DELETE", headers: H }); } catch (e) {}
    await fetch(SUPABASE_URL + "/rest/v1/account_deletions?id=eq." + encodeURIComponent(id), {
      method: "PATCH", headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify({ completed_at: new Date().toISOString(), note: "Completed by " + callerEmail })
    });
    return res.status(200).json(out);
  } catch (e) { return res.status(200).json({ ok: false, error: String((e && e.message) || e).slice(0, 200) }); }
}
