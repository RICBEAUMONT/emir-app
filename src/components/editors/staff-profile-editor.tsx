'use client'

import { useState, useRef, useEffect } from 'react'
import { ImageIcon, Type, X } from 'lucide-react'

interface StaffProfileEditorProps {
  onPreviewUpdate?: (previewUrls: { standard: string; square: string }) => void
  onNameUpdate?: (name: string) => void
  onQuarterUpdate?: (quarter: string) => void
  onYearUpdate?: (year: string) => void
}

export function StaffProfileEditor({ onPreviewUpdate, onNameUpdate, onQuarterUpdate, onYearUpdate }: StaffProfileEditorProps) {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [name, setName] = useState<string>('')
  const [quarter, setQuarter] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const standardCanvasRef = useRef<HTMLCanvasElement>(null)
  const squareCanvasRef = useRef<HTMLCanvasElement>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files) // Debug log
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      console.log('Valid image file selected:', file.name) // Debug log
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log('File reader completed') // Debug log
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('Invalid file type or no file selected') // Debug log
    }
  }

  const updatePreviews = async () => {
    // Update standard profile (400x450)
    const standardCanvas = standardCanvasRef.current
    if (!standardCanvas) return
    const standardCtx = standardCanvas.getContext('2d')
    if (!standardCtx) return

    // Set high DPI for crisp rendering
    const dpr = window.devicePixelRatio || 1
    standardCanvas.width = 400 * dpr
    standardCanvas.height = 450 * dpr
    standardCanvas.style.width = '400px'
    standardCanvas.style.height = '450px'
    standardCtx.scale(dpr, dpr)

    // Draw gradient background
    const standardGradient = standardCtx.createLinearGradient(0, 450, 400, 0)
    standardGradient.addColorStop(0, '#000000')
    standardGradient.addColorStop(1, '#282828')
    standardCtx.fillStyle = standardGradient
    standardCtx.fillRect(0, 0, 400, 450)

    // Draw image if available
    if (imagePreview) {
      const img = new Image()
      img.src = imagePreview
      await new Promise((resolve) => {
        img.onload = () => {
          // Calculate dimensions to fit image nicely - even larger beyond canvas
          const targetWidth = 450 // Increased beyond canvas width (400px)
          const scale = targetWidth / img.width
          const scaledHeight = img.height * scale

          // Center the image (extends further beyond canvas edges)
          const x = (400 - targetWidth) / 2 - 10 // Moved left slightly
          const y = 20 // Moved up slightly

          // Add camera raw filter effects for sharp, crisp image
          standardCtx.filter = 'contrast(1.3) saturate(1.2) brightness(1.1) sharpness(2)'
          
          // Add drop shadow aligned with gradient light direction - more visible
          standardCtx.shadowColor = 'rgba(0, 0, 0, 0.7)'
          standardCtx.shadowBlur = 25
          standardCtx.shadowOffsetX = -12 // Shadow to the left (opposite of light)
          standardCtx.shadowOffsetY = 12 // Shadow downward (opposite of light)

          // Draw image with camera raw filter and drop shadow
          standardCtx.drawImage(img, x, y, targetWidth, scaledHeight)
          
          // Reset filter and shadow properties
          standardCtx.filter = 'none'
          standardCtx.shadowColor = 'transparent'
          standardCtx.shadowBlur = 0
          standardCtx.shadowOffsetX = 0
          standardCtx.shadowOffsetY = 0
          resolve(null)
        }
        img.onerror = () => resolve(null)
      })
    }

    // Draw EMIR logo at bottom
    // Logo removed as requested

    // Update square profile (1440x1440)
    const squareCanvas = squareCanvasRef.current
    if (!squareCanvas) return
    const squareCtx = squareCanvas.getContext('2d')
    if (!squareCtx) return

    // Set high DPI for crisp rendering
    squareCanvas.width = 1440 * dpr
    squareCanvas.height = 1440 * dpr
    squareCanvas.style.width = '1440px'
    squareCanvas.style.height = '1440px'
    squareCtx.scale(dpr, dpr)

    // Draw gradient background
    const squareGradient = squareCtx.createLinearGradient(0, 1440, 1440, 0)
    squareGradient.addColorStop(0, '#000000')
    squareGradient.addColorStop(1, '#282828')
    squareCtx.fillStyle = squareGradient
    squareCtx.fillRect(0, 0, 1440, 1440)

    // Draw image if available
    if (imagePreview) {
      const img = new Image()
      img.src = imagePreview
      await new Promise((resolve) => {
        img.onload = () => {
          // Calculate dimensions to fit image nicely in square - increased size for 1440x1440
          const targetSize = 1350 // Increased for larger canvas
          const scale = targetSize / Math.max(img.width, img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale

          // Center the image
          const x = (1440 - scaledWidth) / 2 - 50 // Moved left slightly
          const y = 120 // Moved down slightly

          // Add camera raw filter effects for sharp, crisp image
          squareCtx.filter = 'contrast(1.3) saturate(1.2) brightness(1.1) sharpness(2)'
          
          // Add drop shadow aligned with gradient light direction
          squareCtx.shadowColor = 'rgba(0, 0, 0, 0.7)'
          squareCtx.shadowBlur = 25
          squareCtx.shadowOffsetX = -12 // Shadow to the left (opposite of light)
          squareCtx.shadowOffsetY = 12 // Shadow downward (opposite of light)

          // Draw image with camera raw filter and drop shadow
          squareCtx.drawImage(img, x, y, scaledWidth, scaledHeight)
          
          // Reset filter and shadow properties
          squareCtx.filter = 'none'
          squareCtx.shadowColor = 'transparent'
          squareCtx.shadowBlur = 0
          squareCtx.shadowOffsetX = 0
          squareCtx.shadowOffsetY = 0
          resolve(null)
        }
        img.onerror = () => resolve(null)
      })
    }

    // Draw EMIR logo in top right corner
    if (logoImage) {
      const logoWidth = 340 // Max width of 340px
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth // Maintain aspect ratio
      const logoX = 1440 - logoWidth - 70 // 70px from right edge
      const logoY = 100 // 100px from top edge

      squareCtx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight)
    }

    // Update parent with both preview URLs
    onPreviewUpdate?.({
      standard: standardCanvas.toDataURL('image/png'),
      square: squareCanvas.toDataURL('image/png')
    })
  }

  useEffect(() => {
    // Load EMIR logo
    const img = new Image()
    img.onload = () => {
      setLogoImage(img)
    }
    img.src = '/emir-logo-white.png'
  }, [])

  useEffect(() => {
    updatePreviews()
    onNameUpdate?.('')
  }, [imagePreview, logoImage])

  // Update preview immediately when component mounts
  useEffect(() => {
    updatePreviews()
  }, [])


  return (
    <div className="space-y-6">
      {/* Hidden canvases for generation */}
      <canvas
        ref={standardCanvasRef}
        className="hidden"
        style={{ filter: 'contrast(1.2) saturate(1.1) brightness(1.05) drop-shadow(0 0 1px rgba(0,0,0,0.3))' }}
      />
      <canvas
        ref={squareCanvasRef}
        className="hidden"
        style={{ filter: 'contrast(1.2) saturate(1.1) brightness(1.05) drop-shadow(0 0 1px rgba(0,0,0,0.3))' }}
      />

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            onNameUpdate?.(e.target.value)
          }}
          placeholder="Enter name for file labeling"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bea152] focus:border-transparent"
        />
      </div>

      {/* Quarter Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Quarter</label>
        <select
          value={quarter}
          onChange={(e) => {
            setQuarter(e.target.value)
            onQuarterUpdate?.(e.target.value)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bea152] focus:border-transparent"
        >
          <option value="">Select Quarter</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
      </div>

      {/* Year Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="text"
          value={year}
          onChange={(e) => {
            setYear(e.target.value)
            onYearUpdate?.(e.target.value)
          }}
          placeholder="e.g., 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bea152] focus:border-transparent"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
        
        {/* Simple file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#bea152] file:text-white hover:file:bg-[#bea152]/90"
        />
        
        {/* Preview area */}
        {imagePreview && (
          <div className="mt-4">
            <img 
              src={imagePreview} 
              alt="Profile Preview" 
              className="mx-auto h-32 w-auto object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowPreviewModal(true)}
            />
            <p className="text-center text-xs text-gray-500 mt-2">Click image to view full size</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showPreviewModal && imagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-8 right-0 text-white hover:text-gray-200"
              onClick={() => setShowPreviewModal(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img src={imagePreview} alt="Full size preview" className="max-w-full max-h-[90vh]" />
          </div>
        </div>
      )}
    </div>
  )
}
