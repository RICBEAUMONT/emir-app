import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import { UserProfile } from "@/components/ui/user-profile";
import { SettingsButton } from "@/components/ui/settings-button";
import { SignOutButton } from "@/components/ui/sign-out-button";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
