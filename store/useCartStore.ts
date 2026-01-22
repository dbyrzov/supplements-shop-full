import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id);

        if (existing) {
          set({
            items: get().items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (id) =>
        set({
          items: get().items.filter(i => i.id !== id),
        }),

      increase: (id) =>
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }),

      decrease: (id) =>
        set({
          items: get().items
            .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter(i => i.quantity > 0),
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),    }
  )
);
