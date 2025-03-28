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

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const updates: Update[] = [
  {
    version: "1.1.3",
    date: formatDate(new Date()),
    title: "User Management & Activity Tracking",
    description: "Enhanced user management system with real-time activity tracking and improved role management.",
    changes: [
      "Added real-time user activity tracking with last seen timestamps",
      "Implemented user roles with visual badges (admin, moderator, user)",
      "Enhanced user profile pages with activity statistics",
      "Added middleware for automatic activity tracking",
      "Improved user list with search functionality",
      "Added profile images support with fallback icons",
      "Implemented proper date formatting across the platform"
    ]
  },
  {
    version: "1.1.2",
    date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
    title: "Updates System & Security Enhancement",
    description: "Comprehensive updates tracking system and important security improvements.",
    changes: [
      "Added detailed individual update pages for each version",
      "Enhanced updates list with interactive cards and hover effects",
      "Implemented version-based navigation between updates",
      "Added two-factor authentication support",
      "Enhanced password hashing algorithm",
      "Implemented rate limiting for API endpoints",
      "Added session management improvements",
      "Fixed potential XSS vulnerabilities",
      "Updated security headers configuration"
    ]
  },
  {
    version: "1.1.0",
    date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)), // 14 days ago
    title: "Performance & UI Optimization",
    description: "Major performance improvements and UI/UX enhancements across the platform.",
    changes: [
      "Optimized database queries for faster data loading",
      "Improved caching mechanism for frequently accessed data",
      "Fixed memory leaks in long-running sessions",
      "Enhanced error handling and logging",
      "Reduced bundle size for faster initial load",
      "Implemented lazy loading for heavy components",
      "Fixed UI rendering issues in dark mode",
      "Improved form validation feedback",
      "Enhanced mobile responsiveness",
      "Added loading states for better feedback",
      "Fixed alignment issues in tables",
      "Improved error message clarity",
      "Added tooltips for better feature discovery"
    ]
  },
  {
    version: "1.0.0",
    date: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)), // 21 days ago
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