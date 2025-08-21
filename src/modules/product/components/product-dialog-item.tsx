"use client";
import ProductDialogContent from "./product-dialog-content";
import { ProductWithCategory } from "@/types/product/product";


const ProductDialogItem = ({ product }: { product: ProductWithCategory }) => {
  return <ProductDialogContent product={product} />;
};

export default ProductDialogItem;
