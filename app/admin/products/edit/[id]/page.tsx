"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Product {
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

interface FieldObj {
  label: string;
  key: string;
  type: string;
  step?: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch product by ID
  useEffect(() => {
    if (!productId) return;

    fetch(`/api/admin/products/edit/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price: data.price ?? 0,
          imageUrl: data.imageUrl ?? "",
          stock: data.stock ?? 0,
          sku: data.sku ?? "",
          weight: data.weight ?? 0,
          servingSize: data.servingSize ?? "",
          ingredients: data.ingredients ?? "",
          nutritionInfo: data.nutritionInfo ?? "",
          allergens: data.allergens ?? "",
          brand: data.brand ?? "",
          tags: data.tags ?? "",
          rating: data.rating ?? 0,
          categoryId: data.categoryId ?? 1,
        });
        setLoading(false);
      });
  }, [productId]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (form.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (form.categoryId <= 0) newErrors.categoryId = "Category ID must be greater than 0";
    if (form.rating! < 0 || form.rating! > 5) newErrors.rating = "Rating must be between 0 and 5";
    return newErrors;
  };

  // Update product
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    const res = await fetch(`/api/admin/products/edit/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/products");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update product");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-700">Loading product...</p>;
  }

  const fields: FieldObj[] = [
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
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}{" "}
                {["name", "price", "stock", "categoryId", "rating"].includes(field.key) && (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={(form as any)[field.key] ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                    errors[field.key] ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                  }`}
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  step={field.step}
                  min={field.type === "number" ? 0 : undefined}
                  max={field.key === "rating" ? 5 : undefined}
                  value={(form as any)[field.key] ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]:
                        field.type === "number"
                          ? e.target.value === ""
                            ? 0
                            : Number(e.target.value)
                          : e.target.value,
                    })
                  }
                  className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                    errors[field.key] ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                  }`}
                />
              )}

              {errors[field.key] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
