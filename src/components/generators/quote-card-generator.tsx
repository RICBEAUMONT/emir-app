/**
 * @file quote-card-generator.tsx
 * @version 1.3.2 - FINALIZED VERSION
 * @name Emir Executive Quote Card - LinkedIn Post Format [1920×1080]
 * @description A premium social media quote card generator designed for:
 * - LinkedIn posts and articles
 * - Executive thought leadership content
 * - Professional testimonials
 * - Conference and speaking engagement highlights
 * - Company announcements and milestones
 * 
 * Features professional typography, sophisticated lighting effects, and
 * elegant gold accents. Optimized for high-resolution displays and
 * social media sharing.
 * 
 * ⚠️ FINALIZED COMPONENT - DO NOT MODIFY WITHOUT APPROVAL ⚠️
 * Last updated: 2024-03-21
 * 
 * Key Settings (Carefully Tuned):
 * - Canvas: 1920x1080 (16:9 aspect ratio)
 * - Layout:
 *   • Left padding: 90px
 *   • Quote position: 14% from top
 *   • Text box width: 1100px (fixed)
 *   • Content width: 52% of canvas
 *   • Image width: 70% of canvas
 * 
 * Typography:
 * - Quote text: 600 weight, 78px-42px Akkurat (dynamic sizing)
 *   • Maximum: 78px for short quotes
 *   • Minimum: 42px for long quotes
 *   • Auto-adjusts to fit content within 1100px box
 * - Name: Bold, 58px Akkurat
 * - Company title/name: Normal, 36px Akkurat
 * - All text: Uppercase transformation
 * 
 * Spacing:
 * - Line height: 92px for quote text
 * - After quote: 0px (flush with line)
 * - After gold line: 45px
 * - After name: 65px
 * - After company title: 45px
 * 
 * Visual Elements:
 * - Background: Dark gradient (#1a1a1a to #000000)
 * - Gold accents: #BEA152 (separator line, highlighted words)
 * - Logo: 370px width, white color, 10px from bottom
 * - Profile image: 
 *   • Right-aligned, 70% of canvas width
 *   • Enhanced with subtle sharpening (3.0 center, -0.5 edges)
 *   • Shows 80% of height from bottom
 *   • 120px right offset for optimal framing
 * 
 * Image Processing:
 * - Sharpening: Convolution matrix for enhanced clarity
 *   • Center weight: 3.0 (strong enhancement)
 *   • Edge weights: -0.5 (moderate contrast)
 *   • Preserves natural look while improving definition
 * 
 * Lighting Effects:
 * - Main gradient: 20% start, peaks at 80% (rgba(95, 96, 95))
 * - Highlight accent: 40% start, white glow (0.03-0.06 opacity)
 * - Vertical pattern: Gold lines with 20px spacing
 * 
 * Colors:
 * - Primary text: White (#FFFFFF)
 * - Highlight/Accent: Gold (#BEA152)
 * - Background: Dark gradient (#1a1a1a to #000000)
 * 
 * @changelog
 * v1.3.2 - Extended font size range
 * - Increased maximum font size to 78px
 * - Adjusted line height scaling for larger fonts
 * - Optimized spacing for larger text
 * v1.3.1 - Fixed dynamic typography
 * - Fixed line height scaling calculation
 * - Improved text box height constraints
 * - Added debug logging for font sizing
 * v1.3.0 - Dynamic typography
 * - Added adaptive font sizing for quote text
 * - Implemented content-aware text box fitting
 * - Optimized line height calculations
 * v1.2.0 - Final optimization
 * - Enhanced profile images with strong sharpening
 * - Optimized image positioning and cropping
 * - Added detailed image processing documentation
 * v1.1.0 - Layout optimization
 * - Increased text box width to 1100px
 * - Expanded image width to 70% of canvas
 * - Adjusted content width to 52%
 * v1.0.0 - Initial release
 */

import React, { useEffect, useRef } from 'react'

/**
 * Props for the QuoteCardGenerator component
 * @interface QuoteCardGeneratorProps
 */
interface QuoteCardGeneratorProps {
  /** The name of the person being quoted */
  name: string
  /** The person's title within the company */
  companyTitle: string
  /** The name of the company */
  companyName: string
  /** The quote content to be displayed */
  quoteContent: string
  /** Comma-separated list of words to highlight in gold */
  highlightWord: string
  /** URL of the profile image (optional) */
  imageUrl: string | null
  /** Callback function that receives the generated quote card as a base64 string */
  onGenerated: (imageUrl: string) => void
  /** Optional fixed font size. If not provided, dynamic sizing will be used */
  fontSize?: number
  /** Whether to use auto-sizing (true) or fixed font size (false) */
  useAutoSize?: boolean
}

/**
 * Generates a professional quote card with customizable content and styling
 * @component
 */
