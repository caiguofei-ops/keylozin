import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Returns</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-green-800 font-medium">30-day hassle-free returns</p>
        </div>

        <div className="border rounded-xl p-4 text-sm text-gray-600 space-y-3">
          <h2 className="font-medium text-gray-900">How to Return</h2>
          <p>1. Email us at <a href="mailto:support@keylozin.com" className="text-orange-500">support@keylozin.com</a></p>
          <p>2. We'll send a prepaid return label</p>
          <p>3. Pack and ship back</p>
          <p>4. Refund processed in 3-5 days</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4">
            <h3 className="font-medium mb-2">✓ Can Return</h3>
            <p className="text-sm text-gray-500">Unworn items with tags attached</p>
          </div>
          <div className="border rounded-xl p-4">
            <h3 className="font-medium mb-2">✗ Cannot Return</h3>
            <p className="text-sm text-gray-500">Worn, washed, or altered items</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact" className="text-orange-500 hover:underline">Need help? Contact us →</Link>
        </div>
      </div>
    </div>
  );
}
