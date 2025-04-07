'use client'

import { Search, UserCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  status: string
  last_active: string | null
  created_at: string
  avatar_url: string | null
  last_seen_at: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Function to determine if a user is active (active in last 5 minutes)
  const isUserActive = (lastSeenAt: string | null) => {
    if (!lastSeenAt) return false
    const lastSeen = new Date(lastSeenAt)
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    const isActive = lastSeen > fiveMinutesAgo
    console.log('User activity check:', {
      lastSeen: lastSeen.toISOString(),
      now: now.toISOString(),
      fiveMinutesAgo: fiveMinutesAgo.toISOString(),
      isActive
    })
    return isActive
  }

  // Function to format last active time
  const formatLastActive = (lastSeenAt: string | null) => {
    if (!lastSeenAt) return 'Never'
    const lastSeen = new Date(lastSeenAt)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
    
    let formattedTime
    if (diffInMinutes < 1) formattedTime = 'Just now'
    else if (diffInMinutes < 60) formattedTime = `${diffInMinutes}m ago`
    else if (diffInMinutes < 1440) formattedTime = `${Math.floor(diffInMinutes / 60)}h ago`
    else formattedTime = lastSeen.toLocaleDateString()

    console.log('Last active formatting:', {
      lastSeen: lastSeen.toISOString(),
      now: now.toISOString(),
      diffInMinutes,
      formattedTime
    })

    return formattedTime
  }

  // Function to get role badge styling
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#bea152] text-white'
      case 'moderator':
        return 'bg-[#bea152] text-white'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        // First, check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw new Error('Authentication error')
        }

        if (!session) {
          console.error('No active session')
          throw new Error('No active session')
        }

        // Then fetch users from the profiles table
        const { data, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) {
          console.error('Supabase error details:', usersError)
          throw new Error('Failed to fetch users')
        }

        if (!data) {
          console.error('No data returned from Supabase')
          throw new Error('No users found')
        }

        // Transform the data to include status and last active
        const transformedUsers = data.map(user => ({
          ...user,
          status: isUserActive(user.last_seen_at) ? 'Active' : 'Inactive',
          last_active: formatLastActive(user.last_seen_at)
        }))

        setUsers(transformedUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    // Set up real-time subscription for user activity
    const channel = supabase
      .channel('user_activity')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          setUsers(prevUsers => {
            return prevUsers.map(user => {
              if (user.id === payload.new.id) {
                return {
                  ...user,
                  ...payload.new,
                  status: isUserActive(payload.new.last_seen_at) ? 'Active' : 'Inactive',
                  last_active: formatLastActive(payload.new.last_seen_at)
                }
              }
              return user
            })
          })
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => {
        return prevUsers.map(user => ({
          ...user,
          status: isUserActive(user.last_seen_at) ? 'Active' : 'Inactive',
          last_active: formatLastActive(user.last_seen_at)
        }))
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.full_name?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <Link
          href="/users/new"
          className="px-4 py-2 text-sm font-medium text-white bg-[#bea152] rounded-md hover:bg-[#a88f3f] transition-colors"
        >
          Add User
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bea152] focus:border-transparent"
        />
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name || 'User avatar'}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserCircle className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_active}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-[#bea152] hover:text-[#a88f3f] transition-colors"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 