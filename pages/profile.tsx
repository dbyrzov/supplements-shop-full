import { useEffect, useState } from "react";

export default function Profile() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders?userId=1") // примерен userId
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Моите поръчки</h1>
      {orders.map(o => (
        <div key={o.id} className="border p-2 rounded mb-2">
          <p>Поръчка #{o.id}</p>
          <p>Общо: {o.total}$</p>
          <p>Продукти: {o.products.map((p: any) => p.name).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
