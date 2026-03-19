import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { getOrders } from '@/lib/queries/orders';
import { formatCurrency, formatDate } from '@/lib/utils';

function statusBadge(status: string) {
  switch (status) {
    case 'PAID': return 'success' as const;
    case 'PENDING': return 'warning' as const;
    case 'FAILED': return 'error' as const;
    case 'REFUNDED': return 'default' as const;
    default: return 'default' as const;
  }
}

function fulfillmentBadge(status: string) {
  switch (status) {
    case 'FULFILLED': return 'success' as const;
    case 'PARTIALLY_FULFILLED': return 'info' as const;
    default: return 'warning' as const;
  }
}

interface OrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}


export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1');
  const { orders, total } = await getOrders({
    page,
    status: params.status,
    search: params.search,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--text-muted)]">{total} orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="Orders will appear here when customers make purchases."
        />
      ) : (
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
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell className="font-medium text-[var(--text-primary)]">{formatCurrency(Number(order.total))}</TableCell>
                <TableCell>
                  <Badge variant={statusBadge(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={fulfillmentBadge(order.fulfillmentStatus)}>{order.fulfillmentStatus}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
