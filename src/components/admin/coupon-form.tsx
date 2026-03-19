'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { createCoupon } from '@/lib/actions/coupon-actions';

interface CouponFormProps {
  onSuccess?: () => void;
}

export function CouponForm({ onSuccess }: CouponFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await createCoupon(formData);
      if (result.success) onSuccess?.();
      return result;
    },
    null
  );

  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <form action={formAction} className="space-y-4">
      {errors?._form && <Alert variant="error">{errors._form[0]}</Alert>}
      {state?.success && <Alert variant="success">Coupon created!</Alert>}

      <Input
        label="Coupon Code"
        name="code"
        placeholder="e.g. SUMMER25"
        error={errors?.code?.[0]}
      />
      <Select
        label="Discount Type"
        name="discountType"
        options={[
          { value: 'PERCENTAGE', label: 'Percentage' },
          { value: 'FIXED', label: 'Fixed Amount' },
        ]}
      />
      <Input
        label="Discount Value"
        name="discountValue"
        type="number"
        step="0.01"
        placeholder="0"
        error={errors?.discountValue?.[0]}
      />
      <Input
        label="Max Uses"
        name="maxUses"
        type="number"
        placeholder="Leave empty for unlimited"
      />
      <Input
        label="Min Order Value"
        name="minOrderValue"
        type="number"
        step="0.01"
        placeholder="0.00"
      />
      <Input label="Expires At" name="expiresAt" type="date" />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isPending}>Create Coupon</Button>
      </div>
    </form>
  );
}
