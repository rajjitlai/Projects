'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Project } from '@/types';
import { ProjectGridSkeleton } from '@/components/ProjectSkeleton';
import { CyberBackground } from '@/components/CyberBackground';
import { CommandPalette } from '@/components/CommandPalette';
import { ThemeSelector, ThemeMode } from '@/components/ThemeSelector';
import { HeroTerminal } from '@/components/HeroTerminal';
import { CategoryTelemetryBar } from '@/components/CategoryTelemetryBar';
import Link from 'next/link';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('matrix');
  const router = useRouter();

  // Load and persist theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'matrix' || savedTheme === 'amber' || savedTheme === 'cyan')) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
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
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
      })
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    'All',
    'Web',
    'Apps',
    'Projects',
    'Demos',
    'Hackathons',
    'AI Vibe Coded',
    'AI Enhanced',
    'Template',
    'Production/Launched',
  ];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-green-500/20 selection:text-green-300">
      {/* Background with CRT vignette & particle canvas */}
      <CyberBackground theme={theme} />

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black/80 border border-green-500/40 px-3.5 py-1.5 rounded backdrop-blur shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <h1 className="text-green-400 font-mono text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-1.5">
                <span className="text-green-500">[</span>
                RAJJIT_LAISHRAM.projects
                <span className="text-green-500">]</span>
              </h1>
            </div>
            {/* Theme switcher */}
            <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
          </div>

          {/* Search & Command Palette */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-full md:w-80 bg-black/80 border border-green-500/30 px-3 py-1.5 rounded backdrop-blur font-mono flex items-center gap-2">
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
            <CommandPalette
              projects={projects}
              onSelectCategory={setSelectedCategory}
              onSetTheme={handleThemeChange}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-6 px-4 z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="font-mono">
            <h1 className="text-3xl md:text-5xl font-bold text-green-400 mb-2 tracking-tight text-glow">
              <span className="inline-block mr-2">$</span>
              <span className="inline-block">_showcase</span>
              <span className="inline-block text-green-500/80">.init()</span>
              <span className="text-xs md:text-sm text-green-500/60 ml-2 font-normal">v1.3.5</span>
            </h1>
            <p className="text-green-400/70 text-sm md:text-base font-mono max-w-2xl leading-relaxed">
              Curated engineering & system design showcase by{' '}
              <span className="text-green-300 font-semibold text-glow-sm">Rajjit Laishram</span>.
              Explore interactive telemetry, source repositories, and live deployments below.
            </p>
          </div>

          {/* Interactive Hero Terminal */}
          <HeroTerminal
            projects={projects}
            onSelectCategory={setSelectedCategory}
            onSetTheme={handleThemeChange}
          />

          {/* Visual Telemetry Bar */}
          <CategoryTelemetryBar
            projects={projects}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected =
                (cat === 'All' && !selectedCategory) || selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                  className={`px-3 py-1 border text-[10px] font-mono transition-all uppercase rounded-sm ${
                    isSelected
                      ? 'bg-green-950/80 border-green-400 text-green-300 font-bold shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                      : 'bg-black/60 border-green-500/20 text-green-500/60 hover:border-green-500/60 hover:text-green-400'
                  }`}
                >
                  [{cat}]
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <ProjectGridSkeleton />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-black/40 border border-green-500/20 rounded-lg">
              <p className="text-green-500/50 font-mono text-sm">
                &gt; NO_RECORDS_MATCHING current query filter.
              </p>
            </div>
          ) : (
            Object.entries(projectsByCategory).map(([category, catProjects]) => (
              <div key={category} className="mb-12 last:mb-0">
                <div className="mb-6 flex justify-between items-end border-b border-green-500/20 pb-2">
                  <h2 className="text-green-400 font-mono text-base md:text-lg font-semibold flex items-center gap-1.5 text-glow-sm">
                    <span className="text-green-500">[</span>
                    {category.toUpperCase()}
                    <span className="text-green-500">]</span>
                    <span className="text-green-500/50 ml-2 text-xs font-normal">
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
      <footer className="border-t border-green-500/20 py-8 px-4 mt-auto relative z-10 bg-black/60 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
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

