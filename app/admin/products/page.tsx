"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/products";
import { HiPlus } from "react-icons/hi";

export default function ProductsAdmin() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products
  const fetchProducts = useCallback(() => {
    fetch(
      `/api/admin/products?page=${page}&limit=10&search=${encodeURIComponent(
        debouncedSearch,
      )}`,
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

  const handleDelete = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този продукт?")) return;

    try {
      const res = await fetch(`/api/admin/products/edit/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Грешка при изтриване на продукта");

      // Презареждаме продуктите наново от API
      fetchProducts();

      alert("Продуктът беше изтрит успешно!");
    } catch (error) {
      console.error(error);
      alert("Възникна грешка при изтриването на продукта");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Products Admin</h1>
        <button
          onClick={() => router.push("/admin/products/add")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <HiPlus className="w-5 h-5" />
          Добави продукт
        </button>
      </div>

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
              <th className="px-4 py-2 border text-left text-gray-700">
                Stock
              </th>
              <th className="px-4 py-2 border text-left text-gray-700">
                Brand
              </th>
              <th className="px-4 py-2 border text-left text-gray-700">
                Category
              </th>
              <th className="px-4 py-2 border text-left text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">{p.brand?.name}</td>
                <td className="px-4 py-2 border">{p.category?.name}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 ml-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
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
