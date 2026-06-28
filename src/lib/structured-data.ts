import { Product } from './products';

// Base Organization schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KEYLOZIN',
  url: 'https://keylozin.com',
  logo: 'https://keylozin.com/logo.png',
  description: 'Premium family matching apparel and accessories brand. Perfect gifts for fathers, couples, siblings, and families who love to match.',
  sameAs: [
    'https://www.instagram.com/keylozin',
    'https://www.facebook.com/keylozin',
    'https://twitter.com/keylozin'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@keylozin.com',
    contactType: 'customer service'
  }
};

// WebSite schema for search box
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'KEYLOZIN',
  url: 'https://keylozin.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://keylozin.com/products?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

// Product schema
export function productSchema(product: Product, baseUrl: string = 'https://keylozin.com') {
  const hasDiscount = product.price < 30;
  const originalPrice = hasDiscount ? product.price * 1.3 : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => `${baseUrl}${img}`),
    sku: product.id.toUpperCase(),
    category: getCategoryName(product.category),
    brand: {
      '@type': 'Brand',
      name: 'KEYLOZIN'
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product.price,
      highPrice: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'KEYLOZIN'
      },
      ...(originalPrice && {
        originalPrice: originalPrice.toFixed(2)
      })
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1'
    },
    ...(product.colors && { color: product.colors }),
    ...(product.sizes && { size: product.sizes }),
    keywords: product.tags.join(', ')
  };
}

// Product list schema for category pages
export function productListSchema(products: Product[], baseUrl: string = 'https://keylozin.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/products/${product.slug}`,
      name: product.name,
      image: `${baseUrl}${product.images[0]}`,
      offers: {
        '@type': 'Offer',
        price: product.price.toFixed(2),
        priceCurrency: 'USD',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
      }
    }))
  };
}

// BreadcrumbList schema
export function breadcrumbSchema(items: Array<{ name: string; url: string }>, baseUrl: string = 'https://keylozin.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
}

// FAQ schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does shipping take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard shipping takes 5-7 business days. Express (2-3 days) and next day options available.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you ship internationally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently we ship to US and Puerto Rico. International coming soon.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is your return policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '30 days, unworn with tags attached. Contact us for a prepaid return label.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I track my order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tracking info is sent via email once your order ships.'
      }
    }
  ]
};

// LocalBusiness schema for local SEO
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'KEYLOZIN',
  description: 'Premium family matching apparel and accessories',
  url: 'https://keylozin.com',
  email: 'support@keylozin.com',
  priceRange: '$$',
  paymentAccepted: 'Credit Card, PayPal',
  shippingOptions: {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '5.99',
      currency: 'USD'
    },
    freeShippingThreshold: {
      '@type': 'MonetaryAmount',
      value: '50',
      currency: 'USD'
    }
  },
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: '30',
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn'
  }
};

// Helper function
function getCategoryName(category: string): string {
  const map: Record<string, string> = {
    family: 'Family Matching',
    hats: 'Hats & Caps',
    accessories: 'Accessories'
  };
  return map[category] || category;
}
