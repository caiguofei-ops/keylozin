import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👨‍👧</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About KEYLOZIN</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Family matching apparel for those who celebrate their bonds
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-gray mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            KEYLOZIN was founded with a simple mission: help families celebrate their bonds with matching apparel.
            We believe that wearing matching outfits is more than just fashion—it's about showing pride in family.
          </p>
          <p className="text-gray-600 mb-6">
            From father-son baseball caps to couple trucker hats, every product is designed with quality and heart.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Our Values</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• <strong>Quality</strong> — Premium materials and craftsmanship</li>
            <li>• <strong>Family</strong> — Celebrating bonds that matter</li>
            <li>• <strong>Joy</strong> — Spreading happiness through matching</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to match with your family?</h2>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
