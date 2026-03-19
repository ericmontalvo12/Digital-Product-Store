'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface CatalogFiltersProps {
  categories: string[];
  activeCategory?: string;
  initialSearch?: string;
}

export function CatalogFilters({ categories, activeCategory, initialSearch }: CatalogFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch ?? '');

  const navigate = useCallback((category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    router.push(`/catalog?${params.toString()}`);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(activeCategory, searchQuery || undefined);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] pl-9 pr-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
        />
      </form>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => navigate(undefined, searchQuery || undefined)}
          className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            !activeCategory
              ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
              : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(cat, searchQuery || undefined)}
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
  );
}
