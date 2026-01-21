import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);

    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const filteredProducts = filter
    ? products.filter(p => p.category?.name === filter)
    : products;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Продукти</h1>
      <CategoryFilter categories={categories} onSelect={setFilter} />
      {filteredProducts.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
