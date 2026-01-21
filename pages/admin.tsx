import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, price: parseFloat(price), categoryId: 1 }),
    });
    const data = await res.json();
    alert("Продукт добавен!");
    console.log(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <input placeholder="Име" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Описание" value={desc} onChange={e => setDesc(e.target.value)} />
      <input placeholder="Цена" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">
        Добави продукт
      </button>
    </div>
  );
}
