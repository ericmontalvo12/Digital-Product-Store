import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDashboardStats } from '@/lib/queries/admin';
import { formatCurrency, formatDate } from '@/lib/utils';


export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Overview of your store performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Revenue (30d)" value={formatCurrency(stats.revenue)} icon={DollarSign} />
        <StatCard title="Orders (30d)" value={stats.orderCount.toString()} icon={ShoppingCart} />
        <StatCard title="Products" value={stats.productCount.toString()} icon={Package} />
        <StatCard title="Customers" value={stats.customerCount.toString()} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <Badge variant="default">Last 5</Badge>
          </CardHeader>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-[var(--text-muted)]">{order.customerEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status === 'PAID' ? 'success' : order.status === 'PENDING' ? 'warning' : order.status === 'FAILED' ? 'error' : 'default'}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">{formatCurrency(Number(order.total))}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No orders yet</p>
          )}
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <Badge variant="default">By revenue</Badge>
          </CardHeader>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((product, i) => (
                <div key={product.productId} className="flex items-center justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)] w-4">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{product.productTitle}</p>
                      <p className="text-xs text-[var(--text-muted)]">{product._count.id} sales</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {formatCurrency(Number(product._sum.total ?? 0))}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No sales yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
