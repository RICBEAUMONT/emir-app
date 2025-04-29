'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '../ui/button'
import { ImagePlus, Download, Info } from 'lucide-react'
import { QuoteCardGenerator } from '../generators/quote-card-generator'
import { InstagramQuoteGenerator } from '../generators/instagram-quote-generator'
import { LinkedInPreviewGenerator } from '../generators/linkedin-preview-generator'
import { Tooltip } from '../ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

type QuoteFormat = 'linkedin-post' | 'linkedin-preview' | 'instagram'

interface FormData {
  quoteContent: string;
  highlightWord: string;
  name: string;
  companyTitle: string;
  companyName: string;
  fontSize: number;
  useAutoSize: boolean;
  image?: File | null;
}

interface QuoteCardEditorProps {
  onGenerate?: (imageUrl: string) => void;
}

const getDefaultFontSize = (format: QuoteFormat): number => {
  switch (format) {
    case 'linkedin-post':
      return 70;
    case 'linkedin-preview':
      return 39;
    case 'instagram':
      return 56;
    default:
      return 70;
  }
};

const getFontSizeRange = (format: QuoteFormat) => {
  switch (format) {
    case 'linkedin-post':
      return { min: 42, max: 78 };
    case 'linkedin-preview':
      return { min: 28, max: 39 };
    case 'instagram':
      return { min: 42, max: 70 };
    default:
      return { min: 42, max: 78 };
  }
};

