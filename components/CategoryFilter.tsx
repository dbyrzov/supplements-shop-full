import React from "react";

type Props = {
  categories: { id: number; name: string }[];
  onSelect: (category: string) => void;
  selected?: string[];
};

export default function CategoryFilter({ categories, onSelect, selected = [] }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map(c => {
        const isActive = selected.includes(c.name);
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.name)}
            className={`
              px-4 py-2 rounded border text-gray-700 
              ${isActive ? 'bg-yellow-300' : 'bg-white border-gray-300'}
              hover:bg-yellow-300
              transition-colors duration-200 focus:outline-none
            `}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
