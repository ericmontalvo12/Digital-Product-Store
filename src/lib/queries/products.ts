import { db } from '@/lib/db';
import { cache } from 'react';

export const getPublishedProducts = cache(async (opts?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { category, featured, search, limit = 20, page = 1 } = opts ?? {};

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
});

export const getFeaturedProducts = cache(async (limit = 8) => {
  return db.product.findMany({
    where: { published: true, featured: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  return db.product.findUnique({
    where: { slug },
    include: {
      assets: { orderBy: { sortOrder: 'asc' } },
    },
  });
});

export const getProductById = cache(async (id: string) => {
  return db.product.findUnique({
    where: { id },
    include: {
      assets: { orderBy: { sortOrder: 'asc' } },
      licenseKeys: { select: { id: true, status: true } },
      inventoryBatches: true,
    },
  });
});

export const getProductCategories = cache(async () => {
  const result = await db.product.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category'],
  });
  return result.map(r => r.category).filter(Boolean) as string[];
});
