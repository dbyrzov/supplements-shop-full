// types/product.ts
import {
  Brand as PrismaBrand,
  Category as PrismaCategory,
  Subcategory as PrismaSubcategory,
  ProductImage as PrismaProductImage,
  ProductVariant as PrismaProductVariant,
  ProductTag as PrismaProductTag,
  Ingredient as PrismaIngredient,
  NutritionProfile as PrismaNutritionProfile,
  Flavor as PrismaFlavor,
} from "@prisma/client";

// -----------------------------
// Variant с включен Flavor
// -----------------------------
export type ProductVariantWithFlavor = PrismaProductVariant & {
  flavor?: PrismaFlavor | null;
};

// -----------------------------
// Tag с включен Tag обект
// -----------------------------
export type ProductTagWithTag = PrismaProductTag & {
  tag: {
    id: number;
    name: string;
  };
};

// -----------------------------
// Основен тип за Preview / Card / Details
// -----------------------------
export type Product = {
  id: number;
  name: string;
  description: string;
  images: PrismaProductImage[];
  brand: PrismaBrand | null;
  category: PrismaCategory | null;
  subcategory: PrismaSubcategory | null;
  rating?: number;
  stock: number;
  tags: ProductTagWithTag[];
  nutritionProfile: PrismaNutritionProfile | null;
  ingredients: PrismaIngredient[];
  variants: ProductVariantWithFlavor[];
};

// -----------------------------
// Експорт на всички помощни типове за удобство
// -----------------------------
export type Brand = PrismaBrand;
export type Category = PrismaCategory;
export type Subcategory = PrismaSubcategory;
export type ProductImage = PrismaProductImage;
export type ProductVariant = PrismaProductVariant;
export type ProductTag = PrismaProductTag;
export type Ingredient = PrismaIngredient;
export type NutritionProfile = PrismaNutritionProfile;
export type Flavor = PrismaFlavor;
