import { NextRequest, NextResponse } from 'next/server';
import { getReviews, addReview } from '@/lib/sheets';
import { jsonResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  // Public GET disabled for privacy
  return jsonResponse({ data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, author, content, rating } = body;

    if (!projectId || !author || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addReview({
      projectId,
      author,
      content,
      rating: rating || 5,
    });

    return jsonResponse({ message: 'Review submitted for approval' }, 201);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
