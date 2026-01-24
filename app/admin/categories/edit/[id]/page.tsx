"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch category by ID
  useEffect(() => {
    if (!categoryId) return;

    fetch(`/api/admin/categories/edit/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
        });
        setLoading(false);
      });
  }, [categoryId]);

  // Update category
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/categories/edit/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/categories");
    } else {
      alert("Failed to update category");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-700">Loading category...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Edit Category
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) =>
              setForm({ ...form, imageUrl: e.target.value })
            }
            className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}
