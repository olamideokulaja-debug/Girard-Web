// Optional daily job that refreshes the market-intelligence briefings.
// Vercel calls this on the schedule in vercel.json. It works only if
// ANTHROPIC_API_KEY is set; otherwise the intelligence page uses its
// seeded briefings, which is perfectly fine.

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(200).json({ ok: true, refreshed: false, note: "ANTHROPIC_API_KEY not set; using seeded intelligence." });
    return;
  }
  const markets = ["Nigeria", "UK", "US"];
  const briefings = {};
  try {
    for (const m of markets) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 400,
          messages: [{ role: "user", content: "Write a concise two-sentence residential property market briefing for " + m + ", covering price direction, yields and one planning or supply theme. No preamble." }]
        })
      });
      const data = await r.json();
      briefings[m] = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    }
    // In production, persist `briefings` to Supabase for the client to read.
    res.status(200).json({ ok: true, refreshed: true, at: new Date().toISOString(), markets: Object.keys(briefings) });
  } catch (e) {
    res.status(500).json({ ok: false, error: "refresh failed" });
  }
}
