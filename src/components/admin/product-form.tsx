'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Upload } from 'lucide-react';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { slugify } from '@/lib/utils';
import { useState } from 'react';

interface ProductFormProps {
  product?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    category: string | null;
    tags: string[];
    stockMode: string;
    deliveryType: string;
    published: boolean;
    featured: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const isEdit = !!product;
  const action = isEdit ? updateProduct : createProduct;
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    null
  );
  const [title, setTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');

  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <form action={formAction}>
      {isEdit && <input type="hidden" name="id" value={product.id} />}

      {errors?._form && (
        <Alert variant="error" className="mb-6">{errors._form[0]}</Alert>
      )}

      {state?.success && (
        <Alert variant="success" className="mb-6">
          Product {isEdit ? 'updated' : 'created'} successfully!
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Title"
                name="title"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (!isEdit) setSlug(slugify(e.target.value));
                }}
                error={errors?.title?.[0]}
              />
              <Input
                label="Slug"
                name="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                hint="URL-friendly identifier"
                error={errors?.slug?.[0]}
              />
              <Textarea
                label="Description"
                name="description"
                defaultValue={product?.description ?? ''}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Media</h2>
            <div className="border-2 border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 text-center hover:border-[var(--border-hover)] transition-colors">
              <Upload size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)] mb-1">Drag and drop images or click to browse</p>
              <p className="text-xs text-[var(--text-muted)]">PNG, JPG, GIF up to 10MB</p>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Digital Assets</h2>
            <div className="border-2 border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 text-center hover:border-[var(--border-hover)] transition-colors">
              <Upload size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)] mb-1">Upload the digital product files</p>
              <p className="text-xs text-[var(--text-muted)]">ZIP, PDF, or any file type up to 500MB</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">Pricing</h2>
            <div className="space-y-4">
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price?.toString() ?? ''}
                error={errors?.price?.[0]}
              />
              <Input
                label="Compare Price"
                name="comparePrice"
                type="number"
                step="0.01"
                defaultValue={product?.comparePrice?.toString() ?? ''}
                hint="Original price for showing discount"
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Organization</h2>
            <div className="space-y-4">
              <Select
                label="Category"
                name="category"
                defaultValue={product?.category ?? ''}
                options={[
                  { value: 'Design', label: 'Design' },
                  { value: 'Development', label: 'Development' },
                  { value: 'Photography', label: 'Photography' },
                  { value: 'Business', label: 'Business' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Education', label: 'Education' },
                ]}
                placeholder="Select category"
              />
              <Input
                label="Tags"
                name="tags"
                defaultValue={product?.tags?.join(', ') ?? ''}
                placeholder="Comma-separated tags"
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Inventory</h2>
            <div className="space-y-4">
              <Select
                label="Stock Mode"
                name="stockMode"
                defaultValue={product?.stockMode ?? 'UNLIMITED'}
                options={[
                  { value: 'UNLIMITED', label: 'Unlimited' },
                  { value: 'QUANTITY', label: 'Quantity-based' },
                  { value: 'LICENSE_KEY', label: 'License Keys' },
                ]}
              />
              <Select
                label="Delivery Type"
                name="deliveryType"
                defaultValue={product?.deliveryType ?? 'DOWNLOAD'}
                options={[
                  { value: 'DOWNLOAD', label: 'Download' },
                  { value: 'LICENSE_KEY', label: 'License Key' },
                  { value: 'PRIVATE_LINK', label: 'Private Link' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={product?.published ?? false}
                  className="w-4 h-4 rounded accent-[var(--accent)]"
                />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={product?.featured ?? false}
                  className="w-4 h-4 rounded accent-[var(--accent)]"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" loading={isPending}>
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
