"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function CategoriesAdmin() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch categories
  const fetchCategories = useCallback(() => {
    fetch(
      `/api/admin/categories?page=${page}&limit=10&search=${encodeURIComponent(
        debouncedSearch
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setTotalPages(data.totalPages);
      });
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Add category
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchCategories(); // рефреш на таблицата
      setForm({ name: "", description: "", imageUrl: "" });
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Categories Admin</h1>

      {/* Add Category Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Category Name", key: "name", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Image URL", key: "imageUrl", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>

      {/* Categories Table with Search */}
      <div className="overflow-x-auto bg-white p-6 rounded-sm shadow space-y-4">
        {/* Search */}
        <div className="relative w-full md:w-1/2 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
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
              <th className="px-4 py-2 border text-left text-gray-700">Description</th>
              <th className="px-4 py-2 border text-left text-gray-700">Image URL</th>
              <th className="px-4 py-2 border text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{c.id}</td>
                <td className="px-4 py-2 border">{c.name}</td>
                <td className="px-4 py-2 border">{c.description}</td>
                <td className="px-4 py-2 border">{c.imageUrl}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => router.push(`/admin/categories/edit/${c.id}`)}
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
