import Sidebar from "@/components/ui/sidebar"
import { UserProfile } from "@/components/ui/user-profile"
import { SettingsButton } from "@/components/ui/settings-button"
import { SignOutButton } from "@/components/ui/sign-out-button"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <UserProfile />
            <div className="flex items-center space-x-4">
              <SettingsButton />
              <SignOutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 