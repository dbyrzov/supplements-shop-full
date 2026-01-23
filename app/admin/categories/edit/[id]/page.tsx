"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id;

  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch category по ID
  useEffect(() => {
    if (!categoryId) return;

    fetch(`/api/admin/categories/edit/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          id: data.id,
        });
        setLoading(false);
      });
  }, [categoryId]);

  // Submit за update
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) return;

    const res = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/categories");
    }
  }

  if (loading) return <p className="p-8 text-gray-700">Loading category...</p>;

  const fields = [
    { label: "Category Name", key: "name", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Image URL", key: "imageUrl", type: "text" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Category</h1>

      <form
        onSubmit={handleUpdate}
        className="mb-8 bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={(form as any)[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  value={(form as any)[field.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Update Category
          </button>
        </div>
      </form>
    </div>
  );
}
