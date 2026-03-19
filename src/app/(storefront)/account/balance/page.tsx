'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaymentMethodSelector, type PaymentMethodType } from '@/components/checkout/payment-method-selector';
import { PaymentStatus } from '@/components/checkout/payment-status';
import { formatCurrency } from '@/lib/utils';
import type { PaymentState } from '@/lib/payment/types';

interface BalanceTransaction {
  id: string;
  type: 'TOPUP' | 'PURCHASE' | 'REFUND';
  amount: number;
  description: string | null;
  provider: string | null;
  createdAt: string;
}

export default function BalancePage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpMethod, setTopUpMethod] = useState<PaymentMethodType>('cashapp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    status: PaymentState;
    qrCodeUrl?: string;
  } | null>(null);

  // TODO: Replace with actual user ID from auth session
  const userId = '';

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/balance?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch { /* silent */ }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/balance/transactions?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
      }
    } catch { /* silent */ }
  }, [userId]);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0 || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/balance/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: '', // TODO: from auth session
          amount,
          provider: topUpMethod === 'balance' ? 'cashapp' : topUpMethod,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Top-up failed' }));
        throw new Error(err.error || 'Top-up failed');
      }

      const data = await res.json();

      if (data.redirectUrl && topUpMethod === 'coinbase') {
        setPaymentData({
          paymentId: data.paymentId,
          status: 'awaiting_customer_approval',
        });
        window.open(data.redirectUrl, '_blank');
      } else {
        setPaymentData({
          paymentId: data.paymentId,
          status: 'awaiting_customer_approval',
          qrCodeUrl: data.qrCodeUrl,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusChange = (status: PaymentState) => {
    if (status === 'paid') {
      setPaymentData(null);
      setTopUpAmount('');
      fetchBalance();
      fetchTransactions();
    }
  };

  const presetAmounts = [5, 10, 25, 50, 100];

  return (
    <div className="container-main py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to Store
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Account Balance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Top Up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Balance */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#8B5CF620]">
                <Wallet size={24} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Current Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
              </div>
            </div>
          </Card>

          {/* Top Up Form */}
          {paymentData ? (
            <PaymentStatus
              paymentId={paymentData.paymentId}
              initialStatus={paymentData.status}
              qrCodeUrl={paymentData.qrCodeUrl}
              onStatusChange={handlePaymentStatusChange}
            />
          ) : (
            <Card>
              <h2 className="font-semibold mb-4">Add Funds</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className={`px-4 py-2 rounded-[var(--radius-md)] border text-sm font-medium transition-all cursor-pointer ${
                      topUpAmount === amt.toString()
                        ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--accent)]'
                        : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <Input
                label="Custom Amount"
                type="number"
                min="1"
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
              />

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Payment Method</p>
                <PaymentMethodSelector
                  selected={topUpMethod}
                  onSelect={setTopUpMethod}
                  orderTotal={parseFloat(topUpAmount) || 0}
                  showBalance={false}
                />
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--error-muted)] text-[var(--error)] text-sm">
                  {error}
                </div>
              )}

              <Button
                className="w-full mt-4"
                onClick={handleTopUp}
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0 || loading}
              >
                {loading ? 'Processing...' : `Add ${topUpAmount ? formatCurrency(parseFloat(topUpAmount)) : '$0.00'} to Balance`}
              </Button>
            </Card>
          )}
        </div>

        {/* Right: Transaction History */}
        <div>
          <Card>
            <h2 className="font-semibold mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-[var(--border-default)] last:border-0">
                    <div className={`p-1.5 rounded-full ${
                      tx.type === 'TOPUP' ? 'bg-[var(--success-muted)] text-[var(--success)]' :
                      tx.type === 'REFUND' ? 'bg-[var(--info-muted)] text-[var(--info)]' :
                      'bg-[var(--error-muted)] text-[var(--error)]'
                    }`}>
                      {tx.type === 'TOPUP' ? <ArrowUpCircle size={14} /> :
                       tx.type === 'REFUND' ? <RefreshCw size={14} /> :
                       <ArrowDownCircle size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description || tx.type}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
