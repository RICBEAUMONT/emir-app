import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import { UserProfile } from "@/components/ui/user-profile";
import { SettingsButton } from "@/components/ui/settings-button";
import { SignOutButton } from "@/components/ui/sign-out-button";

export const metadata: Metadata = {
  title: "EMIR",
  description: "EMIR - Quote Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
