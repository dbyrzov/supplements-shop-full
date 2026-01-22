import Image from "next/image";

type Props = {
  name: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  rating?: number;
  stock?: number;
  tags?: string;
  onAddToCart?: () => void;
};

export default function ProductCard({
  name,
  price,
  imageUrl,
  brand,
  rating = 0,
  stock = 0,
  tags,
  onAddToCart,
}: Props) {
  const tagList = tags ? tags.split(",").map(t => t.trim()) : [];

  return (
    <div
      className="
        group
        bg-white
        border border-gray-200
        rounded-xl
        overflow-hidden
        transition-all duration-300
        hover:shadow-xl
        hover:border-sky-300
        flex flex-col
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] bg-gray-50">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* STOCK BADGE */}
        {stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {/* BRAND */}
        {brand && (
          <span className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            {brand}
          </span>
        )}

        {/* NAME */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {name}
        </h3>

        {/* RATING */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* TAGS */}
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

        {/* PRICE */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-sky-700">
              ${price.toFixed(2)}
            </span>
            {stock > 0 && (
              <span className="text-xs text-green-600 font-medium">
                In stock
              </span>
            )}
          </div>

          {/* CTA */}
          <button
            disabled={stock === 0}
            onClick={onAddToCart}
            className={`
              w-full py-2.5 rounded-lg text-sm font-medium transition
              ${
                stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-sky-700 text-white hover:bg-sky-600"
              }
            `}
          >
            {stock === 0 ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
