import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
  }

  console.log(`[verify-otp] Verifying: ${email} with OTP: ${otp}`);
  if (!verifyOTP(email, otp)) {
    console.error(`[verify-otp] Verification failed for ${email}`);
    return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 401 });
  }

  const token = await createSession(email);
  const res = NextResponse.json({ message: 'Authenticated.' });
  setSessionCookie(res, token);

  return res;
}
