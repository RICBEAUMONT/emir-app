'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
]

export default function UpdateDetailPage() {
  const params = useParams()
  const version = params.version as string
  
  const update = updates.find(u => u.version === version)
  
  if (!update) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/updates"
          className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Updates
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">{update.title}</h1>
            <p className="mt-2 text-black/60">
              Version {update.version} • Released on {update.date}
            </p>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
            v{update.version}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Overview</h2>
          <p className="text-black/80 leading-relaxed">
            {update.description}
          </p>
        </div>

        {/* Changes Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Changes</h2>
          <ul className="space-y-3">
            {update.changes.map((change, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-black/80"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#bea152]" />
                <p className="leading-relaxed">{change}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 