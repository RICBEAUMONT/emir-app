'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { AdminUserInfo } from './admin-user-info'

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/landing')
  }

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Add your admin panel content here */}
        </div>

        {/* Footer with user info */}
        <AdminUserInfo />
      </div>
    </div>
  )
} 