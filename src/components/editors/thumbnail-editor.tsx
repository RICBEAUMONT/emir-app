'use client'

import { useState, useRef, useEffect } from 'react'
import { ImageIcon, Type, X } from 'lucide-react'

interface ThumbnailEditorProps {
  format: 'youtube'
  onPreviewUpdate?: (previewUrl: string) => void
  onTitleUpdate?: (title: string) => void
}

export function ThumbnailEditor({ format, onPreviewUpdate, onTitleUpdate }: ThumbnailEditorProps) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  const getDimensions = () => {
    switch (format) {
      case 'youtube':
        return { width: 1280, height: 720 } // 16:9
      default:
        return { width: 1280, height: 720 }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const updatePreview = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dimensions = getDimensions()
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Draw black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw image for YouTube format
    if (imagePreview && format === 'youtube') {
      const img = new Image()
      img.src = imagePreview
      await new Promise((resolve) => {
        img.onload = () => {
          // Calculate dimensions to fit image on the right side
          const targetWidth = canvas.width * 0.65 // 65% of canvas width (increased from 60%)
          const scale = targetWidth / img.width
          const scaledHeight = img.height * scale

          // Position image on the right side
          const x = canvas.width - targetWidth - 50 // 50px padding from right (moved further to the right)
          const y = (canvas.height - scaledHeight) / 2 + 50 // Move down by 50px (increased from 30px)
          
          ctx.drawImage(
            img,
            x,
            y,
            targetWidth,
            scaledHeight
          )
          resolve(null)
        }
      })
    } else if (imagePreview) {
      // Original image handling for other formats
      const img = new Image()
      img.src = imagePreview
      await new Promise((resolve) => {
        img.onload = () => {
          const scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
          )
          const x = (canvas.width - img.width * scale) * 0.5
          const y = (canvas.height - img.height * scale) * 0.5
          ctx.drawImage(
            img,
            x,
            y,
            img.width * scale,
            img.height * scale
          )
          resolve(null)
        }
      })
    }

    if (format === 'youtube') {
      // Add semi-transparent overlay only on the left side for YouTube
      const gradientWidth = canvas.width * 0.6
      const gradient = ctx.createLinearGradient(0, 0, gradientWidth, 0)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, gradientWidth, canvas.height)

      // Draw black box in top left for "SUCCESSFUL PERSPECTIVES"
      ctx.fillStyle = '#231f20'
      const boxWidth = 620
      const boxHeight = 215
      const boxX = 70  // Left margin
      const boxY = 144 // Top margin
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

      // Draw "SUCCESSFUL PERSPECTIVES" text
      const perspectivesText = "SUCCESSFUL\nPERSPECTIVES"
      const perspectivesLines = perspectivesText.split('\n')
      const fontSize = Math.floor(boxHeight * 0.3) // Adjust font size to fit box
      ctx.font = `bold ${fontSize}px "Akkurat", sans-serif`
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Calculate center of box with new position
      const boxCenterX = boxX + (boxWidth / 2)
      const boxCenterY = boxY + (boxHeight / 2) + 10 // Move down by 10px
      const lineHeight = fontSize * 1.2
      const totalTextHeight = lineHeight * perspectivesLines.length
      const startY = boxCenterY - (totalTextHeight / 2) + fontSize / 2

      // Draw each line of text centered
      perspectivesLines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        ctx.fillText(line.toUpperCase(), boxCenterX, y)
      })

      // Draw gold bar at bottom
      const goldBarWidth = 870
      const barHeight = 125
      const rightPadding = 70
      const bottomPadding = 22
      const goldBarX = canvas.width - goldBarWidth - rightPadding // Position with 70px padding from right
      ctx.fillStyle = '#bea152'
      ctx.fillRect(goldBarX, canvas.height - barHeight - bottomPadding, goldBarWidth, barHeight)

        // Draw title in center of gold bar
        if (title) {
          const titleSize = 58 // 58pt font size
          ctx.font = `600 ${titleSize}px "Akkurat", sans-serif`
          ctx.fillStyle = '#211e28'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.letterSpacing = '-30px'
          
          // Center the title in the gold bar
          const titleX = goldBarX + goldBarWidth / 2
          const titleY = canvas.height - barHeight / 2 - bottomPadding - 15 // Move up by 15px
          
          ctx.fillText(title, titleX, titleY)
        }

      // Draw grey bar (smaller, separate bar)
      const greyBarWidth = 280
      const greyLeftPadding = 70
      const greyBarX = greyLeftPadding // Position with 70px padding from left
      ctx.fillStyle = '#231f20' // Same color as "SUCCESSFUL PERSPECTIVES" box
      ctx.fillRect(greyBarX, canvas.height - barHeight - bottomPadding, greyBarWidth, barHeight)

      // Draw EMIR logo in center of grey bar
      if (logoImage) {
        const logoWidth = 230
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth // Maintain aspect ratio
        const logoX = greyBarX + (greyBarWidth - logoWidth) / 2 // Center horizontally in grey bar
        const logoY = canvas.height - barHeight - bottomPadding + (barHeight - logoHeight) / 2 // Center vertically in grey bar
        
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight)
      }

      // Draw subtitle in gold bar
      if (subtitle) {
        const subtitleSize = 20 // 20pt font size
        ctx.font = `${subtitleSize}px "Akkurat", sans-serif`
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Center the subtitle in the gold bar, positioned below the title
        const subtitleX = goldBarX + goldBarWidth / 2
        const subtitleY = canvas.height - barHeight / 2 - bottomPadding + 30 // Move down slightly more
        
        ctx.fillText(subtitle, subtitleX, subtitleY)
      }
    } else {
      // Original handling for other formats
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const titleSize = Math.floor(canvas.height * 0.1)
      ctx.font = `bold ${titleSize}px Inter, sans-serif`
      const titleY = canvas.height * 0.4
      
      const words = title.split(' ')
      let lines = []
      let currentLine = ''
      const maxWidth = canvas.width * 0.8

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) {
        lines.push(currentLine)
      }

      lines.forEach((line, index) => {
        const y = titleY + (index - lines.length/2) * titleSize * 1.2
        ctx.fillText(line, canvas.width/2, y)
      })

      if (subtitle) {
        const subtitleSize = Math.floor(canvas.height * 0.05)
        ctx.font = `${subtitleSize}px Inter, sans-serif`
        ctx.fillText(subtitle, canvas.width/2, canvas.height * 0.7)
      }
    }

    // Update preview
    onPreviewUpdate?.(canvas.toDataURL('image/png'))
  }

  // Load EMIR logo
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setLogoImage(img)
    }
    img.src = '/emir-logo-white.png'
  }, [])

  useEffect(() => {
    updatePreview()
    onTitleUpdate?.(title)
  }, [title, subtitle, imagePreview, format, logoImage])

  // Update preview immediately when component mounts
  useEffect(() => {
    updatePreview()
  }, [])

  const generateThumbnail = async () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dimensions = getDimensions()
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Draw black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw image
    if (imagePreview) {
      const img = new Image()
      img.src = imagePreview
      await new Promise((resolve) => {
        img.onload = () => {
          // Calculate dimensions to maintain aspect ratio and cover the canvas
          let scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
          )
          
          // For YouTube format, make the image smaller
          if (format === 'youtube') {
            scale = Math.min(
              (canvas.width * 0.8) / img.width,  // 80% of canvas width
              (canvas.height * 0.8) / img.height  // 80% of canvas height
            )
          }

          const x = (canvas.width - img.width * scale) * 0.5
          const y = (canvas.height - img.height * scale) * 0.5
          ctx.drawImage(
            img,
            x,
            y,
            img.width * scale,
            img.height * scale
          )
          resolve(null)
        }
      })
    }

    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set text properties
    ctx.fillStyle = '#FFFFFF' // Always white text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Title
    const titleSize = Math.floor(canvas.height * 0.1) // 10% of height
    ctx.font = `bold ${titleSize}px Inter, sans-serif`
    const titleY = canvas.height * 0.4
    
    // Word wrap title
    const words = title.split(' ')
    let lines = []
    let currentLine = ''
    const maxWidth = canvas.width * 0.8 // 80% of canvas width

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }

    // Draw title lines
    lines.forEach((line, index) => {
      const y = titleY + (index - lines.length/2) * titleSize * 1.2
      ctx.fillText(line, canvas.width/2, y)
    })

    // Draw subtitle
    if (subtitle) {
      const subtitleSize = Math.floor(canvas.height * 0.05) // 5% of height
      ctx.font = `${subtitleSize}px Inter, sans-serif`
      ctx.fillText(subtitle, canvas.width/2, canvas.height * 0.7)
    }

    // Offer download
    const link = document.createElement('a')
    link.download = `thumbnail-${format}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Hidden canvas for generation */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Preview Modal */}
      {showPreviewModal && imagePreview && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Background Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Background Image
        </h3>
        <div className="flex items-center justify-center w-full">
          <div className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-400 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#bea152] transition-colors">
            {imagePreview ? (
              <div 
                className={`relative w-full ${format === 'rapid-fire' ? 'aspect-[9/16]' : 'aspect-video'}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowPreviewModal(true)
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg cursor-zoom-in"
                />
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mb-2" />
              </>
            )}
            <label className="cursor-pointer">
              <span className="text-sm text-[#bea152] hover:text-[#bea152]/80 mt-2">
                {imagePreview ? 'Click to change image' : 'Click to upload background image'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Type className="h-4 w-4" />
          Text
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title & Company Name
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter subtitle (optional)"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => {
            setTitle('')
            setSubtitle('')
            setImage(null)
            setImagePreview(null)
          }}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-[#bea152] border border-[#bea152] rounded-md text-sm font-medium text-white hover:bg-[#bea152]/90 transition-colors"
          onClick={generateThumbnail}
          disabled={!image || !title}
        >
          Generate Thumbnail
        </button>
      </div>
    </div>
  )
} 