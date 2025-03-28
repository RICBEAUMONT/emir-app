'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Update {
  version: string
  date: string
  title: string
}

// Get the most recent update from our updates data
const getLatestUpdate = (): Update => ({
  version: "1.2.0",
  date: "2024-03-22",
  title: "Updates System & Navigation Enhancement"
})

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasViewedUpdate, setHasViewedUpdate] = useState(false)
  const latestUpdate = getLatestUpdate()
  
  // Check if update has been viewed on component mount
  useEffect(() => {
    const viewedVersion = localStorage.getItem('lastViewedUpdate')
    setHasViewedUpdate(viewedVersion === latestUpdate.version)
  }, [latestUpdate.version])
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.notification-dropdown')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const handleUpdateClick = () => {
    localStorage.setItem('lastViewedUpdate', latestUpdate.version)
    setHasViewedUpdate(true)
    setIsOpen(false)
  }

  return (
    <div className="relative notification-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative"
        title="Updates"
      >
        <Bell className="h-5 w-5" />
        {!hasViewedUpdate && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-[#bea152] rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-black">Latest Update</h3>
          </div>
          
          <Link
            href={`/updates/${latestUpdate.version}`}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            onClick={handleUpdateClick}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-black">
                  {latestUpdate.title}
                </p>
                <p className="text-xs text-black/60 mt-0.5">
                  Version {latestUpdate.version} • {latestUpdate.date}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full flex-shrink-0">
                v{latestUpdate.version}
              </span>
            </div>
          </Link>

          <div className="px-4 py-2 border-t border-gray-100">
            <Link
              href="/updates"
              className="text-sm text-[#bea152] hover:text-[#bea152]/80 transition-colors"
              onClick={handleUpdateClick}
            >
              View all updates
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 