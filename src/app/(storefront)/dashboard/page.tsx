import Link from 'next/link';
import { ShoppingCart, Download, Settings, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CustomerDashboardPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Account</h1>
        <p className="text-[var(--text-muted)] mb-8">Manage your orders and downloads</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/dashboard/orders">
            <Card hover className="flex items-center gap-4">
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--accent-muted)]">
                <ShoppingCart size={20} className="text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Orders</h3>
                <p className="text-sm text-[var(--text-muted)]">View your order history</p>
              </div>
              <ArrowRight size={16} className="text-[var(--text-muted)]" />
            </Card>
          </Link>

          <Link href="/dashboard/downloads">
            <Card hover className="flex items-center gap-4">
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--info-muted)]">
                <Download size={20} className="text-[var(--info)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Downloads</h3>
                <p className="text-sm text-[var(--text-muted)]">Access your purchased products</p>
              </div>
              <ArrowRight size={16} className="text-[var(--text-muted)]" />
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="text-center py-8 text-[var(--text-muted)]">
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No orders yet</p>
            <Link href="/catalog" className="text-sm text-[var(--accent)] hover:underline mt-1 inline-block">
              Start shopping
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
