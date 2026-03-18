'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  CreditCard,
  Tag,
  FileText,
  HeadphonesIcon,
  ClipboardList,
  Settings,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/support', label: 'Support', icon: HeadphonesIcon },
  { href: '/admin/audit', label: 'Audit Logs', icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col z-30">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--border-default)]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center">
            <span className="text-[var(--text-inverse)] font-bold text-xs">DP</span>
          </div>
          <div>
            <span className="font-bold text-sm">Digital Store</span>
            <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors',
                  isActive
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[var(--border-default)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
