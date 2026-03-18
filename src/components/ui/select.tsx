'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="label-uppercase">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors duration-[var(--transition-fast)] appearance-none',
            error
              ? 'border-[var(--error)]'
              : 'border-[var(--border-default)] focus:border-[var(--accent)] hover:border-[var(--border-hover)]',
            'outline-none focus:ring-1 focus:ring-[var(--accent)]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
