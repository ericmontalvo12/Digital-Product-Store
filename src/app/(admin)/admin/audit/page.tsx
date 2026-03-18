import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const logs = [
  { id: '1', time: 'Mar 15, 10:33 AM', user: 'System', action: 'order.fulfilled', entity: 'Order', entityId: 'ORD-A1B2C3', details: 'Auto-fulfilled after payment' },
  { id: '2', time: 'Mar 15, 10:32 AM', user: 'System', action: 'payment.paid', entity: 'Payment', entityId: 'pay_xyz', details: 'Cash App webhook confirmation' },
  { id: '3', time: 'Mar 15, 09:15 AM', user: 'admin@store.com', action: 'product.updated', entity: 'Product', entityId: 'premium-ui-kit', details: 'Updated price from $39 to $49' },
  { id: '4', time: 'Mar 14, 04:20 PM', user: 'admin@store.com', action: 'product.created', entity: 'Product', entityId: 'seo-toolkit', details: 'New product created' },
  { id: '5', time: 'Mar 14, 02:10 PM', user: 'admin@store.com', action: 'coupon.created', entity: 'Coupon', entityId: 'WELCOME20', details: '20% discount coupon' },
  { id: '6', time: 'Mar 13, 11:00 AM', user: 'System', action: 'order.refunded', entity: 'Order', entityId: 'ORD-P6Q7R8', details: 'Refund processed via Cash App' },
  { id: '7', time: 'Mar 12, 10:45 AM', user: 'System', action: 'payment.failed', entity: 'Payment', entityId: 'pay_fail', details: 'Payment declined by provider' },
  { id: '8', time: 'Mar 12, 09:00 AM', user: 'admin@store.com', action: 'inventory.imported', entity: 'Inventory', entityId: 'batch_001', details: '50 license keys imported' },
];

function actionBadge(action: string) {
  if (action.includes('created') || action.includes('fulfilled')) return 'success' as const;
  if (action.includes('failed') || action.includes('refunded')) return 'error' as const;
  if (action.includes('updated') || action.includes('imported')) return 'info' as const;
  if (action.includes('paid')) return 'success' as const;
  return 'default' as const;
}

export default function AdminAuditPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-[var(--text-muted)]">Track all actions and system events</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

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
              <TableCell className="whitespace-nowrap">{log.time}</TableCell>
              <TableCell>
                <span className={log.user === 'System' ? 'text-[var(--text-muted)]' : ''}>
                  {log.user}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={actionBadge(log.action)}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{log.entity}/{log.entityId}</span>
              </TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
