'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Logo from '@/components/ui/logo'
import { Eye, EyeOff } from 'lucide-react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/users')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-white/[0.02] backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/[0.05]">
      <div className="text-center space-y-2 mb-10">
        <div className="flex items-center justify-center h-16">
          <Logo />
        </div>
        <p className="text-sm text-white/60 font-medium">
          Social Media Asset Manager
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div className="space-y-5">
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-medium text-[#bea152]/80 group-hover:text-[#bea152] transition-colors mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-3
                  bg-white/[0.03] hover:bg-white/[0.04]
                  backdrop-blur-xl
                  border border-white/[0.05]
                  rounded-lg
                  text-white 
                  placeholder-white/30
                  focus:bg-white/[0.05]
                  focus:outline-none focus:ring-1 focus:ring-[#bea152]/50
                  focus:border-[#bea152]/50
                  transform transition-all duration-200
                  hover:scale-[1.01] focus:scale-[1.01]"
                placeholder="Enter your email"
              />
              <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-[#bea152]/10 to-transparent"></div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-medium text-[#bea152]/80 group-hover:text-[#bea152] transition-colors mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-3
                  bg-white/[0.03] hover:bg-white/[0.04]
                  backdrop-blur-xl
                  border border-white/[0.05]
                  rounded-lg
                  text-white 
                  placeholder-white/30
                  focus:bg-white/[0.05]
                  focus:outline-none focus:ring-1 focus:ring-[#bea152]/50
                  focus:border-[#bea152]/50
                  transform transition-all duration-200
                  hover:scale-[1.01] focus:scale-[1.01]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 focus:outline-none
                  transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-[#bea152]/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/10
            animate-shake"
          >
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg text-white 
            bg-gradient-to-r from-[#bea152] to-[#bea152]/80
            hover:from-[#bea152]/90 hover:to-[#bea152]/70
            active:from-[#bea152]/80 active:to-[#bea152]/60
            focus:outline-none focus:ring-2 focus:ring-[#bea152]/20 
            disabled:opacity-50 disabled:cursor-not-allowed
            transform transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            shadow-[0_4px_12px_0_rgba(190,161,82,0.2)]
            hover:shadow-[0_4px_16px_0_rgba(190,161,82,0.3)]
            active:shadow-[0_2px_8px_0_rgba(190,161,82,0.2)]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <label className="flex items-center space-x-2.5 group cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 border border-white/10 rounded-md
                group-hover:border-[#bea152]/30
                peer-checked:border-[#bea152]
                peer-checked:bg-[#bea152]
                transition-all duration-200
                shadow-sm"
              >
                {rememberMe && (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors duration-200">
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-sm font-medium text-[#bea152]/80 hover:text-[#bea152] 
              transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-[#bea152]/20 rounded-md px-2 py-1 -mr-2"
            onClick={() => alert('Forgot password functionality to be implemented')}
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  )
} 