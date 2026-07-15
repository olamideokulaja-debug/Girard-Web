// Daily market-intelligence refresh.
//
// Pulls REAL, current property-market data from the web (via Claude's web
// search) and stores it in Supabase, so the app shows sourced figures rather
// than illustrative ones.
//
// Vercel runs this on the schedule in vercel.json. You can also trigger it by
// hand: https://girardpropertylimited.com/api/refresh-intel
//
// Needs:
//   ANTHROPIC_API_KEY          - to run the search and summarise
//   SUPABASE_URL               - your project URL
//   SUPABASE_SERVICE_ROLE_KEY  - so the job can write with no signed-in user
//
// If a key is missing it says so plainly and writes nothing, and the app shows
// "no briefing yet" instead of inventing numbers.

const MARKETS = ["Nigeria", "UK", "US"];

const PROMPT = (m) => `Search the web for the most recent residential property market data for ${m} and report only what the sources actually say.

Return STRICT JSON, no markdown, no preamble, exactly this shape:
{
  "price_growth": "e.g. +4.2% year-on-year, or null if not found",
  "price_growth_note": "what it measures and the period, e.g. 'UK HPI, year to May 2026'",
  "gross_yield": "e.g. 5.8%, or null if not found",
  "gross_yield_note": "what it refers to, or null",
  "avg_price": "with currency, or null if not found",
  "avg_price_note": "what it refers to, or null",
  "briefing": "two to three sentences on price direction, yields and one supply or planning theme. State the period the data covers. Plain text.",
  "as_at": "the date or period the data refers to, as published"
}

Rules:
- Use only figures you actually found in the search results. If a figure is not available, use null. Never estimate or invent.
- Prefer official sources: national statistics offices, central banks, land registries, established indices.
- Nigerian official data is sparse. If you cannot find a reliable figure, return null rather than guessing.`;

async function askClaude(key, market) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: PROMPT(market) }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }]
    })
  });
  const data = await r.json();
  if (!data || !data.content) return null;

  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();

  // Keep the pages actually consulted, so every figure can be checked.
  const sources = [];
  const addSrc = (u, t) => { if (u && !sources.some(s => s.url === u)) sources.push({ url: u, title: t || u }); };
  data.content.forEach(b => {
    (b.citations || []).forEach(c => addSrc(c.url, c.title));
    if (b.type === "web_search_tool_result") (b.content || []).forEach(c => addSrc(c.url, c.title));
  });

  let parsed = null;
  try { const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); } catch (e) { parsed = null; }
  if (!parsed) return null;
  return Object.assign({}, parsed, { sources: sources.slice(0, 6) });
}

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  const supaUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) { res.status(200).json({ ok: false, reason: "ANTHROPIC_API_KEY is not set, so no market data can be fetched." }); return; }

  const done = []; const failed = [];
  for (const market of MARKETS) {
    try {
      const got = await askClaude(key, market);
      if (!got || !got.briefing) { failed.push(market); continue; }
      if (supaUrl && supaKey) {
        const w = await fetch(supaUrl + "/rest/v1/market_intel", {
          method: "POST",
          headers: { apikey: supaKey, Authorization: "Bearer " + supaKey, "content-type": "application/json", Prefer: "resolution=merge-duplicates" },
          body: JSON.stringify([{
            market,
            briefing: got.briefing,
            price_growth: got.price_growth || null,
            price_growth_note: got.price_growth_note || null,
            gross_yield: got.gross_yield || null,
            gross_yield_note: got.gross_yield_note || null,
            avg_price: got.avg_price || null,
            avg_price_note: got.avg_price_note || null,
            as_at: got.as_at || null,
            sources: got.sources || [],
            updated_at: new Date().toISOString()
          }])
        });
        if (!w.ok) { failed.push(market + " (could not save)"); continue; }
      }
      done.push(market);
    } catch (e) { failed.push(market); }
  }

  res.status(200).json({
    ok: done.length > 0,
    refreshed: done,
    failed,
    saved: !!(supaUrl && supaKey),
    note: (supaUrl && supaKey) ? undefined : "SUPABASE_SERVICE_ROLE_KEY is not set, so nothing was saved. Add it in Vercel so the app can show this data.",
    at: new Date().toISOString()
  });
}
