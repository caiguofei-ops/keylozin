const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const products = [
  { url: 'https://www.amazon.com/KEYLOZIN-Matching-Father-Baseball-Embroidered/dp/B0F42WVMKH', name: 'father-son-baseball' },
  { url: 'https://www.amazon.com/KEYLOZIN-Promoted-dad-hat-Embroidered/dp/B0FWC12571', name: 'promoted-dad-hat' },
  { url: 'https://www.amazon.com/KEYLOZIN-Husband-Matching-Trucker-Couples/dp/B0FGQLDRQL', name: 'husband-trucker' },
  { url: 'https://www.amazon.com/KEYLOZIN-Big-BRO-Kids-Beanie/dp/B0FWJ5HYWB', name: 'big-bro-beanie' },
  { url: 'https://www.amazon.com/KEYLOZIN-Matching-Beanies-Stretch-Parent-Child/dp/B0FSRRD6WZ', name: 'matching-beanies' },
  { url: 'https://www.amazon.com/KEYLOZIN-Fix-Stuff-Know-Things/dp/B0FJFGHLMH', name: 'fix-stuff-tee' }
];

const outputDir = path.join(__dirname, 'public', 'products');
const dataDir = path.join(__dirname, 'src', 'lib');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(false);
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.amazon.com/'
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(filepath).size;
        resolve(size > 5000);
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

async function scrapeAmazon() {
  console.log('Starting full Amazon scraper...\n');

  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const allProducts = [];

  for (const product of products) {
    console.log(`\n=== Processing: ${product.name} ===`);

    const page = await browser.newPage();

    try {
      await page.goto(product.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      // Get product data
      const data = await page.evaluate(() => {
        const result = {
          name: '',
          price: '',
          description: '',
          colors: [],
          sizes: [],
          images: []
        };

        // Get product name
        const titleEl = document.querySelector('#productTitle');
        if (titleEl) result.name = titleEl.textContent.trim();

        // Get price
        const priceEl = document.querySelector('.a-price .a-offscreen') || document.querySelector('#priceblock_ourprice');
        if (priceEl) result.price = priceEl.textContent;

        // Get description
        const descEl = document.querySelector('#productDescription p');
        if (descEl) result.description = descEl.textContent;

        // Get color options
        const colorOptions = document.querySelectorAll('#variation_color_name li, #variation-color-name li');
        if (colorOptions.length > 0) {
          result.colors = Array.from(colorOptions).map(el => el.textContent.trim()).filter(Boolean);
        }

        // Get size options
        const sizeOptions = document.querySelectorAll('#variation_size_name li, #variation-size-name li, select[name="size"] option');
        if (sizeOptions.length > 0) {
          result.sizes = Array.from(sizeOptions).map(el => el.textContent.trim()).filter(t => t && t !== 'Size').slice(0, 10);
        }

        // Get all images from thumbnails
        const thumbnails = document.querySelectorAll('#altImages li img, #alt-images img, #thumbnails img');
        const imgUrls = new Set();
        thumbnails.forEach(img => {
          let src = img.src || img.getAttribute('data-old-hires') || img.getAttribute('data-a-dynamic-image');
          if (src) {
            if (src.includes('data:image')) return;
            // Convert to high-res URL
            src = src.replace(/\._[^.]+\.jpg/, '._SL1500_.jpg');
            src = src.replace(/\._[^.]+\.png/, '._SL1500_.png');
            imgUrls.add(src);
          }
        });

        // Also try JSON data
        const jsonMatch = document.body.textContent.match(/"colorImages"\s*:\s*(\{[^}]+\})/);
        if (jsonMatch) {
          try {
            const imgData = JSON.parse(jsonMatch[1]);
            Object.values(imgData).forEach(arr => {
              if (Array.isArray(arr)) {
                arr.forEach(img => {
                  if (img.src) imgUrls.add(img.src.replace(/\._[^.]+\.jpg/, '._SL1500_.jpg'));
                });
              }
            });
          } catch (e) {}
        }

        result.images = Array.from(imgUrls).slice(0, 8);

        // Get main image
        const mainImg = document.querySelector('#landingImage, #imgBlkFront, .a-dynamic-image');
        if (mainImg && mainImg.src) {
          const mainSrc = mainImg.src.replace(/\._[^.]+\.jpg/, '._SL1500_.jpg');
          result.images.unshift(mainSrc);
          result.images = [...new Set(result.images)];
        }

        return result;
      });

      console.log(`  Name: ${data.name || 'N/A'}`);
      console.log(`  Price: ${data.price || 'N/A'}`);
      console.log(`  Colors: ${data.colors.length > 0 ? data.colors.join(', ') : 'N/A'}`);
      console.log(`  Sizes: ${data.sizes.length > 0 ? data.sizes.slice(0, 5).join(', ') : 'N/A'}`);
      console.log(`  Images: ${data.images.length}`);

      // Download main image
      const mainImgPath = path.join(outputDir, `${product.name}.jpg`);
      if (data.images[0]) {
        try {
          await downloadImage(data.images[0], mainImgPath);
          console.log(`  ✓ Main image saved`);
        } catch (e) {
          console.log(`  ✗ Main image failed: ${e.message}`);
        }
      }

      // Download additional images
      const imgDir = path.join(outputDir, product.name);
      if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

      for (let i = 1; i < Math.min(data.images.length, 6); i++) {
        const imgPath = path.join(imgDir, `${product.name}-${i}.jpg`);
        try {
          await downloadImage(data.images[i], imgPath);
          console.log(`  ✓ Image ${i} saved`);
        } catch (e) {}
      }

      // Save product data
      allProducts.push({
        id: product.name.replace(/-/g, '').substring(0, 6),
        name: data.name || product.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug: product.name,
        description: data.description || 'Premium quality product from KEYLOZIN',
        price: parseFloat((data.price || '$29.99').replace(/[^0-9.]/g, '')) || 29.99,
        category: product.name.includes('beanie') || product.name.includes('hat') ? 'hats' : 'family',
        images: [data.images[0] || `/products/${product.name}.jpg`],
        sizes: data.sizes.length > 0 ? data.sizes : undefined,
        colors: data.colors.length > 0 ? data.colors : undefined,
        inStock: true,
        featured: product.name.includes('father') || product.name.includes('trucker'),
        tags: ['keylozin', 'family', 'matching', 'gift']
      });

    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }

    await page.close();
    await new Promise(r => setTimeout(r, 3000));
  }

  await browser.close();

  // Save to products.ts
  console.log('\n\nSaving product data...');
  const productsContent = `export interface Product {
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

export const products: Product[] = ${JSON.stringify(allProducts, null, 2)};

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
`;

  fs.writeFileSync(path.join(dataDir, 'products.ts'), productsContent);
  console.log('Done! Product data saved to src/lib/products.ts');
  console.log(`\nTotal products: ${allProducts.length}`);
  console.log(`Total images downloaded: ${allProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0)}`);
}

scrapeAmazon().catch(console.error);
