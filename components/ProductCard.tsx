"use client";

import Image from "next/image";
import Card from "./ui/card";
import { useCartStore } from "@/store/useCartStore";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  rating?: number;
  stock?: number;
  tags?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  brand,
  rating = 0,
  stock = 0,
  tags,
}: Props) {
  const addToCart = useCartStore(state => state.addItem);
  const itemInCart = useCartStore(
    state => state.items.find(i => i.id === id)
  );

  const tagList = tags ? tags.split(",").map(t => t.trim()) : [];

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      imageUrl
    });
  };

  return (
    <Card className="flex flex-col">
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] bg-gray-50">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {brand && (
          <span className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            {brand}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
          </div>
        )}

        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tagList.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* PRICE + CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-sky-700">
              €{price.toFixed(2)}
            </span>

            {stock > 0 && (
              <span className="text-xs text-green-600 font-medium">
                В наличност
              </span>
            )}
          </div>

          <button
            disabled={stock === 0}
            onClick={handleAddToCart}
            className={`
              w-full py-2.5 rounded-lg text-sm font-medium transition
              ${
                stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-sky-700 text-white hover:bg-sky-600"
              }
            `}
          >
            {stock === 0 ? "Unavailable" : itemInCart ? "Add another" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Card>
  );
}
