// Optional server-side AI proxy for Girard.
// It keeps the Anthropic key on the server. The app works without this file:
// every AI feature falls back to a local estimate when the proxy is absent.
//
// To enable real AI wording:
//   1. Add this file at api/anthropic.js in your project.
//   2. In Vercel, add an environment variable named ANTHROPIC_API_KEY (server-side, no VITE_ prefix).
//   3. Redeploy.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(501).json({ error: "AI not configured" });
    return;
  }
  try {
    const { prompt, system } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: system || undefined,
        messages: [{ role: "user", content: String(prompt || "") }]
      })
    });
    const data = await r.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: "AI request failed" });
  }
}
