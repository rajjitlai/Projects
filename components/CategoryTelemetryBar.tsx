'use client';

import { useMemo, useState } from 'react';
import { Project } from '@/types';
import { Activity, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryTelemetryBarProps {
  projects: Project[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Web: 'bg-green-500',
  Apps: 'bg-emerald-400',
  Projects: 'bg-lime-500',
  Demos: 'bg-teal-400',
  Hackathons: 'bg-green-300',
  'AI Vibe Coded': 'bg-cyan-400',
  'AI Enhanced': 'bg-emerald-300',
  Template: 'bg-green-600',
  'Production/Launched': 'bg-lime-400',
  Other: 'bg-green-800',
};

export function CategoryTelemetryBar({
  projects,
  selectedCategory,
  onSelectCategory,
}: CategoryTelemetryBarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = projects.length;
    if (total === 0) return { breakdown: [], total: 0, topCategory: 'N/A' };

    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const breakdown = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / total) * 100).toFixed(1),
        color: CATEGORY_COLORS[name] || 'bg-green-500',
      }))
      .sort((a, b) => b.count - a.count);

    return {
      breakdown,
      total,
      topCategory: breakdown[0]?.name || 'Web',
    };
  }, [projects]);

  if (stats.total === 0) return null;

  return (
    <div className="bg-[#080d09]/90 border border-green-500/30 rounded-lg p-3.5 font-mono text-xs shadow-[0_0_20px_rgba(34,197,94,0.15)] space-y-3 backdrop-blur-md">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-green-400 font-semibold">
          <Activity className="w-3.5 h-3.5 text-green-500" />
          <span>[SYSTEM_TELEMETRY: CATEGORY_DISTRIBUTION]</span>
        </div>

        <div className="flex items-center gap-3 text-green-500/70 text-[10px]">
          <span>
            RECORDS: <strong className="text-green-300">{stats.total}</strong>
          </span>
          <span>
            DOMINANT: <strong className="text-green-300">{stats.topCategory}</strong>
          </span>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="flex items-center gap-1 text-green-400 hover:text-green-300 bg-green-950/60 border border-green-500/40 px-1.5 py-0.5 rounded transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>RESET_FILTER</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-segment Ratio Bar */}
      <div className="h-3 w-full bg-black/80 rounded-full overflow-hidden flex border border-green-500/20 shadow-inner">
        {stats.breakdown.map((item) => {
          const isSelected = selectedCategory?.toLowerCase() === item.name.toLowerCase();
          const isHovered = hoveredCategory === item.name;

          return (
            <div
              key={item.name}
              style={{ width: `${item.percentage}%` }}
              onMouseEnter={() => setHoveredCategory(item.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() =>
                onSelectCategory(
                  selectedCategory?.toLowerCase() === item.name.toLowerCase() ? null : item.name
                )
              }
              className={cn(
                item.color,
                'h-full transition-all duration-300 cursor-pointer relative group',
                isSelected && 'ring-2 ring-green-300 ring-offset-1 ring-offset-black z-10 brightness-125',
                isHovered && 'brightness-125 scale-y-125'
              )}
              title={`${item.name}: ${item.count} (${item.percentage}%) - Click to filter`}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown Badges */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {stats.breakdown.map((item) => {
          const isSelected = selectedCategory?.toLowerCase() === item.name.toLowerCase();
          const isHovered = hoveredCategory === item.name;

          return (
            <button
              key={item.name}
              onClick={() =>
                onSelectCategory(
                  selectedCategory?.toLowerCase() === item.name.toLowerCase() ? null : item.name
                )
              }
              onMouseEnter={() => setHoveredCategory(item.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all border',
                isSelected
                  ? 'bg-green-500 text-black border-green-300 font-bold shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                  : isHovered
                  ? 'bg-green-950/60 text-green-300 border-green-500/50'
                  : 'bg-black/50 text-green-500/70 border-green-500/15 hover:border-green-500/40'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', item.color)} />
              <span>{item.name}</span>
              <span className={isSelected ? 'text-black/70' : 'text-green-500/50'}>
                {item.percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
