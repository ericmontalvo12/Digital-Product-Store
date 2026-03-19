'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { CouponForm } from '@/components/admin/coupon-form';
import { Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

export default function AdminCouponsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/coupons');
    if (res.ok) {
      const data = await res.json();
      setCoupons(data.coupons);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Promos</h1>
          <p className="text-sm text-[var(--text-muted)]">{coupons.length} coupons</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Create Coupon
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[var(--text-muted)]">Loading...</div>
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No coupons yet"
          description="Create discount codes to boost sales."
          action={<Button onClick={() => setCreateOpen(true)}>Create Coupon</Button>}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono text-sm font-medium text-[var(--text-primary)]">{coupon.code}</TableCell>
                <TableCell>{coupon.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed'}</TableCell>
                <TableCell className="font-medium text-[var(--text-primary)]">
                  {coupon.discountType === 'PERCENTAGE'
                    ? `${Number(coupon.discountValue)}%`
                    : formatCurrency(Number(coupon.discountValue))}
                </TableCell>
                <TableCell>{coupon.usedCount}/{coupon.maxUses ?? '∞'}</TableCell>
                <TableCell>{coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}</TableCell>
                <TableCell>
                  <Badge variant={coupon.active ? 'success' : 'default'}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Coupon" size="sm">
        <CouponForm onSuccess={() => { setCreateOpen(false); fetchCoupons(); }} />
      </Modal>
    </div>
  );
}
