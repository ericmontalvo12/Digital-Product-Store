'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Download, Key, Link2, ChevronLeft, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cart-store';

const mockProduct = {
  id: '1',
  title: 'Premium UI Kit',
  slug: 'premium-ui-kit',
  description: 'A comprehensive UI kit featuring over 200 carefully crafted components for modern web applications. Includes dark mode variants, responsive layouts, and fully customizable design tokens. Perfect for designers and developers who want to ship beautiful products fast.',
  price: 49.00,
  comparePrice: 79.00,
  category: 'Design',
  tags: ['UI', 'Components', 'Figma', 'Design System'],
  deliveryType: 'DOWNLOAD' as const,
  stockMode: 'UNLIMITED' as const,
  features: [
    '200+ UI components',
    'Dark & light mode',
    'Responsive layouts',
    'Figma source files',
    'Free updates',
    'Commercial license',
  ],
};

export default function ProductPage() {
  const params = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const product = mockProduct;

  const deliveryIcon = {
    DOWNLOAD: Download,
    LICENSE_KEY: Key,
    PRIVATE_LINK: Link2,
  }[product.deliveryType];

  const deliveryLabel = {
    DOWNLOAD: 'Instant Download',
    LICENSE_KEY: 'License Key',
    PRIVATE_LINK: 'Private Link',
  }[product.deliveryType];

  const DeliveryIcon = deliveryIcon;

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)]">
          <Package size={80} strokeWidth={0.5} />
        </div>

        {/* Product Info */}
        <div>
          <Badge variant="default" className="mb-3">{product.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-3">{product.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[var(--accent)]">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-[var(--text-muted)] line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            {product.comparePrice && (
              <Badge variant="success">
                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Delivery Type */}
          <div className="flex items-center gap-2 mb-6 text-sm text-[var(--text-muted)]">
            <DeliveryIcon size={16} />
            <span>{deliveryLabel}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                addItem({
                  productId: product.id,
                  title: product.title,
                  slug: product.slug,
                  price: product.price,
                  deliveryType: product.deliveryType,
                });
              }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </Button>
          </div>

          {/* Features */}
          <Card>
            <h3 className="font-semibold mb-3">What&apos;s Included</h3>
            <ul className="space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Check size={14} className="text-[var(--accent)] shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
