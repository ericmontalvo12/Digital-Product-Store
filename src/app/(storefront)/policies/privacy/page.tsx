import { Card } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: March 2026</p>

        <Card className="prose-sm">
          <div className="space-y-6 text-[var(--text-secondary)] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">1. Information We Collect</h2>
              <p>We collect information you provide when making a purchase, including your email address, name, and payment information processed through Cash App Pay. We do not store your financial details directly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">2. How We Use Your Information</h2>
              <p>We use your information to process orders, deliver digital products, send order confirmations, and provide customer support. We may also use anonymized data to improve our services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">3. Payment Processing</h2>
              <p>All payments are processed through Cash App Pay. We do not have access to your Cash App account details, card numbers, or bank information. Please refer to Cash App&apos;s privacy policy for information on how they handle your payment data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. All data is transmitted over encrypted connections (HTTPS) and stored securely.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Contact us at support@digitalstore.com for any data-related requests.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">6. Contact</h2>
              <p>For privacy-related questions, contact us at support@digitalstore.com.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
