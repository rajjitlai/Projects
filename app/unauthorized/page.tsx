'use client';

import { Terminal } from '@/components/Terminal';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-mono font-bold text-red-500 mb-2">
            [ACCESS_DENIED]
          </h1>
          <p className="text-red-500/60 font-mono text-sm">
            Unauthorized activity detected
          </p>
        </div>

        <Terminal title="unauthorized.log" glow>
          <div className="space-y-4 font-mono text-xs md:text-sm">
            <p className="text-red-400">
              <span className="text-red-500 font-bold">CRITICAL:</span> You do not have the required permissions to access this vector.
            </p>
            <p className="text-green-500/40">
              {'>'} Attempt logged at {new Date().toISOString()}
              <br />
              {'>'} User ID: [REDACTED]
              <br />
              {'>'} Access Level: INSUFFICIENT
            </p>
            <div className="pt-4 border-t border-green-500/10">
              <Link
                href="/"
                className="inline-block px-4 py-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
              >
                [ RETURN_TO_SAFETY ]
              </Link>
            </div>
          </div>
        </Terminal>
      </div>
    </div>
  );
}
