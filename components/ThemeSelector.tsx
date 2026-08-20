'use client';

import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ThemeMode = 'matrix' | 'amber' | 'cyan';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themes: { id: ThemeMode; label: string; dotColor: string }[] = [
    { id: 'matrix', label: 'MATRIX', dotColor: 'bg-[#22c55e]' },
    { id: 'amber', label: 'AMBER', dotColor: 'bg-[#f59e0b]' },
    { id: 'cyan', label: 'CYAN', dotColor: 'bg-[#06b6d4]' },
  ];

  return (
    <div className="flex items-center gap-1 bg-black/80 border border-green-500/30 px-1.5 py-1 rounded backdrop-blur font-mono text-[10px]">
      <Palette className="w-3 h-3 text-green-500/60 mr-1 hidden sm:inline" />
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={cn(
              'px-2 py-0.5 rounded transition-all flex items-center gap-1',
              isActive
                ? 'bg-green-950/80 text-green-300 font-bold border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                : 'text-green-500/50 hover:text-green-400 hover:bg-black/50'
            )}
            title={`Switch to ${t.label} palette`}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', t.dotColor)} />
            <span>[{t.label}]</span>
          </button>
        );
      })}
    </div>
  );
}
