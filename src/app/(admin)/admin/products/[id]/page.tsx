import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductForm } from '@/components/admin/product-form';
import { getProductById } from '@/lib/queries/products';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}


export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ChevronLeft size={14} />
        Back to Products
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <Badge variant={product.published ? 'success' : 'default'}>
          {product.published ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <ProductForm
        product={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          category: product.category,
          tags: product.tags,
          stockMode: product.stockMode,
          deliveryType: product.deliveryType,
          published: product.published,
          featured: product.featured,
        }}
      />
    </div>
  );
}
