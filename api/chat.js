export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, model } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!prompt || !model) {
    return res.status(400).json({ error: "Missing prompt or model" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are vH-Ai, a helpful educational assistant created by VACANCYHAI.ONLINE for students. Always reply in complete sentences within 200 words. If the user asks your name, reply 'Mera naam vH-Ai hai, main VacancyHai.Online ke students ke liye banaya gaya ek chatbot hoon.'"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content || "(No response)";
      return res.status(200).json({ answer });
    } else {
      const fallbackText = await response.text();
      return res.status(200).json({ answer: fallbackText });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
