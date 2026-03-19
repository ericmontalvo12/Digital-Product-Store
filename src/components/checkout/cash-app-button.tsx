'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CartItemPayload {
  productId: string;
  quantity: number;
}

interface CashAppPayButtonProps {
  items: CartItemPayload[];
  email: string;
  name?: string;
  couponCode?: string;
  onPaymentCreated?: (data: { paymentId: string; orderId: string; orderNumber: string; qrCodeUrl?: string; redirectUrl?: string }) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Custom Cash App Pay button.
 * In production, this integrates with the Cash App Pay Kit JS SDK.
 * Supports both QR (desktop) and redirect (mobile) flows.
 */
export function CashAppPayButton({
  items,
  email,
  name,
  couponCode,
  onPaymentCreated,
  onError,
  disabled,
  className,
}: CashAppPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          email,
          name,
          couponCode: couponCode || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Payment creation failed' }));
        throw new Error(err.error || 'Payment creation failed');
      }

      const data = await response.json();
      onPaymentCreated?.(data);

      // Mobile: redirect to Cash App
      if (isMobile && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-[var(--radius-md)] font-semibold text-base transition-all duration-200 cursor-pointer',
        'bg-[#00D632] text-black hover:bg-[#00C22E]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {/* Cash App Logo */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.59 3.47A5.1 5.1 0 0 0 20.53.41C19.49.05 18.14 0 15.41 0H8.59C5.86 0 4.51.05 3.47.41A5.1 5.1 0 0 0 .41 3.47C.05 4.51 0 5.86 0 8.59v6.82c0 2.73.05 4.08.41 5.12a5.1 5.1 0 0 0 3.06 3.06c1.04.36 2.39.41 5.12.41h6.82c2.73 0 4.08-.05 5.12-.41a5.1 5.1 0 0 0 3.06-3.06c.36-1.04.41-2.39.41-5.12V8.59c0-2.73-.05-4.08-.41-5.12zM17.42 7.30l-.93.93a.5.5 0 0 1-.62.07 5.4 5.4 0 0 0-2.84-.8c-1.2 0-2.1.42-2.1 1.32 0 .87.81 1.2 2.28 1.56 2.28.56 4.06 1.2 4.06 3.54 0 2.46-2.1 3.75-4.68 3.87v1.14a.5.5 0 0 1-.5.5h-1.2a.5.5 0 0 1-.5-.5v-1.2a7 7 0 0 1-3.72-1.32.5.5 0 0 1-.06-.73l.93-.93a.5.5 0 0 1 .65-.06 5.8 5.8 0 0 0 3.24 1.02c1.44 0 2.34-.54 2.34-1.5 0-.93-.78-1.26-2.46-1.68-2.22-.54-3.9-1.26-3.9-3.42 0-2.22 1.86-3.57 4.32-3.69V4.57a.5.5 0 0 1 .5-.5h1.2a.5.5 0 0 1 .5.5v1.14a6.2 6.2 0 0 1 3.12.96.5.5 0 0 1 .07.73z" />
          </svg>
          <span>Pay with Cash App</span>
        </>
      )}
    </button>
  );
}
