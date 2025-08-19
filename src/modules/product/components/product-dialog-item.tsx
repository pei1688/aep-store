"use client";
import { getProduct } from "@/action/product";
import Spinner from "@/components/spinner";
import ProductDialogContent from "./product-dialog-content";
import { useQuery } from "@tanstack/react-query";

const ProductDialogItem = ({ id }: { id: string }) => {
  const {
    data: product,
    error,
    isPending,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  if (isPending) {
    return <Spinner />;
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
