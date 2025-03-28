'use client'

import Link from 'next/link'
import { ArrowRight, Bell } from 'lucide-react'

interface Update {
  version: string
  date: string
  title: string
}

const recentUpdates: Update[] = [
  {
    version: "1.1.0",
    date: "2024-03-21",
    title: "UI Enhancement Update"
  },
  {
    version: "1.0.0",
    date: "2024-03-20",
    title: "Initial Release"
  }
]

export function UpdatesWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#bea152]" />
            <h2 className="font-medium text-black">Recent Updates</h2>
          </div>
          <Link
            href="/updates"
            className="text-sm text-[#bea152] hover:text-[#bea152]/80 flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {recentUpdates.map((update) => (
          <Link
            key={update.version}
            href="/updates"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="text-sm font-medium text-black">
                {update.title}
              </h3>
              <p className="text-xs text-black/60 mt-0.5">
                Version {update.version} • {update.date}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
              v{update.version}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
} 