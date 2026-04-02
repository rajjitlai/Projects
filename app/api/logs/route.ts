import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/sheets';
import { authenticateSession, jsonResponse } from '@/lib/api-utils';
import { success } from '@/lib/audit';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const guard = await authenticateSession();
    if (guard) return guard;

    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const logs = await getAuditLogs(limit ? parseInt(limit) : undefined);

    await success({
      route: '/api/logs',
      method: 'GET',
      action: 'fetched audit logs',
      user: session?.email || 'admin',
    });

    return jsonResponse({ data: logs }, 200);
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
