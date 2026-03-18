'use client';

import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Content</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage your storefront content</p>
        </div>
        <Button>
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Badge Text" defaultValue="Cash App Pay Checkout" />
            <Input label="Heading" defaultValue="Premium Digital Products Delivered Instantly" />
            <Textarea label="Subheading" defaultValue="Discover high-quality digital assets, tools, and resources. Purchase securely with Cash App Pay and get instant access." />
            <Input label="Primary CTA Text" defaultValue="Browse Catalog" />
            <Input label="Primary CTA Link" defaultValue="/catalog" />
            <Input label="Secondary CTA Text" defaultValue="Learn More" />
            <Input label="Secondary CTA Link" defaultValue="/faq" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Featured products are automatically shown on the homepage. Toggle the &quot;Featured&quot; flag on individual products to control what appears here.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CTA Section</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Heading" defaultValue="Ready to Get Started?" />
            <Textarea label="Description" defaultValue="Browse our collection and pay securely with Cash App Pay." />
            <Input label="Button Text" defaultValue="Shop Now" />
            <Input label="Button Link" defaultValue="/catalog" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Store Name" defaultValue="Digital Store" />
            <Input label="Support Email" defaultValue="support@digitalstore.com" />
            <Textarea label="Footer Description" defaultValue="Premium digital products delivered instantly. Pay securely with Cash App." />
          </div>
        </Card>
      </div>
    </div>
  );
}
