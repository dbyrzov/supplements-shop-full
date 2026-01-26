"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [form, setForm] = useState<Category>({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
          slug: data.slug ?? "",
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
        });
        setLoading(false);
      });
  }, [categoryId]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    return newErrors;
  };

  // Update category
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

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
      const data = await res.json();
      alert(data.error || "Failed to update category");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-700">Loading category...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Category</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        {[
          { label: "Category Name", key: "name", type: "text", required: true },
          { label: "Slug", key: "slug", type: "text", required: true },
          { label: "Description", key: "description", type: "textarea" },
          { label: "Image URL", key: "imageUrl", type: "text" },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-gray-700 font-medium mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                  errors[field.key]
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                rows={3}
              />
            ) : (
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                  errors[field.key]
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
            )}

            {errors[field.key] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}

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
