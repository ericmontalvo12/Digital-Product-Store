import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-[var(--accent)] mb-4">404</h1>
        <h2 className="text-lg font-semibold mb-2">Page Not Found</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </Card>
    </div>
  );
}
