import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/lib/cart-context";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

const BASE_URL = 'https://keylozin.com';

export const metadata: Metadata = {
  title: {
    default: "KEYLOZIN - Family Matching Apparel & Gifts",
    template: "%s | KEYLOZIN"
  },
  description: "Celebrate family bonds with KEYLOZIN matching apparel and accessories. Perfect gifts for fathers, couples, siblings, and families who love to match.",
  keywords: ["family matching", "couple outfits", "father son matching", "brother sister matching", "dad hats", "beanies", "gifts", "KEYLOZIN"],
  authors: [{ name: "KEYLOZIN" }],
  creator: "KEYLOZIN",
  publisher: "KEYLOZIN",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "KEYLOZIN",
    title: "KEYLOZIN - Family Matching Apparel & Gifts",
    description: "Celebrate family bonds with KEYLOZIN matching apparel and accessories",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KEYLOZIN - Family Matching Apparel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "KEYLOZIN - Family Matching Apparel & Gifts",
    description: "Celebrate family bonds with matching apparel and accessories",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-full flex flex-col font-outfit">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
