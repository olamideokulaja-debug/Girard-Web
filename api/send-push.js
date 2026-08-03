// Sends an Expo push notification to a user by email (looks up their device tokens).
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!SERVICE) return res.status(200).json({ sent: 0, note: "no service key" });
  const { email, title, body, data } = req.body || {};
  if (!email || !title) return res.status(400).json({ error: "email and title required" });
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/push_tokens?email=eq." + encodeURIComponent(email) + "&select=token",
      { headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE } });
    const rows = await r.json();
    const messages = (Array.isArray(rows) ? rows : []).map(t => ({ to: t.token, title, body: body || "", data: data || {}, sound: "default" }));
    if (messages.length) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(messages),
      });
    }
    return res.status(200).json({ sent: messages.length });
  } catch (e) { return res.status(500).json({ error: String((e && e.message) || e) }); }
}
