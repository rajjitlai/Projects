import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/lib/sheets';
import { getAuthContext, adminOnly, jsonResponse } from '@/lib/api-utils';
import { success, error as logError } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const context = await getAuthContext();
    const adminCheck = adminOnly(context);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { title, description, image, liveUrl, repoUrl, tags, author, featured } = body;

    // Validate required fields
    if (!title || !description || !image || !author) {
      await logError({
        route: '/api/admin/projects',
        method: 'POST',
        action: 'create project - validation failed',
        user: context.user!.login,
      });
      return NextResponse.json(
        { error: 'Missing required fields: title, description, image, author' },
        { status: 400 }
      );
    }

    const project = await createProject({
      title,
      description,
      image,
      liveUrl,
      repoUrl,
      tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()) || [],
      author,
      featured: featured || false,
    });

    await success({
      route: '/api/admin/projects',
      method: 'POST',
      action: `created project: ${project.title}`,
      user: context.user!.login,
    });

    return jsonResponse({ data: project }, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
