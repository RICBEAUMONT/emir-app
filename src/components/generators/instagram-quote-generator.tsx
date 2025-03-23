/**
 * @file instagram-quote-generator.tsx
 * @version 1.2.1 - FINALIZED VERSION
 * @name Emir Executive Quote Card - Instagram Format [1080×1350]
 * @description A premium Instagram-optimized quote card generator designed for:
 * - Instagram posts and stories
 * - Executive thought leadership content
 * - Professional testimonials
 * - Conference and speaking engagement highlights
 * - Company announcements and milestones
 * 
 * Features professional typography, sophisticated lighting effects, and
 * elegant gold accents. Optimized for Instagram's vertical format.
 * 
 * Key Settings:
 * - Canvas: 1080x1350 (4:5 aspect ratio - Instagram optimal)
 * - Layout:
 *   • Left/Right padding: 80px
 *   • Quote position: 12% from top
 *   • Content width: 500px (660px - 80px*2 padding)
 * 
 * Typography:
 * - Quote text: 600 weight, 70px-42px Akkurat (dynamic sizing)
 *   • Maximum: 70px for short quotes
 *   • Minimum: 42px for long quotes
 *   • Auto-adjusts to fit content within 500px box
 * - Name: Akkurat Bold, 42px, bold weight
 * - Company title/name: Akkurat Regular, 28px
 * - All text: Uppercase transformation
 * 
 * Spacing:
 * - Line height: 72px for quote text
 * - After quote: 0px (flush with line)
 * - After gold line: 35px
 * - After name: 45px
 * - After company title: 35px
 * 
 * Visual Elements:
 * - Background: Dark gradient from #1a1a1a to #000000
 * - Accent: Gold separator line (80px width)
 * - Logo: 450px width, white color, 20px from bottom
 * - Profile image: 
 *   • Full height, right-aligned with 22.5% crop
 *   • Enhanced with subtle sharpening (2.2 center, -0.3 edges)
 *   • Diagonal gradient overlay from bottom-left (75% black) to center (transparent)
 * 
 * Image Processing:
 * - Sharpening: Convolution matrix for enhanced clarity
 *   • Center weight: 2.2 (moderate enhancement)
 *   • Edge weights: -0.3 (subtle contrast)
 *   • Preserves natural look while improving definition
 * 
 * Gradient Overlay:
 * - Diagonal fade from bottom-left to center
 * - Opacity levels:
 *   • Bottom-left: 75% black
 *   • Middle: 45% black
 *   • Center: Fully transparent
 * - Ensures text readability while preserving image visibility
 * 
 * Colors:
 * - Primary text: White (#FFFFFF)
 * - Highlight/Accent: Gold (#BEA152)
 * - Background: Dark gradient (#1a1a1a to #000000)
 * 
 * @changelog
 * v1.2.1 - Extended font size range
 * - Increased maximum font size to 70px
 * - Adjusted line height scaling for larger fonts
 * - Optimized spacing for larger text
 * v1.2.0 - Added image processing and gradient overlay
 * - Enhanced profile images with subtle sharpening
 * - Added diagonal gradient overlay for better text contrast
 * - Optimized image positioning and cropping
 * v1.1.0 - Initial release with basic functionality
 */

import React, { useEffect, useRef } from 'react'

interface InstagramQuoteGeneratorProps {
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

export function InstagramQuoteGenerator({
  name,
  companyTitle,
  companyName,
  quoteContent,
  highlightWord,
  imageUrl,
  onGenerated,
  fontSize,
  useAutoSize,
}: InstagramQuoteGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateCard = async () => {
      console.log('Starting Instagram card generation...')
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

      // Set canvas size (1080x1350 for Instagram's 4:5 aspect ratio)
      canvas.width = 1080
      canvas.height = 1350

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
        const padding = {
          left: 80,
          right: 120 // Increased from 80px to 120px
        }
        const contentWidth = 660 // Total content width
        const maxWidth = contentWidth - (padding.left + padding.right) // Effective text box width
        const imageHeight = canvas.height * 0.4 // 40% of height for image

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#1a1a1a')
        gradient.addColorStop(1, '#000000')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add sophisticated lighting gradient
        const overlayGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
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

        // Draw profile image if available (in front of gradients)
        if (profileImage) {
          // Use full canvas height
          const targetHeight = canvas.height
          
          // Calculate width that maintains aspect ratio
          const scale = targetHeight / profileImage.height
          const scaledWidth = profileImage.width * scale
          const scaledHeight = targetHeight

          // Move image right (will crop part of the image)
          const offset = scaledWidth * 0.225 // Changed from 0.25 to 0.225 (22.5% instead of 25%)
          const x = canvas.width - scaledWidth + offset
          const y = 0 // Start from top

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
          
          // Sharpening convolution matrix (stronger effect for Instagram)
          const weights = [
            0, -0.3, 0,
            -0.3, 2.2, -0.3,
            0, -0.3, 0
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

          // Draw the sharpened image
          ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight)

          // Add diagonal black gradient overlay
          const overlayGradient = ctx.createLinearGradient(
            x, // start x: left edge of image
            y + scaledHeight, // start y: bottom of image
            x + (scaledWidth * 0.5), // end x: center of image
            y + (scaledHeight * 0.5) // end y: center of image
          )
          overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)') // Bottom-left: 75% black
          overlayGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)') // Mid: 45% black
          overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0)') // Center: fully transparent

