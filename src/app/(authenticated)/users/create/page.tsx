'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, User, Lock, Shield, Eye, EyeOff, Image as ImageIcon, X, UserCog } from 'lucide-react'

const AVAILABLE_ROLES = [
  { id: 'user', label: 'User', description: 'Basic user access' },
  { id: 'admin', label: 'Admin', description: 'Full administrative access' },
  { id: 'moderator', label: 'Moderator', description: 'Content moderation access' },
]

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isValidImage, setIsValidImage] = useState(true)
  const [selectedRole, setSelectedRole] = useState('user')
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    // Reset validation state when URL changes
    setIsValidImage(true)
  }

  const handleImageError = () => {
    setIsValidImage(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const avatar_url = imageUrl || null

    try {
      // First check if the current user has admin privileges
      const { data: currentUser, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (userError) {
        console.error('Error checking user role:', userError)
        throw new Error('Failed to verify admin privileges')
      }

      if (currentUser?.role !== 'admin') {
        throw new Error('You need admin privileges to create new users')
      }

      // Check if user with this email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single()

      if (existingProfile) {
        throw new Error('A user with this email already exists')
      }

      console.log('Creating user with:', { email, fullName, avatar_url, role: selectedRole })
      
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user?.id) {
        console.error('No user ID returned:', authData)
        throw new Error('Failed to create user account')
      }

      console.log('User created:', authData.user.id)

      try {
        // Create the user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email,
              full_name: fullName,
              avatar_url,
              role: selectedRole,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_seen_at: null
            },
          ])
          .select()
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          if (profileError.message?.includes('row-level security')) {
            throw new Error('You do not have permission to create new users. Please contact your administrator.')
          }
          throw new Error(`Profile creation error: ${profileError.message}`)
        }

        console.log('Profile created:', profileData)

        // Redirect to the users list
        router.push('/users')
      } catch (profileErr) {
        throw profileErr
      }
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/users"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Users
      </Link>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create New User</h1>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            New Account
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="flex items-start space-x-4">
              <div className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {imageUrl ? (
                  isValidImage ? (
                    <>
                      <Image
                        src={imageUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                        onError={handleImageError}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </>
                  ) : (
                    <div className="text-red-500 text-xs text-center p-2">
                      Invalid image URL
                    </div>
                  )
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="Enter image URL"
                    className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Paste a URL to an image (JPG, PNG, or GIF)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  minLength={6}
                  className="pl-10 pr-12 block w-full rounded-lg border border-gray-300 bg-white py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-label="Hide password" />
                  ) : (
                    <Eye className="h-5 w-5" aria-label="Show password" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                User Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCog className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500">
                {AVAILABLE_ROLES.find(role => role.id === selectedRole)?.description}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>New users will receive an email to verify their account</span>
          </li>
          <li className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>Each role has different permissions and access levels</span>
          </li>
        </ul>
      </div>
    </div>
  )
} 