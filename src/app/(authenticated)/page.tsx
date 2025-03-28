'use client'

import Link from 'next/link'
import { ArrowRight, ImageIcon, BarChartIcon, UsersIcon } from 'lucide-react'
import RecentUpdates from "@/components/ui/recent-updates"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          <p className="text-sm text-black/60">
            Overview of your content generation activities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-black/70">Total Cards Generated</h3>
              <p className="text-2xl font-semibold mt-1 text-black">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <UsersIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-black/70">Active Users</h3>
              <p className="text-2xl font-semibold mt-1 text-black">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <BarChartIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-black/70">Storage Used</h3>
              <p className="text-2xl font-semibold mt-1 text-black">2.4 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-black">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/quote-cards"
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-black">Create Quote Card</h3>
                <p className="text-sm text-black/60">Generate a new quote card</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
          <Link 
            href="/analytics"
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <BarChartIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-black">View Analytics</h3>
                <p className="text-sm text-black/60">Check your performance metrics</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Recent Updates */}
      <RecentUpdates />
    </div>
  )
}
