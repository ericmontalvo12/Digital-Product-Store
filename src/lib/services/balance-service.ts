import 'server-only';
import { db } from '@/lib/db';
import { paymentService } from './payment-service';
import type { AdapterType } from '@/lib/payment';

export class BalanceService {
  /** Get or create balance for a user. */
  async getBalance(userId: string) {
    let balance = await db.balance.findUnique({ where: { userId } });
    if (!balance) {
      balance = await db.balance.create({
        data: { userId, amount: 0 },
      });
    }
    return balance;
  }

  /** Get transaction history for a user. */
  async getTransactions(userId: string, limit = 20) {
    return db.balanceTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Initiate a balance top-up using Cash App or Coinbase Commerce.
   * Creates an order (for tracking) and a payment, then returns
   * the payment details so the customer can complete it.
   */
  async initiateTopUp(params: {
    userId: string;
    email: string;
    amount: number;
    provider: AdapterType;
    returnUrl: string;
    cancelUrl: string;
  }) {
    // Create a special "top-up" order for tracking
    const order = await db.order.create({
      data: {
        orderNumber: `TOPUP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        userId: params.userId,
        customerEmail: params.email,
        subtotal: params.amount,
        total: params.amount,
        discount: 0,
        metadata: { type: 'balance_topup' },
      },
    });

    const payment = await paymentService.createPayment({
      orderId: order.id,
      amount: params.amount,
      customerEmail: params.email,
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
      provider: params.provider,
    });

    return {
      orderId: order.id,
      ...payment,
    };
  }

  /**
   * Credit a user's balance after a successful top-up payment.
   * Called by the webhook handler when a top-up payment is confirmed.
   */
  async creditBalance(params: {
    userId: string;
    amount: number;
    provider: string;
    externalPaymentId?: string;
    orderId?: string;
  }) {
    // Upsert balance
    const balance = await db.balance.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, amount: params.amount },
      update: { amount: { increment: params.amount } },
    });

    // Record the transaction
    await db.balanceTransaction.create({
      data: {
        userId: params.userId,
        type: 'TOPUP',
        amount: params.amount,
        description: `Balance top-up via ${params.provider}`,
        provider: params.provider,
        externalPaymentId: params.externalPaymentId,
        orderId: params.orderId,
      },
    });

    return balance;
  }

  /**
   * Deduct from a user's balance for a purchase.
   * Returns true if successful, false if insufficient funds.
   */
  async deductBalance(params: {
    userId: string;
    amount: number;
    orderId: string;
  }): Promise<boolean> {
    const balance = await this.getBalance(params.userId);

    if (Number(balance.amount) < params.amount) {
      return false;
    }

    await db.balance.update({
      where: { userId: params.userId },
      data: { amount: { decrement: params.amount } },
    });

    await db.balanceTransaction.create({
      data: {
        userId: params.userId,
        type: 'PURCHASE',
        amount: -params.amount,
        description: `Purchase - Order`,
        orderId: params.orderId,
      },
    });

    return true;
  }

  /** Refund balance for a cancelled/refunded order. */
  async refundBalance(params: {
    userId: string;
    amount: number;
    orderId: string;
  }) {
    await db.balance.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, amount: params.amount },
      update: { amount: { increment: params.amount } },
    });

    await db.balanceTransaction.create({
      data: {
        userId: params.userId,
        type: 'REFUND',
        amount: params.amount,
        description: `Refund for order`,
        orderId: params.orderId,
      },
    });
  }
}

export const balanceService = new BalanceService();
