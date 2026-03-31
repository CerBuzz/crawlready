import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { sendConfirmationEmail } from "@/lib/email";
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
    const lead = {
      url,
      email,
      lang,
      status: "pending",
      token,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      source: "hero_form",
    };

    const filename = `leads/${Date.now()}-${email.replace(/[^a-z0-9]/gi, "_")}.json`;
    await put(filename, JSON.stringify(lead), {
      contentType: "application/json",
      access: "public",
    });

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, token, lang);
    } catch (err) {
      console.error("[EMAIL_ERROR]", err);
      // Lead is saved even if email fails — we can resend manually
    }

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

  const { blobs } = await list({ prefix: "leads/" });
  const leads = await Promise.all(
    blobs.map(async (blob) => {
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
