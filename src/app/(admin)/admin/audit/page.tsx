import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { getAuditLogs } from '@/lib/queries/admin';
import { formatDateTime } from '@/lib/utils';

function actionBadge(action: string) {
  if (action.includes('create') || action.includes('fulfill')) return 'success' as const;
  if (action.includes('fail') || action.includes('refund') || action.includes('delete')) return 'error' as const;
  if (action.includes('update') || action.includes('import')) return 'info' as const;
  if (action.includes('paid')) return 'success' as const;
  return 'default' as const;
}

interface AuditPageProps {
  searchParams: Promise<{ page?: string }>;
}


export const dynamic = 'force-dynamic';

export default async function AdminAuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1');
  const { logs, total } = await getAuditLogs({ page });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-[var(--text-muted)]">{total} events tracked</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No audit logs yet"
          description="System actions and admin operations will be logged here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">{formatDateTime(log.createdAt)}</TableCell>
                <TableCell>
                  <span className={!log.user ? 'text-[var(--text-muted)]' : ''}>
                    {log.user?.email ?? 'System'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={actionBadge(log.action)}>{log.action}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{log.entity}{log.entityId ? `/${log.entityId}` : ''}</span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {log.data ? JSON.stringify(log.data) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
