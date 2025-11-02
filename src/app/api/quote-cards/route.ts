// app/api/quote-cards/route.ts
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
interface QuoteCardRequest {
  name: string;
  companyTitle: string;
  companyName: string;
  quoteContent: string;
  highlightWord?: string;
  profileImage?: string;
  fontSize?: number;
  useAutoSize?: boolean;
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
    const apiKey = process.env.QUOTE_CARDS_API_KEY;
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
    let body: QuoteCardRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, companyTitle, companyName, quoteContent, highlightWord = "", profileImage, fontSize, useAutoSize = true } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'name' field (string required)" },
        { status: 400 }
      );
    }

    if (!companyTitle || typeof companyTitle !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'companyTitle' field (string required)" },
        { status: 400 }
      );
    }

    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'companyName' field (string required)" },
        { status: 400 }
      );
    }

    if (!quoteContent || typeof quoteContent !== "string" || quoteContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'quoteContent' field (string required)" },
        { status: 400 }
      );
    }

    // Clamp text lengths
    const clampedName = clampText(name, 100);
    const clampedCompanyTitle = clampText(companyTitle, 100);
    const clampedCompanyName = clampText(companyName, 100);
    const clampedQuote = clampText(quoteContent, 500);

    // Build dimensions
    const W = 1920;
    const H = 1080;
    const padding = 90;
    const contentWidth = W * 0.52;
    const imageWidth = W * 0.70;
    const quoteY = H * 0.14;

    // Process highlight words
    const wordsToHighlight = highlightWord
      .split(",")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);

    // Escape text for SVG
    const escapedName = escapeForSVG(clampedName.toUpperCase());
    const escapedCompanyTitle = escapeForSVG(clampedCompanyTitle.toUpperCase());
    const escapedCompanyName = escapeForSVG(clampedCompanyName.toUpperCase());
    const escapedQuote = escapeForSVG(clampedQuote.toUpperCase());

    // Build SVG overlay
    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Background gradient -->
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1a1a1a"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
          <!-- Lighting gradient -->
          <linearGradient id="lightGrad" x1="0.2" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(95,96,95,0)"/>
            <stop offset="30%" stop-color="rgba(95,96,95,0.1)"/>
            <stop offset="60%" stop-color="rgba(95,96,95,0.25)"/>
            <stop offset="80%" stop-color="rgba(95,96,95,0.4)"/>
            <stop offset="100%" stop-color="rgba(95,96,95,0.35)"/>
          </linearGradient>
          <!-- Accent gradient -->
          <linearGradient id="accentGrad" x1="0.4" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
            <stop offset="70%" stop-color="rgba(255,255,255,0.03)"/>
            <stop offset="90%" stop-color="rgba(255,255,255,0.06)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.04)"/>
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGrad)"/>
        <rect width="100%" height="100%" fill="url(#lightGrad)"/>
        <rect width="100%" height="100%" fill="url(#accentGrad)"/>
        
        <!-- Gold vertical pattern -->
        <g stroke="#BEA152" stroke-width="1" opacity="0.03">
          ${Array.from({ length: Math.floor(W / 20) }, (_, i) => 
            `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="${H}"/>`
          ).join("")}
        </g>
        
        <!-- Quote text -->
        <g font-family="Arial, sans-serif" fill="#FFFFFF" font-weight="600" font-size="58">
          <text x="${padding}" y="${quoteY + 50}" fill="#FFFFFF">
            "${escapedQuote}"
          </text>
        </g>
        
        <!-- Gold separator line -->
        <line x1="${padding}" y1="${quoteY + 250}" x2="${padding + 100}" y2="${quoteY + 250}" stroke="#BEA152" stroke-width="2"/>
        
        <!-- Name -->
        <text x="${padding}" y="${quoteY + 295}" font-family="Arial, sans-serif" font-size="58" font-weight="bold" fill="#FFFFFF">
          ${escapedName}
        </text>
        
        <!-- Company Title -->
        <text x="${padding}" y="${quoteY + 360}" font-family="Arial, sans-serif" font-size="36" fill="#BEA152">
          ${escapedCompanyTitle}
        </text>
        
        <!-- Company Name -->
        <text x="${padding}" y="${quoteY + 405}" font-family="Arial, sans-serif" font-size="36" fill="#BEA152">
          ${escapedCompanyName}
        </text>
        
        <!-- Logo placeholder (would need actual logo image) -->
        <text x="${W - 370}" y="${H - padding}" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#FFFFFF">
          EMIR
        </text>
      </svg>
    `;

    // Create base image (gradient background)
    let baseImage: sharp.Sharp;
    
    if (profileImage) {
      // Fetch profile image
      let resp: Response;
      try {
        resp = await fetch(profileImage.trim(), {
          redirect: "follow",
          headers: {
            "User-Agent": "EMIR-Quote-Card-Generator/1.0",
          },
        });
      } catch (fetchError) {
        return NextResponse.json(
          {
            error: `Failed to fetch profile image: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`,
          },
          { status: 400 }
        );
      }

      if (!resp.ok) {
        return NextResponse.json(
          { error: `Failed to fetch profile image (HTTP ${resp.status})` },
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

      // Get image buffer
      let profileBuffer: Buffer;
      try {
        const arrayBuffer = await resp.arrayBuffer();
        profileBuffer = Buffer.from(arrayBuffer);
      } catch (bufferError) {
        return NextResponse.json(
          {
            error: `Failed to process profile image data: ${bufferError instanceof Error ? bufferError.message : "Unknown error"}`,
          },
          { status: 400 }
        );
      }

      // Process profile image (resize, sharpen, position)
      const profileProcessed = await sharp(profileBuffer)
        .resize(Math.floor(imageWidth), null, { fit: "cover" })
        .sharpen({ sigma: 1.5, m1: 1.2, m2: 0.8 })
        .toBuffer();

      // Create gradient background
      const gradientBuffer = Buffer.from(
        `<svg width="${W}" height="${H}">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1a1a1a"/>
              <stop offset="100%" stop-color="#000000"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg)"/>
        </svg>`
      );

      // Composite profile image over gradient
      baseImage = sharp(gradientBuffer)
        .resize(W, H)
        .composite([
          {
            input: profileProcessed,
            left: Math.floor(W - imageWidth + 120),
            top: Math.floor(H - (imageWidth * 0.8)),
          },
        ]);
    } else {
      // Create gradient background only
      const gradientBuffer = Buffer.from(
        `<svg width="${W}" height="${H}">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1a1a1a"/>
              <stop offset="100%" stop-color="#000000"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg)"/>
        </svg>`
      );

      baseImage = sharp(gradientBuffer).resize(W, H);
    }

    // Generate PNG with SVG overlay
    let pngBuffer: Buffer;
    try {
      pngBuffer = await baseImage
        .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
        .png()
        .toBuffer();
    } catch (sharpError) {
      return NextResponse.json(
        {
          error: `Failed to process image: ${sharpError instanceof Error ? sharpError.message : "Unknown error"}`,
        },
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
        note: "binary omitted",
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
    console.error("Quote card generation error:", error);
    return NextResponse.json(
      {
        error: "failed to render quote card",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

