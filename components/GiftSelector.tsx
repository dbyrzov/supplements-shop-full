import React from "react";

type Props = {
  gifts: { id: number; name: string }[];
  onSelect: (id: number | null) => void;
};

export default function GiftSelector({ gifts, onSelect }: Props) {
  if (!gifts || gifts.length === 0) return null;

  return (
    <div className="mb-4">
      <h4>Избери подарък:</h4>
      <select onChange={e => onSelect(Number(e.target.value) || null)}>
        <option value="">Без подарък</option>
        {gifts.map(g => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
