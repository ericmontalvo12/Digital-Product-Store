import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Package, CreditCard, Clock, CheckCircle, Send, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOrderById } from '@/lib/queries/orders';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderActions } from './order-actions';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

function statusBadge(status: string) {
  switch (status) {
    case 'PAID': return 'success' as const;
    case 'PENDING': return 'warning' as const;
    case 'FAILED': return 'error' as const;
    case 'REFUNDED': return 'default' as const;
    default: return 'default' as const;
  }
}


export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const payment = order.payments[0];
  const allEvents = payment?.events ?? [];

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ChevronLeft size={14} />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h1>
          <Badge variant={statusBadge(order.status)}>{order.status}</Badge>
          <Badge variant={order.fulfillmentStatus === 'FULFILLED' ? 'success' : 'warning'}>{order.fulfillmentStatus}</Badge>
        </div>
        <OrderActions orderId={order.id} status={order.status} fulfillmentStatus={order.fulfillmentStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--border-default)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] flex items-center justify-center">
                      <Package size={16} className="text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.productTitle}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.deliveryType} &middot; Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(Number(item.total))}</p>
                    <Badge variant={item.fulfilled ? 'success' : 'warning'}>
                      {item.fulfilled ? 'Fulfilled' : 'Unfulfilled'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border-default)] pt-3 mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Discount</span>
                  <span className="text-[var(--accent)]">-{formatCurrency(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-[var(--border-default)]">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle>Event Timeline</CardTitle></CardHeader>
            {allEvents.length > 0 ? (
              <div className="space-y-0">
                {allEvents.map((event, i) => (
                  <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                        <CreditCard size={14} className="text-[var(--accent)]" />
                      </div>
                      {i < allEvents.length - 1 && <div className="w-px flex-1 bg-[var(--border-default)] mt-1" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm">{event.status} ({event.source})</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatDateTime(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No events recorded</p>
            )}
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
            {order.notes && (
              <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap mb-4 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]">
                {order.notes}
              </pre>
            )}
            <OrderActions orderId={order.id} showNoteForm />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-3">Customer</h3>
            <p className="text-sm">{order.customerEmail}</p>
            {order.customerName && <p className="text-sm text-[var(--text-muted)]">{order.customerName}</p>}
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Provider</span>
                <span>{payment?.provider ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Status</span>
                <Badge variant={statusBadge(payment?.status ?? 'PENDING')}>{payment?.status ?? 'N/A'}</Badge>
              </div>
              {payment?.externalPaymentId && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">External ID</span>
                  <span className="text-xs font-mono truncate max-w-[120px]">{payment.externalPaymentId}</span>
                </div>
              )}
            </div>
          </Card>

          {order.coupon && (
            <Card>
              <h3 className="font-semibold mb-3">Coupon</h3>
              <p className="text-sm font-mono">{order.coupon.code}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {order.coupon.discountType === 'PERCENTAGE'
                  ? `${Number(order.coupon.discountValue)}% off`
                  : `${formatCurrency(Number(order.coupon.discountValue))} off`}
              </p>
            </Card>
          )}

          {order.refunds.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-3">Refunds</h3>
              <div className="space-y-2">
                {order.refunds.map(refund => (
                  <div key={refund.id} className="flex justify-between text-sm">
                    <span>{formatCurrency(Number(refund.amount))}</span>
                    <Badge variant={refund.status === 'COMPLETED' ? 'success' : 'warning'}>{refund.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
