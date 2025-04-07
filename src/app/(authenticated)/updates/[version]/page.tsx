'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code2, FileCode2, Users2, AlertCircle } from 'lucide-react'

interface Update {
  version: string
  date: string
  title: string
  description: string
  changes: string[]
  technical_details?: {
    affected_components: string[]
    breaking_changes?: string[]
    dependencies_updated?: { name: string; version: string }[]
    migration_notes?: string[]
  }
  contributors?: string[]
  type: 'feature' | 'enhancement' | 'bugfix' | 'initial'
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
    type: "feature",
    changes: [
      "Added real-time user activity tracking with last seen timestamps",
      "Implemented user roles with visual badges (admin, moderator, user)",
      "Enhanced user profile pages with activity statistics",
      "Added middleware for automatic activity tracking",
      "Improved user list with search functionality",
      "Added profile images support with fallback icons",
      "Implemented proper date formatting across the platform"
    ],
    technical_details: {
      affected_components: [
        "src/app/(authenticated)/users/page.tsx",
        "src/app/(authenticated)/users/[id]/page.tsx",
        "src/middleware.ts",
        "src/components/ui/notification-bell.tsx",
        "src/app/(authenticated)/updates/page.tsx",
        "src/app/(authenticated)/updates/[version]/page.tsx"
      ],
      breaking_changes: [],
      dependencies_updated: [],
      migration_notes: [
        "New last_seen_at column added to profiles table",
        "Role column added to profiles table with default value 'user'",
        "Activity tracking middleware requires no configuration",
        "All changes are backwards compatible"
      ]
    },
    contributors: [
      "Ricardo Beaumont"
    ]
  },
  {
    version: "1.1.2",
    date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
    title: "Updates System & Security Enhancement",
    description: "Comprehensive updates tracking system and important security improvements.",
    type: "feature",
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
    ],
    technical_details: {
      affected_components: [
        "src/app/(authenticated)/updates/[version]/page.tsx",
        "src/app/(authenticated)/updates/page.tsx",
        "src/components/ui/updates-widget.tsx",
        "src/components/ui/sidebar.tsx",
        "src/middleware.ts",
        "src/lib/auth.ts"
      ],
      breaking_changes: [],
      dependencies_updated: [],
      migration_notes: [
        "Two-factor authentication requires database schema update",
        "Rate limiting configuration added to environment variables",
        "Security headers updated in next.config.js",
        "All changes are backwards compatible"
      ]
    },
    contributors: [
      "Ricardo Beaumont"
    ]
  },
  {
    version: "1.1.0",
    date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)), // 14 days ago
    title: "Performance & UI Optimization",
    description: "Major performance improvements and UI/UX enhancements across the platform.",
    type: "enhancement",
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
    ],
    technical_details: {
      affected_components: [
        "src/app/layout.tsx",
        "src/app/(authenticated)/layout.tsx",
        "src/app/landing/page.tsx",
        "src/components/ui/*",
        "src/lib/db.ts",
        "src/lib/cache.ts"
      ],
      breaking_changes: [],
      dependencies_updated: [
        { name: "next", version: "14.1.0" },
        { name: "react", version: "18.2.0" }
      ],
      migration_notes: [
        "New caching configuration required",
        "Database indexes added for performance",
        "Bundle optimization requires no manual changes",
        "All changes are backwards compatible"
      ]
    },
    contributors: [
      "Ricardo Beaumont"
    ]
  },
  {
    version: "1.0.0",
    date: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)), // 21 days ago
    title: "Initial Release",
    type: "initial",
    description: "First release of EMIR - Social Media Asset Manager",
    changes: [
      "User authentication and authorization",
      "Dashboard layout and navigation",
      "Quote cards creation interface",
      "User management system",
      "Profile settings"
    ],
    technical_details: {
      affected_components: [
        "Initial codebase setup",
        "All core components and pages"
      ],
      dependencies_updated: [
        { name: "next", version: "14.1.0" },
        { name: "@supabase/ssr", version: "latest" },
        { name: "tailwindcss", version: "3.4.1" }
      ]
    },
    contributors: [
      "Ricardo Beaumont"
    ]
  },
  {
    version: "unreleased",
    date: formatDate(new Date()),
    title: "Supabase Client Migration & Bug Fixes",
    description: "Updated Supabase client implementation and fixed various issues.",
    type: "enhancement",
    changes: [
      "Migrated from @supabase/auth-helpers-nextjs to @supabase/ssr",
      "Fixed font loading issues with proper format support",
      "Resolved Turbopack-related compilation errors",
      "Improved error handling in authentication flow",
      "Enhanced middleware configuration",
      "Updated environment variable handling",
      "Fixed CSS optimization warnings"
    ],
    technical_details: {
      affected_components: [
        "src/app/(authenticated)/layout.tsx",
        "src/app/(authenticated)/users/page.tsx",
        "src/app/(authenticated)/users/[id]/page.tsx",
        "src/app/(authenticated)/profile/page.tsx",
        "src/components/ui/dashboard-stats.tsx",
        "src/components/ui/admin-panel.tsx",
        "src/components/ui/admin-user-info.tsx",
        "src/components/ui/sidebar.tsx",
        "src/components/ui/sign-out-button.tsx",
        "src/components/ui/user-profile.tsx",
        "src/middleware.ts",
        "src/app/globals.css",
        "next.config.js"
      ],
      breaking_changes: [],
      dependencies_updated: [
        { name: "@supabase/ssr", version: "latest" }
      ],
      migration_notes: [
        "Supabase client initialization now requires explicit URL and anon key",
        "All authentication helpers have been updated to use the new package",
        "No database schema changes required",
        "Changes are backwards compatible"
      ]
    },
    contributors: [
      "Ricardo Beaumont"
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-black">{update.title}</h1>
              <span className="px-3 py-1 text-sm font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
                v{update.version}
              </span>
            </div>
            <p className="mt-2 text-black/60">
              Released on {update.date}
            </p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            update.type === 'feature' ? 'bg-blue-100 text-blue-700' :
            update.type === 'enhancement' ? 'bg-green-100 text-green-700' :
            update.type === 'bugfix' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
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

        {/* Technical Details Section */}
        {update.technical_details && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-black/60" />
              Technical Details
            </h2>
            
            <div className="space-y-6">
              {/* Affected Components */}
              <div>
                <h3 className="text-sm font-medium text-black mb-3 flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-black/60" />
                  Affected Components
                </h3>
                <ul className="space-y-2">
                  {update.technical_details.affected_components.map((component, index) => (
                    <li key={index} className="text-sm text-black/70 font-mono bg-gray-50 px-3 py-1 rounded">
                      {component}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Breaking Changes */}
              {update.technical_details.breaking_changes && update.technical_details.breaking_changes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-black mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Breaking Changes
                  </h3>
                  <ul className="space-y-2">
                    {update.technical_details.breaking_changes.map((change, index) => (
                      <li key={index} className="text-sm text-black/70 flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-red-500" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dependencies */}
              {update.technical_details.dependencies_updated && update.technical_details.dependencies_updated.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-black mb-3">Dependencies Updated</h3>
                  <ul className="space-y-2">
                    {update.technical_details.dependencies_updated.map((dep, index) => (
                      <li key={index} className="text-sm text-black/70 font-mono bg-gray-50 px-3 py-1 rounded">
                        {dep.name}@{dep.version}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Migration Notes */}
              {update.technical_details.migration_notes && update.technical_details.migration_notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-black mb-3">Migration Notes</h3>
                  <ul className="space-y-2">
                    {update.technical_details.migration_notes.map((note, index) => (
                      <li key={index} className="text-sm text-black/70 flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#bea152]" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contributors Section */}
        {update.contributors && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Users2 className="h-5 w-5 text-black/60" />
              Contributors
            </h2>
            <div className="flex flex-wrap gap-2">
              {update.contributors.map((contributor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm text-black/70 bg-gray-50 rounded-full"
                >
                  {contributor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 