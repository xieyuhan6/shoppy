'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

// 格式化价格函数
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
};

interface CartData {
  total_price: number;
}

export function Navigation() {
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await api.getCart();
        setCartTotal(cart.total_price || 0);
      } catch (error) {
        // Cart might not exist yet
      }
    };

    fetchCart();
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">XieBao</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-indigo-600">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-indigo-600 flex items-center gap-2">
              Cart
              {cartTotal > 0 && (
                <span className="bg-indigo-600 text-white rounded-full px-2 py-1 text-sm">
                  ${formatPrice(cartTotal)}
                </span>
              )}
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-indigo-600">
              Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
