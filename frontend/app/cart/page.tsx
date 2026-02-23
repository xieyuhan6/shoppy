'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

// 格式化价格函数
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
};

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
  quantity: number;
  total_price: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
      setError(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      const updatedCart = await api.removeFromCart(productId);
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      try {
        await api.clearCart();
        setCart(null);
      } catch (err) {
        setError('Failed to clear cart');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
          <Link href="/products">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24">
                  {item.product.image ? (
                    <div className="relative w-24 h-24 bg-gray-100 rounded">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs text-center">No image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="text-lg font-semibold text-indigo-600 hover:underline cursor-pointer">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600">
                    ${formatPrice(item.product.price)} each
                  </p>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-bold text-indigo-600">
                    ${formatPrice(item.total_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleClearCart}
            className="mt-6 text-red-600 hover:text-red-800 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${formatPrice(cart.total_price)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${formatPrice(cart.total_price)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                Proceed to Checkout
              </button>
            </Link>

            <Link href="/products">
              <button className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
