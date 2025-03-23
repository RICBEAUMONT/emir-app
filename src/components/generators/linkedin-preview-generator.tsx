/**
 * @file linkedin-preview-generator.tsx
 * @version 1.3.2 - FINALIZED VERSION
 * @name Emir Executive Quote Card - LinkedIn Preview Format [1200×628]
 * @description A premium LinkedIn-optimized quote card generator designed for:
 * - LinkedIn link preview images
 * - LinkedIn shared posts
 * - Company page updates
 * - Article covers
 * - Professional announcements
 * 
 * Features professional typography, sophisticated lighting effects, and
 * elegant gold accents. Optimized for LinkedIn's link preview format.
 * 
 * ⚠️ FINALIZED COMPONENT - DO NOT MODIFY WITHOUT APPROVAL ⚠️
 * Last updated: 2024-03-21
 * 
 * Key Settings:
 * - Canvas: 1200x628 (1.91:1 aspect ratio - LinkedIn optimal)
 * - Layout:
 *   • Left padding: 60px
 *   • Quote position: 16% from top
 *   • Text box width: 680px (fixed)
 *   • Content width: 52% of canvas
 *   • Image width: 65% of canvas
 * 
 * Typography:
 * - Quote text: 600 weight, 39px-28px Akkurat (dynamic sizing)
 *   • Maximum: 39px for short quotes
 *   • Minimum: 28px for long quotes
 *   • Auto-adjusts to fit content within 680px box
 * - Name: Bold, 34px Akkurat
 * - Company title/name: Normal, 24px Akkurat
 * - All text: Uppercase transformation
 * 
 * Spacing:
 * - Line height: 54px for quote text (scales with font size)
 * - After quote: 0px (flush with line)
 * - After gold line: 30px
 * - After name: 40px
 * - After company title: 30px
 * 
 * Visual Elements:
 * - Background: Dark gradient (#1a1a1a to #000000)
 * - Gold accents: #BEA152 (separator line, highlighted words)
 *   • Separator line: 100px width, 2px height
 * - Logo: 280px width, white color, 10px from bottom
 * - Profile image: 
 *   • Right-aligned, 65% of canvas width
 *   • Enhanced with subtle sharpening (2.0 center, -0.25 edges)
 *   • Shows 80% of height from bottom
 *   • 40px right offset for optimal framing
 * 
 * Image Processing:
 * - Sharpening: Convolution matrix for enhanced clarity
 *   • Center weight: 2.0 (moderate enhancement)
 *   • Edge weights: -0.25 (subtle contrast)
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
 * v1.3.2 - Font size optimization
 * - Set default font size to 39px
 * - Updated dynamic sizing range (39px-28px)
 * - Added separator line width specification
 * v1.3.1 - Extended font size range
 * - Increased maximum font size to 48px
 * - Adjusted line height scaling for larger fonts
 * - Optimized spacing for larger text
 * v1.3.0 - Dynamic typography implementation
 * - Added adaptive font sizing for quote text
 * - Implemented content-aware text box fitting
 * - Optimized line height calculations
 * v1.2.0 - Final optimization
 * - Enhanced profile images with subtle sharpening
 * - Optimized image positioning and cropping
 * - Adjusted name font size to 34px for better balance
 * v1.1.0 - Initial release with basic functionality
 */

import React, { useEffect, useRef } from 'react'

