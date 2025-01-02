import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware function to handle authentication and session management.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip authentication checks for public paths and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('access_token')?.value;

  // If user is not authenticated and not on the login page, redirect to login
  if (!token && ![`/login`].includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // If user is authenticated and tries to access the login page, redirect them to their homepage
  if (token && pathname === `/login`) {
    return NextResponse.redirect(new URL(`/`, req.url)); // Or change to the desired homepage route
  }

  return NextResponse.next();
}

// Apply this middleware to routes that require authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. _next (Next.js internals)
     * 2. static (static files)
     * 3. favicon.ico (favicon)
     * 4. api (API routes)
     */
    '/((?!_next/static|_next/image|favicon|api).*)',
  ],
};
