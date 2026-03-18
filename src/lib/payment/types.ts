// ─── Payment State Machine ───────────────────────────────────────────────────

export type PaymentState =
  | 'initiated'
  | 'awaiting_customer_approval'
  | 'approved'
  | 'payment_processing'
  | 'paid'
  | 'failed'
  | 'refunded';

export const PAYMENT_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  initiated: ['awaiting_customer_approval', 'failed'],
  awaiting_customer_approval: ['approved', 'failed'],
  approved: ['payment_processing', 'failed'],
  payment_processing: ['paid', 'failed'],
  paid: ['refunded'],
  failed: ['initiated'], // retry
  refunded: [],
};

export function canTransition(from: PaymentState, to: PaymentState): boolean {
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Payment Adapter Interface ──────────────────────────────────────────────

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentResponse {
  externalPaymentId: string;
  status: PaymentState;
  qrCodeUrl?: string;
  redirectUrl?: string;
  expiresAt?: Date;
  providerData?: Record<string, unknown>;
}

export interface PaymentStatusResponse {
  externalPaymentId: string;
  status: PaymentState;
  amount: number;
  currency: string;
  providerData?: Record<string, unknown>;
}

export interface RefundRequest {
  externalPaymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  externalRefundId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
}

export interface WebhookVerificationResult {
  verified: boolean;
  eventType: string;
  payload: Record<string, unknown>;
}

export interface PaymentAdapter {
  readonly provider: string;

  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
  getPaymentStatus(externalPaymentId: string): Promise<PaymentStatusResponse>;
  refundPayment(request: RefundRequest): Promise<RefundResponse>;
  verifyWebhook(headers: Record<string, string>, body: string): Promise<WebhookVerificationResult>;
}

// ─── Payment Event Types ────────────────────────────────────────────────────

export interface PaymentEvent {
  paymentId: string;
  status: PaymentState;
  data?: Record<string, unknown>;
  source: 'customer' | 'webhook' | 'system' | 'admin';
}

// ─── Checkout Types ─────────────────────────────────────────────────────────

export interface CheckoutSession {
  orderId: string;
  paymentId: string;
  status: PaymentState;
  qrCodeUrl?: string;
  redirectUrl?: string;
  expiresAt?: string;
  amount: number;
  currency: string;
}

export type CheckoutFlow = 'qr' | 'redirect';
