'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Project } from '@/types';
import { ProjectGridSkeleton } from '@/components/ProjectSkeleton';
import Link from 'next/link';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((p) =>
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered;
  }, [projects, searchTerm, selectedCategory]);

  const projectsByCategory = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    filteredProjects.forEach((p) => {
      const cat = p.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [filteredProjects]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', 'Web', 'Apps', 'Projects', 'Demos', 'Hackathons', 'AI Vibe Coded', 'AI Enhanced', 'Template', 'Production/Launched'];

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
              <span className="inline-block">.init() v1.3.5</span>
            </h1>
            <p className="text-green-500/60 text-sm md:text-base font-mono max-w-xl">
              Curated collection by <span className="text-green-400">Rajjit Laishram</span>.
              Explore the lab.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 border text-[10px] font-mono transition-all uppercase ${
                  (cat === 'All' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-green-900/50 border-green-400 text-green-300'
                    : 'bg-black/50 border-green-500/20 text-green-500/40 hover:border-green-500/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <ProjectGridSkeleton />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-green-500/50 font-mono">
                No projects match current filters.
              </p>
            </div>
          ) : (
            Object.entries(projectsByCategory).map(([category, catProjects]) => (
              <div key={category} className="mb-12 last:mb-0">
                <div className="mb-6 flex justify-between items-end border-b border-green-500/20 pb-2">
                  <h2 className="text-green-400 font-mono text-lg">
                    <span className="text-green-500">[</span>
                    {category.toUpperCase()}
                    <span className="text-green-500">]</span>
                    <span className="text-green-500/60 ml-2">
                      ({catProjects.length} records)
                    </span>
                  </h2>
                </div>
                <ProjectGrid
                  projects={catProjects}
                  onProjectClick={(project) => {
                    router.push(`/projects/${project.id}`);
                  }}
                />
              </div>
            ))
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
          <div className="flex items-center gap-6">
            <Link
              href="/feedback"
              className="text-green-400 font-mono text-[10px] uppercase border-b border-green-400/30 transition-all animate-terminal-pulse flex items-center gap-1"
            >
              <span className="text-green-500">[!]</span> [SUBMIT_FEEDBACK]
            </Link>
            <p className="text-green-900/60 font-mono text-xs">
              NEXT.JS · TAILWIND · GSAP · [V1.3.5]
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
