/**
 * In-memory OTP store with 5-minute expiry.
 * Keys are email addresses (lowercase), values are {otp, expiresAt}.
 * NOTE: This is reset on server restart. For multi-instance deployments, use Redis.
 */

interface OTPEntry {
  otp: string;
  expiresAt: number; // unix ms
}

const otpStore = new Map<string, OTPEntry>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, otp: string): void {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
}

export function verifyOTP(email: string, otp: string): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.otp !== otp) return false;
  // Consume OTP — one-time use
  otpStore.delete(email.toLowerCase());
  return true;
}
