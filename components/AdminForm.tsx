'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Terminal } from './Terminal';

interface AdminFormProps {
  project?: Project | null;
  onSubmit: (data: {
    title: string;
    description: string;
    image: string;
    liveUrl?: string;
    repoUrl?: string;
    tags: string[];
    author: string;
    featured: boolean;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function AdminForm({ project, onSubmit, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    liveUrl: '',
    repoUrl: '',
    tags: '',
    author: '',
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        liveUrl: project.liveUrl || '',
        repoUrl: project.repoUrl || '',
        tags: project.tags.join(', '),
        author: project.author,
        featured: project.featured,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      if (!project) {
        // Reset form for new project
        setFormData({
          title: '',
          description: '',
          image: '',
          liveUrl: '',
          repoUrl: '',
          tags: '',
          author: '',
          featured: false,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Terminal title={project ? '[EDIT_PROJECT]' : '[CREATE_PROJECT]'} glow>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-green-400 text-xs font-mono block">
              TITLE:
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="Enter project title..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-green-400 text-xs font-mono block">
              DESCRIPTION:
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20 min-h-24"
              placeholder="Enter project description..."
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              IMAGE_URL (Cloudinary):
            </label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="https://res.cloudinary.com/..."
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              AUTHOR:
            </label>
            <Input
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="Author name..."
              required
            />
          </div>

          {/* Live URL */}
          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              LIVE_URL (optional):
            </label>
            <Input
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({ ...formData, liveUrl: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="https://..."
            />
          </div>

          {/* Repo URL */}
          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              REPO_URL (optional):
            </label>
            <Input
              value={formData.repoUrl}
              onChange={(e) =>
                setFormData({ ...formData, repoUrl: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="https://github.com/..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-green-400 text-xs font-mono block">
              TAGS (comma-separated):
            </label>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="react, next.js, typescript..."
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2 md:col-span-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 accent-green-500 bg-black border-green-500/30"
            />
            <label
              htmlFor="featured"
              className="text-green-400 text-xs font-mono cursor-pointer"
            >
              FEATURED PROJECT
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-green-500/20">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-900/50 hover:text-green-300 font-mono text-xs px-6 py-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">[PROCESSING...]</span>
            ) : project ? (
              '[UPDATE]'
            ) : (
              '[CREATE]'
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-green-500/60 hover:text-green-400 hover:bg-green-900/20 font-mono text-xs px-6 py-2"
            >
              [CANCEL]
            </Button>
          )}
        </div>
      </form>
    </Terminal>
  );
}
