import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Routes that must be accessible WITHOUT a session
const PUBLIC_PATHS = [
  '/admin/login',
  '/admin/verify',
  '/api/admin/send-otp',
  '/api/admin/verify-otp',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public auth paths through unconditionally
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
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
