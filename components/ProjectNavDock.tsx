'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Grid } from 'lucide-react';

interface ProjectNavDockProps {
  prevProject?: { id: string; title: string };
  nextProject?: { id: string; title: string };
}

export function ProjectNavDock({ prevProject, nextProject }: ProjectNavDockProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevProject) {
        router.push(`/projects/${prevProject.id}`);
      } else if (e.key === 'ArrowRight' && nextProject) {
        router.push(`/projects/${nextProject.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevProject, nextProject, router]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-fit">
      <div className="flex items-center gap-1.5 sm:gap-3 bg-black/85 border border-green-500/40 px-3 py-2 rounded-full backdrop-blur-md shadow-[0_0_25px_rgba(34,197,94,0.3)] font-mono text-xs text-green-400">
        {/* Previous Project Button */}
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-green-950/60 hover:text-green-300 transition-all border border-transparent hover:border-green-500/30 group"
            title={`Previous: ${prevProject.title} (Left Arrow)`}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline max-w-[120px] truncate">
              [PREV: #{prevProject.id.slice(-4)}]
            </span>
            <kbd className="hidden md:inline text-[9px] bg-green-950/80 border border-green-500/30 px-1 rounded text-green-500">
              ←
            </kbd>
          </Link>
        ) : (
          <span className="opacity-30 px-2 flex items-center gap-1 text-[11px]">[START]</span>
        )}

        <div className="w-px h-4 bg-green-500/20" />

        {/* Catalog Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-green-950/60 hover:text-green-300 transition-all border border-transparent hover:border-green-500/30 text-green-400 font-semibold"
          title="Return to Catalog (Home)"
        >
          <Grid className="w-3.5 h-3.5 text-green-500" />
          <span className="text-[11px] sm:text-xs">[CATALOG]</span>
        </Link>

        <div className="w-px h-4 bg-green-500/20" />

        {/* Next Project Button */}
        {nextProject ? (
          <Link
            href={`/projects/${nextProject.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-green-950/60 hover:text-green-300 transition-all border border-transparent hover:border-green-500/30 group"
            title={`Next: ${nextProject.title} (Right Arrow)`}
          >
            <span className="hidden sm:inline max-w-[120px] truncate">
              [NEXT: #{nextProject.id.slice(-4)}]
            </span>
            <kbd className="hidden md:inline text-[9px] bg-green-950/80 border border-green-500/30 px-1 rounded text-green-500">
              →
            </kbd>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <span className="opacity-30 px-2 flex items-center gap-1 text-[11px]">[END]</span>
        )}
      </div>
    </div>
  );
}
