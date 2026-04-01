import { NextResponse } from "next/server";
import { list, put, del } from "@vercel/blob";
import { notifyNewLead } from "@/lib/email";
import { sendTelegramAlert } from "@/lib/telegram";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  // Find the lead with this token
  const { blobs } = await list({ prefix: "leads/" });

  for (const blob of blobs) {
    const res = await fetch(blob.url);
    const lead = await res.json();

    if (lead.token === token) {
      if (lead.status === "confirmed") {
        // Already confirmed — redirect to confirmed page
        return NextResponse.redirect(
          new URL(`/${lead.lang || "es"}/confirmed`, req.url)
        );
      }

      // Update to confirmed
      const updated = {
        ...lead,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
      };

      // Delete old blob and write updated one
      await del(blob.url);
      await put(blob.pathname, JSON.stringify(updated), {
        contentType: "application/json",
        access: "public",
      });

      console.log(`[CONFIRMED] ${lead.email} — ${lead.url}`);

      // Notify team
      notifyNewLead(updated).catch((err) =>
        console.error("[NOTIFY ERROR]", err)
      );

      sendTelegramAlert(
        `✅ <b>Lead confirmado</b>\n📧 ${lead.email}\n🔗 ${lead.url}`
      ).catch(() => {});

      return NextResponse.redirect(
        new URL(`/${lead.lang || "es"}/confirmed`, req.url)
      );
    }
  }

  // Token not found
  return NextResponse.redirect(new URL("/es", req.url));
}
