import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">
          Welcome to XieBao Shop
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Discover our amazing collection of products. 
          Fast shipping, great prices, excellent service.
        </p>
        <Link href="/products">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-semibold">
            Start Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
