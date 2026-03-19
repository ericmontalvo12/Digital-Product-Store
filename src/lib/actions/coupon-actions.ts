'use server';

import { db } from '@/lib/db';
import { createCouponSchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';

export async function createCoupon(formData: FormData) {
  const raw = {
    code: formData.get('code') as string,
    discountType: formData.get('discountType') as string,
    discountValue: formData.get('discountValue'),
    minOrderValue: formData.get('minOrderValue') || null,
    maxUses: formData.get('maxUses') || null,
    expiresAt: formData.get('expiresAt') || null,
  };

  const parsed = createCouponSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.coupon.create({
      data: {
        code: parsed.data.code,
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue,
        minOrderValue: parsed.data.minOrderValue ?? undefined,
        maxUses: parsed.data.maxUses ?? undefined,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
      },
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: { code: ['This coupon code already exists'] } };
    }
    return { error: { _form: ['Failed to create coupon'] } };
  }
}

export async function toggleCouponActive(id: string) {
  const coupon = await db.coupon.findUniqueOrThrow({ where: { id } });
  await db.coupon.update({
    where: { id },
    data: { active: !coupon.active },
  });
  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: string) {
  await db.coupon.delete({ where: { id } });
  revalidatePath('/admin/coupons');
  return { success: true };
}
