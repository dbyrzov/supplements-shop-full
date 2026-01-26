"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Gift {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
}

export default function EditGiftPage() {
  const router = useRouter();
  const params = useParams();
  const giftId = params.id as string;

  const [form, setForm] = useState<Gift>({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch gift by ID
  useEffect(() => {
    if (!giftId) return;

    fetch(`/api/admin/gifts/edit/${giftId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
          price: data.price ?? 0,
        });
        setLoading(false);
      });
  }, [giftId]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Gift name is required";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    return newErrors;
  };

  // Update gift
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    const res = await fetch(`/api/admin/gifts/edit/${giftId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/gifts");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update gift");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-700">Loading gift...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Gift</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Gift Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
              errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
              errors.price ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
            }`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Gift"}
        </button>
      </form>
    </div>
  );
}
