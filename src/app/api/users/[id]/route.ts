import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Regular client for user authentication and profile operations
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Admin client with service role for auth operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if the current user has admin or moderator privileges
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (profileError || !currentProfile) {
      return new NextResponse(JSON.stringify({ error: 'Failed to verify permissions' }), { status: 401 })
    }

    if (!['admin', 'moderator'].includes(currentProfile.role)) {
      return new NextResponse(JSON.stringify({ error: 'Insufficient permissions' }), { status: 403 })
    }

    // Check if trying to delete an admin user
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', params.id)
      .single()

    if (targetProfileError) {
      console.error('Error checking target user role:', targetProfileError)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to verify target user role' }),
        { status: 500 }
      )
    }

    if (targetProfile?.role === 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Cannot delete admin users' }),
        { status: 403 }
      )
    }

    // Delete the user's profile first
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', params.id)

    if (deleteProfileError) {
      console.error('Error deleting profile:', deleteProfileError)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to delete user profile' }),
        { status: 500 }
      )
    }

    // Delete the user from auth using admin client
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(params.id)

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError)
      // If auth deletion fails, try to restore the profile
      const { error: restoreError } = await supabase
        .from('profiles')
        .insert([targetProfile])

      if (restoreError) {
        console.error('Error restoring profile after auth deletion failure:', restoreError)
      }

      return new NextResponse(
        JSON.stringify({ error: 'Failed to delete user authentication' }),
        { status: 500 }
      )
    }

    return new NextResponse(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
} 