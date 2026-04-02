import { NextRequest, NextResponse } from 'next/server';
import { updateProject, deleteProject } from '@/lib/sheets';
import { authenticateSession, jsonResponse } from '@/lib/api-utils';
import { getSession } from '@/lib/session';
import { success } from '@/lib/audit';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await authenticateSession();
    if (guard) return guard;

    const session = await getSession();
    const user = session?.email || 'admin';
    const { id } = await params;
    const body = await request.json();

    const project = await updateProject(id, body);

    await success({
      route: `/api/ace/projects/${id}`,
      method: 'PUT',
      action: `updated project: ${project.title}`,
      user,
    });

    return jsonResponse({ data: project }, 200);
  } catch (error) {
    console.error('Update project error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await authenticateSession();
    if (guard) return guard;

    const session = await getSession();
    const user = session?.email || 'admin';
    const { id } = await params;

    await deleteProject(id);

    await success({
      route: `/api/ace/projects/${id}`,
      method: 'DELETE',
      action: `deleted project: ${id}`,
      user,
    });

    return jsonResponse({ message: 'Project deleted' }, 200);
  } catch (error) {
    console.error('Delete project error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
