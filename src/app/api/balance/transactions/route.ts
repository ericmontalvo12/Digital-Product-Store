import { NextRequest, NextResponse } from 'next/server';
import { balanceService } from '@/lib/services/balance-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '20', 10);
    const transactions = await balanceService.getTransactions(userId, limit);

    return NextResponse.json({
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        description: t.description,
        provider: t.provider,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
