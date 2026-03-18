'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const faqs = [
  {
    category: 'Payments',
    questions: [
      {
        q: 'How do I pay with Cash App?',
        a: 'At checkout, click the "Pay with Cash App" button. On desktop, scan the QR code with your Cash App. On mobile, you\'ll be redirected to the Cash App to approve payment.',
      },
      {
        q: 'Is my payment secure?',
        a: 'Yes. We use Cash App Pay for all transactions. Your payment details are handled directly by Cash App — we never see or store your financial information.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Yes. We offer refunds for eligible purchases within 14 days. Please review our refund policy for full details.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'How do I access my purchased products?',
        a: 'After payment is confirmed, your products will be available in your dashboard under "Downloads". You\'ll also receive an email with download links.',
      },
      {
        q: 'Do I get updates for purchased products?',
        a: 'Yes. All product updates are available for free to existing customers. You\'ll find the latest version in your downloads.',
      },
      {
        q: 'What is a license key product?',
        a: 'Some products are delivered as license keys that you can activate in the corresponding software or platform.',
      },
    ],
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'Do I need an account to purchase?',
        a: 'You can checkout as a guest with just your email. However, creating an account lets you easily access your downloads and order history.',
      },
      {
        q: 'How can I contact support?',
        a: 'You can reach our support team through the support page or by emailing support@digitalstore.com.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Frequently Asked Questions</h1>
          <p className="text-[var(--text-muted)]">Find answers to common questions about our products and services.</p>
        </div>

        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="label-uppercase mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.questions.map((item) => {
                  const key = `${section.category}-${item.q}`;
                  const isOpen = openItem === key;
                  return (
                    <Card key={key} padding={false}>
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                      >
                        <span className="font-medium text-sm pr-4">{item.q}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'shrink-0 text-[var(--text-muted)] transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 text-center">
          <MessageCircle size={24} className="mx-auto mb-3 text-[var(--accent)]" />
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Our support team is here to help.
          </p>
          <Button variant="secondary">Contact Support</Button>
        </Card>
      </div>
    </div>
  );
}
