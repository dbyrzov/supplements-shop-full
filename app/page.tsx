import PromoBanner from "../components/PromoBanner";
import ProductsGrid from "@/components/ProductGrid";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Promo */}
      <PromoBanner message="🎉 Всички протеини с -20% до края на седмицата!"/>

      {/* Section title */}
      <h1 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">
        Топ продукти
      </h1>

      {/* Products grid */}
      <ProductsGrid products={products} />
    </main>
  );
}
