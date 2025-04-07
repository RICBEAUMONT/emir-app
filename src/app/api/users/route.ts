import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Check if we have the admin client properly initialized
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized')
      return new NextResponse(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return new NextResponse(
        JSON.stringify({ error: 'Session error' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Fetch all profiles using the admin client
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Profiles error:', profilesError)
      return new NextResponse(
        JSON.stringify({ error: 'Error fetching profiles' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!profiles) {
      console.error('No profiles found')
      return new NextResponse(
        JSON.stringify({ error: 'No profiles found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Get all auth users using the admin client
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) {
      console.error('Auth users error:', authError)
      return new NextResponse(
        JSON.stringify({ error: 'Error fetching auth users' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!authUsers) {
      console.error('No auth users found')
      return new NextResponse(
        JSON.stringify({ error: 'No auth users found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Combine profiles with auth users
    const combinedUsers = profiles.map(profile => {
      const authUser = authUsers.find(u => u.id === profile.id)
      return {
        id: profile.id,
        full_name: profile.full_name,
        email: authUser?.email || '',
        company: profile.company,
        role: profile.role,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at
      }
    })

    return new NextResponse(
      JSON.stringify(combinedUsers),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unexpected error' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 