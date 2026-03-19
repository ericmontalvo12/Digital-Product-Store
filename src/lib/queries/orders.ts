import { db } from '@/lib/db';
import { cache } from 'react';

export const getOrders = cache(async (opts?: {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { status, search, limit = 20, page = 1 } = opts ?? {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
    db.order.count({ where }),
  ]);

  return { orders, total, pages: Math.ceil(total / limit) };
});

export const getOrderById = cache(async (id: string) => {
  return db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      payments: {
        include: { events: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      },
      refunds: { orderBy: { createdAt: 'desc' } },
      coupon: true,
    },
  });
});

export const getOrderByNumber = cache(async (orderNumber: string) => {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      items: { include: { product: true } },
      payments: {
        include: { events: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      },
      refunds: true,
    },
  });
});

export const getOrdersByEmail = cache(async (email: string) => {
  return db.order.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      payments: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
});
