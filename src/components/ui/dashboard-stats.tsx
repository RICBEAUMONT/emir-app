'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ImageIcon, UsersIcon, BarChartIcon, TrendingUpIcon, ClockIcon } from 'lucide-react'

interface DashboardStats {
  totalCards: number
  activeUsers: number
  cardsToday: number
  cardsThisWeek: number
  averageGenerationTime: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCards: 0,
    activeUsers: 0,
    cardsToday: 0,
    cardsThisWeek: 0,
    averageGenerationTime: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch card statistics from the view
        const { data: cardStats, error: cardError } = await supabase
          .from('card_statistics')
          .select('*')
          .single()

        if (cardError) throw cardError

        // Fetch active users count (users active in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { count: activeUsersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_seen_at', fiveMinutesAgo)

        if (usersError) throw usersError

        setStats({
          totalCards: cardStats.total_cards || 0,
          activeUsers: activeUsersCount || 0,
          cardsToday: cardStats.cards_today || 0,
          cardsThisWeek: cardStats.cards_this_week || 0,
          averageGenerationTime: Math.round(cardStats.avg_generation_time_minutes || 0)
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Set up real-time subscription for cards changes
    const cardsChannel = supabase
      .channel('cards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards'
        },
        async () => {
          // Refetch all stats when cards change
          fetchStats()
        }
      )
      .subscribe()

    // Set up real-time subscription for active users
    const usersChannel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async () => {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
          const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('last_seen_at', fiveMinutesAgo)
          
          if (!error && count !== null) {
            setStats(prev => ({ ...prev, activeUsers: count }))
          }
        }
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(usersChannel)
    }
  }, [supabase])

  const formatTime = (minutes: number) => {
    if (minutes < 1) return 'Less than a minute'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <ImageIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">Total Cards</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.totalCards.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 rounded-full bg-[#bea152]/5 px-3 py-1">
              <TrendingUpIcon className="h-4 w-4 text-[#bea152]" />
              {stats.cardsToday} today
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#bea152]/5 px-3 py-1">
              <ClockIcon className="h-4 w-4 text-[#bea152]" />
              {formatTime(stats.averageGenerationTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bea152]/5 to-[#bea152]/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#bea152]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bea152]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-[#bea152]/10 p-2.5">
              <UsersIcon className="h-5 w-5 text-[#bea152]" />
            </div>
            <div className="text-sm font-medium text-[#bea152]">Active Users</div>
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
            <div className="text-sm font-medium text-[#bea152]">Weekly Activity</div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">
              {loading ? '...' : stats.cardsThisWeek.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-[#bea152]/5 px-3 py-1 text-sm text-gray-600">
            This week's total
          </div>
        </div>
      </div>
    </div>
  )
} 