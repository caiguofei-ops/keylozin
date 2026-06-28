'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">KEYLOZIN</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Shop</Link>
            <Link href="/products?category=family" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Family</Link>
            <Link href="/products?category=hats" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Hats</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="hidden sm:flex p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 space-y-1">
            <Link href="/products" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Shop</Link>
            <Link href="/products?category=family" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Family</Link>
            <Link href="/products?category=hats" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Hats</Link>
            <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">About</Link>
            <Link href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
