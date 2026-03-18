'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const coupons = [
  { id: '1', code: 'WELCOME20', type: 'Percentage', value: '20%', uses: '12/50', active: true, expires: 'Apr 30, 2026' },
  { id: '2', code: 'FLAT10', type: 'Fixed', value: '$10.00', uses: '8/∞', active: true, expires: 'Never' },
  { id: '3', code: 'SUMMER25', type: 'Percentage', value: '25%', uses: '45/100', active: false, expires: 'Jun 30, 2026' },
];

export default function AdminCouponsPage() {
  const [createOpen, setCreateOpen] = useState(false);

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Uses</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono text-sm font-medium text-[var(--text-primary)]">{coupon.code}</TableCell>
              <TableCell>{coupon.type}</TableCell>
              <TableCell className="font-medium text-[var(--text-primary)]">{coupon.value}</TableCell>
              <TableCell>{coupon.uses}</TableCell>
              <TableCell>{coupon.expires}</TableCell>
              <TableCell>
                <Badge variant={coupon.active ? 'success' : 'default'}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <button className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer">
                  <MoreHorizontal size={16} className="text-[var(--text-muted)]" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Coupon" size="sm">
        <div className="space-y-4">
          <Input label="Coupon Code" placeholder="e.g. SUMMER25" />
          <Select
            label="Discount Type"
            options={[
              { value: 'PERCENTAGE', label: 'Percentage' },
              { value: 'FIXED', label: 'Fixed Amount' },
            ]}
          />
          <Input label="Discount Value" type="number" placeholder="0" />
          <Input label="Max Uses" type="number" placeholder="Leave empty for unlimited" />
          <Input label="Min Order Value" type="number" placeholder="0.00" />
          <Input label="Expires At" type="date" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
