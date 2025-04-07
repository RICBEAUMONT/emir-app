interface Update {
  version: string
  date: string
  title: string
  description: string
  changes: string[]
  type: 'feature' | 'enhancement' | 'bugfix' | 'initial'
  technical_details?: {
    affected_components?: string[]
    breaking_changes?: string[]
    dependencies_updated?: { name: string; version: string }[]
    migration_notes?: string[]
  }
  contributors?: string[]
}

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const updates: Update[] = [
  {
    version: "1.0.5",
    date: formatDate(new Date()),
    title: "Dashboard & Updates Enhancement",
    description: "Improved dashboard experience and centralized updates system.",
    type: 'enhancement' as const,
    changes: [
      "Centralized updates system with consistent versioning",
      "Enhanced dashboard with real-time updates display",
      "Improved notification bell dropdown positioning",
      "Added click-outside handler for notification dropdown",
      "Fixed dashboard showing outdated updates",
      "Enhanced update cards with better visual hierarchy",
      "Improved update navigation and version tracking"
    ],
    technical_details: {
      affected_components: [
        "Dashboard page",
        "RecentUpdates component",
        "NotificationBell component",
        "Updates page"
      ],
      migration_notes: [
        "All updates are now managed through the centralized updates system",
        "Update versioning follows MAJOR.MINOR.PATCH format"
      ]
    }
  },
  {
    version: "1.0.4",
    date: formatDate(new Date()),
    title: "User Management & Role Updates",
    description: "Enhanced user management with role-based access control and improved user creation process.",
    type: 'feature' as const,
    changes: [
      "Added role selection during user creation (User, Admin, Moderator)",
      "Implemented user deletion functionality for admins and moderators",
      "Enhanced permission checks for user management actions",
      "Improved error handling and user feedback",
      "Updated Supabase integration to use @supabase/ssr",
      "Fixed user profile page issues with missing cards table",
      "Improved security checks for user management actions"
    ],
    technical_details: {
      affected_components: [
        "User creation form",
        "User management API",
        "Profile page",
        "Authentication middleware"
      ],
      dependencies_updated: [
        { name: "@supabase/auth-helpers-nextjs", version: "removed" },
        { name: "@supabase/ssr", version: "latest" }
      ]
    }
  },
  {
    version: "1.0.3",
    date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    title: "User Management & Activity Tracking",
    description: "Enhanced user management system with real-time activity tracking and improved role management.",
    type: 'enhancement' as const,
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
    version: "1.0.2",
    date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    title: "Updates System & Security Enhancement",
    description: "Comprehensive updates tracking system and important security improvements.",
    type: 'enhancement' as const,
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
    version: "1.0.1",
    date: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
    title: "Performance & UI Optimization",
    description: "Major performance improvements and UI/UX enhancements across the platform.",
    type: 'enhancement' as const,
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
    date: formatDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)),
    title: "Initial Release",
    description: "First release of EMIR - Social Media Asset Manager",
    type: 'initial' as const,
    changes: [
      "User authentication and authorization",
      "Dashboard layout and navigation",
      "Quote cards creation interface",
      "User management system",
      "Profile settings"
    ]
  }
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export type { Update } 