import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)]',
  success: 'bg-[var(--success-muted)] text-[var(--success)] border-transparent',
  error: 'bg-[var(--error-muted)] text-[var(--error)] border-transparent',
  warning: 'bg-[var(--warning-muted)] text-[var(--warning)] border-transparent',
  info: 'bg-[var(--info-muted)] text-[var(--info)] border-transparent',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-[var(--radius-full)] text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
