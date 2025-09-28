'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { getRecentUpdates, GitUpdate } from '@/lib/git-updates'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [latestUpdate, setLatestUpdate] = useState<GitUpdate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestUpdate = async () => {
      try {
        console.log('NotificationBell: Fetching latest update...')
        const updates = await getRecentUpdates(1)
        console.log('NotificationBell: Received updates:', updates)
        if (updates.length > 0) {
          setLatestUpdate(updates[0])
          console.log('NotificationBell: Set latest update:', updates[0])
        } else {
          console.log('NotificationBell: No updates found')
        }
      } catch (error) {
        console.error('NotificationBell: Error fetching updates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestUpdate()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.notification-dropdown')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative notification-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {latestUpdate && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Loading updates...</p>
            </div>
          ) : latestUpdate ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Latest Update</h3>
                <span className="px-2 py-1 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
                  v{latestUpdate.version}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{latestUpdate.title}</p>
              <p className="text-xs text-gray-500 mb-3">{latestUpdate.description}</p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/updates/${latestUpdate.hash}`}
                  className="text-sm text-[#bea152] hover:text-[#bea152]/80"
                  onClick={() => setIsOpen(false)}
                >
                  View Details
                </Link>
                <Link
                  href="/updates"
                  className="text-sm text-gray-500 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  All Updates
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No updates available</p>
              <Link
                href="/updates"
                className="text-sm text-[#bea152] hover:text-[#bea152]/80 mt-2 inline-block"
                onClick={() => setIsOpen(false)}
              >
                View All Updates
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 