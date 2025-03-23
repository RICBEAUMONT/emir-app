import type { Metadata } from "next";
import "./globals.css";

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
        <header className="border-b border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            {/* Gold diagonal lines pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, #BEA152, #BEA152 1px, transparent 1px, transparent 20px)`,
              backgroundSize: '28px 28px',
            }} />
          </div>
          <div className="container mx-auto px-4 py-6 relative">
            <div className="flex items-center justify-between">
              <img src="/logo.png" alt="EMIR" className="h-8" />
              <div className="h-px flex-1 mx-8 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="text-sm text-muted-foreground font-normal">
                Content Generator
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
