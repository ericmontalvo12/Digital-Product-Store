'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

const CONTENT_FIELDS = [
  { section: 'Hero Section', fields: [
    { key: 'heroBadge', label: 'Badge Text', default: 'Cash App Pay Checkout', type: 'input' },
    { key: 'heroHeading', label: 'Heading', default: 'Premium Digital Products Delivered Instantly', type: 'input' },
    { key: 'heroSubheading', label: 'Subheading', default: 'Discover high-quality digital assets, tools, and resources. Purchase securely with Cash App Pay and get instant access.', type: 'textarea' },
    { key: 'heroPrimaryCta', label: 'Primary CTA Text', default: 'Browse Catalog', type: 'input' },
    { key: 'heroPrimaryLink', label: 'Primary CTA Link', default: '/catalog', type: 'input' },
    { key: 'heroSecondaryCta', label: 'Secondary CTA Text', default: 'Learn More', type: 'input' },
    { key: 'heroSecondaryLink', label: 'Secondary CTA Link', default: '/faq', type: 'input' },
  ]},
  { section: 'CTA Section', fields: [
    { key: 'ctaHeading', label: 'Heading', default: 'Ready to Get Started?', type: 'input' },
    { key: 'ctaDescription', label: 'Description', default: 'Browse our collection and pay securely with Cash App Pay.', type: 'textarea' },
    { key: 'ctaButtonText', label: 'Button Text', default: 'Shop Now', type: 'input' },
    { key: 'ctaButtonLink', label: 'Button Link', default: '/catalog', type: 'input' },
  ]},
  { section: 'Store Information', fields: [
    { key: 'storeName', label: 'Store Name', default: 'Digital Store', type: 'input' },
    { key: 'supportEmail', label: 'Support Email', default: 'support@digitalstore.com', type: 'input' },
    { key: 'footerDescription', label: 'Footer Description', default: 'Premium digital products delivered instantly. Pay securely with Cash App.', type: 'textarea' },
  ]},
] as const;

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(data => {
        setValues(data.content ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getValue = (key: string, defaultValue: string) => {
    return values[key] ?? defaultValue;
  };

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save content.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Content</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage your storefront content</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'error'} title={message.type === 'success' ? 'Saved' : 'Error'} className="mb-6">
          {message.text}
        </Alert>
      )}

      <div className="space-y-6">
        {CONTENT_FIELDS.map((section) => (
          <Card key={section.section}>
            <CardHeader>
              <CardTitle>{section.section}</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {section.fields.map((field) => (
                field.type === 'textarea' ? (
                  <Textarea
                    key={field.key}
                    label={field.label}
                    value={getValue(field.key, field.default)}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                ) : (
                  <Input
                    key={field.key}
                    label={field.label}
                    value={getValue(field.key, field.default)}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                )
              ))}
            </div>
          </Card>
        ))}

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
      </div>
    </div>
  );
}
