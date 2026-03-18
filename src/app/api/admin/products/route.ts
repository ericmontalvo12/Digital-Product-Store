import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orderItems: true, licenseKeys: true, inventoryBatches: true },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const slug = body.slug || slugify(body.title);

    const product = await db.product.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice,
        category: body.category,
        tags: body.tags || [],
        images: body.images || [],
        stockMode: body.stockMode || 'UNLIMITED',
        deliveryType: body.deliveryType || 'DOWNLOAD',
        published: body.published ?? false,
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
