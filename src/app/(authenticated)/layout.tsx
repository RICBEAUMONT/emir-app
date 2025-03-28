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
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-black/50 backdrop-blur-sm border-b border-[#bea152]/20">
          <div className="flex items-center justify-between px-4 py-3">
            <UserProfile />
            <div className="flex items-center space-x-4">
              <SettingsButton />
              <SignOutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-black/30 p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 