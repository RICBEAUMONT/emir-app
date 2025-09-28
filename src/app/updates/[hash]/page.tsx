'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function UpdatePage() {
  const params = useParams()
  const hash = params.hash as string

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/updates"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Updates
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Update Details
        </h1>
        <p className="text-gray-600 mb-4">
          Hash: {hash}
        </p>
        <p className="text-gray-500">
          This is a test page to verify routing works.
        </p>
      </div>
    </div>
  )
}