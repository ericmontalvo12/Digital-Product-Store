'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-'));
  };

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ChevronLeft size={14} />
        Back to Products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Save as Draft</Button>
          <Button>Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input label="Title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Product title" />
              <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="product-slug" hint="URL-friendly identifier" />
              <Textarea label="Description" placeholder="Describe your product..." />
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
              <Input label="Price" type="number" placeholder="0.00" />
              <Input label="Compare Price" type="number" placeholder="0.00" hint="Original price for showing discount" />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Organization</h2>
            <div className="space-y-4">
              <Select
                label="Category"
                options={[
                  { value: 'design', label: 'Design' },
                  { value: 'development', label: 'Development' },
                  { value: 'photography', label: 'Photography' },
                  { value: 'business', label: 'Business' },
                  { value: 'marketing', label: 'Marketing' },
                ]}
                placeholder="Select category"
              />
              <Input label="Tags" placeholder="Comma-separated tags" />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">Inventory</h2>
            <div className="space-y-4">
              <Select
                label="Stock Mode"
                options={[
                  { value: 'UNLIMITED', label: 'Unlimited' },
                  { value: 'QUANTITY', label: 'Quantity-based' },
                  { value: 'LICENSE_KEY', label: 'License Keys' },
                ]}
              />
              <Select
                label="Delivery Type"
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
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--accent)]" />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--accent)]" />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
