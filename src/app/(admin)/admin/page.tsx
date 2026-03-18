import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Overview of your store performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Revenue"
          value="$12,450"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Orders"
          value="156"
          change="+8.2%"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Products"
          value="24"
          change="+2 new"
          changeType="neutral"
          icon={Package}
        />
        <StatCard
          title="Customers"
          value="89"
          change="+5.1%"
          changeType="positive"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <Badge variant="default">Last 7 days</Badge>
          </CardHeader>
          <div className="space-y-3">
            {[
              { id: 'ORD-A1B2C3', customer: 'john@example.com', amount: '$49.00', status: 'Paid' },
              { id: 'ORD-D4E5F6', customer: 'jane@example.com', amount: '$79.00', status: 'Paid' },
              { id: 'ORD-G7H8I9', customer: 'mike@example.com', amount: '$29.00', status: 'Pending' },
              { id: 'ORD-J0K1L2', customer: 'sara@example.com', amount: '$59.00', status: 'Fulfilled' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-[var(--text-muted)]">{order.customer}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-medium">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <Badge variant="default">By revenue</Badge>
          </CardHeader>
          <div className="space-y-3">
            {[
              { title: 'Developer Toolkit Pro', sales: 42, revenue: '$3,318' },
              { title: 'Premium UI Kit', sales: 38, revenue: '$1,862' },
              { title: 'Business Template Bundle', sales: 28, revenue: '$1,652' },
              { title: 'React Component Kit', sales: 22, revenue: '$1,958' },
            ].map((product, i) => (
              <div key={product.title} className="flex items-center justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] w-4">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{product.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[var(--accent)]">{product.revenue}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
