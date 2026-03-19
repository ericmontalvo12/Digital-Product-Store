'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';

interface AddToCartButtonProps {
  productId: string;
  title: string;
  slug: string;
  price: number;
  image?: string;
  deliveryType: string;
}

export function AddToCartButton({ productId, title, slug, price, image, deliveryType }: AddToCartButtonProps) {
  const addItem = useCartStore(s => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ productId, title, slug, price, image, deliveryType });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button size="lg" className="flex-1" onClick={handleClick}>
      {added ? (
        <>
          <Check size={18} />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Add to Cart
        </>
      )}
    </Button>
  );
}
