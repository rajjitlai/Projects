import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';
import { isAdmin } from './auth';
import { Session } from 'next-auth';

export interface ApiHandlerContext {
  session?: Session;
  user?: { id: string; login: string };
  isAdmin: boolean;
}

/**
 * Get authenticated session and user info
 */
export async function getAuthContext(): Promise<ApiHandlerContext> {
  const session = await getServerSession(authOptions);
  const user = session?.user ? {
    id: session.user.id,
    login: session.user.login,
  } : undefined;

  return {
    session: session ?? undefined,
    user,
    isAdmin: user ? await isAdmin(user.id) : false,
  };
}

/**
 * Protect admin-only route
 */
export function adminOnly(context: ApiHandlerContext): NextResponse | null {
  if (!context.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  if (!context.isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  return null;
}

/**
 * Require authentication
 */
export function requireAuth(context: ApiHandlerContext): NextResponse | null {
  if (!context.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  return null;
}

/**
 * Standard JSON response helper
 */
export function jsonResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}
