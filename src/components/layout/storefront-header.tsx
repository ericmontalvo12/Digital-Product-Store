'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';

export function StorefrontHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-default)]">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
              <span className="text-[var(--text-inverse)] font-bold text-sm">DP</span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">Digital Store</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Catalog
            </Link>
            <Link href="/faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="hidden sm:flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-48 rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              >
                <Search size={18} />
              </button>
            )}

            {/* Account */}
            <Link
              href="/dashboard"
              className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <User size={18} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--border-default)] pt-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                Catalog
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                My Account
              </Link>
              <div className="px-3 pt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