export function QuoteCardEditor({ onGenerate }: QuoteCardEditorProps) {
  const [formData, setFormData] = React.useState<FormData>({
    quoteContent: '',
    highlightWord: '',
    name: '',
    companyTitle: '',
    companyName: '',
    fontSize: 70,
    useAutoSize: true,
    image: null
  })

  const [selectedFormat, setSelectedFormat] = React.useState<QuoteFormat>('linkedin-post')
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [generatedCard, setGeneratedCard] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [shouldGenerate, setShouldGenerate] = useState(false)

  const isFormValid = Boolean(
    formData.name &&
    formData.companyTitle &&
    formData.quoteContent &&
    formData.highlightWord &&
    imagePreview
  )

  // Auto-generate when form is valid or when any input changes
  useEffect(() => {
    if (!isFormValid || isGenerating) return;

    const timeoutId = setTimeout(() => {
      setShouldGenerate(true);
      setIsGenerating(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    isFormValid,
    isGenerating,
    formData.quoteContent,
    formData.highlightWord,
    formData.name,
    formData.companyTitle,
    formData.companyName,
    formData.fontSize,
    formData.useAutoSize,
    selectedFormat,
    imagePreview
  ]);

  // Handle format change
  const handleFormatChange = (format: QuoteFormat) => {
    setSelectedFormat(format)
    setFormData(prev => ({
      ...prev,
      fontSize: getDefaultFontSize(format)
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }

  // Effect to handle card generation
  useEffect(() => {
    if (!shouldGenerate || !isFormValid) return

    let isMounted = true
    let root: ReturnType<typeof createRoot> | null = null
    let container: HTMLDivElement | null = null

    const cleanup = () => {
      if (root) {
        try {
          root.unmount()
        } catch (error) {
          console.error('Error unmounting root:', error)
        }
      }
      if (container && document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }

    const generateCard = async () => {
      try {
        // Create a hidden container for the generator
        container = document.createElement('div')
        container.style.display = 'none'
        document.body.appendChild(container)

        const props = {
          name: formData.name,
          companyTitle: formData.companyTitle,
          companyName: formData.companyName,
          quoteContent: formData.quoteContent,
          highlightWord: formData.highlightWord,
          imageUrl: imagePreview || '',
          onGenerated: (cardUrl: string) => {
            if (!isMounted) return
            setGeneratedCard(cardUrl)
            setIsGenerating(false)
            setShouldGenerate(false)
            if (onGenerate) {
              onGenerate(cardUrl)
            }
            // Clean up after successful generation
            setTimeout(cleanup, 0)
          },
          fontSize: formData.fontSize,
          useAutoSize: formData.useAutoSize
        }

        // Create and render the generator component
        let generator
        switch (selectedFormat) {
          case 'linkedin-post':
            generator = <QuoteCardGenerator {...props} />
            break
          case 'linkedin-preview':
            generator = <LinkedInPreviewGenerator {...props} />
            break
          case 'instagram':
            generator = <InstagramQuoteGenerator {...props} />
            break
        }

        if (generator && container) {
          root = createRoot(container)
          root.render(generator)
        }
      } catch (error) {
        console.error('Error generating card:', error)
        if (isMounted) {
          setIsGenerating(false)
          setShouldGenerate(false)
        }
        cleanup()
      }
    }

    generateCard()

    return () => {
      isMounted = false
      cleanup()
    }
  }, [shouldGenerate, formData, imagePreview, onGenerate, selectedFormat, isFormValid])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setGeneratedCard(null)
    setShouldGenerate(true)
  }

  const handleDownload = () => {
    if (generatedCard) {
      const link = document.createElement('a')
      link.href = generatedCard
      const format = selectedFormat === 'linkedin-post' ? 'linkedin' : 
                    selectedFormat === 'linkedin-preview' ? 'linkedin-preview' : 
                    'instagram'
      link.download = `quote-card-${format}-${formData.name.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            Format
            <Tooltip content="Select the social media platform and format for your quote card">
              <Info className="h-4 w-4 text-gray-500" />
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => handleFormatChange('linkedin-post')}
              variant="outline"
              className={`flex-1 min-w-[200px] transition-colors ${
                selectedFormat === 'linkedin-post' 
                  ? 'bg-[#bea152] text-white border-[#bea152] hover:bg-[#bea152] hover:text-white hover:border-[#bea152]' 
                  : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              LinkedIn Post (1920×1080)
            </Button>
            <Button
              type="button"
              onClick={() => handleFormatChange('linkedin-preview')}
              variant="outline"
              className={`flex-1 min-w-[200px] transition-colors ${
                selectedFormat === 'linkedin-preview' 
                  ? 'bg-[#bea152] text-white border-[#bea152] hover:bg-[#bea152] hover:text-white hover:border-[#bea152]' 
                  : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              LinkedIn Preview (1200×628)
            </Button>
            <Button
              type="button"
              onClick={() => handleFormatChange('instagram')}
              variant="outline"
              className={`flex-1 min-w-[200px] transition-colors ${
                selectedFormat === 'instagram' 
                  ? 'bg-[#bea152] text-white border-[#bea152] hover:bg-[#bea152] hover:text-white hover:border-[#bea152]' 
                  : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              Instagram (1080×1350)
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Content
                  <Tooltip content="Enter the quote and attribution details">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quoteContent">Quote Content</Label>
                  <Textarea
                    id="quoteContent"
                    rows={4}
                    placeholder="Enter your quote here..."
                    value={formData.quoteContent}
                    onChange={(e) => updateFormData({ quoteContent: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlightWord" className="flex items-center gap-2">
                    Words to Highlight
                    <Tooltip content="Separate multiple words with commas">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Tooltip>
                  </Label>
                  <input
                    type="text"
                    id="highlightWord"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g., GRATITUDE, LOVE, PEACE"
                    value={formData.highlightWord}
                    onChange={(e) => updateFormData({ highlightWord: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Attribution
                  <Tooltip content="Enter the details of the person being quoted">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter person's name"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyTitle">Company Title</Label>
                  <input
                    id="companyTitle"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter company title"
                    value={formData.companyTitle}
                    onChange={(e) => updateFormData({ companyTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <input
                    id="companyName"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => updateFormData({ companyName: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image & Typography */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Profile Image
                  <Tooltip content="Upload a professional headshot (recommended)">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center rounded-lg border-2 border-dashed border-muted p-6 transition-colors hover:border-primary">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-64 w-48 object-cover rounded-lg transition-all duration-300 ease-in-out"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImagePlus className="h-8 w-8 text-white" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-12 w-12 text-muted-foreground" />
                          <span className="mt-2 block text-sm font-medium">
                            Upload a photo
                          </span>
                        </div>
                      </label>
                    )}
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Professional headshot recommended (PNG, JPG)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Typography
                  <Tooltip content="Adjust text size and auto-sizing settings">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="useAutoSize" className="font-medium">Auto-size Text</Label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.useAutoSize}
                    onClick={(e) => {
                      e.preventDefault();
                      updateFormData({ useAutoSize: !formData.useAutoSize });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      formData.useAutoSize ? 'bg-[#bea152]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      formData.useAutoSize ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className={formData.useAutoSize ? 'opacity-50 pointer-events-none' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">Font Size: {formData.fontSize}px</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFormData({ fontSize: getDefaultFontSize(selectedFormat) })}
                      className="h-8 text-xs"
                    >
                      Reset
                    </Button>
                  </div>
                  <input
                    type="range"
                    min={getFontSizeRange(selectedFormat).min}
                    max={getFontSizeRange(selectedFormat).max}
                    value={formData.fontSize}
                    onChange={(e) => updateFormData({ fontSize: parseInt(e.target.value) })}
                    className="w-full"
                    disabled={formData.useAutoSize}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: {getFontSizeRange(selectedFormat).min}px - {getFontSizeRange(selectedFormat).max}px
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              {generatedCard && (
                <Button
                  type="button"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Quote Card
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {generatedCard && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={generatedCard}
                alt="Generated quote card"
                className="w-full rounded-lg transition-all duration-300 ease-in-out"
              />
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
} 