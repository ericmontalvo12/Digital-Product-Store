'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="label-uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius-md)] bg-[var(--bg-input)] border px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-[var(--transition-fast)] min-h-[100px] resize-y',
            error
              ? 'border-[var(--error)]'
              : 'border-[var(--border-default)] focus:border-[var(--accent)] hover:border-[var(--border-hover)]',
            'outline-none focus:ring-1 focus:ring-[var(--accent)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
