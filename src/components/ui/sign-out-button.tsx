'use client'

import { LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function SignOutButton() {
  const supabase = createClientComponentClient()

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