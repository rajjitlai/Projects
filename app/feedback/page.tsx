'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReviewSystem } from '@/components/ReviewSystem';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-400 font-mono">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

      <header className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="bg-black/80 border border-green-500/30 px-4 py-2 rounded backdrop-blur flex items-center gap-2 w-fit hover:border-green-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs">[BACK_TO_GALLERY]</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-green-400 tracking-tighter">
            <span className="text-green-500">$</span> SYSTEM_FEEDBACK
          </h1>
          <p className="text-green-500/60 text-sm max-w-2xl leading-relaxed">
            Transmission channel for bug reports, feature requests, and general site reviews. 
            All logs are moderated before public display in the global archives.
          </p>
        </div>

        {/* General Feedback Form */}
        <ReviewSystem isGeneral={true} projectId="site" />
      </main>
    </div>
  );
}
