import Link from 'next/link';
import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  category?: string | null;
  images?: string[];
  stockMode: string;
  featured?: boolean;
}

export function ProductCard({
  title,
  slug,
  price,
  comparePrice,
  category,
  images,
  stockMode,
}: ProductCardProps) {
  const hasImage = images && images.length > 0;

  return (
    <Link href={`/product/${slug}`}>
      <Card hover padding={false} className="group overflow-hidden h-full">
        <div className="aspect-[4/3] bg-[var(--bg-elevated)] relative flex items-center justify-center">
          {hasImage ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package size={40} strokeWidth={1} className="text-[var(--text-muted)]" />
          )}
          {category && (
            <div className="absolute top-3 left-3">
              <Badge variant="default">{category}</Badge>
            </div>
          )}
          {stockMode === 'QUANTITY' && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Limited</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(price)}</span>
              {comparePrice && comparePrice > price && (
                <span className="text-xs text-[var(--text-muted)] line-through">
                  {formatCurrency(comparePrice)}
                </span>
              )}
            </div>
            <Button size="sm" variant="secondary">
              View
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
