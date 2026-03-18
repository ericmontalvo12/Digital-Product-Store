'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="label-uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-[var(--transition-fast)]',
            error
              ? 'border-[var(--error)] focus:border-[var(--error)]'
              : 'border-[var(--border-default)] focus:border-[var(--accent)] hover:border-[var(--border-hover)]',
            'outline-none focus:ring-1 focus:ring-[var(--accent)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
