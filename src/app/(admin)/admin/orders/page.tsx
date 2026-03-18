import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const orders = [
  { id: 'ORD-A1B2C3', customer: 'john@example.com', date: 'Mar 15, 2026', total: '$49.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1 },
  { id: 'ORD-D4E5F6', customer: 'jane@example.com', date: 'Mar 14, 2026', total: '$79.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1 },
  { id: 'ORD-G7H8I9', customer: 'mike@example.com', date: 'Mar 14, 2026', total: '$29.00', payment: 'Pending', fulfillment: 'Unfulfilled', items: 2 },
  { id: 'ORD-J0K1L2', customer: 'sara@example.com', date: 'Mar 13, 2026', total: '$59.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1 },
  { id: 'ORD-M3N4O5', customer: 'alex@example.com', date: 'Mar 12, 2026', total: '$128.00', payment: 'Failed', fulfillment: 'Unfulfilled', items: 3 },
  { id: 'ORD-P6Q7R8', customer: 'emma@example.com', date: 'Mar 11, 2026', total: '$49.00', payment: 'Refunded', fulfillment: 'Unfulfilled', items: 1 },
];

function paymentBadgeVariant(status: string) {
  switch (status) {
    case 'Paid': return 'success' as const;
    case 'Pending': return 'warning' as const;
    case 'Failed': return 'error' as const;
    case 'Refunded': return 'default' as const;
    default: return 'default' as const;
  }
}

function fulfillmentBadgeVariant(status: string) {
  switch (status) {
    case 'Fulfilled': return 'success' as const;
    case 'Unfulfilled': return 'warning' as const;
    default: return 'default' as const;
  }
}

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--text-muted)]">{orders.length} orders</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Fulfillment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell className="font-medium text-[var(--text-primary)]">{order.total}</TableCell>
              <TableCell>
                <Badge variant={paymentBadgeVariant(order.payment)}>{order.payment}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={fulfillmentBadgeVariant(order.fulfillment)}>{order.fulfillment}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
