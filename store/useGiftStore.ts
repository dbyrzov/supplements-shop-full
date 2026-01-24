import { create } from 'zustand';

export interface Gift {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface GiftState {
  gifts: Gift[];
  selectedGift: Gift | null;

  setGifts: (gifts: Gift[]) => void;
  selectGift: (gift: Gift | null) => void;
  resetGift: () => void;
}

export const useGiftStore = create<GiftState>((set) => ({
  gifts: [],
  selectedGift: null,

  setGifts: (gifts) => set({ gifts }),
  selectGift: (gift) => set({ selectedGift: gift }),
  resetGift: () => set({ selectedGift: null }),
}));
