import { put, list } from "@vercel/blob";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Rate limiter — in-memory, per-IP, resets on cold start (fine for Vercel)
// ---------------------------------------------------------------------------
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // per window
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------
const MAX_BODY_BYTES = 4_096;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.{4,200}$/;

/** Strip HTML tags and trim to max length */
function sanitize(raw: unknown, maxLen: number): string {
  return String(raw ?? "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

// ---------------------------------------------------------------------------
// POST /api/agent-contact
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  // 1. Content-Type must be application/json — reject browser form posts
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // 2. Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Max 5 requests per minute." },
      { status: 429 }
    );
  }

  // 3. Body size guard
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { error: `Body too large. Max ${MAX_BODY_BYTES} bytes.` },
      { status: 413 }
    );
  }

  // 4. Parse JSON
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json(
        { error: `Body too large. Max ${MAX_BODY_BYTES} bytes.` },
        { status: 413 }
      );
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 5. Honeypot — documented in llms.txt as "must be empty"
  if (body.website && String(body.website).trim() !== "") {
    // Silently accept but discard — don't reveal the trap
    return Response.json({
      ok: true,
      message: "Request received. We will respond within 24 hours.",
    });
  }

  // 6. Validate required fields
  const companyName = sanitize(body.company_name, 200);
  const contactEmail = sanitize(body.contact_email, 320).toLowerCase();
  const siteUrl = sanitize(body.site_url, 2000);
  const service = sanitize(body.service_requested, 100);
  const message = sanitize(body.message, 2000);

  const errors: string[] = [];
  if (!companyName) errors.push("company_name is required");
  if (!contactEmail || !EMAIL_RE.test(contactEmail))
    errors.push("contact_email must be a valid email address");
  if (!siteUrl || !URL_RE.test(siteUrl))
    errors.push("site_url must be a valid URL starting with http(s)://");

  const validServices = [
    "free_ai_visibility_report",
    "full_implementation",
    "general_inquiry",
  ];
  if (service && !validServices.includes(service)) {
    errors.push(
      `service_requested must be one of: ${validServices.join(", ")}`
    );
  }

  if (errors.length > 0) {
    return Response.json({ error: "Validation failed", details: errors }, { status: 422 });
  }

  // 7. Duplicate check
  try {
    const { blobs } = await list({ prefix: "agent-leads/" });
    for (const blob of blobs) {
      const res = await fetch(blob.url);
      const existing = (await res.json()) as { contact_email?: string };
      if (existing.contact_email === contactEmail) {
        return Response.json(
          {
            ok: false,
            error: "A request from this email already exists. We will respond within 24 hours.",
          },
          { status: 409 }
        );
      }
    }
  } catch {
    // If blob listing fails, proceed anyway — better to accept a possible dupe
    // than to reject a legitimate request
  }

  // 8. Store in Vercel Blob (separate prefix from human leads)
  const lead = {
    company_name: companyName,
    contact_email: contactEmail,
    site_url: siteUrl,
    service_requested: service || "general_inquiry",
    message: message || null,
    source: "agent_api",
    ip,
    user_agent: sanitize(req.headers.get("user-agent"), 500),
    created_at: new Date().toISOString(),
    status: "new",
    id: crypto.randomUUID(),
  };

  const filename = `agent-leads/${Date.now()}-${contactEmail.replace(/[^a-z0-9]/gi, "_")}.json`;
  await put(filename, JSON.stringify(lead), {
    contentType: "application/json",
    access: "public",
  });

  console.log("[AGENT_CONTACT]", JSON.stringify({ email: contactEmail, company: companyName }));

  return Response.json({
    ok: true,
    message: "Request received. We will respond within 24 hours via email.",
    reference_id: lead.id,
  });
}

// Only POST allowed
export async function GET() {
  return Response.json(
    {
      error: "This endpoint only accepts POST requests with application/json",
      documentation: "https://crawlready.dev/llms.txt",
    },
    { status: 405 }
  );
}
