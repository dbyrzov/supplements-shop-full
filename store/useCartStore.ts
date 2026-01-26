import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: number;             // ид на variant или product
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  flavor?: string;        // ново поле за flavor
};

type CartStore = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number, flavor?: string) => void;
  increase: (id: number, flavor?: string) => void;
  decrease: (id: number, flavor?: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        const existing = get().items.find(
          i => i.id === item.id && i.flavor === item.flavor
        );

        if (existing) {
          set({
            items: get().items.map(i =>
              i.id === item.id && i.flavor === item.flavor
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: qty }],
          });
        }
      },

      removeItem: (id, flavor) =>
        set({
          items: get().items.filter(
            i => !(i.id === id && i.flavor === flavor)
          ),
        }),

      increase: (id, flavor) =>
        set({
          items: get().items.map(i =>
            i.id === id && i.flavor === flavor
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }),

      decrease: (id, flavor) =>
        set({
          items: get().items
            .map(i =>
              i.id === id && i.flavor === flavor
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter(i => i.quantity > 0),
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
