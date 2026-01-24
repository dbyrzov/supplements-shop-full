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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!giftId) return;

    fetch(`/api/admin/gifts/edit/${giftId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
          price: data.price ?? 0,
        });
        setLoading(false);
      });
  }, [giftId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/gifts/edit/${giftId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/gifts");
    } else {
      alert("Failed to update gift");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-700">Loading gift...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Edit Gift
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Gift Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-3 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-3 w-full rounded"
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
            onChange={e =>
              setForm({ ...form, imageUrl: e.target.value })
            }
            className="border p-3 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={e =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
            className="border p-3 w-full rounded"
          />
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
