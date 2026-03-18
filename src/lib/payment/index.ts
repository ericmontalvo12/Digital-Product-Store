import type { PaymentAdapter } from './types';
import { CashAppPayAdapter } from './cashapp-adapter';
import { AfterpayAdapter } from './afterpay-adapter';

export type { PaymentAdapter } from './types';
export { CashAppPayAdapter } from './cashapp-adapter';
export { AfterpayAdapter } from './afterpay-adapter';
export * from './types';

type AdapterType = 'cashapp' | 'afterpay';

let adapterInstance: PaymentAdapter | null = null;

/**
 * Get the active payment adapter.
 * Defaults to Cash App Pay, falls back to Afterpay if configured.
 */
export function getPaymentAdapter(): PaymentAdapter {
  if (adapterInstance) return adapterInstance;

  const adapterType = (process.env.PAYMENT_ADAPTER ?? 'cashapp') as AdapterType;

  switch (adapterType) {
    case 'afterpay':
      adapterInstance = new AfterpayAdapter();
      break;
    case 'cashapp':
    default:
      adapterInstance = new CashAppPayAdapter();
      break;
  }

  return adapterInstance;
}

/** Reset the adapter (useful for testing or config changes). */
export function resetPaymentAdapter(): void {
  adapterInstance = null;
}
