import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/sheets';
import { getAuthContext, jsonResponse } from '@/lib/api-utils';
import { success } from '@/lib/audit';

export async function GET(_request: NextRequest) {
  // Use _request to avoid unused var warning
  void _request;
  try {
    const projects = await getProjects();

    // Log the access
    await success({
      route: '/api/projects',
      method: 'GET',
      action: 'fetched all projects',
      user: (await getAuthContext())?.email || 'public',
    });

    return jsonResponse({ data: projects }, 200);
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
