import { z } from 'zod';

// ─── Product Validators ─────────────────────────────────────────────────────

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  comparePrice: z.coerce.number().min(0).optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  stockMode: z.enum(['UNLIMITED', 'QUANTITY', 'LICENSE_KEY']).default('UNLIMITED'),
  deliveryType: z.enum(['DOWNLOAD', 'LICENSE_KEY', 'PRIVATE_LINK']).default('DOWNLOAD'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1),
});

// ─── Order / Checkout Validators ────────────────────────────────────────────

export const checkoutSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).default(1),
  })).min(1, 'Cart is empty'),
  couponCode: z.string().optional(),
});

// ─── Coupon Validators ──────────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters').max(30).transform(v => v.toUpperCase()),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.coerce.number().min(0.01, 'Discount must be greater than 0'),
  minOrderValue: z.coerce.number().min(0).optional().nullable(),
  maxUses: z.coerce.number().int().min(1).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

// ─── Inventory Validators ───────────────────────────────────────────────────

export const addLicenseKeysSchema = z.object({
  productId: z.string().min(1),
  keys: z.array(z.string().min(1)).min(1, 'At least one key is required'),
});

export const addBatchInventorySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  label: z.string().optional(),
});

// ─── Content Validators ─────────────────────────────────────────────────────

export const updateContentSchema = z.object({
  heroBadge: z.string().optional(),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  ctaHeading: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  storeName: z.string().optional(),
  supportEmail: z.string().email().optional(),
  footerDescription: z.string().optional(),
});

// ─── Payment Validators ────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  orderId: z.string().optional(),
  amount: z.coerce.number().min(0.01),
  email: z.string().email().optional(),
  name: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().min(1).default(1),
  })).optional(),
  couponCode: z.string().optional(),
  flow: z.enum(['qr', 'redirect']).optional(),
});

// ─── Internal Note Validator ────────────────────────────────────────────────

export const addOrderNoteSchema = z.object({
  orderId: z.string().min(1),
  note: z.string().min(1, 'Note cannot be empty').max(2000),
});
