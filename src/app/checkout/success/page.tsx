'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Package, ArrowRight } from 'lucide-react';

function OrderDetails() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const paymentId = searchParams.get('paymentId');

    if (token || paymentId) {
      setOrderDetails({
        id: token || paymentId,
        status: 'COMPLETED',
        message: 'Your payment was successful!'
      });
    } else {
      setOrderDetails({
        id: 'DEMO-' + Date.now(),
        status: 'COMPLETED',
        message: 'Order confirmed!'
      });
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-6">Thank you for your purchase</p>

      {orderDetails && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono font-semibold">{orderDetails.id}</p>
        </div>
      )}

      <div className="space-y-4 text-left bg-orange-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-gray-900">Confirmation Email</p>
              <p className="text-sm text-gray-500">You'll receive an order confirmation email shortly</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-gray-900">Processing</p>
              <p className="text-sm text-gray-500">We'll prepare your order for shipping</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-gray-900">Shipping</p>
              <p className="text-sm text-gray-500">You'll receive tracking info when it ships</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Continue Shopping <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/"
          className="block text-gray-500 hover:text-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Processing your order...</p>
          </div>
        }>
          <OrderDetails />
        </Suspense>
      </div>
    </div>
  );
}
