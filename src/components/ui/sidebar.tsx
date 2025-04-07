'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ImageIcon,
  LayoutDashboardIcon,
  UsersIcon,
  BarChartIcon,
  HelpCircleIcon,
  UserCircle,
  Bell,
  ChevronDown,
  Settings,
  PenTool,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'

interface NavigationGroup {
  name: string
  icon: any
  items?: { name: string; href: string }[]
  href?: string
}

const navigation: NavigationGroup[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
  {
    name: 'Content Creation',
    icon: PenTool,
    items: [
      { name: 'Quote Cards', href: '/quote-cards' },
      { name: 'Thumbnails', href: '/thumbnails' },
    ]
  },
  { 
    name: 'Management',
    icon: Settings,
    items: [
      { name: 'Analytics', href: '/analytics' },
      { name: 'Users', href: '/users' },
    ]
  },
  { name: 'Updates', href: '/updates', icon: Bell },
  { name: 'Help', href: '/help', icon: HelpCircleIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Content Creation'])
  
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
          .select('full_name, avatar_url')
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
          .select('full_name, avatar_url')
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

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  const isGroupActive = (group: NavigationGroup) => {
    if (group.href) return pathname === group.href
    return group.items?.some(item => pathname === item.href) || false
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <img src="/logo-white.png" alt="EMIR" className="h-8 brightness-0" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = isGroupActive(item)
          const isExpanded = expandedGroups.includes(item.name)

          if (item.items) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded ? 'transform rotate-180' : ''
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="pl-11 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'block py-2 px-3 text-sm font-medium rounded-md transition-colors',
                          pathname === subItem.href
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
            {profile?.avatar_url ? (
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || user.email || 'User avatar'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {profile?.full_name || user.email}
              </div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 