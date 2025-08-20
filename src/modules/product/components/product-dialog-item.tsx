"use client";
import ProductDialogContent from "./product-dialog-content";
import { useProductById } from "@/services/products";

const ProductDialogItem = ({ id }: { id: string }) => {
  const { product, error, isPending } = useProductById({ id });

  if (isPending) {
    return null;
  }

  if (error) {
    return <div>資料獲取失敗</div>;
  }

  if (!product) {
    return <div className="text-md text-neutral-500">沒有相關商品資料</div>;
  }
  return <ProductDialogContent product={product} />;
};

export default ProductDialogItem;
