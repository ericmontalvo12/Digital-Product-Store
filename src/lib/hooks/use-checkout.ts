'use client';

import { useState, useCallback } from 'react';
import type { PaymentState } from '@/lib/payment/types';

interface CheckoutState {
  step: 'info' | 'payment' | 'processing' | 'success' | 'error';
  paymentId: string | null;
  qrCodeUrl: string | null;
  redirectUrl: string | null;
  status: PaymentState | null;
  error: string | null;
  loading: boolean;
}

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    step: 'info',
    paymentId: null,
    qrCodeUrl: null,
    redirectUrl: null,
    status: null,
    error: null,
    loading: false,
  });

  const initiatePayment = useCallback(async (params: {
    email: string;
    name?: string;
    items: Array<{ productId: string; quantity: number }>;
    couponCode?: string;
  }) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Payment failed' }));
        throw new Error(data.error || 'Payment failed');
      }

      const data = await res.json();

      setState(s => ({
        ...s,
        step: 'processing',
        paymentId: data.paymentId,
        qrCodeUrl: data.qrCodeUrl ?? null,
        redirectUrl: data.redirectUrl ?? null,
        status: data.status,
        loading: false,
      }));

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setState(s => ({ ...s, error: message, loading: false }));
      return null;
    }
  }, []);

  const updateStatus = useCallback((status: PaymentState) => {
    setState(s => ({
      ...s,
      status,
      step: status === 'paid' ? 'success' : status === 'failed' ? 'error' : s.step,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      step: 'info',
      paymentId: null,
      qrCodeUrl: null,
      redirectUrl: null,
      status: null,
      error: null,
      loading: false,
    });
  }, []);

  return { ...state, initiatePayment, updateStatus, reset };
}
