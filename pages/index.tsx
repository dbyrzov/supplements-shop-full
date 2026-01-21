import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';


export default function Home() {
const [products, setProducts] = useState<any[]>([]);
const [promo, setPromo] = useState('');


useEffect(() => {
fetch('/api/products').then(res => res.json()).then(setProducts);
setPromo('🎉 Всички протеини с -20% до края на седмицата!');
}, []);


return (
<div className="p-4">
<PromoBanner message={promo} />
<h1 className="text-2xl font-bold mb-4">Топ продукти</h1>
<div className="grid md:grid-cols-3 gap-4">
{products.map(p => <ProductCard key={p.id} {...p} />)}
</div>
</div>
);
}