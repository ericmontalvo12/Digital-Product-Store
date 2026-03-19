'use server';

import { db } from '@/lib/db';
import { addLicenseKeysSchema, addBatchInventorySchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';

export async function addLicenseKeys(formData: FormData) {
  const raw = {
    productId: formData.get('productId') as string,
    keys: (formData.get('keys') as string)?.split('\n').map(k => k.trim()).filter(Boolean) ?? [],
  };

  const parsed = addLicenseKeysSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const result = await db.licenseKey.createMany({
    data: parsed.data.keys.map(key => ({
      productId: parsed.data.productId,
      key,
      status: 'AVAILABLE' as const,
    })),
  });

  revalidatePath('/admin/inventory');
  return { success: true, count: result.count };
}

export async function addBatchInventory(formData: FormData) {
  const raw = {
    productId: formData.get('productId') as string,
    quantity: formData.get('quantity'),
    label: formData.get('label') as string || undefined,
  };

  const parsed = addBatchInventorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.inventoryBatch.create({
    data: {
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      remaining: parsed.data.quantity,
      label: parsed.data.label,
    },
  });

  revalidatePath('/admin/inventory');
  return { success: true };
}

export async function importLicenseKeysCSV(productId: string, csvContent: string) {
  const keys = csvContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('key'));

  if (keys.length === 0) {
    return { error: 'No valid keys found in CSV' };
  }

  const result = await db.licenseKey.createMany({
    data: keys.map(key => ({
      productId,
      key,
      status: 'AVAILABLE' as const,
    })),
  });

  revalidatePath('/admin/inventory');
  return { success: true, count: result.count };
}
