import { withAuth } from 'next-auth/middleware';
import { isAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect admin routes and API endpoints
 * This uses NextAuth's withAuth to handle session validation and redirection
 */
export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Additional check for admin privileges on admin routes
    if (path.startsWith('/admin') || path.startsWith('/api/admin') || path === '/api/logs') {
      if (!token?.sub || !(await isAdmin(token.sub))) {
        // Redirection to unauthorized if not an admin
        return NextResponse.rewrite(new URL('/unauthorized', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized callback determines if the middleware logic should run
      // return true to allow access (the middleware function above will still run for additional checks)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    // Admin pages
    '/admin/:path*',
    // Admin API routes
    '/api/admin/:path*',
    '/api/logs',
  ],
};
