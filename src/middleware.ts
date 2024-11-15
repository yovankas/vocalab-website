import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session && req.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!session && req.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/signin', '/dashboard', '/'],
}