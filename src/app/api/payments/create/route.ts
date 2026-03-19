import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/services/payment-service';
import { balanceService } from '@/lib/services/balance-service';
import { fulfillmentService } from '@/lib/services/fulfillment-service';
import { generateOrderNumber } from '@/lib/utils';
import type { AdapterType } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, name, couponCode, paymentMethod, userId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      productTitle: string;
      quantity: number;
      unitPrice: number;
      total: number;
      deliveryType: 'DOWNLOAD' | 'LICENSE_KEY' | 'PRIVATE_LINK';
    }> = [];

    if (items && items.length > 0) {
      for (const item of items) {
        const product = await db.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
        }
        const unitPrice = Number(product.price);
        const itemTotal = unitPrice * (item.quantity || 1);
        subtotal += itemTotal;
        orderItems.push({
          productId: product.id,
          productTitle: product.title,
          quantity: item.quantity || 1,
          unitPrice,
          total: itemTotal,
          deliveryType: product.deliveryType,
        });
      }
    } else {
      // Fallback: use amount from body (for simplified checkout)
      subtotal = body.amount || 0;
    }

    // Apply coupon
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.active) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = subtotal * (Number(coupon.discountValue) / 100);
        } else {
          discount = Number(coupon.discountValue);
        }
        couponId = coupon.id;
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerEmail: email,
        customerName: name,
        userId: userId || undefined,
        subtotal,
        discount,
        total,
        couponId,
        items: orderItems.length > 0
          ? { create: orderItems }
          : undefined,
      },
    });

    // Handle balance payment
    if (paymentMethod === 'balance') {
      if (!userId) {
        return NextResponse.json({ error: 'Must be logged in to pay with balance' }, { status: 400 });
      }

      const success = await balanceService.deductBalance({
        userId,
        amount: total,
        orderId: order.id,
      });

      if (!success) {
        await db.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        });
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      // Create a payment record for balance payment
      await db.payment.create({
        data: {
          orderId: order.id,
          externalPaymentId: `balance_${Date.now()}`,
          provider: 'balance',
          status: 'PAID',
          amount: total,
          currency: 'USD',
        },
      });

      // Mark order as paid and fulfill
      await db.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      try {
        await fulfillmentService.fulfillOrder(order.id);
      } catch (err) {
        console.error(`Auto-fulfillment failed for balance order ${order.id}:`, err);
      }

      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: 'balance',
        status: 'paid',
      });
    }

    // Handle external payment (cashapp or coinbase)
    const provider: AdapterType = paymentMethod === 'coinbase' ? 'coinbase' : 'cashapp';
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const payment = await paymentService.createPayment({
      orderId: order.id,
      amount: total,
      customerEmail: email,
      returnUrl: `${origin}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${origin}/checkout?orderId=${order.id}`,
      provider,
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: payment.paymentId,
      paymentMethod: provider,
      status: payment.status,
      qrCodeUrl: payment.qrCodeUrl,
      redirectUrl: payment.redirectUrl,
      expiresAt: payment.expiresAt,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
