import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const customers = [
  { id: '1', email: 'john@example.com', name: 'John Doe', orders: 3, spent: '$177.00', lastOrder: 'Mar 15, 2026' },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith', orders: 5, spent: '$395.00', lastOrder: 'Mar 14, 2026' },
  { id: '3', email: 'mike@example.com', name: 'Mike Johnson', orders: 1, spent: '$29.00', lastOrder: 'Mar 14, 2026' },
  { id: '4', email: 'sara@example.com', name: 'Sara Wilson', orders: 2, spent: '$108.00', lastOrder: 'Mar 13, 2026' },
  { id: '5', email: 'alex@example.com', name: 'Alex Brown', orders: 1, spent: '$128.00', lastOrder: 'Mar 12, 2026' },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-[var(--text-muted)]">{customers.length} customers</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

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
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{customer.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{customer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell className="font-medium text-[var(--text-primary)]">{customer.spent}</TableCell>
              <TableCell>{customer.lastOrder}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
