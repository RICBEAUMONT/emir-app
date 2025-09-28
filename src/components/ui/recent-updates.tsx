'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getRecentUpdates, GitUpdate } from '@/lib/git-updates'
import { useEffect, useState } from 'react'

const RecentUpdates = () => {
  const [recentUpdates, setRecentUpdates] = useState<GitUpdate[]>([])

  useEffect(() => {
    const fetchUpdates = async () => {
      const updates = await getRecentUpdates()
      setRecentUpdates(updates)
    }
    fetchUpdates()
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 text-blue-800'
      case 'bugfix': return 'bg-red-100 text-red-800'
      case 'enhancement': return 'bg-green-100 text-green-800'
      case 'initial': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'feature': return 'Feature'
      case 'bugfix': return 'Bug Fix'
      case 'enhancement': return 'Enhancement'
      case 'initial': return 'Initial'
      default: return 'Update'
    }
  }

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
        {recentUpdates.map((update, index) => (
          <Link
            key={`${update.hash}-${index}`}
            href={`/updates/${update.hash}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {update.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(update.type)}`}>
                    {getTypeLabel(update.type)}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
                    v{update.version}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {update.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{update.date}</span>
                  <span>by {update.author}</span>
                  <span className="font-mono">{update.hash}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentUpdates