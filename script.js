let count = 0;
const MAX = 10;
const form = document.getElementById("form");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const modelSelect = document.getElementById("model");

form.onsubmit = async (e) => {
  e.preventDefault();
  if (count >= MAX) {
    chat.innerHTML += `<div class="msg ai">⚠️ Limit reached. Start new chat.</div>`;
    return;
  }

  const msg = input.value.trim();
  if (!msg) return;
  chat.innerHTML += `<div class="msg user">${msg}</div>`;
  input.value = "";
  count++;

  const loading = document.createElement("div");
  loading.className = "msg ai";
  loading.textContent = "Typing...";
  chat.appendChild(loading);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      model: modelSelect.value
    })
  });

  try {
    const data = await res.json();
    loading.remove();
    await typeText(data.reply);
  } catch (err) {
    loading.textContent = "❌ Server error: Invalid JSON response.";
  }
  chat.scrollTop = chat.scrollHeight;
};

async function typeText(text) {
  const bubble = document.createElement("div");
  bubble.className = "msg ai";
  chat.appendChild(bubble);
  for (let i = 0; i < text.length; i++) {
    bubble.textContent += text[i];
    await new Promise(res => setTimeout(res, 15));
    chat.scrollTop = chat.scrollHeight;
  }
}

window.resetChat = function() {
  chat.innerHTML = "";
  count = 0;
};

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};
