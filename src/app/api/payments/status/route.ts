import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment-service';

export async function GET(request: NextRequest) {
  try {
    const paymentId = request.nextUrl.searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
    }

    const result = await paymentService.pollExternalStatus(paymentId);

    return NextResponse.json({
      status: result.status,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
