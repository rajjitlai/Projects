import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/sheets';
import { getAuthContext, jsonResponse } from '@/lib/api-utils';
import { success } from '@/lib/audit';

export async function GET(_request: NextRequest) {
  // Use _request to avoid unused var warning
  void _request;
  try {
    const projects = await getProjects();
    const context = await getAuthContext();

    // Log the access
    await success({
      route: '/api/projects',
      method: 'GET',
      action: 'fetched all projects',
      user: context.user?.login || 'public',
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
