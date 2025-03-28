import RecentUpdates from "@/components/ui/recent-updates"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your dashboard. Here's what's new.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentUpdates />
        {/* Add other dashboard components here */}
      </div>
    </div>
  )
} 