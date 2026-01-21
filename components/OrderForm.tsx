import React, { useState } from "react";
import GiftSelector from "./GiftSelector";

type Product = { id: number; name: string; price: number; promoPrice?: number };
type Gift = { id: number; name: string };

type Props = {
  products: Product[];
  gifts: Gift[];
  userId: number;
};

export default function OrderForm({ products, gifts, userId }: Props) {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);

  const total = products.reduce((sum, p) => sum + (p.promoPrice || p.price), 0);

  const handleOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productIds: products.map(p => p.id),
        giftId: selectedGift,
        total,
      }),
    });
    const data = await res.json();
    alert("Поръчка изпратена!");
    console.log(data);
  };

  return (
    <div className="border p-4 rounded">
      <GiftSelector gifts={gifts} onSelect={setSelectedGift} />
      <p>Общо: {total}$</p>
      <button onClick={handleOrder} className="bg-blue-500 text-white px-4 py-2 rounded">
        Поръчай
      </button>
    </div>
  );
}
