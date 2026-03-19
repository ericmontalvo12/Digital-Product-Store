import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample products
  const products = [
    {
      title: 'UI Component Kit Pro',
      slug: 'ui-component-kit-pro',
      description: 'A comprehensive collection of 200+ professionally designed UI components for React. Includes buttons, forms, modals, navigation, data display, and more. Built with TypeScript and Tailwind CSS.',
      price: 49.99,
      comparePrice: 79.99,
      category: 'Design Assets',
      tags: ['react', 'ui-kit', 'tailwind', 'components'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'DOWNLOAD' as const,
      published: true,
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'Next.js SaaS Starter',
      slug: 'nextjs-saas-starter',
      description: 'Production-ready SaaS boilerplate with authentication, billing (Stripe), team management, admin dashboard, and API. Save months of development time.',
      price: 129.00,
      comparePrice: 199.00,
      category: 'Templates',
      tags: ['nextjs', 'saas', 'boilerplate', 'stripe'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'DOWNLOAD' as const,
      published: true,
      featured: true,
      sortOrder: 2,
    },
    {
      title: 'Icon Pack - 1000+ SVG Icons',
      slug: 'icon-pack-1000-svg',
      description: 'Hand-crafted icon set with 1000+ icons in 20 categories. Available in SVG, PNG, and icon font formats. Perfect for web and mobile applications.',
      price: 29.99,
      comparePrice: null,
      category: 'Design Assets',
      tags: ['icons', 'svg', 'design'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'DOWNLOAD' as const,
      published: true,
      featured: true,
      sortOrder: 3,
    },
    {
      title: 'TypeScript Mastery Course',
      slug: 'typescript-mastery-course',
      description: 'Deep-dive video course covering advanced TypeScript patterns, generics, type manipulation, and real-world application architecture. 40+ hours of content.',
      price: 89.00,
      comparePrice: 149.00,
      category: 'Courses',
      tags: ['typescript', 'course', 'education'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'PRIVATE_LINK' as const,
      published: true,
      featured: true,
      sortOrder: 4,
    },
    {
      title: 'Notion Productivity System',
      slug: 'notion-productivity-system',
      description: 'Complete Notion workspace template with project management, habit tracking, goal setting, and knowledge base. Duplicatable template with setup guide.',
      price: 19.99,
      comparePrice: 34.99,
      category: 'Templates',
      tags: ['notion', 'productivity', 'template'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'PRIVATE_LINK' as const,
      published: true,
      featured: false,
      sortOrder: 5,
    },
    {
      title: 'Premium WordPress Theme License',
      slug: 'premium-wordpress-theme',
      description: 'Modern, SEO-optimized WordPress theme with page builder, WooCommerce support, and lifetime updates. Each license key is for a single site.',
      price: 59.00,
      comparePrice: null,
      category: 'Software',
      tags: ['wordpress', 'theme', 'license'],
      images: [],
      stockMode: 'LICENSE_KEY' as const,
      deliveryType: 'LICENSE_KEY' as const,
      published: true,
      featured: false,
      sortOrder: 6,
    },
    {
      title: 'Stock Photo Bundle - 500 Photos',
      slug: 'stock-photo-bundle-500',
      description: 'Curated collection of 500 high-resolution stock photos. Royalty-free for commercial use. Categories include nature, business, technology, and lifestyle.',
      price: 39.99,
      comparePrice: 69.99,
      category: 'Design Assets',
      tags: ['photos', 'stock', 'images'],
      images: [],
      stockMode: 'QUANTITY' as const,
      deliveryType: 'DOWNLOAD' as const,
      published: true,
      featured: false,
      sortOrder: 7,
    },
    {
      title: 'API Security Checklist eBook',
      slug: 'api-security-checklist-ebook',
      description: 'Comprehensive guide to securing REST and GraphQL APIs. Covers authentication, rate limiting, input validation, OWASP top 10, and real-world case studies.',
      price: 14.99,
      comparePrice: null,
      category: 'eBooks',
      tags: ['security', 'api', 'ebook'],
      images: [],
      stockMode: 'UNLIMITED' as const,
      deliveryType: 'DOWNLOAD' as const,
      published: true,
      featured: false,
      sortOrder: 8,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // Add license keys for the WordPress theme
  const wpProduct = await prisma.product.findUnique({ where: { slug: 'premium-wordpress-theme' } });
  if (wpProduct) {
    const existingKeys = await prisma.licenseKey.count({ where: { productId: wpProduct.id } });
    if (existingKeys === 0) {
      const keys = Array.from({ length: 25 }, (_, i) => ({
        productId: wpProduct.id,
        key: `WP-THEME-${String(i + 1).padStart(4, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'AVAILABLE' as const,
      }));
      await prisma.licenseKey.createMany({ data: keys });
    }
  }

  // Add inventory batch for the stock photo bundle
  const photoProduct = await prisma.product.findUnique({ where: { slug: 'stock-photo-bundle-500' } });
  if (photoProduct) {
    const existingBatches = await prisma.inventoryBatch.count({ where: { productId: photoProduct.id } });
    if (existingBatches === 0) {
      await prisma.inventoryBatch.create({
        data: {
          productId: photoProduct.id,
          quantity: 100,
          remaining: 100,
          label: 'Initial stock',
        },
      });
    }
  }

  // Create a sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 20,
      maxUses: 500,
      usedCount: 0,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE5' },
    update: {},
    create: {
      code: 'SAVE5',
      discountType: 'FIXED',
      discountValue: 5,
      minOrderValue: 25,
      maxUses: null,
      usedCount: 0,
      active: true,
    },
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
