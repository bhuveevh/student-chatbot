export default async function handler(req, res) {
  try {
    const { model, message } = req.body;

    if (!process.env.OPENROUTER_KEY) {
      return res.status(500).json({ reply: "❌ Server error: Missing OpenRouter API key." });
    }

    if (!message || !model) {
      return res.status(400).json({ reply: "❌ Missing message or model." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: message }],
        max_tokens: 300
      })
    });

    // Check if the response is not ok
    if (!response.ok) {
      const errorText = await response.text(); // get text response for debugging
      return res.status(500).json({ reply: `❌ OpenRouter error: ${errorText}` });
    }

    const result = await response.json();

    const reply = result.choices?.[0]?.message?.content || "❌ No reply from model.";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ reply: `❌ Internal Server Error: ${error.message}` });
  }
}
