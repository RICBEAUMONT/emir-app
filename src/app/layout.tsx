import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import { UserProfile } from "@/components/ui/user-profile";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { SettingsButton } from "@/components/ui/settings-button";

export const metadata: Metadata = {
  title: "EMIR Content Generator",
  description: "Create branded content for various purposes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                {/* Gold diagonal lines pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #BEA152, #BEA152 1px, transparent 1px, transparent 20px)`,
                  backgroundSize: '28px 28px',
                }} />
              </div>
              <div className="h-full px-6 flex items-center justify-between relative">
                <UserProfile />
                <div className="flex items-center gap-4">
                  <SignOutButton />
                  <SettingsButton />
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-900">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
