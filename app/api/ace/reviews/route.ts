import { NextRequest, NextResponse } from 'next/server';
import { getReviews, updateReviewStatus, deleteReviewRow } from '@/lib/sheets';
import { getSession } from '@/lib/session';
import { jsonResponse } from '@/lib/api-utils';

async function checkAuth(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    throw new Error('Unauthorized');
  }
}

export async function GET(request: NextRequest) {
  try {
    await checkAuth(request);
    const reviews = await getReviews();
    return jsonResponse({ data: reviews });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await checkAuth(request);
    const { id, isApproved } = await request.json();
    await updateReviewStatus(id, isApproved);
    return jsonResponse({ message: 'Review status updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkAuth(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('ID required');
    
    await deleteReviewRow(id);
    return jsonResponse({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
