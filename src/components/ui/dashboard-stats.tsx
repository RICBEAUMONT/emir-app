'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UsersIcon, BarChartIcon, TrendingUpIcon, ClockIcon } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalUpdates: number
  recentActivity: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalUpdates: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total users count
        const { count: totalUsersCount, error: totalUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        if (totalUsersError) {
          console.warn('Total users count not available:', totalUsersError.message)
        }

        // Fetch active users count (users active in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { count: activeUsersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_seen_at', fiveMinutesAgo)

        if (usersError) {
          console.warn('Active users count not available:', usersError.message)
        }

        // Fetch total updates from git (we'll get this from our API)
        let totalUpdates = 0
        try {
          const response = await fetch('/api/git-updates')
          if (response.ok) {
            const updates = await response.json()
            totalUpdates = updates.length
          }
        } catch (error) {
          console.warn('Could not fetch git updates:', error)
        }

        // Calculate recent activity (users active in last hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const { count: recentActivityCount, error: recentActivityError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_seen_at', oneHourAgo)

        if (recentActivityError) {
          console.warn('Recent activity count not available:', recentActivityError.message)
        }

        setStats({
          totalUsers: totalUsersCount || 0,
          activeUsers: activeUsersCount || 0,
          totalUpdates: totalUpdates,
          recentActivity: recentActivityCount || 0
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // Set default values on error
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalUpdates: 0,
          recentActivity: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Set up a simple refresh interval instead of real-time subscriptions
    const refreshInterval = setInterval(() => {
      fetchStats()
    }, 30000) // Refresh every 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval)
    }
  }, [supabase])


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <UsersIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">Total Users</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-[#bea152]/5 px-3 py-1 text-sm text-gray-600">
            Registered users
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <TrendingUpIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">Active Now</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.activeUsers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-[#bea152]/5 px-3 py-1 text-sm text-gray-600">
            Last 5 minutes
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <BarChartIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">App Updates</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.totalUpdates.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-[#bea152]/5 px-3 py-1 text-sm text-gray-600">
            Total releases
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <ClockIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">Recent Activity</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.recentActivity.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-[#bea152]/5 px-3 py-1 text-sm text-gray-600">
            Last hour
          </div>
        </div>
      </div>
    </div>
  )
} 