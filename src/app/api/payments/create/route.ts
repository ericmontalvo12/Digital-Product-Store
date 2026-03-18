import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentService } from '@/lib/services/payment-service';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, name, couponCode } = body;

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
        subtotal,
        discount,
        total,
        couponId,
        items: orderItems.length > 0
          ? { create: orderItems }
          : undefined,
      },
    });

    // Create payment
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const payment = await paymentService.createPayment({
      orderId: order.id,
      amount: total,
      customerEmail: email,
      returnUrl: `${origin}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${origin}/checkout?orderId=${order.id}`,
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: payment.paymentId,
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
