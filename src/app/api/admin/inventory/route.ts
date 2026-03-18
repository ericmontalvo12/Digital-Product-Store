import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { stockMode: { not: 'UNLIMITED' } },
      include: {
        inventoryBatches: { orderBy: { createdAt: 'desc' } },
        licenseKeys: {
          select: { id: true, status: true },
        },
      },
    });

    const inventory = products.map((p) => {
      if (p.stockMode === 'LICENSE_KEY') {
        const available = p.licenseKeys.filter((k) => k.status === 'AVAILABLE').length;
        const total = p.licenseKeys.length;
        return {
          productId: p.id,
          productTitle: p.title,
          stockMode: p.stockMode,
          total,
          available,
          lowStock: available < 10,
        };
      }

      const totalQty = p.inventoryBatches.reduce((sum, b) => sum + b.quantity, 0);
      const remaining = p.inventoryBatches.reduce((sum, b) => sum + b.remaining, 0);
      return {
        productId: p.id,
        productTitle: p.title,
        stockMode: p.stockMode,
        total: totalQty,
        available: remaining,
        lowStock: remaining < 10,
      };
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, type } = body;

    if (type === 'license_keys') {
      const keys: string[] = body.keys || [];
      const created = await db.licenseKey.createMany({
        data: keys.map((key) => ({
          productId,
          key,
          status: 'AVAILABLE' as const,
        })),
      });
      return NextResponse.json({ created: created.count });
    }

    if (type === 'batch') {
      const batch = await db.inventoryBatch.create({
        data: {
          productId,
          quantity: body.quantity,
          remaining: body.quantity,
          label: body.label,
        },
      });
      return NextResponse.json({ batch });
    }

    return NextResponse.json({ error: 'Invalid inventory type' }, { status: 400 });
  } catch (error) {
    console.error('Inventory add error:', error);
    return NextResponse.json({ error: 'Failed to add inventory' }, { status: 500 });
  }
}
