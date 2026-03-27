import { scanUrl } from "@/lib/scanner";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return Response.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    // Basic URL validation
    const cleaned = url.trim();
    if (cleaned.length < 4 || cleaned.length > 2000) {
      return Response.json(
        { error: "Invalid URL length." },
        { status: 400 }
      );
    }

    const result = await scanUrl(cleaned);
    return Response.json(result);
  } catch (error) {
    console.error("Scan error:", error);
    return Response.json(
      { error: "Failed to scan URL. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
