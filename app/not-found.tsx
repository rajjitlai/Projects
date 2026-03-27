'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function NotFound() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity =
          cursorRef.current.style.opacity === '0' ? '1' : '0';
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-xl font-mono">

        {/* Terminal window */}
        <div className="border border-green-500/30 bg-black/60">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/20 bg-black/40">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-green-500/40 text-xs">404.sh</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-3 text-sm leading-relaxed">
            <p className="text-green-500/50">$ navigate --path &quot;{typeof window !== 'undefined' ? window.location.pathname : '/...'}&quot;</p>

            <p className="text-red-400">
              Error: ENOENT: no such file or directory
            </p>

            <p className="text-green-500/50">$ --exit-code 404</p>

            <div className="py-4">
              <p className="text-4xl font-bold text-green-400 tracking-tight">404</p>
              <p className="text-green-500/60 mt-1 text-base">Page not found.</p>
            </div>

            <p className="text-green-500/50">
              The requested resource does not exist or has been moved.
            </p>

            <div className="pt-2 flex items-center gap-1 text-green-400">
              <span>$ </span>
              <span>_</span>
              <span
                ref={cursorRef}
                className="inline-block w-2 h-4 bg-green-400 ml-0.5 translate-y-px"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-6 text-xs text-green-500/50">
          <Link
            href="/"
            className="hover:text-green-400 transition-colors border-b border-transparent hover:border-green-400/40"
          >
            cd ~/home
          </Link>
          <Link
            href="/admin"
            className="hover:text-green-400 transition-colors border-b border-transparent hover:border-green-400/40"
          >
            cd ~/admin
          </Link>
          <button
            onClick={() => window.history.back()}
            className="hover:text-green-400 transition-colors border-b border-transparent hover:border-green-400/40"
          >
            cd -
          </button>
        </div>

      </div>
    </div>
  );
}