interface LinkedInPreviewGeneratorProps {
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

export function LinkedInPreviewGenerator({
  name,
  companyTitle,
  companyName,
  quoteContent,
  highlightWord,
  imageUrl,
  onGenerated,
  fontSize,
  useAutoSize,
}: LinkedInPreviewGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateCard = async () => {
      console.log('Starting LinkedIn preview card generation...')
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

      // Set canvas size (1200x628 for LinkedIn preview format)
      canvas.width = 1200
      canvas.height = 628

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
        const padding = 60
        const contentWidth = canvas.width * 0.52
        const imageWidth = canvas.width * 0.65

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#1a1a1a')
        gradient.addColorStop(1, '#000000')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add sophisticated lighting gradient from right
        const overlayGradient = ctx.createLinearGradient(canvas.width * 0.2, 0, canvas.width, 0)
        overlayGradient.addColorStop(0, 'rgba(95, 96, 95, 0)')
        overlayGradient.addColorStop(0.3, 'rgba(95, 96, 95, 0.1)')
        overlayGradient.addColorStop(0.6, 'rgba(95, 96, 95, 0.25)')
        overlayGradient.addColorStop(0.8, 'rgba(95, 96, 95, 0.4)')
        overlayGradient.addColorStop(1, 'rgba(95, 96, 95, 0.35)')
        ctx.fillStyle = overlayGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add subtle highlight accent
        const accentGradient = ctx.createLinearGradient(canvas.width * 0.4, 0, canvas.width, 0)
        accentGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
        accentGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)')
        accentGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.06)')
        accentGradient.addColorStop(1, 'rgba(255, 255, 255, 0.04)')
        ctx.fillStyle = accentGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add subtle pattern
        ctx.fillStyle = '#BEA152'
        ctx.globalAlpha = 0.03
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.fillRect(i, 0, 1, canvas.height)
        }
        ctx.globalAlpha = 1

        // Use installed fonts with fallbacks
        const bodyFont = 'AkkRg_Pro_1'
        const boldFont = 'AkkBd_Pro_1'

        // Calculate text positioning
        const quoteY = canvas.height * 0.16
        const logoY = canvas.height - padding

        // Draw quote text
        const quote = quoteContent.toUpperCase()
        const wordsToHighlight = highlightWord
          .split(',')
          .map(word => word.trim().toUpperCase())
          .filter(word => word.length > 0)

        // Text wrapping settings with dynamic font sizing
        const maxWidth = 680 // Fixed text box width
        const maxFontSize = 39 // Maximum font size (changed from 48px to 39px)
        const minFontSize = 28 // Minimum font size
        const maxTextBoxHeight = canvas.height * 0.45 // Maximum height for text box (45% of canvas)
        const baseLineHeight = 1.3 // Line height as a multiplier of font size

        // Use fixed font size if provided and auto-size is disabled
        let optimalFontSize = fontSize || maxFontSize // Will now default to 39px
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

        // Position name section
        const spacingAfterLine = 30
        const nameY = separatorY + spacingAfterLine
        const titleY = nameY + 40
        const companyNameY = titleY + 30

        // Draw name
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold 34px "${boldFont}", Arial, sans-serif`
        const nameFontMetrics = ctx.measureText(name.toUpperCase())
        ctx.fillText(name.toUpperCase(), padding, nameY + nameFontMetrics.actualBoundingBoxAscent)

        // Draw company title
        ctx.font = `normal 24px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const titleFontMetrics = ctx.measureText(companyTitle.toUpperCase())
        ctx.fillText(companyTitle.toUpperCase(), padding, titleY + titleFontMetrics.actualBoundingBoxAscent)

        // Draw company name
        ctx.font = `normal 24px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const companyFontMetrics = ctx.measureText(companyName.toUpperCase())
        ctx.fillText(companyName.toUpperCase(), padding, companyNameY + companyFontMetrics.actualBoundingBoxAscent)

        // Draw profile image if available
        if (profileImage) {
          const targetWidth = imageWidth
          
          // Calculate height that maintains aspect ratio
          const scale = targetWidth / profileImage.width
          const scaledWidth = targetWidth
          const scaledHeight = profileImage.height * scale
          
          // Create temporary canvas for image processing
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (!tempCtx) throw new Error('Could not get temp canvas context')
          
          tempCanvas.width = scaledWidth
          tempCanvas.height = scaledHeight
          
          // Draw image to temp canvas
          tempCtx.drawImage(profileImage, 0, 0, scaledWidth, scaledHeight)
          
          // Apply sharpening effect
          const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight)
          const data = imageData.data
          const width = scaledWidth
          const height = scaledHeight
          
          // Sharpening convolution matrix
          const weights = [
            0, -0.25, 0,
            -0.25, 2, -0.25,
            0, -0.25, 0
          ]
          
          // Create output array
          const output = new Uint8ClampedArray(data.length)
          
          // Apply convolution
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const offset = (y * width + x) * 4
              
              for (let c = 0; c < 3; c++) { // RGB channels
                let val = 0
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4 + c
                    val += data[idx] * weights[(ky + 1) * 3 + (kx + 1)]
                  }
                }
                output[offset + c] = val
              }
              output[offset + 3] = data[offset + 3] // Preserve alpha
            }
          }
          
          // Apply the sharpened data
          imageData.data.set(output)
          tempCtx.putImageData(imageData, 0, 0)
          
          // Position image at the bottom and offset down by 20% of its height
          const offset = 40 // Add 40px offset to the right
          const x = canvas.width - scaledWidth + offset
          const y = canvas.height - (scaledHeight * 0.8) // Move down by showing 80% of the image
          
          // Draw the sharpened image
          ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight)
        }

        // Draw logo
        if (logoImage) {
          try {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) throw new Error('Could not get temp canvas context')

            const logoWidth = 280
            const logoHeight = (logoImage.height * logoWidth) / logoImage.width

            tempCanvas.width = logoWidth
            tempCanvas.height = logoHeight
            tempCtx.drawImage(logoImage, 0, 0, logoWidth, logoHeight)

            const imageData = tempCtx.getImageData(0, 0, logoWidth, logoHeight)
            const data = imageData.data

            // Convert to white while preserving alpha
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) {
                data[i] = data[i + 1] = data[i + 2] = 255
              }
            }

            tempCtx.putImageData(imageData, 0, 0)

            ctx.drawImage(
              tempCanvas,
              padding,
              logoY - logoHeight - 10,
              logoWidth,
              logoHeight
            )
          } catch (logoError) {
            console.error('Error processing logo:', logoError)
          }
        }

        // Generate final image
        const generatedImageUrl = canvas.toDataURL('image/png')
        onGenerated(generatedImageUrl)
        console.log('LinkedIn preview card generation completed successfully')
      } catch (error) {
        console.error('Error generating LinkedIn preview card:', error)
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

// Helper function for loading images
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (!src.startsWith('/')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(new Error(`Failed to load image: ${src}`))
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
  const padding = 60 // Consistent with layout settings

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
    totalHeight: lines.length * (lineHeight * (fontSize / 42)) // Scale line height with font size
  }
} 