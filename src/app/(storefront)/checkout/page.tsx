'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Lock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentMethodSelector, type PaymentMethodType } from '@/components/checkout/payment-method-selector';
import { PaymentStatus } from '@/components/checkout/payment-status';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import type { PaymentState } from '@/lib/payment/types';

type CheckoutStep = 'info' | 'processing';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cashapp');
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    orderId: string;
    orderNumber: string;
    qrCodeUrl?: string;
    redirectUrl?: string;
    status: PaymentState;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && step === 'info') {
    router.push('/cart');
    return null;
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponCode('');
  };

  const handleStatusChange = (status: PaymentState) => {
    if (status === 'paid') {
      clearCart();
      const orderNum = paymentData?.orderNumber ?? '';
      router.push(`/checkout/success?order=${orderNum}`);
    }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmitPayment = async () => {
    if (!emailValid || loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          email,
          name: name || undefined,
          couponCode: appliedCoupon || undefined,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Payment failed' }));
        throw new Error(err.error || 'Payment failed');
      }

      const data = await response.json();

      // Balance payment is instant
      if (data.paymentMethod === 'balance' || data.status === 'paid') {
        clearCart();
        router.push(`/checkout/success?order=${data.orderNumber}`);
        return;
      }

      // Coinbase Commerce: redirect to hosted checkout page
      if (paymentMethod === 'coinbase' && data.redirectUrl) {
        setPaymentData({
          paymentId: data.paymentId,
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          redirectUrl: data.redirectUrl,
          status: 'awaiting_customer_approval',
        });
        setStep('processing');
        // Open Coinbase checkout in new tab, keep polling on this page
        window.open(data.redirectUrl, '_blank');
        return;
      }

      // Cash App flow
      setPaymentData({
        paymentId: data.paymentId,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        qrCodeUrl: data.qrCodeUrl,
        redirectUrl: data.redirectUrl,
        status: 'awaiting_customer_approval',
      });
      setStep('processing');

      // Mobile Cash App redirect
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getPayButtonConfig = () => {
    switch (paymentMethod) {
      case 'coinbase':
        return { label: 'Pay with Coinbase Commerce', bg: '#0052FF', hover: '#0047E0' };
      case 'balance':
        return { label: 'Pay with Balance', bg: '#8B5CF6', hover: '#7C3AED' };
      case 'cashapp':
      default:
        return { label: 'Pay with Cash App', bg: '#00D632', hover: '#00C22E' };
    }
  };

  const btnConfig = getPayButtonConfig();

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
                  error={email && !emailValid ? 'Enter a valid email' : undefined}
                />
                <Input
                  label="Full Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              {/* Coupon */}
              <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-[var(--accent)]" />
                  Coupon Code
                </h2>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{appliedCoupon}</Badge>
                    <button onClick={handleRemoveCoupon} className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors cursor-pointer">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                    />
                    <Button variant="secondary" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-[var(--accent)]" />
                  Payment Method
                </h2>

                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  orderTotal={subtotal}
                  showBalance={false}
                />

                {error && (
                  <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--error-muted)] text-[var(--error)] text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitPayment}
                  disabled={!emailValid || loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-[var(--radius-md)] font-semibold text-base transition-all duration-200 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  style={{ backgroundColor: btnConfig.bg }}
                  onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.backgroundColor = btnConfig.hover; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = btnConfig.bg; }}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <span>{btnConfig.label}</span>
                  )}
                </button>
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
            <div className="border-t border-[var(--border-default)] pt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Coupon ({appliedCoupon})</span>
                  <span className="text-[var(--accent)]">Applied at checkout</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Lock size={12} />
              <span>Secure checkout</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
