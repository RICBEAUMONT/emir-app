import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subtitle, backgroundImage } = body

    // Validate required fields
    if (!name || !backgroundImage) {
      return NextResponse.json(
        { error: 'Missing required fields: name and backgroundImage are required' },
        { status: 400 }
      )
    }

    // Sanitize input text for SVG
    const sanitizeText = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    const sanitizedName = sanitizeText(name)
    const sanitizedSubtitle = subtitle ? sanitizeText(subtitle) : ''

    // Fetch background image
    const backgroundResponse = await fetch(backgroundImage)
    if (!backgroundResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch background image' },
        { status: 400 }
      )
    }

    const backgroundBuffer = await backgroundResponse.arrayBuffer()

    // Create SVG overlay
    const svgOverlay = `
      <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <!-- Semi-transparent black gradient overlay -->
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.7);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#gradient)" />
        
        <!-- Centered title -->
        <text x="640" y="300" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="72" font-weight="bold">
          ${sanitizedName.toUpperCase()}
        </text>
        
        <!-- Optional subtitle -->
        ${sanitizedSubtitle ? `
        <text x="640" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="normal">
          ${sanitizedSubtitle}
        </text>
        ` : ''}
        
        <!-- Bottom gold bar -->
        <rect x="0" y="620" width="1280" height="100" fill="#bea152" />
        
        <!-- EMIR text in black block on left -->
        <rect x="0" y="620" width="200" height="100" fill="black" />
        <text x="100" y="680" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
          EMIR
        </text>
      </svg>
    `

    // Process the image with sharp
    const processedImage = await sharp(Buffer.from(backgroundBuffer))
      .resize(1280, 720, {
        fit: 'cover',
        position: 'center'
      })
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toBuffer()

    // Return the PNG image
    return new NextResponse(processedImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': processedImage.length.toString()
      }
    })

  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during thumbnail generation' },
      { status: 500 }
    )
  }
}
