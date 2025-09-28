'use client'

import { useState } from 'react'
import { EmailSignatureEditor } from '@/components/editors/email-signature-editor'

export default function EmailSignaturesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<'professional' | 'minimal'>('professional')
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Email Signatures</h1>
          <p className="text-sm text-gray-500">
            Create professional EMIR email signatures with company branding and contact information
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedTemplate('professional')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTemplate === 'professional'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => setSelectedTemplate('minimal')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTemplate === 'minimal'
                    ? 'bg-[#bea152] text-white border border-[#bea152]'
                    : 'border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                Minimal
              </button>
            </div>

            <EmailSignatureEditor 
              template={selectedTemplate} 
              onPreviewUpdate={setPreviewHtml} 
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live Preview
                    </h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] border">
              <div 
                className="max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-500 text-sm">Live preview updates as you type...</p>' }}
              />
            </div>

            {previewHtml && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(previewHtml)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy HTML
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([previewHtml], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'email-signature.html'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#bea152] hover:bg-[#bea152]/90 text-white rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download HTML
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
