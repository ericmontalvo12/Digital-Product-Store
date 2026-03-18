'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Send, RotateCcw, Package, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const orderTimeline = [
  { time: 'Mar 15, 2026 10:32 AM', event: 'Order created', icon: Package },
  { time: 'Mar 15, 2026 10:32 AM', event: 'Payment initiated via Cash App Pay', icon: CreditCard },
  { time: 'Mar 15, 2026 10:33 AM', event: 'Payment approved by customer', icon: CheckCircle },
  { time: 'Mar 15, 2026 10:33 AM', event: 'Payment confirmed (paid)', icon: CheckCircle },
  { time: 'Mar 15, 2026 10:33 AM', event: 'Order fulfilled — download link sent', icon: Send },
];

export default function AdminOrderDetailPage() {
  const params = useParams();

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ChevronLeft size={14} />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{params.id}</h1>
          <Badge variant="success">Paid</Badge>
          <Badge variant="success">Fulfilled</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Send size={14} />
            Resend Delivery
          </Button>
          <Button variant="danger" size="sm">
            <RotateCcw size={14} />
            Refund
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] flex items-center justify-center">
                    <Package size={16} className="text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium UI Kit</p>
                    <p className="text-xs text-[var(--text-muted)]">Download • Qty: 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">$49.00</p>
                  <Badge variant="success">Fulfilled</Badge>
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border-default)] pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>$49.00</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[var(--text-muted)]">Discount</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-[var(--border-default)]">
                <span>Total</span>
                <span>$49.00</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
            </CardHeader>
            <div className="space-y-0">
              {orderTimeline.map((event, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                      <event.icon size={14} className="text-[var(--accent)]" />
                    </div>
                    {i < orderTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--border-default)] mt-1" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm">{event.event}</p>
                    <p className="text-xs text-[var(--text-muted)]">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <Textarea placeholder="Add a note about this order..." />
            <div className="mt-3 flex justify-end">
              <Button variant="secondary" size="sm">Save Note</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-3">Customer</h3>
            <p className="text-sm">john@example.com</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">1 order</p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Provider</span>
                <span>Cash App Pay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Status</span>
                <Badge variant="success">Paid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Payment ID</span>
                <span className="text-xs font-mono">cashapp_abc123</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">Fulfillment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Status</span>
                <Badge variant="success">Fulfilled</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Delivery</span>
                <span>Download</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
