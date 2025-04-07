'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { updates } from '@/lib/updates'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const latestUpdate = updates[0] // Get the most recent update

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
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
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
              href={`/updates/${latestUpdate.version}`}
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
        </div>
      )}
    </div>
  )
} 