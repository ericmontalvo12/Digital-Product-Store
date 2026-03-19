'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { PaymentState } from '@/lib/payment/types';

const TERMINAL_STATES: PaymentState[] = ['paid', 'failed', 'refunded'];
const POLL_INTERVAL = 3000;
const MAX_POLLS = 200; // ~10 minutes

interface UsePaymentPollingOpts {
  paymentId: string | null;
  initialStatus?: PaymentState;
  onStatusChange?: (status: PaymentState) => void;
  enabled?: boolean;
}

export function usePaymentPolling({
  paymentId,
  initialStatus = 'initiated',
  onStatusChange,
  enabled = true,
}: UsePaymentPollingOpts) {
  const [status, setStatus] = useState<PaymentState>(initialStatus);
  const [polling, setPolling] = useState(false);
  const pollCount = useRef(0);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    if (!paymentId || !enabled || TERMINAL_STATES.includes(status)) {
      setPolling(false);
      return;
    }

    setPolling(true);
    pollCount.current = 0;

    const interval = setInterval(async () => {
      if (pollCount.current >= MAX_POLLS) {
        setPolling(false);
        clearInterval(interval);
        return;
      }

      pollCount.current++;

      try {
        const res = await fetch(`/api/payments/status?paymentId=${paymentId}`);
        if (!res.ok) return;

        const data = await res.json();
        const newStatus = data.status as PaymentState;

        if (newStatus !== status) {
          setStatus(newStatus);
          onStatusChangeRef.current?.(newStatus);
        }

        if (TERMINAL_STATES.includes(newStatus)) {
          setPolling(false);
          clearInterval(interval);
        }
      } catch {
        // Silently retry on next interval
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [paymentId, enabled, status]);

  return { status, polling };
}
