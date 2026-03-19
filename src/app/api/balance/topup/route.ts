import { NextRequest, NextResponse } from 'next/server';
import { balanceService } from '@/lib/services/balance-service';
import type { AdapterType } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, amount, provider } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    const validProviders: AdapterType[] = ['cashapp', 'coinbase'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider. Use "cashapp" or "coinbase"' }, { status: 400 });
    }

    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const result = await balanceService.initiateTopUp({
      userId,
      email,
      amount,
      provider,
      returnUrl: `${origin}/account/balance?topup=success`,
      cancelUrl: `${origin}/account/balance?topup=cancelled`,
    });

    return NextResponse.json({
      orderId: result.orderId,
      paymentId: result.paymentId,
      status: result.status,
      qrCodeUrl: result.qrCodeUrl,
      redirectUrl: result.redirectUrl,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error('Balance top-up error:', error);
    return NextResponse.json({ error: 'Failed to initiate top-up' }, { status: 500 });
  }
}
