import { Users } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { getAdminCustomers } from '@/lib/queries/admin';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';


export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-[var(--text-muted)]">{customers.length} customers</p>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customer profiles are created when they make their first purchase."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        {getInitials(customer.name || customer.email)}
                      </span>
                    </div>
                    <div>
                      {customer.name && <p className="text-sm font-medium text-[var(--text-primary)]">{customer.name}</p>}
                      <p className="text-xs text-[var(--text-muted)]">{customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.orderCount}</TableCell>
                <TableCell className="font-medium text-[var(--text-primary)]">{formatCurrency(customer.totalSpent)}</TableCell>
                <TableCell>{formatDate(customer.lastOrder)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
