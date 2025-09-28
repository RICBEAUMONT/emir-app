'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllUpdates, GitUpdate } from '@/lib/git-updates'
import { useEffect, useState } from 'react'

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<GitUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true)
        const allUpdates = await getAllUpdates()
        setUpdates(allUpdates)
      } catch (error) {
        console.error('Error fetching updates:', error)
      } finally {
        setLoading(false)
      }
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

  const groupUpdatesByDate = (updates: GitUpdate[]) => {
    const groups: { [key: string]: GitUpdate[] } = {}

    updates.forEach(update => {
      const updateDate = new Date(update.date)
      const dateKey = updateDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(update)
    })

    // Sort groups by date (newest first)
    return Object.entries(groups).sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }

  return (
    <div>
      <div className="mb-8">
                <h1 className="text-2xl font-semibold text-black">App Updates</h1>
                <p className="mt-2 text-black/70">Track all updates and improvements to the platform</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Loading updates...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groupUpdatesByDate(updates).map(([groupName, groupUpdates]) => (
            <div key={groupName}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{groupName}</h2>
                <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                  {groupUpdates.length} update{groupUpdates.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              <div className="space-y-4">
                {groupUpdates.map((update, index) => (
                  <Link
                    key={`${update.hash}-${index}`}
                    href={`/updates/${update.hash}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:border-[#bea152]/20 hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-black group-hover:text-[#bea152] transition-colors">
                              {update.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(update.type)}`}>
                              {getTypeLabel(update.type)}
                            </span>
                            <ArrowRight className="h-4 w-4 text-black/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#bea152]" />
                          </div>
                          <p className="text-sm text-black/60 mb-2">
                            Version {update.version} • {update.date} • by {update.author}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            Commit: {update.hash}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
                          v{update.version}
                        </span>
                      </div>

                      <p className="mt-4 text-black/80">
                        {update.description}
                      </p>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-black mb-3">Changes:</h4>
                        <ul className="space-y-2">
                          {update.changes.slice(0, 3).map((change, changeIndex) => (
                            <li
                              key={changeIndex}
                              className="flex items-start gap-2 text-sm text-black/70"
                            >
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#bea152]" />
                              {change}
                            </li>
                          ))}
                          {update.changes.length > 3 && (
                            <li className="text-sm text-[#bea152] group-hover:text-[#bea152]/80">
                              +{update.changes.length - 3} more changes...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}