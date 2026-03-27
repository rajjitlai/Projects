import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login and verify pages through unconditionally
  if (pathname === '/admin/login' || pathname === '/admin/verify') {
    return NextResponse.next();
  }

  const session = await getSession(req);

  if (!session) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/logs',
  ],
};
