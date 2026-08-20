'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative bg-[#090d0a] border border-green-500/30 rounded-lg overflow-hidden',
        'hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-300',
        onClick && 'cursor-pointer'
      )}
      onClick={() => onClick?.(project)}
    >
      {/* Spotlight effect overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(34, 197, 94, 0.12), transparent 75%)`,
          }}
        />
      )}

      {/* Project image */}
      <div className="relative h-48 bg-green-950/20 overflow-hidden border-b border-green-500/20">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-green-500/50 animate-pulse">
            <span className="font-mono text-xs">[LOADING_ASSET...]</span>
          </div>
        )}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-105',
            imageLoaded ? 'opacity-85 group-hover:opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />

        {/* Status tag on top of image */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur border border-green-500/40 px-2 py-0.5 rounded text-[9px] font-mono">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              project.liveUrl
                ? 'bg-green-400 animate-ping'
                : 'bg-emerald-500/70'
            )}
          />
          <span className="text-green-400 font-semibold">
            {project.liveUrl ? 'LIVE' : 'SRC'}
          </span>
          {project.featured && (
            <span className="text-yellow-400 ml-1">★ FEATURED</span>
          )}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-500 text-black text-xs font-mono font-bold hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              [VISIT_LIVE]
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-black/90 border border-green-400 text-green-400 text-xs font-mono hover:bg-green-950/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              [VIEW_CODE]
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 min-h-[180px] relative z-20">
        {/* Category & ID */}
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-green-500/60 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
            <span className="text-green-500/40">&gt;</span>
            {project.category || 'General'}
          </div>
          <div className="text-green-500/50 text-[10px] font-mono">
            #{project.id.slice(-4)}
          </div>
        </div>

        {/* Title with Phosphor glow on hover */}
        <h3 className="text-green-400 font-mono font-semibold text-base leading-tight group-hover:text-green-300 group-hover:text-glow transition-all line-clamp-1 mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-green-300/80 text-xs line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-green-500/30 text-green-300 text-[9px] px-1.5 py-0 font-mono bg-black/60 hover:border-green-400 transition-colors"
            >
              #{tag.toLowerCase()}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <span className="text-green-500/50 text-[9px] font-mono self-center">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="text-[10px] font-mono pt-2 border-t border-green-500/15 flex justify-between items-center text-green-500/70">
          <span className="text-green-500/40 uppercase">AUTHOR:</span>
          <span className="text-green-400/90">{project.author}</span>
        </div>
      </div>

      {/* Corner bracket decoration */}
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-green-500/40 group-hover:border-green-400 group-hover:scale-125 transition-all duration-300" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-green-500/40 group-hover:border-green-400 group-hover:scale-125 transition-all duration-300" />
    </motion.div>
  );
}
