import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/services/payment-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    const order = await db.order.findUniqueOrThrow({
      where: { id },
      include: { payments: { where: { status: 'PAID' }, take: 1 } },
    });

    if (order.payments.length === 0) {
      return NextResponse.json({ error: 'No paid payment found' }, { status: 400 });
    }

    const payment = order.payments[0];
    const refundAmount = amount ?? Number(order.total);

    const refund = await paymentService.refund(payment.id, refundAmount, reason);

    return NextResponse.json({ success: true, refund });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Refund failed' },
      { status: 500 }
    );
  }
}
