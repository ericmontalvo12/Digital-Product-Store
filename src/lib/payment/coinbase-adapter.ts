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
 * Coinbase Commerce Adapter
 *
 * Integrates with the Coinbase Commerce API for crypto + Cash App payments.
 * Coinbase Commerce supports multiple payment methods including:
 *   - Bitcoin, Ethereum, USDC, and other cryptocurrencies
 *   - Cash App Pay (via Coinbase Commerce checkout)
 *
 * API Docs: https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome
 */
export class CoinbaseCommerceAdapter implements PaymentAdapter {
  readonly provider = 'coinbase';

  private readonly apiBaseUrl = 'https://api.commerce.coinbase.com';
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly sandbox: boolean;

  constructor() {
    this.sandbox = process.env.COINBASE_SANDBOX === 'true';
    this.apiKey = process.env.COINBASE_COMMERCE_API_KEY ?? '';
    this.webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET ?? '';
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const externalPaymentId = `cb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (this.sandbox) {
      return {
        externalPaymentId,
        status: 'awaiting_customer_approval',
        redirectUrl: `https://commerce.coinbase.com/checkout/sandbox/${externalPaymentId}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        providerData: {
          sandbox: true,
          hosted_url: `https://commerce.coinbase.com/checkout/sandbox/${externalPaymentId}`,
        },
      };
    }

    // Production: Create a Coinbase Commerce charge
    const response = await fetch(`${this.apiBaseUrl}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': this.apiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify({
        name: `Order ${request.orderId}`,
        description: `Payment for order ${request.orderId}`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: request.amount.toFixed(2),
          currency: request.currency,
        },
        metadata: {
          order_id: request.orderId,
          customer_email: request.customerEmail,
          ...request.metadata,
        },
        redirect_url: request.returnUrl,
        cancel_url: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Coinbase Commerce API error: ${response.status} ${JSON.stringify(error)}`);
    }

    const { data } = await response.json();

    return {
      externalPaymentId: data.code ?? data.id,
      status: this.mapStatus(data.timeline?.[data.timeline.length - 1]?.status ?? 'NEW'),
      redirectUrl: data.hosted_url,
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

    const response = await fetch(`${this.apiBaseUrl}/charges/${externalPaymentId}`, {
      headers: {
        'X-CC-Api-Key': this.apiKey,
        'X-CC-Version': '2018-03-22',
      },
    });

    if (!response.ok) {
      throw new Error(`Coinbase Commerce API error: ${response.status}`);
    }

    const { data } = await response.json();
    const lastTimeline = data.timeline?.[data.timeline.length - 1];

    return {
      externalPaymentId: data.code ?? data.id,
      status: this.mapStatus(lastTimeline?.status ?? 'NEW'),
      amount: parseFloat(data.pricing?.local?.amount ?? '0'),
      currency: data.pricing?.local?.currency ?? 'USD',
      providerData: data,
    };
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    // Coinbase Commerce does not support automatic refunds for crypto payments.
    // Refunds must be handled manually by the merchant.
    // For sandbox, simulate a completed refund.
    if (this.sandbox) {
      return {
        externalRefundId: `cb_refund_${Date.now()}`,
        status: 'completed',
        amount: request.amount,
      };
    }

    // In production, log the refund request for manual processing
    return {
      externalRefundId: `cb_refund_${Date.now()}`,
      status: 'pending',
      amount: request.amount,
    };
  }

  async verifyWebhook(
    headers: Record<string, string>,
    body: string
  ): Promise<WebhookVerificationResult> {
    const payload = JSON.parse(body);
    const signature = headers['x-cc-webhook-signature'] ?? '';

    if (this.sandbox) {
      return {
        verified: true,
        eventType: payload.event?.type ?? 'charge:pending',
        payload,
      };
    }

    // Production: verify HMAC-SHA256 signature
    const crypto = await import('crypto');
    const computed = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');

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
      eventType: payload.event?.type ?? 'unknown',
      payload,
    };
  }

  private mapStatus(coinbaseStatus: string): PaymentState {
    const statusMap: Record<string, PaymentState> = {
      NEW: 'initiated',
      PENDING: 'awaiting_customer_approval',
      CONFIRMED: 'paid',
      COMPLETED: 'paid',
      RESOLVED: 'paid',
      EXPIRED: 'failed',
      CANCELED: 'failed',
      UNRESOLVED: 'failed',
    };
    return statusMap[coinbaseStatus] ?? 'initiated';
  }
}
