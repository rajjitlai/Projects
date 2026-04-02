'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Terminal } from './Terminal';

interface AceFormProps {
  project?: Project | null;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel?: () => void;
}

export function AceForm({ project, onSubmit, onCancel }: AceFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    liveUrl: '',
    repoUrl: '',
    tags: [],
    author: 'Rajjit Laishram',
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        tags: project.tags || [],
      });
    }
  }, [project]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/ace/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Terminal title={project ? '[EDIT_RECORD]' : '[NEW_RECORD]'} glow>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Enter title..."
              required
            />
          </div>

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
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-green-400 text-xs font-mono">
                IMAGE_URL:
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  id="image-upload-ace"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload-ace"
                  className="text-green-500/80 hover:text-green-400 text-[10px] font-mono border border-green-500/30 px-2 py-0.5 rounded cursor-pointer bg-green-900/10 hover:bg-green-900/20 flex items-center gap-1"
                >
                  {uploading ? '[UPLOADING...]' : '[UPLOAD_IMAGE]'}
                </label>
              </div>
            </div>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="https://..."
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              TAGS (comma-separated):
            </label>
            <Input
              value={formData.tags?.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              className="bg-black border-green-500/30 text-green-300 font-mono focus:border-green-400 focus:ring-green-400/20"
              placeholder="react, typescript..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              LIVE_URL:
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

          <div className="space-y-2">
            <label className="text-green-400 text-xs font-mono block">
              SOURCE_URL:
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

          <div className="flex items-center space-x-2 md:col-span-2">
            <input
              type="checkbox"
              id="featured-ace"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 accent-green-500 bg-black border-green-500/30"
            />
            <label
              htmlFor="featured-ace"
              className="text-green-400 text-xs font-mono cursor-pointer uppercase"
            >
              Mark as featured
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-green-500/20">
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-900/50 hover:text-green-300 font-mono text-xs px-6 py-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">[COMMITING...]</span>
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
