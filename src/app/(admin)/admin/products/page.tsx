import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { getAdminProducts } from '@/lib/queries/admin';
import { formatCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-[var(--text-muted)]">{products.length} products</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={16} />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Create your first product to start selling."
          action={
            <Link href="/admin/products/new">
              <Button>Create Product</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link href={`/admin/products/${product.id}`} className="hover:text-[var(--accent)] transition-colors">
                    <span className="font-medium text-[var(--text-primary)]">{product.title}</span>
                    <br />
                    <span className="text-xs text-[var(--text-muted)]">/{product.slug}</span>
                  </Link>
                </TableCell>
                <TableCell>{product.category || '—'}</TableCell>
                <TableCell className="font-medium text-[var(--text-primary)]">{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{product.stockMode === 'UNLIMITED' ? '∞' : product.stockMode}</TableCell>
                <TableCell>{product._count.orderItems}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={product.published ? 'success' : 'default'}>
                      {product.published ? 'Published' : 'Draft'}
                    </Badge>
                    {product.featured && <Badge variant="info">Featured</Badge>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
