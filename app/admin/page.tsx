import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Products</h2>
          <p className="text-white/90">Manage your products, inventory and details</p>
        </Link>

        <Link
          href="/admin/categories"
          className="p-6 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Categories</h2>
          <p className="text-white/90">Manage product categories</p>
        </Link>

        <Link
          href="/admin/gifts"
          className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Gifts</h2>
          <p className="text-white/90">Manage gift items</p>
        </Link>
      </div>
    </div>
  );
}
