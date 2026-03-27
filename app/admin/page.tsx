'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal } from '@/components/Terminal';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, lastUpdated: '' });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const projects: Project[] = data.data || [];
        setStats({
          total: projects.length,
          lastUpdated:
            projects.length > 0
              ? new Date(
                  projects.reduce((latest, p) =>
                    new Date(p.createdAt) > new Date(latest) ? p.createdAt : latest,
                    projects[0]?.createdAt || new Date().toISOString()
                  )
                ).toLocaleDateString()
              : 'N/A',
        });
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-green-500/20 bg-black/50 sticky top-4 z-30 mx-4 mt-4 rounded-lg backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-green-400 font-mono font-bold text-lg">
              <span className="text-green-500">[</span>
              ADMIN_PANEL
              <span className="text-green-500">]</span>
            </h1>
            <p className="text-green-500/60 text-xs font-mono mt-1">
              Authenticated via SMTP-OTP
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/admin/projects')}
              variant="outline"
              className="border-green-500/30 text-green-400 font-mono text-xs hover:bg-green-900/30"
            >
              [MANAGE_PROJECTS]
            </Button>
            <Button
              onClick={() => router.push('/admin/logs')}
              variant="outline"
              className="border-green-500/30 text-green-400 font-mono text-xs hover:bg-green-900/30"
            >
              [VIEW_LOGS]
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              variant="ghost"
              className="text-red-400/60 font-mono text-xs hover:text-red-400 hover:bg-red-900/20"
            >
              {loggingOut ? '[LOGGING_OUT...]' : '[LOGOUT]'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Terminal title="[PROJECTS]">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 font-mono">
                {stats.total}
              </div>
              <div className="text-green-500/60 text-xs mt-1">TOTAL</div>
            </div>
          </Terminal>

          <Terminal title="[STATUS]">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {stats.lastUpdated}
              </div>
              <div className="text-green-500/60 text-xs mt-1">LAST UPDATED</div>
            </div>
          </Terminal>

          <Terminal title="[SYSTEM]">
            <div className="text-center">
              <div className="text-green-400 font-mono text-sm">
                <span className="text-green-500">{'>'}</span> OPERATIONAL
              </div>
              <div className="text-green-500/60 text-xs mt-3">
                <p>DB: GOOGLE_SHEETS</p>
                <p>AUTH: SMTP-OTP</p>
              </div>
            </div>
          </Terminal>
        </div>

        {/* Quick Actions */}
        <Terminal title="[QUICK_ACTIONS]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/projects')}
              className="p-4 border border-green-500/30 rounded bg-black/30 hover:bg-green-900/20 text-left font-mono group transition-all"
            >
              <div className="text-green-400 text-sm font-semibold mb-2 group-hover:text-green-300">
                [MANAGE_PROJECTS]
              </div>
              <div className="text-green-500/50 text-xs">
                Add, edit, or delete project entries
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/logs')}
              className="p-4 border border-green-500/30 rounded bg-black/30 hover:bg-green-900/20 text-left font-mono group transition-all"
            >
              <div className="text-green-400 text-sm font-semibold mb-2 group-hover:text-green-300">
                [AUDIT_LOGS]
              </div>
              <div className="text-green-500/50 text-xs">
                View system activity and changes
              </div>
            </button>
          </div>
        </Terminal>

        <Terminal title="[RECENT_ACTIVITY]">
          <div className="text-green-500/60 text-sm">
            Loading recent logs...
          </div>
        </Terminal>
      </main>
    </div>
  );
}
