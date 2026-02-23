'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

// 格式化价格函数
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
};

interface Order {
  id: number;
  full_name: string;
  email: string;
  paid: boolean;
  total_cost: number;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.getOrders();
        setOrders(data.results || data);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet</p>
          <Link href="/products">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="text-xl font-bold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className={`font-semibold ${order.paid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paid ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${formatPrice(order.total_cost)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
