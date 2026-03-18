import { Search, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatCard } from '@/components/ui/stat-card';

const tickets = [
  { id: 'TKT-001', customer: 'mike@example.com', subject: 'Download link expired', status: 'open', priority: 'medium', created: 'Mar 14, 2026' },
  { id: 'TKT-002', customer: 'alex@example.com', subject: 'Refund request for ORD-M3N4O5', status: 'open', priority: 'high', created: 'Mar 12, 2026' },
  { id: 'TKT-003', customer: 'emma@example.com', subject: 'License key not working', status: 'resolved', priority: 'medium', created: 'Mar 10, 2026' },
];

export default function AdminSupportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage customer support requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Open Tickets" value="2" icon={MessageCircle} />
        <StatCard title="Avg Response" value="4h" icon={Clock} />
        <StatCard title="Resolved (30d)" value="15" icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono text-xs font-medium text-[var(--text-primary)]">{ticket.id}</TableCell>
                <TableCell>{ticket.customer}</TableCell>
                <TableCell className="text-[var(--text-primary)]">{ticket.subject}</TableCell>
                <TableCell>
                  <Badge variant={ticket.priority === 'high' ? 'error' : 'warning'}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={ticket.status === 'open' ? 'info' : 'success'}>{ticket.status}</Badge>
                </TableCell>
                <TableCell>{ticket.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
