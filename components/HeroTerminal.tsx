'use client';

import { useState, useEffect, useRef } from 'react';
import { Project } from '@/types';
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroTerminalProps {
  projects: Project[];
  onSelectCategory?: (category: string) => void;
  onSetTheme?: (theme: 'matrix' | 'amber' | 'cyan') => void;
}

interface LogLine {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'success';
  text: string;
}

export function HeroTerminal({ projects, onSelectCategory, onSetTheme }: HeroTerminalProps) {
  const [logs, setLogs] = useState<LogLine[]>([
    { id: '1', type: 'system', text: '> KERNEL_INIT: Booting showcase environment v1.3.5...' },
    { id: '2', type: 'system', text: '> AUTHOR: Rajjit Laishram // ARCHITECTURE: Next.js 16 + GSAP' },
    { id: '3', type: 'success', text: `> METRICS: ${projects.length || '30+'} engineering projects loaded in registry.` },
    { id: '4', type: 'system', text: '> HINT: Type "help" to explore CLI commands or select categories below.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    const userEntry: LogLine = {
      id: Date.now().toString(),
      type: 'input',
      text: `$ ${cmd}`,
    };

    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts.slice(1).join(' ');

    const newLogs: LogLine[] = [userEntry];

    switch (mainCmd) {
      case 'help':
        newLogs.push(
          { id: `${Date.now()}-1`, type: 'output', text: 'AVAILABLE COMMANDS:' },
          { id: `${Date.now()}-2`, type: 'output', text: '  ls, projects      - List all registered projects' },
          { id: `${Date.now()}-3`, type: 'output', text: '  filter <category> - Filter by category (e.g. filter web)' },
          { id: `${Date.now()}-4`, type: 'output', text: '  theme <mode>      - Switch theme (matrix | amber | cyan)' },
          { id: `${Date.now()}-5`, type: 'output', text: '  stats             - Display showcase metrics & telemetry' },
          { id: `${Date.now()}-6`, type: 'output', text: '  whoami, contact   - Display author information' },
          { id: `${Date.now()}-7`, type: 'output', text: '  clear, cls        - Clear the terminal console' }
        );
        break;

      case 'ls':
      case 'projects':
      case 'dir':
        if (projects.length === 0) {
          newLogs.push({ id: `${Date.now()}-1`, type: 'output', text: 'Fetching project index...' });
        } else {
          projects.slice(0, 8).forEach((p, idx) => {
            newLogs.push({
              id: `${Date.now()}-${idx}`,
              type: 'output',
              text: `[${(p.category || 'PROJECT').toUpperCase().padEnd(10)}] #${p.id.slice(-4)} - ${p.title}`,
            });
          });
          if (projects.length > 8) {
            newLogs.push({
              id: `${Date.now()}-more`,
              type: 'system',
              text: `... and ${projects.length - 8} more projects displayed below.`,
            });
          }
        }
        break;

      case 'filter':
        if (!arg) {
          newLogs.push({ id: `${Date.now()}-err`, type: 'error', text: 'Usage: filter <all|web|apps|demos|projects>' });
        } else {
          onSelectCategory?.(arg);
          newLogs.push({ id: `${Date.now()}-ok`, type: 'success', text: `Filter applied for category: "${arg.toUpperCase()}".` });
        }
        break;

      case 'theme':
        if (arg === 'matrix' || arg === 'amber' || arg === 'cyan') {
          onSetTheme?.(arg);
          newLogs.push({ id: `${Date.now()}-ok`, type: 'success', text: `Color palette updated to [${arg.toUpperCase()}].` });
        } else {
          newLogs.push({ id: `${Date.now()}-err`, type: 'error', text: 'Valid themes: matrix, amber, cyan' });
        }
        break;

      case 'stats':
        const categoriesCount = new Set(projects.map((p) => p.category || 'General')).size;
        newLogs.push(
          { id: `${Date.now()}-s1`, type: 'output', text: `[TELEMETRY STATS]` },
          { id: `${Date.now()}-s2`, type: 'output', text: `  Total Projects: ${projects.length}` },
          { id: `${Date.now()}-s3`, type: 'output', text: `  Active Categories: ${categoriesCount}` },
          { id: `${Date.now()}-s4`, type: 'output', text: `  Status: 100% OPERATIONAL` }
        );
        break;

      case 'whoami':
      case 'contact':
      case 'author':
        newLogs.push(
          { id: `${Date.now()}-a1`, type: 'output', text: 'AUTHOR: Rajjit Laishram' },
          { id: `${Date.now()}-a2`, type: 'output', text: 'GITHUB: github.com/rajjitlai' },
          { id: `${Date.now()}-a3`, type: 'output', text: 'ROLE: Full-Stack Engineer & Systems Specialist' }
        );
        break;

      case 'clear':
      case 'cls':
        setLogs([]);
        setInputVal('');
        return;

      default:
        newLogs.push({
          id: `${Date.now()}-err`,
          type: 'error',
          text: `Command not recognized: "${mainCmd}". Type "help" for a list of valid commands.`,
        });
    }

    setLogs((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    }
  };

  return (
    <div className="bg-[#080d09]/90 border border-green-500/40 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.25)] overflow-hidden font-mono text-xs backdrop-blur-md">
      {/* Header / Titlebar */}
      <div className="bg-green-950/40 border-b border-green-500/30 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-green-300 font-semibold text-[11px] flex items-center gap-1 ml-1">
            <TerminalIcon className="w-3 h-3 text-green-400" />
            terminal://interactive_prompt.sh
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="text-[10px] text-green-500/60 hover:text-green-300 transition-colors"
          >
            [CLEAR]
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div
        className="p-3.5 max-h-52 overflow-y-auto space-y-1 custom-scrollbar cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn(
              'leading-relaxed font-mono',
              log.type === 'system' && 'text-green-500/70',
              log.type === 'input' && 'text-green-300 font-semibold',
              log.type === 'output' && 'text-green-400/90 pl-2',
              log.type === 'success' && 'text-green-400 font-medium text-glow-sm',
              log.type === 'error' && 'text-red-400 font-mono'
            )}
          >
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input */}
      <form
        onSubmit={handleCommand}
        className="border-t border-green-500/20 bg-black/60 px-3 py-2 flex items-center gap-2"
      >
        <span className="text-green-400 font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help', 'ls', 'stats', 'filter web'..."
          className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-800 text-xs font-mono"
        />
        <button
          type="submit"
          className="text-green-500/60 hover:text-green-300 transition-colors p-1"
          title="Run command"
        >
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
