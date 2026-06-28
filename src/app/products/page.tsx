'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
import { Search } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { productListSchema } from '@/lib/structured-data';

const BASE_URL = 'https://keylozin.com';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filtered = products.filter(p => {
    if (category && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Structured data for SEO
  const productListJsonLd = productListSchema(products, BASE_URL);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={productListJsonLd} />
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-500">Find the perfect match for your family</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found</p>
            <button onClick={() => { setSearch(''); setCategory(null); }} className="mt-2 text-orange-500 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
