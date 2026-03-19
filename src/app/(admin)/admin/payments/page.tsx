import { Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getRecentPaymentErrors, getRecentWebhookEvents } from '@/lib/queries/admin';
import { formatDateTime } from '@/lib/utils';


export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const [errors, webhookEvents] = await Promise.all([
    getRecentPaymentErrors(10),
    getRecentWebhookEvents(5),
  ]);

  const lastWebhook = webhookEvents[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your Cash App Pay integration</p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <Badge variant={process.env.CASHAPP_API_KEY ? 'success' : 'warning'}>
              {process.env.CASHAPP_API_KEY ? 'Configured' : 'Not Configured'}
            </Badge>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Provider</span>
              <span>{process.env.PAYMENT_ADAPTER === 'afterpay' ? 'Afterpay' : 'Cash App Pay'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Mode</span>
              <Badge variant={process.env.CASHAPP_SANDBOX === 'true' ? 'warning' : 'success'}>
                {process.env.CASHAPP_SANDBOX === 'true' ? 'Sandbox' : 'Live'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Merchant ID</span>
              <span className="font-mono text-xs">
                {process.env.CASHAPP_MERCHANT_ID
                  ? `${process.env.CASHAPP_MERCHANT_ID.slice(0, 8)}••••`
                  : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">API Key</span>
              <span className="font-mono text-xs">
                {process.env.CASHAPP_API_KEY ? '••••••••••••' : 'Not set'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Shield size={12} />
              Secrets stored in environment variables
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Status</CardTitle>
            <Badge variant={lastWebhook ? 'success' : 'default'}>
              {lastWebhook ? 'Active' : 'No Events'}
            </Badge>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Endpoint</span>
              <span className="font-mono text-xs">/api/payments/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Last Delivery</span>
              <span>{lastWebhook ? formatDateTime(lastWebhook.createdAt) : 'None'}</span>
            </div>
            {lastWebhook && (
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Last Verified</span>
                <Badge variant={lastWebhook.verified ? 'success' : 'error'}>
                  {lastWebhook.verified ? 'Verified' : 'Failed'}
                </Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Total Events</span>
              <span>{webhookEvents.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Checkout Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Checkout Settings</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable Checkout</p>
              <p className="text-xs text-[var(--text-muted)]">Allow customers to complete purchases</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-[var(--accent)] relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
            </div>
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Desktop QR Flow</p>
              <p className="text-xs text-[var(--text-muted)]">Show QR code for desktop users to scan with Cash App</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-[var(--accent)] relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
            </div>
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Mobile Redirect Flow</p>
              <p className="text-xs text-[var(--text-muted)]">Redirect mobile users to Cash App</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-[var(--accent)] relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
            </div>
          </label>
        </div>
      </Card>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Errors</CardTitle>
          <Badge variant="default">{errors.length} errors</Badge>
        </CardHeader>
        {errors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>{formatDateTime(error.createdAt)}</TableCell>
                  <TableCell className="font-mono text-xs">{error.order.orderNumber}</TableCell>
                  <TableCell>{error.provider}</TableCell>
                  <TableCell><Badge variant="error">Failed</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">No payment errors</p>
        )}
      </Card>
    </div>
  );
}