          ctx.fillStyle = overlayGradient
          ctx.fillRect(x, y, scaledWidth, scaledHeight)
        }

        // Use installed fonts with fallbacks
        const bodyFont = 'AkkRg_Pro_1'
        const boldFont = 'AkkBd_Pro_1'

        // Calculate text positioning
        const quoteY = canvas.height * 0.12 // Starting position of quote
        const logoY = canvas.height - padding.left // Logo position at bottom

        // Update text metrics calculation
        const calculateTextMetrics = (
          ctx: CanvasRenderingContext2D,
          text: string,
          fontSize: number,
          fontFamily: string,
          maxWidth: number,
          lineHeight: number
        ): { lines: Array<{ text: string; x: number }>; totalHeight: number } => {
          ctx.font = `600 ${fontSize}px "${fontFamily}", Arial, sans-serif`
          const words = text.split(' ')
          let currentLine = ''
          let lines: Array<{ text: string; x: number }> = []

          words.forEach((word, index) => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word
            const metrics = ctx.measureText(testLine)

            if (metrics.width > maxWidth && currentLine !== '') {
              lines.push({ text: currentLine, x: padding.left })
              currentLine = word
            } else {
              currentLine = testLine
            }

            if (index === words.length - 1) {
              lines.push({ text: currentLine, x: padding.left })
            }
          })

          return {
            lines,
            totalHeight: lines.length * lineHeight
          }
        }

        // Draw quote text
        const quote = quoteContent.toUpperCase()
        const wordsToHighlight = highlightWord
          .split(',')
          .map(word => word.trim().toUpperCase())
          .filter(word => word.length > 0)

        // Text wrapping settings with dynamic font sizing
        const maxFontSize = 70
        const minFontSize = 42
        const maxTextBoxHeight = canvas.height * 0.45
        const baseLineHeight = 1.3

        // Use fixed font size if provided and auto-size is disabled
        let optimalFontSize = fontSize || maxFontSize
        let finalLines: Array<{ text: string; x: number }> = []
        let finalLineHeight = Math.ceil(optimalFontSize * baseLineHeight)

        if (useAutoSize !== false) {
          console.log('Using dynamic font sizing...')
          let lowSize = minFontSize
          let highSize = maxFontSize
          
          while (lowSize <= highSize) {
            const testSize = Math.floor((lowSize + highSize) / 2)
            const lineHeight = Math.ceil(testSize * baseLineHeight)
            const metrics = calculateTextMetrics(ctx, quote, testSize, bodyFont, maxWidth, lineHeight)
            
            if (metrics.totalHeight <= maxTextBoxHeight) {
              optimalFontSize = testSize
              finalLines = metrics.lines
              finalLineHeight = lineHeight
              lowSize = testSize + 1
            } else {
              highSize = testSize - 1
            }
          }
        } else {
          finalLineHeight = Math.ceil(fontSize! * baseLineHeight)
          const metrics = calculateTextMetrics(ctx, quote, fontSize!, bodyFont, maxWidth, finalLineHeight)
          finalLines = metrics.lines
        }

        // Update current Y position based on optimal font size
        let currentY = quoteY

        // Draw each line with highlighted words
        finalLines.forEach((line, index) => {
          const lineY = currentY + (index * finalLineHeight)
          let currentX = line.x

          // Add opening quote to first line
          if (index === 0) {
            ctx.fillStyle = '#FFFFFF'
            ctx.font = `600 62px "${boldFont}", Arial, sans-serif`
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
            ctx.font = `600 ${optimalFontSize}px "${boldFont}", Arial, sans-serif`
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
            ctx.font = `600 ${optimalFontSize}px "${boldFont}", Arial, sans-serif`
            ctx.fillText('"', currentX + lastWordWidth, lineY)
          }
        })

        // Calculate text block height and position separator
        const textHeight = finalLines.length * finalLineHeight
        const separatorY = quoteY + textHeight
        
        // Draw gold separator line
        ctx.beginPath()
        ctx.strokeStyle = '#BEA152'
        ctx.lineWidth = 2
        ctx.moveTo(padding.left, separatorY)
        ctx.lineTo(padding.left + 80, separatorY)
        ctx.stroke()

        // Position name section
        const spacingAfterLine = 35
        const nameY = separatorY + spacingAfterLine
        const titleY = nameY + 45
        const companyNameY = titleY + 35

        // Draw name
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold 42px "${boldFont}", Arial, sans-serif`
        const nameFontMetrics = ctx.measureText(name.toUpperCase())
        ctx.fillText(name.toUpperCase(), padding.left, nameY + nameFontMetrics.actualBoundingBoxAscent)

        // Draw company title
        ctx.font = `normal 28px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const titleFontMetrics = ctx.measureText(companyTitle.toUpperCase())
        ctx.fillText(companyTitle.toUpperCase(), padding.left, titleY + titleFontMetrics.actualBoundingBoxAscent)

        // Draw company name
        ctx.font = `normal 28px "${bodyFont}", Arial, sans-serif`
        ctx.fillStyle = '#BEA152'
        const companyFontMetrics = ctx.measureText(companyName.toUpperCase())
        ctx.fillText(companyName.toUpperCase(), padding.left, companyNameY + companyFontMetrics.actualBoundingBoxAscent)

        // Draw logo
        if (logoImage) {
          try {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) throw new Error('Could not get temp canvas context')

            const logoWidth = 450
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
              padding.left,
              logoY - logoHeight - 20,
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
        console.log('Instagram card generation completed successfully')
      } catch (error) {
        console.error('Error generating Instagram quote card:', error)
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