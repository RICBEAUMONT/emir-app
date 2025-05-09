'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

export function AdminUserInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setProfile(profile)
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch profile data on auth state change
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile(data)
            }
          })
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (!user) return null

  return (
    <div className="flex items-center gap-4 p-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex-1">
        <div className="text-sm font-medium">
          {profile?.full_name || user.email}
        </div>
        <div className="text-xs text-muted-foreground">
          {user.email}
        </div>
      </div>
    </div>
  )
} 