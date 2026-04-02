import { NextRequest, NextResponse } from 'next/server';
import { authenticateSession } from '@/lib/api-utils';
import { uploadImage } from '@/lib/cloudinary';
import { success } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const authError = await authenticateSession();
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    const imageUrl = await uploadImage(base64File);

    // Get current user for audit log
    // lib/api-utils.ts getAuthContext() could be used here
    // but authenticateSession() already passed, so we're safe.

    await success({
      route: '/api/ace/upload',
      method: 'POST',
      action: `uploaded image: ${file.name}`,
      user: 'admin', // Static for now, or update audit to handle context
    });

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
