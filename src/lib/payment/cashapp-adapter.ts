import type {
  PaymentAdapter,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse,
  WebhookVerificationResult,
  PaymentState,
} from './types';

/**
 * Cash App Pay Adapter
 *
 * This adapter implements the Cash App Pay Kit + server-side API flow.
 * In production, this would integrate with:
 *   - Cash App Pay Kit JS SDK (client-side)
 *   - Cash App Pay API (server-side)
 *
 * The adapter pattern allows swapping to the Afterpay merchant path
 * if Cash App direct partner approval is not available.
 */
export class CashAppPayAdapter implements PaymentAdapter {
  readonly provider = 'cashapp';

  private readonly apiBaseUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly sandbox: boolean;

  constructor() {
    this.sandbox = process.env.CASHAPP_SANDBOX === 'true';
    this.apiBaseUrl = this.sandbox
      ? 'https://sandbox.api.cash.app/v1'
      : 'https://api.cash.app/v1';
    this.merchantId = process.env.CASHAPP_MERCHANT_ID ?? '';
    this.apiKey = process.env.CASHAPP_API_KEY ?? '';
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    // In production, this calls the Cash App Pay API to create a payment request.
    // The API returns a QR code URL for desktop and a redirect URL for mobile.
    //
    // POST /v1/payments
    // {
    //   merchant_id: this.merchantId,
    //   amount: request.amount,
    //   currency: request.currency,
    //   reference_id: request.orderId,
    //   return_url: request.returnUrl,
    //   cancel_url: request.cancelUrl,
    //   metadata: request.metadata,
    // }

    const externalPaymentId = `cashapp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (this.sandbox) {
      return {
        externalPaymentId,
        status: 'awaiting_customer_approval',
        qrCodeUrl: `https://sandbox.cash.app/qr/${externalPaymentId}`,
        redirectUrl: `https://sandbox.cash.app/pay/${externalPaymentId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        providerData: {
          merchantId: this.merchantId,
          sandbox: true,
        },
      };
    }

    // Production: Make actual API call
    const response = await fetch(`${this.apiBaseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: Math.round(request.amount * 100), // cents
        currency: request.currency,
        reference_id: request.orderId,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Cash App API error: ${response.status} ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return {
      externalPaymentId: data.id,
      status: this.mapStatus(data.status),
      qrCodeUrl: data.qr_code_url,
      redirectUrl: data.redirect_url,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      providerData: data,
    };
  }

  async getPaymentStatus(externalPaymentId: string): Promise<PaymentStatusResponse> {
    if (this.sandbox) {
      return {
        externalPaymentId,
        status: 'awaiting_customer_approval',
        amount: 0,
        currency: 'USD',
        providerData: { sandbox: true },
      };
    }

    const response = await fetch(`${this.apiBaseUrl}/payments/${externalPaymentId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Cash App API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      externalPaymentId: data.id,
      status: this.mapStatus(data.status),
      amount: data.amount / 100,
      currency: data.currency,
      providerData: data,
    };
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    if (this.sandbox) {
      return {
        externalRefundId: `refund_${Date.now()}`,
        status: 'completed',
        amount: request.amount,
      };
    }

    const response = await fetch(`${this.apiBaseUrl}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        payment_id: request.externalPaymentId,
        amount: Math.round(request.amount * 100),
        reason: request.reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cash App refund error: ${response.status}`);
    }

    const data = await response.json();

    return {
      externalRefundId: data.id,
      status: data.status === 'completed' ? 'completed' : 'processing',
      amount: data.amount / 100,
    };
  }

  async verifyWebhook(
    headers: Record<string, string>,
    body: string
  ): Promise<WebhookVerificationResult> {
    // In production, verify the webhook signature using HMAC-SHA256
    // with the webhook secret from Cash App.
    //
    // const signature = headers['x-cashapp-signature'];
    // const secret = process.env.CASHAPP_WEBHOOK_SECRET;
    // const computed = crypto.createHmac('sha256', secret).update(body).digest('hex');
    // const verified = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));

    const payload = JSON.parse(body);
    const signature = headers['x-cashapp-signature'] ?? '';

    if (this.sandbox) {
      return {
        verified: true,
        eventType: payload.event_type ?? 'payment.updated',
        payload,
      };
    }

    // Production verification
    const crypto = await import('crypto');
    const secret = process.env.CASHAPP_WEBHOOK_SECRET ?? '';
    const computed = crypto.createHmac('sha256', secret).update(body).digest('hex');

    let verified = false;
    try {
      verified = crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(computed, 'hex')
      );
    } catch {
      verified = false;
    }

    return {
      verified,
      eventType: payload.event_type ?? 'unknown',
      payload,
    };
  }

  private mapStatus(providerStatus: string): PaymentState {
    const statusMap: Record<string, PaymentState> = {
      created: 'initiated',
      pending: 'awaiting_customer_approval',
      approved: 'approved',
      processing: 'payment_processing',
      completed: 'paid',
      failed: 'failed',
      refunded: 'refunded',
    };
    return statusMap[providerStatus] ?? 'initiated';
  }
}
