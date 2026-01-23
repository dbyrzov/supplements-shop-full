"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import CategoryFilter from "../../components/CategoryFilter";

const ITEMS_PER_PAGE = 6; // брой продукти на страница

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then((data) => setProducts(data ?? []));

    fetch("/api/categories")
      .then(res => res.json())
      .then((data) => setCategories(data ?? []));
  }, []);

  // филтриране по категория и търсене
  const filteredProducts = products
    .filter(p =>
      filters.length ? filters.includes(p.category?.name) : true
    )
    .filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleFilter = (category: string) => {
    setCurrentPage(1); // reset page
    setFilters(prev =>
      prev.includes(category)
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  const removeFilter = (category: string) => {
    setFilters(prev => prev.filter(f => f !== category));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Продукти</h1>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset page
          }}
          placeholder="Търсене на продукти..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition"
        />
      </div>

      {/* Category Filter Buttons */}
      <CategoryFilter categories={categories} onSelect={toggleFilter} selected={filters} />

      {/* Active Filter Chips */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
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
        <p className="text-gray-500 mt-6">Няма продукти с тези филтри или резултати от търсенето.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map(p => (
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
                ${currentPage === i + 1 ? 'bg-sky-700 text-white' : 'bg-white text-gray-700 border-gray-300'}
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
