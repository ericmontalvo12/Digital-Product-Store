import { db } from '@/lib/db';
import { cache } from 'react';

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export const getDashboardStats = cache(async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    db.order.aggregate({
      where: { status: 'PAID', createdAt: { gte: thirtyDaysAgo } },
      _sum: { total: true },
    }),
    db.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.product.count(),
    db.order.findMany({
      select: { customerEmail: true },
      distinct: ['customerEmail'],
    }),
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
    db.orderItem.groupBy({
      by: ['productId', 'productTitle'],
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    revenue: Number(totalRevenue._sum.total ?? 0),
    orderCount: totalOrders,
    productCount: totalProducts,
    customerCount: totalCustomers.length,
    recentOrders,
    topProducts,
  };
});

// ─── Admin Products ─────────────────────────────────────────────────────────

export const getAdminProducts = cache(async () => {
  return db.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orderItems: true } },
    },
  });
});

// ─── Admin Customers ────────────────────────────────────────────────────────

export const getAdminCustomers = cache(async () => {
  const orders = await db.order.findMany({
    select: {
      customerEmail: true,
      customerName: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const customerMap = new Map<string, {
    email: string;
    name: string | null;
    orderCount: number;
    totalSpent: number;
    lastOrder: Date;
  }>();

  for (const order of orders) {
    const existing = customerMap.get(order.customerEmail);
    if (existing) {
      existing.orderCount++;
      existing.totalSpent += Number(order.total);
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt;
      }
    } else {
      customerMap.set(order.customerEmail, {
        email: order.customerEmail,
        name: order.customerName,
        orderCount: 1,
        totalSpent: Number(order.total),
        lastOrder: order.createdAt,
      });
    }
  }

  return Array.from(customerMap.values()).sort((a, b) => b.lastOrder.getTime() - a.lastOrder.getTime());
});

// ─── Admin Inventory ────────────────────────────────────────────────────────

export const getAdminInventory = cache(async () => {
  const products = await db.product.findMany({
    include: {
      inventoryBatches: true,
      licenseKeys: { select: { status: true } },
    },
  });

  return products.map(p => {
    if (p.stockMode === 'UNLIMITED') {
      return {
        productId: p.id,
        productTitle: p.title,
        stockMode: p.stockMode,
        total: Infinity,
        available: Infinity,
        lowStock: false,
      };
    }

    if (p.stockMode === 'LICENSE_KEY') {
      const available = p.licenseKeys.filter(k => k.status === 'AVAILABLE').length;
      return {
        productId: p.id,
        productTitle: p.title,
        stockMode: p.stockMode,
        total: p.licenseKeys.length,
        available,
        lowStock: available < 10,
      };
    }

    const remaining = p.inventoryBatches.reduce((sum, b) => sum + b.remaining, 0);
    return {
      productId: p.id,
      productTitle: p.title,
      stockMode: p.stockMode,
      total: p.inventoryBatches.reduce((sum, b) => sum + b.quantity, 0),
      available: remaining,
      lowStock: remaining < 10,
    };
  });
});

// ─── Admin Coupons ──────────────────────────────────────────────────────────

export const getAdminCoupons = cache(async () => {
  return db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
});

// ─── Admin Audit Logs ───────────────────────────────────────────────────────

export const getAuditLogs = cache(async (opts?: { limit?: number; page?: number }) => {
  const { limit = 50, page = 1 } = opts ?? {};

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { email: true, name: true } } },
    }),
    db.auditLog.count(),
  ]);

  return { logs, total, pages: Math.ceil(total / limit) };
});

// ─── Webhook Events ─────────────────────────────────────────────────────────

export const getRecentWebhookEvents = cache(async (limit = 10) => {
  return db.webhookEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
});

// ─── Payment Errors ─────────────────────────────────────────────────────────

export const getRecentPaymentErrors = cache(async (limit = 10) => {
  return db.payment.findMany({
    where: { status: 'FAILED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { order: { select: { orderNumber: true } } },
  });
});
