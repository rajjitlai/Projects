'use client';

import { useEffect, useRef } from 'react';
import { ThemeMode } from './ThemeSelector';

interface CyberBackgroundProps {
  theme?: ThemeMode;
}

export function CyberBackground({ theme = 'matrix' }: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 30), 45);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Determine colors based on theme
    const getColor = (alpha: number) => {
      if (theme === 'amber') return `rgba(245, 158, 11, ${alpha})`;
      if (theme === 'cyan') return `rgba(6, 182, 212, ${alpha})`;
      return `rgba(34, 197, 94, ${alpha})`;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background cyber grid
      const gridSize = 60;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = getColor(0.025);

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw & update floating particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = getColor(p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle data links
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.strokeStyle = getColor(0.04 * (1 - dist / 100));
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Particle & Grid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-60" />

      {/* CRT Vignette Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      {/* Scanline pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_100%)] bg-[length:100%_4px] opacity-70" />
    </div>
  );
}
