"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/admin/products/edit/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? 0,
          imageUrl: data.imageUrl || "",
          stock: data.stock ?? 0,
          sku: data.sku || "",
          weight: data.weight ?? 0,
          servingSize: data.servingSize || "",
          ingredients: data.ingredients || "",
          nutritionInfo: data.nutritionInfo || "",
          allergens: data.allergens || "",
          brand: data.brand || "",
          tags: data.tags || "",
          rating: data.rating ?? 0,
          categoryId: data.categoryId ?? 1,
          id: data.id,
        });
        setLoading(false);
      });
  }, [productId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/products");
    }
  }

  if (loading) return <p className="p-8 text-gray-700">Loading product...</p>;

  const fields = [
    { label: "Product Name", key: "name", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Price ($)", key: "price", type: "number", step: 0.01 },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Category ID", key: "categoryId", type: "number" },
    { label: "SKU", key: "sku", type: "text" },
    { label: "Image URL", key: "imageUrl", type: "text" },
    { label: "Weight (kg)", key: "weight", type: "number", step: 0.01 },
    { label: "Serving Size", key: "servingSize", type: "text" },
    { label: "Ingredients (JSON)", key: "ingredients", type: "textarea" },
    { label: "Nutrition Info (JSON)", key: "nutritionInfo", type: "textarea" },
    { label: "Allergens", key: "allergens", type: "text" },
    { label: "Brand", key: "brand", type: "text" },
    { label: "Tags (CSV)", key: "tags", type: "text" },
    { label: "Rating", key: "rating", type: "number", step: 0.1 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Product</h1>

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
                  value={(form as any)[field.key] ?? (field.type === "number" ? 0 : "")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]:
                        field.type === "number"
                          ? e.target.value === "" ? 0 : parseFloat(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  step={field.step}
                  min={field.type === "number" ? 0 : undefined}
                  max={field.key === "rating" ? 5 : undefined}
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
