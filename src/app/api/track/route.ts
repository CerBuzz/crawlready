import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

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

    // Always log
    console.log(`[${eventType.toUpperCase()}]`, JSON.stringify(body));

    // Persist leads to Vercel Blob
    if (isLead) {
      const lead = {
        url: String(payload.url),
        email: String(payload.email),
        lang: payload.lang || "es",
        timestamp: new Date().toISOString(),
        source: "hero_form",
      };
      const filename = `leads/${Date.now()}-${lead.email.replace(/[^a-z0-9]/gi, "_")}.json`;
      await put(filename, JSON.stringify(lead), {
        contentType: "application/json",
        access: "public",
      });
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
      return data;
    })
  );

  // Sort newest first
  leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ leads, count: leads.length });
}
