'use client';

import { AuditLog as AuditLogType } from '@/types';
import 'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AuditLogProps {
  logs: AuditLogType[];
}

export function AuditLog({ logs }: AuditLogProps) {
  return (
    <div className="bg-black border border-green-500/30 rounded-lg overflow-hidden font-mono">
      <div className="bg-green-900/30 border-b border-green-500/30 px-4 py-3">
        <h3 className="text-green-400 text-sm font-semibold">
          [AUDIT_LOGS]
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-green-500/20 hover:bg-transparent">
              <TableHead className="text-green-400/70 w-40">TIMESTAMP</TableHead>
              <TableHead className="text-green-400/70 w-24">METHOD</TableHead>
              <TableHead className="text-green-400/70 w-32">ROUTE</TableHead>
              <TableHead className="text-green-400/70">ACTION</TableHead>
              <TableHead className="text-green-400/70 w-24">USER</TableHead>
              <TableHead className="text-green-400/70 w-20">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow
                key={index}
                className="border-green-500/10 hover:bg-green-900/10"
              >
                <TableCell className="text-green-500/60 text-xs font-mono">
                  {new Date(log.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>
                <TableCell className="text-green-500/80 text-xs">
                  {log.method}
                </TableCell>
                <TableCell className="text-green-400 text-xs font-mono">
                  {log.route}
                </TableCell>
                <TableCell className="text-green-300 text-sm">
                  {log.action}
                </TableCell>
                <TableCell className="text-green-500/60 text-xs font-mono">
                  {log.user}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={log.status === 'success' ? 'default' : 'destructive'}
                    className={cn(
                      'text-[10px] font-mono',
                      log.status === 'success'
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    )}
                  >
                    {log.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
