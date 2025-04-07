'use client'

import { LogOut } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export function SignOutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/landing'
  }

  return (
    <button
      onClick={handleSignOut}
      className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
      title="Sign out"
    >
      <LogOut className="h-5 w-5" />
    </button>
  )
} 