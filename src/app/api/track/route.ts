import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { sendConfirmationEmail } from "@/lib/email";
import { sendTelegramAlert } from "@/lib/telegram";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let body: unknown;
    if (ct.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = JSON.parse(text);
    }

    const payload = body as Record<string, unknown>;
    const isLead = payload.url && payload.email;
    const eventType = isLead ? "test_request" : "track";

    console.log(`[${eventType.toUpperCase()}]`, JSON.stringify(body));

    if (!isLead) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const email = String(payload.email).toLowerCase().trim();
    const url = String(payload.url).trim();
    const lang = String(payload.lang || "es");

    // Check for existing lead with same email
    const { blobs } = await list({ prefix: "leads/" });
    for (const blob of blobs) {
      const res = await fetch(blob.url);
      const existing = await res.json();
      if (existing.email === email) {
        return NextResponse.json(
          { ok: false, error: "duplicate" },
          { status: 409 }
        );
      }
    }

    // Create lead with confirmation token
    const token = crypto.randomUUID();

    // Attempt email first, then save lead with result
    let emailSent = false;
    try {
      await sendConfirmationEmail(email, token, lang);
      emailSent = true;
    } catch (err) {
      console.error("[EMAIL_ERROR]", err);
    }

    const lead = {
      url,
      email,
      lang,
      status: "pending",
      token,
      emailSent,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      source: "hero_form",
    };

    const filename = `leads/${Date.now()}-${email.replace(/[^a-z0-9]/gi, "_")}.json`;
    await put(filename, JSON.stringify(lead), {
      contentType: "application/json",
      access: "public",
    });

    // Telegram alerts (fire-and-forget)
    const lines = [
      `🆕 <b>Nuevo lead</b>`,
      `📧 ${email}`,
      `🔗 ${url}`,
      `✉️ Email: ${emailSent ? "✅ Enviado" : "❌ FALLÓ"}`,
    ];
    sendTelegramAlert(lines.join("\n")).catch(() => {});

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
}

/** GET /api/track?password=xxx — list all leads (admin only) */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pw = searchParams.get("password");

  if (pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [humanLeads, agentLeads] = await Promise.all([
    list({ prefix: "leads/" }),
    list({ prefix: "agent-leads/" }),
  ]);
  const allBlobs = [...humanLeads.blobs, ...agentLeads.blobs];
  const leads = await Promise.all(
    allBlobs.map(async (blob) => {
      const res = await fetch(blob.url);
      const data = await res.json();
      return { ...data, blobUrl: blob.url, pathname: blob.pathname };
    })
  );

  leads.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ leads, count: leads.length });
}
