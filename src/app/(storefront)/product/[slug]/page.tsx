import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Key, Link2, ChevronLeft, Check, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { getProductBySlug } from '@/lib/queries/products';
import { formatCurrency } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    notFound();
  }

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;

  const deliveryConfig = {
    DOWNLOAD: { icon: Download, label: 'Instant Download' },
    LICENSE_KEY: { icon: Key, label: 'License Key' },
    PRIVATE_LINK: { icon: Link2, label: 'Private Link' },
  }[product.deliveryType];

  const DeliveryIcon = deliveryConfig.icon;

  return (
    <div className="container-main py-8">
      <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center overflow-hidden">
          {product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <Package size={80} strokeWidth={0.5} className="text-[var(--text-muted)]" />
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && <Badge variant="default" className="mb-3">{product.category}</Badge>}
          <h1 className="text-3xl font-bold tracking-tight mb-3">{product.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[var(--accent)]">
              {formatCurrency(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <>
                <span className="text-lg text-[var(--text-muted)] line-through">
                  {formatCurrency(comparePrice)}
                </span>
                <Badge variant="success">
                  {Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Delivery Type */}
          <div className="flex items-center gap-2 mb-6 text-sm text-[var(--text-muted)]">
            <DeliveryIcon size={16} />
            <span>{deliveryConfig.label}</span>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <AddToCartButton
              productId={product.id}
              title={product.title}
              slug={product.slug}
              price={price}
              image={product.images[0]}
              deliveryType={product.deliveryType}
            />
          </div>

          {/* Assets Info */}
          {product.assets.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-3">Included Files</h3>
              <ul className="space-y-2">
                {product.assets.map((asset) => (
                  <li key={asset.id} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Check size={14} className="text-[var(--accent)] shrink-0" />
                    <span>{asset.fileName}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ({(asset.fileSize / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
