import { MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { getSupportIssues } from '@/lib/queries/admin';
import { formatDate } from '@/lib/utils';


export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const { issues, openIssues, resolvedIssues } = await getSupportIssues();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-sm text-[var(--text-muted)]">Track failed payments and refund requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Open Issues" value={String(openIssues)} icon={MessageCircle} />
        <StatCard title="Resolved" value={String(resolvedIssues)} icon={CheckCircle} />
        <StatCard title="Total" value={String(issues.length)} icon={Clock} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Issues</CardTitle>
          <Badge variant="default">{issues.length} issues</Badge>
        </CardHeader>

        {issues.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No issues"
            description="No failed payments or refund requests to review."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={`${issue.type}-${issue.id}`}>
                  <TableCell className="font-mono text-xs font-medium text-[var(--text-primary)]">{issue.orderNumber}</TableCell>
                  <TableCell>{issue.customer}</TableCell>
                  <TableCell className="text-[var(--text-primary)]">{issue.subject}</TableCell>
                  <TableCell>
                    <Badge variant={issue.priority === 'high' ? 'error' : 'warning'}>{issue.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.status === 'open' ? 'info' : 'success'}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(issue.created)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
