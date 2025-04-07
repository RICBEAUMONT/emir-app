'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { updates } from '@/lib/updates'

interface Update {
  version: string
  date: string
  title: string
  description: string
}

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get recent updates from our updates data
const getRecentUpdates = () => {
  return updates.slice(0, 2) // Get the two most recent updates
}

const RecentUpdates = () => {
  const recentUpdates = getRecentUpdates()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
          <Link 
            href="/updates" 
            className="text-sm text-[#bea152] hover:text-[#bea152]/80 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {recentUpdates.map((update) => (
          <Link
            key={update.version}
            href={`/updates/${update.version}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {update.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
                    v{update.version}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {update.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {update.date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentUpdates 