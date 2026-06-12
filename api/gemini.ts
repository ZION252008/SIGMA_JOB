import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, base64, mimeType, messages } = (req.body ?? {}) as {
    prompt?: string;
    base64?: string;
    mimeType?: string;
    messages?: { role: string; parts: { text: string }[] }[];
  };

  if (!prompt && !messages?.length) {
    return res.status(400).json({ error: 'Missing "prompt" or "messages" in request body' });
  }

  // Key injected by Vercel at runtime only.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contents = messages?.length
    ? messages
    : [
        {
          parts: base64
            ? [{ inline_data: { mime_type: mimeType, data: base64 } }, { text: prompt }]
            : [{ text: prompt }],
        },
      ];

  try {
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
    
      console.error("Gemini Status:", geminiRes.status);
      console.error("Gemini Response:", detail);
    
      return res.status(geminiRes.status).json({
        error: "Gemini API error",
        status: geminiRes.status,
        detail
      });
    }

    const data: any = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return res.status(200).json({ text });
  } catch (err: any) {
    return res
      .status(502)
      .json({ error: 'Upstream fetch failed', detail: err?.message ?? String(err) });
  }
}
