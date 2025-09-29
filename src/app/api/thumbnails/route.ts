// app/api/thumbnails/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";           // ensure Node runtime (sharp won't run on edge)
export const maxDuration = 60;             // optional, avoid timeouts on Vercel
export const dynamic = "force-dynamic";    // optional, prevents caching of responses

function escapeForSVG(text: string) {
  return (text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function POST(req: NextRequest) {
  try {
    const { name, subtitle = "", backgroundImage } = await req.json();

    if (!name || !backgroundImage) {
      return NextResponse.json(
        { error: "Missing required fields: name and backgroundImage are required" },
        { status: 400 }
      );
    }

    // Fetch the background image (follow redirects)
    const resp = await fetch(backgroundImage, { redirect: "follow" });
    if (!resp.ok) {
      return NextResponse.json(
        { error: `Failed to fetch background image (${resp.status})` },
        { status: 400 }
      );
    }

    const ct = resp.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) {
      return NextResponse.json(
        { error: `URL is not an image. Content-Type received: ${ct}` },
        { status: 400 }
      );
    }

    const bg = Buffer.from(await resp.arrayBuffer());

    // Build overlay SVG
    const W = 1280, H = 720;
    const title = escapeForSVG(name);
    const sub   = escapeForSVG(subtitle);

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
          <text x="${W/2}" y="320" font-size="72" font-weight="800">${title.toUpperCase()}</text>
          ${sub ? `<text x="${W/2}" y="390" font-size="36" font-weight="500">${sub}</text>` : ""}
        </g>
        <rect x="0" y="${H-120}" width="${W}" height="120" fill="#c2a24d"/>
        <rect x="60" y="${H-120}" width="220" height="120" fill="#111"/>
        <text x="170" y="${H-45}" font-size="64" font-weight="800" fill="#fff" text-anchor="middle">EMIR</text>
      </svg>
    `;

    const png = await sharp(bg)
      .resize(W, H, { fit: "cover", position: "centre" })
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toBuffer();

    return new NextResponse(png, {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" }
    });
  } catch (e: any) {
    console.error("Thumbnail error:", e);
    return NextResponse.json(
      { error: "failed to render thumbnail", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
