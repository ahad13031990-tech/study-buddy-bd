import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicAuthRoutes = ['/auth/login', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password', '/auth/callback', '/auth/error']
const isPublicAuthRoute = (pathname: string) => publicAuthRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } } })
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isPublicLanding = pathname === '/'
  if (!user && !pathname.startsWith('/api/') && !isPublicAuthRoute(pathname) && !isPublicLanding) return NextResponse.redirect(new URL('/auth/login', request.url))
  if (user && pathname.startsWith('/auth/') && !pathname.startsWith('/auth/callback') && !pathname.startsWith('/auth/reset-password') && !pathname.startsWith('/auth/error')) return NextResponse.redirect(new URL('/', request.url))
  return response
}
