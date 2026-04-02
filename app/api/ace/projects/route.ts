import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/lib/sheets';
import { authenticateSession, jsonResponse } from '@/lib/api-utils';
import { getSession } from '@/lib/session';
import { success, error as logError } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const guard = await authenticateSession();
    if (guard) return guard;

    const session = await getSession();
    const user = session?.email || 'admin';

    const body = await request.json();
    const { title, description, image, liveUrl, repoUrl, tags, author, featured } = body;

    if (!title || !description || !image || !author) {
      await logError({
        route: '/api/ace/projects',
        method: 'POST',
        action: 'create project - validation failed',
        user,
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
      route: '/api/ace/projects',
      method: 'POST',
      action: `created project: ${project.title}`,
      user,
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
