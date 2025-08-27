"use client";

import { useMemo, memo } from "react";
import { ProductWithCategory } from "@/types/product/product";
import ProductItem from "@/modules/product/components/product-item";

interface CategoryProductsProps {
  allProducts: ProductWithCategory[];
  isFetching?: boolean;
}

// 性能優化: 使用 memo 避免不必要的重新渲染
const CategoryProducts = memo(function CategoryProducts({
  allProducts,
  isFetching = false,
}: CategoryProductsProps) {
  // 性能優化: 緩存空狀態組件
  const emptyState = useMemo(() => (
    <div className="py-12 text-center">
      <div className="mb-4 text-gray-400">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m0 0l-2-2m2 2l2-2m0 0l2-2"
          />
        </svg>
      </div>
      <p className="text-lg text-gray-500">此分類目前無商品</p>
      <p className="mt-2 text-sm text-gray-400">請嘗試其他篩選條件</p>
    </div>
  ), []);

  return (
    <div className="mt-4 mb-32 flex w-full justify-center">
      <main className="max-w-7xl flex-1">
        <div
          className={`transition-all duration-300 ${
            isFetching ? "pointer-events-none opacity-75" : "opacity-100"
          }`}
        >
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 lg:grid-cols-4">
              {allProducts.map((product) => (
                <ProductItem 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          ) : (
            emptyState
          )}
        </div>
      </main>
    </div>
  );
});

export default CategoryProducts;
