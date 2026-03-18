'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PaymentState } from '@/lib/payment/types';

interface PaymentStatusProps {
  paymentId: string;
  initialStatus: PaymentState;
  qrCodeUrl?: string;
  onStatusChange?: (status: PaymentState) => void;
}

const statusConfig: Record<PaymentState, { icon: React.ReactNode; label: string; description: string; variant: 'info' | 'warning' | 'success' | 'error' | 'default' }> = {
  initiated: {
    icon: <Clock size={24} />,
    label: 'Payment Initiated',
    description: 'Setting up your payment...',
    variant: 'info',
  },
  awaiting_customer_approval: {
    icon: <QrCode size={24} />,
    label: 'Awaiting Approval',
    description: 'Complete the payment in your Cash App',
    variant: 'warning',
  },
  approved: {
    icon: <CheckCircle size={24} />,
    label: 'Payment Approved',
    description: 'Processing your payment...',
    variant: 'success',
  },
  payment_processing: {
    icon: <Loader2 size={24} className="animate-spin" />,
    label: 'Processing',
    description: 'Your payment is being processed...',
    variant: 'info',
  },
  paid: {
    icon: <CheckCircle size={24} />,
    label: 'Payment Complete',
    description: 'Your payment was successful!',
    variant: 'success',
  },
  failed: {
    icon: <XCircle size={24} />,
    label: 'Payment Failed',
    description: 'Something went wrong with your payment.',
    variant: 'error',
  },
  refunded: {
    icon: <CheckCircle size={24} />,
    label: 'Refunded',
    description: 'Your payment has been refunded.',
    variant: 'default',
  },
};

export function PaymentStatus({ paymentId, initialStatus, qrCodeUrl, onStatusChange }: PaymentStatusProps) {
  const [status, setStatus] = useState<PaymentState>(initialStatus);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling || status === 'paid' || status === 'failed' || status === 'refunded') {
      setPolling(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?paymentId=${paymentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status !== status) {
            setStatus(data.status);
            onStatusChange?.(data.status);
          }
          if (data.status === 'paid' || data.status === 'failed') {
            setPolling(false);
          }
        }
      } catch {
        // Silently retry
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentId, status, polling, onStatusChange]);

  const config = statusConfig[status];

  return (
    <Card className="text-center">
      <div className="flex flex-col items-center gap-4">
        <div className={`p-3 rounded-full ${
          config.variant === 'success' ? 'bg-[var(--success-muted)] text-[var(--success)]' :
          config.variant === 'error' ? 'bg-[var(--error-muted)] text-[var(--error)]' :
          config.variant === 'warning' ? 'bg-[var(--warning-muted)] text-[var(--warning)]' :
          'bg-[var(--info-muted)] text-[var(--info)]'
        }`}>
          {config.icon}
        </div>

        <div>
          <Badge variant={config.variant} className="mb-2">{config.label}</Badge>
          <p className="text-sm text-[var(--text-secondary)]">{config.description}</p>
        </div>

        {/* QR Code for desktop flow */}
        {status === 'awaiting_customer_approval' && qrCodeUrl && (
          <div className="mt-4 p-6 bg-white rounded-[var(--radius-lg)] inline-block">
            <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              <QrCode size={80} />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">Scan with Cash App</p>
          </div>
        )}

        {/* Polling indicator */}
        {polling && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Loader2 size={12} className="animate-spin" />
            Checking payment status...
          </div>
        )}

        {status === 'failed' && (
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