export function QuoteCardGenerator({
  name,
  companyTitle,
  companyName,
  quoteContent,
  highlightWord,
  imageUrl,
  onGenerated,
  fontSize,
  useAutoSize,
}: QuoteCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateCard = async () => {
      console.log('Starting card generation...')
      const canvas = canvasRef.current
      if (!canvas) {
        console.error('Canvas element not found')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Could not get canvas context')
        return
      }

      // Set canvas size (1920x1080 for 16:9 aspect ratio)
      canvas.width = 1920
      canvas.height = 1080

      try {
        console.log('Loading images...')
        const loadProfileImage = imageUrl ? loadImage(imageUrl) : Promise.resolve(null)
        const [profileImage, logoImage] = await Promise.all([
          loadProfileImage,
          loadImage('/logo.png').catch(error => {
            console.error('Error loading logo:', error)
            return null
          }),
        ])

        // Constants for layout
        const padding = 90
        const contentWidth = canvas.width * 0.52 // Maintains 1100px text box width
        const imageWidth = canvas.width * 0.70 // Reduced from 0.75 to 0.70 for balanced image size

        console.log('Drawing background...')
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#1a1a1a')
        gradient.addColorStop(1, '#000000')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add sophisticated lighting gradient from right
        const overlayGradient = ctx.createLinearGradient(canvas.width * 0.2, 0, canvas.width, 0)
        overlayGradient.addColorStop(0, 'rgba(95, 96, 95, 0)') // Fully transparent
        overlayGradient.addColorStop(0.3, 'rgba(95, 96, 95, 0.1)') // Subtle start of light
        overlayGradient.addColorStop(0.6, 'rgba(95, 96, 95, 0.25)') // Building intensity
        overlayGradient.addColorStop(0.8, 'rgba(95, 96, 95, 0.4)') // Peak intensity
        overlayGradient.addColorStop(1, 'rgba(95, 96, 95, 0.35)') // Slight fade at edge
        ctx.fillStyle = overlayGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add a subtle highlight accent
        const accentGradient = ctx.createLinearGradient(canvas.width * 0.4, 0, canvas.width, 0)
        accentGradient.addColorStop(0, 'rgba(255, 255, 255, 0)') // Fully transparent
        accentGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)') // Very subtle white highlight
        accentGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.06)') // Peak highlight
        accentGradient.addColorStop(1, 'rgba(255, 255, 255, 0.04)') // Fade at edge
        ctx.fillStyle = accentGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add subtle pattern
        ctx.fillStyle = '#BEA152'
        ctx.globalAlpha = 0.03
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.fillRect(i, 0, 1, canvas.height)
        }
        ctx.globalAlpha = 1

        console.log('Drawing quote...')
        // Use installed fonts with fallbacks
        const titleFont = 'MillerBanner-Roman'
        const titleFontLight = 'MillerBanner-Light'
        const titleFontSemibold = 'MillerBanner-Semibold'
        const bodyFont = 'AkkRg_Pro_1'

        // Calculate text positioning
        const quoteY = canvas.height * 0.14 // Starting position of quote
        const logoY = canvas.height - padding // Logo position at bottom
        
        // Draw quote text and get its height
        const quote = quoteContent.toUpperCase()
        const wordsToHighlight = highlightWord
          .split(',')
          .map(word => word.trim().toUpperCase())
          .filter(word => word.length > 0) // Filter out empty strings
        
        // Text wrapping settings with dynamic font sizing
        const maxWidth = 1100 // Fixed text box width
        const maxFontSize = 78 // Maximum font size
        const minFontSize = 42 // Minimum font size
        const maxTextBoxHeight = canvas.height * 0.45 // Maximum height for text box (45% of canvas)
        const baseLineHeight = 1.3 // Line height as a multiplier of font size

        // Use fixed font size if provided and auto-size is disabled
        let optimalFontSize = fontSize || maxFontSize
        let finalLines: Array<{ text: string; x: number }> = []
        let finalLineHeight = Math.ceil(optimalFontSize * baseLineHeight) // Initialize with default

        if (useAutoSize !== false) {
          console.log('Using dynamic font sizing...')
          // Binary search for optimal font size
          let lowSize = minFontSize
          let highSize = maxFontSize
          
          while (lowSize <= highSize) {
            const testSize = Math.floor((lowSize + highSize) / 2)
            const lineHeight = Math.ceil(testSize * baseLineHeight)
            const metrics = calculateTextMetrics(ctx, quote, testSize, bodyFont, maxWidth, lineHeight)
            
            console.log(`Testing font size ${testSize}px - Height: ${metrics.totalHeight}px, Max: ${maxTextBoxHeight}px`)
            
            if (metrics.totalHeight <= maxTextBoxHeight) {
              optimalFontSize = testSize
              finalLines = metrics.lines
              finalLineHeight = lineHeight
              lowSize = testSize + 1
            } else {
              highSize = testSize - 1
            }
          }
          
          console.log(`Selected optimal font size: ${optimalFontSize}px`)
        } else {
          console.log('Using fixed font size:', fontSize)
          // Use provided font size
          finalLineHeight = Math.ceil(fontSize! * baseLineHeight)
          const metrics = calculateTextMetrics(ctx, quote, fontSize!, bodyFont, maxWidth, finalLineHeight)
          finalLines = metrics.lines
        }

        // Update current Y position based on optimal font size
        let currentY = quoteY
        
        // Draw each line with highlighted words using optimal font size
        finalLines.forEach((line, index) => {
          const lineY = currentY + (index * finalLineHeight)
          let currentX = line.x
          
          // Add opening quote to first line
          if (index === 0) {
            ctx.fillStyle = '#FFFFFF'
            ctx.font = `600 ${optimalFontSize}px "${bodyFont}", Arial, sans-serif`
            ctx.fillText('"', currentX, lineY)
            currentX += ctx.measureText('"').width
            line.text = line.text.trimStart()
          }
          
          // Process each word in the line
          const lineWords = line.text.split(' ')
          lineWords.forEach((word, wordIndex) => {
            const shouldHighlight = wordsToHighlight.some(hw => 
              word === hw ||
              word.includes(hw) ||
              hw.includes(word)
            )
            
            ctx.fillStyle = shouldHighlight ? '#BEA152' : '#FFFFFF'
            ctx.font = `600 ${optimalFontSize}px "${bodyFont}", Arial, sans-serif`
            ctx.fillText(word, currentX, lineY)
            
            if (wordIndex < lineWords.length - 1) {
              const spaceWidth = ctx.measureText(' ').width
              currentX += ctx.measureText(word).width + spaceWidth
            }
          })
          
          // Add closing quote to last line
          if (index === finalLines.length - 1) {
            const lastWordWidth = ctx.measureText(lineWords[lineWords.length - 1]).width
            ctx.fillStyle = '#FFFFFF'
            ctx.font = `600 ${optimalFontSize}px "${bodyFont}", Arial, sans-serif`
            ctx.fillText('"', currentX + lastWordWidth, lineY)
          }
        })

        // Calculate the total height of the quote text with optimal font size
        const textHeight = finalLines.length * finalLineHeight
        const spacingAfterQuote = 0 // No space between quote text and gold line

        // Draw the gold separator line between quote and name
        const separatorY = quoteY + textHeight + spacingAfterQuote
        ctx.beginPath()
        ctx.strokeStyle = '#BEA152'
        ctx.lineWidth = 2
        ctx.moveTo(padding, separatorY)
        ctx.lineTo(padding + 100, separatorY) // 100px wide line
        ctx.stroke()

        // Position name section below separator with consistent spacing
        const spacingAfterLine = 45 // 45px space after gold line
        const nameY = separatorY + spacingAfterLine
        const titleY = nameY + 65 // 65px space after name
        const companyNameY = titleY + 45 // 45px space after title

        // Draw name in Akkurat Bold
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold 58px "${bodyFont}", Arial, sans-serif`
        const nameFontMetrics = ctx.measureText(name.toUpperCase())
        ctx.fillText(name.toUpperCase(), padding, nameY + nameFontMetrics.actualBoundingBoxAscent)

        // Draw company title in medium size
        ctx.font = `normal 36px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const titleFontMetrics = ctx.measureText(companyTitle.toUpperCase())
        ctx.fillText(companyTitle.toUpperCase(), padding, titleY + titleFontMetrics.actualBoundingBoxAscent)

        // Draw company name in same size as title
        ctx.font = `normal 36px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const companyFontMetrics = ctx.measureText(companyName.toUpperCase())
        ctx.fillText(companyName.toUpperCase(), padding, companyNameY + companyFontMetrics.actualBoundingBoxAscent)

        console.log('Drawing profile image...')
        // Draw profile image if available
        if (profileImage) {
          // Calculate dimensions to maintain aspect ratio while fitting in the right side
          const targetWidth = imageWidth // Use the full width of the image area
          
          // Calculate scaling based on width
          const scale = targetWidth / profileImage.width
          
          // Calculate dimensions that maintain aspect ratio
          const scaledWidth = profileImage.width * scale
          const scaledHeight = profileImage.height * scale
          
          // Calculate position to align image to bottom-right
          const x = canvas.width - scaledWidth + 120 // Move 120px beyond the right edge
          const y = canvas.height - (scaledHeight * 0.8) // Show only 80% of the image height
          
          // Create a temporary canvas for sharpening
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (!tempCtx) {
            throw new Error('Could not get temp canvas context')
          }
          
          // Set temp canvas dimensions
          tempCanvas.width = scaledWidth
          tempCanvas.height = scaledHeight
          
          // Draw the scaled image on temp canvas
          tempCtx.drawImage(profileImage, 0, 0, scaledWidth, scaledHeight)
          
          // Apply sharpening effect
          const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight)
          const data = imageData.data
          const width = scaledWidth
          const height = scaledHeight
          
          // Sharpening convolution matrix (subtle effect)
          const weights = [
            0, -0.5, 0,
            -0.5, 3, -0.5,
            0, -0.5, 0
          ]
          
          // Create output array
          const output = new Uint8ClampedArray(data.length)
          
          // Apply convolution
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              for (let c = 0; c < 3; c++) {
                const i = (y * width + x) * 4 + c
                
                let sum = 0
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4 + c
                    sum += data[idx] * weights[(ky + 1) * 3 + (kx + 1)]
                  }
                }
                
                output[i] = sum
              }
              // Preserve alpha channel
              output[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3]
            }
          }
          
          // Copy edge pixels without processing
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                const i = (y * width + x) * 4
                output[i] = data[i]
                output[i + 1] = data[i + 1]
                output[i + 2] = data[i + 2]
                output[i + 3] = data[i + 3]
              }
            }
          }
          
          // Put the sharpened image data back
          const sharpenedImageData = new ImageData(output, width, height)
          tempCtx.putImageData(sharpenedImageData, 0, 0)
          
          // Draw the sharpened image on the main canvas
          ctx.drawImage(
            tempCanvas,
            x,
            y,
            scaledWidth,
            scaledHeight
          )
        }

        console.log('Drawing logo...')
        // Draw logo
        if (logoImage) {
          try {
            // Create a temporary canvas to modify the logo
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) {
              throw new Error('Could not get temp canvas context')
            }

            // Set dimensions for logo
            const logoWidth = 370 // Increased from 350 to 370
            const logoHeight = (logoImage.height * logoWidth) / logoImage.width
            
            tempCanvas.width = logoWidth
            tempCanvas.height = logoHeight
            
            // Draw original logo
            tempCtx.drawImage(logoImage, 0, 0, logoWidth, logoHeight)
            
            // Get image data
            const imageData = tempCtx.getImageData(0, 0, logoWidth, logoHeight)
            const data = imageData.data
            
            // Convert to white while preserving alpha
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) { // If pixel is not fully transparent
                data[i] = 255     // Red
                data[i + 1] = 255 // Green
                data[i + 2] = 255 // Blue
                // Alpha remains unchanged
              }
            }
            
            // Put the modified image data back
            tempCtx.putImageData(imageData, 0, 0)
            
            // Draw the white logo on the main canvas
            ctx.drawImage(
              tempCanvas,
              padding,
              logoY - logoHeight - 10, // Reduced padding from 20 to 10 to move logo down further
              logoWidth,
              logoHeight
            )
          } catch (logoError) {
            console.error('Error processing logo:', logoError)
          }
        }

        console.log('Generating final image...')
        // Generate final image
        const generatedImageUrl = canvas.toDataURL('image/png')
        onGenerated(generatedImageUrl)
        console.log('Card generation completed successfully')
      } catch (error) {
        console.error('Error generating quote card:', error)
        if (error instanceof Error) {
          console.error('Error details:', error.message)
          console.error('Error stack:', error.stack)
        }
      }
    }

    generateCard()
  }, [name, companyTitle, companyName, quoteContent, highlightWord, imageUrl, onGenerated, fontSize, useAutoSize])

  return <canvas ref={canvasRef} className="hidden" />
}

// Helper functions
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    // Only set crossOrigin for external URLs
    if (!src.startsWith('/')) {
      img.crossOrigin = 'anonymous'
    }
    
    img.onload = () => {
      console.log(`Image loaded successfully: ${src}`)
      resolve(img)
    }
    img.onerror = (error) => {
      console.error(`Error loading image ${src}:`, error)
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

// Helper function to calculate text metrics for a given font size
function calculateTextMetrics(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  fontFamily: string,
  maxWidth: number,
  lineHeight: number
): { lines: Array<{ text: string; x: number }>; totalHeight: number } {
  ctx.font = `600 ${fontSize}px "${fontFamily}", Arial, sans-serif`
  const words = text.split(' ')
  let currentLine = ''
  let lines: Array<{ text: string; x: number }> = []
  const padding = 90 // Consistent with layout settings

  words.forEach((word, index) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push({ text: currentLine, x: padding })
      currentLine = word
    } else {
      currentLine = testLine
    }

    if (index === words.length - 1) {
      lines.push({ text: currentLine, x: padding })
    }
  })

  return {
    lines,
    totalHeight: lines.length * lineHeight
  }
}