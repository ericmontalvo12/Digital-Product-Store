import Link from 'next/link';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  return (
    <div className="container-main py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--success-muted)] mb-6">
          <CheckCircle size={32} className="text-[var(--success)]" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">Payment Successful!</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Thank you for your purchase. Your digital products are ready for download.
        </p>

        <Card className="mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Download size={18} className="text-[var(--accent)]" />
            <span className="font-semibold">Your Downloads</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Access your purchased products from your dashboard. A confirmation email has been sent to your email address with download links.
          </p>
          <Link href="/dashboard/downloads">
            <Button variant="secondary" className="w-full">
              Go to Downloads
              <ArrowRight size={14} />
            </Button>
          </Link>
        </Card>

        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm">View Order History</Button>
          </Link>
          <Link href="/catalog">
            <Button variant="ghost" size="sm">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
