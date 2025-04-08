'use client'

import { useState, useRef } from 'react'
import { ImageIcon, Type } from 'lucide-react'

interface ThumbnailEditorProps {
  format: 'youtube' | 'rapid-fire' | 'thought-leadership'
}

export function ThumbnailEditor({ format }: ThumbnailEditorProps) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getDimensions = () => {
    switch (format) {
      case 'youtube':
        return { width: 1280, height: 720 } // 16:9
      case 'rapid-fire':
        return { width: 1080, height: 1920 } // 9:16
      case 'thought-leadership':
        return { width: 1080, height: 1920 } // 9:16
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

      {/* Background Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Background Image
        </h3>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-400 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#bea152] transition-colors">
            {imagePreview ? (
              <div className={`relative w-full ${format === 'rapid-fire' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mb-2" />
                <span className="text-sm">Click to upload background image</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
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
              Title
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
              Subtitle
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