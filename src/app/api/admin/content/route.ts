import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: { startsWith: 'content.' },
      },
    });

    const content: Record<string, unknown> = {};
    for (const s of settings) {
      content[s.key.replace('content.', '')] = s.value;
    }

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await db.setting.upsert({
        where: { key: `content.${key}` },
        create: { key: `content.${key}`, value: value as object },
        update: { value: value as object },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
