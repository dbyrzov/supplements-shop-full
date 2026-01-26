"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Card from "@/components/ui/card";
import { Product } from "@/types/products";
import { ProductVariant } from "@prisma/client";

export default function ProductPage() {
  const params = useParams(); // вече не Promise
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [variant, setVariant] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  

  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data?.images?.length)
          setSelectedImage(
            data.images.find((i: any) => i.isPrimary)?.url ||
              data.images[0].url,
          );
        if (data?.variants?.length) {
          setVariant(data.variants)
          setSelectedVariant(data.variants[0]);
        }
        if (data?.variants?.[0]?.flavor?.name)
          setSelectedFlavor(data.variants[0].flavor.name);
      });
  }, [productId]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.id === selectedVariant?.id);
    if (!variant) return;
    addToCart(
      {
        id: variant.id,
        name: product.name,
        price: variant.price,
        imageUrl: selectedImage,
        flavor: selectedFlavor,
      },
      quantity,
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={"/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 rounded-lg border cursor-pointer overflow-hidden ${
                  selectedImage === img.url
                    ? "border-sky-700"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img.url)}
              >
                <Image
                  src={img.url}
                  alt={`thumb-${idx}`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: QUICK ADD PANEL */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {product.brand && (
            <div className="text-sm text-gray-500">{product.brand.name}</div>
          )}
          {product.category && product.subcategory && (
            <div className="text-sm text-gray-400">
              {product.category.name} / {product.subcategory.name}
            </div>
          )}

          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              ★{" "}
              <span className="text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
          )}

          <div className="mt-4 text-2xl font-bold text-sky-700">
            €{selectedVariant?.price?.toFixed(2)}
          </div>

          {/* Variant Dropdown */}
          {product.variants?.length && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Variant:
              </label>
              <select
                value={selectedVariant?.id || ""}
                onChange={(e) => setSelectedVariant(variant.find(v => v.id === Number(e.target.value)) ?? null )}
                className="border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.grams}g - €{v.price.toFixed(2)}{" "}
                    {v.flavor?.name ? `(${v.flavor.name})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Flavor Dropdown (optional) */}
          {product.variants?.some((v) => v.flavor) && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Flavor:
              </label>
              <select
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                className="border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                {Array.from(
                  new Set(
                    product.variants
                      .filter((v) => v.flavor)
                      .map((v) => v.flavor!.name),
                  ),
                ).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-gray-300 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`mt-4 py-3 rounded-lg text-white font-semibold transition ${
              product.stock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-600"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* FULL PRODUCT INFO */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {product.description && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </Card>
          )}

          {product.ingredients?.length && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-700">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.name} {ing.amount ? `- ${ing.amount}` : ""}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {product.tags?.length && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(
                  (pt, idx) =>
                    pt?.tag?.name && (
                      <span
                        key={idx}
                        className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full"
                      >
                        {pt.tag.name}
                      </span>
                    ),
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Nutrition Info */}
        {product.nutritionProfile && (
          <Card className="p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Nutrition Facts</h2>
            <div className="text-gray-700 space-y-1 text-sm">
              {product.nutritionProfile.calories !== undefined && (
                <div>Calories: {product.nutritionProfile.calories} kcal</div>
              )}
              {product.nutritionProfile.protein !== undefined && (
                <div>Protein: {product.nutritionProfile.protein} g</div>
              )}
              {product.nutritionProfile.carbs !== undefined && (
                <div>Carbs: {product.nutritionProfile.carbs} g</div>
              )}
              {product.nutritionProfile.fats !== undefined && (
                <div>Fats: {product.nutritionProfile.fats} g</div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
