import { NextRequest, NextResponse } from 'next/server';
import { balanceService } from '@/lib/services/balance-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const balance = await balanceService.getBalance(userId);

    return NextResponse.json({
      balance: Number(balance.amount),
      updatedAt: balance.updatedAt,
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
