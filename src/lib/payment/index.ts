import type { PaymentAdapter } from './types';
import { CashAppPayAdapter } from './cashapp-adapter';
import { AfterpayAdapter } from './afterpay-adapter';
import { CoinbaseCommerceAdapter } from './coinbase-adapter';

export type { PaymentAdapter } from './types';
export { CashAppPayAdapter } from './cashapp-adapter';
export { AfterpayAdapter } from './afterpay-adapter';
export { CoinbaseCommerceAdapter } from './coinbase-adapter';
export * from './types';

export type AdapterType = 'cashapp' | 'afterpay' | 'coinbase';

const adapterInstances = new Map<AdapterType, PaymentAdapter>();

/**
 * Get a specific payment adapter by type.
 * If no type is provided, returns the default adapter from PAYMENT_ADAPTER env var.
 */
export function getPaymentAdapter(type?: AdapterType): PaymentAdapter {
  const adapterType = type ?? (process.env.PAYMENT_ADAPTER ?? 'cashapp') as AdapterType;

  const existing = adapterInstances.get(adapterType);
  if (existing) return existing;

  let adapter: PaymentAdapter;
  switch (adapterType) {
    case 'afterpay':
      adapter = new AfterpayAdapter();
      break;
    case 'coinbase':
      adapter = new CoinbaseCommerceAdapter();
      break;
    case 'cashapp':
    default:
      adapter = new CashAppPayAdapter();
      break;
  }

  adapterInstances.set(adapterType, adapter);
  return adapter;
}

/** Reset all adapters (useful for testing or config changes). */
export function resetPaymentAdapter(): void {
  adapterInstances.clear();
}
