'use client'

import { Settings } from 'lucide-react'
import Link from 'next/link'

export function SettingsButton() {
  return (
    <Link
      href="/profile"
      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
      title="Profile Settings"
    >
      <Settings className="h-5 w-5" />
    </Link>
  )
} 