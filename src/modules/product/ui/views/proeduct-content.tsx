"use client";

import { Separator } from "@/components/ui/separator";
import ProductDetail from "../../components/product-detail/product-detail";
import ProductDescription from "../../components/product-description";
import ProductAlsoLike from "../../components/prodcut-alsolike";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/action/product";
import Spinner from "@/components/spinner";
import { Prisma } from "@prisma/client";

export type GetProducts = Prisma.PromiseReturnType<typeof getProduct>;
interface ProductContentProps {
  productId: string;
  initialData?: GetProducts;
}

const ProductContent = ({ productId, initialData }: ProductContentProps) => {
  const {
    data: product,
    error,
    isPending,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    initialData,
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

  return (
    <>
      <ProductDetail product={product} />
      <Separator className="bg-primary/20 my-8" />
      <ProductDescription description={product.description} />
      <Separator className="bg-primary/20 my-8 md:px-0" />
      <div className="flex w-full flex-col items-center">
        <h2 className="ae-recommendations-title py-12">你可能也喜歡</h2>
        <ProductAlsoLike
          categoryId={product.categoryId}
          productId={product.id}
        />
      </div>
    </>
  );
};

export default ProductContent;
