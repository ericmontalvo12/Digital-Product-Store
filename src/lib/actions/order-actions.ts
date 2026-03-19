'use server';

import { db } from '@/lib/db';
import { paymentService } from '@/lib/services/payment-service';
import { fulfillmentService } from '@/lib/services/fulfillment-service';
import { revalidatePath } from 'next/cache';

export async function refundOrder(orderId: string, reason?: string) {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { payments: { where: { status: 'PAID' }, take: 1 } },
  });

  if (order.payments.length === 0) {
    return { error: 'No paid payment found for this order' };
  }

  const payment = order.payments[0];
  const refund = await paymentService.refund(payment.id, Number(order.total), reason);

  await db.order.update({
    where: { id: orderId },
    data: { status: 'REFUNDED' },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, refundId: refund.id };
}

export async function fulfillOrder(orderId: string) {
  try {
    const results = await fulfillmentService.fulfillOrder(orderId);
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, results };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Fulfillment failed' };
  }
}

export async function resendDelivery(orderItemId: string) {
  try {
    const result = await fulfillmentService.resendDelivery(orderItemId);
    return { success: true, token: result.token, email: result.email };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Resend failed' };
  }
}

export async function addOrderNote(orderId: string, note: string) {
  const order = await db.order.findUniqueOrThrow({ where: { id: orderId } });

  const existingNotes = order.notes || '';
  const timestamp = new Date().toISOString();
  const newNotes = existingNotes
    ? `${existingNotes}\n\n[${timestamp}]\n${note}`
    : `[${timestamp}]\n${note}`;

  await db.order.update({
    where: { id: orderId },
    data: { notes: newNotes },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
