"use client";

import { Separator } from "@/components/ui/separator";
import ProductDetail from "../../components/product-detail/product-detail";
import ProductDescription from "../../components/product-description";
import ProductAlsoLike from "../../components/prodcut-alsolike";
import { getProduct } from "@/action/product";
import Spinner from "@/components/spinner";
import { Prisma } from "@prisma/client";
import { useProductById } from "@/services/products";
import { useRouter } from "next/navigation";

export type GetProducts = Prisma.PromiseReturnType<typeof getProduct>;
interface ProductContentProps {
  productId: string;
  initialData?: GetProducts;
}

const ProductContent = ({ productId, initialData }: ProductContentProps) => {
  const { product, error, isPending } = useProductById({
    id: productId,
    initialData,
  });

  if (isPending) {
    return (
      <div className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-0">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-0">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-destructive text-lg font-semibold">載入失敗</h2>
          <p className="text-destructive">
            資料獲取失敗，請重新整理頁面或稍後再試。
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-0">
        <div className="text-center">
          <div className="text-md text-neutral-500">沒有相關商品資料</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-7xl px-6 md:mt-32 md:px-0 space-y-8">
      {/* Product Content */}
      <ProductDetail product={product} />
      <Separator className="bg-primary/20" />
      <ProductDescription description={product.description} />
      <Separator className="bg-primary/20 md:px-0" />

      {/* Related Products  */}
      <div className="flex w-full flex-col items-center">
        <h2 className="ae-section-title mb-8">你可能也喜歡</h2>
        <ProductAlsoLike
          categoryId={product.categoryId}
          productId={product.id}
        />
      </div>
    </div>
  );
};

export default ProductContent;
