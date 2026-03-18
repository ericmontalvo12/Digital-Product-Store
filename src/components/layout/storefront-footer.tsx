import Link from 'next/link';

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[var(--border-default)] mt-20">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
                <span className="text-[var(--text-inverse)] font-bold text-sm">DP</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Digital Store</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Premium digital products delivered instantly. Pay securely with Cash App.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-uppercase mb-4">Shop</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/catalog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                All Products
              </Link>
              <Link href="/catalog?featured=true" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Featured
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="label-uppercase mb-4">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                FAQ
              </Link>
              <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                My Account
              </Link>
              <Link href="/dashboard/orders" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Order History
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="label-uppercase mb-4">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/policies/privacy" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/policies/terms" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Terms of Service
              </Link>
              <Link href="/policies/refunds" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-[var(--border-default)] mt-8 pt-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Digital Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
