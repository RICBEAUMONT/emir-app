'use client'

import { useState } from 'react'
import { ThumbnailEditor } from '../../../components/editors/thumbnail-editor'

export default function ThumbnailsPage() {
  const [selectedFormat, setSelectedFormat] = useState<'youtube' | 'rapid-fire' | 'thought-leadership'>('youtube')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Thumbnail Creator</h1>
        <p className="mt-2 text-gray-600">
          Create engaging thumbnails for your content across different platforms
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
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
                onClick={() => setSelectedFormat('rapid-fire')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFormat === 'rapid-fire'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                Rapid Fire
              </button>
              <button
                onClick={() => setSelectedFormat('thought-leadership')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFormat === 'thought-leadership'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                Thought Leadership
              </button>
            </div>

            <ThumbnailEditor format={selectedFormat} />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Preview will appear here</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Dimensions</h3>
              <p className="text-sm text-gray-600">
                {selectedFormat === 'youtube' && '1280 x 720 pixels (16:9)'}
                {selectedFormat === 'rapid-fire' && '1080 x 1920 pixels (9:16)'}
                {selectedFormat === 'thought-leadership' && '1080 x 1920 pixels (9:16)'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Best Practices</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {selectedFormat === 'youtube' && (
                  <>
                    <li>• Use bold, clear text that's readable at small sizes</li>
                    <li>• Include faces or close-up shots when relevant</li>
                    <li>• Use contrasting colors for better visibility</li>
                    <li>• Keep branding consistent across videos</li>
                  </>
                )}
                {selectedFormat === 'rapid-fire' && (
                  <>
                    <li>• Keep text concise and impactful</li>
                    <li>• Use high-energy or action shots</li>
                    <li>• Ensure text is easily readable</li>
                    <li>• Maintain consistent branding</li>
                  </>
                )}
                {selectedFormat === 'thought-leadership' && (
                  <>
                    <li>• Project professionalism and expertise</li>
                    <li>• Use sophisticated, clean imagery</li>
                    <li>• Keep text clear and authoritative</li>
                    <li>• Maintain professional branding</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 