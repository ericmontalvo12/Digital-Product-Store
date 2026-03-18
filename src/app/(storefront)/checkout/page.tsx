'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CashAppPayButton } from '@/components/checkout/cash-app-button';
import { PaymentStatus } from '@/components/checkout/payment-status';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import type { PaymentState } from '@/lib/payment/types';

type CheckoutStep = 'info' | 'payment' | 'processing';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    qrCodeUrl?: string;
    status: PaymentState;
  } | null>(null);
  const [error, setError] = useState('');

  if (items.length === 0 && step === 'info') {
    router.push('/cart');
    return null;
  }

  const handlePaymentCreated = (data: { paymentId: string; qrCodeUrl?: string }) => {
    setPaymentData({
      paymentId: data.paymentId,
      qrCodeUrl: data.qrCodeUrl,
      status: 'awaiting_customer_approval',
    });
    setStep('processing');
  };

  const handleStatusChange = (status: PaymentState) => {
    if (status === 'paid') {
      clearCart();
      router.push('/checkout/success');
    }
  };

  return (
    <div className="container-main py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form / Payment */}
        <div className="lg:col-span-2">
          {step === 'info' && (
            <Card>
              <h2 className="font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={error && !email ? 'Email is required' : undefined}
                />
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-[var(--accent)]" />
                  Payment
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Pay securely with Cash App. You&apos;ll approve the payment in the Cash App.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--error-muted)] text-[var(--error)] text-sm">
                    {error}
                  </div>
                )}

                <CashAppPayButton
                  amount={subtotal}
                  onPaymentCreated={handlePaymentCreated}
                  onError={setError}
                  disabled={!email}
                />
              </div>
            </Card>
          )}

          {step === 'processing' && paymentData && (
            <PaymentStatus
              paymentId={paymentData.paymentId}
              initialStatus={paymentData.status}
              qrCodeUrl={paymentData.qrCodeUrl}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-20 self-start">
          <Card>
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                    <Package size={16} className="text-[var(--text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border-default)] pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Lock size={12} />
              <span>Secure checkout</span>
              <Badge variant="success">Cash App Pay</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
