'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from '@/components/Terminal';
import { Project } from '@/types';
import { AceForm } from '@/components/AceForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AceManagementPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (formData: Partial<Project>) => {
    const url = editingProject ? `/api/ace/projects/${editingProject.id}` : '/api/ace/projects';
    const method = editingProject ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error('Failed to save record');
    }

    await fetchProjects();
    setEditingProject(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const res = await fetch(`/api/ace/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchProjects();
    } else {
      console.error('Failed to delete record');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">
          [LOADING...]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-green-500/20 bg-black/50 sticky top-4 z-30 mx-4 mt-4 rounded-lg backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-green-400 font-mono font-bold text-lg">
              <span className="text-green-500">[</span>
              MANAGEMENT_PORTAL
              <span className="text-green-500">]</span>
            </h1>
            <p className="text-green-500/60 text-xs font-mono mt-1">
              Create, update, or remove database entries
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingProject(null);
                setIsFormOpen(true);
              }}
              className="bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-900/50 font-mono text-xs"
            >
              <Plus className="w-4 h-4 mr-2" />
              [NEW_ENTRY]
            </Button>
            <Button
              onClick={() => router.push('/ace')}
              variant="ghost"
              className="text-green-500/60 hover:text-green-400 font-mono text-xs"
            >
              [BACK]
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Terminal>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-green-500/20 hover:bg-transparent">
                  <TableHead className="text-green-400/70 w-16">ID</TableHead>
                  <TableHead className="text-green-400/70">TITLE</TableHead>
                  <TableHead className="text-green-400/70 hidden md:table-cell">
                    TAGS
                  </TableHead>
                  <TableHead className="text-green-400/70 hidden lg:table-cell">
                    AUTHOR
                  </TableHead>
                  <TableHead className="text-green-400/70 w-24">FEATURED</TableHead>
                  <TableHead className="text-green-400/70 w-32">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="border-green-500/10 hover:bg-green-900/10"
                  >
                    <TableCell className="text-green-500/60 font-mono text-xs">
                      {project.id}
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-green-900/30 border border-green-500/30 text-green-400 font-mono rounded"
                          >
                            {tag.toUpperCase()}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-green-500/60">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-green-500/60 text-sm">
                      {project.author}
                    </TableCell>
                    <TableCell>
                      {project.featured ? (
                        <span className="text-green-400 text-xs font-mono">
                          [YES]
                        </span>
                      ) : (
                        <span className="text-green-500/40 text-xs font-mono">
                          [NO]
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingProject(project);
                            setIsFormOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/30"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(project.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-green-500/60">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Terminal>

        {/* Edit/Create Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="bg-[#0a0a0a] border-green-500/30 text-green-400 font-mono max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-green-400 font-mono text-xl">
                {editingProject ? '[UPDATE_RECORD]' : '[CREATE_RECORD]'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <AceForm
                project={editingProject}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setEditingProject(null);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
