import { Category, Collection, Product, ProductVariant } from "@prisma/client";

// ProductWithCategory
export type ProductWithCategory = Product & {
  category: Category;
  variants?: ProductVariant[];
  collection?: Collection;
};

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  variantText?: string;
}
