import Link from "next/link";

export default function AdminPage() {
  const adminCards = [
    {
      href: "/admin/products",
      title: "Products",
      description: "Manage your products, inventory and details",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      href: "/admin/categories",
      title: "Categories",
      description: "Manage product categories",
      gradient: "from-green-400 to-green-600",
    },
    {
      href: "/admin/subcategories",
      title: "Subcategories",
      description: "Manage subcategories for products",
      gradient: "from-teal-400 to-teal-600",
    },
    {
      href: "/admin/brands",
      title: "Brands",
      description: "Manage product brands",
      gradient: "from-orange-400 to-orange-600",
    },
    {
      href: "/admin/gifts",
      title: "Gifts",
      description: "Manage gift items",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      href: "/admin/flavors",
      title: "Flavors",
      description: "Manage product flavors",
      gradient: "from-pink-400 to-pink-600",
    },
    {
      href: "/admin/tags",
      title: "Tags",
      description: "Manage product tags",
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      href: "/admin/orders",
      title: "Orders",
      description: "View and manage customer orders",
      gradient: "from-red-400 to-red-600",
    },
    {
      href: "/admin/reviews",
      title: "Reviews",
      description: "Manage product reviews",
      gradient: "from-indigo-400 to-indigo-600",
    },
    {
      href: "/admin/users",
      title: "Users",
      description: "Manage users and their data",
      gradient: "from-gray-400 to-gray-600",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`p-6 bg-gradient-to-br ${card.gradient} text-white shadow-lg rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
          >
            <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
            <p className="text-white/90">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
