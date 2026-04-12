'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  priority?: boolean;
}

export function ProjectCard({ project, onClick, priority }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative bg-black border border-green-500/40 rounded-lg overflow-hidden cursor-pointer',
        'hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300',
        onClick && 'cursor-pointer'
      )}
      onClick={() => onClick?.(project)}
    >
      {/* Project image */}
      <div className="relative h-48 bg-green-900/20 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-green-500/50 animate-pulse">
            <span className="font-mono text-xs">[LOADING...]</span>
          </div>
        )}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-green-400 text-green-400 text-xs font-mono hover:bg-green-400 hover:text-black transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              [VIEW_LIVE]
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-green-400 text-green-400 text-xs font-mono hover:bg-green-400 hover:text-black transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              [VIEW_SOURCE]
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 min-h-[180px]">
        {/* Category & ID */}
        <div className="flex justify-between items-center mb-1">
          <div className="text-green-500/40 text-[10px] font-mono uppercase tracking-wider">
            {project.category || 'General'}
          </div>
          <div className="text-green-500/60 text-[10px] font-mono">
            #{project.id.slice(-4)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-green-400 font-mono font-semibold text-base leading-tight group-hover:text-green-300 transition-colors line-clamp-1 mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-green-300/70 text-xs line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-green-500/30 text-green-400 text-[9px] px-1.5 py-0 font-mono bg-black/50"
            >
              #{tag.toLowerCase()}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <span className="text-green-500/40 text-[9px] font-mono self-center">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="text-[10px] font-mono pt-2 border-t border-green-500/10 flex justify-between items-center">
          <span className="text-green-500/30 uppercase">Author:</span>
          <span className="text-green-500/60">{project.author}</span>
        </div>
      </div>

      {/* Corner bracket decoration */}
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-green-500/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-green-500/40" />
    </motion.div>
  );
}
