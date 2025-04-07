'use client'

import { ArrowLeft, Mail, Calendar, Clock, Activity, UserCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'

interface UserProfileProps {
  params: {
    id: string
  }
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  status: string
  last_active: string | null
  created_at: string
  avatar_url: string | null
  last_seen_at: string | null
  activity?: {
    cardsGenerated: number
    lastCardGenerated: string | null
    storageUsed: string
  }
}

interface Card {
  id: string
  created_at: string
  title: string
  status: string
}

// Function to determine if a user is active (active in last 5 minutes)
const isUserActive = (lastSeenAt: string | null) => {
  if (!lastSeenAt) return false
  const lastSeen = new Date(lastSeenAt)
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  return lastSeen > fiveMinutesAgo
}

// Function to format last active time
const formatLastActive = (lastSeenAt: string | null) => {
  if (!lastSeenAt) return 'Never'
  const lastSeen = new Date(lastSeenAt)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return lastSeen.toLocaleDateString()
}

// Function to format storage used
const formatStorageUsed = (cards: Card[]) => {
  // Assuming each card uses about 1MB of storage
  const totalBytes = cards.length * 1024 * 1024
  if (totalBytes < 1024 * 1024) {
    return `${Math.round(totalBytes / 1024)} KB`
  }
  return `${Math.round(totalBytes / (1024 * 1024))} MB`
}

export default function UserProfilePage({ params }: UserProfileProps) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchUser() {
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

        // Then fetch user from the profiles table
        const { data: profileData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single()

        if (userError) {
          console.error('Supabase error details:', userError)
          throw new Error('Failed to fetch user profile')
        }

        if (!profileData) {
          console.error('No data returned from Supabase')
          throw new Error('User not found')
        }

        // Fetch user's cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', params.id)
          .order('created_at', { ascending: false })

        if (cardsError) {
          console.error('Error fetching cards:', cardsError)
          throw new Error('Failed to fetch user cards')
        }

        const cards = cardsData || []
        const lastCard = cards[0]

        // Transform the data to include status and activity
        const transformedUser = {
          ...profileData,
          status: isUserActive(profileData.last_seen_at) ? 'Active' : 'Inactive',
          last_active: formatLastActive(profileData.last_seen_at),
          activity: {
            cardsGenerated: cards.length,
            lastCardGenerated: lastCard ? new Date(lastCard.created_at).toLocaleDateString() : null,
            storageUsed: formatStorageUsed(cards)
          }
        }

        setUser(transformedUser)
      } catch (err) {
        console.error('Error fetching user:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

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
          if (payload.new.id === params.id) {
            setUser(prevUser => {
              if (!prevUser) return null
              return {
                ...prevUser,
                ...payload.new,
                status: isUserActive(payload.new.last_seen_at) ? 'Active' : 'Inactive',
                last_active: formatLastActive(payload.new.last_seen_at)
              }
            })
          }
        }
      )
      .subscribe()

    // Set up real-time subscription for cards
    const cardsChannel = supabase
      .channel('user_cards')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `user_id=eq.${params.id}`
        },
        async () => {
          // Refetch cards when changes occur
          const { data: cardsData } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', params.id)
            .order('created_at', { ascending: false })

          const cards = cardsData || []
          const lastCard = cards[0]

          setUser(prevUser => {
            if (!prevUser) return null
            return {
              ...prevUser,
              activity: {
                cardsGenerated: cards.length,
                lastCardGenerated: lastCard ? new Date(lastCard.created_at).toLocaleDateString() : null,
                storageUsed: formatStorageUsed(cards)
              }
            }
          })
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(cardsChannel)
    }
  }, [params.id, supabase])

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(prevUser => {
        if (!prevUser) return null
        return {
          ...prevUser,
          status: isUserActive(prevUser.last_seen_at) ? 'Active' : 'Inactive',
          last_active: formatLastActive(prevUser.last_seen_at)
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading user profile...</div>
      </div>
    )
  }

  if (error || !user) {
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
      {/* Back Button */}
      <Link 
        href="/users"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Users
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="relative h-24 w-24 flex-shrink-0">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name || 'User avatar'}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {user.full_name || 'Unnamed User'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'Active' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="text-sm font-medium text-gray-900">{user.last_active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Cards Generated</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.activity?.cardsGenerated || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Last Card Generated</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.activity?.lastCardGenerated || 'Never'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.activity?.storageUsed || '0 GB'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Edit Profile
        </button>
        <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50">
          Deactivate Account
        </button>
      </div>
    </div>
  )
} 