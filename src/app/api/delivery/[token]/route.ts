import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fulfillmentService } from '@/lib/services/fulfillment-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find the order item with this delivery token
    const orderItems = await db.orderItem.findMany({
      where: { fulfilled: true },
      include: { order: true },
    });

    const item = orderItems.find((oi) => {
      const data = oi.deliveryData as Record<string, unknown> | null;
      return data?.deliveryToken === token;
    });

    if (!item) {
      return NextResponse.json({ error: 'Invalid or expired delivery token' }, { status: 404 });
    }

    // Check expiry
    const data = item.deliveryData as Record<string, unknown>;
    if (data.tokenExpiresAt && new Date(data.tokenExpiresAt as string) < new Date()) {
      return NextResponse.json({ error: 'Delivery token has expired' }, { status: 410 });
    }

    // Check order is paid
    if (item.order.status !== 'PAID') {
      return NextResponse.json({ error: 'Order payment not confirmed' }, { status: 403 });
    }

    // Generate download URLs
    if (data.type === 'download' && Array.isArray(data.assets)) {
      const assets = await Promise.all(
        (data.assets as Array<{ fileName: string; storageKey: string; fileSize: number }>).map(
          async (asset) => ({
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            downloadUrl: await fulfillmentService.getDownloadUrl(asset.storageKey),
          })
        )
      );

      return NextResponse.json({ deliveryType: 'download', assets });
    }

    if (data.type === 'license_key') {
      return NextResponse.json({
        deliveryType: 'license_key',
        licenseKey: data.licenseKey,
      });
    }

    return NextResponse.json({ deliveryType: data.type, data });
  } catch (error) {
    console.error('Delivery error:', error);
    return NextResponse.json({ error: 'Delivery failed' }, { status: 500 });
  }
}
