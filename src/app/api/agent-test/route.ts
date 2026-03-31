import { runAgentTest } from "@/lib/agentTest";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, task } = body;

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Please provide a valid URL." }, { status: 400 });
    }

    const cleaned = url.trim();
    if (cleaned.length < 4 || cleaned.length > 2000) {
      return Response.json({ error: "Invalid URL length." }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = runAgentTest(
            cleaned,
            typeof task === "string" ? task : "find this business and request a quote"
          );

          let finalResult;
          for (;;) {
            const { value, done } = await generator.next();
            if (done) {
              finalResult = value;
              break;
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "step", data: value })}\n\n`)
            );
          }

          if (finalResult) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "result", data: finalResult })}\n\n`)
            );
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", data: { message: String(err) } })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
}
