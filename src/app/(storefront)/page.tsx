import Link from 'next/link';
import { ArrowRight, Zap, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/storefront/product-card';
import { getFeaturedProducts } from '@/lib/queries/products';


export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <div>
      {/* Hero */}
      <section className="container-main pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="success" className="mb-6">
            Cash App Pay Checkout
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Premium Digital{' '}
            <span className="text-[var(--accent)]">Products</span>{' '}
            Delivered Instantly
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Discover high-quality digital assets, tools, and resources. Purchase securely with Cash App Pay and get instant access.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/catalog">
              <Button size="lg">
                Browse Catalog
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-main pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Instant Delivery', desc: 'Get your products immediately after payment confirmation' },
            { icon: Shield, title: 'Secure Checkout', desc: 'Pay safely with Cash App Pay — no card details needed' },
            { icon: Download, title: 'Easy Downloads', desc: 'Access your purchases anytime from your dashboard' },
          ].map((f) => (
            <Card key={f.title} className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent-muted)] mb-4">
                <f.icon size={22} className="text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-main pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Handpicked for you</p>
          </div>
          <Link href="/catalog">
            <Button variant="ghost" size="sm">
              View All <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                slug={product.slug}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                category={product.category}
                images={product.images}
                stockMode={product.stockMode}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-[var(--text-muted)]">No featured products yet. Check back soon!</p>
          </Card>
        )}
      </section>

      {/* CTA */}
      <section className="container-main pb-20">
        <Card className="text-center py-12 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-elevated)]">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
            Browse our collection and pay securely with Cash App Pay.
          </p>
          <Link href="/catalog">
            <Button size="lg">
              Shop Now <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
