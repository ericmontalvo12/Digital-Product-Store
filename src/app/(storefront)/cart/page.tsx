'use client';

import Link from 'next/link';
import { Trash2, Package, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="container-main py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse our catalog to find premium digital products."
          action={
            <Link href="/catalog">
              <Button>Browse Catalog</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                <Package size={24} className="text-[var(--text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-medium text-sm hover:text-[var(--accent)] transition-colors"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">
                  {item.deliveryType.toLowerCase().replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--text-primary)] outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="font-semibold text-sm w-16 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-muted)] transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-20 self-start">
          <Card>
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Discount</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="border-t border-[var(--border-default)] pt-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
              />
              <Button variant="secondary" size="sm">Apply</Button>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Checkout with Cash App
                <ArrowRight size={16} />
              </Button>
            </Link>

            <p className="text-[10px] text-[var(--text-muted)] text-center mt-3">
              Secure checkout powered by Cash App Pay
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
