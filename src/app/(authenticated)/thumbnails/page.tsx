'use client'

import { useState } from 'react'
import { ThumbnailEditor } from '../../../components/editors/thumbnail-editor'

export default function ThumbnailsPage() {
  const [selectedFormat, setSelectedFormat] = useState<'youtube' | 'youtube-1920x1080'>('youtube')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [title, setTitle] = useState<string>('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Thumbnail Creator</h1>
        <p className="mt-2 text-gray-600">
          Create engaging thumbnails for your content across different platforms
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedFormat('youtube')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFormat === 'youtube'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                YouTube
              </button>
              <button
                onClick={() => setSelectedFormat('youtube-1920x1080')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFormat === 'youtube-1920x1080'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                YouTube 1920x1080
              </button>
            </div>

            <ThumbnailEditor 
              format={selectedFormat}
              onPreviewUpdate={setPreviewUrl}
              onTitleUpdate={setTitle}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-gray-500 text-sm">Preview will appear here</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Dimensions</h3>
              <p className="text-sm text-gray-600">
                {selectedFormat === 'youtube' && '1280 x 720 pixels (16:9)'}
                {selectedFormat === 'youtube-1920x1080' && '1920 x 1080 pixels (16:9)'}
              </p>
            </div>

            {previewUrl && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `EMIR_Social-Media_Quote-Card_${title || 'Untitled'}_Q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}.png`
                    link.href = previewUrl
                    link.click()
                  }}
                  className="w-full px-4 py-2 bg-[#bea152] text-white rounded-md text-sm font-medium hover:bg-[#bea152]/90 transition-colors"
                >
                  Download Thumbnail
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 