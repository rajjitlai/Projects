import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Routes that must be accessible WITHOUT a session
const PUBLIC_PATHS = [
  '/ace/login',
  '/ace/verify',
  '/api/ace/send-otp',
  '/api/ace/verify-otp',
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Normalize pathname (remove trailing slash for checking)
  const normalizedPathname = pathname.length > 1 && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  // Allow public auth paths through unconditionally
  if (PUBLIC_PATHS.some((p) => normalizedPathname === p || normalizedPathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const session = await getSession(req);

  if (!session) {
    const loginUrl = new URL('/ace/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/ace/:path*',
    '/api/ace/:path*',
    '/api/logs',
  ],
};
