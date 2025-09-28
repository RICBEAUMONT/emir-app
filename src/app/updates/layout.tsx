import { ReactNode } from 'react'
import Image from 'next/image'

export default function UpdatesLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="EMIR Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
