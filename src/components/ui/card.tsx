import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className, hover = false, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)]',
        hover && 'transition-all duration-[var(--transition-base)] hover:border-[var(--border-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
        padding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}>
      {children}
    </h3>
  );
}
