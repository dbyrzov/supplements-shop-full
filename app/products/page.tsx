"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import CategoryFilter from "../../components/CategoryFilter";
import PromoBanner from "@/components/PromoBanner";
import Breadcrumb from "@/components/Breadcrumb";
import { Product } from "@/types/products";

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Вземаме филтрите от URL-а (query param)
  const filtersFromURL = searchParams.get("category")?.split(",") || [];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data ?? []));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data ?? []));
  }, []);

  // Форматиране на продуктите за ProductCard
  const formattedProducts = products.map((p) => {
    const mainVariant = p.variants?.[0] || null;
    const tags = p.tags?.map((t) => t.tag.name) || [];

    return {
      id: p.id,
      name: p.name,
      price: mainVariant?.price || 0,
      stock: mainVariant?.stock || 0,
      images: p.images || [],
      brand: p.brand?.name,
      category: p.category?.name,
      subcategory: p.subcategory?.name,
      tags,
      rating: p.rating || 0,
      calories: p.nutritionProfile?.calories,
      protein: p.nutritionProfile?.protein,
      carbs: p.nutritionProfile?.carbs,
      fats: p.nutritionProfile?.fats,
    };
  });

  // Филтриране на продуктите
  const filteredProducts = formattedProducts
    .filter((p) =>
      filtersFromURL.length ? filtersFromURL.includes(p.category || "") : true,
    )
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleFilter = (category: string) => {
    const newFilters = filtersFromURL.includes(category)
      ? filtersFromURL.filter((f) => f !== category)
      : [...filtersFromURL, category];

    const queryString = newFilters.length
      ? `?category=${newFilters.join(",")}`
      : "";

    setCurrentPage(1);
    router.replace(`/products${queryString}`);
  };

  const removeFilter = (category: string) => {
    const newFilters = filtersFromURL.filter((f) => f !== category);
    const queryString = newFilters.length
      ? `?category=${newFilters.join(",")}`
      : "";

    router.replace(`/products${queryString}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-6">
      <PromoBanner
        message="🎉 Подарък към всяка поръчка над 20 евро!"
        message2="🎉 Безплатна доставка за поръчка над 40 евро!"
      />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Търсене на продукти..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition"
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        onSelect={toggleFilter}
        selected={filtersFromURL}
      />

      {/* Active Filters */}
      {filtersFromURL.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filtersFromURL.map((f) => (
            <div
              key={f}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium cursor-pointer hover:bg-yellow-200 transition"
              onClick={() => removeFilter(f)}
            >
              {f} <span className="font-bold">×</span>
            </div>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <p className="text-gray-500 mt-6">
          Няма продукти с тези филтри или резултати от търсенето.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`
                px-3 py-1 rounded-md border 
                ${currentPage === i + 1 ? "bg-sky-700 text-white" : "bg-white text-gray-700 border-gray-300"}
                hover:bg-sky-600 hover:text-white transition
              `}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
