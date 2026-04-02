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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

      <div className="w-full max-w-xl font-mono relative z-10">
        {/* Terminal window */}
        <div className="border border-green-500/30 bg-black/80 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/20 bg-green-900/10">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-green-500/60 text-[10px] uppercase tracking-widest">system_error.log</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-4 text-sm leading-relaxed">
            <div className="space-y-1">
              <p className="text-green-500/50 text-xs">$ locate_resource --id &quot;{typeof window !== 'undefined' ? window.location.pathname : '/...'}&quot;</p>
              <p className="text-red-400 font-bold">
                [ERROR] 404_NOT_FOUND: Resource pointer is invalid.
              </p>
            </div>

            <div className="py-6 border-y border-green-500/10">
              <p className="text-6xl font-bold text-green-400/90 tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]">404</p>
              <p className="text-green-500/80 mt-2 text-lg uppercase tracking-tight">Access Denied / Not Found</p>
            </div>

            <p className="text-green-500/60 text-xs italic">
              The requested virtual address could not be mapped to any physical resource on this node.
            </p>

            <div className="pt-2 flex items-center gap-2 text-green-400">
              <span className="text-green-500">$</span>
              <div className="flex items-center">
                <span className="animate-pulse">_</span>
                <span
                  ref={cursorRef}
                  className="inline-block w-2.5 h-5 bg-green-500/50 ml-1 shadow-[0_0_8px_rgba(0,255,65,0.5)]"
                />
              </div>
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
