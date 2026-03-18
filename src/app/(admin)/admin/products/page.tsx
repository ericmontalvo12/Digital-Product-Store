import Link from 'next/link';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const products = [
  { id: '1', title: 'Premium UI Kit', slug: 'premium-ui-kit', price: '$49.00', category: 'Design', stock: 'Unlimited', published: true, featured: true },
  { id: '2', title: 'Developer Toolkit Pro', slug: 'developer-toolkit-pro', price: '$79.00', category: 'Development', stock: 'Unlimited', published: true, featured: true },
  { id: '3', title: 'Photography Presets Pack', slug: 'photography-presets-pack', price: '$29.00', category: 'Photography', stock: '150', published: true, featured: false },
  { id: '4', title: 'Business Template Bundle', slug: 'business-template-bundle', price: '$59.00', category: 'Business', stock: '45 keys', published: true, featured: false },
  { id: '5', title: 'SEO Toolkit', slug: 'seo-toolkit', price: '$39.00', category: 'Marketing', stock: 'Unlimited', published: false, featured: false },
];

export default function AdminProductsPage() {
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

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
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
              <TableCell>{product.category}</TableCell>
              <TableCell className="font-medium text-[var(--text-primary)]">{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Badge variant={product.published ? 'success' : 'default'}>
                    {product.published ? 'Published' : 'Draft'}
                  </Badge>
                  {product.featured && <Badge variant="info">Featured</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <button className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer">
                  <MoreHorizontal size={16} className="text-[var(--text-muted)]" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
