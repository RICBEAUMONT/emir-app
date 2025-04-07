'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { usePathname } from 'next/navigation'
import Sidebar from "@/components/ui/sidebar"
import { UserProfile } from "@/components/ui/user-profile"
import { SettingsButton } from "@/components/ui/settings-button"
import { SignOutButton } from "@/components/ui/sign-out-button"
import { NotificationBell } from "@/components/ui/notification-bell"

// Activity tracker component
function ActivityTracker() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const pathname = usePathname()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let lastUpdate = 0

    const updateActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const now = Date.now()
        // Only update if at least 1 second has passed since last update
        if (now - lastUpdate >= 1000) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ last_seen_at: new Date().toISOString() })
              .eq('id', session.user.id)
            
            if (error) {
              console.error('Error updating last_seen_at:', error)
            } else {
              lastUpdate = now
              console.log('Activity updated:', new Date().toISOString())
            }
          } catch (err) {
            console.error('Error in updateActivity:', err)
          }
        }
      }
    }

    const handleActivity = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateActivity, 1000) // Debounce updates to 1 second
    }

    // Update activity on user interaction
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        updateActivity()
      }
    })

    // Initial update
    updateActivity()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('visibilitychange', () => {})
      clearTimeout(timeoutId)
    }
  }, [supabase, pathname])

  return null
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ActivityTracker />
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <NotificationBell />
                <UserProfile />
              </div>
              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {children}
          </main>
        </div>
      </div>
    </>
  )
} 