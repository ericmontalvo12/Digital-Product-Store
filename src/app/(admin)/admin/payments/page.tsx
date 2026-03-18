import { CheckCircle, AlertCircle, Wifi, WifiOff, CreditCard, Clock, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminPaymentsPage() {
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
            <Badge variant="success">Connected</Badge>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Provider</span>
              <span>Cash App Pay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Mode</span>
              <Badge variant="warning">Sandbox</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Merchant ID</span>
              <span className="font-mono text-xs">MERCHANT_••••••</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">API Key</span>
              <span className="font-mono text-xs">••••••••••••</span>
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
            <Badge variant="success">Active</Badge>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Endpoint</span>
              <span className="font-mono text-xs">/api/payments/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Last Delivery</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Last Status</span>
              <Badge variant="success">200 OK</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Events (24h)</span>
              <span>12</span>
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
              <p className="text-xs text-[var(--text-muted)]">Show QR code for desktop users</p>
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
          <Badge variant="default">Last 7 days</Badge>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Mar 12, 10:45 AM</TableCell>
              <TableCell className="font-mono text-xs">ORD-M3N4O5</TableCell>
              <TableCell>Payment declined by provider</TableCell>
              <TableCell><Badge variant="error">Failed</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
