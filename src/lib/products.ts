export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'family' | 'hats' | 'accessories';
  images: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "father",
    name: "2 Packs Baseball Cap for Dad and Son Adjustable hat",
    slug: "father-son-baseball",
    description: "Premium quality matching baseball caps for father and son. Adjustable size, perfect for game days and family photos.",
    price: 29.99,
    category: "family",
    images: [
      "/products/father-son-baseball.jpg",
      "/products/father-son-baseball/father-son-baseball-1.jpg",
      "/products/father-son-baseball/father-son-baseball-2.jpg",
      "/products/father-son-baseball/father-son-baseball-3.jpg",
      "/products/father-son-baseball/father-son-baseball-4.jpg",
      "/products/father-son-baseball/father-son-baseball-5.jpg"
    ],
    sizes: ["S/M", "L/XL"],
    colors: ["Black", "Navy", "Gray"],
    inStock: true,
    featured: true,
    tags: ["father-son", "baseball", "matching", "gift"]
  },
  {
    id: "promot",
    name: "KEYLOZIN Baseball Cap for Husband and Dad",
    slug: "promoted-dad-hat",
    description: "Show off your proud status with this premium embroidered cap. Perfect gift for new dads and husbands.",
    price: 24.99,
    category: "hats",
    images: [
      "/products/promoted-dad-hat.jpg",
      "/products/promoted-dad-hat/promoted-dad-hat-1.jpg",
      "/products/promoted-dad-hat/promoted-dad-hat-2.jpg",
      "/products/promoted-dad-hat/promoted-dad-hat-3.jpg",
      "/products/promoted-dad-hat/promoted-dad-hat-4.jpg",
      "/products/promoted-dad-hat/promoted-dad-hat-5.jpg"
    ],
    colors: ["Black", "Navy", "Gray", "Red"],
    inStock: true,
    featured: true,
    tags: ["dad", "hat", "gift", "father"]
  },
  {
    id: "husban",
    name: "Mr Mrs Couples Trucker Hat Set - Matching Embroidered Hats",
    slug: "husband-trucker",
    description: "Couple up with matching trucker hats! Perfect for couples who love the open road and country vibes.",
    price: 34.99,
    category: "family",
    images: [
      "/products/husband-trucker.jpg",
      "/products/husband-trucker/husband-trucker-1.jpg",
      "/products/husband-trucker/husband-trucker-2.jpg",
      "/products/husband-trucker/husband-trucker-3.jpg",
      "/products/husband-trucker/husband-trucker-4.jpg",
      "/products/husband-trucker/husband-trucker-5.jpg"
    ],
    colors: ["Black/White", "Navy/Camo"],
    inStock: true,
    featured: true,
    tags: ["couple", "trucker", "matching", "gift"]
  },
  {
    id: "bigbro",
    name: "Big BRO Beanie - Kids Unstructured Cap",
    slug: "big-bro-beanie",
    description: "Let the world know you're the best big brother! Soft, warm beanie perfect for siblings.",
    price: 19.99,
    category: "hats",
    images: [
      "/products/big-bro-beanie.jpg",
      "/products/big-bro-beanie/big-bro-beanie-1.jpg",
      "/products/big-bro-beanie/big-bro-beanie-2.jpg",
      "/products/big-bro-beanie/big-bro-beanie-3.jpg",
      "/products/big-bro-beanie/big-bro-beanie-4.jpg",
      "/products/big-bro-beanie/big-bro-beanie-5.jpg"
    ],
    colors: ["Black", "Navy", "Gray", "Red"],
    inStock: true,
    featured: false,
    tags: ["brother", "beanie", "sibling", "gift"]
  },
  {
    id: "matchi",
    name: "Matching Beanies for Dad Mom Husband Wife",
    slug: "matching-beanies",
    description: "Stay warm and connected with matching beanies. Perfect for parents and kids during winter adventures.",
    price: 22.99,
    category: "hats",
    images: [
      "/products/matching-beanies.jpg",
      "/products/matching-beanies/matching-beanies-1.jpg",
      "/products/matching-beanies/matching-beanies-2.jpg",
      "/products/matching-beanies/matching-beanies-3.jpg",
      "/products/matching-beanies/matching-beanies-4.jpg",
      "/products/matching-beanies/matching-beanies-5.jpg"
    ],
    colors: ["Black", "Navy", "Gray", "Burgundy"],
    inStock: true,
    featured: true,
    tags: ["parent-child", "beanie", "matching", "winter"]
  },
  {
    id: "fixstu",
    name: "Matching Couples & Family Baseball Caps - Adjustable Hats",
    slug: "fix-stuff-tee",
    description: "Matching couples and family baseball caps. Adjustable dad/mom hats for men, women, husband and wife.",
    price: 27.99,
    category: "family",
    images: [
      "/products/fix-stuff-tee.jpg",
      "/products/fix-stuff-tee/fix-stuff-tee-1.jpg",
      "/products/fix-stuff-tee/fix-stuff-tee-2.jpg",
      "/products/fix-stuff-tee/fix-stuff-tee-3.jpg",
      "/products/fix-stuff-tee/fix-stuff-tee-4.jpg",
      "/products/fix-stuff-tee/fix-stuff-tee-5.jpg"
    ],
    sizes: ["S/M", "L/XL"],
    colors: ["Black", "Navy", "Gray"],
    inStock: true,
    featured: false,
    tags: ["dad", "funny", "slogan", "gift"]
  }
];

export const categories = [
  { id: 'family', name: 'Family Matching', icon: 'Heart', description: 'Matching outfits for the whole family' },
  { id: 'hats', name: 'Hats & Beanies', icon: 'Hat', description: 'Hats, caps, and beanies for everyone' },
  { id: 'accessories', name: 'Accessories', icon: 'Gem', description: 'Complete your look with accessories' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}
