import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"Projects Admin" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: '[ADMIN] Your one-time access code',
    text: `Your admin access code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it.`,
    html: `
      <div style="background:#0a0a0a;color:#4ade80;font-family:monospace;padding:32px;border:1px solid #166534;max-width:480px">
        <h2 style="color:#4ade80;margin-top:0">[ADMIN_ACCESS]</h2>
        <p style="color:#6ee7b7;font-size:14px">Your one-time access code is:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4ade80;padding:16px 0">
          ${otp}
        </div>
        <p style="color:#86efac;font-size:12px">⏱ Expires in 5 minutes. Do not share this code.</p>
      </div>
    `,
  });
}
