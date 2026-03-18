import { Card } from './card';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="label-uppercase">{title}</span>
        {Icon && (
          <div className="rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] p-2">
            <Icon size={16} className="text-[var(--text-muted)]" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-medium mb-1',
              changeType === 'positive' && 'text-[var(--success)]',
              changeType === 'negative' && 'text-[var(--error)]',
              changeType === 'neutral' && 'text-[var(--text-muted)]'
            )}
          >
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
