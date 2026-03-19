'use client';

import { useState, useTransition } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { refundOrder, fulfillOrder, addOrderNote } from '@/lib/actions/order-actions';

interface OrderActionsProps {
  orderId: string;
  status?: string;
  fulfillmentStatus?: string;
  showNoteForm?: boolean;
}

export function OrderActions({ orderId, status, fulfillmentStatus, showNoteForm }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [note, setNote] = useState('');

  if (showNoteForm) {
    return (
      <div>
        {message && <Alert variant={message.type} className="mb-3">{message.text}</Alert>}
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note about this order..."
        />
        <div className="mt-3 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            loading={isPending}
            onClick={() => {
              if (!note.trim()) return;
              startTransition(async () => {
                const result = await addOrderNote(orderId, note.trim());
                if (result.success) {
                  setNote('');
                  setMessage({ type: 'success', text: 'Note added' });
                } else {
                  setMessage({ type: 'error', text: 'Failed to add note' });
                }
              });
            }}
          >
            Save Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {message && <Alert variant={message.type} className="mr-2">{message.text}</Alert>}

      {fulfillmentStatus !== 'FULFILLED' && status === 'PAID' && (
        <Button
          variant="secondary"
          size="sm"
          loading={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await fulfillOrder(orderId);
              setMessage(result.success
                ? { type: 'success', text: 'Order fulfilled' }
                : { type: 'error', text: result.error ?? 'Failed' });
            });
          }}
        >
          <Send size={14} />
          Fulfill
        </Button>
      )}

      {status === 'PAID' && (
        <Button
          variant="danger"
          size="sm"
          loading={isPending}
          onClick={() => {
            if (!confirm('Are you sure you want to refund this order?')) return;
            startTransition(async () => {
              const result = await refundOrder(orderId);
              setMessage(result.success
                ? { type: 'success', text: 'Refund processed' }
                : { type: 'error', text: result.error ?? 'Failed' });
            });
          }}
        >
          <RotateCcw size={14} />
          Refund
        </Button>
      )}
    </div>
  );
}
