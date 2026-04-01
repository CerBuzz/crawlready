const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramAlert(message: string) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[TELEGRAM] Missing BOT_TOKEN or CHAT_ID, skipping alert");
    return;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[TELEGRAM] Failed to send:", err);
    }
  } catch (err) {
    console.error("[TELEGRAM] Error:", err);
  }
}
