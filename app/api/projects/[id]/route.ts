import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/lib/sheets';
import { getAuthContext, jsonResponse } from '@/lib/api-utils';
import { success } from '@/lib/audit';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void _request;
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    const context = await getAuthContext();
    const userEmail = context?.email || 'public';

    if (!project) {
      await success({
        route: `/api/projects/${id}`,
        method: 'GET',
        action: `project not found: ${id}`,
        user: userEmail,
      });
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await success({
      route: `/api/projects/${id}`,
      method: 'GET',
      action: `fetched project: ${project.title}`,
      user: userEmail,
    });

    return jsonResponse({ data: project }, 200);
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
