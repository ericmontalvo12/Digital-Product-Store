import { Suspense } from 'react';
import { getPublishedProducts, getProductCategories } from '@/lib/queries/products';
import { ProductCard } from '@/components/storefront/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CatalogFilters } from './catalog-filters';

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}


export const dynamic = 'force-dynamic';

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const page = parseInt(params.page ?? '1');

  let products: Awaited<ReturnType<typeof getPublishedProducts>>['products'] = [];
  let total = 0;
  let pages = 0;
  let categories: string[] = [];
  try {
    [{ products, total, pages }, categories] = await Promise.all([
      getPublishedProducts({ category, search, page, limit: 20 }),
      getProductCategories(),
    ]);
  } catch {
    // DB may not be migrated yet — render page with empty state
  }

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Product Catalog</h1>
        <p className="text-[var(--text-muted)]">Browse our collection of premium digital products</p>
      </div>

      <CatalogFilters categories={categories} activeCategory={category} initialSearch={search} />

      <p className="text-sm text-[var(--text-muted)] mb-4">{total} product{total !== 1 ? 's' : ''}</p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              price={Number(product.price)}
              comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
              category={product.category}
              images={product.images}
              stockMode={product.stockMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">No products found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <a
              key={p}
              href={`/catalog?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
                page: p.toString(),
              }).toString()}`}
              className={`w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-sm transition-colors ${
                p === page
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
