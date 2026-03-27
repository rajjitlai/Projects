import { appendAuditLog } from './sheets';

export interface AuditOptions {
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  action: string;
  status: 'success' | 'error';
  user: string;
}

/**
 * Append an audit log entry to Google Sheets
 * This function is called at the end of every API route handler
 */
export async function logAction(options: AuditOptions): Promise<void> {
  try {
    await appendAuditLog(options);
  } catch (error) {
    // Audit failures should not break the main operation
    console.error('Audit log failed:', error);
  }
}

/**
 * Helper to create success audit entry
 */
export function success(options: Omit<AuditOptions, 'status'>): Promise<void> {
  return logAction({ ...options, status: 'success' });
}

/**
 * Helper to create error audit entry
 */
export function error(options: Omit<AuditOptions, 'status'>): Promise<void> {
  return logAction({ ...options, status: 'error' });
}
