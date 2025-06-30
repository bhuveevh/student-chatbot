const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");
const modelSelect = document.getElementById("model");
const resetBtn = document.getElementById("resetBtn");
const toggleTheme = document.getElementById("toggleTheme");

let count = 1; // 1 because default welcome message is 1

function checkChatLimit() {
  const maxChats = 5;
  const cooldownMs = 2 * 60 * 60 * 1000;

  const now = Date.now();
  const lockedUntil = localStorage.getItem("lockedUntil");

  if (lockedUntil && now < Number(lockedUntil)) {
    alert("🚫 You have reached the limit of 5 new chats. Please wait 2 hours before trying again.");
    return false;
  }

  let count = Number(localStorage.getItem("chatCount") || 0);

  if (count >= maxChats) {
    localStorage.setItem("lockedUntil", now + cooldownMs);
    localStorage.setItem("chatCount", 0);
    alert("🚫 Limit reached. Please wait 2 hours.");
    return false;
  }

  localStorage.setItem("chatCount", count + 1);
  return true;
}

window.resetChat = function () {
  if (!checkChatLimit()) return;
  chat.innerHTML = `
    <div class="msg ai">
      <div class="label">👤 vH-Ai</div>
      vH-Ai aapka swagat karta hai VACANCYHAI.ONLINE website par.
    </div>
  `;
  count = 1;
};

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
};

form.onsubmit = async (e) => {
  e.preventDefault();

  if (count >= 10) {
    alert("❌ You have reached the message limit of 10. Please start a new chat.");
    return;
  }
  count++;

  const prompt = input.value;
  input.value = "";

  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = prompt;
  chat.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "msg ai";
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = "👤 vH-Ai";
  aiMsg.appendChild(label);
  chat.appendChild(aiMsg);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        model: modelSelect.value
      })
    });

    const data = await response.json();
    if (data.answer) {
      typeWriterEffect(data.answer, aiMsg);
    } else {
      aiMsg.innerHTML += "<br>❌ No response received.";
    }
  } catch (err) {
    aiMsg.innerHTML += `<br>❌ Error: ${err.message}`;
  }
};

function typeWriterEffect(text, container) {
  const textNode = document.createElement("div");
  container.appendChild(textNode);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      textNode.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}
