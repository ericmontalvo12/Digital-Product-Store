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
 * Afterpay/Cash App Merchant Adapter
 *
 * Alternative adapter for the Afterpay merchant path that supports
 * Cash App Pay as a payment method. Use this if direct Cash App Pay Kit
 * partner approval is not available.
 *
 * This adapter integrates with the Afterpay API which provides
 * Cash App Pay as an option within the Afterpay checkout flow.
 */
export class AfterpayAdapter implements PaymentAdapter {
  readonly provider = 'afterpay';

  private readonly apiBaseUrl: string;
  private readonly merchantId: string;
  private readonly secretKey: string;
  private readonly sandbox: boolean;

  constructor() {
    this.sandbox = process.env.AFTERPAY_SANDBOX === 'true';
    this.apiBaseUrl = this.sandbox
      ? 'https://global-api-sandbox.afterpay.com/v2'
      : 'https://global-api.afterpay.com/v2';
    this.merchantId = process.env.AFTERPAY_MERCHANT_ID ?? '';
    this.secretKey = process.env.AFTERPAY_SECRET_KEY ?? '';
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(`${this.merchantId}:${this.secretKey}`).toString('base64')}`;
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    if (this.sandbox) {
      const externalPaymentId = `afterpay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return {
        externalPaymentId,
        status: 'awaiting_customer_approval',
        redirectUrl: `https://portal.sandbox.afterpay.com/checkout/${externalPaymentId}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        providerData: { sandbox: true },
      };
    }

    const response = await fetch(`${this.apiBaseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader,
      },
      body: JSON.stringify({
        amount: {
          amount: request.amount.toFixed(2),
          currency: request.currency,
        },
        consumer: { email: request.customerEmail },
        merchant: { redirectConfirmUrl: request.returnUrl, redirectCancelUrl: request.cancelUrl },
        merchantReference: request.orderId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Afterpay API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      externalPaymentId: data.token,
      status: 'awaiting_customer_approval',
      redirectUrl: data.redirectCheckoutUrl,
      expiresAt: data.expires ? new Date(data.expires) : undefined,
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
      };
    }

    const response = await fetch(`${this.apiBaseUrl}/payments/${externalPaymentId}`, {
      headers: { Authorization: this.authHeader },
    });

    if (!response.ok) {
      throw new Error(`Afterpay API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      externalPaymentId: data.id,
      status: this.mapStatus(data.status),
      amount: parseFloat(data.amount.amount),
      currency: data.amount.currency,
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

    const response = await fetch(`${this.apiBaseUrl}/payments/${request.externalPaymentId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader,
      },
      body: JSON.stringify({
        amount: { amount: request.amount.toFixed(2), currency: 'USD' },
        merchantReference: request.reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Afterpay refund error: ${response.status}`);
    }

    const data = await response.json();

    return {
      externalRefundId: data.refundId,
      status: 'completed',
      amount: parseFloat(data.amount.amount),
    };
  }

  async verifyWebhook(
    headers: Record<string, string>,
    body: string
  ): Promise<WebhookVerificationResult> {
    const payload = JSON.parse(body);

    if (this.sandbox) {
      return { verified: true, eventType: payload.eventType ?? 'PAYMENT_UPDATED', payload };
    }

    const crypto = await import('crypto');
    const secret = process.env.AFTERPAY_WEBHOOK_SECRET ?? '';
    const signature = headers['x-afterpay-hmac-sha256'] ?? '';
    const computed = crypto.createHmac('sha256', secret).update(body).digest('base64');

    return {
      verified: signature === computed,
      eventType: payload.eventType ?? 'unknown',
      payload,
    };
  }

  private mapStatus(status: string): PaymentState {
    const map: Record<string, PaymentState> = {
      CREATED: 'initiated',
      PENDING: 'awaiting_customer_approval',
      APPROVED: 'approved',
      CAPTURED: 'paid',
      DECLINED: 'failed',
      VOIDED: 'refunded',
    };
    return map[status] ?? 'initiated';
  }
}
