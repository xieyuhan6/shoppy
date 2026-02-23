'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

// 格式化价格函数
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
};

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  price: number;
  quantity: number;
  cost: number;
}

interface Order {
  id: number;
  full_name: string;
  email: string;
  address: string;
  paid: boolean;
  total_cost: number;
  items: OrderItem[];
  created_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api.getOrder(parseInt(id));
        setOrder(data);
      } catch (err) {
        setError('Failed to load order');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b pb-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Order Information</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-semibold">Order ID:</span> #{order.id}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{' '}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span className={order.paid ? 'text-green-600' : 'text-yellow-600'}>
                  {order.paid ? 'Paid' : 'Pending Payment'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Shipping To</h2>
            <div className="text-gray-600 space-y-1">
              <p className="font-semibold">{order.full_name}</p>
              <p>{order.email}</p>
              <p className="whitespace-pre-wrap">{order.address}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-gray-600 text-sm">
                    ${formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${formatPrice(item.cost)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="text-right mb-8">
          <div className="text-2xl font-bold">
            Total: ${formatPrice(order.total_cost)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/products">
            <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
              Continue Shopping
            </button>
          </Link>
          <Link href="/orders">
            <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
              View All Orders
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
