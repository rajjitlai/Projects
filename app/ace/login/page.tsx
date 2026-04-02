'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from '@/components/Terminal';
import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ace/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP.');
        return;
      }

      // Pass email to verify page via sessionStorage
      sessionStorage.setItem('otp_email', email);
      router.push('/ace/verify');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
            [ADMIN_ACCESS]
          </h1>
          <p className="text-green-500/60 font-mono text-sm">
            Enter your admin email to receive a one-time access code
          </p>
        </div>

        <Terminal title="login.sh" glow>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-green-400 text-xs font-mono block">
                ADMIN_EMAIL:
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-green-500/30 text-green-300 font-mono text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 placeholder:text-green-900"
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono bg-red-900/20 border border-red-500/30 px-3 py-2">
                [ERROR] {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-900/30 border border-green-500 text-green-400 font-mono text-sm hover:bg-green-900/50 hover:text-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">[SENDING...]</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  [SEND_ACCESS_CODE]
                </>
              )}
            </button>

            <div className="pt-4 border-t border-green-500/20">
              <Link
                href="/"
                className="text-green-500/60 hover:text-green-400 text-xs font-mono transition-colors"
              >
                &lt;- RETURN TO PUBLIC SITE
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
