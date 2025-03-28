'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Update {
  version: string
  date: string
  title: string
  description: string
  changes: string[]
}

const updates: Update[] = [
  {
    version: "1.2.0",
    date: "2024-03-22",
    title: "Updates System Enhancement",
    description: "Implemented a comprehensive updates tracking system with detailed version history pages and improved navigation.",
    changes: [
      "Added detailed individual update pages for each version",
      "Enhanced updates list with interactive cards and hover effects",
      "Implemented version-based navigation between updates",
      "Added 'more changes' preview functionality",
      "Improved text contrast and readability across updates pages",
      "Added back navigation for better user experience"
    ]
  },
  {
    version: "1.1.0",
    date: "2024-03-21",
    title: "UI Enhancement Update",
    description: "Major improvements to the user interface and experience",
    changes: [
      "New light theme implementation",
      "Enhanced login page design",
      "Improved navigation experience",
      "Added remember me functionality",
      "Updates tracking system"
    ]
  },
  {
    version: "1.0.0",
    date: "2024-03-20",
    title: "Initial Release",
    description: "First release of EMIR - Social Media Asset Manager",
    changes: [
      "User authentication and authorization",
      "Dashboard layout and navigation",
      "Quote cards creation interface",
      "User management system",
      "Profile settings"
    ]
  }
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function UpdatesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Updates & Changes</h1>
        <p className="mt-2 text-black/70">Track all updates and improvements to the platform</p>
      </div>

      <div className="space-y-6">
        {updates.map((update, index) => (
          <Link
            key={update.version}
            href={`/updates/${update.version}`}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:border-[#bea152]/20 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-black group-hover:text-[#bea152] transition-colors">
                      {update.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-black/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#bea152]" />
                  </div>
                  <p className="mt-1 text-sm text-black/60">
                    Version {update.version} • {update.date}
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
                <h3 className="text-sm font-medium text-black mb-3">Changes:</h3>
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
  )
} 