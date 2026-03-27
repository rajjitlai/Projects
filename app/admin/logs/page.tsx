'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuditLog } from '@/components/AuditLog';
import { AuditLog as AuditLogType } from '@/types';
import { Button } from '@/components/ui/button';

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  const fetchLogs = async (limitVal: number) => {
    try {
      const res = await fetch(`/api/logs?limit=${limitVal}`);
      const data = await res.json();
      setLogs(data.data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(limit);
  }, [limit]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">
          [LOADING_LOGS...]
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
              AUDIT_LOGS
              <span className="text-green-500">]</span>
            </h1>
            <p className="text-green-500/60 text-xs font-mono mt-1">
              System activity and API calls
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-black border border-green-500/30 text-green-400 text-xs font-mono px-3 py-2 rounded"
            >
              <option value={10}>Last 10</option>
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
              <option value={500}>Last 500</option>
            </select>
            <Button
              onClick={() => router.push('/admin')}
              variant="ghost"
              className="text-green-500/60 hover:text-green-400 font-mono text-xs"
            >
              [BACK]
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AuditLog logs={logs} />
      </main>
    </div>
  );
}
