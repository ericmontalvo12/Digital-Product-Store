import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: March 2026</p>

        <Card className="prose-sm">
          <div className="space-y-6 text-[var(--text-secondary)] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using this store, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">2. Digital Products</h2>
              <p>All products sold are digital goods delivered electronically. Upon purchase, you receive a license to use the product according to its specific license terms. You do not receive ownership of the intellectual property.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">3. Payment</h2>
              <p>All payments are processed through Cash App Pay. Prices are listed in USD. You agree to pay the listed price for any products you purchase.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">4. Delivery</h2>
              <p>Digital products are delivered immediately after payment confirmation. Access is provided through download links, license keys, or private links depending on the product type.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">5. Prohibited Use</h2>
              <p>You may not redistribute, resell, or share purchased products unless explicitly permitted by the product license. Violation may result in revocation of access.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">6. Limitation of Liability</h2>
              <p>We provide products &quot;as is&quot; and make no warranties about their fitness for a particular purpose. Our liability is limited to the amount paid for the product.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
