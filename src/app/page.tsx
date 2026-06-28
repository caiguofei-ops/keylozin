import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { getFeaturedProducts } from '@/lib/products';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Family Matching
              <br />
              <span className="text-orange-500">Made Simple</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Premium matching apparel for families who love to celebrate their bond.
            </p>
            <div className="flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=family"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Family Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/products?category=family" className="group relative aspect-[4/3] bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-5xl mb-2">👨‍👧</span>
                <span className="font-semibold">Family</span>
              </div>
            </Link>
            <Link href="/products?category=hats" className="group relative aspect-[4/3] bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-5xl mb-2">🧢</span>
                <span className="font-semibold">Hats</span>
              </div>
            </Link>
            <Link href="/products" className="group relative aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-5xl mb-2">🎁</span>
                <span className="font-semibold">Gifts</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
            <Link href="/products" className="text-sm font-medium text-orange-500 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Free Shipping on Orders $50+</h2>
            <p className="text-gray-400 mb-6">Use code: FAMILY20 for 20% off</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">Free Shipping</p>
              <p className="text-sm text-gray-500">Orders over $50</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">30-Day Returns</p>
              <p className="text-sm text-gray-500">Easy returns</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Secure Payment</p>
              <p className="text-sm text-gray-500">100% protected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Premium Quality</p>
              <p className="text-sm text-gray-500">Best materials</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
