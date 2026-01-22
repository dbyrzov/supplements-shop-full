// components/ProductsGrid.tsx
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

type Props = {
  products: Product[];
};

export default function ProductsGrid({ products }: Props) {
  return (
    // <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="max-w-7xl mx-auto py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
