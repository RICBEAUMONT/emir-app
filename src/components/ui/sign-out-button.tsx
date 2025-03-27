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
      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
      title="Sign out"
    >
      <LogOut className="h-5 w-5" />
    </button>
  )
} 