// app/api/quote-cards/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Register fonts for server-side rendering
const fontsDir = path.join(process.cwd(), "public", "fonts");

// Register Akkurat fonts (using available fonts)
try {
  if (fs.existsSync(path.join(fontsDir, "AkkRg_Pro_1.otf"))) {
    registerFont(path.join(fontsDir, "AkkRg_Pro_1.otf"), { family: "Akkurat", weight: "400" });
  }
  if (fs.existsSync(path.join(fontsDir, "AkkBd_Pro_1.otf"))) {
    registerFont(path.join(fontsDir, "AkkBd_Pro_1.otf"), { family: "Akkurat", weight: "700" });
  }
  if (fs.existsSync(path.join(fontsDir, "AkkBd_Pro_1.otf"))) {
    registerFont(path.join(fontsDir, "AkkBd_Pro_1.otf"), { family: "Akkurat", weight: "600" });
  }
  if (fs.existsSync(path.join(fontsDir, "MillerBanner-Roman.otf"))) {
    registerFont(path.join(fontsDir, "MillerBanner-Roman.otf"), { family: "MillerBanner", weight: "400" });
  }
  if (fs.existsSync(path.join(fontsDir, "MillerBanner-Semibold.otf"))) {
    registerFont(path.join(fontsDir, "MillerBanner-Semibold.otf"), { family: "MillerBanner", weight: "600" });
  }
} catch (error) {
  console.warn("Warning: Could not register fonts, falling back to system fonts", error);
}

// Helper to clamp text length
function clampText(str: string, max: number): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.substring(0, max - 3) + "...";
}

