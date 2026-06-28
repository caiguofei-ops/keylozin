'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { faqSchema } from '@/lib/structured-data';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express (2-3 days) and next day options available.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship to US and Puerto Rico. International coming soon.' },
  { q: 'What is your return policy?', a: '30 days, unworn with tags attached. Contact us for a prepaid return label.' },
  { q: 'How do I track my order?', a: 'Tracking info is sent via email once your order ships.' },
  { q: 'Are your hats adjustable?', a: 'Most caps have adjustable straps. Beanies are one-size and stretch to fit.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={faqSchema} />
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-4 py-4 flex items-center justify-between text-left font-medium"
            >
              {faq.q}
              <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</div>
            )}
          </div>
        ))}

        <div className="text-center pt-6">
          <p className="text-gray-500 mb-2">Still have questions?</p>
          <Link href="/contact" className="text-orange-500 hover:underline">Contact us →</Link>
        </div>
      </div>
    </div>
  );
}
