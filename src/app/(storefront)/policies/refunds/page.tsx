import { Card } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Refund Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: March 2026</p>

        <Card className="prose-sm">
          <div className="space-y-6 text-[var(--text-secondary)] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Refund Eligibility</h2>
              <p>We offer refunds for eligible purchases within 14 days of the original purchase date. Due to the digital nature of our products, refunds are evaluated on a case-by-case basis.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">How to Request a Refund</h2>
              <p>To request a refund, contact our support team at support@digitalstore.com with your order number and reason for the refund. We aim to respond within 24-48 hours.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Refund Process</h2>
              <p>Approved refunds are processed through the original payment method (Cash App Pay). Refunds typically appear within 3-5 business days. Upon refund, access to the digital product will be revoked.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Non-Refundable Items</h2>
              <p>License keys that have been activated or redeemed are generally non-refundable. Products purchased with a coupon or during a promotional event may have different refund terms.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
