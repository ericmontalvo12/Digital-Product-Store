import { NextRequest, NextResponse } from 'next/server';
import { webhookService } from '@/lib/services/webhook-service';
import { balanceService } from '@/lib/services/balance-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result = await webhookService.processWebhook(headers, body, 'coinbase');

    if (!result.success) {
      console.error(`Coinbase webhook processing failed: ${result.error}`);
      return NextResponse.json({ received: true, error: result.error }, { status: 200 });
    }

    // Check if this is a balance top-up payment and credit the balance
    const parsed = JSON.parse(body);
    const event = parsed.event?.data ?? parsed;
    const chargeCode = event.code ?? event.id;

    if (chargeCode) {
      const payment = await db.payment.findFirst({
        where: { externalPaymentId: chargeCode },
        include: { order: true },
      });

      if (payment?.order) {
        const orderMeta = payment.order.metadata as Record<string, unknown> | null;
        if (orderMeta?.type === 'balance_topup' && payment.order.userId) {
          const eventType = parsed.event?.type ?? '';
          if (eventType === 'charge:confirmed' || eventType === 'charge:completed') {
            await balanceService.creditBalance({
              userId: payment.order.userId,
              amount: Number(payment.amount),
              provider: 'coinbase',
              externalPaymentId: chargeCode,
              orderId: payment.orderId,
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true, eventId: result.eventId });
  } catch (error) {
    console.error('Coinbase webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
