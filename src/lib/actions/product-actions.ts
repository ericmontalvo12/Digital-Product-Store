'use server';

import { db } from '@/lib/db';
import { createProductSchema, updateProductSchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

export async function createProduct(formData: FormData) {
  const raw = {
    title: formData.get('title') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('title') as string),
    description: formData.get('description') as string,
    price: formData.get('price'),
    comparePrice: formData.get('comparePrice') || null,
    category: formData.get('category') as string,
    tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
    stockMode: formData.get('stockMode') as string || 'UNLIMITED',
    deliveryType: formData.get('deliveryType') as string || 'DOWNLOAD',
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
  };

  const parsed = createProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const product = await db.product.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        price: parsed.data.price,
        comparePrice: parsed.data.comparePrice ?? undefined,
        category: parsed.data.category,
        tags: parsed.data.tags ?? [],
        stockMode: parsed.data.stockMode,
        deliveryType: parsed.data.deliveryType,
        published: parsed.data.published,
        featured: parsed.data.featured,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, productId: product.id };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: { slug: ['This slug is already taken'] } };
    }
    return { error: { _form: ['Failed to create product'] } };
  }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const raw = {
    id,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: formData.get('price'),
    comparePrice: formData.get('comparePrice') || null,
    category: formData.get('category') as string,
    tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
    stockMode: formData.get('stockMode') as string,
    deliveryType: formData.get('deliveryType') as string,
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
  };

  const parsed = updateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.product.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        price: parsed.data.price,
        comparePrice: parsed.data.comparePrice ?? undefined,
        category: parsed.data.category,
        tags: parsed.data.tags,
        stockMode: parsed.data.stockMode,
        deliveryType: parsed.data.deliveryType,
        published: parsed.data.published,
        featured: parsed.data.featured,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    return { error: { _form: ['Failed to update product'] } };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true };
  } catch {
    return { error: 'Failed to delete product' };
  }
}

export async function toggleProductPublished(id: string) {
  const product = await db.product.findUniqueOrThrow({ where: { id } });
  await db.product.update({
    where: { id },
    data: { published: !product.published },
  });
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function toggleProductFeatured(id: string) {
  const product = await db.product.findUniqueOrThrow({ where: { id } });
  await db.product.update({
    where: { id },
    data: { featured: !product.featured },
  });
  revalidatePath('/admin/products');
  revalidatePath('/');
}
