import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-orange-800 font-medium">Free shipping on orders over $50</p>
        </div>

        <div className="border rounded-xl">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-medium">Shipping Options</h2>
          </div>
          <div className="divide-y">
            <div className="px-4 py-4 flex justify-between">
              <div><p className="font-medium">Standard</p><p className="text-sm text-gray-500">5-7 days</p></div>
              <p className="font-medium text-green-600">Free</p>
            </div>
            <div className="px-4 py-4 flex justify-between">
              <div><p className="font-medium">Express</p><p className="text-sm text-gray-500">2-3 days</p></div>
              <p className="font-medium">$12.99</p>
            </div>
            <div className="px-4 py-4 flex justify-between">
              <div><p className="font-medium">Next Day</p><p className="text-sm text-gray-500">1 day</p></div>
              <p className="font-medium">$24.99</p>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-4 text-sm text-gray-600 space-y-2">
          <p>• Ships to all 50 US states</p>
          <p>• Orders before 2pm EST ship same day</p>
          <p>• Tracking info via email</p>
        </div>

        <div className="text-center">
          <Link href="/products" className="text-orange-500 hover:underline">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
}
