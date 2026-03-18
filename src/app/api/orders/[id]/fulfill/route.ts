import { NextRequest, NextResponse } from 'next/server';
import { fulfillmentService } from '@/lib/services/fulfillment-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const results = await fulfillmentService.fulfillOrder(id);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Fulfillment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fulfillment failed' },
      { status: 500 }
    );
  }
}
