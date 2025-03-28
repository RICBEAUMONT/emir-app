'use client'

import Link from 'next/link'
import { ArrowRight, ImageIcon, BarChartIcon, UsersIcon } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your content generation activities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <ImageIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Cards Generated</h3>
              <p className="text-2xl font-semibold mt-1">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <UsersIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
              <p className="text-2xl font-semibold mt-1">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <BarChartIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Storage Used</h3>
              <p className="text-2xl font-semibold mt-1">2.4 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/quote-cards"
            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <ImageIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <h3 className="font-medium">Create Quote Card</h3>
                <p className="text-sm text-muted-foreground">Generate a new quote card</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-400" />
          </Link>
          <Link 
            href="/analytics"
            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <BarChartIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <h3 className="font-medium">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Check your performance metrics</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}
