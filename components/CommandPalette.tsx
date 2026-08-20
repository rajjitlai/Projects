'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { Search, Globe, Code, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  projects?: Project[];
  onSelectCategory?: (category: string) => void;
  onSetTheme?: (theme: 'matrix' | 'amber' | 'cyan') => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'projects' | 'system' | 'themes' | 'categories';
  icon?: React.ReactNode;
  action: () => void;
  badge?: string;
}

export function CommandPalette({
  projects = [],
  onSelectCategory,
  onSetTheme,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = useMemo(() => {
    const result: CommandItem[] = [];

    // System Navigation
    result.push({
      id: 'sys-home',
      title: 'Return to Base (Home)',
      subtitle: 'Navigate to root showcase catalog',
      category: 'system',
      icon: <TerminalIcon className="w-3.5 h-3.5" />,
      action: () => {
        router.push('/');
        setIsOpen(false);
      },
      badge: 'NAV',
    });

    result.push({
      id: 'sys-feedback',
      title: 'Submit Feedback & Reviews',
      subtitle: 'Send direct feedback to terminal operator',
      category: 'system',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      action: () => {
        router.push('/feedback');
        setIsOpen(false);
      },
      badge: 'FEEDBACK',
    });

    result.push({
      id: 'sys-ace',
      title: 'Operator Console (/ace)',
      subtitle: 'Secured administrative portal',
      category: 'system',
      icon: <TerminalIcon className="w-3.5 h-3.5" />,
      action: () => {
        router.push('/ace');
        setIsOpen(false);
      },
      badge: 'ADMIN',
    });

    // Theme Switchers
    if (onSetTheme) {
      result.push(
        {
          id: 'theme-matrix',
          title: 'Color Palette: Matrix Phosphor Green',
          subtitle: 'Classic hacker terminal (#00ff41)',
          category: 'themes',
          action: () => {
            onSetTheme('matrix');
            setIsOpen(false);
          },
          badge: 'THEME',
        },
        {
          id: 'theme-amber',
          title: 'Color Palette: Amber CRT (DEC VT220)',
          subtitle: 'Warm vintage monochrome (#f59e0b)',
          category: 'themes',
          action: () => {
            onSetTheme('amber');
            setIsOpen(false);
          },
          badge: 'THEME',
        },
        {
          id: 'theme-cyan',
          title: 'Color Palette: Cyberpunk Cyan Neon',
          subtitle: 'High-voltage electric blue (#06b6d4)',
          category: 'themes',
          action: () => {
            onSetTheme('cyan');
            setIsOpen(false);
          },
          badge: 'THEME',
        }
      );
    }

    // Categories
    const defaultCategories = ['All', 'Web', 'Apps', 'Projects', 'Demos', 'Production/Launched'];
    defaultCategories.forEach((cat) => {
      result.push({
        id: `cat-${cat}`,
        title: `Filter: [${cat.toUpperCase()}]`,
        subtitle: `Display only ${cat} records`,
        category: 'categories',
        action: () => {
          onSelectCategory?.(cat);
          setIsOpen(false);
        },
        badge: 'FILTER',
      });
    });

    // Projects
    projects.forEach((proj) => {
      result.push({
        id: `proj-${proj.id}`,
        title: proj.title,
        subtitle: proj.description,
        category: 'projects',
        icon: proj.liveUrl ? <Globe className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />,
        action: () => {
          router.push(`/projects/${proj.id}`);
          setIsOpen(false);
        },
        badge: proj.category || 'PROJECT',
      });
    });

    return result;
  }, [projects, onSelectCategory, onSetTheme, router]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.badge?.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Adjust selection if filtered items shorten
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  // Auto scroll list item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Trigger Button that can be placed in headers */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black/80 hover:bg-green-950/40 border border-green-500/30 hover:border-green-400 px-2.5 py-1.5 rounded text-xs font-mono text-green-400/80 hover:text-green-300 transition-all shadow-sm group"
        title="Open Command Palette (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5 text-green-500/70 group-hover:text-green-400" />
        <span className="hidden sm:inline text-[11px]">[CMD]</span>
        <kbd className="text-[9px] bg-green-950/60 border border-green-500/40 px-1 py-0.2 rounded text-green-400 font-mono">
          ^K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette Container */}
          <div className="relative w-full max-w-2xl bg-[#080d09] border border-green-500/50 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.3)] overflow-hidden font-mono z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_100%)] bg-[length:100%_4px] z-20" />

            {/* Header bar */}
            <div className="bg-green-950/40 border-b border-green-500/30 px-4 py-2 flex items-center justify-between text-xs text-green-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-green-300 font-semibold ml-1">
                  SYSTEM://COMMAND_PALETTE.exe
                </span>
              </div>
              <span className="text-[10px] text-green-500/60">[ESC] TO ABORT</span>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-green-500/20 flex items-center gap-2 bg-black/50">
              <span className="text-green-500 font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, projects, tags, or theme presets..."
                className="w-full bg-transparent outline-none text-green-300 placeholder-green-700 text-xs font-mono"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-green-500/40 hover:text-green-400 text-xs px-1"
                >
                  [CLR]
                </button>
              )}
            </div>

            {/* Result List */}
            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-green-500/10 custom-scrollbar"
            >
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-green-500/50">
                  <p>&gt; NO_RECORDS_FOUND matching &quot;{query}&quot;</p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'px-3 py-2 rounded flex items-center justify-between cursor-pointer transition-all text-xs pt-2',
                        isSelected
                          ? 'bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.6)] font-semibold'
                          : 'text-green-400 hover:bg-green-950/30'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isSelected ? 'text-black' : 'text-green-500/70'}>
                          {item.icon || <span className="font-bold">&gt;</span>}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-mono">{item.title}</p>
                          {item.subtitle && (
                            <p
                              className={cn(
                                'truncate text-[10px]',
                                isSelected ? 'text-black/80 font-normal' : 'text-green-500/50'
                              )}
                            >
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ml-2 shrink-0 border',
                            isSelected
                              ? 'border-black/40 bg-black/20 text-black'
                              : 'border-green-500/30 bg-black/40 text-green-400/80'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="bg-black/80 border-t border-green-500/20 px-4 py-1.5 flex items-center justify-between text-[10px] text-green-500/60">
              <div className="flex items-center gap-3">
                <span>[↑/↓] NAVIGATE</span>
                <span>[ENTER] EXECUTE</span>
              </div>
              <span>STATUS: ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
