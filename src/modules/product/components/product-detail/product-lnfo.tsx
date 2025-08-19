import { ProductDetailProps } from "@/types/product/product-detail";

interface ProductInfoProps {
  product: ProductDetailProps["product"];
  finalPrice: number;
}

export const ProductInfo = ({ product, finalPrice }: ProductInfoProps) => {
  // 計算折扣後價格
  const discountAmount = product.discountPercentage || 0;
  const salePrice = finalPrice - (finalPrice * discountAmount) / 100;

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <h2 className="text-lg text-gray-600">{product.category?.name || ""}</h2>

      {/* 價格顯示區域 */}
      <div className="flex flex-col space-y-2">
        {product.isOnSale ? (
          <>
            {/* 價格組合 */}
            <div className="flex items-center space-x-3">
              {/* 特價價格 */}
              <span className="text-destructive text-3xl font-bold">
                NT${salePrice.toLocaleString()}
              </span>

              {/* 原價（劃線） */}
              <span className="text-xl text-gray-500 line-through">
                NT${finalPrice.toLocaleString()}
              </span>

              {/* 折扣百分比 */}
              {product.discountPercentage && (
                <span className="text-destructive rounded bg-red-100 px-2 py-1 text-sm font-semibold">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>
          </>
        ) : (
          /* 一般價格 */
          <div className="text-3xl font-bold text-gray-900">
            NT${finalPrice.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};
