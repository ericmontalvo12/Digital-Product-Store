import { cn } from '@/lib/utils';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)]', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[var(--bg-elevated)]">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[var(--border-default)]">{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn('hover:bg-[var(--bg-elevated)] transition-colors', className)}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn('px-4 py-3 text-left label-uppercase font-semibold', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('px-4 py-3 text-[var(--text-secondary)]', className)}>
      {children}
    </td>
  );
}
