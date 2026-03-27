'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Terminal } from '@/components/Terminal';
import { Globe, Code, Terminal as LucideTerminal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleLogin = () => {
    signIn('github', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
            [ADMIN_ACCESS]
          </h1>
          <p className="text-green-500/60 font-mono text-sm">
            Sign in with your GitHub account
          </p>
        </div>

        <Terminal title="login.sh" glow>
          <div className="space-y-6 py-4">
            <p className="text-green-500/80 text-sm font-mono leading-relaxed">
              System access is restricted to authorized administrators. 
              Please authenticate via GitHub to continue to the control panel.
            </p>

                <Button
                  onClick={() => signIn('github', { callbackUrl: '/admin' })}
                  className="w-full bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-900/50 hover:text-green-300 font-mono py-6 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    <LucideTerminal className="w-5 h-5" />
                    [AUTHORIZE_VIA_GITHUB]
                  </span>
                </Button>
            <div className="pt-4 border-t border-green-500/20">
              <Link
                href="/"
                className="text-green-500/60 hover:text-green-400 text-xs font-mono transition-colors"
              >
                &lt;- RETURN TO PUBLIC SITE
              </Link>
            </div>
          </div>
        </Terminal>

        <div className="mt-8 text-center">
          <p className="text-green-900/40 text-[10px] font-mono uppercase tracking-widest">
            Authorization Protocol v2.0 // Secured by encryption
          </p>
        </div>
      </div>
    </div>
  );
}
