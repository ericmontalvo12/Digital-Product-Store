'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Design', 'Development', 'Photography', 'Business', 'Marketing'];

const products = [
  { id: '1', title: 'Premium UI Kit', slug: 'premium-ui-kit', price: 49.00, category: 'Design', stock: 'In Stock' },
  { id: '2', title: 'Developer Toolkit Pro', slug: 'developer-toolkit-pro', price: 79.00, category: 'Development', stock: 'In Stock' },
  { id: '3', title: 'Photography Presets Pack', slug: 'photography-presets-pack', price: 29.00, category: 'Photography', stock: 'In Stock' },
  { id: '4', title: 'Business Template Bundle', slug: 'business-template-bundle', price: 59.00, category: 'Business', stock: 'In Stock' },
  { id: '5', title: 'SEO Toolkit', slug: 'seo-toolkit', price: 39.00, category: 'Marketing', stock: 'In Stock' },
  { id: '6', title: 'Icon Library Pro', slug: 'icon-library-pro', price: 19.00, category: 'Design', stock: 'Limited' },
  { id: '7', title: 'React Component Kit', slug: 'react-component-kit', price: 89.00, category: 'Development', stock: 'In Stock' },
  { id: '8', title: 'Email Template Pack', slug: 'email-template-pack', price: 34.00, category: 'Marketing', stock: 'In Stock' },
];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-main py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Product Catalog</h1>
        <p className="text-[var(--text-muted)]">Browse our collection of premium digital products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--text-muted)] mb-4">{filtered.length} products</p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`}>
            <Card hover padding={false} className="group overflow-hidden">
              <div className="aspect-[4/3] bg-[var(--bg-elevated)] relative flex items-center justify-center text-[var(--text-muted)]">
                <Package size={40} strokeWidth={1} />
                <div className="absolute top-3 left-3">
                  <Badge variant="default">{product.category}</Badge>
                </div>
                {product.stock === 'Limited' && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning">Limited</Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
