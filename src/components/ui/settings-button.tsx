'use client'

import { Settings } from 'lucide-react'
import Link from 'next/link'

export function SettingsButton() {
  return (
    <Link
      href="/profile"
      className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
      title="Profile Settings"
    >
      <Settings className="h-5 w-5" />
    </Link>
  )
} 