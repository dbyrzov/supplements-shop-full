"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DropdownSelect from "@/components/ui/dropdown";

interface Category {
  id: number;
  name: string;
}
interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}
interface Brand {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ProductForm {
  name: string;
  slug: string;
  description?: string;
  categoryId: number;
  subcategoryId: number;
  brandId?: number;
  tags: number[];
  nutritionProfile: {
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  ingredients?: { name: string; amount?: string }[];
  variants?: {
    sku: string;
    grams: number;
    price: number;
    stock: number;
    flavorId?: number;
  }[];
  images: { file?: File; url?: string; isPrimary?: boolean }[];
}

export default function ProductsAdmin() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [step, setStep] = useState(1);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    categoryId: 0,
    subcategoryId: 0,
    brandId: 0,
    tags: [] as number[],
    nutritionProfile: {
      servingSize: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
    ingredients: [],
    variants: [],
    images: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );

  // Fetch categories, subcategories, brands
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
    fetch("/api/admin/subcategories")
      .then((res) => res.json())
      .then((data) => setSubcategories(data.subcategories ?? []));
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands ?? []));
    fetch("/api/admin/tags")
      .then((res) => res.json())
      .then((data) => setAllTags(data.tags ?? []));
  }, []);

  useEffect(() => {
    setForm((f) => ({ ...f, subcategoryId: 0 }));
  }, [form.categoryId]);

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Product name is required";
      if (!form.description) newErrors.description = "Description is required";
      if (!form.categoryId) newErrors.categoryId = "Category is required";
      if (!form.subcategoryId)
        newErrors.subcategoryId = "Subcategory is required";
      if (form.tags.length === 0) newErrors.tags = "Tags are required";
      if (!form.brandId) newErrors.brand = "Brand is required";
    }
    if (step === 2) {
      const np = form.nutritionProfile;
      if (!np.servingSize) newErrors.servingSize = "Serving size is required";
      if (np.calories < 0 || np.protein < 0 || np.carbs < 0 || np.fats < 0)
        newErrors.nutrition = "Nutrition values must be >= 0";
    }
    if (step === 3) {
      if (!form.variants || form.variants.length === 0)
        newErrors.variants = "Add at least one variant";
      form.variants?.forEach((v, i) => {
        if (!v.sku) newErrors[`variant_sku_${i}`] = "SKU is required";
        if (v.price <= 0) newErrors[`variant_price_${i}`] = "Price must be > 0";
        if (v.stock < 0)
          newErrors[`variant_stock_${i}`] = "Stock cannot be negative";
      });
    }
    if (step === 4) {
      if (!form.images || form.images.length === 0)
        newErrors.images = "Add at least one image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(4, s + 1));
  };
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    // 1️⃣ Проверка дали има images и дали са upload-нати
    if (form.images.length === 0 || !form.images.every((i) => i.url)) {
      alert("Please upload all images before submitting the product");
      return;
    }

    // 2️⃣ Генериране на slug
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    // 3️⃣ Подаване на всички данни към backend
    const payload = {
      ...form,
      slug,
      images: form.images.map((i) => ({ url: i.url, isPrimary: i.isPrimary })),
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.refresh();
      setForm({
        name: "",
        slug: "",
        description: "",
        categoryId: 0,
        subcategoryId: 0,
        brandId: 0,
        tags: [],
        nutritionProfile: {
          servingSize: "",
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        },
        ingredients: [],
        variants: [],
        images: [],
      });
      setStep(1);
      alert("Product created successfully!");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create product");
    }
  };

  const generateSKU = (productName: string, idx: number) => {
    const prefix = productName.replace(/\s+/g, "").toUpperCase().slice(0, 3);
    return `${prefix}-${Date.now()}-${idx + 1}`;
  };

  // ----------- Images Upload Helper -----------
  const uploadImages = async () => {
    if (!form.name.trim() || !form.categoryId || !form.subcategoryId) {
      alert("Product name, category and subcategory are required");
      return;
    }

    const productSlug = form.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    const baseDir = "products"; // може да се променя за други типове снимки
    const subDirs = `${categories.find((c) => c.id === form.categoryId)?.name.toLowerCase() || "uncategorized"}/${
      subcategories
        .find((sc) => sc.id === form.subcategoryId)
        ?.name.toLowerCase() || "general"
    }`;

    const formData = new FormData();
    form.images.forEach((img, idx) => {
      if (!img.file) return;
      const fileExt = img.file.name.split(".").pop();
      const fileName = `${productSlug}-${idx + 1}.${fileExt}`;
      const path = `images/${baseDir}/${subDirs}/`;
      formData.append("images", img.file, `${path}${fileName}`);
    });

    formData.append(
      "primaryIndex",
      form.images.findIndex((i) => i.isPrimary).toString(),
    );
    formData.append("baseDir", baseDir);
    formData.append("subDirs", subDirs);
    formData.append("slug", productSlug);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const updatedImages = data.uploaded.map((url: string, idx: number) => ({
          url,
          isPrimary: idx === data.primaryIndex,
        }));
        setForm({ ...form, images: updatedImages });
        alert("Images uploaded successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Add Product</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Step Indicators */}
        <div className="flex justify-between mb-6">
          {["Basic Info", "Nutrition & Ingredients", "Variants", "Images"].map(
            (label, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-2 border-b-4 font-semibold ${
                  step === i + 1
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {label}
              </div>
            ),
          )}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Product Name */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`border p-3 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Brand
              </label>
              <DropdownSelect
                options={brands}
                valueKey="id"
                labelKey="name"
                selected={form.brandId ?? null}
                setSelected={(val) => {
                  setForm({
                    ...form,
                    brandId: val ?? undefined,
                  });
                  setErrors((prev) => ({ ...prev, brand: undefined }));
                }}
                placeholder="Select Brand"
                error={errors.brand}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <DropdownSelect
                options={categories}
                valueKey="id"
                labelKey="name"
                selected={form.categoryId ?? null}
                setSelected={(val) => {
                  setForm({
                    ...form,
                    categoryId: val ?? 0,
                  });
                  setErrors((prev) => ({ ...prev, categoryId: undefined }));
                }}
                placeholder="Select Category"
                error={errors.categoryId}
              />
            </div>

            {/* Subcategory */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <DropdownSelect
                options={subcategories}
                valueKey="id"
                labelKey="name"
                selected={form.subcategoryId || null}
                setSelected={(val) => {
                  setForm({ ...form, subcategoryId: val ?? 0 });
                  setErrors((prev) => ({ ...prev, subcategoryId: undefined }));
                }}
                placeholder="Select Subcategory"
                error={errors.subcategoryId}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                Tags
              </label>

              <DropdownSelect
                multiple
                options={allTags}
                valueKey="id"
                labelKey="name"
                selected={form.tags}
                setSelected={(val) => {
                  setForm({ ...form, tags: val });
                  setErrors((prev) => ({ ...prev, tags: undefined }));
                }}
                placeholder="Select tags"
                error={errors.tags}
              />
            </div>
          </div>
        )}

        {/* Step 2: Nutrition & Ingredients */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Nutrition Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {["servingSize", "calories", "protein", "carbs", "fats"].map(
                (key) => (
                  <div key={key} className="flex flex-col">
                    <label className="block text-gray-700 font-medium mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      type={key === "servingSize" ? "text" : "number"}
                      value={(form.nutritionProfile as any)?.[key] ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nutritionProfile: {
                            ...(form.nutritionProfile || {}),
                            [key]:
                              key === "servingSize"
                                ? e.target.value
                                : parseFloat(e.target.value),
                          },
                        })
                      }
                      className={`border p-3 w-full rounded focus:outline-none focus:ring-1 ${
                        errors[key]
                          ? "border-red-500 focus:ring-red-400"
                          : "focus:ring-blue-400"
                      }`}
                    />
                  </div>
                ),
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-700 mt-4">
              Ingredients
            </h2>
            {(form.ingredients || []).map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) => {
                    const newIngs = [...(form.ingredients || [])];
                    newIngs[idx].name = e.target.value;
                    setForm({ ...form, ingredients: newIngs });
                  }}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ing.amount ?? ""}
                  onChange={(e) => {
                    const newIngs = [...(form.ingredients || [])];
                    newIngs[idx].amount = e.target.value;
                    setForm({ ...form, ingredients: newIngs });
                  }}
                  className="border p-2 rounded w-1/2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newIngs = [...(form.ingredients || [])];
                    newIngs.splice(idx, 1);
                    setForm({ ...form, ingredients: newIngs });
                  }}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  ingredients: [
                    ...(form.ingredients || []),
                    { name: "", amount: "" },
                  ],
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Add Ingredient
            </button>
          </div>
        )}

        {/* Step 3: Variants */}
        {step === 3 && (
          <div className="space-y-4">
            {(form.variants || []).map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end p-4 border rounded shadow-sm"
              >
                {/* SKU */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    disabled
                    className={`border p-2 rounded w-full focus:outline-none focus:ring-1`}
                  />
                  {errors[`variant_sku_${idx}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`variant_sku_${idx}`]}
                    </p>
                  )}
                </div>

                {/* Grams */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Grams
                  </label>
                  <input
                    type="number"
                    value={v.grams}
                    onChange={(e) => {
                      const newVariants = [...(form.variants || [])];
                      newVariants[idx].grams = parseFloat(e.target.value);
                      setForm({ ...form, variants: newVariants });
                    }}
                    className={`border p-2 rounded w-full focus:outline-none focus:ring-1 ${
                      errors[`variant_grams_${idx}`]
                        ? "border-red-500 focus:ring-red-400"
                        : "focus:ring-blue-400"
                    }`}
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01" // <- важната промяна
                    value={v.price}
                    onChange={(e) => {
                      const newVariants = [...(form.variants || [])];
                      newVariants[idx].price = parseFloat(e.target.value) || 0;
                      setForm({ ...form, variants: newVariants });
                    }}
                    className={`border p-2 rounded w-full focus:outline-none focus:ring-1 ${
                      errors[`variant_price_${idx}`]
                        ? "border-red-500 focus:ring-red-400"
                        : "focus:ring-blue-400"
                    }`}
                  />
                  {errors[`variant_price_${idx}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`variant_price_${idx}`]}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => {
                      const newVariants = [...(form.variants || [])];
                      newVariants[idx].stock = parseFloat(e.target.value);
                      setForm({ ...form, variants: newVariants });
                    }}
                    className={`border p-2 rounded w-full focus:outline-none focus:ring-1 ${
                      errors[`variant_stock_${idx}`]
                        ? "border-red-500 focus:ring-red-400"
                        : "focus:ring-blue-400"
                    }`}
                  />
                  {errors[`variant_stock_${idx}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`variant_stock_${idx}`]}
                    </p>
                  )}
                </div>

                {/* Remove button */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newVariants = [...(form.variants || [])];
                      newVariants.splice(idx, 1);
                      setForm({ ...form, variants: newVariants });
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add Variant */}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  variants: [
                    ...(form.variants || []),
                    {
                      sku: generateSKU(form.name, form.variants?.length || 0),
                      grams: 0,
                      price: 0,
                      stock: 0,
                    },
                  ],
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Variant
            </button>
          </div>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <div className="space-y-4">
            {(form.images || []).map((img, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-2">
                <label className="text-gray-700 font-medium mb-1">
                  Upload Image {idx + 1}
                </label>
                <div className="flex flex-row items-center w-full gap-2 flex-wrap">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const newImages = [...(form.images || [])];
                      newImages[idx].file = file;
                      setForm({ ...form, images: newImages });
                    }}
                    className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={img.isPrimary || false}
                      onChange={() => {
                        const newImages = (form.images || []).map((im, i) => ({
                          ...im,
                          isPrimary: i === idx,
                        }));
                        setForm({ ...form, images: newImages });
                      }}
                    />{" "}
                    Primary
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...(form.images || [])];
                      newImages.splice(idx, 1);
                      setForm({ ...form, images: newImages });
                    }}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  images: [...(form.images || []), { isPrimary: false }],
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Add Image
            </button>

            {form.images.length > 0 && (
              <button
                type="button"
                onClick={uploadImages}
                className="bg-green-600 text-white px-4 py-2 rounded mt-4 ml-2"
              >
                Upload All Images
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
            >
              Submit Product
            </button>
          )}
        </div>


      </div>
    </div>
  );
}
