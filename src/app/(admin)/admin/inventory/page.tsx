'use client';

import { useState } from 'react';
import { Upload, AlertTriangle, Search, Package, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert } from '@/components/ui/alert';
import { Modal } from '@/components/ui/modal';

const inventoryItems = [
  { id: '1', product: 'Premium UI Kit', type: 'Unlimited', quantity: '∞', remaining: '∞', status: 'ok' },
  { id: '2', product: 'Developer Toolkit Pro', type: 'Unlimited', quantity: '∞', remaining: '∞', status: 'ok' },
  { id: '3', product: 'Photography Presets Pack', type: 'Quantity', quantity: '200', remaining: '150', status: 'ok' },
  { id: '4', product: 'Business Template Bundle', type: 'License Key', quantity: '100', remaining: '12', status: 'low' },
  { id: '5', product: 'React Component Kit', type: 'License Key', quantity: '50', remaining: '3', status: 'critical' },
];

export default function AdminInventoryPage() {
  const [importModalOpen, setImportModalOpen] = useState(false);

  const lowStockItems = inventoryItems.filter((i) => i.status === 'low' || i.status === 'critical');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage stock levels and license keys</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setImportModalOpen(true)}>
            <Upload size={16} />
            Import CSV
          </Button>
          <Button>
            <Key size={16} />
            Add Keys
          </Button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Alert variant="warning" title="Low Stock Alert" className="mb-6">
          {lowStockItems.length} product(s) have low stock levels. Replenish soon to avoid missing sales.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--accent-muted)]">
              <Package size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total Products</p>
              <p className="font-bold">{inventoryItems.length}</p>
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
              <p className="font-bold">{inventoryItems.filter((i) => i.type === 'License Key').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-[var(--text-primary)]">{item.product}</TableCell>
              <TableCell>
                <Badge variant="default">{item.type}</Badge>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.remaining}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === 'ok' ? 'success' : item.status === 'low' ? 'warning' : 'error'}
                >
                  {item.status === 'ok' ? 'In Stock' : item.status === 'low' ? 'Low Stock' : 'Critical'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)} title="Import Inventory" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Upload a CSV file with license keys or inventory quantities. The file should have columns for product_id and key (for license keys) or quantity (for batch inventory).
          </p>
          <div className="border-2 border-dashed border-[var(--border-default)] rounded-[var(--radius-md)] p-6 text-center">
            <Upload size={24} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Drop CSV file here or click to browse</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setImportModalOpen(false)}>Cancel</Button>
            <Button>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
