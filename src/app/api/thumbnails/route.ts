// app/api/thumbnails/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Helper to escape text for SVG
function escapeForSVG(str: string): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Helper to clamp text length
function clampText(str: string, max: number): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.substring(0, max - 3) + "...";
}

// Type for request payload
interface ThumbnailRequest {
  name: string;
  subtitle?: string;
  backgroundImage: string;
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check API key if configured
    const apiKey = process.env.THUMBNAILS_API_KEY;
    if (apiKey) {
      const providedKey = req.headers.get("x-api-key");
      if (providedKey !== apiKey) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }
    }

    // Parse and validate request body
    let body: ThumbnailRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, subtitle, backgroundImage } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'name' field (string required)" },
        { status: 400 }
      );
    }

    if (!backgroundImage || typeof backgroundImage !== "string" || backgroundImage.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'backgroundImage' field (string URL required)" },
        { status: 400 }
      );
    }

    // Clamp text lengths
    const clampedName = clampText(name, 120);
    const clampedSubtitle = subtitle ? clampText(subtitle, 160) : "";

    // Fetch background image
    let resp: Response;
    try {
      resp = await fetch(backgroundImage.trim(), { 
        redirect: "follow",
        headers: {
          'User-Agent': 'EMIR-Thumbnail-Generator/1.0'
        }
      });
    } catch (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch background image: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Failed to fetch background image (HTTP ${resp.status})` },
        { status: 400 }
      );
    }

    // Verify content type
    const contentType = resp.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: `URL is not an image. Content-Type received: ${contentType}` },
        { status: 400 }
      );
    }

    // Convert to buffer
    let bgBuffer: Buffer;
    try {
      const arrayBuffer = await resp.arrayBuffer();
      bgBuffer = Buffer.from(arrayBuffer);
    } catch (bufferError) {
      return NextResponse.json(
        { error: `Failed to process image data: ${bufferError instanceof Error ? bufferError.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Build SVG overlay
    const W = 1280, H = 720;
    const escapedName = escapeForSVG(clampedName);
    const escapedSubtitle = escapeForSVG(clampedSubtitle);

    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="black" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <g font-family="Inter, Arial, sans-serif" fill="#fff" text-anchor="middle">
          <text x="${W/2}" y="320" font-size="72" font-weight="800">${escapedName.toUpperCase()}</text>
          ${escapedSubtitle ? `<text x="${W/2}" y="390" font-size="36" font-weight="500">${escapedSubtitle}</text>` : ""}
        </g>
        <rect x="0" y="${H-120}" width="${W}" height="120" fill="#c2a24d"/>
        <rect x="60" y="${H-120}" width="220" height="120" fill="#111"/>
        <text x="170" y="${H-45}" font-size="64" font-weight="800" fill="#fff" text-anchor="middle">EMIR</text>
      </svg>
    `;

    // Generate PNG with sharp
    let pngBuffer: Buffer;
    try {
      pngBuffer = await sharp(bgBuffer)
        .resize(W, H, { fit: "cover", position: "centre" })
        .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
        .png()
        .toBuffer();
    } catch (sharpError) {
      return NextResponse.json(
        { error: `Failed to process image: ${sharpError instanceof Error ? sharpError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Check for JSON debug mode
    const url = new URL(req.url);
    const jsonMode = url.searchParams.get("json") === "1";

    if (jsonMode) {
      return NextResponse.json({
        ok: true,
        bytes: pngBuffer.length,
        mime: "image/png",
        note: "binary omitted"
      });
    }

    // Return binary PNG
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
      },
    });

  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      { 
        error: "failed to render thumbnail", 
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}