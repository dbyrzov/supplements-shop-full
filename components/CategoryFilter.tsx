import React from "react";

type Props = {
  categories: { id: number; name: string }[];
  onSelect: (category: string) => void;
};

export default function CategoryFilter({ categories, onSelect }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => onSelect("")}>Всички</button>
      {categories.map(c => (
        <button key={c.id} onClick={() => onSelect(c.name)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
