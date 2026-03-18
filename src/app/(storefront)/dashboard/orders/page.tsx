import Link from 'next/link';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function CustomerOrdersPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
          <ChevronLeft size={14} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>

        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="Your order history will appear here after your first purchase."
          action={
            <Link href="/catalog">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
