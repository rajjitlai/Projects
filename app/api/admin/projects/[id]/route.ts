import { NextRequest, NextResponse } from 'next/server';
import { updateProject, deleteProject } from '@/lib/sheets';
import { getAuthContext, adminOnly, jsonResponse } from '@/lib/api-utils';
import { success } from '@/lib/audit';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthContext();
    const adminCheck = adminOnly(context);
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();

    const project = await updateProject(id, body);

    await success({
      route: `/api/admin/projects/${id}`,
      method: 'PUT',
      action: `updated project: ${project.title}`,
      user: context.user!.login,
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
    const context = await getAuthContext();
    const adminCheck = adminOnly(context);
    if (adminCheck) return adminCheck;

    const { id } = await params;
    await deleteProject(id);

    await success({
      route: `/api/admin/projects/${id}`,
      method: 'DELETE',
      action: `deleted project: ${id}`,
      user: context.user!.login,
    });

    return jsonResponse({ message: 'Project deleted' }, 200);
  } catch (error) {
    console.error('Delete project error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
