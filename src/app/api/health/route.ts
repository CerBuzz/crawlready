import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status: "error", detail: "Missing RESEND_API_KEY" },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.domains.list();

    if (error) {
      return Response.json(
        { status: "error", detail: error.message },
        { status: 503 }
      );
    }

    return Response.json({
      status: "ok",
      provider: "resend",
      domains: data?.data?.map((d) => d.name) ?? [],
    });
  } catch (err) {
    return Response.json(
      {
        status: "error",
        detail: err instanceof Error ? err.message : "Resend check failed",
      },
      { status: 503 }
    );
  }
}
