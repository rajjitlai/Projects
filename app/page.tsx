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
  const terminalRef = useRef<HTMLDivElement>(null);
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

  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags.map((t) => t.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-400">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px]" />

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="bg-black/80 border border-green-500/30 px-4 py-2 rounded backdrop-blur">
            <h1 className="text-green-400 font-mono text-sm">
              <span className="text-green-500">[</span>
              RAJJIT_LAISHRAM.projects
              <span className="text-green-500">]</span>
            </h1>
          </div>
          <div className="bg-black/80 border border-green-500/30 px-4 py-2 rounded backdrop-blur">
            <a
              href="/admin"
              className="text-green-400 font-mono text-xs hover:text-green-300 transition-colors"
            >
              [ENTER_ADMIN]
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div ref={heroRef} className="mb-8 font-mono">
            <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-4">
              <span className="inline-block">$</span>
              <span className="inline-block">_showcase</span>
              <span className="inline-block">.init()</span>
            </h1>
            <p className="text-green-500/80 text-lg md:text-xl font-mono max-w-2xl">
              A curated collection of projects by{' '}
              <span className="text-green-400">Rajjit Laishram</span>.
              Browse the work, filter by technology, or dive into any project.
            </p>
          </div>

          {/* Terminal Search */}
          <div ref={terminalRef} className="max-w-2xl mb-8">
            <div className="bg-black border border-green-500/40 rounded-lg overflow-hidden">
              <div className="bg-green-900/30 border-b border-green-500/30 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-green-300 text-xs ml-2">
                  search_projects.sh
                </span>
              </div>
              <div className="p-4 font-mono">
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-green-500">$</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="filter by title, description, or tags..."
                    className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-600"
                  />
                </div>
                {selectedTag && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-green-500">filter:</span>
                    <span className="bg-green-900/30 border border-green-500/50 text-green-400 px-2 py-1 text-xs">
                      [{selectedTag.toUpperCase()}]
                    </span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-green-500 hover:text-green-300 text-xs"
                    >
                      [clear]
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-3 py-1 border text-xs font-mono transition-all ${
                    selectedTag === tag
                      ? 'bg-green-900/50 border-green-400 text-green-300'
                      : 'bg-black/50 border-green-500/30 text-green-500/60 hover:border-green-400'
                  }`}
                >
                  [{tag.toUpperCase()}]
                </button>
              ))}
            </div>
          )}
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
            NEXT.JS · TAILWIND · GSAP
          </p>
        </div>
      </footer>
    </div>
  );
}
