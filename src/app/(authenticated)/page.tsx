'use client'

import Link from 'next/link'
import { ArrowRight, ImageIcon, BarChartIcon } from 'lucide-react'
import RecentUpdates from "@/components/ui/recent-updates"
import { DashboardStats } from "@/components/ui/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          <p className="text-sm text-black/60">
            Welcome to EMIR - Your content creation hub
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/quote-cards"
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-black">Quote Cards</h3>
              <p className="text-sm text-black/60">Create social media quote cards</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link 
          href="/thumbnails"
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-black">Thumbnails</h3>
              <p className="text-sm text-black/60">Create YouTube thumbnails</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link 
          href="/email-signatures"
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <BarChartIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-black">Email Signatures</h3>
              <p className="text-sm text-black/60">Generate professional signatures</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      {/* Recent Updates */}
      <RecentUpdates />
    </div>
  )
}

