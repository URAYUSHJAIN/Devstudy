import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

export async function POST(req: Request) {
  // Basic IP extraction (works for most proxies)
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { language, version, content } = body;

    if (!language || !content) {
        return NextResponse.json({ error: "Missing language or content" }, { status: 400 });
    }

    // Log usage (console for now, could be DB)
    console.log(`[EXECUTE] IP: ${ip}, Lang: ${language}`);

    const response = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          version,
          files: [{ content }]
        })
      });

      const data = await response.json();
      return NextResponse.json(data);

  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
