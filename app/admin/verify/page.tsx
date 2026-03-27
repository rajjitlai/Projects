'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from '@/components/Terminal';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminVerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('otp_email');
    if (!stored) {
      // No email stored — go back to login
      router.replace('/admin/login');
    } else {
      setEmail(stored);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Verification failed.');
        return;
      }

      sessionStorage.removeItem('otp_email');
      router.push('/admin');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null; // redirect in progress

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
            [VERIFY_OTP]
          </h1>
          <p className="text-green-500/60 font-mono text-sm">
            Enter the 6-digit code sent to{' '}
            <span className="text-green-400">{email}</span>
          </p>
        </div>

        <Terminal title="verify.sh" glow>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-green-400 text-xs font-mono block">
                ACCESS_CODE:
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black border border-green-500/30 text-green-300 font-mono text-3xl tracking-[0.5em] text-center py-4 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 placeholder:text-green-900 placeholder:tracking-normal"
                placeholder="000000"
                required
                disabled={loading}
                autoFocus
              />
              <p className="text-green-500/40 text-xs font-mono">
                Code expires in 5 minutes.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono bg-red-900/20 border border-red-500/30 px-3 py-2">
                [ERROR] {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-900/30 border border-green-500 text-green-400 font-mono text-sm hover:bg-green-900/50 hover:text-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">[VERIFYING...]</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  [AUTHENTICATE]
                </>
              )}
            </button>

            <div className="pt-4 border-t border-green-500/20 flex justify-between items-center">
              <Link
                href="/admin/login"
                className="text-green-500/60 hover:text-green-400 text-xs font-mono transition-colors"
              >
                &lt;- RESEND CODE
              </Link>
              <Link
                href="/"
                className="text-green-500/60 hover:text-green-400 text-xs font-mono transition-colors"
              >
                RETURN TO SITE
              </Link>
            </div>
          </form>
        </Terminal>

        <div className="mt-8 text-center">
          <p className="text-green-900/40 text-[10px] font-mono uppercase tracking-widest">
            Authorization Protocol v3.0 // SMTP-OTP Secured
          </p>
        </div>
      </div>
    </div>
  );
}
