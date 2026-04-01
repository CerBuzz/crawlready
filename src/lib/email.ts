import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.porkbun.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.PORKBUN_EMAIL,
      pass: process.env.PORKBUN_EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}

export async function sendConfirmationEmail(
  to: string,
  token: string,
  lang: string
) {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://crawlready.dev";
  const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;
  const isEs = lang === "es";

  const subject = isEs
    ? "Confirma tu solicitud — CrawlReady"
    : "Confirm your request — CrawlReady";

  const html = isEs
    ? `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#ffffff">
  <div style="padding:40px 32px;border:1px solid #e5e7eb;border-radius:12px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-block;background:#06b6d4;color:#000;font-weight:800;font-size:14px;padding:8px 16px;border-radius:8px;letter-spacing:0.5px">CR</div>
      <p style="font-size:20px;font-weight:700;color:#111;margin:16px 0 0">CrawlReady</p>
    </div>
    <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 8px">Hemos recibido tu solicitud de test gratuito de visibilidad IA.</p>
    <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 32px">Para confirmar que este email es tuyo, haz clic en el botón:</p>
    <p style="text-align:center;margin:0 0 32px">
      <a href="${confirmUrl}" style="background:#06b6d4;color:#000;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">Confirmar solicitud</a>
    </p>
    <p style="font-size:13px;color:#9ca3af;line-height:1.5;margin:0 0 24px">Si no has solicitado esto, simplemente ignora este email. El enlace caduca en 48 horas.</p>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 24px">
    <p style="font-size:12px;color:#d1d5db;margin:0;text-align:center">CrawlReady &mdash; hello@crawlready.dev</p>
  </div>
</div>`
    : `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#ffffff">
  <div style="padding:40px 32px;border:1px solid #e5e7eb;border-radius:12px">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-block;background:#06b6d4;color:#000;font-weight:800;font-size:14px;padding:8px 16px;border-radius:8px;letter-spacing:0.5px">CR</div>
      <p style="font-size:20px;font-weight:700;color:#111;margin:16px 0 0">CrawlReady</p>
    </div>
    <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 8px">We've received your free AI visibility test request.</p>
    <p style="font-size:16px;color:#374151;line-height:1.6;margin:0 0 32px">To confirm this email is yours, click the button below:</p>
    <p style="text-align:center;margin:0 0 32px">
      <a href="${confirmUrl}" style="background:#06b6d4;color:#000;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">Confirm request</a>
    </p>
    <p style="font-size:13px;color:#9ca3af;line-height:1.5;margin:0 0 24px">If you didn't request this, simply ignore this email. The link expires in 48 hours.</p>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 24px">
    <p style="font-size:12px;color:#d1d5db;margin:0;text-align:center">CrawlReady &mdash; hello@crawlready.dev</p>
  </div>
</div>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: '"CrawlReady" <hello@crawlready.dev>',
    to,
    subject,
    html,
  });
}

/** Notify the team when a lead confirms their email. */
export async function notifyNewLead(lead: {
  email: string;
  url: string;
  lang?: string;
  confirmedAt?: string;
}) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: '"CrawlReady Bot" <hello@crawlready.dev>',
    to: "hello@crawlready.dev",
    subject: `Nuevo lead confirmado: ${lead.url}`,
    html: `
<div style="font-family:monospace;font-size:14px;line-height:1.8;color:#1f2937">
  <p><strong>Nuevo lead confirmado</strong></p>
  <table style="border-collapse:collapse">
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Email:</td><td>${lead.email}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">URL:</td><td>${lead.url}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Idioma:</td><td>${lead.lang || "es"}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Confirmado:</td><td>${lead.confirmedAt || "ahora"}</td></tr>
  </table>
  <p style="margin-top:16px">Siguiente paso: <code>pnpm outreach ${lead.url} ${lead.email}</code></p>
</div>`,
  });
}
