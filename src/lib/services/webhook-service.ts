import 'server-only';
import { db } from '@/lib/db';
import { getPaymentAdapter } from '@/lib/payment';
import type { AdapterType } from '@/lib/payment';
import { paymentService } from './payment-service';
import { fulfillmentService } from './fulfillment-service';
import type { PaymentState } from '@/lib/payment/types';

export class WebhookService {
  /** Process an incoming webhook from a specific payment provider. */
  async processWebhook(headers: Record<string, string>, body: string, provider?: AdapterType) {
    const adapter = getPaymentAdapter(provider);

    // 1. Verify the webhook signature
    const verification = await adapter.verifyWebhook(headers, body);

    // 2. Store the raw event
    const event = await db.webhookEvent.create({
      data: {
        provider: adapter.provider,
        eventType: verification.eventType,
        payload: verification.payload as object,
        verified: verification.verified,
      },
    });

    if (!verification.verified) {
      console.error(`Webhook verification failed for event ${event.id}`);
      return { success: false, eventId: event.id, error: 'Verification failed' };
    }

    // 3. Process the event
    try {
      await this.handleEvent(verification.eventType, verification.payload, adapter.provider);

      await db.webhookEvent.update({
        where: { id: event.id },
        data: { processedAt: new Date() },
      });

      return { success: true, eventId: event.id };
    } catch (error) {
      console.error(`Webhook processing failed for event ${event.id}:`, error);
      return {
        success: false,
        eventId: event.id,
        error: error instanceof Error ? error.message : 'Processing failed',
      };
    }
  }

  private async handleEvent(eventType: string, payload: Record<string, unknown>, provider: string) {
    // Coinbase Commerce event types
    if (provider === 'coinbase') {
      switch (eventType) {
        case 'charge:confirmed':
        case 'charge:completed':
        case 'charge:failed':
        case 'charge:pending':
        case 'charge:resolved':
          await this.handleCoinbaseCharge(eventType, payload);
          return;
      }
    }

    // Cash App / Afterpay event types
    switch (eventType) {
      case 'payment.approved':
      case 'payment.completed':
      case 'payment.failed':
      case 'payment.updated':
      case 'PAYMENT_UPDATED':
        await this.handlePaymentUpdate(payload);
        break;

      case 'refund.completed':
      case 'REFUND_COMPLETED':
        await this.handleRefundComplete(payload);
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
  }

  private async handleCoinbaseCharge(eventType: string, payload: Record<string, unknown>) {
    const event = payload.event as Record<string, unknown> | undefined;
    const data = (event?.data ?? payload) as Record<string, unknown>;
    const chargeCode = (data.code ?? data.id ?? '') as string;

    if (!chargeCode) return;

    const payment = await db.payment.findFirst({
      where: { externalPaymentId: chargeCode },
    });

    if (!payment) {
      console.error(`Payment not found for Coinbase charge: ${chargeCode}`);
      return;
    }

    const statusMap: Record<string, PaymentState> = {
      'charge:pending': 'payment_processing',
      'charge:confirmed': 'paid',
      'charge:completed': 'paid',
      'charge:resolved': 'paid',
      'charge:failed': 'failed',
    };

    const newStatus = statusMap[eventType];
    if (newStatus) {
      await paymentService.updatePaymentStatus(payment.id, newStatus, 'webhook', payload);

      if (newStatus === 'paid') {
        try {
          await fulfillmentService.fulfillOrder(payment.orderId);
        } catch (error) {
          console.error(`Auto-fulfillment failed for order ${payment.orderId}:`, error);
        }
      }
    }
  }

  private async handlePaymentUpdate(payload: Record<string, unknown>) {
    const externalPaymentId = (payload.payment_id ?? payload.id ?? '') as string;
    if (!externalPaymentId) return;

    const payment = await db.payment.findFirst({
      where: { externalPaymentId },
    });

    if (!payment) {
      console.error(`Payment not found for external ID: ${externalPaymentId}`);
      return;
    }

    const statusStr = (payload.status ?? '') as string;
    const newStatus = this.mapWebhookStatus(statusStr);

    if (newStatus) {
      await paymentService.updatePaymentStatus(payment.id, newStatus, 'webhook', payload as Record<string, unknown>);

      // Trigger fulfillment on successful payment
      if (newStatus === 'paid') {
        try {
          await fulfillmentService.fulfillOrder(payment.orderId);
        } catch (error) {
          console.error(`Auto-fulfillment failed for order ${payment.orderId}:`, error);
        }
      }
    }
  }

  private async handleRefundComplete(payload: Record<string, unknown>) {
    const externalRefundId = (payload.refund_id ?? payload.id ?? '') as string;
    if (!externalRefundId) return;

    await db.refund.updateMany({
      where: { externalRefundId },
      data: { status: 'COMPLETED' },
    });
  }

  private mapWebhookStatus(status: string): PaymentState | null {
    const map: Record<string, PaymentState> = {
      approved: 'approved',
      completed: 'paid',
      captured: 'paid',
      failed: 'failed',
      declined: 'failed',
      processing: 'payment_processing',
      APPROVED: 'approved',
      CAPTURED: 'paid',
      DECLINED: 'failed',
    };
    return map[status] ?? null;
  }
}

export const webhookService = new WebhookService();
