'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from '@/components/Terminal';
import { Review } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, ArrowLeft } from 'lucide-react';

export default function ReviewModerationPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/ace/reviews');
      const data = await res.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const res = await fetch('/api/ace/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved: !currentStatus }),
    });

    if (res.ok) {
      fetchReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;

    const res = await fetch(`/api/ace/reviews?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchReviews();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">[LOADING_REVIEWS...]</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-green-500/20 bg-black/50 sticky top-4 z-30 mx-4 mt-4 rounded-lg backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Button
              onClick={() => router.push('/ace')}
              variant="ghost"
              className="h-8 w-8 p-0 text-green-500/60 hover:text-green-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-green-400 font-mono font-bold text-lg">
                <span className="text-green-500">[</span>
                REVIEW_MODERATION
                <span className="text-green-500">]</span>
              </h1>
              <p className="text-green-500/60 text-[10px] font-mono mt-0.5">
                Manage user feedback and logs
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Terminal>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-green-500/20 hover:bg-transparent">
                  <TableHead className="text-green-400/70 w-32">DATE</TableHead>
                  <TableHead className="text-green-400/70 w-24">SOURCE</TableHead>
                  <TableHead className="text-green-400/70 w-32">AUTHOR</TableHead>
                  <TableHead className="text-green-400/70">CONTENT</TableHead>
                  <TableHead className="text-green-400/70 w-24">APPROVED</TableHead>
                  <TableHead className="text-green-400/70 w-24">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r) => (
                  <TableRow
                    key={r.id}
                    className="border-green-500/10 hover:bg-green-900/10"
                  >
                    <TableCell className="text-green-500/60 font-mono text-[10px]">
                      {new Date(r.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-green-500/80 font-mono text-[10px]">
                      {r.projectId === 'site' ? '[SYSTEM]' : r.projectId.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-green-400 font-bold uppercase text-xs">
                      {r.author}
                    </TableCell>
                    <TableCell className="text-green-300/80 text-xs italic py-4">
                      "{r.content}"
                    </TableCell>
                    <TableCell>
                      <span className={r.isApproved ? 'text-green-400' : 'text-red-400/60'}>
                        {r.isApproved ? '[YES]' : '[NO]'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleApproval(r.id, r.isApproved)}
                          className={`h-8 w-8 p-0 ${r.isApproved ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} hover:bg-green-900/30`}
                        >
                          {r.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(r.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-green-500/40 font-mono">
                      [GHOST_ARCHIVE: NO_REVIEWS_FOUND]
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Terminal>
      </main>
    </div>
  );
}
