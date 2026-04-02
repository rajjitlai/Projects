import { NextResponse } from 'next/server';
import { getSession } from './session';

export interface ApiHandlerContext {
  email: string;
}

/**
 * Get authenticated user email from cookie session.
 * For use in server-side Route Handlers (Node runtime).
 */
export async function getAuthContext(): Promise<ApiHandlerContext | null> {
  const session = await getSession();
  if (!session) return null;
  return { email: session.email };
}

/**
 * Protect management route handler. Returns error response or null if ok.
 */
export async function authenticateSession(): Promise<NextResponse | null> {
  const ctx = await getAuthContext();
  if (!ctx) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  return null;
}

/**
 * Standard JSON response helper
 */
export function jsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}
