'use client'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Main animated gradient background */}
      <div 
        className="fixed inset-0 bg-[linear-gradient(-45deg,#000000,#0a0a0a,#1a1a1a,#0a0a0a)] 
        bg-[length:400%_400%] animate-gradient"
      />
      
      {/* Accent color gradients */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-[10%] w-[500px] h-[500px] 
          bg-[radial-gradient(circle,rgba(190,161,82,0.03)_0%,transparent_70%)] 
          blur-3xl animate-pulse-slow"
        />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] 
          bg-[radial-gradient(circle,rgba(190,161,82,0.03)_0%,transparent_70%)] 
          blur-3xl animate-pulse-slower"
        />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 