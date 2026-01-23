"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  sku?: string;
  weight?: number;
  servingSize?: string;
  ingredients?: string;
  nutritionInfo?: string;
  allergens?: string;
  brand?: string;
  tags?: string;
  rating?: number;
  categoryId: number;
}

export default function ProductsAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
    sku: "",
    weight: 0,
    servingSize: "",
    ingredients: "",
    nutritionInfo: "",
    allergens: "",
    brand: "",
    tags: "",
    rating: 0,
    categoryId: 1,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products
  const fetchProducts = useCallback(() => {
    fetch(
      `/api/admin/products?page=${page}&limit=10&search=${encodeURIComponent(
        debouncedSearch
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      });
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchProducts(); // рефреш на таблицата след добавяне
      setForm({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        stock: 0,
        sku: "",
        weight: 0,
        servingSize: "",
        ingredients: "",
        nutritionInfo: "",
        allergens: "",
        brand: "",
        tags: "",
        rating: 0,
        categoryId: 1,
      });
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Products Admin</h1>

      {/* Add Product Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Product Name", key: "name", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Price ($)", key: "price", type: "number" },
            { label: "Image URL", key: "imageUrl", type: "text" },
            { label: "Stock", key: "stock", type: "number" },
            { label: "SKU", key: "sku", type: "text" },
            { label: "Weight (kg)", key: "weight", type: "number", step: 0.01 },
            { label: "Serving Size", key: "servingSize", type: "text" },
            { label: "Ingredients (JSON)", key: "ingredients", type: "text" },
            { label: "Nutrition Info (JSON)", key: "nutritionInfo", type: "text" },
            { label: "Allergens", key: "allergens", type: "text" },
            { label: "Brand", key: "brand", type: "text" },
            { label: "Tags (CSV)", key: "tags", type: "text" },
            { label: "Rating", key: "rating", type: "number", step: 0.1 },
            { label: "Category ID", key: "categoryId", type: "number" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [field.key]:
                      field.type === "number"
                        ? e.target.value === ""
                          ? 0
                          : parseFloat(e.target.value)
                        : e.target.value,
                  })
                }
                className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                step={field.step}
                min={field.type === "number" ? 0 : undefined}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>

      {/* Products Table with Search in Card */}
      <div className="overflow-x-auto bg-white p-6 rounded-sm shadow space-y-4">
        {/* Search inside card */}
        <div className="relative w-full md:w-1/2">
        <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page
            }}
            className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
        />
        {search && (
            <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Clear search"
            >
            ✕
            </button>
        )}
        </div>

        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left text-gray-700">ID</th>
              <th className="px-4 py-2 border text-left text-gray-700">Name</th>
              <th className="px-4 py-2 border text-left text-gray-700">Price ($)</th>
              <th className="px-4 py-2 border text-left text-gray-700">Stock</th>
              <th className="px-4 py-2 border text-left text-gray-700">SKU</th>
              <th className="px-4 py-2 border text-left text-gray-700">Category ID</th>
              <th className="px-4 py-2 border text-left text-gray-700">Rating</th>
              <th className="px-4 py-2 border text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.price.toFixed(2)}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">{p.sku}</td>
                <td className="px-4 py-2 border">{p.categoryId}</td>
                <td className="px-4 py-2 border">{p.rating?.toFixed(1)}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
