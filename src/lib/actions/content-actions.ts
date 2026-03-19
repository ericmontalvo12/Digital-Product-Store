'use server';

import { db } from '@/lib/db';
import { updateContentSchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';

export async function updateContent(formData: FormData) {
  const raw: Record<string, string> = {};
  formData.forEach((value, key) => {
    raw[key] = value as string;
  });

  const parsed = updateContentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      await db.setting.upsert({
        where: { key: `content.${key}` },
        create: { key: `content.${key}`, value: value as unknown as object },
        update: { value: value as unknown as object },
      });
    }
  }

  revalidatePath('/admin/content');
  revalidatePath('/');
  return { success: true };
}

export async function getContentSettings(): Promise<Record<string, string>> {
  const settings = await db.setting.findMany({
    where: { key: { startsWith: 'content.' } },
  });

  const content: Record<string, string> = {};
  for (const s of settings) {
    content[s.key.replace('content.', '')] = s.value as string;
  }

  return content;
}
