'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EditProductPage() {
  const params = useParams();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ChevronLeft size={14} />
        Back to Products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <Badge variant="success">Published</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm">
            <Trash2 size={14} />
            Delete
          </Button>
          <Button variant="secondary">Save Draft</Button>
          <Button>Update</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input label="Title" defaultValue="Premium UI Kit" />
              <Input label="Slug" defaultValue="premium-ui-kit" />
              <Textarea label="Description" defaultValue="A comprehensive UI kit featuring over 200 carefully crafted components." />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Media</h2>
            <div className="border-2 border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 text-center">
              <Upload size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">Drag and drop or click to upload</p>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Digital Assets</h2>
            <div className="border-2 border-dashed border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 text-center">
              <Upload size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">Upload product files</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">Pricing</h2>
            <div className="space-y-4">
              <Input label="Price" type="number" defaultValue="49.00" />
              <Input label="Compare Price" type="number" defaultValue="79.00" />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Organization</h2>
            <div className="space-y-4">
              <Select
                label="Category"
                defaultValue="design"
                options={[
                  { value: 'design', label: 'Design' },
                  { value: 'development', label: 'Development' },
                  { value: 'photography', label: 'Photography' },
                  { value: 'business', label: 'Business' },
                  { value: 'marketing', label: 'Marketing' },
                ]}
              />
              <Input label="Tags" defaultValue="UI, Components, Figma" />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Inventory</h2>
            <div className="space-y-4">
              <Select
                label="Stock Mode"
                defaultValue="UNLIMITED"
                options={[
                  { value: 'UNLIMITED', label: 'Unlimited' },
                  { value: 'QUANTITY', label: 'Quantity-based' },
                  { value: 'LICENSE_KEY', label: 'License Keys' },
                ]}
              />
              <Select
                label="Delivery Type"
                defaultValue="DOWNLOAD"
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
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[var(--accent)]" />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[var(--accent)]" />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
