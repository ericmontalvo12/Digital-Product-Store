'use client';

import { cn } from '@/lib/utils';

export type PaymentMethodType = 'cashapp' | 'coinbase' | 'balance';

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  balanceAmount?: number;
  orderTotal: number;
  showBalance?: boolean;
}

const METHODS: { id: PaymentMethodType; label: string; description: string; color: string }[] = [
  {
    id: 'cashapp',
    label: 'Cash App',
    description: 'Pay with Cash App',
    color: '#00D632',
  },
  {
    id: 'coinbase',
    label: 'Coinbase Commerce',
    description: 'Pay with crypto or Cash App via Coinbase',
    color: '#0052FF',
  },
  {
    id: 'balance',
    label: 'Account Balance',
    description: 'Pay from your wallet balance',
    color: '#8B5CF6',
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
  balanceAmount = 0,
  orderTotal,
  showBalance = true,
}: PaymentMethodSelectorProps) {
  const insufficientBalance = balanceAmount < orderTotal;

  return (
    <div className="space-y-2">
      {METHODS.map((method) => {
        if (method.id === 'balance' && !showBalance) return null;

        const isBalance = method.id === 'balance';
        const disabled = isBalance && insufficientBalance;
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect(method.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] border-2 transition-all text-left cursor-pointer',
              isSelected
                ? 'border-[var(--accent)] bg-[var(--bg-elevated)]'
                : 'border-[var(--border-default)] hover:border-[var(--border-hover)]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${method.color}20` }}
            >
              {method.id === 'cashapp' && <CashAppIcon color={method.color} />}
              {method.id === 'coinbase' && <CoinbaseIcon color={method.color} />}
              {method.id === 'balance' && <WalletIcon color={method.color} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{method.label}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {isBalance
                  ? insufficientBalance
                    ? `Insufficient balance ($${balanceAmount.toFixed(2)} available)`
                    : `$${balanceAmount.toFixed(2)} available`
                  : method.description}
              </p>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                isSelected ? 'border-[var(--accent)]' : 'border-[var(--border-default)]'
              )}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CashAppIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M23.59 3.47A5.1 5.1 0 0 0 20.53.41C19.49.05 18.14 0 15.41 0H8.59C5.86 0 4.51.05 3.47.41A5.1 5.1 0 0 0 .41 3.47C.05 4.51 0 5.86 0 8.59v6.82c0 2.73.05 4.08.41 5.12a5.1 5.1 0 0 0 3.06 3.06c1.04.36 2.39.41 5.12.41h6.82c2.73 0 4.08-.05 5.12-.41a5.1 5.1 0 0 0 3.06-3.06c.36-1.04.41-2.39.41-5.12V8.59c0-2.73-.05-4.08-.41-5.12zM17.42 7.30l-.93.93a.5.5 0 0 1-.62.07 5.4 5.4 0 0 0-2.84-.8c-1.2 0-2.1.42-2.1 1.32 0 .87.81 1.2 2.28 1.56 2.28.56 4.06 1.2 4.06 3.54 0 2.46-2.1 3.75-4.68 3.87v1.14a.5.5 0 0 1-.5.5h-1.2a.5.5 0 0 1-.5-.5v-1.2a7 7 0 0 1-3.72-1.32.5.5 0 0 1-.06-.73l.93-.93a.5.5 0 0 1 .65-.06 5.8 5.8 0 0 0 3.24 1.02c1.44 0 2.34-.54 2.34-1.5 0-.93-.78-1.26-2.46-1.68-2.22-.54-3.9-1.26-3.9-3.42 0-2.22 1.86-3.57 4.32-3.69V4.57a.5.5 0 0 1 .5-.5h1.2a.5.5 0 0 1 .5.5v1.14a6.2 6.2 0 0 1 3.12.96.5.5 0 0 1 .07.73z" />
    </svg>
  );
}

function CoinbaseIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.636 0 8.4 3.764 8.4 8.4 0 4.636-3.764 8.4-8.4 8.4-4.636 0-8.4-3.764-8.4-8.4 0-4.636 3.764-8.4 8.4-8.4zm-2.4 5.4a3 3 0 1 0 0 6 3 3 0 0 0 3-3h3a6 6 0 1 1-6-6v3z" />
    </svg>
  );
}

function WalletIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  );
}
