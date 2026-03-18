'use client';

import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 h-14 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-default)] flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent)]" />
        </button>
        <Link
          href="/admin/payments"
          className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Settings size={18} />
        </Link>
        <div className="ml-2 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center">
          <span className="text-xs font-medium text-[var(--text-secondary)]">A</span>
        </div>
      </div>
    </header>
  );
}
