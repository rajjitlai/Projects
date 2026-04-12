'use client';

import { Terminal } from './Terminal';

export function ProjectSkeleton() {
  return (
    <div className="animate-pulse">
      <Terminal>
        <div className="aspect-video bg-green-900/10 mb-4 rounded" />
        <div className="h-6 bg-green-900/20 w-3/4 mb-2 rounded" />
        <div className="h-4 bg-green-900/10 w-full mb-4 rounded" />
        <div className="flex gap-2">
          <div className="h-4 bg-green-900/20 w-16 rounded" />
          <div className="h-4 bg-green-900/20 w-16 rounded" />
        </div>
      </Terminal>
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  );
}
