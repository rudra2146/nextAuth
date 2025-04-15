import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // Check if token exists and redirect for sign-in, sign-up, or verify pages
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If no token (user logged out), redirect to login page for protected routes
  if (!token && url.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/profile'],
}