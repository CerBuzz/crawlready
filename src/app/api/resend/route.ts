import { list, del, put } from "@vercel/blob";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { password, token, email } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!token && !email) {
      return Response.json(
        { error: "token or email required" },
        { status: 400 }
      );
    }

    // Find the lead
    const { blobs } = await list({ prefix: "leads/" });

    for (const blob of blobs) {
      const res = await fetch(blob.url);
      const lead = await res.json();

      const match = token ? lead.token === token : lead.email === email;
      if (!match) continue;

      // Resend confirmation email
      await sendConfirmationEmail(lead.email, lead.token, lead.lang || "es");

      // Update emailSent flag in blob
      if (!lead.emailSent) {
        const updated = { ...lead, emailSent: true };
        await del(blob.url);
        await put(blob.pathname, JSON.stringify(updated), {
          contentType: "application/json",
          access: "public",
        });
      }

      return Response.json({ ok: true, email: lead.email });
    }

    return Response.json({ error: "lead not found" }, { status: 404 });
  } catch (err) {
    console.error("[RESEND_ERROR]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "resend failed" },
      { status: 500 }
    );
  }
}
