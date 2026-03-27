'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  glow?: boolean;
}

export function Terminal({ children, className, title, glow = true }: TerminalProps) {
  return (
    <div
      className={cn(
        'bg-black border border-green-500/30 rounded-lg overflow-hidden',
        'font-mono text-sm text-green-400',
        glow && 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
        className
      )}
    >
      {title && (
        <div className="bg-green-900/30 border-b border-green-500/30 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-green-300 text-xs ml-2">{title}</span>
        </div>
      )}
      <div className="p-4 relative">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />
        {children}
      </div>
    </div>
  );
}
