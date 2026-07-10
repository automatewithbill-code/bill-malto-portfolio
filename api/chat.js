/* ============================================================
   /api/chat — serverless proxy for the portfolio chatbot.
   Holds the OpenAI key server-side (env var OPENAI_API_KEY);
   the browser never sees it. Deployed automatically by Vercel.
   ============================================================ */

const ALLOWED_ORIGINS = [
  "https://bill-malto-portfolio.vercel.app",
  "https://www.automatewithbill.dev",
  "https://automatewithbill.dev",
  "https://automatewithbill-code.github.io",
  "http://localhost:8000",
];

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "OPENAI_API_KEY not configured" });

  let messages = (req.body && req.body.messages) || [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages required" });
  }
  /* hard limits so a stranger can't burn credits through the proxy */
  messages = messages.slice(-14).map(function (m) {
    return {
      role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
      content: String(m.content || "").slice(0, 4000),
    };
  });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: "gpt-4o-mini",       /* fixed server-side — client cannot change it */
        messages: messages,
        max_tokens: 260,
        temperature: 0.6,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(502).json({ error: "upstream", detail: data.error && data.error.message });
    }
    const reply =
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    return res.status(200).json({ reply: reply });
  } catch (e) {
    return res.status(502).json({ error: "proxy failure" });
  }
};
