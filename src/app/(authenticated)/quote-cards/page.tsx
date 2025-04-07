'use client'

import { QuoteCardEditor } from '@/components/editors/quote-card-editor'

export default function QuoteCardsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quote Cards</h1>
          <p className="text-sm text-gray-500">
            Create professional quote cards for your social media content
          </p>
        </div>
      </div>

      {/* Quote Card Editor */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <QuoteCardEditor onGenerate={(imageUrl: string) => {
          console.log('Generated image URL:', imageUrl)
        }} />
      </div>
    </div>
  )
} 