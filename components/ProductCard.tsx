import React from "react";

type Props = {
  id: number;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
};

export default function ProductCard({ name, description, price, promoPrice }: Props) {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h3 className="font-bold">{name}</h3>
      <p>{description}</p>
      <p>
        Цена: {promoPrice ? <span className="text-red-500">{promoPrice}$</span> : price + "$"}
        {promoPrice && <span className="line-through ml-2">{price}$</span>}
      </p>
    </div>
  );
}
