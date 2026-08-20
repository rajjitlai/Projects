'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lock, ExternalLink, Copy, Check, RotateCw, Terminal as TerminalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrowserMockupProps {
  image: string;
  title: string;
  liveUrl?: string;
  repoUrl?: string;
}

export function BrowserMockup({ image, title, liveUrl, repoUrl }: BrowserMockupProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const displayUrl = liveUrl || `https://rajjitlai.dev/projects/${title.toLowerCase().replace(/\s+/g, '-')}`;
  const cloneCommand = repoUrl ? `git clone ${repoUrl}.git` : '';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyClone = () => {
    if (!cloneCommand) return;
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 600);
  };

  return (
    <div className="space-y-4">
      {/* Browser Window Frame */}
      <div className="bg-[#080d09] border border-green-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.25)] font-mono">
        {/* Browser Top Navigation Bar */}
        <div className="bg-green-950/40 border-b border-green-500/30 px-3 py-2 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs">
          {/* Window Traffic Lights & Controls */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <button
              onClick={handleReload}
              className="text-green-500/60 hover:text-green-300 p-0.5 rounded transition-colors"
              title="Reload viewport asset"
            >
              <RotateCw className={cn('w-3 h-3', isReloading && 'animate-spin text-green-400')} />
            </button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-xl mx-auto flex items-center gap-1.5 bg-black/70 border border-green-500/30 px-2.5 py-1 rounded text-[11px] text-green-300 min-w-0">
            <Lock className="w-3 h-3 text-green-500 shrink-0" />
            <span className="truncate flex-1 font-mono text-green-400/90">{displayUrl}</span>

            {/* Quick Action Icons in Address Bar */}
            <div className="flex items-center gap-1 shrink-0 ml-1 border-l border-green-500/20 pl-1.5">
              <button
                onClick={handleCopyUrl}
                className="text-green-500/60 hover:text-green-300 p-0.5 rounded transition-colors"
                title="Copy Address"
              >
                {copiedUrl ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500/60 hover:text-green-300 p-0.5 rounded transition-colors"
                  title="Open live website in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-green-500/60">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>200_OK</span>
          </div>
        </div>

        {/* Viewport Image Area */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              'object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.02]',
              isReloading && 'opacity-20 blur-sm'
            )}
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

          {/* Corner highlights */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-green-500/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-green-500/40" />
        </div>
      </div>

      {/* 1-Click Git Clone Terminal Box */}
      {repoUrl && (
        <div className="bg-[#080d09] border border-green-500/30 rounded-lg p-3 font-mono text-xs flex flex-col sm:flex-row gap-2 sm:items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <div className="flex items-center gap-2 min-w-0">
            <TerminalIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span className="text-green-500/60 text-[10px] uppercase font-bold shrink-0">
              CLONE_REPO:
            </span>
            <code className="text-green-300 truncate text-[11px] select-all bg-black/60 px-2 py-0.5 rounded border border-green-500/20">
              {cloneCommand}
            </code>
          </div>

          <button
            onClick={handleCopyClone}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-wider font-semibold transition-all shrink-0 border',
              copiedClone
                ? 'bg-green-500 text-black border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                : 'bg-green-950/40 border-green-500/40 text-green-400 hover:bg-green-900/60 hover:text-green-300'
            )}
          >
            {copiedClone ? (
              <>
                <Check className="w-3 h-3" />
                <span>[COPIED_TO_CLIPBOARD]</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>[COPY_COMMAND]</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
