import { AlertTriangle, Package, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { getAdminInventory } from '@/lib/queries/admin';


export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const inventory = await getAdminInventory();

  const lowStockItems = inventory.filter(i => i.lowStock);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage stock levels and license keys</p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Alert variant="warning" title="Low Stock Alert" className="mb-6">
          {lowStockItems.length} product(s) have low stock levels. Replenish soon to avoid missing sales.
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--accent-muted)]">
              <Package size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total Products</p>
              <p className="font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--warning-muted)]">
              <AlertTriangle size={16} className="text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Low Stock</p>
              <p className="font-bold">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--info-muted)]">
              <Key size={16} className="text-[var(--info)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">License Products</p>
              <p className="font-bold">{inventory.filter(i => i.stockMode === 'LICENSE_KEY').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {inventory.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No inventory to manage"
          description="Create products with quantity or license key stock modes to manage inventory."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.productId}>
                <TableCell className="font-medium text-[var(--text-primary)]">{item.productTitle}</TableCell>
                <TableCell>
                  <Badge variant="default">{item.stockMode === 'UNLIMITED' ? 'Unlimited' : item.stockMode === 'LICENSE_KEY' ? 'License Key' : 'Quantity'}</Badge>
                </TableCell>
                <TableCell>{item.total === Infinity ? '∞' : item.total}</TableCell>
                <TableCell>{item.available === Infinity ? '∞' : item.available}</TableCell>
                <TableCell>
                  <Badge variant={!item.lowStock ? 'success' : item.available === 0 ? 'error' : 'warning'}>
                    {item.available === Infinity ? 'Unlimited' : !item.lowStock ? 'In Stock' : item.available === 0 ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
