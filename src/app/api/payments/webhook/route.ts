import { NextRequest, NextResponse } from 'next/server';
import { webhookService } from '@/lib/services/webhook-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result = await webhookService.processWebhook(headers, body);

    if (!result.success) {
      console.error(`Webhook processing failed: ${result.error}`);
      // Return 200 to avoid retries for verification failures
      return NextResponse.json({ received: true, error: result.error }, { status: 200 });
    }

    return NextResponse.json({ received: true, eventId: result.eventId });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
