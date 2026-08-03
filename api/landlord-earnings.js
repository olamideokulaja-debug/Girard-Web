// Returns a landlord's earnings across their listings + their payout account.
// Uses the service role (server-side) because payments RLS is tenant-scoped, so
// a landlord can't read their properties' payments from the client directly.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://qphpdczthyuzrfurimeh.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, { headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE } });
  return r.json();
}

export default async function handler(req, res) {
  if (!SERVICE) return res.status(200).json({ total: 0, count: 0, recent: [], account: null, note: "no service key" });
  const email = (req.query && req.query.email) || (req.body && req.body.email);
  if (!email) return res.status(400).json({ error: "email required" });
  try {
    const props = await sb("properties?owner_email=eq." + encodeURIComponent(email) + "&select=id");
    const ids = (Array.isArray(props) ? props : []).map(p => p.id);
    let pays = [];
    if (ids.length) {
      pays = await sb("payments?property_id=in.(" + ids.map(encodeURIComponent).join(",") + ")&select=amount,title,paid_at,status&order=paid_at.desc");
      if (!Array.isArray(pays)) pays = [];
    }
    const total = pays.reduce((s, p) => s + (Number(p.amount) || 0), 0);   // kobo, gross
    const banks = await sb("banks?email=eq." + encodeURIComponent(email) + "&select=bank_name,acct_name,acct_no,bvn_verified,subaccount");
    return res.status(200).json({
      total,                                   // gross kobo
      net: Math.round(total * 0.95),           // landlord share after Girard 5%
      count: pays.length,
      listings: ids.length,
      recent: pays.slice(0, 12),
      account: (Array.isArray(banks) && banks[0]) || null,
    });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
