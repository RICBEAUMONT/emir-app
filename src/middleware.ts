import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    // Update last_seen_at timestamp
    await supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', session.user.id)
  }

  // If user is not signed in and the current path is not /landing,
  // redirect the user to /landing
  if (!session && req.nextUrl.pathname !== '/landing') {
    return NextResponse.redirect(new URL('/landing', req.url))
  }

  // If user is signed in and the current path is /landing,
  // redirect the user to /users
  if (session && req.nextUrl.pathname === '/landing') {
    return NextResponse.redirect(new URL('/users', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 