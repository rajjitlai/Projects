'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Project } from '@/types';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((p) =>
        p.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

    return filtered;
  }, [projects, searchTerm, selectedTag]);

  useEffect(() => {
    // Fetch projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  useEffect(() => {
    // Hero typewriter animation with GSAP
    if (!heroRef.current) return;

    const heroText = heroRef.current;
    const lines = heroText.querySelectorAll('span');

    gsap.fromTo(
      lines,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.05,
        stagger: 0.1,
        ease: 'none',
        repeat: -1,
        repeatDelay: 5,
        yoyo: true,
      }
    );
  }, []);



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-400">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="bg-black/80 border border-green-500/30 px-4 py-2 rounded backdrop-blur">
            <h1 className="text-green-400 font-mono text-sm">
              <span className="text-green-500">[</span>
              RAJJIT_LAISHRAM.projects
              <span className="text-green-500">]</span>
            </h1>
          </div>
          
          {/* Header Search */}
          <div className="w-full md:w-96 bg-black/80 border border-green-500/30 px-3 py-1.5 rounded backdrop-blur font-mono flex items-center gap-2">
            <span className="text-green-500/60 text-xs">$</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="find projects..."
              className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-800 text-xs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-green-500/40 hover:text-green-400 text-[10px]"
              >
                [X]
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - More Compact */}
      <section className="relative pt-24 pb-8 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div ref={heroRef} className="mb-4 font-mono">
            <h1 className="text-3xl md:text-5xl font-bold text-green-400 mb-2">
              <span className="inline-block">$</span>
              <span className="inline-block">_showcase</span>
              <span className="inline-block">.init()</span>
            </h1>
            <p className="text-green-500/60 text-sm md:text-base font-mono max-w-xl">
              Curated collection by <span className="text-green-400">Rajjit Laishram</span>.
              Explore the lab.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['All', 'Web', 'Apps', 'Projects', 'Demos', 'Hackathons', 'AI Vibe Coded'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat === 'All' ? null : cat)}
                className={`px-3 py-1 border text-[10px] font-mono transition-all ${
                  (cat === 'All' && !selectedTag) || selectedTag === cat
                    ? 'bg-green-900/50 border-green-400 text-green-300'
                    : 'bg-black/50 border-green-500/20 text-green-500/40 hover:border-green-500/60'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-end border-b border-green-500/20 pb-2">
            <h2 className="text-green-400 font-mono text-lg">
              <span className="text-green-500">[</span>
              PROJECTS
              <span className="text-green-500">]</span>
              <span className="text-green-500/60 ml-2">
                ({filteredProjects.length} found)
              </span>
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-green-500/50 font-mono">
                No projects match current filters.
              </p>
            </div>
          ) : (
            <ProjectGrid
              projects={filteredProjects}
              onProjectClick={(project) => {
                router.push(`/projects/${project.id}`);
              }}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/20 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-green-500/50 font-mono text-xs">
            <span className="text-green-600">[</span> RAJJIT LAISHRAM — PROJECTS
            <span className="text-green-600"> ]</span>
          </p>
          <p className="text-green-900/60 font-mono text-xs">
            NEXT.JS · TAILWIND · GSAP · [V1.2.0]
          </p>
        </div>
      </footer>
    </div>
  );
}
