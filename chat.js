export default async function handler(req, res) {
  const { model, message } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENROUTER_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: message }],
      max_tokens: 300
    })
  });

  const result = await response.json();
  const reply = result.choices?.[0]?.message?.content || "No reply.";
  res.status(200).json({ reply });
}