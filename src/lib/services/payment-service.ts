import 'server-only';
import { db } from '@/lib/db';
import { getPaymentAdapter } from '@/lib/payment';
import type { AdapterType } from '@/lib/payment';
import type { PaymentState, CreatePaymentRequest } from '@/lib/payment/types';
import { canTransition } from '@/lib/payment/types';

export class PaymentService {
  private getAdapter(provider?: AdapterType) {
    return getPaymentAdapter(provider);
  }

  async createPayment(params: {
    orderId: string;
    amount: number;
    customerEmail: string;
    returnUrl: string;
    cancelUrl: string;
    provider?: AdapterType;
  }) {
    const adapter = this.getAdapter(params.provider);

    const request: CreatePaymentRequest = {
      orderId: params.orderId,
      amount: params.amount,
      currency: 'USD',
      customerEmail: params.customerEmail,
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
    };

    const result = await adapter.createPayment(request);

    const payment = await db.payment.create({
      data: {
        orderId: params.orderId,
        externalPaymentId: result.externalPaymentId,
        provider: adapter.provider,
        status: this.toDbStatus(result.status),
        amount: params.amount,
        currency: 'USD',
        qrCodeUrl: result.qrCodeUrl,
        redirectUrl: result.redirectUrl,
        expiresAt: result.expiresAt,
        providerData: result.providerData as object ?? undefined,
      },
    });

    await this.recordEvent(payment.id, result.status, 'system', { action: 'created' });

    return {
      paymentId: payment.id,
      externalPaymentId: result.externalPaymentId,
      status: result.status,
      qrCodeUrl: result.qrCodeUrl,
      redirectUrl: result.redirectUrl,
      expiresAt: result.expiresAt,
    };
  }

  async updatePaymentStatus(paymentId: string, newStatus: PaymentState, source: string, data?: Record<string, unknown>) {
    const payment = await db.payment.findUniqueOrThrow({ where: { id: paymentId } });
    const currentStatus = this.fromDbStatus(payment.status);

    if (!canTransition(currentStatus, newStatus)) {
      throw new Error(`Invalid payment transition: ${currentStatus} -> ${newStatus}`);
    }

    const updated = await db.payment.update({
      where: { id: paymentId },
      data: {
        status: this.toDbStatus(newStatus),
        providerData: data as object ?? undefined,
      },
    });

    await this.recordEvent(paymentId, newStatus, source, data);

    // If paid, trigger order status update
    if (newStatus === 'paid') {
      await db.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      });
    }

    if (newStatus === 'failed') {
      await db.order.update({
        where: { id: payment.orderId },
        data: { status: 'FAILED' },
      });
    }

    return updated;
  }

  async getPaymentByOrderId(orderId: string) {
    return db.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
      include: { events: { orderBy: { createdAt: 'desc' } } },
    });
  }

  async pollExternalStatus(paymentId: string) {
    const payment = await db.payment.findUniqueOrThrow({ where: { id: paymentId } });
    if (!payment.externalPaymentId) throw new Error('No external payment ID');

    // Use the provider that created this payment
    const adapter = this.getAdapter(payment.provider as AdapterType);
    const status = await adapter.getPaymentStatus(payment.externalPaymentId);
    const newStatus = status.status;
    const currentStatus = this.fromDbStatus(payment.status);

    if (newStatus !== currentStatus && canTransition(currentStatus, newStatus)) {
      await this.updatePaymentStatus(paymentId, newStatus, 'poll', status.providerData);
    }

    return { status: newStatus, providerData: status.providerData };
  }

  async refund(paymentId: string, amount: number, reason?: string) {
    const payment = await db.payment.findUniqueOrThrow({ where: { id: paymentId } });
    if (!payment.externalPaymentId) throw new Error('No external payment ID');

    const adapter = this.getAdapter(payment.provider as AdapterType);
    const result = await adapter.refundPayment({
      externalPaymentId: payment.externalPaymentId,
      amount,
      reason,
    });

    const refund = await db.refund.create({
      data: {
        orderId: payment.orderId,
        amount,
        reason,
        status: result.status === 'completed' ? 'COMPLETED' : 'PROCESSING',
        externalRefundId: result.externalRefundId,
      },
    });

    if (result.status === 'completed') {
      await this.updatePaymentStatus(paymentId, 'refunded', 'system', { refundId: refund.id });
    }

    return refund;
  }

  private async recordEvent(paymentId: string, status: PaymentState, source: string, data?: Record<string, unknown>) {
    await db.paymentEvent.create({
      data: {
        paymentId,
        status,
        source,
        data: data as object ?? undefined,
      },
    });
  }

  private toDbStatus(status: PaymentState): 'INITIATED' | 'AWAITING_CUSTOMER_APPROVAL' | 'APPROVED' | 'PAYMENT_PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' {
    return status.toUpperCase() as ReturnType<typeof this.toDbStatus>;
  }

  private fromDbStatus(status: string): PaymentState {
    return status.toLowerCase() as PaymentState;
  }
}

export const paymentService = new PaymentService();
