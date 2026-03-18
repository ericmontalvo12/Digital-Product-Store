import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const coupon = await db.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        discountType: body.discountType,
        discountValue: body.discountValue,
        minOrderValue: body.minOrderValue,
        maxUses: body.maxUses,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
