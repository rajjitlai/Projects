import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (!adminEmail || email.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const otp = generateOTP();
  storeOTP(email, otp);

  try {
    await sendOTPEmail(email, otp);
    return NextResponse.json({ message: 'OTP sent.' });
  } catch (err) {
    console.error('[send-otp] Failed to send email:', err);
    return NextResponse.json({ error: 'Failed to send OTP. Check SMTP config.' }, { status: 500 });
  }
}
