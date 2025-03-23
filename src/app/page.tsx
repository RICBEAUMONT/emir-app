'use client'

import { QuoteCardEditor } from '@/components/editors/quote-card-editor'
import { HeroHeader } from '@/components/hero-header'

export default function Home() {
  return (
    <div className="-mt-12">
      <HeroHeader />
      <div className="container mx-auto px-4 py-12">
        <QuoteCardEditor onGenerate={(imageUrl: string) => {
          console.log('Generated image URL:', imageUrl)
        }} />
      </div>
    </div>
  )
}
