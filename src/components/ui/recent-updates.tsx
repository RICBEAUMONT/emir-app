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
        {recentUpdates.slice(0, 3).map((update, index) => (
          <Link
            key={`${update.hash}-${index}`}
            href={`/updates/${update.hash}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {update.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {update.date}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(update.type)}`}>
                {getTypeLabel(update.type)}
              </span>
            </div>
          </Link>
        ))}
        {recentUpdates.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No recent updates found.</p>
        )}
      </div>
    </div>
  )
}

export default RecentUpdates