'use client';

import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-6">
            Your payment was cancelled and you haven't been charged.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500">
              Your cart items are still saved. You can continue shopping or try again when you're ready.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </Link>
            <Link
              href="/products"
              className="block text-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
