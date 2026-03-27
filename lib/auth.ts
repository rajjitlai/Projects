/**
 * Custom SMTP-OTP authentication helpers.
 * NextAuth has been removed. Session management is handled via signed httpOnly cookies.
 * See lib/session.ts, lib/otp.ts, lib/mailer.ts
 */

export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return !!adminEmail && email.toLowerCase() === adminEmail;
}
