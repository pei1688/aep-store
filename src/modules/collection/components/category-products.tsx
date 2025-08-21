"use client";

import { useMemo } from "react";
import { ProductWithCategory } from "@/types/product/product";
import ProductItem from "@/modules/product/components/product-item";
import { sortProducts } from "@/lib/filter";

interface CategoryProductsProps {
  allProducts: ProductWithCategory[];
  category: string;
  brandFilter?: string | null;
  sortBy: string;
  isFetching?: boolean;
}

export default function CategoryProducts({
  allProducts,
  category,
  brandFilter,
  sortBy,
  isFetching = false,
}: CategoryProductsProps) {
  const sortedProducts = useMemo(() => {
    const isAll = category === "全部";
    const filtered = allProducts.filter((prod) => {
      const catMatch = isAll || prod.category.name === category;
      const brandMatch = !brandFilter || prod.brand === brandFilter;
      return catMatch && brandMatch;
    });

    return sortProducts(filtered, sortBy);
  }, [allProducts, category, brandFilter, sortBy]);

  return (
    <div className="mt-4 mb-32 flex w-full justify-center">
      <main className="max-w-7xl flex-1">
        <div
          className={`transition-all duration-300 ${
            isFetching ? "pointer-events-none opacity-75" : "opacity-100"
          }`}
        >
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductItem key={`product-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-400">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          )}
        </div>
      </main>
    </div>
  );
}
