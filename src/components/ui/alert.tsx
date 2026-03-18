import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  className?: string;
}

const variants: Record<AlertVariant, { bg: string; border: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-[var(--success-muted)]',
    border: 'border-[var(--success)]',
    icon: <CheckCircle size={18} className="text-[var(--success)]" />,
  },
  error: {
    bg: 'bg-[var(--error-muted)]',
    border: 'border-[var(--error)]',
    icon: <AlertCircle size={18} className="text-[var(--error)]" />,
  },
  warning: {
    bg: 'bg-[var(--warning-muted)]',
    border: 'border-[var(--warning)]',
    icon: <AlertTriangle size={18} className="text-[var(--warning)]" />,
  },
  info: {
    bg: 'bg-[var(--info-muted)]',
    border: 'border-[var(--info)]',
    icon: <Info size={18} className="text-[var(--info)]" />,
  },
};

export function Alert({ children, variant = 'info', title, className }: AlertProps) {
  const v = variants[variant];
  return (
    <div
      className={cn(
        'flex gap-3 rounded-[var(--radius-md)] border-l-4 p-4',
        v.bg,
        v.border,
        className
      )}
    >
      <div className="mt-0.5 shrink-0">{v.icon}</div>
      <div>
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm text-[var(--text-secondary)]">{children}</div>
      </div>
    </div>
  );
}
