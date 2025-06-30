let count = 0;
const MAX = 10;
const form = document.getElementById("form");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const modelSelect = document.getElementById("model");

form.onsubmit = async (e) => {
  e.preventDefault();
  if (count >= MAX) {
    chat.innerHTML += `<div class="msg"><b>⚠️ Limit reached. Start new chat.</b></div>`;
    return;
  }

  const msg = input.value.trim();
  if (!msg) return;
  chat.innerHTML += `<div class="msg user">${msg}</div>`;
  input.value = "";
  count++;

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
    chat.innerHTML += `<div class="msg ai">${data.reply}</div>`;
  } catch (err) {
    chat.innerHTML += `<div class="msg ai">❌ Server error: Invalid JSON response.</div>`;
  }
  chat.scrollTop = chat.scrollHeight;
};

window.resetChat = function() {
  document.getElementById("chat").innerHTML = "";
  count = 0;
};

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};
