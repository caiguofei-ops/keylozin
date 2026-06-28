'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ product, quantity: 1, color: product.colors?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <article className="group">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
              Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category === 'family' ? 'Family' : 'Hats'}
          </p>
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">${product.price}</p>
            {product.colors && (
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((c) => (
                  <span key={c} className="w-3 h-3 bg-gray-300 rounded-full" />
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
