import { sendTelegramAlert } from "@/lib/telegram";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Resend webhook sends { type: "email.received", data: { ... } }
    if (payload.type !== "email.received") {
      return Response.json({ ok: true, skipped: true });
    }

    const { from, to, subject, email_id } = payload.data;

    // Fetch full email content from Resend Receiving API
    let textBody = "";
    let htmlBody = "";
    try {
      const emailRes = await resend.emails.receiving.get(email_id);
      if (emailRes.data) {
        textBody = emailRes.data.text || "";
        htmlBody = emailRes.data.html || "";
      }
    } catch (err) {
      console.error("[INBOUND] Failed to fetch email content:", err);
    }

    const bodyPreview = textBody
      ? textBody.slice(0, 500)
      : htmlBody
        ? "(solo HTML, ver reenvío en Gmail)"
        : "(sin contenido)";

    // Send Telegram alert
    const lines = [
      "<b>📨 Nuevo email recibido</b>",
      "",
      `<b>De:</b> ${escapeHtml(from)}`,
      `<b>Para:</b> ${escapeHtml(Array.isArray(to) ? to.join(", ") : to)}`,
      `<b>Asunto:</b> ${escapeHtml(subject || "(sin asunto)")}`,
      "",
      escapeHtml(bodyPreview),
    ];

    await sendTelegramAlert(lines.join("\n"));

    // Forward to Gmail with full content
    const forwardHtml = htmlBody
      ? `
<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#1f2937">
  <p><b>Email reenviado de hello@crawlready.dev</b></p>
  <p><b>De:</b> ${escapeHtml(from)}</p>
  <p><b>Asunto:</b> ${escapeHtml(subject || "(sin asunto)")}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
  ${htmlBody}
</div>`
      : `
<div style="font-family:monospace;font-size:14px;line-height:1.6;color:#1f2937">
  <p><b>Email reenviado de hello@crawlready.dev</b></p>
  <p><b>De:</b> ${escapeHtml(from)}</p>
  <p><b>Asunto:</b> ${escapeHtml(subject || "(sin asunto)")}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
  <pre style="white-space:pre-wrap">${escapeHtml(textBody || "(sin contenido)")}</pre>
</div>`;

    try {
      await resend.emails.send({
        from: "CrawlReady <hello@crawlready.dev>",
        to: ["crawlready@gmail.com"],
        subject: `[FWD] ${subject || "(sin asunto)"}`,
        replyTo: [from],
        html: forwardHtml,
      });
    } catch (fwdErr) {
      console.error("[INBOUND] Forward to Gmail failed:", fwdErr);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[INBOUND] Webhook error:", err);
    return Response.json({ error: "webhook processing failed" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