// Helper to wrap text
function wrapText(ctx: any, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
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
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

// Handle GET requests - return API documentation
export async function GET() {
  const apiKeyRequired = !!process.env.QUOTE_CARDS_API_KEY;
  return NextResponse.json({
    message: "Quote Cards API",
    endpoint: "/api/quote-cards",
    method: "POST",
    documentation: {
      requiredFields: {
        name: "string - Person's name",
        companyTitle: "string - Person's title",
        companyName: "string - Company name",
        quoteContent: "string - Quote text",
      },
      optionalFields: {
        highlightWord: "string - Comma-separated words to highlight",
        profileImage: "string - URL to profile image",
        fontSize: "number - Font size (default: auto)",
        useAutoSize: "boolean - Enable auto font sizing (default: true)",
      },
      headers: apiKeyRequired
        ? {
            "Content-Type": "application/json",
            "x-api-key": "Required - Your API key",
          }
        : {
            "Content-Type": "application/json",
          },
      response: "PNG image (1920x1080px)",
      example: {
        curl: `curl -X POST ${process.env.VERCEL_URL || "https://emir-five.vercel.app"}/api/quote-cards \\
  -H "Content-Type: application/json" \\
  ${apiKeyRequired ? '-H "x-api-key: YOUR_API_KEY" \\' : ""}
  -d '{
    "name": "John Doe",
    "companyTitle": "CEO",
    "companyName": "EMIR",
    "quoteContent": "Your quote here"
  }'`,
      },
    },
    apiKeyRequired,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check API key if configured
    const apiKey = process.env.QUOTE_CARDS_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      const providedKey = req.headers.get("x-api-key");
      if (!providedKey) {
        return NextResponse.json(
          {
            error: "API key required",
            message: "Please include 'x-api-key' header with your request",
            hint: "Visit /api/quote-cards with GET method for documentation",
          },
          { status: 401 }
        );
      }
      if (providedKey !== apiKey) {
        return NextResponse.json(
          {
            error: "Invalid API key",
            message: "The provided API key does not match",
          },
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

    const {
      name,
      companyTitle,
      companyName,
      quoteContent,
      highlightWord = "",
      profileImage,
      fontSize,
      useAutoSize = true,
    } = body;

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

    // Create canvas
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, W, H);
    bgGradient.addColorStop(0, "#1a1a1a");
    bgGradient.addColorStop(1, "#000000");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // Draw lighting gradient overlay
    const lightGradient = ctx.createLinearGradient(W * 0.2, 0, W, 0);
    lightGradient.addColorStop(0, "rgba(95, 96, 95, 0)");
    lightGradient.addColorStop(0.3, "rgba(95, 96, 95, 0.1)");
    lightGradient.addColorStop(0.6, "rgba(95, 96, 95, 0.25)");
    lightGradient.addColorStop(0.8, "rgba(95, 96, 95, 0.4)");
    lightGradient.addColorStop(1, "rgba(95, 96, 95, 0.35)");
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, W, H);

    // Draw accent gradient
    const accentGradient = ctx.createLinearGradient(W * 0.4, 0, W, 0);
    accentGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    accentGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.03)");
    accentGradient.addColorStop(0.9, "rgba(255, 255, 255, 0.06)");
    accentGradient.addColorStop(1, "rgba(255, 255, 255, 0.04)");
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, W, H);

    // Draw gold vertical pattern
    ctx.strokeStyle = "#BEA152";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < W; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw quote text
    const quoteText = `"${clampedQuote.toUpperCase()}"`;
    const maxQuoteWidth = 1100;
    const optimalFontSize = fontSize || 58;
    
    ctx.font = `600 ${optimalFontSize}px Akkurat, Arial, sans-serif`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Wrap quote text
    const quoteLines = wrapText(ctx, quoteText, maxQuoteWidth);
    quoteLines.forEach((line, index) => {
      let currentX = padding;
      const words = line.split(" ");
      
      words.forEach((word) => {
        const shouldHighlight = wordsToHighlight.some(
          (hw) => word === hw || word.includes(hw) || hw.includes(word)
        );
        
        ctx.fillStyle = shouldHighlight ? "#BEA152" : "#FFFFFF";
        ctx.fillText(word, currentX, quoteY + index * optimalFontSize * 1.3);
        currentX += ctx.measureText(word + " ").width;
      });
    });

    // Calculate quote text height
    const quoteHeight = quoteLines.length * optimalFontSize * 1.3;
    const separatorY = quoteY + quoteHeight;

    // Draw gold separator line
    ctx.strokeStyle = "#BEA152";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, separatorY);
    ctx.lineTo(padding + 100, separatorY);
    ctx.stroke();

    // Draw name
    const nameY = separatorY + 45;
    ctx.font = "700 58px Akkurat, Arial, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(clampedName.toUpperCase(), padding, nameY);

    // Draw company title
    const titleY = nameY + 65;
    ctx.font = "400 36px Akkurat, Arial, sans-serif";
    ctx.fillStyle = "#BEA152";
    ctx.fillText(clampedCompanyTitle.toUpperCase(), padding, titleY);

    // Draw company name
    const companyY = titleY + 45;
    ctx.font = "400 36px Akkurat, Arial, sans-serif";
    ctx.fillStyle = "#BEA152";
    ctx.fillText(clampedCompanyName.toUpperCase(), padding, companyY);

    // Draw profile image if provided
    if (profileImage) {
      try {
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

        // Process profile image with sharp (resize, sharpen)
        const profileProcessed = await sharp(profileBuffer)
          .resize(Math.floor(imageWidth), null, { fit: "cover" })
          .sharpen({ sigma: 1.5, m1: 1.2, m2: 0.8 })
          .png()
          .toBuffer();

        // Load processed image into canvas
        const profileImg = await loadImage(profileProcessed);
        const scaledHeight = (profileImg.height / profileImg.width) * imageWidth;
        const x = W - imageWidth + 120;
        const y = H - scaledHeight * 0.8;

        ctx.drawImage(profileImg, x, y, imageWidth, scaledHeight);
      } catch (imageError) {
        console.error("Error loading profile image:", imageError);
        // Continue without profile image if it fails
      }
    }

    // Draw EMIR logo text
    ctx.font = "800 64px Akkurat, Arial, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("EMIR", W - 70, H - padding);

    // Check for JSON debug mode
    const url = new URL(req.url);
    const jsonMode = url.searchParams.get("json") === "1";

    if (jsonMode) {
      return NextResponse.json({
        ok: true,
        bytes: canvas.toBuffer("image/png").length,
        mime: "image/png",
        note: "binary omitted",
      });
    }

    // Return binary PNG
    const pngBuffer = canvas.toBuffer("image/png");
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
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
